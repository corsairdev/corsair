# @corsair-dev/cincopa

Cincopa plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/cincopa
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `asset.abortUploadFromUrl` | `cincopa.api.asset.abortUploadFromUrl` | `write` | Abort an in-progress asset upload from URL |
| `asset.getUploadFromUrlStatus` | `cincopa.api.asset.getUploadFromUrlStatus` | `read` | Check the status of an asset upload from URL |
| `asset.uploadFromUrl` | `cincopa.api.asset.uploadFromUrl` | `write` | Start uploading an asset from a remote URL |
| `gallery.list` | `cincopa.api.gallery.list` | `read` | List galleries |
| `general.getUploadIframe` | `cincopa.api.general.getUploadIframe` | `read` | Get an embeddable upload iframe URL for a gallery |
| `general.ping` | `cincopa.api.general.ping` | `read` | Validate the Cincopa API connection |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/cincopa

## License

Apache-2.0
