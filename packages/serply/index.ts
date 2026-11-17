import type {
	AuthTypes,
	CorsairErrorHandler,
	CorsairPlugin,
	KeyBuilderContext,
	PickAuth,
	PluginAuthConfig,
	PluginPermissionsConfig,
	RequiredPluginEndpointMeta,
	RequiredPluginEndpointSchemas,
} from 'corsair/core';
import { AuthMissingError } from 'corsair/core';
import type { SerplyContext } from './context';
import {
	bingSearch,
	ebaySearch,
	jobSearch,
	newsSearch,
	pageFetch,
	productSearch,
	redditComments,
	redditPost,
	redditSubredditAbout,
	redditSubredditPosts,
	redditUserPosts,
	searchArticles,
	searchImages,
	searchPlaces,
	videoSearch,
	webSearch,
} from './endpoints';
import {
	ArticleResponseSchema,
	BingSearchOutputSchema,
	EbaySearchOutputSchema,
	ImageInputSchema,
	ImageResponseSchema,
	JobSearchOutputSchema,
	NewsSearchInputSchema,
	NewsSearchOutputSchema,
	PageFetchInputSchema,
	PageFetchOutputSchema,
	PlaceResponseSchema,
	ProductSearchOutputSchema,
	QueryInputSchema,
	RedditCommentsInputSchema,
	RedditCommentsOutputSchema,
	RedditListingOutputSchema,
	RedditObjectOutputSchema,
	RedditPostInputSchema,
	RedditUserInputSchema,
	SimpleSearchInputSchema,
	SubredditAboutInputSchema,
	SubredditPostsInputSchema,
	VideoSearchOutputSchema,
	WebSearchInputSchema,
	WebSearchOutputSchema,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { SerplySchema } from './schema';

export type { SerplyContext };

export type SerplyPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalSerplyPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof serplyEndpointsNested>;
};

export type SerplyKeyBuilderContext = KeyBuilderContext<SerplyPluginOptions>;

const serplyEndpointsNested = {
	images: { search: searchImages },
	places: { search: searchPlaces },
	articles: { search: searchArticles },
	web: { search: webSearch },
	bing: { search: bingSearch },
	news: { search: newsSearch },
	videos: { search: videoSearch },
	jobs: { search: jobSearch },
	products: { search: productSearch },
	ebay: { search: ebaySearch },
	reddit: {
		subredditPosts: redditSubredditPosts,
		subredditAbout: redditSubredditAbout,
		userPosts: redditUserPosts,
		post: redditPost,
		comments: redditComments,
	},
	pages: { fetch: pageFetch },
} as const;

const serplyWebhooksNested = {} as const;

export const serplyEndpointSchemas = {
	'images.search': { input: ImageInputSchema, output: ImageResponseSchema },
	'places.search': { input: QueryInputSchema, output: PlaceResponseSchema },
	'articles.search': { input: QueryInputSchema, output: ArticleResponseSchema },
	'web.search': { input: WebSearchInputSchema, output: WebSearchOutputSchema },
	'bing.search': {
		input: SimpleSearchInputSchema,
		output: BingSearchOutputSchema,
	},
	'news.search': {
		input: NewsSearchInputSchema,
		output: NewsSearchOutputSchema,
	},
	'videos.search': {
		input: SimpleSearchInputSchema,
		output: VideoSearchOutputSchema,
	},
	'jobs.search': {
		input: SimpleSearchInputSchema,
		output: JobSearchOutputSchema,
	},
	'products.search': {
		input: SimpleSearchInputSchema,
		output: ProductSearchOutputSchema,
	},
	'ebay.search': {
		input: SimpleSearchInputSchema,
		output: EbaySearchOutputSchema,
	},
	'reddit.subredditPosts': {
		input: SubredditPostsInputSchema,
		output: RedditListingOutputSchema,
	},
	'reddit.subredditAbout': {
		input: SubredditAboutInputSchema,
		output: RedditObjectOutputSchema,
	},
	'reddit.userPosts': {
		input: RedditUserInputSchema,
		output: RedditListingOutputSchema,
	},
	'reddit.post': {
		input: RedditPostInputSchema,
		output: RedditObjectOutputSchema,
	},
	'reddit.comments': {
		input: RedditCommentsInputSchema,
		output: RedditCommentsOutputSchema,
	},
	'pages.fetch': { input: PageFetchInputSchema, output: PageFetchOutputSchema },
} as const satisfies RequiredPluginEndpointSchemas<
	typeof serplyEndpointsNested
