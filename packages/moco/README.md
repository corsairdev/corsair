# @corsair-dev/moco

Business management with Moco - track time entries, manage projects, clients, contacts and deals, read invoices and set their status, and look up users and the current profile.

## Install

```bash
pnpm add @corsair-dev/moco
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `activities.create` | `moco.api.activities.create` | `write` | Create a time entry on a project task for the authenticated user, in hours or seconds |
| `activities.delete` | `moco.api.activities.delete` | `destructive` | Delete a time entry; billed entries cannot be deleted this way |
| `activities.get` | `moco.api.activities.get` | `read` | Read one time entry |
| `activities.list` | `moco.api.activities.list` | `read` | List time entries with date, user, project, task, billable and billed filters, one page at a time |
| `activities.update` | `moco.api.activities.update` | `write` | Update a time entry |
| `companies.archive` | `moco.api.companies.archive` | `write` | Archive a company; unarchive reverses it |
| `companies.create` | `moco.api.companies.create` | `write` | Create a client, supplier or organization |
| `companies.get` | `moco.api.companies.get` | `read` | Read one company |
| `companies.list` | `moco.api.companies.list` | `read` | List clients, suppliers and organizations, one page at a time |
| `companies.unarchive` | `moco.api.companies.unarchive` | `write` | Unarchive a company |
| `companies.update` | `moco.api.companies.update` | `write` | Update a company |
| `contacts.create` | `moco.api.contacts.create` | `write` | Create a contact person for a company |
| `contacts.delete` | `moco.api.contacts.delete` | `destructive` | Delete a contact person |
| `contacts.get` | `moco.api.contacts.get` | `read` | Read one contact person |
| `contacts.list` | `moco.api.contacts.list` | `read` | List contact persons, one page at a time |
| `contacts.update` | `moco.api.contacts.update` | `write` | Update a contact person |
| `deals.create` | `moco.api.deals.create` | `write` | Create a deal in a deal category |
| `deals.delete` | `moco.api.deals.delete` | `destructive` | Delete a deal |
| `deals.get` | `moco.api.deals.get` | `read` | Read one deal |
| `deals.list` | `moco.api.deals.list` | `read` | List deals with status, close date, company and contact filters, one page at a time |
| `deals.update` | `moco.api.deals.update` | `write` | Update a deal, including its status |
| `invoices.get` | `moco.api.invoices.get` | `read` | Read one invoice with its line items, payments and reminders |
| `invoices.list` | `moco.api.invoices.list` | `read` | List invoices with status, date, client and project filters, one page at a time |
| `invoices.updateStatus` | `moco.api.invoices.updateStatus` | `write` | Move an invoice to created, sent, overdue or ignored; locked invoices refuse the change |
| `profile.get` | `moco.api.profile.get` | `read` | Read the profile of the authenticated user |
| `projects.archive` | `moco.api.projects.archive` | `write` | Archive a project; unarchive reverses it |
| `projects.create` | `moco.api.projects.create` | `write` | Create a project for a client |
| `projects.get` | `moco.api.projects.get` | `read` | Read one project, optionally embedding the client |
| `projects.list` | `moco.api.projects.list` | `read` | List projects with company, leader, tag, date and archive filters, one page at a time |
| `projects.report` | `moco.api.projects.report` | `read` | Read a project business report: budget, invoiced totals, hours and costs |
| `projects.unarchive` | `moco.api.projects.unarchive` | `write` | Unarchive a project |
| `projects.update` | `moco.api.projects.update` | `write` | Update a project |
| `session.verify` | `moco.api.session.verify` | `read` | Verify the API key and read the user identity it belongs to |
| `users.get` | `moco.api.users.get` | `read` | Read one user |
| `users.list` | `moco.api.users.list` | `read` | List account users, one page at a time |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/moco

## License

Apache-2.0
