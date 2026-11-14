# @corsair-dev/krakenio

Kraken.io plugin for Corsair: optimize images and PDFs from a URL or a base64 upload, with resizing, format conversion, quality control and metadata options, and read the account's plan and remaining quota.

## Install

```bash
pnpm add @corsair-dev/krakenio
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `account.status` | `krakenio.api.account.status` | `read` | The plan, whether the account is active, and the quota total, used and remaining, all in bytes |
| `upload.optimize` | `krakenio.api.upload.optimize` | `destructive` | Optimize a file passed as base64, which the plugin uploads to Kraken as multipart, with the same resize and conversion options. Spends quota |
| `url.optimize` | `krakenio.api.url.optimize` | `destructive` | Fetch an image or PDF from a URL and optimize it, optionally resizing, converting, keeping metadata or setting the quality. Spends quota |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/krakenio

## License

Apache-2.0
