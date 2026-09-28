# @corsair-dev/cdrplatform

CDR Platform plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/cdrplatform
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `cdr.price` | `cdrplatform.api.cdr.price` | `read` | Calculate CO2 removal pricing for a method portfolio. |
| `cdr.purchase` | `cdrplatform.api.cdr.purchase` | `write` | Create a CO2 removal purchase request and return its transaction UUID. |
| `certificate.get` | `cdrplatform.api.certificate.get` | `read` | Retrieve a removal certificate by certificate ID. |
| `health.check` | `cdrplatform.api.health.check` | `read` | Check CDR Platform API health status. |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/cdrplatform

## License

Apache-2.0
