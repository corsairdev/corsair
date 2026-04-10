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
} from 'corsair/core';
import {
	CommunitiesEndpoints,
	ListsEndpoints,
	RepliesEndpoints,
	StreamEndpoints,
	TrendsEndpoints,
	TweetsEndpoints,
	TwitterApiIOEndpointInputSchemas,
	TwitterApiIOEndpointOutputSchemas,
	UsersEndpoints,
	WebhookRulesEndpoints,
} from './endpoints';
import type {
	TwitterApiIOEndpointInputs,
	TwitterApiIOEndpointOutputs,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { TwitterApiIOSchema } from './schema';
import { TweetWebhooks } from './webhooks';
import type {
	TweetCreatedEvent,
	TweetFilterMatchEvent,
	TwitterApiIOWebhookOutputs,
} from './webhooks/types';
import {
	TweetCreatedEventSchema,
	TweetFilterMatchEventSchema,
} from './webhooks/types';

// ── Context & Key Builder ─────────────────────────────────────────────────────

export type TwitterApiIOContext = CorsairPluginContext<
	typeof TwitterApiIOSchema,
	TwitterApiIOPluginOptions
>;

export type TwitterApiIOKeyBuilderContext =
	KeyBuilderContext<TwitterApiIOPluginOptions>;

// ── Endpoint Types ────────────────────────────────────────────────────────────

type TwitterApiIOEndpoint<K extends keyof TwitterApiIOEndpointOutputs> =
	CorsairEndpoint<
		TwitterApiIOContext,
		TwitterApiIOEndpointInputs[K],
		TwitterApiIOEndpointOutputs[K]
	>;

export type TwitterApiIOEndpoints = {
	tweetsGetByIds: TwitterApiIOEndpoint<'tweetsGetByIds'>;
	tweetsSearch: TwitterApiIOEndpoint<'tweetsSearch'>;
	tweetsAdvancedSearch: TwitterApiIOEndpoint<'tweetsAdvancedSearch'>;
	tweetsGetUserTimeline: TwitterApiIOEndpoint<'tweetsGetUserTimeline'>;
	tweetsGetUserLastTweets: TwitterApiIOEndpoint<'tweetsGetUserLastTweets'>;
	tweetsGetUserMentions: TwitterApiIOEndpoint<'tweetsGetUserMentions'>;
	tweetsGetQuotations: TwitterApiIOEndpoint<'tweetsGetQuotations'>;
	tweetsGetRetweeters: TwitterApiIOEndpoint<'tweetsGetRetweeters'>;
	tweetsGetThreadContext: TwitterApiIOEndpoint<'tweetsGetThreadContext'>;
	tweetsCreate: TwitterApiIOEndpoint<'tweetsCreate'>;
	tweetsDelete: TwitterApiIOEndpoint<'tweetsDelete'>;
	tweetsLike: TwitterApiIOEndpoint<'tweetsLike'>;
	tweetsUnlike: TwitterApiIOEndpoint<'tweetsUnlike'>;
	tweetsRetweet: TwitterApiIOEndpoint<'tweetsRetweet'>;
	usersGetByUsername: TwitterApiIOEndpoint<'usersGetByUsername'>;
	usersBatchGetByIds: TwitterApiIOEndpoint<'usersBatchGetByIds'>;
	usersSearch: TwitterApiIOEndpoint<'usersSearch'>;
	usersGetFollowers: TwitterApiIOEndpoint<'usersGetFollowers'>;
	usersGetVerifiedFollowers: TwitterApiIOEndpoint<'usersGetVerifiedFollowers'>;
	usersGetFollowings: TwitterApiIOEndpoint<'usersGetFollowings'>;
	usersCheckFollowRelationship: TwitterApiIOEndpoint<'usersCheckFollowRelationship'>;
	usersFollow: TwitterApiIOEndpoint<'usersFollow'>;
	usersUnfollow: TwitterApiIOEndpoint<'usersUnfollow'>;
	usersGetMe: TwitterApiIOEndpoint<'usersGetMe'>;
	usersLogin: TwitterApiIOEndpoint<'usersLogin'>;
	streamAddUser: TwitterApiIOEndpoint<'streamAddUser'>;
	streamRemoveUser: TwitterApiIOEndpoint<'streamRemoveUser'>;
	streamListUsers: TwitterApiIOEndpoint<'streamListUsers'>;
	apiWebhooksAddRule: TwitterApiIOEndpoint<'apiWebhooksAddRule'>;
	apiWebhooksGetRules: TwitterApiIOEndpoint<'apiWebhooksGetRules'>;
	apiWebhooksUpdateRule: TwitterApiIOEndpoint<'apiWebhooksUpdateRule'>;
	apiWebhooksDeleteRule: TwitterApiIOEndpoint<'apiWebhooksDeleteRule'>;
	listsGetFollowers: TwitterApiIOEndpoint<'listsGetFollowers'>;
	listsGetMembers: TwitterApiIOEndpoint<'listsGetMembers'>;
	listsGetTweets: TwitterApiIOEndpoint<'listsGetTweets'>;
	communitiesGetById: TwitterApiIOEndpoint<'communitiesGetById'>;
	communitiesGetMembers: TwitterApiIOEndpoint<'communitiesGetMembers'>;
	communitiesGetModerators: TwitterApiIOEndpoint<'communitiesGetModerators'>;
	communitiesGetTweets: TwitterApiIOEndpoint<'communitiesGetTweets'>;
	communitiesSearchTweets: TwitterApiIOEndpoint<'communitiesSearchTweets'>;
	communitiesCreate: TwitterApiIOEndpoint<'communitiesCreate'>;
	communitiesDelete: TwitterApiIOEndpoint<'communitiesDelete'>;
	communitiesJoin: TwitterApiIOEndpoint<'communitiesJoin'>;
	communitiesLeave: TwitterApiIOEndpoint<'communitiesLeave'>;
	trendsGet: TwitterApiIOEndpoint<'trendsGet'>;
	repliesGet: TwitterApiIOEndpoint<'repliesGet'>;
	repliesGetV2: TwitterApiIOEndpoint<'repliesGetV2'>;
};

export type TwitterApiIOBoundEndpoints = BindEndpoints<
	typeof twitterApiIOEndpointsNested
>;

// ── Webhook Types ─────────────────────────────────────────────────────────────

type TwitterApiIOWebhook<
	K extends keyof TwitterApiIOWebhookOutputs,
	TEvent,
> = CorsairWebhook<TwitterApiIOContext, TEvent, TwitterApiIOWebhookOutputs[K]>;

export type TwitterApiIOWebhooks = {
	tweetCreated: TwitterApiIOWebhook<'tweetCreated', TweetCreatedEvent>;
	tweetFilterMatch: TwitterApiIOWebhook<
		'tweetFilterMatch',
		TweetFilterMatchEvent
	>;
};

export type TwitterApiIOBoundWebhooks = BindWebhooks<TwitterApiIOWebhooks>;

// ── Plugin Options ────────────────────────────────────────────────────────────

export type TwitterApiIOPluginOptions = {
	authType?: PickAuth<'api_key'>;
	/** Optional API key (overrides key manager) */
	key?: string;
	/** Optional webhook secret for signature verification */
	webhookSecret?: string;
	hooks?: InternalTwitterApiIOPlugin['hooks'];
	webhookHooks?: InternalTwitterApiIOPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	/**
	 * Permission configuration for the TwitterApiIO plugin.
	 * Controls what the AI agent is allowed to do.
	 * Overrides use dot-notation paths from the endpoint tree — invalid paths are type errors.
	 *
	 * @example
	 * ```ts
	 * twitterapiio({
	 *   permissions: {
	 *     mode: 'cautious',
	 *     overrides: { 'tweets.create': 'require_approval' },
	 *   },
	 * })
	 * ```
	 */
	permissions?: PluginPermissionsConfig<typeof twitterApiIOEndpointsNested>;
};

// ── Endpoint + Webhook Trees ──────────────────────────────────────────────────

const twitterApiIOEndpointsNested = {
	tweets: {
		getByIds: TweetsEndpoints.getByIds,
		search: TweetsEndpoints.search,
		advancedSearch: TweetsEndpoints.advancedSearch,
		getUserTimeline: TweetsEndpoints.getUserTimeline,
		getUserLastTweets: TweetsEndpoints.getUserLastTweets,
		getUserMentions: TweetsEndpoints.getUserMentions,
		getQuotations: TweetsEndpoints.getQuotations,
		getRetweeters: TweetsEndpoints.getRetweeters,
		getThreadContext: TweetsEndpoints.getThreadContext,
		create: TweetsEndpoints.create,
		delete: TweetsEndpoints.delete,
		like: TweetsEndpoints.like,
		unlike: TweetsEndpoints.unlike,
		retweet: TweetsEndpoints.retweet,
	},
	replies: {
		get: RepliesEndpoints.get,
		getV2: RepliesEndpoints.getV2,
	},
	users: {
		getByUsername: UsersEndpoints.getByUsername,
		batchGetByIds: UsersEndpoints.batchGetByIds,
		search: UsersEndpoints.search,
		getFollowers: UsersEndpoints.getFollowers,
		getVerifiedFollowers: UsersEndpoints.getVerifiedFollowers,
		getFollowings: UsersEndpoints.getFollowings,
		checkFollowRelationship: UsersEndpoints.checkFollowRelationship,
		follow: UsersEndpoints.follow,
		unfollow: UsersEndpoints.unfollow,
		getMe: UsersEndpoints.getMe,
		login: UsersEndpoints.login,
	},
	stream: {
		addUser: StreamEndpoints.addUser,
		removeUser: StreamEndpoints.removeUser,
		listUsers: StreamEndpoints.listUsers,
	},
	api: {
		webhooks: {
			addRule: WebhookRulesEndpoints.addRule,
			getRules: WebhookRulesEndpoints.getRules,
			updateRule: WebhookRulesEndpoints.updateRule,
			deleteRule: WebhookRulesEndpoints.deleteRule,
		},
	},
	lists: {
		getFollowers: ListsEndpoints.getFollowers,
		getMembers: ListsEndpoints.getMembers,
		getTweets: ListsEndpoints.getTweets,
	},
	communities: {
		getById: CommunitiesEndpoints.getById,
		getMembers: CommunitiesEndpoints.getMembers,
		getModerators: CommunitiesEndpoints.getModerators,
		getTweets: CommunitiesEndpoints.getTweets,
		searchTweets: CommunitiesEndpoints.searchTweets,
		create: CommunitiesEndpoints.create,
		delete: CommunitiesEndpoints.delete,
		join: CommunitiesEndpoints.join,
		leave: CommunitiesEndpoints.leave,
	},
	trends: {
		get: TrendsEndpoints.get,
	},
} as const;

const twitterApiIOWebhooksNested = {
	tweets: {
		created: TweetWebhooks.created,
		filterMatch: TweetWebhooks.filterMatch,
	},
} as const;

// ── Endpoint Schemas ──────────────────────────────────────────────────────────

export const twitterApiIOEndpointSchemas = {
	'tweets.getByIds': {
		input: TwitterApiIOEndpointInputSchemas.tweetsGetByIds,
		output: TwitterApiIOEndpointOutputSchemas.tweetsGetByIds,
	},
	'tweets.search': {
		input: TwitterApiIOEndpointInputSchemas.tweetsSearch,
		output: TwitterApiIOEndpointOutputSchemas.tweetsSearch,
	},
	'tweets.advancedSearch': {
		input: TwitterApiIOEndpointInputSchemas.tweetsAdvancedSearch,
		output: TwitterApiIOEndpointOutputSchemas.tweetsAdvancedSearch,
	},
	'tweets.getUserTimeline': {
		input: TwitterApiIOEndpointInputSchemas.tweetsGetUserTimeline,
		output: TwitterApiIOEndpointOutputSchemas.tweetsGetUserTimeline,
	},
	'tweets.getUserLastTweets': {
		input: TwitterApiIOEndpointInputSchemas.tweetsGetUserLastTweets,
		output: TwitterApiIOEndpointOutputSchemas.tweetsGetUserLastTweets,
	},
	'tweets.getUserMentions': {
		input: TwitterApiIOEndpointInputSchemas.tweetsGetUserMentions,
		output: TwitterApiIOEndpointOutputSchemas.tweetsGetUserMentions,
	},
	'tweets.getQuotations': {
		input: TwitterApiIOEndpointInputSchemas.tweetsGetQuotations,
		output: TwitterApiIOEndpointOutputSchemas.tweetsGetQuotations,
	},
	'tweets.getRetweeters': {
		input: TwitterApiIOEndpointInputSchemas.tweetsGetRetweeters,
		output: TwitterApiIOEndpointOutputSchemas.tweetsGetRetweeters,
	},
	'tweets.getThreadContext': {
		input: TwitterApiIOEndpointInputSchemas.tweetsGetThreadContext,
		output: TwitterApiIOEndpointOutputSchemas.tweetsGetThreadContext,
	},
	'tweets.create': {
		input: TwitterApiIOEndpointInputSchemas.tweetsCreate,
		output: TwitterApiIOEndpointOutputSchemas.tweetsCreate,
	},
	'tweets.delete': {
		input: TwitterApiIOEndpointInputSchemas.tweetsDelete,
		output: TwitterApiIOEndpointOutputSchemas.tweetsDelete,
	},
	'tweets.like': {
		input: TwitterApiIOEndpointInputSchemas.tweetsLike,
		output: TwitterApiIOEndpointOutputSchemas.tweetsLike,
	},
	'tweets.unlike': {
		input: TwitterApiIOEndpointInputSchemas.tweetsUnlike,
		output: TwitterApiIOEndpointOutputSchemas.tweetsUnlike,
	},
	'tweets.retweet': {
		input: TwitterApiIOEndpointInputSchemas.tweetsRetweet,
		output: TwitterApiIOEndpointOutputSchemas.tweetsRetweet,
	},
	'users.getByUsername': {
		input: TwitterApiIOEndpointInputSchemas.usersGetByUsername,
		output: TwitterApiIOEndpointOutputSchemas.usersGetByUsername,
	},
	'users.batchGetByIds': {
		input: TwitterApiIOEndpointInputSchemas.usersBatchGetByIds,
		output: TwitterApiIOEndpointOutputSchemas.usersBatchGetByIds,
	},
	'users.search': {
		input: TwitterApiIOEndpointInputSchemas.usersSearch,
		output: TwitterApiIOEndpointOutputSchemas.usersSearch,
	},
	'users.getFollowers': {
		input: TwitterApiIOEndpointInputSchemas.usersGetFollowers,
		output: TwitterApiIOEndpointOutputSchemas.usersGetFollowers,
	},
	'users.getVerifiedFollowers': {
		input: TwitterApiIOEndpointInputSchemas.usersGetVerifiedFollowers,
		output: TwitterApiIOEndpointOutputSchemas.usersGetVerifiedFollowers,
	},
	'users.getFollowings': {
		input: TwitterApiIOEndpointInputSchemas.usersGetFollowings,
		output: TwitterApiIOEndpointOutputSchemas.usersGetFollowings,
	},
	'users.checkFollowRelationship': {
		input: TwitterApiIOEndpointInputSchemas.usersCheckFollowRelationship,
		output: TwitterApiIOEndpointOutputSchemas.usersCheckFollowRelationship,
	},
	'users.follow': {
		input: TwitterApiIOEndpointInputSchemas.usersFollow,
		output: TwitterApiIOEndpointOutputSchemas.usersFollow,
	},
	'users.unfollow': {
		input: TwitterApiIOEndpointInputSchemas.usersUnfollow,
		output: TwitterApiIOEndpointOutputSchemas.usersUnfollow,
	},
	'users.getMe': {
		input: TwitterApiIOEndpointInputSchemas.usersGetMe,
		output: TwitterApiIOEndpointOutputSchemas.usersGetMe,
	},
	'users.login': {
		input: TwitterApiIOEndpointInputSchemas.usersLogin,
		output: TwitterApiIOEndpointOutputSchemas.usersLogin,
	},
	'stream.addUser': {
		input: TwitterApiIOEndpointInputSchemas.streamAddUser,
		output: TwitterApiIOEndpointOutputSchemas.streamAddUser,
	},
	'stream.removeUser': {
		input: TwitterApiIOEndpointInputSchemas.streamRemoveUser,
		output: TwitterApiIOEndpointOutputSchemas.streamRemoveUser,
	},
	'stream.listUsers': {
		input: TwitterApiIOEndpointInputSchemas.streamListUsers,
		output: TwitterApiIOEndpointOutputSchemas.streamListUsers,
	},
	'api.webhooks.addRule': {
		input: TwitterApiIOEndpointInputSchemas.apiWebhooksAddRule,
		output: TwitterApiIOEndpointOutputSchemas.apiWebhooksAddRule,
	},
	'api.webhooks.getRules': {
		input: TwitterApiIOEndpointInputSchemas.apiWebhooksGetRules,
		output: TwitterApiIOEndpointOutputSchemas.apiWebhooksGetRules,
	},
	'api.webhooks.updateRule': {
		input: TwitterApiIOEndpointInputSchemas.apiWebhooksUpdateRule,
		output: TwitterApiIOEndpointOutputSchemas.apiWebhooksUpdateRule,
	},
	'api.webhooks.deleteRule': {
		input: TwitterApiIOEndpointInputSchemas.apiWebhooksDeleteRule,
		output: TwitterApiIOEndpointOutputSchemas.apiWebhooksDeleteRule,
	},
	'lists.getFollowers': {
		input: TwitterApiIOEndpointInputSchemas.listsGetFollowers,
		output: TwitterApiIOEndpointOutputSchemas.listsGetFollowers,
	},
	'lists.getMembers': {
		input: TwitterApiIOEndpointInputSchemas.listsGetMembers,
		output: TwitterApiIOEndpointOutputSchemas.listsGetMembers,
	},
	'lists.getTweets': {
		input: TwitterApiIOEndpointInputSchemas.listsGetTweets,
		output: TwitterApiIOEndpointOutputSchemas.listsGetTweets,
	},
	'communities.getById': {
		input: TwitterApiIOEndpointInputSchemas.communitiesGetById,
		output: TwitterApiIOEndpointOutputSchemas.communitiesGetById,
	},
	'communities.getMembers': {
		input: TwitterApiIOEndpointInputSchemas.communitiesGetMembers,
		output: TwitterApiIOEndpointOutputSchemas.communitiesGetMembers,
	},
	'communities.getModerators': {
		input: TwitterApiIOEndpointInputSchemas.communitiesGetModerators,
		output: TwitterApiIOEndpointOutputSchemas.communitiesGetModerators,
	},
	'communities.getTweets': {
		input: TwitterApiIOEndpointInputSchemas.communitiesGetTweets,
		output: TwitterApiIOEndpointOutputSchemas.communitiesGetTweets,
	},
	'communities.searchTweets': {
		input: TwitterApiIOEndpointInputSchemas.communitiesSearchTweets,
		output: TwitterApiIOEndpointOutputSchemas.communitiesSearchTweets,
	},
	'communities.create': {
		input: TwitterApiIOEndpointInputSchemas.communitiesCreate,
		output: TwitterApiIOEndpointOutputSchemas.communitiesCreate,
	},
	'communities.delete': {
		input: TwitterApiIOEndpointInputSchemas.communitiesDelete,
		output: TwitterApiIOEndpointOutputSchemas.communitiesDelete,
	},
	'communities.join': {
		input: TwitterApiIOEndpointInputSchemas.communitiesJoin,
		output: TwitterApiIOEndpointOutputSchemas.communitiesJoin,
	},
	'communities.leave': {
		input: TwitterApiIOEndpointInputSchemas.communitiesLeave,
		output: TwitterApiIOEndpointOutputSchemas.communitiesLeave,
	},
	'trends.get': {
		input: TwitterApiIOEndpointInputSchemas.trendsGet,
		output: TwitterApiIOEndpointOutputSchemas.trendsGet,
	},
	'replies.get': {
		input: TwitterApiIOEndpointInputSchemas.repliesGet,
		output: TwitterApiIOEndpointOutputSchemas.repliesGet,
	},
	'replies.getV2': {
		input: TwitterApiIOEndpointInputSchemas.repliesGetV2,
		output: TwitterApiIOEndpointOutputSchemas.repliesGetV2,
	},
} as const;

// ── Webhook Schemas ───────────────────────────────────────────────────────────

const twitterApiIOWebhookSchemas = {
	'tweets.created': {
		description: 'A monitored user posted a new tweet',
		payload: TweetCreatedEventSchema,
		response: TweetCreatedEventSchema,
	},
	'tweets.filterMatch': {
		description: 'A tweet matched a configured filter rule',
		payload: TweetFilterMatchEventSchema,
		response: TweetFilterMatchEventSchema,
	},
} as const;

// ── Endpoint Meta ─────────────────────────────────────────────────────────────

const twitterApiIOEndpointMeta = {
	'tweets.getByIds': {
		riskLevel: 'read',
		description: 'Fetch tweets by their IDs',
	},
	'tweets.search': {
		riskLevel: 'read',
		description: 'Search tweets with a raw query string',
	},
	'tweets.advancedSearch': {
		riskLevel: 'read',
		description:
			'Search tweets using structured operators (keywords, users, dates, engagement thresholds, media filters, etc.)',
	},
	'tweets.getUserTimeline': {
		riskLevel: 'read',
		description: "Retrieve a user's tweet timeline by user ID",
	},
	'tweets.getUserLastTweets': {
		riskLevel: 'read',
		description: "Retrieve a user's most recent tweets by username",
	},
	'tweets.getUserMentions': {
		riskLevel: 'read',
		description: 'Get tweets that mention a user',
	},
	'tweets.getQuotations': {
		riskLevel: 'read',
		description: 'Get quote tweets for a tweet',
	},
	'tweets.getRetweeters': {
		riskLevel: 'read',
		description: 'Get users who retweeted a tweet',
	},
	'tweets.getThreadContext': {
		riskLevel: 'read',
		description: 'Get the full thread context for a tweet',
	},
	'tweets.create': {
		riskLevel: 'write',
		description: 'Post a new tweet or reply',
	},
	'tweets.delete': {
		riskLevel: 'destructive',
		description: 'Delete a tweet',
		irreversible: true,
	},
	'tweets.like': { riskLevel: 'write', description: 'Like a tweet' },
	'tweets.unlike': {
		riskLevel: 'write',
		description: 'Remove a like from a tweet',
	},
	'tweets.retweet': { riskLevel: 'write', description: 'Retweet a tweet' },
	'users.getByUsername': {
		riskLevel: 'read',
		description: 'Get user profile by username',
	},
	'users.batchGetByIds': {
		riskLevel: 'read',
		description: 'Batch fetch user profiles by user IDs',
	},
	'users.search': { riskLevel: 'read', description: 'Search users by keyword' },
	'users.getFollowers': {
		riskLevel: 'read',
		description: "Get a user's followers",
	},
	'users.getVerifiedFollowers': {
		riskLevel: 'read',
		description: "Get a user's verified (blue-check) followers",
	},
	'users.getFollowings': {
		riskLevel: 'read',
		description: 'Get users that a user is following',
	},
	'users.checkFollowRelationship': {
		riskLevel: 'read',
		description: 'Check if two users follow each other',
	},
	'users.follow': { riskLevel: 'write', description: 'Follow a user' },
	'users.unfollow': { riskLevel: 'write', description: 'Unfollow a user' },
	'users.getMe': {
		riskLevel: 'read',
		description: 'Get the authenticated account info',
	},
	'users.login': {
		riskLevel: 'write',
		description:
			'Authenticate a Twitter account via credentials and obtain a login cookie for v2 endpoints',
	},
	'stream.addUser': {
		riskLevel: 'write',
		description: 'Add a Twitter user to the real-time tweet monitor stream',
	},
	'stream.removeUser': {
		riskLevel: 'write',
		description:
			'Remove a Twitter user from the real-time tweet monitor stream',
	},
	'stream.listUsers': {
		riskLevel: 'read',
		description: 'List all Twitter users currently in the monitor stream',
	},
	'api.webhooks.addRule': {
		riskLevel: 'write',
		description:
			'Create a new tweet filter rule for the webhook stream (inactive by default — call updateRule to activate)',
	},
	'api.webhooks.getRules': {
		riskLevel: 'read',
		description: 'List all existing tweet filter rules',
	},
	'api.webhooks.updateRule': {
		riskLevel: 'write',
		description:
			'Update a tweet filter rule, including activating or deactivating it',
	},
	'api.webhooks.deleteRule': {
		riskLevel: 'destructive',
		description: 'Permanently delete a tweet filter rule',
		irreversible: true,
	},
	'lists.getFollowers': {
		riskLevel: 'read',
		description: 'Get followers of a Twitter list',
	},
	'lists.getMembers': {
		riskLevel: 'read',
		description: 'Get members of a Twitter list',
	},
	'lists.getTweets': {
		riskLevel: 'read',
		description: 'Get tweets from a Twitter list timeline',
	},
	'communities.getById': {
		riskLevel: 'read',
		description: 'Get community info by ID',
	},
	'communities.getMembers': {
		riskLevel: 'read',
		description: 'Get members of a community',
	},
	'communities.getModerators': {
		riskLevel: 'read',
		description: 'Get moderators of a community',
	},
	'communities.getTweets': {
		riskLevel: 'read',
		description: 'Get tweets posted in a community',
	},
	'communities.searchTweets': {
		riskLevel: 'read',
		description: 'Search tweets across all communities',
	},
	'communities.create': {
		riskLevel: 'write',
		description: 'Create a new Twitter community',
	},
	'communities.delete': {
		riskLevel: 'destructive',
		description: 'Delete a Twitter community',
		irreversible: true,
	},
	'communities.join': {
		riskLevel: 'write',
		description: 'Join a Twitter community',
	},
	'communities.leave': {
		riskLevel: 'write',
		description: 'Leave a Twitter community',
	},
	'trends.get': {
		riskLevel: 'read',
		description: 'Get trending topics by location (woeid)',
	},
	'replies.get': {
		riskLevel: 'read',
		description:
			'Get replies to a tweet, paginated by time range — stored independently in the replies table so engagement changes are tracked per reply',
	},
	'replies.getV2': {
		riskLevel: 'read',
		description:
			'Get replies to a tweet (v2) with sort order control (Relevance, Latest, Likes) — stored independently in the replies table so engagement changes are tracked per reply',
	},
} satisfies RequiredPluginEndpointMeta<typeof twitterApiIOEndpointsNested>;

// ── Auth Config ───────────────────────────────────────────────────────────────

export const twitterApiIOAuthConfig = {
	api_key: {
		account: ['one'] as const,
	},
} as const satisfies PluginAuthConfig;

// ── Plugin Types ──────────────────────────────────────────────────────────────

const defaultAuthType: AuthTypes = 'api_key' as const;

export type BaseTwitterApiIOPlugin<T extends TwitterApiIOPluginOptions> =
	CorsairPlugin<
		'twitterapiio',
		typeof TwitterApiIOSchema,
		typeof twitterApiIOEndpointsNested,
		typeof twitterApiIOWebhooksNested,
		T,
		typeof defaultAuthType
	>;

export type InternalTwitterApiIOPlugin =
	BaseTwitterApiIOPlugin<TwitterApiIOPluginOptions>;

export type ExternalTwitterApiIOPlugin<T extends TwitterApiIOPluginOptions> =
	BaseTwitterApiIOPlugin<T>;

// ── Plugin Factory ────────────────────────────────────────────────────────────

export function twitterapiio<const T extends TwitterApiIOPluginOptions>(
	incomingOptions: TwitterApiIOPluginOptions &
		T = {} as TwitterApiIOPluginOptions & T,
): ExternalTwitterApiIOPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};

	return {
		id: 'twitterapiio',
		schema: TwitterApiIOSchema,
		options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: twitterApiIOEndpointsNested,
		webhooks: twitterApiIOWebhooksNested,
		endpointMeta: twitterApiIOEndpointMeta,
		endpointSchemas: twitterApiIOEndpointSchemas,
		webhookSchemas: twitterApiIOWebhookSchemas,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		pluginWebhookMatcher: (request) => {
			const headers = request.headers;
			// twitterapi.io webhooks include a custom signature header or can be identified
			// by the payload type field. Accept if signature header is present or body has a known type.
			const hasSignature = 'x-twitterapiio-signature' in headers;
			const body =
				typeof request.body === 'string'
					? (() => {
							try {
								return JSON.parse(request.body as string) as Record<
									string,
									unknown
								>;
							} catch {
								return {};
							}
						})()
					: ((request.body as Record<string, unknown> | undefined) ?? {});
			const hasKnownType =
				body?.type === 'tweet.created' || body?.type === 'tweet.filter_match';
			return hasSignature || hasKnownType;
		},
		keyBuilder: async (ctx: TwitterApiIOKeyBuilderContext, source) => {
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

			return '';
		},
	} satisfies InternalTwitterApiIOPlugin;
}

// ── Type Exports ──────────────────────────────────────────────────────────────

export type {
	TwitterApiIOEndpointInputs,
	TwitterApiIOEndpointOutputs,
} from './endpoints/types';
export type { TwitterApiIOCredentials } from './schema';
export type {
	TweetCreatedEvent,
	TweetFilterMatchEvent,
	TwitterApiIOWebhookOutputs,
} from './webhooks/types';
