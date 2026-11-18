# @corsair-dev/launchdarkly

LaunchDarkly plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/launchdarkly
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `accessTokens.create` | `launchdarkly.api.accessTokens.create` | `write` | Create a new personal or service access token |
| `accessTokens.delete` | `launchdarkly.api.accessTokens.delete` | `destructive` | Revoke and delete an access token |
| `accessTokens.get` | `launchdarkly.api.accessTokens.get` | `read` | Get details of an access token by ID |
| `accessTokens.list` | `launchdarkly.api.accessTokens.list` | `read` | List access tokens in the account |
| `accountMembers.delete` | `launchdarkly.api.accountMembers.delete` | `destructive` | Remove an account member from the account |
| `accountMembers.get` | `launchdarkly.api.accountMembers.get` | `read` | Get details of an account member by ID |
| `accountMembers.invite` | `launchdarkly.api.accountMembers.invite` | `destructive` | Invite new members to the account |
| `accountMembers.list` | `launchdarkly.api.accountMembers.list` | `read` | List all account members |
| `accountMembers.update` | `launchdarkly.api.accountMembers.update` | `write` | Update an account member role or permissions via JSON Patch |
| `auditLog.get` | `launchdarkly.api.auditLog.get` | `read` | Get a specific audit log entry by ID |
| `auditLog.list` | `launchdarkly.api.auditLog.list` | `read` | List recent audit log entries in the account |
| `contexts.get` | `launchdarkly.api.contexts.get` | `read` | Get evaluation context by kind and key |
| `contexts.listKinds` | `launchdarkly.api.contexts.listKinds` | `read` | List context kinds defined in a project |
| `contexts.search` | `launchdarkly.api.contexts.search` | `read` | Search for evaluation contexts in an environment |
| `customRoles.create` | `launchdarkly.api.customRoles.create` | `write` | Create a new custom role |
| `customRoles.delete` | `launchdarkly.api.customRoles.delete` | `destructive` | Permanently delete a custom role |
| `customRoles.get` | `launchdarkly.api.customRoles.get` | `read` | Get a custom role by key |
| `customRoles.list` | `launchdarkly.api.customRoles.list` | `read` | List custom roles in the account |
| `customRoles.update` | `launchdarkly.api.customRoles.update` | `write` | Update a custom role policy via JSON Patch |
| `environments.create` | `launchdarkly.api.environments.create` | `write` | Create a new environment in a project |
| `environments.delete` | `launchdarkly.api.environments.delete` | `destructive` | Permanently delete an environment |
| `environments.get` | `launchdarkly.api.environments.get` | `read` | Get details of a specific environment |
| `environments.list` | `launchdarkly.api.environments.list` | `read` | List all environments in a project |
| `environments.resetMobileKey` | `launchdarkly.api.environments.resetMobileKey` | `destructive` | Reset the mobile key for an environment |
| `environments.resetSdkKey` | `launchdarkly.api.environments.resetSdkKey` | `destructive` | Reset the SDK key for an environment |
| `environments.update` | `launchdarkly.api.environments.update` | `write` | Update environment configuration via JSON Patch |
| `featureFlags.create` | `launchdarkly.api.featureFlags.create` | `write` | Create a new feature flag in a project |
| `featureFlags.delete` | `launchdarkly.api.featureFlags.delete` | `destructive` | Permanently delete a feature flag |
| `featureFlags.get` | `launchdarkly.api.featureFlags.get` | `read` | Get details of a feature flag |
| `featureFlags.getStatus` | `launchdarkly.api.featureFlags.getStatus` | `read` | Get the status of a feature flag in an environment |
| `featureFlags.list` | `launchdarkly.api.featureFlags.list` | `read` | List feature flags in a project |
| `featureFlags.listStatuses` | `launchdarkly.api.featureFlags.listStatuses` | `read` | List statuses for all feature flags in an environment |
| `featureFlags.update` | `launchdarkly.api.featureFlags.update` | `write` | Update feature flag rules and variations via JSON Patch |
| `projects.create` | `launchdarkly.api.projects.create` | `write` | Create a new project |
| `projects.delete` | `launchdarkly.api.projects.delete` | `destructive` | Permanently delete a project |
| `projects.get` | `launchdarkly.api.projects.get` | `read` | Get details of a specific project by project key |
| `projects.list` | `launchdarkly.api.projects.list` | `read` | List all projects in the account |
| `projects.update` | `launchdarkly.api.projects.update` | `write` | Update project configuration via JSON Patch |
| `root.get` | `launchdarkly.api.root.get` | `read` | Get LaunchDarkly root API metadata and resource links |
| `segments.create` | `launchdarkly.api.segments.create` | `write` | Create a new user segment |
| `segments.delete` | `launchdarkly.api.segments.delete` | `destructive` | Permanently delete a user segment |
| `segments.get` | `launchdarkly.api.segments.get` | `read` | Get details of a user segment |
| `segments.list` | `launchdarkly.api.segments.list` | `read` | List user segments in an environment |
| `segments.update` | `launchdarkly.api.segments.update` | `write` | Update user segment rules via JSON Patch |
| `tags.list` | `launchdarkly.api.tags.list` | `read` | List tags across resources in the account |
| `teams.create` | `launchdarkly.api.teams.create` | `write` | Create a new team |
| `teams.delete` | `launchdarkly.api.teams.delete` | `destructive` | Permanently delete a team |
| `teams.get` | `launchdarkly.api.teams.get` | `read` | Get details of a team by key |
| `teams.list` | `launchdarkly.api.teams.list` | `read` | List teams in the account |
| `teams.update` | `launchdarkly.api.teams.update` | `write` | Update a team via semantic instructions |
| `users.get` | `launchdarkly.api.users.get` | `read` | Get user record in an environment by user key |
| `users.list` | `launchdarkly.api.users.list` | `read` | List users in an environment |
| `users.search` | `launchdarkly.api.users.search` | `read` | Search users in an environment by query string |

