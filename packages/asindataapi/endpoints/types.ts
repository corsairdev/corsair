import { z } from 'zod';
import type { ASINDATAAPI_COLLECTION_STATUS } from '../schema/database';
import {
	ASINDATAAPI_DESTINATION_TYPE,
	ASINDATAAPI_PRIORITY,
	ASINDATAAPI_REQUEST_TYPE,
	ASINDATAAPI_SCHEDULE_TYPE,
	AsinDataApiCollection,
	AsinDataApiCollectionRequest,
	AsinDataApiDestination,
	AsinDataApiResultSet,
} from '../schema/database';

export {
	ASINDATAAPI_COLLECTION_STATUS,
	ASINDATAAPI_DESTINATION_TYPE,
	ASINDATAAPI_PRIORITY,
	ASINDATAAPI_REQUEST_TYPE,
	ASINDATAAPI_SCHEDULE_TYPE,
	AsinDataApiCollection,
	AsinDataApiCollectionRequest,
	AsinDataApiDestination,
	AsinDataApiResultSet,
} from '../schema/database';

export type AsinDataApiScheduleType =
	(typeof ASINDATAAPI_SCHEDULE_TYPE)[number];
export type AsinDataApiPriority = (typeof ASINDATAAPI_PRIORITY)[number];
export type AsinDataApiCollectionStatus =
	(typeof ASINDATAAPI_COLLECTION_STATUS)[number];
export type AsinDataApiRequestType = (typeof ASINDATAAPI_REQUEST_TYPE)[number];
export type AsinDataApiDestinationType =
	(typeof ASINDATAAPI_DESTINATION_TYPE)[number];

export const ASINDATAAPI_SORT_BY = [
	'most_recent',
	'price_low_to_high',
	'price_high_to_low',
	'featured',
	'average_review',
] as const;
export type AsinDataApiSortBy = (typeof ASINDATAAPI_SORT_BY)[number];

/**
 * Common response envelope returned by every ASIN Data API response.
 * `credits_used` / `credits_remaining` are present on Product Data API
 * responses; Collection API responses expose `success` and optional `message`.
 */
const RequestInfoSchema = z
	.object({
		success: z.boolean(),
		credits_used: z.number().optional(),
		credits_remaining: z.number().optional(),
		credits_reset_at: z.string().optional(),
		message: z.string().optional(),
		type: z.string().optional(),
	})
	.loose();

export type RequestInfo = z.infer<typeof RequestInfoSchema>;

const RequestParametersSchema = z.record(z.string(), z.unknown());

const RequestMetadataSchema = z
	.object({
		id: z.string().optional(),
		created_at: z.string().optional(),
		processed_at: z.string().optional(),
		total_time_taken: z.number().optional(),
		amazon_url: z.string().optional(),
	})
	.loose();

// ─────────────────────────────────────────────────────────────────────────────
// Product — GET /request?type=product
// ─────────────────────────────────────────────────────────────────────────────

export const ProductGetInputSchema = z.object({
	/** Amazon domain (e.g. "amazon.com"). Ignored when `url` is supplied. */
	amazon_domain: z.string().optional(),
	/** Product ASIN. Requires `amazon_domain`. */
	asin: z.string().optional(),
	/** Amazon product page URL. When supplied, `asin`/`amazon_domain` are ignored. */
	url: z.string().optional(),
	/** GTIN/ISBN/UPC/EAN identifier — converted to an ASIN automatically. */
	gtin: z.string().optional(),
	/** Force a fresh GTIN→ASIN lookup (charges an extra credit). */
	skip_gtin_cache: z.boolean().optional(),
	/** Include AI summarization attributes (charges an extra credit). */
	include_summarization_attributes: z.boolean().optional(),
});

export type ProductGetInput = z.infer<typeof ProductGetInputSchema>;

const ProductPriceSchema = z
	.object({
		symbol: z.string().optional(),
		value: z.number().optional(),
		currency: z.string().optional(),
		raw: z.string().optional(),
		name: z.string().optional(),
	})
	.loose();

