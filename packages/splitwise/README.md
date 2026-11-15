# @corsair-dev/splitwise

Splitwise plugin for Corsair: read and write groups, friends, expenses, comments and notifications on a Splitwise account.

## Install

```bash
pnpm add @corsair-dev/splitwise
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `categories.list` | `splitwise.api.categories.list` | `read` | List expense categories with their subcategories; an expense must use a subcategory |
| `comments.create` | `splitwise.api.comments.create` | `write` | Post a comment on an expense |
| `comments.delete` | `splitwise.api.comments.delete` | `destructive` | Delete a comment; this cannot be undone |
| `comments.list` | `splitwise.api.comments.list` | `read` | List the comments on an expense |
| `currencies.list` | `splitwise.api.currencies.list` | `read` | List the currency codes Splitwise accepts |
| `expenses.create` | `splitwise.api.expenses.create` | `write` | Record an expense, split either equally across a group or by an explicit paid and owed share per person |
| `expenses.delete` | `splitwise.api.expenses.delete` | `destructive` | Delete an expense; it can be restored with `expenses.undelete` |
| `expenses.get` | `splitwise.api.expenses.get` | `read` | Get one expense with its shares, repayments and comments |
| `expenses.list` | `splitwise.api.expenses.list` | `read` | List the current user expenses, filtered by group, friend or date, with limit and offset paging |
| `expenses.undelete` | `splitwise.api.expenses.undelete` | `write` | Restore a deleted expense |
| `expenses.update` | `splitwise.api.expenses.update` | `write` | Change an expense; passing any share replaces every share on it |
| `friends.add` | `splitwise.api.friends.add` | `write` | Add a friend by email; a first name is needed when the person has no Splitwise account yet |
| `friends.addMany` | `splitwise.api.friends.addMany` | `write` | Add several friends in one call, returning each result alongside any errors |
| `friends.delete` | `splitwise.api.friends.delete` | `destructive` | Break off the friendship; Splitwise keeps the expenses but the friend is removed from the list and there is no undelete call |
| `friends.get` | `splitwise.api.friends.get` | `read` | Get one friend with their balances and shared groups |
| `friends.list` | `splitwise.api.friends.list` | `read` | List the current user friends with the balance owed either way |
| `groups.addUser` | `splitwise.api.groups.addUser` | `write` | Add a Splitwise user, or a new person by name and email, to a group |
| `groups.create` | `splitwise.api.groups.create` | `write` | Create a group and add members by user ID or by name and email; the current user is added automatically |
| `groups.delete` | `splitwise.api.groups.delete` | `destructive` | Delete a group and every expense in it; the group can be restored with `groups.undelete` |
| `groups.get` | `splitwise.api.groups.get` | `read` | Get one group with its members, balances and debts |
| `groups.list` | `splitwise.api.groups.list` | `read` | List the current user groups with their members, balances and simplified debts; expenses outside a group appear as group 0 |
| `groups.removeUser` | `splitwise.api.groups.removeUser` | `write` | Remove a user from a group; Splitwise refuses while that user has a non-zero balance |
| `groups.undelete` | `splitwise.api.groups.undelete` | `write` | Restore a deleted group |
| `notifications.list` | `splitwise.api.notifications.list` | `read` | List recent activity on the account, newest first, optionally after a given time |
| `users.get` | `splitwise.api.users.get` | `read` | Get another user by ID; Splitwise only answers for people you share a group or expense with |
| `users.getCurrentUser` | `splitwise.api.users.getCurrentUser` | `read` | Get the user the key belongs to, with its notification settings and unread count |
| `users.update` | `splitwise.api.users.update` | `write` | Change a user's name, email, password, locale or default currency |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/splitwise

## License

Apache-2.0
