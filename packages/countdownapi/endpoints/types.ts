import { z } from 'zod';

// ---------------------------------------------------------------------------
// Input schemas
// ---------------------------------------------------------------------------

const SearchInputSchema = z.object({
	query: z.string().min(1),
	ebay_domain: z.string().min(1).default('ebay.com'),
	page: z.number().int().positive().optional(),
});

const ProductInputSchema = z
	.object({
		url: z.string().url().optional(),
		epid: z.string().optional(),
		gtin: z.string().optional(),
		ebay_domain: z.string().min(1).default('ebay.com'),
		include_html: z.boolean().optional(),
		skip_gtin_cache: z.boolean().optional(),
		include_parts_compatibility: z.boolean().optional(),
	})
	.refine(
		(value) => Boolean(value.url) || Boolean(value.epid) || Boolean(value.gtin),
		{
			message: 'Provide at least one of url, epid, or gtin',
		},
	);

const AutocompleteInputSchema = z.object({
	query: z.string().min(1),
	ebay_domain: z.string().min(1).default('ebay.com'),
});

// ---------------------------------------------------------------------------
// Output schemas – modelled from the official CountdownAPI documentation
// (docs.trajectdata.com/countdownapi/ebay-product-data-api/results/*).
// All object schemas use .passthrough() so that additional fields returned by
// the API are preserved rather than silently stripped.
// ---------------------------------------------------------------------------

const RequestMetadataSchema = z
	.object({
		id: z.string(),
		created_at: z.string().optional(),
		processed_at: z.string().optional(),
		total_time_taken: z.number().optional(),
		ebay_url: z.string().optional(),
	})
	.passthrough();

const RequestInfoSchema = z
	.object({
		success: z.boolean().optional(),
		credits_used: z.number().optional(),
		credits_remaining: z.number().optional(),
	})
	.passthrough();

const RequestParametersSchema = z
	.object({
		type: z.string(),
		ebay_domain: z.string().optional(),
		search_term: z.string().optional(),
		epid: z.string().optional(),
		gtin: z.string().optional(),
		url: z.string().optional(),
	})
	.passthrough();

const PriceSchema = z
	.object({
		symbol: z.string().optional(),
		value: z.number().optional(),
		currency: z.string().optional(),
		raw: z.string().optional(),
		name: z.string().optional(),
	})
	.passthrough();

const SellerInfoSchema = z
	.object({
		name: z.string().optional(),
		review_count: z.number().optional(),
		positive_feedback_percent: z.number().optional(),
	})
	.passthrough();

const EndedSchema = z
	.object({
		type: z.string().optional(),
		date: z.object({ raw: z.string().optional() }).passthrough().optional(),
	})
	.passthrough();

const SearchResultItemSchema = z
	.object({
		position: z.number().optional(),
		title: z.string(),
		epid: z.string().optional(),
		link: z.string(),
		image: z.string().optional(),
		hotness: z.string().optional(),
		condition: z.string().optional(),
		is_auction: z.boolean().optional(),
		buy_it_now: z.boolean().optional(),
		free_returns: z.boolean().optional(),
		sponsored: z.boolean().optional(),
		item_location: z.string().optional(),
		rating: z.number().optional(),
		ratings_total: z.number().optional(),
		shipping_cost: z.number().optional(),
		prices: z.array(PriceSchema).optional(),
		price: PriceSchema.optional(),
		ended: EndedSchema.optional(),
		seller_info: SellerInfoSchema.optional(),
	})
	.passthrough();

const FacetSchema = z
	.object({
		name: z.string(),
		display_name: z.string().optional(),
		values: z
			.array(
				z
					.object({
						name: z.string(),
						count: z.number().optional(),
						param_value: z.string().optional(),
					})
					.passthrough(),
			)
			.optional(),
	})
	.passthrough();

const SearchInformationSchema = z
	.object({
		original_search_term: z.string().optional(),
		did_you_mean: z.string().optional(),
		did_you_mean_results_count: z.number().optional(),
		spelling_correction: z.string().optional(),
	})
	.passthrough();

