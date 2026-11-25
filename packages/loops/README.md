# @corsair-dev/loops

Loops plugin for Corsair: manage contacts, send events and transactional email, and read mailing lists and suppression status.

## Install

```bash
pnpm add @corsair-dev/loops
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `apikey.verifyConnection` | `loops.api.apikey.verifyConnection` | `read` | Verify the API key and return the team name it belongs to |
| `contacts.create` | `loops.api.contacts.create` | `write` | Create a contact with fixed and custom properties; answers 409 when the email or userId already exists |
| `contacts.delete` | `loops.api.contacts.delete` | `destructive` | Permanently delete a contact by email or userId; the contact and its subscriptions cannot be restored |
| `contacts.find` | `loops.api.contacts.find` | `read` | Find contacts by email or user ID; answers an empty array when none match |
| `contacts.getSuppression` | `loops.api.contacts.getSuppression` | `read` | Read whether a contact is suppressed from emails and the quota left for removing suppressions |
| `contacts.listProperties` | `loops.api.contacts.listProperties` | `read` | List the contact property definitions, all of them or only the custom ones |
| `contacts.update` | `loops.api.contacts.update` | `write` | Update a contact found by email or userId, creating it when no match exists (upsert) |
| `events.send` | `loops.api.events.send` | `write` | Send an event for a contact; this can trigger workflows that email real people |
| `lists.list` | `loops.api.lists.list` | `read` | List every mailing list in the team |
| `transactional.send` | `loops.api.transactional.send` | `write` | Send a published transactional email to a real inbox; pass an idempotencyKey (max 100 chars) to make a retry within 24 hours return 409 instead of a duplicate |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/loops

## License

Apache-2.0
