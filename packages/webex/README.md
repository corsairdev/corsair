# @corsair-dev/webex

Webex plugin for Corsair - manage spaces, post and read messages and threads, look up people and teams, manage room and team memberships, and subscribe webhooks to Webex events.

## Install

```bash
pnpm add @corsair-dev/webex
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `memberships.create` | `webex.api.memberships.create` | `write` | Add a person to a room, optionally as a moderator |
| `memberships.delete` | `webex.api.memberships.delete` | `destructive` | Remove a person from a room |
| `memberships.list` | `webex.api.memberships.list` | `read` | List the memberships of a room or of a person |
| `messages.create` | `webex.api.messages.create` | `write` | Post a message to a room or directly to a person, with text, markdown, html or one file attachment |
| `messages.delete` | `webex.api.messages.delete` | `destructive` | Delete one message permanently |
| `messages.get` | `webex.api.messages.get` | `read` | Read one message with its text, files and thread parent |
| `messages.list` | `webex.api.messages.list` | `read` | List messages in a room, or the replies in one of its threads, optionally before a time or message id |
| `messages.update` | `webex.api.messages.update` | `write` | Edit the text or markdown of a message you sent, up to 10 times per message |
| `people.get` | `webex.api.people.get` | `read` | Read one person by id |
| `people.list` | `webex.api.people.list` | `read` | List people by email, display name, id or organization |
| `people.me` | `webex.api.people.me` | `read` | Read the account behind the token, which is the cheapest way to check it |
| `rooms.create` | `webex.api.rooms.create` | `write` | Create a space, optionally within a team and with lock or read-only settings |
| `rooms.delete` | `webex.api.rooms.delete` | `destructive` | Delete a space and its message history; this cannot be undone |
| `rooms.get` | `webex.api.rooms.get` | `read` | Read one space with its title, type and creator |
| `rooms.list` | `webex.api.rooms.list` | `read` | List spaces, filtered by type or team and sorted by id, last activity or creation |
| `rooms.update` | `webex.api.rooms.update` | `write` | Change a space title, description or lock and read-only settings; the title is always sent |
| `teamMemberships.create` | `webex.api.teamMemberships.create` | `write` | Add a person to a team, optionally as a moderator |
| `teamMemberships.delete` | `webex.api.teamMemberships.delete` | `destructive` | Remove a person from a team |
| `teamMemberships.list` | `webex.api.teamMemberships.list` | `read` | List the members of a team |
| `teams.create` | `webex.api.teams.create` | `write` | Create a team with a name |
| `teams.delete` | `webex.api.teams.delete` | `destructive` | Delete a team, leaving its spaces in place |
| `teams.get` | `webex.api.teams.get` | `read` | Read one team with its name and creator |
| `teams.list` | `webex.api.teams.list` | `read` | List the teams on the workspace |
| `webhooks.create` | `webex.api.webhooks.create` | `write` | Subscribe a URL to a resource event, optionally filtered to one room and signed with a secret |
| `webhooks.delete` | `webex.api.webhooks.delete` | `destructive` | Delete a webhook subscription |
| `webhooks.get` | `webex.api.webhooks.get` | `read` | Read one webhook and what it fires on |
| `webhooks.list` | `webex.api.webhooks.list` | `read` | List webhook subscriptions |
| `webhooks.update` | `webex.api.webhooks.update` | `write` | Change a webhook name, target or secret, or reactivate one Webex disabled; name and target are always sent |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/webex

## License

Apache-2.0
