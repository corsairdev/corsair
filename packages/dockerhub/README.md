# @corsair-dev/dockerhub

Docker Hub plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/dockerhub
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `images.get` | `dockerhub.api.images.get` | `read` | Get image variant by digest |
| `images.list` | `dockerhub.api.images.list` | `read` | List platform image variants (from tags) |
| `organizations.addMember` | `dockerhub.api.organizations.addMember` | `write` | Invite a member to an organization (bulk invite API) |
| `organizations.create` | `dockerhub.api.organizations.create` | `write` | Create a Docker Hub organization |
| `organizations.delete` | `dockerhub.api.organizations.delete` | `destructive` | Delete an organization (idempotent) |
| `organizations.list` | `dockerhub.api.organizations.list` | `read` | List organizations for the authenticated user |
| `organizations.listAccessTokens` | `dockerhub.api.organizations.listAccessTokens` | `read` | List organization access tokens |
| `organizations.listMembers` | `dockerhub.api.organizations.listMembers` | `read` | List organization members |
| `organizations.removeMember` | `dockerhub.api.organizations.removeMember` | `destructive` | Remove a member from an organization |
| `repositories.create` | `dockerhub.api.repositories.create` | `write` | Create a repository under a namespace |
| `repositories.delete` | `dockerhub.api.repositories.delete` | `destructive` | Delete a repository (idempotent) |
| `repositories.get` | `dockerhub.api.repositories.get` | `read` | Get repository metadata |
| `repositories.list` | `dockerhub.api.repositories.list` | `read` | List repositories under a namespace |
| `tags.delete` | `dockerhub.api.tags.delete` | `destructive` | Delete a repository tag |
| `tags.get` | `dockerhub.api.tags.get` | `read` | Get a specific repository tag |
| `tags.list` | `dockerhub.api.tags.list` | `read` | List tags for a repository |
| `teams.delete` | `dockerhub.api.teams.delete` | `destructive` | Delete a team (idempotent) |
| `teams.get` | `dockerhub.api.teams.get` | `read` | Get team details |
| `teams.list` | `dockerhub.api.teams.list` | `read` | List teams (groups) in an organization |
| `teams.listMembers` | `dockerhub.api.teams.listMembers` | `read` | List team members |
| `teams.removeMember` | `dockerhub.api.teams.removeMember` | `destructive` | Remove a member from a team |
| `webhooks.create` | `dockerhub.api.webhooks.create` | `write` | Create a repository webhook with hook URL |
| `webhooks.delete` | `dockerhub.api.webhooks.delete` | `destructive` | Delete a repository webhook |
| `webhooks.get` | `dockerhub.api.webhooks.get` | `read` | Get a repository webhook |
| `webhooks.list` | `dockerhub.api.webhooks.list` | `read` | List repository webhooks |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/dockerhub

## License

Apache-2.0
