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
import { Engines, Marketplace, Search, Utilities } from './endpoints';
import type {
	SerpapiEndpointInputs,
	SerpapiEndpointOutputs,
} from './endpoints/types';
import {
	SerpapiEndpointInputSchemas,
	SerpapiEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { SerpapiSchema } from './schema';

export type SerpapiPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalSerpapiPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof serpapiEndpointsNested>;
};

export type SerpapiContext = CorsairPluginContext<
	typeof SerpapiSchema,
	SerpapiPluginOptions
>;

export type SerpapiKeyBuilderContext = KeyBuilderContext<SerpapiPluginOptions>;

export type SerpapiBoundEndpoints = BindEndpoints<
	typeof serpapiEndpointsNested
>;

type SerpapiEndpoint<K extends keyof SerpapiEndpointOutputs> = CorsairEndpoint<
	SerpapiContext,
	SerpapiEndpointInputs[K],
	SerpapiEndpointOutputs[K]
>;

export type SerpapiEndpoints = {
	searchSearch: SerpapiEndpoint<'search.search'>;
	searchImageSearch: SerpapiEndpoint<'search.imageSearch'>;
	searchImagesLightSearch: SerpapiEndpoint<'search.imagesLightSearch'>;
	searchVideosLightSearch: SerpapiEndpoint<'search.videosLightSearch'>;
	searchMapsSearch: SerpapiEndpoint<'search.mapsSearch'>;
	searchMapsPosts: SerpapiEndpoint<'search.mapsPosts'>;
	searchJobsSearch: SerpapiEndpoint<'search.jobsSearch'>;
	searchPlaySearch: SerpapiEndpoint<'search.playSearch'>;
	searchPlayProduct: SerpapiEndpoint<'search.playProduct'>;
	searchScholarSearch: SerpapiEndpoint<'search.scholarSearch'>;
	searchScholarAuthor: SerpapiEndpoint<'search.scholarAuthor'>;
	searchScholarCite: SerpapiEndpoint<'search.scholarCite'>;
	searchTrendsSearch: SerpapiEndpoint<'search.trendsSearch'>;
	searchFinanceSearch: SerpapiEndpoint<'search.financeSearch'>;
	searchNewsSearch: SerpapiEndpoint<'search.newsSearch'>;
	searchShoppingSearch: SerpapiEndpoint<'search.shoppingSearch'>;
	searchHotelSearch: SerpapiEndpoint<'search.hotelSearch'>;
	searchHotelsAutocomplete: SerpapiEndpoint<'search.hotelsAutocomplete'>;
	searchEventSearch: SerpapiEndpoint<'search.eventSearch'>;
	searchLocalServicesSearch: SerpapiEndpoint<'search.localServicesSearch'>;
	searchForumsSearch: SerpapiEndpoint<'search.forumsSearch'>;
	searchLensSearch: SerpapiEndpoint<'search.lensSearch'>;
	searchLightSearch: SerpapiEndpoint<'search.lightSearch'>;
	searchAboutThisResult: SerpapiEndpoint<'search.aboutThisResult'>;
	searchPatentDetails: SerpapiEndpoint<'search.patentDetails'>;
	searchImagesRelatedContent: SerpapiEndpoint<'search.imagesRelatedContent'>;

	enginesBingSearch: SerpapiEndpoint<'engines.bingSearch'>;
	enginesBingMaps: SerpapiEndpoint<'engines.bingMaps'>;
	enginesDuckDuckGoSearch: SerpapiEndpoint<'engines.duckDuckGoSearch'>;
	enginesDuckDuckGoMaps: SerpapiEndpoint<'engines.duckDuckGoMaps'>;
	enginesDuckDuckGoLightSearch: SerpapiEndpoint<'engines.duckDuckGoLightSearch'>;
	enginesYahooSearch: SerpapiEndpoint<'engines.yahooSearch'>;
	enginesYahooVideos: SerpapiEndpoint<'engines.yahooVideos'>;
	enginesYandexSearch: SerpapiEndpoint<'engines.yandexSearch'>;
	enginesYandexImagesSearch: SerpapiEndpoint<'engines.yandexImagesSearch'>;
	enginesNaverSearch: SerpapiEndpoint<'engines.naverSearch'>;
	enginesBaiduSearch: SerpapiEndpoint<'engines.baiduSearch'>;
	enginesYoutubeSearch: SerpapiEndpoint<'engines.youtubeSearch'>;

	marketplaceEbaySearch: SerpapiEndpoint<'marketplace.ebaySearch'>;
	marketplaceWalmartSearch: SerpapiEndpoint<'marketplace.walmartSearch'>;
	marketplaceWalmartProductReviews: SerpapiEndpoint<'marketplace.walmartProductReviews'>;
	marketplaceAppleAppStoreSearch: SerpapiEndpoint<'marketplace.appleAppStoreSearch'>;
	marketplaceYelpSearch: SerpapiEndpoint<'marketplace.yelpSearch'>;
	marketplaceOpenTableReviews: SerpapiEndpoint<'marketplace.openTableReviews'>;
	marketplaceFacebookProfile: SerpapiEndpoint<'marketplace.facebookProfile'>;

	utilitiesLocationOptions: SerpapiEndpoint<'utilities.locationOptions'>;
	utilitiesSearchArchive: SerpapiEndpoint<'utilities.searchArchive'>;
	utilitiesDomainsList: SerpapiEndpoint<'utilities.domainsList'>;
};

