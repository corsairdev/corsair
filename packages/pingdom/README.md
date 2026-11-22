# @corsair-dev/pingdom

Pingdom is a website uptime and performance monitoring service. This plugin manages uptime checks of every documented type, reads raw results, root cause analyses and summaries, runs one-off checks, schedules maintenance windows, and manages alerting teams and contacts.

## Install

```bash
pnpm add @corsair-dev/pingdom
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `alerting.contacts.create` | `pingdom.api.alerting.contacts.create` | `write` | Create an alerting contact with notification targets |
| `alerting.contacts.delete` | `pingdom.api.alerting.contacts.delete` | `destructive` | Delete an alerting contact |
| `alerting.contacts.get` | `pingdom.api.alerting.contacts.get` | `read` | Read one alerting contact |
| `alerting.contacts.list` | `pingdom.api.alerting.contacts.list` | `read` | List the alerting contacts |
| `alerting.contacts.update` | `pingdom.api.alerting.contacts.update` | `write` | Modify an alerting contact |
| `alerting.teams.create` | `pingdom.api.alerting.teams.create` | `write` | Create an alerting team |
| `alerting.teams.delete` | `pingdom.api.alerting.teams.delete` | `destructive` | Delete an alerting team |
| `alerting.teams.get` | `pingdom.api.alerting.teams.get` | `read` | Read one alerting team |
| `alerting.teams.list` | `pingdom.api.alerting.teams.list` | `read` | List the alerting teams |
| `alerting.teams.update` | `pingdom.api.alerting.teams.update` | `write` | Modify an alerting team |
| `analysis.get` | `pingdom.api.analysis.get` | `read` | Read one raw root cause analysis |
| `analysis.list` | `pingdom.api.analysis.list` | `read` | List the latest root cause analyses of a check |
| `checks.create` | `pingdom.api.checks.create` | `write` | Create an uptime check of any documented type |
| `checks.delete` | `pingdom.api.checks.delete` | `destructive` | Delete a check |
| `checks.deleteMulti` | `pingdom.api.checks.deleteMulti` | `destructive` | Delete several checks at once |
| `checks.get` | `pingdom.api.checks.get` | `read` | Read one check with its type settings |
| `checks.list` | `pingdom.api.checks.list` | `read` | List the checks with paging and tag filters |
| `checks.update` | `pingdom.api.checks.update` | `write` | Modify the settings of one check |
| `checks.updateMulti` | `pingdom.api.checks.updateMulti` | `write` | Pause or re-time multiple checks at once |
| `maintenance.create` | `pingdom.api.maintenance.create` | `write` | Create a maintenance window |
| `maintenance.delete` | `pingdom.api.maintenance.delete` | `destructive` | Delete a maintenance window |
| `maintenance.deleteMulti` | `pingdom.api.maintenance.deleteMulti` | `destructive` | Delete several maintenance windows at once |
| `maintenance.get` | `pingdom.api.maintenance.get` | `read` | Read one maintenance window |
| `maintenance.list` | `pingdom.api.maintenance.list` | `read` | List the maintenance windows |
| `maintenance.update` | `pingdom.api.maintenance.update` | `write` | Modify a maintenance window |
| `occurrences.delete` | `pingdom.api.occurrences.delete` | `destructive` | Delete a maintenance occurrence |
| `occurrences.get` | `pingdom.api.occurrences.get` | `read` | Read one maintenance occurrence |
| `occurrences.list` | `pingdom.api.occurrences.list` | `read` | List maintenance occurrences |
| `occurrences.update` | `pingdom.api.occurrences.update` | `write` | Move a maintenance occurrence |
| `results.list` | `pingdom.api.results.list` | `read` | List the raw test results of a check |
| `summaries.average` | `pingdom.api.summaries.average` | `read` | Read the average time and uptime summary of a check |
| `summaries.hoursOfDay` | `pingdom.api.summaries.hoursOfDay` | `read` | Read the per-hour response time summary |
| `summaries.outage` | `pingdom.api.summaries.outage` | `read` | Read the status change history of a check |
| `summaries.performance` | `pingdom.api.summaries.performance` | `read` | Read the per-interval performance summary |
| `summaries.probes` | `pingdom.api.summaries.probes` | `read` | Read the per-probe test counts of a check |
| `tools.getCredits` | `pingdom.api.tools.getCredits` | `read` | Read the account check slots and SMS credits |
| `tools.getReference` | `pingdom.api.tools.getReference` | `read` | Read region, timezone and format references |
| `tools.listActions` | `pingdom.api.tools.listActions` | `read` | List the alert actions across checks |
| `tools.listProbes` | `pingdom.api.tools.listProbes` | `read` | List the Pingdom probe servers |
| `tools.runSingle` | `pingdom.api.tools.runSingle` | `write` | Run a one-off check against a host |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/pingdom

## License

Apache-2.0
