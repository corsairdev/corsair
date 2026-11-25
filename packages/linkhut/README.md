# @corsair-dev/linkhut

Save, find and organise bookmarks and tags on linkhut, an open source social bookmarking service.

## Install

```bash
pnpm add @corsair-dev/linkhut
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `posts.add` | `linkhut.api.posts.add` | `write` | Save a bookmark. A bookmark that already exists for the url is replaced, unless `replace` is 'no' |
| `posts.all` | `linkhut.api.posts.all` | `read` | List bookmarks by offset, up to 1000 per page. Follow `nextStart` until it is null |
| `posts.dates` | `linkhut.api.posts.dates` | `read` | Count the bookmarks saved on each day |
| `posts.delete` | `linkhut.api.posts.delete` | `destructive` | Delete the bookmark for a url. This cannot be undone |
| `posts.get` | `linkhut.api.posts.get` | `read` | Get the bookmarks of one day, the ones with a tag on that day, or the one bookmark for a url or a hash |
| `posts.lastUpdated` | `linkhut.api.posts.lastUpdated` | `read` | Get the time of the last bookmark change, to tell whether posts.all needs to be read again |
| `posts.recent` | `linkhut.api.posts.recent` | `read` | List the most recent bookmarks, up to 100, optionally with one tag. There is no offset |
| `posts.suggest` | `linkhut.api.posts.suggest` | `read` | Get popular and recommended tags for a url |
| `tags.delete` | `linkhut.api.tags.delete` | `destructive` | Delete a tag from every bookmark. The bookmarks stay, and the tag cannot be restored |
| `tags.get` | `linkhut.api.tags.get` | `read` | List every tag with the number of bookmarks that carry it |
| `tags.rename` | `linkhut.api.tags.rename` | `write` | Rename a tag on every bookmark that carries it |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/linkhut

## License

Apache-2.0
