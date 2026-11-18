import { z } from 'zod';

// Request and response shapes for the LiteScrape REST gateway. Every endpoint
// is documented at https://litescrape.com/docs/<page> and enumerated at
// https://litescrape.com/docs and https://litescrape.com/docs/reference.
//
// Responses share one envelope: `search_metadata`, `search_parameters`, the
// result groups the operation produces, and `pagination` /
// `litescrape_pagination` where the source paginates
// (https://litescrape.com/docs/reference#response-structure). Leaf shapes vary
// with the upstream SERP, so item schemas pin the documented, stable fields
// and pass the rest through instead of guessing at a closed shape.

// ── Shared response building blocks ─────────────────────────────────────────

export const SearchMetadataSchema = z
	.object({
		id: z.string().optional(),
		status: z.string().optional(),
		total_time_taken: z.number().optional(),
		google_url: z.string().optional(),
		bing_url: z.string().optional(),
	})
	.passthrough();

export const SearchParametersSchema = z.object({}).passthrough();

export const PaginationSchema = z
	.object({
		next: z.string().optional(),
		next_page_token: z.string().optional(),
		page: z.number().optional(),
	})
	.passthrough();

export const LitescrapePaginationSchema = z
	.object({
		next: z.string().optional(),
		next_page_token: z.string().optional(),
	})
	.passthrough();

export const WebResultSchema = z
	.object({
		position: z.number().optional(),
		title: z.string().optional(),
		link: z.string().optional(),
		snippet: z.string().optional(),
		displayed_link: z.string().optional(),
		source: z.string().optional(),
		date: z.string().optional(),
	})
	.passthrough();

export const LocalResultSchema = z
	.object({
		position: z.number().optional(),
		title: z.string().optional(),
		place_id: z.string().optional(),
		data_id: z.string().optional(),
		type: z.string().optional(),
		address: z.string().optional(),
		phone: z.string().optional(),
		website: z.string().optional(),
		rating: z.number().optional(),
		reviews: z.number().optional(),
	})
	.passthrough();

export const PlaceResultSchema = LocalResultSchema;

export const ReviewSchema = z
	.object({
		position: z.number().optional(),
		rating: z.number().optional(),
		title: z.string().optional(),
		snippet: z.string().optional(),
		text: z.string().optional(),
		date: z.string().optional(),
		author: z.string().optional(),
		reviewer: z.string().optional(),
		likes: z.number().optional(),
	})
	.passthrough();

export const ShoppingResultSchema = z
	.object({
		position: z.number().optional(),
		title: z.string().optional(),
		link: z.string().optional(),
		price: z.string().optional(),
		merchant: z.string().optional(),
		rating: z.number().optional(),
		reviews: z.number().optional(),
		thumbnail: z.string().optional(),
	})
	.passthrough();

export const AdResultSchema = z
	.object({
		position: z.number().optional(),
		title: z.string().optional(),
		link: z.string().optional(),
		description: z.string().optional(),
	})
	.passthrough();

export const KnowledgeGraphSchema = z
	.object({
		title: z.string().optional(),
		type: z.string().optional(),
		kgmid: z.string().optional(),
		description: z.string().optional(),
	})
	.passthrough();

// AI Overview is null when Google shows none, and the call is not billed
// (https://litescrape.com/docs/google-ai-overview).
export const AiOverviewSchema = z
	.object({
		text_blocks: z.array(z.object({}).passthrough()).optional(),
		references: z.array(z.object({}).passthrough()).optional(),
	})
	.passthrough();

export const TextBlockSchema = z
	.object({
		type: z.string().optional(),
		text: z.string().optional(),
	})
	.passthrough();

export const ReferenceSchema = z
	.object({
		title: z.string().optional(),
		link: z.string().optional(),
		snippet: z.string().optional(),
	})
	.passthrough();

export const FilterSchema = z
	.object({
		title: z.string().optional(),
		value: z.string().optional(),
	})
	.passthrough();

export const GenericObjectSchema = z.object({}).passthrough();

// ── Shared request building blocks ──────────────────────────────────────────

const googleQueryEntity = {
	// Required unless ludocid or kgmid is supplied; up to 2,048 characters.
	q: z.string().max(2048).optional(),
	ludocid: z.string().optional(),
	kgmid: z.string().optional(),
};

const googleGeography = {
	location: z.string().optional(),
	uule: z.string().optional(),
	lat: z.number().min(-90).max(90).optional(),
	lon: z.number().min(-180).max(180).optional(),
	radius: z.number().positive().max(1000).optional(),
};

const googleKnowledgeGraphControls = {
	lsig: z.string().optional(),
	si: z.string().optional(),
	ibp: z.string().optional(),
	uds: z.string().optional(),
	color_scheme: z.enum(['light', 'dark']).optional(),
};

const googleLocalization = {
	hl: z.string().optional(),
	gl: z.string().optional(),
	google_domain: z.string().optional(),
	cr: z.string().optional(),
	lr: z.string().optional(),
	device: z.enum(['desktop', 'tablet', 'mobile']).optional(),
};

const googleFiltering = {
	tbs: z.string().optional(),
	safe: z.enum(['active', 'off']).optional(),
	nfpr: z.union([z.literal(0), z.literal(1)]).optional(),
	filter: z.union([z.literal(0), z.literal(1)]).optional(),
	pws: z.union([z.literal(0), z.literal(1)]).optional(),
	peek_pws: z.union([z.literal(0), z.literal(1)]).optional(),
	tbm: z.string().optional(),
	start: z.number().int().nonnegative().optional(),
	num: z.number().int().min(1).max(10).optional(),
};

const googleAdvancedQuery = {
	as_dt: z.enum(['i', 'e']).optional(),
	as_epq: z.string().optional(),
	as_eq: z.string().optional(),
	as_lq: z.string().optional(),
	as_nlo: z.number().int().optional(),
	as_nhi: z.number().int().optional(),
	as_oq: z.string().optional(),
	as_q: z.string().optional(),
	as_qdr: z.string().optional(),
	as_rq: z.string().optional(),
	as_sitesearch: z.string().optional(),
	oq: z.string().optional(),
	gs_lp: z.string().optional(),
	sclient: z.string().optional(),
};

const requireGoogleQuery = {
	message: 'Provide q, ludocid or kgmid for this request',
};

// ── Google Search ───────────────────────────────────────────────────────────

export const GoogleSearchInputSchema = z
	.object({
		fast_mode: z.boolean().optional(),
		...googleQueryEntity,
		...googleGeography,
		...googleKnowledgeGraphControls,
		...googleLocalization,
		...googleFiltering,
		...googleAdvancedQuery,
	})
	.refine(
		(value) => Boolean(value.q || value.ludocid || value.kgmid),
		requireGoogleQuery,
	);

export type GoogleSearchInput = z.infer<typeof GoogleSearchInputSchema>;

