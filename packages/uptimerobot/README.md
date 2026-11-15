# @corsair-dev/uptimerobot

UptimeRobot plugin for Corsair - manage website and API monitors, read uptime and response-time statistics, triage incidents, and run public status pages, announcements, maintenance windows, groups and tags.

## Install

```bash
pnpm add @corsair-dev/uptimerobot
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `account.me` | `uptimerobot.api.account.me` | `read` | Read the account plan, monitor allowance and monitors in use; the cheapest way to check a key |
| `incidents.addComment` | `uptimerobot.api.incidents.addComment` | `write` | Add a comment to an incident, optionally publishing it to the status page at the same time |
| `incidents.comments` | `uptimerobot.api.incidents.comments` | `read` | List the comments on an incident, with who wrote each one |
| `incidents.get` | `uptimerobot.api.incidents.get` | `read` | Read one incident with its root cause: the failing URL, HTTP status and headers |
| `incidents.list` | `uptimerobot.api.incidents.list` | `read` | List incidents newest first, filtered by monitor, date range, type or root-cause group |
| `maintenanceWindows.create` | `uptimerobot.api.maintenanceWindows.create` | `write` | Create a maintenance window that suppresses alerts once, daily, weekly or monthly for a set duration |
| `maintenanceWindows.delete` | `uptimerobot.api.maintenanceWindows.delete` | `destructive` | Permanently delete a maintenance window, so its monitors start alerting again during that period |
| `maintenanceWindows.list` | `uptimerobot.api.maintenanceWindows.list` | `read` | List maintenance windows with their schedule and monitors |
| `maintenanceWindows.update` | `uptimerobot.api.maintenanceWindows.update` | `write` | Change a window its schedule, monitors or status; paused stops it suppressing alerts |
| `monitorGroups.create` | `uptimerobot.api.monitorGroups.create` | `write` | Create a monitor group, filling it with monitors by id or by moving another group whole |
| `monitorGroups.delete` | `uptimerobot.api.monitorGroups.delete` | `destructive` | Delete a monitor group; its monitors are kept and become ungrouped |
| `monitorGroups.list` | `uptimerobot.api.monitorGroups.list` | `read` | List monitor groups |
| `monitors.create` | `uptimerobot.api.monitors.create` | `write` | Create a monitor of any type; the body is checked against the type, so a PORT monitor needs a port and a HEARTBEAT one takes no URL |
| `monitors.delete` | `uptimerobot.api.monitors.delete` | `destructive` | Permanently delete a monitor and its check history; this cannot be undone |
| `monitors.get` | `uptimerobot.api.monitors.get` | `read` | Read one monitor with its current status, interval, tags and last incident |
| `monitors.list` | `uptimerobot.api.monitors.list` | `read` | List monitors, filtered by name, URL, status, tag, group or custom field, with cursor paging |
| `monitors.pause` | `uptimerobot.api.monitors.pause` | `write` | Pause a monitor so it stops checking and stops alerting until monitors.start is called |
| `monitors.reset` | `uptimerobot.api.monitors.reset` | `destructive` | Discard a monitor's accumulated statistics and incident history; the monitor itself keeps running |
| `monitors.start` | `uptimerobot.api.monitors.start` | `write` | Start a paused monitor, or resume one that was paused by UptimeRobot itself after repeated failures |
| `monitors.update` | `uptimerobot.api.monitors.update` | `write` | Change a monitor: its name, URL, interval, tags, group, custom fields or credentials; omitted fields keep their value |
| `stats.monitorUptime` | `uptimerobot.api.stats.monitorUptime` | `read` | Uptime percentage and downtime for one monitor over a range of up to 90 days |
| `stats.responseTime` | `uptimerobot.api.stats.responseTime` | `read` | Response-time minimum, maximum and average for one monitor, optionally with the full time series |
| `stats.uptime` | `uptimerobot.api.stats.uptime` | `read` | Aggregate uptime across every monitor for a timeframe, with incident totals, MTBF and a log of entries |
| `statusPages.announcements` | `uptimerobot.api.statusPages.announcements` | `read` | List a status page announcements, filtered by OFFLINE, PENDING, PUBLISHED or ARCHIVED |
| `statusPages.create` | `uptimerobot.api.statusPages.create` | `write` | Create a public status page showing chosen monitors or tags, optionally behind a password and on a custom domain |
| `statusPages.createAnnouncement` | `uptimerobot.api.statusPages.createAnnouncement` | `write` | Post an announcement to a status page: Info, Maintenance or Issue, as a draft, scheduled or published now |
| `statusPages.delete` | `uptimerobot.api.statusPages.delete` | `destructive` | Permanently delete a status page; the monitors it showed keep running |
| `statusPages.get` | `uptimerobot.api.statusPages.get` | `read` | Read one status page with its monitors, custom domain and settings |
| `statusPages.list` | `uptimerobot.api.statusPages.list` | `read` | List the public status pages in the account, with paging |
| `tags.delete` | `uptimerobot.api.tags.delete` | `destructive` | Delete a tag, also removing it from every monitor that carried it; the monitors stay |
| `tags.list` | `uptimerobot.api.tags.list` | `read` | List tags, paging by nextCursorId |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/uptimerobot

## License

Apache-2.0
