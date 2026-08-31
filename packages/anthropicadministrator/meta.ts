import type {
	RequiredPluginEndpointMeta,
	RequiredPluginEndpointSchemas,
} from 'corsair/core';
import {
	AnthropicAdministratorEndpointInputSchemas,
	AnthropicAdministratorEndpointOutputSchemas,
} from './endpoints/types/index';
import type { anthropicAdministratorEndpointsNested } from './index';

export const anthropicAdministratorEndpointSchemas = {
	'organization.getOrganization': {
		input: AnthropicAdministratorEndpointInputSchemas.getOrganization,
		output: AnthropicAdministratorEndpointOutputSchemas.getOrganization,
	},
	'users.listUsers': {
		input: AnthropicAdministratorEndpointInputSchemas.listUsers,
		output: AnthropicAdministratorEndpointOutputSchemas.listUsers,
	},
	'users.getUser': {
		input: AnthropicAdministratorEndpointInputSchemas.getUser,
		output: AnthropicAdministratorEndpointOutputSchemas.getUser,
	},
	'users.updateUser': {
		input: AnthropicAdministratorEndpointInputSchemas.updateUser,
		output: AnthropicAdministratorEndpointOutputSchemas.updateUser,
	},
	'users.removeUser': {
		input: AnthropicAdministratorEndpointInputSchemas.removeUser,
		output: AnthropicAdministratorEndpointOutputSchemas.removeUser,
	},
	'invites.listInvites': {
		input: AnthropicAdministratorEndpointInputSchemas.listInvites,
		output: AnthropicAdministratorEndpointOutputSchemas.listInvites,
	},
	'invites.createInvite': {
		input: AnthropicAdministratorEndpointInputSchemas.createInvite,
		output: AnthropicAdministratorEndpointOutputSchemas.createInvite,
	},
	'invites.getInvite': {
		input: AnthropicAdministratorEndpointInputSchemas.getInvite,
		output: AnthropicAdministratorEndpointOutputSchemas.getInvite,
	},
	'invites.deleteInvite': {
		input: AnthropicAdministratorEndpointInputSchemas.deleteInvite,
		output: AnthropicAdministratorEndpointOutputSchemas.deleteInvite,
	},
	'workspaces.listWorkspaces': {
		input: AnthropicAdministratorEndpointInputSchemas.listWorkspaces,
		output: AnthropicAdministratorEndpointOutputSchemas.listWorkspaces,
	},
	'workspaces.createWorkspace': {
		input: AnthropicAdministratorEndpointInputSchemas.createWorkspace,
		output: AnthropicAdministratorEndpointOutputSchemas.createWorkspace,
	},
	'workspaces.getWorkspace': {
		input: AnthropicAdministratorEndpointInputSchemas.getWorkspace,
		output: AnthropicAdministratorEndpointOutputSchemas.getWorkspace,
	},
	'workspaces.updateWorkspace': {
		input: AnthropicAdministratorEndpointInputSchemas.updateWorkspace,
		output: AnthropicAdministratorEndpointOutputSchemas.updateWorkspace,
	},
	'workspaces.archiveWorkspace': {
		input: AnthropicAdministratorEndpointInputSchemas.archiveWorkspace,
		output: AnthropicAdministratorEndpointOutputSchemas.archiveWorkspace,
	},
	'workspaceMembers.listWorkspaceMembers': {
		input: AnthropicAdministratorEndpointInputSchemas.listWorkspaceMembers,
		output: AnthropicAdministratorEndpointOutputSchemas.listWorkspaceMembers,
	},
	'workspaceMembers.createWorkspaceMember': {
		input: AnthropicAdministratorEndpointInputSchemas.createWorkspaceMember,
		output: AnthropicAdministratorEndpointOutputSchemas.createWorkspaceMember,
	},
	'workspaceMembers.getWorkspaceMember': {
		input: AnthropicAdministratorEndpointInputSchemas.getWorkspaceMember,
		output: AnthropicAdministratorEndpointOutputSchemas.getWorkspaceMember,
	},
	'workspaceMembers.updateWorkspaceMember': {
		input: AnthropicAdministratorEndpointInputSchemas.updateWorkspaceMember,
		output: AnthropicAdministratorEndpointOutputSchemas.updateWorkspaceMember,
	},
	'workspaceMembers.deleteWorkspaceMember': {
		input: AnthropicAdministratorEndpointInputSchemas.deleteWorkspaceMember,
		output: AnthropicAdministratorEndpointOutputSchemas.deleteWorkspaceMember,
	},
	'apiKeys.listApiKeys': {
		input: AnthropicAdministratorEndpointInputSchemas.listApiKeys,
		output: AnthropicAdministratorEndpointOutputSchemas.listApiKeys,
	},
	'apiKeys.getApiKey': {
		input: AnthropicAdministratorEndpointInputSchemas.getApiKey,
		output: AnthropicAdministratorEndpointOutputSchemas.getApiKey,
	},
	'apiKeys.updateApiKey': {
		input: AnthropicAdministratorEndpointInputSchemas.updateApiKey,
		output: AnthropicAdministratorEndpointOutputSchemas.updateApiKey,
	},
	'messages.createMessage': {
		input: AnthropicAdministratorEndpointInputSchemas.createMessage,
		output: AnthropicAdministratorEndpointOutputSchemas.createMessage,
	},
	'models.getModel': {
		input: AnthropicAdministratorEndpointInputSchemas.getModel,
		output: AnthropicAdministratorEndpointOutputSchemas.getModel,
	},
	'models.listModels': {
		input: AnthropicAdministratorEndpointInputSchemas.listModels,
		output: AnthropicAdministratorEndpointOutputSchemas.listModels,
	},
} satisfies RequiredPluginEndpointSchemas<
	typeof anthropicAdministratorEndpointsNested
>;
