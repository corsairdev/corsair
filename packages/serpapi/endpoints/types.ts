import { z } from 'zod';

/* -------------------------------------------------------------------------- */
/* shared response envelope                                                   */
/* -------------------------------------------------------------------------- */
/*
 * Confirmed live 2026-08-18 against a real account: every one of this
 * catalog's `/search` calls returns `search_metadata` (id, status,
 * timestamps, the json/markdown endpoints for re-fetching this exact
 * result) and echoes the resolved `search_parameters` back. Beyond that
 * envelope, each engine's actual result arrays (`organic_results`,
 * `shopping_results`, `jobs_results`, `news_results`, ...) genuinely differ
 * per engine - the catalog's own operation descriptions name many of these
 * fields, but typing all ~40 distinct per-engine result shapes precisely
 * would mean guessing field-level detail this session didn't live-capture
 * for every engine. `.loose()` throughout: the confirmed envelope is typed,
 * everything past it is kept (not dropped) rather than guessed at.
 */

export const SerpapiSearchMetadataSchema = z
	.object({
		id: z.string(),
		status: z.string(),
		created_at: z.string().optional(),
		processed_at: z.string().optional(),
		total_time_taken: z.number().optional(),
		json_endpoint: z.string().optional(),
	})
	.loose();
export type SerpapiSearchMetadata = z.infer<typeof SerpapiSearchMetadataSchema>;

export const SerpapiSearchResponseSchema = z
	.object({
		search_metadata: SerpapiSearchMetadataSchema,
		search_parameters: z.record(z.string(), z.unknown()).optional(),
		search_information: z.record(z.string(), z.unknown()).optional(),
		error: z.string().optional(),
	})
	.loose();
export type SerpapiSearchResponse = z.infer<typeof SerpapiSearchResponseSchema>;

/** `GET /locations.json` response - confirmed live, one item's real shape. */
export const SerpapiLocationSchema = z
	.object({
		id: z.string(),
		google_id: z.number().optional(),
		google_parent_id: z.number().optional(),
		name: z.string(),
		canonical_name: z.string().optional(),
		country_code: z.string().optional(),
		target_type: z.string().optional(),
		reach: z.number().optional(),
		gps: z.array(z.number()).optional(),
		keys: z.array(z.string()).optional(),
	})
	.loose();
export type SerpapiLocation = z.infer<typeof SerpapiLocationSchema>;

/** `GET /google-domains.json` response - confirmed live, real shape. */
export const SerpapiGoogleDomainSchema = z
	.object({
		domain: z.string(),
		language_code: z.string().optional(),
		country_code: z.string().optional(),
		country_name: z.string().optional(),
	})
	.loose();
export type SerpapiGoogleDomain = z.infer<typeof SerpapiGoogleDomainSchema>;

/* -------------------------------------------------------------------------- */
/* shared input fragments                                                     */
/* -------------------------------------------------------------------------- */

/**
 * Common optional parameters across most Google-family and other-engine
 * searches, per the provider's own docs - not every engine accepts every
 * one of these (e.g. `youtube`/`yelp`/marketplace engines have their own
 * distinct parameter sets instead), so this is spread only into the
 * engines confirmed to share this convention.
 */
const nonempty = z.string().trim().min(1);

const httpUrl = nonempty.url().refine((value) => {
	const protocol = new URL(value).protocol;
	return protocol === 'http:' || protocol === 'https:';
});

const CommonSearchParamsSchema = {
	location: nonempty.optional(),
	hl: nonempty.optional(),
	gl: nonempty.optional(),
	device: z.enum(['desktop', 'tablet', 'mobile']).optional(),
	num: z.number().optional(),
	start: z.number().optional(),
	no_cache: z.boolean().optional(),
	async: z.boolean().optional(),
};

/* -------------------------------------------------------------------------- */
/* google-family engines (26 ops)                                             */
/* -------------------------------------------------------------------------- */

