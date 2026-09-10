# @corsair-dev/monday

Monday plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/monday
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `boards.archive` | `monday.api.boards.archive` | `write` | Archive a board |
| `boards.create` | `monday.api.boards.create` | `write` | Create a new board |
| `boards.delete` | `monday.api.boards.delete` | `destructive` | Permanently delete a board |
| `boards.duplicate` | `monday.api.boards.duplicate` | `write` | Duplicate a board |
| `boards.get` | `monday.api.boards.get` | `read` | Get a board by ID with groups and columns |
| `boards.list` | `monday.api.boards.list` | `read` | List all boards |
| `boards.update` | `monday.api.boards.update` | `write` | Update a board attribute |
| `columns.changeValue` | `monday.api.columns.changeValue` | `write` | Change a column value on an item |
| `columns.create` | `monday.api.columns.create` | `write` | Create a new column in a board |
| `columns.list` | `monday.api.columns.list` | `read` | List all columns in a board |
| `groups.create` | `monday.api.groups.create` | `write` | Create a new group in a board |
| `groups.delete` | `monday.api.groups.delete` | `destructive` | Delete a group from a board |
| `groups.list` | `monday.api.groups.list` | `read` | List all groups in a board |
| `groups.update` | `monday.api.groups.update` | `write` | Update a group attribute |
| `items.archive` | `monday.api.items.archive` | `write` | Archive an item |
| `items.create` | `monday.api.items.create` | `write` | Create a new item in a board |
| `items.delete` | `monday.api.items.delete` | `destructive` | Permanently delete an item |
| `items.get` | `monday.api.items.get` | `read` | Get an item by ID with column values |
| `items.list` | `monday.api.items.list` | `read` | List items in a board |
| `items.move` | `monday.api.items.move` | `write` | Move an item to a different group |
| `items.update` | `monday.api.items.update` | `write` | Update a column value on an item |
| `updates.create` | `monday.api.updates.create` | `write` | Create an update (comment) on an item |
| `updates.delete` | `monday.api.updates.delete` | `destructive` | Delete an update (comment) |
| `updates.list` | `monday.api.updates.list` | `read` | List updates (comments) on an item |
| `users.get` | `monday.api.users.get` | `read` | Get a user by ID |
| `users.list` | `monday.api.users.list` | `read` | List all users in the account |
| `webhooks.create` | `monday.api.webhooks.create` | `write` | Subscribe to a board event via webhook |
| `webhooks.delete` | `monday.api.webhooks.delete` | `destructive` | Unsubscribe a webhook by ID |
| `webhooks.list` | `monday.api.webhooks.list` | `read` | List all webhooks for a board |
| `workspaces.list` | `monday.api.workspaces.list` | `read` | List all workspaces |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

Handles 4 webhook events. See the reference for payloads and `webhookHooks`.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/monday

## License

Apache-2.0
