# @corsair-dev/ascora

Ascora plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/ascora
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `attachments.upload` | `ascora.api.attachments.upload` | `write` | Upload a file attachment to an Ascora entity |
| `contacts.get` | `ascora.api.contacts.get` | `read` | Get a contact by GUID |
| `contacts.upsert` | `ascora.api.contacts.upsert` | `write` | Create or update a contact on a customer |
| `customers.get` | `ascora.api.customers.get` | `read` | Get a customer by GUID |
| `customers.list` | `ascora.api.customers.list` | `read` | List customers with optional filters (FilterText, type, assigned user, pagination) |
| `customers.upsert` | `ascora.api.customers.upsert` | `write` | Create a customer or update one when customerId is provided |
| `enquiries.create` | `ascora.api.enquiries.create` | `write` | Create a quotation/enquiry (POST /Enquiry) |
| `inventory.categories` | `ascora.api.inventory.categories` | `read` | List inventory categories |
| `inventory.kits` | `ascora.api.inventory.kits` | `read` | List inventory kits |
| `inventory.supplies` | `ascora.api.inventory.supplies` | `read` | List inventory supplies with pricing |
| `jobs.get` | `ascora.api.jobs.get` | `read` | Get a job by full job number (e.g. J1) |
| `jobs.list` | `ascora.api.jobs.list` | `read` | List jobs filtered by status, type, dates, and assignment |
| `jobs.search` | `ascora.api.jobs.search` | `read` | Search jobs by number, name, address, or customer name |
| `notes.create` | `ascora.api.notes.create` | `write` | Create a note on an enquiry, job, quotation, invoice, or customer |
| `quotes.labourRoles` | `ascora.api.quotes.labourRoles` | `read` | List labour roles and hourly rates for quotes |
| `quotes.list` | `ascora.api.quotes.list` | `read` | List quotes with optional status, date, and customer filters |
| `quotes.standardSections` | `ascora.api.quotes.standardSections` | `read` | List standard quote sections |
| `quotes.standardStages` | `ascora.api.quotes.standardStages` | `read` | List standard quote stages |
| `supplierInvoices.list` | `ascora.api.supplierInvoices.list` | `read` | List supplier invoices with optional pagination and filters |
| `suppliers.get` | `ascora.api.suppliers.get` | `read` | Get a supplier by GUID |
| `suppliers.list` | `ascora.api.suppliers.list` | `read` | List suppliers by name, number, or ABN |
| `suppliers.upsert` | `ascora.api.suppliers.upsert` | `write` | Create a supplier or update one when supplierId is provided |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/ascora

## License

Apache-2.0