const SearchInputSchema = z.object({
	q: nonempty,
	...CommonSearchParamsSchema,
	/** Confirmed from the catalog description: "max num=100". */
	num: z.number().max(100).optional(),
});
export type SearchInput = z.infer<typeof SearchInputSchema>;

const ImageSearchInputSchema = z.object({
	q: nonempty,
	...CommonSearchParamsSchema,
	/** Confirmed from the catalog description: 1-100, defaults to 20. */
	num: z.number().min(1).max(100).optional(),
});
export type ImageSearchInput = z.infer<typeof ImageSearchInputSchema>;

const ImagesLightSearchInputSchema = z.object({
	q: nonempty,
	...CommonSearchParamsSchema,
});
export type ImagesLightSearchInput = z.infer<
	typeof ImagesLightSearchInputSchema
>;

const VideosLightSearchInputSchema = z.object({
	q: nonempty,
	...CommonSearchParamsSchema,
});
export type VideosLightSearchInput = z.infer<
	typeof VideosLightSearchInputSchema
>;

const MapsSearchInputSchema = z.object({
	q: nonempty,
	ll: nonempty.optional(),
	type: nonempty.optional(),
	...CommonSearchParamsSchema,
});
export type MapsSearchInput = z.infer<typeof MapsSearchInputSchema>;

/**
 * Confirmed live: requires `data_id` (the place's Google Maps data id), not
 * `q`. `next_page_token` added per the catalog's own description ("Returns
 * 10 posts per page with pagination support") - not independently
 * live-confirmed as functional (a 200 with an extra unrecognized param
 * doesn't prove the param is used, only that it isn't rejected), but
 * matches the response envelope's own `serpapi_pagination` field pattern
 * seen on every other paginated engine in this catalog.
 */
const MapsPostsInputSchema = z.object({
	data_id: nonempty,
	hl: nonempty.optional(),
	next_page_token: nonempty.optional(),
});
export type MapsPostsInput = z.infer<typeof MapsPostsInputSchema>;

const JobsSearchInputSchema = z.object({
	q: nonempty,
	location: nonempty.optional(),
	hl: nonempty.optional(),
	gl: nonempty.optional(),
	start: z.number().optional(),
	/** Confirmed from the catalog description's own field names. */
	ltype: nonempty.optional(),
});
export type JobsSearchInput = z.infer<typeof JobsSearchInputSchema>;

/** Confirmed live: `q` is optional (a bare call with no query succeeds). */
const PlaySearchInputSchema = z.object({
	q: nonempty.optional(),
	gl: nonempty.optional(),
	hl: nonempty.optional(),
});
export type PlaySearchInput = z.infer<typeof PlaySearchInputSchema>;

const PlayProductInputSchema = z.object({
	product_id: nonempty,
	store: z.enum(['apps', 'movies', 'tv', 'audiobooks', 'books']).optional(),
	gl: nonempty.optional(),
	hl: nonempty.optional(),
});
export type PlayProductInput = z.infer<typeof PlayProductInputSchema>;

/** Confirmed live: needs `q`, `cites` or `cluster` - `q` covers the common case. */
/** Confirmed live: needs `q`, `cites` or `cluster` - `{"error":"Missing query \`q\`, \`cites\` or \`cluster\` parameter."}` with none supplied. */
const ScholarSearchInputSchema = z
	.object({
		q: nonempty.optional(),
		cites: nonempty.optional(),
		cluster: nonempty.optional(),
		hl: nonempty.optional(),
		start: z.number().optional(),
	})
	.refine(
		(value) =>
			value.q !== undefined ||
			value.cites !== undefined ||
			value.cluster !== undefined,
		{ message: 'One of q, cites, or cluster is required' },
	);
export type ScholarSearchInput = z.infer<typeof ScholarSearchInputSchema>;

const ScholarAuthorInputSchema = z.object({
	author_id: nonempty,
	hl: nonempty.optional(),
});
export type ScholarAuthorInput = z.infer<typeof ScholarAuthorInputSchema>;

