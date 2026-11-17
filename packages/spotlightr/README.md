# @corsair-dev/spotlightr

Spotlightr plugin for Corsair: manage videos, projects, embed domains, course students and access records, and read view analytics.

## Install

```bash
pnpm add @corsair-dev/spotlightr
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `access.get` | `spotlightr.api.access.get` | `read` | Read a student access record for one course |
| `access.update` | `spotlightr.api.access.update` | `write` | Expire a student access record |
| `access.updateCode` | `spotlightr.api.access.updateCode` | `write` | Expire a gallery access code |
| `assets.upload` | `spotlightr.api.assets.upload` | `write` | Upload an asset file to the account library |
| `domains.add` | `spotlightr.api.domains.add` | `write` | Allow one more domain to embed your videos |
| `domains.list` | `spotlightr.api.domains.list` | `read` | List the domains a video may be embedded on |
| `projects.create` | `spotlightr.api.projects.create` | `write` | Create a project to file videos under |
| `projects.list` | `spotlightr.api.projects.list` | `read` | List the projects (video groups) on the account |
| `search.search` | `spotlightr.api.search.search` | `read` | Search videos, projects and other objects on the account |
| `students.create` | `spotlightr.api.students.create` | `write` | Create a course or gallery student with an access record |
| `videos.create` | `spotlightr.api.videos.create` | `write` | Create a video from a hosted link or an uploaded file, optionally copying player settings from another video |
| `videos.delete` | `spotlightr.api.videos.delete` | `destructive` | Delete one or more videos; there is no restore route |
| `videos.list` | `spotlightr.api.videos.list` | `read` | List videos, or one video by ID, optionally narrowed to a project |
| `videos.listTop` | `spotlightr.api.videos.listTop` | `read` | List the most-watched videos over a window of days |
| `videos.metrics` | `spotlightr.api.videos.metrics` | `read` | Read a video load, play, watch and share counts |
| `videos.updateSettings` | `spotlightr.api.videos.updateSettings` | `write` | Change individual player settings on a video |
| `videos.updateSource` | `spotlightr.api.videos.updateSource` | `write` | Point an existing video at a new source URL |
| `videos.views` | `spotlightr.api.videos.views` | `read` | List a video views, optionally for one known viewer or only those past one percent watched |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/spotlightr

## License

Apache-2.0
