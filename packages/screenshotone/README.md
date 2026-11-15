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
| `shots.animate` | `screenshotone.api.shots.animate` | `write` | Take an animated screenshot. This spends a request from the plan. |
| `shots.bulk` | `screenshotone.api.shots.bulk` | `write` | Build bulk screenshot URLs. execute true spends requests immediately. |
| `shots.take` | `screenshotone.api.shots.take` | `write` | Take a screenshot. This spends a request from the plan. |
| `usage.get` | `screenshotone.api.usage.get` | `read` | Read the current plan usage and request bucket. |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/screenshotone

## License

Apache-2.0