/** `q` here is the paper's Google Scholar result id, not a free-text query. */
const ScholarCiteInputSchema = z.object({
	q: nonempty,
});
export type ScholarCiteInput = z.infer<typeof ScholarCiteInputSchema>;

/** Confirmed live: needs `q` or `category`. */
/** Confirmed live: needs `q` or `category` - `{"error":"Missing query \`q\` or \`category\` parameter."}` with neither supplied. */
const TrendsSearchInputSchema = z
	.object({
		q: nonempty.optional(),
		category: nonempty.optional(),
		data_type: nonempty.optional(),
		geo: nonempty.optional(),
		date: nonempty.optional(),
	})
	.refine((value) => value.q !== undefined || value.category !== undefined, {
		message: 'Either q or category is required',
	});
export type TrendsSearchInput = z.infer<typeof TrendsSearchInputSchema>;

const FinanceSearchInputSchema = z.object({
	q: nonempty,
	hl: nonempty.optional(),
});
export type FinanceSearchInput = z.infer<typeof FinanceSearchInputSchema>;

/** Confirmed live: `q` is optional (a bare call with no query succeeds). */
const NewsSearchInputSchema = z.object({
	q: nonempty.optional(),
	...CommonSearchParamsSchema,
});
export type NewsSearchInput = z.infer<typeof NewsSearchInputSchema>;

const ShoppingSearchInputSchema = z.object({
	q: nonempty,
	location: nonempty.optional(),
	hl: nonempty.optional(),
	gl: nonempty.optional(),
});
export type ShoppingSearchInput = z.infer<typeof ShoppingSearchInputSchema>;

const HotelSearchInputSchema = z.object({
	q: nonempty,
	check_in_date: nonempty.optional(),
	check_out_date: nonempty.optional(),
	adults: z.number().optional(),
	currency: nonempty.optional(),
	...CommonSearchParamsSchema,
});
export type HotelSearchInput = z.infer<typeof HotelSearchInputSchema>;

const HotelsAutocompleteInputSchema = z.object({
	q: nonempty,
	hl: nonempty.optional(),
});
export type HotelsAutocompleteInput = z.infer<
	typeof HotelsAutocompleteInputSchema
>;

const EventSearchInputSchema = z.object({
	q: nonempty,
	location: nonempty.optional(),
	hl: nonempty.optional(),
	gl: nonempty.optional(),
});
export type EventSearchInput = z.infer<typeof EventSearchInputSchema>;

const LocalServicesSearchInputSchema = z.object({
	q: nonempty,
	location: nonempty.optional(),
	hl: nonempty.optional(),
	gl: nonempty.optional(),
});
export type LocalServicesSearchInput = z.infer<
	typeof LocalServicesSearchInputSchema
>;

const ForumsSearchInputSchema = z.object({
	q: nonempty,
	...CommonSearchParamsSchema,
});
export type ForumsSearchInput = z.infer<typeof ForumsSearchInputSchema>;

/** Confirmed live: requires a publicly accessible `url`, not `q`. */
const LensSearchInputSchema = z.object({
	url: httpUrl,
	hl: nonempty.optional(),
	country: nonempty.optional(),
});
export type LensSearchInput = z.infer<typeof LensSearchInputSchema>;

const LightSearchInputSchema = z.object({
	q: nonempty,
	...CommonSearchParamsSchema,
});
export type LightSearchInput = z.infer<typeof LightSearchInputSchema>;

/** `q` here is the URL to get "About this result" information for. */
const AboutThisResultInputSchema = z.object({
	q: httpUrl,
	hl: nonempty.optional(),
	gl: nonempty.optional(),
});
export type AboutThisResultInput = z.infer<typeof AboutThisResultInputSchema>;

const PatentDetailsInputSchema = z.object({
	patent_id: nonempty,
	hl: nonempty.optional(),
});
export type PatentDetailsInput = z.infer<typeof PatentDetailsInputSchema>;