const ProductCategorySchema = z
	.object({
		name: z.string().optional(),
		link: z.string().optional(),
		category_id: z.string().optional(),
	})
	.loose();

const ProductSchema = z
	.object({
		title: z.string().optional(),
		asin: z.string(),
		link: z.string().optional(),
		brand: z.string().optional(),
		description: z.string().optional(),
		rating: z.number().optional(),
		ratings_total: z.number().optional(),
		reviews_total: z.number().optional(),
		main_image: z
			.object({
				link: z.string().optional(),
			})
			.loose()
			.optional(),
		images: z.array(z.record(z.string(), z.unknown())).optional(),
		feature_bullets: z.array(z.string()).optional(),
		attributes: z
			.array(z.object({ name: z.string(), value: z.string() }))
			.optional(),
		categories: z.array(ProductCategorySchema).optional(),
		price: ProductPriceSchema.optional(),
		buybox_winner: z.record(z.string(), z.unknown()).optional(),
	})
	.loose();

export type AsinDataApiProduct = z.infer<typeof ProductSchema>;

const ProductResponseFields = {
	request_parameters: RequestParametersSchema.optional(),
	request_metadata: RequestMetadataSchema.optional(),
};

export const ProductResponseSchema = z.union([
	z
		.object({
			request_info: RequestInfoSchema.extend({ success: z.literal(true) }),
			...ProductResponseFields,
			product: ProductSchema,
		})
		.loose(),
	z
		.object({
			request_info: RequestInfoSchema.extend({ success: z.literal(false) }),
			...ProductResponseFields,
			product: ProductSchema.extend({ asin: z.string().optional() }).optional(),
		})
		.loose(),
]);

export type ProductResponse = z.infer<typeof ProductResponseSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// Search — GET /request?type=search
// ─────────────────────────────────────────────────────────────────────────────

export const SearchGetInputSchema = z.object({
	/** Amazon domain (e.g. "amazon.com"). */
	amazon_domain: z.string().optional(),
	/** Search term. Mutually exclusive with `url`. */
	search_term: z.string().optional(),
	/** Amazon search results page URL. Mutually exclusive with `search_term`. */
	url: z.string().optional(),
	/** Limit results to a category node id. */
	category_id: z.string().optional(),
	/** Comma-separated refinement values. */
	refinements: z.string().optional(),
	/** Sort order of results. */
	sort_by: z.enum(ASINDATAAPI_SORT_BY).optional(),
	/** Exclude sponsored results. */
	exclude_sponsored: z.boolean().optional(),
	/** Disable Amazon auto-correct of `search_term`. */
	direct_search: z.boolean().optional(),
	/** Page of results to return. */
	page: z.number().int().positive().optional(),
	/** Return multiple pages in a single response. */
	max_page: z.number().int().positive().optional(),
});

export type SearchGetInput = z.infer<typeof SearchGetInputSchema>;

const SearchResultSchema = z
	.object({
		position: z.number().optional(),
		title: z.string().optional(),
		asin: z.string().optional(),
		link: z.string().optional(),
		image: z.string().optional(),
		is_prime: z.boolean().optional(),
		rating: z.number().optional(),
		ratings_total: z.number().optional(),
		sponsored: z.boolean().optional(),
		price: ProductPriceSchema.optional(),
		prices: z.array(ProductPriceSchema).optional(),
	})
	.loose();

export type AsinDataApiSearchResult = z.infer<typeof SearchResultSchema>;

export const SearchResponseSchema = z
	.object({
		request_info: RequestInfoSchema,
		request_parameters: RequestParametersSchema.optional(),
		request_metadata: RequestMetadataSchema.optional(),
		search_results: z.array(SearchResultSchema).optional(),
		pagination: z.record(z.string(), z.unknown()).optional(),
		refinements: z.record(z.string(), z.unknown()).optional(),
	})
	.loose();

export type SearchResponse = z.infer<typeof SearchResponseSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// Offers — GET /request?type=offers
// ─────────────────────────────────────────────────────────────────────────────

