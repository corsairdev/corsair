# @corsair-dev/composio

Composio plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/composio
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `tools.list` | `composio.api.tools.list` | `read` | List executable Composio tools (v3) |
| `tools.get` | `composio.api.tools.get` | `read` | Get a tool by slug |
| `actions.list` | `composio.api.actions.list` | `read` | List tools for a toolkit (alias of tools.list) |
| `actions.get` | `composio.api.actions.get` | `read` | Get a tool by slug (alias of tools.get) |
| `actions.execute` | `composio.api.actions.execute` | `write` | Execute a tool by slug |
| `connections.list` | `composio.api.connections.list` | `read` | List connected accounts |
| `connections.create` | `composio.api.connections.create` | `write` | Create a connected-account auth link |
| `connections.delete` | `composio.api.connections.delete` | `write` | Delete a connected account |
| `apps.list` | `composio.api.apps.list` | `read` | List toolkits (apps) |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

| Event | Description |
|-------|-------------|
| `triggers.message` | Composio trigger fired (`composio.trigger.message`) |
| `triggers.projectEvent` | Other project events (e.g. connection lifecycle) |

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/composio

## License

Apache-2.0
