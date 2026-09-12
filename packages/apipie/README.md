# @corsair-dev/apipie

APIpie AI plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/apipie
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `chat.createCompletion` | `apipie.api.chat.createCompletion` | `write` | Generate a chat completion using an APIpie model, with optional provider routing and memory. |
| `embeddings.create` | `apipie.api.embeddings.create` | `write` | Create embeddings for the given input text(s). |
| `images.generate` | `apipie.api.images.generate` | `write` | Generate image(s) from a text prompt. |
| `models.list` | `apipie.api.models.list` | `read` | List APIpie models available to the account, filterable by type, subtype, provider, and model. |
| `models.listDetailed` | `apipie.api.models.listDetailed` | `read` | List APIpie models with detailed metadata including capabilities, limits, and pricing. |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/apipie

## License

Apache-2.0
