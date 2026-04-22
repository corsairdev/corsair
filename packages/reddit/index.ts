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
} from 'corsair/core';
import { Feeds, Listings, Posts, Search, Subreddits, Users } from './endpoints';
import type {
	RedditEndpointInputs,
	RedditEndpointOutputs,
} from './endpoints/types';
import {
	RedditEndpointInputSchemas,
	RedditEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { RedditSchema } from './schema';

export type RedditPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalRedditPlugin['hooks'];
	webhookHooks?: InternalRedditPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof redditEndpointsNested>;
};

export type RedditContext = CorsairPluginContext<
	typeof RedditSchema,
	RedditPluginOptions
>;

export type RedditKeyBuilderContext = KeyBuilderContext<RedditPluginOptions>;

type RedditEndpoint<
	K extends keyof RedditEndpointOutputs,
	Input,
> = CorsairEndpoint<RedditContext, Input, RedditEndpointOutputs[K]>;

export type RedditEndpoints = {
	// Subreddits
	subredditsGetHot: RedditEndpoint<
		'subredditsGetHot',
		RedditEndpointInputs['subredditsGetHot']
	>;
	subredditsGetNew: RedditEndpoint<
		'subredditsGetNew',
		RedditEndpointInputs['subredditsGetNew']
	>;
	subredditsGetTop: RedditEndpoint<
		'subredditsGetTop',
		RedditEndpointInputs['subredditsGetTop']
	>;
	subredditsGetRising: RedditEndpoint<
		'subredditsGetRising',
		RedditEndpointInputs['subredditsGetRising']
	>;
	subredditsGetControversial: RedditEndpoint<
		'subredditsGetControversial',
		RedditEndpointInputs['subredditsGetControversial']
	>;
	subredditsGetAbout: RedditEndpoint<
		'subredditsGetAbout',
		RedditEndpointInputs['subredditsGetAbout']
	>;
	// Posts & Comments
	postsGetComments: RedditEndpoint<
		'postsGetComments',
		RedditEndpointInputs['postsGetComments']
	>;
	postsGetById: RedditEndpoint<
		'postsGetById',
		RedditEndpointInputs['postsGetById']
	>;
	// Users
	usersGetAbout: RedditEndpoint<
		'usersGetAbout',
		RedditEndpointInputs['usersGetAbout']
	>;
	usersGetSubmitted: RedditEndpoint<
		'usersGetSubmitted',
		RedditEndpointInputs['usersGetSubmitted']
	>;
	usersGetComments: RedditEndpoint<
		'usersGetComments',
		RedditEndpointInputs['usersGetComments']
	>;
	usersGetOverview: RedditEndpoint<
		'usersGetOverview',
		RedditEndpointInputs['usersGetOverview']
	>;
	// Search
	searchGlobal: RedditEndpoint<
		'searchGlobal',
		RedditEndpointInputs['searchGlobal']
	>;
	searchSubreddit: RedditEndpoint<
		'searchSubreddit',
		RedditEndpointInputs['searchSubreddit']
	>;
	searchSubreddits: RedditEndpoint<
		'searchSubreddits',
		RedditEndpointInputs['searchSubreddits']
	>;
	// Feeds
	feedsGetAll: RedditEndpoint<
		'feedsGetAll',
		RedditEndpointInputs['feedsGetAll']
	>;
	feedsGetPopular: RedditEndpoint<
		'feedsGetPopular',
		RedditEndpointInputs['feedsGetPopular']
	>;
	// Listings
	listingsSubredditsPopular: RedditEndpoint<
		'listingsSubredditsPopular',
		RedditEndpointInputs['listingsSubredditsPopular']
	>;
	listingsSubredditsNew: RedditEndpoint<
		'listingsSubredditsNew',
		RedditEndpointInputs['listingsSubredditsNew']
	>;
};

export type RedditBoundEndpoints = BindEndpoints<typeof redditEndpointsNested>;

