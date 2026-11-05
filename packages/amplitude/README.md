# @corsair-dev/amplitude

Amplitude plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/amplitude
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `annotations.create` | `amplitude.api.annotations.create` | `write` | Create a new chart annotation on a specific date |
| `annotations.list` | `amplitude.api.annotations.list` | `read` | List all chart annotations for the project |
| `charts.get` | `amplitude.api.charts.get` | `read` | Get the data results for a specific chart by ID |
| `cohorts.create` | `amplitude.api.cohorts.create` | `write` | Create a new static cohort from a list of user or device IDs |
| `cohorts.get` | `amplitude.api.cohorts.get` | `read` | Get details for a specific cohort by ID |
| `cohorts.getMembers` | `amplitude.api.cohorts.getMembers` | `read` | Retrieve the member download for a cohort export request |
| `cohorts.list` | `amplitude.api.cohorts.list` | `read` | List all cohorts in the project |
| `dashboards.get` | `amplitude.api.dashboards.get` | `read` | Get details and chart list for a specific dashboard |
| `dashboards.list` | `amplitude.api.dashboards.list` | `read` | List all dashboards in the project |
| `events.getList` | `amplitude.api.events.getList` | `read` | List all event types tracked in the project |
| `events.identifyUser` | `amplitude.api.events.identifyUser` | `write` | Set or update user properties via the Identify API |
| `events.upload` | `amplitude.api.events.upload` | `write` | Upload one or more events to Amplitude via HTTP API v2 |
| `events.uploadBatch` | `amplitude.api.events.uploadBatch` | `write` | Batch upload events to Amplitude |
| `exports.getData` | `amplitude.api.exports.getData` | `read` | Export raw event data for a given time range as a zip archive |
| `users.getActivity` | `amplitude.api.users.getActivity` | `read` | Get recent event activity for a specific user |
| `users.getProfile` | `amplitude.api.users.getProfile` | `read` | Get the profile and properties for a specific user |
| `users.search` | `amplitude.api.users.search` | `read` | Search for users by user ID or device ID |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

Handles 7 webhook events. See the reference for payloads and `webhookHooks`.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/amplitude

## License

Apache-2.0
