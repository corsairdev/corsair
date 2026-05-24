import { z } from 'zod';

// ── Input Schemas ─────────────────────────────────────────────────────────────

const PostsCreateInputSchema = z.object({
	text: z
		.string()
		.max(300)
		.describe('The text content of the post (max 300 characters)'),
});

const PostsDeleteInputSchema = z.object({
	uri: z
		.string()
		.describe('The AT Protocol URI (at://did:plc:...) of the post to delete'),
});

const ProfileGetInputSchema = z.object({
	actor: z.string().describe('The handle or DID of the user profile to fetch'),
});

const TimelineGetInputSchema = z.object({
	algorithm: z.string().optional().describe('Algorithm to use for the feed'),
	limit: z
		.number()
		.optional()
		.describe('Maximum number of items to return (1-100)'),
	cursor: z.string().optional().describe('Pagination cursor'),
});

// ── Output Schemas ────────────────────────────────────────────────────────────

const PostsCreateResponseSchema = z.object({
	uri: z.string(),
	cid: z.string(),
});

const PostsDeleteResponseSchema = z.object({
	success: z.boolean(),
});

const ProfileGetResponseSchema = z.object({
	did: z.string(),
	handle: z.string(),
	displayName: z.string().optional(),
	description: z.string().optional(),
	avatar: z.string().optional(),
	banner: z.string().optional(),
	followersCount: z.number().optional(),
	followsCount: z.number().optional(),
	postsCount: z.number().optional(),
});

const FeedItemSchema = z.object({
	post: z.object({
		uri: z.string(),
		cid: z.string(),
		author: z.object({
			did: z.string(),
			handle: z.string(),
			displayName: z.string().optional(),
			avatar: z.string().optional(),
		}),
		record: z.object({
			text: z.string(),
			createdAt: z.string(),
		}),
		replyCount: z.number().optional(),
		repostCount: z.number().optional(),
		likeCount: z.number().optional(),
	}),
});

const TimelineGetResponseSchema = z.object({
	feed: z.array(FeedItemSchema),
	cursor: z.string().optional(),
});

// ── Input/Output Maps ─────────────────────────────────────────────────────────

export const BlueskyEndpointInputSchemas = {
	postsCreate: PostsCreateInputSchema,
	postsDelete: PostsDeleteInputSchema,
	profileGet: ProfileGetInputSchema,
	timelineGet: TimelineGetInputSchema,
} as const;

export const BlueskyEndpointOutputSchemas = {
	postsCreate: PostsCreateResponseSchema,
	postsDelete: PostsDeleteResponseSchema,
	profileGet: ProfileGetResponseSchema,
	timelineGet: TimelineGetResponseSchema,
} as const;

export type BlueskyEndpointInputs = {
	[K in keyof typeof BlueskyEndpointInputSchemas]: z.infer<
		(typeof BlueskyEndpointInputSchemas)[K]
	>;
};

export type BlueskyEndpointOutputs = {
	[K in keyof typeof BlueskyEndpointOutputSchemas]: z.infer<
		(typeof BlueskyEndpointOutputSchemas)[K]
	>;
};

export type PostsCreateInput = BlueskyEndpointInputs['postsCreate'];
export type PostsCreateResponse = BlueskyEndpointOutputs['postsCreate'];
export type PostsDeleteInput = BlueskyEndpointInputs['postsDelete'];
export type PostsDeleteResponse = BlueskyEndpointOutputs['postsDelete'];
export type ProfileGetInput = BlueskyEndpointInputs['profileGet'];
export type ProfileGetResponse = BlueskyEndpointOutputs['profileGet'];
export type TimelineGetInput = BlueskyEndpointInputs['timelineGet'];
export type TimelineGetResponse = BlueskyEndpointOutputs['timelineGet'];
