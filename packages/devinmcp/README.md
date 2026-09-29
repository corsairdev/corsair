# @corsair-dev/devinmcp

DevinMcp plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/devinmcp
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `session.create` | `devinmcp.api.session.create` | `write` | Create a new Devin session to start working on a task |
| `session.get` | `devinmcp.api.session.get` | `read` | Get details and status of an existing Devin session |
| `session.list` | `devinmcp.api.session.list` | `read` | List Devin sessions |
| `session.sendMessage` | `devinmcp.api.session.sendMessage` | `write` | Send a follow-up message to an existing Devin session |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/devinmcp

## License

Apache-2.0
