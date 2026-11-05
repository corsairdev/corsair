# @corsair-dev/teams

Microsoft Teams plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/teams
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `channels.create` | `teams.api.channels.create` | `write` | Create a new channel in a team |
| `channels.delete` | `teams.api.channels.delete` | `destructive` | Delete a channel [DESTRUCTIVE] |
| `channels.get` | `teams.api.channels.get` | `read` | Get details of a specific channel |
| `channels.list` | `teams.api.channels.list` | `read` | List channels in a team |
| `channels.update` | `teams.api.channels.update` | `write` | Update a channel |
| `chats.create` | `teams.api.chats.create` | `write` | Create a new chat |
| `chats.get` | `teams.api.chats.get` | `read` | Get details of a specific chat |
| `chats.list` | `teams.api.chats.list` | `read` | List chats for the current user |
| `chats.listMessages` | `teams.api.chats.listMessages` | `read` | List messages in a chat |
| `chats.sendMessage` | `teams.api.chats.sendMessage` | `write` | Send a message in a chat |
| `members.add` | `teams.api.members.add` | `write` | Add a member to a team |
| `members.get` | `teams.api.members.get` | `read` | Get a specific team member |
| `members.list` | `teams.api.members.list` | `read` | List members of a team |
| `members.remove` | `teams.api.members.remove` | `destructive` | Remove a member from a team [DESTRUCTIVE] |
| `messages.delete` | `teams.api.messages.delete` | `destructive` | Delete a channel message [DESTRUCTIVE] |
| `messages.get` | `teams.api.messages.get` | `read` | Get a specific channel message |
| `messages.list` | `teams.api.messages.list` | `read` | List messages in a channel |
| `messages.listReplies` | `teams.api.messages.listReplies` | `read` | List replies to a channel message |
| `messages.reply` | `teams.api.messages.reply` | `write` | Reply to a message in a channel |
| `messages.send` | `teams.api.messages.send` | `write` | Send a message to a channel |
| `teams.create` | `teams.api.teams.create` | `write` | Create a new team |
| `teams.delete` | `teams.api.teams.delete` | `destructive` | Delete a team [DESTRUCTIVE] |
| `teams.get` | `teams.api.teams.get` | `read` | Get details of a specific team |
| `teams.list` | `teams.api.teams.list` | `read` | List teams the current user is a member of |
| `teams.update` | `teams.api.teams.update` | `write` | Update team settings |

## Auth

Auth: OAuth 2.0, Managed OAuth (default OAuth 2.0). Set `authType` on the plugin factory to pick one.

## Webhooks

Handles 4 webhook events. See the reference for payloads and `webhookHooks`.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/teams

## License

Apache-2.0