const redditEndpointsNested = {
	subreddits: {
		getHot: Subreddits.getHot,
		getNew: Subreddits.getNew,
		getTop: Subreddits.getTop,
		getRising: Subreddits.getRising,
		getControversial: Subreddits.getControversial,
		getAbout: Subreddits.getAbout,
	},
	posts: {
		getComments: Posts.getComments,
		getById: Posts.getById,
	},
	users: {
		getAbout: Users.getAbout,
		getSubmitted: Users.getSubmitted,
		getComments: Users.getComments,
		getOverview: Users.getOverview,
	},
	search: {
		global: Search.global,
		subreddit: Search.subreddit,
		subreddits: Search.subreddits,
	},
	feeds: {
		getAll: Feeds.getAll,
		getPopular: Feeds.getPopular,
	},
	listings: {
		subredditsPopular: Listings.subredditsPopular,
		subredditsNew: Listings.subredditsNew,
	},
} as const;

const redditWebhooksNested = {} as const;

export const redditEndpointSchemas = {
	// Subreddits
	'subreddits.getHot': {
		input: RedditEndpointInputSchemas.subredditsGetHot,
		output: RedditEndpointOutputSchemas.subredditsGetHot,
	},
	'subreddits.getNew': {
		input: RedditEndpointInputSchemas.subredditsGetNew,
		output: RedditEndpointOutputSchemas.subredditsGetNew,
	},
	'subreddits.getTop': {
		input: RedditEndpointInputSchemas.subredditsGetTop,
		output: RedditEndpointOutputSchemas.subredditsGetTop,
	},
	'subreddits.getRising': {
		input: RedditEndpointInputSchemas.subredditsGetRising,
		output: RedditEndpointOutputSchemas.subredditsGetRising,
	},
	'subreddits.getControversial': {
		input: RedditEndpointInputSchemas.subredditsGetControversial,
		output: RedditEndpointOutputSchemas.subredditsGetControversial,
	},
	'subreddits.getAbout': {
		input: RedditEndpointInputSchemas.subredditsGetAbout,
		output: RedditEndpointOutputSchemas.subredditsGetAbout,
	},
	// Posts
	'posts.getComments': {
		input: RedditEndpointInputSchemas.postsGetComments,
		output: RedditEndpointOutputSchemas.postsGetComments,
	},
	'posts.getById': {
		input: RedditEndpointInputSchemas.postsGetById,
		output: RedditEndpointOutputSchemas.postsGetById,
	},
	// Users
	'users.getAbout': {
		input: RedditEndpointInputSchemas.usersGetAbout,
		output: RedditEndpointOutputSchemas.usersGetAbout,
	},
	'users.getSubmitted': {
		input: RedditEndpointInputSchemas.usersGetSubmitted,
		output: RedditEndpointOutputSchemas.usersGetSubmitted,
	},
	'users.getComments': {
		input: RedditEndpointInputSchemas.usersGetComments,
		output: RedditEndpointOutputSchemas.usersGetComments,
	},
	'users.getOverview': {
		input: RedditEndpointInputSchemas.usersGetOverview,
		output: RedditEndpointOutputSchemas.usersGetOverview,
	},
	// Search
	'search.global': {
		input: RedditEndpointInputSchemas.searchGlobal,
		output: RedditEndpointOutputSchemas.searchGlobal,
	},
	'search.subreddit': {
		input: RedditEndpointInputSchemas.searchSubreddit,
		output: RedditEndpointOutputSchemas.searchSubreddit,
	},
	'search.subreddits': {
		input: RedditEndpointInputSchemas.searchSubreddits,
		output: RedditEndpointOutputSchemas.searchSubreddits,
	},
	// Feeds
	'feeds.getAll': {
		input: RedditEndpointInputSchemas.feedsGetAll,
		output: RedditEndpointOutputSchemas.feedsGetAll,
	},
	'feeds.getPopular': {
		input: RedditEndpointInputSchemas.feedsGetPopular,
		output: RedditEndpointOutputSchemas.feedsGetPopular,
	},
	// Listings
	'listings.subredditsPopular': {
		input: RedditEndpointInputSchemas.listingsSubredditsPopular,
		output: RedditEndpointOutputSchemas.listingsSubredditsPopular,
	},
	'listings.subredditsNew': {
		input: RedditEndpointInputSchemas.listingsSubredditsNew,
		output: RedditEndpointOutputSchemas.listingsSubredditsNew,
	},
} as const;

