# @corsair-dev/ocrwebservice

OcrWebService plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/ocrwebservice
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `account.getCredentials` | `ocrwebservice.api.account.getCredentials` | `read` | Extract the OCR Web Service username from stored credentials |
| `account.getInformation` | `ocrwebservice.api.account.getInformation` | `read` | Retrieve remaining pages, subscription plan, and expiration date |
| `account.log` | `ocrwebservice.api.account.log` | `read` | Retrieve OCR processing logs for a date range |
| `ocr.recognize` | `ocrwebservice.api.ocr.recognize` | `write` | OCR an image or document via REST processDocument |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/ocrwebservice

## License

Apache-2.0
