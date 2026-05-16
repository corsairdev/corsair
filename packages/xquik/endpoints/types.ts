import { z } from 'zod';

export const EventTypeSchema = z.enum([
	'tweet.new',
	'tweet.quote',
	'tweet.reply',
	'tweet.retweet',
]);

export type XquikEventType = z.infer<typeof EventTypeSchema>;

export const EventTypeArraySchema = z.array(EventTypeSchema).min(1);

const IsoDateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);
const IsoDateTimeSchema = z.string();
const TweetIdSchema = z.string().min(1);
const UserIdSchema = z.string().min(1);
const AccountSchema = z.string().min(1);

const MediaTypeSchema = z.enum([
	'gifs',
	'images',
	'links',
	'media',
	'none',
	'videos',
]);

const IncludeModeSchema = z.enum(['exclude', 'include', 'only']);

const TweetFilterSchema = z.object({
	anyWords: z.string().optional(),
	cashtags: z.string().optional(),
	conversationId: z.string().optional(),
	exactPhrase: z.string().optional(),
	excludeWords: z.string().optional(),
	fromUser: z.string().optional(),
	hashtags: z.string().optional(),
	inReplyToTweetId: z.string().optional(),
	language: z.string().optional(),
	mediaType: MediaTypeSchema.optional(),
	mentioning: z.string().optional(),
	minFaves: z.number().int().min(0).optional(),
	minQuotes: z.number().int().min(0).optional(),
	minReplies: z.number().int().min(0).optional(),
	minRetweets: z.number().int().min(0).optional(),
	quotes: IncludeModeSchema.optional(),
	quotesOfTweetId: z.string().optional(),
	replies: IncludeModeSchema.optional(),
	retweets: IncludeModeSchema.optional(),
	retweetsOfTweetId: z.string().optional(),
	sinceDate: IsoDateSchema.optional(),
	toUser: z.string().optional(),
	untilDate: IsoDateSchema.optional(),
	url: z.string().optional(),
	verifiedOnly: z.boolean().optional(),
});

export type TweetFilter = z.infer<typeof TweetFilterSchema>;

const PaginationInputSchema = z.object({
	cursor: z.string().optional(),
});

const XAccountBodySchema = z.object({
	account: AccountSchema,
});

export const TweetMediaSchema = z
	.object({
		mediaUrl: z.string().optional(),
		type: z.enum(['animated_gif', 'photo', 'video']).optional(),
		url: z.string().optional(),
	})
	.passthrough();

export type TweetMedia = z.infer<typeof TweetMediaSchema>;

export const UserProfileSchema = z
	.object({
		coverPicture: z.string().optional(),
		createdAt: z.string().optional(),
		description: z.string().optional(),
		followers: z.number().int().optional(),
		following: z.number().int().optional(),
		id: z.string(),
		location: z.string().optional(),
		name: z.string(),
		profilePicture: z.string().optional(),
		statusesCount: z.number().int().optional(),
		username: z.string(),
		verified: z.boolean().optional(),
	})
	.passthrough();

export type UserProfile = z.infer<typeof UserProfileSchema>;

export const TweetAuthorSchema = z
	.object({
		followers: z.number().int(),
		id: z.string(),
		profilePicture: z.string().optional(),
		username: z.string(),
		verified: z.boolean(),
	})
	.passthrough();

export type TweetAuthor = z.infer<typeof TweetAuthorSchema>;

export const SearchTweetSchema = z
	.object({
		author: UserProfileSchema.optional(),
		bookmarkCount: z.number().int().optional(),
		conversationId: z.string().optional(),
		createdAt: z.string().optional(),
		// X entity payloads are open-ended objects that differ by tweet content.
		entities: z.record(z.unknown()).optional(),
		id: z.string(),
		inReplyToId: z.string().optional(),
		inReplyToUserId: z.string().optional(),
		inReplyToUsername: z.string().optional(),
		isLimitedReply: z.boolean().optional(),
		isNoteTweet: z.boolean().optional(),
		isQuoteStatus: z.boolean().optional(),
		isReply: z.boolean().optional(),
		lang: z.string().optional(),
		likeCount: z.number().int().optional(),
		media: z.array(TweetMediaSchema).optional(),
		quoteCount: z.number().int().optional(),
		replyCount: z.number().int().optional(),
		retweetCount: z.number().int().optional(),
		source: z.string().optional(),
		text: z.string(),
		type: z.string().optional(),
		url: z.string().optional(),
		viewCount: z.number().int().optional(),
	})
	.passthrough();

