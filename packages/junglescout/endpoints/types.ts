import { z } from 'zod';

// ── Shared Enums & Common Schemas ──────────────────────────────────────────

export const MarketplaceSchema = z.enum([
	'us',
	'uk',
	'de',
	'in',
	'ca',
	'fr',
	'it',
	'es',
	'mx',
	'jp',
]);
export type JungleScoutMarketplace = z.infer<typeof MarketplaceSchema>;

export const KeywordSortSchema = z.enum([
	'name',
	'-name',
	'dominant_category',
	'-dominant_category',
	'monthly_trend',
	'-monthly_trend',
	'quarterly_trend',
	'-quarterly_trend',
	'monthly_search_volume_exact',
	'-monthly_search_volume_exact',
	'monthly_search_volume_broad',
	'-monthly_search_volume_broad',
	'recommended_promotions',
	'-recommended_promotions',
	'sp_brand_ad_bid',
	'-sp_brand_ad_bid',
	'ppc_bid_broad',
	'-ppc_bid_broad',
	'ppc_bid_exact',
	'-ppc_bid_exact',
	'ease_of_ranking_score',
	'-ease_of_ranking_score',
	'relevancy_score',
	'-relevancy_score',
	'organic_product_count',
	'-organic_product_count',
]);
export type JungleScoutKeywordSort = z.infer<typeof KeywordSortSchema>;

export const ProductSortSchema = z.enum([
	'name',
	'-name',
	'category',
	'-category',
	'revenue',
	'-revenue',
	'sales',
	'-sales',
	'price',
	'-price',
	'rank',
	'-rank',
	'reviews',
	'-reviews',
	'lqs',
	'-lqs',
	'sellers',
	'-sellers',
]);
export type JungleScoutProductSort = z.infer<typeof ProductSortSchema>;

export const ProductTierSchema = z.enum(['standard', 'oversize']);
export type JungleScoutProductTier = z.infer<typeof ProductTierSchema>;

export const SellerTypeSchema = z.enum(['amz', 'fba', 'fbm']);
export type JungleScoutSellerType = z.infer<typeof SellerTypeSchema>;

export const PaginationLinksSchema = z
	.object({
		self: z.string().optional(),
		next: z.string().nullable().optional(),
	})
	.passthrough();

export const PaginationMetaSchema = z
	.object({
		total_items: z.number().optional(),
	})
	.passthrough();

const ISODateSchema = z
	.string()
	.regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format')
	.refine((value) => {
		const date = new Date(`${value}T00:00:00.000Z`);
		return (
			Number.isFinite(date.getTime()) &&
			date.toISOString().slice(0, 10) === value
		);
	}, 'Date must be a valid calendar date');

// Jungle Scout documents additive response fields as non-breaking changes, so response objects
// preserve documented extensions with passthrough; all request schemas remain strict.

// ── 1. Keywords by ASIN ─────────────────────────────────────────────────────

export const KeywordsByAsinInputSchema = z
	.object({
		marketplace: MarketplaceSchema,
		asins: z
			.array(z.string().min(1, 'ASIN cannot be empty'))
			.min(1, 'At least one ASIN is required')
			.max(10, 'Cannot exceed 10 ASINs'),
		sort: KeywordSortSchema.optional(),
		page_size: z.number().int().min(1).max(100).optional(),
		page_cursor: z.string().optional(),
		include_variants: z.boolean().optional(),
		min_monthly_search_volume_exact: z.number().int().optional(),
		max_monthly_search_volume_exact: z.number().int().optional(),
		min_monthly_search_volume_broad: z.number().int().optional(),
		max_monthly_search_volume_broad: z.number().int().optional(),
		min_word_count: z.number().int().optional(),
		max_word_count: z.number().int().optional(),
		min_organic_product_count: z.number().int().optional(),
		max_organic_product_count: z.number().int().optional(),
	})
	.strict();

export type KeywordsByAsinInput = z.infer<typeof KeywordsByAsinInputSchema>;

export const CompetitorOrganicRankSchema = z
	.object({
		asin: z.string(),
		organic_rank: z.number().int(),
	})
	.passthrough();

export const CompetitorSponsoredRankSchema = z
	.object({
		asin: z.string(),
		sponsored_rank: z.number().int(),
	})
	.passthrough();