export const GoogleSearchResponseSchema = z
	.object({
		search_metadata: SearchMetadataSchema.optional(),
		search_parameters: SearchParametersSchema.optional(),
		search_information: GenericObjectSchema.optional(),
		organic_results: z.array(WebResultSchema).optional(),
		knowledge_graph: KnowledgeGraphSchema.optional(),
		ai_overview: AiOverviewSchema.nullable().optional(),
		related_questions: z.array(GenericObjectSchema).optional(),
		related_searches: z.array(FilterSchema).optional(),
		shopping_results: z.array(ShoppingResultSchema).optional(),
		immersive_products: z.array(ShoppingResultSchema).optional(),
		perspectives: z.array(GenericObjectSchema).optional(),
		pagination: PaginationSchema.optional(),
		litescrape_pagination: LitescrapePaginationSchema.optional(),
	})
	.passthrough();

export type GoogleSearchResponse = z.infer<typeof GoogleSearchResponseSchema>;

// ── Google AI Overview ──────────────────────────────────────────────────────

export const GoogleAiOverviewInputSchema = z
	.object({
		...googleQueryEntity,
		...googleGeography,
		...googleKnowledgeGraphControls,
		...googleLocalization,
		...googleFiltering,
		...googleAdvancedQuery,
	})
	.refine(
		(value) => Boolean(value.q || value.ludocid || value.kgmid),
		requireGoogleQuery,
	);

export type GoogleAiOverviewInput = z.infer<typeof GoogleAiOverviewInputSchema>;

export const GoogleAiOverviewResponseSchema = z
	.object({
		search_metadata: SearchMetadataSchema.optional(),
		search_parameters: SearchParametersSchema.optional(),
		search_information: GenericObjectSchema.optional(),
		ai_overview: AiOverviewSchema.nullable().optional(),
		pagination: PaginationSchema.optional(),
		litescrape_pagination: LitescrapePaginationSchema.optional(),
	})
	.passthrough();

export type GoogleAiOverviewResponse = z.infer<
	typeof GoogleAiOverviewResponseSchema
>;

// ── Google AI Mode ──────────────────────────────────────────────────────────

export const GoogleAiModeInputSchema = z.object({
	// Required question, up to 2,048 characters with no controls.
	q: z.string().min(1).max(2048),
	location: z.string().optional(),
	uule: z.string().optional(),
	hl: z.string().optional(),
	gl: z.string().optional(),
	google_domain: z.string().optional(),
	device: z.enum(['desktop', 'tablet', 'mobile']).optional(),
	continuable: z.boolean().optional(),
	// Opaque token from a previous continuable response; expires after 30
	// minutes and cannot be combined with image_url.
	subsequent_request_token: z.string().optional(),
	image_url: z.string().optional(),
});

export type GoogleAiModeInput = z.infer<typeof GoogleAiModeInputSchema>;

export const GoogleAiModeResponseSchema = z
	.object({
		search_metadata: SearchMetadataSchema.optional(),
		search_parameters: SearchParametersSchema.optional(),
		text_blocks: z.array(TextBlockSchema).optional(),
		references: z.array(ReferenceSchema).optional(),
		litescrape_pagination: LitescrapePaginationSchema.optional(),
	})
	.passthrough();

export type GoogleAiModeResponse = z.infer<typeof GoogleAiModeResponseSchema>;

// ── Google Ads (Alpha) ──────────────────────────────────────────────────────

export const GoogleAdsInputSchema = z.object({
	// Required Google Ads query, up to 2,048 characters with no controls.
	q: z.string().min(1).max(2048),
	// Required named origin, up to 63 UTF-8 bytes once Google-encoded.
	location: z.string().min(1),
	hl: z.string().optional(),
	safe: z.enum(['active', 'off']).optional(),
	nfpr: z.union([z.literal(0), z.literal(1)]).optional(),
	device: z.enum(['desktop', 'tablet', 'mobile']).optional(),
});

export type GoogleAdsInput = z.infer<typeof GoogleAdsInputSchema>;

export const GoogleAdsResponseSchema = z
	.object({
		search_metadata: SearchMetadataSchema.optional(),
		search_parameters: SearchParametersSchema.optional(),
		ads: z.array(AdResultSchema).optional(),
		local_ads: z.array(AdResultSchema).optional(),
		shopping_results: z.array(ShoppingResultSchema).optional(),
		organic_results: z.array(WebResultSchema).optional(),
		related_questions: z.array(GenericObjectSchema).optional(),
		related_searches: z.array(FilterSchema).optional(),
		pagination: PaginationSchema.optional(),
	})
	.passthrough();

export type GoogleAdsResponse = z.infer<typeof GoogleAdsResponseSchema>;

// ── Google Local ────────────────────────────────────────────────────────────

export const GoogleLocalInputSchema = z.object({
	// Required local query, up to 2,048 characters.
	q: z.string().min(1).max(2048),
	ludocid: z.string().optional(),
	tbs: z.string().optional(),
	start: z.number().int().nonnegative().optional(),
	location: z.string().optional(),
	uule: z.string().optional(),
	hl: z.string().optional(),
	gl: z.string().optional(),
	google_domain: z.string().optional(),
	device: z.enum(['desktop', 'tablet', 'mobile']).optional(),
});

export type GoogleLocalInput = z.infer<typeof GoogleLocalInputSchema>;

export const GoogleLocalResponseSchema = z
	.object({
		search_metadata: SearchMetadataSchema.optional(),
		search_parameters: SearchParametersSchema.optional(),
		search_information: GenericObjectSchema.optional(),
		local_results: z.array(LocalResultSchema).optional(),
		local_map: GenericObjectSchema.optional(),
		discover_more_places: z.array(GenericObjectSchema).optional(),
		pagination: PaginationSchema.optional(),
	})
	.passthrough();

export type GoogleLocalResponse = z.infer<typeof GoogleLocalResponseSchema>;

// ── Google Shopping ─────────────────────────────────────────────────────────

export const GoogleShoppingInputSchema = z.object({
	q: z.string().optional(),
	shoprs: z.string().optional(),
	start: z.number().int().nonnegative().optional(),
	num: z.number().int().min(1).max(100).optional(),
	min_price: z.number().nonnegative().optional(),
	max_price: z.number().nonnegative().optional(),
	// Documented codes: 1 relevance (default), 2 price low-to-high,
	// 3 price high-to-low.
	sort_by: z.enum(['1', '2', '3']).optional(),
	on_sale: z.boolean().optional(),
	free_shipping: z.boolean().optional(),
	small_business: z.boolean().optional(),
	location: z.string().optional(),
	uule: z.string().optional(),
	hl: z.string().optional(),
	gl: z.string().optional(),
	google_domain: z.string().optional(),
	device: z.enum(['desktop', 'tablet', 'mobile']).optional(),
});

export type GoogleShoppingInput = z.infer<typeof GoogleShoppingInputSchema>;

export const GoogleShoppingResponseSchema = z
	.object({
		search_metadata: SearchMetadataSchema.optional(),
		search_parameters: SearchParametersSchema.optional(),
		search_information: GenericObjectSchema.optional(),
		shopping_results: z.array(ShoppingResultSchema).optional(),
		categorized_shopping_results: z.array(GenericObjectSchema).optional(),
		filters: z.array(FilterSchema).optional(),
		carousel_filters: z.array(GenericObjectSchema).optional(),
		pagination: PaginationSchema.optional(),
	})
	.passthrough();

export type GoogleShoppingResponse = z.infer<
	typeof GoogleShoppingResponseSchema
>;

// ── Google Shopping Product ─────────────────────────────────────────────────

