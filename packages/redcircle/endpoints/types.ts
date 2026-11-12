import { z } from 'zod';

/**
 * RedCircle's one product-data route is `GET /request`, discriminated by `type`.
 * Pagination is `page` or `max_page`, and each retrieved page costs a credit, so
 * `max_page` is capped where the provider caps it.
 */
export const REDCIRCLE_MAX_PAGE = 10;

/** The `request_info` block every answer carries. */
export const RequestInfoSchema = z
	.object({
		success: z.boolean().nullish(),
		demo: z.boolean().nullish(),
		message: z.string().nullish(),
	})
	.loose();

/** The `pagination` block a paged request carries. */
export const PaginationSchema = z
	.object({
		current: z
			.object({
				page: z.number().nullish(),
				link: z.string().nullish(),
			})
			.loose()
			.nullish(),
		next: z
			.object({
				page: z.number().nullish(),
				link: z.string().nullish(),
			})
			.loose()
			.nullish(),
		total_pages: z.number().nullish(),
		total_results: z.number().nullish(),
	})
	.loose();

export type RedcirclePagination = z.infer<typeof PaginationSchema>;

/**
 * `next_page`, `current_page`, `total_pages` and `total_results` are declared
 * rather than added by a transform, because the docs generator reads a
 * transform's input side and would omit them.
 */
const pagingFields = {
	request_info: RequestInfoSchema.nullish(),
	request_metadata: z
		.object({ target_url: z.string().nullish() })
		.loose()
		.nullish(),
	next_page: z
		.number()
		.nullable()
		.describe('Pass as `page` to read the next page; null on the last.'),
	current_page: z.number().nullable(),
	total_pages: z.number().nullable(),
	total_results: z.number().nullable(),
};

const PageSchema = z
	.number()
	.int()
	.min(1)
	.optional()
	.describe('1-based page of results.');

const MaxPageSchema = z
	.number()
	.int()
	.min(1)
	.max(REDCIRCLE_MAX_PAGE)
	.optional()
	.describe(
		`Retrieve and concatenate this many pages in one request. Each page costs a credit, so the cap is ${REDCIRCLE_MAX_PAGE}.`,
	);

// ── products ──────────────────────────────────────────────────────────────

const ProductsGetInputSchema = z
	.object({
		tcin: z.string().optional().describe('The Target TCIN (item id).'),
		dpci: z
			.string()
			.optional()
			.describe(
				'A DPCI code; it is searched first, then the first match read.',
			),
		gtin: z
			.string()
			.optional()
			.describe('A GTIN/ISBN/UPC; it overrides `tcin` and `dpci`.'),
		url: z
			.string()
			.optional()
			.describe('A Target product URL, which overrides every other selector.'),
	})
	.superRefine((value, ctx) => {
		// RedCircle needs one selector; the URL wins over the rest, so a bare call
		// would scrape nothing in particular.
		if (
			value.tcin === undefined &&
			value.dpci === undefined &&
			value.gtin === undefined &&
			value.url === undefined
		) {
			ctx.addIssue({
				code: 'custom',
				message: 'Provide `tcin`, `dpci`, `gtin` or `url`.',
				path: ['tcin'],
			});
		}
	});

export type ProductsGetInput = z.input<typeof ProductsGetInputSchema>;

/**
 * A product variant: a size or colour, with its own price and availability.
 * RedCircle returns a small fixed set of keys per variant.
 */
const VariantSchema = z
	.object({
		tcin: z.string().nullish(),
		dpci: z.string().nullish(),
		title: z.string().nullish(),
		link: z.string().nullish(),
		swatch_image: z.string().nullish(),
		availability: z.string().nullish(),
		price: z.number().nullish(),
	})
	.loose();

/** One offer against a search result, which is a merchant and its price. */
const OfferSchema = z
	.object({
		seller: z.string().nullish(),
		price: z.number().nullish(),
		currency: z.string().nullish(),
		link: z.string().nullish(),
		condition: z.string().nullish(),
	})
	.loose();

/** The fulfilment flags a search result carries. */
const FulfillmentSchema = z
	.object({
		in_store_pickup: z.boolean().nullish(),
		same_day_delivery: z.boolean().nullish(),
		buy_at_store: z.boolean().nullish(),
		ship_to_home: z.boolean().nullish(),
	})
	.loose();

/** One row of the account's monthly usage history. */
const UsageHistorySchema = z
	.object({
		date: z.string().nullish(),
		requests: z.number().nullish(),
		credits: z.number().nullish(),
	})
	.loose();

const PriceSchema = z
	.object({
		value: z.number().nullish(),
		currency: z.string().nullish(),
		symbol: z.string().nullish(),
		raw: z.string().nullish(),
	})
	.loose();

