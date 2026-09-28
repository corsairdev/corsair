# @corsair-dev/browserless

Browserless plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/browserless
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `content.get` | `browserless.api.content.get` | `read` | POST /content — fully rendered HTML after JavaScript execution |
| `download.create` | `browserless.api.download.create` | `write` | POST /download — return files Chrome downloaded during Puppeteer code |
| `function.run` | `browserless.api.function.run` | `write` | POST /function — run custom Puppeteer code in one session |
| `pdf.create` | `browserless.api.pdf.create` | `read` | POST /pdf — Chrome print-engine PDF of a page |
| `scrape.create` | `browserless.api.scrape.create` | `read` | POST /scrape — structured JSON via CSS selectors |
| `screenshot.create` | `browserless.api.screenshot.create` | `read` | POST /screenshot — PNG, JPEG, or WebP of a page |
| `unblock.create` | `browserless.api.unblock.create` | `read` | POST /unblock — bypass bot detection and return content/cookies/screenshot |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/browserless

## License

Apache-2.0
