# @corsair-dev/safetyculture

SafetyCulture plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/safetyculture
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `actions.list` | `safetyculture.api.actions.list` | `read` | List actions / issues |
| `inspections.get` | `safetyculture.api.inspections.get` | `read` | Get a single inspection by audit ID |
| `inspections.list` | `safetyculture.api.inspections.list` | `read` | List / search inspections (audits) |
| `templates.list` | `safetyculture.api.templates.list` | `read` | List inspection templates |
| `users.list` | `safetyculture.api.users.list` | `read` | List organisation users |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/safetyculture

## License

Apache-2.0