export const KeywordsByAsinItemAttributesSchema = z
	.object({
		country: z.string(),
		name: z.string(),
		primary_asin: z.string().optional(),
		monthly_trend: z.number().nullable().optional(),
		monthly_search_volume_exact: z.number().int().nullable().optional(),
		quarterly_trend: z.number().nullable().optional(),
		monthly_search_volume_broad: z.number().int().nullable().optional(),
		dominant_category: z.string().optional(),
		recommended_promotions: z.number().int().nullable().optional(),
		updated_at: z.string().nullable().optional(),
		sp_brand_ad_bid: z.number().nullable().optional(),
		ppc_bid_broad: z.number().nullable().optional(),
		ppc_bid_exact: z.number().nullable().optional(),
		ease_of_ranking_score: z.number().int().optional(),
		relevancy_score: z.number().int().nullable().optional(),
		organic_product_count: z.number().int().nullable().optional(),
		sponsored_product_count: z.number().int().nullable().optional(),
		organic_rank: z.number().int().nullable().optional(),
		sponsored_rank: z.number().int().nullable().optional(),
		overall_rank: z.number().int().nullable().optional(),
		organic_ranking_asins_count: z.number().int().nullable().optional(),
		sponsored_ranking_asins_count: z.number().int().nullable().optional(),
		avg_competitor_organic_rank: z.number().nullable().optional(),
		avg_competitor_sponsored_rank: z.number().nullable().optional(),
		relative_organic_position: z.number().int().nullable().optional(),
		relative_sponsored_position: z.number().int().nullable().optional(),
		competitor_organic_rank: z
			.array(CompetitorOrganicRankSchema)
			.nullable()
			.optional(),
		competitor_sponsored_rank: z
			.array(CompetitorSponsoredRankSchema)
			.nullable()
			.optional(),
	})
	.passthrough();

export const KeywordsByAsinItemSchema = z
	.object({
		id: z.string(),
		type: z.string(),
		attributes: KeywordsByAsinItemAttributesSchema,
	})
	.passthrough();

export const KeywordsByAsinResponseSchema = z
	.object({
		data: z.array(KeywordsByAsinItemSchema),
		links: PaginationLinksSchema.optional(),
		meta: PaginationMetaSchema.optional(),
	})
	.passthrough();

export type KeywordsByAsinResponse = z.infer<
	typeof KeywordsByAsinResponseSchema
>;

// ── 2. Keywords by Keyword ──────────────────────────────────────────────────

export const KeywordsByKeywordInputSchema = z
	.object({
		marketplace: MarketplaceSchema,
		search_terms: z
			.array(z.string().min(1, 'search term cannot be empty'))
			.min(1, 'At least one search term is required'),
		categories: z.array(z.string().min(1)).optional().nullable(),
		sort: KeywordSortSchema.optional(),
		page_size: z.number().int().min(1).max(100).optional(),
		page_cursor: z.string().optional(),
		min_monthly_search_volume_exact: z.number().int().optional(),
		max_monthly_search_volume_exact: z.number().int().optional(),
		min_monthly_search_volume_broad: z.number().int().optional(),
		max_monthly_search_volume_broad: z.number().int().optional(),
		min_word_count: z.number().int().optional(),
		max_word_count: z.number().int().optional(),
		min_organic_product_count: z.number().int().optional(),
		max_organic_product_count: z.number().int().optional(),
	})
	.strict();

export type KeywordsByKeywordInput = z.infer<
	typeof KeywordsByKeywordInputSchema
>;

export const KeywordsByKeywordItemAttributesSchema = z
	.object({
		country: z.string(),
		name: z.string(),
		monthly_trend: z.number().nullable().optional(),
		monthly_search_volume_exact: z.number().int().nullable().optional(),
		quarterly_trend: z.number().nullable().optional(),
		monthly_search_volume_broad: z.number().int().nullable().optional(),
		dominant_category: z.string().optional(),
		recommended_promotions: z.number().int().nullable().optional(),
		sp_brand_ad_bid: z.number().nullable().optional(),
		ppc_bid_broad: z.number().nullable().optional(),
		ppc_bid_exact: z.number().nullable().optional(),
		relevancy_score: z.number().int().nullable().optional(),
		organic_product_count: z.number().int().nullable().optional(),
		sponsored_product_count: z.number().int().nullable().optional(),
	})
	.passthrough();

