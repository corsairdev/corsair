# @corsair-dev/motion

Motion plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/motion
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `comments.create` | `motion.api.comments.create` | `write` | Create a comment on a task. |
| `comments.list` | `motion.api.comments.list` | `read` | List comments on a task. |
| `customFields.create` | `motion.api.customFields.create` | `write` | Create a custom field in a workspace. |
| `customFields.delete` | `motion.api.customFields.delete` | `destructive` | Delete a custom field from a workspace. |
| `customFields.list` | `motion.api.customFields.list` | `read` | List the custom fields of a workspace. |
| `customFieldValues.addToProject` | `motion.api.customFieldValues.addToProject` | `write` | Set a custom field value on a project. |
| `customFieldValues.addToTask` | `motion.api.customFieldValues.addToTask` | `write` | Set a custom field value on a task. |
| `customFieldValues.deleteFromProject` | `motion.api.customFieldValues.deleteFromProject` | `destructive` | Delete a custom field value from a project. |
| `customFieldValues.deleteFromTask` | `motion.api.customFieldValues.deleteFromTask` | `destructive` | Delete a custom field value from a task. |
| `projects.create` | `motion.api.projects.create` | `write` | Create a project. |
| `projects.get` | `motion.api.projects.get` | `read` | Get a project. |
| `projects.list` | `motion.api.projects.list` | `read` | List projects with cursor pagination. |
| `recurringTasks.create` | `motion.api.recurringTasks.create` | `write` | Create a recurring task. |
| `recurringTasks.delete` | `motion.api.recurringTasks.delete` | `destructive` | Delete a recurring task. |
| `recurringTasks.list` | `motion.api.recurringTasks.list` | `read` | List recurring tasks for a workspace. |
| `schedules.list` | `motion.api.schedules.list` | `read` | List the schedules available to the workspace. |
| `statuses.list` | `motion.api.statuses.list` | `read` | List the statuses of a workspace. |
| `tasks.create` | `motion.api.tasks.create` | `write` | Create a task. |
| `tasks.delete` | `motion.api.tasks.delete` | `destructive` | Delete a task. |
| `tasks.get` | `motion.api.tasks.get` | `read` | Get a task. |
| `tasks.list` | `motion.api.tasks.list` | `read` | List tasks with optional filters and cursor pagination. |
| `tasks.move` | `motion.api.tasks.move` | `write` | Move a task to another workspace. |
| `tasks.unassign` | `motion.api.tasks.unassign` | `write` | Remove the assignee from a task. |
| `tasks.update` | `motion.api.tasks.update` | `write` | Update a task. |
| `users.list` | `motion.api.users.list` | `read` | List workspace or team members. |
| `users.me` | `motion.api.users.me` | `read` | Get the authenticated user. |
| `workspaces.list` | `motion.api.workspaces.list` | `read` | List workspaces. |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/motion

## License

Apache-2.0
