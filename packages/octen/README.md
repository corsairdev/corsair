# Octen plugin

Web search, scraping and structured data extraction API. This package wires the
[Octen](https://docs.octen.ai) HTTP API into Corsair: ranked web search, news,
business, image and video search, page extraction, text and multimodal
embeddings, and search-grounded answer and media generation.

## Auth

Octen authenticates with an API key sent in the `x-api-key` header (the API
also accepts `Authorization: Bearer`, which this plugin does not use).

```ts
import { corsair } from 'corsair';
import { octen } from '@corsair-dev/octen';

const client = corsair({
	plugins: [octen({ key: process.env.OCTEN_API_KEY })],
});
```

When no `key` is passed the plugin reads the stored `api_key`; an empty key
throws `AuthMissingError` before any network call.

## Endpoints

| Endpoint | Method | Path | Access | Description |
| --- | --- | --- | --- | --- |
| `search.post` | POST | `/search` | read | Search the web with ranked, highlightable results |
| `broadSearch.post` | POST | `/broad-search` | read | Expand one query into sub-queries and search each |
| `newsSearch.post` | POST | `/news-search` | read | Search news articles, optionally grouped into events |
| `businessSearch.post` | POST | `/business-search` | read | Search business pages, returning company/people cards |
| `imageSearch.post` | POST | `/image-search` | read | Search images by text query or reference image |
| `videoSearch.post` | POST | `/video-search` | read | Search videos by a text query |
| `extract.post` | POST | `/extract` | read | Extract page content from up to 20 URLs |
| `embedding.create` | POST | `/embedding` | read | Create text embeddings |
| `vlEmbedding.create` | POST | `/vl-embedding` | read | Create multimodal (text/image/video) embeddings |
| `answer.create` | POST | `/answer` | read | Decompose messages, search, and synthesize an answer |
| `videoGeneration.create` | POST | `/v1/videos` | write | Queue a text-to-video generation task |
| `videoGeneration.get` | GET | `/v1/videos/{id}` | read | Get a video task and its download URL |
| `groundedGeneration.create` | POST | `/v1/grounded-generation` | write | Queue a grounded image/video generation task |
| `groundedGeneration.get` | GET | `/v1/grounded-generation/{generation_id}` | read | Get a grounded generation and its output URL |

### Response envelope

Most Octen endpoints wrap their payload in
`{ code, msg, data, request_id }`, where a non-zero `code` signals an error even
when the HTTP status is 200. `client.ts` unwraps `data` on success and throws an
`ApiError` whose `status` mirrors the envelope `code` on failure, so the
status-based error handlers classify it correctly. The `answer`,
`videoGeneration` and `groundedGeneration` endpoints return the resource
directly and opt out of unwrapping with `envelope: false`.

The envelope's optional `meta` (usage, latency, warnings) is deliberately
dropped when `data` is unwrapped; the endpoint response schemas model only the
payload.

## Not implemented

- `POST /v1/research` (Deep Research) — streaming-only (SSE), always streamed
  and two-phase (plan confirmation required).
- `POST /v1/chat/completions`, `POST /v1/messages`, `POST /v1/images/generations`
  — OpenAI/Anthropic protocol proxies (SSE streaming, tool calling, 30+ sampling
  parameters); Corsair routes model calls through its own LLM gateway.
