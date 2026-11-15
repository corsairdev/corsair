# @corsair-dev/repairshopr

RepairShopr plugin for Corsair: reads and writes customers, tickets, invoices and products, and lists contacts and vendors, across a RepairShopr account's own subdomain.

## Install

```bash
pnpm add @corsair-dev/repairshopr
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `contacts.list` | `repairshopr.api.contacts.list` | `read` | List contact people, optionally for one customer |
| `customers.create` | `repairshopr.api.customers.create` | `write` | Create a customer from a business name or a person name, with contact details and notification settings |
| `customers.delete` | `repairshopr.api.customers.delete` | `destructive` | Delete a customer permanently |
| `customers.get` | `repairshopr.api.customers.get` | `read` | Fetch one customer with their contact details, addresses and custom fields |
| `customers.list` | `repairshopr.api.customers.list` | `read` | List customers with name, email and id filters, an optional sort, and page paging |
| `customers.update` | `repairshopr.api.customers.update` | `write` | Update a customer: their name, addresses, contact details or notification settings |
| `invoices.get` | `repairshopr.api.invoices.get` | `read` | Fetch one invoice with its totals, tax, paid state and linked ticket |
| `invoices.list` | `repairshopr.api.invoices.list` | `read` | List invoices with ticket, paid-state and update filters, plus page and per_page paging |
| `products.create` | `repairshopr.api.products.create` | `write` | Create a product; the name and description are both required by RepairShopr |
| `products.get` | `repairshopr.api.products.get` | `read` | Fetch one product with its pricing, stock level, warranty and category |
| `products.list` | `repairshopr.api.products.list` | `read` | List products with sku, name, upc and category filters, plus an optional sort |
| `products.update` | `repairshopr.api.products.update` | `write` | Update a product: its name, description, pricing, stock settings or category |
| `tickets.create` | `repairshopr.api.tickets.create` | `write` | Create a ticket for a customer with its subject, status, priority, assignee and assets |
| `tickets.delete` | `repairshopr.api.tickets.delete` | `destructive` | Delete a ticket permanently |
| `tickets.get` | `repairshopr.api.tickets.get` | `read` | Fetch one ticket with its customer, location, status, priority and custom fields |
| `tickets.list` | `repairshopr.api.tickets.list` | `read` | List tickets with customer, contact, status, assignee and date filters, plus page paging |
| `tickets.update` | `repairshopr.api.tickets.update` | `write` | Update a ticket: its subject, status, priority, assignee or due date |
| `vendors.list` | `repairshopr.api.vendors.list` | `read` | List vendors with their sales rep and contact details |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/repairshopr

## License

Apache-2.0
