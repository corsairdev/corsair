# @corsair-dev/moneybird

Accounting with Moneybird - list administrations, manage contacts, create and send sales invoices, track time entries, and manage products and projects.

## Install

```bash
pnpm add @corsair-dev/moneybird
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `administrations.list` | `moneybird.api.administrations.list` | `read` | List the administrations the token can access, with id, name, currency and access level |
| `contacts.create` | `moneybird.api.contacts.create` | `write` | Create a contact |
| `contacts.delete` | `moneybird.api.contacts.delete` | `destructive` | Delete a contact and its linked invoices history access |
| `contacts.get` | `moneybird.api.contacts.get` | `read` | Read one contact |
| `contacts.list` | `moneybird.api.contacts.list` | `read` | List contacts, one page at a time |
| `contacts.update` | `moneybird.api.contacts.update` | `write` | Update a contact |
| `products.create` | `moneybird.api.products.create` | `write` | Create a product |
| `products.delete` | `moneybird.api.products.delete` | `destructive` | Delete a product |
| `products.get` | `moneybird.api.products.get` | `read` | Read one product |
| `products.list` | `moneybird.api.products.list` | `read` | List products, one page at a time |
| `products.update` | `moneybird.api.products.update` | `write` | Update a product |
| `projects.create` | `moneybird.api.projects.create` | `write` | Create a project; the name must be unique within the administration |
| `projects.delete` | `moneybird.api.projects.delete` | `destructive` | Delete a project |
| `projects.get` | `moneybird.api.projects.get` | `read` | Read one project |
| `projects.list` | `moneybird.api.projects.list` | `read` | List projects, one page at a time |
| `projects.update` | `moneybird.api.projects.update` | `write` | Update a project |
| `salesInvoices.create` | `moneybird.api.salesInvoices.create` | `write` | Create a sales invoice for a contact, with line items |
| `salesInvoices.delete` | `moneybird.api.salesInvoices.delete` | `destructive` | Delete a sales invoice; only drafts and unsent states allow it |
| `salesInvoices.get` | `moneybird.api.salesInvoices.get` | `read` | Read one sales invoice with its lines |
| `salesInvoices.list` | `moneybird.api.salesInvoices.list` | `read` | List sales invoices with a filter string such as 'state:open\|paid' or 'period:this_year', one page at a time |
| `salesInvoices.send` | `moneybird.api.salesInvoices.send` | `destructive` | Send the invoice to the customer now or schedule it for a date; defaults come from the contact and workflow |
| `salesInvoices.update` | `moneybird.api.salesInvoices.update` | `write` | Update a sales invoice; sent invoices may refuse changes |
| `timeEntries.create` | `moneybird.api.timeEntries.create` | `write` | Create a time entry from started_at to ended_at; Moneybird rounds to full minutes |
| `timeEntries.delete` | `moneybird.api.timeEntries.delete` | `destructive` | Delete a time entry |
| `timeEntries.get` | `moneybird.api.timeEntries.get` | `read` | Read one time entry |
| `timeEntries.list` | `moneybird.api.timeEntries.list` | `read` | List time entries, one page at a time |
| `timeEntries.update` | `moneybird.api.timeEntries.update` | `write` | Update a time entry |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/moneybird

## License

Apache-2.0
