# @corsair-dev/neon

Neon (serverless Postgres) plugin for Corsair. Covers projects,
branches, databases, roles, compute endpoints, Neon Auth, the Data API,
organizations, VPC endpoints, snapshots, consumption metrics, users,
regions, and API key management via the Neon API v2
(`https://console.neon.tech/api/v2`).

## Authentication

The plugin uses an **API key** (`api_key`).

1. In the [Neon Console](https://console.neon.tech/), open
   **Account settings → API keys** (or organization settings for an org
   key) and create a key.
2. Store it as the plugin's API key in Corsair. It is sent as an
   `Authorization: Bearer <key>` header on every request.

Personal keys act on everything your account can access;
organization keys are limited to that organization's projects.

## Endpoints

110 operations across these domains:

| Domain             | Ops | Covers                                                                                                                          |
| ------------------ | --- | ------------------------------------------------------------------------------------------------------------------------------- |
| `projects`         | 18  | create/get/list/update/delete projects, connection URIs, permissions, JWKS                                                      |
| `branches`         | 17  | create/get/list/update/delete branches, set default, restore, schema and schema diff, endpoints, databases and roles per branch |
| `databases`        | 5   | create/get/list/update/delete databases on a branch                                                                             |
| `roles`            | 6   | create/get/list/delete roles, reveal/reset role password                                                                        |
| `computeEndpoints` | 8   | create/get/list/update/delete, start/suspend/restart compute endpoints                                                          |
| `auth`             | 18  | Neon Auth: integrations, OAuth providers, users, keys, email settings, transfers                                                |
| `dataApi`          | 4   | Data API (PostgREST-style) access management per branch                                                                         |
| `organizations`    | 12  | org details, members, invitations, API keys, transfers                                                                          |
| `vpc`              | 8   | VPC endpoints and project VPC restrictions                                                                                      |
| `snapshots`        | 6   | list/get/update/delete snapshots, restore to branch                                                                             |
| `consumption`      | 2   | account and project consumption metrics                                                                                         |
| `apiKeys`          | 3   | create/list/revoke API keys                                                                                                     |
| `users`            | 2   | current user info and organizations                                                                                             |
| `regions`          | 1   | list available regions                                                                                                          |

Read results are cached locally per entity type and kept in sync by the
shared endpoint factory (create/update/delete operations upsert or evict
the corresponding cache entries).

## Webhooks

The Neon API does not provide webhooks; this plugin registers no
webhook handlers.

## Provider quirks

- Most resources are addressed by hierarchical path params
  (`project_id` → `branch_id` → `database_name`/`role_name`); the shared
  factory resolves and validates these before building requests.
- Some operations are asynchronous on Neon's side and return an
  `operations` array to poll for completion.
- Destructive operations (delete project/branch/database, revoke keys,
  role password reset) are marked with elevated risk levels so Corsair
  permissions can gate them.
- API keys are shown only once at creation; the plugin's cache rules
  deliberately avoid persisting plaintext key material.
