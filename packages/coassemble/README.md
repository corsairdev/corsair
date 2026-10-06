# @corsair-dev/coassemble

Coassemble plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/coassemble
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `clients.get` | `coassemble.api.clients.get` | `read` | Get a paginated list of Coassemble clients |
| `courses.get` | `coassemble.api.courses.get` | `read` | Get a paginated list of Coassemble courses |
| `trackings.get` | `coassemble.api.trackings.get` | `read` | Get learner progress tracking for a Coassemble course |
| `users.get` | `coassemble.api.users.get` | `read` | Get a paginated list of Coassemble users |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/coassemble

## License

Apache-2.0
