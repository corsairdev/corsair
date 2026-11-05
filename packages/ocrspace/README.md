# @corsair-dev/ocrspace

OCR.space plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/ocrspace
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `account.conversions` | `ocrspace.api.account.conversions` | `read` | Retrieve conversion counts for the current month per OCR engine, updated once a day |
| `ocr.parse` | `ocrspace.api.ocr.parse` | `read` | Extract text from an image or PDF supplied as exactly one of a URL, a file upload (pass a File so the filename is sent, or set filetype), or a base64 data URI |
| `ocr.parseImageUrl` | `ocrspace.api.ocr.parseImageUrl` | `read` | Extract text from an image at a public URL using the simplified GET endpoint |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/ocrspace

## License

Apache-2.0
