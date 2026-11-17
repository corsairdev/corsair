# @corsair-dev/simplero

Email marketing and courses from Simplero: manage contacts, lists, tags and products, read purchases and subscriptions, and tag or unsubscribe a contact.

## Install

```bash
pnpm add @corsair-dev/simplero
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `customers.addTag` | `simplero.api.customers.addTag` | `write` | Add one tag or a list of tags to a contact, which can start the automations that tag is attached to |
| `customers.adjustLeadScore` | `simplero.api.customers.adjustLeadScore` | `write` | Add to a contact's lead score and record the change in their history; customers.update replaces the score instead |
| `customers.create` | `simplero.api.customers.create` | `write` | Create a contact. Email and lead score are the required pair; a score sent here replaces rather than adds |
| `customers.get` | `simplero.api.customers.get` | `read` | Read one contact: their name, email, phone, locale, consent flags, lead score and lifetime value |
| `customers.list` | `simplero.api.customers.list` | `read` | List contacts with filters for name, email, tag, segment, list, product and stage; page by number or continue with `after` |
| `customers.removeTag` | `simplero.api.customers.removeTag` | `write` | Remove one tag or a list of tags from a contact, which can stop the automations that tag is attached to |
| `customers.update` | `simplero.api.customers.update` | `write` | Change part of a contact. Only the fields sent change, so an omitted field keeps its stored value |
| `lists.create` | `simplero.api.lists.create` | `write` | Create an email list. Name and internal name are both required by Simplero |
| `lists.get` | `simplero.api.lists.get` | `read` | Read one list with its sender, confirmation settings and labels |
| `lists.list` | `simplero.api.lists.list` | `read` | List the email lists on the account with their names and handles |
| `lists.update` | `simplero.api.lists.update` | `write` | Change part of a list, such as its name, sender or whether signups need confirmation |
| `products.create` | `simplero.api.products.create` | `write` | Create a product. Name and internal name are both required by Simplero |
| `products.get` | `simplero.api.products.get` | `read` | Read one product with its descriptions, listing type and product type |
| `products.list` | `simplero.api.products.list` | `read` | List the products on the account, filtered by name, listing type or whether they recur |
| `products.update` | `simplero.api.products.update` | `write` | Change part of a product, such as its name, summary or listing type |
| `purchases.get` | `simplero.api.purchases.get` | `read` | Read one purchase with its state, amounts, buyer details and dates |
| `purchases.list` | `simplero.api.purchases.list` | `read` | List purchases with filters for state, customer, product, price and the purchase, cancel and refund dates |
| `purchases.update` | `simplero.api.purchases.update` | `write` | Change a purchase's buyer details and marketing preferences. Money movements (refund, cancel, capture, change price) are separate actions and are not wrapped |
| `subscriptions.get` | `simplero.api.subscriptions.get` | `read` | Read one subscription with whether it is active and confirmed, and when it was unsubscribed or suspended |
| `subscriptions.list` | `simplero.api.subscriptions.list` | `read` | List list subscriptions with filters for state, list, tag, email and the unsubscribe date |
| `subscriptions.resubscribe` | `simplero.api.subscriptions.resubscribe` | `write` | Put an unsubscribed contact back on a list, so they receive its mailings again |
| `subscriptions.unsubscribe` | `simplero.api.subscriptions.unsubscribe` | `write` | Unsubscribe a contact from a list; they stop receiving its mailings. Resubscribe puts them back |
| `subscriptions.update` | `simplero.api.subscriptions.update` | `write` | Change a subscription's tracking data. Whether a contact is subscribed changes through unsubscribe or resubscribe, not this body |
| `tags.create` | `simplero.api.tags.create` | `write` | Create a tag, which contacts can then be tagged with |
| `tags.get` | `simplero.api.tags.get` | `read` | Read one tag with its colour, owner and how many contacts carry it |
| `tags.list` | `simplero.api.tags.list` | `read` | List the tags on the account, optionally only those one owner created |
| `tags.update` | `simplero.api.tags.update` | `write` | Change part of a tag, such as its name, description or colour |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/simplero

## License

Apache-2.0
