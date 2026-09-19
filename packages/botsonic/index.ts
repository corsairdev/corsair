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
import { GenerateResponse, GetAllFaqs } from './endpoints';
import type {
	BotsonicEndpointInputs,
	BotsonicEndpointOutputs,
} from './endpoints/types';
import {
	BotsonicEndpointInputSchemas,
	BotsonicEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { BotsonicSchema } from './schema';

export type BotsonicPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalBotsonicPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof botsonicEndpointsNested>;
};

export type BotsonicContext = CorsairPluginContext<
	typeof BotsonicSchema,
	BotsonicPluginOptions
>;

export type BotsonicKeyBuilderContext =
	KeyBuilderContext<BotsonicPluginOptions>;

export type BotsonicBoundEndpoints = BindEndpoints<
	typeof botsonicEndpointsNested
>;

type BotsonicEndpoint<K extends keyof BotsonicEndpointOutputs> =
	CorsairEndpoint<
		BotsonicContext,
		BotsonicEndpointInputs[K],
		BotsonicEndpointOutputs[K]
	>;

export type BotsonicEndpoints = {
	generateResponse: BotsonicEndpoint<'generateResponse'>;
	getAllFaqs: BotsonicEndpoint<'getAllFaqs'>;
};

const botsonicEndpointsNested = {
	generateResponse: {
		post: GenerateResponse.post,
	},
	getAllFaqs: {
		get: GetAllFaqs.get,
	},
} as const;

export const botsonicEndpointSchemas = {
	'generateResponse.post': {
		input: BotsonicEndpointInputSchemas.generateResponse,
		output: BotsonicEndpointOutputSchemas.generateResponse,
	},
	'getAllFaqs.get': {
		input: BotsonicEndpointInputSchemas.getAllFaqs,
		output: BotsonicEndpointOutputSchemas.getAllFaqs,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof botsonicEndpointsNested
>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const botsonicEndpointMeta = {
	'generateResponse.post': {
		riskLevel: 'write',
		description: 'Generate a response from a Botsonic chatbot',
	},
	'getAllFaqs.get': {
		riskLevel: 'read',
		description: 'Retrieve all FAQs for a Botsonic bot',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof botsonicEndpointsNested>;

export const botsonicAuthConfig = {
	api_key: {},
} as const satisfies PluginAuthConfig;

export type BaseBotsonicPlugin<T extends BotsonicPluginOptions> = CorsairPlugin<
	'botsonic',
	typeof BotsonicSchema,
	typeof botsonicEndpointsNested,
	Record<string, never>,
	T,
	typeof defaultAuthType
>;

export type InternalBotsonicPlugin = BaseBotsonicPlugin<BotsonicPluginOptions>;

export type ExternalBotsonicPlugin<T extends BotsonicPluginOptions> =
	BaseBotsonicPlugin<T>;

export function botsonic<const T extends BotsonicPluginOptions>(
	incomingOptions: BotsonicPluginOptions & T = {} as BotsonicPluginOptions & T,
): ExternalBotsonicPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};

	return {
		id: 'botsonic',
		authConfig: botsonicAuthConfig,
		schema: BotsonicSchema,
		options,
		hooks: options.hooks,
		endpoints: botsonicEndpointsNested,
		endpointMeta: botsonicEndpointMeta,
		endpointSchemas: botsonicEndpointSchemas,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: BotsonicKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (!res) {
					throw new AuthMissingError('botsonic', 'api_key');
				}
				return res;
			}

			throw new AuthMissingError('botsonic', 'api_key');
		},
	} satisfies InternalBotsonicPlugin;
}

export type {
	BotsonicEndpointInputs,
	BotsonicEndpointOutputs,
	GenerateResponseInput,
	GenerateResponseResponse,
	GetAllFaqsInput,
	GetAllFaqsResponse,
} from './endpoints/types';
