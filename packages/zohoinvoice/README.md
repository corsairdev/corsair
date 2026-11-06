# @corsair-dev/zohoinvoice

Zoho Invoice plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/zohoinvoice
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `customers.list` | `zohoinvoice.api.customers.list` | `read` | List Zoho Invoice customers |
| `customers.get` | `zohoinvoice.api.customers.get` | `read` | Get a Zoho Invoice customer |
| `customers.create` | `zohoinvoice.api.customers.create` | `write` | Create a Zoho Invoice customer |
| `customers.update` | `zohoinvoice.api.customers.update` | `write` | Update a Zoho Invoice customer |
| `invoices.list` | `zohoinvoice.api.invoices.list` | `read` | List Zoho Invoice invoices |
| `invoices.get` | `zohoinvoice.api.invoices.get` | `read` | Get a Zoho Invoice invoice |
| `invoices.create` | `zohoinvoice.api.invoices.create` | `write` | Create a Zoho Invoice invoice |
| `invoices.update` | `zohoinvoice.api.invoices.update` | `write` | Update a Zoho Invoice invoice |
| `invoices.delete` | `zohoinvoice.api.invoices.delete` | `destructive` | Delete a Zoho Invoice invoice [DESTRUCTIVE · IRREVERSIBLE] |
| `items.list` | `zohoinvoice.api.items.list` | `read` | List Zoho Invoice items |
| `items.get` | `zohoinvoice.api.items.get` | `read` | Get a Zoho Invoice item |
| `items.create` | `zohoinvoice.api.items.create` | `write` | Create a Zoho Invoice item |
| `items.update` | `zohoinvoice.api.items.update` | `write` | Update a Zoho Invoice item |
| `payments.list` | `zohoinvoice.api.payments.list` | `read` | List Zoho Invoice customer payments |
| `payments.get` | `zohoinvoice.api.payments.get` | `read` | Get a Zoho Invoice customer payment |
| `estimates.list` | `zohoinvoice.api.estimates.list` | `read` | List Zoho Invoice estimates |
| `estimates.get` | `zohoinvoice.api.estimates.get` | `read` | Get a Zoho Invoice estimate |
| `estimates.create` | `zohoinvoice.api.estimates.create` | `write` | Create a Zoho Invoice estimate |
| `estimates.update` | `zohoinvoice.api.estimates.update` | `write` | Update a Zoho Invoice estimate |

## Auth

Auth: OAuth 2.0 (default OAuth 2.0).

## Webhooks

Webhook tenant matching is supported. Zoho webhook signature verification is not supported.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/zohoinvoice

## License

Apache-2.0
