# @corsair-dev/reamaze

Reamaze plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/reamaze
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `articles.create` | `reamaze.api.articles.create` | `write` | Create a help center article under a topic |
| `articles.get` | `reamaze.api.articles.get` | `read` | Read one help center article by slug |
| `articles.list` | `reamaze.api.articles.list` | `read` | List help center articles, filtered by status or search text |
| `articles.update` | `reamaze.api.articles.update` | `write` | Change an article title, body, status or topic |
| `channels.get` | `reamaze.api.channels.get` | `read` | Read one channel by slug |
| `channels.list` | `reamaze.api.channels.list` | `read` | List the brand channels, optionally by type |
| `contacts.create` | `reamaze.api.contacts.create` | `write` | Create a contact for the account |
| `contacts.list` | `reamaze.api.contacts.list` | `read` | List contacts, filtered by search text, type or data attributes |
| `contacts.update` | `reamaze.api.contacts.update` | `write` | Change a contact name, friendly name, avatar or data attributes, and append notes |
| `conversations.create` | `reamaze.api.conversations.create` | `write` | Create a conversation on behalf of a customer, with its first message |
| `conversations.get` | `reamaze.api.conversations.get` | `read` | Read one conversation by slug, reference id, or origin id within a channel |
| `conversations.list` | `reamaze.api.conversations.list` | `read` | List conversations, filtered by status, assignee, tag, channel, origin or date |
| `conversations.update` | `reamaze.api.conversations.update` | `write` | Change a conversation status, tags, assignee, data attributes or channel |
| `identities.create` | `reamaze.api.identities.create` | `write` | Attach an identity to a contact. An identity already on another contact is moved here with its messages |
| `identities.list` | `reamaze.api.identities.list` | `read` | List the emails, handles and phone numbers attached to a contact |
| `incidents.create` | `reamaze.api.incidents.create` | `write` | Create a status page incident with its first update, which shows on the public status page |
| `incidents.get` | `reamaze.api.incidents.get` | `read` | Read one status page incident by id |
| `incidents.list` | `reamaze.api.incidents.list` | `read` | List status page incidents |
| `incidents.update` | `reamaze.api.incidents.update` | `write` | Change a status page incident and append an update, which shows on the public status page |
| `messages.create` | `reamaze.api.messages.create` | `write` | Send a reply in a conversation. It goes out to the real customer and the other participants unless suppress_notifications is set. visibility 1 posts an internal note only staff see |
| `messages.list` | `reamaze.api.messages.list` | `read` | List messages across the brand, filtered by sender, tag, channel or date |
| `notes.create` | `reamaze.api.notes.create` | `write` | Add a note to one contact |
| `notes.delete` | `reamaze.api.notes.delete` | `destructive` | Delete one contact note. Re:amaze keeps no undo and the note text is not returned anywhere afterwards |
| `notes.list` | `reamaze.api.notes.list` | `read` | List the notes on one contact |
| `notes.update` | `reamaze.api.notes.update` | `write` | Replace the text of one contact note |
| `reports.channelSummary` | `reamaze.api.reports.channelSummary` | `read` | Per-channel response counts, response time, satisfaction and thread size |
| `reports.responseTime` | `reamaze.api.reports.responseTime` | `read` | Daily first-response time in seconds, with averages and ratios |
| `reports.staff` | `reamaze.api.reports.staff` | `read` | Per-staff response counts, response time and appreciations |
| `reports.tags` | `reamaze.api.reports.tags` | `read` | Tag usage counts over a date range |
| `reports.volume` | `reamaze.api.reports.volume` | `read` | Daily conversation volume over a date range |
| `responseTemplates.create` | `reamaze.api.responseTemplates.create` | `write` | Create a response template |
| `responseTemplates.get` | `reamaze.api.responseTemplates.get` | `read` | Read one response template by id |
| `responseTemplates.list` | `reamaze.api.responseTemplates.list` | `read` | List response templates, filtered by search text |
| `responseTemplates.update` | `reamaze.api.responseTemplates.update` | `write` | Change a response template name or body |
| `satisfaction.list` | `reamaze.api.satisfaction.list` | `read` | List satisfaction survey ratings, filtered by brand, rating or date |
| `staff.create` | `reamaze.api.staff.create` | `write` | Create a staff user, which counts toward the monthly subscription. No invite email is sent |
| `staff.list` | `reamaze.api.staff.list` | `read` | List staff users, oldest first |
| `systems.list` | `reamaze.api.systems.list` | `read` | List the status page systems and their current status |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/reamaze

## License

Apache-2.0
