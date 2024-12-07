---
title: 'Build an AI App with Ease on TypeScript'
summary: 'Use Vercel AI SDK with zod schema to super-charge your front-end app.'
createdAt: 2024-12-07 23:46:23 +0800
publishedAt: 2024-12-07
categories: [javascript, typescript, ai, frontend, nextjs]
---

Found a gem, [AI SDK](https://sdk.vercel.ai), from Vercel's workshop "Building AI apps with the AI SDK and Next.js" a couple days ago. It has unified provider API, streaming[^1] API built-in, and, the most important of all, the ability to transform model output into type-safe objects. Better yet, we can easily iterate the output by injecting prompt through [schema](https://sdk.vercel.ai/docs/ai-sdk-ui/object-generation#schema):

```ts
// app/api/notifications/schema.ts; from https://sdk.vercel.ai/docs/ai-sdk-ui/object-generation#schema
import { z } from 'zod';

export const notificationSchema = z.object({
  notifications: z.array(
    // Use describe() give model prompt for a specific field
    z.object({
      name: z.string().describe('Name of a fictional person.'),
      message: z.string().describe('Message. Do not use emojis or links.'),
    }),
  ),
});
```

```ts
// app/page.tsx; from https://sdk.vercel.ai/docs/ai-sdk-ui/object-generation#schema
'use client';

import { experimental_useObject as useObject } from 'ai/react';
import { notificationSchema } from './api/notifications/schema';

export default function Page() {
  const { object, submit } = useObject({
    api: '/api/notifications',
    schema: notificationSchema,
  });

  return (
    <>
      /* Use submit() to provide the main prompt. */
      <button onClick={() => submit('Messages during finals week.')}>
        Generate notifications
      </button>

      {object?.notifications?.map((notification, index) => (
        <div key={index}>
          <p>{notification?.name}</p>
          <p>{notification?.message}</p>
        </div>
      ))}
    </>
  );
}
```

## Self-Paced Workshop

The workshop material is available at [Build an AI App](https://build-ai-app-dec-24.vercel.app/)[^2]. It covers all common uses for AI: extracting and classifying data, and chatbot.

## Bonus - Developing An AI App

### Tool Calling

No language model is one-fits-all (for now, at least), or applicable for all use cases. And we can leverage language model tool calls[^3] here.

Take getting real-time weather for example, [we can "tell" the model to fetch weather data from an endpoint, then get back to us](https://build-ai-app-dec-24.vercel.app/docs/chatbot-with-tools)[^4]. If we want the tool call result to be sent back to the model for further processing, [we can enable it by setting `maxSteps`](https://sdk.vercel.ai/docs/ai-sdk-core/tools-and-tool-calling#multi-step-calls).

### Debug a Language Model Call, Implement Caching, or Sanitize the Generated Text

See AI SDK's [Language Model Middleware](https://sdk.vercel.ai/docs/ai-sdk-core/middleware).

### Feeling Thrifty. How about Hooking AI SDK to a Local Language Model?

[Ollama Provider](https://sdk.vercel.ai/providers/community-providers/ollama) is here to help. See another post [Set up a Local LLM for Neovim on Mac](/posts/local-llm-nvim) for setting up a local language model.

## Pour Closure

> LLM (large language model) is just an API.

I now see what it is said so in the workshop. With AI SDK, developing an AI app and prompt engineering become a clean and elegant process. And in a foreseeable future, [English will become the new programming language](https://www.techradar.com/pro/nvidia-ceo-predicts-the-death-of-coding-jensen-huang-says-ai-will-do-the-work-so-kids-dont-need-to-learn).

[^1]: Not all models support streaming. See [AI SDK Provider support section](https://sdk.vercel.ai/providers/ai-sdk-providers#provider-support) for more.

[^2]: In case the site is not available, its Next repo fork can be found [here](https://github.com/dannyh79/build-an-ai-app-starter-dec-24).

[^3]: Not all models support tool calls. See [AI SDK Provider support section](https://sdk.vercel.ai/providers/ai-sdk-providers#provider-support) for more.

[^4]: In case the site is not available, its Next repo fork can be found [here](https://github.com/dannyh79/build-an-ai-app-starter-dec-24).

---

## Refs

- [Vercel AI SDK](https://sdk.vercel.ai)
