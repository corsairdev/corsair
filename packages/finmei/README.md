# @corsair-dev/finmei

Finmei plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/finmei
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `currencies.list` | `finmei.api.currencies.list` | `read` | List all currencies supported by Finmei |
| `customers.create` | `finmei.api.customers.create` | `write` | Create a new customer profile |
| `customers.delete` | `finmei.api.customers.delete` | `destructive` | Delete a customer profile by ID |
| `customers.get` | `finmei.api.customers.get` | `read` | Retrieve a customer profile by ID |
| `customers.list` | `finmei.api.customers.list` | `read` | List customers with optional search and pagination |
| `customers.update` | `finmei.api.customers.update` | `write` | Update an existing customer profile |
| `expenses.create` | `finmei.api.expenses.create` | `write` | Create a new expense record with optional receipt file |
| `expenses.delete` | `finmei.api.expenses.delete` | `destructive` | Delete an expense record by ID |
| `expenses.download` | `finmei.api.expenses.download` | `read` | Download expense receipt file as binary data |
| `expenses.get` | `finmei.api.expenses.get` | `read` | Retrieve an expense record by ID |
| `expenses.list` | `finmei.api.expenses.list` | `read` | List recorded expenses with optional pagination |
| `expenses.update` | `finmei.api.expenses.update` | `write` | Update an existing expense record |
| `expenses.updateFile` | `finmei.api.expenses.updateFile` | `write` | Update or replace an expense receipt file |
| `invoices.create` | `finmei.api.invoices.create` | `write` | Create a new invoice with line items, buyer and seller information |
| `invoices.delete` | `finmei.api.invoices.delete` | `destructive` | Delete an invoice by ID |
| `invoices.download` | `finmei.api.invoices.download` | `read` | Download invoice PDF document as binary data |
| `invoices.get` | `finmei.api.invoices.get` | `read` | Retrieve an invoice by ID |
| `invoices.list` | `finmei.api.invoices.list` | `read` | List invoices with optional pagination |
| `invoices.update` | `finmei.api.invoices.update` | `write` | Update an existing invoice |
| `payments.create` | `finmei.api.payments.create` | `write` | Record a new payment for an invoice |
| `payments.delete` | `finmei.api.payments.delete` | `destructive` | Delete a payment record by ID |
| `payments.get` | `finmei.api.payments.get` | `read` | Retrieve a payment record by ID |
| `payments.list` | `finmei.api.payments.list` | `read` | List recorded payments with optional filters |
| `products.create` | `finmei.api.products.create` | `write` | Create a new product in the catalog |
| `products.delete` | `finmei.api.products.delete` | `destructive` | Delete a product from the catalog |
| `products.get` | `finmei.api.products.get` | `read` | Retrieve a product by ID |
| `products.list` | `finmei.api.products.list` | `read` | List products in catalog with optional filters and pagination |
| `products.update` | `finmei.api.products.update` | `write` | Update product details in the catalog |
| `profile.get` | `finmei.api.profile.get` | `read` | Get profile information for the authenticated business |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/finmei

## License

Apache-2.0
