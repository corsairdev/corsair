# @corsair-dev/mailerlite

MailerLite email marketing plugin for Corsair. Manage subscribers, groups and custom fields, create draft campaigns, schedule or cancel sends, and read subscriber activity.

## Install

```bash
pnpm add @corsair-dev/mailerlite
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `campaigns.activity` | `mailerlite.api.campaigns.activity` | `read` | List the recipients of a sent campaign with their open and click activity |
| `campaigns.cancel` | `mailerlite.api.campaigns.cancel` | `write` | Cancel a scheduled campaign that has not started sending, returning it to draft so it can be edited and rescheduled |
| `campaigns.create` | `mailerlite.api.campaigns.create` | `write` | Create a draft campaign with recipients and email content. Nothing is sent until campaigns.schedule runs |
| `campaigns.list` | `mailerlite.api.campaigns.list` | `read` | List campaigns with their status and delivery stats, page paginated |
| `campaigns.schedule` | `mailerlite.api.campaigns.schedule` | `write` | Schedule a ready draft, or send it now with delivery instant. This emails real recipients and an instant send cannot be unsent |
| `fields.list` | `mailerlite.api.fields.list` | `read` | List custom fields with their keys and types, page paginated |
| `groups.create` | `mailerlite.api.groups.create` | `write` | Create an empty group for subscribers, named up to 255 characters |
| `groups.delete` | `mailerlite.api.groups.delete` | `destructive` | Delete a group. Membership history is not restorable and the subscribers are kept |
| `groups.list` | `mailerlite.api.groups.list` | `read` | List groups with their counts and open and click rates, page paginated |
| `subscribers.addToGroup` | `mailerlite.api.subscribers.addToGroup` | `write` | Add an existing subscriber to an existing group |
| `subscribers.delete` | `mailerlite.api.subscribers.delete` | `destructive` | Permanently delete a subscriber and their history. There is no undo |
| `subscribers.get` | `mailerlite.api.subscribers.get` | `read` | Fetch one subscriber by id or by email address, with its custom field values |
| `subscribers.list` | `mailerlite.api.subscribers.list` | `read` | List subscribers, cursor paginated, optionally filtered by status or group |
| `subscribers.removeFromGroup` | `mailerlite.api.subscribers.removeFromGroup` | `write` | Remove a subscriber from a group. The subscriber keeps their status; only the membership goes |
| `subscribers.update` | `mailerlite.api.subscribers.update` | `write` | Update one subscriber. groups is the complete set: subscribers are removed from groups not listed, so an empty array removes them from every group |
| `subscribers.upsert` | `mailerlite.api.subscribers.upsert` | `write` | Create a subscriber or update an existing one matched by email. Repeating the call is safe: it never deletes fields or group membership |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/mailerlite

## License

Apache-2.0