export const OffersGetInputSchema = z.object({
	/** Amazon domain (e.g. "amazon.com"). */
	amazon_domain: z.string().optional(),
	/** Product ASIN. Requires `amazon_domain`. */
	asin: z.string().optional(),
	/** Amazon product page URL. When supplied, `asin`/`amazon_domain` are ignored. */
	url: z.string().optional(),
	/** Filter offers to Prime-eligible sellers. */
	offers_prime: z.boolean().optional(),
	/** Filter offers to free-shipping sellers. */
	offers_free_shipping: z.boolean().optional(),
	/** Include offers in new condition. */
	offers_condition_new: z.boolean().optional(),
	/** Include offers from other ASINs (ignored when using `url`). */
	show_different_asins: z.boolean().optional(),
	/** Page of offers (10 per page). */
	page: z.number().int().positive().optional(),
	/** Return multiple pages in a single response. */
	max_page: z.number().int().positive().optional(),
});

export type OffersGetInput = z.infer<typeof OffersGetInputSchema>;

const OfferSchema = z
	.object({
		position: z.number().optional(),
		is_prime: z.boolean().optional(),
		buybox_winner: z.boolean().optional(),
		offer_id: z.string().optional(),
		offer_asin: z.string().optional(),
		price: ProductPriceSchema.optional(),
		condition: z.record(z.string(), z.unknown()).optional(),
		seller: z.record(z.string(), z.unknown()).optional(),
		delivery: z.record(z.string(), z.unknown()).optional(),
	})
	.loose();

export type AsinDataApiOffer = z.infer<typeof OfferSchema>;

export const OffersResponseSchema = z
	.object({
		request_info: RequestInfoSchema,
		request_parameters: RequestParametersSchema.optional(),
		request_metadata: RequestMetadataSchema.optional(),
		product: z.record(z.string(), z.unknown()).optional(),
		offers: z.array(OfferSchema).optional(),
		pagination: z.record(z.string(), z.unknown()).optional(),
		available_filters: z.record(z.string(), z.unknown()).optional(),
	})
	.loose();

export type OffersResponse = z.infer<typeof OffersResponseSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// Category — GET /request?type=category
// ─────────────────────────────────────────────────────────────────────────────

export const CategoriesGetInputSchema = z.object({
	/** Amazon domain (e.g. "amazon.com"). */
	amazon_domain: z.string().optional(),
	/** Amazon category node id. Mutually exclusive with `url`. */
	category_id: z.string().optional(),
	/** Amazon category page URL. Mutually exclusive with `category_id`. */
	url: z.string().optional(),
	/** Comma-separated refinement values. */
	refinements: z.string().optional(),
	/** Sort order of results. */
	sort_by: z.enum(ASINDATAAPI_SORT_BY).optional(),
	/** Page of results to return. */
	page: z.number().int().positive().optional(),
	/** Return multiple pages in a single response. */
	max_page: z.number().int().positive().optional(),
});

export type CategoriesGetInput = z.infer<typeof CategoriesGetInputSchema>;

const CategoryResultSchema = z
	.object({
		position: z.number().optional(),
		title: z.string().optional(),
		asin: z.string().optional(),
		link: z.string().optional(),
		image: z.string().optional(),
		is_prime: z.boolean().optional(),
		rating: z.number().optional(),
		ratings_total: z.number().optional(),
		sponsored: z.boolean().optional(),
		price: ProductPriceSchema.optional(),
		prices: z.array(ProductPriceSchema).optional(),
	})
	.loose();

export type AsinDataApiCategoryResult = z.infer<typeof CategoryResultSchema>;

export const CategoriesResponseSchema = z
	.object({
		request_info: RequestInfoSchema,
		request_parameters: RequestParametersSchema.optional(),
		request_metadata: RequestMetadataSchema.optional(),
		category_results: z.array(CategoryResultSchema).optional(),
		pagination: z.record(z.string(), z.unknown()).optional(),
		refinements: z.record(z.string(), z.unknown()).optional(),
	})
	.loose();

