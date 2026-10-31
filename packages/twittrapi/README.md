# @corsair-dev/twittrapi

TwittrAPI plugin for Corsair. X/Twitter data over REST with `format=simple` flat JSON and account-monitoring webhooks.

## Install

```bash
pnpm add @corsair-dev/twittrapi
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `balance.get` | `twittrapi.api.balance.get` | `read` | Get the API key balance (free, not billed) |
| `communities.getById` | `twittrapi.api.communities.getById` | `read` | Get community details by ID |
| `communities.getMembers` | `twittrapi.api.communities.getMembers` | `read` | Get members of a community |
| `communities.getModerators` | `twittrapi.api.communities.getModerators` | `read` | Get moderators of a community |
| `communities.getTweets` | `twittrapi.api.communities.getTweets` | `read` | Get tweets posted in a community |
| `communities.search` | `twittrapi.api.communities.search` | `read` | Search X communities by keyword |
| `lists.getDetails` | `twittrapi.api.lists.getDetails` | `read` | Get X list details by list ID |
| `lists.getFollowers` | `twittrapi.api.lists.getFollowers` | `read` | Get followers of an X list |
| `lists.getMembers` | `twittrapi.api.lists.getMembers` | `read` | Get members of an X list |
| `lists.getTweets` | `twittrapi.api.lists.getTweets` | `read` | Get tweets from an X list timeline |
| `monitors.addAccounts` | `twittrapi.api.monitors.addAccounts` | `write` | Watch X accounts for new tweets (up to 100 per request) |
| `monitors.createWebhook` | `twittrapi.api.monitors.createWebhook` | `write` | Add a webhook for watched-account tweet events |
| `monitors.deleteWebhook` | `twittrapi.api.monitors.deleteWebhook` | `destructive` | Remove an account-monitoring webhook |
| `monitors.getDeliveries` | `twittrapi.api.monitors.getDeliveries` | `read` | Show latest monitor events with delivery status |
| `monitors.getEvents` | `twittrapi.api.monitors.getEvents` | `read` | Pull monitor events after an event ID (7-day retention) |
| `monitors.getPlan` | `twittrapi.api.monitors.getPlan` | `read` | Get the account-monitoring plan and webhooks |
| `monitors.getWebhook` | `twittrapi.api.monitors.getWebhook` | `read` | Get one account-monitoring webhook |
| `monitors.listAccounts` | `twittrapi.api.monitors.listAccounts` | `read` | List watched X accounts and plan usage |
| `monitors.listWebhooks` | `twittrapi.api.monitors.listWebhooks` | `read` | List account-monitoring webhooks, oldest first |
| `monitors.removeAccount` | `twittrapi.api.monitors.removeAccount` | `destructive` | Stop watching an X account |
| `monitors.testWebhook` | `twittrapi.api.monitors.testWebhook` | `write` | Send a signed test event to a webhook |
| `monitors.updateAccount` | `twittrapi.api.monitors.updateAccount` | `write` | Change a watched account's reply/retweet/quote filters |
| `monitors.updateWebhook` | `twittrapi.api.monitors.updateWebhook` | `write` | Change a webhook URL, filter, secret, or active flag |
| `trends.getByLocation` | `twittrapi.api.trends.getByLocation` | `read` | Get trending topics by location (WOEID, 1 = worldwide) |
| `trends.getLocations` | `twittrapi.api.trends.getLocations` | `read` | List available trend locations (WOEIDs) |
| `tweets.getById` | `twittrapi.api.tweets.getById` | `read` | Get a single tweet by ID |
| `tweets.getLikers` | `twittrapi.api.tweets.getLikers` | `read` | Get users who liked a tweet |
| `tweets.getQuotes` | `twittrapi.api.tweets.getQuotes` | `read` | Get quote tweets for a tweet |
| `tweets.getReplies` | `twittrapi.api.tweets.getReplies` | `read` | Get a tweet with its replies in display order |
| `tweets.getRetweeters` | `twittrapi.api.tweets.getRetweeters` | `read` | Get users who retweeted a tweet |
| `tweets.search` | `twittrapi.api.tweets.search` | `read` | Search X tweets (Top, Latest, Photos, Videos tabs) |
| `users.batchGetByIds` | `twittrapi.api.users.batchGetByIds` | `read` | Batch fetch up to 500 user profiles by IDs |
| `users.getById` | `twittrapi.api.users.getById` | `read` | Get a user profile by numeric ID (or handle via username) |
| `users.getByUsername` | `twittrapi.api.users.getByUsername` | `read` | Get a user profile by handle |
| `users.getFollowers` | `twittrapi.api.users.getFollowers` | `read` | Get a user's followers |
| `users.getFollowings` | `twittrapi.api.users.getFollowings` | `read` | Get users that a user is following |
| `users.getFriendship` | `twittrapi.api.users.getFriendship` | `read` | Show the relationship between two accounts |
| `users.getLikes` | `twittrapi.api.users.getLikes` | `read` | Get a user's liked tweets |
| `users.getMedia` | `twittrapi.api.users.getMedia` | `read` | Get media tweets from a user's timeline |
| `users.getTweets` | `twittrapi.api.users.getTweets` | `read` | Get a user's tweets |
| `users.getTweetsAndReplies` | `twittrapi.api.users.getTweetsAndReplies` | `read` | Get a user's tweets and replies |
| `users.getVerifiedFollowers` | `twittrapi.api.users.getVerifiedFollowers` | `read` | Get a user's verified followers |
| `users.resolveIds` | `twittrapi.api.users.resolveIds` | `read` | Resolve up to 100 handles to user IDs |

## Auth

Auth: API key in the `X-API-KEY` header. Corsair prompts your tenant for credentials on first use.

## Webhooks

Handles 2 webhook events (`tweet`, `test`). Verify with `X-TwittrAPI-Signature: t=<unix>,v1=<HMAC-SHA256("<t>.<raw body>")>` and dedupe on `X-TwittrAPI-Delivery`. See the reference for payloads and `webhookHooks`.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/twittrapi

## License

Apache-2.0
