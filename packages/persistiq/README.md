# @corsair-dev/persistiq

PersistIQ is an outbound sales automation platform. This plugin manages leads and their custom attributes, campaigns and their lead membership, replies to inbox messages, do-not-contact domains, activity events, tags and lead fields, and the webhook plugin settings.

## Install

```bash
pnpm add @corsair-dev/persistiq
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `campaigns.addLead` | `persistiq.api.campaigns.addLead` | `destructive` | Add leads to a campaign; the campaign's automated emails start going to them |
| `campaigns.create` | `persistiq.api.campaigns.create` | `write` | Create a campaign |
| `campaigns.duplicate` | `persistiq.api.campaigns.duplicate` | `write` | Copy a campaign to a new owner |
| `campaigns.list` | `persistiq.api.campaigns.list` | `read` | List the campaigns |
| `campaigns.listLeads` | `persistiq.api.campaigns.listLeads` | `read` | List the leads in a campaign |
| `campaigns.listReplies` | `persistiq.api.campaigns.listReplies` | `read` | List the replies in a campaign |
| `campaigns.removeLead` | `persistiq.api.campaigns.removeLead` | `write` | Remove a lead from a campaign |
| `campaigns.replyToMessage` | `persistiq.api.campaigns.replyToMessage` | `destructive` | Reply to a message received in a campaign; the email goes out and cannot be recalled |
| `dncDomains.create` | `persistiq.api.dncDomains.create` | `write` | Add a domain to the do-not-contact list; emails to it stop |
| `dncDomains.list` | `persistiq.api.dncDomains.list` | `read` | List the do-not-contact domains |
| `events.list` | `persistiq.api.events.list` | `read` | List activity events, with filters, page by page |
| `leads.create` | `persistiq.api.leads.create` | `write` | Create a lead with its attributes |
| `leads.get` | `persistiq.api.leads.get` | `read` | Read one lead by id |
| `leads.list` | `persistiq.api.leads.list` | `read` | List leads, with filters, page by page |
| `leadFields.list` | `persistiq.api.leadFields.list` | `read` | List the lead field definitions |
| `leadStatuses.list` | `persistiq.api.leadStatuses.list` | `read` | List the lead status vocabulary |
| `leads.update` | `persistiq.api.leads.update` | `write` | Update a lead's status, owner, flags or attributes |
| `tags.list` | `persistiq.api.tags.list` | `read` | List the tags |
| `users.list` | `persistiq.api.users.list` | `read` | List the team members |
| `webhooks.getSettings` | `persistiq.api.webhooks.getSettings` | `read` | Read the webhook plugin settings |
| `webhooks.updateSettings` | `persistiq.api.webhooks.updateSettings` | `write` | Turn webhook deliveries on or off and set the URL each one posts to |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/persistiq

## License

Apache-2.0
