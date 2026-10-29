# @corsair-dev/notion

Notion plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/notion
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `blocks.appendBlock` | `notion.api.blocks.appendBlock` | `write` | Append new blocks to a block or page |
| `blocks.getManyChildBlocks` | `notion.api.blocks.getManyChildBlocks` | `read` | Retrieve child blocks of a block or page |
| `databasePages.createDatabasePage` | `notion.api.databasePages.createDatabasePage` | `write` | Create a new page in a database |
| `databasePages.getDatabasePage` | `notion.api.databasePages.getDatabasePage` | `read` | Get a page from a database |
| `databasePages.getManyDatabasePages` | `notion.api.databasePages.getManyDatabasePages` | `read` | List and filter pages in a database |
| `databasePages.updateDatabasePage` | `notion.api.databasePages.updateDatabasePage` | `write` | Update properties of a database page |
| `databases.getDatabase` | `notion.api.databases.getDatabase` | `read` | Get info about a database |
| `databases.getManyDatabases` | `notion.api.databases.getManyDatabases` | `read` | List databases accessible to the integration |
| `databases.searchDatabase` | `notion.api.databases.searchDatabase` | `read` | Search and filter databases |
| `pages.archivePage` | `notion.api.pages.archivePage` | `destructive` | Archive (trash) a page [DESTRUCTIVE] |
| `pages.createPage` | `notion.api.pages.createPage` | `write` | Create a new page |
| `pages.searchPage` | `notion.api.pages.searchPage` | `read` | Search pages and databases by title |
| `users.getManyUsers` | `notion.api.users.getManyUsers` | `read` | List all users in the workspace |
| `users.getUser` | `notion.api.users.getUser` | `read` | Get info about a user |

## Auth

Auth: API key, OAuth 2.0, Managed OAuth (default API key). Set `authType` on the plugin factory to pick one.

## Webhooks

Handles 3 webhook events. See the reference for payloads and `webhookHooks`.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/notion

## License

Apache-2.0
