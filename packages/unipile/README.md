# @corsair-dev/unipile

Unipile plugin for Corsair: LinkedIn profiles, invitations, relations, chats, messages and webhooks.

## Install

```bash
pnpm add @corsair-dev/unipile
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `accounts.createAuthLink` | `unipile.api.accounts.createAuthLink` | `write` | Create a Hosted Auth link for a user to connect a LinkedIn (or other) account, or to reconnect one with account_id; LinkedIn sign-in can offer credentials, cookies or the UniLogin extension |
| `accounts.get` | `unipile.api.accounts.get` | `read` | Get one connected account: provider, status (running, disconnected, errored…), lock state and connection method |
| `accounts.list` | `unipile.api.accounts.list` | `read` | List connected Unipile accounts (LinkedIn and others) with their acc_ IDs, provider and status; filter by provider or status |
| `accounts.remove` | `unipile.api.accounts.remove` | `destructive` | Disconnect an account from Unipile and delete all its Unipile data. The user must link it again to use it |
| `chats.get` | `unipile.api.chats.get` | `read` | Get one chat: participants, unread count, last message and whether sending is restricted |
| `chats.list` | `unipile.api.chats.list` | `read` | List the account's chats, newest first, filtered by type, date, unread or archived |
| `chats.start` | `unipile.api.chats.start` | `write` | Start a LinkedIn chat with one person (or a group) by sending the first message; can send as InMail. Use messages.send when a chat already exists |
| `messages.list` | `unipile.api.messages.list` | `read` | List the messages in a chat, newest first, with sender, read and delivery state |
| `messages.send` | `unipile.api.messages.send` | `write` | Send a message, optionally with attachments or as a reply, in an existing chat |
| `posts.list` | `unipile.api.posts.list` | `read` | List a user's LinkedIn posts with reaction, comment and repost counts |
| `posts.listComments` | `unipile.api.posts.listComments` | `read` | List the comments on a post with each author, newest or most relevant first |
| `posts.listReactions` | `unipile.api.posts.listReactions` | `read` | List the people who reacted to a post, with their profile summary, to find engaged leads |
| `relationRequests.accept` | `unipile.api.relationRequests.accept` | `write` | Accept a LinkedIn invitation the account received |
| `relationRequests.cancel` | `unipile.api.relationRequests.cancel` | `destructive` | Withdraw a sent LinkedIn invitation or decline a received one. LinkedIn may block re-inviting the same person for weeks |
| `relationRequests.create` | `unipile.api.relationRequests.create` | `write` | Send a LinkedIn connection invitation to a member ID (ACo…), with an optional note. LinkedIn allows roughly 100-200 a week; pace sends and never retry a failed one blindly |
| `relationRequests.list` | `unipile.api.relationRequests.list` | `read` | List pending LinkedIn invitations the account sent or received, with the other person and any note |
| `users.getChat` | `unipile.api.users.getChat` | `read` | Find the existing 1-to-1 chat IDs with a user, to send into instead of starting a new chat |
| `users.getProfile` | `unipile.api.users.getProfile` | `read` | Get a LinkedIn profile by member ID or public identifier: headline, location, network distance, invitation status, and optional experience, education and skills. Counts toward LinkedIn profile-view limits (about 80-100 a day) |
| `users.listComments` | `unipile.api.users.listComments` | `read` | List a user's comments on posts (the account owner's by default), with each post |
| `users.listReactions` | `unipile.api.users.listReactions` | `read` | List the posts a user reacted to (the account owner's by default), with each post |
| `users.listRelations` | `unipile.api.users.listRelations` | `read` | List a user's 1st-degree connections (the account owner's by default), with optional name search and paging |
| `users.visitProfile` | `unipile.api.users.visitProfile` | `write` | Report a profile visit to LinkedIn so the member sees you in 'Who viewed your profile', using the notify_visit_token from users.getProfile |
| `webhookEndpoints.create` | `unipile.api.webhookEndpoints.create` | `write` | Register a URL to receive Unipile events such as relation.new and message.new. Returns the signing secret once, and only here: store it as the plugin webhookSecret right away. Needs a Service API Key |
| `webhookEndpoints.delete` | `unipile.api.webhookEndpoints.delete` | `destructive` | Delete a Unipile webhook endpoint; its events stop. Needs a Service API Key |
| `webhookEndpoints.get` | `unipile.api.webhookEndpoints.get` | `read` | Get one Unipile webhook endpoint: URL, events, accounts and whether it has a signing secret (the secret is never returned). Needs a Service API Key |
| `webhookEndpoints.list` | `unipile.api.webhookEndpoints.list` | `read` | List the Unipile webhook endpoints, their URLs, events and accounts (signing secrets are never returned). Needs a Service API Key |
| `webhookEndpoints.update` | `unipile.api.webhookEndpoints.update` | `write` | Change a webhook endpoint's URL, events, accounts or description, or enable or disable it. Keeps the signing secret, which is not returned. Needs a Service API Key |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

Handles 13 webhook events. See the reference for payloads and `webhookHooks`.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/unipile

## License

Apache-2.0
