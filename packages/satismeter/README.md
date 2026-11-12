# @corsair-dev/satismeter

SatisMeter plugin for Corsair: read projects, surveys, responses and survey statistics, and manage users and events through the SatisMeter REST API.

## Install

```bash
pnpm add @corsair-dev/satismeter
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `projects.get` | `satismeter.api.projects.get` | `read` | Read one project by ID |
| `responses.list` | `satismeter.api.responses.list` | `read` | List responses from every survey in a project, paged by cursor |
| `responses.listForSurvey` | `satismeter.api.responses.listForSurvey` | `read` | List one survey’s responses, paged by cursor |
| `surveys.get` | `satismeter.api.surveys.get` | `read` | Read one survey by ID |
| `surveys.list` | `satismeter.api.surveys.list` | `read` | List the surveys in a project with their template and state |
| `surveys.statistics` | `satismeter.api.surveys.statistics` | `read` | Read response counts, display counts and the metric per question for one survey |
| `users.list` | `satismeter.api.users.list` | `read` | List the users in a project, or look one up by userId |
| `users.remove` | `satismeter.api.users.remove` | `destructive` | Delete a user’s personal data by internal id; their responses are anonymised, not deleted |
| `users.track` | `satismeter.api.users.track` | `write` | Record a user event that survey targeting can match on; each call counts once |
| `users.upsert` | `satismeter.api.users.upsert` | `write` | Create or update a user and their traits, and optionally set the date they next see a survey |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/satismeter

## License

Apache-2.0