const serpapiEndpointsNested = {
	search: {
		search: Search.search,
		imageSearch: Search.imageSearch,
		imagesLightSearch: Search.imagesLightSearch,
		videosLightSearch: Search.videosLightSearch,
		mapsSearch: Search.mapsSearch,
		mapsPosts: Search.mapsPosts,
		jobsSearch: Search.jobsSearch,
		playSearch: Search.playSearch,
		playProduct: Search.playProduct,
		scholarSearch: Search.scholarSearch,
		scholarAuthor: Search.scholarAuthor,
		scholarCite: Search.scholarCite,
		trendsSearch: Search.trendsSearch,
		financeSearch: Search.financeSearch,
		newsSearch: Search.newsSearch,
		shoppingSearch: Search.shoppingSearch,
		hotelSearch: Search.hotelSearch,
		hotelsAutocomplete: Search.hotelsAutocomplete,
		eventSearch: Search.eventSearch,
		localServicesSearch: Search.localServicesSearch,
		forumsSearch: Search.forumsSearch,
		lensSearch: Search.lensSearch,
		lightSearch: Search.lightSearch,
		aboutThisResult: Search.aboutThisResult,
		patentDetails: Search.patentDetails,
		imagesRelatedContent: Search.imagesRelatedContent,
	},
	engines: {
		bingSearch: Engines.bingSearch,
		bingMaps: Engines.bingMaps,
		duckDuckGoSearch: Engines.duckDuckGoSearch,
		duckDuckGoMaps: Engines.duckDuckGoMaps,
		duckDuckGoLightSearch: Engines.duckDuckGoLightSearch,
		yahooSearch: Engines.yahooSearch,
		yahooVideos: Engines.yahooVideos,
		yandexSearch: Engines.yandexSearch,
		yandexImagesSearch: Engines.yandexImagesSearch,
		naverSearch: Engines.naverSearch,
		baiduSearch: Engines.baiduSearch,
		youtubeSearch: Engines.youtubeSearch,
	},
	marketplace: {
		ebaySearch: Marketplace.ebaySearch,
		walmartSearch: Marketplace.walmartSearch,
		walmartProductReviews: Marketplace.walmartProductReviews,
		appleAppStoreSearch: Marketplace.appleAppStoreSearch,
		yelpSearch: Marketplace.yelpSearch,
		openTableReviews: Marketplace.openTableReviews,
		facebookProfile: Marketplace.facebookProfile,
	},
	utilities: {
		locationOptions: Utilities.locationOptions,
		searchArchive: Utilities.searchArchive,
		domainsList: Utilities.domainsList,
	},
} as const;

/** No webhook capability of any kind - the catalog lists 0 triggers and this is a synchronous request/response API. */
const serpapiWebhooksNested = {} as const;

