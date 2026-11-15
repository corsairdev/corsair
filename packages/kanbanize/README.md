# @corsair-dev/kanbanize

Kanbanize plugin for Corsair: manage Businessmap boards, workflows, columns, lanes and cards, read and post card comments and subtasks, and manage tags, users, request limits and webhook registrations.

## Install

```bash
pnpm add @corsair-dev/kanbanize
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `boards.create` | `kanbanize.api.boards.create` | `write` | Create a Kanban board or an AI Canvas in a workspace; it starts empty and needs a workflow before it takes cards |
| `boards.delete` | `kanbanize.api.boards.delete` | `destructive` | Delete a board with every card, workflow, column and lane on it; it cannot be restored |
| `boards.get` | `kanbanize.api.boards.get` | `read` | One board with its workspace, type and revision |
| `boards.list` | `kanbanize.api.boards.list` | `read` | List boards, optionally limited to IDs, workspaces or the boards the key’s user is assigned to, with optional workflows and structure |
| `boards.update` | `kanbanize.api.boards.update` | `write` | Rename a board, change its description, or archive and restore it |
| `cards.create` | `kanbanize.api.cards.create` | `write` | Create a card in a column and lane, with an owner, priority, deadline, tags, custom fields and subtasks, or from a template |
| `cards.delete` | `kanbanize.api.cards.delete` | `destructive` | Delete a card with its comments and subtasks; it cannot be restored |
| `cards.get` | `kanbanize.api.cards.get` | `read` | One card with its description, custom fields, subtasks and linked cards |
| `cards.list` | `kanbanize.api.cards.list` | `read` | Cards filtered by board, workflow, column, lane, owner, state or date, paged and with optional `expand` for custom fields, subtasks and links |
| `cards.update` | `kanbanize.api.cards.update` | `write` | Change a card’s fields, move it to another column or lane, add or remove tags and custom fields, or archive and discard it |
| `columns.create` | `kanbanize.api.columns.create` | `write` | Create a main column in a workflow section, or a subcolumn under another column |
| `columns.delete` | `kanbanize.api.columns.delete` | `destructive` | Delete a column and its subcolumns; cards in it are lost, so they are moved first in practice |
| `columns.get` | `kanbanize.api.columns.get` | `read` | One column with its section, position and WIP limit |
| `columns.list` | `kanbanize.api.columns.list` | `read` | The columns on a board, including subcolumns |
| `columns.update` | `kanbanize.api.columns.update` | `write` | Rename a column, set its WIP limit, move it between sections, or reparent a subcolumn |
| `comments.create` | `kanbanize.api.comments.create` | `write` | Add a comment to a card |
| `comments.list` | `kanbanize.api.comments.list` | `read` | The comments on a card, oldest first |
| `lanes.create` | `kanbanize.api.lanes.create` | `write` | Create a lane on a workflow, or a nested lane under another lane |
| `lanes.delete` | `kanbanize.api.lanes.delete` | `destructive` | Delete a lane with its nested lanes and any cards in them |
| `lanes.get` | `kanbanize.api.lanes.get` | `read` | One lane on a board |
| `lanes.list` | `kanbanize.api.lanes.list` | `read` | The lanes on a board, including nested ones |
| `lanes.update` | `kanbanize.api.lanes.update` | `write` | Rename a lane, move it, or reparent it |
| `limits.get` | `kanbanize.api.limits.get` | `read` | The account’s hourly and minutely request ceilings, which is what a 429 is measured against |
| `me.get` | `kanbanize.api.me.get` | `read` | The user the API key belongs to |
| `subtasks.create` | `kanbanize.api.subtasks.create` | `write` | Add a subtask to a card, with an owner and a deadline |
| `subtasks.delete` | `kanbanize.api.subtasks.delete` | `destructive` | Delete a subtask from a card; it cannot be restored |
| `subtasks.list` | `kanbanize.api.subtasks.list` | `read` | The subtasks of a card |
| `subtasks.update` | `kanbanize.api.subtasks.update` | `write` | Change a subtask, or mark it finished or unfinished |
| `tags.list` | `kanbanize.api.tags.list` | `read` | Every tag on the account, with its availability and enabled state |
| `users.list` | `kanbanize.api.users.list` | `read` | Every user on the account, for looking up owner and watcher IDs |
| `webhooks.create` | `kanbanize.api.webhooks.create` | `write` | Register a URL to receive a board’s events. The plugin does not handle the deliveries itself |
| `webhooks.delete` | `kanbanize.api.webhooks.delete` | `destructive` | Delete a webhook so its URL stops receiving events |
| `webhooks.list` | `kanbanize.api.webhooks.list` | `read` | Webhooks registered on the account, with their board and URL |
| `webhooks.update` | `kanbanize.api.webhooks.update` | `write` | Point a webhook at another URL or board, or enable and disable it |
| `workflows.create` | `kanbanize.api.workflows.create` | `write` | Create a cards, initiative or timeline workflow on a board |
| `workflows.delete` | `kanbanize.api.workflows.delete` | `destructive` | Delete a workflow with its columns, lanes and any cards in them; it cannot be restored |
| `workflows.get` | `kanbanize.api.workflows.get` | `read` | One workflow on a board |
| `workflows.list` | `kanbanize.api.workflows.list` | `read` | The workflows on a board, in display order |
| `workflows.update` | `kanbanize.api.workflows.update` | `write` | Rename a workflow, move it, or enable and disable it |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/kanbanize

## License

Apache-2.0
