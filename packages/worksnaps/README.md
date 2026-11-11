# @corsair-dev/worksnaps

Worksnaps plugin for Corsair - manage projects and tasks, log and read time entries, assign users to tasks and projects, read users, and pull project and summary reports.

## Install

```bash
pnpm add @corsair-dev/worksnaps
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `projects.create` | `worksnaps.api.projects.create` | `write` | Create a project with a name and description |
| `projects.delete` | `worksnaps.api.projects.delete` | `destructive` | Delete a project with its tasks and logged time; this cannot be undone |
| `projects.get` | `worksnaps.api.projects.get` | `read` | Read one project with its name and description |
| `projects.list` | `worksnaps.api.projects.list` | `read` | List the projects the token is involved in, optionally with each project members |
| `projects.update` | `worksnaps.api.projects.update` | `write` | Change a project name or description |
| `reports.project` | `worksnaps.api.reports.project` | `read` | Read totals for one project over a period |
| `reports.summary` | `worksnaps.api.reports.summary` | `read` | Read totals across every project over a period |
| `taskAssignments.create` | `worksnaps.api.taskAssignments.create` | `write` | Assign a user to a task |
| `taskAssignments.delete` | `worksnaps.api.taskAssignments.delete` | `destructive` | Remove a user from a task |
| `taskAssignments.list` | `worksnaps.api.taskAssignments.list` | `read` | List which users are assigned to which tasks in a project |
| `tasks.create` | `worksnaps.api.tasks.create` | `write` | Create a task in a project |
| `tasks.delete` | `worksnaps.api.tasks.delete` | `destructive` | Delete a task with the time logged against it; this cannot be undone |
| `tasks.get` | `worksnaps.api.tasks.get` | `read` | Read one task |
| `tasks.list` | `worksnaps.api.tasks.list` | `read` | List the tasks in a project |
| `tasks.update` | `worksnaps.api.tasks.update` | `write` | Change a task name or description |
| `timeEntries.byUser` | `worksnaps.api.timeEntries.byUser` | `read` | List the time one user logged on a project |
| `timeEntries.create` | `worksnaps.api.timeEntries.create` | `write` | Log work against a task with its start time and duration in minutes |
| `timeEntries.delete` | `worksnaps.api.timeEntries.delete` | `destructive` | Delete a logged time entry; this cannot be undone |
| `timeEntries.get` | `worksnaps.api.timeEntries.get` | `read` | Read one time entry, optionally with full-resolution screenshot URLs |
| `timeEntries.list` | `worksnaps.api.timeEntries.list` | `read` | List the time logged on a project, optionally within a date range |
| `timeEntries.update` | `worksnaps.api.timeEntries.update` | `write` | Change a time entry task, start, duration or comment |
| `userAssignments.create` | `worksnaps.api.userAssignments.create` | `write` | Add a member to a project with a role, rate and time-logging windows |
| `userAssignments.get` | `worksnaps.api.userAssignments.get` | `read` | Read one project membership |
| `userAssignments.list` | `worksnaps.api.userAssignments.list` | `read` | List the members of a project with their roles and rates |
| `userAssignments.update` | `worksnaps.api.userAssignments.update` | `write` | Change a member role, rate or time-logging windows |
| `users.create` | `worksnaps.api.users.create` | `write` | Create a user; a privileged call that needs the partner API token rather than a normal one |
| `users.get` | `worksnaps.api.users.get` | `read` | Read one user |
| `users.list` | `worksnaps.api.users.list` | `read` | List the users on the account |
| `users.me` | `worksnaps.api.users.me` | `read` | Read the account behind the token, which is the cheapest way to check it |
| `users.update` | `worksnaps.api.users.update` | `write` | Change a user email, name or timezone |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/worksnaps

## License

Apache-2.0
