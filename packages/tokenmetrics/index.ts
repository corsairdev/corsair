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
	RequiredPluginWebhookSchemas,
} from 'corsair/core';
import { AuthMissingError } from 'corsair/core';
import { Market, Technical, Tokens, Trading } from './endpoints';
import type {
	TokenMetricsEndpointInputs,
	TokenMetricsEndpointOutputs,
} from './endpoints/types';
import {
	TokenMetricsEndpointInputSchemas,
	TokenMetricsEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { TokenMetricsSchema } from './schema';

export type TokenMetricsPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalTokenMetricsPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof tokenMetricsEndpointsNested>;
};
export type TokenMetricsContext = CorsairPluginContext<
	typeof TokenMetricsSchema,
	TokenMetricsPluginOptions
>;
export type TokenMetricsKeyBuilderContext =
	KeyBuilderContext<TokenMetricsPluginOptions>;
export type TokenMetricsBoundEndpoints = BindEndpoints<
	typeof tokenMetricsEndpointsNested
>;

type TokenMetricsEndpoint<K extends keyof TokenMetricsEndpointOutputs> =
	CorsairEndpoint<
		TokenMetricsContext,
		TokenMetricsEndpointInputs[K],
		TokenMetricsEndpointOutputs[K]
	>;

export type TokenMetricsEndpoints = {
	marketGetPrice: TokenMetricsEndpoint<'marketGetPrice'>;
	technicalGetIndicators: TokenMetricsEndpoint<'technicalGetIndicators'>;
	tokensList: TokenMetricsEndpoint<'tokensList'>;
	marketGetTopMarketCap: TokenMetricsEndpoint<'marketGetTopMarketCap'>;
	tradingGetSignals: TokenMetricsEndpoint<'tradingGetSignals'>;
};

const tokenMetricsEndpointsNested = {
	market: {
		getPrice: Market.getPrice,
		getTopMarketCap: Market.getTopMarketCap,
	},
	technical: { getIndicators: Technical.getIndicators },
	tokens: { list: Tokens.list },
	trading: { getSignals: Trading.getSignals },
} as const;
const tokenMetricsWebhooksNested = {} as const;

export const tokenMetricsEndpointSchemas = {
	'market.getPrice': {
		input: TokenMetricsEndpointInputSchemas.marketGetPrice,
		output: TokenMetricsEndpointOutputSchemas.marketGetPrice,
	},
	'market.getTopMarketCap': {
		input: TokenMetricsEndpointInputSchemas.marketGetTopMarketCap,
		output: TokenMetricsEndpointOutputSchemas.marketGetTopMarketCap,
	},
	'technical.getIndicators': {
		input: TokenMetricsEndpointInputSchemas.technicalGetIndicators,
		output: TokenMetricsEndpointOutputSchemas.technicalGetIndicators,
	},
	'tokens.list': {
		input: TokenMetricsEndpointInputSchemas.tokensList,
		output: TokenMetricsEndpointOutputSchemas.tokensList,
	},
	'trading.getSignals': {
		input: TokenMetricsEndpointInputSchemas.tradingGetSignals,
		output: TokenMetricsEndpointOutputSchemas.tradingGetSignals,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof tokenMetricsEndpointsNested
>;
const tokenMetricsWebhookSchemas =
	{} as const satisfies RequiredPluginWebhookSchemas<
		typeof tokenMetricsWebhooksNested
	>;

const tokenMetricsEndpointMeta = {
	'market.getPrice': {
		riskLevel: 'read',
		description: 'Retrieve token price, volume, and market-cap data',
	},
	'market.getTopMarketCap': {
		riskLevel: 'read',
		description: 'List tokens ranked by market capitalization',
	},
	'technical.getIndicators': {
		riskLevel: 'read',
		description: 'Retrieve a technical indicator for a token and interval',
	},
	'tokens.list': {
		riskLevel: 'read',
		description: 'List supported tokens and their identifiers',
	},
	'trading.getSignals': {
		riskLevel: 'read',
		description: 'Retrieve AI-generated token entry and exit signals',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof tokenMetricsEndpointsNested
>;

const defaultAuthType: AuthTypes = 'api_key';
export const tokenMetricsAuthConfig = {
	api_key: {},
} as const satisfies PluginAuthConfig;

export type BaseTokenMetricsPlugin<T extends TokenMetricsPluginOptions> =
	CorsairPlugin<
		'tokenmetrics',
		typeof TokenMetricsSchema,
		typeof tokenMetricsEndpointsNested,
		typeof tokenMetricsWebhooksNested,
		T,
		typeof defaultAuthType
	>;
export type InternalTokenMetricsPlugin =
	BaseTokenMetricsPlugin<TokenMetricsPluginOptions>;
export type ExternalTokenMetricsPlugin<T extends TokenMetricsPluginOptions> =
	BaseTokenMetricsPlugin<T>;

export function tokenmetrics<const T extends TokenMetricsPluginOptions>(
	incomingOptions: TokenMetricsPluginOptions &
		T = {} as TokenMetricsPluginOptions & T,
): ExternalTokenMetricsPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'tokenmetrics',
		authConfig: tokenMetricsAuthConfig,
		schema: TokenMetricsSchema,
		options,
		hooks: options.hooks,
		webhookHooks: undefined,
		endpoints: tokenMetricsEndpointsNested,
		webhooks: tokenMetricsWebhooksNested,
		endpointMeta: tokenMetricsEndpointMeta,
		endpointSchemas: tokenMetricsEndpointSchemas,
		webhookSchemas: tokenMetricsWebhookSchemas,
		pluginWebhookMatcher: undefined,
		errorHandlers: { ...errorHandlers, ...options.errorHandlers },
		keyBuilder: async (ctx: TokenMetricsKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) return options.key;
			if (source === 'endpoint') {
				const key = await ctx.keys.get_api_key();
				if (key) return key;
			}
			throw new AuthMissingError('tokenmetrics', 'api_key');
		},
	} satisfies InternalTokenMetricsPlugin;
}

export * from './endpoints/types';
export { TokenMetricsSchema } from './schema';
