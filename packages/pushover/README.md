# @corsair-dev/pushover

Pushover plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/pushover
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `apps.limits` | `pushover.api.apps.limits` | `read` | Get the monthly message limit and remaining quota |
| `glances.update` | `pushover.api.glances.update` | `write` | Update a user widget glance |
| `groups.addUser` | `pushover.api.groups.addUser` | `write` | Add a user to a delivery group |
| `groups.create` | `pushover.api.groups.create` | `write` | Create a delivery group |
| `groups.disableUser` | `pushover.api.groups.disableUser` | `write` | Disable a delivery group user |
| `groups.enableUser` | `pushover.api.groups.enableUser` | `write` | Enable a delivery group user |
| `groups.get` | `pushover.api.groups.get` | `read` | Get a delivery group and its users |
| `groups.list` | `pushover.api.groups.list` | `read` | List delivery groups |
| `groups.removeUser` | `pushover.api.groups.removeUser` | `destructive` | Remove a user from a delivery group |
| `groups.rename` | `pushover.api.groups.rename` | `write` | Rename a delivery group |
| `licenses.assign` | `pushover.api.licenses.assign` | `destructive` | Permanently assign a license credit |
| `licenses.get` | `pushover.api.licenses.get` | `read` | Get remaining license credits |
| `messages.send` | `pushover.api.messages.send` | `destructive` | Send a notification to a user or group |
| `receipts.cancel` | `pushover.api.receipts.cancel` | `write` | Cancel retries for an emergency notification |
| `receipts.cancelByTag` | `pushover.api.receipts.cancelByTag` | `write` | Cancel emergency notification retries by tag |
| `receipts.get` | `pushover.api.receipts.get` | `read` | Get an emergency notification receipt |
| `sounds.list` | `pushover.api.sounds.list` | `read` | List available notification sounds |
| `subscriptions.migrate` | `pushover.api.subscriptions.migrate` | `write` | Migrate a user key to a subscription key |
| `teams.addUser` | `pushover.api.teams.addUser` | `destructive` | Invite or add a team user using a team token |
| `teams.get` | `pushover.api.teams.get` | `read` | Get team details using a team token |
| `teams.removeUser` | `pushover.api.teams.removeUser` | `destructive` | Remove a team user using a team token |
| `teams.revokeInvitation` | `pushover.api.teams.revokeInvitation` | `destructive` | Revoke a team invitation using a team token |
| `users.validate` | `pushover.api.users.validate` | `read` | Validate a user or group and list its devices |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/pushover

## License

Apache-2.0
