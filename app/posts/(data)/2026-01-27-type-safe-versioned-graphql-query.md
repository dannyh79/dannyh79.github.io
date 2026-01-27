---
title: 'Type-safe Versioned GraphQL made easy - gql.tada and urql'
summary: 'Use committed GraphQL schema of different versions, to make GraphQL type-safe easily'
createdAt: 2026-01-27 23:06:52 +0800
publishedAt: 2026-01-27
categories: [graphql, typescript, nodejs, react, shopify]
---

## TL;DR

- Use `gql.tada` to derive types directly from your GraphQL strings by locking a local schema in `tsconfig.json`
- Ensure GraphQL queries/mutations with `urql`, in browser or Node.js, are strictly typed against specific API version(s)
- Ease the uncertainty in migrating one API version to another, from an upstream that bumps their API version reguarly like Shopify

## Some Context

Had to migrate over 100 untyped-and-deprecated-with-zero-unit-test GraphQL query and mutation functions from multiple versions from Shopify's GraphQL API.

To save the hair-pulling, I had to figure out a way to tame this hot mess into somthing sane.

The gist of this, is to

1. List scope of work, by API versions; the query/mutation functions are with their Shopify API endpoint versions, so it was easy to tell them apart by API version
2. Leverage gql.tada's [mutiple schema feature](https://gql-tada.0no.co/guides/multiple-schemas), GraphQL' [introspection feature](https://graphql.org/learn/introspection/), and Shopify's [introspection endpoint](https://shopify.dev/docs/api/usage/graphql-basics/index#example) to keep tabs of each Shopify API version schema
3. Migrate API functions by their respective API versions, then export all them out via barrel files ([controversial](https://www.atlassian.com/blog/atlassian-engineering/faster-builds-when-removing-barrel-files) but the usage, that all API functions are used somewhere, anyway, justifies the case)
4. Cover the migrated API functions with unit tests to ensure input and output shapes remain the same during API version bumps
5. Bump the API functions with full confidence

## 1. Schema Configuration

[Download the Shopify schema](https://shopify.dev/docs/api/usage/graphql-basics/index#example) (e.g., `schema.graphql`) as files and lock them in `tsconfig.json`. This is the single source of truth for your IDE and types.

> For TypeScript version < 5.5, see [here](https://gql-tada.0no.co/get-started/installation#prior-to-typescript-5-5) for more.

```json
{
  "compilerOptions": {
    "plugins": [
      {
        "name": "gql.tada/ts-plugin",
        "schemas": [
          {
            "name": "admin-2024-07",
            "schema": "./graphql/admin-2024-07/schema.graphql",
            "tadaOutputLocation": "./src/shopify/graphql/admin-2024-07/schema-env.d.ts" # shall be .d.ts to avoid typecheck overhead from tsc
          },
          {
            "name": "admin-2024-10",
            "schema": "./graphql/admin-2024-10/schema.graphql",
            "tadaOutputLocation": "./src/shopify/graphql/admin-2024-10/schema-env.d.ts" # shall be .d.ts to avoid typecheck overhead from tsc
          }
        ]
      }
    ]
  }
}
```

## 2. Initialize gql.ts

Set up the graphql function. This replaces the need for generated hooks or documents.

```ts
// ./src/shopify/graphql/admin-2024-07/client.ts

import { initGraphQLTada } from 'gql.tada';
import type { introspection } from './schema-env.d.ts';

export const graphql = initGraphQLTada<{
  introspection: typeof introspection;
}>();

export type { ResultOf, VariablesOf } from 'gql.tada';
```

## 3. Usage: Frontend & Node.js

Define your query once. gql.tada infers the input (`VariablesOf`) and output (`ResultOf`) instantly.

### Query Definition

```ts
// ./src/shopify/graphql/admin-2024-07/queries.ts

import { graphql } from './client';

const ProductsQuery = graphql(`
  query GetProducts($first: Int!) {
    products(first: $first) {
      nodes {
        id
        title
      }
    }
  }
`);
```

### React (Frontend)

```ts
import { useQuery } from 'urql';
import { type VariablesOf } from 'path/to/shopify/graphql/admin-2024-07/client';

const ProductList = ({ vars }: { vars: VariablesOf<typeof ProductsQuery> }) => {
  const [{ data }] = useQuery({ query: ProductsQuery, variables: vars });
  return <div>{data?.products.nodes.map(p => p.title)}</div>;
};
```

### Client (Shared)

```ts
// ./src/shopify/graphql/admin-2024-07/client.ts

// ...omitted

import { createClient, cacheExchange, fetchExchange } from '@urql/core';

export const client = createClient({
  url: 'https://{shop}.myshopify.com/admin/api/2024-07/graphql.json',
  exchanges: [cacheExchange, fetchExchange],
  fetchOptions: () => ({
    headers: { 'X-Shopify-Access-Token': process.env.SHOPIFY_TOKEN! },
  }),
});
```

### Node.js (Backend/Scripts)

```ts
import { client, type ResultOf } from 'path/to/shopify/graphql/admin-2024-07/client';

async function fetchProducts() {
  const result = await client.query(ProductsQuery, { first: 10 }).toPromise();
  const data: ResultOf<typeof ProductsQuery> | undefined = result.data;

  console.log(data?.products.nodes);
}
```

## Why this works

- Version Locking: Updating the schema file in tsconfig immediately flags every broken query in the project

- No runtime overhead: Types are checked at compiled time, with the trade-off of having (big) GraphQL schema files committed to git

- Unified Interface: Use the same query definitions and type extractors across your entire stack; this ensures much more safety with libraries, like axios, that cast `any` on API responses by default