export const GoogleShoppingProductInputSchema = z.object({
	// The gpcid of a shopping result; required unless a prds token is supplied.
	gpcid: z.string().optional(),
	headline_offer_docid: z.string().optional(),
	image_docid: z.string().optional(),
	prds: z.string().optional(),
	// Required. The search term this product was found with.
	q: z.string().min(1),
	location: z.string().optional(),
	uule: z.string().optional(),
	hl: z.string().optional(),
	gl: z.string().optional(),
	google_domain: z.string().optional(),
	device: z.enum(['desktop', 'tablet', 'mobile']).optional(),
});

export type GoogleShoppingProductInput = z.infer<
	typeof GoogleShoppingProductInputSchema
>;

export const GoogleShoppingProductResponseSchema = z
	.object({
		search_metadata: SearchMetadataSchema.optional(),
		search_parameters: SearchParametersSchema.optional(),
		product_result: GenericObjectSchema.optional(),
		offers: z.array(GenericObjectSchema).optional(),
		related_products: z.array(GenericObjectSchema).optional(),
		product_reviews: z.array(ReviewSchema).optional(),
	})
	.passthrough();

export type GoogleShoppingProductResponse = z.infer<
	typeof GoogleShoppingProductResponseSchema
>;

// ── Google Maps ─────────────────────────────────────────────────────────────

export const GoogleMapsInputSchema = z
	.object({
		// Required for a search request (type=search or automatic).
		q: z.string().optional(),
		type: z.enum(['search', 'place']).optional(),
		place_id: z.string().optional(),
		data_cid: z.string().optional(),
		data: z.string().optional(),
		ll: z.string().optional(),
		location: z.string().optional(),
		lat: z.number().min(-90).max(90).optional(),
		lon: z.number().min(-180).max(180).optional(),
		z: z.number().int().optional(),
		m: z.number().nonnegative().optional(),
		nearby: z.boolean().optional(),
		min_price: z.number().optional(),
		max_price: z.number().optional(),
		min_rating: z.enum(['2.0', '2.5', '3.0', '3.5', '4.0', '4.5']).optional(),
		open_state: z.enum(['now', '24h']).optional(),
		open_on_day: z
			.enum(['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'])
			.optional(),
		open_at_hour: z.number().int().min(0).max(23).optional(),
		hl: z.string().optional(),
		gl: z.string().optional(),
		google_domain: z.string().optional(),
		start: z.number().int().nonnegative().optional(),
	})
	.refine(
		(value) =>
			Boolean(value.q || value.place_id || value.data_cid || value.data),
		{ message: 'Provide q, place_id, data_cid or data for this request' },
	);

export type GoogleMapsInput = z.infer<typeof GoogleMapsInputSchema>;

export const GoogleMapsResponseSchema = z
	.object({
		search_metadata: SearchMetadataSchema.optional(),
		search_parameters: SearchParametersSchema.optional(),
		search_information: GenericObjectSchema.optional(),
		local_results: z.array(LocalResultSchema).optional(),
		place_results: PlaceResultSchema.optional(),
		pagination: PaginationSchema.optional(),
	})
	.passthrough();

export type GoogleMapsResponse = z.infer<typeof GoogleMapsResponseSchema>;

// ── Google Maps Reviews ─────────────────────────────────────────────────────

export const GoogleMapsReviewsInputSchema = z.object({
	place_id: z.string().optional(),
	data_id: z.string().optional(),
	// Most relevant (default), newest, highest rating or lowest rating.
	sort_by: z
		.enum(['qualityScore', 'newestFirst', 'ratingHigh', 'ratingLow'])
		.optional(),
	topic_id: z.string().optional(),
	query: z.string().optional(),
	num: z.number().int().min(1).max(100).optional(),
	next_page_token: z.string().optional(),
	hl: z.string().optional(),
	gl: z.string().optional(),
	source_metadata: z.boolean().optional(),
});

export type GoogleMapsReviewsInput = z.infer<
	typeof GoogleMapsReviewsInputSchema
>;

export const GoogleMapsReviewsResponseSchema = z
	.object({
		search_metadata: SearchMetadataSchema.optional(),
		search_parameters: SearchParametersSchema.optional(),
		place_info: GenericObjectSchema.optional(),
		reviews: z.array(ReviewSchema).optional(),
		topics: z.array(GenericObjectSchema).optional(),
		pagination: PaginationSchema.optional(),
	})
	.passthrough();

export type GoogleMapsReviewsResponse = z.infer<
	typeof GoogleMapsReviewsResponseSchema
>;

// ── Google Contributor Reviews ──────────────────────────────────────────────

export const GoogleContributorReviewsInputSchema = z.object({
	contributor_id: z.string().min(1),
	limit: z.number().int().min(1).max(200).optional(),
	hl: z.string().optional(),
	gl: z.string().optional(),
});

export type GoogleContributorReviewsInput = z.infer<
	typeof GoogleContributorReviewsInputSchema
>;

export const GoogleContributorReviewsResponseSchema = z
	.object({
		search_metadata: SearchMetadataSchema.optional(),
		search_parameters: SearchParametersSchema.optional(),
		search_information: GenericObjectSchema.optional(),
		contributor: GenericObjectSchema.optional(),
		reviews: z.array(ReviewSchema).optional(),
	})
	.passthrough();

export type GoogleContributorReviewsResponse = z.infer<
	typeof GoogleContributorReviewsResponseSchema
>;

// ── Google Maps Popular Times ───────────────────────────────────────────────

export const GoogleMapsPopularTimesInputSchema = z.object({
	place_id: z.string().min(1),
	hl: z.string().optional(),
	gl: z.string().optional(),
	google_domain: z.string().optional(),
});

export type GoogleMapsPopularTimesInput = z.infer<
	typeof GoogleMapsPopularTimesInputSchema
>;

// The LiteScrape docs publish no response group list for this endpoint, so
// only the shared envelope is pinned and the payload passes through.
export const GoogleMapsPopularTimesResponseSchema = z
	.object({
		search_metadata: SearchMetadataSchema.optional(),
		search_parameters: SearchParametersSchema.optional(),
		popular_times: GenericObjectSchema.optional(),
	})
	.passthrough();

export type GoogleMapsPopularTimesResponse = z.infer<
	typeof GoogleMapsPopularTimesResponseSchema
>;

// ── Google Maps Posts ───────────────────────────────────────────────────────

export const GoogleMapsPostsInputSchema = z.object({
	data_id: z.string().min(1),
	next_page_token: z.string().optional(),
	hl: z.string().optional(),
	gl: z.string().optional(),
	google_domain: z.string().optional(),
});

export type GoogleMapsPostsInput = z.infer<typeof GoogleMapsPostsInputSchema>;

// The LiteScrape docs publish no response group list for this endpoint, so
// `posts` is modelled as an open list and the payload passes through.
export const GoogleMapsPostsResponseSchema = z
	.object({
		search_metadata: SearchMetadataSchema.optional(),
		search_parameters: SearchParametersSchema.optional(),
		posts: z.array(GenericObjectSchema).optional(),
		pagination: PaginationSchema.optional(),
	})
	.passthrough();

export type GoogleMapsPostsResponse = z.infer<
	typeof GoogleMapsPostsResponseSchema
>;

// ── Google Maps Photo Metadata ──────────────────────────────────────────────

