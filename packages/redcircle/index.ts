import type {
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
import { Endpoints } from './endpoints';
import type {
	RedcircleEndpointInputs,
	RedcircleEndpointOutputs,
} from './endpoints/types';
import {
	RedcircleEndpointInputSchemas,
	RedcircleEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';
import { RedcircleSchema } from './schema';

export type RedcirclePluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalRedcirclePlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof redcircleEndpointsNested>;
};

export type RedcircleContext = CorsairPluginContext<
	typeof RedcircleSchema,
	RedcirclePluginOptions
>;

export type RedcircleKeyBuilderContext =
	KeyBuilderContext<RedcirclePluginOptions>;

export type RedcircleBoundEndpoints = BindEndpoints<
	typeof redcircleEndpointsNested
>;

type RedcircleEndpoint<K extends keyof RedcircleEndpointOutputs> =
	CorsairEndpoint<
		RedcircleContext,
		RedcircleEndpointInputs[K],
		RedcircleEndpointOutputs[K]
	>;

export type RedcircleEndpoints = {
	productsGet: RedcircleEndpoint<'productsGet'>;
	searchProducts: RedcircleEndpoint<'searchProducts'>;
	reviewsList: RedcircleEndpoint<'reviewsList'>;
	categoriesList: RedcircleEndpoint<'categoriesList'>;
	accountGet: RedcircleEndpoint<'accountGet'>;
};

const redcircleEndpointsNested = {
	products: {
		get: Endpoints.productsGet,
	},
	search: {
		products: Endpoints.searchProducts,
	},
	reviews: {
		list: Endpoints.reviewsList,
	},
	categories: {
		list: Endpoints.categoriesList,
	},
	account: {
		get: Endpoints.accountGet,
	},
} as const;

export const redcircleEndpointSchemas = {
	'products.get': {
		input: RedcircleEndpointInputSchemas.productsGet,
		output: RedcircleEndpointOutputSchemas.productsGet,
	},
	'search.products': {
		input: RedcircleEndpointInputSchemas.searchProducts,
		output: RedcircleEndpointOutputSchemas.searchProducts,
	},
	'reviews.list': {
		input: RedcircleEndpointInputSchemas.reviewsList,
		output: RedcircleEndpointOutputSchemas.reviewsList,
	},
	'categories.list': {
		input: RedcircleEndpointInputSchemas.categoriesList,
		output: RedcircleEndpointOutputSchemas.categoriesList,
	},
	'account.get': {
		input: RedcircleEndpointInputSchemas.accountGet,
		output: RedcircleEndpointOutputSchemas.accountGet,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof redcircleEndpointsNested
>;

const defaultAuthType = 'api_key' as const;

const redcircleEndpointMeta = {
	'products.get': {
		riskLevel: 'read',
		description:
			'Fetch one Target product by TCIN, DPCI, GTIN or URL, with its price, images and specifications',
	},
	'search.products': {
		riskLevel: 'read',
		description:
			'Search Target products, filtered by category and delivery type and sorted, with page paging',
	},
	'reviews.list': {
		riskLevel: 'read',
		description:
			'List a Target product’s customer reviews with their ratings and sort order',
	},
	'categories.list': {
		riskLevel: 'read',
		description:
			'List Target categories, their children by parent id, or the matches for a search term',
	},
	'account.get': {
		riskLevel: 'read',
		description:
			'Read the account plan, credits used and remaining, and its per-resource limits',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof redcircleEndpointsNested
>;

export type BaseRedcirclePlugin<T extends RedcirclePluginOptions> =
	CorsairPlugin<
		'redcircle',
		typeof RedcircleSchema,
		typeof redcircleEndpointsNested,
		{},
		T,
		typeof defaultAuthType
	>;

export type InternalRedcirclePlugin =
	BaseRedcirclePlugin<RedcirclePluginOptions>;

export type ExternalRedcirclePlugin<T extends RedcirclePluginOptions> =
	BaseRedcirclePlugin<T>;

export function redcircle<const T extends RedcirclePluginOptions>(
	incomingOptions: RedcirclePluginOptions & T = {} as RedcirclePluginOptions &
		T,
): ExternalRedcirclePlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'redcircle',
		schema: RedcircleSchema,
		options: options,
		hooks: options.hooks,
		endpoints: redcircleEndpointsNested,
		webhooks: {},
		endpointMeta: redcircleEndpointMeta,
		endpointSchemas: redcircleEndpointSchemas,
		pluginWebhookMatcher: () => false,
		errorHandlers: mergeErrorHandlers(errorHandlers, options.errorHandlers),
		keyBuilder: async (ctx: RedcircleKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (res) return res;
			}

			throw new AuthMissingError('redcircle', ctx.authType ?? 'api_key');
		},
	} satisfies InternalRedcirclePlugin;
}

export { RedcircleAPIError } from './client';

export type {
	AccountGetInput,
	AccountGetResponse,
	CategoriesListInput,
	CategoriesListResponse,
	ProductsGetInput,
	ProductsGetResponse,
	RedcircleCategory,
	RedcircleEndpointInputs,
	RedcircleEndpointOutputs,
	RedcircleProduct,
	RedcircleReview,
	RedcircleSearchResult,
	ReviewsListInput,
	ReviewsListResponse,
	SearchInput,
	SearchResponse,
} from './endpoints/types';
