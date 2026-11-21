# @corsair-dev/statuscake

Uptime monitoring with StatusCake - manage uptime, heartbeat, SSL, pagespeed and maintenance-window monitoring, contact groups and alert history. Read-only alerts, history and periods come back with their pagination links.

## Install

```bash
pnpm add @corsair-dev/statuscake
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `contactGroups.create` | `statuscake.api.contactGroups.create` | `write` | Create a contact group to alert when a check fails |
| `contactGroups.delete` | `statuscake.api.contactGroups.delete` | `destructive` | Permanently delete a contact group; checks using it keep running but no longer alert it |
| `contactGroups.get` | `statuscake.api.contactGroups.get` | `read` | Get one contact group by ID |
| `contactGroups.list` | `statuscake.api.contactGroups.list` | `read` | List contact groups with their email addresses, mobile numbers and integrations, paged |
| `contactGroups.update` | `statuscake.api.contactGroups.update` | `write` | Change a contact group's name, addresses, numbers, integrations or ping URL; only the fields passed change |
| `heartbeat.create` | `statuscake.api.heartbeat.create` | `write` | Create a heartbeat check that alerts when a job stops pinging its URL |
| `heartbeat.delete` | `statuscake.api.heartbeat.delete` | `destructive` | Permanently delete a heartbeat check; this cannot be undone |
| `heartbeat.get` | `statuscake.api.heartbeat.get` | `read` | Get one heartbeat check with its last tested time and uptime |
| `heartbeat.list` | `statuscake.api.heartbeat.list` | `read` | List heartbeat (cron monitoring) checks with their status and uptime, filtered by state or tags and paged |
| `heartbeat.update` | `statuscake.api.heartbeat.update` | `write` | Change a heartbeat check's name, period, contact groups, host, paused state or tags; only the fields passed change |
| `locations.pagespeed` | `statuscake.api.locations.pagespeed` | `read` | List monitoring locations pagespeed checks can run from |
| `locations.uptime` | `statuscake.api.locations.uptime` | `read` | List monitoring locations uptime checks can run from, with their current status |
| `maintenanceWindows.create` | `statuscake.api.maintenanceWindows.create` | `write` | Create a maintenance window that silences chosen uptime checks, by ID or by tags, for a time period |
| `maintenanceWindows.delete` | `statuscake.api.maintenanceWindows.delete` | `destructive` | Permanently delete a maintenance window; alerts resume immediately |
| `maintenanceWindows.get` | `statuscake.api.maintenanceWindows.get` | `read` | Get one maintenance window by ID |
| `maintenanceWindows.list` | `statuscake.api.maintenanceWindows.list` | `read` | List maintenance windows with their state and schedule, paged |
| `maintenanceWindows.update` | `statuscake.api.maintenanceWindows.update` | `write` | Change a maintenance window's schedule, timezone, repeat interval, covered checks or tags; only the fields passed change |
| `pagespeed.create` | `statuscake.api.pagespeed.create` | `write` | Create a pagespeed check that runs from a chosen region and can alert on page size or load time |
| `pagespeed.delete` | `statuscake.api.pagespeed.delete` | `destructive` | Permanently delete a pagespeed check; this cannot be undone |
| `pagespeed.get` | `statuscake.api.pagespeed.get` | `read` | Get one pagespeed check with its latest stats |
| `pagespeed.history` | `statuscake.api.pagespeed.history` | `read` | Read recorded pagespeed results (loadtime, filesize, requests) newest first, in a time window with a next link for paging |
| `pagespeed.list` | `statuscake.api.pagespeed.list` | `read` | List pagespeed checks with their latest stats, paged |
| `pagespeed.update` | `statuscake.api.pagespeed.update` | `write` | Change a pagespeed check's target, rate, region, alert thresholds or paused state; only the fields passed change |
| `ssl.create` | `statuscake.api.ssl.create` | `write` | Create an SSL check that alerts before a certificate expires |
| `ssl.delete` | `statuscake.api.ssl.delete` | `destructive` | Permanently delete an SSL check; this cannot be undone |
| `ssl.get` | `statuscake.api.ssl.get` | `read` | Get one SSL check with certificate dates, issuer, scores and mixed content |
| `ssl.list` | `statuscake.api.ssl.list` | `read` | List SSL checks with certificate validity, scores and flags, paged |
| `ssl.update` | `statuscake.api.ssl.update` | `write` | Change an SSL check's target, rate, alerting or paused state; only the fields passed change |
| `uptime.alerts` | `statuscake.api.uptime.alerts` | `read` | Read the alerts a check sent, newest first, in a time window with a next link for paging |
| `uptime.create` | `statuscake.api.uptime.create` | `write` | Create an uptime check for a URL, domain or port, with content checks, basic auth, regions and alert settings |
| `uptime.delete` | `statuscake.api.uptime.delete` | `destructive` | Permanently delete an uptime check; this cannot be undone |
| `uptime.get` | `statuscake.api.uptime.get` | `read` | Get one uptime check with its full configuration and status |
| `uptime.history` | `statuscake.api.uptime.history` | `read` | Read recorded check results (loadtime, status code) newest first, in a time window with a next link for paging |
| `uptime.list` | `statuscake.api.uptime.list` | `read` | List uptime checks with type, status and uptime percentage, filtered by state or tags and paged |
| `uptime.periods` | `statuscake.api.uptime.periods` | `read` | Read the check up/down periods, newest first, in a time window with a next link for paging |
| `uptime.update` | `statuscake.api.uptime.update` | `write` | Change an uptime check's configuration; only the fields passed change. Sending a field empty clears it |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/statuscake

## License

Apache-2.0