export type CategoriesResponse = z.infer<typeof CategoriesResponseSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// Identifiers — GET /request?type=product&gtin=...
// ─────────────────────────────────────────────────────────────────────────────

export const IdentifiersResolveInputSchema = z.object({
	/** GTIN/ISBN/UPC/EAN identifier to convert to an ASIN. */
	gtin: z.string(),
	/** Amazon domain (e.g. "amazon.com"). */
	amazon_domain: z.string().optional(),
	/** Force a fresh GTIN→ASIN lookup (charges an extra credit). */
	skip_gtin_cache: z.boolean().optional(),
});

export type IdentifiersResolveInput = z.infer<
	typeof IdentifiersResolveInputSchema
>;

export const IdentifiersResolveResponseSchema = ProductResponseSchema;

export type IdentifiersResolveResponse = z.infer<
	typeof IdentifiersResolveResponseSchema
>;

// ─────────────────────────────────────────────────────────────────────────────
// Collections
// ─────────────────────────────────────────────────────────────────────────────

const CollectionSchema = AsinDataApiCollection;

export const CollectionFieldsSchema = z.object({
	/** Human-readable collection name (required on create). */
	name: z.string().optional(),
	/** Enable or disable the collection. */
	enabled: z.boolean().optional(),
	/** Schedule type: monthly, weekly, daily, minutes, or manual. */
	schedule_type: z.enum(ASINDATAAPI_SCHEDULE_TYPE).optional(),
	/** Processing priority when multiple collections are queued. */
	priority: z.enum(ASINDATAAPI_PRIORITY).optional(),
	/** Days of month (for `monthly`). */
	schedule_days_of_month: z.array(z.number().int().min(1).max(31)).optional(),
	/** Days of week (0=Sunday…6=Saturday, for `weekly`). */
	schedule_days_of_week: z.array(z.number().int().min(0).max(6)).optional(),
	/** Hours of day (0–23) to run. */
	schedule_hours: z.array(z.number().int().min(0).max(23)).optional(),
	/** Interval for `schedule_type=minutes`. */
	schedule_minutes: z
		.enum([
			'every_minute',
			'every_5_minutes',
			'every_10_minutes',
			'every_15_minutes',
			'every_20_minutes',
			'every_25_minutes',
			'every_30_minutes',
			'every_hour',
		])
		.optional(),
	/** Destination ids to export results to. */
	destination_ids: z.array(z.string()).optional(),
	/** Email address for completion notifications. */
	notification_email: z.string().optional(),
	/** Webhook URL for completion notifications. */
	notification_webhook: z.string().optional(),
	notification_as_json: z.boolean().optional(),
	notification_as_jsonlines: z.boolean().optional(),
	notification_as_csv: z.boolean().optional(),
	/** Comma-separated dot-notation fields for CSV output. */
	notification_csv_fields: z.string().optional(),
	/** Lock the collection to a single request type. */
	requests_type: z
		.enum(['mixed', 'product', 'offers', 'search', 'category'])
		.optional(),
});

export type AsinDataApiCollectionFields = z.infer<
	typeof CollectionFieldsSchema
>;

export const CollectionsCreateInputSchema = CollectionFieldsSchema.extend({
	name: z.string(),
});

export type CollectionsCreateInput = z.infer<
	typeof CollectionsCreateInputSchema
>;

export const CollectionsUpdateInputSchema = CollectionFieldsSchema.extend({
	collection_id: z.string(),
});

export type CollectionsUpdateInput = z.infer<
	typeof CollectionsUpdateInputSchema
>;

export const CollectionsGetInputSchema = z.object({
	collection_id: z.string(),
});

export type CollectionsGetInput = z.infer<typeof CollectionsGetInputSchema>;

export const CollectionsDeleteInputSchema = z.object({
	collection_id: z.string(),
});

export type CollectionsDeleteInput = z.infer<
	typeof CollectionsDeleteInputSchema
>;

