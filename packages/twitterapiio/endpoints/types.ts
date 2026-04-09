import { z } from 'zod';
import {
	RawApiReply,
	RawApiTweet,
	TwitterApiIOCommunity,
	TwitterApiIOTrend,
	TwitterApiIOUser,
} from '../schema/database';

// ── Shared ───────────────────────────────────────────────────────────────────

const PaginatedTweetsResponseSchema = z.object({
	status: z.boolean().optional(),
	tweets: z.array(RawApiTweet).optional(),
	next_cursor: z.string().nullable().optional(),
	has_next_page: z.boolean().optional(),
});

const PaginatedUsersResponseSchema = z.object({
	status: z.boolean().optional(),
	users: z.array(TwitterApiIOUser).optional(),
	next_cursor: z.string().nullable().optional(),
	has_next_page: z.boolean().optional(),
});

const ActionResponseSchema = z.object({
	status: z.boolean().optional(),
	message: z.string().optional(),
});

// ── Tweet Input Schemas ───────────────────────────────────────────────────────

const TweetsGetByIdsInputSchema = z.object({
	tweetIds: z.string().describe('Comma-separated list of tweet IDs'),
});

const TweetsSearchInputSchema = z.object({
	query: z.string(),
	queryType: z
		.enum(['Top', 'Latest', 'Photos', 'Videos'])
		.optional()
		.describe('Search type. Defaults to Top'),
	cursor: z.string().optional(),
});

// ISO 639-1 language codes supported by Twitter search
const TwitterLanguageCode = z.enum([
	'am',
	'ar',
	'bg',
	'bn',
	'bo',
	'ca',
	'cs',
	'cy',
	'da',
	'de',
	'dv',
	'el',
	'en',
	'es',
	'et',
	'eu',
	'fa',
	'fi',
	'fr',
	'ga',
	'gl',
	'gu',
	'he',
	'hi',
	'hr',
	'hy',
	'id',
	'is',
	'it',
	'ja',
	'ka',
	'km',
	'kn',
	'ko',
	'lo',
	'lt',
	'lv',
	'ml',
	'mr',
	'my',
	'ne',
	'nl',
	'no',
	'or',
	'pa',
	'pl',
	'ps',
	'pt',
	'ro',
	'ru',
	'si',
	'sk',
	'sl',
	'sq',
	'sr',
	'sv',
	'sw',
	'ta',
	'te',
	'th',
	'tl',
	'tr',
	'ug',
	'uk',
	'ur',
	'vi',
	'zh',
]);

export type TwitterLanguageCode = z.infer<typeof TwitterLanguageCode>;

