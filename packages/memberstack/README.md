# @corsair-dev/memberstack

Memberstack plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/memberstack
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `members.addPlan` | `memberstack.api.members.addPlan` | `write` | Add a free plan to a member |
| `members.create` | `memberstack.api.members.create` | `write` | Create a member with optional free plans and custom data |
| `members.delete` | `memberstack.api.members.delete` | `destructive` | Permanently delete a member and optionally cancel subscriptions |
| `members.get` | `memberstack.api.members.get` | `read` | Get a member by ID or email; returns null when absent |
| `members.list` | `memberstack.api.members.list` | `read` | List members with cursor pagination |
| `members.removePlan` | `memberstack.api.members.removePlan` | `write` | Remove a free plan and revoke its access |
| `members.update` | `memberstack.api.members.update` | `write` | Update a member; JSON is replaced, not merged |
| `members.verifyToken` | `memberstack.api.members.verifyToken` | `read` | Verify a member JWT and return its decoded payload |
| `records.create` | `memberstack.api.records.create` | `write` | Create a data table record |
| `records.delete` | `memberstack.api.records.delete` | `destructive` | Permanently delete a data table record |
| `records.query` | `memberstack.api.records.query` | `read` | Query data records with filters and pagination |
| `records.update` | `memberstack.api.records.update` | `write` | Update fields on a data table record |
| `tables.get` | `memberstack.api.tables.get` | `read` | Get a data table by key or ID |
| `tables.list` | `memberstack.api.tables.list` | `read` | List data tables and their fields |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/memberstack

## License

Apache-2.0
