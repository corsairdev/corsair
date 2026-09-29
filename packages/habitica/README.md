# @corsair-dev/habitica

Habitica plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/habitica
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `auth.login` | `habitica.api.auth.login` | `read` | Exchange a password for an API token |
| `auth.register` | `habitica.api.auth.register` | `write` | Register a new Habitica account and mint its credential |
| `auth.social` | `habitica.api.auth.social` | `read` | Authenticate through a social provider |
| `challenges.clone` | `habitica.api.challenges.clone` | `write` | Duplicate a challenge |
| `challenges.create` | `habitica.api.challenges.create` | `write` | Create a challenge in a group |
| `challenges.delete` | `habitica.api.challenges.delete` | `destructive` | Permanently delete a challenge and its tasks |
| `challenges.exportCsv` | `habitica.api.challenges.exportCsv` | `read` | Export a challenge as CSV |
| `challenges.get` | `habitica.api.challenges.get` | `read` | Retrieve a challenge |
| `challenges.join` | `habitica.api.challenges.join` | `write` | Join a challenge |
| `challenges.leave` | `habitica.api.challenges.leave` | `write` | Leave a challenge |
| `challenges.listByGroup` | `habitica.api.challenges.listByGroup` | `read` | List a group's challenges |
| `challenges.listForUser` | `habitica.api.challenges.listForUser` | `read` | List the challenges the account takes part in |
| `chat.deleteMessage` | `habitica.api.chat.deleteMessage` | `destructive` | Permanently delete a chat message |
| `chat.list` | `habitica.api.chat.list` | `read` | Read a group's chat messages |
| `chat.markSeen` | `habitica.api.chat.markSeen` | `write` | Mark a group's chat as read |
| `content.dismissNews` | `habitica.api.content.dismissNews` | `write` | Dismiss the current announcement |
| `content.get` | `habitica.api.content.get` | `read` | Fetch the whole game content catalogue |
| `content.getByType` | `habitica.api.content.getByType` | `read` | Fetch the content catalogue with named categories EXCLUDED |
| `content.marketGear` | `habitica.api.content.marketGear` | `read` | List gear for sale in the market |
| `content.modelPaths` | `habitica.api.content.modelPaths` | `read` | List a model's field paths and types |
| `content.news` | `habitica.api.content.news` | `read` | Read the latest Bailey announcement |
| `content.status` | `habitica.api.content.status` | `read` | Check that the Habitica API is up |
| `content.timeTravelers` | `habitica.api.content.timeTravelers` | `read` | List the Time Travellers shop stock |
| `content.validateCoupon` | `habitica.api.content.validateCoupon` | `read` | Check whether a coupon code is valid |
| `content.worldState` | `habitica.api.content.worldState` | `read` | Read world events and the world boss |
| `exports.history` | `habitica.api.exports.history` | `read` | Export task history as CSV |
| `exports.inbox` | `habitica.api.exports.inbox` | `read` | Export the inbox as HTML |
| `exports.userData` | `habitica.api.exports.userData` | `read` | Export the whole account as JSON (contains the account email) |
| `groups.create` | `habitica.api.groups.create` | `write` | Create a party or guild |
| `groups.get` | `habitica.api.groups.get` | `read` | Retrieve a group by id |
| `groups.getParty` | `habitica.api.groups.getParty` | `read` | Retrieve the account's party |
| `groups.getTavern` | `habitica.api.groups.getTavern` | `read` | Retrieve the Tavern |
| `groups.invite` | `habitica.api.groups.invite` | `write` | Invite people to a group |
| `groups.inviteToQuest` | `habitica.api.groups.inviteToQuest` | `write` | Invite the party to a quest |
| `groups.leave` | `habitica.api.groups.leave` | `write` | Leave a group |
| `groups.list` | `habitica.api.groups.list` | `read` | List groups by type |
| `groups.listMembers` | `habitica.api.groups.listMembers` | `read` | List a group's members |
| `groups.removeMember` | `habitica.api.groups.removeMember` | `write` | Remove a member from the party |
| `groups.update` | `habitica.api.groups.update` | `write` | Update a group's properties |
| `tags.create` | `habitica.api.tags.create` | `write` | Create a tag |
| `tags.delete` | `habitica.api.tags.delete` | `destructive` | Permanently delete a tag |
| `tags.list` | `habitica.api.tags.list` | `read` | List every tag on the account |
| `tags.update` | `habitica.api.tags.update` | `write` | Rename a tag |
| `tasks.addTag` | `habitica.api.tasks.addTag` | `write` | Apply an existing tag to a task |
| `tasks.create` | `habitica.api.tasks.create` | `write` | Create a habit, daily, todo or reward |
| `tasks.createChallengeTask` | `habitica.api.tasks.createChallengeTask` | `write` | Add a task to a challenge |
| `tasks.delete` | `habitica.api.tasks.delete` | `destructive` | Permanently delete a task |
| `tasks.deleteChecklistItem` | `habitica.api.tasks.deleteChecklistItem` | `write` | Remove a checklist item from a task |
| `tasks.get` | `habitica.api.tasks.get` | `read` | Retrieve any task by id |
| `tasks.list` | `habitica.api.tasks.list` | `read` | List the account's tasks |
| `tasks.listChallengeTasks` | `habitica.api.tasks.listChallengeTasks` | `read` | List a challenge's tasks |
| `tasks.move` | `habitica.api.tasks.move` | `write` | Move a task to a position in its list |
| `tasks.score` | `habitica.api.tasks.score` | `write` | Score a task up or down |
| `tasks.unlinkAllChallengeTasks` | `habitica.api.tasks.unlinkAllChallengeTasks` | `destructive` | Unlink every task of a challenge, optionally deleting members' copies |
| `tasks.update` | `habitica.api.tasks.update` | `write` | Update a task |
| `tasks.updateChecklistItem` | `habitica.api.tasks.updateChecklistItem` | `write` | Update a checklist item's text |
| `user.addPushDevice` | `habitica.api.user.addPushDevice` | `write` | Register a push-notification device |
| `user.deleteMessage` | `habitica.api.user.deleteMessage` | `destructive` | Permanently delete an inbox message |
| `user.deletePushDevice` | `habitica.api.user.deletePushDevice` | `write` | Unregister a push-notification device |
| `user.equip` | `habitica.api.user.equip` | `write` | Equip or unequip gear, a pet, a mount or a costume |
| `user.get` | `habitica.api.user.get` | `read` | Read the account's user document |
| `user.markNotificationSeen` | `habitica.api.user.markNotificationSeen` | `write` | Mark one notification as seen |
| `user.markNotificationsSeen` | `habitica.api.user.markNotificationsSeen` | `write` | Mark several notifications as seen |
| `user.movePinnedItem` | `habitica.api.user.movePinnedItem` | `write` | Reorder a pinned reward |
| `user.readCard` | `habitica.api.user.readCard` | `write` | Mark a received card as read |
| `user.reset` | `habitica.api.user.reset` | `destructive` | Reset the account, deleting every task and returning to level 1 |
| `user.update` | `habitica.api.user.update` | `write` | Update user fields by dot path |
| `webhooks.create` | `habitica.api.webhooks.create` | `write` | Register an outbound webhook |
| `webhooks.list` | `habitica.api.webhooks.list` | `read` | List the account's outbound webhooks |
| `webhooks.subscribe` | `habitica.api.webhooks.subscribe` | `write` | Enable an existing webhook |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/habitica

## License

Apache-2.0
