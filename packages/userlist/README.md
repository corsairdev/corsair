# @corsair-dev/userlist

Userlist plugin for Corsair - push users, companies, relationships and events, send transactional email and in-app messages, and receive the user, company, relationship, form and message webhooks.

## Install

```bash
pnpm add @corsair-dev/userlist
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `companies.delete` | `userlist.api.companies.delete` | `destructive` | Delete a company, leaving its users in place; only the relationships go |
| `companies.upsert` | `userlist.api.companies.upsert` | `write` | Create or update a company by identifier, with a name and custom properties |
| `events.create` | `userlist.api.events.create` | `write` | Record an event against a user, a company or both, with properties and an optional past timestamp |
| `messages.send` | `userlist.api.messages.send` | `write` | Queue a transactional email or in-app message, from a template or with an inline subject and body |
| `relationships.delete` | `userlist.api.relationships.delete` | `write` | Unlink one user from one company, leaving both objects in place |
| `relationships.upsert` | `userlist.api.relationships.upsert` | `write` | Tie a user to a company, with properties on the relationship such as a role |
| `users.delete` | `userlist.api.users.delete` | `destructive` | Delete a user along with their relationships and events; queued, and not reversible |
| `users.upsert` | `userlist.api.users.upsert` | `write` | Create or update a user by identifier or email, with properties, companies, relationships and topic preferences; queued, not applied at once |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

Handles 14 webhook events. See the reference for payloads and `webhookHooks`.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/userlist

## License

Apache-2.0
