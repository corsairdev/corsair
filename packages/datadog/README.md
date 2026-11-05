# @corsair-dev/datadog

Datadog plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/datadog
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `apiKeys.list` | `datadog.api.apiKeys.list` | `read` | List API key metadata |
| `aws.list` | `datadog.api.aws.list` | `read` | List AWS integration accounts |
| `dashboards.create` | `datadog.api.dashboards.create` | `write` | Create a dashboard |
| `dashboards.delete` | `datadog.api.dashboards.delete` | `destructive` | Delete a dashboard [DESTRUCTIVE · IRREVERSIBLE] |
| `dashboards.get` | `datadog.api.dashboards.get` | `read` | Get a dashboard with its widgets |
| `dashboards.list` | `datadog.api.dashboards.list` | `read` | List dashboards |
| `dashboards.update` | `datadog.api.dashboards.update` | `write` | Update a dashboard |
| `downtimes.create` | `datadog.api.downtimes.create` | `write` | Schedule a downtime (suppresses monitor alerts) |
| `downtimes.list` | `datadog.api.downtimes.list` | `read` | List downtimes |
| `events.create` | `datadog.api.events.create` | `write` | Post an event |
| `events.list` | `datadog.api.events.list` | `read` | List events in a time window |
| `hosts.list` | `datadog.api.hosts.list` | `read` | List infrastructure hosts |
| `hosts.totals` | `datadog.api.hosts.totals` | `read` | Get host totals (active/up) |
| `incidents.list` | `datadog.api.incidents.list` | `read` | List incidents |
| `logs.aggregate` | `datadog.api.logs.aggregate` | `read` | Aggregate log analytics |
| `logs.listIndexes` | `datadog.api.logs.listIndexes` | `read` | List log indexes |
| `logs.search` | `datadog.api.logs.search` | `read` | Search logs |
| `metrics.listActive` | `datadog.api.metrics.listActive` | `read` | List actively reporting metrics |
| `metrics.query` | `datadog.api.metrics.query` | `read` | Query timeseries points |
| `metrics.submit` | `datadog.api.metrics.submit` | `write` | Submit metric series points |
| `monitors.create` | `datadog.api.monitors.create` | `write` | Create a monitor |
| `monitors.delete` | `datadog.api.monitors.delete` | `destructive` | Delete a monitor [DESTRUCTIVE · IRREVERSIBLE] |
| `monitors.get` | `datadog.api.monitors.get` | `read` | Get a monitor |
| `monitors.list` | `datadog.api.monitors.list` | `read` | List monitors |
| `monitors.mute` | `datadog.api.monitors.mute` | `write` | Mute a monitor (suppresses alerting) |
| `monitors.search` | `datadog.api.monitors.search` | `read` | Search monitors |
| `monitors.unmute` | `datadog.api.monitors.unmute` | `write` | Unmute a monitor |
| `monitors.update` | `datadog.api.monitors.update` | `write` | Update a monitor |
| `roles.list` | `datadog.api.roles.list` | `read` | List roles |
| `services.listDefinitions` | `datadog.api.services.listDefinitions` | `read` | List APM service definitions |
| `slos.create` | `datadog.api.slos.create` | `write` | Create an SLO |
| `slos.list` | `datadog.api.slos.list` | `read` | List SLOs |
| `spans.aggregate` | `datadog.api.spans.aggregate` | `read` | Aggregate APM span analytics |
| `spans.search` | `datadog.api.spans.search` | `read` | Search APM spans |
| `synthetics.createApiTest` | `datadog.api.synthetics.createApiTest` | `write` | Create a synthetic API test |
| `synthetics.getApiTest` | `datadog.api.synthetics.getApiTest` | `read` | Get a synthetic API test |
| `synthetics.listLocations` | `datadog.api.synthetics.listLocations` | `read` | List synthetic test locations |
| `synthetics.listTests` | `datadog.api.synthetics.listTests` | `read` | List synthetic tests |
| `tags.getHost` | `datadog.api.tags.getHost` | `read` | Get tags for a host |
| `tags.list` | `datadog.api.tags.list` | `read` | List host tags |
| `tags.updateHost` | `datadog.api.tags.updateHost` | `write` | Replace tags for a host |
| `usage.getSummary` | `datadog.api.usage.getSummary` | `read` | Get usage summary across products |
| `users.list` | `datadog.api.users.list` | `read` | List organization users |
| `webhooks.create` | `datadog.api.webhooks.create` | `write` | Create a webhook integration |
| `webhooks.get` | `datadog.api.webhooks.get` | `read` | Get a webhook integration by name |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/datadog

## License

Apache-2.0
