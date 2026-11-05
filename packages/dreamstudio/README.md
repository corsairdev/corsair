# @corsair-dev/dreamstudio

DreamStudio (Stability AI) plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/dreamstudio
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `engines.list` | `dreamstudio.api.engines.list` | `read` | List Stability engines available to this API key. The v1 API returns the full list with no pagination. |
| `generation.imageFromImage` | `dreamstudio.api.generation.imageFromImage` | `write` | Generate a new image from an init image and text prompts via POST /v1/generation/{engine_id}/image-to-image |
| `user.account` | `dreamstudio.api.user.account` | `read` | Get the authenticated Stability user id, email, organizations, and profile picture |
| `user.balance` | `dreamstudio.api.user.balance` | `read` | Get the credit balance of the Stability account tied to the API key |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/dreamstudio

## License

Apache-2.0
