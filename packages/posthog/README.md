# @corsair-dev/posthog

Posthog plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/posthog
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `actions.create` | `posthog.api.actions.create` | `write` | Create an action from event, URL or element steps |
| `actions.get` | `posthog.api.actions.get` | `read` | Get an action with its steps |
| `actions.list` | `posthog.api.actions.list` | `read` | List actions |
| `alerts.get` | `posthog.api.alerts.get` | `read` | Get an insight alert |
| `alerts.list` | `posthog.api.alerts.list` | `read` | List insight alerts |
| `annotations.create` | `posthog.api.annotations.create` | `write` | Create an annotation on charts |
| `annotations.delete` | `posthog.api.annotations.delete` | `destructive` | Delete an annotation |
| `annotations.list` | `posthog.api.annotations.list` | `read` | List annotations |
| `annotations.update` | `posthog.api.annotations.update` | `write` | Update an annotation |
| `batchExports.list` | `posthog.api.batchExports.list` | `read` | List batch exports |
| `cohorts.create` | `posthog.api.cohorts.create` | `write` | Create a cohort |
| `cohorts.get` | `posthog.api.cohorts.get` | `read` | Get a cohort with its matching rules |
| `cohorts.list` | `posthog.api.cohorts.list` | `read` | List cohorts |
| `cohorts.update` | `posthog.api.cohorts.update` | `write` | Update a cohort (name, description, rules) |
| `dashboards.create` | `posthog.api.dashboards.create` | `write` | Create a dashboard |
| `dashboards.delete` | `posthog.api.dashboards.delete` | `destructive` | Delete a dashboard (PostHog keeps it restorable) |
| `dashboards.get` | `posthog.api.dashboards.get` | `read` | Get a dashboard with its tiles |
| `dashboards.list` | `posthog.api.dashboards.list` | `read` | List dashboards |
| `dashboards.update` | `posthog.api.dashboards.update` | `write` | Update a dashboard (name, description, pinned, tags) |
| `earlyAccessFeatures.list` | `posthog.api.earlyAccessFeatures.list` | `read` | List early access features |
| `errorTracking.issuesList` | `posthog.api.errorTracking.issuesList` | `read` | List error tracking issues with occurrence, user and session counts |
| `eventDefinitions.list` | `posthog.api.eventDefinitions.list` | `read` | List event names seen in the project |
| `events.aliasCreate` | `posthog.api.events.aliasCreate` | `write` | Create an alias linking two distinct user IDs |
| `events.eventCreate` | `posthog.api.events.eventCreate` | `write` | Ingest an analytics event |
| `events.identityCreate` | `posthog.api.events.identityCreate` | `write` | Associate properties with a user identity |
| `events.list` | `posthog.api.events.list` | `read` | List recent events with chosen columns and filters |
| `events.trackPage` | `posthog.api.events.trackPage` | `write` | Track a page view event |
| `events.trackScreen` | `posthog.api.events.trackScreen` | `write` | Track a screen view event |
| `experiments.create` | `posthog.api.experiments.create` | `write` | Create a draft experiment and its feature flag |
| `experiments.get` | `posthog.api.experiments.get` | `read` | Get an experiment |
| `experiments.list` | `posthog.api.experiments.list` | `read` | List experiments |
| `experiments.update` | `posthog.api.experiments.update` | `write` | Update an experiment (name, description, variants, metrics, archived) |
| `featureFlags.create` | `posthog.api.featureFlags.create` | `write` | Create a feature flag |
| `featureFlags.delete` | `posthog.api.featureFlags.delete` | `destructive` | Delete a feature flag (PostHog keeps it restorable) |
| `featureFlags.get` | `posthog.api.featureFlags.get` | `read` | Get a feature flag with its release conditions |
| `featureFlags.list` | `posthog.api.featureFlags.list` | `read` | List feature flags |
| `featureFlags.update` | `posthog.api.featureFlags.update` | `write` | Update a feature flag (name, active, release conditions, tags) |
| `hogFunctions.get` | `posthog.api.hogFunctions.get` | `read` | Get a Hog function with its code, inputs and filters |
| `hogFunctions.list` | `posthog.api.hogFunctions.list` | `read` | List destinations, transformations and other Hog functions |
| `insights.create` | `posthog.api.insights.create` | `write` | Save a new insight from a query |
| `insights.delete` | `posthog.api.insights.delete` | `destructive` | Delete an insight (PostHog keeps it restorable) |
| `insights.get` | `posthog.api.insights.get` | `read` | Get a saved insight with its query and result |
| `insights.list` | `posthog.api.insights.list` | `read` | List saved insights |
| `insights.update` | `posthog.api.insights.update` | `write` | Update an insight (name, query, description, dashboards, tags) |
| `llmAnalytics.costs` | `posthog.api.llmAnalytics.costs` | `read` | Get LLM generation counts and cost per model |
| `llmAnalytics.traces` | `posthog.api.llmAnalytics.traces` | `read` | List LLM traces with latency, tokens and cost |
| `logs.query` | `posthog.api.logs.query` | `read` | Search logs by service, severity, text or attributes |
| `notebooks.create` | `posthog.api.notebooks.create` | `write` | Create a notebook from a title and text |
| `notebooks.get` | `posthog.api.notebooks.get` | `read` | Get a notebook with its content |
| `notebooks.list` | `posthog.api.notebooks.list` | `read` | List notebooks |
| `organizations.get` | `posthog.api.organizations.get` | `read` | Get an organization (defaults to the current one) |
| `organizations.list` | `posthog.api.organizations.list` | `read` | List the organizations the key can access |
| `persons.deleteProperty` | `posthog.api.persons.deleteProperty` | `destructive` | Remove one property from a person |
| `persons.get` | `posthog.api.persons.get` | `read` | Get a person by id |
| `persons.list` | `posthog.api.persons.list` | `read` | List or search persons |
| `persons.updateProperty` | `posthog.api.persons.updateProperty` | `write` | Set one property on a person |
| `projects.get` | `posthog.api.projects.get` | `read` | Get the project settings (timezone, name, project token) |
| `projects.list` | `posthog.api.projects.list` | `read` | List the projects of an organization |
| `propertyDefinitions.list` | `posthog.api.propertyDefinitions.list` | `read` | List event, person, group or session property names |
| `query.run` | `posthog.api.query.run` | `read` | Run a HogQL (SQL) query or any PostHog query kind (trends, funnels and others) |
| `sessionRecordingPlaylists.list` | `posthog.api.sessionRecordingPlaylists.list` | `read` | List saved recording playlists and collections |
| `sessionRecordings.get` | `posthog.api.sessionRecordings.get` | `read` | Get session recording metadata |
| `sessionRecordings.list` | `posthog.api.sessionRecordings.list` | `read` | List session recordings |
| `surveys.create` | `posthog.api.surveys.create` | `write` | Create a draft survey |
| `surveys.delete` | `posthog.api.surveys.delete` | `destructive` | Delete a survey and its settings |
| `surveys.get` | `posthog.api.surveys.get` | `read` | Get a survey with its questions |
| `surveys.list` | `posthog.api.surveys.list` | `read` | List surveys |
| `surveys.update` | `posthog.api.surveys.update` | `write` | Update a survey (name, description, questions, archived) |
| `warehouseTables.list` | `posthog.api.warehouseTables.list` | `read` | List data warehouse tables |
| `webAnalytics.overview` | `posthog.api.webAnalytics.overview` | `read` | Get web analytics totals (visitors, views, sessions, bounce rate, duration) |
| `webAnalytics.stats` | `posthog.api.webAnalytics.stats` | `read` | Get web analytics by page, source, UTM, device, browser or country |

## Auth

Auth: API key plus `project_id`. Corsair prompts your tenant for credentials on first use.

- A **personal API key** (`phx_...`) unlocks every action. Give it read scopes for the areas you use and write scopes only where the agent may change things. Capture looks up the project token with it (needs `project:read`).
- A key scoped to **all projects** works across them: every private-API action (not capture) takes an optional `project_id` that overrides the connected one, and `organizations.list` / `projects.list` show what the key reaches.
- A **project token** (`phc_...`) works for the five capture actions only (`events.eventCreate`, `aliasCreate`, `identityCreate`, `trackPage`, `trackScreen`).

With a personal key, US and EU cloud are detected on the first call; a project token uses the US host unless `host` is set. Pass `host` for self-hosted PostHog. Setup steps: https://docs.corsair.dev/plugins/posthog/get-credentials

## Webhooks

Handles 1 webhook event. See the reference for payloads and `webhookHooks`.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/posthog

## License

Apache-2.0
