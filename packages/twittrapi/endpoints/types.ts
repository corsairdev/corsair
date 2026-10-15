import { z } from 'zod';
import {
	TwittrApiCommunity,
	TwittrApiFriendship,
	TwittrApiList,
	TwittrApiMonitorAccount,
	TwittrApiMonitorEvent,
	TwittrApiMonitorFilters,
	TwittrApiMonitorWebhook,
	TwittrApiTrend,
	TwittrApiTrendLocation,
	TwittrApiTweet,
	TwittrApiUnavailableTweet,
	TwittrApiUser,
} from '../schema/database';

// ── Shared envelopes (`format=simple`) ───────────────────────────────────────

const TweetPageSchema = z.object({
	data: z.array(z.union([TwittrApiTweet, TwittrApiUnavailableTweet])),
	nextCursor: z.string().nullable(),
	previousCursor: z.string().nullable(),
	hasNextPage: z.boolean(),
});

const UserPageSchema = z.object({
	data: z.array(TwittrApiUser),
	nextCursor: z.string().nullable(),
	previousCursor: z.string().nullable(),
	hasNextPage: z.boolean(),
});

const CommunityPageSchema = z.object({
	data: z.array(TwittrApiCommunity),
	nextCursor: z.string().nullable(),
	previousCursor: z.string().nullable(),
	hasNextPage: z.boolean(),
});

const TrendPageSchema = z.object({
	data: z.array(TwittrApiTrend),
	nextCursor: z.string().nullable(),
	previousCursor: z.string().nullable(),
	hasNextPage: z.boolean(),
});

const TweetResultSchema = z.object({
	data: z.union([TwittrApiTweet, TwittrApiUnavailableTweet, z.null()]),
});

const UserResultSchema = z.object({
	data: TwittrApiUser.nullable(),
});

const ListResultSchema = z.object({
	data: TwittrApiList,
});

const CommunityResultSchema = z.object({
	data: TwittrApiCommunity,
});

const FriendshipResultSchema = z.object({
	data: TwittrApiFriendship,
});

const BalanceSchema = z.object({
	user_id: z.number().optional(),
	balance: z.number().optional(),
	price_per_call: z.number().optional(),
	is_active: z.boolean().optional(),
});

// ── Tweets inputs ────────────────────────────────────────────────────────────

const TweetsSearchInputSchema = z.object({
	searchItem: z
		.string()
		.min(1)
		.max(512)
		.describe('Search query, e.g. "from:jack lang:en"'),
	category: z
		.enum(['Top', 'Latest', 'Photos', 'Videos'])
		.optional()
		.describe('Search tab. Defaults to Top'),
	count: z.number().int().min(1).max(100).optional(),
	cursor: z.string().optional().describe('nextCursor from the previous page'),
});

const TweetsGetByIdInputSchema = z.object({
	tweetId: z
		.string()
		.regex(/^[0-9]{1,30}$/, 'Numeric tweet ID')
		.describe('Numeric tweet ID at the end of the tweet URL'),
});

const TweetsGetRepliesInputSchema = z.object({
	tweetId: z.string().regex(/^[0-9]{1,30}$/),
	rankingMode: z.enum(['Relevance', 'Recency', 'Likes']).optional(),
	cursor: z.string().optional(),
});

const TweetsGetQuotesInputSchema = z.object({
	tweetId: z.string().regex(/^[0-9]{1,30}$/),
	count: z.number().int().min(1).max(100).optional(),
	cursor: z.string().optional(),
});

const TweetsGetRetweetersInputSchema = z.object({
	tweetId: z.string().regex(/^[0-9]{1,30}$/),
	count: z.number().int().min(1).max(100).optional(),
	cursor: z.string().optional(),
});

const TweetsGetLikersInputSchema = z.object({
	tweetId: z.string().regex(/^[0-9]{1,30}$/),
});

// ── Users inputs ─────────────────────────────────────────────────────────────

const UserIdWithUsernameSchema = z.object({
	userId: z
		.string()
		.describe('Numeric user ID, or "-1" with username to resolve by handle'),
	username: z
		.string()
		.optional()
		.describe('Handle with or without @. Used instead of userId when set'),
});

const UsersGetByUsernameInputSchema = z.object({
	username: z
		.string()
		.regex(/^@?[A-Za-z0-9_]{2,15}$/, 'X handle')
		.describe('Handle with or without @'),
});

const UsersGetByIdInputSchema = UserIdWithUsernameSchema;

const UsersBatchGetByIdsInputSchema = z.object({
	ids: z
		.string()
		.min(1)
		.describe('Comma-separated numeric user IDs, at most 500'),
});

