# APIpie plugin for Corsair

Use APIpie's model catalogue, chat completions, embeddings, and image generation through Corsair's typed plugin API.

## Install

```bash
pnpm add @corsair-dev/apipie
```

## Configure authentication

APIpie uses an API key. For local development, pass an environment variable explicitly:

```typescript
import { apipie } from '@corsair-dev/apipie';
import { createCorsair } from 'corsair/core';

const corsair = createCorsair({
  plugins: [apipie({ key: process.env.APIPIE_API_KEY })],
});

const result = await corsair.apipie.api.chat.createCompletion({
  model: 'openai/gpt-4o-mini',
  messages: [{ role: 'user', content: 'Give me a one-line status update.' }],
});
```

PowerShell:

```powershell
$env:APIPIE_API_KEY = "your-api-key"
```

The plugin does not load environment variables by itself. `key` is an optional development override; when omitted, Corsair resolves `api_key` from its credential store. Production applications should use the encrypted credential store rather than embedding secrets in source.

## Operations

| Operation | Purpose |
| --- | --- |
| `models.list` | List models with optional type, provider, and availability filters |
| `models.listDetailed` | List model capabilities, limits, modalities, and pricing metadata |
| `chat.createCompletion` | Create an OpenAI-compatible chat completion |
| `embeddings.create` | Create embeddings for one or more strings |
| `images.generate` | Generate one or more images from a prompt |

All inputs and provider responses are validated with the exported `ApipieEndpointInputSchemas` and `ApipieEndpointOutputSchemas`.

## Errors and retries

Authentication, validation, account-credit, permission, not-found, conflict, rate-limit, and server errors are classified by the plugin. HTTP 429 responses are handled by the shared transport and honor `Retry-After`. The plugin does not automatically replay billable POST operations after an error, because the upstream request may already have been charged.

## Local cache

When a Corsair database is configured:

- `models.list` writes to `models`.
- `models.listDetailed` writes to `modelDetails`.
- `images.generate` writes generated image URL metadata to `images`.

Image responses returned as `b64_json` are not copied into the database. APIpie does not return image IDs, so cached images use a request-level generation ID plus their batch index.

## Webhooks

The APIpie plugin does not expose webhook operations or incoming webhook handlers.

See the complete [APIpie documentation](../../docs/plugins/apipie/overview.mdx) for endpoint inputs, outputs, and database entity details.
