import type { RequiredPluginEndpointMeta } from 'corsair/core';
import type { anthropicAdministratorEndpointsNested } from './index';

export const anthropicAdministratorEndpointMeta = {
	'organization.getOrganization': {
		riskLevel: 'read',
		description: 'Get the organization associated with the Admin API key',
	},
	'users.listUsers': {
		riskLevel: 'read',
		description:
			'List organization members, optionally filtered by email or role',
	},
	'users.getUser': {
		riskLevel: 'read',
		description: 'Get a single organization member by user ID',
	},
	'users.updateUser': {
		riskLevel: 'write',
		description: "Change an organization member's role",
	},
	'users.removeUser': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Remove a member from the organization',
	},
	'invites.listInvites': {
		riskLevel: 'read',
		description: 'List organization invites',
	},
	'invites.createInvite': {
		riskLevel: 'write',
		description: 'Invite someone to the organization with a given role',
	},
	'invites.getInvite': {
		riskLevel: 'read',
		description: 'Get a single invite by ID',
	},
	'invites.deleteInvite': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a pending organization invite',
	},
	'workspaces.listWorkspaces': {
		riskLevel: 'read',
		description: 'List workspaces, optionally including archived ones',
	},
	'workspaces.createWorkspace': {
		riskLevel: 'write',
		description: 'Create a workspace',
	},
	'workspaces.getWorkspace': {
		riskLevel: 'read',
		description: 'Get a single workspace by ID',
	},
	'workspaces.updateWorkspace': {
		riskLevel: 'write',
		description: 'Update a workspace name, tags or data residency',
	},
	'workspaces.archiveWorkspace': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Archive a workspace',
	},
	'workspaceMembers.listWorkspaceMembers': {
		riskLevel: 'read',
		description: 'List members of a workspace',
	},
	'workspaceMembers.createWorkspaceMember': {
		riskLevel: 'write',
		description: 'Add an organization member to a workspace with a role',
	},
	'workspaceMembers.getWorkspaceMember': {
		riskLevel: 'read',
		description: 'Get a single workspace member',
	},
	'workspaceMembers.updateWorkspaceMember': {
		riskLevel: 'write',
		description: "Change a workspace member's role",
	},
	'workspaceMembers.deleteWorkspaceMember': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Remove a member from a workspace',
	},
	'apiKeys.listApiKeys': {
		riskLevel: 'read',
		description: 'List organization API keys, optionally filtered by status',
	},
	'apiKeys.getApiKey': {
		riskLevel: 'read',
		description: 'Get a single API key by ID',
	},
	'apiKeys.updateApiKey': {
		riskLevel: 'write',
		description: 'Rename an API key or change its active status',
	},
	'messages.createMessage': {
		riskLevel: 'write',
		description:
			'Send a conversation to a Claude model and get its reply (non-streaming)',
	},
	'messages.createCachedMessage': {
		riskLevel: 'write',
		description:
			'Create a Message with prompt caching, reusing the cached prompt prefix on later calls',
	},
	'models.getModel': {
		riskLevel: 'read',
		description: 'Get a model by ID or alias',
	},
	'models.listModels': {
		riskLevel: 'read',
		description:
			'List available models, newest first, optionally filtered by lifecycle stage',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof anthropicAdministratorEndpointsNested
>;
