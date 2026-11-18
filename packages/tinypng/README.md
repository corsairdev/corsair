# @corsair-dev/tinypng

TinyPNG plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/tinypng
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `account.getCompressionCount` | `tinypng.api.account.getCompressionCount` | `read` | Get the number of compressions made this calendar month |
| `images.compressAndStoreInAzure` | `tinypng.api.images.compressAndStoreInAzure` | `write` | Compress an image and upload the result to Azure Blob Storage through a SAS URL |
| `images.output` | `tinypng.api.images.output` | `read` | Download a compressed image by its Tinify image ID as base64 |
| `images.shrink` | `tinypng.api.images.shrink` | `write` | Compress an image from a URL or base64 bytes and return its Tinify image ID (uses one compression) |
| `images.transform` | `tinypng.api.images.transform` | `write` | Resize, convert, fill the background of, or preserve metadata on a compressed image, optionally storing it on S3 or GCS |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/tinypng

## License

Apache-2.0
