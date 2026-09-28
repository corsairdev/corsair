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
import * as Endpoints from './endpoints';
import type {
	BestBuyEndpointInputs,
	BestBuyEndpointOutputs,
} from './endpoints/types';
import {
	BestBuyEndpointInputSchemas,
	BestBuyEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { BestBuySchema } from './schema';

export type BestBuyPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalBestBuyPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof bestBuyEndpointsNested>;
};

export type BestBuyContext = CorsairPluginContext<
	typeof BestBuySchema,
	BestBuyPluginOptions
>;

export type BestBuyKeyBuilderContext = KeyBuilderContext<BestBuyPluginOptions>;

export type BestBuyBoundEndpoints = BindEndpoints<
	typeof bestBuyEndpointsNested
>;

type BestBuyEndpoint<K extends keyof BestBuyEndpointOutputs> = CorsairEndpoint<
	BestBuyContext,
	BestBuyEndpointInputs[K],
	BestBuyEndpointOutputs[K]
>;

export type BestBuyEndpoints = {
	getProducts: BestBuyEndpoint<'getProducts'>;
	getProductDetails: BestBuyEndpoint<'getProductDetails'>;
	getCategories: BestBuyEndpoint<'getCategories'>;
	getCategoryDetails: BestBuyEndpoint<'getCategoryDetails'>;
	getStores: BestBuyEndpoint<'getStores'>;
	getStoreDetails: BestBuyEndpoint<'getStoreDetails'>;
	getReviews: BestBuyEndpoint<'getReviews'>;
	getReviewDetails: BestBuyEndpoint<'getReviewDetails'>;
};

const bestBuyEndpointsNested = {
	products: {
		list: Endpoints.getProducts,
		get: Endpoints.getProductDetails,
	},
	categories: {
		list: Endpoints.getCategories,
		get: Endpoints.getCategoryDetails,
	},
	stores: {
		list: Endpoints.getStores,
		get: Endpoints.getStoreDetails,
	},
	reviews: {
		list: Endpoints.getReviews,
		get: Endpoints.getReviewDetails,
	},
} as const;

export const bestBuyEndpointSchemas = {
	'products.list': {
		input: BestBuyEndpointInputSchemas.getProducts,
		output: BestBuyEndpointOutputSchemas.getProducts,
	},
	'products.get': {
		input: BestBuyEndpointInputSchemas.getProductDetails,
		output: BestBuyEndpointOutputSchemas.getProductDetails,
	},
	'categories.list': {
		input: BestBuyEndpointInputSchemas.getCategories,
		output: BestBuyEndpointOutputSchemas.getCategories,
	},
	'categories.get': {
		input: BestBuyEndpointInputSchemas.getCategoryDetails,
		output: BestBuyEndpointOutputSchemas.getCategoryDetails,
	},
	'stores.list': {
		input: BestBuyEndpointInputSchemas.getStores,
		output: BestBuyEndpointOutputSchemas.getStores,
	},
	'stores.get': {
		input: BestBuyEndpointInputSchemas.getStoreDetails,
		output: BestBuyEndpointOutputSchemas.getStoreDetails,
	},
	'reviews.list': {
		input: BestBuyEndpointInputSchemas.getReviews,
		output: BestBuyEndpointOutputSchemas.getReviews,
	},
	'reviews.get': {
		input: BestBuyEndpointInputSchemas.getReviewDetails,
		output: BestBuyEndpointOutputSchemas.getReviewDetails,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof bestBuyEndpointsNested
>;

const defaultAuthType = 'api_key' as const satisfies AuthTypes;

export const bestBuyEndpointMeta = {
	'products.list': {
		riskLevel: 'read',
		description:
			'Retrieve products with optional SKU, UPC, name, salePrice, and categoryPath.id filters',
	},
	'products.get': {
		riskLevel: 'read',
		description: 'Retrieve detailed information about a product by SKU',
	},
	'categories.list': {
		riskLevel: 'read',
		description: 'List or filter Best Buy product categories',
	},
	'categories.get': {
		riskLevel: 'read',
		description: 'Retrieve detailed information about a category by ID',
	},
	'stores.list': {
		riskLevel: 'read',
		description:
			'List Best Buy stores with optional city, region, postalCode, or area() geo search',
	},
	'stores.get': {
		riskLevel: 'read',
		description: 'Retrieve detailed information about a store by store ID',
	},
	'reviews.list': {
		riskLevel: 'read',
		description:
			'Retrieve product reviews with optional SKU, reviewer, and score filters',
	},
	'reviews.get': {
		riskLevel: 'read',
		description: 'Retrieve a single review by ID',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof bestBuyEndpointsNested>;

export const bestBuyAuthConfig = {
	api_key: {},
} as const satisfies PluginAuthConfig;

export type BaseBestBuyPlugin<T extends BestBuyPluginOptions> = CorsairPlugin<
	'bestbuy',
	typeof BestBuySchema,
	typeof bestBuyEndpointsNested,
	Record<string, never>,
	T,
	typeof defaultAuthType
>;

export type InternalBestBuyPlugin = BaseBestBuyPlugin<BestBuyPluginOptions>;

export type ExternalBestBuyPlugin<T extends BestBuyPluginOptions> =
	BaseBestBuyPlugin<T>;

/**
 * Best Buy Remix API plugin.
 *
 * **No webhooks.** The public Developer API is pull-only (products, stores,
 * categories, reviews) authenticated with an `apiKey` query parameter.
 */
export function bestbuy<const T extends BestBuyPluginOptions>(
	incomingOptions: BestBuyPluginOptions & T = {} as BestBuyPluginOptions & T,
): ExternalBestBuyPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'bestbuy',
		authConfig: bestBuyAuthConfig,
		schema: BestBuySchema,
		options: options,
		hooks: options.hooks,
		endpoints: bestBuyEndpointsNested,
		webhooks: {},
		endpointMeta: bestBuyEndpointMeta,
		endpointSchemas: bestBuyEndpointSchemas,
		webhookSchemas: {},
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: BestBuyKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (!res) {
					throw new AuthMissingError('bestbuy', 'api_key');
				}
				return res;
			}

			throw new AuthMissingError('bestbuy', 'api_key');
		},
	} satisfies InternalBestBuyPlugin;
}

export type {
	BestBuyEndpointInputs,
	BestBuyEndpointOutputs,
} from './endpoints/types';
