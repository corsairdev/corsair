# @corsair-dev/textit

TextIt plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/textit
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `archives.list` | `textit.api.archives.list` | `read` | List archived message or flow-run data. |
| `broadcasts.list` | `textit.api.broadcasts.list` | `read` | List outgoing broadcasts. |
| `broadcasts.send` | `textit.api.broadcasts.send` | `write` | Send a translated broadcast to contacts, groups or URNs. |
| `campaignEvents.create` | `textit.api.campaignEvents.create` | `write` | Create a scheduled campaign event. |
| `campaignEvents.delete` | `textit.api.campaignEvents.delete` | `destructive` | Delete a campaign event. |
| `campaignEvents.list` | `textit.api.campaignEvents.list` | `read` | List campaign events. |
| `campaignEvents.update` | `textit.api.campaignEvents.update` | `write` | Update a scheduled campaign event. |
| `campaigns.create` | `textit.api.campaigns.create` | `write` | Create a campaign for a contact group. |
| `campaigns.list` | `textit.api.campaigns.list` | `read` | List campaigns. |
| `campaigns.update` | `textit.api.campaigns.update` | `write` | Update a campaign by UUID. |
| `channels.list` | `textit.api.channels.list` | `read` | List messaging channels. |
| `contactActions.apply` | `textit.api.contactActions.apply` | `destructive` | Apply a bulk contact action, including permanent deletion. |
| `contacts.create` | `textit.api.contacts.create` | `write` | Create a contact. |
| `contacts.delete` | `textit.api.contacts.delete` | `destructive` | Permanently delete a contact by UUID or URN. |
| `contacts.list` | `textit.api.contacts.list` | `read` | List contacts and their custom fields. |
| `contacts.update` | `textit.api.contacts.update` | `write` | Update a contact by UUID or URN; an unknown URN creates one. |
| `fields.create` | `textit.api.fields.create` | `write` | Create a custom contact field. |
| `fields.list` | `textit.api.fields.list` | `read` | List custom contact fields. |
| `fields.update` | `textit.api.fields.update` | `write` | Update a custom contact field by key. |
| `flows.list` | `textit.api.flows.list` | `read` | List flows. |
| `flowStarts.create` | `textit.api.flowStarts.create` | `write` | Start contacts, groups or URNs in a flow. |
| `flowStarts.list` | `textit.api.flowStarts.list` | `read` | List manual flow starts. |
| `globals.create` | `textit.api.globals.create` | `write` | Create a workspace global. |
| `globals.list` | `textit.api.globals.list` | `read` | List workspace globals. |
| `globals.update` | `textit.api.globals.update` | `write` | Update a workspace global by key. |
| `groups.create` | `textit.api.groups.create` | `write` | Create a contact group. |
| `groups.delete` | `textit.api.groups.delete` | `destructive` | Delete a contact group. |
| `groups.list` | `textit.api.groups.list` | `read` | List contact groups. |
| `groups.update` | `textit.api.groups.update` | `write` | Update a contact group. |
| `labels.create` | `textit.api.labels.create` | `write` | Create a message label. |
| `labels.delete` | `textit.api.labels.delete` | `destructive` | Delete a message label. |
| `labels.list` | `textit.api.labels.list` | `read` | List message labels. |
| `labels.update` | `textit.api.labels.update` | `write` | Update a message label. |
| `media.upload` | `textit.api.media.upload` | `write` | Upload a media file for message attachments. |
| `messageActions.apply` | `textit.api.messageActions.apply` | `destructive` | Apply a bulk message action, including permanent deletion; inspect failures. |
| `messages.list` | `textit.api.messages.list` | `read` | List messages with optional folder and label filters. |
| `messages.send` | `textit.api.messages.send` | `write` | Send a message to a contact. |
| `resthookEvents.list` | `textit.api.resthookEvents.list` | `read` | List outbound resthook events. |
| `resthooks.list` | `textit.api.resthooks.list` | `read` | List outbound resthooks. |
| `resthookSubscribers.create` | `textit.api.resthookSubscribers.create` | `write` | Subscribe a target URL to a resthook. |
| `resthookSubscribers.delete` | `textit.api.resthookSubscribers.delete` | `destructive` | Remove an outbound resthook subscription. |
| `resthookSubscribers.list` | `textit.api.resthookSubscribers.list` | `read` | List outbound resthook subscribers. |
| `runs.list` | `textit.api.runs.list` | `read` | List flow runs. |
| `ticketActions.apply` | `textit.api.ticketActions.apply` | `write` | Apply a bulk ticket action. |
| `tickets.list` | `textit.api.tickets.list` | `read` | List support tickets. |
| `topics.create` | `textit.api.topics.create` | `write` | Create a ticket topic. |
| `topics.list` | `textit.api.topics.list` | `read` | List ticket topics. |
| `users.list` | `textit.api.users.list` | `read` | List workspace users. |
| `workspace.get` | `textit.api.workspace.get` | `read` | Read current workspace details. |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/textit

## License

Apache-2.0
