# @corsair-dev/grist

Grist plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/grist
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `attachments.get` | `grist.api.attachments.get` | `read` | Get metadata for a specific attachment in a document |
| `attachments.getTransferStatus` | `grist.api.attachments.getTransferStatus` | `read` | Get current attachment transfer status for an external store |
| `attachments.list` | `grist.api.attachments.list` | `read` | List metadata for attachments stored in a document |
| `attachments.removeUnused` | `grist.api.attachments.removeUnused` | `destructive` | Delete unused attachments from a document |
| `attachments.updateUsed` | `grist.api.attachments.updateUsed` | `write` | Update attachment usage tracking in a document |
| `attachments.verifyFiles` | `grist.api.attachments.verifyFiles` | `read` | Verify attachment file integrity for a document |
| `columns.add` | `grist.api.columns.add` | `write` | Add new columns to a table in a document |
| `columns.delete` | `grist.api.columns.delete` | `destructive` | Delete a column from a table |
| `columns.list` | `grist.api.columns.list` | `read` | List columns and metadata for a table |
| `columns.replace` | `grist.api.columns.replace` | `write` | Add or update column definitions in a table |
| `columns.update` | `grist.api.columns.update` | `write` | Modify column configurations or labels in a table |
| `docs.copy` | `grist.api.docs.copy` | `write` | Copy a document to a workspace |
| `docs.create` | `grist.api.docs.create` | `write` | Create a new Grist document or copy from a template |
| `docs.createInWorkspace` | `grist.api.docs.createInWorkspace` | `write` | Create an empty document inside a specific workspace |
| `docs.delete` | `grist.api.docs.delete` | `destructive` | Permanently delete a document |
| `docs.fork` | `grist.api.docs.fork` | `write` | Fork a document into a new unsaved document |
| `docs.get` | `grist.api.docs.get` | `read` | Describe document metadata and containing workspace |
| `docs.listAccess` | `grist.api.docs.listAccess` | `read` | List users with access permissions to a document |
| `docs.listSnapshots` | `grist.api.docs.listSnapshots` | `read` | List historical snapshots of a document |
| `docs.modifyAccess` | `grist.api.docs.modifyAccess` | `write` | Change user access permissions for a document |
| `docs.move` | `grist.api.docs.move` | `write` | Move a document to a different workspace |
| `docs.pin` | `grist.api.docs.pin` | `write` | Pin a document for quick access |
| `docs.remove` | `grist.api.docs.remove` | `destructive` | Move a document to the trash |
| `docs.removeSnapshots` | `grist.api.docs.removeSnapshots` | `destructive` | Remove historical snapshots of a document |
| `docs.unpin` | `grist.api.docs.unpin` | `write` | Unpin a document |
| `docs.unremove` | `grist.api.docs.unremove` | `write` | Restore a document from the trash |
| `docs.update` | `grist.api.docs.update` | `write` | Modify document metadata such as name or pin status |
| `orgs.delete` | `grist.api.orgs.delete` | `destructive` | Delete an organization by ID and confirmed name |
| `orgs.get` | `grist.api.orgs.get` | `read` | Describe details of a specific organization |
| `orgs.getUsage` | `grist.api.orgs.getUsage` | `read` | Get organization resource and storage usage summary |
| `orgs.list` | `grist.api.orgs.list` | `read` | List organizations accessible to the authenticated user |
| `orgs.listAccess` | `grist.api.orgs.listAccess` | `read` | List users with access permissions to an organization |
| `orgs.modifyAccess` | `grist.api.orgs.modifyAccess` | `write` | Change user access roles for an organization |
| `orgs.update` | `grist.api.orgs.update` | `write` | Modify organization metadata such as its name |
| `profile.createApiKey` | `grist.api.profile.createApiKey` | `write` | Create or regenerate user API key |
| `profile.deleteApiKey` | `grist.api.profile.deleteApiKey` | `destructive` | Delete user API key |
| `profile.get` | `grist.api.profile.get` | `read` | Get current authenticated user profile |
| `profile.getApiKey` | `grist.api.profile.getApiKey` | `read` | Get the current user API key |
| `profile.updateLocale` | `grist.api.profile.updateLocale` | `write` | Update user locale preference |
| `profile.updateName` | `grist.api.profile.updateName` | `write` | Update user display name |
| `records.add` | `grist.api.records.add` | `write` | Add new records with field values to a table |
| `records.delete` | `grist.api.records.delete` | `destructive` | Delete records by record IDs from a table |
| `records.list` | `grist.api.records.list` | `read` | Fetch records from a table with filtering and sorting |
| `records.replace` | `grist.api.records.replace` | `write` | Add or update records matching require criteria (upsert) |
| `records.update` | `grist.api.records.update` | `write` | Modify existing records by record ID in a table |
| `serviceAccounts.create` | `grist.api.serviceAccounts.create` | `write` | Create a new service account with an API key |
| `serviceAccounts.delete` | `grist.api.serviceAccounts.delete` | `destructive` | Delete a service account |
| `serviceAccounts.deleteApiKey` | `grist.api.serviceAccounts.deleteApiKey` | `destructive` | Delete a service account API key |
| `serviceAccounts.get` | `grist.api.serviceAccounts.get` | `read` | Get service account details by ID |
| `serviceAccounts.list` | `grist.api.serviceAccounts.list` | `read` | List all service accounts owned by the user |
| `serviceAccounts.regenerateApiKey` | `grist.api.serviceAccounts.regenerateApiKey` | `write` | Generate a new API key for a service account |
| `serviceAccounts.update` | `grist.api.serviceAccounts.update` | `write` | Modify service account name or label |
| `session.getActive` | `grist.api.session.getActive` | `read` | Get active session details and current organization |
| `session.getAll` | `grist.api.session.getAll` | `read` | Get all logged-in session accounts and organizations |
| `session.setActive` | `grist.api.session.setActive` | `write` | Switch active user account for an organization |
| `sql.query` | `grist.api.sql.query` | `read` | Execute a read-only SQL query with parameters against a document |
| `sql.queryGet` | `grist.api.sql.queryGet` | `read` | Execute a simple read-only SQL query via GET against a document |
| `tables.create` | `grist.api.tables.create` | `write` | Add new tables and their column definitions to a document |
| `tables.list` | `grist.api.tables.list` | `read` | List tables within a Grist document |
| `tables.update` | `grist.api.tables.update` | `write` | Modify table identifiers or on-demand loading settings |
| `templates.get` | `grist.api.templates.get` | `read` | Get details of a specific document template |
| `templates.list` | `grist.api.templates.list` | `read` | List available document templates from the catalog |
| `users.delete` | `grist.api.users.delete` | `destructive` | Delete a user from Grist |
| `users.disable` | `grist.api.users.disable` | `write` | Disable a user account in Grist |
| `users.enable` | `grist.api.users.enable` | `write` | Enable a previously disabled user account |
| `widgets.list` | `grist.api.widgets.list` | `read` | List available custom widgets from the gallery |
| `workspaces.create` | `grist.api.workspaces.create` | `write` | Create a new empty workspace in an organization |
| `workspaces.delete` | `grist.api.workspaces.delete` | `destructive` | Permanently delete a workspace |
| `workspaces.get` | `grist.api.workspaces.get` | `read` | Describe a workspace and its documents |
| `workspaces.list` | `grist.api.workspaces.list` | `read` | List workspaces and their documents within an organization |
| `workspaces.listAccess` | `grist.api.workspaces.listAccess` | `read` | List users with access permissions to a workspace |
| `workspaces.modifyAccess` | `grist.api.workspaces.modifyAccess` | `write` | Change user access permissions for a workspace |
| `workspaces.remove` | `grist.api.workspaces.remove` | `destructive` | Move a workspace to the trash |
| `workspaces.unremove` | `grist.api.workspaces.unremove` | `write` | Restore a workspace from the trash |
| `workspaces.update` | `grist.api.workspaces.update` | `write` | Modify workspace name or settings |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/grist

## License

Apache-2.0
