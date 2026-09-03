# @corsair-dev/slack

Slack plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/slack
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `admin.conversationsGetTeams` | `slack.api.admin.conversationsGetTeams` | `read` | Get all the workspaces a given channel is connected to |
| `admin.conversationsSearch` | `slack.api.admin.conversationsSearch` | `read` | Search for channels on an Enterprise organization |
| `admin.conversationsSetTeams` | `slack.api.admin.conversationsSetTeams` | `write` | Set the workspaces in an Enterprise grid org that connect to a channel |
| `admin.listTeams` | `slack.api.admin.listTeams` | `read` | List all teams on an Enterprise organization |
| `channels.archive` | `slack.api.channels.archive` | `destructive` | Archive a Slack channel [DESTRUCTIVE] |
| `channels.close` | `slack.api.channels.close` | `write` | Close a direct message or multi-party DM |
| `channels.create` | `slack.api.channels.create` | `write` | Create a new Slack channel |
| `channels.get` | `slack.api.channels.get` | `read` | Get info about a channel |
| `channels.getHistory` | `slack.api.channels.getHistory` | `read` | Fetch message history for a channel |
| `channels.getMembers` | `slack.api.channels.getMembers` | `read` | List members of a channel |
| `channels.getReplies` | `slack.api.channels.getReplies` | `read` | Fetch replies for a thread |
| `channels.invite` | `slack.api.channels.invite` | `write` | Invite users to a channel |
| `channels.join` | `slack.api.channels.join` | `write` | Join a channel |
| `channels.kick` | `slack.api.channels.kick` | `write` | Remove a user from a channel |
| `channels.leave` | `slack.api.channels.leave` | `write` | Leave a channel |
| `channels.list` | `slack.api.channels.list` | `read` | List all channels in the workspace |
| `channels.open` | `slack.api.channels.open` | `write` | Open a direct message or multi-party DM |
| `channels.rename` | `slack.api.channels.rename` | `write` | Rename a channel |
| `channels.setPurpose` | `slack.api.channels.setPurpose` | `write` | Set the purpose of a channel |
| `channels.setTopic` | `slack.api.channels.setTopic` | `write` | Set the topic of a channel |
| `channels.unarchive` | `slack.api.channels.unarchive` | `write` | Unarchive a channel |
| `files.get` | `slack.api.files.get` | `read` | Get info about a file |
| `files.list` | `slack.api.files.list` | `read` | List files in the workspace |
| `files.upload` | `slack.api.files.upload` | `write` | Upload a file to Slack |
| `messages.delete` | `slack.api.messages.delete` | `destructive` | Delete a message [DESTRUCTIVE] |
| `messages.getPermalink` | `slack.api.messages.getPermalink` | `read` | Get a permalink for a message |
| `messages.post` | `slack.api.messages.post` | `write` | Post a message to a channel |
| `messages.search` | `slack.api.messages.search` | `read` | Search messages in the workspace |
| `messages.update` | `slack.api.messages.update` | `write` | Update an existing message |
| `reactions.add` | `slack.api.reactions.add` | `write` | Add a reaction emoji to a message |
| `reactions.get` | `slack.api.reactions.get` | `read` | Get reactions for a message |
| `reactions.remove` | `slack.api.reactions.remove` | `write` | Remove a reaction emoji from a message |
| `stars.add` | `slack.api.stars.add` | `write` | Star an item |
| `stars.list` | `slack.api.stars.list` | `read` | List starred items for the authenticated user |
| `stars.remove` | `slack.api.stars.remove` | `write` | Unstar an item |
| `userGroups.create` | `slack.api.userGroups.create` | `write` | Create a user group |
| `userGroups.disable` | `slack.api.userGroups.disable` | `write` | Disable a user group |
| `userGroups.enable` | `slack.api.userGroups.enable` | `write` | Enable a user group |
| `userGroups.list` | `slack.api.userGroups.list` | `read` | List user groups in the workspace |
| `userGroups.update` | `slack.api.userGroups.update` | `write` | Update a user group |
| `users.get` | `slack.api.users.get` | `read` | Get info about a user |
| `users.getPresence` | `slack.api.users.getPresence` | `read` | Get the presence status of a user |
| `users.getProfile` | `slack.api.users.getProfile` | `read` | Get a user profile |
| `users.list` | `slack.api.users.list` | `read` | List all users in the workspace |
| `users.updateProfile` | `slack.api.users.updateProfile` | `write` | Update the authenticated user's profile |

## Auth

Auth: API key, OAuth 2.0, Managed OAuth (default API key). Set `authType` on the plugin factory to pick one.

## Webhooks

Handles 9 webhook events. See the reference for payloads and `webhookHooks`.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/slack

## License

Apache-2.0
