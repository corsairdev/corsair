# @corsair-dev/ticktick

TickTick plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/ticktick
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `oauth.generateAuthUrl` | `ticktick.api.oauth.generateAuthUrl` | `read` | Generate TickTick OAuth2 authorization URL |
| `projects.create` | `ticktick.api.projects.create` | `write` | Create a new project |
| `projects.delete` | `ticktick.api.projects.delete` | `destructive` | Permanently delete a project and its tasks |
| `projects.get` | `ticktick.api.projects.get` | `read` | Get a project by ID |
| `projects.getData` | `ticktick.api.projects.getData` | `read` | Get a project with its tasks |
| `projects.getMany` | `ticktick.api.projects.getMany` | `read` | Get user projects (TickTick omits Inbox) |
| `projects.update` | `ticktick.api.projects.update` | `write` | Update project details |
| `tasks.complete` | `ticktick.api.tasks.complete` | `write` | Mark a task as complete |
| `tasks.create` | `ticktick.api.tasks.create` | `write` | Create a new task |
| `tasks.delete` | `ticktick.api.tasks.delete` | `destructive` | Permanently delete a task |
| `tasks.get` | `ticktick.api.tasks.get` | `read` | Get a task by project and ID |
| `tasks.listAll` | `ticktick.api.tasks.listAll` | `read` | List open tasks across listed user projects (excludes Inbox) |
| `tasks.update` | `ticktick.api.tasks.update` | `write` | Update an existing task |

## Auth

Auth: OAuth 2.0. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/ticktick

## License

Apache-2.0
