# @corsair-dev/discord

Discord plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/discord
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `channels.list` | `discord.api.channels.list` | `read` | List channels in a guild |
| `guilds.get` | `discord.api.guilds.get` | `read` | Get info about a guild |
| `guilds.list` | `discord.api.guilds.list` | `read` | List guilds the bot is a member of |
| `members.get` | `discord.api.members.get` | `read` | Get info about a guild member |
| `members.list` | `discord.api.members.list` | `read` | List members of a guild |
| `messages.delete` | `discord.api.messages.delete` | `destructive` | Permanently delete a message [DESTRUCTIVE] |
| `messages.edit` | `discord.api.messages.edit` | `write` | Edit an existing message |
| `messages.get` | `discord.api.messages.get` | `read` | Get a specific message |
| `messages.list` | `discord.api.messages.list` | `read` | List recent messages in a channel |
| `messages.reply` | `discord.api.messages.reply` | `write` | Reply to a message in a channel |
| `messages.send` | `discord.api.messages.send` | `write` | Send a message to a channel |
| `reactions.add` | `discord.api.reactions.add` | `write` | Add a reaction to a message |
| `reactions.list` | `discord.api.reactions.list` | `read` | List reactions on a message |
| `reactions.remove` | `discord.api.reactions.remove` | `write` | Remove a reaction from a message |
| `threads.create` | `discord.api.threads.create` | `write` | Create a new thread in a channel |
| `threads.createFromMessage` | `discord.api.threads.createFromMessage` | `write` | Create a thread from an existing message |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

Handles 4 webhook events. See the reference for payloads and `webhookHooks`.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/discord

## License

Apache-2.0
