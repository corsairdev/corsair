import type {
	AuthTypes,
	BindEndpoints,
	CorsairEndpoint,
	CorsairErrorHandler,
	CorsairPlugin,
	CorsairPluginContext,
	KeyBuilderContext,
	PickAuth,
	PluginAuthConfig,
	PluginPermissionsConfig,
	RequiredPluginEndpointMeta,
	RequiredPluginEndpointSchemas,
} from 'corsair/core';
import { AuthMissingError } from 'corsair/core';
import {
	ApiKeysEndpoints,
	InvitesEndpoints,
	OrganizationEndpoints,
	UsersEndpoints,
	WorkspaceMembersEndpoints,
	WorkspacesEndpoints,
} from './endpoints';
import type {
	AnthropicAdministratorEndpointInputs,
	AnthropicAdministratorEndpointOutputs,
} from './endpoints/types';
import {
	AnthropicAdministratorEndpointInputSchemas,
	AnthropicAdministratorEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { AnthropicAdministratorSchema } from './schema';

export type AnthropicAdministratorPluginOptions = {
	authType?: PickAuth<'api_key' | 'oauth_2'>;
	key?: string;
	hooks?: InternalAnthropicAdministratorPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<
		typeof anthropicAdministratorEndpointsNested
	>;
};

export type AnthropicAdministratorContext = CorsairPluginContext<
	typeof AnthropicAdministratorSchema,
	AnthropicAdministratorPluginOptions
>;

export type AnthropicAdministratorKeyBuilderContext =
	KeyBuilderContext<AnthropicAdministratorPluginOptions>;

export type AnthropicAdministratorBoundEndpoints = BindEndpoints<
	typeof anthropicAdministratorEndpointsNested
>;

type AnthropicAdministratorEndpoint<
	K extends keyof AnthropicAdministratorEndpointOutputs,
> = CorsairEndpoint<
	AnthropicAdministratorContext,
	AnthropicAdministratorEndpointInputs[K],
	AnthropicAdministratorEndpointOutputs[K]
>;

export type AnthropicAdministratorEndpoints = {
	[K in keyof AnthropicAdministratorEndpointOutputs]: AnthropicAdministratorEndpoint<K>;
};

const anthropicAdministratorEndpointsNested = {
	organization: OrganizationEndpoints,
	users: UsersEndpoints,
	invites: InvitesEndpoints,
	workspaces: WorkspacesEndpoints,
	workspaceMembers: WorkspaceMembersEndpoints,
	apiKeys: ApiKeysEndpoints,
} as const;

const anthropicAdministratorWebhooksNested = {} as const;

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
} satisfies RequiredPluginEndpointSchemas<
	typeof anthropicAdministratorEndpointsNested
>;

const defaultAuthType = 'api_key' as const;

const anthropicAdministratorEndpointMeta = {
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
} as const satisfies RequiredPluginEndpointMeta<
	typeof anthropicAdministratorEndpointsNested
>;

export const anthropicAdministratorAuthConfig = {
	api_key: {},
	oauth_2: {},
} as const satisfies PluginAuthConfig;

export type BaseAnthropicAdministratorPlugin<
	T extends AnthropicAdministratorPluginOptions,
> = CorsairPlugin<
	'anthropicadministrator',
	typeof AnthropicAdministratorSchema,
	typeof anthropicAdministratorEndpointsNested,
	typeof anthropicAdministratorWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalAnthropicAdministratorPlugin =
	BaseAnthropicAdministratorPlugin<AnthropicAdministratorPluginOptions>;

export type ExternalAnthropicAdministratorPlugin<
	T extends AnthropicAdministratorPluginOptions,
> = BaseAnthropicAdministratorPlugin<T>;

/**
 * Anthropic Admin API plugin — organization members, invites, workspaces,
 * workspace members and API keys.
 *
 * Requires an Admin API key (`sk-ant-admin…`) or an OAuth token with the
 * `org:admin` scope. A standard Anthropic API key is rejected by these
 * endpoints.
 */
export function anthropicadministrator<
	const T extends AnthropicAdministratorPluginOptions,
>(
	incomingOptions: AnthropicAdministratorPluginOptions &
		T = {} as AnthropicAdministratorPluginOptions & T,
): ExternalAnthropicAdministratorPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'anthropicadministrator',
		authConfig: anthropicAdministratorAuthConfig,
		schema: AnthropicAdministratorSchema,
		options,
		hooks: options.hooks,
		webhookHooks: undefined,
		endpoints: anthropicAdministratorEndpointsNested,
		webhooks: anthropicAdministratorWebhooksNested,
		endpointMeta: anthropicAdministratorEndpointMeta,
		endpointSchemas: anthropicAdministratorEndpointSchemas,
		pluginWebhookMatcher: undefined,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (
			ctx: AnthropicAdministratorKeyBuilderContext,
			source,
		) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (!res) {
					throw new AuthMissingError('anthropicadministrator', 'api_key');
				}
				return res;
			}

			if (source === 'endpoint' && ctx.authType === 'oauth_2') {
				const res = await ctx.keys.get_access_token();
				if (!res) {
					throw new AuthMissingError('anthropicadministrator', 'oauth_2');
				}
				return res;
			}

			// Never fall through with an empty credential: an empty key would be
			// sent as a real `x-api-key` header.
			throw new AuthMissingError('anthropicadministrator', 'api_key');
		},
	} satisfies InternalAnthropicAdministratorPlugin;
}

export {
	anthropicAdministratorEndpointsNested,
	AnthropicAdministratorEndpointInputSchemas,
	AnthropicAdministratorEndpointOutputSchemas,
};

export type {
	AnthropicAdministratorEndpointInputs,
	AnthropicAdministratorEndpointOutputs,
	ApiKey,
	Invite,
	Organization,
	User,
	Workspace,
	WorkspaceMember,
} from './endpoints/types';
