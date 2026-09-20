# @corsair-dev/close

Close plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/close
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `activities.createNote` | `close.api.activities.createNote` | `write` | Create a note activity |
| `activities.listCalls` | `close.api.activities.listCalls` | `read` | List call activities |
| `activities.listEmails` | `close.api.activities.listEmails` | `read` | List email activities |
| `activities.listNotes` | `close.api.activities.listNotes` | `read` | List note activities |
| `contacts.create` | `close.api.contacts.create` | `write` | Create a contact |
| `contacts.delete` | `close.api.contacts.delete` | `destructive` | Delete a contact |
| `contacts.get` | `close.api.contacts.get` | `read` | Retrieve a contact by ID |
| `contacts.list` | `close.api.contacts.list` | `read` | List contacts |
| `contacts.update` | `close.api.contacts.update` | `write` | Update a contact |
| `customFields.listContact` | `close.api.customFields.listContact` | `read` | List contact custom fields |
| `customFields.listLead` | `close.api.customFields.listLead` | `read` | List lead custom fields |
| `leads.create` | `close.api.leads.create` | `write` | Create a new lead |
| `leads.delete` | `close.api.leads.delete` | `destructive` | Delete a lead by ID |
| `leads.get` | `close.api.leads.get` | `read` | Retrieve a lead by ID |
| `leads.list` | `close.api.leads.list` | `read` | List leads with optional filters |
| `leads.update` | `close.api.leads.update` | `write` | Update an existing lead |
| `opportunities.create` | `close.api.opportunities.create` | `write` | Create an opportunity |
| `opportunities.delete` | `close.api.opportunities.delete` | `destructive` | Delete an opportunity |
| `opportunities.get` | `close.api.opportunities.get` | `read` | Retrieve an opportunity by ID |
| `opportunities.list` | `close.api.opportunities.list` | `read` | List opportunities |
| `opportunities.update` | `close.api.opportunities.update` | `write` | Update an opportunity |
| `tasks.create` | `close.api.tasks.create` | `write` | Create a task |
| `tasks.delete` | `close.api.tasks.delete` | `destructive` | Delete a task |
| `tasks.get` | `close.api.tasks.get` | `read` | Retrieve a task by ID |
| `tasks.list` | `close.api.tasks.list` | `read` | List tasks |
| `tasks.update` | `close.api.tasks.update` | `write` | Update a task |
| `users.getMe` | `close.api.users.getMe` | `read` | Get current authenticated user info |
| `users.list` | `close.api.users.list` | `read` | List users in the organization |

## Auth

Auth: API key, OAuth 2.0 (default API key). Set `authType` on the plugin factory to pick one.

## Webhooks

Handles 6 webhook events. See the reference for payloads and `webhookHooks`.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/close

## License

Apache-2.0
