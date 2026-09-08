---
title: 'A thread map for FastAPI, asyncio, and blocking S3 uploads'
summary: 'Follow one upload request across FastAPI’s event loop, a dedicated asyncio worker loop, and the threads that run blocking boto3 calls.'
createdAt: 2026-09-08 12:31:45 +0800
publishedAt: 2026-09-08
categories: [python, fastapi, asyncio, aws]
---

I was reading an upload endpoint that looked roughly like this:

```python
import asyncio
import threading
from concurrent.futures import Future

from boto3 import client as boto3_client
from botocore.exceptions import ClientError
from fastapi import FastAPI, HTTPException, status
from pydantic import BaseModel

app = FastAPI()
s3_client = boto3_client('s3')


class S3UploadPayload(BaseModel):
    bucket: str
    key: str
    content: bytes
    content_type: str


def blocking_s3_call(bucket: str, key: str, data: bytes, content_type: str) -> str:
    response = s3_client.put_object(
        Bucket=bucket,
        Key=key,
        Body=data,
        ContentType=content_type,
    )
    return response['ETag']


async def async_s3_uploader_task(
    bucket: str,
    key: str,
    data: bytes,
    content_type: str,
) -> str:
    try:
        return await asyncio.to_thread(
            blocking_s3_call,
            bucket,
            key,
            data,
            content_type,
        )
    except ClientError as error:
        raise RuntimeError(f'S3 upload failed: {error}') from error


class BackgroundLoopWorker:
    def __init__(self) -> None:
        self.loop = asyncio.new_event_loop()
        self.thread = threading.Thread(
            target=self._run_loop_forever,
            name='S3AsyncWorkerThread',
            daemon=True,
        )

    def start(self) -> None:
        self.thread.start()

    def _run_loop_forever(self) -> None:
        asyncio.set_event_loop(self.loop)
        self.loop.run_forever()


aws_worker = BackgroundLoopWorker()
aws_worker.start()


@app.post('/upload', status_code=status.HTTP_201_CREATED)
async def upload_document(payload: S3UploadPayload) -> dict[str, str]:
    future: Future[str] = asyncio.run_coroutine_threadsafe(
        async_s3_uploader_task(
            payload.bucket,
            payload.key,
            payload.content,
            payload.content_type,
        ),
        aws_worker.loop,
    )

    try:
        etag = await asyncio.wrap_future(future)
    except RuntimeError as error:
        raise HTTPException(status_code=500, detail=str(error)) from error

    return {'etag': etag}
```

There is enough concurrency vocabulary in this example to make it feel more complicated than it is. The useful starting point is that an event loop is not a thread.

A thread is an operating-system execution lane. An asyncio event loop is a Python scheduler that runs callbacks and coroutine tasks on one thread at a time. Tasks can interleave when one reaches `await` and yields, but the event loop does not run those Python tasks in parallel on a single thread.

## The thread map

One request touches three places:

```text
                           one Python process

┌──────────────────────────────────────────────────────────────────────┐
│ Thread 1: FastAPI / Uvicorn thread                                    │
│                                                                      │
│  FastAPI event loop                                                   │
│                                                                      │
│  upload_document(payload)                                            │
│       │                                                              │
│       ├─ asyncio.run_coroutine_threadsafe(coro, aws_worker.loop) ───┐│
│       │                                                              ││
│       ├─ receives concurrent.futures.Future immediately             ││
│       │                                                              ││
│       └─ await asyncio.wrap_future(future)                           ││
│          The request coroutine waits without blocking this loop.     ││
└──────────────────────────────────────────────────────────────────────┘│
                                                                         │
                                                                         ▼
┌──────────────────────────────────────────────────────────────────────┐
│ Thread 2: S3AsyncWorkerThread                                         │
│                                                                      │
│  aws_worker.loop                                                      │
│                                                                      │
│  loop.run_forever()                                                   │
│       │                                                              │
│       └─ async_s3_uploader_task(...)                                  │
│            │                                                         │
│            └─ await asyncio.to_thread(blocking_s3_call, ...) ──────┐│
│               This coroutine yields while the S3 call runs elsewhere.││
└──────────────────────────────────────────────────────────────────────┘│
                                                                         │
                                                                         ▼
┌──────────────────────────────────────────────────────────────────────┐
│ Thread 3 and beyond: ThreadPoolExecutor workers                       │
│                                                                      │
│  blocking_s3_call(...)                                                │
│       │                                                              │
│       └─ s3_client.put_object(...)                                    │
│          Blocks while it waits for the network and S3.               │
│                                                                      │
│  ETag or exception ───────► worker-loop task ───────► HTTP route     │
└──────────────────────────────────────────────────────────────────────┘
```

