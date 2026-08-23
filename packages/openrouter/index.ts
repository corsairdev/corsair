import type {
	AuthTypes,
	BindEndpoints,
	CorsairEndpoint,
	CorsairErrorHandler,
	CorsairPlugin,
	CorsairPluginContext,
	KeyBuilderContext,
	PickAuth,
	PluginPermissionsConfig,
	RequiredPluginEndpointMeta,
	RequiredPluginEndpointSchemas,
} from 'corsair/core';
import { AuthMissingError } from 'corsair/core';
import {
	ChatCompletions,
	Credits,
	Embeddings,
	Generations,
	Key,
	Messages,
	ModelEndpoints,
	Models,
	Providers,
	Zdr,
} from './endpoints';
import type {
	OpenRouterEndpointInputs,
	OpenRouterEndpointOutputs,
} from './endpoints/types';
import {
	OpenRouterEndpointInputSchemas,
	OpenRouterEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { OpenrouterSchema } from './schema';

export type OpenRouterPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalOpenrouterPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof openrouterEndpointsNested>;
};

export type OpenrouterContext = CorsairPluginContext<
	typeof OpenrouterSchema,
	OpenRouterPluginOptions
>;

export type OpenrouterKeyBuilderContext =
	KeyBuilderContext<OpenRouterPluginOptions>;

export type OpenrouterBoundEndpoints = BindEndpoints<
	typeof openrouterEndpointsNested
>;

type OpenrouterEndpoint<K extends keyof OpenRouterEndpointOutputs> =
	CorsairEndpoint<
		OpenrouterContext,
		OpenRouterEndpointInputs[K],
		OpenRouterEndpointOutputs[K]
	>;

export type OpenRouterEndpoints = {
	chatCompletionsCreate: OpenrouterEndpoint<'chatCompletionsCreate'>;
	messagesCreate: OpenrouterEndpoint<'messagesCreate'>;
	modelsList: OpenrouterEndpoint<'modelsList'>;
	modelsCount: OpenrouterEndpoint<'modelsCount'>;
	modelsEmbeddingsList: OpenrouterEndpoint<'modelsEmbeddingsList'>;
	modelsUserList: OpenrouterEndpoint<'modelsUserList'>;
	embeddingsCreate: OpenrouterEndpoint<'embeddingsCreate'>;
	modelsEndpointsList: OpenrouterEndpoint<'modelsEndpointsList'>;
	providersList: OpenrouterEndpoint<'providersList'>;
	zdrEndpointsList: OpenrouterEndpoint<'zdrEndpointsList'>;
	generationsGet: OpenrouterEndpoint<'generationsGet'>;
	creditsList: OpenrouterEndpoint<'creditsList'>;
	keyGet: OpenrouterEndpoint<'keyGet'>;
};

const openrouterEndpointsNested = {
	chatCompletions: {
		create: ChatCompletions.createChatCompletion,
	},
	messages: {
		create: Messages.createAnthropicMessage,
	},
	models: {
		list: Models.listModels,
		count: Models.listModelsCount,
		listEmbeddings: Models.listEmbeddingModels,
		listUser: Models.listUserModels,
	},
	embeddings: {
		create: Embeddings.createEmbedding,
	},
	modelEndpoints: {
		list: ModelEndpoints.listModelEndpoints,
	},
	providers: {
		list: Providers.listProviders,
	},
	generations: {
		get: Generations.getGeneration,
	},
	credits: {
		list: Credits.listCredits,
	},
	key: {
		get: Key.getKey,
	},
	zdr: {
		list: Zdr.listZdrEndpoints,
	},
} as const;

