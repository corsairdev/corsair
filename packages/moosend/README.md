# @corsair-dev/moosend

Email marketing with Moosend - manage mailing lists and subscribers, subscribe and update contacts, and unsubscribe or remove them.

## Install

```bash
pnpm add @corsair-dev/moosend
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `lists.create` | `moosend.api.lists.create` | `write` | Create an empty mailing list |
| `lists.delete` | `moosend.api.lists.delete` | `destructive` | Delete a mailing list and its subscriber data; cannot be undone |
| `lists.get` | `moosend.api.lists.get` | `read` | Read one mailing list with its custom fields, optionally without subscriber statistics |
| `lists.list` | `moosend.api.lists.list` | `read` | List every active mailing list in the account, with subscriber statistics and custom fields |
| `lists.listPaged` | `moosend.api.lists.listPaged` | `read` | List mailing lists one page at a time |
| `lists.update` | `moosend.api.lists.update` | `write` | Update a mailing list name and confirmation pages |
| `subscribers.getByEmail` | `moosend.api.subscribers.getByEmail` | `read` | Find a subscriber by email address in one mailing list |
| `subscribers.getById` | `moosend.api.subscribers.getById` | `read` | Find a subscriber by its unique id in one mailing list |
| `subscribers.list` | `moosend.api.subscribers.list` | `read` | List a mailing list by subscriber status (subscribed, unsubscribed or cleaned), one page at a time |
| `subscribers.remove` | `moosend.api.subscribers.remove` | `destructive` | Remove a subscriber from the mailing list permanently, without the suppression list |
| `subscribers.subscribe` | `moosend.api.subscribers.subscribe` | `write` | Add a subscriber, updating the existing entry when the email is already on the list |
| `subscribers.subscribeMany` | `moosend.api.subscribers.subscribeMany` | `write` | Add many subscribers in one call; invalid addresses are skipped silently by Moosend |
| `subscribers.unsubscribe` | `moosend.api.subscribers.unsubscribe` | `write` | Unsubscribe an email from one mailing list, moving it to the suppression list; subscribe adds it back |
| `subscribers.update` | `moosend.api.subscribers.update` | `write` | Update a subscriber's email, name and custom fields |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/moosend

## License

Apache-2.0