const TweetsAdvancedSearchInputSchema = z.object({
	// ── Content filters ────────────────────────────────────────────────────
	/** Words that must ALL appear in the tweet (AND logic) */
	keywords: z
		.array(z.string().min(1))
		.optional()
		.describe('Words that must all appear in tweets (AND logic)'),
	/** Exact phrase that must appear verbatim */
	exactPhrase: z
		.string()
		.optional()
		.describe('Exact phrase that must appear in tweets'),
	/** At least one of these words must appear (OR logic) */
	anyOf: z
		.array(z.string().min(1))
		.min(2)
		.optional()
		.describe(
			'At least one of these words must appear (OR logic, minimum 2 items)',
		),
	/** Words that must NOT appear in the tweet */
	excludeKeywords: z
		.array(z.string().min(1))
		.optional()
		.describe('Words that must not appear in tweets'),
	/** Hashtags to match (with or without leading #) */
	hashtags: z
		.array(z.string().min(1))
		.optional()
		.describe('Hashtags to search for (with or without leading #)'),

	// ── User filters ───────────────────────────────────────────────────────
	/** Only return tweets sent by these usernames */
	fromUsers: z
		.array(z.string().min(1))
		.optional()
		.describe('Only tweets from these usernames'),
	/** Only return tweets that are replies to these usernames */
	toUsers: z
		.array(z.string().min(1))
		.optional()
		.describe('Only replies to these usernames'),
	/** Only return tweets that mention these usernames */
	mentioningUsers: z
		.array(z.string().min(1))
		.optional()
		.describe('Only tweets mentioning these usernames'),

	// ── Language filter ────────────────────────────────────────────────────
	/** ISO 639-1 language code to restrict results */
	language: TwitterLanguageCode.optional().describe(
		'ISO 639-1 language code (e.g. "en", "fr", "ja")',
	),

	// ── Time filters ───────────────────────────────────────────────────────
	/** Return tweets posted on or after this date (YYYY-MM-DD) */
	since: z
		.string()
		.regex(/^\d{4}-\d{2}-\d{2}$/, 'Must be YYYY-MM-DD')
		.optional()
		.describe('Only tweets posted on or after this date (YYYY-MM-DD)'),
	/** Return tweets posted before this date (YYYY-MM-DD) */
	until: z
		.string()
		.regex(/^\d{4}-\d{2}-\d{2}$/, 'Must be YYYY-MM-DD')
		.optional()
		.describe('Only tweets posted before this date (YYYY-MM-DD)'),
	/** Return tweets posted on or after this Unix timestamp (seconds) */
	sinceTime: z
		.number()
		.int()
		.nonnegative()
		.optional()
		.describe('Only tweets posted on or after this Unix timestamp (seconds)'),
	/** Return tweets posted before this Unix timestamp (seconds) */
	untilTime: z
		.number()
		.int()
		.nonnegative()
		.optional()
		.describe('Only tweets posted before this Unix timestamp (seconds)'),

	// ── Tweet-type filters ─────────────────────────────────────────────────
	/** Whether to include or exclude replies */
	replies: z
		.enum(['only', 'exclude'])
		.optional()
		.describe('"only" to return only replies; "exclude" to omit replies'),
	/** Whether to include or exclude retweets */
	retweets: z
		.enum(['only', 'exclude'])
		.optional()
		.describe('"only" to return only retweets; "exclude" to omit retweets'),
	/** Only return tweets that contain at least one link */
	onlyLinks: z.boolean().optional().describe('Only tweets containing links'),
	/** Only return tweets that contain media (images or video) */
	onlyMedia: z.boolean().optional().describe('Only tweets with media'),
	/** Only return tweets that contain images */
	onlyImages: z.boolean().optional().describe('Only tweets with images'),
	/** Only return tweets that contain native video */
	onlyVideos: z.boolean().optional().describe('Only tweets with native video'),

	// ── Engagement thresholds ──────────────────────────────────────────────
	/** Only return tweets with at least this many replies */
	minReplies: z
		.number()
		.int()
		.nonnegative()
		.optional()
		.describe('Minimum number of replies'),
	/** Only return tweets with at least this many likes */
	minLikes: z
		.number()
		.int()
		.nonnegative()
		.optional()
		.describe('Minimum number of likes'),
	/** Only return tweets with at least this many retweets */
	minRetweets: z
		.number()
		.int()
		.nonnegative()
		.optional()
		.describe('Minimum number of retweets'),

	// ── Result ordering & pagination ───────────────────────────────────────
	queryType: z
		.enum(['Latest', 'Top'])
		.optional()
		.describe('Result ordering — "Latest" (default) or "Top"'),
	cursor: z.string().optional(),
});

export type TweetsAdvancedSearchInput = z.infer<
	typeof TweetsAdvancedSearchInputSchema
>;

/**
 * Build a Twitter advanced-search query string from structured inputs.
 * Operators follow the syntax documented at
 * https://github.com/igorbrigadir/twitter-advanced-search
 */
