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
import { packRetailedKey } from './client';
import { Goat, Products, StockX, Usage } from './endpoints';
import type {
	RetailedEndpointInputs,
	RetailedEndpointOutputs,
} from './endpoints/types';
import {
	RetailedEndpointInputSchemas,
	RetailedEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { RetailedSchema } from './schema';

export type RetailedPluginOptions = {
	authType?: PickAuth<'api_key' | 'oauth_2'>;
	key?: string;
	webhookSecret?: string;
	hooks?: InternalRetailedPlugin['hooks'];
	webhookHooks?: InternalRetailedPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof retailedEndpointsNested>;
};

export type RetailedContext = CorsairPluginContext<
	typeof RetailedSchema,
	RetailedPluginOptions
>;

export type RetailedKeyBuilderContext =
	KeyBuilderContext<RetailedPluginOptions>;

export type RetailedBoundEndpoints = BindEndpoints<
	typeof retailedEndpointsNested
>;

type RetailedEndpoint<K extends keyof RetailedEndpointOutputs> =
	CorsairEndpoint<
		RetailedContext,
		RetailedEndpointInputs[K],
		RetailedEndpointOutputs[K]
	>;

export type RetailedEndpoints = {
	getUsage: RetailedEndpoint<'getUsage'>;
	searchProducts: RetailedEndpoint<'searchProducts'>;
	stockxTrends: RetailedEndpoint<'stockxTrends'>;
	stockxSearch: RetailedEndpoint<'stockxSearch'>;
	stockxProduct: RetailedEndpoint<'stockxProduct'>;
	goatPrices: RetailedEndpoint<'goatPrices'>;
};

const retailedEndpointsNested = {
	usage: {
		get: Usage.get,
	},
	products: {
		search: Products.search,
	},
	stockx: {
		trends: StockX.trends,
		search: StockX.search,
		product: StockX.product,
	},
	goat: {
		prices: Goat.prices,
	},
} as const;

const retailedWebhooksNested = {} as const;

export const retailedEndpointSchemas = {
	'usage.get': {
		input: RetailedEndpointInputSchemas.getUsage,
		output: RetailedEndpointOutputSchemas.getUsage,
	},
	'products.search': {
		input: RetailedEndpointInputSchemas.searchProducts,
		output: RetailedEndpointOutputSchemas.searchProducts,
	},
	'stockx.trends': {
		input: RetailedEndpointInputSchemas.stockxTrends,
		output: RetailedEndpointOutputSchemas.stockxTrends,
	},
	'stockx.search': {
		input: RetailedEndpointInputSchemas.stockxSearch,
		output: RetailedEndpointOutputSchemas.stockxSearch,
	},
	'stockx.product': {
		input: RetailedEndpointInputSchemas.stockxProduct,
		output: RetailedEndpointOutputSchemas.stockxProduct,
	},
	'goat.prices': {
		input: RetailedEndpointInputSchemas.goatPrices,
		output: RetailedEndpointOutputSchemas.goatPrices,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof retailedEndpointsNested
>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const retailedEndpointMeta = {
	'usage.get': {
		riskLevel: 'read',
		description: 'Get API usage information',
	},
	'products.search': {
		riskLevel: 'read',
		description: 'Search products',
	},
	'stockx.trends': {
		riskLevel: 'read',
		description: 'Get StockX trends',
	},
	'stockx.search': {
		riskLevel: 'read',
		description: 'Search StockX products',
	},
	'stockx.product': {
		riskLevel: 'read',
		description: 'Get StockX product details',
	},
	'goat.prices': {
		riskLevel: 'read',
		description: 'Get GOAT product prices',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof retailedEndpointsNested>;

export const retailedAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
	oauth_2: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseRetailedPlugin<T extends RetailedPluginOptions> = CorsairPlugin<
	'retailed',
	typeof RetailedSchema,
	typeof retailedEndpointsNested,
	typeof retailedWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalRetailedPlugin = BaseRetailedPlugin<RetailedPluginOptions>;

export type ExternalRetailedPlugin<T extends RetailedPluginOptions> =
	BaseRetailedPlugin<T>;

export function retailed<const T extends RetailedPluginOptions>(
	incomingOptions: RetailedPluginOptions & T = {} as RetailedPluginOptions & T,
): ExternalRetailedPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'retailed',
		authConfig: retailedAuthConfig,
		schema: RetailedSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: retailedEndpointsNested,
		webhooks: retailedWebhooksNested,
		endpointMeta: retailedEndpointMeta,
		endpointSchemas: retailedEndpointSchemas,

		pluginWebhookMatcher: () => false,

		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: RetailedKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return packRetailedKey({
					authType: 'api_key',
					credential: options.key,
				});
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();

				if (res) {
					return packRetailedKey({
						authType: 'api_key',
						credential: res,
					});
				}

				throw new AuthMissingError('retailed', 'api_key');
			}

			if (source === 'endpoint' && ctx.authType === 'oauth_2') {
				const res = await ctx.keys.get_access_token();

				if (res) {
					return packRetailedKey({
						authType: 'oauth_2',
						credential: res,
					});
				}

				throw new AuthMissingError('retailed', 'oauth_2');
			}

			throw new AuthMissingError('retailed', ctx.authType);
		},
	} satisfies InternalRetailedPlugin;
}

export type {
	GetUsageInput,
	GetUsageResponse,
	GoatPricesInput,
	GoatPricesResponse,
	RetailedEndpointInputs,
	RetailedEndpointOutputs,
	SearchProductsInput,
	SearchProductsResponse,
	StockXProductInput,
	StockXProductResponse,
	StockXSearchInput,
	StockXSearchResponse,
	StockXTrendsInput,
	StockXTrendsResponse,
} from './endpoints/types';
