# @corsair-dev/newrelic

New Relic plugin for Corsair: read applications and metrics, search entities, list alert issues, manage alert policies and NRQL alert conditions, record deployment markers, and run NRQL queries through NerdGraph.

## Install

```bash
pnpm add @corsair-dev/newrelic
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `accounts.list` | `newrelic.api.accounts.list` | `read` | List the accounts this key can reach, with the ids NRQL and issues take |
| `alerts.conditions` | `newrelic.api.alerts.conditions` | `read` | List the APM, browser and mobile conditions in one policy; external service, synthetic and NRQL conditions are separate endpoints and are not covered |
| `alerts.createNrqlCondition` | `newrelic.api.alerts.createNrqlCondition` | `write` | Add a static NRQL alert condition to a policy: the query, thresholds and how long they must hold |
| `alerts.createPolicy` | `newrelic.api.alerts.createPolicy` | `write` | Create an alert policy and choose whether incidents roll up per policy, per condition, or per condition and signal |
| `alerts.deleteNrqlCondition` | `newrelic.api.alerts.deleteNrqlCondition` | `destructive` | Delete a NRQL alert condition; New Relic has no restore call |
| `alerts.deletePolicy` | `newrelic.api.alerts.deletePolicy` | `destructive` | Delete an alert policy and the conditions attached to it; New Relic has no restore call |
| `alerts.nrqlConditions` | `newrelic.api.alerts.nrqlConditions` | `read` | List the static NRQL conditions in one policy, with their query, thresholds and signal settings |
| `alerts.policies` | `newrelic.api.alerts.policies` | `read` | List alert policies with their incident rollup preference |
| `alerts.updateNrqlCondition` | `newrelic.api.alerts.updateNrqlCondition` | `write` | Replace a NRQL condition, e.g. to enable it or move its threshold; send the whole condition, since a partial body is refused |
| `alerts.updatePolicy` | `newrelic.api.alerts.updatePolicy` | `write` | Rename an alert policy or change how its incidents roll up; both fields are sent, since New Relic replaces the policy |
| `applications.get` | `newrelic.api.applications.get` | `read` | Read one application by id with the same health, reporting and summary block |
| `applications.list` | `newrelic.api.applications.list` | `read` | List applications with their health colour, whether they are reporting, and the summary metrics the UI shows |
| `changeTracking.createDeployment` | `newrelic.api.changeTracking.createDeployment` | `write` | Record a deployment marker (version, commit, changelog) on an entity; markers cannot be deleted |
| `entities.get` | `newrelic.api.entities.get` | `read` | Read up to 25 entities by GUID with their type, reporting state, alert severity and tags |
| `entities.search` | `newrelic.api.entities.search` | `read` | Search monitored entities (services, hosts, browser apps, dashboards, monitors, alert conditions) with a filter such as type = 'APPLICATION' |
| `issues.list` | `newrelic.api.issues.list` | `read` | List alert issues for an account, filtered by state, priority, entity or time window |
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
