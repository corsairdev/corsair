# @corsair-dev/loomio

Group decision making with Loomio: groups, discussions, comments, polls, threads, memberships, search, participation reports and group webhooks through the User API, plus user and membership admin through the Server API on self-hosted installs.

## Install

```bash
pnpm add @corsair-dev/loomio
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `comments.create` | `loomio.api.comments.create` | `write` | Post a comment, or a reply to a comment, on a discussion, in markdown or html |
| `comments.delete` | `loomio.api.comments.delete` | `destructive` | Soft-delete a comment: its body is hidden and the API cannot restore it |
| `comments.update` | `loomio.api.comments.update` | `write` | Edit the body of a comment the key user may edit |
| `discussions.create` | `loomio.api.discussions.create` | `destructive` | Start a discussion in a group; can notify the whole group and email invitations to recipient addresses |
| `discussions.delete` | `loomio.api.discussions.delete` | `destructive` | Soft-delete a discussion; it disappears for members and the API cannot restore it |
| `discussions.get` | `loomio.api.discussions.get` | `read` | Read one discussion by numeric id or url key, with its author and thread record |
| `discussions.list` | `loomio.api.discussions.list` | `read` | List discussions in one group, filtered by open or closed status, ordered by latest activity |
| `discussions.update` | `loomio.api.discussions.update` | `destructive` | Edit a discussion title or context; can notify the group and email invitations to recipient addresses |
| `groups.get` | `loomio.api.groups.get` | `read` | Read one group by numeric id, url key, or handle, with its settings and member counts |
| `groups.list` | `loomio.api.groups.list` | `read` | List the groups the key user belongs to, including subgroups, oldest first |
| `memberships.list` | `loomio.api.memberships.list` | `read` | List a group's memberships with related users; emails only for members the key user invited or in groups it administers |
| `memberships.manage` | `loomio.api.memberships.manage` | `destructive` | Invite email addresses to a group (Loomio emails them) and optionally remove every member not listed; group admin only |
| `polls.create` | `loomio.api.polls.create` | `destructive` | Create a poll in a group or on a discussion; can invite the group to vote and email invitations to recipient addresses |
| `polls.delete` | `loomio.api.polls.delete` | `destructive` | Soft-delete a poll; it disappears for voters and the API cannot restore it |
| `polls.get` | `loomio.api.polls.get` | `read` | Read one poll by numeric id or url key, with vote counts and its options |
| `polls.list` | `loomio.api.polls.list` | `read` | List polls in one group, filtered by active or closed status, newest first, with current outcomes |
| `polls.update` | `loomio.api.polls.update` | `destructive` | Edit a poll (title, details, options, closing time); can change existing votes and email invitations |
| `reports.get` | `loomio.api.reports.get` | `read` | Generate a participation report (overview, per-person, or per-country counts) for the key user's groups |
| `search.query` | `loomio.api.search.query` | `read` | Search visible discussions, comments, polls, votes, and outcomes; up to 20 results |
| `server.groups.list` | `loomio.api.server.groups.list` | `read` | Self-hosted Server API: list every group on the install, private ones included (server key) |
| `server.memberships.list` | `loomio.api.server.memberships.list` | `read` | Self-hosted Server API: list a group's memberships and pending invitations with emails (server key) |
| `server.memberships.revoke` | `loomio.api.server.memberships.revoke` | `destructive` | Self-hosted Server API: revoke a membership in its group and subgroups (server key) |
| `server.memberships.sync` | `loomio.api.server.memberships.sync` | `destructive` | Self-hosted Server API: invite emails to a group and optionally revoke everyone not listed (server key) |
| `server.memberships.update` | `loomio.api.server.memberships.update` | `write` | Self-hosted Server API: grant or remove a member's admin and delegate roles (server key) |
| `server.users.create` | `loomio.api.server.users.create` | `write` | Self-hosted Server API: create an unverified account without sending an invitation (server key) |
| `server.users.deactivate` | `loomio.api.server.users.deactivate` | `destructive` | Self-hosted Server API: queue a user deactivation; success means queued, so read the user again and check active is false (server key) |
| `server.users.deactivateByIdentity` | `loomio.api.server.users.deactivateByIdentity` | `destructive` | Self-hosted Server API: queue deactivation of a user found by external identity; read again and check active is false (server key) |
| `server.users.delete` | `loomio.api.server.users.delete` | `destructive` | Self-hosted Server API: permanently delete a user and their records (server key) |
| `server.users.deleteByIdentity` | `loomio.api.server.users.deleteByIdentity` | `destructive` | Self-hosted Server API: permanently delete a user found by external identity (server key) |
| `server.users.get` | `loomio.api.server.users.get` | `read` | Self-hosted Server API: read one user account by id (server key) |
| `server.users.getByIdentity` | `loomio.api.server.users.getByIdentity` | `read` | Self-hosted Server API: find a user by external identity provider and uid (server key) |
| `server.users.list` | `loomio.api.server.users.list` | `read` | Self-hosted Server API: list every user account with emails and identities (server key) |
| `server.users.reactivate` | `loomio.api.server.users.reactivate` | `write` | Self-hosted Server API: reactivate a deactivated user (server key) |
| `server.users.reactivateByIdentity` | `loomio.api.server.users.reactivateByIdentity` | `write` | Self-hosted Server API: reactivate a user found by external identity (server key) |
| `server.users.redact` | `loomio.api.server.users.redact` | `destructive` | Self-hosted Server API: irreversibly remove a user's identifying data, keeping their content (server key) |
| `server.users.redactByIdentity` | `loomio.api.server.users.redactByIdentity` | `destructive` | Self-hosted Server API: irreversibly redact a user found by external identity (server key) |
| `server.users.update` | `loomio.api.server.users.update` | `write` | Self-hosted Server API: change a user's name, username, email, or admin flag (server key) |
| `server.users.updateByIdentity` | `loomio.api.server.users.updateByIdentity` | `write` | Self-hosted Server API: update a user found by external identity (server key) |
| `threads.get` | `loomio.api.threads.get` | `read` | Read one thread record by topic id, with its discussion or poll in the related arrays |
| `threads.items` | `loomio.api.threads.items` | `read` | Read one thread timeline in sequence order: comments, polls, votes, and outcomes as one event stream |
| `threads.list` | `loomio.api.threads.list` | `read` | List the threads the key user can see, ordered by latest activity, across all groups |
| `threads.markdown` | `loomio.api.threads.markdown` | `read` | Export one thread as a single markdown document; needs export permission on the thread |
| `webhooks.check` | `loomio.api.webhooks.check` | `destructive` | Ask Loomio to send a test message to a webhook destination URL; success does not confirm delivery |
| `webhooks.create` | `loomio.api.webhooks.create` | `write` | Create an outgoing webhook or chat integration that posts group events to a URL; group admin only |
| `webhooks.delete` | `loomio.api.webhooks.delete` | `destructive` | Delete a webhook or chat integration; future deliveries stop |
| `webhooks.list` | `loomio.api.webhooks.list` | `read` | List a group's outgoing webhooks and chat integrations, with destination URLs; group admin only |
| `webhooks.update` | `loomio.api.webhooks.update` | `write` | Change a webhook's name, destination, format, or events; group admin only |

## Auth

Auth: API key (a Loomio user's key from /profile/api_access; for `server.*` operations, a self-hosted install's `SERVER_API_KEY`). Optional account field `base_url` points at a self-hosted install; it defaults to https://www.loomio.com. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/loomio

## License

Apache-2.0