export function buildAdvancedSearchQuery(
	input: TweetsAdvancedSearchInput,
): string {
	const parts: string[] = [];

	if (input.keywords?.length) {
		parts.push(input.keywords.join(' '));
	}
	if (input.exactPhrase) {
		parts.push(`"${input.exactPhrase}"`);
	}
	if (input.anyOf?.length) {
		parts.push(`(${input.anyOf.join(' OR ')})`);
	}
	if (input.excludeKeywords?.length) {
		parts.push(...input.excludeKeywords.map((k) => `-${k}`));
	}
	if (input.hashtags?.length) {
		parts.push(...input.hashtags.map((h) => (h.startsWith('#') ? h : `#${h}`)));
	}
	if (input.fromUsers?.length) {
		if (input.fromUsers.length === 1) {
			parts.push(`from:${input.fromUsers[0]}`);
		} else {
			parts.push(`(${input.fromUsers.map((u) => `from:${u}`).join(' OR ')})`);
		}
	}
	if (input.toUsers?.length) {
		if (input.toUsers.length === 1) {
			parts.push(`to:${input.toUsers[0]}`);
		} else {
			parts.push(`(${input.toUsers.map((u) => `to:${u}`).join(' OR ')})`);
		}
	}
	if (input.mentioningUsers?.length) {
		if (input.mentioningUsers.length === 1) {
			parts.push(`@${input.mentioningUsers[0]}`);
		} else {
			parts.push(`(${input.mentioningUsers.map((u) => `@${u}`).join(' OR ')})`);
		}
	}
	if (input.language) {
		parts.push(`lang:${input.language}`);
	}
	if (input.since) {
		parts.push(`since:${input.since}`);
	}
	if (input.until) {
		parts.push(`until:${input.until}`);
	}
	if (input.sinceTime !== undefined) {
		parts.push(`since_time:${input.sinceTime}`);
	}
	if (input.untilTime !== undefined) {
		parts.push(`until_time:${input.untilTime}`);
	}
	if (input.replies === 'only') {
		parts.push('filter:replies');
	} else if (input.replies === 'exclude') {
		parts.push('-filter:replies');
	}
	if (input.retweets === 'only') {
		parts.push('filter:retweets');
	} else if (input.retweets === 'exclude') {
		parts.push('-filter:retweets');
	}
	if (input.onlyLinks) {
		parts.push('filter:links');
	}
	if (input.onlyMedia) {
		parts.push('filter:media');
	}
	if (input.onlyImages) {
		parts.push('filter:images');
	}
	if (input.onlyVideos) {
		parts.push('filter:native_video');
	}
	if (input.minReplies !== undefined) {
		parts.push(`min_replies:${input.minReplies}`);
	}
	if (input.minLikes !== undefined) {
		parts.push(`min_faves:${input.minLikes}`);
	}
	if (input.minRetweets !== undefined) {
		parts.push(`min_retweets:${input.minRetweets}`);
	}

	return parts.join(' ');
}

const TweetsGetUserTimelineInputSchema = z.object({
	userId: z.string(),
	cursor: z.string().optional(),
});

const TweetsGetUserLastTweetsInputSchema = z.object({
	userName: z.string(),
	cursor: z.string().optional(),
});

const TweetsGetUserMentionsInputSchema = z.object({
	userName: z.string(),
	cursor: z.string().optional(),
});

// ── Replies Input Schemas ─────────────────────────────────────────────────────

const RepliesGetInputSchema = z.object({
	tweetId: z.string(),
	sinceTime: z.string().optional().describe('Unix timestamp in seconds'),
	untilTime: z.string().optional().describe('Unix timestamp in seconds'),
	cursor: z.string().optional(),
});

const RepliesGetV2InputSchema = z.object({
	tweetId: z.string(),
	queryType: z
		.enum(['Relevance', 'Latest', 'Likes'])
		.optional()
		.describe('Sort order for replies. Default is Relevance.'),
	cursor: z.string().optional(),
});

const TweetsGetQuotationsInputSchema = z.object({
	tweetId: z.string(),
	cursor: z.string().optional(),
});

const TweetsGetRetweetersInputSchema = z.object({
	tweetId: z.string(),
	cursor: z.string().optional(),
});

const TweetsGetThreadContextInputSchema = z.object({
	tweetId: z.string(),
	cursor: z.string().optional(),
});

const TweetsCreateInputSchema = z.object({
	tweet: z.string().describe('Tweet text content'),
	loginCookie: z.string().describe('Twitter login cookie from user_login_v2'),
	replyToTweetId: z.string().optional().describe('Tweet ID to reply to'),
	mediaIds: z.array(z.string()).optional().describe('Media IDs to attach'),
});

const TweetsDeleteInputSchema = z.object({
	tweetId: z.string(),
	loginCookie: z.string().describe('Twitter login cookie from user_login_v2'),
});

const TweetsLikeInputSchema = z.object({
	tweetId: z.string(),
	loginCookie: z.string().describe('Twitter login cookie from user_login_v2'),
});

const TweetsUnlikeInputSchema = z.object({
	tweetId: z.string(),
	loginCookie: z.string().describe('Twitter login cookie from user_login_v2'),
});

