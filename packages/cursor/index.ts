import type {
	AuthTypes,
	BindEndpoints,
	BindWebhooks,
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
import { Account, Agents, Models, Repositories } from './endpoints';
import type {
	AccountGetMeInput,
	AgentsGetConversationInput,
	AgentsListInput,
	CursorEndpointOutputs,
	ModelsListInput,
	RepositoriesListInput,
} from './endpoints/types';
import {
	CursorEndpointInputSchemas,
	CursorEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { CursorSchema } from './schema';

export type CursorPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	webhookSecret?: string;
	hooks?: InternalCursorPlugin['hooks'];
	webhookHooks?: InternalCursorPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	/**
	 * Permission configuration for the Cursor plugin.
	 * Controls what the AI agent is allowed to do.
	 * Overrides use dot-notation paths from the Cursor endpoint tree — invalid paths are type errors.
	 */
	permissions?: PluginPermissionsConfig<typeof cursorEndpointsNested>;
};

export type CursorContext = CorsairPluginContext<
	typeof CursorSchema,
	CursorPluginOptions
>;

export type CursorKeyBuilderContext = KeyBuilderContext<CursorPluginOptions>;

export type CursorBoundEndpoints = BindEndpoints<typeof cursorEndpointsNested>;

type CursorEndpoint<
	K extends keyof CursorEndpointOutputs,
	Input,
> = CorsairEndpoint<CursorContext, Input, CursorEndpointOutputs[K]>;

export type CursorEndpoints = {
	agentsList: CursorEndpoint<'agentsList', AgentsListInput>;
	agentsGetConversation: CursorEndpoint<
		'agentsGetConversation',
		AgentsGetConversationInput
	>;
	accountGetMe: CursorEndpoint<'accountGetMe', AccountGetMeInput>;
	modelsList: CursorEndpoint<'modelsList', ModelsListInput>;
	repositoriesList: CursorEndpoint<'repositoriesList', RepositoriesListInput>;
};

// Cursor has no webhook triggers; this type is kept for structural compatibility.
export type CursorWebhooks = Record<string, never>;

export type CursorBoundWebhooks = BindWebhooks<CursorWebhooks>;

const cursorEndpointsNested = {
	agents: {
		list: Agents.list,
		getConversation: Agents.getConversation,
	},
	account: {
		getMe: Account.getMe,
	},
	models: {
		list: Models.list,
	},
	repositories: {
		list: Repositories.list,
	},
} as const;

const cursorWebhooksNested = {} as const;

export const cursorEndpointSchemas = {
	'agents.list': {
		input: CursorEndpointInputSchemas.agentsList,
		output: CursorEndpointOutputSchemas.agentsList,
	},
	'agents.getConversation': {
		input: CursorEndpointInputSchemas.agentsGetConversation,
		output: CursorEndpointOutputSchemas.agentsGetConversation,
	},
	'account.getMe': {
		input: CursorEndpointInputSchemas.accountGetMe,
		output: CursorEndpointOutputSchemas.accountGetMe,
	},
	'models.list': {
		input: CursorEndpointInputSchemas.modelsList,
		output: CursorEndpointOutputSchemas.modelsList,
	},
	'repositories.list': {
		input: CursorEndpointInputSchemas.repositoriesList,
		output: CursorEndpointOutputSchemas.repositoriesList,
	},
} satisfies RequiredPluginEndpointSchemas<typeof cursorEndpointsNested>;

const defaultAuthType: AuthTypes = 'api_key' as const;

/**
 * Risk-level metadata for each endpoint.
 * Used by the MCP permission system and get_schema() for endpoint discovery.
 * Keys must be dot-paths matching the endpoint tree.
 */
const cursorEndpointMeta = {
	'agents.list': {
		riskLevel: 'read',
		description: 'Retrieve a paginated list of Cursor Cloud agents',
	},
	'agents.getConversation': {
		riskLevel: 'read',
		description: 'Retrieve the conversation history for a specific cloud agent',
	},
	'account.getMe': {
		riskLevel: 'read',
		description:
			'Retrieve API key information including name, creation date, and owner email',
	},
	'models.list': {
		riskLevel: 'read',
		description: 'Retrieve the list of available AI models in Cursor',
	},
	'repositories.list': {
		riskLevel: 'read',
		description:
			'List GitHub repositories accessible to the authenticated user',
	},
} satisfies RequiredPluginEndpointMeta<typeof cursorEndpointsNested>;

export const cursorAuthConfig = {
	api_key: {
		account: ['one'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseCursorPlugin<T extends CursorPluginOptions> = CorsairPlugin<
	'cursor',
	typeof CursorSchema,
	typeof cursorEndpointsNested,
	typeof cursorWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalCursorPlugin = BaseCursorPlugin<CursorPluginOptions>;

export type ExternalCursorPlugin<T extends CursorPluginOptions> =
	BaseCursorPlugin<T>;

export function cursor<const T extends CursorPluginOptions>(
	incomingOptions: CursorPluginOptions & T = {} as CursorPluginOptions & T,
): ExternalCursorPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'cursor',
		schema: CursorSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: cursorEndpointsNested,
		webhooks: cursorWebhooksNested,
		endpointMeta: cursorEndpointMeta,
		endpointSchemas: cursorEndpointSchemas,
		// Cursor defines no webhook triggers; always returns false.
		pluginWebhookMatcher: (_request) => false,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: CursorKeyBuilderContext, source) => {
			if (source === 'webhook' && options.webhookSecret) {
				return options.webhookSecret;
			}

			if (source === 'webhook') {
				const res = await ctx.keys.get_webhook_signature();
				if (!res) {
					return '';
				}
				return res;
			}

			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (!res) {
					return '';
				}
				return res;
			}

			return '';
		},
	} satisfies InternalCursorPlugin;
}

// ─────────────────────────────────────────────────────────────────────────────
// Webhook Type Exports
// ─────────────────────────────────────────────────────────────────────────────

export type { CursorWebhookOutputs } from './webhooks/types';

// ─────────────────────────────────────────────────────────────────────────────
// Endpoint Type Exports
// ─────────────────────────────────────────────────────────────────────────────

export type {
	AccountGetMeInput,
	AccountGetMeResponse,
	AgentsGetConversationInput,
	AgentsGetConversationResponse,
	AgentsListInput,
	AgentsListResponse,
	CursorEndpointInputs,
	CursorEndpointOutputs,
	ModelsListInput,
	ModelsListResponse,
	RepositoriesListInput,
	RepositoriesListResponse,
} from './endpoints/types';
