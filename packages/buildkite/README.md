# @corsair-dev/buildkite

Buildkite plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/buildkite
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `getCurrentAccessToken` | `buildkite.api.getCurrentAccessToken` | `read` | Retrieve the authenticated API access token details. Use when you need to confirm the validity and scopes of the current API token. |
| `getMeta` | `buildkite.api.getMeta` | `read` | Retrieve metadata about the Buildkite API. Use when you need to fetch webhook IP addresses for firewall or security configurations. |
| `getUser` | `buildkite.api.getUser` | `read` | Retrieve details about the current authenticated user. Use when you need to get information about the user account that owns the API token. |
| `listOrganizations` | `buildkite.api.listOrganizations` | `read` | List all organizations the current user is a member of. Use when you need to discover available organizations or get organization slugs for other operations. |
| `listPipelineAgents` | `buildkite.api.listPipelineAgents` | `read` | List connected agents for an organization. Use after confirming the organization slug. Supports optional filtering and pagination. |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/buildkite

## License

Apache-2.0
