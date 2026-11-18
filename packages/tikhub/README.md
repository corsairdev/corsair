# @corsair-dev/tikhub

TikHub plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/tikhub
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `account.getInfo` | `tikhub.api.account.getInfo` | `read` | Get the TikHub account balance, free credit and API key status |
| `instagram.getPostByUrl` | `tikhub.api.instagram.getPostByUrl` | `read` | Get an Instagram post or reel with its media, likes and comments count from its URL |
| `instagram.getPostComments` | `tikhub.api.instagram.getPostComments` | `read` | List comments on an Instagram post, recent or popular first |
| `instagram.getUserByUsername` | `tikhub.api.instagram.getUserByUsername` | `read` | Get an Instagram profile (bio, follower and following counts, recent posts) by username |
| `instagram.getUserPosts` | `tikhub.api.instagram.getUserPosts` | `read` | List an Instagram user's posts by user ID |
| `instagram.getUserReels` | `tikhub.api.instagram.getUserReels` | `read` | List an Instagram user's reels by user ID |
| `reddit.search` | `tikhub.api.reddit.search` | `read` | Search Reddit posts, communities, comments, media or users, with sort and time filters |
| `tiktok.getHashtag` | `tikhub.api.tiktok.getHashtag` | `read` | Get a TikTok hashtag by name, including its ID and video and view counts |
| `tiktok.getHashtagVideos` | `tikhub.api.tiktok.getHashtagVideos` | `read` | List videos under a TikTok hashtag ID |
| `tiktok.getUserProfile` | `tikhub.api.tiktok.getUserProfile` | `read` | Get a TikTok profile and follower, like and video counts by username or secUid |
| `tiktok.getUserVideos` | `tikhub.api.tiktok.getUserVideos` | `read` | List a TikTok user's posted videos, newest or most popular first |
| `tiktok.getVideo` | `tikhub.api.tiktok.getVideo` | `read` | Get one TikTok video with its author, stats, music and media URLs |
| `tiktok.getVideoComments` | `tikhub.api.tiktok.getVideoComments` | `read` | List comments on a TikTok video |
| `tiktok.searchVideos` | `tikhub.api.tiktok.searchVideos` | `read` | Search TikTok videos by keyword, with sort, publish-date and region filters |
| `twitter.getTweet` | `tikhub.api.twitter.getTweet` | `read` | Get one X (Twitter) post by ID |
| `twitter.getUserProfile` | `tikhub.api.twitter.getUserProfile` | `read` | Get an X (Twitter) profile by handle or numeric user ID |
| `twitter.getUserTweets` | `tikhub.api.twitter.getUserTweets` | `read` | List an X (Twitter) user's posts |
| `twitter.searchTweets` | `tikhub.api.twitter.searchTweets` | `read` | Search X (Twitter) posts, people or lists (Top, Latest, Media, People, Lists) |
| `youtube.getChannelVideos` | `tikhub.api.youtube.getChannelVideos` | `read` | List a YouTube channel's videos, with channel details on the first page |
| `youtube.getVideo` | `tikhub.api.youtube.getVideo` | `read` | Get a YouTube video with its channel, duration, view, like and comment counts |
| `youtube.search` | `tikhub.api.youtube.search` | `read` | Search YouTube videos, Shorts, channels and playlists with date, type, duration and sort filters |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/tikhub

## License

Apache-2.0
