# @corsair-dev/twitterapiio

TwitterAPI.io plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/twitterapiio
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `api.webhooks.addRule` | `twitterapiio.api.api.webhooks.addRule` | `write` | Create a new tweet filter rule for the webhook stream (inactive by default — call updateRule to activate) |
| `api.webhooks.deleteRule` | `twitterapiio.api.api.webhooks.deleteRule` | `destructive` | Permanently delete a tweet filter rule |
| `api.webhooks.getRules` | `twitterapiio.api.api.webhooks.getRules` | `read` | List all existing tweet filter rules |
| `api.webhooks.updateRule` | `twitterapiio.api.api.webhooks.updateRule` | `write` | Update a tweet filter rule, including activating or deactivating it |
| `communities.create` | `twitterapiio.api.communities.create` | `write` | Create a new Twitter community |
| `communities.delete` | `twitterapiio.api.communities.delete` | `destructive` | Delete a Twitter community |
| `communities.getById` | `twitterapiio.api.communities.getById` | `read` | Get community info by ID |
| `communities.getMembers` | `twitterapiio.api.communities.getMembers` | `read` | Get members of a community |
| `communities.getModerators` | `twitterapiio.api.communities.getModerators` | `read` | Get moderators of a community |
| `communities.getTweets` | `twitterapiio.api.communities.getTweets` | `read` | Get tweets posted in a community |
| `communities.join` | `twitterapiio.api.communities.join` | `write` | Join a Twitter community |
| `communities.leave` | `twitterapiio.api.communities.leave` | `write` | Leave a Twitter community |
| `communities.searchTweets` | `twitterapiio.api.communities.searchTweets` | `read` | Search tweets across all communities |
| `lists.getFollowers` | `twitterapiio.api.lists.getFollowers` | `read` | Get followers of a Twitter list |
| `lists.getMembers` | `twitterapiio.api.lists.getMembers` | `read` | Get members of a Twitter list |
| `lists.getTweets` | `twitterapiio.api.lists.getTweets` | `read` | Get tweets from a Twitter list timeline |
| `replies.get` | `twitterapiio.api.replies.get` | `read` | Get replies to a tweet, paginated by time range — stored independently in the replies table so engagement changes are tracked per reply |
| `replies.getV2` | `twitterapiio.api.replies.getV2` | `read` | Get replies to a tweet (v2) with sort order control (Relevance, Latest, Likes) — stored independently in the replies table so engagement changes are tracked per reply |
| `stream.addUser` | `twitterapiio.api.stream.addUser` | `write` | Add a Twitter user to the real-time tweet monitor stream |
| `stream.listUsers` | `twitterapiio.api.stream.listUsers` | `read` | List all Twitter users currently in the monitor stream |
| `stream.removeUser` | `twitterapiio.api.stream.removeUser` | `write` | Remove a Twitter user from the real-time tweet monitor stream |
| `trends.get` | `twitterapiio.api.trends.get` | `read` | Get trending topics by location (woeid) |
| `tweets.advancedSearch` | `twitterapiio.api.tweets.advancedSearch` | `read` | Search tweets using structured operators (keywords, users, dates, engagement thresholds, media filters, etc.) |
| `tweets.create` | `twitterapiio.api.tweets.create` | `write` | Post a new tweet or reply |
| `tweets.delete` | `twitterapiio.api.tweets.delete` | `destructive` | Delete a tweet |
| `tweets.getByIds` | `twitterapiio.api.tweets.getByIds` | `read` | Fetch tweets by their IDs |
| `tweets.getQuotations` | `twitterapiio.api.tweets.getQuotations` | `read` | Get quote tweets for a tweet |
| `tweets.getRetweeters` | `twitterapiio.api.tweets.getRetweeters` | `read` | Get users who retweeted a tweet |
| `tweets.getThreadContext` | `twitterapiio.api.tweets.getThreadContext` | `read` | Get the full thread context for a tweet |
| `tweets.getUserLastTweets` | `twitterapiio.api.tweets.getUserLastTweets` | `read` | Retrieve a user's most recent tweets by username |
| `tweets.getUserMentions` | `twitterapiio.api.tweets.getUserMentions` | `read` | Get tweets that mention a user |
| `tweets.getUserTimeline` | `twitterapiio.api.tweets.getUserTimeline` | `read` | Retrieve a user's tweet timeline by user ID |
| `tweets.like` | `twitterapiio.api.tweets.like` | `write` | Like a tweet |
| `tweets.retweet` | `twitterapiio.api.tweets.retweet` | `write` | Retweet a tweet |
| `tweets.search` | `twitterapiio.api.tweets.search` | `read` | Search tweets with a raw query string |
| `tweets.unlike` | `twitterapiio.api.tweets.unlike` | `write` | Remove a like from a tweet |
| `users.batchGetByIds` | `twitterapiio.api.users.batchGetByIds` | `read` | Batch fetch user profiles by user IDs |
| `users.checkFollowRelationship` | `twitterapiio.api.users.checkFollowRelationship` | `read` | Check if two users follow each other |
| `users.follow` | `twitterapiio.api.users.follow` | `write` | Follow a user |
| `users.getByUsername` | `twitterapiio.api.users.getByUsername` | `read` | Get user profile by username |
| `users.getFollowers` | `twitterapiio.api.users.getFollowers` | `read` | Get a user's followers |
| `users.getFollowings` | `twitterapiio.api.users.getFollowings` | `read` | Get users that a user is following |
| `users.getMe` | `twitterapiio.api.users.getMe` | `read` | Get the authenticated account info |
| `users.getVerifiedFollowers` | `twitterapiio.api.users.getVerifiedFollowers` | `read` | Get a user's verified (blue-check) followers |
| `users.login` | `twitterapiio.api.users.login` | `write` | Authenticate a Twitter account via credentials and obtain a login cookie for v2 endpoints |
| `users.search` | `twitterapiio.api.users.search` | `read` | Search users by keyword |
| `users.unfollow` | `twitterapiio.api.users.unfollow` | `write` | Unfollow a user |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

Handles 2 webhook events. See the reference for payloads and `webhookHooks`.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/twitterapiio

## License

Apache-2.0
