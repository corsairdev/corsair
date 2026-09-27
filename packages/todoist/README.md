# @corsair-dev/todoist

Todoist plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/todoist
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `comments.create` | `todoist.api.comments.create` | `write` | Create a Todoist comment |
| `comments.delete` | `todoist.api.comments.delete` | `destructive` | Delete a Todoist comment |
| `comments.get` | `todoist.api.comments.get` | `read` | Get a Todoist comment by ID |
| `comments.getMany` | `todoist.api.comments.getMany` | `read` | List Todoist comments for a task or project |
| `comments.update` | `todoist.api.comments.update` | `write` | Update a Todoist comment |
| `labels.create` | `todoist.api.labels.create` | `write` | Create a Todoist label |
| `labels.delete` | `todoist.api.labels.delete` | `destructive` | Delete a Todoist label |
| `labels.get` | `todoist.api.labels.get` | `read` | Get a Todoist label by ID |
| `labels.getMany` | `todoist.api.labels.getMany` | `read` | List Todoist labels |
| `labels.update` | `todoist.api.labels.update` | `write` | Update a Todoist label |
| `projects.archive` | `todoist.api.projects.archive` | `write` | Archive a Todoist project |
| `projects.create` | `todoist.api.projects.create` | `write` | Create a Todoist project |
| `projects.delete` | `todoist.api.projects.delete` | `destructive` | Delete a Todoist project |
| `projects.get` | `todoist.api.projects.get` | `read` | Get a Todoist project by ID |
| `projects.getCollaborators` | `todoist.api.projects.getCollaborators` | `read` | List collaborators for a Todoist project |
| `projects.getMany` | `todoist.api.projects.getMany` | `read` | List Todoist projects |
| `projects.unarchive` | `todoist.api.projects.unarchive` | `write` | Unarchive a Todoist project |
| `projects.update` | `todoist.api.projects.update` | `write` | Update a Todoist project |
| `reminders.create` | `todoist.api.reminders.create` | `write` | Create a Todoist reminder |
| `reminders.delete` | `todoist.api.reminders.delete` | `destructive` | Delete a Todoist reminder |
| `reminders.getMany` | `todoist.api.reminders.getMany` | `read` | List Todoist reminders |
| `reminders.update` | `todoist.api.reminders.update` | `write` | Update a Todoist reminder |
| `sections.create` | `todoist.api.sections.create` | `write` | Create a Todoist section |
| `sections.delete` | `todoist.api.sections.delete` | `destructive` | Delete a Todoist section |
| `sections.get` | `todoist.api.sections.get` | `read` | Get a Todoist section by ID |
| `sections.getMany` | `todoist.api.sections.getMany` | `read` | List Todoist sections for a project |
| `sections.update` | `todoist.api.sections.update` | `write` | Update a Todoist section |
| `tasks.close` | `todoist.api.tasks.close` | `write` | Close a Todoist task |
| `tasks.create` | `todoist.api.tasks.create` | `write` | Create a Todoist task |
| `tasks.delete` | `todoist.api.tasks.delete` | `destructive` | Delete a Todoist task |
| `tasks.get` | `todoist.api.tasks.get` | `read` | Get a Todoist task by ID |
| `tasks.getMany` | `todoist.api.tasks.getMany` | `read` | List Todoist tasks with filters |
| `tasks.move` | `todoist.api.tasks.move` | `write` | Move a Todoist task between project or section |
| `tasks.quickAdd` | `todoist.api.tasks.quickAdd` | `write` | Quick add a Todoist task using natural language |
| `tasks.reopen` | `todoist.api.tasks.reopen` | `write` | Reopen a completed Todoist task |
| `tasks.update` | `todoist.api.tasks.update` | `write` | Update a Todoist task |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

Handles 13 webhook events. See the reference for payloads and `webhookHooks`.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/todoist

## License

Apache-2.0