export type SearchTweet = z.infer<typeof SearchTweetSchema>;

export const TweetDetailSchema = z
	.object({
		bookmarkCount: z.number().int(),
		conversationId: z.string().optional(),
		createdAt: z.string().optional(),
		// X entity payloads are open-ended objects that differ by tweet content.
		entities: z.record(z.unknown()).optional(),
		id: z.string(),
		isNoteTweet: z.boolean().optional(),
		isQuoteStatus: z.boolean().optional(),
		isReply: z.boolean().optional(),
		likeCount: z.number().int(),
		media: z.array(TweetMediaSchema).optional(),
		quoteCount: z.number().int(),
		replyCount: z.number().int(),
		retweetCount: z.number().int(),
		source: z.string().optional(),
		text: z.string(),
		viewCount: z.number().int(),
	})
	.passthrough();

export type TweetDetail = z.infer<typeof TweetDetailSchema>;

export const PaginatedTweetsSchema = z.object({
	has_next_page: z.boolean(),
	next_cursor: z.string(),
	tweets: z.array(SearchTweetSchema),
});

export type PaginatedTweets = z.infer<typeof PaginatedTweetsSchema>;

export const PaginatedUsersSchema = z.object({
	has_next_page: z.boolean(),
	next_cursor: z.string(),
	users: z.array(UserProfileSchema),
});

export type PaginatedUsers = z.infer<typeof PaginatedUsersSchema>;

export const TweetLookupResponseSchema = z.object({
	author: TweetAuthorSchema.optional(),
	tweet: TweetDetailSchema,
});

export type TweetLookupResponse = z.infer<typeof TweetLookupResponseSchema>;

export const SuccessResponseSchema = z
	.object({
		success: z.literal(true),
	})
	.passthrough();

export type SuccessResponse = z.infer<typeof SuccessResponseSchema>;

export const PendingWriteResponseSchema = z.object({
	charged: z.boolean(),
	error: z.literal('x_write_unconfirmed'),
	message: z.string().optional(),
	retryable: z.literal(false),
	status: z.literal('pending_confirmation'),
	writeActionId: z.string(),
});

export type PendingWriteResponse = z.infer<typeof PendingWriteResponseSchema>;

export const CreateTweetResponseSchema = z.union([
	z.object({
		success: z.literal(true),
		tweetId: z.string(),
	}),
	PendingWriteResponseSchema,
]);

export type CreateTweetResponse = z.infer<typeof CreateTweetResponseSchema>;

export const WriteActionStatusSchema = z
	.object({
		action: z.string(),
		charged: z.boolean(),
		confirmationAttempts: z.number().int().optional(),
		confirmationCheckedAt: z.string().optional(),
		confirmationSource: z.string().nullable().optional(),
		confirmedAt: z.string().optional(),
		createdAt: z.string(),
		message: z.string().optional(),
		messageId: z.string().optional(),
		retryable: z.boolean(),
		sendDispatched: z.boolean(),
		sendDispatchedAt: z.string().optional(),
		status: z.enum(['failed', 'pending_confirmation', 'success']),
		targetId: z.string().nullable().optional(),
		tweetId: z.string().optional(),
		writeActionId: z.string(),
	})
	.passthrough();

export type WriteActionStatus = z.infer<typeof WriteActionStatusSchema>;

export const TrendSchema = z
	.object({
		description: z.string().optional(),
		name: z.string(),
		query: z.string().optional(),
		rank: z.number().int().optional(),
	})
	.passthrough();

export type Trend = z.infer<typeof TrendSchema>;

export const TrendsResponseSchema = z.object({
	count: z.number().int(),
	trends: z.array(TrendSchema),
	woeid: z.number().int(),
});

export type TrendsResponse = z.infer<typeof TrendsResponseSchema>;

export const MediaUploadResponseSchema = z.object({
	mediaId: z.string(),
	mediaUrl: z.string().url(),
	success: z.literal(true),
});

export type MediaUploadResponse = z.infer<typeof MediaUploadResponseSchema>;

