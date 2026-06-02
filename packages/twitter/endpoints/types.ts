import { z } from 'zod';

// ── Input Schemas ─────────────────────────────────────────────────────────────

const TweetsCreateInputSchema = z.object({
	text: z.string().describe('Tweet text content (max 280 weighted characters)'),
	quoteTweetId: z.string().optional().describe('ID of the tweet to quote'),
	mediaIds: z
		.array(z.string())
		.optional()
		.describe('Up to 4 media IDs to attach'),
	replySettings: z
		.enum(['following', 'mentionedUsers', 'subscribers'])
		.optional()
		.describe('Restricts who can reply to this tweet'),
});

const TweetsCreateReplyInputSchema = z.object({
	text: z.string().describe('Reply text content (max 280 weighted characters)'),
	inReplyToTweetId: z.string().describe('ID of the tweet to reply to'),
	excludeReplyUserIds: z
		.array(z.string())
		.optional()
		.describe('User IDs to exclude from @mentioning in the reply'),
});

// ── Output Schemas ────────────────────────────────────────────────────────────

const TweetDataSchema = z.object({
	id: z.string(),
	text: z.string(),
});

const TweetsCreateResponseSchema = z.object({
	data: TweetDataSchema.optional(),
});

const TweetsCreateReplyResponseSchema = z.object({
	data: TweetDataSchema.optional(),
});

// ── Input/Output Maps ─────────────────────────────────────────────────────────

export const TwitterEndpointInputSchemas = {
	tweetsCreate: TweetsCreateInputSchema,
	tweetsCreateReply: TweetsCreateReplyInputSchema,
} as const;

export const TwitterEndpointOutputSchemas = {
	tweetsCreate: TweetsCreateResponseSchema,
	tweetsCreateReply: TweetsCreateReplyResponseSchema,
} as const;

export type TwitterEndpointInputs = {
	[K in keyof typeof TwitterEndpointInputSchemas]: z.infer<
		(typeof TwitterEndpointInputSchemas)[K]
	>;
};

export type TwitterEndpointOutputs = {
	[K in keyof typeof TwitterEndpointOutputSchemas]: z.infer<
		(typeof TwitterEndpointOutputSchemas)[K]
	>;
};

export type TweetsCreateInput = TwitterEndpointInputs['tweetsCreate'];
export type TweetsCreateResponse = TwitterEndpointOutputs['tweetsCreate'];
export type TweetsCreateReplyInput = TwitterEndpointInputs['tweetsCreateReply'];
export type TweetsCreateReplyResponse =
	TwitterEndpointOutputs['tweetsCreateReply'];
