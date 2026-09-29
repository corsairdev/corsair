# @corsair-dev/giphy

GIPHY plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/giphy
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `gifs.search` | `giphy.api.gifs.search` | `read` | Search all GIPHY GIFs for a word or phrase |
| `gifs.trending` | `giphy.api.gifs.trending` | `read` | Fetch currently trending GIFs from GIPHY |
| `gifs.translate` | `giphy.api.gifs.translate` | `read` | Translate a word or phrase into a GIF using GIPHY translate endpoint |
| `gifs.random` | `giphy.api.gifs.random` | `read` | Fetch a random GIF from GIPHY optionally filtered by tag |
| `gifs.getById` | `giphy.api.gifs.getById` | `read` | Get details and renditions of a specific GIF by ID |
| `gifs.getByIds` | `giphy.api.gifs.getByIds` | `read` | Get details and renditions for multiple GIFs by their IDs |
| `gifs.upload` | `giphy.api.gifs.upload` | `write` | Upload an animated GIF or video to GIPHY from a file or a public URL |
| `stickers.search` | `giphy.api.stickers.search` | `read` | Search GIPHY animated stickers for a word or phrase |
| `stickers.trending` | `giphy.api.stickers.trending` | `read` | Fetch currently trending stickers from GIPHY |
| `stickers.translate` | `giphy.api.stickers.translate` | `read` | Translate a word or phrase into a sticker |
| `stickers.random` | `giphy.api.stickers.random` | `read` | Fetch a random sticker from GIPHY optionally filtered by tag |
| `emoji.get` | `giphy.api.emoji.get` | `read` | Fetch animated emojis from GIPHY |
| `emoji.variations` | `giphy.api.emoji.variations` | `read` | Get variations of a specific GIPHY emoji by ID |
| `categories.list` | `giphy.api.categories.list` | `read` | List all categories and subcategories on GIPHY |
| `categories.getById` | `giphy.api.categories.getById` | `read` | Get subcategories of a specific GIPHY category by ID |
| `categories.gifs` | `giphy.api.categories.gifs` | `read` | Fetch GIFs associated with a specific GIPHY category |
| `tags.autocomplete` | `giphy.api.tags.autocomplete` | `read` | Autocomplete a tag term on the GIPHY network |
| `tags.trending` | `giphy.api.tags.trending` | `read` | List the most popular trending search terms on GIPHY |
| `tags.related` | `giphy.api.tags.related` | `read` | List tag terms related to the given tag on GIPHY |
| `channels.search` | `giphy.api.channels.search` | `read` | Search GIPHY channels matching a query term |
| `randomId.get` | `giphy.api.randomId.get` | `read` | Generate a privacy-safe random ID to use as customer_id on other endpoints |
| `analytics.register` | `giphy.api.analytics.register` | `write` | Register a GIF view, click, or send via its analytics pingback URL |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/giphy

## License

Apache-2.0