export const MediaDownloadResponseSchema = z
	.object({
		cacheHit: z.boolean().optional(),
		galleryUrl: z.string().optional(),
		totalMedia: z.number().int().optional(),
		totalTweets: z.number().int().optional(),
		tweetId: z.string().optional(),
	})
	.passthrough();

export type MediaDownloadResponse = z.infer<typeof MediaDownloadResponseSchema>;

export const WebhookSchema = z.object({
	createdAt: IsoDateTimeSchema,
	eventTypes: EventTypeArraySchema,
	id: z.string(),
	isActive: z.boolean(),
	url: z.string().url(),
});

export type Webhook = z.infer<typeof WebhookSchema>;

export const DeliverySchema = z.object({
	attempts: z.number().int(),
	createdAt: IsoDateTimeSchema,
	deliveredAt: IsoDateTimeSchema.optional(),
	id: z.string(),
	lastError: z.string().optional(),
	lastStatusCode: z.number().int().optional(),
	status: z.string(),
	streamEventId: z.string(),
});

export type Delivery = z.infer<typeof DeliverySchema>;

export const EventPayloadSchema = z
	.object({
		// Webhook event data is event-type specific and remains provider-defined.
		data: z.record(z.unknown()),
		deliveryId: z.string().optional(),
		eventType: z.union([EventTypeSchema, z.literal('webhook.test')]),
		occurredAt: IsoDateTimeSchema.optional(),
		query: z.string().optional(),
		schemaVersion: z.string().optional(),
		streamEventId: z.string().optional(),
		timestamp: IsoDateTimeSchema.optional(),
		username: z.string().optional(),
	})
	.passthrough();

export type EventPayload = z.infer<typeof EventPayloadSchema>;

export const TestWebhookResponseSchema = z.object({
	error: z.string().optional(),
	statusCode: z.number().int(),
	success: z.boolean(),
});

export type TestWebhookResponse = z.infer<typeof TestWebhookResponseSchema>;

export const TweetBatchInputSchema = z.object({
	ids: z.array(TweetIdSchema).min(1).max(100),
});

export const TweetGetInputSchema = z.object({
	id: TweetIdSchema,
});

export const TweetSearchInputSchema = TweetFilterSchema.merge(
	PaginationInputSchema,
).extend({
	limit: z.number().int().min(1).max(200).optional(),
	q: z.string().min(1),
	queryType: z.enum(['Latest', 'Top']).optional(),
	sinceTime: IsoDateTimeSchema.optional(),
	untilTime: IsoDateTimeSchema.optional(),
});

export const TweetCreateInputSchema = z
	.object({
		account: AccountSchema,
		attachment_url: z.string().url().optional(),
		community_id: z.string().optional(),
		is_note_tweet: z.boolean().optional(),
		media: z.array(z.string().url()).max(4).optional(),
		reply_to_tweet_id: z.string().optional(),
		text: z.string().optional(),
	})
	.refine(
		(input) =>
			(input.text !== undefined && input.text.length > 0) ||
			(input.media !== undefined && input.media.length > 0),
		{ message: 'Provide text, media, or both.' },
	);

export const TweetAccountActionInputSchema = XAccountBodySchema.extend({
	id: TweetIdSchema,
});

export const UserBatchInputSchema = z.object({
	ids: z.array(UserIdSchema).min(1).max(100),
});

export const UserGetInputSchema = z.object({
	id: UserIdSchema,
});

export const UserSearchInputSchema = PaginationInputSchema.extend({
	q: z.string().min(1),
});

const UserPageInputSchema = PaginationInputSchema.extend({
	pageSize: z.number().int().min(20).max(200).optional(),
});

export const UserTweetsInputSchema = UserGetInputSchema.merge(
	UserPageInputSchema,
)
	.merge(TweetFilterSchema)
	.extend({
		includeParentTweet: z.boolean().optional(),
		includeReplies: z.boolean().optional(),
	});

export const UserListInputSchema =
	UserGetInputSchema.merge(UserPageInputSchema);

export const UserAccountActionInputSchema = XAccountBodySchema.extend({
	id: UserIdSchema,
});

export const TrendsGetInputSchema = z.object({
	count: z.number().int().min(1).max(50).optional(),
	woeid: z.number().int().optional(),
});

export const MediaUploadFromUrlInputSchema = z.object({
	account: AccountSchema,
	url: z.string().url(),
});

