# @corsair-dev/supadata

Supadata plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/supadata
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `account.me` | `supadata.api.account.me` | `read` | Retrieve organization details, plan information and credit usage |
| `transcript.get` | `supadata.api.transcript.get` | `read` | Retrieve a transcript for a video or file URL |
| `transcript.getJob` | `supadata.api.transcript.getJob` | `read` | Retrieve the status or result of an asynchronous transcript job |
| `web.map` | `supadata.api.web.map` | `read` | Discover every URL on a website |
| `web.scrape` | `supadata.api.web.scrape` | `read` | Extract web page content as Markdown |
| `youtube.channel` | `supadata.api.youtube.channel` | `read` | Retrieve metadata for a YouTube channel |
| `youtube.channelVideos` | `supadata.api.youtube.channelVideos` | `read` | List video, Shorts and live stream IDs for a YouTube channel |
| `youtube.playlist` | `supadata.api.youtube.playlist` | `read` | Retrieve metadata for a YouTube playlist |
| `youtube.playlistVideos` | `supadata.api.youtube.playlistVideos` | `read` | List video, Shorts and live stream IDs for a YouTube playlist |
| `youtube.search` | `supadata.api.youtube.search` | `read` | Search YouTube for videos, channels or playlists |
| `youtube.video` | `supadata.api.youtube.video` | `read` | Retrieve metadata for a YouTube video |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/supadata

## License

Apache-2.0
