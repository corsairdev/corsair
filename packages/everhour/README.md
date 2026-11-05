# @corsair-dev/everhour

Everhour plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/everhour
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `user.getUser` | `everhour.api.user.getUser` | `read` | Get current user profile |
| `user.listTeamUsers` | `everhour.api.user.listTeamUsers` | `read` | List all team users |
| `user.listTeams` | `everhour.api.user.listTeams` | `read` | Get the authenticated Everhour workspace |
| `timer.getCurrentTimer` | `everhour.api.timer.getCurrentTimer` | `read` | Get the current active timer |
| `timer.startTimer` | `everhour.api.timer.startTimer` | `write` | Start a new timer |
| `timer.stopTimer` | `everhour.api.timer.stopTimer` | `write` | Stop the currently running timer |
| `time.listUserTime` | `everhour.api.time.listUserTime` | `read` | List time records for a user |
| `time.listUserTimesheets` | `everhour.api.time.listUserTimesheets` | `read` | List timesheets for a user |
| `time.logTime` | `everhour.api.time.logTime` | `write` | Log a new time record |
| `time.updateTimeEntry` | `everhour.api.time.updateTimeEntry` | `write` | Update a time record |
| `time.deleteTimeEntry` | `everhour.api.time.deleteTimeEntry` | `write` | Delete a time record |
| `time.requestTimesheetApproval` | `everhour.api.time.requestTimesheetApproval` | `write` | Request approval for a timesheet week |
| `time.discardTimesheetApproval` | `everhour.api.time.discardTimesheetApproval` | `write` | Discard a pending timesheet approval request |
| `tasks.searchTasks` | `everhour.api.tasks.searchTasks` | `read` | Search tasks across projects |
| `tasks.getTask` | `everhour.api.tasks.getTask` | `read` | Get a specific task |
| `tasks.listTasksForProject` | `everhour.api.tasks.listTasksForProject` | `read` | List tasks for a project |
| `tasks.createTask` | `everhour.api.tasks.createTask` | `write` | Create a task |
| `projects.listProjects` | `everhour.api.projects.listProjects` | `read` | List projects |
| `projects.getProject` | `everhour.api.projects.getProject` | `read` | Get a project |
| `projects.createProject` | `everhour.api.projects.createProject` | `write` | Create a project |
| `projects.updateProject` | `everhour.api.projects.updateProject` | `write` | Update a project |
| `projects.deleteProject` | `everhour.api.projects.deleteProject` | `write` | Delete a project |
| `sections.listSections` | `everhour.api.sections.listSections` | `read` | List sections in a project |
| `sections.getSection` | `everhour.api.sections.getSection` | `read` | Get a section |
| `sections.createSection` | `everhour.api.sections.createSection` | `write` | Create a section |
| `sections.deleteSection` | `everhour.api.sections.deleteSection` | `write` | Delete a section |
| `clients.listClients` | `everhour.api.clients.listClients` | `read` | List clients |
| `clients.getClient` | `everhour.api.clients.getClient` | `read` | Get a client |
| `clients.createClient` | `everhour.api.clients.createClient` | `write` | Create a client |
| `clients.updateClient` | `everhour.api.clients.updateClient` | `write` | Update a client |
| `clients.deleteClient` | `everhour.api.clients.deleteClient` | `write` | Delete a client |
| `platforms.listPlatforms` | `everhour.api.platforms.listPlatforms` | `read` | List supported platforms |
| `timecards.clockIn` | `everhour.api.timecards.clockIn` | `write` | Clock a user in |
| `timecards.clockOut` | `everhour.api.timecards.clockOut` | `write` | Clock a user out |
| `timecards.getTimecard` | `everhour.api.timecards.getTimecard` | `read` | Get a user timecard for a date |
| `timecards.listTimecards` | `everhour.api.timecards.listTimecards` | `read` | List team timecards |
| `timecards.listUserTimecards` | `everhour.api.timecards.listUserTimecards` | `read` | List timecards for a user |
| `timecards.updateTimecard` | `everhour.api.timecards.updateTimecard` | `write` | Update a user timecard |
| `timecards.deleteTimecard` | `everhour.api.timecards.deleteTimecard` | `write` | Delete a user timecard |
| `expenses.listExpenses` | `everhour.api.expenses.listExpenses` | `read` | List expenses |
| `expenses.listExpenseCategories` | `everhour.api.expenses.listExpenseCategories` | `read` | List expense categories |
| `invoices.listInvoices` | `everhour.api.invoices.listInvoices` | `read` | List invoices |
| `hooks.listWebhooks` | `everhour.api.hooks.listWebhooks` | `read` | List webhooks |
| `hooks.getWebhook` | `everhour.api.hooks.getWebhook` | `read` | Get a webhook |
| `hooks.createWebhook` | `everhour.api.hooks.createWebhook` | `write` | Create a webhook |
| `hooks.updateWebhook` | `everhour.api.hooks.updateWebhook` | `write` | Update a webhook |
| `hooks.deleteWebhook` | `everhour.api.hooks.deleteWebhook` | `write` | Delete a webhook |
| `tags.listTags` | `everhour.api.tags.listTags` | `read` | List workspace tags |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

Incoming Everhour webhook events are matched on payload `type` and `X-Hook-Secret`.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/everhour

## License

Apache-2.0