export const MediaDownloadInputSchema = z
	.object({
		tweetId: TweetIdSchema.optional(),
		tweetIds: z.array(TweetIdSchema).max(50).optional(),
		tweetInput: z.string().optional(),
		tweetUrl: z.string().url().optional(),
	})
	.refine(
		(input) =>
			input.tweetInput !== undefined ||
			input.tweetId !== undefined ||
			input.tweetUrl !== undefined ||
			(input.tweetIds !== undefined && input.tweetIds.length > 0),
		{ message: 'Provide tweetInput, tweetId, tweetUrl, or tweetIds.' },
	);

export const WriteActionGetInputSchema = z.object({
	id: z.string().min(1),
});

export const WebhooksListInputSchema = z.object({});

export const WebhookCreateInputSchema = z.object({
	eventTypes: EventTypeArraySchema,
	url: z.string().url(),
});

export const WebhookUpdateInputSchema = z
	.object({
		eventTypes: EventTypeArraySchema.optional(),
		id: z.string().min(1),
		isActive: z.boolean().optional(),
		url: z.string().url().optional(),
	})
	.refine(
		(input) =>
			input.eventTypes !== undefined ||
			input.isActive !== undefined ||
			input.url !== undefined,
		{ message: 'Provide at least one webhook field to update.' },
	);

export const WebhookIdInputSchema = z.object({
	id: z.string().min(1),
});

export type TweetBatchInput = z.infer<typeof TweetBatchInputSchema>;
export type TweetGetInput = z.infer<typeof TweetGetInputSchema>;
export type TweetSearchInput = z.infer<typeof TweetSearchInputSchema>;
export type TweetCreateInput = z.infer<typeof TweetCreateInputSchema>;
export type TweetAccountActionInput = z.infer<
	typeof TweetAccountActionInputSchema
>;
export type UserBatchInput = z.infer<typeof UserBatchInputSchema>;
export type UserGetInput = z.infer<typeof UserGetInputSchema>;
export type UserSearchInput = z.infer<typeof UserSearchInputSchema>;
export type UserTweetsInput = z.infer<typeof UserTweetsInputSchema>;
export type UserListInput = z.infer<typeof UserListInputSchema>;
export type UserAccountActionInput = z.infer<
	typeof UserAccountActionInputSchema
>;
export type TrendsGetInput = z.infer<typeof TrendsGetInputSchema>;
export type MediaUploadFromUrlInput = z.infer<
	typeof MediaUploadFromUrlInputSchema
>;
export type MediaDownloadInput = z.infer<typeof MediaDownloadInputSchema>;
export type WriteActionGetInput = z.infer<typeof WriteActionGetInputSchema>;
export type WebhooksListInput = z.infer<typeof WebhooksListInputSchema>;
export type WebhookCreateInput = z.infer<typeof WebhookCreateInputSchema>;
export type WebhookUpdateInput = z.infer<typeof WebhookUpdateInputSchema>;
export type WebhookIdInput = z.infer<typeof WebhookIdInputSchema>;

export type XquikEndpointInputs = {
	mediaDownload: MediaDownloadInput;
	mediaUploadFromUrl: MediaUploadFromUrlInput;
	trendsGet: TrendsGetInput;
	tweetsBatch: TweetBatchInput;
	tweetsCreate: TweetCreateInput;
	tweetsDelete: TweetAccountActionInput;
	tweetsGet: TweetGetInput;
	tweetsLike: TweetAccountActionInput;
	tweetsRetweet: TweetAccountActionInput;
	tweetsSearch: TweetSearchInput;
	tweetsUnlike: TweetAccountActionInput;
	usersBatch: UserBatchInput;
	usersFollow: UserAccountActionInput;
	usersFollowers: UserListInput;
	usersFollowing: UserListInput;
	usersGet: UserGetInput;
	usersSearch: UserSearchInput;
	usersTweets: UserTweetsInput;
	usersUnfollow: UserAccountActionInput;
	webhooksCreate: WebhookCreateInput;
	webhooksDeactivate: WebhookIdInput;
	webhooksDeliveries: WebhookIdInput;
	webhooksList: WebhooksListInput;
	webhooksTest: WebhookIdInput;
	webhooksUpdate: WebhookUpdateInput;
	writeActionsGet: WriteActionGetInput;
};

