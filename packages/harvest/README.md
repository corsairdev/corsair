# @corsair-dev/harvest

Harvest plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/harvest
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `clients.create` | `harvest.api.clients.create` | `write` | Create a client |
| `clients.delete` | `harvest.api.clients.delete` | `destructive` | Delete a client |
| `clients.get` | `harvest.api.clients.get` | `read` | Get a client by id |
| `clients.list` | `harvest.api.clients.list` | `read` | List clients |
| `clients.update` | `harvest.api.clients.update` | `write` | Update a client |
| `company.get` | `harvest.api.company.get` | `read` | Get company settings |
| `company.update` | `harvest.api.company.update` | `write` | Update the writable company settings |
| `contacts.create` | `harvest.api.contacts.create` | `write` | Create a client contact |
| `contacts.delete` | `harvest.api.contacts.delete` | `destructive` | Delete a client contact |
| `contacts.list` | `harvest.api.contacts.list` | `read` | List client contacts |
| `contacts.update` | `harvest.api.contacts.update` | `write` | Update a client contact |
| `estimates.create` | `harvest.api.estimates.create` | `write` | Create a draft estimate |
| `estimates.createItemCategory` | `harvest.api.estimates.createItemCategory` | `write` | Create an estimate item category |
| `estimates.createMessage` | `harvest.api.estimates.createMessage` | `write` | Create an estimate message; event_type "send" emails the client |
| `estimates.delete` | `harvest.api.estimates.delete` | `destructive` | Delete an estimate |
| `estimates.deleteMessage` | `harvest.api.estimates.deleteMessage` | `destructive` | Delete an estimate message |
| `estimates.get` | `harvest.api.estimates.get` | `read` | Get an estimate by id |
| `estimates.listMessages` | `harvest.api.estimates.listMessages` | `read` | List the messages recorded against an estimate |
| `estimates.update` | `harvest.api.estimates.update` | `write` | Update an estimate |
| `estimates.updateItemCategory` | `harvest.api.estimates.updateItemCategory` | `write` | Rename an estimate item category |
| `expenses.create` | `harvest.api.expenses.create` | `write` | Record an expense against a project |
| `expenses.listCategories` | `harvest.api.expenses.listCategories` | `read` | List expense categories |
| `expenses.update` | `harvest.api.expenses.update` | `write` | Update an expense |
| `invoices.create` | `harvest.api.invoices.create` | `write` | Create a draft invoice |
| `invoices.createItemCategory` | `harvest.api.invoices.createItemCategory` | `write` | Create an invoice item category |
| `invoices.createMessage` | `harvest.api.invoices.createMessage` | `write` | Create an invoice message; event_type "send" emails the client |
| `invoices.createPayment` | `harvest.api.invoices.createPayment` | `write` | Record a payment against an invoice |
| `invoices.delete` | `harvest.api.invoices.delete` | `destructive` | Delete an invoice |
| `invoices.deleteItemCategory` | `harvest.api.invoices.deleteItemCategory` | `destructive` | Delete an unused invoice item category |
| `invoices.deleteMessage` | `harvest.api.invoices.deleteMessage` | `destructive` | Delete an invoice message |
| `invoices.deletePayment` | `harvest.api.invoices.deletePayment` | `destructive` | Delete a recorded payment |
| `invoices.get` | `harvest.api.invoices.get` | `read` | Get an invoice by id |
| `invoices.list` | `harvest.api.invoices.list` | `read` | List invoices |
| `invoices.listItemCategories` | `harvest.api.invoices.listItemCategories` | `read` | List invoice item categories |
| `invoices.listMessages` | `harvest.api.invoices.listMessages` | `read` | List the messages recorded against an invoice |
| `invoices.listPayments` | `harvest.api.invoices.listPayments` | `read` | List payments recorded against an invoice |
| `invoices.update` | `harvest.api.invoices.update` | `write` | Update an invoice |
| `projects.create` | `harvest.api.projects.create` | `write` | Create a project |
| `projects.delete` | `harvest.api.projects.delete` | `destructive` | Delete a project and its time entries and expenses |
| `projects.get` | `harvest.api.projects.get` | `read` | Get a project by id |
| `projects.list` | `harvest.api.projects.list` | `read` | List projects |
| `projects.update` | `harvest.api.projects.update` | `write` | Update a project |
| `tasks.create` | `harvest.api.tasks.create` | `write` | Create a task |
| `tasks.delete` | `harvest.api.tasks.delete` | `destructive` | Delete a task |
| `tasks.get` | `harvest.api.tasks.get` | `read` | Get a task by id |
| `tasks.list` | `harvest.api.tasks.list` | `read` | List tasks |
| `tasks.update` | `harvest.api.tasks.update` | `write` | Update a task |
| `timeEntries.create` | `harvest.api.timeEntries.create` | `write` | Log time against a project and task |
| `timeEntries.delete` | `harvest.api.timeEntries.delete` | `destructive` | Delete a time entry |
| `timeEntries.get` | `harvest.api.timeEntries.get` | `read` | Get a time entry by id |
| `timeEntries.list` | `harvest.api.timeEntries.list` | `read` | List time entries |
| `timeEntries.update` | `harvest.api.timeEntries.update` | `write` | Update a time entry |
| `users.create` | `harvest.api.users.create` | `write` | Create a team member and email them an invitation |
| `users.delete` | `harvest.api.users.delete` | `destructive` | Delete a team member |
| `users.get` | `harvest.api.users.get` | `read` | Get a team member by id |
| `users.list` | `harvest.api.users.list` | `read` | List team members |
| `users.update` | `harvest.api.users.update` | `write` | Update a team member |

## Auth

Auth: OAuth 2.0. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/harvest

## License

Apache-2.0
