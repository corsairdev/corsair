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
import { Text } from './endpoints';
import type {
	TisaneEndpointInputs,
	TisaneEndpointOutputs,
} from './endpoints/types';
import {
	TisaneEndpointInputSchemas,
	TisaneEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { TisaneSchema } from './schema';

export type TisanePluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalTisanePlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof tisaneEndpointsNested>;
};

export type TisaneContext = CorsairPluginContext<
	typeof TisaneSchema,
	TisanePluginOptions
>;

export type TisaneKeyBuilderContext = KeyBuilderContext<TisanePluginOptions>;

export type TisaneBoundEndpoints = BindEndpoints<typeof tisaneEndpointsNested>;

type TisaneEndpoint<K extends keyof TisaneEndpointOutputs> = CorsairEndpoint<
	TisaneContext,
	TisaneEndpointInputs[K],
	TisaneEndpointOutputs[K]
>;

export type TisaneEndpoints = {
	textParse: TisaneEndpoint<'textParse'>;
	textSentiment: TisaneEndpoint<'textSentiment'>;
	textModerate: TisaneEndpoint<'textModerate'>;
	textExtractEntities: TisaneEndpoint<'textExtractEntities'>;
};

const tisaneEndpointsNested = {
	text: {
		parse: Text.parse,
		sentiment: Text.sentiment,
		moderate: Text.moderate,
		extractEntities: Text.extractEntities,
	},
} as const;

export const tisaneEndpointSchemas = {
	'text.parse': {
		input: TisaneEndpointInputSchemas.textParse,
		output: TisaneEndpointOutputSchemas.textParse,
	},
	'text.sentiment': {
		input: TisaneEndpointInputSchemas.textSentiment,
		output: TisaneEndpointOutputSchemas.textSentiment,
	},
	'text.moderate': {
		input: TisaneEndpointInputSchemas.textModerate,
		output: TisaneEndpointOutputSchemas.textModerate,
	},
	'text.extractEntities': {
		input: TisaneEndpointInputSchemas.textExtractEntities,
		output: TisaneEndpointOutputSchemas.textExtractEntities,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof tisaneEndpointsNested
>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const tisaneEndpointMeta = {
	'text.parse': {
		riskLevel: 'read',
		description: 'Comprehensive natural language parsing and text analysis',
	},
	'text.sentiment': {
		riskLevel: 'read',
		description: 'Aspect-based sentiment analysis and tone evaluation',
	},
	'text.moderate': {
		riskLevel: 'read',
		description: 'Content moderation for abuse, hate speech, and harassment',
	},
	'text.extractEntities': {
		riskLevel: 'read',
		description: 'Extract named entities and topics from text',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof tisaneEndpointsNested>;

export const tisaneAuthConfig = {
	api_key: {},
} as const satisfies PluginAuthConfig;

export type BaseTisanePlugin<T extends TisanePluginOptions> = CorsairPlugin<
	'tisane',
	typeof TisaneSchema,
	typeof tisaneEndpointsNested,
	Record<string, never>,
	T,
	typeof defaultAuthType
>;

export type InternalTisanePlugin = BaseTisanePlugin<TisanePluginOptions>;

export type ExternalTisanePlugin<T extends TisanePluginOptions> =
	BaseTisanePlugin<T>;

export function tisane<const T extends TisanePluginOptions>(
	incomingOptions: TisanePluginOptions & T = {} as TisanePluginOptions & T,
): ExternalTisanePlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'tisane',
		authConfig: tisaneAuthConfig,
		schema: TisaneSchema,
		options: options,
		hooks: options.hooks,
		endpoints: tisaneEndpointsNested,
		webhooks: {},
		endpointMeta: tisaneEndpointMeta,
		endpointSchemas: tisaneEndpointSchemas,
		webhookSchemas: {},
		pluginWebhookMatcher: () => false,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: TisaneKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (res) return res;
			}

			const envKey = process.env.TISANE_API_KEY;
			if (envKey) return envKey;

			throw new AuthMissingError('tisane', 'api_key');
		},
	} satisfies InternalTisanePlugin;
}

export type {
	TextExtractEntitiesInput,
	TextExtractEntitiesResponse,
	TextModerateInput,
	TextModerateResponse,
	TextParseInput,
	TextParseResponse,
	TextSentimentInput,
	TextSentimentResponse,
	TisaneEndpointInputs,
	TisaneEndpointOutputs,
} from './endpoints/types';