const ImagesRelatedContentInputSchema = z.object({
	related_content_id: nonempty,
	hl: nonempty.optional(),
	gl: nonempty.optional(),
});
export type ImagesRelatedContentInput = z.infer<
	typeof ImagesRelatedContentInputSchema
>;

/* -------------------------------------------------------------------------- */
/* other search engines (12 ops)                                              */
/* -------------------------------------------------------------------------- */

const BingSearchInputSchema = z.object({
	q: nonempty,
	location: nonempty.optional(),
	mkt: nonempty.optional(),
	cc: nonempty.optional(),
	device: z.enum(['desktop', 'tablet', 'mobile']).optional(),
});
export type BingSearchInput = z.infer<typeof BingSearchInputSchema>;

const BingMapsInputSchema = z.object({
	q: nonempty,
	id: nonempty.optional(),
	location: nonempty.optional(),
});
export type BingMapsInput = z.infer<typeof BingMapsInputSchema>;

const DuckDuckGoSearchInputSchema = z.object({
	q: nonempty,
	kl: nonempty.optional(),
});
export type DuckDuckGoSearchInput = z.infer<typeof DuckDuckGoSearchInputSchema>;

const DuckDuckGoMapsInputSchema = z.object({
	q: nonempty,
	kl: nonempty.optional(),
});
export type DuckDuckGoMapsInput = z.infer<typeof DuckDuckGoMapsInputSchema>;

/** Confirmed from the catalog description: supports pagination, 15 results/page. */
const DuckDuckGoLightSearchInputSchema = z.object({
	q: nonempty,
	kl: nonempty.optional(),
	df: nonempty.optional(),
	start: z.number().optional(),
});
export type DuckDuckGoLightSearchInput = z.infer<
	typeof DuckDuckGoLightSearchInputSchema
>;

/** Confirmed live: Yahoo's query parameter is `p`, not `q`. */
const YahooSearchInputSchema = z.object({
	p: nonempty,
	location: nonempty.optional(),
	device: z.enum(['desktop', 'tablet', 'mobile']).optional(),
});
export type YahooSearchInput = z.infer<typeof YahooSearchInputSchema>;

const YahooVideosInputSchema = z.object({
	p: nonempty,
});
export type YahooVideosInput = z.infer<typeof YahooVideosInputSchema>;

/** Confirmed live: Yandex's query parameter is `text`, not `q`. */
const YandexSearchInputSchema = z.object({
	text: nonempty,
	location: nonempty.optional(),
});
export type YandexSearchInput = z.infer<typeof YandexSearchInputSchema>;

const YandexImagesSearchInputSchema = z.object({
	text: nonempty,
	isize: nonempty.optional(),
	icolor: nonempty.optional(),
	itype: nonempty.optional(),
});
export type YandexImagesSearchInput = z.infer<
	typeof YandexImagesSearchInputSchema
>;

/**
 * Confirmed live: Naver's query parameter is `query`, not `q`. `period`
 * confirmed live too (echoed back in `search_parameters` when supplied,
 * unlike a guessed `sort` param which was silently dropped) - matches the
 * catalog description's "filtering options including time periods".
 */
const NaverSearchInputSchema = z.object({
	query: nonempty,
	where: nonempty.optional(),
	period: nonempty.optional(),
});
export type NaverSearchInput = z.infer<typeof NaverSearchInputSchema>;

const BaiduSearchInputSchema = z.object({
	q: nonempty,
});
export type BaiduSearchInput = z.infer<typeof BaiduSearchInputSchema>;

/** Confirmed live: YouTube's query parameter is `search_query`, not `q`. */
const YouTubeSearchInputSchema = z.object({
	search_query: nonempty,
	gl: nonempty.optional(),
	hl: nonempty.optional(),
});
export type YouTubeSearchInput = z.infer<typeof YouTubeSearchInputSchema>;

/* -------------------------------------------------------------------------- */
/* marketplace / local-business search (7 ops)                                */
/* -------------------------------------------------------------------------- */

