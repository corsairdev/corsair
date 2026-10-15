import { z } from 'zod';

// ── Shared primitives (TwittrAPI `format=simple`, camelCase, always present) ──

export const TwittrApiUserCounts = z.object({
	followers: z.number(),
	following: z.number(),
	tweets: z.number(),
	likes: z.number(),
	media: z.number(),
	listed: z.number(),
});

export const TwittrApiUser = z.object({
	id: z.string(),
	username: z.string(),
	name: z.string(),
	description: z.string(),
	location: z.string(),
	url: z.string().nullable(),
	createdAt: z.string().nullable(),
	avatarUrl: z.string().nullable(),
	bannerUrl: z.string().nullable(),
	verified: z.boolean(),
	verifiedType: z.string().nullable(),
	protected: z.boolean(),
	counts: TwittrApiUserCounts,
	pinnedTweetIds: z.array(z.string()),
	isAutomated: z.boolean(),
});

export const TwittrApiMedia = z.object({
	type: z.enum(['photo', 'video', 'gif']),
	url: z.string(),
	previewUrl: z.string(),
	width: z.number(),
	height: z.number(),
	altText: z.string().nullable(),
	durationMs: z.number().nullable(),
});

export const TwittrApiMention = z.object({
	id: z.string(),
	username: z.string(),
});

export const TwittrApiReplyTo = z.object({
	tweetId: z.string(),
	userId: z.string(),
	username: z.string(),
});

export const TwittrApiTweetCounts = z.object({
	likes: z.number(),
	retweets: z.number(),
	replies: z.number(),
	quotes: z.number(),
	bookmarks: z.number(),
	views: z.number().nullable(),
});

const TwittrApiTweetBase = z.object({
	id: z.string(),
	url: z.string(),
	text: z.string(),
	createdAt: z.string().nullable(),
	lang: z.string().nullable(),
	author: TwittrApiUser.nullable(),
	counts: TwittrApiTweetCounts,
	media: z.array(TwittrApiMedia),
	urls: z.array(z.string()),
	hashtags: z.array(z.string()),
	mentions: z.array(TwittrApiMention),
	replyTo: TwittrApiReplyTo.nullable(),
	conversationId: z.string().nullable(),
	isPinned: z.boolean(),
	source: z.string().nullable(),
});

// Quoted tweets nest one level deep; retweets carry the original.
// z.lazy keeps the recursion finite while still validating nested tweets.
export type TwittrApiTweet = z.infer<typeof TwittrApiTweetBase> & {
	quoted?: TwittrApiTweet | { id: string; unavailable: true } | null;
	retweetOf?: TwittrApiTweet | null;
};

export const TwittrApiUnavailableTweet = z.object({
	id: z.string(),
	unavailable: z.literal(true),
});

export const TwittrApiTweet: z.ZodType<TwittrApiTweet> =
	TwittrApiTweetBase.extend({
		quoted: z
			.union([z.lazy(() => TwittrApiTweet), TwittrApiUnavailableTweet])
			.nullable()
			.optional(),
		retweetOf: z
			.lazy(() => TwittrApiTweet)
			.nullable()
			.optional(),
	}) as z.ZodType<TwittrApiTweet>;

export const TwittrApiListOwner = z.object({
	id: z.string(),
	username: z.string(),
});

export const TwittrApiList = z.object({
	id: z.string(),
	name: z.string(),
	description: z.string(),
	createdAt: z.string().nullable(),
	memberCount: z.number(),
	followerCount: z.number(),
	private: z.boolean(),
	bannerUrl: z.string().nullable(),
	owner: TwittrApiListOwner.nullable(),
});

export const TwittrApiCommunityRule = z.object({
	id: z.string(),
	name: z.string(),
	description: z.string(),
});

export const TwittrApiCommunity = z.object({
	id: z.string(),
	name: z.string(),
	description: z.string(),
	createdAt: z.string().nullable(),
	memberCount: z.number(),
	moderatorCount: z.number(),
	joinPolicy: z.string().nullable(),
	nsfw: z.boolean(),
	topic: z.string().nullable(),
	bannerUrl: z.string().nullable(),
	creator: TwittrApiListOwner.nullable(),
	rules: z.array(TwittrApiCommunityRule),
});

export const TwittrApiTrend = z.object({
	name: z.string(),
	query: z.string(),
	url: z.string(),
	tweetVolume: z.number().nullable(),
});

export const TwittrApiTrendLocation = z.object({
	woeid: z.number(),
	name: z.string(),
	country: z.string(),
	countryCode: z.string().nullable(),
	placeType: z.string(),
	parentId: z.number().nullable(),
});

export const TwittrApiFriendshipSide = z.object({
	id: z.string(),
	username: z.string(),
});

export const TwittrApiFriendship = z.object({
	source: TwittrApiFriendshipSide,
	target: TwittrApiFriendshipSide,
	following: z.boolean(),
	followedBy: z.boolean(),
	canDm: z.boolean(),
	blocking: z.boolean(),
	blockedBy: z.boolean(),
	muting: z.boolean(),
});

// ── Monitor (account monitoring) entities ────────────────────────────────────

export const TwittrApiMonitorFilters = z.object({
	replies: z.boolean(),
	retweets: z.boolean(),
	quotes: z.boolean(),
});

export const TwittrApiMonitorAccount = z.object({
	userId: z.string(),
	username: z.string(),
	state: z.string(),
	stage: z.string().optional(),
	latencyClass: z.string().optional(),
	subscribedAt: z.string().optional(),
	monitoringSince: z.string().nullable().optional(),
	filters: TwittrApiMonitorFilters.optional(),
});

export const TwittrApiMonitorWebhook = z.object({
	id: z.number(),
	url: z.string(),
	label: z.string().nullable().optional(),
	accounts: z.array(z.string()).nullable().optional(),
	secret: z.string().optional(),
	active: z.boolean(),
	failureCount: z.number().optional(),
	disabledAt: z.string().nullable().optional(),
	disabledReason: z.string().nullable().optional(),
	lastSuccessAt: z.string().nullable().optional(),
	lastFailureAt: z.string().nullable().optional(),
	createdAt: z.string().optional(),
});

export const TwittrApiMonitorEventTweet = TwittrApiTweet;

export const TwittrApiMonitorEvent = z.object({
	event: z.string(),
	id: z.string(),
	monitoredUserId: z.string(),
	tweetId: z.string(),
	tweetCreatedAt: z.string(),
	detectedAt: z.string(),
	tweet: TwittrApiMonitorEventTweet.optional(),
});

export type TwittrApiUser = z.infer<typeof TwittrApiUser>;
export type TwittrApiMedia = z.infer<typeof TwittrApiMedia>;
export type TwittrApiList = z.infer<typeof TwittrApiList>;
export type TwittrApiCommunity = z.infer<typeof TwittrApiCommunity>;
export type TwittrApiTrend = z.infer<typeof TwittrApiTrend>;
export type TwittrApiTrendLocation = z.infer<typeof TwittrApiTrendLocation>;
export type TwittrApiFriendship = z.infer<typeof TwittrApiFriendship>;
export type TwittrApiMonitorAccount = z.infer<typeof TwittrApiMonitorAccount>;
export type TwittrApiMonitorWebhook = z.infer<typeof TwittrApiMonitorWebhook>;
export type TwittrApiMonitorEvent = z.infer<typeof TwittrApiMonitorEvent>;