## HTTP route inventory

These are the 53 routes exposed by this package. The implementation is checked against LaunchDarkly's [current OpenAPI specification](https://app.launchdarkly.com/api/v2/openapi.json) and the [REST API overview](https://launchdarkly.com/docs/api/overview.md). All paths below are under `/api/v2`.

| Operation | Method | Path | Official reference |
|---|---|---|---|
| `accessTokens.list` | GET | `/tokens` | [List access tokens](https://launchdarkly.com/docs/api/access-tokens/list-access-tokens.md) |
| `accessTokens.get` | GET | `/tokens/{id}` | [Get access token](https://launchdarkly.com/docs/api/access-tokens/get-access-token.md) |
| `accessTokens.create` | POST | `/tokens` | [Create access token](https://launchdarkly.com/docs/api/access-tokens/create-access-token.md) |
| `accessTokens.delete` | DELETE | `/tokens/{id}` | [Delete access token](https://launchdarkly.com/docs/api/access-tokens/delete-access-token.md) |
| `accountMembers.list` | GET | `/members` | [List account members](https://launchdarkly.com/docs/api/account-members/list-account-members.md) |
| `accountMembers.get` | GET | `/members/{id}` | [Get account member](https://launchdarkly.com/docs/api/account-members/get-account-member.md) |
| `accountMembers.invite` | POST | `/members` | [Invite new members](https://launchdarkly.com/docs/api/account-members/invite-new-members.md) |
| `accountMembers.update` | PATCH | `/members/{id}` | [Modify an account member](https://launchdarkly.com/docs/api/account-members/modify-an-account-member.md) |
| `accountMembers.delete` | DELETE | `/members/{id}` | [Delete account member](https://launchdarkly.com/docs/api/account-members/delete-account-member.md) |
| `auditLog.list` | GET | `/auditlog` | [List audit log entries](https://launchdarkly.com/docs/api/audit-log/list-audit-log-entries.md) |
| `auditLog.get` | GET | `/auditlog/{id}` | [Get audit log entry](https://launchdarkly.com/docs/api/audit-log/get-audit-log-entry.md) |
| `contexts.search` | POST | `/projects/{projectKey}/environments/{environmentKey}/contexts/search` | [Search for contexts](https://launchdarkly.com/docs/api/contexts/search-for-contexts.md) |
| `contexts.get` | GET | `/projects/{projectKey}/environments/{environmentKey}/contexts/{kind}/{key}` | [Get contexts](https://launchdarkly.com/docs/api/contexts/get-contexts.md) |
| `contexts.listKinds` | GET | `/projects/{projectKey}/context-kinds` | [Get context kinds](https://launchdarkly.com/docs/api/contexts/get-context-kinds.md) |
| `customRoles.list` | GET | `/roles` | [List custom roles](https://launchdarkly.com/docs/api/custom-roles/list-custom-roles.md) |
| `customRoles.get` | GET | `/roles/{customRoleKey}` | [Get custom role](https://launchdarkly.com/docs/api/custom-roles/get-custom-role.md) |
| `customRoles.create` | POST | `/roles` | [Create custom role](https://launchdarkly.com/docs/api/custom-roles/create-custom-role.md) |
| `customRoles.update` | PATCH | `/roles/{customRoleKey}` | [Update custom role](https://launchdarkly.com/docs/api/custom-roles/update-custom-role.md) |
| `customRoles.delete` | DELETE | `/roles/{customRoleKey}` | [Delete custom role](https://launchdarkly.com/docs/api/custom-roles/delete-custom-role.md) |
| `environments.list` | GET | `/projects/{projectKey}/environments` | [List environments](https://launchdarkly.com/docs/api/environments/list-environments.md) |
| `environments.get` | GET | `/projects/{projectKey}/environments/{environmentKey}` | [Get environment](https://launchdarkly.com/docs/api/environments/get-environment.md) |
| `environments.create` | POST | `/projects/{projectKey}/environments` | [Create environment](https://launchdarkly.com/docs/api/environments/create-environment.md) |
| `environments.update` | PATCH | `/projects/{projectKey}/environments/{environmentKey}` | [Update environment](https://launchdarkly.com/docs/api/environments/update-environment.md) |
| `environments.delete` | DELETE | `/projects/{projectKey}/environments/{environmentKey}` | [Delete environment](https://launchdarkly.com/docs/api/environments/delete-environment.md) |
| `environments.resetSdkKey` | POST | `/projects/{projectKey}/environments/{environmentKey}/apiKey` | [Reset environment SDK key](https://launchdarkly.com/docs/api/environments/reset-environment-sdk-key.md) |
| `environments.resetMobileKey` | POST | `/projects/{projectKey}/environments/{environmentKey}/mobileKey` | [Reset environment mobile key](https://launchdarkly.com/docs/api/environments/reset-environment-mobile-key.md) |
| `featureFlags.list` | GET | `/flags/{projectKey}` | [List feature flags](https://launchdarkly.com/docs/api/feature-flags/list-feature-flags.md) |
| `featureFlags.get` | GET | `/flags/{projectKey}/{featureFlagKey}` | [Get feature flag](https://launchdarkly.com/docs/api/feature-flags/get-feature-flag.md) |
| `featureFlags.create` | POST | `/flags/{projectKey}` | [Create feature flag](https://launchdarkly.com/docs/api/feature-flags/create-a-feature-flag.md) |
| `featureFlags.update` | PATCH | `/flags/{projectKey}/{featureFlagKey}` | [Update feature flag](https://launchdarkly.com/docs/api/feature-flags/update-feature-flag.md) |
| `featureFlags.delete` | DELETE | `/flags/{projectKey}/{featureFlagKey}` | [Delete feature flag](https://launchdarkly.com/docs/api/feature-flags/delete-feature-flag.md) |
| `featureFlags.getStatus` | GET | `/flag-statuses/{projectKey}/{environmentKey}/{featureFlagKey}` | [Get feature flag status](https://launchdarkly.com/docs/api/feature-flags/get-feature-flag-status.md) |
| `featureFlags.listStatuses` | GET | `/flag-statuses/{projectKey}/{environmentKey}` | [Get feature flag statuses](https://launchdarkly.com/docs/api/feature-flags/get-feature-flag-statuses.md) |
| `projects.list` | GET | `/projects` | [List projects](https://launchdarkly.com/docs/api/projects/list-projects.md) |
| `projects.get` | GET | `/projects/{projectKey}` | [Get project](https://launchdarkly.com/docs/api/projects/get-project.md) |
| `projects.create` | POST | `/projects` | [Create project](https://launchdarkly.com/docs/api/projects/create-project.md) |
| `projects.update` | PATCH | `/projects/{projectKey}` | [Update project](https://launchdarkly.com/docs/api/projects/update-project.md) |
| `projects.delete` | DELETE | `/projects/{projectKey}` | [Delete project](https://launchdarkly.com/docs/api/projects/delete-project.md) |
| `root.get` | GET | `/` | [REST API overview](https://launchdarkly.com/docs/api/overview.md) |
| `segments.list` | GET | `/segments/{projectKey}/{environmentKey}` | [List segments](https://launchdarkly.com/docs/api/segments/list-segments.md) |
| `segments.get` | GET | `/segments/{projectKey}/{environmentKey}/{segmentKey}` | [Get segment](https://launchdarkly.com/docs/api/segments/get-segment.md) |
| `segments.create` | POST | `/segments/{projectKey}/{environmentKey}` | [Create segment](https://launchdarkly.com/docs/api/segments/create-segment.md) |
| `segments.update` | PATCH | `/segments/{projectKey}/{environmentKey}/{segmentKey}` | [Patch segment](https://launchdarkly.com/docs/api/segments/patch-segment.md) |
| `segments.delete` | DELETE | `/segments/{projectKey}/{environmentKey}/{segmentKey}` | [Delete segment](https://launchdarkly.com/docs/api/segments/delete-segment.md) |
| `tags.list` | GET | `/tags` | [List tags](https://launchdarkly.com/docs/api/tags/list-tags.md) |
| `teams.list` | GET | `/teams` | [List teams](https://launchdarkly.com/docs/api/teams/list-teams.md) |
| `teams.get` | GET | `/teams/{teamKey}` | [Get team](https://launchdarkly.com/docs/api/teams/get-team.md) |
| `teams.create` | POST | `/teams` | [Create team](https://launchdarkly.com/docs/api/teams/create-team.md) |
| `teams.update` | PATCH | `/teams/{teamKey}` | [Update team](https://launchdarkly.com/docs/api/teams/update-team.md) |
| `teams.delete` | DELETE | `/teams/{teamKey}` | [Delete team](https://launchdarkly.com/docs/api/teams/delete-team.md) |
| `users.list` | GET | `/users/{projectKey}/{environmentKey}` | [List users](https://launchdarkly.com/docs/api/users/list-users.md) |
| `users.get` | GET | `/users/{projectKey}/{environmentKey}/{userKey}` | [Get user](https://launchdarkly.com/docs/api/users/get-user.md) |
| `users.search` | GET | `/user-search/{projectKey}/{environmentKey}` | [Find users](https://launchdarkly.com/docs/api/users/find-users.md) |

## Coverage and behavior

- The live OpenAPI document contains 417 operations. This is a curated 53-operation subset, not a wrapper for the entire LaunchDarkly API. Within the included resource groups, unsupported routes include bulk member/team edits; token reset/update; audit-log query/count POST; project flag-default, experimentation-settings, and experiment routes; context attribute reads, context-kind writes, and context evaluation; cross-environment flag status, flag copy, triggers, dependent flags, and expiring targets; segment context/user membership, imports/exports, expiring targets, and scheduled changes; team maintainer/role reads and CSV member imports; and user flag-setting/targeting routes. They are intentionally not exposed until their distinct request/response contracts have dedicated schemas and tests.
- Other OpenAPI groups are out of scope here, including approvals, AgentControl, experiments, data export, integrations, release plans, workflows, views, SDK-key beta routes, and account-usage beta routes. Deprecated, beta-only, multipart/import/export, and asynchronous routes are not silently represented as ordinary JSON endpoints.
- Webhooks are not implemented: this plugin exposes no incoming webhook endpoint, and the issue did not request webhook delivery. LaunchDarkly event/webhook subscription APIs are not the same thing as a verifiable webhook receiver contract.
- Requests authenticate with a personal or service access token in the `Authorization` header (the token itself, without a `Bearer` prefix) and explicitly send `LD-API-Version: 20240415`. SDK keys, mobile keys, client-side IDs, and session-cookie auth are not valid REST API credentials.
- The client currently uses the commercial default host, `https://app.launchdarkly.com`. EU (`app.eu.launchdarkly.com`) and Federal (`app.launchdarkly.us`) instances are documented by LaunchDarkly but are not configurable by this version of the plugin.
- Paginated operations forward the documented `limit`, `offset`, `searchAfter`, or context `continuationToken` inputs and preserve response `_links`; callers control subsequent pages. LaunchDarkly documents variable route/account/token rate limits, not fixed numeric quotas. A 429 uses `Retry-After` when present; the transport extracts it and the endpoint handler retries at most twice. Other writes are not retried after 5xx responses.
- The selected routes are synchronous JSON requests. No credit costs or idempotency-key contract are documented for these operations, so the client adds no idempotency header; long-running/polling workflows are outside this subset.
- JSON Patch operations are strict RFC 6902 variants. Team updates use the documented semantic-patch content type. Event logs retain counts/status only; propagated API errors omit request bodies, query values, dynamic paths, credentials, and provider error messages.

Official references: [REST API overview](https://launchdarkly.com/docs/api/overview.md), [complete OpenAPI spec](https://app.launchdarkly.com/api/v2/openapi.json).

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/launchdarkly

## License

Apache-2.0
