---
title: 'Demystifying Threading and Event Loop Models in Python'
summary: 'A practical guide to Python threading, asyncio event loops, and blocking I/O.'
createdAt: 2026-09-08 12:31:45 +0800
publishedAt: 2026-09-08
categories: [python, fastapi, asyncio, aws]
---

`boto3` is synchronous, but Amazon Bedrock's `converse_stream()` returns an
`EventStream` that yields response events over time. That makes it a better
example than one blocking S3 upload: a FastAPI app needs to read a blocking
stream without freezing its event loop, then send each text delta back to the
HTTP client as it arrives.

## TL;DR

- `BedrockRuntime.Client.converse_stream()`: starts a model response stream; the
  returned `EventStream` yields events such as `contentBlockDelta`.
- `ThreadPoolExecutor`: runs the blocking Bedrock request and its event iterator
  outside FastAPI's event-loop thread.
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
                              one Python process

┌──────────────────────────────────────────────────────────────────────┐
│ FastAPI / Uvicorn event-loop thread                                  │
│                                                                      │
│  async generator for StreamingResponse                               │
│       │                                                              │
│       ├─ starts loop.run_in_executor(bedrock_executor, pump, ...) ──┐│
│       │                                                              ││
│       └─ await queue.get()                                           ││
│          yields each text delta to the HTTP client                   ││
└──────────────────────────────────────────────────────────────────────┘│
                                                                         │
                                                                         ▼
┌──────────────────────────────────────────────────────────────────────┐
│ bedrock-stream_0 ... bedrock-stream_N                                 │
│ ThreadPoolExecutor worker                                             │
│                                                                      │
│  response = bedrock_runtime.converse_stream(...)                      │
│  for event in response['stream']:                                     │
│      read contentBlockDelta.delta.text                                │
│      run_coroutine_threadsafe(queue.put(text), loop).result()        │
└──────────────────────────────────────────────────────────────────────┘
```

The executor thread blocks while it waits for Bedrock. The FastAPI event-loop
thread does not. It waits asynchronously for queue items and can still run
other requests.

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
and should not compete with unrelated blocking work. Give it a dedicated pool:

```python
import os
from concurrent.futures import ThreadPoolExecutor

bedrock_executor = ThreadPoolExecutor(
    max_workers=int(os.environ.get('BEDROCK_STREAM_MAX_WORKERS', '4')),
    thread_name_prefix='bedrock-stream',
)
```

`max_workers` is per Python process. Four Uvicorn workers with
`BEDROCK_STREAM_MAX_WORKERS=4` can start up to sixteen Bedrock streams before
replicas are counted.

### Suggested Starting Configurations

For a container with one application process and a CPU limit, start with four
concurrent Bedrock streams:

```yaml
# Kubernetes Deployment, Docker Compose, or equivalent environment config
env:
  - name: BEDROCK_STREAM_MAX_WORKERS
    value: '4'
```

For a raw host running one application process without a tight CPU quota, start
with eight:

```bash
BEDROCK_STREAM_MAX_WORKERS=8 uvicorn app:app
```

These are starting points, not Bedrock quotas. Each active stream holds one
executor worker until the model finishes. Set the value from the number of
concurrent streams the process may own, then load-test against model quotas,
request latency, and your retry policy.

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
        bedrock_executor,
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
bedrock_executor.shutdown(wait=True, cancel_futures=True)
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
