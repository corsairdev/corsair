# @corsair-dev/userflow

Userflow plugin for Corsair - sync users, groups and membership attributes, track events, read flows, checklists and their sessions, and manage webhook subscriptions, accounts, members and invites.

## Install

```bash
pnpm add @corsair-dev/userflow
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `accounts.get` | `userflow.api.accounts.get` | `read` | Read one account, optionally expanding its environments with their region and primary flag |
| `accounts.list` | `userflow.api.accounts.list` | `read` | List the accounts your personal key is a member of; needs a personal key, not an environment key |
| `attributes.list` | `userflow.api.attributes.list` | `read` | List the attribute definitions Userflow has recorded, filtered by scope or by the events that use them |
| `content.get` | `userflow.api.content.get` | `read` | Read one flow, checklist, launcher or other content object with its labels and version ids |
| `content.getVersion` | `userflow.api.content.getVersion` | `read` | Read one content version, which holds the flow's questions or the checklist's tasks |
| `content.list` | `userflow.api.content.list` | `read` | List content objects, filtered by type |
| `content.listVersions` | `userflow.api.content.listVersions` | `read` | List the versions of one content object; Userflow cannot list versions across content |
| `contentSessions.delete` | `userflow.api.contentSessions.delete` | `destructive` | Permanently delete a content session with its progress and survey answers |
| `contentSessions.end` | `userflow.api.contentSessions.end` | `write` | End an active content session for a user; idempotent, and the session keeps its answers |
| `contentSessions.get` | `userflow.api.contentSessions.get` | `read` | Read one content session with its progress, completion and optionally its survey answers |
| `contentSessions.list` | `userflow.api.contentSessions.list` | `read` | List content sessions, filtered by content or user, to see who has seen or completed what |
| `eventDefinitions.list` | `userflow.api.eventDefinitions.list` | `read` | List the event definitions Userflow has recorded |
| `events.track` | `userflow.api.events.track` | `write` | Record an event against a user, a group or both, optionally with attributes and a past timestamp |
| `groups.delete` | `userflow.api.groups.delete` | `destructive` | Permanently delete a group with its attributes, memberships and events; the users in it stay |
| `groups.get` | `userflow.api.groups.get` | `read` | Read one group with its attributes, optionally expanding its users or memberships |
| `groups.list` | `userflow.api.groups.list` | `read` | List groups, optionally filtered by a condition expression |
| `groups.upsert` | `userflow.api.groups.upsert` | `write` | Create or update a group or company by your own id, merging the attributes sent |
| `invites.create` | `userflow.api.invites.create` | `write` | Send an email invite to join an account with a role and optional permissions; a pending invite or existing member makes it fail |
| `invites.delete` | `userflow.api.invites.delete` | `destructive` | Delete a pending invite, so its link stops working |
| `invites.get` | `userflow.api.invites.get` | `read` | Read one invite for an account |
| `invites.list` | `userflow.api.invites.list` | `read` | List pending and expired invites for an account |
| `members.get` | `userflow.api.members.get` | `read` | Read one member of an account with their role and permissions |
| `members.list` | `userflow.api.members.list` | `read` | List the members of an account, filtered by email or role |
| `members.remove` | `userflow.api.members.remove` | `destructive` | Remove a member from an account, revoking their access to it |
| `members.update` | `userflow.api.members.update` | `write` | Change a member's role or replace their permissions within an account |
| `memberships.remove` | `userflow.api.memberships.remove` | `write` | Remove one user from one group, leaving both the user and the group in place |
| `users.delete` | `userflow.api.users.delete` | `destructive` | Permanently delete a user with their attributes, memberships, events and flow history; groups they were in stay |
| `users.get` | `userflow.api.users.get` | `read` | Read one user with their attributes, optionally expanding their groups or memberships |
| `users.list` | `userflow.api.users.list` | `read` | List users, filtered by email, group, segment or a condition expression, with cursor paging |
| `users.upsert` | `userflow.api.users.upsert` | `write` | Create or update a user by your own id, merging the attributes sent and optionally syncing their groups or memberships |
| `webhookSubscriptions.create` | `userflow.api.webhookSubscriptions.create` | `write` | Subscribe a URL to user, group and event topics; the response is the only place the signing secret is shown |
| `webhookSubscriptions.delete` | `userflow.api.webhookSubscriptions.delete` | `destructive` | Permanently delete a webhook subscription; prefer update with disabled to pause delivery |
| `webhookSubscriptions.get` | `userflow.api.webhookSubscriptions.get` | `read` | Read one webhook subscription; the secret is not included |
| `webhookSubscriptions.list` | `userflow.api.webhookSubscriptions.list` | `read` | List webhook subscriptions |
| `webhookSubscriptions.update` | `userflow.api.webhookSubscriptions.update` | `write` | Change a subscription url, topics or api_version, or disable it without deleting it |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/userflow

## License

Apache-2.0
