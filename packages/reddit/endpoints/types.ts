import { z } from 'zod';

// ── Shared Sub-schemas ────────────────────────────────────────────────────────

export const PostDataSchema = z
	.object({
		id: z.string(),
		name: z.string(),
		title: z.string(),
		selftext: z.string(),
		selftext_html: z.string().nullable(),
		url: z.string(),
		author: z.string(),
		author_fullname: z.string().optional(),
		subreddit: z.string(),
		subreddit_name_prefixed: z.string(),
		subreddit_id: z.string().optional(),
		score: z.number(),
		ups: z.number(),
		downs: z.number(),
		upvote_ratio: z.number(),
		num_comments: z.number(),
		over_18: z.boolean(),
		spoiler: z.boolean(),
		stickied: z.boolean(),
		archived: z.boolean().optional(),
		locked: z.boolean().optional(),
		hide_score: z.boolean().optional(),
		created_utc: z.number(),
		permalink: z.string(),
		thumbnail: z.string(),
		total_awards_received: z.number().optional(),
	})
	.passthrough();

export const ListingChildSchema = z.object({
	kind: z.enum(['t1', 't2', 't3', 't4', 't5']),
	data: z.any(),
});

export const ListingResponseSchema = z.object({
	kind: z.literal('Listing'),
	data: z.object({
		modhash: z.string().nullable().optional(),
		dist: z.number().nullable().optional(),
		after: z.string().nullable(),
		before: z.string().nullable(),
		children: z.array(ListingChildSchema),
	}),
});

// ── Listing Params (shared across listing endpoints) ──────────────────────────

const ListingParamsSchema = z.object({
	limit: z.number().min(1).max(100).optional(),
	after: z.string().optional(),
	before: z.string().optional(),
	count: z.number().optional(),
});

// ── Input Schemas ─────────────────────────────────────────────────────────────

const GetHotPostsInputSchema = z
	.object({
		subreddit: z.string(),
	})
	.merge(ListingParamsSchema);

// ── Output Schemas ────────────────────────────────────────────────────────────

const GetHotPostsResponseSchema = z
	.object({
		posts: z.array(PostDataSchema),
		after: z.string().nullable(),
		before: z.string().nullable(),
		dist: z.number(),
	})
	.passthrough();

// ── Endpoint I/O Maps ─────────────────────────────────────────────────────────

export const RedditEndpointInputSchemas = {
	subredditsGetHot: GetHotPostsInputSchema,
} as const;

export const RedditEndpointOutputSchemas = {
	subredditsGetHot: GetHotPostsResponseSchema,
} as const;

export type RedditEndpointInputs = {
	[K in keyof typeof RedditEndpointInputSchemas]: z.infer<
		(typeof RedditEndpointInputSchemas)[K]
	>;
};

export type RedditEndpointOutputs = {
	[K in keyof typeof RedditEndpointOutputSchemas]: z.infer<
		(typeof RedditEndpointOutputSchemas)[K]
	>;
};

export type GetHotPostsResponse = z.infer<typeof GetHotPostsResponseSchema>;