export const GoogleMapsPhotoMetaInputSchema = z.object({
	data_id: z.string().min(1),
	hl: z.string().optional(),
	gl: z.string().optional(),
	google_domain: z.string().optional(),
});

export type GoogleMapsPhotoMetaInput = z.infer<
	typeof GoogleMapsPhotoMetaInputSchema
>;

// The LiteScrape docs publish no response group list for this endpoint, so
// the resolved place, contributor and photo keep open shapes.
export const GoogleMapsPhotoMetaResponseSchema = z
	.object({
		search_metadata: SearchMetadataSchema.optional(),
		search_parameters: SearchParametersSchema.optional(),
		place_info: GenericObjectSchema.optional(),
		contributor: GenericObjectSchema.optional(),
		photo: GenericObjectSchema.optional(),
	})
	.passthrough();

export type GoogleMapsPhotoMetaResponse = z.infer<
	typeof GoogleMapsPhotoMetaResponseSchema
>;

// ── Bing Search ─────────────────────────────────────────────────────────────

export const BingSearchInputSchema = z.object({
	// Required Bing query, up to 2,048 characters. Search operators supported.
	q: z.string().min(1).max(2048),
	filters: z.string().optional(),
	location: z.string().optional(),
	lat: z.number().min(-90).max(90).optional(),
	lon: z.number().min(-180).max(180).optional(),
	mkt: z.string().optional(),
	cc: z.string().optional(),
	first: z.number().int().nonnegative().optional(),
	safeSearch: z.enum(['off', 'moderate', 'strict']).optional(),
	device: z.enum(['desktop', 'tablet', 'mobile']).optional(),
});

export type BingSearchInput = z.infer<typeof BingSearchInputSchema>;

export const BingSearchResponseSchema = z
	.object({
		search_metadata: SearchMetadataSchema.optional(),
		search_parameters: SearchParametersSchema.optional(),
		organic_results: z.array(WebResultSchema).optional(),
		knowledge_graph: KnowledgeGraphSchema.optional(),
		knowledge_graph_list: z.array(GenericObjectSchema).optional(),
		pagination: PaginationSchema.optional(),
		litescrape_pagination: LitescrapePaginationSchema.optional(),
	})
	.passthrough();

export type BingSearchResponse = z.infer<typeof BingSearchResponseSchema>;

// ── Bing Maps ───────────────────────────────────────────────────────────────

export const BingMapsInputSchema = z
	.object({
		// Optional when place_id is present.
		q: z.string().optional(),
		place_id: z.string().optional(),
		cp: z.string().optional(),
		setlang: z.string().optional(),
		first: z.number().int().min(0).max(10000).optional(),
		count: z.number().int().min(1).max(30).optional(),
	})
	.refine((value) => Boolean(value.q || value.place_id), {
		message: 'Provide q or place_id for this request',
	});

export type BingMapsInput = z.infer<typeof BingMapsInputSchema>;

export const BingMapsResponseSchema = z
	.object({
		search_metadata: SearchMetadataSchema.optional(),
		search_parameters: SearchParametersSchema.optional(),
		local_results: z.array(LocalResultSchema).optional(),
		place_results: PlaceResultSchema.optional(),
	})
	.passthrough();

export type BingMapsResponse = z.infer<typeof BingMapsResponseSchema>;

// ── DuckDuckGo Search ───────────────────────────────────────────────────────

export const DuckduckgoSearchInputSchema = z.object({
	// Required search text, up to 500 characters.
	q: z.string().min(1).max(500),
	kl: z.string().optional(),
	// -1 moderate (default), 1 strict, -2 off.
	safe: z.enum(['-1', '1', '-2']).optional(),
	df: z.string().optional(),
	start: z.number().int().nonnegative().optional(),
	m: z.number().int().min(1).max(50).optional(),
	search_assist: z.boolean().optional(),
});

export type DuckduckgoSearchInput = z.infer<typeof DuckduckgoSearchInputSchema>;

export const DuckduckgoSearchResponseSchema = z
	.object({
		search_metadata: SearchMetadataSchema.optional(),
		search_parameters: SearchParametersSchema.optional(),
		organic_results: z.array(WebResultSchema).optional(),
		pagination: PaginationSchema.optional(),
		litescrape_pagination: LitescrapePaginationSchema.optional(),
	})
	.passthrough();

export type DuckduckgoSearchResponse = z.infer<
	typeof DuckduckgoSearchResponseSchema
>;

// ── DuckDuckGo Maps ─────────────────────────────────────────────────────────

export const DuckduckgoMapsInputSchema = z.object({
	// Required place or category query.
	q: z.string().min(1),
	bbox: z.string().optional(),
	lat: z.number().min(-90).max(90).optional(),
	lon: z.number().min(-180).max(180).optional(),
	strict_bbox: z.boolean().optional(),
});

export type DuckduckgoMapsInput = z.infer<typeof DuckduckgoMapsInputSchema>;

export const DuckduckgoMapsResponseSchema = z
	.object({
		search_metadata: SearchMetadataSchema.optional(),
		search_parameters: SearchParametersSchema.optional(),
		local_results: z.array(LocalResultSchema).optional(),
	})
	.passthrough();

export type DuckduckgoMapsResponse = z.infer<
	typeof DuckduckgoMapsResponseSchema
>;

// ── Yelp Search ─────────────────────────────────────────────────────────────

export const YelpSearchInputSchema = z.object({
	find_desc: z.string().optional(),
	// Required Yelp search location.
	find_loc: z.string().min(1),
	yelp_domain: z.string().optional(),
	l: z.string().optional(),
	cflt: z.string().optional(),
	sortby: z.enum(['recommended', 'rating', 'review_count']).optional(),
	attrs: z.string().optional(),
	start: z.number().int().nonnegative().optional(),
});

export type YelpSearchInput = z.infer<typeof YelpSearchInputSchema>;

export const YelpSearchResponseSchema = z
	.object({
		search_metadata: SearchMetadataSchema.optional(),
		search_parameters: SearchParametersSchema.optional(),
		search_information: GenericObjectSchema.optional(),
		organic_results: z.array(LocalResultSchema).optional(),
		ads_results: z.array(LocalResultSchema).optional(),
		filters: z.array(FilterSchema).optional(),
		related_links: z.array(ReferenceSchema).optional(),
		pagination: PaginationSchema.optional(),
	})
	.passthrough();

export type YelpSearchResponse = z.infer<typeof YelpSearchResponseSchema>;

// ── Yelp Reviews ────────────────────────────────────────────────────────────

export const YelpReviewsInputSchema = z.object({
	// Required encoded Yelp business ID.
	place_id: z.string().min(1),
	yelp_domain: z.string().optional(),
	hl: z.string().optional(),
	sortby: z
		.enum([
			'relevance_desc',
			'date_desc',
			'date_asc',
			'rating_desc',
			'rating_asc',
			'elites_desc',
		])
		.optional(),
	rating: z.string().optional(),
	start: z.number().int().nonnegative().optional(),
	num: z.number().int().min(1).max(49).optional(),
});

export type YelpReviewsInput = z.infer<typeof YelpReviewsInputSchema>;

