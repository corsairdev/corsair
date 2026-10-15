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
import { AuthMissingError } from 'corsair/core';
import {
	BalanceEndpoints,
	CommunitiesEndpoints,
	ListsEndpoints,
	MonitorsEndpoints,
	TrendsEndpoints,
	TweetsEndpoints,
	TwittrApiEndpointInputSchemas,
	TwittrApiEndpointOutputSchemas,
	UsersEndpoints,
} from './endpoints';
import type {
	TwittrApiEndpointInputs,
	TwittrApiEndpointOutputs,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { TwittrApiSchema } from './schema';
import { TwittrApiWebhooks } from './webhooks';
import { matchTwittrApiTenantWebhook } from './webhooks/tenant-matcher';
import type {
	TwittrApiTestEvent,
	TwittrApiTweetEvent,
	TwittrApiWebhookOutputs,
} from './webhooks/types';
import {
	TwittrApiTestEventSchema,
	TwittrApiTweetEventSchema,
} from './webhooks/types';

// ── Context & Key Builder ─────────────────────────────────────────────────────

export type TwittrApiContext = CorsairPluginContext<
	typeof TwittrApiSchema,
	TwittrApiPluginOptions
>;

export type TwittrApiKeyBuilderContext =
	KeyBuilderContext<TwittrApiPluginOptions>;

// ── Endpoint Types ────────────────────────────────────────────────────────────

type TwittrApiEndpoint<K extends keyof TwittrApiEndpointOutputs> =
	CorsairEndpoint<
		TwittrApiContext,
		TwittrApiEndpointInputs[K],
		TwittrApiEndpointOutputs[K]
	>;

export type TwittrApiEndpoints = {
	tweetsSearch: TwittrApiEndpoint<'tweetsSearch'>;
	tweetsGetById: TwittrApiEndpoint<'tweetsGetById'>;
	tweetsGetReplies: TwittrApiEndpoint<'tweetsGetReplies'>;
	tweetsGetQuotes: TwittrApiEndpoint<'tweetsGetQuotes'>;
	tweetsGetRetweeters: TwittrApiEndpoint<'tweetsGetRetweeters'>;
	tweetsGetLikers: TwittrApiEndpoint<'tweetsGetLikers'>;
	usersGetByUsername: TwittrApiEndpoint<'usersGetByUsername'>;
	usersGetById: TwittrApiEndpoint<'usersGetById'>;
	usersBatchGetByIds: TwittrApiEndpoint<'usersBatchGetByIds'>;
	usersGetTweets: TwittrApiEndpoint<'usersGetTweets'>;
	usersGetTweetsAndReplies: TwittrApiEndpoint<'usersGetTweetsAndReplies'>;
	usersGetMedia: TwittrApiEndpoint<'usersGetMedia'>;
	usersGetLikes: TwittrApiEndpoint<'usersGetLikes'>;
	usersGetFollowers: TwittrApiEndpoint<'usersGetFollowers'>;
	usersGetFollowings: TwittrApiEndpoint<'usersGetFollowings'>;
	usersGetVerifiedFollowers: TwittrApiEndpoint<'usersGetVerifiedFollowers'>;
	usersGetFriendship: TwittrApiEndpoint<'usersGetFriendship'>;
	usersResolveIds: TwittrApiEndpoint<'usersResolveIds'>;
	listsGetDetails: TwittrApiEndpoint<'listsGetDetails'>;
	listsGetTweets: TwittrApiEndpoint<'listsGetTweets'>;
	listsGetMembers: TwittrApiEndpoint<'listsGetMembers'>;
	listsGetFollowers: TwittrApiEndpoint<'listsGetFollowers'>;
	communitiesSearch: TwittrApiEndpoint<'communitiesSearch'>;
	communitiesGetById: TwittrApiEndpoint<'communitiesGetById'>;
	communitiesGetTweets: TwittrApiEndpoint<'communitiesGetTweets'>;
	communitiesGetMembers: TwittrApiEndpoint<'communitiesGetMembers'>;
	communitiesGetModerators: TwittrApiEndpoint<'communitiesGetModerators'>;
	trendsGetByLocation: TwittrApiEndpoint<'trendsGetByLocation'>;
	trendsGetLocations: TwittrApiEndpoint<'trendsGetLocations'>;
	monitorsGetPlan: TwittrApiEndpoint<'monitorsGetPlan'>;
	monitorsListAccounts: TwittrApiEndpoint<'monitorsListAccounts'>;
	monitorsAddAccounts: TwittrApiEndpoint<'monitorsAddAccounts'>;
	monitorsUpdateAccount: TwittrApiEndpoint<'monitorsUpdateAccount'>;
	monitorsRemoveAccount: TwittrApiEndpoint<'monitorsRemoveAccount'>;
	monitorsListWebhooks: TwittrApiEndpoint<'monitorsListWebhooks'>;
	monitorsCreateWebhook: TwittrApiEndpoint<'monitorsCreateWebhook'>;
	monitorsGetWebhook: TwittrApiEndpoint<'monitorsGetWebhook'>;
	monitorsUpdateWebhook: TwittrApiEndpoint<'monitorsUpdateWebhook'>;
	monitorsDeleteWebhook: TwittrApiEndpoint<'monitorsDeleteWebhook'>;
	monitorsTestWebhook: TwittrApiEndpoint<'monitorsTestWebhook'>;
	monitorsGetEvents: TwittrApiEndpoint<'monitorsGetEvents'>;
	monitorsGetDeliveries: TwittrApiEndpoint<'monitorsGetDeliveries'>;
	balanceGet: TwittrApiEndpoint<'balanceGet'>;
};

export type TwittrApiBoundEndpoints = BindEndpoints<
	typeof twittrApiEndpointsNested
>;

// ── Webhook Types ─────────────────────────────────────────────────────────────

type TwittrApiWebhook<
	K extends keyof TwittrApiWebhookOutputs,
	TEvent,
> = CorsairWebhook<TwittrApiContext, TEvent, TwittrApiWebhookOutputs[K]>;

export type TwittrApiWebhooks = {
	tweet: TwittrApiWebhook<'tweet', TwittrApiTweetEvent>;
	test: TwittrApiWebhook<'test', TwittrApiTestEvent>;
};

export type TwittrApiBoundWebhooks = BindWebhooks<TwittrApiWebhooks>;

// ── Plugin Options ────────────────────────────────────────────────────────────

export type TwittrApiPluginOptions = {
	authType?: PickAuth<'api_key'>;
	/** Optional API key (overrides key manager) */
	key?: string;
	/** Optional webhook secret for signature verification */
	webhookSecret?: string;
	hooks?: InternalTwittrApiPlugin['hooks'];
	webhookHooks?: InternalTwittrApiPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	/**
	 * Permission configuration for the TwittrAPI plugin.
	 * Controls what the AI agent is allowed to do.
	 * Overrides use dot-notation paths from the endpoint tree — invalid paths are type errors.
	 *
	 * @example
	 * ```ts
	 * twittrapi({
	 *   permissions: {
	 *     mode: 'cautious',
	 *     overrides: { 'monitors.addAccounts': 'require_approval' },
	 *   },
	 * })
	 * ```
	 */
	permissions?: PluginPermissionsConfig<typeof twittrApiEndpointsNested>;
};

// ── Endpoint + Webhook Trees ──────────────────────────────────────────────────

const twittrApiEndpointsNested = {
	tweets: {
		search: TweetsEndpoints.search,
		getById: TweetsEndpoints.getById,
		getReplies: TweetsEndpoints.getReplies,
		getQuotes: TweetsEndpoints.getQuotes,
		getRetweeters: TweetsEndpoints.getRetweeters,
		getLikers: TweetsEndpoints.getLikers,
	},
	users: {
		getByUsername: UsersEndpoints.getByUsername,
		getById: UsersEndpoints.getById,
		batchGetByIds: UsersEndpoints.batchGetByIds,
		getTweets: UsersEndpoints.getTweets,
		getTweetsAndReplies: UsersEndpoints.getTweetsAndReplies,
		getMedia: UsersEndpoints.getMedia,
		getLikes: UsersEndpoints.getLikes,
		getFollowers: UsersEndpoints.getFollowers,
		getFollowings: UsersEndpoints.getFollowings,
		getVerifiedFollowers: UsersEndpoints.getVerifiedFollowers,
		getFriendship: UsersEndpoints.getFriendship,
		resolveIds: UsersEndpoints.resolveIds,
	},
	lists: {
		getDetails: ListsEndpoints.getDetails,
		getTweets: ListsEndpoints.getTweets,
		getMembers: ListsEndpoints.getMembers,
		getFollowers: ListsEndpoints.getFollowers,
	},
	communities: {
		search: CommunitiesEndpoints.search,
		getById: CommunitiesEndpoints.getById,
		getTweets: CommunitiesEndpoints.getTweets,
		getMembers: CommunitiesEndpoints.getMembers,
		getModerators: CommunitiesEndpoints.getModerators,
	},
	trends: {
		getByLocation: TrendsEndpoints.getByLocation,
		getLocations: TrendsEndpoints.getLocations,
	},
	monitors: {
		getPlan: MonitorsEndpoints.getPlan,
		listAccounts: MonitorsEndpoints.listAccounts,
		addAccounts: MonitorsEndpoints.addAccounts,
		updateAccount: MonitorsEndpoints.updateAccount,
		removeAccount: MonitorsEndpoints.removeAccount,
		listWebhooks: MonitorsEndpoints.listWebhooks,
		createWebhook: MonitorsEndpoints.createWebhook,
		getWebhook: MonitorsEndpoints.getWebhook,
		updateWebhook: MonitorsEndpoints.updateWebhook,
		deleteWebhook: MonitorsEndpoints.deleteWebhook,
		testWebhook: MonitorsEndpoints.testWebhook,
		getEvents: MonitorsEndpoints.getEvents,
		getDeliveries: MonitorsEndpoints.getDeliveries,
	},
	balance: {
		get: BalanceEndpoints.get,
	},
} as const;

const twittrApiWebhooksNested = {
	tweets: {
		tweet: TwittrApiWebhooks.tweet,
		test: TwittrApiWebhooks.test,
	},
} as const;

// ── Endpoint Schemas ──────────────────────────────────────────────────────────

export const twittrApiEndpointSchemas = {
	'tweets.search': {
		input: TwittrApiEndpointInputSchemas.tweetsSearch,
		output: TwittrApiEndpointOutputSchemas.tweetsSearch,
	},
	'tweets.getById': {
		input: TwittrApiEndpointInputSchemas.tweetsGetById,
		output: TwittrApiEndpointOutputSchemas.tweetsGetById,
	},
	'tweets.getReplies': {
		input: TwittrApiEndpointInputSchemas.tweetsGetReplies,
		output: TwittrApiEndpointOutputSchemas.tweetsGetReplies,
	},
	'tweets.getQuotes': {
		input: TwittrApiEndpointInputSchemas.tweetsGetQuotes,
		output: TwittrApiEndpointOutputSchemas.tweetsGetQuotes,
	},
	'tweets.getRetweeters': {
		input: TwittrApiEndpointInputSchemas.tweetsGetRetweeters,
		output: TwittrApiEndpointOutputSchemas.tweetsGetRetweeters,
	},
	'tweets.getLikers': {
		input: TwittrApiEndpointInputSchemas.tweetsGetLikers,
		output: TwittrApiEndpointOutputSchemas.tweetsGetLikers,
	},
	'users.getByUsername': {
		input: TwittrApiEndpointInputSchemas.usersGetByUsername,
		output: TwittrApiEndpointOutputSchemas.usersGetByUsername,
	},
	'users.getById': {
		input: TwittrApiEndpointInputSchemas.usersGetById,
		output: TwittrApiEndpointOutputSchemas.usersGetById,
	},
	'users.batchGetByIds': {
		input: TwittrApiEndpointInputSchemas.usersBatchGetByIds,
		output: TwittrApiEndpointOutputSchemas.usersBatchGetByIds,
	},
	'users.getTweets': {
		input: TwittrApiEndpointInputSchemas.usersGetTweets,
		output: TwittrApiEndpointOutputSchemas.usersGetTweets,
	},
	'users.getTweetsAndReplies': {
		input: TwittrApiEndpointInputSchemas.usersGetTweetsAndReplies,
		output: TwittrApiEndpointOutputSchemas.usersGetTweetsAndReplies,
	},
	'users.getMedia': {
		input: TwittrApiEndpointInputSchemas.usersGetMedia,
		output: TwittrApiEndpointOutputSchemas.usersGetMedia,
	},
	'users.getLikes': {
		input: TwittrApiEndpointInputSchemas.usersGetLikes,
		output: TwittrApiEndpointOutputSchemas.usersGetLikes,
	},
	'users.getFollowers': {
		input: TwittrApiEndpointInputSchemas.usersGetFollowers,
		output: TwittrApiEndpointOutputSchemas.usersGetFollowers,
	},
	'users.getFollowings': {
		input: TwittrApiEndpointInputSchemas.usersGetFollowings,
		output: TwittrApiEndpointOutputSchemas.usersGetFollowings,
	},
	'users.getVerifiedFollowers': {
		input: TwittrApiEndpointInputSchemas.usersGetVerifiedFollowers,
		output: TwittrApiEndpointOutputSchemas.usersGetVerifiedFollowers,
	},
	'users.getFriendship': {
		input: TwittrApiEndpointInputSchemas.usersGetFriendship,
		output: TwittrApiEndpointOutputSchemas.usersGetFriendship,
	},
	'users.resolveIds': {
		input: TwittrApiEndpointInputSchemas.usersResolveIds,
		output: TwittrApiEndpointOutputSchemas.usersResolveIds,
	},
	'lists.getDetails': {
		input: TwittrApiEndpointInputSchemas.listsGetDetails,
		output: TwittrApiEndpointOutputSchemas.listsGetDetails,
	},
	'lists.getTweets': {
		input: TwittrApiEndpointInputSchemas.listsGetTweets,
		output: TwittrApiEndpointOutputSchemas.listsGetTweets,
	},
	'lists.getMembers': {
		input: TwittrApiEndpointInputSchemas.listsGetMembers,
		output: TwittrApiEndpointOutputSchemas.listsGetMembers,
	},
	'lists.getFollowers': {
		input: TwittrApiEndpointInputSchemas.listsGetFollowers,
		output: TwittrApiEndpointOutputSchemas.listsGetFollowers,
	},
	'communities.search': {
		input: TwittrApiEndpointInputSchemas.communitiesSearch,
		output: TwittrApiEndpointOutputSchemas.communitiesSearch,
	},
	'communities.getById': {
		input: TwittrApiEndpointInputSchemas.communitiesGetById,
		output: TwittrApiEndpointOutputSchemas.communitiesGetById,
	},
	'communities.getTweets': {
		input: TwittrApiEndpointInputSchemas.communitiesGetTweets,
		output: TwittrApiEndpointOutputSchemas.communitiesGetTweets,
	},
	'communities.getMembers': {
		input: TwittrApiEndpointInputSchemas.communitiesGetMembers,
		output: TwittrApiEndpointOutputSchemas.communitiesGetMembers,
	},
	'communities.getModerators': {
		input: TwittrApiEndpointInputSchemas.communitiesGetModerators,
		output: TwittrApiEndpointOutputSchemas.communitiesGetModerators,
	},
	'trends.getByLocation': {
		input: TwittrApiEndpointInputSchemas.trendsGetByLocation,
		output: TwittrApiEndpointOutputSchemas.trendsGetByLocation,
	},
	'trends.getLocations': {
		input: TwittrApiEndpointInputSchemas.trendsGetLocations,
		output: TwittrApiEndpointOutputSchemas.trendsGetLocations,
	},
	'monitors.getPlan': {
		input: TwittrApiEndpointInputSchemas.monitorsGetPlan,
		output: TwittrApiEndpointOutputSchemas.monitorsGetPlan,
	},
	'monitors.listAccounts': {
		input: TwittrApiEndpointInputSchemas.monitorsListAccounts,
		output: TwittrApiEndpointOutputSchemas.monitorsListAccounts,
	},
	'monitors.addAccounts': {
		input: TwittrApiEndpointInputSchemas.monitorsAddAccounts,
		output: TwittrApiEndpointOutputSchemas.monitorsAddAccounts,
	},
	'monitors.updateAccount': {
		input: TwittrApiEndpointInputSchemas.monitorsUpdateAccount,
		output: TwittrApiEndpointOutputSchemas.monitorsUpdateAccount,
	},
	'monitors.removeAccount': {
		input: TwittrApiEndpointInputSchemas.monitorsRemoveAccount,
		output: TwittrApiEndpointOutputSchemas.monitorsRemoveAccount,
	},
	'monitors.listWebhooks': {
		input: TwittrApiEndpointInputSchemas.monitorsListWebhooks,
		output: TwittrApiEndpointOutputSchemas.monitorsListWebhooks,
	},
	'monitors.createWebhook': {
		input: TwittrApiEndpointInputSchemas.monitorsCreateWebhook,
		output: TwittrApiEndpointOutputSchemas.monitorsCreateWebhook,
	},
	'monitors.getWebhook': {
		input: TwittrApiEndpointInputSchemas.monitorsGetWebhook,
		output: TwittrApiEndpointOutputSchemas.monitorsGetWebhook,
	},
	'monitors.updateWebhook': {
		input: TwittrApiEndpointInputSchemas.monitorsUpdateWebhook,
		output: TwittrApiEndpointOutputSchemas.monitorsUpdateWebhook,
	},
	'monitors.deleteWebhook': {
		input: TwittrApiEndpointInputSchemas.monitorsDeleteWebhook,
		output: TwittrApiEndpointOutputSchemas.monitorsDeleteWebhook,
	},
	'monitors.testWebhook': {
		input: TwittrApiEndpointInputSchemas.monitorsTestWebhook,
		output: TwittrApiEndpointOutputSchemas.monitorsTestWebhook,
	},
	'monitors.getEvents': {
		input: TwittrApiEndpointInputSchemas.monitorsGetEvents,
		output: TwittrApiEndpointOutputSchemas.monitorsGetEvents,
	},
	'monitors.getDeliveries': {
		input: TwittrApiEndpointInputSchemas.monitorsGetDeliveries,
		output: TwittrApiEndpointOutputSchemas.monitorsGetDeliveries,
	},
	'balance.get': {
		input: TwittrApiEndpointInputSchemas.balanceGet,
		output: TwittrApiEndpointOutputSchemas.balanceGet,
	},
} as const;

// ── Webhook Schemas ───────────────────────────────────────────────────────────

const twittrApiWebhookSchemas = {
	'tweets.tweet': {
		description: 'A watched X account posted a new tweet',
		payload: TwittrApiTweetEventSchema,
		response: TwittrApiTweetEventSchema,
	},
	'tweets.test': {
		description: 'Test event sent from POST /monitors/webhooks/{id}/test',
		payload: TwittrApiTestEventSchema,
		response: TwittrApiTestEventSchema,
	},
} as const;

// ── Endpoint Meta ─────────────────────────────────────────────────────────────

const twittrApiEndpointMeta = {
	'tweets.search': {
		riskLevel: 'read',
		description: 'Search X tweets (Top, Latest, Photos, Videos tabs)',
	},
	'tweets.getById': {
		riskLevel: 'read',
		description: 'Get a single tweet by ID',
	},
	'tweets.getReplies': {
		riskLevel: 'read',
		description: 'Get a tweet with its replies in display order',
	},
	'tweets.getQuotes': {
		riskLevel: 'read',
		description: 'Get quote tweets for a tweet',
	},
	'tweets.getRetweeters': {
		riskLevel: 'read',
		description: 'Get users who retweeted a tweet',
	},
	'tweets.getLikers': {
		riskLevel: 'read',
		description: 'Get users who liked a tweet',
	},
	'users.getByUsername': {
		riskLevel: 'read',
		description: 'Get a user profile by handle',
	},
	'users.getById': {
		riskLevel: 'read',
		description: 'Get a user profile by numeric ID (or handle via username)',
	},
	'users.batchGetByIds': {
		riskLevel: 'read',
		description: 'Batch fetch up to 500 user profiles by IDs',
	},
	'users.getTweets': {
		riskLevel: 'read',
		description: "Get a user's tweets",
	},
	'users.getTweetsAndReplies': {
		riskLevel: 'read',
		description: "Get a user's tweets and replies",
	},
	'users.getMedia': {
		riskLevel: 'read',
		description: "Get media tweets from a user's timeline",
	},
	'users.getLikes': {
		riskLevel: 'read',
		description: "Get a user's liked tweets",
	},
	'users.getFollowers': {
		riskLevel: 'read',
		description: "Get a user's followers",
	},
	'users.getFollowings': {
		riskLevel: 'read',
		description: 'Get users that a user is following',
	},
	'users.getVerifiedFollowers': {
		riskLevel: 'read',
		description: "Get a user's verified followers",
	},
	'users.getFriendship': {
		riskLevel: 'read',
		description: 'Show the relationship between two accounts',
	},
	'users.resolveIds': {
		riskLevel: 'read',
		description: 'Resolve up to 100 handles to user IDs',
	},
	'lists.getDetails': {
		riskLevel: 'read',
		description: 'Get X list details by list ID',
	},
	'lists.getTweets': {
		riskLevel: 'read',
		description: 'Get tweets from an X list timeline',
	},
	'lists.getMembers': {
		riskLevel: 'read',
		description: 'Get members of an X list',
	},
	'lists.getFollowers': {
		riskLevel: 'read',
		description: 'Get followers of an X list',
	},
	'communities.search': {
		riskLevel: 'read',
		description: 'Search X communities by keyword',
	},
	'communities.getById': {
		riskLevel: 'read',
		description: 'Get community details by ID',
	},
	'communities.getTweets': {
		riskLevel: 'read',
		description: 'Get tweets posted in a community',
	},
	'communities.getMembers': {
		riskLevel: 'read',
		description: 'Get members of a community',
	},
	'communities.getModerators': {
		riskLevel: 'read',
		description: 'Get moderators of a community',
	},
	'trends.getByLocation': {
		riskLevel: 'read',
		description: 'Get trending topics by location (WOEID, 1 = worldwide)',
	},
	'trends.getLocations': {
		riskLevel: 'read',
		description: 'List available trend locations (WOEIDs)',
	},
	'monitors.getPlan': {
		riskLevel: 'read',
		description: 'Get the account-monitoring plan and webhooks',
	},
	'monitors.listAccounts': {
		riskLevel: 'read',
		description: 'List watched X accounts and plan usage',
	},
	'monitors.addAccounts': {
		riskLevel: 'write',
		description: 'Watch X accounts for new tweets (up to 100 per request)',
	},
	'monitors.updateAccount': {
		riskLevel: 'write',
		description: "Change a watched account's reply/retweet/quote filters",
	},
	'monitors.removeAccount': {
		riskLevel: 'destructive',
		description: 'Stop watching an X account',
		irreversible: true,
	},
	'monitors.listWebhooks': {
		riskLevel: 'read',
		description: 'List account-monitoring webhooks, oldest first',
	},
	'monitors.createWebhook': {
		riskLevel: 'write',
		description: 'Add a webhook for watched-account tweet events',
	},
	'monitors.getWebhook': {
		riskLevel: 'read',
		description: 'Get one account-monitoring webhook',
	},
	'monitors.updateWebhook': {
		riskLevel: 'write',
		description: 'Change a webhook URL, filter, secret, or active flag',
	},
	'monitors.deleteWebhook': {
		riskLevel: 'destructive',
		description: 'Remove an account-monitoring webhook',
		irreversible: true,
	},
	'monitors.testWebhook': {
		riskLevel: 'write',
		description: 'Send a signed test event to a webhook',
	},
	'monitors.getEvents': {
		riskLevel: 'read',
		description: 'Pull monitor events after an event ID (7-day retention)',
	},
	'monitors.getDeliveries': {
		riskLevel: 'read',
		description: 'Show latest monitor events with delivery status',
	},
	'balance.get': {
		riskLevel: 'read',
		description: 'Get the API key balance (free, not billed)',
	},
} satisfies RequiredPluginEndpointMeta<typeof twittrApiEndpointsNested>;

// ── Auth Config ───────────────────────────────────────────────────────────────

export const twittrApiAuthConfig = {
	api_key: {
		account: ['user_id'] as const,
	},
} as const satisfies PluginAuthConfig;

// ── Plugin Types ──────────────────────────────────────────────────────────────

const defaultAuthType: AuthTypes = 'api_key' as const;

export type BaseTwittrApiPlugin<T extends TwittrApiPluginOptions> =
	CorsairPlugin<
		'twittrapi',
		typeof TwittrApiSchema,
		typeof twittrApiEndpointsNested,
		typeof twittrApiWebhooksNested,
		T,
		typeof defaultAuthType
	>;

export type InternalTwittrApiPlugin =
	BaseTwittrApiPlugin<TwittrApiPluginOptions>;

export type ExternalTwittrApiPlugin<T extends TwittrApiPluginOptions> =
	BaseTwittrApiPlugin<T>;

// ── Plugin Factory ────────────────────────────────────────────────────────────

export function twittrapi<const T extends TwittrApiPluginOptions>(
	incomingOptions: TwittrApiPluginOptions & T = {} as TwittrApiPluginOptions &
		T,
): ExternalTwittrApiPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};

	return {
		id: 'twittrapi',
		authConfig: twittrApiAuthConfig,
		schema: TwittrApiSchema,
		options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: twittrApiEndpointsNested,
		webhooks: twittrApiWebhooksNested,
		endpointMeta: twittrApiEndpointMeta,
		endpointSchemas: twittrApiEndpointSchemas,
		webhookSchemas: twittrApiWebhookSchemas,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		pluginWebhookMatcher: (request) => {
			const headers = request.headers;
			if ('x-twittrapi-signature' in headers) return true;
			if ('x-twittrapi-event' in headers) return true;
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
			return body?.event === 'tweet' || body?.event === 'test';
		},
		pluginTenantWebhookMatcher: matchTwittrApiTenantWebhook,
		keyBuilder: async (ctx: TwittrApiKeyBuilderContext, source) => {
			if (source === 'webhook' && options.webhookSecret) {
				return options.webhookSecret;
			}

			if (source === 'webhook') {
				const res = await ctx.keys.get_webhook_signature();
				if (!res) {
					throw new Error(
						'[auth-missing:twittrapi:webhook_signature]: TwittrAPI webhook signature is missing',
					);
				}
				return res;
			}

			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				return res ?? '';
			}

			throw new AuthMissingError('twittrapi', 'api_key');
		},
	} satisfies InternalTwittrApiPlugin;
}

// ── Type Exports ──────────────────────────────────────────────────────────────

export type {
	TwittrApiEndpointInputs,
	TwittrApiEndpointOutputs,
} from './endpoints/types';
export type { TwittrApiCredentials } from './schema';
export type {
	TwittrApiTestEvent,
	TwittrApiTweetEvent,
	TwittrApiWebhookOutputs,
} from './webhooks/types';
