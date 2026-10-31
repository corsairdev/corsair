# @corsair-dev/bugherd

Bugherd plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/bugherd
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `columns.create` | `bugherd.api.columns.create` | `write` | Create a new column |
| `columns.list` | `bugherd.api.columns.list` | `read` | List columns in a project |
| `columns.show` | `bugherd.api.columns.show` | `read` | Show column details |
| `columns.update` | `bugherd.api.columns.update` | `write` | Update a column |
| `organization.show` | `bugherd.api.organization.show` | `read` | Show organization details |
| `projects.addGuest` | `bugherd.api.projects.addGuest` | `write` | Add a guest to a project |
| `projects.addMember` | `bugherd.api.projects.addMember` | `write` | Add a member to a project |
| `projects.create` | `bugherd.api.projects.create` | `write` | Create a new project |
| `projects.delete` | `bugherd.api.projects.delete` | `destructive` | Delete a project |
| `projects.list` | `bugherd.api.projects.list` | `read` | List all projects |
| `projects.listActive` | `bugherd.api.projects.listActive` | `read` | List active projects |
| `projects.show` | `bugherd.api.projects.show` | `read` | Show project details |
| `projects.update` | `bugherd.api.projects.update` | `write` | Update a project |
| `tasks.create` | `bugherd.api.tasks.create` | `write` | Create a new task |
| `tasks.createAttachment` | `bugherd.api.tasks.createAttachment` | `write` | Create an attachment reference |
| `tasks.createComment` | `bugherd.api.tasks.createComment` | `write` | Create a comment on a task |
| `tasks.listAttachments` | `bugherd.api.tasks.listAttachments` | `read` | List attachments for a task |
| `tasks.listForUser` | `bugherd.api.tasks.listForUser` | `read` | List tasks assigned to a user |
| `tasks.showAttachment` | `bugherd.api.tasks.showAttachment` | `read` | Show attachment details |
| `tasks.update` | `bugherd.api.tasks.update` | `write` | Update a task |
| `tasks.uploadAttachment` | `bugherd.api.tasks.uploadAttachment` | `write` | Upload an attachment file |
| `users.list` | `bugherd.api.users.list` | `read` | List users |
| `users.listProjects` | `bugherd.api.users.listProjects` | `read` | List projects for a user |
| `webhooks.create` | `bugherd.api.webhooks.create` | `write` | Create a new webhook |
| `webhooks.list` | `bugherd.api.webhooks.list` | `read` | List webhooks for a project |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/bugherd

## License

Apache-2.0
