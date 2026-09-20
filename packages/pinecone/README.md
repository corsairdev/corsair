# @corsair-dev/pinecone

Corsair plugin for the [Pinecone API](https://docs.pinecone.io/reference/api/introduction), covering the 48 operations advertised by the Corsair OSS catalog.

## Authentication

The implemented database, inference, and Assistant APIs use Pinecone's `Api-Key` header. Create a key in the Pinecone console and provide it through Corsair credentials or explicitly:

```ts
import { pinecone } from '@corsair-dev/pinecone'

const plugin = pinecone({ key: process.env.PINECONE_API_KEY })
```

Missing credentials fail with `AuthMissingError`; the plugin never sends an empty key. Pinecone's separate administrative OAuth API is outside this contribution because none of its operations appear in the claimed 48-operation catalog surface.

All calls pin `X-Pinecone-API-Version: 2026-04` to the matching [official OpenAPI contracts](https://github.com/pinecone-io/pinecone-api/tree/main/2026-04).

## Endpoint overview

| Domain | Operations |
| --- | --- |
| Indexes | create, createForModel, list, describe, configure, delete |
| Backups | create, listForIndex, listForProject, describe, delete, createIndex |
| Restore jobs | list, describe |
| Collections | list |
| Inference | embed, rerank, listModels, getModel |
| Vectors | upsert, query, fetch, update, delete, list, describeIndexStats |
| Namespaces | list, create, describe, delete |
| Bulk imports | list, start, describe, cancel |
| Integrated records | upsert, search |
| Assistants | list, create, get, update, delete |
| Assistant files | list, upload, describe, delete |
| Assistant chat | chat, completion, context |

No webhooks are registered because these Pinecone surfaces do not publish relevant native webhook events.

## Dynamic hosts

Control-plane and inference calls use `https://api.pinecone.io`. Data operations require the `host` returned by `indexes.describe`; Assistant data operations require the `host` returned by `assistants.get`.

```ts
const index = await corsair.pinecone.indexes.describe({
  indexName: 'knowledge-base',
})

await corsair.pinecone.vectors.upsert({
  host: index.host,
  namespace: 'docs',
  vectors: [{ id: 'doc-1', values: [0.12, 0.34] }],
})
```

Dynamic hosts must use HTTPS and end in `pinecone.io`. This prevents an untrusted host input from forwarding the caller's API key to another domain.

## Retrieval workflow

The main demo path is a complete retrieval pipeline:

1. Create or describe an index.
2. Generate embeddings with `inference.embed`.
3. Store them with `vectors.upsert`.
4. Retrieve candidates with `vectors.query` or `records.search`.
5. Improve ordering with `inference.rerank`.

Every operation has a Zod input/output contract and a mocked routing test based on the official `2026-04` path, method, auth, and response shape.

## Important behavior

- List operations expose Pinecone pagination tokens and limits where available.
- Integrated-record upserts are encoded as `application/x-ndjson`.
- Assistant uploads accept `fileBase64`, decode it locally, and send multipart form data without manually setting an invalid boundary.
- Assistant chat endpoints intentionally expose non-streaming JSON responses; `stream: true` is rejected because Corsair's action transport does not return SSE streams.
- `429` responses are handled by Corsair's shared `Retry-After`-aware transport and are not retried a second time by plugin handlers.
- Destructive index, backup, namespace, vector, Assistant, and file operations are marked accordingly in endpoint metadata.

## Tests

```bash
pnpm --filter @corsair-dev/pinecone typecheck
pnpm --filter @corsair-dev/pinecone test
pnpm --filter @corsair-dev/pinecone build
```

Offline tests require no Pinecone key.

## Live demo

The live demo uses the real plugin endpoints to generate embeddings, create a disposable serverless index, upsert and query three vectors, rerank the matches, and delete the index in a `finally` block:

```bash
read -s PINECONE_API_KEY
export PINECONE_API_KEY
pnpm exec tsx packages/pinecone/demo.ts
unset PINECONE_API_KEY
```

Paste the key at the hidden prompt and press Enter. The API key is read only from the process environment and is never printed. The demo uses AWS `us-east-1`, which is available on Pinecone Starter plans.

[Watch the verified 32-second live demo](https://github.com/sgoel2be24-cyber/corsair/releases/download/pinecone-demo-v1/Screen.Recording.2026-08-27.at.10.55.29.PM.mov). It shows embedding generation, disposable index creation, a three-vector upsert, semantic query, reranking, and successful cleanup.

## Links

- [Pinecone API documentation](https://docs.pinecone.io/reference/api/introduction)
- [Official OpenAPI specifications](https://github.com/pinecone-io/pinecone-api)
- [Integration request](https://github.com/corsairdev/corsair/issues/1199)
- [Pull request](https://github.com/corsairdev/corsair/pull/1200)
