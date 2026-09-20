# @corsair-dev/hookdeck

Hookdeck plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/hookdeck
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `connections.list` | `hookdeck.api.connections.list` | `read` | List all connections |
| `connections.create` | `hookdeck.api.connections.create` | `write` | Create a new connection |
| `connections.get` | `hookdeck.api.connections.get` | `read` | Get a connection by ID |
| `connections.update` | `hookdeck.api.connections.update` | `write` | Update an existing connection |
| `connections.delete` | `hookdeck.api.connections.delete` | `write` | Delete a connection |

## Auth

Auth: API key, OAuth 2.0 (default API key). Set `authType` on the plugin factory to pick one.

## Webhooks

Handles 1 webhook event. See the reference for payloads and `webhookHooks`.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/hookdeck

## License

Apache-2.0
