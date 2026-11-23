# @corsair-dev/mixpanel

Product analytics with Mixpanel - import server-side event batches, query profiles, cohorts, saved Insights reports, funnels and retention, and export raw events.

## Install

```bash
pnpm add @corsair-dev/mixpanel
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `cohorts.list` | `mixpanel.api.cohorts.list` | `read` | List every saved cohort with its id, member count, visibility and description |
| `events.import` | `mixpanel.api.events.import` | `write` | Import a batch of up to 2000 server-side events, validated per event when strict mode is on (the default) |
| `export.events` | `mixpanel.api.export.events` | `read` | Export raw events for a date range as parsed objects, with optional event-name filter, expression filter and limit |
| `funnels.list` | `mixpanel.api.funnels.list` | `read` | List the saved funnels with their ids and names |
| `insights.query` | `mixpanel.api.insights.query` | `read` | Read the data behind one saved Insights report by its bookmark id |
| `profiles.query` | `mixpanel.api.profiles.query` | `read` | Query user or group profiles with an expression, a cohort filter or exact distinct_ids, paged via session_id and next_page |
| `retention.query` | `mixpanel.api.retention.query` | `read` | Run a birth or compounded retention query for a date range, per day, week or month |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/mixpanel

## License

Apache-2.0
