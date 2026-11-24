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
| `blocks.getManyChildBlocks` | `notion.api.blocks.getManyChildBlocks` | `read` | Page body as blocks, one level only. Call again with the id of any block that has has_children true. Pass the page id as block_id for top-level content. Up to 100 blocks per call; while has_more is true, pass next_cursor as start_cursor |
| `databasePages.createDatabasePage` | `notion.api.databasePages.createDatabasePage` | `write` | Create a new page in a database |
| `databasePages.getDatabasePage` | `notion.api.databasePages.getDatabasePage` | `read` | Properties of any page by id, not its body; read the body with blocks.getManyChildBlocks using the page id |
| `databasePages.getManyDatabasePages` | `notion.api.databasePages.getManyDatabasePages` | `read` | Rows of one database, properties only. Read property names with databases.getDatabase first; a 404 means the database id is wrong or the database is not shared with the integration |
| `databasePages.updateDatabasePage` | `notion.api.databasePages.updateDatabasePage` | `write` | Update properties of a database page |
| `databases.getDatabase` | `notion.api.databases.getDatabase` | `read` | Get info about a database |
| `databases.getManyDatabases` | `notion.api.databases.getManyDatabases` | `read` | List databases accessible to the integration |
| `databases.searchDatabase` | `notion.api.databases.searchDatabase` | `read` | Search databases by title only. To filter rows inside a database use databasePages.getManyDatabasePages |
| `pages.archivePage` | `notion.api.pages.archivePage` | `destructive` | Archive (trash) a page [DESTRUCTIVE] |
| `pages.createPage` | `notion.api.pages.createPage` | `write` | Create a new page |
| `pages.searchPage` | `notion.api.pages.searchPage` | `read` | Matches titles only, not page text, and only items shared with the integration, so a miss does not mean the page is absent. Pass filter {"property":"object","value":"page"} for pages only |
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