export const KeywordsByKeywordItemSchema = z
	.object({
		id: z.string(),
		type: z.string(),
		attributes: KeywordsByKeywordItemAttributesSchema,
	})
	.passthrough();

export const KeywordsByKeywordResponseSchema = z
	.object({
		data: z.array(KeywordsByKeywordItemSchema),
		links: PaginationLinksSchema.optional(),
		meta: PaginationMetaSchema.optional(),
	})
	.passthrough();

export type KeywordsByKeywordResponse = z.infer<
	typeof KeywordsByKeywordResponseSchema
>;

// ── 3. Historical Search Volume ─────────────────────────────────────────────

export const HistoricalSearchVolumeInputSchema = z
	.object({
		marketplace: MarketplaceSchema,
		keyword: z.string().min(1, 'keyword cannot be empty'),
		start_date: ISODateSchema,
		end_date: ISODateSchema,
	})
	.superRefine(({ start_date, end_date }, context) => {
		if (start_date >= end_date) {
			context.addIssue({
				code: 'custom',
				path: ['end_date'],
				message: 'end_date must be after start_date',
			});
		}
	})
	.strict();

export type HistoricalSearchVolumeInput = z.infer<
	typeof HistoricalSearchVolumeInputSchema
>;

export const HistoricalSearchVolumeItemAttributesSchema = z
	.object({
		estimate_start_date: z.string(),
		estimate_end_date: z.string(),
		estimated_exact_search_volume: z.number().int(),
	})
	.passthrough();

export const HistoricalSearchVolumeItemSchema = z
	.object({
		id: z.string(),
		type: z.string(),
		attributes: HistoricalSearchVolumeItemAttributesSchema,
	})
	.passthrough();

export const HistoricalSearchVolumeResponseSchema = z
	.object({
		data: z.array(HistoricalSearchVolumeItemSchema),
	})
	.passthrough();

export type HistoricalSearchVolumeResponse = z.infer<
	typeof HistoricalSearchVolumeResponseSchema
>;

// ── 4. Product Database ─────────────────────────────────────────────────────

export const ProductDatabaseQueryInputSchema = z
	.object({
		marketplace: MarketplaceSchema,
		sort: ProductSortSchema.optional(),
		page_size: z.number().int().min(1).max(100).optional(),
		page_cursor: z.string().optional(),
		include_keywords: z.array(z.string().min(1).max(50)).max(100).optional(),
		exclude_keywords: z.array(z.string().min(1).max(50)).max(100).optional(),
		categories: z.array(z.string().min(1)).nullable().optional(),
		product_tiers: z.array(ProductTierSchema).optional(),
		seller_types: z.array(SellerTypeSchema).optional(),
		exclude_top_brands: z.boolean().optional(),
		exclude_unavailable_products: z.boolean().optional(),
		min_price: z.number().optional(),
		max_price: z.number().optional(),
		min_net: z.number().optional(),
		max_net: z.number().optional(),
		min_rank: z.number().int().optional(),
		max_rank: z.number().int().optional(),
		min_sales: z.number().int().optional(),
		max_sales: z.number().int().optional(),
		min_revenue: z.number().optional(),
		max_revenue: z.number().optional(),
		min_reviews: z.number().int().optional(),
		max_reviews: z.number().int().optional(),
		min_rating: z.number().min(1).max(5).optional(),
		max_rating: z.number().min(1).max(5).optional(),
		min_weight: z.number().optional(),
		max_weight: z.number().optional(),
		min_sellers: z.number().int().optional(),
		max_sellers: z.number().int().optional(),
		min_lqs: z.number().min(1).max(10).optional(),
		max_lqs: z.number().min(1).max(10).optional(),
		min_updated_at: ISODateSchema.optional(),
		max_updated_at: ISODateSchema.optional(),
	})
	.strict();

export type ProductDatabaseQueryInput = z.infer<
	typeof ProductDatabaseQueryInputSchema
>;

export const FeeBreakdownSchema = z
	.object({
		fba_fee: z.number().optional(),
		referral_fee: z.number().optional(),
		variable_closing_fee: z.number().optional(),
		total_fees: z.number().optional(),
	})
	.passthrough();