export const openrouterEndpointSchemas = {
	'chatCompletions.create': {
		input: OpenRouterEndpointInputSchemas.chatCompletionsCreate,
		output: OpenRouterEndpointOutputSchemas.chatCompletionsCreate,
	},
	'messages.create': {
		input: OpenRouterEndpointInputSchemas.messagesCreate,
		output: OpenRouterEndpointOutputSchemas.messagesCreate,
	},
	'models.list': {
		input: OpenRouterEndpointInputSchemas.modelsList,
		output: OpenRouterEndpointOutputSchemas.modelsList,
	},
	'models.count': {
		input: OpenRouterEndpointInputSchemas.modelsCount,
		output: OpenRouterEndpointOutputSchemas.modelsCount,
	},
	'models.listEmbeddings': {
		input: OpenRouterEndpointInputSchemas.modelsEmbeddingsList,
		output: OpenRouterEndpointOutputSchemas.modelsEmbeddingsList,
	},
	'models.listUser': {
		input: OpenRouterEndpointInputSchemas.modelsUserList,
		output: OpenRouterEndpointOutputSchemas.modelsUserList,
	},
	'embeddings.create': {
		input: OpenRouterEndpointInputSchemas.embeddingsCreate,
		output: OpenRouterEndpointOutputSchemas.embeddingsCreate,
	},
	'modelEndpoints.list': {
		input: OpenRouterEndpointInputSchemas.modelsEndpointsList,
		output: OpenRouterEndpointOutputSchemas.modelsEndpointsList,
	},
	'providers.list': {
		input: OpenRouterEndpointInputSchemas.providersList,
		output: OpenRouterEndpointOutputSchemas.providersList,
	},
	'generations.get': {
		input: OpenRouterEndpointInputSchemas.generationsGet,
		output: OpenRouterEndpointOutputSchemas.generationsGet,
	},
	'credits.list': {
		input: OpenRouterEndpointInputSchemas.creditsList,
		output: OpenRouterEndpointOutputSchemas.creditsList,
	},
	'key.get': {
		input: OpenRouterEndpointInputSchemas.keyGet,
		output: OpenRouterEndpointOutputSchemas.keyGet,
	},
	'zdr.list': {
		input: OpenRouterEndpointInputSchemas.zdrEndpointsList,
		output: OpenRouterEndpointOutputSchemas.zdrEndpointsList,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof openrouterEndpointsNested
>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const openrouterEndpointMeta = {
	'chatCompletions.create': {
		riskLevel: 'write',
		description:
			'Generate an AI response via OpenRouter with automatic multi-provider routing, retries, and fallbacks; supports tool calling, structured output, reasoning, and provider/route overrides',
	},
	'messages.create': {
		riskLevel: 'write',
		description:
			"Create a message via OpenRouter's Anthropic Messages API, with support for system prompts and multi-part content",
	},
	'models.list': {
		riskLevel: 'read',
		description:
			'List all models available on OpenRouter, including pricing, context length, and supported parameters',
	},
	'models.count': {
		riskLevel: 'read',
		description: 'Get the total count of models available on OpenRouter',
	},
	'models.listEmbeddings': {
		riskLevel: 'read',
		description: 'List all embedding models available on OpenRouter',
	},
	'models.listUser': {
		riskLevel: 'read',
		description:
			'List models filtered by the authenticated user’s provider preferences, privacy settings, and guardrails',
	},
	'embeddings.create': {
		riskLevel: 'write',
		description:
			'Generate vector embeddings for one or more input strings using a supported embedding model',
	},
	'modelEndpoints.list': {
		riskLevel: 'read',
		description:
			'List the individual endpoints serving a model, with per-provider pricing, latency, and throughput',
	},
	'providers.list': {
		riskLevel: 'read',
		description:
			'List the providers available on OpenRouter with their privacy policies and data-center regions',
	},
	'generations.get': {
		riskLevel: 'read',
		description:
			'Fetch request and usage metadata for a previous generation by its ID',
	},
	'credits.list': {
		riskLevel: 'read',
		description:
			'Get the account credit balance and usage with a management API key',
	},
	'key.get': {
		riskLevel: 'read',
		description:
			'Get metadata about the current API key, including usage, limits, and rate limits',
	},
	'zdr.list': {
		riskLevel: 'read',
		description:
			'List the Zero-Data Residency (ZDR) endpoint specification for the account',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof openrouterEndpointsNested
>;

export type BaseOpenrouterPlugin<T extends OpenRouterPluginOptions> =
	CorsairPlugin<
		'openrouter',
		typeof OpenrouterSchema,
		typeof openrouterEndpointsNested,
		{},
		T,
		typeof defaultAuthType
	>;

export type InternalOpenrouterPlugin =
	BaseOpenrouterPlugin<OpenRouterPluginOptions>;

export type ExternalOpenrouterPlugin<T extends OpenRouterPluginOptions> =
	BaseOpenrouterPlugin<T>;

// The assertion is safe: OpenRouterPluginOptions has no required fields (all
// are optional), so an empty object satisfies the constraint at runtime even
// though TypeScript cannot verify it without the assertion.
export function openrouter<const T extends OpenRouterPluginOptions>(
	incomingOptions: OpenRouterPluginOptions & T = {} as OpenRouterPluginOptions &
		T,
): ExternalOpenrouterPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};

	return {
		id: 'openrouter',
		schema: OpenrouterSchema,
		options,
		hooks: options.hooks,
		endpoints: openrouterEndpointsNested,
		webhooks: {},
		endpointMeta: openrouterEndpointMeta,
		endpointSchemas: openrouterEndpointSchemas,
		pluginWebhookMatcher: () => false,
		errorHandlers: (() => {
			// DEFAULT matches everything (`() => true`), so it must always be last.
			const { DEFAULT: defaultHandler, ...specificDefaults } = errorHandlers;
			return {
				...specificDefaults,
				...(options.errorHandlers || {}),
				DEFAULT: options.errorHandlers?.DEFAULT || defaultHandler,
			};
		})(),
		keyBuilder: async (ctx: OpenrouterKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const key = await ctx.keys.get_api_key();

				if (!key) {
					throw new AuthMissingError('openrouter', 'api_key');
				}

				return key;
			}

			throw new AuthMissingError('openrouter', 'api_key');
		},
	} satisfies InternalOpenrouterPlugin;
}

export type {
	OpenRouterEndpointInputs,
	OpenRouterEndpointOutputs,
} from './endpoints/types';

export {
	OpenRouterEndpointInputSchemas,
	OpenRouterEndpointOutputSchemas,
} from './endpoints/types';