export type XquikEndpointOutputs = {
	mediaDownload: MediaDownloadResponse;
	mediaUploadFromUrl: MediaUploadResponse;
	trendsGet: TrendsResponse;
	tweetsBatch: PaginatedTweets;
	tweetsCreate: CreateTweetResponse;
	tweetsDelete: SuccessResponse;
	tweetsGet: TweetLookupResponse;
	tweetsLike: SuccessResponse;
	tweetsRetweet: SuccessResponse;
	tweetsSearch: PaginatedTweets;
	tweetsUnlike: SuccessResponse;
	usersBatch: PaginatedUsers;
	usersFollow: SuccessResponse;
	usersFollowers: PaginatedUsers;
	usersFollowing: PaginatedUsers;
	usersGet: UserProfile;
	usersSearch: PaginatedUsers;
	usersTweets: PaginatedTweets;
	usersUnfollow: SuccessResponse;
	webhooksCreate: Webhook & { secret: string };
	webhooksDeactivate: SuccessResponse;
	webhooksDeliveries: { deliveries: Delivery[] };
	webhooksList: { webhooks: Webhook[] };
	webhooksTest: TestWebhookResponse;
	webhooksUpdate: Webhook;
	writeActionsGet: WriteActionStatus;
};

export const XquikEndpointInputSchemas = {
	mediaDownload: MediaDownloadInputSchema,
	mediaUploadFromUrl: MediaUploadFromUrlInputSchema,
	trendsGet: TrendsGetInputSchema,
	tweetsBatch: TweetBatchInputSchema,
	tweetsCreate: TweetCreateInputSchema,
	tweetsDelete: TweetAccountActionInputSchema,
	tweetsGet: TweetGetInputSchema,
	tweetsLike: TweetAccountActionInputSchema,
	tweetsRetweet: TweetAccountActionInputSchema,
	tweetsSearch: TweetSearchInputSchema,
	tweetsUnlike: TweetAccountActionInputSchema,
	usersBatch: UserBatchInputSchema,
	usersFollow: UserAccountActionInputSchema,
	usersFollowers: UserListInputSchema,
	usersFollowing: UserListInputSchema,
	usersGet: UserGetInputSchema,
	usersSearch: UserSearchInputSchema,
	usersTweets: UserTweetsInputSchema,
	usersUnfollow: UserAccountActionInputSchema,
	webhooksCreate: WebhookCreateInputSchema,
	webhooksDeactivate: WebhookIdInputSchema,
	webhooksDeliveries: WebhookIdInputSchema,
	webhooksList: WebhooksListInputSchema,
	webhooksTest: WebhookIdInputSchema,
	webhooksUpdate: WebhookUpdateInputSchema,
	writeActionsGet: WriteActionGetInputSchema,
} as const;

export const XquikEndpointOutputSchemas = {
	mediaDownload: MediaDownloadResponseSchema,
	mediaUploadFromUrl: MediaUploadResponseSchema,
	trendsGet: TrendsResponseSchema,
	tweetsBatch: PaginatedTweetsSchema,
	tweetsCreate: CreateTweetResponseSchema,
	tweetsDelete: SuccessResponseSchema,
	tweetsGet: TweetLookupResponseSchema,
	tweetsLike: SuccessResponseSchema,
	tweetsRetweet: SuccessResponseSchema,
	tweetsSearch: PaginatedTweetsSchema,
	tweetsUnlike: SuccessResponseSchema,
	usersBatch: PaginatedUsersSchema,
	usersFollow: SuccessResponseSchema,
	usersFollowers: PaginatedUsersSchema,
	usersFollowing: PaginatedUsersSchema,
	usersGet: UserProfileSchema,
	usersSearch: PaginatedUsersSchema,
	usersTweets: PaginatedTweetsSchema,
	usersUnfollow: SuccessResponseSchema,
	webhooksCreate: WebhookSchema.extend({ secret: z.string() }),
	webhooksDeactivate: SuccessResponseSchema,
	webhooksDeliveries: z.object({ deliveries: z.array(DeliverySchema) }),
	webhooksList: z.object({ webhooks: z.array(WebhookSchema) }),
	webhooksTest: TestWebhookResponseSchema,
	webhooksUpdate: WebhookSchema,
	writeActionsGet: WriteActionStatusSchema,
} as const;