/** Confirmed live: eBay's query parameter is `_nkw`, not `q`. */
const EbaySearchInputSchema = z.object({
	_nkw: nonempty,
	_sacat: nonempty.optional(),
});
export type EbaySearchInput = z.infer<typeof EbaySearchInputSchema>;

/** Confirmed live: needs `query` or `cat_id`. */
/** Confirmed live: needs `query` or `cat_id` - `{"error":"Missing query \`query\` or \`cat_id\` parameter."}` with neither supplied. */
const WalmartSearchInputSchema = z
	.object({
		query: nonempty.optional(),
		cat_id: nonempty.optional(),
		store_id: nonempty.optional(),
	})
	.refine((value) => value.query !== undefined || value.cat_id !== undefined, {
		message: 'Either query or cat_id is required',
	});
export type WalmartSearchInput = z.infer<typeof WalmartSearchInputSchema>;

const WalmartProductReviewsInputSchema = z.object({
	product_id: nonempty,
	sort: nonempty.optional(),
});
export type WalmartProductReviewsInput = z.infer<
	typeof WalmartProductReviewsInputSchema
>;

const AppleAppStoreInputSchema = z.object({
	term: nonempty,
	country: nonempty.optional(),
});
export type AppleAppStoreInput = z.infer<typeof AppleAppStoreInputSchema>;

/** Confirmed live: Yelp requires `find_loc`, a location, alongside a `find_desc` query term. */
const YelpSearchInputSchema = z.object({
	find_loc: nonempty,
	find_desc: nonempty.optional(),
});
export type YelpSearchInput = z.infer<typeof YelpSearchInputSchema>;

/** Confirmed live: OpenTable reviews need `rid` (the restaurant id), not `q`. */
const OpenTableReviewsInputSchema = z.object({
	rid: nonempty,
});
export type OpenTableReviewsInput = z.infer<typeof OpenTableReviewsInputSchema>;

const FacebookProfileInputSchema = z.object({
	profile_id: nonempty,
});
export type FacebookProfileInput = z.infer<typeof FacebookProfileInputSchema>;

/* -------------------------------------------------------------------------- */
/* utilities (3 ops - not `/search`, distinct paths)                          */
/* -------------------------------------------------------------------------- */

const LocationOptionsInputSchema = z.object({
	q: nonempty.optional(),
	limit: z.number().optional(),
});
export type LocationOptionsInput = z.infer<typeof LocationOptionsInputSchema>;

/**
 * Confirmed live: `GET /searches/{search_id}.json` - a fully distinct path,
 * not `/search`. Every real search id captured during this build's recon
 * (`search_metadata.id`) was a 24-character hex string (a MongoDB
 * ObjectId shape) - constrained here so a malformed value 400s from schema
 * validation with a clear message instead of building a broken or
 * unexpected request path.
 */
const SearchArchiveInputSchema = z.object({
	search_id: z
		.string()
		.regex(/^[0-9a-f]{24}$/i, 'Must be a 24-character hex search id'),
});
export type SearchArchiveInput = z.infer<typeof SearchArchiveInputSchema>;

const DomainsListInputSchema = z.object({});
export type DomainsListInput = z.infer<typeof DomainsListInputSchema>;

/* -------------------------------------------------------------------------- */
/* endpoint input/output maps                                                 */
/* -------------------------------------------------------------------------- */

