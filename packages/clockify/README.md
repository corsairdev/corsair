# @corsair-dev/clockify

Clockify plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/clockify
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `projects.list` | `clockify.api.projects.list` | `read` | List projects in a workspace |
| `tasks.list` | `clockify.api.tasks.list` | `read` | List tasks for a project in a workspace |
| `timeEntries.create` | `clockify.api.timeEntries.create` | `write` | Create a new time entry |
| `timeEntries.list` | `clockify.api.timeEntries.list` | `read` | List time entries for a user in a workspace |
| `workspaces.list` | `clockify.api.workspaces.list` | `read` | List all workspaces |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/clockify

## License

Apache-2.0
