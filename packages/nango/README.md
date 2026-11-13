# @corsair-dev/nango

Nango plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/nango
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `connections.delete` | `nango.api.connections.delete` | `destructive` | Delete a connection |
| `connections.get` | `nango.api.connections.get` | `read` | Get a connection and its credentials |
| `connections.import` | `nango.api.connections.import` | `write` | Import or update a connection with existing credentials |
| `connections.list` | `nango.api.connections.list` | `read` | List connections |
| `connections.patch` | `nango.api.connections.patch` | `write` | Edit a connection |
| `connections.setMetadata` | `nango.api.connections.setMetadata` | `write` | Replace connection metadata |
| `connections.updateMetadata` | `nango.api.connections.updateMetadata` | `write` | Update connection metadata |
| `sessions.create` | `nango.api.sessions.create` | `write` | Create a connect session |
| `sessions.delete` | `nango.api.sessions.delete` | `destructive` | Delete a connect session using its token |
| `sessions.get` | `nango.api.sessions.get` | `read` | Get a connect session using its token |
| `sessions.reconnect` | `nango.api.sessions.reconnect` | `write` | Create a reconnect session |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

Connection operations and session creation require a scoped environment API key.
`sessions.get` and `sessions.delete` instead take the short-lived Connect session
token as `session_token`; they do not require an environment key. Connection
retrieval can return sensitive credentials. `connections.list` supports `page`,
`limit`, and `tags` filters.

## Webhooks

No webhooks.

Webhook ingestion and Nango's environment, integration, function, sync, tool,
proxy, and provider APIs are not included. Requests are not automatically retried.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/nango

## License

Apache-2.0