const TweetsRetweetInputSchema = z.object({
	tweetId: z.string(),
	loginCookie: z.string().describe('Twitter login cookie from user_login_v2'),
});

// ── User Input Schemas ────────────────────────────────────────────────────────

const UsersGetByUsernameInputSchema = z.object({
	userName: z.string(),
});

const UsersBatchGetByIdsInputSchema = z.object({
	userIds: z.string().describe('Comma-separated list of user IDs'),
});

const UsersSearchInputSchema = z.object({
	keyword: z.string(),
	cursor: z.string().optional(),
});

const UsersGetFollowersInputSchema = z.object({
	userName: z.string(),
	cursor: z.string().optional(),
});

const UsersGetVerifiedFollowersInputSchema = z.object({
	userName: z.string(),
	cursor: z.string().optional(),
});

const UsersGetFollowingsInputSchema = z.object({
	userName: z.string(),
	cursor: z.string().optional(),
});

const UsersCheckFollowRelationshipInputSchema = z.object({
	sourceUserName: z.string(),
	targetUserName: z.string(),
});

const UsersFollowInputSchema = z.object({
	followId: z.string().describe('User ID to follow'),
	loginCookie: z.string().describe('Twitter login cookie from user_login_v2'),
});

const UsersUnfollowInputSchema = z.object({
	followId: z.string().describe('User ID to unfollow'),
	loginCookie: z.string().describe('Twitter login cookie from user_login_v2'),
});

const UsersGetMeInputSchema = z.object({
	loginCookie: z.string().describe('Twitter login cookie from user_login_v2'),
});

// ── List Input Schemas ────────────────────────────────────────────────────────

const ListsGetFollowersInputSchema = z.object({
	listId: z.string(),
	cursor: z.string().optional(),
});

const ListsGetMembersInputSchema = z.object({
	listId: z.string(),
	cursor: z.string().optional(),
});

const ListsGetTweetsInputSchema = z.object({
	listId: z.string(),
	cursor: z.string().optional(),
});

// ── Community Input Schemas ───────────────────────────────────────────────────

const CommunitiesGetByIdInputSchema = z.object({
	communityId: z.string(),
});

const CommunitiesGetMembersInputSchema = z.object({
	communityId: z.string(),
	cursor: z.string().optional(),
});

const CommunitiesGetModeratorsInputSchema = z.object({
	communityId: z.string(),
	cursor: z.string().optional(),
});

const CommunitiesGetTweetsInputSchema = z.object({
	communityId: z.string(),
	cursor: z.string().optional(),
});

const CommunitiesSearchTweetsInputSchema = z.object({
	query: z.string(),
	cursor: z.string().optional(),
});

const CommunitiesCreateInputSchema = z.object({
	name: z.string(),
	description: z.string().optional(),
	loginCookie: z.string().describe('Twitter login cookie from user_login_v2'),
});

const CommunitiesDeleteInputSchema = z.object({
	communityId: z.string(),
	loginCookie: z.string().describe('Twitter login cookie from user_login_v2'),
});

const CommunitiesJoinInputSchema = z.object({
	communityId: z.string(),
	loginCookie: z.string().describe('Twitter login cookie from user_login_v2'),
});

const CommunitiesLeaveInputSchema = z.object({
	communityId: z.string(),
	loginCookie: z.string().describe('Twitter login cookie from user_login_v2'),
});

// ── Login Input Schema ────────────────────────────────────────────────────────

const UsersLoginInputSchema = z.object({
	userName: z.string().describe('Twitter username'),
	email: z.string().email().describe('Account email address'),
	password: z.string().describe('Account password'),
	totpSecret: z
		.string()
		.optional()
		.describe('TOTP secret for 2FA (from the account profile page)'),
	proxy: z
		.string()
		.describe(
			'High-quality residential proxy URL (e.g. http://user:pass@host:port)',
		),
});

// ── Stream Input Schemas ──────────────────────────────────────────────────────

const StreamAddUserInputSchema = z.object({
	userName: z
		.string()
		.describe('Twitter/X handle to add to the real-time monitor stream'),
});

const StreamRemoveUserInputSchema = z.object({
	userName: z
		.string()
		.describe('Twitter/X handle to remove from the monitor stream'),
});

