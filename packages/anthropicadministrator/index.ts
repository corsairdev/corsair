import type {
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
	MessagesEndpoints,
	ModelsEndpoints,
	OrganizationEndpoints,
	UsersEndpoints,
	WorkspaceMembersEndpoints,
	WorkspacesEndpoints,
} from './endpoints';
import type {
	AnthropicAdministratorEndpointInputs,
	AnthropicAdministratorEndpointOutputs,
} from './endpoints/types/index';
import {
	AnthropicAdministratorEndpointInputSchemas,
	AnthropicAdministratorEndpointOutputSchemas,
} from './endpoints/types/index';
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
	messages: MessagesEndpoints,
	models: ModelsEndpoints,
} as const;

const anthropicAdministratorWebhooksNested = {} as const;

import { anthropicAdministratorEndpointSchemas } from './meta';
import { anthropicAdministratorEndpointMeta } from './meta-descriptions';

const defaultAuthType = 'api_key' as const;

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
		endpointMeta:
			anthropicAdministratorEndpointMeta satisfies RequiredPluginEndpointMeta<
				typeof anthropicAdministratorEndpointsNested
			>,
		webhooks: anthropicAdministratorWebhooksNested,
		endpointSchemas:
			anthropicAdministratorEndpointSchemas satisfies RequiredPluginEndpointSchemas<
				typeof anthropicAdministratorEndpointsNested
			>,
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
	Message,
	Model,
	Organization,
	User,
	Workspace,
	WorkspaceMember,
} from './endpoints/types/index';