const UsersGetTweetsInputSchema = UserIdWithUsernameSchema.extend({
	count: z.number().int().min(1).max(100).optional(),
	cursor: z.string().optional(),
});

const UsersGetTweetsAndRepliesInputSchema = UsersGetTweetsInputSchema;

const UsersGetMediaInputSchema = UsersGetTweetsInputSchema;

const UsersGetLikesInputSchema = UsersGetTweetsInputSchema;

const UsersGetFollowersInputSchema = UsersGetTweetsInputSchema;

const UsersGetFollowingsInputSchema = UsersGetTweetsInputSchema;

const UsersGetVerifiedFollowersInputSchema = UsersGetTweetsInputSchema;

const UsersGetFriendshipInputSchema = z.object({
	sourceScreenName: z.string().describe('First handle, with or without @'),
	targetScreenName: z.string().describe('Second handle, with or without @'),
});

const UsersResolveIdsInputSchema = z.object({
	usernames: z
		.string()
		.min(1)
		.describe('Handles separated by commas, with or without @, at most 100'),
});

// ── Lists inputs ─────────────────────────────────────────────────────────────

const ListsGetDetailsInputSchema = z.object({
	listId: z
		.string()
		.regex(/^[0-9]+$/, 'Numeric list ID in x.com/i/lists/<listId>'),
});

const ListsGetTweetsInputSchema = z.object({
	listId: z.string().regex(/^[0-9]+$/),
	count: z.number().int().min(1).max(100).optional(),
	cursor: z.string().optional(),
});

const ListsGetMembersInputSchema = ListsGetTweetsInputSchema;
const ListsGetFollowersInputSchema = ListsGetTweetsInputSchema;

// ── Communities inputs ───────────────────────────────────────────────────────

const CommunitiesSearchInputSchema = z.object({
	searchTerm: z.string().min(1).describe('Keyword, URL-encoded by the client'),
	count: z.number().int().min(1).max(100).optional(),
	cursor: z.string().optional(),
});

const CommunitiesGetByIdInputSchema = z.object({
	communityId: z.string().regex(/^[0-9]+$/, 'Numeric community ID'),
});

const CommunitiesGetTweetsInputSchema = z.object({
	communityId: z.string().regex(/^[0-9]+$/),
	count: z.number().int().min(1).max(100).optional(),
	cursor: z.string().optional(),
});

const CommunitiesGetMembersInputSchema = CommunitiesGetTweetsInputSchema;
const CommunitiesGetModeratorsInputSchema = CommunitiesGetTweetsInputSchema;

// ── Trends inputs ────────────────────────────────────────────────────────────

const TrendsGetByLocationInputSchema = z.object({
	locationId: z
		.string()
		.describe('Yahoo WOEID. 1 = worldwide, 23424977 = United States'),
});

// ── Monitors inputs ──────────────────────────────────────────────────────────

const MonitorsAddAccountsInputSchema = z.object({
	username: z.string().optional().describe('Single handle to watch'),
	userId: z.string().optional().describe('Single numeric user ID to watch'),
	usernames: z
		.array(z.string().min(1))
		.max(100)
		.optional()
		.describe('Handles to watch, up to 100 per request'),
	userIds: z
		.array(z.string().min(1))
		.max(100)
		.optional()
		.describe('Numeric user IDs to watch, up to 100 per request'),
});

const MonitorsUpdateAccountInputSchema = z.object({
	usernameOrId: z.string().describe('Watched handle or numeric user ID'),
	filters: TwittrApiMonitorFilters.describe(
		'Reply/retweet/quote filters. Omitted fields keep their value',
	),
});

const MonitorsRemoveAccountInputSchema = z.object({
	usernameOrId: z.string().describe('Watched handle or numeric user ID'),
});

const MonitorsCreateWebhookInputSchema = z.object({
	url: z.string().url().describe('Public https URL, no redirects'),
	label: z.string().max(80).optional(),
	accounts: z
		.array(z.string())
		.max(1000)
		.nullable()
		.optional()
		.describe('X user IDs to forward. Null (default) = all watched accounts'),
});

const MonitorsUpdateWebhookInputSchema = z.object({
	webhookId: z.union([z.string(), z.number()]).describe('Webhook ID'),
	url: z.string().url().optional(),
	label: z.string().max(80).optional(),
	accounts: z.array(z.string()).max(1000).nullable().optional(),
	rotateSecret: z.boolean().optional(),
	active: z.boolean().optional(),
});

const MonitorsGetWebhookInputSchema = z.object({
	webhookId: z.union([z.string(), z.number()]),
});

const MonitorsDeleteWebhookInputSchema = MonitorsGetWebhookInputSchema;
const MonitorsTestWebhookInputSchema = MonitorsGetWebhookInputSchema;

