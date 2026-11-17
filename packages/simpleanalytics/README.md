# @corsair-dev/simpleanalytics

Web analytics from Simple Analytics: aggregated page views, visitors, pages, referrers and events through the Stats API, raw data points through the Export API, and website management through the Admin API.

## Install

```bash
pnpm add @corsair-dev/simpleanalytics
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `export.datapoints` | `simpleanalytics.api.export.datapoints` | `read` | Export raw page views and events for a date range as JSON datapoints, unsampled, with the fields you name |
| `stats.get` | `simpleanalytics.api.stats.get` | `read` | Read aggregated stats for one website: page views, visitors, top pages, countries, referrers, UTM values, browsers, operating systems, devices, time on page and event counts |
| `websites.add` | `simpleanalytics.api.websites.add` | `write` | Add a website to the default team, optionally public, with a timezone and a label; needs the owner, admin or developer role and the user id |
| `websites.list` | `simpleanalytics.api.websites.list` | `read` | List every website on the account with its timezone, visibility, whether the script is installed, and its 30-day page view and event estimates; needs the user id |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/simpleanalytics

## License

Apache-2.0