const PaginationSchema = z
	.object({
		current_page: z.number().optional(),
		// Documented as a number but rendered as a string in the docs' own
		// example response ("total_results": "9893").
		total_results: z.union([z.number(), z.string()]).optional(),
		has_next_page: z.boolean().optional(),
		next_page: z.number().optional(),
	})
	.passthrough();

const SearchResponseSchema = z
	.object({
		request_metadata: RequestMetadataSchema,
		request_info: RequestInfoSchema.optional(),
		request_parameters: RequestParametersSchema.optional(),
		search_information: SearchInformationSchema.optional(),
		search_results: z.array(SearchResultItemSchema),
		facets: z.array(FacetSchema).optional(),
		pagination: PaginationSchema.optional(),
	})
	.passthrough();

const ProductDetailsSchema = z
	.object({
		title: z.string(),
		link: z.string().optional(),
		images: z.array(z.object({ link: z.string() }).passthrough()).optional(),
	})
	.passthrough();

// A product request resolves to exactly one of three documented shapes
// (docs.trajectdata.com/countdownapi/ebay-product-data-api/results/product):
// an individual listing page, a master product page, or a redirect to a
// similar listing. Metadata alone matches no branch and is rejected.
const ProductResponseBaseSchema = z
	.object({
		request_metadata: RequestMetadataSchema,
		request_info: RequestInfoSchema.optional(),
		request_parameters: RequestParametersSchema.optional(),
	})
	.passthrough();

const ProductListingResponseSchema = ProductResponseBaseSchema.extend({
	// Individual listing pages answer with a single top-level product object;
	// on master pages the products are nested inside top_picks instead.
	is_master: z.literal(false).optional(),
	product: ProductDetailsSchema,
}).passthrough();

const MasterProductResponseSchema = ProductResponseBaseSchema.extend({
	is_master: z.literal(true),
	sold_out: z.boolean().optional(),
	top_picks: z.array(z.record(z.string(), z.unknown())),
}).passthrough();

const RedirectedProductResponseSchema = ProductResponseBaseSchema.extend({
	redirected: z.boolean().optional(),
	redirected_link: z.string(),
	redirected_epid: z.string(),
}).passthrough();

const ProductResponseSchema = z.union([
	ProductListingResponseSchema,
	MasterProductResponseSchema,
	RedirectedProductResponseSchema,
]);

const AutocompleteResultSchema = z
	.object({
		suggestion: z.string(),
		type: z.string().optional(),
		// Documented as a string but rendered as a number in the docs' own
		// example response ("category_id": 9394).
		category_id: z.union([z.string(), z.number()]).optional(),
		category_name: z.string().optional(),
	})
	.passthrough();

const AutocompleteResponseSchema = z
	.object({
		request_metadata: RequestMetadataSchema,
		request_info: RequestInfoSchema.optional(),
		request_parameters: RequestParametersSchema.optional(),
		autocomplete_results: z.array(AutocompleteResultSchema),
	})
	.passthrough();

// ---------------------------------------------------------------------------
// Exported types
// ---------------------------------------------------------------------------

export type SearchInput = z.infer<typeof SearchInputSchema>;
export type ProductInput = z.infer<typeof ProductInputSchema>;
export type AutocompleteInput = z.infer<typeof AutocompleteInputSchema>;

export type SearchResponse = z.infer<typeof SearchResponseSchema>;
export type ProductResponse = z.infer<typeof ProductResponseSchema>;
export type AutocompleteResponse = z.infer<typeof AutocompleteResponseSchema>;

export type CountdownApiEndpointInputs = {
	search: SearchInput;
	product: ProductInput;
	autocomplete: AutocompleteInput;
};

export type CountdownApiEndpointOutputs = {
	search: SearchResponse;
	product: ProductResponse;
	autocomplete: AutocompleteResponse;
};

export const CountdownApiEndpointInputSchemas = {
	search: SearchInputSchema,
	product: ProductInputSchema,
	autocomplete: AutocompleteInputSchema,
} as const;

export const CountdownApiEndpointOutputSchemas = {
	search: SearchResponseSchema,
	product: ProductResponseSchema,
	autocomplete: AutocompleteResponseSchema,
} as const;
