# @corsair-dev/instagram

Instagram plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/instagram
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `carousel.post` | `instagram.api.carousel.post` | `write` | create a carousel container for publishing on instagram. |
| `comments.get` | `instagram.api.comments.get` | `read` | get details about a specific comment on an instagram media object. |
| `comments.list` | `instagram.api.comments.list` | `read` | list comments on an instagram media object. |
| `comments.remove` | `instagram.api.comments.remove` | `write` | delete a comment on an instagram media object. |
| `comments.reply` | `instagram.api.comments.reply` | `write` | reply to a comment on an instagram media object. |
| `comments.send` | `instagram.api.comments.send` | `write` | send a comment on an instagram media object. |
| `comments.update` | `instagram.api.comments.update` | `write` | update a comment on an instagram media object. |
| `conversations.get` | `instagram.api.conversations.get` | `read` | get messages in a conversation on instagram messaging. |
| `conversations.list` | `instagram.api.conversations.list` | `read` | list conversations on instagram messaging. |
| `image.post` | `instagram.api.image.post` | `write` | create an image container for publishing on instagram. |
| `image.story` | `instagram.api.image.story` | `write` | create an image story container for publishing on instagram. |
| `media.get` | `instagram.api.media.get` | `read` | get details about a specific media object. |
| `media.insights` | `instagram.api.media.insights` | `read` | get insights for a specific media object. |
| `media.list` | `instagram.api.media.list` | `read` | list media objects on the instagram account. |
| `media.status` | `instagram.api.media.status` | `read` | get the status of a media container. |
| `messages.get` | `instagram.api.messages.get` | `read` | get details about a specific message on instagram messaging. |
| `messages.send` | `instagram.api.messages.send` | `write` | send a message in instagram messaging. |
| `profile.get` | `instagram.api.profile.get` | `read` | read the user instagram profile. |
| `profile.insights` | `instagram.api.profile.insights` | `read` | get insights for the instagram business account. |
| `publish.publish_media` | `instagram.api.publish.publish_media` | `write` | publish media on instagram. |
| `reel.post` | `instagram.api.reel.post` | `write` | create a reel container for publishing on instagram. |
| `video.container` | `instagram.api.video.container` | `write` | create a video carousel container for publishing on instagram. |
| `video.story` | `instagram.api.video.story` | `write` | create a video story container for publishing on instagram. |

## Auth

Auth: OAuth 2.0. Corsair prompts your tenant for credentials on first use.

## Webhooks

Handles 3 webhook events. See the reference for payloads and `webhookHooks`.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/instagram

## License

Apache-2.0