const MonitorsGetEventsInputSchema = z.object({
	since: z
		.string()
		.optional()
		.describe(
			'Event ID (exclusive) or RFC 3339 time. Oldest kept events when omitted',
		),
	limit: z.number().int().min(1).max(500).optional(),
});

const MonitorsGetDeliveriesInputSchema = z.object({
	limit: z.number().int().min(1).max(200).optional(),
});

const BalanceGetInputSchema = z.object({});

// ── Monitors outputs ─────────────────────────────────────────────────────────

const MonitorPlanSchema = z.object({
	planId: z.string().optional(),
	maxAccounts: z.number().optional(),
	usedAccounts: z.number().optional(),
	latencyClass: z.string().optional(),
	status: z.string().optional(),
});

const MonitorsAddAccountsResponseSchema = z.object({
	data: z.array(
		z.object({
			input: z.string(),
			userId: z.string().optional(),
			username: z.string().optional(),
			status: z.string().optional(),
			error: z.string().optional(),
		}),
	),
	plan: MonitorPlanSchema.optional(),
});

const MonitorsListAccountsResponseSchema = z.object({
	data: z.array(TwittrApiMonitorAccount),
	plan: MonitorPlanSchema.optional(),
});

const MonitorsAccountResponseSchema = z.object({
	data: TwittrApiMonitorAccount,
});

const MonitorsGetPlanResponseSchema = z.object({
	plan: MonitorPlanSchema.optional(),
	webhooks: z.array(TwittrApiMonitorWebhook).optional(),
});

const MonitorsListWebhooksResponseSchema = z.object({
	webhooks: z.array(TwittrApiMonitorWebhook),
});

const MonitorsWebhookResponseSchema = z.object({
	webhook: TwittrApiMonitorWebhook,
});

const MonitorsTestWebhookResponseSchema = z.object({
	ok: z.boolean(),
	statusCode: z.number().optional(),
	latencyMs: z.number().optional(),
	error: z.string().optional(),
});

const MonitorsGetEventsResponseSchema = z.object({
	data: z.array(
		TwittrApiMonitorEvent.extend({
			status: z.string().optional(),
			attempts: z.number().optional(),
			deliveredAt: z.string().nullable().optional(),
			lastError: z.string().nullable().optional(),
		}),
	),
	nextSince: z.string().optional(),
	hasMore: z.boolean().optional(),
});

const MonitorsGetDeliveriesResponseSchema = z.object({
	data: z.array(
		TwittrApiMonitorEvent.extend({
			webhookId: z.union([z.string(), z.number()]).optional(),
			status: z.string().optional(),
			attempts: z.number().optional(),
			deliveredAt: z.string().nullable().optional(),
			lastError: z.string().nullable().optional(),
		}),
	),
});

// ── Maps ─────────────────────────────────────────────────────────────────────

export const TwittrApiEndpointInputSchemas = {
	tweetsSearch: TweetsSearchInputSchema,
	tweetsGetById: TweetsGetByIdInputSchema,
	tweetsGetReplies: TweetsGetRepliesInputSchema,
	tweetsGetQuotes: TweetsGetQuotesInputSchema,
	tweetsGetRetweeters: TweetsGetRetweetersInputSchema,
	tweetsGetLikers: TweetsGetLikersInputSchema,
	usersGetByUsername: UsersGetByUsernameInputSchema,
	usersGetById: UsersGetByIdInputSchema,
	usersBatchGetByIds: UsersBatchGetByIdsInputSchema,
	usersGetTweets: UsersGetTweetsInputSchema,
	usersGetTweetsAndReplies: UsersGetTweetsAndRepliesInputSchema,
	usersGetMedia: UsersGetMediaInputSchema,
	usersGetLikes: UsersGetLikesInputSchema,
	usersGetFollowers: UsersGetFollowersInputSchema,
	usersGetFollowings: UsersGetFollowingsInputSchema,
	usersGetVerifiedFollowers: UsersGetVerifiedFollowersInputSchema,
	usersGetFriendship: UsersGetFriendshipInputSchema,
	usersResolveIds: UsersResolveIdsInputSchema,
	listsGetDetails: ListsGetDetailsInputSchema,
	listsGetTweets: ListsGetTweetsInputSchema,
	listsGetMembers: ListsGetMembersInputSchema,
	listsGetFollowers: ListsGetFollowersInputSchema,
	communitiesSearch: CommunitiesSearchInputSchema,
	communitiesGetById: CommunitiesGetByIdInputSchema,
	communitiesGetTweets: CommunitiesGetTweetsInputSchema,
	communitiesGetMembers: CommunitiesGetMembersInputSchema,
	communitiesGetModerators: CommunitiesGetModeratorsInputSchema,
	trendsGetByLocation: TrendsGetByLocationInputSchema,
	trendsGetLocations: BalanceGetInputSchema,
	monitorsGetPlan: BalanceGetInputSchema,
	monitorsListAccounts: BalanceGetInputSchema,
	monitorsAddAccounts: MonitorsAddAccountsInputSchema,
	monitorsUpdateAccount: MonitorsUpdateAccountInputSchema,
	monitorsRemoveAccount: MonitorsRemoveAccountInputSchema,
	monitorsListWebhooks: BalanceGetInputSchema,
	monitorsCreateWebhook: MonitorsCreateWebhookInputSchema,
	monitorsGetWebhook: MonitorsGetWebhookInputSchema,
	monitorsUpdateWebhook: MonitorsUpdateWebhookInputSchema,
	monitorsDeleteWebhook: MonitorsDeleteWebhookInputSchema,
	monitorsTestWebhook: MonitorsTestWebhookInputSchema,
	monitorsGetEvents: MonitorsGetEventsInputSchema,
	monitorsGetDeliveries: MonitorsGetDeliveriesInputSchema,
	balanceGet: BalanceGetInputSchema,
} as const;

