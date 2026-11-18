# @corsair-dev/langbase

Langbase plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/langbase
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `pipes.run` | `langbase.api.pipes.run` | `write` | Execute an AI agent pipe and return generation completion |
| `pipes.list` | `langbase.api.pipes.list` | `read` | Retrieve all configured pipes in the account |
| `pipes.get` | `langbase.api.pipes.get` | `read` | Retrieve a specific pipe definition by name |
| `pipes.create` | `langbase.api.pipes.create` | `write` | Create a new AI agent pipe |
| `pipes.update` | `langbase.api.pipes.update` | `write` | Update an existing pipe configuration |
| `pipes.delete` | `langbase.api.pipes.delete` | `destructive` | Delete a pipe definition |
| `memory.list` | `langbase.api.memory.list` | `read` | Retrieve all managed semantic memory sets |
| `memory.get` | `langbase.api.memory.get` | `read` | Retrieve a specific semantic memory set by name |
| `memory.create` | `langbase.api.memory.create` | `write` | Create a new managed semantic memory set |
| `memory.delete` | `langbase.api.memory.delete` | `destructive` | Delete a semantic memory set |
| `tools.webSearch` | `langbase.api.tools.webSearch` | `read` | Perform web searches via Langbase Tools API |

## Auth

Auth: API key (Bearer token). Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/langbase

## License

Apache-2.0
