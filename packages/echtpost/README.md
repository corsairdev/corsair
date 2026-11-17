# @corsair-dev/echtpost

Echtpost plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/echtpost
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `account.credits` | `echtpost.api.account.credits` | `read` | Get the credit balance, cards left and price per card. |
| `account.get` | `echtpost.api.account.get` | `read` | Get the account, user, API key metadata and balance. |
| `cards.cancel` | `echtpost.api.cards.cancel` | `destructive` | Cancel a card that has not been printed yet; it cannot be restored. |
| `cards.create` | `echtpost.api.cards.create` | `destructive` | Print and post a real postcard to each recipient; the account is billed per card. |
| `cards.createFromTemplate` | `echtpost.api.cards.createFromTemplate` | `destructive` | Print and post a real postcard from a saved template; the account is billed per card. |
| `cards.get` | `echtpost.api.cards.get` | `read` | Get one card and its status. |
| `cards.list` | `echtpost.api.cards.list` | `read` | List cards, filtered by status, delivery date or motive. |
| `cards.previewFit` | `echtpost.api.cards.previewFit` | `read` | Check whether card text fits at a font and size, without creating a card. |
| `contacts.create` | `echtpost.api.contacts.create` | `write` | Create a contact with a postal address. |
| `contacts.delete` | `echtpost.api.contacts.delete` | `destructive` | Delete a contact. |
| `contacts.get` | `echtpost.api.contacts.get` | `read` | Get one contact by id. |
| `contacts.list` | `echtpost.api.contacts.list` | `read` | List contacts (postcard recipients), with filters and paging. |
| `contacts.update` | `echtpost.api.contacts.update` | `write` | Update a contact; fields left out stay as they are. |
| `groups.create` | `echtpost.api.groups.create` | `write` | Create a contact group. |
| `groups.delete` | `echtpost.api.groups.delete` | `destructive` | Delete a group. |
| `groups.get` | `echtpost.api.groups.get` | `read` | Get one group by id. |
| `groups.list` | `echtpost.api.groups.list` | `read` | List contact groups. |
| `groups.update` | `echtpost.api.groups.update` | `write` | Rename a group or change its external id. |
| `motives.get` | `echtpost.api.motives.get` | `read` | Get one motive and what text fields it allows. |
| `motives.list` | `echtpost.api.motives.list` | `read` | List the postcard motives (front designs) the account can use. |
| `templates.get` | `echtpost.api.templates.get` | `read` | Get one saved template by id. |
| `templates.list` | `echtpost.api.templates.list` | `read` | List saved Echtpost postcard templates. |

## Auth

Auth: an EchtPost API key (Account > API keys), sent as `X-Api-Key`. `ep_test_` keys are sandbox keys: nothing is printed or billed.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/echtpost

## License

Apache-2.0
