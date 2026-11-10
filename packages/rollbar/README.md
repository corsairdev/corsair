# @corsair-dev/rollbar

Error monitoring with Rollbar - list and read error items and their occurrences, update an item's status, assignee or snooze, read an item's comments and events, comment on an item, and list and record deploys.

## Install

```bash
pnpm add @corsair-dev/rollbar
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `deploys.create` | `rollbar.api.deploys.create` | `write` | Record a deploy with its environment, revision and optional status and comment |
| `deploys.list` | `rollbar.api.deploys.list` | `read` | List deploys with environment and project filters, newest first |
| `itemComments.create` | `rollbar.api.itemComments.create` | `write` | Add a comment to an item |
| `itemComments.list` | `rollbar.api.itemComments.list` | `read` | List the comments on an item, newest first |
| `itemEvents.list` | `rollbar.api.itemEvents.list` | `read` | List the history events for an item: status changes, assignments and comments |
| `items.get` | `rollbar.api.items.get` | `read` | Fetch one item with its occurrence counts, timestamps and resolution state |
| `items.list` | `rollbar.api.items.list` | `read` | List error items with status, level, environment and assignee filters plus page paging |
| `items.update` | `rollbar.api.items.update` | `write` | Update an item: its status, level, title, assignee, resolved-in version or snooze |
| `occurrences.get` | `rollbar.api.occurrences.get` | `read` | Fetch one occurrence with its level, timestamp, request and person context |
| `occurrences.list` | `rollbar.api.occurrences.list` | `read` | List occurrences in a project with page paging, for a forward walk from a known id |
| `projects.list` | `rollbar.api.projects.list` | `read` | List the projects the token can see on the account |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/rollbar

## License

Apache-2.0
