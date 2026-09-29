# @corsair-dev/youtube

Youtube plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/youtube
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `captions.list` | `youtube.api.captions.list` | `read` | List caption tracks for a video |
| `captions.load` | `youtube.api.captions.load` | `read` | Download a caption track |
| `captions.update` | `youtube.api.captions.update` | `write` | Update a caption track |
| `channels.getActivities` | `youtube.api.channels.getActivities` | `read` | Get a channel's activity feed |
| `channels.getIdByHandle` | `youtube.api.channels.getIdByHandle` | `read` | Get channel ID by handle |
| `channels.getStatistics` | `youtube.api.channels.getStatistics` | `read` | Get channel statistics and details |
| `channels.update` | `youtube.api.channels.update` | `write` | Update channel branding settings |
| `channelSections.create` | `youtube.api.channelSections.create` | `write` | Create a new channel section |
| `channelSections.delete` | `youtube.api.channelSections.delete` | `destructive` | Delete a channel section |
| `channelSections.list` | `youtube.api.channelSections.list` | `read` | List channel sections |
| `channelSections.update` | `youtube.api.channelSections.update` | `write` | Update a channel section |
| `comments.createReply` | `youtube.api.comments.createReply` | `write` | Post a reply to a comment |
| `comments.delete` | `youtube.api.comments.delete` | `destructive` | Delete a comment |
| `comments.list` | `youtube.api.comments.list` | `read` | List comments |
| `comments.markSpam` | `youtube.api.comments.markSpam` | `write` | Mark a comment as spam |
| `comments.post` | `youtube.api.comments.post` | `write` | Post a comment on a video |
| `comments.setModerationStatus` | `youtube.api.comments.setModerationStatus` | `write` | Set moderation status for a comment |
| `comments.threadsList` | `youtube.api.comments.threadsList` | `read` | List comment threads (deprecated) |
| `comments.threadsList2` | `youtube.api.comments.threadsList2` | `read` | List comment threads |
| `comments.update` | `youtube.api.comments.update` | `write` | Update a comment |
| `i18n.listLanguages` | `youtube.api.i18n.listLanguages` | `read` | List supported i18n languages |
| `i18n.listRegions` | `youtube.api.i18n.listRegions` | `read` | List supported i18n regions |
| `liveChat.listMessages` | `youtube.api.liveChat.listMessages` | `read` | List messages in a live chat |
| `liveChat.listSuperChatEvents` | `youtube.api.liveChat.listSuperChatEvents` | `read` | List Super Chat events |
| `playlistImages.list` | `youtube.api.playlistImages.list` | `read` | List playlist images |
| `playlistItems.add` | `youtube.api.playlistItems.add` | `write` | Add a video to a playlist |
| `playlistItems.delete` | `youtube.api.playlistItems.delete` | `destructive` | Remove an item from a playlist |
| `playlistItems.list` | `youtube.api.playlistItems.list` | `read` | List items in a playlist |
| `playlistItems.update` | `youtube.api.playlistItems.update` | `write` | Update a playlist item |
| `playlists.create` | `youtube.api.playlists.create` | `write` | Create a new playlist |
| `playlists.delete` | `youtube.api.playlists.delete` | `destructive` | Delete a playlist |
| `playlists.list` | `youtube.api.playlists.list` | `read` | List the authenticated user's playlists |
| `playlists.update` | `youtube.api.playlists.update` | `write` | Update an existing playlist |
| `search.youtube` | `youtube.api.search.youtube` | `read` | Search YouTube for videos, channels, and playlists |
| `subscriptions.list` | `youtube.api.subscriptions.list` | `read` | List the authenticated user's subscriptions |
| `subscriptions.subscribe` | `youtube.api.subscriptions.subscribe` | `write` | Subscribe to a YouTube channel |
| `subscriptions.unsubscribe` | `youtube.api.subscriptions.unsubscribe` | `destructive` | Unsubscribe from a YouTube channel |
| `videoActions.getRating` | `youtube.api.videoActions.getRating` | `read` | Get the authenticated user's rating for a video |
| `videoActions.listAbuseReasons` | `youtube.api.videoActions.listAbuseReasons` | `read` | List available video abuse report reasons |
| `videoActions.rate` | `youtube.api.videoActions.rate` | `write` | Rate a video (like, dislike, or remove rating) |
| `videoActions.reportAbuse` | `youtube.api.videoActions.reportAbuse` | `write` | Report a video for abuse |
| `videoActions.updateThumbnail` | `youtube.api.videoActions.updateThumbnail` | `write` | Update the thumbnail for a video |
| `videoCategories.list` | `youtube.api.videoCategories.list` | `read` | List video categories |
| `videos.delete` | `youtube.api.videos.delete` | `destructive` | Delete a video |
| `videos.get` | `youtube.api.videos.get` | `read` | Get details for a single video |
| `videos.getBatch` | `youtube.api.videos.getBatch` | `read` | Get details for multiple videos in one request |
| `videos.list` | `youtube.api.videos.list` | `read` | List videos for a channel |
| `videos.listMostPopular` | `youtube.api.videos.listMostPopular` | `read` | List most popular videos on YouTube |
| `videos.update` | `youtube.api.videos.update` | `write` | Update video metadata |
| `videos.upload` | `youtube.api.videos.upload` | `write` | Upload a new video |
| `videos.uploadMultipart` | `youtube.api.videos.uploadMultipart` | `write` | Upload a new video using multipart upload |

## Auth

Auth: OAuth 2.0. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/youtube

## License

Apache-2.0
