# @corsair-dev/chatwork

Chatwork plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/chatwork
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `account.get` | `chatwork.api.account.get` | `read` | Get profile information of the authenticated user |
| `account.getStatus` | `chatwork.api.account.getStatus` | `read` | Get unread, mention and open task counts for the authenticated user |
| `account.listTasks` | `chatwork.api.account.listTasks` | `read` | List tasks assigned to the authenticated user (up to 100) |
| `contacts.list` | `chatwork.api.contacts.list` | `read` | List contacts of the authenticated user |
| `contacts.listIncomingRequests` | `chatwork.api.contacts.listIncomingRequests` | `read` | List pending contact requests sent to the authenticated user (up to 100) |
| `files.get` | `chatwork.api.files.get` | `read` | Get file details, optionally with a temporary download URL |
| `files.list` | `chatwork.api.files.list` | `read` | List files uploaded to a chat room (up to 100) |
| `files.upload` | `chatwork.api.files.upload` | `write` | Upload a file to a chat room |
| `links.create` | `chatwork.api.links.create` | `write` | Create an invitation link for a group chat |
| `links.delete` | `chatwork.api.links.delete` | `destructive` | Delete the invitation link of a group chat |
| `links.get` | `chatwork.api.links.get` | `read` | Get the invitation link of a group chat |
| `links.update` | `chatwork.api.links.update` | `write` | Update the invitation link of a group chat |
| `members.list` | `chatwork.api.members.list` | `read` | List members belonging to a chat room |
| `members.update` | `chatwork.api.members.update` | `write` | Replace the member list and roles of a group chat |
| `messages.delete` | `chatwork.api.messages.delete` | `destructive` | Delete a message from a chat room |
| `messages.get` | `chatwork.api.messages.get` | `read` | Get a specific message from a chat room |
| `messages.list` | `chatwork.api.messages.list` | `read` | List messages in a chat room (up to 100) |
| `messages.markRead` | `chatwork.api.messages.markRead` | `write` | Mark messages in a chat room as read |
| `messages.markUnread` | `chatwork.api.messages.markUnread` | `write` | Mark messages in a chat room as unread from a given message |
| `messages.send` | `chatwork.api.messages.send` | `write` | Send a new message to a chat room |
| `messages.update` | `chatwork.api.messages.update` | `write` | Edit the body of a message |
| `rooms.create` | `chatwork.api.rooms.create` | `write` | Create a new group chat |
| `rooms.delete` | `chatwork.api.rooms.delete` | `destructive` | Leave or permanently delete a group chat |
| `rooms.get` | `chatwork.api.rooms.get` | `read` | Get details of a specific chat room |
| `rooms.list` | `chatwork.api.rooms.list` | `read` | List chat rooms the authenticated user belongs to |
| `rooms.update` | `chatwork.api.rooms.update` | `write` | Update the name, description or icon of a group chat |
| `tasks.create` | `chatwork.api.tasks.create` | `write` | Create a task in a chat room |
| `tasks.get` | `chatwork.api.tasks.get` | `read` | Get a specific task in a chat room |
| `tasks.list` | `chatwork.api.tasks.list` | `read` | List tasks in a chat room (up to 100) |
| `tasks.updateStatus` | `chatwork.api.tasks.updateStatus` | `write` | Mark a task as done or reopen it |

## Auth

Auth: API key, OAuth 2.0 (default OAuth 2.0). Set `authType` on the plugin factory to pick one.

## Webhooks

Handles 3 webhook events. See the reference for payloads and `webhookHooks`.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/chatwork

## License

Apache-2.0
