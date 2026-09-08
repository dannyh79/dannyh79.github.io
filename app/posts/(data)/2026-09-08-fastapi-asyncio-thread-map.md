---
title: 'Demystifying Threading and Event Loop Models in Python'
summary: 'A practical guide to Python threading, asyncio event loops, and blocking I/O.'
createdAt: 2026-09-08 12:31:45 +0800
publishedAt: 2026-09-08
categories: [python, fastapi, asyncio, aws]
---

`boto3` is synchronous, but Amazon Bedrock's `converse_stream()` returns an
`EventStream` that yields response events over time. A FastAPI app needs to
read that blocking stream without freezing its event loop, then send each text
delta back to the HTTP client as it arrives.

## TL;DR

- `BedrockRuntime.Client.converse_stream()`: starts a model response stream; the
  returned `EventStream` yields events such as `contentBlockDelta`.
- `ThreadPoolExecutor`: runs the blocking Bedrock request and its event iterator
  outside FastAPI's event-loop thread; configure its process-wide capacity with
  `APP_MAX_WORKERS`.
- `loop.run_in_executor()`: sends that blocking stream pump to a specific,
  bounded executor.
- `asyncio.Queue`: transfers deltas from the executor thread to the async HTTP
  response and can provide backpressure.
- `asyncio.run_coroutine_threadsafe()`: safely puts an event onto FastAPI's
  queue from the executor thread.
- `asyncio.to_thread()`: uses the event loop's default executor. Use it for
  small isolated calls; use an explicit `ThreadPoolExecutor` when Bedrock needs
  an independent concurrency budget.

## The Execution Map

The event loop is not a thread. It schedules asyncio tasks on a thread. A
`ThreadPoolExecutor` supplies extra OS threads for code that cannot yield, such
as the synchronous `boto3` client and its event iterator.

```text
FastAPI / Uvicorn event-loop thread
│
├─ starts loop.run_in_executor(app_executor, pump_bedrock_stream, ...)
│
└─ awaits queue.get() and yields each text delta to StreamingResponse
                         ▲
                         │ run_coroutine_threadsafe(queue.put(text), loop)
                         │
ThreadPoolExecutor worker (bedrock-stream_0 ... bedrock-stream_N)
│
├─ response = bedrock_runtime.converse_stream(...)
└─ for event in response['stream']:
     read contentBlockDelta.delta.text
```

The executor thread blocks while it waits for Bedrock. The FastAPI event-loop
thread does not. It waits asynchronously for queue items and can still run
other requests.

## Choose the Execution Model

Multiple OS threads are needed only because the Boto3 Bedrock client is
synchronous. An event loop can switch tasks only when they reach `await`; it
cannot preempt a thread that is blocked inside `response['stream']` waiting for
the next network event.

```text
Does the library expose an async API that you can await?
│
├─ Yes → await it on the FastAPI event loop.
│         One event loop can serve many concurrent I/O waits.
│
└─ No → Is the blocking work called from an async route or dependency?
         │
         ├─ No → a normal FastAPI def route can use FastAPI's threadpool.
         │
         └─ Yes → Is it short, isolated blocking work?
                  │
                  ├─ Yes → await asyncio.to_thread(blocking_call, ...).
                  │         It uses the loop's default ThreadPoolExecutor.
                  │
                  └─ No → Is it long-lived, streamed, or capacity-sensitive?
                           │
                           ├─ Yes → use a dedicated ThreadPoolExecutor and
                           │         loop.run_in_executor(...).
                           │         Bridge a synchronous stream with a queue.
                           │
                           └─ No → keep the design simple and use to_thread().

Is the work CPU-bound rather than blocked on I/O?
│
└─ Yes → use a process pool or durable worker system instead of threads.
```

Threads do not make the event loop faster. They give blocking I/O somewhere
else to wait. In this example, one thread waits on Bedrock while the FastAPI
thread keeps handling queue operations and other HTTP requests. If an async
Bedrock client existed for the same API, the executor layer would not be needed.

## The Bedrock Call Is a Blocking Stream

