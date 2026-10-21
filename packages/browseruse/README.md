# @corsair-dev/browseruse

Browser Use plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/browseruse
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `browsers.create` | `browseruse.api.browsers.create` | `write` | POST /browsers — start a cloud browser; returns cdpUrl for Playwright/Puppeteer and a liveUrl |
| `browsers.get` | `browseruse.api.browsers.get` | `read` | GET /browsers/{id} — browser status, URLs, cost, recording |
| `browsers.list` | `browseruse.api.browsers.list` | `read` | GET /browsers — paginated browsers, filter by active/stopped |
| `browsers.stop` | `browseruse.api.browsers.stop` | `write` | PATCH /browsers/{id} — stop a browser and refund unused time |
| `runs.cancel` | `browseruse.api.runs.cancel` | `write` | POST /runs/{id}/cancel — cancel an in-flight run |
| `runs.create` | `browseruse.api.runs.create` | `write` | POST /runs — start a browser agent run for a natural-language task |
| `runs.get` | `browseruse.api.runs.get` | `read` | GET /runs/{id} — run status, result, structured output, cost |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/browseruse

## License

Apache-2.0