>;

const serplyEndpointMeta = {
	'images.search': {
		riskLevel: 'read',
		description:
			'Search Google Images (up to 20 per call) and store the results. Each uncached call spends Serply credits.',
	},
	'places.search': {
		riskLevel: 'read',
		description:
			'Search Google Maps places and store them. Each uncached call spends Serply credits.',
	},
	'articles.search': {
		riskLevel: 'read',
		description:
			'Search Google Scholar articles and store them. Each uncached call spends Serply credits.',
	},
	'web.search': {
		riskLevel: 'read',
		description:
			'Search Google: organic results, ads, AI overview and related questions. Each uncached call spends Serply credits.',
	},
	'bing.search': {
		riskLevel: 'read',
		description: 'Search Bing. Each uncached call spends Serply credits.',
	},
	'news.search': {
		riskLevel: 'read',
		description:
			'Search Google News, optionally resolving links to the publisher URL. Each uncached call spends Serply credits.',
	},
	'videos.search': {
		riskLevel: 'read',
		description:
			'Search Google Videos. Each uncached call spends Serply credits.',
	},
	'jobs.search': {
		riskLevel: 'read',
		description:
			'Search Google Jobs by title and location. Each uncached call spends Serply credits.',
	},
	'products.search': {
		riskLevel: 'read',
		description:
			'Search products with prices, ratings and links. Each uncached call spends Serply credits.',
	},
	'ebay.search': {
		riskLevel: 'read',
		description:
			'Search eBay listings with price, condition and seller. Each uncached call spends Serply credits.',
	},
	'reddit.subredditPosts': {
		riskLevel: 'read',
		description:
			'List posts in a subreddit, sorted and paged. Each uncached call spends Serply credits.',
	},
	'reddit.subredditAbout': {
		riskLevel: 'read',
		description:
			'Get a subreddit description and subscriber count. Each uncached call spends Serply credits.',
	},
	'reddit.userPosts': {
		riskLevel: 'read',
		description:
			'List a Reddit user public posts and comments. Each uncached call spends Serply credits.',
	},
	'reddit.post': {
		riskLevel: 'read',
		description:
			'Get one Reddit post, optionally with its comments. Each uncached call spends Serply credits.',
	},
	'reddit.comments': {
		riskLevel: 'read',
		description:
			'Get the comment thread of a Reddit post. Each uncached call spends Serply credits.',
	},
	'pages.fetch': {
		riskLevel: 'read',
		description:
			'Fetch a web page through Serply as markdown or HTML. Each uncached call spends Serply credits.',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof serplyEndpointsNested>;

const defaultAuthType = 'api_key' as const satisfies AuthTypes;

export const serplyAuthConfig = {
	api_key: { account: [] as const },
} as const satisfies PluginAuthConfig;

export type BaseSerplyPlugin<T extends SerplyPluginOptions> = CorsairPlugin<
	'serply',
	typeof SerplySchema,
	typeof serplyEndpointsNested,
	typeof serplyWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalSerplyPlugin = BaseSerplyPlugin<SerplyPluginOptions>;
export type ExternalSerplyPlugin<T extends SerplyPluginOptions> =
	BaseSerplyPlugin<T>;

export function serply<const T extends SerplyPluginOptions>(
	incomingOptions: SerplyPluginOptions & T = {} as SerplyPluginOptions & T,
): ExternalSerplyPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'serply',
		authConfig: serplyAuthConfig,
		schema: SerplySchema,
		options,
		hooks: options.hooks,
		endpoints: serplyEndpointsNested,
		webhooks: serplyWebhooksNested,
		endpointMeta: serplyEndpointMeta,
		endpointSchemas: serplyEndpointSchemas,
		errorHandlers: { ...errorHandlers, ...options.errorHandlers },
		keyBuilder: async (ctx: SerplyKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) return options.key;
			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const key = await ctx.keys.get_api_key();
				if (key) return key;
			}
			throw new AuthMissingError('serply', 'api_key');
		},
	} satisfies InternalSerplyPlugin;
}
