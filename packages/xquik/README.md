# @corsair-dev/xquik

Search tweets, inspect users, manage Xquik webhooks, upload media, and run X actions from Corsair.

## Install

```bash
pnpm add @corsair-dev/xquik
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `media.download` | `xquik.api.media.download` | `read` | Download images and videos from one or more tweets |
| `media.uploadFromUrl` | `xquik.api.media.uploadFromUrl` | `write` | Upload public media URLs for use in Xquik tweet creation |
| `trends.get` | `xquik.api.trends.get` | `read` | Get trending X topics by WOEID region |
| `tweets.batch` | `xquik.api.tweets.batch` | `read` | Fetch up to 100 tweets by ID |
| `tweets.create` | `xquik.api.tweets.create` | `write` | Create a tweet or reply from a connected X account |
| `tweets.delete` | `xquik.api.tweets.delete` | `destructive` | Delete a tweet from a connected X account |
| `tweets.get` | `xquik.api.tweets.get` | `read` | Get a tweet with full text, author, metrics, and media |
| `tweets.like` | `xquik.api.tweets.like` | `write` | Like a tweet from a connected X account |
| `tweets.retweet` | `xquik.api.tweets.retweet` | `write` | Retweet a tweet from a connected X account |
| `tweets.search` | `xquik.api.tweets.search` | `read` | Search tweets with X query operators and pagination |
| `tweets.unlike` | `xquik.api.tweets.unlike` | `write` | Remove a like from a connected X account |
| `users.batch` | `xquik.api.users.batch` | `read` | Look up up to 100 X users by ID |
| `users.follow` | `xquik.api.users.follow` | `write` | Follow an X user from a connected account |
| `users.followers` | `xquik.api.users.followers` | `read` | List followers of an X user |
| `users.following` | `xquik.api.users.following` | `read` | List accounts an X user follows |
| `users.get` | `xquik.api.users.get` | `read` | Get an X user profile by username or user ID |
| `users.search` | `xquik.api.users.search` | `read` | Search X users by name or username |
| `users.tweets` | `xquik.api.users.tweets` | `read` | List recent tweets posted by an X user |
| `users.unfollow` | `xquik.api.users.unfollow` | `write` | Unfollow an X user from a connected account |
| `webhooks.create` | `xquik.api.webhooks.create` | `write` | Create an Xquik webhook endpoint subscription |
| `webhooks.deactivate` | `xquik.api.webhooks.deactivate` | `write` | Deactivate an Xquik webhook endpoint |
| `webhooks.deliveries` | `xquik.api.webhooks.deliveries` | `read` | List delivery attempts for an Xquik webhook endpoint |
| `webhooks.list` | `xquik.api.webhooks.list` | `read` | List configured Xquik webhook endpoints |
| `webhooks.test` | `xquik.api.webhooks.test` | `write` | Send a test delivery to an Xquik webhook endpoint |
| `webhooks.update` | `xquik.api.webhooks.update` | `write` | Update a Xquik webhook URL, event types, or active state |
| `writeActions.get` | `xquik.api.writeActions.get` | `read` | Check the status of a pending Xquik write action |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

Handles 2 webhook events. See the reference for payloads and `webhookHooks`.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/xquik

## License

Apache-2.0
