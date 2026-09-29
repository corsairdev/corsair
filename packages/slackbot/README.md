# @corsair-dev/slackbot

Slackbot plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/slackbot
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `calls.add` | `slackbot.api.calls.add` | `write` | Register a call with Slack |
| `calls.end` | `slackbot.api.calls.end` | `write` | End an in-progress call |
| `calls.info` | `slackbot.api.calls.info` | `read` | Retrieve information about a call |
| `calls.participantsAdd` | `slackbot.api.calls.participantsAdd` | `write` | Add participants to a call |
| `calls.participantsRemove` | `slackbot.api.calls.participantsRemove` | `write` | Remove participants from a call |
| `calls.update` | `slackbot.api.calls.update` | `write` | Update a call title or join URLs |
| `canvases.create` | `slackbot.api.canvases.create` | `write` | Create a standalone or channel canvas |
| `canvases.delete` | `slackbot.api.canvases.delete` | `destructive` | Delete a canvas |
| `canvases.edit` | `slackbot.api.canvases.edit` | `write` | Apply changes to a canvas |
| `canvases.get` | `slackbot.api.canvases.get` | `read` | Retrieve a canvas and its content |
| `canvases.list` | `slackbot.api.canvases.list` | `read` | List canvases in the workspace |
| `canvases.sectionsLookup` | `slackbot.api.canvases.sectionsLookup` | `read` | Look up section ids within a canvas |
| `conversations.archive` | `slackbot.api.conversations.archive` | `destructive` | Archive a conversation |
| `conversations.close` | `slackbot.api.conversations.close` | `write` | Close a direct message or group conversation |
| `conversations.create` | `slackbot.api.conversations.create` | `write` | Create a public or private channel |
| `conversations.find` | `slackbot.api.conversations.find` | `read` | Search conversations by name |
| `conversations.info` | `slackbot.api.conversations.info` | `read` | Retrieve information about a conversation |
| `conversations.invite` | `slackbot.api.conversations.invite` | `write` | Invite users to a channel |
| `conversations.join` | `slackbot.api.conversations.join` | `write` | Join a public channel |
| `conversations.kick` | `slackbot.api.conversations.kick` | `destructive` | Remove a user from a conversation |
| `conversations.leave` | `slackbot.api.conversations.leave` | `write` | Leave a conversation |
| `conversations.list` | `slackbot.api.conversations.list` | `read` | List conversations in the workspace |
| `conversations.listForUser` | `slackbot.api.conversations.listForUser` | `read` | List the conversations a user belongs to |
| `conversations.mark` | `slackbot.api.conversations.mark` | `write` | Move a conversation read cursor |
| `conversations.members` | `slackbot.api.conversations.members` | `read` | List the members of a conversation |
| `conversations.rename` | `slackbot.api.conversations.rename` | `write` | Rename a conversation |
| `conversations.setPurpose` | `slackbot.api.conversations.setPurpose` | `write` | Set a conversation purpose |
| `conversations.setTopic` | `slackbot.api.conversations.setTopic` | `write` | Set a conversation topic |
| `conversations.unarchive` | `slackbot.api.conversations.unarchive` | `write` | Unarchive a conversation |
| `files.commentsDelete` | `slackbot.api.files.commentsDelete` | `destructive` | Delete a comment on a file |
| `files.delete` | `slackbot.api.files.delete` | `destructive` | Delete a file by ID |
| `files.download` | `slackbot.api.files.download` | `read` | Download the contents of a Slack file |
| `files.info` | `slackbot.api.files.info` | `read` | Retrieve detailed information about a file |
| `files.list` | `slackbot.api.files.list` | `read` | List files in the workspace, filtered by channel, user or type |
| `files.remoteAdd` | `slackbot.api.files.remoteAdd` | `write` | Register an externally hosted file with Slack |
| `files.remoteInfo` | `slackbot.api.files.remoteInfo` | `read` | Retrieve a remote file metadata |
| `files.remoteList` | `slackbot.api.files.remoteList` | `read` | List remote files |
| `files.remoteRemove` | `slackbot.api.files.remoteRemove` | `destructive` | Remove a remote file |
| `files.remoteShare` | `slackbot.api.files.remoteShare` | `write` | Share a remote file into one or more channels |
| `files.remoteUpdate` | `slackbot.api.files.remoteUpdate` | `write` | Update an existing remote file |
| `files.revokePublicUrl` | `slackbot.api.files.revokePublicUrl` | `write` | Revoke a file public URL |
| `files.sharePublicUrl` | `slackbot.api.files.sharePublicUrl` | `write` | Create a public URL for a file |
| `files.upload` | `slackbot.api.files.upload` | `write` | Upload a file to Slack and optionally share it to a channel |
| `messages.delete` | `slackbot.api.messages.delete` | `destructive` | Delete a message from a conversation |
| `messages.deleteScheduled` | `slackbot.api.messages.deleteScheduled` | `destructive` | Cancel a scheduled message before it sends |
| `messages.history` | `slackbot.api.messages.history` | `read` | Fetch a conversation message history |
| `messages.pinAdd` | `slackbot.api.messages.pinAdd` | `write` | Pin a message to a channel |
| `messages.pinRemove` | `slackbot.api.messages.pinRemove` | `destructive` | Unpin a message from a channel |
| `messages.pinsList` | `slackbot.api.messages.pinsList` | `read` | List the pinned items in a channel |
| `messages.post` | `slackbot.api.messages.post` | `write` | Send a message to a channel, DM or thread |
| `messages.postEphemeral` | `slackbot.api.messages.postEphemeral` | `write` | Send a message visible only to a single user |
| `messages.postMe` | `slackbot.api.messages.postMe` | `write` | Send a me-style message to a channel |
| `messages.reactionAdd` | `slackbot.api.messages.reactionAdd` | `write` | Add an emoji reaction to a message |
| `messages.reactionRemove` | `slackbot.api.messages.reactionRemove` | `destructive` | Remove an emoji reaction from a message |
| `messages.reactionsGet` | `slackbot.api.messages.reactionsGet` | `read` | Fetch the reactions on a message or file |
| `messages.reactionsList` | `slackbot.api.messages.reactionsList` | `read` | List the items a user has reacted to |
| `messages.replies` | `slackbot.api.messages.replies` | `read` | Fetch the replies in a message thread |
| `messages.schedule` | `slackbot.api.messages.schedule` | `write` | Schedule a message to be sent at a future time |
| `messages.update` | `slackbot.api.messages.update` | `write` | Update the text or blocks of an existing message |
| `reminders.add` | `slackbot.api.reminders.add` | `write` | Create a reminder |
| `reminders.complete` | `slackbot.api.reminders.complete` | `write` | Mark a reminder complete (deprecated by Slack) |
| `reminders.delete` | `slackbot.api.reminders.delete` | `destructive` | Delete a reminder |
| `reminders.info` | `slackbot.api.reminders.info` | `read` | Retrieve information about a reminder |
| `reminders.list` | `slackbot.api.reminders.list` | `read` | List the reminders visible to the token |
| `team.emojiList` | `slackbot.api.team.emojiList` | `read` | List the workspace custom emoji |
| `team.info` | `slackbot.api.team.info` | `read` | Fetch workspace information |
| `team.openDm` | `slackbot.api.team.openDm` | `write` | Open a direct or multi-person direct message |
| `team.profileGet` | `slackbot.api.team.profileGet` | `read` | Fetch the workspace profile field definitions |
| `team.unfurl` | `slackbot.api.team.unfurl` | `write` | Attach a custom preview to a link in a message |
| `userGroups.create` | `slackbot.api.userGroups.create` | `write` | Create a user group |
| `userGroups.disable` | `slackbot.api.userGroups.disable` | `write` | Disable a user group |
| `userGroups.enable` | `slackbot.api.userGroups.enable` | `write` | Enable a user group |
| `userGroups.list` | `slackbot.api.userGroups.list` | `read` | List the workspace user groups |
| `userGroups.update` | `slackbot.api.userGroups.update` | `write` | Update a user group name, handle or channels |
| `userGroups.usersList` | `slackbot.api.userGroups.usersList` | `read` | List the members of a user group |
| `userGroups.usersUpdate` | `slackbot.api.userGroups.usersUpdate` | `write` | Replace a user group membership |
| `users.botsInfo` | `slackbot.api.users.botsInfo` | `read` | Retrieve information about a bot user |
| `users.dndInfo` | `slackbot.api.users.dndInfo` | `read` | Retrieve a user do-not-disturb status |
| `users.dndTeamInfo` | `slackbot.api.users.dndTeamInfo` | `read` | Retrieve do-not-disturb status for several users |
| `users.find` | `slackbot.api.users.find` | `read` | Search users by name, display name or email |
| `users.getPresence` | `slackbot.api.users.getPresence` | `read` | Retrieve a user presence |
| `users.getProfile` | `slackbot.api.users.getProfile` | `read` | Retrieve a user profile |
| `users.info` | `slackbot.api.users.info` | `read` | Retrieve detailed information about a user |
| `users.list` | `slackbot.api.users.list` | `read` | List the users in the workspace |
| `users.lookupByEmail` | `slackbot.api.users.lookupByEmail` | `read` | Look up a user by email address (deprecated by Slack) |
| `users.setActive` | `slackbot.api.users.setActive` | `write` | Mark the calling user as active |
| `users.setPresence` | `slackbot.api.users.setPresence` | `write` | Set the calling user presence |

## Auth

Auth: OAuth 2.0. Corsair prompts your tenant for credentials on first use.

## Webhooks

Handles 10 webhook events. See the reference for payloads and `webhookHooks`.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/slackbot

## License

Apache-2.0
