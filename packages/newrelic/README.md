# @corsair-dev/newrelic

New Relic plugin for Corsair: read applications with their health and reporting status, pull metric timeslices, manage alert policies and list their conditions, and run NRQL queries through NerdGraph.

## Install

```bash
pnpm add @corsair-dev/newrelic
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `alerts.conditions` | `newrelic.api.alerts.conditions` | `read` | List the APM, browser and mobile conditions in one policy; external service, synthetic and NRQL conditions are separate endpoints and are not covered |
| `alerts.createPolicy` | `newrelic.api.alerts.createPolicy` | `write` | Create an alert policy and choose whether incidents roll up per policy, per condition, or per condition and signal |
| `alerts.deletePolicy` | `newrelic.api.alerts.deletePolicy` | `destructive` | Delete an alert policy and the conditions attached to it; New Relic has no restore call |
| `alerts.policies` | `newrelic.api.alerts.policies` | `read` | List alert policies with their incident rollup preference |
| `applications.get` | `newrelic.api.applications.get` | `read` | Read one application by id with the same health, reporting and summary block |
| `applications.list` | `newrelic.api.applications.list` | `read` | List applications with their health colour, whether they are reporting, and the summary metrics the UI shows |
| `metrics.get` | `newrelic.api.metrics.get` | `read` | Read metric timeslices for an application over a time window, or one averaged value per metric with summarize |
| `query.nrql` | `newrelic.api.query.nrql` | `read` | Run a NRQL query against one account through NerdGraph and return its rows and the time window New Relic actually ran over |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/newrelic

## License

Apache-2.0
