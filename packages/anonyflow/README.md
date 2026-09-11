# @corsair-dev/anonyflow

Anonyflow plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/anonyflow
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `core.anonymize` | `anonyflow.api.core.anonymize` | `write` | Anonymize sensitive data in text |
| `core.anonymizePacket` | `anonyflow.api.core.anonymizePacket` | `write` | Encrypt field values within a data packet based on keys |
| `core.deanonymize` | `anonyflow.api.core.deanonymize` | `write` | Restore original text from anonymized mapping |
| `core.deanonymizePacket` | `anonyflow.api.core.deanonymizePacket` | `write` | Decrypt field values within a data packet based on keys |
| `core.testConnection` | `anonyflow.api.core.testConnection` | `read` | Verify API key and connectivity |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/anonyflow

## License

Apache-2.0