export const CollectionsStartInputSchema = z.object({
	collection_id: z.string(),
});

export type CollectionsStartInput = z.infer<typeof CollectionsStartInputSchema>;

export const CollectionsListInputSchema = z.object({
	only_with_results: z.boolean().optional(),
	only_without_results: z.boolean().optional(),
	search_term: z.string().optional(),
	search_type: z
		.enum(['contains', 'starts_with', 'ends_with', 'exact'])
		.optional(),
	status: z.enum(['all', 'idle', 'queued', 'running']).optional(),
	created_before: z.string().optional(),
	created_after: z.string().optional(),
	last_run_before: z.string().optional(),
	last_run_after: z.string().optional(),
	destination_id: z.string().optional(),
	page: z.number().int().positive().optional(),
	page_size: z.number().int().positive().max(1000).optional(),
	sort_by: z
		.enum(['created_at', 'last_run', 'name', 'priority', 'status'])
		.optional(),
	sort_direction: z.enum(['ascending', 'descending']).optional(),
});

export type CollectionsListInput = z.infer<typeof CollectionsListInputSchema>;

const CollectionResponseSchema = z
	.object({
		request_info: RequestInfoSchema,
		collection: CollectionSchema,
	})
	.loose();

export type CollectionResponse = z.infer<typeof CollectionResponseSchema>;

const CollectionsListResponseSchema = z
	.object({
		request_info: RequestInfoSchema,
		total_count: z.number().optional(),
		total_pages: z.number().optional(),
		current_page: z.number().optional(),
		count_this_page: z.number().optional(),
		collections: z.array(CollectionSchema).optional(),
	})
	.loose();

export type CollectionsListResponse = z.infer<
	typeof CollectionsListResponseSchema
>;

const CollectionAckResponseSchema = z
	.object({
		request_info: RequestInfoSchema,
	})
	.loose();

export type CollectionAckResponse = z.infer<typeof CollectionAckResponseSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// Collection Requests
// ─────────────────────────────────────────────────────────────────────────────

export const CollectionRequestInputSchema = z
	.object({
		type: z.enum(ASINDATAAPI_REQUEST_TYPE).optional(),
		amazon_domain: z.string().optional(),
		asin: z.string().optional(),
		url: z.string().optional(),
		gtin: z.string().optional(),
		search_term: z.string().optional(),
		category_id: z.string().optional(),
		refinements: z.string().optional(),
		sort_by: z.enum(ASINDATAAPI_SORT_BY).optional(),
		exclude_sponsored: z.boolean().optional(),
		direct_search: z.boolean().optional(),
		page: z.number().int().positive().optional(),
		max_page: z.number().int().positive().optional(),
		include_html: z.boolean().optional(),
		skip_gtin_cache: z.boolean().optional(),
		show_different_asins: z.boolean().optional(),
		/** Your own tracking identifier for the request. */
		custom_id: z.string().optional(),
	})
	.loose();

export type AsinDataApiCollectionRequestInput = z.infer<
	typeof CollectionRequestInputSchema
>;

const CollectionRequestSchema = AsinDataApiCollectionRequest;

export const RequestsListInputSchema = z.object({
	collection_id: z.string(),
	page: z.number().int().positive().optional(),
});

export type RequestsListInput = z.infer<typeof RequestsListInputSchema>;

export const RequestsListResponseSchema = z
	.object({
		request_info: RequestInfoSchema,
		collection_id: z.string().optional(),
		requests_page_current: z.number().optional(),
		requests_page_count: z.number().optional(),
		requests_total_count: z.number().optional(),
		requests: z.array(CollectionRequestSchema).optional(),
	})
	.loose();

export type RequestsListResponse = z.infer<typeof RequestsListResponseSchema>;

export const RequestsAddInputSchema = z.object({
	collection_id: z.string(),
	requests: z.array(CollectionRequestInputSchema).min(1).max(1000),
});

export type RequestsAddInput = z.infer<typeof RequestsAddInputSchema>;