export const SubcategoryRankSchema = z
	.object({
		subcategory: z.string().optional(),
		rank: z.number().optional(),
		id: z.string().nullable().optional(),
	})
	.passthrough();

export const ProductDatabaseItemAttributesSchema = z
	.object({
		title: z.string().optional(),
		price: z.number().optional(),
		reviews: z.number().int().optional(),
		category: z.string().optional(),
		rating: z.number().optional(),
		image_url: z.string().optional(),
		parent_asin: z.string().nullable().optional(),
		is_variant: z.boolean().optional(),
		seller_type: z.string().optional(),
		breadcrumb_path: z.string().nullable().optional(),
		is_standalone: z.boolean().optional(),
		is_parent: z.boolean().optional(),
		is_available: z.boolean().optional(),
		brand: z.string().optional(),
		product_rank: z.number().nullable().optional(),
		weight_value: z.number().nullable().optional(),
		weight_unit: z.string().nullable().optional(),
		length_value: z.number().nullable().optional(),
		width_value: z.number().nullable().optional(),
		height_value: z.number().nullable().optional(),
		dimensions_unit: z.string().nullable().optional(),
		listing_quality_score: z.number().optional(),
		number_of_sellers: z.number().optional(),
		buy_box_owner: z.string().optional(),
		buy_box_owner_seller_id: z.string().optional(),
		date_first_available: z.string().nullable().optional(),
		date_first_available_is_estimated: z.boolean().optional(),
		approximate_30_day_revenue: z.number().optional(),
		approximate_30_day_units_sold: z.number().int().optional(),
		subcategory_ranks: z.array(SubcategoryRankSchema).optional(),
		fee_breakdown: FeeBreakdownSchema.nullable().optional(),
		ean_list: z.array(z.string()).nullable().optional(),
		isbn_list: z.array(z.string()).nullable().optional(),
		upc_list: z.array(z.string()).nullable().optional(),
		gtin_list: z.array(z.string()).nullable().optional(),
		variant_reviews: z.number().nullable().optional(),
		updated_at: z.string().optional(),
	})
	.passthrough();

export const ProductDatabaseItemSchema = z
	.object({
		id: z.string(),
		type: z.string(),
		attributes: ProductDatabaseItemAttributesSchema,
	})
	.passthrough();

export const ProductDatabaseQueryResponseSchema = z
	.object({
		data: z.array(ProductDatabaseItemSchema),
		links: PaginationLinksSchema.optional(),
		meta: PaginationMetaSchema.optional(),
	})
	.passthrough();

export type ProductDatabaseQueryResponse = z.infer<
	typeof ProductDatabaseQueryResponseSchema
>;

// ── 5. Sales Estimates ──────────────────────────────────────────────────────

export const SalesEstimatesQueryInputSchema = z
	.object({
		marketplace: MarketplaceSchema,
		asin: z.string().min(1, 'asin cannot be empty'),
		start_date: ISODateSchema,
		end_date: ISODateSchema,
	})
	.superRefine(({ start_date, end_date }, context) => {
		if (start_date > end_date) {
			context.addIssue({
				code: 'custom',
				path: ['end_date'],
				message: 'end_date must be on or after start_date',
			});
		}
		if (end_date >= new Date().toISOString().slice(0, 10)) {
			context.addIssue({
				code: 'custom',
				path: ['end_date'],
				message: 'end_date must be before the current date',
			});
		}
	})
	.strict();

export type SalesEstimatesQueryInput = z.infer<
	typeof SalesEstimatesQueryInputSchema
>;

export const DailySalesEstimateSchema = z
	.object({
		date: ISODateSchema,
		estimated_units_sold: z.number().int(),
		last_known_price: z.number().optional(),
	})
	.passthrough();

export const SalesEstimateItemAttributesSchema = z
	.object({
		asin: z.string(),
		is_parent: z.boolean(),
		is_variant: z.boolean(),
		is_standalone: z.boolean(),
		parent_asin: z.string().nullable().optional(),
		variants: z.array(z.string()).optional(),
		data: z.array(DailySalesEstimateSchema),
	})
	.passthrough();

export const SalesEstimateItemSchema = z
	.object({
		id: z.string(),
		type: z.string(),
		attributes: SalesEstimateItemAttributesSchema,
	})
	.passthrough();

