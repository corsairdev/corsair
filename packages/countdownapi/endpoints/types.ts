import { z } from 'zod';

const SearchListingTypeSchema = z.enum([
	'all',
	'buy_it_now',
	'auction',
	'accepts_offers',
]);

const SearchSortBySchema = z.enum([
	'best_match',
	'price_high_to_low',
	'price_low_to_high',
	'price_high_to_low_plus_postage',
	'price_low_to_high_plus_postage',
	'newly_listed',
	'ending_soonest',
]);

const SearchConditionSchema = z.enum([
	'all',
	'new',
	'used',
	'open_box',
	'manufacturer_refurbished',
	'seller_refurbished',
	'parts_or_not_working',
	'not_specified',
]);

const SearchInputSchema = z
	.object({
		query: z.string().min(1).optional(),
		ebay_domain: z.string().min(1).default('ebay.com'),
		page: z.number().int().positive().optional(),
		category_id: z.string().min(1).optional(),
		listing_type: SearchListingTypeSchema.optional(),
		sort_by: SearchSortBySchema.optional(),
		condition: SearchConditionSchema.optional(),
		max_page: z.number().int().positive().optional(),
		num: z.union([z.literal(60), z.literal(120), z.literal(240)]).optional(),
		url: z.string().url().optional(),
		authorized_sellers: z.boolean().optional(),
		returns_accepted: z.boolean().optional(),
		free_returns: z.boolean().optional(),
		authenticity_verified: z.boolean().optional(),
		deals_and_savings: z.boolean().optional(),
		sale_items: z.boolean().optional(),
		facets: z.string().min(1).optional(),
		allow_rewritten_results: z.boolean().optional(),
	})
	.superRefine((value, ctx) => {
		if (!value.query && !value.url) {
			ctx.addIssue({
				code: 'custom',
				message: 'Provide at least one of query or url',
			});
		}
	});

const partsCompatibilityDomains = new Set(['ebay.com', 'ebay.co.uk']);

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
	.superRefine((value, ctx) => {
		if (!value.url && !value.epid && !value.gtin) {
			ctx.addIssue({
				code: 'custom',
				message: 'Provide at least one of url, epid, or gtin',
			});
		}

		if (!value.include_parts_compatibility) {
			return;
		}

		if (!value.epid) {
			ctx.addIssue({
				code: 'custom',
				path: ['epid'],
				message: 'include_parts_compatibility requires epid',
			});
		}

		if (value.url) {
			ctx.addIssue({
				code: 'custom',
				path: ['url'],
				message: 'include_parts_compatibility cannot be used with url',
			});
		}

		if (!partsCompatibilityDomains.has(value.ebay_domain)) {
			ctx.addIssue({
				code: 'custom',
				path: ['ebay_domain'],
				message:
					'include_parts_compatibility is only available on ebay.com and ebay.co.uk',
			});
		}
	});

const AutocompleteInputSchema = z.object({
	query: z.string().min(1),
	ebay_domain: z.string().min(1).default('ebay.com'),
});

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

const ProductAttributeSchema = z
	.object({
		name: z.string(),
		value: z.string().optional(),
	})
	.passthrough();

const ProductDetailsSchema = z
	.object({
		title: z.string(),
		link: z.string().optional(),
		epid: z.string().optional(),
		gtin: z.string().optional(),
		images: z.array(z.object({ link: z.string() }).passthrough()).optional(),
		attributes: z.array(ProductAttributeSchema).optional(),
	})
	.passthrough();

const ProductResponseBaseSchema = z
	.object({
		request_metadata: RequestMetadataSchema,
		request_info: RequestInfoSchema.optional(),
		request_parameters: RequestParametersSchema.optional(),
	})
	.passthrough();

const ProductListingResponseSchema = ProductResponseBaseSchema.extend({
	is_master: z.literal(false).optional(),
	product: ProductDetailsSchema,
}).passthrough();

const MasterTopPickSchema = z
	.object({
		product: ProductDetailsSchema,
		all_listings: z
			.object({
				link: z.string().optional(),
				count: z.number().optional(),
			})
			.passthrough()
			.optional(),
		seller: z
			.object({
				name: z.string().optional(),
				link: z.string().optional(),
				feedback_score: z.number().optional(),
				positive_feedback_percent: z.union([z.number(), z.string()]).optional(),
			})
			.passthrough()
			.optional(),
		shipping: z
			.object({
				raw: z.string().optional(),
				price: z.number().optional(),
				currency: z.string().optional(),
				location: z.string().optional(),
				delivery_estimate: z.string().optional(),
			})
			.passthrough()
			.optional(),
		condition: z
			.object({
				raw: z.string().optional(),
				name: z.string().optional(),
				is_new: z.boolean().optional(),
				is_used: z.boolean().optional(),
			})
			.passthrough()
			.optional(),
		is_auction: z.boolean().optional(),
		offer: z
			.object({
				price: z.number().optional(),
				raw: z.string().optional(),
				currency: z.string().optional(),
			})
			.passthrough()
			.optional(),
	})
	.passthrough();

const MasterProductResponseSchema = ProductResponseBaseSchema.extend({
	is_master: z.literal(true),
	sold_out: z.boolean().optional(),
	top_picks: z.array(MasterTopPickSchema),
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

export type SearchInput = z.input<typeof SearchInputSchema>;
export type ProductInput = z.input<typeof ProductInputSchema>;
export type AutocompleteInput = z.input<typeof AutocompleteInputSchema>;

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