const StreamListUsersInputSchema = z.object({});

// ── Webhook Rules Input Schemas ───────────────────────────────────────────────

/** A single tweet filter rule as returned by the API */
export const TweetFilterRuleSchema = z.object({
	rule_id: z.string(),
	tag: z.string().max(255),
	value: z.string().max(255),
	interval_seconds: z.number().min(100).max(86400),
});

export type TweetFilterRule = z.infer<typeof TweetFilterRuleSchema>;

const WebhookRulesAddInputSchema = z.object({
	tag: z.string().max(255).describe('Custom label to identify this rule'),
	value: z
		.string()
		.max(255)
		.describe(
			'Filter expression (e.g. "from:elonmusk OR from:kaitoeasyapi"). Rules are inactive until updated with isActive: true.',
		),
	intervalSeconds: z
		.number()
		.min(100)
		.max(86400)
		.describe(
			'How often to check for new tweets matching this rule (seconds, 100–86400)',
		),
});

const WebhookRulesGetInputSchema = z.object({});

const WebhookRulesUpdateInputSchema = z.object({
	ruleId: z.string().describe('ID of the rule to update'),
	tag: z.string().max(255).describe('Custom label'),
	value: z.string().max(255).describe('Filter expression'),
	intervalSeconds: z
		.number()
		.min(100)
		.max(86400)
		.describe('Check interval in seconds (100–86400)'),
	isActive: z
		.boolean()
		.describe('true to activate the rule, false to deactivate'),
});

const WebhookRulesDeleteInputSchema = z.object({
	ruleId: z.string().describe('ID of the rule to delete'),
});

// ── Trend Input Schemas ───────────────────────────────────────────────────────

const TrendsGetInputSchema = z.object({
	woeid: z.number().optional().describe('Where On Earth ID. 1 = worldwide'),
});

// ── Output Schemas ────────────────────────────────────────────────────────────

const PaginatedRepliesResponseSchema = z.object({
	status: z.string().optional(),
	replies: z.array(RawApiReply).optional(),
	next_cursor: z.string().nullable().optional(),
	has_next_page: z.boolean().optional(),
	message: z.string().optional(),
});

const TweetsGetByIdsResponseSchema = z.object({
	status: z.boolean().optional(),
	tweets: z.array(RawApiTweet).optional(),
});

const UserGetResponseSchema = z.object({
	status: z.boolean().optional(),
	data: TwitterApiIOUser.optional(),
});

const UsersBatchGetByIdsResponseSchema = z.object({
	status: z.boolean().optional(),
	data: z.array(TwitterApiIOUser).optional(),
});

const UsersCheckFollowRelationshipResponseSchema = z.object({
	status: z.boolean().optional(),
	isFollowing: z.boolean().optional(),
	isFollowedBy: z.boolean().optional(),
});

const CommunitiesGetByIdResponseSchema = z.object({
	status: z.boolean().optional(),
	data: TwitterApiIOCommunity.optional(),
});

const CommunitiesMembersResponseSchema = z.object({
	status: z.boolean().optional(),
	members: z.array(TwitterApiIOUser).optional(),
	next_cursor: z.string().nullable().optional(),
	has_next_page: z.boolean().optional(),
});

const TrendsGetResponseSchema = z.object({
	status: z.boolean().optional(),
	trends: z.array(TwitterApiIOTrend).optional(),
});

// ── Login / Stream / Webhook Rules Output Schemas ─────────────────────────────

const UsersLoginResponseSchema = z.object({
	login_cookie: z.string().optional(),
	status: z.string().optional(),
	msg: z.string().optional(),
});

const StreamStatusResponseSchema = z.object({
	status: z.enum(['success', 'error']).optional(),
	msg: z.string().optional(),
});

const StreamListUsersResponseSchema = z.object({
	users: z.array(z.string()).optional().describe('Monitored Twitter usernames'),
	status: z.string().optional(),
	msg: z.string().optional(),
});

const WebhookRulesAddResponseSchema = z.object({
	rule_id: z.string().optional(),
	status: z.string().optional(),
	msg: z.string().optional(),
});

