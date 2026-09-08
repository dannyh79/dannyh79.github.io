---
title: 'Demystifying Threading and Event Loop Models in Python'
summary: 'Trace one S3 upload from a FastAPI request through an asyncio worker loop and a thread-pool call to boto3.'
createdAt: 2026-09-08 12:31:45 +0800
publishedAt: 2026-09-08
categories: [python, fastapi, asyncio, aws]
---

Had to read an upload path where one request crossed two event loops and then
landed in a normal thread for `boto3`. The code was valid, but the names made
it easy to blur together threads, event loops, tasks, and futures.

## TL;DR

- `asyncio.new_event_loop()`: creates the worker's event-loop object; it does
  not start a thread or run work by itself.
- `threading.Thread(...)`: creates the OS thread that owns and runs the worker
  loop.
- `asyncio.run_coroutine_threadsafe()`: submits the upload coroutine from
  FastAPI's thread to that worker loop and returns a cross-thread future.
- `asyncio.to_thread()`: runs blocking `boto3.put_object()` in an executor
  worker so the event loop can keep scheduling other tasks.
- `asyncio.wrap_future()`: lets FastAPI await the cross-thread result without
  blocking its own event loop.
- For this upload path, start with `asyncio.to_thread()` directly in the route.
  Add a dedicated worker loop only when it owns a real separate workload.

The useful distinction is this: an event loop is not a thread. It runs tasks
and callbacks; it does not replace the OS thread that runs it.

- A **thread** is an operating-system execution lane.
- An **event loop** schedules callbacks and asyncio tasks on a thread.
- A **task** is a coroutine scheduled by an event loop.
- A **future** represents a result that will arrive later.

The upload route had three execution layers.

```text
                           one Python process

┌──────────────────────────────────────────────────────────────────────┐
│ FastAPI / Uvicorn event-loop thread                                  │
│                                                                      │
│  upload_document(payload)                                            │
│       │                                                              │
│       ├─ run_coroutine_threadsafe(coro, aws_worker.loop) ───────────┐│
│       └─ await wrap_future(future)                                  ││
│          The request waits without blocking FastAPI's event loop.   ││
└──────────────────────────────────────────────────────────────────────┘│
                                                                         │
                                                                         ▼
┌──────────────────────────────────────────────────────────────────────┐
│ S3AsyncWorkerThread                                                   │
│                                                                      │
│  aws_worker.loop                                                      │
│       └─ async_s3_uploader_task(...)                                  │
│            └─ await asyncio.to_thread(blocking_s3_call, ...) ──────┐│
└──────────────────────────────────────────────────────────────────────┘│
                                                                         │
                                                                         ▼
┌──────────────────────────────────────────────────────────────────────┐
│ Default ThreadPoolExecutor worker(s)                                  │
│                                                                      │
│  blocking_s3_call(...)                                                │
│       └─ s3_client.put_object(...)                                    │
│          Waits for the network and S3 response.                      │
│                                                                      │
│  ETag or error ───────► worker-loop task ───────► HTTP route         │
└──────────────────────────────────────────────────────────────────────┘
```

## The Worker Loop Has a Thread of Its Own

The worker is created before the server starts accepting uploads:

```python
class BackgroundLoopWorker:
    def __init__(self) -> None:
        self.loop = asyncio.new_event_loop()
        self.thread = threading.Thread(
            target=self._run_loop_forever,
            name='S3AsyncWorkerThread',
            daemon=True,
        )

    def _run_loop_forever(self) -> None:
        asyncio.set_event_loop(self.loop)
        self.loop.run_forever()
```

`asyncio.new_event_loop()` creates a loop object. Nothing is running yet.
`threading.Thread(...)` creates the OS thread. When that thread starts,
`set_event_loop()` makes the loop current in that thread and `run_forever()`
starts processing work submitted to it.

At that point the process has two loops on two separate threads:

```text
FastAPI / Uvicorn thread
└─ FastAPI event loop

S3AsyncWorkerThread
└─ aws_worker.loop
```

An event loop can switch between ready asyncio tasks when one reaches `await`.
That is concurrency, not parallel execution of Python code on the same thread.
The extra OS threads are what provide separate places for blocking work to run.

## The Request Crosses to the Worker Loop

The route schedules the uploader coroutine on the worker loop:

