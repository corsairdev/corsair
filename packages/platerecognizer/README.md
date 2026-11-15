# @corsair-dev/platerecognizer

Plate Recognizer plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/platerecognizer
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `plates.read` | `platerecognizer.api.plates.read` | `destructive` | Read plates from a base64 image. Snapshot charges a lookup. Plate text is not stored. |
| `usage.get` | `platerecognizer.api.usage.get` | `read` | Read the current Snapshot usage period. |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/platerecognizer

## License

Apache-2.0
