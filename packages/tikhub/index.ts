import type {
	BindEndpoints,
	CorsairEndpoint,
	CorsairErrorHandler,
	CorsairPlugin,
	CorsairPluginContext,
	KeyBuilderContext,
	PickAuth,
	PluginPermissionsConfig,
	RequiredPluginEndpointMeta,
	RequiredPluginEndpointSchemas,
} from 'corsair/core';
import { AuthMissingError } from 'corsair/core';
import {
	createManagedPricingCredentialCache,
	resolveManagedPricingApiKey,
} from 'corsair/hub';
import {
	Account,
	Instagram,
	Reddit,
	TikTok,
	Twitter,
	YouTube,
} from './endpoints';
import type {
	TikHubEndpointInputs,
	TikHubEndpointOutputs,
} from './endpoints/types';
import {
	TikHubEndpointInputSchemas,
	TikHubEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { TikHubSchema } from './schema';

export type TikHubPluginOptions = {
	authType?: PickAuth<'api_key' | 'managed_pricing'>;
	key?: string;
	hooks?: InternalTikHubPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof tikhubEndpointsNested>;
};

export type TikHubContext = CorsairPluginContext<
	typeof TikHubSchema,
	TikHubPluginOptions
>;

export type TikHubKeyBuilderContext = KeyBuilderContext<TikHubPluginOptions>;

export type TikHubBoundEndpoints = BindEndpoints<typeof tikhubEndpointsNested>;

type TikHubEndpoint<K extends keyof TikHubEndpointOutputs> = CorsairEndpoint<
	TikHubContext,
	TikHubEndpointInputs[K],
	TikHubEndpointOutputs[K]
>;

export type TikHubEndpoints = {
	tiktokSearchVideos: TikHubEndpoint<'tiktokSearchVideos'>;
	tiktokGetUserProfile: TikHubEndpoint<'tiktokGetUserProfile'>;
	tiktokGetVideo: TikHubEndpoint<'tiktokGetVideo'>;
	tiktokGetUserVideos: TikHubEndpoint<'tiktokGetUserVideos'>;
	tiktokGetVideoComments: TikHubEndpoint<'tiktokGetVideoComments'>;
	tiktokGetHashtag: TikHubEndpoint<'tiktokGetHashtag'>;
	tiktokGetHashtagVideos: TikHubEndpoint<'tiktokGetHashtagVideos'>;
	instagramGetUserByUsername: TikHubEndpoint<'instagramGetUserByUsername'>;
	instagramGetUserPosts: TikHubEndpoint<'instagramGetUserPosts'>;
	instagramGetUserReels: TikHubEndpoint<'instagramGetUserReels'>;
	instagramGetPostByUrl: TikHubEndpoint<'instagramGetPostByUrl'>;
	instagramGetPostComments: TikHubEndpoint<'instagramGetPostComments'>;
	youtubeGetVideo: TikHubEndpoint<'youtubeGetVideo'>;
	youtubeSearch: TikHubEndpoint<'youtubeSearch'>;
	youtubeGetChannelVideos: TikHubEndpoint<'youtubeGetChannelVideos'>;
	twitterGetUserProfile: TikHubEndpoint<'twitterGetUserProfile'>;
	twitterGetUserTweets: TikHubEndpoint<'twitterGetUserTweets'>;
	twitterSearchTweets: TikHubEndpoint<'twitterSearchTweets'>;
	twitterGetTweet: TikHubEndpoint<'twitterGetTweet'>;
	redditSearch: TikHubEndpoint<'redditSearch'>;
	accountGetInfo: TikHubEndpoint<'accountGetInfo'>;
};

const tikhubEndpointsNested = {
	tiktok: {
		searchVideos: TikTok.searchVideos,
		getUserProfile: TikTok.getUserProfile,
		getVideo: TikTok.getVideo,
		getUserVideos: TikTok.getUserVideos,
		getVideoComments: TikTok.getVideoComments,
		getHashtag: TikTok.getHashtag,
		getHashtagVideos: TikTok.getHashtagVideos,
	},
	instagram: {
		getUserByUsername: Instagram.getUserByUsername,
		getUserPosts: Instagram.getUserPosts,
		getUserReels: Instagram.getUserReels,
		getPostByUrl: Instagram.getPostByUrl,
		getPostComments: Instagram.getPostComments,
	},
	youtube: {
		getVideo: YouTube.getVideo,
		search: YouTube.search,
		getChannelVideos: YouTube.getChannelVideos,
	},
	twitter: {
		getUserProfile: Twitter.getUserProfile,
		getUserTweets: Twitter.getUserTweets,
		searchTweets: Twitter.searchTweets,
		getTweet: Twitter.getTweet,
	},
	reddit: {
		search: Reddit.search,
	},
	account: {
		getInfo: Account.getInfo,
	},
} as const;

export const tikhubEndpointSchemas = {
	'tiktok.searchVideos': {
		input: TikHubEndpointInputSchemas.tiktokSearchVideos,
		output: TikHubEndpointOutputSchemas.tiktokSearchVideos,
	},
	'tiktok.getUserProfile': {
		input: TikHubEndpointInputSchemas.tiktokGetUserProfile,
		output: TikHubEndpointOutputSchemas.tiktokGetUserProfile,
	},
	'tiktok.getVideo': {
		input: TikHubEndpointInputSchemas.tiktokGetVideo,
		output: TikHubEndpointOutputSchemas.tiktokGetVideo,
	},
	'tiktok.getUserVideos': {
		input: TikHubEndpointInputSchemas.tiktokGetUserVideos,
		output: TikHubEndpointOutputSchemas.tiktokGetUserVideos,
	},
	'tiktok.getVideoComments': {
		input: TikHubEndpointInputSchemas.tiktokGetVideoComments,
		output: TikHubEndpointOutputSchemas.tiktokGetVideoComments,
	},
	'tiktok.getHashtag': {
		input: TikHubEndpointInputSchemas.tiktokGetHashtag,
		output: TikHubEndpointOutputSchemas.tiktokGetHashtag,
	},
	'tiktok.getHashtagVideos': {
		input: TikHubEndpointInputSchemas.tiktokGetHashtagVideos,
		output: TikHubEndpointOutputSchemas.tiktokGetHashtagVideos,
	},
	'instagram.getUserByUsername': {
		input: TikHubEndpointInputSchemas.instagramGetUserByUsername,
		output: TikHubEndpointOutputSchemas.instagramGetUserByUsername,
	},
	'instagram.getUserPosts': {
		input: TikHubEndpointInputSchemas.instagramGetUserPosts,
		output: TikHubEndpointOutputSchemas.instagramGetUserPosts,
	},
	'instagram.getUserReels': {
		input: TikHubEndpointInputSchemas.instagramGetUserReels,
		output: TikHubEndpointOutputSchemas.instagramGetUserReels,
	},
	'instagram.getPostByUrl': {
		input: TikHubEndpointInputSchemas.instagramGetPostByUrl,
		output: TikHubEndpointOutputSchemas.instagramGetPostByUrl,
	},
	'instagram.getPostComments': {
		input: TikHubEndpointInputSchemas.instagramGetPostComments,
		output: TikHubEndpointOutputSchemas.instagramGetPostComments,
	},
	'youtube.getVideo': {
		input: TikHubEndpointInputSchemas.youtubeGetVideo,
		output: TikHubEndpointOutputSchemas.youtubeGetVideo,
	},
	'youtube.search': {
		input: TikHubEndpointInputSchemas.youtubeSearch,
		output: TikHubEndpointOutputSchemas.youtubeSearch,
	},
	'youtube.getChannelVideos': {
		input: TikHubEndpointInputSchemas.youtubeGetChannelVideos,
		output: TikHubEndpointOutputSchemas.youtubeGetChannelVideos,
	},
	'twitter.getUserProfile': {
		input: TikHubEndpointInputSchemas.twitterGetUserProfile,
		output: TikHubEndpointOutputSchemas.twitterGetUserProfile,
	},
	'twitter.getUserTweets': {
		input: TikHubEndpointInputSchemas.twitterGetUserTweets,
		output: TikHubEndpointOutputSchemas.twitterGetUserTweets,
	},
	'twitter.searchTweets': {
		input: TikHubEndpointInputSchemas.twitterSearchTweets,
		output: TikHubEndpointOutputSchemas.twitterSearchTweets,
	},
	'twitter.getTweet': {
		input: TikHubEndpointInputSchemas.twitterGetTweet,
		output: TikHubEndpointOutputSchemas.twitterGetTweet,
	},
	'reddit.search': {
		input: TikHubEndpointInputSchemas.redditSearch,
		output: TikHubEndpointOutputSchemas.redditSearch,
	},
	'account.getInfo': {
		input: TikHubEndpointInputSchemas.accountGetInfo,
		output: TikHubEndpointOutputSchemas.accountGetInfo,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof tikhubEndpointsNested
>;

const defaultAuthType = 'api_key' as const;

const tikhubManagedPricingCache = createManagedPricingCredentialCache();

const tikhubEndpointMeta = {
	'tiktok.searchVideos': {
		riskLevel: 'read',
		description:
			'Search TikTok videos by keyword, with sort, publish-date and region filters',
	},
	'tiktok.getUserProfile': {
		riskLevel: 'read',
		description:
			'Get a TikTok profile and follower, like and video counts by username or secUid',
	},
	'tiktok.getVideo': {
		riskLevel: 'read',
		description:
			'Get one TikTok video with its author, stats, music and media URLs',
	},
	'tiktok.getUserVideos': {
		riskLevel: 'read',
		description:
			"List a TikTok user's posted videos, newest or most popular first",
	},
	'tiktok.getVideoComments': {
		riskLevel: 'read',
		description: 'List comments on a TikTok video',
	},
	'tiktok.getHashtag': {
		riskLevel: 'read',
		description:
			'Get a TikTok hashtag by name, including its ID and video and view counts',
	},
	'tiktok.getHashtagVideos': {
		riskLevel: 'read',
		description: 'List videos under a TikTok hashtag ID',
	},
	'instagram.getUserByUsername': {
		riskLevel: 'read',
		description:
			'Get an Instagram profile (bio, follower and following counts, recent posts) by username',
	},
	'instagram.getUserPosts': {
		riskLevel: 'read',
		description: "List an Instagram user's posts by user ID",
	},
	'instagram.getUserReels': {
		riskLevel: 'read',
		description: "List an Instagram user's reels by user ID",
	},
	'instagram.getPostByUrl': {
		riskLevel: 'read',
		description:
			'Get an Instagram post or reel with its media, likes and comments count from its URL',
	},
	'instagram.getPostComments': {
		riskLevel: 'read',
		description: 'List comments on an Instagram post, recent or popular first',
	},
	'youtube.getVideo': {
		riskLevel: 'read',
		description:
			'Get a YouTube video with its channel, duration, view, like and comment counts',
	},
	'youtube.search': {
		riskLevel: 'read',
		description:
			'Search YouTube videos, Shorts, channels and playlists with date, type, duration and sort filters',
	},
	'youtube.getChannelVideos': {
		riskLevel: 'read',
		description:
			"List a YouTube channel's videos, with channel details on the first page",
	},
	'twitter.getUserProfile': {
		riskLevel: 'read',
		description: 'Get an X (Twitter) profile by handle or numeric user ID',
	},
	'twitter.getUserTweets': {
		riskLevel: 'read',
		description: "List an X (Twitter) user's posts",
	},
	'twitter.searchTweets': {
		riskLevel: 'read',
		description:
			'Search X (Twitter) posts, people or lists (Top, Latest, Media, People, Lists)',
	},
	'twitter.getTweet': {
		riskLevel: 'read',
		description: 'Get one X (Twitter) post by ID',
	},
	'reddit.search': {
		riskLevel: 'read',
		description:
			'Search Reddit posts, communities, comments, media or users, with sort and time filters',
	},
	'account.getInfo': {
		riskLevel: 'read',
		description:
			'Get the TikHub account balance, free credit and API key status',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof tikhubEndpointsNested>;

export type BaseTikHubPlugin<T extends TikHubPluginOptions> = CorsairPlugin<
	'tikhub',
	typeof TikHubSchema,
	typeof tikhubEndpointsNested,
	{},
	T,
	typeof defaultAuthType
>;

export type InternalTikHubPlugin = BaseTikHubPlugin<TikHubPluginOptions>;

export type ExternalTikHubPlugin<T extends TikHubPluginOptions> =
	BaseTikHubPlugin<T>;

// Handlers match in key order and DEFAULT matches everything, so it stays
// last even when the caller adds or overrides handlers.
function mergeErrorHandlers(
	builtin: CorsairErrorHandler,
	user: CorsairErrorHandler | undefined,
): CorsairErrorHandler {
	if (!user) return builtin;
	const { DEFAULT: builtinDefault, ...builtinRest } = builtin;
	const { DEFAULT: userDefault, ...userRest } = user;
	const fallback = userDefault ?? builtinDefault;
	return fallback
		? { ...builtinRest, ...userRest, DEFAULT: fallback }
		: { ...builtinRest, ...userRest };
}

export function tikhub<const T extends TikHubPluginOptions>(
	incomingOptions: TikHubPluginOptions & T = {} as TikHubPluginOptions & T,
): ExternalTikHubPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'tikhub',
		schema: TikHubSchema,
		options: options,
		hooks: options.hooks,
		endpoints: tikhubEndpointsNested,
		webhooks: {},
		endpointMeta: tikhubEndpointMeta,
		endpointSchemas: tikhubEndpointSchemas,
		pluginWebhookMatcher: () => false,
		errorHandlers: mergeErrorHandlers(errorHandlers, options.errorHandlers),
		keyBuilder: async (ctx: TikHubKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (res) return res;
			}

			if (source === 'endpoint' && ctx.authType === 'managed_pricing') {
				return resolveManagedPricingApiKey(ctx, {
					plugin: 'tikhub',
					cache: tikhubManagedPricingCache,
					operation: ctx.meteredOperationId,
				});
			}

			throw new AuthMissingError('tikhub', ctx.authType ?? 'api_key');
		},
	} satisfies InternalTikHubPlugin;
}

export { TikHubAPIError } from './client';
export type {
	AccountGetInfoInput,
	AccountGetInfoResponse,
	InstagramComment,
	InstagramGetPostByUrlInput,
	InstagramGetPostByUrlResponse,
	InstagramGetPostCommentsInput,
	InstagramGetPostCommentsResponse,
	InstagramGetUserByUsernameInput,
	InstagramGetUserByUsernameResponse,
	InstagramGetUserPostsInput,
	InstagramGetUserPostsResponse,
	InstagramGetUserReelsInput,
	InstagramGetUserReelsResponse,
	InstagramMedia,
	InstagramUser,
	RedditSearchInput,
	RedditSearchResponse,
	TikHubEndpointInputs,
	TikHubEndpointOutputs,
	TikTokAppUser,
	TikTokComment,
	TikTokGetHashtagInput,
	TikTokGetHashtagResponse,
	TikTokGetHashtagVideosInput,
	TikTokGetHashtagVideosResponse,
	TikTokGetUserProfileInput,
	TikTokGetUserProfileResponse,
	TikTokGetUserVideosInput,
	TikTokGetUserVideosResponse,
	TikTokGetVideoCommentsInput,
	TikTokGetVideoCommentsResponse,
	TikTokGetVideoInput,
	TikTokGetVideoResponse,
	TikTokSearchVideosInput,
	TikTokSearchVideosResponse,
	TikTokVideo,
	TikTokWebUser,
	TwitterGetTweetInput,
	TwitterGetTweetResponse,
	TwitterGetUserProfileInput,
	TwitterGetUserProfileResponse,
	TwitterGetUserTweetsInput,
	TwitterGetUserTweetsResponse,
	TwitterSearchTweetsInput,
	TwitterSearchTweetsResponse,
	YouTubeGetChannelVideosInput,
	YouTubeGetChannelVideosResponse,
	YouTubeGetVideoInput,
	YouTubeGetVideoResponse,
	YouTubeSearchInput,
	YouTubeSearchResponse,
} from './endpoints/types';