export type SerpapiEndpointInputs = {
	'search.search': SearchInput;
	'search.imageSearch': ImageSearchInput;
	'search.imagesLightSearch': ImagesLightSearchInput;
	'search.videosLightSearch': VideosLightSearchInput;
	'search.mapsSearch': MapsSearchInput;
	'search.mapsPosts': MapsPostsInput;
	'search.jobsSearch': JobsSearchInput;
	'search.playSearch': PlaySearchInput;
	'search.playProduct': PlayProductInput;
	'search.scholarSearch': ScholarSearchInput;
	'search.scholarAuthor': ScholarAuthorInput;
	'search.scholarCite': ScholarCiteInput;
	'search.trendsSearch': TrendsSearchInput;
	'search.financeSearch': FinanceSearchInput;
	'search.newsSearch': NewsSearchInput;
	'search.shoppingSearch': ShoppingSearchInput;
	'search.hotelSearch': HotelSearchInput;
	'search.hotelsAutocomplete': HotelsAutocompleteInput;
	'search.eventSearch': EventSearchInput;
	'search.localServicesSearch': LocalServicesSearchInput;
	'search.forumsSearch': ForumsSearchInput;
	'search.lensSearch': LensSearchInput;
	'search.lightSearch': LightSearchInput;
	'search.aboutThisResult': AboutThisResultInput;
	'search.patentDetails': PatentDetailsInput;
	'search.imagesRelatedContent': ImagesRelatedContentInput;

	'engines.bingSearch': BingSearchInput;
	'engines.bingMaps': BingMapsInput;
	'engines.duckDuckGoSearch': DuckDuckGoSearchInput;
	'engines.duckDuckGoMaps': DuckDuckGoMapsInput;
	'engines.duckDuckGoLightSearch': DuckDuckGoLightSearchInput;
	'engines.yahooSearch': YahooSearchInput;
	'engines.yahooVideos': YahooVideosInput;
	'engines.yandexSearch': YandexSearchInput;
	'engines.yandexImagesSearch': YandexImagesSearchInput;
	'engines.naverSearch': NaverSearchInput;
	'engines.baiduSearch': BaiduSearchInput;
	'engines.youtubeSearch': YouTubeSearchInput;

	'marketplace.ebaySearch': EbaySearchInput;
	'marketplace.walmartSearch': WalmartSearchInput;
	'marketplace.walmartProductReviews': WalmartProductReviewsInput;
	'marketplace.appleAppStoreSearch': AppleAppStoreInput;
	'marketplace.yelpSearch': YelpSearchInput;
	'marketplace.openTableReviews': OpenTableReviewsInput;
	'marketplace.facebookProfile': FacebookProfileInput;

	'utilities.locationOptions': LocationOptionsInput;
	'utilities.searchArchive': SearchArchiveInput;
	'utilities.domainsList': DomainsListInput;
};

export type SerpapiEndpointOutputs = {
	'search.search': SerpapiSearchResponse;
	'search.imageSearch': SerpapiSearchResponse;
	'search.imagesLightSearch': SerpapiSearchResponse;
	'search.videosLightSearch': SerpapiSearchResponse;
	'search.mapsSearch': SerpapiSearchResponse;
	'search.mapsPosts': SerpapiSearchResponse;
	'search.jobsSearch': SerpapiSearchResponse;
	'search.playSearch': SerpapiSearchResponse;
	'search.playProduct': SerpapiSearchResponse;
	'search.scholarSearch': SerpapiSearchResponse;
	'search.scholarAuthor': SerpapiSearchResponse;
	'search.scholarCite': SerpapiSearchResponse;
	'search.trendsSearch': SerpapiSearchResponse;
	'search.financeSearch': SerpapiSearchResponse;
	'search.newsSearch': SerpapiSearchResponse;
	'search.shoppingSearch': SerpapiSearchResponse;
	'search.hotelSearch': SerpapiSearchResponse;
	'search.hotelsAutocomplete': SerpapiSearchResponse;
	'search.eventSearch': SerpapiSearchResponse;
	'search.localServicesSearch': SerpapiSearchResponse;
	'search.forumsSearch': SerpapiSearchResponse;
	'search.lensSearch': SerpapiSearchResponse;
	'search.lightSearch': SerpapiSearchResponse;
	'search.aboutThisResult': SerpapiSearchResponse;
	'search.patentDetails': SerpapiSearchResponse;
	'search.imagesRelatedContent': SerpapiSearchResponse;

	'engines.bingSearch': SerpapiSearchResponse;
	'engines.bingMaps': SerpapiSearchResponse;
	'engines.duckDuckGoSearch': SerpapiSearchResponse;
	'engines.duckDuckGoMaps': SerpapiSearchResponse;
	'engines.duckDuckGoLightSearch': SerpapiSearchResponse;
	'engines.yahooSearch': SerpapiSearchResponse;
	'engines.yahooVideos': SerpapiSearchResponse;
	'engines.yandexSearch': SerpapiSearchResponse;
	'engines.yandexImagesSearch': SerpapiSearchResponse;
	'engines.naverSearch': SerpapiSearchResponse;
	'engines.baiduSearch': SerpapiSearchResponse;
	'engines.youtubeSearch': SerpapiSearchResponse;

	'marketplace.ebaySearch': SerpapiSearchResponse;
	'marketplace.walmartSearch': SerpapiSearchResponse;
	'marketplace.walmartProductReviews': SerpapiSearchResponse;
	'marketplace.appleAppStoreSearch': SerpapiSearchResponse;
	'marketplace.yelpSearch': SerpapiSearchResponse;
	'marketplace.openTableReviews': SerpapiSearchResponse;
	'marketplace.facebookProfile': SerpapiSearchResponse;

	'utilities.locationOptions': SerpapiLocation[];
	'utilities.searchArchive': SerpapiSearchResponse;
	'utilities.domainsList': SerpapiGoogleDomain[];
};

