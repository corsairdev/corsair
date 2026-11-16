# @corsair-dev/taxjar

TaxJar plugin for Corsair: calculate sales tax, look up rates and nexus regions, validate addresses, record order and refund transactions, and manage tax-exempt customers.

## Install

```bash
pnpm add @corsair-dev/taxjar
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `addresses.validate` | `taxjar.api.addresses.validate` | `read` | Validate a US address and get back every match TaxJar finds, with the street and ZIP normalized |
| `categories.list` | `taxjar.api.categories.list` | `read` | List the product tax categories, whose product_tax_code values a tax calculation or line item takes |
| `customers.create` | `taxjar.api.customers.create` | `write` | Create an exempt customer, whose exemption applies to later transactions that cite its customer_id |
| `customers.delete` | `taxjar.api.customers.delete` | `destructive` | Delete a customer, which removes the exemption from future transactions |
| `customers.get` | `taxjar.api.customers.get` | `read` | Read one customer with its exemption type and exempt regions |
| `customers.list` | `taxjar.api.customers.list` | `read` | List the customer IDs recorded through the API |
| `customers.update` | `taxjar.api.customers.update` | `write` | Change a customer's exemption or address |
| `nexusRegions.list` | `taxjar.api.nexusRegions.list` | `read` | List the regions where the account has sales tax nexus |
| `orders.create` | `taxjar.api.orders.create` | `destructive` | Record an order transaction for tax reporting; shipping is required even when it is zero |
| `orders.delete` | `taxjar.api.orders.delete` | `destructive` | Delete an order transaction, which removes it from tax reporting and cannot be undone |
| `orders.get` | `taxjar.api.orders.get` | `read` | Read one order transaction by its ID |
| `orders.list` | `taxjar.api.orders.list` | `read` | List the order transaction IDs recorded through the API, by date or date range |
| `orders.update` | `taxjar.api.orders.update` | `destructive` | Change an order transaction; a transaction that has been filed may refuse the change |
| `rates.get` | `taxjar.api.rates.get` | `read` | Read the combined and per-jurisdiction rates for a postal code, with an optional street address for rooftop accuracy |
| `refunds.create` | `taxjar.api.refunds.create` | `destructive` | Record a refund transaction, linked to its original order by transaction_reference_id |
| `refunds.delete` | `taxjar.api.refunds.delete` | `destructive` | Delete a refund transaction, which removes it from tax reporting and cannot be undone |
| `refunds.get` | `taxjar.api.refunds.get` | `read` | Read one refund transaction by its ID |
| `refunds.list` | `taxjar.api.refunds.list` | `read` | List the refund transaction IDs recorded through the API, by date or date range |
| `refunds.update` | `taxjar.api.refunds.update` | `destructive` | Change a refund transaction |
| `summaryRates.list` | `taxjar.api.summaryRates.list` | `read` | List the minimum and average tax rate per region, for display rather than calculation |
| `taxes.calculate` | `taxjar.api.taxes.calculate` | `read` | Calculate the tax for an order from an origin and destination, optionally per line item, without recording a transaction |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/taxjar

## License

Apache-2.0
