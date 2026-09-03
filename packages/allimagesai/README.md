# @corsair-dev/allimagesai

All Images AI plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/allimagesai
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `apiKeys.check` | `allimagesai.api.apiKeys.check` | `read` | Validate the configured API key and return the email address and optional name of the account it belongs to. |
| `credits.get` | `allimagesai.api.credits.get` | `read` | Return the remaining and total credits for each quota bucket on the account. |
| `imageGenerations.delete` | `allimagesai.api.imageGenerations.delete` | `destructive` | Permanently delete one or more image generation batches by their print ids. |
| `imageGenerations.list` | `allimagesai.api.imageGenerations.list` | `read` | List image generation batches created for bulk use, filterable by name and tag. Paginated with limit and offset. |
| `images.listDownloaded` | `allimagesai.api.images.listDownloaded` | `read` | List images previously downloaded on this account, optionally filtered by download date. Paginated with limit and offset. |
| `webhooks.create` | `allimagesai.api.webhooks.create` | `write` | Register a webhook endpoint on the API key to receive print lifecycle callbacks. Defaults to print.failed and print.completed. |
| `webhooks.get` | `allimagesai.api.webhooks.get` | `read` | Retrieve a registered webhook by its id, returning its URL. The provider does not return the subscribed event list. |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/allimagesai

## License

Apache-2.0
