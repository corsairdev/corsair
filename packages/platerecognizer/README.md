# @corsair-dev/platerecognizer

Plate Recognizer plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/platerecognizer
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `usage.get` | `platerecognizer.api.usage.get` | `read` | Read the current Snapshot usage period. |
| `plates.read` | `platerecognizer.api.plates.read` | `read` | Read license plates from an image (base64 or URL). Uses one Snapshot lookup. |
| `ocr.read` | `platerecognizer.api.ocr.read` | `read` | Read a VIN, trailer id, odometer, container, boat number or C-TPAT seal from an image. |
| `ocr.getUsage` | `platerecognizer.api.ocr.getUsage` | `read` | Read the OCR calls used this period and the plan limit. |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/platerecognizer

## License

Apache-2.0
