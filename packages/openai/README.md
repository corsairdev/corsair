# @corsair-dev/openai

Corsair plugin for the [OpenAI API](https://platform.openai.com/docs/api-reference).

Implements **129 operations across 33 domains** (chat, embeddings, assistants, files, vector stores, audio, images, videos, fine-tuning, batches, and more).

## Auth setup

**API key only.** No OAuth.

1. Create a key at [platform.openai.com/api-keys](https://platform.openai.com/api-keys).
2. Pass it when registering the plugin, or store it via Corsair’s key manager.

```ts
import { createCorsair } from 'corsair';
import { openai } from '@corsair-dev/openai';

const corsair = createCorsair({
  // database, kek, ...
  plugins: [
    openai({
      // optional: pass the key directly (skips key manager for this plugin)
      key: process.env.OPENAI_API_KEY,
    }),
  ],
});
```

Credentials are sent as `Authorization: Bearer <key>`.

Missing credentials throw `AuthMissingError` (never an empty string).

| Setting | Value |
|--------|--------|
| Auth type | `api_key` |
| Base URL | `https://api.openai.com/v1` |
| Webhooks | None (pull-based REST) |

## Endpoint overview

Call endpoints as `corsair.openai.api.<domain>.<method>(...)`.

| Domain | Methods |
|--------|---------|
| `models` | `list`, `retrieve` |
| `engines` | `list`, `retrieve` (legacy) |
| `chat` | `createCompletion` |
| `embeddings` | `create` |
| `files` | `upload`, `list`, `retrieve`, `delete`, `downloadContent` |
| `assistants` | `create`, `list`, `retrieve`, `modify`, `delete` |
| `threads` | `create`, `retrieve`, `modify`, `delete`, `createAndRun` |
| `messages` | `create`, `list`, `retrieve`, `modify`, `delete` |
| `runs` | `create`, `list`, `retrieve`, `modify`, `cancel`, `submitToolOutputs` |
| `runSteps` | `list`, `retrieve` |
| `vectorStores` | `create`, `list`, `retrieve`, `modify`, `delete`, `search` |
| `vectorStoreFiles` | `create`, `list`, `retrieve`, `delete`, `updateAttributes`, `retrieveContent` |
| `vectorStoreFileBatches` | `create`, `retrieve`, `listFiles` |
| `moderation` | `create` |
| `audio` | `createSpeech`, `createTranscription`, `createTranslation` |
| `images` | `create`, `createEdit`, `createVariation` |
| `videos` | `create`, `list`, `retrieve`, `delete`, `createRemix`, `download` |
| `realtime` | `createCall`, `createClientSecret`, `createSession`, `createTranscriptionSession` |
| `chatkit` | `listThreads`, `getThread`, `listThreadItems` |
| `skills` | `create`, `list`, `delete` |
| `containers` | `create`, `list`, `retrieve`, `delete` |
| `containerFiles` | `create`, `list`, `retrieve`, `retrieveContent`, `delete` |
| `conversations` | `create`, `update`, `delete`, `createItems`, `listItems`, `getItem`, `deleteItem` |
| `fineTuning` | `createJob`, `listJobs`, `retrieveJob`, `listCheckpoints`, `listEvents`, `cancelJob` |
| `completions` | `create` (legacy) |
| `responses` | `create`, `retrieve`, `delete`, `cancel`, `compact`, `listInputItems` |
| `chatCompletions` | `list`, `retrieve`, `update`, `delete`, `listMessages` (stored completions) |
| `tokens` | `countInput` |
| `evals` | `create`, `list`, `get`, `update`, `delete` |
| `evalRuns` | `create`, `get`, `list`, `cancel`, `delete`, `getOutputItem`, `listOutputItems` |
| `graders` | `run`, `validate` |
| `batches` | `create`, `retrieve`, `cancel`, `list` |
| `uploads` | `create`, `addPart`, `complete`, `cancel` |

### Example

```ts
const models = await corsair.openai.api.models.list({});

const chat = await corsair.openai.api.chat.createCompletion({
  model: 'gpt-4o-mini',
  messages: [{ role: 'user', content: 'Hello!' }],
});

const emb = await corsair.openai.api.embeddings.create({
  model: 'text-embedding-3-small',
  input: 'hello world',
});
```

## Quirks & caveats

- **Streaming is off by default.** Chat/completion-style calls send `stream: false` so responses are a single JSON body (not SSE). Enable streaming only if the Corsair client and consumer handle streams.
- **No webhooks.** OpenAI’s REST surface is pull-based; this plugin does not register inbound webhooks.
- **`timestamp_granularities[]` (audio).** Transcription options that accept multiple granularities are sent as repeated multipart form fields, matching OpenAI’s encoding (not a comma-joined string).
- **Paired video fields.** Video create paths that take a reference file require both the binary reference and its file name together.
- **Rate limits (429).** Errors rethrow `ApiError` so Corsair’s rate-limit handler can honor `Retry-After`.
- **Extended surfaces.** Realtime / ChatKit / Skills / some eval shapes may evolve with OpenAI’s public API; schemas use documented fields and documented extension points.

## Tests

```bash
pnpm --filter @corsair-dev/openai test
```

- **Offline:** schema smoke tests for every registered endpoint key (no API key required).
- **Live:** models / chat / embeddings smoke when `OPENAI_API_KEY` is set; otherwise those cases are skipped.
