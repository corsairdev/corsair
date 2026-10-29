import type {
	AuthTypes,
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
import { AuthMissingError } from 'corsair/core';
import {
	Categories,
	Collections,
	Destinations,
	Identifiers,
	Offers,
	Products,
	Requests,
	ResultSets,
	Search,
} from './endpoints';
import type {
	AsinDataApiEndpointInputs,
	AsinDataApiEndpointOutputs,
} from './endpoints/types';
import {
	AsinDataApiEndpointInputSchemas,
	AsinDataApiEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { AsinDataApiSchema } from './schema';
import { CollectionWebhooks } from './webhooks';
import { resolveAsinDataApiOAuthWebhookTenantLink } from './webhooks/oauth-tenant-link';
import { matchAsinDataApiTenantWebhook } from './webhooks/tenant-matcher';
import type {
	AsinDataApiWebhookOutputs,
	CollectionCompletedEvent,
} from './webhooks/types';
import {
	CollectionCompletedEventSchema,
	CollectionCompletedPayloadSchema,
} from './webhooks/types';

// ─────────────────────────────────────────────────────────────────────────────
// Plugin Options
// ─────────────────────────────────────────────────────────────────────────────

export type AsinDataApiPluginOptions = {
	/** Authentication method. Only api_key is supported. */
	authType?: PickAuth<'api_key'>;
	/** Optional: pass the API key directly (bypasses key manager) */
	key?: string;
	/** Shared secret required on collection-completion webhooks. */
	webhookSecret?: string;
	/** Optional: lifecycle hooks for endpoints */
	hooks?: InternalAsinDataApiPlugin['hooks'];
	/** Optional: lifecycle hooks for webhooks */
	webhookHooks?: InternalAsinDataApiPlugin['webhookHooks'];
	/** Optional: custom error handlers (merged with defaults) */
	errorHandlers?: CorsairErrorHandler;
	/** Permission configuration for the plugin */
	permissions?: PluginPermissionsConfig<typeof asinDataApiEndpointsNested>;
};

// ─────────────────────────────────────────────────────────────────────────────
// Context & Type Helpers
// ─────────────────────────────────────────────────────────────────────────────

export type AsinDataApiContext = CorsairPluginContext<
	typeof AsinDataApiSchema,
	AsinDataApiPluginOptions
>;

export type AsinDataApiKeyBuilderContext =
	KeyBuilderContext<AsinDataApiPluginOptions>;

export type AsinDataApiBoundEndpoints = BindEndpoints<
	typeof asinDataApiEndpointsNested
>;

type AsinDataApiEndpoint<K extends keyof AsinDataApiEndpointOutputs> =
	CorsairEndpoint<
		AsinDataApiContext,
		AsinDataApiEndpointInputs[K],
		AsinDataApiEndpointOutputs[K]
	>;

export type AsinDataApiEndpoints = {
	productsGet: AsinDataApiEndpoint<'productsGet'>;
	searchGet: AsinDataApiEndpoint<'searchGet'>;
	offersGet: AsinDataApiEndpoint<'offersGet'>;
	categoriesGet: AsinDataApiEndpoint<'categoriesGet'>;
	identifiersResolve: AsinDataApiEndpoint<'identifiersResolve'>;
	collectionsCreate: AsinDataApiEndpoint<'collectionsCreate'>;
	collectionsList: AsinDataApiEndpoint<'collectionsList'>;
	collectionsGet: AsinDataApiEndpoint<'collectionsGet'>;
	collectionsUpdate: AsinDataApiEndpoint<'collectionsUpdate'>;
	collectionsDelete: AsinDataApiEndpoint<'collectionsDelete'>;
	collectionsStart: AsinDataApiEndpoint<'collectionsStart'>;
	requestsList: AsinDataApiEndpoint<'requestsList'>;
	requestsAdd: AsinDataApiEndpoint<'requestsAdd'>;
	requestsUpdate: AsinDataApiEndpoint<'requestsUpdate'>;
	requestsClear: AsinDataApiEndpoint<'requestsClear'>;
	requestsDelete: AsinDataApiEndpoint<'requestsDelete'>;
	resultSetsList: AsinDataApiEndpoint<'resultSetsList'>;
	resultSetsGet: AsinDataApiEndpoint<'resultSetsGet'>;
	destinationsList: AsinDataApiEndpoint<'destinationsList'>;
	destinationsCreate: AsinDataApiEndpoint<'destinationsCreate'>;
	destinationsUpdate: AsinDataApiEndpoint<'destinationsUpdate'>;
	destinationsDelete: AsinDataApiEndpoint<'destinationsDelete'>;
};

// ─────────────────────────────────────────────────────────────────────────────
// Endpoint Tree
// ─────────────────────────────────────────────────────────────────────────────

const asinDataApiEndpointsNested = {
	products: {
		get: Products.get,
	},
	search: {
		get: Search.get,
	},
	offers: {
		get: Offers.get,
	},
	categories: {
		get: Categories.get,
	},
	identifiers: {
		resolve: Identifiers.resolve,
	},
	collections: {
		create: Collections.create,
		list: Collections.list,
		get: Collections.get,
		update: Collections.update,
		delete: Collections.delete,
		start: Collections.start,
	},
	requests: {
		list: Requests.list,
		add: Requests.add,
		update: Requests.update,
		clear: Requests.clear,
		delete: Requests.delete,
	},
	resultSets: {
		list: ResultSets.list,
		get: ResultSets.get,
	},
	destinations: {
		list: Destinations.list,
		create: Destinations.create,
		update: Destinations.update,
		delete: Destinations.delete,
	},
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// Webhook Tree
// ─────────────────────────────────────────────────────────────────────────────

export type AsinDataApiWebhooks = {
	collectionCompleted: AsinDataApiWebhook<
		'collectionCompleted',
		CollectionCompletedEvent
	>;
};

type AsinDataApiWebhook<
	K extends keyof AsinDataApiWebhookOutputs,
	TEvent,
> = CorsairWebhook<AsinDataApiContext, TEvent, AsinDataApiWebhookOutputs[K]>;

const asinDataApiWebhooksNested = {
	collections: {
		collectionCompleted: CollectionWebhooks.collectionCompleted,
	},
} as const;

export type AsinDataApiBoundWebhooks = BindWebhooks<AsinDataApiWebhooks>;

// ─────────────────────────────────────────────────────────────────────────────
// Endpoint Schemas (for get_schema / agent introspection)
// ─────────────────────────────────────────────────────────────────────────────

export const asinDataApiEndpointSchemas = {
	'products.get': {
		input: AsinDataApiEndpointInputSchemas.productsGet,
		output: AsinDataApiEndpointOutputSchemas.productsGet,
	},
	'search.get': {
		input: AsinDataApiEndpointInputSchemas.searchGet,
		output: AsinDataApiEndpointOutputSchemas.searchGet,
	},
	'offers.get': {
		input: AsinDataApiEndpointInputSchemas.offersGet,
		output: AsinDataApiEndpointOutputSchemas.offersGet,
	},
	'categories.get': {
		input: AsinDataApiEndpointInputSchemas.categoriesGet,
		output: AsinDataApiEndpointOutputSchemas.categoriesGet,
	},
	'identifiers.resolve': {
		input: AsinDataApiEndpointInputSchemas.identifiersResolve,
		output: AsinDataApiEndpointOutputSchemas.identifiersResolve,
	},
	'collections.create': {
		input: AsinDataApiEndpointInputSchemas.collectionsCreate,
		output: AsinDataApiEndpointOutputSchemas.collectionsCreate,
	},
	'collections.list': {
		input: AsinDataApiEndpointInputSchemas.collectionsList,
		output: AsinDataApiEndpointOutputSchemas.collectionsList,
	},
	'collections.get': {
		input: AsinDataApiEndpointInputSchemas.collectionsGet,
		output: AsinDataApiEndpointOutputSchemas.collectionsGet,
	},
	'collections.update': {
		input: AsinDataApiEndpointInputSchemas.collectionsUpdate,
		output: AsinDataApiEndpointOutputSchemas.collectionsUpdate,
	},
	'collections.delete': {
		input: AsinDataApiEndpointInputSchemas.collectionsDelete,
		output: AsinDataApiEndpointOutputSchemas.collectionsDelete,
	},
	'collections.start': {
		input: AsinDataApiEndpointInputSchemas.collectionsStart,
		output: AsinDataApiEndpointOutputSchemas.collectionsStart,
	},
	'requests.list': {
		input: AsinDataApiEndpointInputSchemas.requestsList,
		output: AsinDataApiEndpointOutputSchemas.requestsList,
	},
	'requests.add': {
		input: AsinDataApiEndpointInputSchemas.requestsAdd,
		output: AsinDataApiEndpointOutputSchemas.requestsAdd,
	},
	'requests.update': {
		input: AsinDataApiEndpointInputSchemas.requestsUpdate,
		output: AsinDataApiEndpointOutputSchemas.requestsUpdate,
	},
	'requests.clear': {
		input: AsinDataApiEndpointInputSchemas.requestsClear,
		output: AsinDataApiEndpointOutputSchemas.requestsClear,
	},
	'requests.delete': {
		input: AsinDataApiEndpointInputSchemas.requestsDelete,
		output: AsinDataApiEndpointOutputSchemas.requestsDelete,
	},
	'resultSets.list': {
		input: AsinDataApiEndpointInputSchemas.resultSetsList,
		output: AsinDataApiEndpointOutputSchemas.resultSetsList,
	},
	'resultSets.get': {
		input: AsinDataApiEndpointInputSchemas.resultSetsGet,
		output: AsinDataApiEndpointOutputSchemas.resultSetsGet,
	},
	'destinations.list': {
		input: AsinDataApiEndpointInputSchemas.destinationsList,
		output: AsinDataApiEndpointOutputSchemas.destinationsList,
	},
	'destinations.create': {
		input: AsinDataApiEndpointInputSchemas.destinationsCreate,
		output: AsinDataApiEndpointOutputSchemas.destinationsCreate,
	},
	'destinations.update': {
		input: AsinDataApiEndpointInputSchemas.destinationsUpdate,
		output: AsinDataApiEndpointOutputSchemas.destinationsUpdate,
	},
	'destinations.delete': {
		input: AsinDataApiEndpointInputSchemas.destinationsDelete,
		output: AsinDataApiEndpointOutputSchemas.destinationsDelete,
	},
} satisfies RequiredPluginEndpointSchemas<typeof asinDataApiEndpointsNested>;

// ─────────────────────────────────────────────────────────────────────────────
// Webhook Schemas
// ─────────────────────────────────────────────────────────────────────────────

const asinDataApiWebhookSchemas = {
	'collections.collectionCompleted': {
		description:
			'Fires when a Collection completes and a new Result Set is available',
		payload: CollectionCompletedPayloadSchema,
		response: CollectionCompletedEventSchema,
	},
} as const satisfies RequiredPluginWebhookSchemas<
	typeof asinDataApiWebhooksNested
>;

// ─────────────────────────────────────────────────────────────────────────────
// Endpoint Meta (risk levels for permission system)
// ─────────────────────────────────────────────────────────────────────────────

const defaultAuthType: AuthTypes = 'api_key' as const;

export const asinDataApiEndpointMeta = {
	'products.get': {
		riskLevel: 'read',
		description:
			'Retrieve Amazon product details by ASIN, URL, or GTIN/ISBN/UPC/EAN',
	},
	'search.get': {
		riskLevel: 'read',
		description:
			'Search Amazon products by keywords across supported Amazon domains',
	},
	'offers.get': {
		riskLevel: 'read',
		description:
			'Retrieve product offers, pricing, availability, and seller information',
	},
	'categories.get': {
		riskLevel: 'read',
		description: 'Retrieve Amazon category data and products within a category',
	},
	'identifiers.resolve': {
		riskLevel: 'read',
		description:
			'Resolve GTIN, ISBN, UPC, or EAN identifiers to ASINs automatically',
	},
	'collections.create': {
		riskLevel: 'write',
		description: 'Create a new Collection for batch data collection',
	},
	'collections.list': {
		riskLevel: 'read',
		description: 'List all Collections on the account',
	},
	'collections.get': {
		riskLevel: 'read',
		description:
			'Get details of a specific Collection including status and request counts',
	},
	'collections.update': {
		riskLevel: 'write',
		description:
			"Update an existing Collection's configuration (only when not running)",
	},
	'collections.delete': {
		riskLevel: 'destructive',
		description: 'Delete a Collection',
	},
	'collections.start': {
		riskLevel: 'write',
		description: 'Start a Collection to run all its requests immediately',
	},
	'requests.list': {
		riskLevel: 'read',
		description: 'List all Requests in a Collection (paginated, 1000 per page)',
	},
	'requests.add': {
		riskLevel: 'write',
		description: 'Add Requests to a Collection (up to 1000 per call)',
	},
	'requests.update': {
		riskLevel: 'write',
		description: 'Update a single Request within a Collection',
	},
	'requests.clear': {
		riskLevel: 'destructive',
		description: 'Bulk-delete multiple Requests from a Collection by their IDs',
	},
	'requests.delete': {
		riskLevel: 'destructive',
		description: 'Delete a single Request from a Collection',
	},
	'resultSets.list': {
		riskLevel: 'read',
		description: 'List all Result Sets for a Collection',
	},
	'resultSets.get': {
		riskLevel: 'read',
		description: 'Get a specific Result Set with download links',
	},
	'destinations.list': {
		riskLevel: 'read',
		description:
			'List all configured Destinations (S3, GCS, Azure Blob, S3-compatible)',
	},
	'destinations.create': {
		riskLevel: 'write',
		description:
			'Create a new Destination for exporting Collection Result Sets',
	},
	'destinations.update': {
		riskLevel: 'write',
		description: "Update an existing Destination's configuration",
	},
	'destinations.delete': {
		riskLevel: 'destructive',
		description: 'Delete a Destination',
	},
} satisfies RequiredPluginEndpointMeta<typeof asinDataApiEndpointsNested>;

// ─────────────────────────────────────────────────────────────────────────────
// Auth Configuration
// ─────────────────────────────────────────────────────────────────────────────

export const asinDataApiAuthConfig = {
	api_key: { account: [] as const },
} as const satisfies PluginAuthConfig;

// ─────────────────────────────────────────────────────────────────────────────
// Plugin Types
// ─────────────────────────────────────────────────────────────────────────────

export type BaseAsinDataApiPlugin<T extends AsinDataApiPluginOptions> =
	CorsairPlugin<
		'asindataapi',
		typeof AsinDataApiSchema,
		typeof asinDataApiEndpointsNested,
		typeof asinDataApiWebhooksNested,
		T,
		typeof defaultAuthType
	>;

export type InternalAsinDataApiPlugin =
	BaseAsinDataApiPlugin<AsinDataApiPluginOptions>;

export type ExternalAsinDataApiPlugin<T extends AsinDataApiPluginOptions> =
	BaseAsinDataApiPlugin<T>;

// ─────────────────────────────────────────────────────────────────────────────
// Plugin Factory
// ─────────────────────────────────────────────────────────────────────────────

export function asindataapi<const T extends AsinDataApiPluginOptions>(
	incomingOptions: AsinDataApiPluginOptions &
		T = {} as AsinDataApiPluginOptions & T,
): ExternalAsinDataApiPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'asindataapi',
		authConfig: asinDataApiAuthConfig,
		schema: AsinDataApiSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: asinDataApiEndpointsNested,
		webhooks: asinDataApiWebhooksNested,
		endpointMeta: asinDataApiEndpointMeta,
		endpointSchemas: asinDataApiEndpointSchemas,
		webhookSchemas: asinDataApiWebhookSchemas,
		pluginWebhookMatcher: (request) => {
			const body = request.body;
			if (!body) return false;
			const parsed =
				typeof body === 'string'
					? (() => {
							try {
								return JSON.parse(body);
							} catch {
								return null;
							}
						})()
					: body;
			if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
				return false;
			}
			const requestInfo = (parsed as Record<string, unknown>).request_info;
			if (
				requestInfo &&
				typeof requestInfo === 'object' &&
				(requestInfo as Record<string, unknown>).type ===
					'collection_resultset_completed'
			) {
				return true;
			}
			return (
				(parsed as Record<string, unknown>).type ===
				'collection_resultset_completed'
			);
		},
		pluginTenantWebhookMatcher: matchAsinDataApiTenantWebhook,
		oauthWebhookTenantLinkResolver: resolveAsinDataApiOAuthWebhookTenantLink,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: AsinDataApiKeyBuilderContext, source) => {
			if (source === 'webhook') {
				return options.webhookSecret ?? '';
			}

			if (options.key) {
				return options.key;
			}

			if (ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (!res) {
					throw new AuthMissingError('asindataapi', 'api_key');
				}
				return res;
			}

			throw new AuthMissingError('asindataapi', 'api_key');
		},
	} satisfies InternalAsinDataApiPlugin;
}