export const TwittrApiEndpointOutputSchemas = {
	tweetsSearch: TweetPageSchema,
	tweetsGetById: TweetResultSchema,
	tweetsGetReplies: TweetPageSchema,
	tweetsGetQuotes: TweetPageSchema,
	tweetsGetRetweeters: UserPageSchema,
	tweetsGetLikers: UserPageSchema,
	usersGetByUsername: UserResultSchema,
	usersGetById: UserResultSchema,
	usersBatchGetByIds: UserPageSchema,
	usersGetTweets: TweetPageSchema,
	usersGetTweetsAndReplies: TweetPageSchema,
	usersGetMedia: TweetPageSchema,
	usersGetLikes: TweetPageSchema,
	usersGetFollowers: UserPageSchema,
	usersGetFollowings: UserPageSchema,
	usersGetVerifiedFollowers: UserPageSchema,
	usersGetFriendship: FriendshipResultSchema,
	usersResolveIds: UserPageSchema,
	listsGetDetails: ListResultSchema,
	listsGetTweets: TweetPageSchema,
	listsGetMembers: UserPageSchema,
	listsGetFollowers: UserPageSchema,
	communitiesSearch: CommunityPageSchema,
	communitiesGetById: CommunityResultSchema,
	communitiesGetTweets: TweetPageSchema,
	communitiesGetMembers: UserPageSchema,
	communitiesGetModerators: UserPageSchema,
	trendsGetByLocation: TrendPageSchema,
	trendsGetLocations: z.object({
		data: z.array(TwittrApiTrendLocation),
		nextCursor: z.string().nullable().optional(),
		previousCursor: z.string().nullable().optional(),
		hasNextPage: z.boolean().optional(),
	}),
	monitorsGetPlan: MonitorsGetPlanResponseSchema,
	monitorsListAccounts: MonitorsListAccountsResponseSchema,
	monitorsAddAccounts: MonitorsAddAccountsResponseSchema,
	monitorsUpdateAccount: MonitorsAccountResponseSchema,
	monitorsRemoveAccount: z.object({}).loose(),
	monitorsListWebhooks: MonitorsListWebhooksResponseSchema,
	monitorsCreateWebhook: MonitorsWebhookResponseSchema,
	monitorsGetWebhook: MonitorsWebhookResponseSchema,
	monitorsUpdateWebhook: MonitorsWebhookResponseSchema,
	monitorsDeleteWebhook: z.object({}).loose(),
	monitorsTestWebhook: MonitorsTestWebhookResponseSchema,
	monitorsGetEvents: MonitorsGetEventsResponseSchema,
	monitorsGetDeliveries: MonitorsGetDeliveriesResponseSchema,
	balanceGet: BalanceSchema,
} as const;

export type TwittrApiEndpointInputs = {
	[K in keyof typeof TwittrApiEndpointInputSchemas]: z.infer<
		(typeof TwittrApiEndpointInputSchemas)[K]
	>;
};

export type TwittrApiEndpointOutputs = {
	[K in keyof typeof TwittrApiEndpointOutputSchemas]: z.infer<
		(typeof TwittrApiEndpointOutputSchemas)[K]
	>;
};

export type TweetsSearchResponse = TwittrApiEndpointOutputs['tweetsSearch'];
export type TweetsGetByIdResponse = TwittrApiEndpointOutputs['tweetsGetById'];
export type UsersGetByUsernameResponse =
	TwittrApiEndpointOutputs['usersGetByUsername'];
export type TrendsGetByLocationResponse =
	TwittrApiEndpointOutputs['trendsGetByLocation'];
