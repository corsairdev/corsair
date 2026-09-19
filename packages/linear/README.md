# @corsair-dev/linear

Linear plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/linear
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `comments.create` | `linear.api.comments.create` | `write` | Post a comment on an issue |
| `comments.delete` | `linear.api.comments.delete` | `destructive` | Delete a comment [DESTRUCTIVE] |
| `comments.list` | `linear.api.comments.list` | `read` | List comments on an issue |
| `comments.update` | `linear.api.comments.update` | `write` | Update a comment |
| `issues.create` | `linear.api.issues.create` | `write` | Create a new issue |
| `issues.delete` | `linear.api.issues.delete` | `destructive` | Permanently delete an issue [DESTRUCTIVE · IRREVERSIBLE] |
| `issues.get` | `linear.api.issues.get` | `read` | Get a specific issue |
| `issues.list` | `linear.api.issues.list` | `read` | List issues in a team |
| `issues.update` | `linear.api.issues.update` | `write` | Update an existing issue |
| `projects.create` | `linear.api.projects.create` | `write` | Create a new project |
| `projects.delete` | `linear.api.projects.delete` | `destructive` | Permanently delete a project [DESTRUCTIVE · IRREVERSIBLE] |
| `projects.get` | `linear.api.projects.get` | `read` | Get a specific project |
| `projects.list` | `linear.api.projects.list` | `read` | List projects in a team |
| `projects.update` | `linear.api.projects.update` | `write` | Update an existing project |
| `teams.get` | `linear.api.teams.get` | `read` | Get a specific team |
| `teams.list` | `linear.api.teams.list` | `read` | List teams in the workspace |
| `users.get` | `linear.api.users.get` | `read` | Get a specific user |
| `users.list` | `linear.api.users.list` | `read` | List users in the workspace |

## Auth

Auth: API key, OAuth 2.0, Managed OAuth (default API key). Set `authType` on the plugin factory to pick one.

## Webhooks

Handles 9 webhook events. See the reference for payloads and `webhookHooks`.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/linear

## License

Apache-2.0
