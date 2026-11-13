# @corsair-dev/revolt

Revolt (Stoat) plugin for Corsair: reads the account behind a bot or user token, users, direct messages, channels, servers and server members, and reads, sends, edits and deletes messages and adds reactions.

## Install

```bash
pnpm add @corsair-dev/revolt
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `channels.delete` | `revolt.api.channels.delete` | `destructive` | Close a channel permanently; its message history is gone |
| `channels.edit` | `revolt.api.channels.edit` | `write` | Rename or redescribe a group or server channel |
| `channels.get` | `revolt.api.channels.get` | `read` | Fetch one channel with its type, name and permissions |
| `messages.delete` | `revolt.api.messages.delete` | `destructive` | Delete a message permanently |
| `messages.edit` | `revolt.api.messages.edit` | `write` | Edit a message the account posted, replacing its content |
| `messages.get` | `revolt.api.messages.get` | `read` | Fetch one message by id |
| `messages.list` | `revolt.api.messages.list` | `read` | Read a channel’s messages with time cursors, already carrying their authors |
| `messages.send` | `revolt.api.messages.send` | `write` | Send a message to a channel, optionally replying or attaching files |
| `reactions.add` | `revolt.api.reactions.add` | `write` | Add an emoji reaction to a message |
| `servers.get` | `revolt.api.servers.get` | `read` | Fetch one server with its channels, roles and default permissions |
| `servers.members` | `revolt.api.servers.members` | `read` | List a server’s members with their users, optionally excluding offline ones |
| `users.dms` | `revolt.api.users.dms` | `read` | List the direct-message channels the account is in, with the users they belong to |
| `users.get` | `revolt.api.users.get` | `read` | Fetch one user by id with their profile and presence |
| `users.me` | `revolt.api.users.me` | `read` | Read the account behind the token: its id, username, discriminator and status |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/revolt

## License

Apache-2.0