export const YelpReviewsResponseSchema = z
	.object({
		search_metadata: SearchMetadataSchema.optional(),
		search_parameters: SearchParametersSchema.optional(),
		search_information: GenericObjectSchema.optional(),
		reviews: z.array(ReviewSchema).optional(),
		review_languages: z.array(GenericObjectSchema).optional(),
		pagination: PaginationSchema.optional(),
	})
	.passthrough();

export type YelpReviewsResponse = z.infer<typeof YelpReviewsResponseSchema>;

// ── Tripadvisor Search ──────────────────────────────────────────────────────

export const TripadvisorSearchInputSchema = z.object({
	// Required search text.
	q: z.string().min(1),
	tripadvisor_domain: z.string().optional(),
	locale: z.string().optional(),
	geo_id: z.string().optional(),
	lat: z.number().min(-90).max(90).optional(),
	lon: z.number().min(-180).max(180).optional(),
	place_type: z
		.enum([
			'all',
			'accommodation',
			'attraction',
			'attraction_product',
			'eatery',
			'geo',
		])
		.optional(),
	start: z.number().int().nonnegative().optional(),
	num: z.number().int().min(1).max(30).optional(),
});

export type TripadvisorSearchInput = z.infer<
	typeof TripadvisorSearchInputSchema
>;

export const TripadvisorSearchResponseSchema = z
	.object({
		search_metadata: SearchMetadataSchema.optional(),
		search_parameters: SearchParametersSchema.optional(),
		search_information: GenericObjectSchema.optional(),
		search_results: z.array(GenericObjectSchema).optional(),
		map_previews: z.array(GenericObjectSchema).optional(),
		pagination: PaginationSchema.optional(),
	})
	.passthrough();

export type TripadvisorSearchResponse = z.infer<
	typeof TripadvisorSearchResponseSchema
>;

// ── Tripadvisor Place ───────────────────────────────────────────────────────

export const TripadvisorPlaceInputSchema = z.object({
	// Required positive Tripadvisor place identifier.
	place_id: z.number().int().positive(),
	tripadvisor_domain: z.string().optional(),
	locale: z.string().optional(),
	currency: z.string().optional(),
	geo_id: z.string().optional(),
});

export type TripadvisorPlaceInput = z.infer<typeof TripadvisorPlaceInputSchema>;

export const TripadvisorPlaceResponseSchema = z
	.object({
		search_metadata: SearchMetadataSchema.optional(),
		search_parameters: SearchParametersSchema.optional(),
		search_information: GenericObjectSchema.optional(),
		place_results: GenericObjectSchema.optional(),
	})
	.passthrough();

export type TripadvisorPlaceResponse = z.infer<
	typeof TripadvisorPlaceResponseSchema
>;

// ── Tripadvisor Reviews ─────────────────────────────────────────────────────

export const TripadvisorReviewsInputSchema = z.object({
	// Required positive Tripadvisor place identifier.
	place_id: z.number().int().positive(),
	tripadvisor_domain: z.string().optional(),
	locale: z.string().optional(),
	start: z.number().int().nonnegative().optional(),
	num: z.number().int().min(1).max(50).optional(),
	sort_by: z.enum(['recent', 'relevance']).optional(),
	translate: z.boolean().optional(),
});

export type TripadvisorReviewsInput = z.infer<
	typeof TripadvisorReviewsInputSchema
>;

export const TripadvisorReviewsResponseSchema = z
	.object({
		search_metadata: SearchMetadataSchema.optional(),
		search_parameters: SearchParametersSchema.optional(),
		search_information: GenericObjectSchema.optional(),
		sort: GenericObjectSchema.optional(),
		reviews: z.array(ReviewSchema).optional(),
		pagination: PaginationSchema.optional(),
	})
	.passthrough();

export type TripadvisorReviewsResponse = z.infer<
	typeof TripadvisorReviewsResponseSchema
>;

// ── Apple Maps Places ───────────────────────────────────────────────────────

export const AppleMapsPlacesInputSchema = z.object({
	// One to 50 unsigned decimal MUIDs, comma-separated.
	muid: z.string().min(1),
	locale: z.string().optional(),
});

export type AppleMapsPlacesInput = z.infer<typeof AppleMapsPlacesInputSchema>;

export const AppleMapsPlacesResponseSchema = z
	.object({
		search_metadata: SearchMetadataSchema.optional(),
		search_parameters: SearchParametersSchema.optional(),
		place_results: z.array(PlaceResultSchema).optional(),
	})
	.passthrough();

export type AppleMapsPlacesResponse = z.infer<
	typeof AppleMapsPlacesResponseSchema
>;

// ── Apple Maps Reviews ──────────────────────────────────────────────────────

export const AppleMapsReviewsInputSchema = z.object({
	// Exactly one unsigned decimal Apple Maps MUID.
	muid: z.string().min(1),
	locale: z.string().optional(),
});

export type AppleMapsReviewsInput = z.infer<typeof AppleMapsReviewsInputSchema>;

export const AppleMapsReviewsResponseSchema = z
	.object({
		search_metadata: SearchMetadataSchema.optional(),
		search_parameters: SearchParametersSchema.optional(),
		search_information: GenericObjectSchema.optional(),
		place_info: GenericObjectSchema.optional(),
		rating_summary: GenericObjectSchema.optional(),
		ratings: z.array(GenericObjectSchema).optional(),
		reviews: z.array(ReviewSchema).optional(),
	})
	.passthrough();

export type AppleMapsReviewsResponse = z.infer<
	typeof AppleMapsReviewsResponseSchema
>;

// ── Google Play Apps (Alpha) ────────────────────────────────────────────────

const googlePlayPagination = {
	next_page_token: z.string().optional(),
	section_page_token: z.string().optional(),
	see_more_token: z.string().optional(),
};

export const GooglePlayAppsInputSchema = z.object({
	q: z.string().min(1).max(2048).optional(),
	apps_category: z.string().optional(),
	store_device: z
		.enum(['phone', 'tablet', 'tv', 'chromebook', 'watch', 'car'])
		.optional(),
	age: z.enum(['AGE_RANGE1', 'AGE_RANGE2', 'AGE_RANGE3']).optional(),
	chart: z.string().optional(),
	hl: z.string().optional(),
	gl: z.string().optional(),
	...googlePlayPagination,
});

export type GooglePlayAppsInput = z.infer<typeof GooglePlayAppsInputSchema>;

export const GooglePlayAppsResponseSchema = z
	.object({
		search_metadata: SearchMetadataSchema.optional(),
		search_parameters: SearchParametersSchema.optional(),
		organic_results: z.array(LocalResultSchema).optional(),
		app_highlight: GenericObjectSchema.optional(),
		items_highlight: GenericObjectSchema.optional(),
		charts: z.array(GenericObjectSchema).optional(),
		litescrape_pagination: LitescrapePaginationSchema.optional(),
	})
	.passthrough();

export type GooglePlayAppsResponse = z.infer<
	typeof GooglePlayAppsResponseSchema
>;

// ── Google Play Games (Alpha) ───────────────────────────────────────────────

export const GooglePlayGamesInputSchema = z.object({
	q: z.string().min(1).max(2048).optional(),
	games_category: z.string().optional(),
	store_device: z
		.enum(['phone', 'tablet', 'tv', 'chromebook', 'watch', 'windows'])
		.optional(),
	chart: z.string().optional(),
	hl: z.string().optional(),
	gl: z.string().optional(),
	...googlePlayPagination,
});

