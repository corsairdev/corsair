# @corsair-dev/ntfy

ntfy (push notification service) plugin for Corsair: publish notifications, poll topic messages, manage message sequences, and read account and server stats.

## Install

```bash
pnpm add @corsair-dev/ntfy
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `account.changePassword` | `ntfy.api.account.changePassword` | `destructive` | Change the signed-in account password; the old one stops working |
| `account.create` | `ntfy.api.account.create` | `write` | Sign up a new user on a server with signup enabled (anonymous call) |
| `account.delete` | `ntfy.api.account.delete` | `destructive` | Delete the signed-in account, its tokens and reservations, confirmed with the current password |
| `account.login` | `ntfy.api.account.login` | `write` | Sign in with username:password and get a new session token |
| `account.requestPasswordReset` | `ntfy.api.account.requestPasswordReset` | `destructive` | Email a password reset link to the account (server needs email sending) |
| `account.resetPassword` | `ntfy.api.account.resetPassword` | `write` | Set a new password with the token from a reset link |
| `account.updateSettings` | `ntfy.api.account.updateSettings` | `write` | Change account preferences: language, date/time format and notification sound, minimum priority, auto-delete |
| `account.usage` | `ntfy.api.account.usage` | `read` | Read the account view: tier limits, messages/emails/calls used and remaining, and the daily reset time |
| `billing.cancelSubscription` | `ntfy.api.billing.cancelSubscription` | `destructive` | Cancel the paid subscription at the end of the period |
| `billing.createPortalSession` | `ntfy.api.billing.createPortalSession` | `write` | Get a Stripe billing portal URL for the account |
| `billing.createSubscription` | `ntfy.api.billing.createSubscription` | `destructive` | Start a paid subscription; returns a Stripe checkout URL |
| `billing.tiers` | `ntfy.api.billing.tiers` | `read` | List the paid tiers with their prices and limits, plus the free tier (servers with payments only) |
| `billing.updateSubscription` | `ntfy.api.billing.updateSubscription` | `destructive` | Switch the paid subscription to another tier or interval (charges or prorates) |
| `emails.add` | `ntfy.api.emails.add` | `destructive` | Add an email address to the account and send it a verification link |
| `emails.delete` | `ntfy.api.emails.delete` | `destructive` | Remove an email address from the account |
| `emails.resendVerification` | `ntfy.api.emails.resendVerification` | `destructive` | Send the verification link for a pending email address again |
| `emails.setPrimary` | `ntfy.api.emails.setPrimary` | `write` | Make a verified email address the primary one |
| `emails.verify` | `ntfy.api.emails.verify` | `write` | Confirm an email address with the token from its verification link |
| `files.download` | `ntfy.api.files.download` | `read` | Download a message attachment stored on the server (/file/{id}) and return the file |
| `messages.clear` | `ntfy.api.messages.clear` | `write` | Mark a message as read and dismissed on subscribers (sends a message_clear event) |
| `messages.delete` | `ntfy.api.messages.delete` | `destructive` | Delete a message by sequence id, sending a delete event to subscribers; the cache entry is removed |
| `messages.poll` | `ntfy.api.messages.poll` | `read` | Read cached messages from one or more topics, optionally including scheduled ones, with since/filters |
| `messages.send` | `ntfy.api.messages.send` | `destructive` | Publish a notification to a topic; every subscriber gets a push, so the send cannot be undone |
| `messages.sendFile` | `ntfy.api.messages.sendFile` | `destructive` | Upload a file as a message attachment (PUT /{topic}); every subscriber gets a push, so the send cannot be undone |
| `messages.update` | `ntfy.api.messages.update` | `destructive` | Publish a new version of a message under an existing sequence id; the server keeps both versions and notifies again |
| `phoneNumbers.add` | `ntfy.api.phoneNumbers.add` | `write` | Add a phone number to the account with the code it received |
| `phoneNumbers.delete` | `ntfy.api.phoneNumbers.delete` | `destructive` | Remove a verified phone number from the account |
| `phoneNumbers.sendVerification` | `ntfy.api.phoneNumbers.sendVerification` | `destructive` | Send a verification code to a phone number by SMS or call (needs a tier with calls) |
| `reservations.add` | `ntfy.api.reservations.add` | `write` | Reserve a topic for the account and set what everyone else may do on it |
| `reservations.delete` | `ntfy.api.reservations.delete` | `destructive` | Release a reserved topic, optionally deleting its cached messages |
| `server.config` | `ntfy.api.server.config` | `read` | Read the server feature flags: login, signup, payments, calls, emails, reservations, web push |
| `server.health` | `ntfy.api.server.health` | `read` | Read server health (healthy flag and role) |
| `server.metrics` | `ntfy.api.server.metrics` | `read` | Read Prometheus metrics as text (servers with metrics enabled) |
| `server.ready` | `ntfy.api.server.ready` | `read` | Read whether the server is ready for traffic (load balancer check) |
| `server.stats` | `ntfy.api.server.stats` | `read` | Read server-wide totals: message count and rate per second |
| `server.version` | `ntfy.api.server.version` | `read` | Read the server version, commit and build date |
| `subscriptions.add` | `ntfy.api.subscriptions.add` | `write` | Add a topic subscription to the account (synced to the web app and phone apps) |
| `subscriptions.delete` | `ntfy.api.subscriptions.delete` | `write` | Remove a synced topic subscription from the account |
| `subscriptions.update` | `ntfy.api.subscriptions.update` | `write` | Change a synced subscription's display name |
| `tiers.create` | `ntfy.api.tiers.create` | `write` | Admin: create a tier with message, email, call, reservation and attachment limits |
| `tiers.delete` | `ntfy.api.tiers.delete` | `destructive` | Admin: delete a tier that no user is on |
| `tiers.list` | `ntfy.api.tiers.list` | `read` | Admin: list tiers with their limits and user counts |
| `tiers.update` | `ntfy.api.tiers.update` | `write` | Admin: change a tier's limits |
| `tokens.create` | `ntfy.api.tokens.create` | `write` | Create an access token for the signed-in account (returned once, tk_...) |
| `tokens.delete` | `ntfy.api.tokens.delete` | `destructive` | Revoke an access token (the given one, or the one making the call) |
| `tokens.update` | `ntfy.api.tokens.update` | `write` | Change an access token's label or expiry |
| `topics.checkAuth` | `ntfy.api.topics.checkAuth` | `read` | Check that the credential may read the topic(s); 200 with success true, 401/403 otherwise |
| `users.create` | `ntfy.api.users.create` | `write` | Admin: create a user with a password or bcrypt hash and an optional tier |
| `users.createToken` | `ntfy.api.users.createToken` | `write` | Admin: create an access token for a user (returned once) |
| `users.delete` | `ntfy.api.users.delete` | `destructive` | Admin: delete a user and their tokens and grants |
| `users.deleteToken` | `ntfy.api.users.deleteToken` | `destructive` | Admin: revoke one of a user's access tokens |
| `users.grantAccess` | `ntfy.api.users.grantAccess` | `write` | Admin: grant a user (or "*" everyone) read/write/deny access to a topic or pattern |
| `users.list` | `ntfy.api.users.list` | `read` | Admin: list users (or one by username) with role, tier and topic grants |
| `users.listTokens` | `ntfy.api.users.listTokens` | `read` | Admin: list a user's access tokens |
| `users.resetAccess` | `ntfy.api.users.resetAccess` | `destructive` | Admin: remove a user's topic grants (one topic or all) |
| `users.resetPassword` | `ntfy.api.users.resetPassword` | `destructive` | Admin: make a password reset link for a user, optionally emailing it |
| `users.update` | `ntfy.api.users.update` | `write` | Admin: change a user's password or tier |
| `webPush.subscribe` | `ntfy.api.webPush.subscribe` | `write` | Register or update a browser push subscription for topics |
| `webPush.unsubscribe` | `ntfy.api.webPush.unsubscribe` | `write` | Remove a browser push subscription |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/ntfy

## License

Apache-2.0