export const RequestsUpdateInputSchema = z.object({
	collection_id: z.string(),
	request_id: z.string(),
	/** Fields to update on the request. */
	type: z.enum(ASINDATAAPI_REQUEST_TYPE).optional(),
	amazon_domain: z.string().optional(),
	asin: z.string().optional(),
	url: z.string().optional(),
	gtin: z.string().optional(),
	search_term: z.string().optional(),
	category_id: z.string().optional(),
	refinements: z.string().optional(),
	sort_by: z.enum(ASINDATAAPI_SORT_BY).optional(),
	exclude_sponsored: z.boolean().optional(),
	direct_search: z.boolean().optional(),
	page: z.number().int().positive().optional(),
	max_page: z.number().int().positive().optional(),
	include_html: z.boolean().optional(),
	skip_gtin_cache: z.boolean().optional(),
	show_different_asins: z.boolean().optional(),
	custom_id: z.string().optional(),
});

export type RequestsUpdateInput = z.infer<typeof RequestsUpdateInputSchema>;

export const RequestsClearInputSchema = z.object({
	collection_id: z.string(),
	request_ids: z.array(z.string()).min(1),
});

export type RequestsClearInput = z.infer<typeof RequestsClearInputSchema>;

export const RequestsDeleteInputSchema = z.object({
	collection_id: z.string(),
	request_id: z.string(),
});

export type RequestsDeleteInput = z.infer<typeof RequestsDeleteInputSchema>;

const RequestsUpdateResponseSchema = z
	.object({
		request_info: RequestInfoSchema,
		request: CollectionRequestInputSchema.optional(),
	})
	.loose();

export type RequestsUpdateResponse = z.infer<
	typeof RequestsUpdateResponseSchema
>;

const RequestsAddResponseSchema = z
	.object({
		request_info: RequestInfoSchema,
		collection: CollectionSchema.optional(),
	})
	.loose();

export type RequestsAddResponse = z.infer<typeof RequestsAddResponseSchema>;

const RequestsClearResponseSchema = CollectionAckResponseSchema;
export type RequestsClearResponse = z.infer<typeof RequestsClearResponseSchema>;

const RequestsDeleteResponseSchema = CollectionAckResponseSchema;
export type RequestsDeleteResponse = z.infer<
	typeof RequestsDeleteResponseSchema
>;

// ─────────────────────────────────────────────────────────────────────────────
// Result Sets
// ─────────────────────────────────────────────────────────────────────────────

const ResultSetSchema = AsinDataApiResultSet;

export const ResultSetsListInputSchema = z.object({
	collection_id: z.string(),
});

export type ResultSetsListInput = z.infer<typeof ResultSetsListInputSchema>;

export const ResultSetsListResponseSchema = z
	.object({
		request_info: RequestInfoSchema,
		collection_id: z.string().optional(),
		collection: CollectionSchema.optional(),
		results_count: z.number().optional(),
		results: z.array(ResultSetSchema).optional(),
	})
	.loose();

export type ResultSetsListResponse = z.infer<
	typeof ResultSetsListResponseSchema
>;

export const ResultSetsGetInputSchema = z.object({
	collection_id: z.string(),
	result_set_id: z.number(),
});

export type ResultSetsGetInput = z.infer<typeof ResultSetsGetInputSchema>;

const ResultSetsGetResponseSchema = z
	.object({
		request_info: RequestInfoSchema,
		collection_id: z.string().optional(),
		result: ResultSetSchema,
	})
	.loose();

export type ResultSetsGetResponse = z.infer<typeof ResultSetsGetResponseSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// Destinations
// ─────────────────────────────────────────────────────────────────────────────

const DestinationSchema = AsinDataApiDestination;

const DestinationUsageSchema = z
	.object({
		used: z.number().optional(),
		limit: z.number().optional(),
		available: z.number().optional(),
	})
	.loose();

export const DestinationsListInputSchema = z.object({
	page: z.number().int().positive().optional(),
	search_term: z.string().optional(),
	sort_by: z.enum(['type', 'name']).optional(),
	sort_direction: z.enum(['ascending', 'descending']).optional(),
});