export type GooglePlayGamesInput = z.infer<typeof GooglePlayGamesInputSchema>;

export const GooglePlayGamesResponseSchema = z
	.object({
		search_metadata: SearchMetadataSchema.optional(),
		search_parameters: SearchParametersSchema.optional(),
		organic_results: z.array(LocalResultSchema).optional(),
		items_highlight: GenericObjectSchema.optional(),
		charts: z.array(GenericObjectSchema).optional(),
		litescrape_pagination: LitescrapePaginationSchema.optional(),
	})
	.passthrough();

export type GooglePlayGamesResponse = z.infer<
	typeof GooglePlayGamesResponseSchema
>;

// ── Google Play Books (Alpha) ───────────────────────────────────────────────

export const GooglePlayBooksInputSchema = z.object({
	q: z.string().min(1).max(2048).optional(),
	books_category: z.string().optional(),
	age: z.enum(['AGE_RANGE1', 'AGE_RANGE2', 'AGE_RANGE3']).optional(),
	// 1 free books, 2 paid books. Requires q.
	price: z.enum(['1', '2']).optional(),
	chart: z.string().optional(),
	hl: z.string().optional(),
	gl: z.string().optional(),
	...googlePlayPagination,
});

export type GooglePlayBooksInput = z.infer<typeof GooglePlayBooksInputSchema>;

export const GooglePlayBooksResponseSchema = z
	.object({
		search_metadata: SearchMetadataSchema.optional(),
		search_parameters: SearchParametersSchema.optional(),
		organic_results: z.array(ShoppingResultSchema).optional(),
		charts: z.array(GenericObjectSchema).optional(),
		litescrape_pagination: LitescrapePaginationSchema.optional(),
	})
	.passthrough();

export type GooglePlayBooksResponse = z.infer<
	typeof GooglePlayBooksResponseSchema
>;

// ── Google Play Movies (Alpha) ──────────────────────────────────────────────

export const GooglePlayMoviesInputSchema = z.object({
	q: z.string().min(1).max(2048).optional(),
	movies_category: z.string().optional(),
	age: z.enum(['AGE_RANGE1', 'AGE_RANGE2', 'AGE_RANGE3']).optional(),
	chart: z.string().optional(),
	hl: z.string().optional(),
	gl: z.string().optional(),
	...googlePlayPagination,
});

export type GooglePlayMoviesInput = z.infer<typeof GooglePlayMoviesInputSchema>;

export const GooglePlayMoviesResponseSchema = z
	.object({
		search_metadata: SearchMetadataSchema.optional(),
		search_parameters: SearchParametersSchema.optional(),
		organic_results: z.array(ShoppingResultSchema).optional(),
		charts: z.array(GenericObjectSchema).optional(),
		litescrape_pagination: LitescrapePaginationSchema.optional(),
	})
	.passthrough();

export type GooglePlayMoviesResponse = z.infer<
	typeof GooglePlayMoviesResponseSchema
>;

// ── Google Play Product (Alpha) ─────────────────────────────────────────────

export const GooglePlayProductInputSchema = z.object({
	product_id: z.string().min(1),
	store: z.enum(['apps', 'books', 'audiobooks', 'movies', 'tv']).optional(),
	season_id: z.string().optional(),
	hl: z.string().optional(),
	gl: z.string().optional(),
});

export type GooglePlayProductInput = z.infer<
	typeof GooglePlayProductInputSchema
>;

export const GooglePlayProductResponseSchema = z
	.object({
		search_metadata: SearchMetadataSchema.optional(),
		search_parameters: SearchParametersSchema.optional(),
		product_info: GenericObjectSchema.optional(),
		about_this_app: GenericObjectSchema.optional(),
		ratings: GenericObjectSchema.optional(),
		reviews: z.array(ReviewSchema).optional(),
		media: GenericObjectSchema.optional(),
		permissions: z.array(GenericObjectSchema).optional(),
		data_safety: GenericObjectSchema.optional(),
		developer_contact: GenericObjectSchema.optional(),
		similar_results: z.array(LocalResultSchema).optional(),
	})
	.passthrough();

export type GooglePlayProductResponse = z.infer<
	typeof GooglePlayProductResponseSchema
>;

// ── Google Play Reviews (Alpha) ─────────────────────────────────────────────

export const GooglePlayReviewsInputSchema = z.object({
	product_id: z.string().min(1),
	store: z.enum(['apps', 'books', 'audiobooks', 'movies', 'tv']).optional(),
	num: z.number().int().min(1).max(199).optional(),
	platform: z.enum(['phone', 'tablet', 'watch', 'chromebook', 'tv']).optional(),
	rating: z.number().int().min(1).max(5).optional(),
	// Documented codes: 1 (default), 2, 3.
	sort_by: z.enum(['1', '2', '3']).optional(),
	hl: z.string().optional(),
	gl: z.string().optional(),
	next_page_token: z.string().optional(),
});

export type GooglePlayReviewsInput = z.infer<
	typeof GooglePlayReviewsInputSchema
>;

export const GooglePlayReviewsResponseSchema = z
	.object({
		search_metadata: SearchMetadataSchema.optional(),
		search_parameters: SearchParametersSchema.optional(),
		reviews: z.array(ReviewSchema).optional(),
		litescrape_pagination: LitescrapePaginationSchema.optional(),
	})
	.passthrough();

export type GooglePlayReviewsResponse = z.infer<
	typeof GooglePlayReviewsResponseSchema
>;

// ── Apple App Store Search (Alpha) ──────────────────────────────────────────

export const AppleAppStoreSearchInputSchema = z.object({
	// Required search term, 1 to 2,048 UTF-8 bytes of printable text.
	term: z.string().min(1).max(2048),
	num: z.number().int().min(1).max(200).optional(),
	disallow_explicit: z.boolean().optional(),
	property: z.enum(['developer']).optional(),
	category_id: z.string().optional(),
	device: z.enum(['mobile', 'tablet', 'desktop']).optional(),
	country: z.string().optional(),
	lang: z.string().optional(),
});

export type AppleAppStoreSearchInput = z.infer<
	typeof AppleAppStoreSearchInputSchema
>;

export const AppleAppStoreSearchResponseSchema = z
	.object({
		search_metadata: SearchMetadataSchema.optional(),
		search_parameters: SearchParametersSchema.optional(),
		search_information: GenericObjectSchema.optional(),
		organic_results: z.array(GenericObjectSchema).optional(),
	})
	.passthrough();

export type AppleAppStoreSearchResponse = z.infer<
	typeof AppleAppStoreSearchResponseSchema
>;

// ── Apple App Store Product (Alpha) ─────────────────────────────────────────

export const AppleAppStoreProductInputSchema = z.object({
	product_id: z.string().min(1),
	type: z.enum(['app']).optional(),
	country: z.string().optional(),
});

export type AppleAppStoreProductInput = z.infer<
	typeof AppleAppStoreProductInputSchema
>;

