# @corsair-dev/timely

Timely plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/timely
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `accounts.get` | `timely.api.accounts.get` | `read` | Get a Timely workspace (account) by id |
| `accounts.list` | `timely.api.accounts.list` | `read` | List the Timely workspaces (accounts) the user can reach |
| `clients.create` | `timely.api.clients.create` | `write` | Create a client |
| `clients.get` | `timely.api.clients.get` | `read` | Get a client by id |
| `clients.list` | `timely.api.clients.list` | `read` | List clients |
| `clients.update` | `timely.api.clients.update` | `write` | Update a client (active: false archives it) |
| `projects.create` | `timely.api.projects.create` | `write` | Create a project under a client |
| `projects.delete` | `timely.api.projects.delete` | `destructive` | Delete a project |
| `projects.get` | `timely.api.projects.get` | `read` | Get a project by id |
| `projects.list` | `timely.api.projects.list` | `read` | List projects |
| `projects.update` | `timely.api.projects.update` | `write` | Update a project; passing `users` replaces who may log time on it |
| `reports.filter` | `timely.api.reports.filter` | `read` | Totals grouped by clients, users, tags, days and teams, or the matching time entries |
| `reports.totals` | `timely.api.reports.totals` | `read` | Logged time and cost per client and project for a period |
| `tags.create` | `timely.api.tags.create` | `write` | Create a tag |
| `tags.delete` | `timely.api.tags.delete` | `destructive` | Delete a tag |
| `tags.get` | `timely.api.tags.get` | `read` | Get a tag by id |
| `tags.list` | `timely.api.tags.list` | `read` | List tags (labels) |
| `tags.update` | `timely.api.tags.update` | `write` | Update a tag |
| `teams.get` | `timely.api.teams.get` | `read` | Get a team by id |
| `teams.list` | `timely.api.teams.list` | `read` | List teams |
| `timeEntries.bulk` | `timely.api.timeEntries.bulk` | `destructive` | Create, update and delete up to 100 time entries in one request |
| `timeEntries.create` | `timely.api.timeEntries.create` | `write` | Log time on a project |
| `timeEntries.delete` | `timely.api.timeEntries.delete` | `destructive` | Delete a time entry |
| `timeEntries.get` | `timely.api.timeEntries.get` | `read` | Get a time entry by id |
| `timeEntries.list` | `timely.api.timeEntries.list` | `read` | List time entries for a day or a since/upto date range |
| `timeEntries.startTimer` | `timely.api.timeEntries.startTimer` | `write` | Start the timer on a time entry |
| `timeEntries.stopTimer` | `timely.api.timeEntries.stopTimer` | `write` | Stop the timer on a time entry |
| `timeEntries.update` | `timely.api.timeEntries.update` | `write` | Update a time entry |
| `users.current` | `timely.api.users.current` | `read` | Get the connected user in a workspace |
| `users.get` | `timely.api.users.get` | `read` | Get a person by id |
| `users.list` | `timely.api.users.list` | `read` | List people |
| `webhooks.create` | `timely.api.webhooks.create` | `write` | Create a signed webhook subscription |
| `webhooks.delete` | `timely.api.webhooks.delete` | `destructive` | Delete a webhook |
| `webhooks.get` | `timely.api.webhooks.get` | `read` | Get a webhook by id |
| `webhooks.list` | `timely.api.webhooks.list` | `read` | List webhooks |
| `webhooks.update` | `timely.api.webhooks.update` | `write` | Update a webhook |

## Auth

Auth: OAuth 2.0. Corsair prompts your tenant for credentials on first use.

## Webhooks

Handles 12 webhook events. See the reference for payloads and `webhookHooks`.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/timely

## License

Apache-2.0
