# @corsair-dev/teamcamp

Teamcamp plugin for Corsair: project management for agencies, with projects, task groups and tasks, plus the workspace members and customers behind them.

## Install

```bash
pnpm add @corsair-dev/teamcamp
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `account.verify` | `teamcamp.api.account.verify` | `read` | Read the workspace the key belongs to, which also confirms the key is valid |
| `customers.list` | `teamcamp.api.customers.list` | `read` | List the customers a project can be billed to, with their clients |
| `groups.list` | `teamcamp.api.groups.list` | `read` | List the task groups of a project, by id and name |
| `projects.create` | `teamcamp.api.projects.create` | `write` | Create a project, optionally from a template and with a customer and dates |
| `projects.delete` | `teamcamp.api.projects.delete` | `destructive` | Delete a project. It is archived rather than erased: it leaves the project list, but a read by id still returns it marked archived |
| `projects.get` | `teamcamp.api.projects.get` | `read` | Read one project: its members, owner, dates and workflow statuses, which a task create needs for its status id |
| `projects.list` | `teamcamp.api.projects.list` | `read` | List the projects in the workspace, by id and name |
| `projects.update` | `teamcamp.api.projects.update` | `write` | Change a project name, description, dates or customer |
| `tasks.create` | `teamcamp.api.tasks.create` | `write` | Create a task in a project, with a priority, due date, assignees, group, status, milestone, estimate and attachments |
| `tasks.get` | `teamcamp.api.tasks.get` | `read` | Read one task, with its assignees, labels, files and comments |
| `tasks.list` | `teamcamp.api.tasks.list` | `read` | List the tasks of a project, optionally only the completed or only the open ones |
| `users.list` | `teamcamp.api.users.list` | `read` | List the workspace members, with their role, timezone and last seen time |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/teamcamp

## License

Apache-2.0
