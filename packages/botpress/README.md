# @corsair-dev/botpress

Botpress plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/botpress
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `account.get` | `botpress.api.account.get` | `read` | Get the authenticated account |
| `account.getPreference` | `botpress.api.account.getPreference` | `read` | Get an account preference by key |
| `account.setPreference` | `botpress.api.account.setPreference` | `write` | Set an account preference by key |
| `account.update` | `botpress.api.account.update` | `write` | Update the authenticated account profile |
| `billing.chargeUnpaidInvoices` | `botpress.api.billing.chargeUnpaidInvoices` | `destructive` | Charge outstanding invoices for a workspace [DESTRUCTIVE - real financial action] |
| `billing.getUpcomingInvoice` | `botpress.api.billing.getUpcomingInvoice` | `read` | Preview the upcoming invoice for a workspace |
| `billing.listInvoices` | `botpress.api.billing.listInvoices` | `read` | List invoices billed to a workspace |
| `billing.listUsageHistory` | `botpress.api.billing.listUsageHistory` | `read` | List usage history for a workspace or bot |
| `bots.create` | `botpress.api.bots.create` | `write` | Create a bot in a workspace |
| `bots.listActionRuns` | `botpress.api.bots.listActionRuns` | `read` | List a bot's action-run history |
| `bots.listIssues` | `botpress.api.bots.listIssues` | `read` | List configuration and runtime issues for a bot |
| `bots.update` | `botpress.api.bots.update` | `write` | Update a bot |
| `chat.createConversation` | `botpress.api.chat.createConversation` | `write` | Create a conversation on a channel |
| `chat.listConversations` | `botpress.api.chat.listConversations` | `read` | List a bot's conversations |
| `chat.sendMessage` | `botpress.api.chat.sendMessage` | `write` | Send a message into a conversation |
| `chat.updateWorkflow` | `botpress.api.chat.updateWorkflow` | `write` | Update a workflow's status, output or failure reason |
| `files.delete` | `botpress.api.files.delete` | `destructive` | Delete a file from a bot's storage [DESTRUCTIVE] |
| `files.listTags` | `botpress.api.files.listTags` | `read` | List tags used across a bot's files |
| `files.listTagValues` | `botpress.api.files.listTagValues` | `read` | List all values seen for a given file tag |
| `hub.getDereferencedPluginById` | `botpress.api.hub.getDereferencedPluginById` | `read` | Get a public plugin with interface entity references resolved |
| `hub.getIntegration` | `botpress.api.hub.getIntegration` | `read` | Get a public integration by name and version |
| `hub.getIntegrationById` | `botpress.api.hub.getIntegrationById` | `read` | Get a public integration by id |
| `hub.getInterface` | `botpress.api.hub.getInterface` | `read` | Get a public interface by name and version |
| `hub.getInterfaceById` | `botpress.api.hub.getInterfaceById` | `read` | Get a public interface by id |
| `hub.getPlugin` | `botpress.api.hub.getPlugin` | `read` | Get a public plugin by name and version |
| `hub.getPluginById` | `botpress.api.hub.getPluginById` | `read` | Get a public plugin by id |
| `hub.getPluginCode` | `botpress.api.hub.getPluginCode` | `read` | Get a public plugin's source code for a platform |
| `hub.listIntegrations` | `botpress.api.hub.listIntegrations` | `read` | List public integrations in the hub |
| `hub.listInterfaces` | `botpress.api.hub.listInterfaces` | `read` | List public interfaces in the hub |
| `hub.listPlugins` | `botpress.api.hub.listPlugins` | `read` | List public plugins in the hub |
| `integrations.create` | `botpress.api.integrations.create` | `write` | Create an integration in a workspace |
| `integrations.deleteShareableId` | `botpress.api.integrations.deleteShareableId` | `destructive` | Delete the shareable id for a bot-integration pair [DESTRUCTIVE] |
| `integrations.get` | `botpress.api.integrations.get` | `read` | Get an integration by id |
| `integrations.list` | `botpress.api.integrations.list` | `read` | List integrations owned by the workspace |
| `integrations.listApiKeys` | `botpress.api.integrations.listApiKeys` | `read` | List Integration API Keys (IAKs) for an integration |
| `integrations.requestVerification` | `botpress.api.integrations.requestVerification` | `write` | Submit an integration for verification |
| `integrations.validateUpdate` | `botpress.api.integrations.validateUpdate` | `read` | Validate that an integration update would succeed |
| `knowledgeBases.delete` | `botpress.api.knowledgeBases.delete` | `destructive` | Permanently delete a knowledge base [DESTRUCTIVE] |
| `knowledgeBases.list` | `botpress.api.knowledgeBases.list` | `read` | List a bot's knowledge bases |
| `plugins.list` | `botpress.api.plugins.list` | `read` | List plugins installed in the workspace |
| `tools.getTableRow` | `botpress.api.tools.getTableRow` | `read` | Fetch a single row from a table by id |
| `tools.runVrl` | `botpress.api.tools.runVrl` | `write` | Execute a VRL script against input data |
| `workspaces.breakDownUsageByBot` | `botpress.api.workspaces.breakDownUsageByBot` | `read` | Break down a workspace's usage of a quota type by bot |
| `workspaces.checkHandleAvailability` | `botpress.api.workspaces.checkHandleAvailability` | `read` | Check whether a workspace handle is available |
| `workspaces.create` | `botpress.api.workspaces.create` | `write` | Create a workspace |
| `workspaces.delete` | `botpress.api.workspaces.delete` | `destructive` | Permanently delete a workspace [DESTRUCTIVE] |
| `workspaces.get` | `botpress.api.workspaces.get` | `read` | Get a workspace by id |
| `workspaces.getAllQuotaCompletion` | `botpress.api.workspaces.getAllQuotaCompletion` | `read` | Get the highest quota completion rate for every workspace |
| `workspaces.getQuota` | `botpress.api.workspaces.getQuota` | `read` | Get a workspace's usage against a quota type |
| `workspaces.list` | `botpress.api.workspaces.list` | `read` | List workspaces owned by the account |
| `workspaces.listPublic` | `botpress.api.workspaces.listPublic` | `read` | List public workspaces |
| `workspaces.setPreference` | `botpress.api.workspaces.setPreference` | `write` | Set a workspace preference by key |
| `workspaces.update` | `botpress.api.workspaces.update` | `write` | Update workspace settings |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/botpress

## License

Apache-2.0
