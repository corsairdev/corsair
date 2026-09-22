# @corsair-dev/turso

Turso plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/turso
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `changes.listen` | `turso.api.changes.listen` | `read` | Listen to committed insert/update/delete events for a table in a Turso database |
| `regions.closest` | `turso.api.regions.closest` | `read` | Get the closest Turso region based on client location, to minimize latency |
| `tokens.validate` | `turso.api.tokens.validate` | `read` | Validate a Turso API token and retrieve its expiration time (-1 when it never expires) |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/turso

## License

Apache-2.0
