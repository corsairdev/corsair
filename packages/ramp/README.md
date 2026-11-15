# @corsair-dev/ramp

Ramp plugin for Corsair: reads card transactions, bills, reimbursements, virtual cards, merchants, users and departments, splits a transaction, edits a bill and attaches memos through the Ramp Developer API.

## Install

```bash
pnpm add @corsair-dev/ramp
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `bills.get` | `ramp.api.bills.get` | `read` | Fetch one bill by id, including its vendor, payment details, line items and attachment URLs |
| `bills.list` | `ramp.api.bills.list` | `read` | List bills with filters for vendor, status, approval, payment and date ranges, plus cursor paging |
| `bills.update` | `ramp.api.bills.update` | `write` | Update a bill: its internal memo, the memo shown to the vendor, the invoice number or the due date |
| `business.get` | `ramp.api.business.get` | `read` | Fetch the business profile: legal and card names, billing address, SSO and reimbursement settings |
| `cards.listVirtual` | `ramp.api.cards.listVirtual` | `read` | List virtual cards with their fund, owner and suspension state; a terminated card is excluded unless asked for |
| `departments.create` | `ramp.api.departments.create` | `write` | Create a department with the given name |
| `departments.list` | `ramp.api.departments.list` | `read` | List the departments configured for the business |
| `memos.create` | `ramp.api.memos.create` | `write` | Attach a memo of up to 255 characters to a transaction, replacing the existing one |
| `memos.get` | `ramp.api.memos.get` | `read` | Read the memo attached to a transaction |
| `merchants.list` | `ramp.api.merchants.list` | `read` | List merchants the business has transacted with, optionally filtered by name, domain or transaction date |
| `reimbursements.list` | `ramp.api.reimbursements.list` | `read` | List reimbursements and repayments with filters for state, direction, user, entity and date ranges |
| `transactions.get` | `ramp.api.transactions.get` | `read` | Fetch one transaction by id, including its cardholder, merchant location, line items and approval state |
| `transactions.list` | `ramp.api.transactions.list` | `read` | List card transactions with filters for date, merchant, cardholder, state and approval, plus sorting and cursor paging |
| `transactions.update` | `ramp.api.transactions.update` | `write` | Replace or remove a transaction's line items: the amounts, split into minor units, must sum to the transaction amount |
| `users.get` | `ramp.api.users.get` | `read` | Fetch one user by id, including their role, department and manager |
| `users.list` | `ramp.api.users.list` | `read` | List users with filters for email, role, status, department, location and entity |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/ramp

## License

Apache-2.0