export const serpapiEndpointSchemas = {
	'search.search': {
		input: SerpapiEndpointInputSchemas['search.search'],
		output: SerpapiEndpointOutputSchemas['search.search'],
	},
	'search.imageSearch': {
		input: SerpapiEndpointInputSchemas['search.imageSearch'],
		output: SerpapiEndpointOutputSchemas['search.imageSearch'],
	},
	'search.imagesLightSearch': {
		input: SerpapiEndpointInputSchemas['search.imagesLightSearch'],
		output: SerpapiEndpointOutputSchemas['search.imagesLightSearch'],
	},
	'search.videosLightSearch': {
		input: SerpapiEndpointInputSchemas['search.videosLightSearch'],
		output: SerpapiEndpointOutputSchemas['search.videosLightSearch'],
	},
	'search.mapsSearch': {
		input: SerpapiEndpointInputSchemas['search.mapsSearch'],
		output: SerpapiEndpointOutputSchemas['search.mapsSearch'],
	},
	'search.mapsPosts': {
		input: SerpapiEndpointInputSchemas['search.mapsPosts'],
		output: SerpapiEndpointOutputSchemas['search.mapsPosts'],
	},
	'search.jobsSearch': {
		input: SerpapiEndpointInputSchemas['search.jobsSearch'],
		output: SerpapiEndpointOutputSchemas['search.jobsSearch'],
	},
	'search.playSearch': {
		input: SerpapiEndpointInputSchemas['search.playSearch'],
		output: SerpapiEndpointOutputSchemas['search.playSearch'],
	},
	'search.playProduct': {
		input: SerpapiEndpointInputSchemas['search.playProduct'],
		output: SerpapiEndpointOutputSchemas['search.playProduct'],
	},
	'search.scholarSearch': {
		input: SerpapiEndpointInputSchemas['search.scholarSearch'],
		output: SerpapiEndpointOutputSchemas['search.scholarSearch'],
	},
	'search.scholarAuthor': {
		input: SerpapiEndpointInputSchemas['search.scholarAuthor'],
		output: SerpapiEndpointOutputSchemas['search.scholarAuthor'],
	},
	'search.scholarCite': {
		input: SerpapiEndpointInputSchemas['search.scholarCite'],
		output: SerpapiEndpointOutputSchemas['search.scholarCite'],
	},
	'search.trendsSearch': {
		input: SerpapiEndpointInputSchemas['search.trendsSearch'],
		output: SerpapiEndpointOutputSchemas['search.trendsSearch'],
	},
	'search.financeSearch': {
		input: SerpapiEndpointInputSchemas['search.financeSearch'],
		output: SerpapiEndpointOutputSchemas['search.financeSearch'],
	},
	'search.newsSearch': {
		input: SerpapiEndpointInputSchemas['search.newsSearch'],
		output: SerpapiEndpointOutputSchemas['search.newsSearch'],
	},
	'search.shoppingSearch': {
		input: SerpapiEndpointInputSchemas['search.shoppingSearch'],
		output: SerpapiEndpointOutputSchemas['search.shoppingSearch'],
	},
	'search.hotelSearch': {
		input: SerpapiEndpointInputSchemas['search.hotelSearch'],
		output: SerpapiEndpointOutputSchemas['search.hotelSearch'],
	},
	'search.hotelsAutocomplete': {
		input: SerpapiEndpointInputSchemas['search.hotelsAutocomplete'],
		output: SerpapiEndpointOutputSchemas['search.hotelsAutocomplete'],
	},
	'search.eventSearch': {
		input: SerpapiEndpointInputSchemas['search.eventSearch'],
		output: SerpapiEndpointOutputSchemas['search.eventSearch'],
	},
	'search.localServicesSearch': {
		input: SerpapiEndpointInputSchemas['search.localServicesSearch'],
		output: SerpapiEndpointOutputSchemas['search.localServicesSearch'],
	},
	'search.forumsSearch': {
		input: SerpapiEndpointInputSchemas['search.forumsSearch'],
		output: SerpapiEndpointOutputSchemas['search.forumsSearch'],
	},
	'search.lensSearch': {
		input: SerpapiEndpointInputSchemas['search.lensSearch'],
		output: SerpapiEndpointOutputSchemas['search.lensSearch'],
	},
	'search.lightSearch': {
		input: SerpapiEndpointInputSchemas['search.lightSearch'],
		output: SerpapiEndpointOutputSchemas['search.lightSearch'],
	},
	'search.aboutThisResult': {
		input: SerpapiEndpointInputSchemas['search.aboutThisResult'],
		output: SerpapiEndpointOutputSchemas['search.aboutThisResult'],
	},
	'search.patentDetails': {
		input: SerpapiEndpointInputSchemas['search.patentDetails'],
		output: SerpapiEndpointOutputSchemas['search.patentDetails'],
	},
	'search.imagesRelatedContent': {
		input: SerpapiEndpointInputSchemas['search.imagesRelatedContent'],
		output: SerpapiEndpointOutputSchemas['search.imagesRelatedContent'],
	},
	'engines.bingSearch': {
		input: SerpapiEndpointInputSchemas['engines.bingSearch'],
		output: SerpapiEndpointOutputSchemas['engines.bingSearch'],
	},
	'engines.bingMaps': {
		input: SerpapiEndpointInputSchemas['engines.bingMaps'],
		output: SerpapiEndpointOutputSchemas['engines.bingMaps'],
	},
	'engines.duckDuckGoSearch': {
		input: SerpapiEndpointInputSchemas['engines.duckDuckGoSearch'],
		output: SerpapiEndpointOutputSchemas['engines.duckDuckGoSearch'],
	},
	'engines.duckDuckGoMaps': {
		input: SerpapiEndpointInputSchemas['engines.duckDuckGoMaps'],
		output: SerpapiEndpointOutputSchemas['engines.duckDuckGoMaps'],
	},
	'engines.duckDuckGoLightSearch': {
		input: SerpapiEndpointInputSchemas['engines.duckDuckGoLightSearch'],
		output: SerpapiEndpointOutputSchemas['engines.duckDuckGoLightSearch'],
	},
	'engines.yahooSearch': {
		input: SerpapiEndpointInputSchemas['engines.yahooSearch'],
		output: SerpapiEndpointOutputSchemas['engines.yahooSearch'],
	},
	'engines.yahooVideos': {
		input: SerpapiEndpointInputSchemas['engines.yahooVideos'],
		output: SerpapiEndpointOutputSchemas['engines.yahooVideos'],
	},
	'engines.yandexSearch': {
		input: SerpapiEndpointInputSchemas['engines.yandexSearch'],
		output: SerpapiEndpointOutputSchemas['engines.yandexSearch'],
	},
	'engines.yandexImagesSearch': {
		input: SerpapiEndpointInputSchemas['engines.yandexImagesSearch'],
		output: SerpapiEndpointOutputSchemas['engines.yandexImagesSearch'],
	},
	'engines.naverSearch': {
		input: SerpapiEndpointInputSchemas['engines.naverSearch'],
		output: SerpapiEndpointOutputSchemas['engines.naverSearch'],
	},
	'engines.baiduSearch': {
		input: SerpapiEndpointInputSchemas['engines.baiduSearch'],
		output: SerpapiEndpointOutputSchemas['engines.baiduSearch'],
	},
	'engines.youtubeSearch': {
		input: SerpapiEndpointInputSchemas['engines.youtubeSearch'],
		output: SerpapiEndpointOutputSchemas['engines.youtubeSearch'],
	},
	'marketplace.ebaySearch': {
		input: SerpapiEndpointInputSchemas['marketplace.ebaySearch'],
		output: SerpapiEndpointOutputSchemas['marketplace.ebaySearch'],
	},
	'marketplace.walmartSearch': {
		input: SerpapiEndpointInputSchemas['marketplace.walmartSearch'],
		output: SerpapiEndpointOutputSchemas['marketplace.walmartSearch'],
	},
	'marketplace.walmartProductReviews': {
		input: SerpapiEndpointInputSchemas['marketplace.walmartProductReviews'],
		output: SerpapiEndpointOutputSchemas['marketplace.walmartProductReviews'],
	},
	'marketplace.appleAppStoreSearch': {
		input: SerpapiEndpointInputSchemas['marketplace.appleAppStoreSearch'],
		output: SerpapiEndpointOutputSchemas['marketplace.appleAppStoreSearch'],
	},
	'marketplace.yelpSearch': {
		input: SerpapiEndpointInputSchemas['marketplace.yelpSearch'],
		output: SerpapiEndpointOutputSchemas['marketplace.yelpSearch'],
	},
	'marketplace.openTableReviews': {
		input: SerpapiEndpointInputSchemas['marketplace.openTableReviews'],
		output: SerpapiEndpointOutputSchemas['marketplace.openTableReviews'],
	},
	'marketplace.facebookProfile': {
		input: SerpapiEndpointInputSchemas['marketplace.facebookProfile'],
		output: SerpapiEndpointOutputSchemas['marketplace.facebookProfile'],
	},
	'utilities.locationOptions': {
		input: SerpapiEndpointInputSchemas['utilities.locationOptions'],
		output: SerpapiEndpointOutputSchemas['utilities.locationOptions'],
	},
	'utilities.searchArchive': {
		input: SerpapiEndpointInputSchemas['utilities.searchArchive'],
		output: SerpapiEndpointOutputSchemas['utilities.searchArchive'],
	},
	'utilities.domainsList': {
		input: SerpapiEndpointInputSchemas['utilities.domainsList'],
		output: SerpapiEndpointOutputSchemas['utilities.domainsList'],
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof serpapiEndpointsNested
>;

const defaultAuthType: AuthTypes = 'api_key' as const;

/** Every operation in this catalog is a GET - a search or a lookup, nothing writes or deletes anything. */
const serpapiEndpointMeta = {
	'search.search': {
		riskLevel: 'read',
		description: 'Real-time Google search results',
	},
	'search.imageSearch': {
		riskLevel: 'read',
		description: 'Google Images search results',
	},
	'search.imagesLightSearch': {
		riskLevel: 'read',
		description: 'Fast, lightweight Google Images search',
	},
	'search.videosLightSearch': {
		riskLevel: 'read',
		description: 'Fast, lightweight Google Videos search',
	},
	'search.mapsSearch': {
		riskLevel: 'read',
		description: 'Google Maps search for places and businesses',
	},
	'search.mapsPosts': {
		riskLevel: 'read',
		description: 'Posts published by a business on its Google Maps listing',
	},
	'search.jobsSearch': {
		riskLevel: 'read',
		description: 'Google Jobs search results',
	},
	'search.playSearch': {
		riskLevel: 'read',
		description: 'Google Play Store search results',
	},
	'search.playProduct': {
		riskLevel: 'read',
		description: 'Details for a specific Google Play Store item',
	},
	'search.scholarSearch': {
		riskLevel: 'read',
		description: 'Google Scholar academic search results',
	},
	'search.scholarAuthor': {
		riskLevel: 'read',
		description: "A researcher's full Google Scholar author profile",
	},
	'search.scholarCite': {
		riskLevel: 'read',
		description: 'Formatted citations for a Google Scholar paper',
	},
	'search.trendsSearch': {
		riskLevel: 'read',
		description: 'Google Trends relative interest data',
	},
	'search.financeSearch': {
		riskLevel: 'read',
		description: 'Google Finance data for a company or ticker',
	},
	'search.newsSearch': {
		riskLevel: 'read',
		description: 'Google News article search results',
	},
	'search.shoppingSearch': {
		riskLevel: 'read',
		description: 'Google Shopping product listings',
	},
	'search.hotelSearch': {
		riskLevel: 'read',
		description: 'Google Hotels search results',
	},
	'search.hotelsAutocomplete': {
		riskLevel: 'read',
		description: 'Autocomplete suggestions for Google Hotels destinations',
	},
	'search.eventSearch': {
		riskLevel: 'read',
		description: 'Google Events search results',
	},
	'search.localServicesSearch': {
		riskLevel: 'read',
		description: "Google's guaranteed local service providers",
	},
	'search.forumsSearch': {
		riskLevel: 'read',
		description: 'Google Forums discussion search results',
	},
	'search.lensSearch': {
		riskLevel: 'read',
		description: 'Reverse image search via Google Lens',
	},
	'search.lightSearch': {
		riskLevel: 'read',
		description: 'Fast, lightweight Google Search results',
	},
	'search.aboutThisResult': {
		riskLevel: 'read',
		description: 'Google\'s "About this result" details for a URL',
	},
	'search.patentDetails': {
		riskLevel: 'read',
		description: 'Detailed information for a specific Google Patent',
	},
	'search.imagesRelatedContent': {
		riskLevel: 'read',
		description: 'Related content for a Google Images result',
	},

	'engines.bingSearch': {
		riskLevel: 'read',
		description: 'Bing search engine results',
	},
	'engines.bingMaps': {
		riskLevel: 'read',
		description: 'Bing Maps search for places and businesses',
	},
	'engines.duckDuckGoSearch': {
		riskLevel: 'read',
		description: 'DuckDuckGo search engine results',
	},
	'engines.duckDuckGoMaps': {
		riskLevel: 'read',
		description: 'DuckDuckGo Maps search for places and businesses',
	},
	'engines.duckDuckGoLightSearch': {
		riskLevel: 'read',
		description: 'Fast, lightweight DuckDuckGo search',
	},
	'engines.yahooSearch': {
		riskLevel: 'read',
		description: 'Yahoo! search engine results',
	},
	'engines.yahooVideos': {
		riskLevel: 'read',
		description: 'Yahoo! Videos search results',
	},
	'engines.yandexSearch': {
		riskLevel: 'read',
		description: 'Yandex search engine results',
	},
	'engines.yandexImagesSearch': {
		riskLevel: 'read',
		description: 'Yandex Images search results',
	},
	'engines.naverSearch': {
		riskLevel: 'read',
		description: "Naver (South Korea's leading search engine) results",
	},
	'engines.baiduSearch': {
		riskLevel: 'read',
		description: 'Baidu (Chinese search engine) results',
	},
	'engines.youtubeSearch': {
		riskLevel: 'read',
		description: 'YouTube video search results',
	},

	'marketplace.ebaySearch': {
		riskLevel: 'read',
		description: 'eBay product listing search results',
	},
	'marketplace.walmartSearch': {
		riskLevel: 'read',
		description: 'Walmart product listing search results',
	},
	'marketplace.walmartProductReviews': {
		riskLevel: 'read',
		description: 'Customer reviews for a Walmart product',
	},
	'marketplace.appleAppStoreSearch': {
		riskLevel: 'read',
		description: 'Apple App Store search results',
	},
	'marketplace.yelpSearch': {
		riskLevel: 'read',
		description: 'Yelp business search results',
	},
	'marketplace.openTableReviews': {
		riskLevel: 'read',
		description: 'Customer reviews for an OpenTable restaurant',
	},
	'marketplace.facebookProfile': {
		riskLevel: 'read',
		description: 'Public information from a Facebook profile or page',
	},

	'utilities.locationOptions': {
		riskLevel: 'read',
		description:
			"Valid location values for a Google search's location parameter",
	},
	'utilities.searchArchive': {
		riskLevel: 'read',
		description: 'Results from a previously run async search, by search id',
	},
	'utilities.domainsList': {
		riskLevel: 'read',
		description: 'The list of supported Google domains',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof serpapiEndpointsNested>;

export const serpapiAuthConfig = {
	api_key: {},
} as const satisfies PluginAuthConfig;

export type BaseSerpapiPlugin<T extends SerpapiPluginOptions> = CorsairPlugin<
	'serpapi',
	typeof SerpapiSchema,
	typeof serpapiEndpointsNested,
	typeof serpapiWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalSerpapiPlugin = BaseSerpapiPlugin<SerpapiPluginOptions>;

export type ExternalSerpapiPlugin<T extends SerpapiPluginOptions> =
	BaseSerpapiPlugin<T>;

export function serpapi<const T extends SerpapiPluginOptions>(
	incomingOptions: SerpapiPluginOptions & T = {} as SerpapiPluginOptions & T,
): ExternalSerpapiPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'serpapi',
		authConfig: serpapiAuthConfig,
		schema: SerpapiSchema,
		options: options,
		hooks: options.hooks,
		endpoints: serpapiEndpointsNested,
		webhooks: serpapiWebhooksNested,
		endpointMeta: serpapiEndpointMeta,
		endpointSchemas: serpapiEndpointSchemas,
		webhookSchemas: {},
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: SerpapiKeyBuilderContext) => {
			if (options.key) return options.key;
			const res = await ctx.keys.get_api_key();
			if (res) return res;
			throw new AuthMissingError('serpapi', 'api_key');
		},
	} satisfies InternalSerpapiPlugin;
}

export type {
	SerpapiEndpointInputs,
	SerpapiEndpointOutputs,
} from './endpoints/types';
