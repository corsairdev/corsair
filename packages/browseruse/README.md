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
| `runs.get` | `browseruse.api.runs.get` | `read` | GET /runs/{id} — full run once status is terminal: result, tokens, cost |
| `runs.getStatus` | `browseruse.api.runs.getStatus` | `read` | GET /runs/{id}/status — cheap poll until completed, failed, or cancelled |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks. v4 runs are polled with `runs.getStatus`, then read once with `runs.get`.

## Not implemented

Sessions, profiles, workspaces, extensions, run events, and attachments are not wrapped. The hosted-agent loop and direct browser control are. A cancel that returns 503 is retried with `Retry-After` capped at 60 seconds. 429 uses the same cap, then jittered backoff when the header is missing. 401, 402, and 409 do not retry.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/browseruse

## License

Apache-2.0
