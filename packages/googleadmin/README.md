# @corsair-dev/googleadmin

Google Admin plugin for Corsair: users, groups, members, organizational units and domains through the Admin SDK Directory API.

## Install

```bash
pnpm add @corsair-dev/googleadmin
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `customers.get` | `googleadmin.api.customers.get` | `read` | Read the account's customer record, including its primary domain |
| `domains.aliases.list` | `googleadmin.api.domains.aliases.list` | `read` | List the account's domain aliases, optionally for one parent domain |
| `domains.get` | `googleadmin.api.domains.get` | `read` | Read one domain |
| `domains.list` | `googleadmin.api.domains.list` | `read` | List the account's domains |
| `groups.aliases.delete` | `googleadmin.api.groups.aliases.delete` | `destructive` | Remove an alias email address from a group |
| `groups.aliases.insert` | `googleadmin.api.groups.aliases.insert` | `write` | Add an alias email address to a group |
| `groups.aliases.list` | `googleadmin.api.groups.aliases.list` | `read` | List a group's aliases |
| `groups.delete` | `googleadmin.api.groups.delete` | `destructive` | Delete a group and its memberships |
| `groups.get` | `googleadmin.api.groups.get` | `read` | Read one group by email, alias or ID |
| `groups.insert` | `googleadmin.api.groups.insert` | `write` | Create a group |
| `groups.list` | `googleadmin.api.groups.list` | `read` | List groups in the account, one domain, or the groups a user belongs to |
| `groups.update` | `googleadmin.api.groups.update` | `write` | Update a group's email, display name or description |
| `members.delete` | `googleadmin.api.members.delete` | `destructive` | Remove a member from a group; the member loses the group's mail and access |
| `members.get` | `googleadmin.api.members.get` | `read` | Read one group membership |
| `members.hasMember` | `googleadmin.api.members.hasMember` | `read` | Check whether a user is a direct or nested member of a group |
| `members.insert` | `googleadmin.api.members.insert` | `write` | Add a user or group to a group with a role and a mail delivery preference |
| `members.list` | `googleadmin.api.members.list` | `read` | List a group's members, optionally including members inherited from nested groups and filtered by role |
| `members.update` | `googleadmin.api.members.update` | `write` | Change a member's role or mail delivery preference |
| `orgUnits.delete` | `googleadmin.api.orgUnits.delete` | `destructive` | Delete an organizational unit. It must hold no users or child units first |
| `orgUnits.get` | `googleadmin.api.orgUnits.get` | `read` | Read one organizational unit |
| `orgUnits.insert` | `googleadmin.api.orgUnits.insert` | `write` | Create an organizational unit under a parent |
| `orgUnits.list` | `googleadmin.api.orgUnits.list` | `read` | List organizational units: immediate children, all descendants, or all descendants plus the unit itself |
| `orgUnits.update` | `googleadmin.api.orgUnits.update` | `write` | Rename an organizational unit or move it under another parent, which changes the settings its users inherit |
| `users.aliases.delete` | `googleadmin.api.users.aliases.delete` | `destructive` | Remove alias email addresses from a user; mail to a removed alias is no longer delivered |
| `users.aliases.insert` | `googleadmin.api.users.aliases.insert` | `write` | Add an alias email address to a user |
| `users.aliases.list` | `googleadmin.api.users.aliases.list` | `read` | List a user's alias email addresses |
| `users.delete` | `googleadmin.api.users.delete` | `destructive` | Delete a user account. The account stays recoverable through users.undelete while it is in the trash |
| `users.get` | `googleadmin.api.users.get` | `read` | Read one user by email, alias or ID |
| `users.insert` | `googleadmin.api.users.insert` | `write` | Create a user account with an initial password; a conflicting unmanaged account can be invited instead of created |
| `users.list` | `googleadmin.api.users.list` | `read` | List users in the account or one domain, with Google's search query and paging |
| `users.makeAdmin` | `googleadmin.api.users.makeAdmin` | `destructive` | Grant or revoke super administrator on a user. The caller cannot revoke its own last admin right |
| `users.photos.delete` | `googleadmin.api.users.photos.delete` | `destructive` | Remove a user's profile photo |
| `users.photos.get` | `googleadmin.api.users.photos.get` | `read` | Read a user's profile photo as base64 bytes |
| `users.photos.update` | `googleadmin.api.users.photos.update` | `write` | Replace a user's profile photo |
| `users.signOut` | `googleadmin.api.users.signOut` | `write` | Sign a user out of all web and device sessions, clearing their sign-in cookies |
| `users.undelete` | `googleadmin.api.users.undelete` | `write` | Restore a deleted user by ID and optionally set the organizational unit it returns to |
| `users.update` | `googleadmin.api.users.update` | `write` | Update a user: name, password, suspension, archival, groups of profile fields and custom schemas |

## Auth

Auth: OAuth 2.0. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/googleadmin

## License

Apache-2.0
