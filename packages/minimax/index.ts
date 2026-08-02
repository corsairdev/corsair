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
import { Anthropic, Chat, Models } from './endpoints';
import type { MiniMaxEndpointInputs, MiniMaxEndpointOutputs } from './endpoints/types';
import { MiniMaxEndpointInputSchemas, MiniMaxEndpointOutputSchemas } from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { MiniMaxSchema } from './schema';

export type MiniMaxPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	region?: import('./config').MiniMaxRegion;
	openaiBaseUrl?: string;
	anthropicBaseUrl?: string;
	hooks?: InternalMiniMaxPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof miniMaxEndpointsNested>;
};

export type MiniMaxContext = CorsairPluginContext<typeof MiniMaxSchema, MiniMaxPluginOptions>;
export type MiniMaxKeyBuilderContext = KeyBuilderContext<MiniMaxPluginOptions>;
export type MiniMaxBoundEndpoints = BindEndpoints<typeof miniMaxEndpointsNested>;

type MiniMaxEndpoint<K extends keyof MiniMaxEndpointOutputs> = CorsairEndpoint<
	MiniMaxContext,
	MiniMaxEndpointInputs[K],
	MiniMaxEndpointOutputs[K]
>;

export type MiniMaxEndpoints = {
	chatCreateCompletion: MiniMaxEndpoint<'chatCreateCompletion'>;
	anthropicCreateMessage: MiniMaxEndpoint<'anthropicCreateMessage'>;
	modelsList: MiniMaxEndpoint<'modelsList'>;
};

const miniMaxEndpointsNested = {
	chat: { createCompletion: Chat.createCompletion },
	anthropic: { createMessage: Anthropic.createMessage },
	models: { list: Models.list },
} as const;

export const miniMaxEndpointSchemas = {
	'chat.createCompletion': {
		input: MiniMaxEndpointInputSchemas.chatCreateCompletion,
		output: MiniMaxEndpointOutputSchemas.chatCreateCompletion,
	},
	'anthropic.createMessage': {
		input: MiniMaxEndpointInputSchemas.anthropicCreateMessage,
		output: MiniMaxEndpointOutputSchemas.anthropicCreateMessage,
	},
	'models.list': {
		input: MiniMaxEndpointInputSchemas.modelsList,
		output: MiniMaxEndpointOutputSchemas.modelsList,
	},
} as const satisfies RequiredPluginEndpointSchemas<typeof miniMaxEndpointsNested>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const miniMaxEndpointMeta = {
	'chat.createCompletion': {
		riskLevel: 'write',
		description: 'Generate an AI chat response with MiniMax-M3 or MiniMax-M2.7.',
	},
	'anthropic.createMessage': {
		riskLevel: 'write',
		description: "Generate a response via MiniMax's Anthropic-compatible Messages API.",
	},
	'models.list': {
		riskLevel: 'read',
		description: 'List the MiniMax models currently available to the account',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof miniMaxEndpointsNested>;

export const miniMaxAuthConfig = {
	api_key: { account: ['tenant_external_id'] as const },
} as const satisfies PluginAuthConfig;

export type BaseMiniMaxPlugin<T extends MiniMaxPluginOptions> = CorsairPlugin<
	'minimax',
	typeof MiniMaxSchema,
	typeof miniMaxEndpointsNested,
	{},
	T,
	typeof defaultAuthType,
	typeof miniMaxAuthConfig
>;

export type InternalMiniMaxPlugin = BaseMiniMaxPlugin<MiniMaxPluginOptions>;
export type ExternalMiniMaxPlugin<T extends MiniMaxPluginOptions> = BaseMiniMaxPlugin<T>;

export function minimax<const T extends MiniMaxPluginOptions>(
	incomingOptions: MiniMaxPluginOptions & T = {} as MiniMaxPluginOptions & T,
): ExternalMiniMaxPlugin<T> {
	const options = { ...incomingOptions, authType: incomingOptions.authType ?? defaultAuthType };

	return {
		id: 'minimax',
		schema: MiniMaxSchema,
		options,
		hooks: options.hooks,
		endpoints: miniMaxEndpointsNested,
		webhooks: {},
		endpointMeta: miniMaxEndpointMeta,
		endpointSchemas: miniMaxEndpointSchemas,
		authConfig: miniMaxAuthConfig,
		pluginWebhookMatcher: () => false,
		errorHandlers: (() => {
			const { DEFAULT: defaultHandler, ...specificDefaults } = errorHandlers;
			return { ...specificDefaults, ...(options.errorHandlers || {}), DEFAULT: options.errorHandlers?.DEFAULT || defaultHandler };
		})(),
		keyBuilder: async (ctx: MiniMaxKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) return options.key;
			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const key = await ctx.keys.get_api_key();
				if (!key) {
					throw new AuthMissingError('minimax', 'api_key');
				}
				return key;
			}
			throw new AuthMissingError('minimax', 'api_key');
		},
	} satisfies InternalMiniMaxPlugin;
}

export type { MiniMaxEndpointInputs, MiniMaxEndpointOutputs } from './endpoints/types';
export { MiniMaxEndpointInputSchemas, MiniMaxEndpointOutputSchemas } from './endpoints/types';
export { MINIMAX_MODEL_CONFIG, MINIMAX_REGION_ENDPOINTS, MINIMAX_SUPPORTED_MODEL_IDS, resolveMiniMaxBaseUrls } from './config';