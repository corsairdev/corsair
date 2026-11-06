# @corsair-dev/zohodesk

Zoho Desk plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/zohodesk
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `agents.get` | `zohodesk.api.agents.get` | `read` | Get an agent, optionally with its profile, role, departments and verified emails |
| `agents.getCount` | `zohodesk.api.agents.getCount` | `read` | Count agents, optionally by status, confirmation and light agent inclusion |
| `contacts.get` | `zohodesk.api.contacts.get` | `read` | Get a contact, optionally with its accounts and owner |
| `contacts.getByIds` | `zohodesk.api.contacts.getByIds` | `read` | Get up to 20 contacts by ID |
| `contacts.list` | `zohodesk.api.contacts.list` | `read` | List contacts with view and saved filter, paging, sorting and field selection |
| `contacts.listAccounts` | `zohodesk.api.contacts.listAccounts` | `read` | List the accounts of a contact |
| `departments.get` | `zohodesk.api.departments.get` | `read` | Get a department by ID |
| `departments.getCount` | `zohodesk.api.departments.getCount` | `read` | Count departments, optionally only enabled or disabled ones |
| `departments.getLogo` | `zohodesk.api.departments.getLogo` | `read` | Download the logo of a department as base64 |
| `departments.list` | `zohodesk.api.departments.list` | `read` | List departments |
| `departments.listTeams` | `zohodesk.api.departments.listTeams` | `read` | List the teams in a department |
| `departments.uploadLogo` | `zohodesk.api.departments.uploadLogo` | `write` | Replace the logo of a department with a jpg, png or gif of up to 2MB |
| `organizations.list` | `zohodesk.api.organizations.list` | `read` | List the organizations the user belongs to |
| `roles.list` | `zohodesk.api.roles.list` | `read` | List roles |
| `roles.listByIds` | `zohodesk.api.roles.listByIds` | `read` | Get up to 50 roles by ID |
| `tasks.updateMany` | `zohodesk.api.tasks.updateMany` | `write` | Set one field on up to 50 tasks |
| `tickets.get` | `zohodesk.api.tickets.get` | `read` | Get a ticket by ID |
| `tickets.getLatestThread` | `zohodesk.api.tickets.getLatestThread` | `read` | Get the most recent thread of a ticket, or null if it has none |
| `tickets.getResolution` | `zohodesk.api.tickets.getResolution` | `read` | Get the resolution of a ticket, or null if it has none |
| `tickets.getThread` | `zohodesk.api.tickets.getThread` | `read` | Get one thread of a ticket |
| `tickets.list` | `zohodesk.api.tickets.list` | `read` | List tickets, filtered by department, view, assignee, team, channel, status or priority |
| `tickets.listConversations` | `zohodesk.api.tickets.listConversations` | `read` | List the threads and comments of a ticket |

## Auth

Auth: OAuth 2.0. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/zohodesk

## License

Apache-2.0