const WebhookRulesGetResponseSchema = z.object({
	rules: z.array(TweetFilterRuleSchema).optional(),
	status: z.string().optional(),
	msg: z.string().optional(),
});

const WebhookRulesUpdateResponseSchema = z.object({
	rule_id: z.string().optional(),
	status: z.string().optional(),
	msg: z.string().optional(),
});

const WebhookRulesDeleteResponseSchema = z.object({
	status: z.string().optional(),
	msg: z.string().optional(),
});

// ── Input/Output Maps ─────────────────────────────────────────────────────────

export const TwitterApiIOEndpointInputSchemas = {
	tweetsGetByIds: TweetsGetByIdsInputSchema,
	tweetsSearch: TweetsSearchInputSchema,
	tweetsAdvancedSearch: TweetsAdvancedSearchInputSchema,
	tweetsGetUserTimeline: TweetsGetUserTimelineInputSchema,
	tweetsGetUserLastTweets: TweetsGetUserLastTweetsInputSchema,
	tweetsGetUserMentions: TweetsGetUserMentionsInputSchema,
	tweetsGetQuotations: TweetsGetQuotationsInputSchema,
	tweetsGetRetweeters: TweetsGetRetweetersInputSchema,
	tweetsGetThreadContext: TweetsGetThreadContextInputSchema,
	tweetsCreate: TweetsCreateInputSchema,
	tweetsDelete: TweetsDeleteInputSchema,
	tweetsLike: TweetsLikeInputSchema,
	tweetsUnlike: TweetsUnlikeInputSchema,
	tweetsRetweet: TweetsRetweetInputSchema,
	usersGetByUsername: UsersGetByUsernameInputSchema,
	usersBatchGetByIds: UsersBatchGetByIdsInputSchema,
	usersSearch: UsersSearchInputSchema,
	usersGetFollowers: UsersGetFollowersInputSchema,
	usersGetVerifiedFollowers: UsersGetVerifiedFollowersInputSchema,
	usersGetFollowings: UsersGetFollowingsInputSchema,
	usersCheckFollowRelationship: UsersCheckFollowRelationshipInputSchema,
	usersFollow: UsersFollowInputSchema,
	usersUnfollow: UsersUnfollowInputSchema,
	usersGetMe: UsersGetMeInputSchema,
	usersLogin: UsersLoginInputSchema,
	streamAddUser: StreamAddUserInputSchema,
	streamRemoveUser: StreamRemoveUserInputSchema,
	streamListUsers: StreamListUsersInputSchema,
	apiWebhooksAddRule: WebhookRulesAddInputSchema,
	apiWebhooksGetRules: WebhookRulesGetInputSchema,
	apiWebhooksUpdateRule: WebhookRulesUpdateInputSchema,
	apiWebhooksDeleteRule: WebhookRulesDeleteInputSchema,
	listsGetFollowers: ListsGetFollowersInputSchema,
	listsGetMembers: ListsGetMembersInputSchema,
	listsGetTweets: ListsGetTweetsInputSchema,
	communitiesGetById: CommunitiesGetByIdInputSchema,
	communitiesGetMembers: CommunitiesGetMembersInputSchema,
	communitiesGetModerators: CommunitiesGetModeratorsInputSchema,
	communitiesGetTweets: CommunitiesGetTweetsInputSchema,
	communitiesSearchTweets: CommunitiesSearchTweetsInputSchema,
	communitiesCreate: CommunitiesCreateInputSchema,
	communitiesDelete: CommunitiesDeleteInputSchema,
	communitiesJoin: CommunitiesJoinInputSchema,
	communitiesLeave: CommunitiesLeaveInputSchema,
	trendsGet: TrendsGetInputSchema,
	repliesGet: RepliesGetInputSchema,
	repliesGetV2: RepliesGetV2InputSchema,
} as const;

