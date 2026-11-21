# @corsair-dev/penpot

Penpot is the open-source design tool. This plugin manages teams, projects and design files, snapshots, share links and comment threads, configures team webhooks, and manages API access tokens over the RPC API.

## Install

```bash
pnpm add @corsair-dev/penpot
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `accessTokens.delete` | `penpot.api.accessTokens.delete` | `destructive` | Revoke an API access token; apps using it stop working |
| `accessTokens.list` | `penpot.api.accessTokens.list` | `read` | List the API access tokens of the account (names only, never values) |
| `comments.create` | `penpot.api.comments.create` | `write` | Comment on a thread |
| `comments.list` | `penpot.api.comments.list` | `read` | List the comments of a thread |
| `comments.threadCreate` | `penpot.api.comments.threadCreate` | `write` | Open a comment thread on a file page |
| `comments.threadGet` | `penpot.api.comments.threadGet` | `read` | Read one comment thread |
| `comments.threadsList` | `penpot.api.comments.threadsList` | `read` | List comment threads of a file or team |
| `files.create` | `penpot.api.files.create` | `write` | Create a design file in a project |
| `files.delete` | `penpot.api.files.delete` | `destructive` | Delete a design file |
| `files.duplicate` | `penpot.api.files.duplicate` | `write` | Duplicate a design file |
| `files.get` | `penpot.api.files.get` | `read` | Read one design file with its data |
| `files.rename` | `penpot.api.files.rename` | `write` | Rename a design file |
| `files.shareLinkCreate` | `penpot.api.files.shareLinkCreate` | `write` | Create a share link for a file |
| `files.shareLinkDelete` | `penpot.api.files.shareLinkDelete` | `write` | Delete a share link; the link stops working immediately |
| `files.snapshotsCreate` | `penpot.api.files.snapshotsCreate` | `write` | Create a snapshot of a file |
| `files.snapshotsDelete` | `penpot.api.files.snapshotsDelete` | `destructive` | Delete a file snapshot |
| `files.snapshotsList` | `penpot.api.files.snapshotsList` | `read` | List the snapshots of a file |
| `projects.create` | `penpot.api.projects.create` | `write` | Create a project in a team |
| `projects.delete` | `penpot.api.projects.delete` | `destructive` | Delete a project with its files |
| `projects.duplicate` | `penpot.api.projects.duplicate` | `write` | Duplicate a project |
| `projects.get` | `penpot.api.projects.get` | `read` | Read one project by id |
| `projects.listAll` | `penpot.api.projects.listAll` | `read` | List all projects of the authenticated profile |
| `projects.rename` | `penpot.api.projects.rename` | `write` | Rename a project |
| `teams.create` | `penpot.api.teams.create` | `write` | Create a team |
| `teams.delete` | `penpot.api.teams.delete` | `destructive` | Delete a team with its projects and files |
| `teams.get` | `penpot.api.teams.get` | `read` | Read one team |
| `teams.list` | `penpot.api.teams.list` | `read` | List the teams of the authenticated profile |
| `webhooks.create` | `penpot.api.webhooks.create` | `write` | Create a webhook for a team |
| `webhooks.delete` | `penpot.api.webhooks.delete` | `destructive` | Delete a webhook; deliveries stop until it is created again |
| `webhooks.list` | `penpot.api.webhooks.list` | `read` | List the webhooks of a team |
| `webhooks.update` | `penpot.api.webhooks.update` | `write` | Update a webhook URL, payload format or active state |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

Handles 1 webhook event. See the reference for payloads and `webhookHooks`.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/penpot

## License

Apache-2.0
