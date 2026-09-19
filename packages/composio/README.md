# @corsair-dev/composio

Composio plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/composio
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `actions.execute` | `composio.api.actions.execute` | `write` | Execute a tool by slug |
| `actions.get` | `composio.api.actions.get` | `read` | Get a tool by slug (alias of tools.get) |
| `actions.list` | `composio.api.actions.list` | `read` | List tools for a toolkit (alias of tools.list) |
| `apps.list` | `composio.api.apps.list` | `read` | List toolkits (apps) |
| `connections.create` | `composio.api.connections.create` | `write` | Create a connected-account auth link |
| `connections.delete` | `composio.api.connections.delete` | `write` | Delete a connected account |
| `connections.list` | `composio.api.connections.list` | `read` | List connected accounts |
| `tools.get` | `composio.api.tools.get` | `read` | Get a tool by slug |
| `tools.list` | `composio.api.tools.list` | `read` | List executable Composio tools (v3) |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

Handles 2 webhook events. See the reference for payloads and `webhookHooks`.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/composio

## License

Apache-2.0
