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
import { tryGetStoredKey } from './client';
import {
	AppleAppStore,
	AppleMaps,
	Bing,
	Duckduckgo,
	Google,
	GoogleMaps,
	GooglePlay,
	Keys,
	Tripadvisor,
	Web,
	Yelp,
} from './endpoints';
import type {
	LitescrapeEndpointInputs,
	LitescrapeEndpointOutputs,
} from './endpoints/types';
import {
	LitescrapeEndpointInputSchemas,
	LitescrapeEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { LitescrapeSchema } from './schema';

export type LitescrapePluginOptions = {
	/** LiteScrape web-data scraping and search API. */
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalLitescrapePlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof litescrapeEndpointsNested>;
};

export type LitescrapeContext = CorsairPluginContext<
	typeof LitescrapeSchema,
	LitescrapePluginOptions
>;

export type LitescrapeKeyBuilderContext =
	KeyBuilderContext<LitescrapePluginOptions>;

export type LitescrapeBoundEndpoints = BindEndpoints<
	typeof litescrapeEndpointsNested
>;

type LitescrapeEndpoint<K extends keyof LitescrapeEndpointOutputs> =
	CorsairEndpoint<
		LitescrapeContext,
		LitescrapeEndpointInputs[K],
		LitescrapeEndpointOutputs[K]
	>;

export type LitescrapeEndpoints = {
	googleSearch: LitescrapeEndpoint<'googleSearch'>;
	googleAiOverview: LitescrapeEndpoint<'googleAiOverview'>;
	googleAiMode: LitescrapeEndpoint<'googleAiMode'>;
	googleAds: LitescrapeEndpoint<'googleAds'>;
	googleLocal: LitescrapeEndpoint<'googleLocal'>;
	googleShopping: LitescrapeEndpoint<'googleShopping'>;
	googleShoppingProduct: LitescrapeEndpoint<'googleShoppingProduct'>;

	googleMapsSearch: LitescrapeEndpoint<'googleMapsSearch'>;
	googleMapsReviews: LitescrapeEndpoint<'googleMapsReviews'>;
	googleMapsContributorReviews: LitescrapeEndpoint<'googleMapsContributorReviews'>;
	googleMapsPopularTimes: LitescrapeEndpoint<'googleMapsPopularTimes'>;
	googleMapsPosts: LitescrapeEndpoint<'googleMapsPosts'>;
	googleMapsPhotoMeta: LitescrapeEndpoint<'googleMapsPhotoMeta'>;

	bingSearch: LitescrapeEndpoint<'bingSearch'>;
	bingMaps: LitescrapeEndpoint<'bingMaps'>;

	duckduckgoSearch: LitescrapeEndpoint<'duckduckgoSearch'>;
	duckduckgoMaps: LitescrapeEndpoint<'duckduckgoMaps'>;

	yelpSearch: LitescrapeEndpoint<'yelpSearch'>;
	yelpReviews: LitescrapeEndpoint<'yelpReviews'>;

	tripadvisorSearch: LitescrapeEndpoint<'tripadvisorSearch'>;
	tripadvisorPlace: LitescrapeEndpoint<'tripadvisorPlace'>;
	tripadvisorReviews: LitescrapeEndpoint<'tripadvisorReviews'>;

	appleMapsPlaces: LitescrapeEndpoint<'appleMapsPlaces'>;
	appleMapsReviews: LitescrapeEndpoint<'appleMapsReviews'>;

	googlePlayApps: LitescrapeEndpoint<'googlePlayApps'>;
	googlePlayGames: LitescrapeEndpoint<'googlePlayGames'>;
	googlePlayBooks: LitescrapeEndpoint<'googlePlayBooks'>;
	googlePlayMovies: LitescrapeEndpoint<'googlePlayMovies'>;
	googlePlayProduct: LitescrapeEndpoint<'googlePlayProduct'>;
	googlePlayReviews: LitescrapeEndpoint<'googlePlayReviews'>;

	appleAppStoreSearch: LitescrapeEndpoint<'appleAppStoreSearch'>;
	appleAppStoreProduct: LitescrapeEndpoint<'appleAppStoreProduct'>;
	appleAppStoreReviews: LitescrapeEndpoint<'appleAppStoreReviews'>;

	webFetch: LitescrapeEndpoint<'webFetch'>;
	webScreenshot: LitescrapeEndpoint<'webScreenshot'>;

	keysStatus: LitescrapeEndpoint<'keysStatus'>;
};

const litescrapeEndpointsNested = {
	google: {
		search: Google.search,
		aiOverview: Google.aiOverview,
		aiMode: Google.aiMode,
		ads: Google.ads,
		local: Google.local,
		shopping: Google.shopping,
		shoppingProduct: Google.shoppingProduct,
	},
	googleMaps: {
		search: GoogleMaps.search,
		reviews: GoogleMaps.reviews,
		contributorReviews: GoogleMaps.contributorReviews,
		popularTimes: GoogleMaps.popularTimes,
		posts: GoogleMaps.posts,
		photoMeta: GoogleMaps.photoMeta,
	},
	bing: {
		search: Bing.search,
		maps: Bing.maps,
	},
	duckduckgo: {
		search: Duckduckgo.search,
		maps: Duckduckgo.maps,
	},
	yelp: {
		search: Yelp.search,
		reviews: Yelp.reviews,
	},
	tripadvisor: {
		search: Tripadvisor.search,
		place: Tripadvisor.place,
		reviews: Tripadvisor.reviews,
	},
	appleMaps: {
		places: AppleMaps.places,
		reviews: AppleMaps.reviews,
	},
	googlePlay: {
		apps: GooglePlay.apps,
		games: GooglePlay.games,
		books: GooglePlay.books,
		movies: GooglePlay.movies,
		product: GooglePlay.product,
		reviews: GooglePlay.reviews,
	},
	appleAppStore: {
		search: AppleAppStore.search,
		product: AppleAppStore.product,
		reviews: AppleAppStore.reviews,
	},
	web: {
		fetch: Web.fetch,
		screenshot: Web.screenshot,
	},
	keys: {
		status: Keys.status,
	},
} as const;

/**
 * No webhook capability. The LiteScrape API exposes only request/response
 * operations and publishes no inbound event verification spec, so there is
 * nothing for this plugin to receive or match.
 */
const litescrapeWebhooksNested = {} as const;

export const litescrapeEndpointSchemas = {
	'google.search': {
		input: LitescrapeEndpointInputSchemas.googleSearch,
		output: LitescrapeEndpointOutputSchemas.googleSearch,
	},
	'google.aiOverview': {
		input: LitescrapeEndpointInputSchemas.googleAiOverview,
		output: LitescrapeEndpointOutputSchemas.googleAiOverview,
	},
	'google.aiMode': {
		input: LitescrapeEndpointInputSchemas.googleAiMode,
		output: LitescrapeEndpointOutputSchemas.googleAiMode,
	},
	'google.ads': {
		input: LitescrapeEndpointInputSchemas.googleAds,
		output: LitescrapeEndpointOutputSchemas.googleAds,
	},
	'google.local': {
		input: LitescrapeEndpointInputSchemas.googleLocal,
		output: LitescrapeEndpointOutputSchemas.googleLocal,
	},
	'google.shopping': {
		input: LitescrapeEndpointInputSchemas.googleShopping,
		output: LitescrapeEndpointOutputSchemas.googleShopping,
	},
	'google.shoppingProduct': {
		input: LitescrapeEndpointInputSchemas.googleShoppingProduct,
		output: LitescrapeEndpointOutputSchemas.googleShoppingProduct,
	},
	'googleMaps.search': {
		input: LitescrapeEndpointInputSchemas.googleMapsSearch,
		output: LitescrapeEndpointOutputSchemas.googleMapsSearch,
	},
	'googleMaps.reviews': {
		input: LitescrapeEndpointInputSchemas.googleMapsReviews,
		output: LitescrapeEndpointOutputSchemas.googleMapsReviews,
	},
	'googleMaps.contributorReviews': {
		input: LitescrapeEndpointInputSchemas.googleMapsContributorReviews,
		output: LitescrapeEndpointOutputSchemas.googleMapsContributorReviews,
	},
	'googleMaps.popularTimes': {
		input: LitescrapeEndpointInputSchemas.googleMapsPopularTimes,
		output: LitescrapeEndpointOutputSchemas.googleMapsPopularTimes,
	},
	'googleMaps.posts': {
		input: LitescrapeEndpointInputSchemas.googleMapsPosts,
		output: LitescrapeEndpointOutputSchemas.googleMapsPosts,
	},
	'googleMaps.photoMeta': {
		input: LitescrapeEndpointInputSchemas.googleMapsPhotoMeta,
		output: LitescrapeEndpointOutputSchemas.googleMapsPhotoMeta,
	},
	'bing.search': {
		input: LitescrapeEndpointInputSchemas.bingSearch,
		output: LitescrapeEndpointOutputSchemas.bingSearch,
	},
	'bing.maps': {
		input: LitescrapeEndpointInputSchemas.bingMaps,
		output: LitescrapeEndpointOutputSchemas.bingMaps,
	},
	'duckduckgo.search': {
		input: LitescrapeEndpointInputSchemas.duckduckgoSearch,
		output: LitescrapeEndpointOutputSchemas.duckduckgoSearch,
	},
	'duckduckgo.maps': {
		input: LitescrapeEndpointInputSchemas.duckduckgoMaps,
		output: LitescrapeEndpointOutputSchemas.duckduckgoMaps,
	},
	'yelp.search': {
		input: LitescrapeEndpointInputSchemas.yelpSearch,
		output: LitescrapeEndpointOutputSchemas.yelpSearch,
	},
	'yelp.reviews': {
		input: LitescrapeEndpointInputSchemas.yelpReviews,
		output: LitescrapeEndpointOutputSchemas.yelpReviews,
	},
	'tripadvisor.search': {
		input: LitescrapeEndpointInputSchemas.tripadvisorSearch,
		output: LitescrapeEndpointOutputSchemas.tripadvisorSearch,
	},
	'tripadvisor.place': {
		input: LitescrapeEndpointInputSchemas.tripadvisorPlace,
		output: LitescrapeEndpointOutputSchemas.tripadvisorPlace,
	},
	'tripadvisor.reviews': {
		input: LitescrapeEndpointInputSchemas.tripadvisorReviews,
		output: LitescrapeEndpointOutputSchemas.tripadvisorReviews,
	},
	'appleMaps.places': {
		input: LitescrapeEndpointInputSchemas.appleMapsPlaces,
		output: LitescrapeEndpointOutputSchemas.appleMapsPlaces,
	},
	'appleMaps.reviews': {
		input: LitescrapeEndpointInputSchemas.appleMapsReviews,
		output: LitescrapeEndpointOutputSchemas.appleMapsReviews,
	},
	'googlePlay.apps': {
		input: LitescrapeEndpointInputSchemas.googlePlayApps,
		output: LitescrapeEndpointOutputSchemas.googlePlayApps,
	},
	'googlePlay.games': {
		input: LitescrapeEndpointInputSchemas.googlePlayGames,
		output: LitescrapeEndpointOutputSchemas.googlePlayGames,
	},
	'googlePlay.books': {
		input: LitescrapeEndpointInputSchemas.googlePlayBooks,
		output: LitescrapeEndpointOutputSchemas.googlePlayBooks,
	},
	'googlePlay.movies': {
		input: LitescrapeEndpointInputSchemas.googlePlayMovies,
		output: LitescrapeEndpointOutputSchemas.googlePlayMovies,
	},
	'googlePlay.product': {
		input: LitescrapeEndpointInputSchemas.googlePlayProduct,
		output: LitescrapeEndpointOutputSchemas.googlePlayProduct,
	},
	'googlePlay.reviews': {
		input: LitescrapeEndpointInputSchemas.googlePlayReviews,
		output: LitescrapeEndpointOutputSchemas.googlePlayReviews,
	},
	'appleAppStore.search': {
		input: LitescrapeEndpointInputSchemas.appleAppStoreSearch,
		output: LitescrapeEndpointOutputSchemas.appleAppStoreSearch,
	},
	'appleAppStore.product': {
		input: LitescrapeEndpointInputSchemas.appleAppStoreProduct,
		output: LitescrapeEndpointOutputSchemas.appleAppStoreProduct,
	},
	'appleAppStore.reviews': {
		input: LitescrapeEndpointInputSchemas.appleAppStoreReviews,
		output: LitescrapeEndpointOutputSchemas.appleAppStoreReviews,
	},
	'web.fetch': {
		input: LitescrapeEndpointInputSchemas.webFetch,
		output: LitescrapeEndpointOutputSchemas.webFetch,
	},
	'web.screenshot': {
		input: LitescrapeEndpointInputSchemas.webScreenshot,
		output: LitescrapeEndpointOutputSchemas.webScreenshot,
	},
	'keys.status': {
		input: LitescrapeEndpointInputSchemas.keysStatus,
		output: LitescrapeEndpointOutputSchemas.keysStatus,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof litescrapeEndpointsNested
>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const litescrapeEndpointMeta = {
	'google.search': {
		riskLevel: 'read',
		description:
			'Search Google for organic results, Knowledge Graph, related searches and the AI Overview',
	},
	'google.aiOverview': {
		riskLevel: 'read',
		description:
			"Get Google's AI Overview for a query as text blocks and cited references",
	},
	'google.aiMode': {
		riskLevel: 'read',
		description:
			'Ask Google AI Mode a question and get text blocks with cited references',
	},
	'google.ads': {
		riskLevel: 'read',
		description:
			'Get Google text, local and shopping ads plus the rest of the results page (Alpha)',
	},
	'google.local': {
		riskLevel: 'read',
		description:
			'Get Google local results with rating, reviews, category, address and place IDs',
	},
	'google.shopping': {
		riskLevel: 'read',
		description:
			'Get Google Shopping products with price, merchant, rating and delivery',
	},
	'google.shoppingProduct': {
		riskLevel: 'read',
		description:
			'Get one Google Shopping product page with every merchant offer and specification',
	},
	'googleMaps.search': {
		riskLevel: 'read',
		description: 'Get Google Maps places by query or one place by ID',
	},
	'googleMaps.reviews': {
		riskLevel: 'read',
		description:
			'Get Google Maps reviews with rating, text, author, date and likes',
	},
	'googleMaps.contributorReviews': {
		riskLevel: 'read',
		description:
			'Get the public review history for one Google Maps contributor',
	},
	'googleMaps.popularTimes': {
		riskLevel: 'read',
		description: 'See how busy a Google Maps place is right now',
	},
	'googleMaps.posts': {
		riskLevel: 'read',
		description: 'Read the posts published by a Google Maps business',
	},
	'googleMaps.photoMeta': {
		riskLevel: 'read',
		description: 'Get the place, contributor and date of a Google Maps photo',
	},
	'bing.search': {
		riskLevel: 'read',
		description:
			'Search Bing for organic results, knowledge cards and rich modules',
	},
	'bing.maps': {
		riskLevel: 'read',
		description: 'Get Bing Maps listings by query or one place by ID',
	},
	'duckduckgo.search': {
		riskLevel: 'read',
		description:
			'Search DuckDuckGo for organic results with region and safe-search controls',
	},
	'duckduckgo.maps': {
		riskLevel: 'read',
		description: 'Get DuckDuckGo Maps places within a bounding box',
	},
	'yelp.search': {
		riskLevel: 'read',
		description:
			'Search Yelp businesses with rating, reviews, categories and filters',
	},
	'yelp.reviews': {
		riskLevel: 'read',
		description:
			'Get Yelp reviews with rating, text, reviewer and owner replies',
	},
	'tripadvisor.search': {
		riskLevel: 'read',
		description: 'Search Tripadvisor hotels, restaurants and attractions',
	},
	'tripadvisor.place': {
		riskLevel: 'read',
		description: 'Get Tripadvisor place details by place ID',
	},
	'tripadvisor.reviews': {
		riskLevel: 'read',
		description: 'Get Tripadvisor reviews sorted by recency or relevance',
	},
	'appleMaps.places': {
		riskLevel: 'read',
		description:
			'Get Apple Maps places by MUID with address, hours and ratings',
	},
	'appleMaps.reviews': {
		riskLevel: 'read',
		description: 'Get Apple Maps rating summary and written reviews by MUID',
	},
	'googlePlay.apps': {
		riskLevel: 'read',
		description:
			'Search and browse Google Play apps with charts, categories and storefronts (Alpha)',
	},
	'googlePlay.games': {
		riskLevel: 'read',
		description:
			'Browse Google Play games by category, chart and device (Alpha)',
	},
	'googlePlay.books': {
		riskLevel: 'read',
		description:
			'Browse Google Play ebooks and audiobooks with categories and charts (Alpha)',
	},
	'googlePlay.movies': {
		riskLevel: 'read',
		description:
			'Browse Google Play movies, shows and episodes with categories and charts (Alpha)',
	},
	'googlePlay.product': {
		riskLevel: 'read',
		description:
			'Get a Google Play product page with ratings, permissions, media and reviews (Alpha)',
	},
	'googlePlay.reviews': {
		riskLevel: 'read',
		description:
			'Get Google Play reviews filtered by rating and platform (Alpha)',
	},
	'appleAppStore.search': {
		riskLevel: 'read',
		description:
			'Search the Apple App Store for apps with developer, price and rating (Alpha)',
	},
	'appleAppStore.product': {
		riskLevel: 'read',
		description:
			'Get an Apple App Store product page with version history and privacy labels (Alpha)',
	},
	'appleAppStore.reviews': {
		riskLevel: 'read',
		description:
			'Get Apple App Store reviews, newest or most helpful first (Alpha)',
	},
	'web.fetch': {
		riskLevel: 'read',
		description:
			'Render a public web page and return it as Markdown, HTML or text (Alpha)',
	},
	'web.screenshot': {
		riskLevel: 'read',
		description: 'Capture a web page screenshot as a PNG download URL (Alpha)',
	},
	'keys.status': {
		riskLevel: 'read',
		description:
			'Get LiteScrape key status, remaining calls and concurrency limit',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof litescrapeEndpointsNested
>;

export const litescrapeAuthConfig = {
	api_key: {},
} as const satisfies PluginAuthConfig;

export type BaseLitescrapePlugin<T extends LitescrapePluginOptions> =
	CorsairPlugin<
		'litescrape',
		typeof LitescrapeSchema,
		typeof litescrapeEndpointsNested,
		typeof litescrapeWebhooksNested,
		T,
		typeof defaultAuthType
	>;

export type InternalLitescrapePlugin =
	BaseLitescrapePlugin<LitescrapePluginOptions>;

export type ExternalLitescrapePlugin<T extends LitescrapePluginOptions> =
	BaseLitescrapePlugin<T>;

export function litescrape<const T extends LitescrapePluginOptions>(
	incomingOptions: LitescrapePluginOptions & T = {} as LitescrapePluginOptions &
		T,
): ExternalLitescrapePlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'litescrape',
		authConfig: litescrapeAuthConfig,
		schema: LitescrapeSchema,
		options: options,
		hooks: options.hooks,
		endpoints: litescrapeEndpointsNested,
		webhooks: litescrapeWebhooksNested,
		endpointMeta: litescrapeEndpointMeta,
		endpointSchemas: litescrapeEndpointSchemas,
		errorHandlers: (() => {
			// Core selects the first handler whose matcher accepts the error
			// (`Object.keys(...).find`), and DEFAULT matches everything, so
			// DEFAULT must always be evaluated last - otherwise it shadows any
			// custom handler a caller contributes through options. The caller's
			// DEFAULT is destructured out as well: spreading it in place would
			// keep its original key position, ahead of their other handlers.
			const { DEFAULT: builtInDefault, ...specificDefaults } = errorHandlers;
			const { DEFAULT: callerDefault, ...callerHandlers } =
				options.errorHandlers || {};
			return {
				...specificDefaults,
				...callerHandlers,
				DEFAULT: callerDefault || builtInDefault,
			};
		})(),
		// Returns the stored LiteScrape key (or the explicit option). When no
		// key is configured this throws AuthMissingError so core creates the
		// account-connect prompt for the tenant.
		keyBuilder: async (ctx: LitescrapeKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint') {
				const storedKey = await tryGetStoredKey(() => ctx.keys?.get_api_key());
				if (!storedKey) {
					throw new AuthMissingError('litescrape', 'api_key');
				}
				return storedKey;
			}

			return '';
		},
	} satisfies InternalLitescrapePlugin;
}

export type {
	LitescrapeEndpointInputs,
	LitescrapeEndpointOutputs,
} from './endpoints/types';
