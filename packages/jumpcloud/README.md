# @corsair-dev/jumpcloud

JumpCloud plugin for Corsair — directory core surface (users, systems, groups, policies) over the official API 1.0/2.0.

## Install

```bash
pnpm add @corsair-dev/jumpcloud
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `applications.get` | `jumpcloud.api.applications.get` | `read` | Get a JumpCloud application by ID |
| `applications.list` | `jumpcloud.api.applications.list` | `read` | List JumpCloud applications with pagination |
| `commands.create` | `jumpcloud.api.commands.create` | `write` | Create a JumpCloud command |
| `commands.get` | `jumpcloud.api.commands.get` | `read` | Get a JumpCloud command by ID |
| `commands.list` | `jumpcloud.api.commands.list` | `read` | List JumpCloud commands with pagination |
| `commands.run` | `jumpcloud.api.commands.run` | `destructive` | Run a command against target systems |
| `organizations.get` | `jumpcloud.api.organizations.get` | `read` | Get a JumpCloud organization by ID |
| `organizations.list` | `jumpcloud.api.organizations.list` | `read` | List JumpCloud organizations |
| `policies.create` | `jumpcloud.api.policies.create` | `write` | Create a JumpCloud policy |
| `policies.delete` | `jumpcloud.api.policies.delete` | `destructive` | Delete a JumpCloud policy |
| `policies.get` | `jumpcloud.api.policies.get` | `read` | Get a JumpCloud policy by ID |
| `policies.list` | `jumpcloud.api.policies.list` | `read` | List JumpCloud policies with pagination |
| `policies.listStatuses` | `jumpcloud.api.policies.listStatuses` | `read` | List policy statuses for a policy |
| `policies.update` | `jumpcloud.api.policies.update` | `write` | Update a JumpCloud policy |
| `search.systems` | `jumpcloud.api.search.systems` | `read` | Search JumpCloud systems (POST body search) |
| `search.systemUsers` | `jumpcloud.api.search.systemUsers` | `read` | Search JumpCloud system users (POST body search) |
| `systemGroups.create` | `jumpcloud.api.systemGroups.create` | `write` | Create a JumpCloud system group |
| `systemGroups.delete` | `jumpcloud.api.systemGroups.delete` | `destructive` | Delete a JumpCloud system group |
| `systemGroups.get` | `jumpcloud.api.systemGroups.get` | `read` | Get a JumpCloud system group by ID |
| `systemGroups.list` | `jumpcloud.api.systemGroups.list` | `read` | List JumpCloud system groups with pagination |
| `systemGroups.manageMembers` | `jumpcloud.api.systemGroups.manageMembers` | `write` | Manage (add or remove) members of a system group |
| `systemGroups.update` | `jumpcloud.api.systemGroups.update` | `write` | Update a JumpCloud system group |
| `systems.delete` | `jumpcloud.api.systems.delete` | `destructive` | Delete a JumpCloud system |
| `systems.get` | `jumpcloud.api.systems.get` | `read` | Get a JumpCloud system by ID |
| `systems.list` | `jumpcloud.api.systems.list` | `read` | List JumpCloud systems with pagination |
| `systems.listAssociations` | `jumpcloud.api.systems.listAssociations` | `read` | List associations for a system |
| `systems.listPolicyStatuses` | `jumpcloud.api.systems.listPolicyStatuses` | `read` | List policy statuses for a system |
| `systems.listUsers` | `jumpcloud.api.systems.listUsers` | `read` | List users bound to a system |
| `userGroups.create` | `jumpcloud.api.userGroups.create` | `write` | Create a JumpCloud user group |
| `userGroups.delete` | `jumpcloud.api.userGroups.delete` | `destructive` | Delete a JumpCloud user group |
| `userGroups.get` | `jumpcloud.api.userGroups.get` | `read` | Get a JumpCloud user group by ID |
| `userGroups.list` | `jumpcloud.api.userGroups.list` | `read` | List JumpCloud user groups with pagination |
| `userGroups.listMembers` | `jumpcloud.api.userGroups.listMembers` | `read` | List members of a user group |
| `userGroups.listMembership` | `jumpcloud.api.userGroups.listMembership` | `read` | List a user group's membership graph |
| `userGroups.manageMembers` | `jumpcloud.api.userGroups.manageMembers` | `write` | Manage (add or remove) members of a user group |
| `userGroups.update` | `jumpcloud.api.userGroups.update` | `write` | Update a JumpCloud user group |
| `users.create` | `jumpcloud.api.users.create` | `destructive` | Create a JumpCloud system user; unless state is STAGED, JumpCloud emails the user a welcome or activation link |
| `users.delete` | `jumpcloud.api.users.delete` | `destructive` | Delete a JumpCloud system user |
| `users.enforceMfa` | `jumpcloud.api.users.enforceMfa` | `destructive` | Update a system user's MFA requirement; an unenrolled user is locked out of MFA-protected resources once any exclusion ends |
| `users.expirePassword` | `jumpcloud.api.users.expirePassword` | `destructive` | Expire a system user's password so they must reset it at next login |
| `users.get` | `jumpcloud.api.users.get` | `read` | Get a JumpCloud system user by ID |
| `users.list` | `jumpcloud.api.users.list` | `read` | List JumpCloud system users with limit/skip pagination |
| `users.listSshKeys` | `jumpcloud.api.users.listSshKeys` | `read` | List SSH keys of a system user |
| `users.resetMfa` | `jumpcloud.api.users.resetMfa` | `destructive` | Reset a system user's MFA (TOTP key) and start a new enrollment period |
| `users.setPassword` | `jumpcloud.api.users.setPassword` | `destructive` | Force-set a system user's password, replacing the current one |
| `users.syncMfa` | `jumpcloud.api.users.syncMfa` | `write` | Sync system user MFA |
| `users.unlock` | `jumpcloud.api.users.unlock` | `write` | Unlock a locked system user |
| `users.update` | `jumpcloud.api.users.update` | `destructive` | Update a JumpCloud system user; setting state to ACTIVATED on a staged user emails them an activation link |

## Auth

Auth: API key (an administrator's key from **My API Key** in the JumpCloud console). Corsair prompts your tenant for credentials on first use.

Two optional settings are stored with the connected account, or passed as plugin options:

- `region` (option `region`): `us` (default, console.jumpcloud.com), `eu` (console.eu.jumpcloud.com) or `in` (console.in.jumpcloud.com). A key only works in its organization's region.
- `org_id` (option `orgId`): for multi-tenant (MSP) administrators, the organization each call acts on, sent as the `x-org-id` header. Leave it unset for a single-organization key.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/jumpcloud

## License

Apache-2.0
