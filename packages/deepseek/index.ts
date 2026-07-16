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
import { Anthropic, Balance, Chat, Models } from './endpoints';
import type {
	DeepseekEndpointInputs,
	DeepseekEndpointOutputs,
} from './endpoints/types';
import {
	DeepseekEndpointInputSchemas,
	DeepseekEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { DeepseekSchema } from './schema';

export type DeepseekPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalDeepseekPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof deepseekEndpointsNested>;
};

export type DeepseekContext = CorsairPluginContext<
	typeof DeepseekSchema,
	DeepseekPluginOptions
>;

export type DeepseekKeyBuilderContext =
	KeyBuilderContext<DeepseekPluginOptions>;

export type DeepseekBoundEndpoints = BindEndpoints<
	typeof deepseekEndpointsNested
>;

type DeepseekEndpoint<K extends keyof DeepseekEndpointOutputs> =
	CorsairEndpoint<
		DeepseekContext,
		DeepseekEndpointInputs[K],
		DeepseekEndpointOutputs[K]
	>;

export type DeepseekEndpoints = {
	chatCreateCompletion: DeepseekEndpoint<'chatCreateCompletion'>;
	anthropicCreateMessage: DeepseekEndpoint<'anthropicCreateMessage'>;
	userGetBalance: DeepseekEndpoint<'userGetBalance'>;
	modelsList: DeepseekEndpoint<'modelsList'>;
};

const deepseekEndpointsNested = {
	chat: {
		createCompletion: Chat.createCompletion,
	},
	anthropic: {
		createMessage: Anthropic.createMessage,
	},
	user: {
		getBalance: Balance.getBalance,
	},
	models: {
		list: Models.list,
	},
} as const;

export const deepseekEndpointSchemas = {
	'chat.createCompletion': {
		input: DeepseekEndpointInputSchemas.chatCreateCompletion,
		output: DeepseekEndpointOutputSchemas.chatCreateCompletion,
	},
	'anthropic.createMessage': {
		input: DeepseekEndpointInputSchemas.anthropicCreateMessage,
		output: DeepseekEndpointOutputSchemas.anthropicCreateMessage,
	},
	'user.getBalance': {
		input: DeepseekEndpointInputSchemas.userGetBalance,
		output: DeepseekEndpointOutputSchemas.userGetBalance,
	},
	'models.list': {
		input: DeepseekEndpointInputSchemas.modelsList,
		output: DeepseekEndpointOutputSchemas.modelsList,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof deepseekEndpointsNested
>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const deepseekEndpointMeta = {
	'chat.createCompletion': {
		riskLevel: 'write',
		description:
			'Generate an AI chat response using deepseek-chat or deepseek-reasoner, with support for temperature, tool calling, and structured output',
	},
	'anthropic.createMessage': {
		riskLevel: 'write',
		description:
			"Generate a response via DeepSeek's Anthropic-compatible Messages API, with support for system prompts, tool calling, and thinking mode",
	},
	'user.getBalance': {
		riskLevel: 'read',
		description:
			'Get the current account balance, including granted and topped-up amounts broken down by currency',
	},
	'models.list': {
		riskLevel: 'read',
		description: 'List the DeepSeek models currently available to the account',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof deepseekEndpointsNested>;

export const deepseekAuthConfig = {
	api_key: {
		account: ['one'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseDeepseekPlugin<T extends DeepseekPluginOptions> = CorsairPlugin<
	'deepseek',
	typeof DeepseekSchema,
	typeof deepseekEndpointsNested,
	{},
	T,
	typeof defaultAuthType,
	typeof deepseekAuthConfig
>;

export type InternalDeepseekPlugin = BaseDeepseekPlugin<DeepseekPluginOptions>;

export type ExternalDeepseekPlugin<T extends DeepseekPluginOptions> =
	BaseDeepseekPlugin<T>;

// The assertion is safe: DeepseekPluginOptions has no required fields (all are
// optional), so an empty object satisfies the constraint at runtime even
// though TypeScript cannot verify it without the assertion.
export function deepseek<const T extends DeepseekPluginOptions>(
	incomingOptions: DeepseekPluginOptions & T = {} as DeepseekPluginOptions & T,
): ExternalDeepseekPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};

	return {
		id: 'deepseek',
		schema: DeepseekSchema,
		options,
		hooks: options.hooks,
		endpoints: deepseekEndpointsNested,
		webhooks: {},
		endpointMeta: deepseekEndpointMeta,
		endpointSchemas: deepseekEndpointSchemas,
		authConfig: deepseekAuthConfig,
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
		keyBuilder: async (ctx: DeepseekKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const key = await ctx.keys.get_api_key();

				if (!key) {
					throw new AuthMissingError('deepseek', 'api_key');
				}

				return key;
			}

			throw new AuthMissingError('deepseek', 'api_key');
		},
	} satisfies InternalDeepseekPlugin;
}

export type {
	DeepseekEndpointInputs,
	DeepseekEndpointOutputs,
} from './endpoints/types';

export {
	DeepseekEndpointInputSchemas,
	DeepseekEndpointOutputSchemas,
} from './endpoints/types';