// ─────────────────────────────────────────────────────────────────────────────
// Type Exports
// ─────────────────────────────────────────────────────────────────────────────

export type {
	AsinDataApiCategoryResult,
	AsinDataApiCollection,
	AsinDataApiCollectionFields,
	AsinDataApiCollectionRequest,
	AsinDataApiCollectionStatus,
	AsinDataApiDestination,
	AsinDataApiDestinationType,
	AsinDataApiEndpointInputs,
	AsinDataApiEndpointOutputs,
	AsinDataApiOffer,
	AsinDataApiPriority,
	AsinDataApiProduct,
	AsinDataApiRequestType,
	AsinDataApiResultSet,
	AsinDataApiScheduleType,
	AsinDataApiSearchResult,
	AsinDataApiSortBy,
	CategoriesGetInput,
	CategoriesResponse,
	CollectionAckResponse,
	CollectionResponse,
	CollectionsCreateInput,
	CollectionsDeleteInput,
	CollectionsGetInput,
	CollectionsListInput,
	CollectionsListResponse,
	CollectionsStartInput,
	CollectionsUpdateInput,
	DestinationsCreateInput,
	DestinationsCreateResponse,
	DestinationsDeleteInput,
	DestinationsDeleteResponse,
	DestinationsListInput,
	DestinationsListResponse,
	DestinationsUpdateInput,
	DestinationsUpdateResponse,
	IdentifiersResolveInput,
	IdentifiersResolveResponse,
	OffersGetInput,
	OffersResponse,
	ProductGetInput,
	ProductResponse,
	RequestsAddInput,
	RequestsAddResponse,
	RequestsClearInput,
	RequestsClearResponse,
	RequestsDeleteInput,
	RequestsDeleteResponse,
	RequestsListInput,
	RequestsListResponse,
	RequestsUpdateInput,
	RequestsUpdateResponse,
	ResultSetsGetInput,
	ResultSetsGetResponse,
	ResultSetsListInput,
	ResultSetsListResponse,
	SearchGetInput,
	SearchResponse,
} from './endpoints/types';
export {
	ASINDATAAPI_COLLECTION_STATUS,
	ASINDATAAPI_DESTINATION_TYPE,
	ASINDATAAPI_PRIORITY,
	ASINDATAAPI_REQUEST_TYPE,
	ASINDATAAPI_SCHEDULE_TYPE,
	ASINDATAAPI_SORT_BY,
	CategoriesGetInputSchema,
	CategoriesResponseSchema,
	CollectionsCreateInputSchema,
	CollectionsDeleteInputSchema,
	CollectionsGetInputSchema,
	CollectionsListInputSchema,
	CollectionsStartInputSchema,
	CollectionsUpdateInputSchema,
	DestinationsCreateInputSchema,
	DestinationsDeleteInputSchema,
	DestinationsListInputSchema,
	DestinationsUpdateInputSchema,
	IdentifiersResolveInputSchema,
	IdentifiersResolveResponseSchema,
	OffersGetInputSchema,
	OffersResponseSchema,
	ProductGetInputSchema,
	ProductResponseSchema,
	RequestsAddInputSchema,
	RequestsClearInputSchema,
	RequestsDeleteInputSchema,
	RequestsListInputSchema,
	RequestsUpdateInputSchema,
	ResultSetsGetInputSchema,
	ResultSetsListInputSchema,
	SearchGetInputSchema,
	SearchResponseSchema,
} from './endpoints/types';
export type {
	AsinDataApiWebhookOutputs,
	CollectionCompletedEvent,
} from './webhooks/types';
