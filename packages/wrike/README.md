# @corsair-dev/wrike

Wrike plugin for Corsair - search and manage tasks, work with folders and projects, log and read time entries, comment on tasks, and read contacts and account settings.

## Install

```bash
pnpm add @corsair-dev/wrike
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `account.get` | `wrike.api.account.get` | `read` | Read the account, including the virtual root folder id that a task or folder create needs as its parent |
| `comments.create` | `wrike.api.comments.create` | `write` | Post a comment on a task |
| `comments.delete` | `wrike.api.comments.delete` | `destructive` | Delete a comment |
| `comments.list` | `wrike.api.comments.list` | `read` | List comments across the account, up to a limit |
| `comments.task` | `wrike.api.comments.task` | `read` | List the comments on a task |
| `comments.update` | `wrike.api.comments.update` | `write` | Edit the text of a comment you wrote; Wrike allows it only in the 5 minutes after posting |
| `contacts.get` | `wrike.api.contacts.get` | `read` | Read one contact by id, or `me` for the one behind the token |
| `contacts.list` | `wrike.api.contacts.list` | `read` | List the contacts on the account, optionally only active ones or only yourself |
| `folders.create` | `wrike.api.folders.create` | `write` | Create a folder inside another, or in the account root when given its virtual root id |
| `folders.delete` | `wrike.api.folders.delete` | `destructive` | Move a folder and every folder and task inside it to the recycle bin; Wrike does not refuse a folder with contents |
| `folders.get` | `wrike.api.folders.get` | `read` | Read one folder or project |
| `folders.list` | `wrike.api.folders.list` | `read` | List folders and projects, each with its parent and scope |
| `folders.tasks` | `wrike.api.folders.tasks` | `read` | List the tasks in a folder, optionally including every descendant folder |
| `folders.update` | `wrike.api.folders.update` | `write` | Rename a folder, change its description or move it between parents |
| `tasks.create` | `wrike.api.tasks.create` | `write` | Create a task in a folder, with assignees, dates, custom fields and metadata; Wrike has no account-level create |
| `tasks.delete` | `wrike.api.tasks.delete` | `destructive` | Move a task to the recycle bin, which a later update with restore can undo |
| `tasks.get` | `wrike.api.tasks.get` | `read` | Read one task with its status, dates, assignees and custom fields |
| `tasks.list` | `wrike.api.tasks.list` | `read` | Search tasks account-wide by title, status, dates, author or assignee, with paging and sorting |
| `tasks.update` | `wrike.api.tasks.update` | `write` | Change a task title, status, dates, assignees or followers, or restore it from the recycle bin |
| `timelogs.create` | `wrike.api.timelogs.create` | `write` | Log hours against a task for a tracked date, with a comment (Wrike requires one, which may be empty) and an optional category |
| `timelogs.delete` | `wrike.api.timelogs.delete` | `destructive` | Delete a logged time entry |
| `timelogs.list` | `wrike.api.timelogs.list` | `read` | List the time logged on the account, filtered by tracked or created date, or only your own |
| `timelogs.task` | `wrike.api.timelogs.task` | `read` | List the time logged against one task |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/wrike

## License

Apache-2.0