export type DestinationsListInput = z.infer<typeof DestinationsListInputSchema>;

export const DestinationsListResponseSchema = z
	.object({
		request_info: RequestInfoSchema,
		usage: DestinationUsageSchema.optional(),
		destinations: z.array(DestinationSchema).optional(),
	})
	.loose();

export type DestinationsListResponse = z.infer<
	typeof DestinationsListResponseSchema
>;

const DestinationCredentialFields = {
	s3_access_key_id: z.string().optional(),
	s3_secret_access_key: z.string().optional(),
	s3_bucket_name: z.string().optional(),
	s3_path_prefix: z.string().optional(),
	s3_endpoint: z.string().optional(),
	s3_region: z.string().optional(),
	gcs_access_key: z.string().optional(),
	gcs_secret_key: z.string().optional(),
	gcs_bucket_name: z.string().optional(),
	gcs_path_prefix: z.string().optional(),
	azure_account_name: z.string().optional(),
	azure_account_key: z.string().optional(),
	azure_container_name: z.string().optional(),
	azure_path_prefix: z.string().optional(),
	oss_access_key: z.string().optional(),
	oss_secret_key: z.string().optional(),
	oss_bucket_name: z.string().optional(),
	oss_region_id: z.string().optional(),
	oss_path_prefix: z.string().optional(),
};

export const DestinationsCreateInputSchema = z.object({
	name: z.string(),
	type: z.enum(ASINDATAAPI_DESTINATION_TYPE),
	enabled: z.boolean(),
	...DestinationCredentialFields,
});

export type DestinationsCreateInput = z.infer<
	typeof DestinationsCreateInputSchema
>;

export const DestinationsCreateResponseSchema = z
	.object({
		request_info: RequestInfoSchema,
		usage: DestinationUsageSchema.optional(),
		destination: DestinationSchema.optional(),
	})
	.loose();

export type DestinationsCreateResponse = z.infer<
	typeof DestinationsCreateResponseSchema
>;

export const DestinationsUpdateInputSchema = z.object({
	destination_id: z.string(),
	name: z.string().optional(),
	enabled: z.boolean().optional(),
	...DestinationCredentialFields,
});

export type DestinationsUpdateInput = z.infer<
	typeof DestinationsUpdateInputSchema
>;

const DestinationsUpdateResponseSchema = z
	.object({
		request_info: RequestInfoSchema,
		destination: DestinationSchema.optional(),
	})
	.loose();

export type DestinationsUpdateResponse = z.infer<
	typeof DestinationsUpdateResponseSchema
>;

export const DestinationsDeleteInputSchema = z.object({
	destination_id: z.string(),
});

export type DestinationsDeleteInput = z.infer<
	typeof DestinationsDeleteInputSchema
>;

const DestinationsDeleteResponseSchema = z
	.object({
		request_info: RequestInfoSchema,
	})
	.loose();

export type DestinationsDeleteResponse = z.infer<
	typeof DestinationsDeleteResponseSchema
>;

// ─────────────────────────────────────────────────────────────────────────────
// Plugin Endpoint Input / Output Maps
// ─────────────────────────────────────────────────────────────────────────────

export type AsinDataApiEndpointInputs = {
	productsGet: ProductGetInput;
	searchGet: SearchGetInput;
	offersGet: OffersGetInput;
	categoriesGet: CategoriesGetInput;
	identifiersResolve: IdentifiersResolveInput;
	collectionsCreate: CollectionsCreateInput;
	collectionsList: CollectionsListInput;
	collectionsGet: CollectionsGetInput;
	collectionsUpdate: CollectionsUpdateInput;
	collectionsDelete: CollectionsDeleteInput;
	collectionsStart: CollectionsStartInput;
	requestsList: RequestsListInput;
	requestsAdd: RequestsAddInput;
	requestsUpdate: RequestsUpdateInput;
	requestsClear: RequestsClearInput;
	requestsDelete: RequestsDeleteInput;
	resultSetsList: ResultSetsListInput;
	resultSetsGet: ResultSetsGetInput;
	destinationsList: DestinationsListInput;
	destinationsCreate: DestinationsCreateInput;
	destinationsUpdate: DestinationsUpdateInput;
	destinationsDelete: DestinationsDeleteInput;
};

