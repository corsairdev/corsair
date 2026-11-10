# @corsair-dev/rentman

Rentman plugin for Corsair: reads and writes rental contacts, projects, equipment, crew, appointments and invoices through the Rentman public API.

## Install

```bash
pnpm add @corsair-dev/rentman
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `appointments.get` | `rentman.api.appointments.get` | `read` | Fetch one appointment with its start, end, location and recurrence settings |
| `appointments.list` | `rentman.api.appointments.list` | `read` | List calendar appointments with project and start/end filters plus cursor paging |
| `contacts.create` | `rentman.api.contacts.create` | `write` | Create a company or person contact with its mailing, visit and invoice addresses |
| `contacts.delete` | `rentman.api.contacts.delete` | `destructive` | Delete a contact permanently |
| `contacts.get` | `rentman.api.contacts.get` | `read` | Fetch one contact with its address blocks and linked items expanded on request |
| `contacts.list` | `rentman.api.contacts.list` | `read` | List contacts with country, type and folder filters, field projection and cursor paging |
| `contacts.update` | `rentman.api.contacts.update` | `write` | Update a contact: its name, code, addresses, coordinates or contact details |
| `crew.get` | `rentman.api.crew.get` | `read` | Fetch one crew member with their contact details, address and custom fields |
| `crew.list` | `rentman.api.crew.list` | `read` | List crew members with name and availability filters, field projection and cursor paging |
| `equipment.create` | `rentman.api.equipment.create` | `write` | Create an equipment item with its code, price, replacement value, dimensions and remarks |
| `equipment.get` | `rentman.api.equipment.get` | `read` | Fetch one equipment item with its pricing, dimensions and stock settings |
| `equipment.list` | `rentman.api.equipment.list` | `read` | List equipment with name, code and shop-availability filters, field projection and cursor paging |
| `equipment.update` | `rentman.api.equipment.update` | `write` | Update an equipment item: its name, code, price, dimensions or remarks |
| `invoices.get` | `rentman.api.invoices.get` | `read` | Fetch one invoice with its totals, balance and payment state |
| `invoices.list` | `rentman.api.invoices.list` | `read` | List invoices with number and project filters plus cursor paging |
| `projects.create` | `rentman.api.projects.create` | `write` | Create a project for a customer contact with its number, account manager and deposit settings |
| `projects.get` | `rentman.api.projects.get` | `read` | Fetch one project with its customer, totals and period fields, expanding linked items on request |
| `projects.list` | `rentman.api.projects.list` | `read` | List rental projects with name and number filters, field projection and cursor paging |
| `projects.update` | `rentman.api.projects.update` | `write` | Update a project: its name, customer, number, account manager or deposit settings |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/rentman

## License

Apache-2.0
