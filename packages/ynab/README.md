# @corsair-dev/ynab

YNAB plugin for Corsair - read budgets, accounts, categories, payees and months, assign money to categories, and create, update and delete transactions and scheduled transactions.

## Install

```bash
pnpm add @corsair-dev/ynab
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `accounts.create` | `ynab.api.accounts.create` | `write` | Create an account with a type and an opening balance, given in milliunits |
| `accounts.get` | `ynab.api.accounts.get` | `read` | Read one account with its balance and on-budget flag |
| `accounts.list` | `ynab.api.accounts.list` | `read` | List the accounts in a budget with their cleared and uncleared balances |
| `budgets.get` | `ynab.api.budgets.get` | `read` | Read a whole budget: every account, category, payee, month and transaction; `last-used` reaches the most recent |
| `budgets.list` | `ynab.api.budgets.list` | `read` | List the budgets the token can see, with their date ranges |
| `categories.get` | `ynab.api.categories.get` | `read` | Read one category with its budgeted and balance amounts |
| `categories.list` | `ynab.api.categories.list` | `read` | List the category groups and categories with their budgeted, activity and balance amounts |
| `categories.update` | `ynab.api.categories.update` | `write` | Set the amount assigned to a category for a month; the value replaces rather than adds, in milliunits |
| `months.get` | `ynab.api.months.get` | `read` | Read one month with its categories, income and how much is still unassigned |
| `months.list` | `ynab.api.months.list` | `read` | List the budget months with their income, budgeted and to-be-budgeted totals |
| `payees.create` | `ynab.api.payees.create` | `write` | Create a payee |
| `payees.get` | `ynab.api.payees.get` | `read` | Read one payee |
| `payees.list` | `ynab.api.payees.list` | `read` | List the payees in a budget |
| `payees.update` | `ynab.api.payees.update` | `write` | Rename a payee |
| `transactions.create` | `ynab.api.transactions.create` | `write` | Create up to 500 transactions in one call; an import_id makes a repeat update rather than duplicate |
| `transactions.delete` | `ynab.api.transactions.delete` | `destructive` | Delete a transaction, which answers the transaction as it was |
| `transactions.get` | `ynab.api.transactions.get` | `read` | Read one transaction with its amount, splits and cleared state |
| `transactions.list` | `ynab.api.transactions.list` | `read` | List transactions, optionally since a date or only the uncategorized or unapproved ones |
| `transactions.scheduledCreate` | `ynab.api.transactions.scheduledCreate` | `write` | Create a scheduled transaction that repeats on a given frequency |
| `transactions.scheduledDelete` | `ynab.api.transactions.scheduledDelete` | `destructive` | Delete a scheduled transaction |
| `transactions.scheduledGet` | `ynab.api.transactions.scheduledGet` | `read` | Read one scheduled transaction |
| `transactions.scheduledList` | `ynab.api.transactions.scheduledList` | `read` | List scheduled transactions with their frequency and next date |
| `transactions.update` | `ynab.api.transactions.update` | `write` | Change a transaction amount, date, payee, category, memo or cleared state |
| `user.get` | `ynab.api.user.get` | `read` | Read the user behind the token, which is the cheapest way to check it |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/ynab

## License

Apache-2.0