```python
future = asyncio.run_coroutine_threadsafe(
    async_s3_uploader_task(
        payload.bucket,
        payload.key,
        payload.content,
        payload.content_type,
    ),
    aws_worker.loop,
)
```

`asyncio.run_coroutine_threadsafe()` is the cross-thread handoff. It does not
run the uploader in FastAPI's thread. It gives the worker loop a coroutine to
schedule and returns a `concurrent.futures.Future` immediately.

That is different from `asyncio.create_task()`, which schedules work on the
currently running loop. Here the route explicitly wants another loop owned by
another thread.

## Boto3 Still Blocks

Inside the worker-loop coroutine, the S3 call is handed to an executor thread:

```python
async def async_s3_uploader_task(...) -> str:
    return await asyncio.to_thread(
        blocking_s3_call,
        bucket,
        key,
        data,
        content_type,
    )


def blocking_s3_call(...) -> str:
    response = s3_client.put_object(...)
    return response['ETag']
```

`boto3` exposes `put_object()` as a regular client call. Calling it directly
from the coroutine would hold the worker event-loop thread until S3 replies.
`asyncio.to_thread()` runs a blocking function in a separate thread, so this
code sends `blocking_s3_call()` to the loop's default `ThreadPoolExecutor`.

The uploader task pauses at `await`; the worker loop can run another ready task;
and an executor worker waits for S3. `to_thread()` does not make boto3 an async
client. It moves the blocking wait away from the event loop.

The executor is a pool, not one permanent S3 thread. Multiple uploads may reuse
workers or cause several workers to run, subject to the executor's capacity.

## The Result Comes Back to FastAPI

The route receives a `concurrent.futures.Future`, which belongs to the
cross-thread API. FastAPI needs an awaitable attached to its own loop:

```python
etag = await asyncio.wrap_future(future)
return {'etag': etag}
```

`asyncio.wrap_future()` provides that bridge. While the request coroutine waits,
FastAPI's event loop can serve other ready requests. When the uploader returns
an ETag or raises, the HTTP route resumes.

## This Is Not Fire-and-Forget

The request is non-blocking for FastAPI's event loop, but the client still waits
for the upload to finish. The route cannot return until this completes:

```python
etag = await asyncio.wrap_future(future)
```

That distinction matters for API design. A true background submission normally
returns `202 Accepted` with a job ID, stores the work durably, and lets another
worker process it after the HTTP response is gone.

## The Second Loop Is Probably Unnecessary Here

If the only reason for `S3AsyncWorkerThread` is to keep a blocking boto3 call
off FastAPI's event loop, the route can use `to_thread()` directly:

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

This version keeps FastAPI responsive during the blocking call without adding a
second event loop, an extra thread, or a cross-thread future. I would start
there.

A dedicated loop can still be justified when it owns a separate execution
domain: a queue consumer, long-lived loop-local state, or scheduling that must
not compete with request handling. Blocking boto3 alone is not enough reason.

## Things That Still Need a Decision

- **Backpressure:** each request can add executor work. Bound concurrency with a
  semaphore, bounded executor, or queue before uploads pile up.
- **Cancellation:** cancelling the HTTP request can cancel the asyncio wait. It
  does not reliably stop a synchronous boto3 call already running in a thread.
  Set sensible network timeouts.
- **Shutdown:** stopping a loop is not a full shutdown plan. Stop accepting new
  work, await or cancel outstanding tasks, shut down the executor, then close
  the loop.
- **Errors:** preserve the S3 exception and return an upload failure, not a
  generic scheduling error.

The thread map is enough to reason about the path: FastAPI submits to the
worker loop; the worker loop submits blocking boto3 work to an executor; the
result travels back through the two futures. Once those boundaries are clear,
the extra machinery is easier to question.

## Refs

- [Python Event Loop Documentation](https://docs.python.org/3/library/asyncio-eventloop.html)
- [Python `asyncio.to_thread`](https://docs.python.org/3/library/asyncio-task.html#asyncio.to_thread)
- [Python `asyncio.run_coroutine_threadsafe`](https://docs.python.org/3/library/asyncio-task.html#asyncio.run_coroutine_threadsafe)
- [Boto3 `put_object`](https://boto3.amazonaws.com/v1/documentation/api/latest/reference/services/s3/client/put_object.html)
- [FastAPI Async Documentation](https://fastapi.tiangolo.com/async/)
