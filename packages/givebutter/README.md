# @corsair-dev/givebutter

Givebutter plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/givebutter
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `activities.create` | `givebutter.api.activities.create` | `write` | Create a contact activity. |
| `activities.delete` | `givebutter.api.activities.delete` | `destructive` | Delete a contact activity. |
| `activities.get` | `givebutter.api.activities.get` | `read` | Get a contact activity. |
| `activities.list` | `givebutter.api.activities.list` | `read` | List contact activities. |
| `activities.update` | `givebutter.api.activities.update` | `write` | Update a contact activity. |
| `campaigns.create` | `givebutter.api.campaigns.create` | `write` | Create a fundraising campaign. |
| `campaigns.delete` | `givebutter.api.campaigns.delete` | `destructive` | Delete a fundraising campaign. |
| `campaigns.get` | `givebutter.api.campaigns.get` | `read` | Get a fundraising campaign. |
| `campaigns.list` | `givebutter.api.campaigns.list` | `read` | List fundraising campaigns. |
| `campaigns.update` | `givebutter.api.campaigns.update` | `write` | Update a fundraising campaign. |
| `contacts.create` | `givebutter.api.contacts.create` | `write` | Create a contact. |
| `contacts.delete` | `givebutter.api.contacts.delete` | `destructive` | Delete a contact. |
| `contacts.get` | `givebutter.api.contacts.get` | `read` | Get a contact. |
| `contacts.list` | `givebutter.api.contacts.list` | `read` | List contacts. |
| `contacts.restore` | `givebutter.api.contacts.restore` | `write` | Restore a deleted contact. |
| `contacts.update` | `givebutter.api.contacts.update` | `write` | Update a contact. |
| `contactTags.add` | `givebutter.api.contactTags.add` | `write` | Add tags to a contact. |
| `contactTags.remove` | `givebutter.api.contactTags.remove` | `write` | Remove tags from a contact. |
| `contactTags.sync` | `givebutter.api.contactTags.sync` | `write` | Replace a contact’s tags. |
| `discountCodes.create` | `givebutter.api.discountCodes.create` | `write` | Create a campaign discount code. |
| `discountCodes.delete` | `givebutter.api.discountCodes.delete` | `destructive` | Delete a campaign discount code. |
| `discountCodes.get` | `givebutter.api.discountCodes.get` | `read` | Get a campaign discount code. |
| `discountCodes.list` | `givebutter.api.discountCodes.list` | `read` | List a campaign’s discount codes. |
| `discountCodes.update` | `givebutter.api.discountCodes.update` | `write` | Update a campaign discount code. |
| `funds.create` | `givebutter.api.funds.create` | `write` | Create a fund. |
| `funds.delete` | `givebutter.api.funds.delete` | `destructive` | Delete a fund. |
| `funds.get` | `givebutter.api.funds.get` | `read` | Get a fund. |
| `funds.list` | `givebutter.api.funds.list` | `read` | List funds. |
| `funds.update` | `givebutter.api.funds.update` | `write` | Update a fund. |
| `householdContacts.add` | `givebutter.api.householdContacts.add` | `write` | Add a contact to a household. |
| `householdContacts.get` | `givebutter.api.householdContacts.get` | `read` | Get a household contact. |
| `householdContacts.list` | `givebutter.api.householdContacts.list` | `read` | List contacts in a household. |
| `householdContacts.remove` | `givebutter.api.householdContacts.remove` | `destructive` | Remove a contact from a household. |
| `households.create` | `givebutter.api.households.create` | `write` | Create a household. |
| `households.delete` | `givebutter.api.households.delete` | `destructive` | Delete a household. |
| `households.get` | `givebutter.api.households.get` | `read` | Get a household. |
| `households.list` | `givebutter.api.households.list` | `read` | List households. |
| `households.update` | `givebutter.api.households.update` | `write` | Update a household. |
| `members.delete` | `givebutter.api.members.delete` | `destructive` | Remove a campaign member. |
| `members.get` | `givebutter.api.members.get` | `read` | Get a campaign member. |
| `members.list` | `givebutter.api.members.list` | `read` | List a campaign’s members. |
| `messages.get` | `givebutter.api.messages.get` | `read` | Get a message. |
| `messages.list` | `givebutter.api.messages.list` | `read` | List messages. |
| `payouts.get` | `givebutter.api.payouts.get` | `read` | Get a payout. |
| `payouts.list` | `givebutter.api.payouts.list` | `read` | List payouts. |
| `plans.get` | `givebutter.api.plans.get` | `read` | Get a recurring plan. |
| `plans.list` | `givebutter.api.plans.list` | `read` | List recurring plans. |
| `pledges.get` | `givebutter.api.pledges.get` | `read` | Get a pledge. |
| `pledges.list` | `givebutter.api.pledges.list` | `read` | List pledges. |
| `sso.account` | `givebutter.api.sso.account` | `read` | Get the SSO account. |
| `sso.campaign` | `givebutter.api.sso.campaign` | `read` | Get a campaign through the SSO API. |
| `teams.delete` | `givebutter.api.teams.delete` | `destructive` | Remove a campaign team. |
| `teams.get` | `givebutter.api.teams.get` | `read` | Get a campaign team. |
| `teams.list` | `givebutter.api.teams.list` | `read` | List a campaign’s teams. |
| `ticketItems.create` | `givebutter.api.ticketItems.create` | `write` | Create a campaign ticket item. |
| `ticketItems.get` | `givebutter.api.ticketItems.get` | `read` | Get a campaign ticket item. |
| `ticketItems.list` | `givebutter.api.ticketItems.list` | `read` | List a campaign’s ticket items. |
| `tickets.get` | `givebutter.api.tickets.get` | `read` | Get an issued ticket. |
| `tickets.list` | `givebutter.api.tickets.list` | `read` | List issued tickets. |
| `transactions.create` | `givebutter.api.transactions.create` | `write` | Create an offline transaction. |
| `transactions.get` | `givebutter.api.transactions.get` | `read` | Get a transaction. |
| `transactions.list` | `givebutter.api.transactions.list` | `read` | List transactions. |
| `transactions.update` | `givebutter.api.transactions.update` | `write` | Update a transaction. |
| `webhooks.activities.get` | `givebutter.api.webhooks.activities.get` | `read` | Get an outbound webhook activity. |
| `webhooks.activities.list` | `givebutter.api.webhooks.activities.list` | `read` | List outbound webhook activities. |
| `webhooks.create` | `givebutter.api.webhooks.create` | `write` | Create an outbound webhook registration. |
| `webhooks.delete` | `givebutter.api.webhooks.delete` | `destructive` | Delete an outbound webhook registration. |
| `webhooks.get` | `givebutter.api.webhooks.get` | `read` | Get an outbound webhook registration. |
| `webhooks.list` | `givebutter.api.webhooks.list` | `read` | List outbound webhook registrations. |
| `webhooks.update` | `givebutter.api.webhooks.update` | `write` | Update an outbound webhook registration. |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/givebutter

## License

Apache-2.0
