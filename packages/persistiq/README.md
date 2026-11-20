# @corsair-dev/persistiq

PersistIQ is an outbound sales automation platform. This plugin manages leads and their custom attributes, campaigns and their lead membership, replies to inbox messages, do-not-contact domains, activity events, tags and lead fields, and the webhook plugin settings.

## Install

```bash
pnpm add @corsair-dev/persistiq
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `campaigns.addLead` | `persistiq.api.campaigns.addLead` | `write` | Add a lead to a campaign |
| `campaigns.create` | `persistiq.api.campaigns.create` | `write` | Create a campaign |
| `campaigns.duplicate` | `persistiq.api.campaigns.duplicate` | `write` | Duplicate a campaign |
| `campaigns.list` | `persistiq.api.campaigns.list` | `read` | List the campaigns |
| `campaigns.listLeads` | `persistiq.api.campaigns.listLeads` | `read` | List the leads in a campaign |
| `campaigns.listReplies` | `persistiq.api.campaigns.listReplies` | `read` | List the replies in a campaign |
| `campaigns.removeLead` | `persistiq.api.campaigns.removeLead` | `write` | Remove a lead from a campaign |
| `campaigns.replyToMessage` | `persistiq.api.campaigns.replyToMessage` | `destructive` | Reply to an inbox message; the email goes out and cannot be recalled |
| `events.list` | `persistiq.api.events.list` | `read` | List activity events, paged by cursor |
| `leads.create` | `persistiq.api.leads.create` | `write` | Create a lead with its attributes |
| `leads.get` | `persistiq.api.leads.get` | `read` | Read one lead by id |
| `leads.list` | `persistiq.api.leads.list` | `read` | List leads, paged by cursor |
| `leads.update` | `persistiq.api.leads.update` | `write` | Update a lead attributes map |
| `users.list` | `persistiq.api.users.list` | `read` | List the team members |
| `webhooks.getSettings` | `persistiq.api.webhooks.getSettings` | `read` | Read the webhook plugin settings |
| `webhooks.updateSettings` | `persistiq.api.webhooks.updateSettings` | `write` | Update the webhook plugin delivery URL and active state |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/persistiq

## License

Apache-2.0