`Thread 3 and beyond` is a pool, not one permanent S3 thread. `asyncio.to_thread()` submits work to the event loop's default `ThreadPoolExecutor`, which may reuse existing workers or run several calls concurrently.

## What each handoff does

### `run_coroutine_threadsafe()` moves work to another loop

The FastAPI route runs on FastAPI's event loop. This line submits a coroutine to the loop running in `S3AsyncWorkerThread`:

```python
future = asyncio.run_coroutine_threadsafe(coro, aws_worker.loop)
```

It does not execute the coroutine in the FastAPI thread. It returns a `concurrent.futures.Future`, which represents work happening in another thread.

That cross-thread part matters. `asyncio.create_task()` would create a task on the current loop. `run_coroutine_threadsafe()` is specifically for safely scheduling work from one thread onto an event loop owned by another.

### `asyncio.to_thread()` keeps blocking boto3 out of the event loop

`boto3` is synchronous. During this call:

```python
s3_client.put_object(...)
```

the thread that calls it waits for the network request to complete. Calling it directly inside `async_s3_uploader_task()` would block the worker event loop and prevent it from running any other ready task.

This is why the coroutine uses:

```python
etag = await asyncio.to_thread(blocking_s3_call, ...)
```

`to_thread()` runs the regular blocking function in an executor worker. The coroutine pauses at `await`, freeing the worker event loop to run other ready coroutines. It does not turn boto3 into an async client. It just puts the blocking wait in a thread where it cannot stall the event loop.

### `wrap_future()` brings the result back to FastAPI

The route receives a `concurrent.futures.Future`, not the asyncio future type attached to FastAPI's loop. `asyncio.wrap_future()` bridges the two:

```python
etag = await asyncio.wrap_future(future)
```

While that await is pending, FastAPI's event loop can handle other requests. Once the S3 task resolves or raises, the route resumes and returns its response.

## This is not fire-and-forget

The code is asynchronous from the web server's perspective because it does not block FastAPI's event-loop thread while S3 is running. The HTTP client still waits for the upload to finish, though.

The response only happens after this line completes:

```python
etag = await asyncio.wrap_future(future)
```

Calling this endpoint "background" can be misleading. It is an async request that waits for confirmed completion. A real submit-and-return workflow would usually return `202 Accepted` with a job ID, then store and process the upload through durable infrastructure.

## Is the dedicated worker loop necessary?

Probably not for this endpoint.

If the only goal is to keep a blocking boto3 call off FastAPI's loop, the route can use `to_thread()` directly:

```python
@app.post('/upload', status_code=status.HTTP_201_CREATED)
async def upload_document(payload: S3UploadPayload) -> dict[str, str]:
    try:
        etag = await asyncio.to_thread(
            blocking_s3_call,
            payload.bucket,
            payload.key,
            payload.content,
            payload.content_type,
        )
    except ClientError as error:
        raise HTTPException(status_code=500, detail=f'S3 upload failed: {error}') from error

    return {'etag': etag}
```

That version has one event loop, FastAPI's, plus executor workers for the blocking S3 calls. There is no extra thread, no second event loop, and no cross-thread future to bridge.

A dedicated loop can still make sense when it owns a real execution domain: a queue consumer, isolated loop-wide state, a specialised client lifecycle, or scheduling that should be separate from web requests. It is not needed merely because a library is blocking.

## Edges worth deciding deliberately

The simple diagram leaves out the production details that usually cause trouble:

- **Backpressure:** each request can add executor work. Under load, use a semaphore, bounded executor, or queue so uploads cannot pile up without limit.
- **Cancellation:** cancelling the HTTP request can cancel the asyncio wait, but it will not reliably stop a thread already inside a synchronous boto3 request. Timeouts are still important.
- **Shutdown:** `loop.stop()` alone can abandon pending tasks. Stop taking work, then wait for or cancel outstanding tasks, shut down the executor, and close the loop.
- **Failures:** preserve the original exception and make the HTTP response reflect an upload failure, not a vague scheduling failure.

The main mental model is small enough to remember: event loops schedule async tasks on threads; threads run blocking work when the code cannot yield. Once those are separated, the arrows in the upload path stop being mysterious.

## References

- [Python asyncio event loop documentation](https://docs.python.org/3/library/asyncio-eventloop.html)
- [Python `asyncio.to_thread`](https://docs.python.org/3/library/asyncio-task.html#asyncio.to_thread)
- [Python `asyncio.run_coroutine_threadsafe`](https://docs.python.org/3/library/asyncio-task.html#asyncio.run_coroutine_threadsafe)
- [FastAPI async documentation](https://fastapi.tiangolo.com/async/)