export const AppleAppStoreProductResponseSchema = z
	.object({
		search_metadata: SearchMetadataSchema.optional(),
		search_parameters: SearchParametersSchema.optional(),
		version_history: z.array(GenericObjectSchema).optional(),
		ratings_and_reviews: GenericObjectSchema.optional(),
		privacy: GenericObjectSchema.optional(),
		information: GenericObjectSchema.optional(),
		iphone_screenshots: z.array(GenericObjectSchema).optional(),
		ipad_screenshots: z.array(GenericObjectSchema).optional(),
		featured_in: z.array(GenericObjectSchema).optional(),
		more_by_this_developer: z.array(GenericObjectSchema).optional(),
		you_may_also_like: z.array(GenericObjectSchema).optional(),
	})
	.passthrough();

export type AppleAppStoreProductResponse = z.infer<
	typeof AppleAppStoreProductResponseSchema
>;

// ── Apple App Store Reviews (Alpha) ─────────────────────────────────────────

export const AppleAppStoreReviewsInputSchema = z.object({
	product_id: z.string().min(1),
	sort: z.enum(['mostrecent', 'mosthelpful']).optional(),
	country: z.string().optional(),
	page: z.number().int().min(1).max(2147483647).optional(),
});

export type AppleAppStoreReviewsInput = z.infer<
	typeof AppleAppStoreReviewsInputSchema
>;

export const AppleAppStoreReviewsResponseSchema = z
	.object({
		search_metadata: SearchMetadataSchema.optional(),
		search_parameters: SearchParametersSchema.optional(),
		search_information: GenericObjectSchema.optional(),
		reviews: z.array(ReviewSchema).optional(),
		litescrape_pagination: LitescrapePaginationSchema.optional(),
	})
	.passthrough();

export type AppleAppStoreReviewsResponse = z.infer<
	typeof AppleAppStoreReviewsResponseSchema
>;

// ── Web Fetch (Alpha) ───────────────────────────────────────────────────────

export const WebFetchInputSchema = z.object({
	// Include http:// or https://; bare domains are rejected by the API.
	url: z.string().min(1).max(8192),
	respond_with: z.enum(['markdown', 'html', 'text']).optional(),
	target_selector: z.string().max(2048).optional(),
	remove_selector: z.string().max(2048).optional(),
	retain_links: z.enum(['none', 'all', 'text', 'gpt-oss']).optional(),
	retain_images: z.enum(['none', 'all', 'alt']).optional(),
	with_iframe: z
		.union([z.literal(true), z.literal(false), z.literal('quoted')])
		.optional(),
	with_shadow_dom: z.boolean().optional(),
	respond_timing: z
		.enum([
			'html',
			'visible-content',
			'mutation-idle',
			'resource-idle',
			'media-idle',
			'network-idle',
		])
		.optional(),
	wait_for_selector: z.string().max(2048).optional(),
	page_timeout: z.number().int().min(1).max(180).optional(),
	// Query-only total request budget, greater than 0 and at most 90 seconds.
	timeout: z.number().int().min(1).max(90).optional(),
	locale: z.string().min(2).max(64).optional(),
	user_agent: z.string().max(1024).optional(),
});

export type WebFetchInput = z.infer<typeof WebFetchInputSchema>;

export const WebFetchResponseSchema = z
	.object({
		url: z.string(),
		title: z.string().optional(),
		description: z.string().optional(),
		content: z.string().optional(),
		html: z.string().optional(),
		text: z.string().optional(),
	})
	.passthrough();

export type WebFetchResponse = z.infer<typeof WebFetchResponseSchema>;

// ── Web Screenshot (Alpha) ──────────────────────────────────────────────────

export const WebScreenshotInputSchema = z.object({
	url: z.string().min(1).max(8192),
	full_page: z.boolean().optional(),
	respond_timing: z
		.enum([
			'html',
			'visible-content',
			'mutation-idle',
			'resource-idle',
			'media-idle',
			'network-idle',
		])
		.optional(),
	wait_for_selector: z.string().max(2048).optional(),
	page_timeout: z.number().int().min(1).max(180).optional(),
	// Query-only total request budget, greater than 0 and at most 90 seconds.
	timeout: z.number().int().min(1).max(90).optional(),
	locale: z.string().min(2).max(64).optional(),
	user_agent: z.string().max(1024).optional(),
	referer: z.string().optional(),
	remove_overlay: z.boolean().optional(),
	detach_invisibles: z.boolean().optional(),
	assert_status_code: z.number().int().min(100).max(599).optional(),
	robots_txt: z.string().max(256).optional(),
});

export type WebScreenshotInput = z.infer<typeof WebScreenshotInputSchema>;

export const WebScreenshotResponseSchema = z
	.object({
		url: z.string().optional(),
		title: z.string().optional(),
		description: z.string().optional(),
		screenshot_url: z.string(),
		full_page: z.boolean().optional(),
	})
	.passthrough();

export type WebScreenshotResponse = z.infer<typeof WebScreenshotResponseSchema>;

// ── Key status ──────────────────────────────────────────────────────────────

export const KeysStatusInputSchema = z.object({}).passthrough();

export type KeysStatusInput = z.infer<typeof KeysStatusInputSchema>;

// The full response also carries pricing and credit-expiry fields the docs do
// not enumerate, so those pass through.
export const KeysStatusResponseSchema = z
	.object({
		remaining_calls: z.number(),
		concurrency_limit: z.number(),
		status: z.string(),
		zdr_enabled: z.boolean().optional(),
		zdr_available: z.boolean().optional(),
	})
	.passthrough();

export type KeysStatusResponse = z.infer<typeof KeysStatusResponseSchema>;

// ── Plugin endpoint collections (keyed by camelCase operation name) ─────────

export type LitescrapeEndpointInputs = {
	googleSearch: GoogleSearchInput;
	googleAiOverview: GoogleAiOverviewInput;
	googleAiMode: GoogleAiModeInput;
	googleAds: GoogleAdsInput;
	googleLocal: GoogleLocalInput;
	googleShopping: GoogleShoppingInput;
	googleShoppingProduct: GoogleShoppingProductInput;
	googleMapsSearch: GoogleMapsInput;
	googleMapsReviews: GoogleMapsReviewsInput;
	googleMapsContributorReviews: GoogleContributorReviewsInput;
	googleMapsPopularTimes: GoogleMapsPopularTimesInput;
	googleMapsPosts: GoogleMapsPostsInput;
	googleMapsPhotoMeta: GoogleMapsPhotoMetaInput;
	bingSearch: BingSearchInput;
	bingMaps: BingMapsInput;
	duckduckgoSearch: DuckduckgoSearchInput;
	duckduckgoMaps: DuckduckgoMapsInput;
	yelpSearch: YelpSearchInput;
	yelpReviews: YelpReviewsInput;
	tripadvisorSearch: TripadvisorSearchInput;
	tripadvisorPlace: TripadvisorPlaceInput;
	tripadvisorReviews: TripadvisorReviewsInput;
	appleMapsPlaces: AppleMapsPlacesInput;
	appleMapsReviews: AppleMapsReviewsInput;
	googlePlayApps: GooglePlayAppsInput;
	googlePlayGames: GooglePlayGamesInput;
	googlePlayBooks: GooglePlayBooksInput;
	googlePlayMovies: GooglePlayMoviesInput;
	googlePlayProduct: GooglePlayProductInput;
	googlePlayReviews: GooglePlayReviewsInput;
	appleAppStoreSearch: AppleAppStoreSearchInput;
	appleAppStoreProduct: AppleAppStoreProductInput;
	appleAppStoreReviews: AppleAppStoreReviewsInput;
	webFetch: WebFetchInput;
	webScreenshot: WebScreenshotInput;
	keysStatus: KeysStatusInput;
};

