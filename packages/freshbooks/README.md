# @corsair-dev/freshbooks

FreshBooks plugin for Corsair: clients, invoices, estimates, expenses, projects, tasks, time entries and the authenticated user, via the FreshBooks API. FreshBooks sends webhook callbacks, but this plugin does not handle inbound deliveries.

## Install

```bash
pnpm add @corsair-dev/freshbooks
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `clients.create` | `freshbooks.api.clients.create` | `write` | Create a client |
| `clients.delete` | `freshbooks.api.clients.delete` | `destructive` | Soft-delete a client by setting vis_state to 1. The record stays in FreshBooks; no documented call restores it |
| `clients.get` | `freshbooks.api.clients.get` | `read` | Read one client |
| `clients.list` | `freshbooks.api.clients.list` | `read` | List clients with paging |
| `clients.update` | `freshbooks.api.clients.update` | `write` | Change client fields |
| `estimates.create` | `freshbooks.api.estimates.create` | `write` | Create an estimate for a client |
| `estimates.delete` | `freshbooks.api.estimates.delete` | `destructive` | Soft-delete an estimate by setting vis_state to 1. The record stays in FreshBooks; no documented call restores it |
| `estimates.get` | `freshbooks.api.estimates.get` | `read` | Read one estimate, including its status |
| `estimates.list` | `freshbooks.api.estimates.list` | `read` | List estimates with paging |
| `estimates.update` | `freshbooks.api.estimates.update` | `write` | Change estimate fields |
| `expenses.create` | `freshbooks.api.expenses.create` | `write` | Record an expense |
| `expenses.delete` | `freshbooks.api.expenses.delete` | `destructive` | Soft-delete an expense by setting vis_state to 1. The record stays in FreshBooks; no documented call restores it |
| `expenses.get` | `freshbooks.api.expenses.get` | `read` | Read one expense |
| `expenses.list` | `freshbooks.api.expenses.list` | `read` | List expenses with paging |
| `expenses.update` | `freshbooks.api.expenses.update` | `write` | Change expense fields |
| `invoices.create` | `freshbooks.api.invoices.create` | `write` | Create a draft invoice. Concurrent creates without invoice_number can collide (409); retrying succeeds |
| `invoices.delete` | `freshbooks.api.invoices.delete` | `destructive` | Soft-delete an invoice by setting vis_state to 1. The record stays in FreshBooks; no documented call restores it |
| `invoices.get` | `freshbooks.api.invoices.get` | `read` | Read one invoice, including its amount and status |
| `invoices.list` | `freshbooks.api.invoices.list` | `read` | List invoices with paging |
| `invoices.markSent` | `freshbooks.api.invoices.markSent` | `write` | Mark a draft invoice as sent without emailing anyone; the client-facing status changes |
| `invoices.sendEmail` | `freshbooks.api.invoices.sendEmail` | `write` | Email the invoice to the client now. The email goes out immediately and cannot be unsent |
| `invoices.update` | `freshbooks.api.invoices.update` | `write` | Change invoice fields on a draft or sent invoice |
| `projects.create` | `freshbooks.api.projects.create` | `write` | Create a fixed-price or hourly project |
| `projects.delete` | `freshbooks.api.projects.delete` | `destructive` | Delete a project outright. FreshBooks does not mark it; the data is gone |
| `projects.get` | `freshbooks.api.projects.get` | `read` | Read one project, including its services and group |
| `projects.list` | `freshbooks.api.projects.list` | `read` | List projects with paging |
| `projects.update` | `freshbooks.api.projects.update` | `write` | Change project fields |
| `tasks.create` | `freshbooks.api.tasks.create` | `write` | Create a billable task |
| `tasks.delete` | `freshbooks.api.tasks.delete` | `destructive` | Soft-delete a billable task by setting vis_state to 1. The record stays in FreshBooks; no documented call restores it |
| `tasks.get` | `freshbooks.api.tasks.get` | `read` | Read one billable task, including its rate |
| `tasks.list` | `freshbooks.api.tasks.list` | `read` | List billable tasks with paging |
| `tasks.update` | `freshbooks.api.tasks.update` | `write` | Change task fields |
| `timeEntries.create` | `freshbooks.api.timeEntries.create` | `write` | Log a time entry (duration and start time), or start a timer when is_logged is false |
| `timeEntries.delete` | `freshbooks.api.timeEntries.delete` | `destructive` | Delete a time entry outright. FreshBooks does not mark it; the data is gone |
| `timeEntries.get` | `freshbooks.api.timeEntries.get` | `read` | Read one time entry, including its duration and timer |
| `timeEntries.list` | `freshbooks.api.timeEntries.list` | `read` | List time entries with paging, optionally filtered by start time, update time or billed state |
| `timeEntries.update` | `freshbooks.api.timeEntries.update` | `write` | Change time entry fields |
| `users.me` | `freshbooks.api.users.me` | `read` | Read the authenticated FreshBooks identity, including the accountId and businessId the other endpoints need |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/freshbooks

## License

Apache-2.0
