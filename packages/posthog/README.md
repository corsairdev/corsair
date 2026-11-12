# @corsair-dev/posthog

Posthog plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/posthog
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `actions.list` | `posthog.api.actions.list` | `read` | List actions |
| `annotations.create` | `posthog.api.annotations.create` | `write` | Create an annotation on charts |
| `annotations.list` | `posthog.api.annotations.list` | `read` | List annotations |
| `cohorts.list` | `posthog.api.cohorts.list` | `read` | List cohorts |
| `dashboards.get` | `posthog.api.dashboards.get` | `read` | Get a dashboard with its tiles |
| `dashboards.list` | `posthog.api.dashboards.list` | `read` | List dashboards |
| `errorTracking.issuesList` | `posthog.api.errorTracking.issuesList` | `read` | List error tracking issues with occurrence, user and session counts |
| `eventDefinitions.list` | `posthog.api.eventDefinitions.list` | `read` | List event names seen in the project |
| `events.aliasCreate` | `posthog.api.events.aliasCreate` | `write` | Create an alias linking two distinct user IDs |
| `events.eventCreate` | `posthog.api.events.eventCreate` | `write` | Ingest an analytics event |
| `events.identityCreate` | `posthog.api.events.identityCreate` | `write` | Associate properties with a user identity |
| `events.trackPage` | `posthog.api.events.trackPage` | `write` | Track a page view event |
| `events.trackScreen` | `posthog.api.events.trackScreen` | `write` | Track a screen view event |
| `experiments.get` | `posthog.api.experiments.get` | `read` | Get an experiment |
| `experiments.list` | `posthog.api.experiments.list` | `read` | List experiments |
| `featureFlags.get` | `posthog.api.featureFlags.get` | `read` | Get a feature flag with its release conditions |
| `featureFlags.list` | `posthog.api.featureFlags.list` | `read` | List feature flags |
| `featureFlags.update` | `posthog.api.featureFlags.update` | `write` | Update a feature flag (name, active, release conditions, tags) |
| `insights.get` | `posthog.api.insights.get` | `read` | Get a saved insight with its query and result |
| `insights.list` | `posthog.api.insights.list` | `read` | List saved insights |
| `persons.get` | `posthog.api.persons.get` | `read` | Get a person by id |
| `persons.list` | `posthog.api.persons.list` | `read` | List or search persons |
| `projects.get` | `posthog.api.projects.get` | `read` | Get the project settings (timezone, name, project token) |
| `propertyDefinitions.list` | `posthog.api.propertyDefinitions.list` | `read` | List event, person, group or session property names |
| `query.run` | `posthog.api.query.run` | `read` | Run a HogQL (SQL) query or any PostHog query kind (trends, funnels and others) |
| `sessionRecordings.get` | `posthog.api.sessionRecordings.get` | `read` | Get session recording metadata |
| `sessionRecordings.list` | `posthog.api.sessionRecordings.list` | `read` | List session recordings |
| `surveys.get` | `posthog.api.surveys.get` | `read` | Get a survey with its questions |
| `surveys.list` | `posthog.api.surveys.list` | `read` | List surveys |

## Auth

Auth: API key plus `project_id`. Corsair prompts your tenant for credentials on first use.

- A **personal API key** (`phx_...`) unlocks every action. Give it read scopes for the areas you use (query, insight, dashboard, person, feature_flag, session_recording, error_tracking, experiment, survey, cohort, action, annotation, event_definition, property_definition, project). Capture actions look up the project token with it.
- A **project token** (`phc_...`) works for the five `events.*` capture actions only.

US and EU cloud are detected on the first call; pass `host` for self-hosted PostHog. Setup steps: https://docs.corsair.dev/plugins/posthog/get-credentials

## Webhooks

Handles 1 webhook event. See the reference for payloads and `webhookHooks`.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/posthog

## License

Apache-2.0
