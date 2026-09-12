# @corsair-dev/reddit

Reddit plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/reddit
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `feeds.getAll` | `reddit.api.feeds.getAll` | `read` | Get posts from /r/all feed |
| `feeds.getPopular` | `reddit.api.feeds.getPopular` | `read` | Get posts from /r/popular feed |
| `listings.subredditsNew` | `reddit.api.listings.subredditsNew` | `read` | Get new subreddit listings |
| `listings.subredditsPopular` | `reddit.api.listings.subredditsPopular` | `read` | Get popular subreddit listings |
| `posts.getById` | `reddit.api.posts.getById` | `read` | Get posts by fullname IDs |
| `posts.getComments` | `reddit.api.posts.getComments` | `read` | Get a post and its comments |
| `search.global` | `reddit.api.search.global` | `read` | Search all of Reddit |
| `search.subreddit` | `reddit.api.search.subreddit` | `read` | Search within a subreddit |
| `search.subreddits` | `reddit.api.search.subreddits` | `read` | Search for subreddits by name |
| `subreddits.getAbout` | `reddit.api.subreddits.getAbout` | `read` | Get subreddit metadata and info |
| `subreddits.getControversial` | `reddit.api.subreddits.getControversial` | `read` | Get controversial posts from a subreddit |
| `subreddits.getHot` | `reddit.api.subreddits.getHot` | `read` | Get hot posts from a subreddit |
| `subreddits.getNew` | `reddit.api.subreddits.getNew` | `read` | Get new posts from a subreddit |
| `subreddits.getRising` | `reddit.api.subreddits.getRising` | `read` | Get rising posts from a subreddit |
| `subreddits.getTop` | `reddit.api.subreddits.getTop` | `read` | Get top posts from a subreddit with time filter |
| `users.getAbout` | `reddit.api.users.getAbout` | `read` | Get user profile information |
| `users.getComments` | `reddit.api.users.getComments` | `read` | Get a user's comments |
| `users.getOverview` | `reddit.api.users.getOverview` | `read` | Get a user's mixed posts and comments |
| `users.getSubmitted` | `reddit.api.users.getSubmitted` | `read` | Get a user's submitted posts |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/reddit

## License

Apache-2.0
