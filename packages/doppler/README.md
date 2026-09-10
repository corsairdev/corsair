# @corsair-dev/doppler

Doppler plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/doppler
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `activityLogs.list` | `doppler.api.activityLogs.list` | `read` | List workplace activity log entries |
| `activityLogs.retrieve` | `doppler.api.activityLogs.retrieve` | `read` | Retrieve a single activity log entry |
| `auth.me` | `doppler.api.auth.me` | `read` | Read information about the authenticated token |
| `changeRequests.list` | `doppler.api.changeRequests.list` | `read` | List change requests (Team/Enterprise plans only) |
| `configLogs.get` | `doppler.api.configLogs.get` | `read` | Retrieve a config log entry, including its secret diff |
| `configLogs.list` | `doppler.api.configLogs.list` | `read` | List a config's change-log entries |
| `configLogs.rollback` | `doppler.api.configLogs.rollback` | `write` | Roll a config back to a prior log entry's state |
| `configs.clone` | `doppler.api.configs.clone` | `write` | Clone a config into a new branch config |
| `configs.create` | `doppler.api.configs.create` | `write` | Create a branch config within an environment |
| `configs.delete` | `doppler.api.configs.delete` | `destructive` | Permanently delete a config and its secrets |
| `configs.get` | `doppler.api.configs.get` | `read` | Retrieve a config |
| `configs.list` | `doppler.api.configs.list` | `read` | List a project's configs |
| `configs.lock` | `doppler.api.configs.lock` | `write` | Lock a config so it cannot be renamed or deleted |
| `configs.unlock` | `doppler.api.configs.unlock` | `write` | Unlock a config so it can be renamed or deleted |
| `configs.update` | `doppler.api.configs.update` | `write` | Rename a config |
| `dynamicSecrets.revokeLease` | `doppler.api.dynamicSecrets.revokeLease` | `destructive` | Revoke a leased dynamic secret credential |
| `environments.create` | `doppler.api.environments.create` | `write` | Create an environment within a project |
| `environments.delete` | `doppler.api.environments.delete` | `destructive` | Permanently delete an environment and its configs |
| `environments.get` | `doppler.api.environments.get` | `read` | Retrieve an environment |
| `environments.list` | `doppler.api.environments.list` | `read` | List a project's environments |
| `environments.rename` | `doppler.api.environments.rename` | `write` | Rename an environment's display name or slug |
| `groups.deleteMember` | `doppler.api.groups.deleteMember` | `destructive` | Remove a member from a workplace group |
| `integrations.list` | `doppler.api.integrations.list` | `read` | List third-party integrations |
| `invites.list` | `doppler.api.invites.list` | `read` | List pending workplace invites |
| `projectMembers.delete` | `doppler.api.projectMembers.delete` | `destructive` | Remove a member from a project |
| `projectMembers.get` | `doppler.api.projectMembers.get` | `read` | Retrieve a project member |
| `projectMembers.list` | `doppler.api.projectMembers.list` | `read` | List a project's members |
| `projectRoles.get` | `doppler.api.projectRoles.get` | `read` | Retrieve a project-level role |
| `projectRoles.list` | `doppler.api.projectRoles.list` | `read` | List project-level roles |
| `projectRoles.listPermissions` | `doppler.api.projectRoles.listPermissions` | `read` | List permissions grantable to a project-level role |
| `projects.create` | `doppler.api.projects.create` | `write` | Create a project |
| `projects.delete` | `doppler.api.projects.delete` | `destructive` | Permanently delete a project and everything in it |
| `projects.get` | `doppler.api.projects.get` | `read` | Retrieve a project |
| `projects.list` | `doppler.api.projects.list` | `read` | List projects |
| `projects.update` | `doppler.api.projects.update` | `write` | Update a project's name or description |
| `secrets.delete` | `doppler.api.secrets.delete` | `destructive` | Delete a secret |
| `secrets.download` | `doppler.api.secrets.download` | `read` | Download a config's secrets in a given format |
| `secrets.get` | `doppler.api.secrets.get` | `read` | Retrieve a single secret's value |
| `secrets.list` | `doppler.api.secrets.list` | `read` | List a config's secrets, values included |
| `secrets.names` | `doppler.api.secrets.names` | `read` | List a config's secret names, without values |
| `secrets.update` | `doppler.api.secrets.update` | `write` | Bulk-set (or delete, via null) secrets in a config |
| `secrets.updateNote` | `doppler.api.secrets.updateNote` | `write` | Set a secret's note (project-scoped route) |
| `secrets.updateNoteViaConfig` | `doppler.api.secrets.updateNoteViaConfig` | `write` | Set a secret's note (config-scoped route) |
| `serviceTokens.create` | `doppler.api.serviceTokens.create` | `write` | Create a service token for a config |
| `serviceTokens.delete` | `doppler.api.serviceTokens.delete` | `destructive` | Revoke a service token |
| `serviceTokens.list` | `doppler.api.serviceTokens.list` | `read` | List a config's service tokens |
| `share.createEncrypted` | `doppler.api.share.createEncrypted` | `write` | Create a Doppler Share link from a caller-encrypted payload (zero-knowledge) |
| `share.createPlain` | `doppler.api.share.createPlain` | `write` | Create a Doppler Share link from a plaintext secret |
| `webhooks.add` | `doppler.api.webhooks.add` | `write` | Create a webhook |
| `webhooks.delete` | `doppler.api.webhooks.delete` | `destructive` | Permanently delete a webhook |
| `webhooks.disable` | `doppler.api.webhooks.disable` | `write` | Disable a webhook |
| `webhooks.enable` | `doppler.api.webhooks.enable` | `write` | Enable a webhook |
| `webhooks.get` | `doppler.api.webhooks.get` | `read` | Retrieve a webhook |
| `webhooks.list` | `doppler.api.webhooks.list` | `read` | List webhooks |
| `webhooks.update` | `doppler.api.webhooks.update` | `write` | Update a webhook |
| `workplace.get` | `doppler.api.workplace.get` | `read` | Retrieve the workplace |
| `workplace.update` | `doppler.api.workplace.update` | `write` | Update the workplace's name, billing email, or security email |
| `workplaceRoles.get` | `doppler.api.workplaceRoles.get` | `read` | Retrieve a workplace role |
| `workplaceRoles.list` | `doppler.api.workplaceRoles.list` | `read` | List workplace roles |
| `workplaceRoles.listPermissions` | `doppler.api.workplaceRoles.listPermissions` | `read` | List permissions grantable to a workplace role |
| `workplaceUsers.get` | `doppler.api.workplaceUsers.get` | `read` | Retrieve a workplace user by id |
| `workplaceUsers.list` | `doppler.api.workplaceUsers.list` | `read` | List users in the workplace |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/doppler

## License

Apache-2.0
