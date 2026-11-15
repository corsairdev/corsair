# @corsair-dev/teltel

TelTEL plugin for Corsair: send SMS one at a time or in bulk, read outbound and inbound message reports, run SMS campaigns, manage contacts and groups, place click-to-call calls, and read DID numbers and countries.

## Install

```bash
pnpm add @corsair-dev/teltel
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `account.balance` | `teltel.api.account.balance` | `read` | Read the account balance, its credit limit and any outstanding amount |
| `calls.create` | `teltel.api.calls.create` | `write` | Place a click-to-call between two numbers, which bills per minute once answered |
| `calls.list` | `teltel.api.calls.list` | `read` | List calls with their duration, cost and hangup reason, filtered by direction or start time |
| `campaigns.action` | `teltel.api.campaigns.action` | `write` | Start, pause or stop a campaign; start sends to every contact in its groups |
| `campaigns.create` | `teltel.api.campaigns.create` | `write` | Create an SMS campaign for a set of contact groups; it does not send until `campaigns.action` starts it |
| `campaigns.delete` | `teltel.api.campaigns.delete` | `destructive` | Delete an SMS campaign and its history |
| `campaigns.get` | `teltel.api.campaigns.get` | `read` | Read one SMS campaign by ID |
| `campaigns.list` | `teltel.api.campaigns.list` | `read` | List SMS campaigns with their state, sender and rate |
| `campaigns.update` | `teltel.api.campaigns.update` | `write` | Change a campaign's title, sender, groups, message or rate |
| `contactGroups.contacts` | `teltel.api.contactGroups.contacts` | `read` | List the contacts in one group |
| `contactGroups.create` | `teltel.api.contactGroups.create` | `write` | Create a contact group |
| `contactGroups.delete` | `teltel.api.contactGroups.delete` | `destructive` | Delete a contact group and its contacts |
| `contactGroups.get` | `teltel.api.contactGroups.get` | `read` | Read one contact group by ID |
| `contactGroups.list` | `teltel.api.contactGroups.list` | `read` | List contact groups with their contact counts |
| `contactGroups.update` | `teltel.api.contactGroups.update` | `write` | Rename a contact group |
| `contacts.create` | `teltel.api.contacts.create` | `write` | Add a contact to a contact group |
| `contacts.createBulk` | `teltel.api.contacts.createBulk` | `write` | Add many contacts in one call; a partial result reports which entries failed |
| `contacts.delete` | `teltel.api.contacts.delete` | `destructive` | Delete a contact |
| `contacts.get` | `teltel.api.contacts.get` | `read` | Read one contact by ID |
| `contacts.list` | `teltel.api.contacts.list` | `read` | List contacts with their group and custom fields |
| `contacts.update` | `teltel.api.contacts.update` | `write` | Change a contact's phone, group or custom fields |
| `inbox.get` | `teltel.api.inbox.get` | `read` | Read one inbound message by ID |
| `inbox.list` | `teltel.api.inbox.list` | `read` | List inbound messages with their sender and handler |
| `numberCountries.get` | `teltel.api.numberCountries.get` | `read` | Read one number country by ID |
| `numberCountries.list` | `teltel.api.numberCountries.list` | `read` | List the countries numbers can be ordered in, with their prefix and SMS support |
| `numbers.get` | `teltel.api.numbers.get` | `read` | Read one DID number by ID |
| `numbers.list` | `teltel.api.numbers.list` | `read` | List the DID numbers on the account with their renewal date and SMS settings |
| `numbers.update` | `teltel.api.numbers.update` | `write` | Change a number's auto-renew, description or SMS handler |
| `priceGroups.list` | `teltel.api.priceGroups.list` | `read` | List a country's price groups, whose IDs an order takes |
| `sms.send` | `teltel.api.sms.send` | `write` | Send one SMS from a verified number or sender ID, charging the account per part |
| `sms.sendBulk` | `teltel.api.sms.sendBulk` | `write` | Send many SMS in one call; a partial result answers 207 with the messages that failed |
| `smsReports.get` | `teltel.api.smsReports.get` | `read` | Read one outbound message report by ID |
| `smsReports.list` | `teltel.api.smsReports.list` | `read` | List outbound messages with their state, price and delivery details, filtered by number or date |
| `users.list` | `teltel.api.users.list` | `read` | List the account users with their login and email |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/teltel

## License

Apache-2.0
