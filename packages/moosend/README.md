# @corsair-dev/moosend

Email marketing with Moosend - mailing lists, custom fields, subscribers and tags, segments, draft and sent campaigns with their reports, senders, and transactional email.

## Install

```bash
pnpm add @corsair-dev/moosend
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `campaigns.abSummary` | `moosend.api.campaigns.abSummary` | `read` | Read an A/B campaign's totals per version |
| `campaigns.activityByLocation` | `moosend.api.campaigns.activityByLocation` | `read` | Count campaign opens per country |
| `campaigns.clone` | `moosend.api.campaigns.clone` | `write` | Copy a campaign into a new draft and return the copy |
| `campaigns.create` | `moosend.api.campaigns.create` | `write` | Create a draft campaign (regular or A/B); nothing is sent |
| `campaigns.delete` | `moosend.api.campaigns.delete` | `destructive` | Delete a campaign; cannot be undone |
| `campaigns.get` | `moosend.api.campaigns.get` | `read` | Read one campaign with its content, sender and mailing lists (no statistics) |
| `campaigns.linkActivity` | `moosend.api.campaigns.linkActivity` | `read` | Count campaign clicks per link |
| `campaigns.list` | `moosend.api.campaigns.list` | `read` | List campaigns (drafts, scheduled and sent) with their totals, optionally by page and page size |
| `campaigns.schedule` | `moosend.api.campaigns.schedule` | `destructive` | Schedule a draft campaign to be sent at a set time |
| `campaigns.send` | `moosend.api.campaigns.send` | `destructive` | Send a draft campaign to its mailing lists now |
| `campaigns.sendTest` | `moosend.api.campaigns.sendTest` | `destructive` | Email a test copy of a campaign to up to 5 addresses |
| `campaigns.stats` | `moosend.api.campaigns.stats` | `read` | List per-recipient campaign activity of one type (sent, opened, clicked, bounced, unsubscribed, complained), with paging and dates |
| `campaigns.summary` | `moosend.api.campaigns.summary` | `read` | Read a campaign's totals: sent, opens, clicks, bounces, complaints, unsubscribes |
| `campaigns.unschedule` | `moosend.api.campaigns.unschedule` | `write` | Cancel a scheduled send; the campaign goes back to draft |
| `campaigns.update` | `moosend.api.campaigns.update` | `write` | Change a draft campaign; nothing is sent |
| `customFields.create` | `moosend.api.customFields.create` | `write` | Add a custom field (text, number, date, dropdown or checkbox) to a mailing list |
| `customFields.delete` | `moosend.api.customFields.delete` | `destructive` | Remove a custom field and every subscriber's value for it; cannot be undone |
| `customFields.update` | `moosend.api.customFields.update` | `write` | Change a custom field's name, type, options or visibility |
| `lists.create` | `moosend.api.lists.create` | `write` | Create an empty mailing list |
| `lists.delete` | `moosend.api.lists.delete` | `destructive` | Delete a mailing list and its subscribers; cannot be undone |
| `lists.get` | `moosend.api.lists.get` | `read` | Read one mailing list with its custom field definitions |
| `lists.list` | `moosend.api.lists.list` | `read` | List the active mailing lists with subscriber counts and custom field definitions (first page of 10) |
| `lists.listPaged` | `moosend.api.lists.listPaged` | `read` | List mailing lists one page at a time |
| `lists.update` | `moosend.api.lists.update` | `write` | Change a mailing list's name, confirmation and unsubscribe pages, or preferences |
| `segments.addCriteria` | `moosend.api.segments.addCriteria` | `write` | Add one criterion to a segment; returns its position for updateCriteria |
| `segments.create` | `moosend.api.segments.create` | `write` | Create a segment of a mailing list, empty or with criteria |
| `segments.delete` | `moosend.api.segments.delete` | `destructive` | Delete a segment; its subscribers stay on the list. Cannot be undone |
| `segments.get` | `moosend.api.segments.get` | `read` | Read one segment with its criteria |
| `segments.list` | `moosend.api.segments.list` | `read` | List a mailing list's segments with their criteria |
| `segments.members` | `moosend.api.segments.members` | `read` | List the subscribers a segment matches, one page at a time |
| `segments.update` | `moosend.api.segments.update` | `write` | Change a segment's name and match settings; criteria, when given, replace all existing ones |
| `segments.updateCriteria` | `moosend.api.segments.updateCriteria` | `write` | Change one segment criterion, addressed by its position (1 = first) |
| `senders.get` | `moosend.api.senders.get` | `read` | Read one sender by email address |
| `senders.list` | `moosend.api.senders.list` | `read` | List the account senders (from addresses) with their SPF, DKIM and DMARC checks |
| `subscribers.addTags` | `moosend.api.subscribers.addTags` | `write` | Add tags to up to 1,000 subscribers of one mailing list |
| `subscribers.delete` | `moosend.api.subscribers.delete` | `destructive` | Delete a subscriber from one mailing list for good; cannot be undone |
| `subscribers.deleteFromAccount` | `moosend.api.subscribers.deleteFromAccount` | `destructive` | Delete an email address from every mailing list in the account (and optionally its sub-accounts); cannot be undone |
| `subscribers.deleteMany` | `moosend.api.subscribers.deleteMany` | `destructive` | Delete up to 1,000 subscribers from one mailing list for good; cannot be undone |
| `subscribers.getByEmail` | `moosend.api.subscribers.getByEmail` | `read` | Find a subscriber by email address in one mailing list |
| `subscribers.getById` | `moosend.api.subscribers.getById` | `read` | Find a subscriber by ID in one mailing list |
| `subscribers.getByIdAnyList` | `moosend.api.subscribers.getByIdAnyList` | `read` | Find a subscriber by ID without naming the mailing list |
| `subscribers.list` | `moosend.api.subscribers.list` | `read` | List a mailing list's subscribed, unsubscribed, bounced or removed members, one page at a time |
| `subscribers.remove` | `moosend.api.subscribers.remove` | `destructive` | Mark a subscriber as removed from one mailing list (no more campaigns) |
| `subscribers.removeMany` | `moosend.api.subscribers.removeMany` | `destructive` | Mark up to 1,000 subscribers as removed from one mailing list |
| `subscribers.removeTags` | `moosend.api.subscribers.removeTags` | `write` | Remove tags from up to 1,000 subscribers of one mailing list |
| `subscribers.subscribe` | `moosend.api.subscribers.subscribe` | `destructive` | Add a subscriber or update the one with that email; re-subscribes an unsubscribed contact, clears custom fields left out, and on a double opt-in list emails a confirmation unless hasExternalDoubleOptIn is true |
| `subscribers.subscribeMany` | `moosend.api.subscribers.subscribeMany` | `destructive` | Add or update up to 1,000 subscribers in one call (same effects as subscribe); Moosend skips invalid addresses and reports them in notice |
| `subscribers.unsubscribe` | `moosend.api.subscribers.unsubscribe` | `destructive` | Unsubscribe an email address from one mailing list |
| `subscribers.unsubscribeFromAccount` | `moosend.api.subscribers.unsubscribeFromAccount` | `destructive` | Unsubscribe an email address from every mailing list in the account |
| `subscribers.unsubscribeFromCampaign` | `moosend.api.subscribers.unsubscribeFromCampaign` | `destructive` | Unsubscribe an email address from one mailing list and count it against a campaign |
| `subscribers.update` | `moosend.api.subscribers.update` | `write` | Update a subscriber's email, name, tags, preferences and custom fields; custom fields left out are cleared |
| `transactional.send` | `moosend.api.transactional.send` | `destructive` | Send a transactional email (from a template or inline content) to the given recipients |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/moosend

## License

Apache-2.0
