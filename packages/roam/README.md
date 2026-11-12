# @corsair-dev/roam

Roam HQ plugin for Corsair: reads the token's identity, users, chats, groups and meetings, reads a chat history and a meeting transcript, and posts or edits a message and adds a reaction in your team's virtual office.

## Install

```bash
pnpm add @corsair-dev/roam
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `chat.history` | `roam.api.chat.history` | `read` | Read a chat or group’s messages with time-window and thread filters plus cursor paging |
| `chat.list` | `roam.api.chat.list` | `read` | List the chats the token can see, with cursor paging |
| `chat.post` | `roam.api.chat.post` | `write` | Post a message to a chat, group or direct conversation, or schedule one for later |
| `chat.update` | `roam.api.chat.update` | `write` | Edit a message the token posted, replacing its content |
| `groups.list` | `roam.api.groups.list` | `read` | List groups with a search phrase and type filter, plus cursor paging |
| `meetings.list` | `roam.api.meetings.list` | `read` | List meetings with a time window, plus cursor paging |
| `meetings.transcript` | `roam.api.meetings.transcript` | `read` | Fetch a meeting’s transcript cues with their speaker id and timing |
| `reactions.add` | `roam.api.reactions.add` | `write` | Add an emoji reaction to a message |
| `reactions.list` | `roam.api.reactions.list` | `read` | List the reactions on a message, and the votes on each option when it is a poll |
| `token.info` | `roam.api.token.info` | `read` | Read the account behind the token: its user, bot, workspace and granted scopes |
| `users.info` | `roam.api.users.info` | `read` | Look up one person or bot by uuid or email, including their role and availability |
| `users.list` | `roam.api.users.list` | `read` | List directory members with a search phrase or an explicit id list, plus cursor paging |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/roam

## License

Apache-2.0