// Search responses use URL strings; product responses document media objects.
const MediaSchema = z.union([
	z.string(),
	z.object({ link: z.string().nullish(), type: z.string().nullish() }).loose(),
]);

/** A product as the search and category routes return it, and `product` carries. */
const ProductSchema = z
	.object({
		title: z.string().nullish(),
		link: z.string().nullish(),
		tcin: z.string().nullish(),
		dpci: z.string().nullish(),
		class_id: z.number().nullish(),
		department_id: z.number().nullish(),
		sponsored: z.boolean().nullish(),
		brand: z.string().nullish(),
		brand_link: z.string().nullish(),
		rating: z.number().nullish(),
		ratings_total: z.number().nullish(),
		main_image: MediaSchema.nullish(),
		images: z.array(MediaSchema).nullish(),
		videos: z.array(MediaSchema).nullish(),
		price: PriceSchema.nullish(),
		description: z.string().nullish(),
		feature_bullets: z.array(z.string()).nullish(),
		specifications: z.array(z.record(z.string(), z.string())).nullish(),
		// Category breadcrumbs contain string ids and names.
		categories: z.array(z.record(z.string(), z.string())).nullish(),
		variants: z.array(VariantSchema).nullish(),
	})
	.loose();

export type RedcircleProduct = z.infer<typeof ProductSchema>;

const ProductsGetResponseSchema = z.object({
	product: ProductSchema,
	...pagingFields,
});

export type ProductsGetResponse = z.infer<typeof ProductsGetResponseSchema>;

// ── search ────────────────────────────────────────────────────────────────

const SearchSortSchema = z.enum([
	'best_seller',
	'price_high_to_low',
	'price_low_to_high',
	'best_match',
	'highest_rating',
	'newly_listed',
	'featured',
]);

const SearchDeliverySchema = z.enum([
	'in_store_pickup',
	'same_day_delivery',
	'buy_at_store',
	'ship_to_home',
]);

const SearchInputSchema = z
	.object({
		search_term: z
			.string()
			.optional()
			.describe('The term to search Target for; `url` is an alternative.'),
		category_id: z.string().optional(),
		sort_by: SearchSortSchema.optional(),
		delivery_type: SearchDeliverySchema.optional(),
		customer_zipcode: z
			.string()
			.optional()
			.describe('The store to localise an in-store filter to.'),
		url: z
			.string()
			.optional()
			.describe(
				'A Target search-results URL, which overrides every other parameter.',
			),
		page: PageSchema,
		max_page: MaxPageSchema,
	})
	.superRefine((value, ctx) => {
		if (value.search_term === undefined && value.url === undefined) {
			ctx.addIssue({
				code: 'custom',
				message: 'Provide `search_term` or `url`.',
				path: ['search_term'],
			});
		}
	});

export type SearchInput = z.input<typeof SearchInputSchema>;

const SearchResultSchema = z
	.object({
		position: z.number().nullish(),
		product: ProductSchema.nullish(),
		offers: z.array(OfferSchema).nullish(),
		fulfillment: FulfillmentSchema.nullish(),
	})
	.loose();

export type RedcircleSearchResult = z.infer<typeof SearchResultSchema>;

// The live response names the rows `search_results`, which is the field the
// plugin returns; `results` is not a name RedCircle uses.
const SearchResponseSchema = z.object({
	search_results: z.array(SearchResultSchema),
	...pagingFields,
});

export type SearchResponse = z.infer<typeof SearchResponseSchema>;

// ── reviews ───────────────────────────────────────────────────────────────

const ReviewsListInputSchema = z
	.object({
		tcin: z.string().optional().describe('The Target TCIN (item id).'),
		dpci: z.string().optional(),
		gtin: z.string().optional(),
		url: z.string().optional(),
		sort_by: z
			.enum([
				'most_recent',
				'most_helpful',
				'high_to_low_rating',
				'low_to_high_rating',
			])
			.optional(),
		page: PageSchema,
		max_page: MaxPageSchema,
	})
	.refine(
		(value) =>
			[value.tcin, value.dpci, value.gtin, value.url].some(
				(selector) => selector !== undefined,
			),
		{
			message: 'Provide `tcin`, `dpci`, `gtin` or `url`.',
			path: ['tcin'],
		},
	);

export type ReviewsListInput = z.input<typeof ReviewsListInputSchema>;

const ReviewSchema = z
	.object({
		id: z.string().nullish(),
		rating: z.number().nullish(),
		title: z.string().nullish(),
		body: z.string().nullish(),
		date: z.string().nullish(),
		nickname: z.string().nullish(),
		verified_purchase: z.boolean().nullish(),
		helpful_votes: z.number().nullish(),
		recommended: z.boolean().nullish(),
	})
	.loose();

