# @corsair-dev/xero

Xero plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/xero
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `accounts.get` | `xero.api.accounts.get` | `read` | Retrieve a specific account from Xero chart of accounts |
| `accounts.list` | `xero.api.accounts.list` | `read` | Retrieve chart of accounts from Xero |
| `assets.get` | `xero.api.assets.get` | `read` | Retrieve a specific asset by ID from Xero |
| `assets.list` | `xero.api.assets.list` | `read` | Retrieve fixed assets from Xero |
| `attachments.list` | `xero.api.attachments.list` | `read` | List all attachments for a specific entity in Xero |
| `attachments.upload` | `xero.api.attachments.upload` | `write` | Upload a file attachment to a Xero entity |
| `bankTransactions.create` | `xero.api.bankTransactions.create` | `write` | Create a bank transaction in Xero (SPEND or RECEIVE) |
| `bankTransactions.list` | `xero.api.bankTransactions.list` | `read` | Retrieve bank transactions from Xero |
| `budgets.get` | `xero.api.budgets.get` | `read` | Retrieve a budget from Xero |
| `connections.get` | `xero.api.connections.get` | `read` | List active Xero tenant connections |
| `contacts.create` | `xero.api.contacts.create` | `write` | Create a new contact in Xero |
| `contacts.list` | `xero.api.contacts.list` | `read` | Retrieve a list of contacts from Xero |
| `contacts.update` | `xero.api.contacts.update` | `write` | Update an existing contact in Xero |
| `creditNotes.list` | `xero.api.creditNotes.list` | `read` | Retrieve list of credit notes from Xero |
| `files.list` | `xero.api.files.list` | `read` | Retrieve files from Xero Files |
| `files.listFolders` | `xero.api.files.listFolders` | `read` | Retrieve folders from Xero Files |
| `invoices.create` | `xero.api.invoices.create` | `write` | Create a new invoice in Xero (sales invoice or bill) |
| `invoices.get` | `xero.api.invoices.get` | `read` | Retrieve a specific invoice by ID from Xero |
| `invoices.list` | `xero.api.invoices.list` | `read` | Retrieve a list of invoices from Xero |
| `invoices.update` | `xero.api.invoices.update` | `write` | Update an existing invoice in Xero |
| `items.create` | `xero.api.items.create` | `write` | Create an inventory item in Xero |
| `items.get` | `xero.api.items.get` | `read` | Retrieve a specific item by ID from Xero |
| `items.list` | `xero.api.items.list` | `read` | Retrieve items (inventory/products) from Xero |
| `journals.list` | `xero.api.journals.list` | `read` | Retrieve journals from Xero |
| `manualJournals.get` | `xero.api.manualJournals.get` | `read` | Retrieve a specific manual journal by ID from Xero |
| `manualJournals.list` | `xero.api.manualJournals.list` | `read` | Retrieve manual journals from Xero |
| `organisations.get` | `xero.api.organisations.get` | `read` | Retrieve organisation details from Xero |
| `payments.create` | `xero.api.payments.create` | `write` | Create a payment linking invoice and bank account in Xero |
| `payments.list` | `xero.api.payments.list` | `read` | Retrieve list of payments from Xero |
| `projects.get` | `xero.api.projects.get` | `read` | Retrieve a specific project by ID from Xero |
| `projects.list` | `xero.api.projects.list` | `read` | Retrieve projects from Xero |
| `purchaseOrders.create` | `xero.api.purchaseOrders.create` | `write` | Create a purchase order in Xero |
| `purchaseOrders.get` | `xero.api.purchaseOrders.get` | `read` | Retrieve a specific purchase order by ID from Xero |
| `purchaseOrders.list` | `xero.api.purchaseOrders.list` | `read` | Retrieve list of purchase orders from Xero |
| `quotes.list` | `xero.api.quotes.list` | `read` | Retrieve a list of quotes from Xero |
| `reports.getBalanceSheet` | `xero.api.reports.getBalanceSheet` | `read` | Retrieve Balance Sheet report from Xero |
| `reports.getProfitLoss` | `xero.api.reports.getProfitLoss` | `read` | Retrieve Profit & Loss report from Xero |
| `taxRates.list` | `xero.api.taxRates.list` | `read` | Retrieve tax rates from Xero |
| `trackingCategories.list` | `xero.api.trackingCategories.list` | `read` | Retrieve tracking categories from Xero |

## Auth

Auth: API key, OAuth 2.0 (default OAuth 2.0). Set `authType` on the plugin factory to pick one.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/xero

## License

Apache-2.0