export type LitescrapeEndpointOutputs = {
	googleSearch: GoogleSearchResponse;
	googleAiOverview: GoogleAiOverviewResponse;
	googleAiMode: GoogleAiModeResponse;
	googleAds: GoogleAdsResponse;
	googleLocal: GoogleLocalResponse;
	googleShopping: GoogleShoppingResponse;
	googleShoppingProduct: GoogleShoppingProductResponse;
	googleMapsSearch: GoogleMapsResponse;
	googleMapsReviews: GoogleMapsReviewsResponse;
	googleMapsContributorReviews: GoogleContributorReviewsResponse;
	googleMapsPopularTimes: GoogleMapsPopularTimesResponse;
	googleMapsPosts: GoogleMapsPostsResponse;
	googleMapsPhotoMeta: GoogleMapsPhotoMetaResponse;
	bingSearch: BingSearchResponse;
	bingMaps: BingMapsResponse;
	duckduckgoSearch: DuckduckgoSearchResponse;
	duckduckgoMaps: DuckduckgoMapsResponse;
	yelpSearch: YelpSearchResponse;
	yelpReviews: YelpReviewsResponse;
	tripadvisorSearch: TripadvisorSearchResponse;
	tripadvisorPlace: TripadvisorPlaceResponse;
	tripadvisorReviews: TripadvisorReviewsResponse;
	appleMapsPlaces: AppleMapsPlacesResponse;
	appleMapsReviews: AppleMapsReviewsResponse;
	googlePlayApps: GooglePlayAppsResponse;
	googlePlayGames: GooglePlayGamesResponse;
	googlePlayBooks: GooglePlayBooksResponse;
	googlePlayMovies: GooglePlayMoviesResponse;
	googlePlayProduct: GooglePlayProductResponse;
	googlePlayReviews: GooglePlayReviewsResponse;
	appleAppStoreSearch: AppleAppStoreSearchResponse;
	appleAppStoreProduct: AppleAppStoreProductResponse;
	appleAppStoreReviews: AppleAppStoreReviewsResponse;
	webFetch: WebFetchResponse;
	webScreenshot: WebScreenshotResponse;
	keysStatus: KeysStatusResponse;
};

export const LitescrapeEndpointInputSchemas = {
	googleSearch: GoogleSearchInputSchema,
	googleAiOverview: GoogleAiOverviewInputSchema,
	googleAiMode: GoogleAiModeInputSchema,
	googleAds: GoogleAdsInputSchema,
	googleLocal: GoogleLocalInputSchema,
	googleShopping: GoogleShoppingInputSchema,
	googleShoppingProduct: GoogleShoppingProductInputSchema,
	googleMapsSearch: GoogleMapsInputSchema,
	googleMapsReviews: GoogleMapsReviewsInputSchema,
	googleMapsContributorReviews: GoogleContributorReviewsInputSchema,
	googleMapsPopularTimes: GoogleMapsPopularTimesInputSchema,
	googleMapsPosts: GoogleMapsPostsInputSchema,
	googleMapsPhotoMeta: GoogleMapsPhotoMetaInputSchema,
	bingSearch: BingSearchInputSchema,
	bingMaps: BingMapsInputSchema,
	duckduckgoSearch: DuckduckgoSearchInputSchema,
	duckduckgoMaps: DuckduckgoMapsInputSchema,
	yelpSearch: YelpSearchInputSchema,
	yelpReviews: YelpReviewsInputSchema,
	tripadvisorSearch: TripadvisorSearchInputSchema,
	tripadvisorPlace: TripadvisorPlaceInputSchema,
	tripadvisorReviews: TripadvisorReviewsInputSchema,
	appleMapsPlaces: AppleMapsPlacesInputSchema,
	appleMapsReviews: AppleMapsReviewsInputSchema,
	googlePlayApps: GooglePlayAppsInputSchema,
	googlePlayGames: GooglePlayGamesInputSchema,
	googlePlayBooks: GooglePlayBooksInputSchema,
	googlePlayMovies: GooglePlayMoviesInputSchema,
	googlePlayProduct: GooglePlayProductInputSchema,
	googlePlayReviews: GooglePlayReviewsInputSchema,
	appleAppStoreSearch: AppleAppStoreSearchInputSchema,
	appleAppStoreProduct: AppleAppStoreProductInputSchema,
	appleAppStoreReviews: AppleAppStoreReviewsInputSchema,
	webFetch: WebFetchInputSchema,
	webScreenshot: WebScreenshotInputSchema,
	keysStatus: KeysStatusInputSchema,
} as const;

export const LitescrapeEndpointOutputSchemas = {
	googleSearch: GoogleSearchResponseSchema,
	googleAiOverview: GoogleAiOverviewResponseSchema,
	googleAiMode: GoogleAiModeResponseSchema,
	googleAds: GoogleAdsResponseSchema,
	googleLocal: GoogleLocalResponseSchema,
	googleShopping: GoogleShoppingResponseSchema,
	googleShoppingProduct: GoogleShoppingProductResponseSchema,
	googleMapsSearch: GoogleMapsResponseSchema,
	googleMapsReviews: GoogleMapsReviewsResponseSchema,
	googleMapsContributorReviews: GoogleContributorReviewsResponseSchema,
	googleMapsPopularTimes: GoogleMapsPopularTimesResponseSchema,
	googleMapsPosts: GoogleMapsPostsResponseSchema,
	googleMapsPhotoMeta: GoogleMapsPhotoMetaResponseSchema,
	bingSearch: BingSearchResponseSchema,
	bingMaps: BingMapsResponseSchema,
	duckduckgoSearch: DuckduckgoSearchResponseSchema,
	duckduckgoMaps: DuckduckgoMapsResponseSchema,
	yelpSearch: YelpSearchResponseSchema,
	yelpReviews: YelpReviewsResponseSchema,
	tripadvisorSearch: TripadvisorSearchResponseSchema,
	tripadvisorPlace: TripadvisorPlaceResponseSchema,
	tripadvisorReviews: TripadvisorReviewsResponseSchema,
	appleMapsPlaces: AppleMapsPlacesResponseSchema,
	appleMapsReviews: AppleMapsReviewsResponseSchema,
	googlePlayApps: GooglePlayAppsResponseSchema,
	googlePlayGames: GooglePlayGamesResponseSchema,
	googlePlayBooks: GooglePlayBooksResponseSchema,
	googlePlayMovies: GooglePlayMoviesResponseSchema,
	googlePlayProduct: GooglePlayProductResponseSchema,
	googlePlayReviews: GooglePlayReviewsResponseSchema,
	appleAppStoreSearch: AppleAppStoreSearchResponseSchema,
	appleAppStoreProduct: AppleAppStoreProductResponseSchema,
	appleAppStoreReviews: AppleAppStoreReviewsResponseSchema,
	webFetch: WebFetchResponseSchema,
	webScreenshot: WebScreenshotResponseSchema,
	keysStatus: KeysStatusResponseSchema,
} as const;
