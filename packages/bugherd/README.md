# @corsair-dev/bugherd

BugHerd plugin for Corsair: website feedback and bug tracking (projects, tasks, comments, attachments, columns, webhooks) through the BugHerd API v2.

## Install

```bash
pnpm add @corsair-dev/bugherd
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `columns.create` | `bugherd.api.columns.create` | `write` | Add a custom column at the end of a project board. |
| `columns.delete` | `bugherd.api.columns.delete` | `destructive` | Delete an empty column. Cannot be undone. |
| `columns.list` | `bugherd.api.columns.list` | `read` | List the columns on a project board, built-in and custom. |
| `columns.show` | `bugherd.api.columns.show` | `read` | Get one column. |
| `columns.update` | `bugherd.api.columns.update` | `write` | Rename a custom column. |
| `organization.show` | `bugherd.api.organization.show` | `read` | Get the organization name and id. |
| `projects.addGuest` | `bugherd.api.projects.addGuest` | `destructive` | Add a guest (client) to a project by user id, or invite one by email. An email invite sends the person a message. |
| `projects.addMember` | `bugherd.api.projects.addMember` | `write` | Add one or more organization members to a project. |
| `projects.create` | `bugherd.api.projects.create` | `write` | Create a project for a website. Members and guests are added separately. |
| `projects.delete` | `bugherd.api.projects.delete` | `destructive` | Delete a project and all its tasks. Cannot be undone. |
| `projects.list` | `bugherd.api.projects.list` | `read` | List every project in the organization, active and inactive. 100 per page. |
| `projects.listActive` | `bugherd.api.projects.listActive` | `read` | List active projects only. 100 per page. |
| `projects.show` | `bugherd.api.projects.show` | `read` | Get one project with its members, guests and columns. |
| `projects.update` | `bugherd.api.projects.update` | `write` | Change a project's name, URL or settings. Only the fields given change. |
| `tasks.create` | `bugherd.api.tasks.create` | `write` | Create a task in a project. Without a status it lands in the Feedback panel. |
| `tasks.createAttachment` | `bugherd.api.tasks.createAttachment` | `write` | Attach a file to a task from a public URL. BugHerd keeps a copy. |
| `tasks.createComment` | `bugherd.api.tasks.createComment` | `write` | Comment on a task, optionally visible to team members only. |
| `tasks.delete` | `bugherd.api.tasks.delete` | `destructive` | Delete a task. Cannot be undone. |
| `tasks.deleteAttachment` | `bugherd.api.tasks.deleteAttachment` | `destructive` | Remove an attachment from a task. Cannot be undone. |
| `tasks.list` | `bugherd.api.tasks.list` | `read` | List tasks in a project, filtered by status, priority, tag, assignee, external id or date. 100 per page. |
| `tasks.listArchived` | `bugherd.api.tasks.listArchived` | `read` | List closed and archived tasks in a project. |
| `tasks.listAttachments` | `bugherd.api.tasks.listAttachments` | `read` | List the files attached to a task. |
| `tasks.listComments` | `bugherd.api.tasks.listComments` | `read` | List the comments on a task. |
| `tasks.listFeedback` | `bugherd.api.tasks.listFeedback` | `read` | List tasks in the Feedback panel (new, not yet triaged). |
| `tasks.listForUser` | `bugherd.api.tasks.listForUser` | `read` | List tasks assigned to a user across all projects. |
| `tasks.listTaskboard` | `bugherd.api.tasks.listTaskboard` | `read` | List the active tasks on the project taskboard. |
| `tasks.move` | `bugherd.api.tasks.move` | `write` | Move tasks to another project, by their #numbers. |
| `tasks.show` | `bugherd.api.tasks.show` | `read` | Get one task by its global id, with or without the project id. |
| `tasks.showAttachment` | `bugherd.api.tasks.showAttachment` | `read` | Get one attachment on a task. |
| `tasks.showByLocalId` | `bugherd.api.tasks.showByLocalId` | `read` | Get a task by the #number shown in the BugHerd UI. |
| `tasks.update` | `bugherd.api.tasks.update` | `write` | Change a task: status (column), priority, assignees, tags, description. |
| `tasks.uploadAttachment` | `bugherd.api.tasks.uploadAttachment` | `write` | Upload a file to a task (a URL, or base64 for a small file). |
| `users.list` | `bugherd.api.users.list` | `read` | List everyone in the organization, members and guests. |
| `users.listGuests` | `bugherd.api.users.listGuests` | `read` | List guests (clients) across all projects. |
| `users.listMembers` | `bugherd.api.users.listMembers` | `read` | List team members (not guests). |
| `users.listProjects` | `bugherd.api.users.listProjects` | `read` | List the projects a user belongs to. |
| `webhooks.create` | `bugherd.api.webhooks.create` | `write` | Subscribe a URL to one BugHerd event, for one project or all of them. |
| `webhooks.delete` | `bugherd.api.webhooks.delete` | `destructive` | Remove a webhook subscription. Cannot be undone. |
| `webhooks.list` | `bugherd.api.webhooks.list` | `read` | List the organization webhooks with their delivery counts. |

## Auth

Auth: API key (BugHerd Settings > organization > Authentication Token), sent as HTTP Basic. Corsair prompts your tenant for credentials on first use.

## Webhooks

No inbound webhook handling. The `webhooks.*` operations manage the subscriptions BugHerd posts events to.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/bugherd

## License

Apache-2.0
