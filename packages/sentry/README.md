# @corsair-dev/sentry

Sentry plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/sentry
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `events.get` | `sentry.api.events.get` | `read` | Get an event by ID |
| `events.list` | `sentry.api.events.list` | `read` | List events for a project |
| `issues.delete` | `sentry.api.issues.delete` | `destructive` | Permanently delete an issue [DESTRUCTIVE] |
| `issues.get` | `sentry.api.issues.get` | `read` | Get an issue by ID |
| `issues.list` | `sentry.api.issues.list` | `read` | List issues for a project |
| `issues.update` | `sentry.api.issues.update` | `write` | Update an issue |
| `organizations.create` | `sentry.api.organizations.create` | `write` | Create a new organization |
| `organizations.get` | `sentry.api.organizations.get` | `read` | Get an organization by slug |
| `organizations.list` | `sentry.api.organizations.list` | `read` | List organizations |
| `organizations.update` | `sentry.api.organizations.update` | `write` | Update an organization |
| `projects.create` | `sentry.api.projects.create` | `write` | Create a new project |
| `projects.delete` | `sentry.api.projects.delete` | `destructive` | Permanently delete a project [DESTRUCTIVE] |
| `projects.get` | `sentry.api.projects.get` | `read` | Get a project by slug |
| `projects.list` | `sentry.api.projects.list` | `read` | List projects for an organization |
| `projects.update` | `sentry.api.projects.update` | `write` | Update a project |
| `releases.create` | `sentry.api.releases.create` | `write` | Create a new release |
| `releases.delete` | `sentry.api.releases.delete` | `destructive` | Delete a release [DESTRUCTIVE] |
| `releases.get` | `sentry.api.releases.get` | `read` | Get a release by version ID |
| `releases.list` | `sentry.api.releases.list` | `read` | List releases for an organization |
| `releases.update` | `sentry.api.releases.update` | `write` | Update a release |
| `teams.create` | `sentry.api.teams.create` | `write` | Create a new team |
| `teams.delete` | `sentry.api.teams.delete` | `destructive` | Delete a team [DESTRUCTIVE] |
| `teams.get` | `sentry.api.teams.get` | `read` | Get a team by slug |
| `teams.list` | `sentry.api.teams.list` | `read` | List teams for an organization |
| `teams.update` | `sentry.api.teams.update` | `write` | Update a team |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

Handles 9 webhook events. See the reference for payloads and `webhookHooks`.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/sentry

## License

Apache-2.0