The [Boto3 `converse_stream()` API](https://boto3.amazonaws.com/v1/documentation/api/latest/reference/services/bedrock-runtime/client/converse_stream.html)
sends messages to a Bedrock model and returns an `EventStream`. Each stream
event has one top-level key. For text output, the event to look for is
`contentBlockDelta` and its `delta.text` field.

```python
response = bedrock_runtime.converse_stream(
    modelId=model_id,
    messages=[
        {
            'role': 'user',
            'content': [{'text': prompt}],
        },
    ],
)

for event in response['stream']:
    delta = event.get('contentBlockDelta', {}).get('delta', {})
    text = delta.get('text')
    if text:
        print(text, end='', flush=True)
```

That loop is ordinary synchronous Python. Putting it directly in an `async def`
FastAPI route would hold the event-loop thread for the lifetime of the model
response. Wrapping only the initial `converse_stream()` call is not enough; the
subsequent iteration over `response['stream']` can block too.

## Use a Dedicated ThreadPoolExecutor for Bedrock Streams

`asyncio.to_thread()` is useful when the default executor is sufficient:

```python
text = await asyncio.to_thread(blocking_bedrock_call, prompt)
```

Streaming is different. It is long-lived, needs a bounded concurrency budget,
and should not compete with unrelated blocking work. Give it a dedicated pool
whose size comes from a generic application setting:

```python
import os
from concurrent.futures import ThreadPoolExecutor

app_default_max_workers = min(32, (os.process_cpu_count() or 1) + 4)
app_executor = ThreadPoolExecutor(
    max_workers=int(os.environ.get('APP_MAX_WORKERS', app_default_max_workers)),
    thread_name_prefix='bedrock-stream',
)
```

`max_workers` is per Python process. Four Uvicorn workers with
`APP_MAX_WORKERS=4` can start up to sixteen executor threads before replicas
are counted.

### Suggested Starting Configurations

For a container with one application process and a CPU limit, start with four
executor workers:

```yaml
# Kubernetes Deployment, Docker Compose, or equivalent environment config
env:
  - name: APP_MAX_WORKERS
    value: '4'
```

For a raw host running one application process without a tight CPU quota, start
with eight:

```bash
APP_MAX_WORKERS=8 uvicorn app:app
```

These are application starting points, not Bedrock quotas. Each active stream
holds one executor worker until the model finishes. Set the value from the
number of concurrent streams the process may own, then load-test against model
quotas, request latency, and your retry policy.

Python already has a useful default heuristic. In Python 3.13+, omitting
`max_workers` uses
`min(32, (os.process_cpu_count() or 1) + 4)`. The
[official documentation](https://docs.python.org/3/library/concurrent.futures.html#concurrent.futures.ThreadPoolExecutor)
says this preserves at least five workers for I/O-bound work while avoiding an
unbounded implicit pool on many-core hosts. Use that default when the executor
is truly general-purpose; set `APP_MAX_WORKERS` when the application needs an
explicit operational limit.

## Bridge the Blocking Stream Back to Async Code

An `asyncio.Queue` is the handoff between the executor thread and the FastAPI
async generator. The bounded queue matters: when the HTTP client is slow, the
executor thread waits instead of buffering an unbounded model response in
memory.

```python
import asyncio
from collections.abc import AsyncIterator
from functools import partial
from typing import Final

END: Final = object()


def pump_bedrock_stream(
    loop: asyncio.AbstractEventLoop,
    queue: asyncio.Queue[str | object],
    *,
    model_id: str,
    prompt: str,
) -> None:
    try:
        response = bedrock_runtime.converse_stream(
            modelId=model_id,
            messages=[
                {'role': 'user', 'content': [{'text': prompt}]},
            ],
        )

        for event in response['stream']:
            delta = event.get('contentBlockDelta', {}).get('delta', {})
            text = delta.get('text')
            if text:
                asyncio.run_coroutine_threadsafe(queue.put(text), loop).result()
    finally:
        asyncio.run_coroutine_threadsafe(queue.put(END), loop).result()


async def bedrock_text_stream(model_id: str, prompt: str) -> AsyncIterator[str]:
    loop = asyncio.get_running_loop()
    queue: asyncio.Queue[str | object] = asyncio.Queue(maxsize=32)
    producer = loop.run_in_executor(
        app_executor,
        partial(
            pump_bedrock_stream,
            loop,
            queue,
            model_id=model_id,
            prompt=prompt,
        ),
    )

    while True:
        item = await queue.get()
        if item is END:
            break
        yield item

    await producer
```

`run_coroutine_threadsafe(...).result()` is deliberate. It makes the executor
thread wait until the event loop accepts the next queue item. With `maxsize=32`,
that creates a fixed buffer between Bedrock and a slow HTTP client.

A FastAPI route can return this generator through `StreamingResponse`:

```python
from fastapi.responses import StreamingResponse


@app.post('/chat')
async def chat(prompt: str) -> StreamingResponse:
    return StreamingResponse(
        bedrock_text_stream(model_id='your-model-id', prompt=prompt),
        media_type='text/plain',
    )
```

## Cancellation and Shutdown Still Matter

Cancelling the HTTP request cancels the async generator's wait, but it does not
reliably interrupt a worker thread already reading from Bedrock. Treat client
disconnects, model timeouts, retries, and executor shutdown as separate paths.

On application shutdown, stop accepting new streams, let the chosen drain period
finish, then close the executor:

```python
app_executor.shutdown(wait=True, cancel_futures=True)
```

`cancel_futures=True` cancels work that has not started. It cannot stop a stream
already inside the synchronous Boto3 iterator.

The important boundary is small: FastAPI owns async HTTP work; the dedicated
executor owns blocking Bedrock streams; the queue moves deltas between them.
That is enough to reason about concurrency, backpressure, and thread limits
without adding a second event loop.

## Refs

- [Boto3 `converse_stream`](https://boto3.amazonaws.com/v1/documentation/api/latest/reference/services/bedrock-runtime/client/converse_stream.html)
- [Amazon Bedrock Converse API](https://docs.aws.amazon.com/bedrock/latest/userguide/conversation-inference.html)
- [Python `asyncio.run_in_executor`](https://docs.python.org/3/library/asyncio-eventloop.html#asyncio.loop.run_in_executor)
- [Python `asyncio.run_coroutine_threadsafe`](https://docs.python.org/3/library/asyncio-task.html#asyncio.run_coroutine_threadsafe)
- [FastAPI `StreamingResponse`](https://fastapi.tiangolo.com/advanced/custom-response/#streamingresponse)
