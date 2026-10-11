# @corsair-dev/celigo

Celigo plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/celigo
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `account.getTokenInfo` | `celigo.api.account.getTokenInfo` | `read` | Get the user id behind the current API token |
| `account.listLicenses` | `celigo.api.account.listLicenses` | `read` | List the account licenses and subscriptions |
| `audit.list` | `celigo.api.audit.list` | `read` | List account audit log entries, newest first |
| `connections.create` | `celigo.api.connections.create` | `write` | Create a connection |
| `connections.delete` | `celigo.api.connections.delete` | `destructive` | Delete a connection |
| `connections.evaluateVirtualImportMap` | `celigo.api.connections.evaluateVirtualImportMap` | `read` | Run only the mapping step of an unsaved import and return the mapped records |
| `connections.executeVirtualExport` | `celigo.api.connections.executeVirtualExport` | `write` | Run an unsaved export definition through a connection |
| `connections.executeVirtualExportPaged` | `celigo.api.connections.executeVirtualExportPaged` | `write` | Run an unsaved export one page at a time. Pass back pagedExportState for the next page |
| `connections.executeVirtualImport` | `celigo.api.connections.executeVirtualImport` | `write` | Send records through an unsaved import definition |
| `connections.get` | `celigo.api.connections.get` | `read` | Get a connection by id |
| `connections.getAudit` | `celigo.api.connections.getAudit` | `read` | List audit log entries for a connection |
| `connections.getDebugLogs` | `celigo.api.connections.getDebugLogs` | `read` | Get the debug log text recorded for a connection |
| `connections.getDependencies` | `celigo.api.connections.getDependencies` | `read` | List resources that depend on a connection |
| `connections.list` | `celigo.api.connections.list` | `read` | List connections in the account |
| `connections.patch` | `celigo.api.connections.patch` | `write` | Apply JSON Patch operations to a connection |
| `connections.ping` | `celigo.api.connections.ping` | `read` | Test that a saved connection can reach its application |
| `connections.testVirtual` | `celigo.api.connections.testVirtual` | `read` | Test an unsaved connection document without storing it |
| `connections.update` | `celigo.api.connections.update` | `write` | Replace a connection document |
| `ediProfiles.list` | `celigo.api.ediProfiles.list` | `read` | List EDI trading partner profiles |
| `errors.assign` | `celigo.api.errors.assign` | `write` | Assign flow step errors to a user by email |
| `errors.deleteResolved` | `celigo.api.errors.deleteResolved` | `destructive` | Purge resolved errors from a flow step |
| `errors.list` | `celigo.api.errors.list` | `read` | List open errors for one export or import step of a flow |
| `errors.listResolved` | `celigo.api.errors.listResolved` | `read` | List resolved errors for one step of a flow |
| `errors.resolve` | `celigo.api.errors.resolve` | `write` | Mark errors on a flow step as resolved |
| `errors.retry` | `celigo.api.errors.retry` | `write` | Retry failed records on a flow step |
| `errors.updateTags` | `celigo.api.errors.updateTags` | `write` | Set tags on flow step errors |
| `exports.clone` | `celigo.api.exports.clone` | `write` | Clone a export, optionally remapping connections |
| `exports.create` | `celigo.api.exports.create` | `write` | Create a export |
| `exports.delete` | `celigo.api.exports.delete` | `destructive` | Delete a export |
| `exports.get` | `celigo.api.exports.get` | `read` | Get a export by id |
| `exports.getAudit` | `celigo.api.exports.getAudit` | `read` | List audit log entries for a export |
| `exports.list` | `celigo.api.exports.list` | `read` | List exports in the account |
| `exports.patch` | `celigo.api.exports.patch` | `write` | Apply JSON Patch operations to a export |
| `exports.update` | `celigo.api.exports.update` | `write` | Replace a export document. Send the full document; omitted fields are cleared |
| `fileDefinitions.create` | `celigo.api.fileDefinitions.create` | `write` | Create a file definition |
| `fileDefinitions.get` | `celigo.api.fileDefinitions.get` | `read` | Get a file definition by id |
| `fileDefinitions.list` | `celigo.api.fileDefinitions.list` | `read` | List EDI and fixed-width file definitions |
| `flows.clone` | `celigo.api.flows.clone` | `write` | Clone a flow, optionally remapping connections |
| `flows.create` | `celigo.api.flows.create` | `write` | Create a flow |
| `flows.delete` | `celigo.api.flows.delete` | `destructive` | Delete a flow |
| `flows.get` | `celigo.api.flows.get` | `read` | Get a flow by id |
| `flows.getAudit` | `celigo.api.flows.getAudit` | `read` | List audit log entries for a flow |
| `flows.getDependencies` | `celigo.api.flows.getDependencies` | `read` | List resources that depend on a flow |
| `flows.getDescendants` | `celigo.api.flows.getDescendants` | `read` | List the exports, imports and tools a flow uses |
| `flows.getLastExportDateTime` | `celigo.api.flows.getLastExportDateTime` | `read` | Get when a flow last exported data |
| `flows.getLatestJobs` | `celigo.api.flows.getLatestJobs` | `read` | Get the most recent jobs for a flow |
| `flows.getTemplate` | `celigo.api.flows.getTemplate` | `read` | Get a signed URL to download a flow as a template zip |
| `flows.list` | `celigo.api.flows.list` | `read` | List flows in the account |
| `flows.patch` | `celigo.api.flows.patch` | `write` | Apply JSON Patch operations to a flow |
| `flows.update` | `celigo.api.flows.update` | `write` | Replace a flow document. Send the full document; omitted fields are cleared |
| `iClients.create` | `celigo.api.iClients.create` | `write` | Create an iClient |
| `iClients.delete` | `celigo.api.iClients.delete` | `destructive` | Delete an iClient |
| `iClients.get` | `celigo.api.iClients.get` | `read` | Get an iClient by id |
| `iClients.list` | `celigo.api.iClients.list` | `read` | List iClients (stored OAuth app credentials) |
| `iClients.patch` | `celigo.api.iClients.patch` | `write` | Patch an iClient. Celigo only allows replacing /oauth2/failPath |
| `iClients.update` | `celigo.api.iClients.update` | `write` | Replace an iClient document |
| `imports.clone` | `celigo.api.imports.clone` | `write` | Clone a import, optionally remapping connections |
| `imports.create` | `celigo.api.imports.create` | `write` | Create a import |
| `imports.delete` | `celigo.api.imports.delete` | `destructive` | Delete a import |
| `imports.get` | `celigo.api.imports.get` | `read` | Get a import by id |
| `imports.getAudit` | `celigo.api.imports.getAudit` | `read` | List audit log entries for a import |
| `imports.getDependencies` | `celigo.api.imports.getDependencies` | `read` | List resources that depend on a import |
| `imports.invoke` | `celigo.api.imports.invoke` | `write` | Run a saved import against the given records |
| `imports.list` | `celigo.api.imports.list` | `read` | List imports in the account |
| `imports.patch` | `celigo.api.imports.patch` | `write` | Apply JSON Patch operations to a import |
| `imports.update` | `celigo.api.imports.update` | `write` | Replace a import document. Send the full document; omitted fields are cleared |
| `integrations.clone` | `celigo.api.integrations.clone` | `write` | Clone a integration, optionally remapping connections |
| `integrations.create` | `celigo.api.integrations.create` | `write` | Create a integration |
| `integrations.createRevision` | `celigo.api.integrations.createRevision` | `write` | Snapshot an integration as a new revision |
| `integrations.delete` | `celigo.api.integrations.delete` | `destructive` | Delete a integration |
| `integrations.get` | `celigo.api.integrations.get` | `read` | Get a integration by id |
| `integrations.getAudit` | `celigo.api.integrations.getAudit` | `read` | List audit log entries for a integration |
| `integrations.getDependencies` | `celigo.api.integrations.getDependencies` | `read` | List resources that depend on a integration |
| `integrations.getTemplate` | `celigo.api.integrations.getTemplate` | `read` | Get a signed URL to download an integration as a template zip |
| `integrations.list` | `celigo.api.integrations.list` | `read` | List integrations in the account |
| `integrations.listConnections` | `celigo.api.integrations.listConnections` | `read` | List the connections registered to an integration |
| `integrations.listErrors` | `celigo.api.integrations.listErrors` | `read` | Get open error counts per flow in an integration |
| `integrations.listExports` | `celigo.api.integrations.listExports` | `read` | List the exports in an integration |
| `integrations.listFlows` | `celigo.api.integrations.listFlows` | `read` | List the flows in an integration |
| `integrations.listImports` | `celigo.api.integrations.listImports` | `read` | List the imports in an integration |
| `integrations.listUsers` | `celigo.api.integrations.listUsers` | `read` | List the users shared on an integration |
| `integrations.patch` | `celigo.api.integrations.patch` | `write` | Apply JSON Patch operations to a integration |
| `integrations.registerConnection` | `celigo.api.integrations.registerConnection` | `write` | Register a connection to an integration |
| `integrations.registerConnections` | `celigo.api.integrations.registerConnections` | `write` | Register connections to an integration, one per request body (_connectionId) |
| `integrations.unregisterConnection` | `celigo.api.integrations.unregisterConnection` | `destructive` | Unregister a connection from an integration |
| `integrations.update` | `celigo.api.integrations.update` | `write` | Replace a integration document. Send the full document; omitted fields are cleared |
| `jobs.getErrors` | `celigo.api.jobs.getErrors` | `read` | Get the errors of a job (up to 1000) |
| `jobs.list` | `celigo.api.jobs.list` | `read` | List jobs filtered by flow, integration, status, type or date |
| `processors.generateStructuredFile` | `celigo.api.processors.generateStructuredFile` | `read` | Render JSON records as delimited or fixed-width text |
| `processors.parseCsv` | `celigo.api.processors.parseCsv` | `read` | Parse CSV text into JSON records |
| `processors.parseStructuredFile` | `celigo.api.processors.parseStructuredFile` | `read` | Parse EDI or fixed-width text into JSON using a file definition |
| `processors.parseXml` | `celigo.api.processors.parseXml` | `read` | Parse XML text into JSON records |
| `scripts.create` | `celigo.api.scripts.create` | `write` | Create a JavaScript hook script |
| `scripts.delete` | `celigo.api.scripts.delete` | `destructive` | Delete a script |
| `scripts.get` | `celigo.api.scripts.get` | `read` | Get a script by id |
| `scripts.getLogs` | `celigo.api.scripts.getLogs` | `read` | Get execution logs written by a script |
| `scripts.update` | `celigo.api.scripts.update` | `write` | Replace a script |
| `state.delete` | `celigo.api.state.delete` | `destructive` | Delete a global state key |
| `state.deleteAll` | `celigo.api.state.deleteAll` | `destructive` | Delete every global state key |
| `state.deleteAllForResource` | `celigo.api.state.deleteAllForResource` | `destructive` | Delete every state key on an export, import or integration |
| `state.deleteForResource` | `celigo.api.state.deleteForResource` | `destructive` | Delete a state key on an export, import or integration |
| `state.get` | `celigo.api.state.get` | `read` | Get the value stored under a global state key |
| `state.getForResource` | `celigo.api.state.getForResource` | `read` | Get a state value stored on an export, import or integration |
| `state.list` | `celigo.api.state.list` | `read` | List global state keys |
| `state.listForResource` | `celigo.api.state.listForResource` | `read` | List state keys stored on an export, import or integration |
| `state.set` | `celigo.api.state.set` | `write` | Create or replace the value under a global state key |
| `state.setForResource` | `celigo.api.state.setForResource` | `write` | Create or replace a state value on an export, import or integration |
| `tags.create` | `celigo.api.tags.create` | `write` | Create an error tag |
| `tags.delete` | `celigo.api.tags.delete` | `destructive` | Delete an error tag |
| `tags.get` | `celigo.api.tags.get` | `read` | Get an error tag by id |
| `tags.list` | `celigo.api.tags.list` | `read` | List error tags |
| `tags.update` | `celigo.api.tags.update` | `write` | Rename an error tag |
| `users.delete` | `celigo.api.users.delete` | `destructive` | Remove a user from the account |
| `users.get` | `celigo.api.users.get` | `read` | Get a user share by id |
| `users.invite` | `celigo.api.users.invite` | `write` | Invite one user by email with account or integration access |
| `users.inviteMultiple` | `celigo.api.users.inviteMultiple` | `write` | Invite several users by email with the same access |
| `users.list` | `celigo.api.users.list` | `read` | List users the account is shared with |
| `users.update` | `celigo.api.users.update` | `write` | Change a user share access level |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/celigo

## License

Apache-2.0
