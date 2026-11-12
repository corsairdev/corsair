# @corsair-dev/cloudflarebrowserrendering

Cloudflare Browser Run Quick Actions and Browser Rendering DevTools REST operations for Corsair.

## Install

```bash
pnpm add @corsair-dev/cloudflarebrowserrendering
```

## Authentication

Use a [Cloudflare API token](https://developers.cloudflare.com/fundamentals/api/get-started/create-token/) with the permission required by each API family:

- Quick Actions REST operations use **Browser Run - Edit**, as specified by the [Quick Actions REST API docs](https://developers.cloudflare.com/browser-run/quick-actions/#before-you-begin).
- DevTools operations use the **Browser Rendering Read** and/or **Browser Rendering Write** permissions listed on their individual API reference pages. Browser session creation and live-view URL creation specify Write.

All operations use `Authorization: Bearer <token>` and require `accountId`. Operations for an existing browser session also require its UUID `sessionId`; target operations require a `targetId`. The API key can be passed as `key` or stored through Corsair's `api_key` credential flow.

```ts
import { cloudflarebrowserrendering } from '@corsair-dev/cloudflarebrowserrendering';

const browserRun = cloudflarebrowserrendering({ authType: 'api_key' });
```

Requests use a bounded 8-minute deadline by default to allow Browser Run's documented 5-minute action timeout plus navigation and wait time. Set `requestTimeoutMs` to a lower value to shorten calls; larger values are capped at 8 minutes.

## Operations

| Corsair operation | HTTP method and path | Official documentation |
| --- | --- | --- |
| `content.fetch` | `POST /accounts/{account_id}/browser-run/content` | [Content](https://developers.cloudflare.com/browser-run/quick-actions/content-endpoint/) |
| `markdown.convert` | `POST /accounts/{account_id}/browser-run/markdown` | [Markdown](https://developers.cloudflare.com/browser-run/quick-actions/markdown-endpoint/) |
| `snapshot.capture` | `POST /accounts/{account_id}/browser-run/snapshot` | [Snapshot](https://developers.cloudflare.com/browser-run/quick-actions/snapshot/) |
| `accessibilityTree.capture` | `POST /accounts/{account_id}/browser-run/accessibilityTree` | [Accessibility tree](https://developers.cloudflare.com/browser-run/quick-actions/accessibility-tree-endpoint/) |
| `scrape.extract` | `POST /accounts/{account_id}/browser-run/scrape` | [Scrape](https://developers.cloudflare.com/browser-run/quick-actions/scrape-endpoint/) |
| `json.extract` | `POST /accounts/{account_id}/browser-run/json` | [JSON extraction](https://developers.cloudflare.com/browser-run/quick-actions/json-endpoint/) |
| `links.list` | `POST /accounts/{account_id}/browser-run/links` | [Links](https://developers.cloudflare.com/browser-run/quick-actions/links-endpoint/) |
| `screenshot.capture` | `POST /accounts/{account_id}/browser-run/screenshot` | [Screenshot guide](https://developers.cloudflare.com/browser-run/quick-actions/screenshot-endpoint/) · [REST options](https://developers.cloudflare.com/api/resources/browser_rendering/subresources/screenshot/methods/create/) |
| `pdf.render` | `POST /accounts/{account_id}/browser-run/pdf` | [PDF guide](https://developers.cloudflare.com/browser-run/quick-actions/pdf-endpoint/) · [REST options](https://developers.cloudflare.com/api/resources/browser_rendering/subresources/pdf/methods/create/) |
| `crawl.start` | `POST /accounts/{account_id}/browser-run/crawl` | [Crawl](https://developers.cloudflare.com/browser-run/quick-actions/crawl-endpoint/) |
| `crawl.get` | `GET /accounts/{account_id}/browser-run/crawl/{job_id}` | [Crawl results and pagination](https://developers.cloudflare.com/browser-run/quick-actions/crawl-endpoint/#request-results-of-the-crawl-job) |
| `crawl.cancel` | `DELETE /accounts/{account_id}/browser-run/crawl/{job_id}` | [Cancel a crawl](https://developers.cloudflare.com/browser-run/quick-actions/crawl-endpoint/#cancel-a-crawl-job) |
| `sessions.list` | `GET /accounts/{account_id}/browser-rendering/devtools/session` | [List sessions](https://developers.cloudflare.com/api/resources/browser_rendering/subresources/devtools/subresources/session/methods/list/) |
| `sessions.get` | `GET /accounts/{account_id}/browser-rendering/devtools/session/{session_id}` | [Get session](https://developers.cloudflare.com/api/resources/browser_rendering/subresources/devtools/subresources/session/methods/get/) |
| `browser.create` | `POST /accounts/{account_id}/browser-rendering/devtools/browser` | [Create browser session](https://developers.cloudflare.com/api/resources/browser_rendering/subresources/devtools/subresources/browser/methods/create/) |
| `browser.close` | `DELETE /accounts/{account_id}/browser-rendering/devtools/browser/{session_id}` | [Close browser session](https://developers.cloudflare.com/api/resources/browser_rendering/subresources/devtools/subresources/browser/methods/delete/) |
| `browser.version` | `GET /accounts/{account_id}/browser-rendering/devtools/browser/{session_id}/json/version` | [Get browser version](https://developers.cloudflare.com/api/resources/browser_rendering/subresources/devtools/subresources/browser/methods/version/) |
| `browser.protocol` | `GET /accounts/{account_id}/browser-rendering/devtools/browser/{session_id}/json/protocol` | [Get CDP schema](https://developers.cloudflare.com/api/resources/browser_rendering/subresources/devtools/subresources/browser/methods/protocol/) |
| `browser.liveView.create` | `POST /accounts/{account_id}/browser-rendering/devtools/browser/{session_id}/live_view` | [Create live view](https://developers.cloudflare.com/api/resources/browser_rendering/subresources/devtools/subresources/browser/subresources/live_view/methods/create/) |
| `targets.create` | `PUT /accounts/{account_id}/browser-rendering/devtools/browser/{session_id}/json/new` | [Open a tab](https://developers.cloudflare.com/api/resources/browser_rendering/subresources/devtools/subresources/browser/subresources/targets/methods/create/) |
| `targets.list` | `GET /accounts/{account_id}/browser-rendering/devtools/browser/{session_id}/json/list` | [List targets](https://developers.cloudflare.com/api/resources/browser_rendering/subresources/devtools/subresources/browser/subresources/targets/methods/list/) |
| `targets.get` | `GET /accounts/{account_id}/browser-rendering/devtools/browser/{session_id}/json/list/{target_id}` | [Get a target](https://developers.cloudflare.com/api/resources/browser_rendering/subresources/devtools/subresources/browser/subresources/targets/methods/get/) |
| `targets.activate` | `GET /accounts/{account_id}/browser-rendering/devtools/browser/{session_id}/json/activate/{target_id}` | [Activate a target](https://developers.cloudflare.com/api/resources/browser_rendering/subresources/devtools/subresources/browser/subresources/targets/methods/activate/) |
| `targets.close` | `GET /accounts/{account_id}/browser-rendering/devtools/browser/{session_id}/json/close/{target_id}` | [Close a target](https://developers.cloudflare.com/api/resources/browser_rendering/subresources/devtools/subresources/browser/subresources/targets/methods/close/) |

Single-page Quick Actions accept exactly one of `url` or `html`. `scrape.extract` also requires CSS selector elements; `json.extract` requires `prompt` or `response_format`; `snapshot.capture` accepts at least two output formats. Screenshot and PDF accept the documented `browser: 'kitesurf'` and `cacheTTL` query options. Their results are represented as `{ contentType, byteLength, data }`, where `data` is base64, so binary output remains JSON-safe. Crawl result retrieval supports its cursor, limit, and status filters. Session listing supports `limit` and `offset`; browser target/session IDs follow the API reference formats.

## Scope notes

- The current Quick Actions guides use `/browser-run` paths. The generated Cloudflare API reference still documents DevTools under `/browser-rendering/devtools`; this plugin uses those exact API-reference paths for DevTools and the newer `/browser-run` paths for Quick Actions.
- Quick Actions guides also describe Workers Bindings, which are not REST operations and are not implemented here.
- DevTools responses may include `webSocketDebuggerUrl`; it is returned as response data. This package does not establish a WebSocket or implement Chrome DevTools Protocol command/event transport.
- Browser Run documents REST operations, not inbound webhook delivery. No webhook handlers are included.

## Reference

- [Cloudflare Browser Run](https://developers.cloudflare.com/browser-run/)
- [Browser Rendering API reference](https://developers.cloudflare.com/api/resources/browser_rendering/)

## License

Apache-2.0
