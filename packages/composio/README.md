# @corsair-dev/composio

Composio plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/composio
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `connections.create` | `composio.api.connections.create` | `write` | Create a connected-account auth link |
| `connections.delete` | `composio.api.connections.delete` | `destructive` | Delete a connected account |
| `connections.list` | `composio.api.connections.list` | `read` | List connected accounts |
| `meta.checkActiveConnection` | `composio.api.meta.checkActiveConnection` | `read` | COMPOSIO_CHECK_ACTIVE_CONNECTION: check one connection |
| `meta.checkActiveConnections` | `composio.api.meta.checkActiveConnections` | `read` | COMPOSIO_CHECK_ACTIVE_CONNECTIONS: check many connections |
| `meta.createPlan` | `composio.api.meta.createPlan` | `read` | COMPOSIO_CREATE_PLAN: plan a multi-step workflow |
| `meta.enableTrigger` | `composio.api.meta.enableTrigger` | `write` | COMPOSIO_ENABLE_TRIGGER: enable a trigger on an account |
| `meta.executeTool` | `composio.api.meta.executeTool` | `write` | COMPOSIO_EXECUTE_TOOL: run one tool |
| `meta.getDependencyGraph` | `composio.api.meta.getDependencyGraph` | `read` | COMPOSIO_GET_DEPENDENCY_GRAPH: tools a tool depends on |
| `meta.getRequiredParameters` | `composio.api.meta.getRequiredParameters` | `read` | COMPOSIO_GET_REQUIRED_PARAMETERS: auth fields of a toolkit |
| `meta.getResponseSchema` | `composio.api.meta.getResponseSchema` | `read` | COMPOSIO_GET_RESPONSE_SCHEMA: output schema of a tool |
| `meta.getToolSchemas` | `composio.api.meta.getToolSchemas` | `read` | COMPOSIO_GET_TOOL_SCHEMAS: input schemas by slug |
| `meta.initiateConnection` | `composio.api.meta.initiateConnection` | `write` | COMPOSIO_INITIATE_CONNECTION: start connecting a toolkit |
| `meta.listToolkits` | `composio.api.meta.listToolkits` | `read` | COMPOSIO_LIST_TOOLKITS: list toolkits |
| `meta.listTriggers` | `composio.api.meta.listTriggers` | `read` | COMPOSIO_LIST_TRIGGERS: list trigger types |
| `meta.manageConnections` | `composio.api.meta.manageConnections` | `write` | COMPOSIO_MANAGE_CONNECTIONS: check or connect toolkits |
| `meta.multiExecuteTool` | `composio.api.meta.multiExecuteTool` | `write` | COMPOSIO_MULTI_EXECUTE_TOOL: run tools in parallel |
| `meta.remoteBashTool` | `composio.api.meta.remoteBashTool` | `write` | COMPOSIO_REMOTE_BASH_TOOL: run bash in the sandbox |
| `meta.remoteWorkbench` | `composio.api.meta.remoteWorkbench` | `write` | COMPOSIO_REMOTE_WORKBENCH: run Python in the sandbox |
| `meta.searchTools` | `composio.api.meta.searchTools` | `read` | COMPOSIO_SEARCH_TOOLS: find tools for a use case |
| `meta.waitForConnection` | `composio.api.meta.waitForConnection` | `read` | COMPOSIO_WAIT_FOR_CONNECTION: wait until toolkits connect |
| `meta.waitForConnections` | `composio.api.meta.waitForConnections` | `read` | COMPOSIO_WAIT_FOR_CONNECTIONS: wait inside a session |
| `sessions.create` | `composio.api.sessions.create` | `write` | Create a tool router session for a user |
| `toolkits.list` | `composio.api.toolkits.list` | `read` | List toolkits |
| `tools.execute` | `composio.api.tools.execute` | `write` | Execute a tool by slug |
| `tools.get` | `composio.api.tools.get` | `read` | Get a tool by slug |
| `tools.list` | `composio.api.tools.list` | `read` | List Composio tools |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/composio

## License

Apache-2.0
