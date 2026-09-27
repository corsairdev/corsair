# @corsair-dev/imgbb

ImgBB plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/imgbb
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `auth.getApiKey` | `imgbb.api.auth.getApiKey` | `read` | Confirm an ImgBB API key is configured for this account and return a masked preview of it |
| `images.upload` | `imgbb.api.images.upload` | `write` | Upload an image to ImgBB and return the hosted image URLs and metadata |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/imgbb

## License

Apache-2.0
