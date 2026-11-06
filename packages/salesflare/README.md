# @corsair-dev/salesflare

Salesflare plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/salesflare
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `accounts.addAccountContacts` | `salesflare.api.accounts.addAccountContacts` | `write` | Link contacts to an account |
| `accounts.addAccountUsers` | `salesflare.api.accounts.addAccountUsers` | `write` | Add users to an account |
| `accounts.createAccount` | `salesflare.api.accounts.createAccount` | `write` | Create a new account |
| `accounts.deleteAccount` | `salesflare.api.accounts.deleteAccount` | `destructive` | Delete a account |
| `accounts.listAccountFeed` | `salesflare.api.accounts.listAccountFeed` | `read` | List the activity feed of an account |
| `accounts.listAccountMessages` | `salesflare.api.accounts.listAccountMessages` | `read` | List messages on an account |
| `accounts.listAccounts` | `salesflare.api.accounts.listAccounts` | `read` | List Accounts |
| `accounts.retrieveAccount` | `salesflare.api.accounts.retrieveAccount` | `read` | Retrieve a single account by ID |
| `accounts.updateAccount` | `salesflare.api.accounts.updateAccount` | `write` | Update a account |
| `accounts.updateAccountContacts` | `salesflare.api.accounts.updateAccountContacts` | `write` | Update the contact links of an account |
| `accounts.updateAccountUsers` | `salesflare.api.accounts.updateAccountUsers` | `write` | Update the users assigned to an account |
| `contacts.createContact` | `salesflare.api.contacts.createContact` | `write` | Create a new contact |
| `contacts.deleteContact` | `salesflare.api.contacts.deleteContact` | `destructive` | Delete a contact |
| `contacts.listContacts` | `salesflare.api.contacts.listContacts` | `read` | List Contacts |
| `contacts.retrieveContact` | `salesflare.api.contacts.retrieveContact` | `read` | Retrieve a single contact by ID |
| `contacts.updateContact` | `salesflare.api.contacts.updateContact` | `write` | Update a contact |
| `customfields.createCustomFieldSub` | `salesflare.api.customfields.createCustomFieldSub` | `write` | Create a new customField sub-resource |
| `customfields.deleteCustomField` | `salesflare.api.customfields.deleteCustomField` | `destructive` | Delete a customField |
| `customfields.listCustomFieldOptions` | `salesflare.api.customfields.listCustomFieldOptions` | `read` | List the options of a custom field |
| `customfields.listCustomFields` | `salesflare.api.customfields.listCustomFields` | `read` | List the custom fields of an item class |
| `customfields.listCustomFieldTypes` | `salesflare.api.customfields.listCustomFieldTypes` | `read` | List the custom field types supported by Salesflare |
| `customfields.retrieveCustomField` | `salesflare.api.customfields.retrieveCustomField` | `read` | Retrieve a single customField by ID |
| `customfields.updateCustomField` | `salesflare.api.customfields.updateCustomField` | `write` | Update a customField |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/salesflare

## License

Apache-2.0
