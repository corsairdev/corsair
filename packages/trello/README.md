# @corsair-dev/trello

Trello plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/trello
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `boards.create` | `trello.api.boards.create` | `write` | Create a new board |
| `boards.delete` | `trello.api.boards.delete` | `destructive` | Delete a board [DESTRUCTIVE] |
| `boards.get` | `trello.api.boards.get` | `read` | Get a board by ID |
| `boards.list` | `trello.api.boards.list` | `read` | List boards for a member |
| `boards.update` | `trello.api.boards.update` | `write` | Update a board |
| `cards.create` | `trello.api.cards.create` | `write` | Create a new card |
| `cards.delete` | `trello.api.cards.delete` | `destructive` | Delete a card [DESTRUCTIVE] |
| `cards.get` | `trello.api.cards.get` | `read` | Get a card by ID |
| `cards.list` | `trello.api.cards.list` | `read` | List cards in a list |
| `cards.move` | `trello.api.cards.move` | `write` | Move a card to a different list or board |
| `cards.update` | `trello.api.cards.update` | `write` | Update a card |
| `checklists.create` | `trello.api.checklists.create` | `write` | Create a checklist on a card |
| `checklists.delete` | `trello.api.checklists.delete` | `destructive` | Delete a checklist [DESTRUCTIVE] |
| `checklists.get` | `trello.api.checklists.get` | `read` | Get a checklist by ID |
| `labels.create` | `trello.api.labels.create` | `write` | Create a label on a board |
| `labels.delete` | `trello.api.labels.delete` | `destructive` | Delete a label [DESTRUCTIVE] |
| `labels.list` | `trello.api.labels.list` | `read` | List labels on a board |
| `labels.update` | `trello.api.labels.update` | `write` | Update a label |
| `lists.archive` | `trello.api.lists.archive` | `write` | Archive (close) a list |
| `lists.create` | `trello.api.lists.create` | `write` | Create a new list on a board |
| `lists.get` | `trello.api.lists.get` | `read` | Get a list by ID |
| `lists.list` | `trello.api.lists.list` | `read` | List all lists on a board |
| `lists.update` | `trello.api.lists.update` | `write` | Update a list |
| `members.get` | `trello.api.members.get` | `read` | Get a member by ID or username |
| `members.list` | `trello.api.members.list` | `read` | List members of a board |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

Handles 6 webhook events. See the reference for payloads and `webhookHooks`.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/trello

## License

Apache-2.0
