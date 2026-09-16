# @corsair-dev/tpscheck

TPSCheck plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/tpscheck
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `batch.post` | `tpscheck.api.batch.post` | `read` | Check multiple UK phone numbers against TPS and CTPS registers |
| `check.post` | `tpscheck.api.check.post` | `read` | Check a UK phone number against TPS and CTPS registers |
| `credits.get` | `tpscheck.api.credits.get` | `read` | Get TPSCheck API usage and remaining credits |
| `status.get` | `tpscheck.api.status.get` | `read` | Check TPSCheck API health and version |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/tpscheck

## License

Apache-2.0
