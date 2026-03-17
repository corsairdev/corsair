import { z } from 'zod';
import {
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

const TweetsGetRepliesInputSchema = z.object({
	tweetId: z.string(),
	sinceTime: z.string().optional().describe('Unix timestamp in seconds'),
	untilTime: z.string().optional().describe('Unix timestamp in seconds'),
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

// ── Trend Input Schemas ───────────────────────────────────────────────────────

const TrendsGetInputSchema = z.object({
	woeid: z.number().optional().describe('Where On Earth ID. 1 = worldwide'),
});

// ── Output Schemas ────────────────────────────────────────────────────────────

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

// ── Input/Output Maps ─────────────────────────────────────────────────────────

export const TwitterApiIOEndpointInputSchemas = {
	tweetsGetByIds: TweetsGetByIdsInputSchema,
	tweetsSearch: TweetsSearchInputSchema,
	tweetsGetUserTimeline: TweetsGetUserTimelineInputSchema,
	tweetsGetUserLastTweets: TweetsGetUserLastTweetsInputSchema,
	tweetsGetUserMentions: TweetsGetUserMentionsInputSchema,
	tweetsGetReplies: TweetsGetRepliesInputSchema,
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
} as const;

export const TwitterApiIOEndpointOutputSchemas = {
	tweetsGetByIds: TweetsGetByIdsResponseSchema,
	tweetsSearch: PaginatedTweetsResponseSchema,
	tweetsGetUserTimeline: PaginatedTweetsResponseSchema,
	tweetsGetUserLastTweets: PaginatedTweetsResponseSchema,
	tweetsGetUserMentions: PaginatedTweetsResponseSchema,
	tweetsGetReplies: PaginatedTweetsResponseSchema,
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
export type TweetsGetUserTimelineResponse =
	TwitterApiIOEndpointOutputs['tweetsGetUserTimeline'];
export type UsersGetByUsernameResponse =
	TwitterApiIOEndpointOutputs['usersGetByUsername'];
export type UsersBatchGetByIdsResponse =
	TwitterApiIOEndpointOutputs['usersBatchGetByIds'];
export type TrendsGetResponse = TwitterApiIOEndpointOutputs['trendsGet'];
export type CommunitiesGetByIdResponse =
	TwitterApiIOEndpointOutputs['communitiesGetById'];
