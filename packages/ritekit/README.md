# @corsair-dev/ritekit

RiteKit plugin for Corsair - hashtag stats and suggestions, emoji, quote images, link shortening, person and company insights, and article extraction.

## Install

```bash
pnpm add @corsair-dev/ritekit
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `companies.brandColors` | `ritekit.api.companies.brandColors` | `read` | Return a company's brand colors from its domain or name |
| `companies.logo` | `ritekit.api.companies.logo` | `read` | Return a company's logo from its domain, with square and original variants, brand colors and a stable URL |
| `companies.nameToDomain` | `ritekit.api.companies.nameToDomain` | `read` | Return the most probable domains for a company name, best first |
| `emojis.auto` | `ritekit.api.emojis.auto` | `read` | Return a block of text with emoji added |
| `emojis.suggestions` | `ritekit.api.emojis.suggestions` | `read` | Suggest emoji for a short block of text |
| `hashtags.auto` | `ritekit.api.hashtags.auto` | `read` | Return a post with hashtags added, either inside the sentence or appended |
| `hashtags.cleanInstagram` | `ritekit.api.hashtags.cleanInstagram` | `read` | Remove the hashtags Instagram has banned from a post and report which were dropped |
| `hashtags.forImage` | `ritekit.api.hashtags.forImage` | `read` | Suggest hashtags for an image, from its content and its engagement |
| `hashtags.forUrl` | `ritekit.api.hashtags.forUrl` | `read` | Suggest hashtags for the content of a URL |
| `hashtags.stats` | `ritekit.api.hashtags.stats` | `read` | Read real-time stats for up to 100 hashtags: tweets per hour, exposure, retweets and the share carrying images, links and mentions |
| `hashtags.suggestions` | `ritekit.api.hashtags.suggestions` | `read` | Suggest hashtags for a single word or a short block of text, ranked by semantic relevance and real-time popularity |
| `hashtags.trending` | `ritekit.api.hashtags.trending` | `read` | List hashtags currently trending, optionally only the ones worth using and only Latin-alphabet tags |
| `images.animate` | `ritekit.api.images.animate` | `read` | Turn a still image into an animated GIF and return its URL |
| `images.extractTopImage` | `ritekit.api.images.extractTopImage` | `read` | Return a page's lead image URL |
| `images.quote` | `ritekit.api.images.quote` | `read` | Render a quote as an image with chosen fonts, colors, gradient and an optional logo, returning its URL |
| `links.shorten` | `ritekit.api.links.shorten` | `write` | Create a rite.ly short link, optionally with a Link Ad attached, and report the plan balance |
| `person.disposable` | `ritekit.api.person.disposable` | `read` | Report whether an address belongs to a disposable email service |
| `person.emailTypo` | `ritekit.api.person.emailTypo` | `read` | Suggest likely corrections for an address whose domain looks mistyped |
| `person.freemail` | `ritekit.api.person.freemail` | `read` | Report whether an address is on a consumer email provider rather than a company domain |
| `person.nameFromEmail` | `ritekit.api.person.nameFromEmail` | `read` | Derive a person's given name and surname from their address |
| `texts.extractArticle` | `ritekit.api.texts.extractArticle` | `read` | Extract an article's title and body from a URL, dropping headers, footers and columns |
| `texts.linkPreview` | `ritekit.api.texts.linkPreview` | `read` | Return the title, description and image for a URL preview |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/ritekit

## License

Apache-2.0
