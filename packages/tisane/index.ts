import type {
	BindEndpoints,
	BindWebhooks,
	CorsairEndpoint,
	CorsairErrorHandler,
	CorsairPlugin,
	CorsairPluginContext,
	CorsairWebhook,
	KeyBuilderContext,
	PickAuth,
	PluginAuthConfig,
	PluginPermissionsConfig,
	RequiredPluginEndpointMeta,
	RequiredPluginEndpointSchemas,
	RequiredPluginWebhookSchemas,
} from 'corsair/core';
import type { AuthTypes } from 'corsair/core';
import type { TisaneEndpointInputs, TisaneEndpointOutputs } from './endpoints/types';
import { TisaneEndpointInputSchemas, TisaneEndpointOutputSchemas } from './endpoints/types';
import type {
	AnalysisCompletedEvent,
	TisaneWebhookOutputs,
} from './webhooks/types';
import { AnalysisCompletedEventSchema } from './webhooks/types';
import { Text } from './endpoints';
import { TisaneSchema } from './schema';
import { TisaneWebhooks } from './webhooks';
import { errorHandlers } from './error-handlers';

export type TisanePluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	webhookSecret?: string;
	hooks?: InternalTisanePlugin['hooks'];
	webhookHooks?: InternalTisanePlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof tisaneEndpointsNested>;
};

export type TisaneContext = CorsairPluginContext<
	typeof TisaneSchema,
	TisanePluginOptions
>;

export type TisaneKeyBuilderContext = KeyBuilderContext<TisanePluginOptions>;

export type TisaneBoundEndpoints = BindEndpoints<typeof tisaneEndpointsNested>;

type TisaneEndpoint<
	K extends keyof TisaneEndpointOutputs,
> = CorsairEndpoint<
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

type TisaneWebhook<
	K extends keyof TisaneWebhookOutputs,
	TEvent,
> = CorsairWebhook<TisaneContext, TEvent, TisaneWebhookOutputs[K]>;

export type TisaneWebhooks = {
	analysisCompleted: TisaneWebhook<'analysisCompleted', AnalysisCompletedEvent>;
};

export type TisaneBoundWebhooks = BindWebhooks<TisaneWebhooks>;

const tisaneEndpointsNested = {
	text: {
		parse: Text.parse,
		sentiment: Text.sentiment,
		moderate: Text.moderate,
		extractEntities: Text.extractEntities,
	},
} as const;

const tisaneWebhooksNested = {
	analysis: {
		analysisCompleted: TisaneWebhooks.analysisCompleted,
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
} as const satisfies RequiredPluginEndpointSchemas<typeof tisaneEndpointsNested>;

const tisaneWebhookSchemas = {
	'analysis.analysisCompleted': {
		description: 'Analysis completed notification webhook event',
		payload: AnalysisCompletedEventSchema,
		response: AnalysisCompletedEventSchema,
	},
} as const satisfies RequiredPluginWebhookSchemas<typeof tisaneWebhooksNested>;

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
	typeof tisaneWebhooksNested,
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
		webhookHooks: options.webhookHooks,
		endpoints: tisaneEndpointsNested,
		webhooks: tisaneWebhooksNested,
		endpointMeta: tisaneEndpointMeta,
		endpointSchemas: tisaneEndpointSchemas,
		webhookSchemas: tisaneWebhookSchemas,
		pluginWebhookMatcher: (request) => {
			const headers = request.headers;
			return 'x-tisane-signature' in headers || 'x-signature' in headers;
		},
		pluginTenantWebhookMatcher: () => null,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: TisaneKeyBuilderContext, source) => {
			if (source === 'webhook' && options.webhookSecret) {
				return options.webhookSecret;
			}

			if (source === 'webhook') {
				const res = await ctx.keys.get_webhook_signature();
				return res ?? '';
			}

			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				return res ?? '';
			}

			return '';
		},
	} satisfies InternalTisanePlugin;
}

export type {
	AnalysisCompletedEvent,
	TisaneWebhookOutputs,
} from './webhooks/types';

export type {
	TisaneEndpointInputs,
	TisaneEndpointOutputs,
	TextExtractEntitiesInput,
	TextExtractEntitiesResponse,
	TextModerateInput,
	TextModerateResponse,
	TextParseInput,
	TextParseResponse,
	TextSentimentInput,
	TextSentimentResponse,
} from './endpoints/types';
