import { z } from 'zod';

export const TwitterApiIOUser = z.object({
	id: z.string(),
	userName: z.string(),
	name: z.string(),
	followerCount: z.number().optional(),
	followingCount: z.number().optional(),
	profilePicture: z.string().nullable().optional(),
	coverPicture: z.string().nullable().optional(),
	description: z.string().nullable().optional(),
	location: z.string().nullable().optional(),
	isBlueVerified: z.boolean().optional(),
	isGovernmentVerified: z.boolean().optional(),
	favouritesCount: z.number().optional(),
	statusesCount: z.number().optional(),
	mediaCount: z.number().optional(),
	createdAt: z.string().optional(),
	isProtected: z.boolean().optional(),
	isSuspended: z.boolean().optional(),
	isUnavailable: z.boolean().optional(),
	pinnedTweetIds: z.array(z.string()).optional(),
	website: z.string().nullable().optional(),
});

export const TwitterApiIOTweetMedia = z.object({
	type: z.string().optional(),
	url: z.string().optional(),
	mediaUrlHttps: z.string().optional(),
	expandedUrl: z.string().optional(),
	width: z.number().optional(),
	height: z.number().optional(),
	altText: z.string().nullable().optional(),
	durationMs: z.number().nullable().optional(),
});

export const TwitterApiIOTweet = z.object({
	id: z.string(),
	text: z.string(),
	author: z.string().optional(),
	createdAt: z.string().optional(),
	likeCount: z.number().optional(),
	retweetCount: z.number().optional(),
	replyCount: z.number().optional(),
	quoteCount: z.number().optional(),
	viewCount: z.number().nullable().optional(),
	bookmarkCount: z.number().optional(),
	lang: z.string().optional(),
	source: z.string().optional(),
	isRetweet: z.boolean().optional(),
	isQuote: z.boolean().optional(),
	isPinned: z.boolean().optional(),
	inReplyToStatusId: z.string().nullable().optional(),
	inReplyToUserId: z.string().nullable().optional(),
	quotedTweetId: z.string().nullable().optional(),
	media: z.array(TwitterApiIOTweetMedia).optional(),
	entities: z
		.object({
			urls: z
				.array(
					z.object({
						url: z.string().optional(),
						expandedUrl: z.string().optional(),
						displayUrl: z.string().optional(),
					}),
				)
				.optional(),
			hashtags: z
				.array(
					z.object({
						text: z.string().optional(),
					}),
				)
				.optional(),
			userMentions: z
				.array(
					z.object({
						id: z.string().optional(),
						name: z.string().optional(),
						screenName: z.string().optional(),
					}),
				)
				.optional(),
		})
		.optional(),
	conversationId: z.string().optional(),
});

export const TwitterApiIOList = z.object({
	id: z.string(),
	name: z.string(),
	description: z.string().nullable().optional(),
	memberCount: z.number().optional(),
	followerCount: z.number().optional(),
	owner: TwitterApiIOUser.optional(),
	createdAt: z.string().optional(),
	isPrivate: z.boolean().optional(),
});

export const TwitterApiIOCommunity = z.object({
	id: z.string(),
	name: z.string(),
	description: z.string().nullable().optional(),
	memberCount: z.number().optional(),
	role: z.string().optional(),
	createdAt: z.string().optional(),
	isNsfw: z.boolean().optional(),
	adminResults: z.array(z.any()).optional(),
	moderatorResults: z.array(z.any()).optional(),
	rules: z.array(z.any()).optional(),
	primaryTopic: z.any().optional(),
});

export const TwitterApiIOTrend = z.object({
	name: z.string(),
	tweetVolume: z.number().nullable().optional(),
	url: z.string().optional(),
	woeid: z.number().optional(),
	trendingAt: z.string().optional(),
});

// Raw tweet as returned by the API — author is a full user object.
// After normalization for DB storage, author becomes the Twitter user ID string.
export const RawApiTweet = TwitterApiIOTweet.extend({
	author: TwitterApiIOUser.optional(),
});

// Reply entity — extends TwitterApiIOTweet with reply-specific fields returned
// by the /twitter/tweet/replies and /twitter/tweet/replies_v2 endpoints.
// Stored independently in the `replies` table so engagement metrics (likes, etc.)
// can be updated without touching the parent tweet.
export const TwitterApiIOReply = TwitterApiIOTweet.extend({
	/** Direct link to the reply tweet on Twitter */
	url: z.string().optional(),
	/** Username of the user being replied to */
	inReplyToUsername: z.string().nullable().optional(),
	/** Whether the reply has been limited/hidden by Twitter */
	isLimitedReply: z.boolean().optional(),
});

// Raw reply as returned by the API — author is a full user object.
// After normalization for DB storage, author becomes the Twitter user ID string.
export const RawApiReply = TwitterApiIOReply.extend({
	author: TwitterApiIOUser.optional(),
});

export type TwitterApiIOUser = z.infer<typeof TwitterApiIOUser>;
export type TwitterApiIOTweet = z.infer<typeof TwitterApiIOTweet>;
export type TwitterApiIOReply = z.infer<typeof TwitterApiIOReply>;
export type TwitterApiIOList = z.infer<typeof TwitterApiIOList>;
export type TwitterApiIOCommunity = z.infer<typeof TwitterApiIOCommunity>;
export type TwitterApiIOTrend = z.infer<typeof TwitterApiIOTrend>;
export type TwitterApiIOTweetMedia = z.infer<typeof TwitterApiIOTweetMedia>;
export type RawApiTweet = z.infer<typeof RawApiTweet>;
export type RawApiReply = z.infer<typeof RawApiReply>;
