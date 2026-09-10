# @corsair-dev/connecteam

Connecteam plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/connecteam
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `attachments.generateUploadUrl` | `connecteam.api.attachments.generateUploadUrl` | `write` | Generate a time-limited pre-signed file upload URL |
| `chat.get` | `connecteam.api.chat.get` | `read` | List team chats and channels |
| `customFieldCategories.get` | `connecteam.api.customFieldCategories.get` | `read` | List custom field categories |
| `customFields.get` | `connecteam.api.customFields.get` | `read` | List custom fields with optional filters and pagination |
| `forms.get` | `connecteam.api.forms.get` | `read` | List form definitions |
| `jobs.get` | `connecteam.api.jobs.get` | `read` | List jobs for a scheduler or time clock instance |
| `me.list` | `connecteam.api.me.list` | `read` | Get Connecteam account company name and company ID |
| `performanceIndicators.get` | `connecteam.api.performanceIndicators.get` | `read` | List performance metric indicators |
| `policyTypes.get` | `connecteam.api.policyTypes.get` | `read` | List time-off policy types |
| `publishers.get` | `connecteam.api.publishers.get` | `read` | List custom publishers |
| `schedulers.get` | `connecteam.api.schedulers.get` | `read` | List job schedulers |
| `smartGroups.get` | `connecteam.api.smartGroups.get` | `read` | List smart groups |
| `taskBoards.get` | `connecteam.api.taskBoards.get` | `read` | List task boards |
| `users.archive` | `connecteam.api.users.archive` | `write` | Archive Connecteam users by ID without deleting records |
| `users.create` | `connecteam.api.users.create` | `write` | Create users in Connecteam |
| `users.get` | `connecteam.api.users.get` | `read` | List Connecteam users with optional filters and pagination |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/connecteam

## License

Apache-2.0
