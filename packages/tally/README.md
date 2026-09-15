# @corsair-dev/tally

Tally plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/tally
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `forms.create` | `tally.api.forms.create` | `write` | Create a new form |
| `forms.delete` | `tally.api.forms.delete` | `destructive` | Delete a form [DESTRUCTIVE] |
| `forms.get` | `tally.api.forms.get` | `read` | Retrieve a form by ID |
| `forms.list` | `tally.api.forms.list` | `read` | List all forms with optional pagination and workspace filter |
| `forms.update` | `tally.api.forms.update` | `write` | Update an existing form |
| `organizations.cancelInvite` | `tally.api.organizations.cancelInvite` | `destructive` | Cancel a pending organization invite [DESTRUCTIVE] |
| `organizations.createInvite` | `tally.api.organizations.createInvite` | `write` | Invite users to an organization |
| `organizations.listInvites` | `tally.api.organizations.listInvites` | `read` | List pending invites for an organization |
| `organizations.listUsers` | `tally.api.organizations.listUsers` | `read` | List all users in an organization |
| `organizations.removeUser` | `tally.api.organizations.removeUser` | `destructive` | Remove a user from an organization [DESTRUCTIVE] |
| `questions.list` | `tally.api.questions.list` | `read` | List all questions for a form |
| `submissions.delete` | `tally.api.submissions.delete` | `destructive` | Delete a form submission [DESTRUCTIVE] |
| `submissions.get` | `tally.api.submissions.get` | `read` | Retrieve a specific form submission |
| `submissions.list` | `tally.api.submissions.list` | `read` | List form submissions with optional filters |
| `users.getMe` | `tally.api.users.getMe` | `read` | Retrieve the current authenticated user |
| `webhookManagement.create` | `tally.api.webhookManagement.create` | `write` | Create a new webhook subscription |
| `webhookManagement.delete` | `tally.api.webhookManagement.delete` | `destructive` | Delete a webhook subscription [DESTRUCTIVE] |
| `webhookManagement.list` | `tally.api.webhookManagement.list` | `read` | List all webhooks |
| `webhookManagement.listEvents` | `tally.api.webhookManagement.listEvents` | `read` | List delivery events for a webhook |
| `webhookManagement.retryEvent` | `tally.api.webhookManagement.retryEvent` | `write` | Retry a failed webhook event delivery |
| `webhookManagement.update` | `tally.api.webhookManagement.update` | `write` | Update a webhook subscription |
| `workspaces.create` | `tally.api.workspaces.create` | `write` | Create a new workspace (Pro subscription required) |
| `workspaces.delete` | `tally.api.workspaces.delete` | `destructive` | Delete a workspace [DESTRUCTIVE] |
| `workspaces.get` | `tally.api.workspaces.get` | `read` | Retrieve a workspace by ID |
| `workspaces.list` | `tally.api.workspaces.list` | `read` | List all workspaces |
| `workspaces.update` | `tally.api.workspaces.update` | `write` | Update a workspace name |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

Handles 1 webhook event. See the reference for payloads and `webhookHooks`.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/tally

## License

Apache-2.0
