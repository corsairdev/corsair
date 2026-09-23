# @corsair-dev/filevine

Filevine plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/filevine
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `contacts.attach` | `filevine.api.contacts.attach` | `write` | Attach a contact to a project |
| `contacts.create` | `filevine.api.contacts.create` | `write` | Create a contact |
| `contacts.get` | `filevine.api.contacts.get` | `read` | Get a contact by ID |
| `contacts.list` | `filevine.api.contacts.list` | `read` | List contacts with pagination |
| `deadlines.create` | `filevine.api.deadlines.create` | `write` | Create a deadline on a project |
| `deadlines.list` | `filevine.api.deadlines.list` | `read` | List deadlines for a project |
| `documents.get` | `filevine.api.documents.get` | `read` | Get document metadata by ID |
| `documents.list` | `filevine.api.documents.list` | `read` | List documents in a project |
| `documents.upload` | `filevine.api.documents.upload` | `write` | Upload a document to a project |
| `identity.getAccessToken` | `filevine.api.identity.getAccessToken` | `write` | Exchange PAT for bearer token |
| `identity.getUserOrgsWithToken` | `filevine.api.identity.getUserOrgsWithToken` | `read` | Get user and orgs for token (POST /fv-app/v2/utils/GetUserOrgsWithToken) |
| `notes.create` | `filevine.api.notes.create` | `write` | Create a note on a project |
| `notes.list` | `filevine.api.notes.list` | `read` | List notes for a project |
| `notes.update` | `filevine.api.notes.update` | `write` | Update a note |
| `projects.create` | `filevine.api.projects.create` | `write` | Create a new project |
| `projects.get` | `filevine.api.projects.get` | `read` | Get a project by ID |
| `projects.list` | `filevine.api.projects.list` | `read` | List projects with pagination and filters |
| `projects.update` | `filevine.api.projects.update` | `write` | Update a project |
| `tasks.create` | `filevine.api.tasks.create` | `write` | Create a task on a project |
| `tasks.list` | `filevine.api.tasks.list` | `read` | List tasks for a project |
| `tasks.update` | `filevine.api.tasks.update` | `write` | Update a task |
| `webhooks.create` | `filevine.api.webhooks.create` | `write` | Create a webhook subscription |
| `webhooks.delete` | `filevine.api.webhooks.delete` | `destructive` | Delete a webhook subscription [DESTRUCTIVE] |
| `webhooks.list` | `filevine.api.webhooks.list` | `read` | List webhook subscriptions |

## Auth

Auth: API key, OAuth 2.0 (default API key). Set `authType` on the plugin factory to pick one.

## Webhooks

No inbound webhook handling — this plugin manages Filevine webhook subscriptions via `webhooks.list`, `webhooks.create`, and `webhooks.delete`.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/filevine

## License

Apache-2.0
