# @corsair-dev/brex

Brex plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/brex
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `accounts.getCash` | `brex.api.accounts.getCash` | `read` | Get a cash account by ID |
| `accounts.getCashPrimary` | `brex.api.accounts.getCashPrimary` | `read` | Get the primary cash account |
| `accounts.listCard` | `brex.api.accounts.listCard` | `read` | List card accounts |
| `accounts.listCardStatements` | `brex.api.accounts.listCardStatements` | `read` | List finalized primary card statements |
| `accounts.listCash` | `brex.api.accounts.listCash` | `read` | List cash deposit accounts |
| `accounts.listCashStatements` | `brex.api.accounts.listCashStatements` | `read` | List finalized cash account statements |
| `budgetPrograms.list` | `brex.api.budgetPrograms.list` | `read` | List budget programs |
| `budgets.archive` | `brex.api.budgets.archive` | `destructive` | Archive a budget |
| `budgets.create` | `brex.api.budgets.create` | `write` | Create a budget |
| `budgets.get` | `brex.api.budgets.get` | `read` | Get a budget by ID |
| `budgets.list` | `brex.api.budgets.list` | `read` | List budgets |
| `budgets.update` | `brex.api.budgets.update` | `write` | Update a budget |
| `cards.create` | `brex.api.cards.create` | `write` | Create a card and assign it to a user |
| `cards.get` | `brex.api.cards.get` | `read` | Get a card by ID |
| `cards.getPan` | `brex.api.cards.getPan` | `read` | Get card number, CVV, and expiration |
| `cards.list` | `brex.api.cards.list` | `read` | List cards, optionally by user_id |
| `cards.update` | `brex.api.cards.update` | `write` | Update card spend_controls for limit_type=CARD |
| `cards.updateStatus` | `brex.api.cards.updateStatus` | `destructive` | Lock, unlock, or terminate a card |
| `company.get` | `brex.api.company.get` | `read` | Get the company for the current token |
| `departments.create` | `brex.api.departments.create` | `write` | Create a department |
| `departments.get` | `brex.api.departments.get` | `read` | Get a department by ID |
| `departments.list` | `brex.api.departments.list` | `read` | List departments |
| `expenses.get` | `brex.api.expenses.get` | `read` | Get an expense by ID |
| `expenses.getCard` | `brex.api.expenses.getCard` | `read` | Get a card expense (deprecated official path) |
| `expenses.list` | `brex.api.expenses.list` | `read` | List expenses |
| `expenses.listByBudget` | `brex.api.expenses.listByBudget` | `read` | List expenses for a budget_id |
| `expenses.update` | `brex.api.expenses.update` | `write` | Update a card expense |
| `fields.create` | `brex.api.fields.create` | `write` | Create a custom field |
| `fields.delete` | `brex.api.fields.delete` | `destructive` | Delete a custom field |
| `fields.get` | `brex.api.fields.get` | `read` | Get a custom field by ID |
| `fields.list` | `brex.api.fields.list` | `read` | List custom fields |
| `fields.update` | `brex.api.fields.update` | `write` | Update a custom field |
| `fieldValues.create` | `brex.api.fieldValues.create` | `write` | Create custom field values (up to 1000) |
| `fieldValues.delete` | `brex.api.fieldValues.delete` | `destructive` | Delete custom field values (up to 1000) |
| `fieldValues.get` | `brex.api.fieldValues.get` | `read` | Get a field value by field ID and value ID |
| `fieldValues.list` | `brex.api.fieldValues.list` | `read` | List values for a custom field |
| `fieldValues.update` | `brex.api.fieldValues.update` | `write` | Update custom field values (up to 1000) |
| `legalEntities.get` | `brex.api.legalEntities.get` | `read` | Get a legal entity by ID |
| `legalEntities.list` | `brex.api.legalEntities.list` | `read` | List legal entities |
| `locations.create` | `brex.api.locations.create` | `write` | Create a location |
| `locations.get` | `brex.api.locations.get` | `read` | Get a location by ID |
| `locations.list` | `brex.api.locations.list` | `read` | List locations |
| `receipts.match` | `brex.api.receipts.match` | `write` | Create a receipt-match upload URI |
| `receipts.upload` | `brex.api.receipts.upload` | `write` | Create a receipt upload URI for a card expense |
| `referrals.create` | `brex.api.referrals.create` | `write` | Create a referral and application link |
| `referrals.createDocument` | `brex.api.referrals.createDocument` | `write` | Create a referral document upload URI |
| `referrals.get` | `brex.api.referrals.get` | `read` | Get a referral by ID |
| `referrals.list` | `brex.api.referrals.list` | `read` | List active referrals |
| `spendLimits.archive` | `brex.api.spendLimits.archive` | `destructive` | Archive a spend limit |
| `spendLimits.create` | `brex.api.spendLimits.create` | `write` | Create a spend limit |
| `spendLimits.get` | `brex.api.spendLimits.get` | `read` | Get a spend limit by ID |
| `spendLimits.list` | `brex.api.spendLimits.list` | `read` | List spend limits |
| `spendLimits.update` | `brex.api.spendLimits.update` | `write` | Update a spend limit |
| `spendLimitsV1.create` | `brex.api.spendLimitsV1.create` | `write` | Create a v1 spend limit (legacy /v1/budgets) |
| `spendLimitsV1.update` | `brex.api.spendLimitsV1.update` | `write` | Update a v1 spend limit (legacy /v1/budgets) |
| `titles.create` | `brex.api.titles.create` | `write` | Create a job title |
| `titles.get` | `brex.api.titles.get` | `read` | Get a job title by ID |
| `titles.list` | `brex.api.titles.list` | `read` | List job titles |
| `transactions.byAmountRange` | `brex.api.transactions.byAmountRange` | `read` | Filter settled card transactions by USD amount after official paging |
| `transactions.byDescription` | `brex.api.transactions.byDescription` | `read` | Filter settled card transactions by description after official paging |
| `transactions.getById` | `brex.api.transactions.getById` | `read` | Find a settled card transaction by ID by paging official list results |
| `transactions.list` | `brex.api.transactions.list` | `read` | List settled card transactions. Date filters are client-side after paging. |
| `transfers.list` | `brex.api.transfers.list` | `read` | List transfers |
| `trips.list` | `brex.api.trips.list` | `read` | List trips |
| `users.create` | `brex.api.users.create` | `write` | Invite a user as an employee |
| `users.get` | `brex.api.users.get` | `read` | Get a user by ID, or /me when id is "me" |
| `users.getLimit` | `brex.api.users.getLimit` | `read` | Get the monthly spend limit for a user |
| `users.getMe` | `brex.api.users.getMe` | `read` | Get the user for the current access token |
| `users.list` | `brex.api.users.list` | `read` | List users in the Brex account |
| `users.setLimit` | `brex.api.users.setLimit` | `write` | Set monthly_limit in cents, or null to remove it |
| `users.update` | `brex.api.users.update` | `write` | Update a user; omitted fields stay unchanged |
| `vendors.create` | `brex.api.vendors.create` | `write` | Create a vendor |
| `vendors.delete` | `brex.api.vendors.delete` | `destructive` | Delete a vendor |
| `vendors.get` | `brex.api.vendors.get` | `read` | Get a vendor by ID |
| `vendors.list` | `brex.api.vendors.list` | `read` | List vendors |
| `vendors.update` | `brex.api.vendors.update` | `write` | Update a vendor |
| `webhookGroups.addMembers` | `brex.api.webhookGroups.addMembers` | `write` | Add webhook subscriptions to a group |
| `webhookGroups.create` | `brex.api.webhookGroups.create` | `write` | Create a webhook group (partners) |
| `webhookGroups.get` | `brex.api.webhookGroups.get` | `read` | Get a webhook group (partners) |
| `webhookGroups.list` | `brex.api.webhookGroups.list` | `read` | List webhook groups (partners) |
| `webhookGroups.listMembers` | `brex.api.webhookGroups.listMembers` | `read` | List webhook group members |
| `webhooks.create` | `brex.api.webhooks.create` | `write` | Register a webhook subscription |
| `webhooks.get` | `brex.api.webhooks.get` | `read` | Get a webhook subscription |
| `webhooks.list` | `brex.api.webhooks.list` | `read` | List webhook subscriptions |
| `webhooks.listSecrets` | `brex.api.webhooks.listSecrets` | `read` | List webhook signing secrets |
| `webhooks.update` | `brex.api.webhooks.update` | `write` | Update a webhook subscription |

## Auth

Auth: API key, OAuth 2.0 (default API key). Set `authType` on the plugin factory to pick one.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/brex

## License

Apache-2.0
