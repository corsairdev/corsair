# @corsair-dev/stormboard

Stormboard collaborative workspaces: manage storms, ideas, comments, votes, connectors, tags and chat, and invite or join participants.

## Install

```bash
pnpm add @corsair-dev/stormboard
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `chat.create` | `stormboard.api.chat.create` | `write` | Post a chat message to a Storm |
| `chat.list` | `stormboard.api.chat.list` | `read` | List a Storm's chat messages |
| `chat.listUnread` | `stormboard.api.chat.listUnread` | `read` | List a Storm's unread chat messages |
| `chat.markAllRead` | `stormboard.api.chat.markAllRead` | `write` | Mark a Storm's chat messages as read |
| `folders.list` | `stormboard.api.folders.list` | `read` | List a team's folders |
| `ideas.addVote` | `stormboard.api.ideas.addVote` | `write` | Add a vote to an idea |
| `ideas.create` | `stormboard.api.ideas.create` | `write` | Create an idea on a Storm |
| `ideas.createComment` | `stormboard.api.ideas.createComment` | `write` | Comment on an idea |
| `ideas.createConnector` | `stormboard.api.ideas.createConnector` | `write` | Draw a line connector between two ideas |
| `ideas.delete` | `stormboard.api.ideas.delete` | `destructive` | Delete an idea |
| `ideas.deleteComment` | `stormboard.api.ideas.deleteComment` | `destructive` | Delete a comment on an idea |
| `ideas.deleteConnector` | `stormboard.api.ideas.deleteConnector` | `destructive` | Delete a line connector |
| `ideas.deleteConnectorBetween` | `stormboard.api.ideas.deleteConnectorBetween` | `destructive` | Delete the connector between two ideas |
| `ideas.get` | `stormboard.api.ideas.get` | `read` | Read one idea |
| `ideas.listComments` | `stormboard.api.ideas.listComments` | `read` | List the comments on an idea |
| `ideas.removeVote` | `stormboard.api.ideas.removeVote` | `write` | Remove a vote from an idea |
| `ideas.update` | `stormboard.api.ideas.update` | `write` | Update an idea's text, position and style |
| `ideas.updateComment` | `stormboard.api.ideas.updateComment` | `write` | Edit a comment on an idea |
| `ideas.updateConnector` | `stormboard.api.ideas.updateConnector` | `write` | Update a line connector's label and style |
| `ideas.updateTask` | `stormboard.api.ideas.updateTask` | `write` | Update an idea's task assignment and dates |
| `storms.acceptInvite` | `stormboard.api.storms.acceptInvite` | `write` | Accept a Storm invite for the token holder |
| `storms.close` | `stormboard.api.storms.close` | `write` | Close a Storm; reopening restores it |
| `storms.create` | `stormboard.api.storms.create` | `write` | Create a Storm |
| `storms.declineInvite` | `stormboard.api.storms.declineInvite` | `write` | Decline a Storm invite for the token holder |
| `storms.duplicate` | `stormboard.api.storms.duplicate` | `write` | Duplicate a Storm |
| `storms.favorite` | `stormboard.api.storms.favorite` | `write` | Star a Storm |
| `storms.get` | `stormboard.api.storms.get` | `read` | Read one Storm's details |
| `storms.getAccess` | `stormboard.api.storms.getAccess` | `read` | Read the token holder's access to a Storm |
| `storms.getTemplate` | `stormboard.api.storms.getTemplate` | `read` | Read a Storm's template sections |
| `storms.invite` | `stormboard.api.storms.invite` | `destructive` | Invite participants to a Storm by email; sends mail that cannot be recalled |
| `storms.join` | `stormboard.api.storms.join` | `write` | Join a Storm with its key |
| `storms.leave` | `stormboard.api.storms.leave` | `write` | Leave a Storm |
| `storms.list` | `stormboard.api.storms.list` | `read` | List your Storms with search, ordering and paging |
| `storms.listConnectors` | `stormboard.api.storms.listConnectors` | `read` | List the line connectors in a Storm |
| `storms.listIdeas` | `stormboard.api.storms.listIdeas` | `read` | List a Storm's ideas, optionally filtered by last modified date |
| `storms.listInvites` | `stormboard.api.storms.listInvites` | `read` | List your Storm invites |
| `storms.listUsers` | `stormboard.api.storms.listUsers` | `read` | List a Storm's participants with their activity |
| `storms.reopen` | `stormboard.api.storms.reopen` | `write` | Re-open a closed Storm |
| `storms.unfavorite` | `stormboard.api.storms.unfavorite` | `write` | Remove a Storm's star |
| `storms.update` | `stormboard.api.storms.update` | `write` | Update a Storm's title, description and settings |
| `storms.updateLegend` | `stormboard.api.storms.updateLegend` | `write` | Set the color labels of a Storm's legend |
| `storms.updateSection` | `stormboard.api.storms.updateSection` | `write` | Update one section of a Storm |
| `tags.createForIdea` | `stormboard.api.tags.createForIdea` | `write` | Set tag data on an idea |
| `tags.createForStorm` | `stormboard.api.tags.createForStorm` | `write` | Create a tag in a Storm |
| `tags.getForIdea` | `stormboard.api.tags.getForIdea` | `read` | Read the tag data of an idea |
| `tags.listForStorm` | `stormboard.api.tags.listForStorm` | `read` | List the tags in a Storm |
| `users.create` | `stormboard.api.users.create` | `destructive` | Create a Stormboard user, which emails them a verification code, and return its API key |
| `users.getAuth` | `stormboard.api.users.getAuth` | `read` | Read the account API keys with their creation dates |
| `users.getProfile` | `stormboard.api.users.getProfile` | `read` | Read the profile behind the token |
| `users.test` | `stormboard.api.users.test` | `read` | Check that the token authenticates |
| `users.updateNotifications` | `stormboard.api.users.updateNotifications` | `write` | Update the account notification settings |
| `users.updateProfile` | `stormboard.api.users.updateProfile` | `write` | Update the profile behind the token |
| `users.verify` | `stormboard.api.users.verify` | `write` | Verify a Stormboard account with its verification code |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/stormboard

## License

Apache-2.0
