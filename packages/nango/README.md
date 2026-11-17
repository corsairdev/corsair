# @corsair-dev/nango

Nango plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/nango
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `actions.trigger` | `nango.api.actions.trigger` | `destructive` | Run a legacy action for a connection synchronously. Actions can write to the end customer's account. |
| `connections.delete` | `nango.api.connections.delete` | `destructive` | Delete a connection and its stored credentials. |
| `connections.get` | `nango.api.connections.get` | `read` | Get one connection. Pass include_credentials: true to also return its live third-party credentials (access token, API key, password); they are dropped otherwise. |
| `connections.import` | `nango.api.connections.import` | `destructive` | Create a connection from credentials you already hold, or overwrite an existing connection's credentials when connection_id matches. The credentials are not returned. |
| `connections.list` | `nango.api.connections.list` | `read` | List connections (no credentials), filtered by connection ID or tags, with page and limit. |
| `connections.patch` | `nango.api.connections.patch` | `write` | Edit a connection: replace its tags or set a webhook URL override. |
| `connections.setMetadata` | `nango.api.connections.setMetadata` | `destructive` | Replace the whole metadata object of one or more connections; keys not passed are removed. |
| `connections.updateMetadata` | `nango.api.connections.updateMetadata` | `write` | Merge keys into the metadata of one or more connections. |
| `environment.getVariables` | `nango.api.environment.getVariables` | `read` | Get the environment variables set in the Nango dashboard, values in plain text (they often hold secrets). |
| `functions.delete` | `nango.api.functions.delete` | `destructive` | Delete a deployed function, e.g. a catalog sync enabled in the dashboard; functions deployed from a repo with the nango CLI cannot be deleted here. |
| `functions.get` | `nango.api.functions.get` | `read` | Get one function of an integration, with its schema and deployment state. |
| `functions.getCode` | `nango.api.functions.getCode` | `read` | Get a function's TypeScript source code. |
| `functions.list` | `nango.api.functions.list` | `read` | List an integration's functions (syncs, tools, on-event functions), including Nango catalog tools. |
| `integrations.create` | `nango.api.integrations.create` | `write` | Create an integration for a provider, optionally with developer app credentials or integration_config. |
| `integrations.delete` | `nango.api.integrations.delete` | `destructive` | Delete an integration and every connection that uses it. |
| `integrations.get` | `nango.api.integrations.get` | `read` | Get an integration. include: ["credentials"] also returns the developer app client secret and private key. |
| `integrations.list` | `nango.api.integrations.list` | `read` | List the integrations configured in this environment. |
| `integrations.update` | `nango.api.integrations.update` | `write` | Edit an integration; fields left out keep their value. |
| `providers.get` | `nango.api.providers.get` | `read` | Get one provider's auth mode, proxy settings and required connection fields. |
| `providers.list` | `nango.api.providers.list` | `read` | List the APIs Nango supports; filter with search (the full list has over 1,000). |
| `proxy.delete` | `nango.api.proxy.delete` | `destructive` | Send a DELETE through Nango's proxy to the end customer's API with the connection's credentials. |
| `proxy.get` | `nango.api.proxy.get` | `read` | Send a GET through Nango's proxy to the end customer's API with the connection's credentials. |
| `proxy.patch` | `nango.api.proxy.patch` | `destructive` | Send a PATCH through Nango's proxy to the end customer's API with the connection's credentials. |
| `proxy.post` | `nango.api.proxy.post` | `destructive` | Send a POST through Nango's proxy to the end customer's API with the connection's credentials. |
| `proxy.put` | `nango.api.proxy.put` | `destructive` | Send a PUT through Nango's proxy to the end customer's API with the connection's credentials. |
| `records.list` | `nango.api.records.list` | `read` | List the records a sync stored for a connection and model, paginated with next_cursor. |
| `scripts.getConfig` | `nango.api.scripts.getConfig` | `read` | Get the configuration of every deployed function in the environment, in Nango or OpenAI tool format. |
| `sessions.create` | `nango.api.sessions.create` | `write` | Create a Connect session; returns a short-lived token and a connect link an end user opens to authorize an integration. |
| `sessions.reconnect` | `nango.api.sessions.reconnect` | `write` | Create a Connect session that re-authorizes an existing connection, keeping its connection ID. |
| `syncs.pause` | `nango.api.syncs.pause` | `write` | Pause the schedule of syncs for one connection or all. |
| `syncs.start` | `nango.api.syncs.start` | `write` | Start the schedule of syncs for one connection or all; they run now and then on their frequency. |
| `syncs.status` | `nango.api.syncs.status` | `read` | Get the status, schedule, last result and record counts of syncs. |
| `syncs.trigger` | `nango.api.syncs.trigger` | `write` | Run syncs once now, for one connection or all; reset starts from scratch. |
| `syncs.updateFrequency` | `nango.api.syncs.updateFrequency` | `write` | Override a sync's frequency for one connection, or restore the default with null. |
| `tools.call` | `nango.api.tools.call` | `destructive` | Call a deployed tool for a connection and return its output. Tools can write to the end customer's account. |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/nango

## License

Apache-2.0