const defaultAuthType: AuthTypes = 'api_key' as const;

const redditEndpointMeta = {
	'subreddits.getHot': {
		riskLevel: 'read',
		description: 'Get hot posts from a subreddit',
	},
	'subreddits.getNew': {
		riskLevel: 'read',
		description: 'Get new posts from a subreddit',
	},
	'subreddits.getTop': {
		riskLevel: 'read',
		description: 'Get top posts from a subreddit with time filter',
	},
	'subreddits.getRising': {
		riskLevel: 'read',
		description: 'Get rising posts from a subreddit',
	},
	'subreddits.getControversial': {
		riskLevel: 'read',
		description: 'Get controversial posts from a subreddit',
	},
	'subreddits.getAbout': {
		riskLevel: 'read',
		description: 'Get subreddit metadata and info',
	},
	'posts.getComments': {
		riskLevel: 'read',
		description: 'Get a post and its comments',
	},
	'posts.getById': {
		riskLevel: 'read',
		description: 'Get posts by fullname IDs',
	},
	'users.getAbout': {
		riskLevel: 'read',
		description: 'Get user profile information',
	},
	'users.getSubmitted': {
		riskLevel: 'read',
		description: "Get a user's submitted posts",
	},
	'users.getComments': {
		riskLevel: 'read',
		description: "Get a user's comments",
	},
	'users.getOverview': {
		riskLevel: 'read',
		description: "Get a user's mixed posts and comments",
	},
	'search.global': {
		riskLevel: 'read',
		description: 'Search all of Reddit',
	},
	'search.subreddit': {
		riskLevel: 'read',
		description: 'Search within a subreddit',
	},
	'search.subreddits': {
		riskLevel: 'read',
		description: 'Search for subreddits by name',
	},
	'feeds.getAll': {
		riskLevel: 'read',
		description: 'Get posts from /r/all feed',
	},
	'feeds.getPopular': {
		riskLevel: 'read',
		description: 'Get posts from /r/popular feed',
	},
	'listings.subredditsPopular': {
		riskLevel: 'read',
		description: 'Get popular subreddit listings',
	},
	'listings.subredditsNew': {
		riskLevel: 'read',
		description: 'Get new subreddit listings',
	},
} satisfies RequiredPluginEndpointMeta<typeof redditEndpointsNested>;

export const redditAuthConfig = {
	api_key: {
		account: ['one'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseRedditPlugin<T extends RedditPluginOptions> = CorsairPlugin<
	'reddit',
	typeof RedditSchema,
	typeof redditEndpointsNested,
	typeof redditWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalRedditPlugin = BaseRedditPlugin<RedditPluginOptions>;

export type ExternalRedditPlugin<T extends RedditPluginOptions> =
	BaseRedditPlugin<T>;

export function reddit<const T extends RedditPluginOptions>(
	incomingOptions: RedditPluginOptions & T = {} as RedditPluginOptions & T,
): ExternalRedditPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'reddit',
		schema: RedditSchema,
		options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: redditEndpointsNested,
		webhooks: redditWebhooksNested,
		endpointMeta: redditEndpointMeta,
		endpointSchemas: redditEndpointSchemas,
		pluginWebhookMatcher: (_request) => false,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (_ctx: RedditKeyBuilderContext, _source) => {
			// not necessary since this is a public api
			return '';
		},
	} satisfies InternalRedditPlugin;
}

// ─────────────────────────────────────────────────────────────────────────────
// Endpoint Type Exports
// ─────────────────────────────────────────────────────────────────────────────

export type {
	CommentData,
	GetHotPostsResponse,
	GetPostCommentsResponse,
	PostData,
	RedditEndpointInputs,
	RedditEndpointOutputs,
	SubredditAboutData,
	UserAboutData,
} from './endpoints/types';
