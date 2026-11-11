# @corsair-dev/missive

Missive plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/missive
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `analytics.createReport` | `missive.api.analytics.createReport` | `write` | Queue an analytics report for a period and optional team, user, label, and account filters, and get the report id to poll |
| `analytics.getReport` | `missive.api.analytics.getReport` | `read` | Fetch a queued analytics report by id; an empty 404 means it is still generating or already expired |
| `contactBooks.list` | `missive.api.contactBooks.list` | `read` | List contact books the authenticated user has access to; a book id is required to create contacts |
| `contactGroups.list` | `missive.api.contactGroups.list` | `read` | List the groups or organizations linked to a contact book |
| `contacts.create` | `missive.api.contacts.create` | `write` | Create one or more contacts in a contact book |
| `contacts.get` | `missive.api.contacts.get` | `read` | Fetch a contact by id; deleted contacts answer 404 |
| `contacts.list` | `missive.api.contacts.list` | `read` | List or search the contacts of a contact book, ordered by last name unless order is last_modified |
| `contacts.update` | `missive.api.contacts.update` | `write` | Update one or more contacts; infos and memberships replace the current ones when passed |
| `conversations.get` | `missive.api.conversations.get` | `read` | Fetch a conversation by id; a merged old id answers with the current conversation |
| `conversations.list` | `missive.api.conversations.list` | `read` | List conversations of one mailbox, shared label, or team, newest activity first |
| `conversations.listComments` | `missive.api.conversations.listComments` | `read` | List the internal comments of a conversation, newest first |
| `conversations.listDrafts` | `missive.api.conversations.listDrafts` | `read` | List the draft messages of a conversation, newest first |
| `conversations.listMessages` | `missive.api.conversations.listMessages` | `read` | List the messages of a conversation, newest first; drafts are excluded |
| `conversations.listPosts` | `missive.api.conversations.listPosts` | `read` | List the posts of a conversation, newest first |
| `conversations.merge` | `missive.api.conversations.merge` | `destructive` | Merge a conversation into a target conversation; the source is marked as replaced |
| `conversations.update` | `missive.api.conversations.update` | `write` | Silently close, reopen, move, assign, label, recolor, or rename one or more conversations without adding a post |
| `drafts.create` | `missive.api.drafts.create` | `write` | Create an email, SMS, WhatsApp, or live chat draft in a new or existing conversation; send true delivers it to the real recipients at once and send_at schedules it, and a delivered message cannot be recalled |
| `drafts.delete` | `missive.api.drafts.delete` | `destructive` | Delete a draft from its conversation |
| `hooks.create` | `missive.api.hooks.create` | `write` | Create a webhook subscription for incoming-message or new-comment events, backed by a Missive rule |
| `hooks.delete` | `missive.api.hooks.delete` | `destructive` | Delete a webhook subscription and its backing rule |
| `messages.create` | `missive.api.messages.create` | `write` | Create an incoming message in a custom channel to ingest an external conversation event |
| `messages.get` | `missive.api.messages.get` | `read` | Fetch one or more messages with headers, body, and attachments by message id |
| `messages.list` | `missive.api.messages.list` | `read` | Fetch the messages matching an email Message-ID header, latest first |
| `organizations.list` | `missive.api.organizations.list` | `read` | List organizations the authenticated user is part of |
| `posts.create` | `missive.api.posts.create` | `write` | Create a post in a new or existing conversation to inject content and close, reopen, assign, or label the conversation with a visible trace; every teammate with access sees the post and gets its notification |
| `posts.delete` | `missive.api.posts.delete` | `destructive` | Delete a post from its conversation |
| `responses.create` | `missive.api.responses.create` | `write` | Create one or more saved response templates |
| `responses.delete` | `missive.api.responses.delete` | `destructive` | Delete one or more saved response templates |
| `responses.get` | `missive.api.responses.get` | `read` | Fetch a saved response by id |
| `responses.list` | `missive.api.responses.list` | `read` | List saved responses (canned replies) for the authenticated user |
| `responses.update` | `missive.api.responses.update` | `write` | Update one or more saved responses; attachments replace the current ones when passed |
| `sharedLabels.create` | `missive.api.sharedLabels.create` | `write` | Create one or more shared labels in an organization |
| `sharedLabels.list` | `missive.api.sharedLabels.list` | `read` | List shared labels in organizations the authenticated user has access to |
| `sharedLabels.update` | `missive.api.sharedLabels.update` | `write` | Update one or more shared labels; visibility and sharing are admin-only fields |
| `tasks.create` | `missive.api.tasks.create` | `write` | Create a standalone task, tasked conversation, or conversation subtask |
| `tasks.get` | `missive.api.tasks.get` | `read` | Fetch a task with full assignee and team details by id |
| `tasks.list` | `missive.api.tasks.list` | `read` | List tasks the token owner has access to, filtered by organization, team, assignee, state, type, or due window |
| `tasks.update` | `missive.api.tasks.update` | `write` | Update a task title, description, state, assignees, team, or due date |
| `teams.create` | `missive.api.teams.create` | `write` | Create a team in an organization; the token owner must be an admin or owner |
| `teams.list` | `missive.api.teams.list` | `read` | List teams in organizations the authenticated user has access to |
| `teams.update` | `missive.api.teams.update` | `write` | Update one or more teams; the token owner must be an admin or owner |
| `users.list` | `missive.api.users.list` | `read` | List users in organizations the authenticated user is part of; user status is not exposed by the API |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/missive

## License

Apache-2.0
