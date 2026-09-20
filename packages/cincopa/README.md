# @corsair-dev/cincopa

Cincopa plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/cincopa
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `asset.abortUploadFromUrl` | `cincopa.api.asset.abortUploadFromUrl` | `write` | Abort an ongoing asset upload-in-progress |
| `asset.getUploadFromUrlStatus` | `cincopa.api.asset.getUploadFromUrlStatus` | `read` | Check the status of an asset upload initiated via URL |
| `asset.uploadFromUrl` | `cincopa.api.asset.uploadFromUrl` | `write` | Upload a new asset directly from a provided external URL |
| `general.getUploadIframe` | `cincopa.api.general.getUploadIframe` | `read` | Get an embeddable upload iframe URL for a gallery |
| `general.ping` | `cincopa.api.general.ping` | `read` | Validate API connection |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/cincopa

## License

Apache-2.0