export const SerpapiEndpointInputSchemas = {
	'search.search': SearchInputSchema,
	'search.imageSearch': ImageSearchInputSchema,
	'search.imagesLightSearch': ImagesLightSearchInputSchema,
	'search.videosLightSearch': VideosLightSearchInputSchema,
	'search.mapsSearch': MapsSearchInputSchema,
	'search.mapsPosts': MapsPostsInputSchema,
	'search.jobsSearch': JobsSearchInputSchema,
	'search.playSearch': PlaySearchInputSchema,
	'search.playProduct': PlayProductInputSchema,
	'search.scholarSearch': ScholarSearchInputSchema,
	'search.scholarAuthor': ScholarAuthorInputSchema,
	'search.scholarCite': ScholarCiteInputSchema,
	'search.trendsSearch': TrendsSearchInputSchema,
	'search.financeSearch': FinanceSearchInputSchema,
	'search.newsSearch': NewsSearchInputSchema,
	'search.shoppingSearch': ShoppingSearchInputSchema,
	'search.hotelSearch': HotelSearchInputSchema,
	'search.hotelsAutocomplete': HotelsAutocompleteInputSchema,
	'search.eventSearch': EventSearchInputSchema,
	'search.localServicesSearch': LocalServicesSearchInputSchema,
	'search.forumsSearch': ForumsSearchInputSchema,
	'search.lensSearch': LensSearchInputSchema,
	'search.lightSearch': LightSearchInputSchema,
	'search.aboutThisResult': AboutThisResultInputSchema,
	'search.patentDetails': PatentDetailsInputSchema,
	'search.imagesRelatedContent': ImagesRelatedContentInputSchema,

	'engines.bingSearch': BingSearchInputSchema,
	'engines.bingMaps': BingMapsInputSchema,
	'engines.duckDuckGoSearch': DuckDuckGoSearchInputSchema,
	'engines.duckDuckGoMaps': DuckDuckGoMapsInputSchema,
	'engines.duckDuckGoLightSearch': DuckDuckGoLightSearchInputSchema,
	'engines.yahooSearch': YahooSearchInputSchema,
	'engines.yahooVideos': YahooVideosInputSchema,
	'engines.yandexSearch': YandexSearchInputSchema,
	'engines.yandexImagesSearch': YandexImagesSearchInputSchema,
	'engines.naverSearch': NaverSearchInputSchema,
	'engines.baiduSearch': BaiduSearchInputSchema,
	'engines.youtubeSearch': YouTubeSearchInputSchema,

	'marketplace.ebaySearch': EbaySearchInputSchema,
	'marketplace.walmartSearch': WalmartSearchInputSchema,
	'marketplace.walmartProductReviews': WalmartProductReviewsInputSchema,
	'marketplace.appleAppStoreSearch': AppleAppStoreInputSchema,
	'marketplace.yelpSearch': YelpSearchInputSchema,
	'marketplace.openTableReviews': OpenTableReviewsInputSchema,
	'marketplace.facebookProfile': FacebookProfileInputSchema,

	'utilities.locationOptions': LocationOptionsInputSchema,
	'utilities.searchArchive': SearchArchiveInputSchema,
	'utilities.domainsList': DomainsListInputSchema,
} as const;

