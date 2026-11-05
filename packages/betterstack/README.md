# @corsair-dev/betterstack

Better Stack plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/betterstack
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `catalog.relations` | `betterstack.api.catalog.relations` | `read` | List all catalog relations |
| `heartbeatGroups.create` | `betterstack.api.heartbeatGroups.create` | `write` | Create a new heartbeat group |
| `heartbeatGroups.get` | `betterstack.api.heartbeatGroups.get` | `read` | Get a single heartbeat group by ID |
| `heartbeatGroups.list` | `betterstack.api.heartbeatGroups.list` | `read` | List all heartbeat groups |
| `heartbeatGroups.remove` | `betterstack.api.heartbeatGroups.remove` | `destructive` | Permanently delete a heartbeat group by ID |
| `heartbeatGroups.update` | `betterstack.api.heartbeatGroups.update` | `write` | Updates an existing heartbeat group's properties |
| `heartbeats.availability` | `betterstack.api.heartbeats.availability` | `read` | Retrieve availability summary for a specific heartbeat |
| `heartbeats.create` | `betterstack.api.heartbeats.create` | `write` | Create a new heartbeat monitor for cron jobs and scheduled tasks |
| `heartbeats.get` | `betterstack.api.heartbeats.get` | `read` | Get a single heartbeat by ID |
| `heartbeats.list` | `betterstack.api.heartbeats.list` | `read` | List all heartbeats |
| `heartbeats.remove` | `betterstack.api.heartbeats.remove` | `destructive` | Permanently delete a heartbeat by ID |
| `heartbeats.update` | `betterstack.api.heartbeats.update` | `write` | Update an existing heartbeat configuration |
| `incidentComments.create` | `betterstack.api.incidentComments.create` | `write` | Create a new comment on an incident |
| `incidentComments.get` | `betterstack.api.incidentComments.get` | `read` | Get a single comment from an incident |
| `incidentComments.list` | `betterstack.api.incidentComments.list` | `read` | List all comments on an incident |
| `incidentComments.remove` | `betterstack.api.incidentComments.remove` | `destructive` | Delete an existing comment from an incident |
| `incidentComments.update` | `betterstack.api.incidentComments.update` | `write` | Update an existing comment on an incident |
| `incidents.acknowledge` | `betterstack.api.incidents.acknowledge` | `write` | Acknowledge an ongoing incident |
| `incidents.create` | `betterstack.api.incidents.create` | `write` | Create a new incident and alert the on-call person |
| `incidents.escalate` | `betterstack.api.incidents.escalate` | `write` | Escalate an ongoing incident to a user, team, schedule, policy, or organization |
| `incidents.get` | `betterstack.api.incidents.get` | `read` | Retrieve detailed information about a single incident by its ID |
| `incidents.list` | `betterstack.api.incidents.list` | `read` | List all incidents with optional filtering by monitor, heartbeat, date range, or resolution status |
| `incidents.remove` | `betterstack.api.incidents.remove` | `destructive` | Permanently delete an existing incident by ID |
| `incidents.resolve` | `betterstack.api.incidents.resolve` | `write` | Resolve an ongoing incident |
| `incidents.timeline` | `betterstack.api.incidents.timeline` | `read` | Retrieve all timeline events for an incident |
| `integrations.awsCloudWatch` | `betterstack.api.integrations.awsCloudWatch` | `read` | List all AWS CloudWatch integrations |
| `integrations.azure` | `betterstack.api.integrations.azure` | `read` | List all Azure integrations |
| `integrations.datadog` | `betterstack.api.integrations.datadog` | `read` | List all Datadog integrations |
| `integrations.elastic` | `betterstack.api.integrations.elastic` | `read` | List Elastic integrations |
| `integrations.email` | `betterstack.api.integrations.email` | `read` | List email integrations |
| `integrations.googleMonitoring` | `betterstack.api.integrations.googleMonitoring` | `read` | List all Google Monitoring integrations |
| `integrations.grafana` | `betterstack.api.integrations.grafana` | `read` | List all Grafana integrations |
| `integrations.jira` | `betterstack.api.integrations.jira` | `read` | List all Jira integrations |
| `integrations.newRelic` | `betterstack.api.integrations.newRelic` | `read` | List New Relic integrations |
| `integrations.pagerDuty` | `betterstack.api.integrations.pagerDuty` | `read` | List PagerDuty integrations |
| `integrations.prometheus` | `betterstack.api.integrations.prometheus` | `read` | List all Prometheus integrations |
| `integrations.slack` | `betterstack.api.integrations.slack` | `read` | List all Slack integrations |
| `integrations.splunkOnCall` | `betterstack.api.integrations.splunkOnCall` | `read` | List all Splunk On-Call integrations |
| `metadata.create` | `betterstack.api.metadata.create` | `write` | Create or update a metadata record for a resource |
| `metadata.list` | `betterstack.api.metadata.list` | `read` | List all existing metadata |
| `monitorGroups.create` | `betterstack.api.monitorGroups.create` | `write` | Create a new monitor group |
| `monitorGroups.get` | `betterstack.api.monitorGroups.get` | `read` | Get a single monitor group by ID |
| `monitorGroups.list` | `betterstack.api.monitorGroups.list` | `read` | List all monitor groups |
| `monitorGroups.monitors` | `betterstack.api.monitorGroups.monitors` | `read` | Get all monitors belonging to a monitor group |
| `monitorGroups.remove` | `betterstack.api.monitorGroups.remove` | `destructive` | Permanently delete a monitor group by ID from Better Stack Uptime |
| `monitorGroups.update` | `betterstack.api.monitorGroups.update` | `write` | Updates an existing monitor group's properties |
| `monitors.availability` | `betterstack.api.monitors.availability` | `read` | Return an availability summary for a specific monitor |
| `monitors.create` | `betterstack.api.monitors.create` | `write` | Create a new uptime monitor for a URL or service |
| `monitors.get` | `betterstack.api.monitors.get` | `read` | Get a single monitor |
| `monitors.list` | `betterstack.api.monitors.list` | `read` | List all monitors |
| `monitors.remove` | `betterstack.api.monitors.remove` | `destructive` | Permanently delete a monitor by ID from Better Stack Uptime |
| `monitors.responseTimes` | `betterstack.api.monitors.responseTimes` | `read` | Retrieves response time performance metrics for a specific uptime monitor |
| `monitors.update` | `betterstack.api.monitors.update` | `write` | Update an existing uptime monitor configuration |
| `onCalls.create` | `betterstack.api.onCalls.create` | `write` | Create a new on-call schedule |
| `onCalls.events` | `betterstack.api.onCalls.events` | `read` | List all events for a specific on-call schedule |
| `onCalls.get` | `betterstack.api.onCalls.get` | `read` | Get a single on-call schedule by ID |
| `onCalls.list` | `betterstack.api.onCalls.list` | `read` | List all on-call schedules |
| `onCalls.remove` | `betterstack.api.onCalls.remove` | `destructive` | Permanently delete an on-call schedule by ID |
| `onCalls.update` | `betterstack.api.onCalls.update` | `write` | Update an on-call schedule's name |
| `outgoingWebhooks.create` | `betterstack.api.outgoingWebhooks.create` | `write` | Create a new outgoing webhook integration |
| `outgoingWebhooks.get` | `betterstack.api.outgoingWebhooks.get` | `read` | Get a single outgoing webhook integration by ID |
| `outgoingWebhooks.list` | `betterstack.api.outgoingWebhooks.list` | `read` | List all outgoing webhook integrations |
| `outgoingWebhooks.remove` | `betterstack.api.outgoingWebhooks.remove` | `destructive` | Delete an outgoing webhook integration by ID |
| `outgoingWebhooks.update` | `betterstack.api.outgoingWebhooks.update` | `write` | Update an existing outgoing webhook integration |
| `policies.create` | `betterstack.api.policies.create` | `write` | Creates a new escalation policy for incident management |
| `policies.get` | `betterstack.api.policies.get` | `read` | Get a single escalation policy by its ID |
| `policies.list` | `betterstack.api.policies.list` | `read` | List all escalation policies |
| `policies.remove` | `betterstack.api.policies.remove` | `destructive` | Delete an escalation policy by ID |
| `policies.update` | `betterstack.api.policies.update` | `write` | Update an existing escalation policy |
| `policyGroups.create` | `betterstack.api.policyGroups.create` | `write` | Create a new escalation policy group |
| `policyGroups.get` | `betterstack.api.policyGroups.get` | `read` | Get a single escalation policy group |
| `policyGroups.list` | `betterstack.api.policyGroups.list` | `read` | List all escalation policy groups |
| `policyGroups.remove` | `betterstack.api.policyGroups.remove` | `destructive` | Delete an escalation policy group by ID |
| `policyGroups.update` | `betterstack.api.policyGroups.update` | `write` | Updates an existing escalation policy group's properties |
| `sourceGroups.create` | `betterstack.api.sourceGroups.create` | `write` | Create a new source group |
| `sourceGroups.remove` | `betterstack.api.sourceGroups.remove` | `destructive` | Permanently delete a source group by ID from Better Stack Telemetry (Logs) |
| `sourceGroups.update` | `betterstack.api.sourceGroups.update` | `write` | Update an existing source group in Better Stack Logs/Telemetry |
| `statusPageGroups.create` | `betterstack.api.statusPageGroups.create` | `write` | Create a new status page group |
| `statusPageGroups.get` | `betterstack.api.statusPageGroups.get` | `read` | Get a single status page group by ID |
| `statusPageGroups.list` | `betterstack.api.statusPageGroups.list` | `read` | List all status page groups |
| `statusPageGroups.remove` | `betterstack.api.statusPageGroups.remove` | `destructive` | Delete a status page group by ID |
| `statusPageGroups.statusPages` | `betterstack.api.statusPageGroups.statusPages` | `read` | List status pages within a specific status page group |
| `statusPageGroups.update` | `betterstack.api.statusPageGroups.update` | `write` | Update an existing status page group |
| `statusPageReports.create` | `betterstack.api.statusPageReports.create` | `write` | Create a new status page report (incident or maintenance) |
| `statusPageReports.get` | `betterstack.api.statusPageReports.get` | `read` | Get a single status page report by ID |
| `statusPageReports.list` | `betterstack.api.statusPageReports.list` | `read` | List all reports on a status page |
| `statusPageReports.remove` | `betterstack.api.statusPageReports.remove` | `destructive` | Permanently delete a status page report by ID from Better Stack Uptime |
| `statusPageReports.update` | `betterstack.api.statusPageReports.update` | `write` | Update an existing status page report |
| `statusPageResources.create` | `betterstack.api.statusPageResources.create` | `write` | Create a new status page resource |
| `statusPageResources.get` | `betterstack.api.statusPageResources.get` | `read` | Get a single status page resource by ID |
| `statusPageResources.list` | `betterstack.api.statusPageResources.list` | `read` | List all resources on a status page |
| `statusPageResources.remove` | `betterstack.api.statusPageResources.remove` | `destructive` | Delete an existing resource from a status page |
| `statusPageResources.update` | `betterstack.api.statusPageResources.update` | `write` | Update an existing status page resource |
| `statusPages.get` | `betterstack.api.statusPages.get` | `read` | Get a single status page by ID |
| `statusPages.list` | `betterstack.api.statusPages.list` | `read` | List all your status pages |
| `statusPages.update` | `betterstack.api.statusPages.update` | `write` | Update an existing status page configuration |
| `statusPageSections.create` | `betterstack.api.statusPageSections.create` | `write` | Create a new section on a status page |
| `statusPageSections.get` | `betterstack.api.statusPageSections.get` | `read` | Get a single status page section |
| `statusPageSections.list` | `betterstack.api.statusPageSections.list` | `read` | List all sections of a specific status page |
| `statusPageSections.remove` | `betterstack.api.statusPageSections.remove` | `destructive` | Permanently delete a status page section by ID |
| `statusPageSections.update` | `betterstack.api.statusPageSections.update` | `write` | Update an existing status page section |
| `statusUpdates.create` | `betterstack.api.statusUpdates.create` | `write` | Create a new status update for an existing status report |
| `statusUpdates.get` | `betterstack.api.statusUpdates.get` | `read` | Get a single status update by its ID |
| `statusUpdates.list` | `betterstack.api.statusUpdates.list` | `read` | List all status updates for a status page report |
| `statusUpdates.remove` | `betterstack.api.statusUpdates.remove` | `destructive` | Delete an existing status update from a status report |
| `statusUpdates.update` | `betterstack.api.statusUpdates.update` | `write` | Update an existing status update for a status report |
| `token.describe` | `betterstack.api.token.describe` | `read` | Retrieve the configured Uptime API token |
| `urgencies.create` | `betterstack.api.urgencies.create` | `write` | Create a new severity level (urgency) for incident management |
| `urgencies.get` | `betterstack.api.urgencies.get` | `read` | Get a single severity level (urgency) by ID |
| `urgencies.list` | `betterstack.api.urgencies.list` | `read` | List all severity levels (urgencies) |
| `urgencies.remove` | `betterstack.api.urgencies.remove` | `destructive` | Delete a severity (urgency) by ID |
| `urgencies.update` | `betterstack.api.urgencies.update` | `write` | Update an existing severity level (urgency) configuration |
| `urgencyGroups.create` | `betterstack.api.urgencyGroups.create` | `write` | Create a new urgency group (severity group) for incident categorization |
| `urgencyGroups.get` | `betterstack.api.urgencyGroups.get` | `read` | Get a single urgency group (severity group) by ID |
| `urgencyGroups.list` | `betterstack.api.urgencyGroups.list` | `read` | List all urgency groups (severity groups) |
| `urgencyGroups.remove` | `betterstack.api.urgencyGroups.remove` | `destructive` | Permanently delete an urgency group (severity group) by ID |
| `urgencyGroups.update` | `betterstack.api.urgencyGroups.update` | `write` | Update an existing urgency group (severity group) |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/betterstack

## License

Apache-2.0