export type RedcircleReview = z.infer<typeof ReviewSchema>;

const ReviewsListResponseSchema = z.object({
	reviews: z.array(ReviewSchema),
	...pagingFields,
});

export type ReviewsListResponse = z.infer<typeof ReviewsListResponseSchema>;

// ── categories ────────────────────────────────────────────────────────────

const CategoryItemSchema = z
	.object({
		id: z.string().nullish(),
		name: z.string().nullish(),
		has_children: z.boolean().nullish(),
		is_root: z.boolean().nullish(),
		path: z.string().nullish(),
	})
	.loose();

export type RedcircleCategory = z.infer<typeof CategoryItemSchema>;

const CategoriesListInputSchema = z
	.object({
		parent_id: z
			.string()
			.optional()
			.describe('Return the children of this category.'),
		search_term: z
			.string()
			.optional()
			.describe('Search the whole hierarchy for this term.'),
	})
	.superRefine((value, ctx) => {
		// The three selectors are mutually exclusive, so sending two is rejected
		// by RedCircle rather than merged.
		const chosen = [value.parent_id, value.search_term].filter(
			(part) => part !== undefined,
		);
		if (chosen.length > 1) {
			ctx.addIssue({
				code: 'custom',
				message: 'Provide only one of `parent_id` or `search_term`.',
				path: ['parent_id'],
			});
		}
	});

export type CategoriesListInput = z.input<typeof CategoriesListInputSchema>;

const CategoriesListResponseSchema = z.object({
	categories: z.array(CategoryItemSchema).nullish(),
	category: CategoryItemSchema.nullish(),
	current_category: CategoryItemSchema.nullish(),
	parent_category: CategoryItemSchema.nullish(),
	request_info: RequestInfoSchema.nullish(),
});

export type CategoriesListResponse = z.infer<
	typeof CategoriesListResponseSchema
>;

// ── account ───────────────────────────────────────────────────────────────

const AccountGetInputSchema = z.object({});

export type AccountGetInput = z.input<typeof AccountGetInputSchema>;

/**
 * RedCircle echoes the account's **api_key** back in `account_info`, so the
 * schema deliberately omits it and the endpoint strips it before the output
 * parse. A field the plugin does not declare cannot leak from the result.
 */
const AccountGetResponseSchema = z.object({
	account: z
		.object({
			name: z.string().nullish(),
			email: z.string().nullish(),
			plan: z.string().nullish(),
			timezone: z.string().nullish(),
			credits_used: z.number().nullish(),
			credits_remaining: z.number().nullish(),
			credits_limit: z.number().nullish(),
			credits_reset_at: z.string().nullish(),
			overage_enabled: z.boolean().nullish(),
			zipcodes_used: z.number().nullish(),
			zipcodes_limit: z.number().nullish(),
			zipcodes_available: z.number().nullish(),
			destinations_used: z.number().nullish(),
			destinations_limit: z.number().nullish(),
			destinations_available: z.number().nullish(),
			account_balance_usd: z.number().nullish(),
			account_balance_message: z.string().nullish(),
			usage_history: z.array(UsageHistorySchema).nullish(),
		})
		.loose(),
	request_info: RequestInfoSchema.nullish(),
});

export type AccountGetResponse = z.infer<typeof AccountGetResponseSchema>;

// ── Registry ──────────────────────────────────────────────────────────────

export type RedcircleEndpointInputs = {
	productsGet: ProductsGetInput;
	searchProducts: SearchInput;
	reviewsList: ReviewsListInput;
	categoriesList: CategoriesListInput;
	accountGet: AccountGetInput;
};

export type RedcircleEndpointOutputs = {
	productsGet: ProductsGetResponse;
	searchProducts: SearchResponse;
	reviewsList: ReviewsListResponse;
	categoriesList: CategoriesListResponse;
	accountGet: AccountGetResponse;
};

export const RedcircleEndpointInputSchemas = {
	productsGet: ProductsGetInputSchema,
	searchProducts: SearchInputSchema,
	reviewsList: ReviewsListInputSchema,
	categoriesList: CategoriesListInputSchema,
	accountGet: AccountGetInputSchema,
} as const;

export const RedcircleEndpointOutputSchemas = {
	productsGet: ProductsGetResponseSchema,
	searchProducts: SearchResponseSchema,
	reviewsList: ReviewsListResponseSchema,
	categoriesList: CategoriesListResponseSchema,
	accountGet: AccountGetResponseSchema,
} as const;
