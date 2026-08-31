import type { RequiredPluginEndpointMeta } from 'corsair/core';
import type { anthropicAdministratorEndpointsNested } from './index';

export const anthropicAdministratorEndpointMeta = {
	'organization.getOrganization': {
		riskLevel: 'read',
		description: 'Get the current organization',
	},
	'users.listUsers': {
		riskLevel: 'read',
		description: 'List users',
	},
	'users.getUser': {
		riskLevel: 'read',
		description: 'Get a user',
	},
	'users.updateUser': {
		riskLevel: 'write',
		description: 'Update a user',
	},
	'users.removeUser': {
		riskLevel: 'destructive',
		description: 'Remove a user',
		irreversible: true,
	},
	'invites.listInvites': {
		riskLevel: 'read',
		description: 'List invites',
	},
	'invites.createInvite': {
		riskLevel: 'write',
		description: 'Create an invite',
	},
	'invites.getInvite': {
		riskLevel: 'read',
		description: 'Get an invite',
	},
	'invites.deleteInvite': {
		riskLevel: 'destructive',
		description: 'Delete an invite',
		irreversible: true,
	},
	'workspaces.listWorkspaces': {
		riskLevel: 'read',
		description: 'List workspaces',
	},
	'workspaces.createWorkspace': {
		riskLevel: 'write',
		description: 'Create a workspace',
	},
	'workspaces.getWorkspace': {
		riskLevel: 'read',
		description: 'Get a workspace',
	},
	'workspaces.updateWorkspace': {
		riskLevel: 'write',
		description: 'Update a workspace',
	},
	'workspaces.archiveWorkspace': {
		riskLevel: 'destructive',
		description: 'Archive a workspace',
		irreversible: true,
	},
	'workspaceMembers.listWorkspaceMembers': {
		riskLevel: 'read',
		description: 'List workspace members',
	},
	'workspaceMembers.createWorkspaceMember': {
		riskLevel: 'write',
		description: 'Add a user to a workspace',
	},
	'workspaceMembers.getWorkspaceMember': {
		riskLevel: 'read',
		description: 'Get a workspace member',
	},
	'workspaceMembers.updateWorkspaceMember': {
		riskLevel: 'write',
		description: 'Update a workspace member',
	},
	'workspaceMembers.deleteWorkspaceMember': {
		riskLevel: 'destructive',
		description: 'Remove a user from a workspace',
		irreversible: true,
	},
	'apiKeys.listApiKeys': {
		riskLevel: 'read',
		description: 'List API keys',
	},
	'apiKeys.getApiKey': {
		riskLevel: 'read',
		description: 'Get an API key',
	},
	'apiKeys.updateApiKey': {
		riskLevel: 'write',
		description: 'Rename an API key or change its active status',
	},
	'messages.createMessage': {
		riskLevel: 'write',
		description: 'Create a Message',
	},
	'models.getModel': {
		riskLevel: 'read',
		description: 'Get a Model',
	},
	'models.listModels': {
		riskLevel: 'read',
		description: 'List Models',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof anthropicAdministratorEndpointsNested
>;
