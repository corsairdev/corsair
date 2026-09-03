# @corsair-dev/zendesk

Zendesk plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/zendesk
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `comments.list` | `zendesk.api.comments.list` | `read` | List comments for a specific ticket |
| `tickets.create` | `zendesk.api.tickets.create` | `write` | Create a new ticket |
| `tickets.delete` | `zendesk.api.tickets.delete` | `destructive` | Delete a ticket by its ID |
| `tickets.get` | `zendesk.api.tickets.get` | `read` | Retrieve a ticket by its ID |
| `tickets.list` | `zendesk.api.tickets.list` | `read` | List tickets with pagination |
| `tickets.update` | `zendesk.api.tickets.update` | `write` | Update an existing ticket |
| `users.create` | `zendesk.api.users.create` | `write` | Create a new user |
| `users.delete` | `zendesk.api.users.delete` | `destructive` | Delete a user by their ID |
| `users.get` | `zendesk.api.users.get` | `read` | Retrieve a user by their ID |
| `users.list` | `zendesk.api.users.list` | `read` | List users with pagination |
| `users.update` | `zendesk.api.users.update` | `write` | Update an existing user |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

Handles 1 webhook event. See the reference for payloads and `webhookHooks`.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/zendesk

## License

Apache-2.0
