# @corsair-dev/zohoinvoice

Zoho Invoice plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/zohoinvoice
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `customers.create` | `zohoinvoice.api.customers.create` | `write` | Create a Zoho Invoice customer |
| `customers.delete` | `zohoinvoice.api.customers.delete` | `destructive` | Delete a customer. Cannot be undone |
| `customers.get` | `zohoinvoice.api.customers.get` | `read` | Get a Zoho Invoice customer |
| `customers.list` | `zohoinvoice.api.customers.list` | `read` | List Zoho Invoice customers |
| `customers.update` | `zohoinvoice.api.customers.update` | `write` | Update a Zoho Invoice customer |
| `estimates.create` | `zohoinvoice.api.estimates.create` | `write` | Create a Zoho Invoice estimate |
| `estimates.delete` | `zohoinvoice.api.estimates.delete` | `destructive` | Delete an estimate. Cannot be undone |
| `estimates.email` | `zohoinvoice.api.estimates.email` | `destructive` | Email an estimate to the customer |
| `estimates.get` | `zohoinvoice.api.estimates.get` | `read` | Get a Zoho Invoice estimate |
| `estimates.list` | `zohoinvoice.api.estimates.list` | `read` | List Zoho Invoice estimates |
| `estimates.markAccepted` | `zohoinvoice.api.estimates.markAccepted` | `write` | Mark an estimate as accepted by the customer |
| `estimates.markDeclined` | `zohoinvoice.api.estimates.markDeclined` | `write` | Mark an estimate as declined by the customer |
| `estimates.markSent` | `zohoinvoice.api.estimates.markSent` | `write` | Mark a draft estimate as sent without emailing it |
| `estimates.update` | `zohoinvoice.api.estimates.update` | `write` | Update a Zoho Invoice estimate |
| `invoices.create` | `zohoinvoice.api.invoices.create` | `write` | Create a Zoho Invoice invoice |
| `invoices.delete` | `zohoinvoice.api.invoices.delete` | `destructive` | Delete a Zoho Invoice invoice. Cannot be undone |
| `invoices.email` | `zohoinvoice.api.invoices.email` | `destructive` | Email an invoice to the customer |
| `invoices.get` | `zohoinvoice.api.invoices.get` | `read` | Get a Zoho Invoice invoice |
| `invoices.list` | `zohoinvoice.api.invoices.list` | `read` | List Zoho Invoice invoices |
| `invoices.listPayments` | `zohoinvoice.api.invoices.listPayments` | `read` | List the payments recorded against an invoice |
| `invoices.markSent` | `zohoinvoice.api.invoices.markSent` | `write` | Mark a draft invoice as sent without emailing it |
| `invoices.remind` | `zohoinvoice.api.invoices.remind` | `destructive` | Email the customer a payment reminder for an invoice |
| `invoices.update` | `zohoinvoice.api.invoices.update` | `write` | Update a Zoho Invoice invoice |
| `invoices.void` | `zohoinvoice.api.invoices.void` | `destructive` | Void an invoice; it stops counting toward the balance |
| `items.create` | `zohoinvoice.api.items.create` | `write` | Create a Zoho Invoice item |
| `items.delete` | `zohoinvoice.api.items.delete` | `destructive` | Delete an item. Cannot be undone |
| `items.get` | `zohoinvoice.api.items.get` | `read` | Get a Zoho Invoice item |
| `items.list` | `zohoinvoice.api.items.list` | `read` | List Zoho Invoice items |
| `items.update` | `zohoinvoice.api.items.update` | `write` | Update a Zoho Invoice item |
| `organizations.list` | `zohoinvoice.api.organizations.list` | `read` | List the Zoho Invoice organizations the account can use, with their ids |
| `payments.create` | `zohoinvoice.api.payments.create` | `write` | Record a customer payment, optionally applied to invoices |
| `payments.delete` | `zohoinvoice.api.payments.delete` | `destructive` | Delete a recorded customer payment. Cannot be undone |
| `payments.get` | `zohoinvoice.api.payments.get` | `read` | Get a Zoho Invoice customer payment |
| `payments.list` | `zohoinvoice.api.payments.list` | `read` | List Zoho Invoice customer payments |

## Auth

Auth: OAuth 2.0 (Zoho, per data center via `region`). After connecting, the default organization is saved so calls can leave `organizationId` out.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/zohoinvoice

## License

Apache-2.0
