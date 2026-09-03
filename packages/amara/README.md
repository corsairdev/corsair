# @corsair-dev/amara

Amara (subtitling platform) plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/amara
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `activity.get` | `amara.api.activity.get` | `read` | Get a single activity item by id |
| `activity.list` | `amara.api.activity.list` | `read` | List platform activity with optional filters |
| `languages.listAvailable` | `amara.api.languages.listAvailable` | `read` | List all supported Amara language codes |
| `messages.send` | `amara.api.messages.send` | `write` | Send a message to a user or team |
| `teams.getDetails` | `amara.api.teams.getDetails` | `read` | Get team details by slug |
| `teams.getLanguages` | `amara.api.teams.getLanguages` | `read` | Get preferred/blacklisted language URIs for a team |
| `teams.list` | `amara.api.teams.list` | `read` | List teams |
| `users.getActivity` | `amara.api.users.getActivity` | `read` | List activity for a user |
| `users.getData` | `amara.api.users.getData` | `read` | Get a user profile by identifier (or "me") |
| `videos.addSubtitleNote` | `amara.api.videos.addSubtitleNote` | `write` | Add an editor note to a subtitle set |
| `videos.addUrl` | `amara.api.videos.addUrl` | `write` | Add a URL to a video |
| `videos.create` | `amara.api.videos.create` | `write` | Create a video from a public URL |
| `videos.createSubtitleLanguage` | `amara.api.videos.createSubtitleLanguage` | `write` | Create a subtitle language on a video |
| `videos.createSubtitles` | `amara.api.videos.createSubtitles` | `write` | Create or update subtitles for a language |
| `videos.deleteUrl` | `amara.api.videos.deleteUrl` | `write` | Delete a video URL |
| `videos.fetchSubtitlesData` | `amara.api.videos.fetchSubtitlesData` | `read` | Fetch subtitles for a video language |
| `videos.getSubtitleLanguageDetails` | `amara.api.videos.getSubtitleLanguageDetails` | `read` | Get details for a subtitle language |
| `videos.getUrl` | `amara.api.videos.getUrl` | `read` | Get a single video URL by id |
| `videos.getUrlDetails` | `amara.api.videos.getUrlDetails` | `read` | Look up a video by its public URL |
| `videos.list` | `amara.api.videos.list` | `read` | List videos with optional filters and pagination |
| `videos.listActivity` | `amara.api.videos.listActivity` | `read` | List activity for a video |
| `videos.listSubtitleActions` | `amara.api.videos.listSubtitleActions` | `read` | List available subtitle actions |
| `videos.listSubtitleLanguages` | `amara.api.videos.listSubtitleLanguages` | `read` | List subtitle languages for a video |
| `videos.listSubtitleNotes` | `amara.api.videos.listSubtitleNotes` | `read` | List editor notes on a subtitle set |
| `videos.listUrls` | `amara.api.videos.listUrls` | `read` | List URLs associated with a video |
| `videos.makeUrlPrimary` | `amara.api.videos.makeUrlPrimary` | `write` | Set a video URL as primary |
| `videos.performSubtitleAction` | `amara.api.videos.performSubtitleAction` | `write` | Perform a subtitle action (publish, save-draft, …) |
| `videos.update` | `amara.api.videos.update` | `write` | Update video metadata |
| `videos.updateSubtitleLanguage` | `amara.api.videos.updateSubtitleLanguage` | `write` | Update subtitle language settings |
| `videos.viewDetails` | `amara.api.videos.viewDetails` | `read` | Get details for a single video by id |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/amara

## License

Apache-2.0
