# @corsair-dev/coda

Coda plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/coda
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `account.getMutationStatus` | `coda.api.account.getMutationStatus` | `read` | Check whether an asynchronous mutation has been applied |
| `account.resolveBrowserLink` | `coda.api.account.resolveBrowserLink` | `read` | Resolve a Coda browser URL to the API object it points at |
| `account.whoami` | `coda.api.account.whoami` | `read` | Get info about the user that owns the API token |
| `analytics.getDocsSummary` | `coda.api.analytics.getDocsSummary` | `read` | Get a summary of doc analytics |
| `analytics.getLastUpdated` | `coda.api.analytics.getLastUpdated` | `read` | Get the days analytics were last updated |
| `analytics.getPacksSummary` | `coda.api.analytics.getPacksSummary` | `read` | Get a summary of Pack analytics |
| `analytics.listDocs` | `coda.api.analytics.listDocs` | `read` | List analytics for docs |
| `analytics.listPackFormulas` | `coda.api.analytics.listPackFormulas` | `read` | List analytics for the formulas of a Pack |
| `analytics.listPacks` | `coda.api.analytics.listPacks` | `read` | List analytics for Packs the user can edit |
| `analytics.listPages` | `coda.api.analytics.listPages` | `read` | List page-level analytics for a doc |
| `automations.trigger` | `coda.api.automations.trigger` | `write` | Trigger a webhook-invoked automation in a doc |
| `categories.list` | `coda.api.categories.list` | `read` | List the categories available for docs |
| `columns.get` | `coda.api.columns.get` | `read` | Get details about a column |
| `columns.list` | `coda.api.columns.list` | `read` | List columns in a table |
| `controls.get` | `coda.api.controls.get` | `read` | Get a control and its value |
| `controls.list` | `coda.api.controls.list` | `read` | List controls in a doc |
| `docs.copy` | `coda.api.docs.copy` | `write` | Create a copy of an existing doc |
| `docs.create` | `coda.api.docs.create` | `write` | Create a new doc |
| `docs.delete` | `coda.api.docs.delete` | `destructive` | Permanently delete a doc |
| `docs.get` | `coda.api.docs.get` | `read` | Get metadata for a doc |
| `docs.list` | `coda.api.docs.list` | `read` | List docs the user can access |
| `docs.publish` | `coda.api.docs.publish` | `write` | Publish a doc or update its publish settings |
| `docs.unpublish` | `coda.api.docs.unpublish` | `destructive` | Unpublish a doc |
| `docs.update` | `coda.api.docs.update` | `write` | Update the title or icon of a doc |
| `domains.add` | `coda.api.domains.add` | `write` | Add a custom domain to a published doc |
| `domains.delete` | `coda.api.domains.delete` | `destructive` | Remove a custom domain from a published doc |
| `domains.getProvider` | `coda.api.domains.getProvider` | `read` | Identify the registrar of a custom domain |
| `domains.list` | `coda.api.domains.list` | `read` | List custom domains of a published doc |
| `domains.update` | `coda.api.domains.update` | `write` | Update a custom domain of a published doc |
| `folders.create` | `coda.api.folders.create` | `write` | Create a folder in a workspace |
| `folders.delete` | `coda.api.folders.delete` | `destructive` | Delete a folder |
| `folders.get` | `coda.api.folders.get` | `read` | Get metadata about a folder |
| `folders.list` | `coda.api.folders.list` | `read` | List folders the user can access |
| `folders.update` | `coda.api.folders.update` | `write` | Update the name or description of a folder |
| `formulas.get` | `coda.api.formulas.get` | `read` | Get a named formula and its value |
| `formulas.list` | `coda.api.formulas.list` | `read` | List named formulas in a doc |
| `packAssets.upload` | `coda.api.packAssets.upload` | `write` | Get a signed URL to upload a Pack asset |
| `packAssets.uploadComplete` | `coda.api.packAssets.uploadComplete` | `write` | Mark the upload of a Pack asset as complete |
| `packCategories.add` | `coda.api.packCategories.add` | `write` | Add a publishing category to a Pack |
| `packCategories.delete` | `coda.api.packCategories.delete` | `destructive` | Remove a publishing category from a Pack |
| `packCategories.list` | `coda.api.packCategories.list` | `read` | List the publishing categories of a Pack |
| `packConnections.getOauthConfig` | `coda.api.packConnections.getOauthConfig` | `read` | Get the OAuth configuration of a Pack |
| `packConnections.getSystemConnection` | `coda.api.packConnections.getSystemConnection` | `read` | Get the system connection metadata of a Pack |
| `packConnections.patchSystemConnection` | `coda.api.packConnections.patchSystemConnection` | `write` | Patch the system connection credentials of a Pack |
| `packConnections.setOauthConfig` | `coda.api.packConnections.setOauthConfig` | `write` | Set the OAuth client credentials of a Pack |
| `packConnections.setSystemConnection` | `coda.api.packConnections.setSystemConnection` | `write` | Set the system connection credentials of a Pack |
| `packFeaturedDocs.list` | `coda.api.packFeaturedDocs.list` | `read` | List the featured docs of a Pack |
| `packFeaturedDocs.update` | `coda.api.packFeaturedDocs.update` | `write` | Replace the featured docs of a Pack |
| `packInvitations.create` | `coda.api.packInvitations.create` | `write` | Invite a user to collaborate on a Pack |
| `packInvitations.listForUser` | `coda.api.packInvitations.listForUser` | `read` | List pending Pack invitations for the user |
| `packListings.deleteDraft` | `coda.api.packListings.deleteDraft` | `destructive` | Delete the listing draft of a Pack |
| `packListings.get` | `coda.api.packListings.get` | `read` | Get the public listing of a Pack |
| `packListings.list` | `coda.api.packListings.list` | `read` | List the Pack listings the user can access |
| `packLogs.getDetails` | `coda.api.packLogs.getDetails` | `read` | Get the details of a Pack ingestion log entry |
| `packLogs.list` | `coda.api.packLogs.list` | `read` | List the execution logs of a Pack in a doc |
| `packLogs.listGrouped` | `coda.api.packLogs.listGrouped` | `read` | List the execution logs of a Pack in a doc grouped by invocation |
| `packLogs.listGroupedIngestion` | `coda.api.packLogs.listGroupedIngestion` | `read` | List the logs of a Pack ingestion grouped by invocation |
| `packLogs.listIngestion` | `coda.api.packLogs.listIngestion` | `read` | List the logs of a Pack ingestion |
| `packLogs.listIngestionExecutions` | `coda.api.packLogs.listIngestionExecutions` | `read` | List the batch executions of a Pack ingestion |
| `packMakers.add` | `coda.api.packMakers.add` | `write` | Add a maker to a Pack |
| `packMakers.delete` | `coda.api.packMakers.delete` | `destructive` | Remove a maker from a Pack |
| `packMakers.list` | `coda.api.packMakers.list` | `read` | List the makers of a Pack |
| `packPermissions.add` | `coda.api.packPermissions.add` | `write` | Grant a principal access to a Pack |
| `packPermissions.delete` | `coda.api.packPermissions.delete` | `destructive` | Remove a permission from a Pack |
| `packPermissions.list` | `coda.api.packPermissions.list` | `read` | List the permissions of a Pack |
| `packReleases.create` | `coda.api.packReleases.create` | `write` | Release a Pack version |
| `packReleases.list` | `coda.api.packReleases.list` | `read` | List the releases of a Pack |
| `packReleases.update` | `coda.api.packReleases.update` | `write` | Update the release notes of a Pack release |
| `packs.create` | `coda.api.packs.create` | `write` | Create a Pack |
| `packs.delete` | `coda.api.packs.delete` | `destructive` | Delete a Pack |
| `packs.get` | `coda.api.packs.get` | `read` | Get a Pack |
| `packs.getConfigurationSchema` | `coda.api.packs.getConfigurationSchema` | `read` | Get the JSON Schema of the configuration of a Pack |
| `packs.list` | `coda.api.packs.list` | `read` | List Packs the user can access |
| `packs.update` | `coda.api.packs.update` | `write` | Update the metadata of a Pack |
| `packVersions.getDiff` | `coda.api.packVersions.getDiff` | `read` | Get the differences between two Pack versions |
| `packVersions.getNext` | `coda.api.packVersions.getNext` | `write` | Get the next valid version number for a Pack |
| `packVersions.getSourceCode` | `coda.api.packVersions.getSourceCode` | `read` | Get download URLs for the source code of a Pack version |
| `packVersions.list` | `coda.api.packVersions.list` | `read` | List the versions of a Pack |
| `packVersions.register` | `coda.api.packVersions.register` | `write` | Register a new Pack version and get an upload URL for its bundle |
| `packVersions.sourceCodeUploadComplete` | `coda.api.packVersions.sourceCodeUploadComplete` | `write` | Mark the upload of Pack source code as complete |
| `packVersions.uploadComplete` | `coda.api.packVersions.uploadComplete` | `write` | Mark the upload of a Pack version bundle as complete |
| `packVersions.uploadSourceCode` | `coda.api.packVersions.uploadSourceCode` | `write` | Get a signed URL to upload the source code of a Pack version |
| `pages.beginExport` | `coda.api.pages.beginExport` | `write` | Start an asynchronous export of page content |
| `pages.create` | `coda.api.pages.create` | `write` | Create a new page in a doc |
| `pages.delete` | `coda.api.pages.delete` | `destructive` | Delete a page |
| `pages.deleteContent` | `coda.api.pages.deleteContent` | `destructive` | Delete content elements from a page |
| `pages.get` | `coda.api.pages.get` | `read` | Get details about a page |
| `pages.getExportStatus` | `coda.api.pages.getExportStatus` | `read` | Check the status of a page content export |
| `pages.list` | `coda.api.pages.list` | `read` | List pages in a doc |
| `pages.listContent` | `coda.api.pages.listContent` | `read` | List the content elements of a page |
| `pages.update` | `coda.api.pages.update` | `write` | Update the properties or content of a page |
| `permissions.add` | `coda.api.permissions.add` | `write` | Share a doc with a user, domain or anyone |
| `permissions.delete` | `coda.api.permissions.delete` | `destructive` | Remove a sharing permission from a doc |
| `permissions.getAclSettings` | `coda.api.permissions.getAclSettings` | `read` | Get the access control settings of a doc |
| `permissions.getSharingMetadata` | `coda.api.permissions.getSharingMetadata` | `read` | Get sharing capabilities of the user for a doc |
| `permissions.list` | `coda.api.permissions.list` | `read` | List the sharing permissions of a doc |
| `permissions.searchPrincipals` | `coda.api.permissions.searchPrincipals` | `read` | Search users and groups a doc can be shared with |
| `permissions.updateAclSettings` | `coda.api.permissions.updateAclSettings` | `write` | Update the access control settings of a doc |
| `rows.delete` | `coda.api.rows.delete` | `destructive` | Delete a row from a table |
| `rows.deleteMany` | `coda.api.rows.deleteMany` | `destructive` | Delete several rows from a table |
| `rows.get` | `coda.api.rows.get` | `read` | Get a row in a table |
| `rows.list` | `coda.api.rows.list` | `read` | List rows in a table |
| `rows.pushButton` | `coda.api.rows.pushButton` | `write` | Push a button column in a row |
| `rows.update` | `coda.api.rows.update` | `write` | Update a row in a table |
| `rows.upsert` | `coda.api.rows.upsert` | `write` | Insert rows into a table, or update them when key columns match |
| `tables.get` | `coda.api.tables.get` | `read` | Get details about a table or view |
| `tables.list` | `coda.api.tables.list` | `read` | List tables and views in a doc |
| `workspaces.changeUserRole` | `coda.api.workspaces.changeUserRole` | `write` | Change the role of a workspace member |
| `workspaces.listRoles` | `coda.api.workspaces.listRoles` | `read` | List user counts by role over time for a workspace |
| `workspaces.listUsers` | `coda.api.workspaces.listUsers` | `read` | List members of a workspace |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

Handles 4 webhook events. See the reference for payloads and `webhookHooks`.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/coda

## License

Apache-2.0
