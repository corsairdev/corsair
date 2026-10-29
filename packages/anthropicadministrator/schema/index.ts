import {
	AnthropicAdministratorApiKey,
	AnthropicAdministratorInvite,
	AnthropicAdministratorUser,
	AnthropicAdministratorWorkspace,
	AnthropicAdministratorWorkspaceMember,
} from './database';

export const AnthropicAdministratorSchema = {
	version: '1.0.0',
	entities: {
		users: AnthropicAdministratorUser,
		invites: AnthropicAdministratorInvite,
		workspaces: AnthropicAdministratorWorkspace,
		workspaceMembers: AnthropicAdministratorWorkspaceMember,
		apiKeys: AnthropicAdministratorApiKey,
	},
} as const;