export const TwitterApiIOEndpointOutputSchemas = {
	tweetsGetByIds: TweetsGetByIdsResponseSchema,
	tweetsSearch: PaginatedTweetsResponseSchema,
	tweetsAdvancedSearch: PaginatedTweetsResponseSchema,
	tweetsGetUserTimeline: PaginatedTweetsResponseSchema,
	tweetsGetUserLastTweets: PaginatedTweetsResponseSchema,
	tweetsGetUserMentions: PaginatedTweetsResponseSchema,
	tweetsGetQuotations: PaginatedTweetsResponseSchema,
	tweetsGetRetweeters: PaginatedUsersResponseSchema,
	tweetsGetThreadContext: PaginatedTweetsResponseSchema,
	tweetsCreate: ActionResponseSchema,
	tweetsDelete: ActionResponseSchema,
	tweetsLike: ActionResponseSchema,
	tweetsUnlike: ActionResponseSchema,
	tweetsRetweet: ActionResponseSchema,
	usersGetByUsername: UserGetResponseSchema,
	usersBatchGetByIds: UsersBatchGetByIdsResponseSchema,
	usersSearch: PaginatedUsersResponseSchema,
	usersGetFollowers: PaginatedUsersResponseSchema,
	usersGetVerifiedFollowers: PaginatedUsersResponseSchema,
	usersGetFollowings: PaginatedUsersResponseSchema,
	usersCheckFollowRelationship: UsersCheckFollowRelationshipResponseSchema,
	usersFollow: ActionResponseSchema,
	usersUnfollow: ActionResponseSchema,
	usersGetMe: UserGetResponseSchema,
	usersLogin: UsersLoginResponseSchema,
	streamAddUser: StreamStatusResponseSchema,
	streamRemoveUser: StreamStatusResponseSchema,
	streamListUsers: StreamListUsersResponseSchema,
	apiWebhooksAddRule: WebhookRulesAddResponseSchema,
	apiWebhooksGetRules: WebhookRulesGetResponseSchema,
	apiWebhooksUpdateRule: WebhookRulesUpdateResponseSchema,
	apiWebhooksDeleteRule: WebhookRulesDeleteResponseSchema,
	listsGetFollowers: PaginatedUsersResponseSchema,
	listsGetMembers: PaginatedUsersResponseSchema,
	listsGetTweets: PaginatedTweetsResponseSchema,
	communitiesGetById: CommunitiesGetByIdResponseSchema,
	communitiesGetMembers: CommunitiesMembersResponseSchema,
	communitiesGetModerators: CommunitiesMembersResponseSchema,
	communitiesGetTweets: PaginatedTweetsResponseSchema,
	communitiesSearchTweets: PaginatedTweetsResponseSchema,
	communitiesCreate: ActionResponseSchema,
	communitiesDelete: ActionResponseSchema,
	communitiesJoin: ActionResponseSchema,
	communitiesLeave: ActionResponseSchema,
	trendsGet: TrendsGetResponseSchema,
	repliesGet: PaginatedRepliesResponseSchema,
	repliesGetV2: PaginatedRepliesResponseSchema,
} as const;

export type TwitterApiIOEndpointInputs = {
	[K in keyof typeof TwitterApiIOEndpointInputSchemas]: z.infer<
		(typeof TwitterApiIOEndpointInputSchemas)[K]
	>;
};

export type TwitterApiIOEndpointOutputs = {
	[K in keyof typeof TwitterApiIOEndpointOutputSchemas]: z.infer<
		(typeof TwitterApiIOEndpointOutputSchemas)[K]
	>;
};

// Named response types
export type TweetsGetByIdsResponse =
	TwitterApiIOEndpointOutputs['tweetsGetByIds'];
export type TweetsSearchResponse = TwitterApiIOEndpointOutputs['tweetsSearch'];
export type TweetsAdvancedSearchResponse =
	TwitterApiIOEndpointOutputs['tweetsAdvancedSearch'];
export type TweetsGetUserTimelineResponse =
	TwitterApiIOEndpointOutputs['tweetsGetUserTimeline'];
export type UsersGetByUsernameResponse =
	TwitterApiIOEndpointOutputs['usersGetByUsername'];
export type UsersBatchGetByIdsResponse =
	TwitterApiIOEndpointOutputs['usersBatchGetByIds'];
export type TrendsGetResponse = TwitterApiIOEndpointOutputs['trendsGet'];
export type CommunitiesGetByIdResponse =
	TwitterApiIOEndpointOutputs['communitiesGetById'];
export type UsersLoginResponse = TwitterApiIOEndpointOutputs['usersLogin'];
export type WebhookRulesGetResponse =
	TwitterApiIOEndpointOutputs['apiWebhooksGetRules'];
