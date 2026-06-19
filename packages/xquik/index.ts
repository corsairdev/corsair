import type {
	AuthTypes,
	BindEndpoints,
	BindWebhooks,
	CorsairEndpoint,
	CorsairErrorHandler,
	CorsairPlugin,
	CorsairPluginContext,
	CorsairWebhook,
	KeyBuilderContext,
	PickAuth,
	PluginAuthConfig,
	PluginPermissionsConfig,
	RequiredPluginEndpointMeta,
	RequiredPluginEndpointSchemas,
	RequiredPluginWebhookSchemas,
} from 'corsair/core';
import { AuthMissingError } from 'corsair/core';
import {
	Media,
	Trends,
	Tweets,
	Users,
	Webhooks,
	WriteActions,
} from './endpoints';
import type {
	XquikEndpointInputs,
	XquikEndpointOutputs,
} from './endpoints/types';
import {
	EventPayloadSchema,
	XquikEndpointInputSchemas,
	XquikEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { XquikSchema } from './schema';
import { EventWebhooks } from './webhooks';
import type {
	XquikWebhookOutputs,
	XquikWebhookPayload,
} from './webhooks/types';
import { hasXquikSignature } from './webhooks/types';
import { matchXquikTenantWebhook } from './webhooks/tenant-matcher';

export type XquikPluginOptions = {
	authType?: PickAuth<'api_key'>;
	baseUrl?: string;
	errorHandlers?: CorsairErrorHandler;
	hooks?: InternalXquikPlugin['hooks'];
	key?: string;
	permissions?: PluginPermissionsConfig<typeof xquikEndpointsNested>;
	webhookHooks?: InternalXquikPlugin['webhookHooks'];
	webhookSecret?: string;
};

export type XquikContext = CorsairPluginContext<
	typeof XquikSchema,
	XquikPluginOptions
>;

export type XquikBoundEndpoints = BindEndpoints<typeof xquikEndpointsNested>;

type XquikEndpoint<K extends keyof XquikEndpointOutputs> = CorsairEndpoint<
	XquikContext,
	XquikEndpointInputs[K],
	XquikEndpointOutputs[K]
>;

export type XquikEndpoints = {
	mediaDownload: XquikEndpoint<'mediaDownload'>;
	mediaUploadFromUrl: XquikEndpoint<'mediaUploadFromUrl'>;
	trendsGet: XquikEndpoint<'trendsGet'>;
	tweetsBatch: XquikEndpoint<'tweetsBatch'>;
	tweetsCreate: XquikEndpoint<'tweetsCreate'>;
	tweetsDelete: XquikEndpoint<'tweetsDelete'>;
	tweetsGet: XquikEndpoint<'tweetsGet'>;
	tweetsLike: XquikEndpoint<'tweetsLike'>;
	tweetsRetweet: XquikEndpoint<'tweetsRetweet'>;
	tweetsSearch: XquikEndpoint<'tweetsSearch'>;
	tweetsUnlike: XquikEndpoint<'tweetsUnlike'>;
	usersBatch: XquikEndpoint<'usersBatch'>;
	usersFollow: XquikEndpoint<'usersFollow'>;
	usersFollowers: XquikEndpoint<'usersFollowers'>;
	usersFollowing: XquikEndpoint<'usersFollowing'>;
	usersGet: XquikEndpoint<'usersGet'>;
	usersSearch: XquikEndpoint<'usersSearch'>;
	usersTweets: XquikEndpoint<'usersTweets'>;
	usersUnfollow: XquikEndpoint<'usersUnfollow'>;
	webhooksCreate: XquikEndpoint<'webhooksCreate'>;
	webhooksDeactivate: XquikEndpoint<'webhooksDeactivate'>;
	webhooksDeliveries: XquikEndpoint<'webhooksDeliveries'>;
	webhooksList: XquikEndpoint<'webhooksList'>;
	webhooksTest: XquikEndpoint<'webhooksTest'>;
	webhooksUpdate: XquikEndpoint<'webhooksUpdate'>;
	writeActionsGet: XquikEndpoint<'writeActionsGet'>;
};

type XquikWebhook<K extends keyof XquikWebhookOutputs, TEvent> = CorsairWebhook<
	XquikContext,
	TEvent,
	XquikWebhookOutputs[K]
>;

export type XquikWebhooks = {
	monitorEvent: XquikWebhook<'monitorEvent', XquikWebhookPayload>;
	test: XquikWebhook<'test', XquikWebhookPayload>;
};

export type XquikBoundWebhooks = BindWebhooks<XquikWebhooks>;

const xquikEndpointsNested = {
	media: {
		download: Media.download,
		uploadFromUrl: Media.uploadFromUrl,
	},
	trends: {
		get: Trends.get,
	},
	tweets: {
		batch: Tweets.batch,
		create: Tweets.create,
		delete: Tweets.deleteTweet,
		get: Tweets.get,
		like: Tweets.like,
		retweet: Tweets.retweet,
		search: Tweets.search,
		unlike: Tweets.unlike,
	},
	users: {
		batch: Users.batch,
		follow: Users.follow,
		followers: Users.followers,
		following: Users.following,
		get: Users.get,
		search: Users.search,
		tweets: Users.tweets,
		unfollow: Users.unfollow,
	},
	webhooks: {
		create: Webhooks.create,
		deactivate: Webhooks.deactivate,
		deliveries: Webhooks.deliveries,
		list: Webhooks.list,
		test: Webhooks.test,
		update: Webhooks.update,
	},
	writeActions: {
		get: WriteActions.get,
	},
} as const;

const xquikWebhooksNested = {
	events: {
		monitor: EventWebhooks.monitorEvent,
		test: EventWebhooks.test,
	},
} as const;

export const xquikEndpointSchemas = {
	'media.download': {
		input: XquikEndpointInputSchemas.mediaDownload,
		output: XquikEndpointOutputSchemas.mediaDownload,
	},
	'media.uploadFromUrl': {
		input: XquikEndpointInputSchemas.mediaUploadFromUrl,
		output: XquikEndpointOutputSchemas.mediaUploadFromUrl,
	},
	'trends.get': {
		input: XquikEndpointInputSchemas.trendsGet,
		output: XquikEndpointOutputSchemas.trendsGet,
	},
	'tweets.batch': {
		input: XquikEndpointInputSchemas.tweetsBatch,
		output: XquikEndpointOutputSchemas.tweetsBatch,
	},
	'tweets.create': {
		input: XquikEndpointInputSchemas.tweetsCreate,
		output: XquikEndpointOutputSchemas.tweetsCreate,
	},
	'tweets.delete': {
		input: XquikEndpointInputSchemas.tweetsDelete,
		output: XquikEndpointOutputSchemas.tweetsDelete,
	},
	'tweets.get': {
		input: XquikEndpointInputSchemas.tweetsGet,
		output: XquikEndpointOutputSchemas.tweetsGet,
	},
	'tweets.like': {
		input: XquikEndpointInputSchemas.tweetsLike,
		output: XquikEndpointOutputSchemas.tweetsLike,
	},
	'tweets.retweet': {
		input: XquikEndpointInputSchemas.tweetsRetweet,
		output: XquikEndpointOutputSchemas.tweetsRetweet,
	},
	'tweets.search': {
		input: XquikEndpointInputSchemas.tweetsSearch,
		output: XquikEndpointOutputSchemas.tweetsSearch,
	},
	'tweets.unlike': {
		input: XquikEndpointInputSchemas.tweetsUnlike,
		output: XquikEndpointOutputSchemas.tweetsUnlike,
	},
	'users.batch': {
		input: XquikEndpointInputSchemas.usersBatch,
		output: XquikEndpointOutputSchemas.usersBatch,
	},
	'users.follow': {
		input: XquikEndpointInputSchemas.usersFollow,
		output: XquikEndpointOutputSchemas.usersFollow,
	},
	'users.followers': {
		input: XquikEndpointInputSchemas.usersFollowers,
		output: XquikEndpointOutputSchemas.usersFollowers,
	},
	'users.following': {
		input: XquikEndpointInputSchemas.usersFollowing,
		output: XquikEndpointOutputSchemas.usersFollowing,
	},
	'users.get': {
		input: XquikEndpointInputSchemas.usersGet,
		output: XquikEndpointOutputSchemas.usersGet,
	},
	'users.search': {
		input: XquikEndpointInputSchemas.usersSearch,
		output: XquikEndpointOutputSchemas.usersSearch,
	},
	'users.tweets': {
		input: XquikEndpointInputSchemas.usersTweets,
		output: XquikEndpointOutputSchemas.usersTweets,
	},
	'users.unfollow': {
		input: XquikEndpointInputSchemas.usersUnfollow,
		output: XquikEndpointOutputSchemas.usersUnfollow,
	},
	'webhooks.create': {
		input: XquikEndpointInputSchemas.webhooksCreate,
		output: XquikEndpointOutputSchemas.webhooksCreate,
	},
	'webhooks.deactivate': {
		input: XquikEndpointInputSchemas.webhooksDeactivate,
		output: XquikEndpointOutputSchemas.webhooksDeactivate,
	},
	'webhooks.deliveries': {
		input: XquikEndpointInputSchemas.webhooksDeliveries,
		output: XquikEndpointOutputSchemas.webhooksDeliveries,
	},
	'webhooks.list': {
		input: XquikEndpointInputSchemas.webhooksList,
		output: XquikEndpointOutputSchemas.webhooksList,
	},
	'webhooks.test': {
		input: XquikEndpointInputSchemas.webhooksTest,
		output: XquikEndpointOutputSchemas.webhooksTest,
	},
	'webhooks.update': {
		input: XquikEndpointInputSchemas.webhooksUpdate,
		output: XquikEndpointOutputSchemas.webhooksUpdate,
	},
	'writeActions.get': {
		input: XquikEndpointInputSchemas.writeActionsGet,
		output: XquikEndpointOutputSchemas.writeActionsGet,
	},
} as const satisfies RequiredPluginEndpointSchemas<typeof xquikEndpointsNested>;

const xquikWebhookSchemas = {
	'events.monitor': {
		description: 'Handle a signed Xquik monitor event delivery',
		payload: EventPayloadSchema,
		response: EventPayloadSchema,
	},
	'events.test': {
		description: 'Handle a signed Xquik test webhook delivery',
		payload: EventPayloadSchema,
		response: EventPayloadSchema,
	},
} as const satisfies RequiredPluginWebhookSchemas<typeof xquikWebhooksNested>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const xquikEndpointMeta = {
	'media.download': {
		description: 'Download images and videos from one or more tweets',
		riskLevel: 'read',
	},
	'media.uploadFromUrl': {
		description: 'Upload public media URLs for use in Xquik tweet creation',
		riskLevel: 'write',
	},
	'trends.get': {
		description: 'Get trending X topics by WOEID region',
		riskLevel: 'read',
	},
	'tweets.batch': {
		description: 'Fetch up to 100 tweets by ID',
		riskLevel: 'read',
	},
	'tweets.create': {
		description: 'Create a tweet or reply from a connected X account',
		riskLevel: 'write',
	},
	'tweets.delete': {
		description: 'Delete a tweet from a connected X account',
		irreversible: true,
		riskLevel: 'destructive',
	},
	'tweets.get': {
		description: 'Get a tweet with full text, author, metrics, and media',
		riskLevel: 'read',
	},
	'tweets.like': {
		description: 'Like a tweet from a connected X account',
		riskLevel: 'write',
	},
	'tweets.retweet': {
		description: 'Retweet a tweet from a connected X account',
		riskLevel: 'write',
	},
	'tweets.search': {
		description: 'Search tweets with X query operators and pagination',
		riskLevel: 'read',
	},
	'tweets.unlike': {
		description: 'Remove a like from a connected X account',
		riskLevel: 'write',
	},
	'users.batch': {
		description: 'Look up up to 100 X users by ID',
		riskLevel: 'read',
	},
	'users.follow': {
		description: 'Follow an X user from a connected account',
		riskLevel: 'write',
	},
	'users.followers': {
		description: 'List followers of an X user',
		riskLevel: 'read',
	},
	'users.following': {
		description: 'List accounts an X user follows',
		riskLevel: 'read',
	},
	'users.get': {
		description: 'Get an X user profile by username or user ID',
		riskLevel: 'read',
	},
	'users.search': {
		description: 'Search X users by name or username',
		riskLevel: 'read',
	},
	'users.tweets': {
		description: 'List recent tweets posted by an X user',
		riskLevel: 'read',
	},
	'users.unfollow': {
		description: 'Unfollow an X user from a connected account',
		riskLevel: 'write',
	},
	'webhooks.create': {
		description: 'Create an Xquik webhook endpoint subscription',
		riskLevel: 'write',
	},
	'webhooks.deactivate': {
		description: 'Deactivate an Xquik webhook endpoint',
		riskLevel: 'write',
	},
	'webhooks.deliveries': {
		description: 'List delivery attempts for an Xquik webhook endpoint',
		riskLevel: 'read',
	},
	'webhooks.list': {
		description: 'List configured Xquik webhook endpoints',
		riskLevel: 'read',
	},
	'webhooks.test': {
		description: 'Send a test delivery to an Xquik webhook endpoint',
		riskLevel: 'write',
	},
	'webhooks.update': {
		description: 'Update a Xquik webhook URL, event types, or active state',
		riskLevel: 'write',
	},
	'writeActions.get': {
		description: 'Check the status of a pending Xquik write action',
		riskLevel: 'read',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof xquikEndpointsNested>;

export const xquikAuthConfig = {
	api_key: {},
} as const satisfies PluginAuthConfig;

export type XquikKeyBuilderContext = KeyBuilderContext<
	XquikPluginOptions,
	typeof xquikAuthConfig
>;

export type BaseXquikPlugin<T extends XquikPluginOptions> = CorsairPlugin<
	'xquik',
	typeof XquikSchema,
	typeof xquikEndpointsNested,
	typeof xquikWebhooksNested,
	T,
	typeof defaultAuthType,
	typeof xquikAuthConfig
>;

export type InternalXquikPlugin = BaseXquikPlugin<XquikPluginOptions>;

export type ExternalXquikPlugin<T extends XquikPluginOptions> =
	BaseXquikPlugin<T>;

export function xquik<const T extends XquikPluginOptions>(
	incomingOptions: XquikPluginOptions & T = {} as XquikPluginOptions & T,
): ExternalXquikPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};

	return {
		id: 'xquik',
		authConfig: xquikAuthConfig,
		endpointMeta: xquikEndpointMeta,
		endpointSchemas: xquikEndpointSchemas,
		endpoints: xquikEndpointsNested,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		hooks: options.hooks,
		keyBuilder: async (ctx: XquikKeyBuilderContext, source) => {
			if (source === 'webhook' && options.webhookSecret) {
				return options.webhookSecret;
			}

			if (source === 'webhook') {
				const res = await ctx.keys.get_webhook_signature();
				return res ?? '';
			}

			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				return res ?? '';
			}

			throw new AuthMissingError('xquik', 'api_key');
		},
		options,
		pluginWebhookMatcher: hasXquikSignature,
		pluginTenantWebhookMatcher: matchXquikTenantWebhook,
		schema: XquikSchema,
		webhookHooks: options.webhookHooks,
		webhookSchemas: xquikWebhookSchemas,
		webhooks: xquikWebhooksNested,
	} satisfies InternalXquikPlugin;
}

export type {
	CreateTweetResponse,
	Delivery,
	EventPayload,
	MediaDownloadInput,
	MediaDownloadResponse,
	MediaUploadFromUrlInput,
	MediaUploadResponse,
	PaginatedTweets,
	PaginatedUsers,
	PendingWriteResponse,
	SearchTweet,
	SuccessResponse,
	Trend,
	TrendsGetInput,
	TrendsResponse,
	TweetAccountActionInput,
	TweetBatchInput,
	TweetCreateInput,
	TweetDetail,
	TweetFilter,
	TweetGetInput,
	TweetLookupResponse,
	TweetMedia,
	TweetSearchInput,
	UserAccountActionInput,
	UserBatchInput,
	UserGetInput,
	UserListInput,
	UserProfile,
	UserSearchInput,
	UserTweetsInput,
	WebhookCreateInput,
	WebhookIdInput,
	WebhookUpdateInput,
	WriteActionGetInput,
	WriteActionStatus,
	XquikEndpointInputs,
	XquikEndpointOutputs,
	XquikEventType,
} from './endpoints/types';

export type {
	XquikWebhookOutputs,
	XquikWebhookPayload,
} from './webhooks/types';
