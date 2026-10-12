# @corsair-dev/anthropicadministrator

Anthropic Admin API plugin for Corsair — organization members, invites, workspaces and API keys, plus Messages, prompt caching and Models.

## Install

```bash
pnpm add @corsair-dev/anthropicadministrator
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `apiKeys.getApiKey` | `anthropicadministrator.api.apiKeys.getApiKey` | `read` | Get a single API key by ID |
| `apiKeys.listApiKeys` | `anthropicadministrator.api.apiKeys.listApiKeys` | `read` | List organization API keys, optionally filtered by status |
| `apiKeys.updateApiKey` | `anthropicadministrator.api.apiKeys.updateApiKey` | `write` | Rename an API key or change its active status |
| `invites.createInvite` | `anthropicadministrator.api.invites.createInvite` | `write` | Invite someone to the organization with a given role |
| `invites.deleteInvite` | `anthropicadministrator.api.invites.deleteInvite` | `destructive` | Delete a pending organization invite |
| `invites.getInvite` | `anthropicadministrator.api.invites.getInvite` | `read` | Get a single invite by ID |
| `invites.listInvites` | `anthropicadministrator.api.invites.listInvites` | `read` | List organization invites |
| `messages.createCachedMessage` | `anthropicadministrator.api.messages.createCachedMessage` | `write` | Create a Message with prompt caching, reusing the cached prompt prefix on later calls |
| `messages.createMessage` | `anthropicadministrator.api.messages.createMessage` | `write` | Send a conversation to a Claude model and get its reply (non-streaming) |
| `models.getModel` | `anthropicadministrator.api.models.getModel` | `read` | Get a model by ID or alias |
| `models.listModels` | `anthropicadministrator.api.models.listModels` | `read` | List available models, newest first, optionally filtered by lifecycle stage |
| `organization.getOrganization` | `anthropicadministrator.api.organization.getOrganization` | `read` | Get the organization associated with the Admin API key |
| `users.getUser` | `anthropicadministrator.api.users.getUser` | `read` | Get a single organization member by user ID |
| `users.listUsers` | `anthropicadministrator.api.users.listUsers` | `read` | List organization members, optionally filtered by email or role |
| `users.removeUser` | `anthropicadministrator.api.users.removeUser` | `destructive` | Remove a member from the organization |
| `users.updateUser` | `anthropicadministrator.api.users.updateUser` | `write` | Change an organization member's role |
| `workspaceMembers.createWorkspaceMember` | `anthropicadministrator.api.workspaceMembers.createWorkspaceMember` | `write` | Add an organization member to a workspace with a role |
| `workspaceMembers.deleteWorkspaceMember` | `anthropicadministrator.api.workspaceMembers.deleteWorkspaceMember` | `destructive` | Remove a member from a workspace |
| `workspaceMembers.getWorkspaceMember` | `anthropicadministrator.api.workspaceMembers.getWorkspaceMember` | `read` | Get a single workspace member |
| `workspaceMembers.listWorkspaceMembers` | `anthropicadministrator.api.workspaceMembers.listWorkspaceMembers` | `read` | List members of a workspace |
| `workspaceMembers.updateWorkspaceMember` | `anthropicadministrator.api.workspaceMembers.updateWorkspaceMember` | `write` | Change a workspace member's role |
| `workspaces.archiveWorkspace` | `anthropicadministrator.api.workspaces.archiveWorkspace` | `destructive` | Archive a workspace |
| `workspaces.createWorkspace` | `anthropicadministrator.api.workspaces.createWorkspace` | `write` | Create a workspace |
| `workspaces.getWorkspace` | `anthropicadministrator.api.workspaces.getWorkspace` | `read` | Get a single workspace by ID |
| `workspaces.listWorkspaces` | `anthropicadministrator.api.workspaces.listWorkspaces` | `read` | List workspaces, optionally including archived ones |
| `workspaces.updateWorkspace` | `anthropicadministrator.api.workspaces.updateWorkspace` | `write` | Update a workspace name, tags or data residency |

## Auth

Auth: API key, OAuth 2.0 (default API key). Set `authType` on the plugin factory to pick one.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/anthropicadministrator

## License

Apache-2.0
