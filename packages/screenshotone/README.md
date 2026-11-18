# @corsair-dev/screenshotone

ScreenshotOne plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/screenshotone
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `devices.list` | `screenshotone.api.devices.list` | `read` | List device presets. User agent strings are not stored. |
| `shots.animate` | `screenshotone.api.shots.animate` | `write` | Record a page as a video or GIF (default or scroll scenario). Returns a link to the file. Spends a request from the plan. |
| `shots.bulk` | `screenshotone.api.shots.bulk` | `write` | Build up to 20 screenshot requests at once; with execute true they run now (one plan request each) and each url gets its status. |
| `shots.take` | `screenshotone.api.shots.take` | `write` | Screenshot a url, HTML or Markdown as an image or PDF, with viewport, device, full page, selector, blocking and caching options. Returns a link to the file. Spends a request from the plan. |
| `usage.get` | `screenshotone.api.usage.get` | `read` | Read the current plan usage and request bucket. |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/screenshotone

## License

Apache-2.0