export type AsinDataApiEndpointOutputs = {
	productsGet: ProductResponse;
	searchGet: SearchResponse;
	offersGet: OffersResponse;
	categoriesGet: CategoriesResponse;
	identifiersResolve: IdentifiersResolveResponse;
	collectionsCreate: CollectionResponse;
	collectionsList: CollectionsListResponse;
	collectionsGet: CollectionResponse;
	collectionsUpdate: CollectionResponse;
	collectionsDelete: CollectionAckResponse;
	collectionsStart: CollectionAckResponse;
	requestsList: RequestsListResponse;
	requestsAdd: RequestsAddResponse;
	requestsUpdate: RequestsUpdateResponse;
	requestsClear: RequestsClearResponse;
	requestsDelete: RequestsDeleteResponse;
	resultSetsList: ResultSetsListResponse;
	resultSetsGet: ResultSetsGetResponse;
	destinationsList: DestinationsListResponse;
	destinationsCreate: DestinationsCreateResponse;
	destinationsUpdate: DestinationsUpdateResponse;
	destinationsDelete: DestinationsDeleteResponse;
};

export const AsinDataApiEndpointInputSchemas = {
	productsGet: ProductGetInputSchema,
	searchGet: SearchGetInputSchema,
	offersGet: OffersGetInputSchema,
	categoriesGet: CategoriesGetInputSchema,
	identifiersResolve: IdentifiersResolveInputSchema,
	collectionsCreate: CollectionsCreateInputSchema,
	collectionsList: CollectionsListInputSchema,
	collectionsGet: CollectionsGetInputSchema,
	collectionsUpdate: CollectionsUpdateInputSchema,
	collectionsDelete: CollectionsDeleteInputSchema,
	collectionsStart: CollectionsStartInputSchema,
	requestsList: RequestsListInputSchema,
	requestsAdd: RequestsAddInputSchema,
	requestsUpdate: RequestsUpdateInputSchema,
	requestsClear: RequestsClearInputSchema,
	requestsDelete: RequestsDeleteInputSchema,
	resultSetsList: ResultSetsListInputSchema,
	resultSetsGet: ResultSetsGetInputSchema,
	destinationsList: DestinationsListInputSchema,
	destinationsCreate: DestinationsCreateInputSchema,
	destinationsUpdate: DestinationsUpdateInputSchema,
	destinationsDelete: DestinationsDeleteInputSchema,
} as const;

export const AsinDataApiEndpointOutputSchemas = {
	productsGet: ProductResponseSchema,
	searchGet: SearchResponseSchema,
	offersGet: OffersResponseSchema,
	categoriesGet: CategoriesResponseSchema,
	identifiersResolve: IdentifiersResolveResponseSchema,
	collectionsCreate: CollectionResponseSchema,
	collectionsList: CollectionsListResponseSchema,
	collectionsGet: CollectionResponseSchema,
	collectionsUpdate: CollectionResponseSchema,
	collectionsDelete: CollectionAckResponseSchema,
	collectionsStart: CollectionAckResponseSchema,
	requestsList: RequestsListResponseSchema,
	requestsAdd: RequestsAddResponseSchema,
	requestsUpdate: RequestsUpdateResponseSchema,
	requestsClear: RequestsClearResponseSchema,
	requestsDelete: RequestsDeleteResponseSchema,
	resultSetsList: ResultSetsListResponseSchema,
	resultSetsGet: ResultSetsGetResponseSchema,
	destinationsList: DestinationsListResponseSchema,
	destinationsCreate: DestinationsCreateResponseSchema,
	destinationsUpdate: DestinationsUpdateResponseSchema,
	destinationsDelete: DestinationsDeleteResponseSchema,
} as const;