export const SalesEstimatesQueryResponseSchema = z
	.object({
		data: z.array(SalesEstimateItemSchema),
	})
	.passthrough();

export type SalesEstimatesQueryResponse = z.infer<
	typeof SalesEstimatesQueryResponseSchema
>;

// ── 6. Share of Voice ───────────────────────────────────────────────────────

export const ShareOfVoiceInputSchema = z
	.object({
		marketplace: MarketplaceSchema,
		keyword: z.string().min(1, 'keyword cannot be empty'),
	})
	.strict();

export type ShareOfVoiceInput = z.infer<typeof ShareOfVoiceInputSchema>;

export const ShareOfVoiceBrandSchema = z
	.object({
		brand: z.string(),
		combined_products: z.number().int(),
		combined_weighted_sov: z.number(),
		combined_basic_sov: z.number(),
		combined_average_position: z.number(),
		combined_average_price: z.number().optional(),
		organic_products: z.number().int(),
		organic_weighted_sov: z.number(),
		organic_basic_sov: z.number(),
		organic_average_position: z.number(),
		organic_average_price: z.number().nullable().optional(),
		sponsored_products: z.number().int(),
		sponsored_weighted_sov: z.number(),
		sponsored_basic_sov: z.number(),
		sponsored_average_position: z.number(),
		sponsored_average_price: z.number().nullable().optional(),
	})
	.passthrough();

export const ShareOfVoiceTopAsinSchema = z
	.object({
		asin: z.string(),
		name: z.string().nullable().optional(),
		brand: z.string().nullable().optional(),
		clicks: z.number().int(),
		conversions: z.number().int(),
		conversion_rate: z.number().nullable().optional(),
	})
	.passthrough();

export const ShareOfVoiceAttributesSchema = z
	.object({
		estimated_30_day_search_volume: z.number().int(),
		exact_suggested_bid_median: z.number(),
		product_count: z.number().int(),
		updated_at: z.string(),
		top_asins_model_start_date: z.string().nullable().optional(),
		top_asins_model_end_date: z.string().nullable().optional(),
		brands: z.array(ShareOfVoiceBrandSchema),
		top_asins: z.array(ShareOfVoiceTopAsinSchema).nullable().optional(),
	})
	.passthrough();

export const ShareOfVoiceDataSchema = z
	.object({
		id: z.string().optional(),
		type: z.string(),
		attributes: ShareOfVoiceAttributesSchema,
	})
	.passthrough();

export const ShareOfVoiceResponseSchema = z
	.object({
		data: ShareOfVoiceDataSchema,
	})
	.passthrough();

export type ShareOfVoiceResponse = z.infer<typeof ShareOfVoiceResponseSchema>;

// ── Schema Maps ─────────────────────────────────────────────────────────────

export const JungleScoutEndpointInputSchemas = {
	'keywords.byAsin': KeywordsByAsinInputSchema,
	'keywords.byKeyword': KeywordsByKeywordInputSchema,
	'keywords.historicalSearchVolume': HistoricalSearchVolumeInputSchema,
	'productDatabase.query': ProductDatabaseQueryInputSchema,
	'salesEstimates.query': SalesEstimatesQueryInputSchema,
	'shareOfVoice.get': ShareOfVoiceInputSchema,
};

export const JungleScoutEndpointOutputSchemas = {
	'keywords.byAsin': KeywordsByAsinResponseSchema,
	'keywords.byKeyword': KeywordsByKeywordResponseSchema,
	'keywords.historicalSearchVolume': HistoricalSearchVolumeResponseSchema,
	'productDatabase.query': ProductDatabaseQueryResponseSchema,
	'salesEstimates.query': SalesEstimatesQueryResponseSchema,
	'shareOfVoice.get': ShareOfVoiceResponseSchema,
};

export type JungleScoutEndpointInputs = {
	[K in keyof typeof JungleScoutEndpointInputSchemas]: z.infer<
		(typeof JungleScoutEndpointInputSchemas)[K]
	>;
};

export type JungleScoutEndpointOutputs = {
	[K in keyof typeof JungleScoutEndpointOutputSchemas]: z.infer<
		(typeof JungleScoutEndpointOutputSchemas)[K]
	>;
};