export const SerpapiEndpointOutputSchemas = {
	'search.search': SerpapiSearchResponseSchema,
	'search.imageSearch': SerpapiSearchResponseSchema,
	'search.imagesLightSearch': SerpapiSearchResponseSchema,
	'search.videosLightSearch': SerpapiSearchResponseSchema,
	'search.mapsSearch': SerpapiSearchResponseSchema,
	'search.mapsPosts': SerpapiSearchResponseSchema,
	'search.jobsSearch': SerpapiSearchResponseSchema,
	'search.playSearch': SerpapiSearchResponseSchema,
	'search.playProduct': SerpapiSearchResponseSchema,
	'search.scholarSearch': SerpapiSearchResponseSchema,
	'search.scholarAuthor': SerpapiSearchResponseSchema,
	'search.scholarCite': SerpapiSearchResponseSchema,
	'search.trendsSearch': SerpapiSearchResponseSchema,
	'search.financeSearch': SerpapiSearchResponseSchema,
	'search.newsSearch': SerpapiSearchResponseSchema,
	'search.shoppingSearch': SerpapiSearchResponseSchema,
	'search.hotelSearch': SerpapiSearchResponseSchema,
	'search.hotelsAutocomplete': SerpapiSearchResponseSchema,
	'search.eventSearch': SerpapiSearchResponseSchema,
	'search.localServicesSearch': SerpapiSearchResponseSchema,
	'search.forumsSearch': SerpapiSearchResponseSchema,
	'search.lensSearch': SerpapiSearchResponseSchema,
	'search.lightSearch': SerpapiSearchResponseSchema,
	'search.aboutThisResult': SerpapiSearchResponseSchema,
	'search.patentDetails': SerpapiSearchResponseSchema,
	'search.imagesRelatedContent': SerpapiSearchResponseSchema,

	'engines.bingSearch': SerpapiSearchResponseSchema,
	'engines.bingMaps': SerpapiSearchResponseSchema,
	'engines.duckDuckGoSearch': SerpapiSearchResponseSchema,
	'engines.duckDuckGoMaps': SerpapiSearchResponseSchema,
	'engines.duckDuckGoLightSearch': SerpapiSearchResponseSchema,
	'engines.yahooSearch': SerpapiSearchResponseSchema,
	'engines.yahooVideos': SerpapiSearchResponseSchema,
	'engines.yandexSearch': SerpapiSearchResponseSchema,
	'engines.yandexImagesSearch': SerpapiSearchResponseSchema,
	'engines.naverSearch': SerpapiSearchResponseSchema,
	'engines.baiduSearch': SerpapiSearchResponseSchema,
	'engines.youtubeSearch': SerpapiSearchResponseSchema,

	'marketplace.ebaySearch': SerpapiSearchResponseSchema,
	'marketplace.walmartSearch': SerpapiSearchResponseSchema,
	'marketplace.walmartProductReviews': SerpapiSearchResponseSchema,
	'marketplace.appleAppStoreSearch': SerpapiSearchResponseSchema,
	'marketplace.yelpSearch': SerpapiSearchResponseSchema,
	'marketplace.openTableReviews': SerpapiSearchResponseSchema,
	'marketplace.facebookProfile': SerpapiSearchResponseSchema,

	'utilities.locationOptions': z.array(SerpapiLocationSchema),
	'utilities.searchArchive': SerpapiSearchResponseSchema,
	'utilities.domainsList': z.array(SerpapiGoogleDomainSchema),
} as const;
