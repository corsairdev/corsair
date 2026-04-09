import { z } from 'zod';

// ── Shared Sub-schemas ────────────────────────────────────────────────────────

const HackerNewsHitSchema = z
	.object({
		objectID: z.string().optional(),
		title: z.string().optional(),
		url: z.string().nullable().optional(),
		author: z.string().optional(),
		points: z.number().nullable().optional(),
		story_id: z.number().nullable().optional(),
		story_url: z.string().nullable().optional(),
		story_title: z.string().nullable().optional(),
		comment_text: z.string().nullable().optional(),
		story_text: z.string().nullable().optional(),
		created_at: z.string().optional(),
		created_at_i: z.number().optional(),
		num_comments: z.number().nullable().optional(),
		_tags: z.array(z.string()).optional(),
	})
	.passthrough();

const HackerNewsPostSchema = z
	.object({
		objectID: z.string().optional(),
		title: z.string().optional(),
		url: z.string().nullable().optional(),
		author: z.string().optional(),
		points: z.number().nullable().optional(),
		story_id: z.number().nullable().optional(),
		created_at: z.string().optional(),
		num_comments: z.number().nullable().optional(),
	})
	.passthrough();

const FrontpagePostSchema = HackerNewsPostSchema.extend({
	story_text: z.string().nullable().optional(),
}).passthrough();

const HackerNewsItemDetailedSchema = z
	.object({
		id: z.number(),
		type: z.string().optional(),
		author: z.string().optional(),
		title: z.string().nullable().optional(),
		url: z.string().nullable().optional(),
		text: z.string().nullable().optional(),
		points: z.number().nullable().optional(),
		parent_id: z.number().nullable().optional(),
		story_id: z.number().nullable().optional(),
		created_at: z.string().optional(),
		created_at_i: z.number().optional(),
		// options contains pollopt child IDs for poll items
		options: z.array(z.number()).optional(),
		// children is z.record(z.unknown()) because each child has the same nested shape
		// but strict recursive typing at runtime causes schema complexity issues
		children: z.array(z.record(z.unknown())).optional(),
		children_shown: z.number().optional(),
		max_depth_reached: z.boolean().optional(),
		children_truncated: z.boolean().optional(),
		total_children_count: z.number().optional(),
	})
	.passthrough();

// ── Input Schemas ─────────────────────────────────────────────────────────────

const GetItemInputSchema = z.object({
	id: z.number(),
});

const GetItemWithIdInputSchema = z.object({
	item_id: z.string(),
	max_depth: z.number().optional(),
	max_children: z.number().optional(),
	truncate_text: z.boolean().optional(),
});

const GetMaxItemIdInputSchema = z.object({
	print: z.string().optional(),
});

const GetTopStoriesInputSchema = z.object({
	print: z.enum(['pretty']).optional(),
});

const GetBestStoriesInputSchema = z.object({
	print: z.enum(['pretty']).optional(),
});

const GetNewStoriesInputSchema = z.object({
	print: z.enum(['pretty']).optional(),
});

const GetAskStoriesInputSchema = z.object({
	print: z.enum(['pretty']).optional(),
});

const GetShowStoriesInputSchema = z.object({
	print: z.enum(['pretty']).optional(),
});

const GetJobStoriesInputSchema = z.object({
	print: z.enum(['pretty']).optional(),
});

const GetUserInputSchema = z.object({
	username: z.string(),
});

const GetUserByUsernameInputSchema = z.object({
	username: z.string(),
});

const SearchPostsInputSchema = z.object({
	query: z.string(),
	tags: z.array(z.string()).optional(),
	page: z.number().optional(),
	size: z.number().optional(),
});

const GetLatestPostsInputSchema = z.object({
	tags: z.array(z.string()).optional(),
	page: z.number().optional(),
	size: z.number().optional(),
});

const GetFrontpageInputSchema = z.object({
	min_points: z.number().optional(),
});

const GetTodaysPostsInputSchema = z.object({
	min_points: z.number().optional(),
	page: z.number().optional(),
	size: z.number().optional(),
});

const GetUpdatesInputSchema = z.object({
	print: z.string().optional(),
});

// ── Output Schemas ────────────────────────────────────────────────────────────

const GetItemResponseSchema = z
	.object({
		id: z.number(),
		type: z.enum(['job', 'story', 'comment', 'poll', 'pollopt']),
		by: z.string().optional(),
		title: z.string().optional(),
		url: z.string().optional(),
		text: z.string().optional(),
		score: z.number().optional(),
		time: z.number().optional(),
		descendants: z.number().optional(),
		parent: z.number().optional(),
		poll: z.number().optional(),
		kids: z.array(z.number()).optional(),
		parts: z.array(z.number()).optional(),
		dead: z.boolean().optional(),
		deleted: z.boolean().optional(),
	})
	.passthrough();

const GetItemWithIdResponseSchema = z
	.object({
		found: z.boolean(),
		item: HackerNewsItemDetailedSchema.optional(),
		error_message: z.string().optional(),
	})
	.passthrough();

const GetMaxItemIdResponseSchema = z
	.object({
		max_item_id: z.number(),
	})
	.passthrough();

const GetTopStoriesResponseSchema = z
	.object({
		story_ids: z.array(z.number()),
		count: z.number(),
	})
	.passthrough();

const GetBestStoriesResponseSchema = z
	.object({
		story_ids: z.array(z.number()),
		count: z.number(),
	})
	.passthrough();

const GetNewStoriesResponseSchema = z
	.object({
		story_ids: z.array(z.number()),
	})
	.passthrough();

const GetAskStoriesResponseSchema = z
	.object({
		story_ids: z.array(z.number()),
	})
	.passthrough();

const GetShowStoriesResponseSchema = z
	.object({
		story_ids: z.array(z.number()),
	})
	.passthrough();

const GetJobStoriesResponseSchema = z
	.object({
		job_story_ids: z.array(z.number()),
	})
	.passthrough();

const GetUserResponseSchema = z
	.object({
		username: z.string(),
		karma: z.number(),
		about: z.string().optional(),
	})
	.passthrough();

const GetUserByUsernameResponseSchema = z
	.object({
		id: z.string(),
		karma: z.number(),
		created: z.number(),
		about: z.string().optional(),
		submitted: z.array(z.number()).optional(),
	})
	.passthrough();

const SearchPostsResponseSchema = z
	.object({
		hits: z.array(HackerNewsHitSchema),
		nbHits: z.number(),
		page: z.number(),
		nbPages: z.number(),
		hitsPerPage: z.number(),
		query: z.string(),
	})
	.passthrough();

const GetLatestPostsResponseSchema = z
	.object({
		hits: z.array(HackerNewsHitSchema),
		nbHits: z.number(),
		page: z.number(),
		nbPages: z.number(),
		hitsPerPage: z.number(),
	})
	.passthrough();

const GetFrontpageResponseSchema = z
	.object({
		posts: z.array(FrontpagePostSchema),
		total_hits: z.number(),
	})
	.passthrough();

const GetTodaysPostsResponseSchema = z
	.object({
		hits: z.array(HackerNewsPostSchema),
		nbHits: z.number(),
		page: z.number(),
		nbPages: z.number(),
		hitsPerPage: z.number(),
	})
	.passthrough();

const GetUpdatesResponseSchema = z
	.object({
		items: z.array(z.number()),
		profiles: z.array(z.string()),
	})
	.passthrough();

// ── Endpoint I/O Maps ─────────────────────────────────────────────────────────

export const HackerNewsEndpointInputSchemas = {
	itemsGet: GetItemInputSchema,
	itemsGetWithId: GetItemWithIdInputSchema,
	itemsGetMaxId: GetMaxItemIdInputSchema,
	storiesGetTop: GetTopStoriesInputSchema,
	storiesGetBest: GetBestStoriesInputSchema,
	storiesGetNew: GetNewStoriesInputSchema,
	storiesGetAsk: GetAskStoriesInputSchema,
	storiesGetShow: GetShowStoriesInputSchema,
	storiesGetJobs: GetJobStoriesInputSchema,
	usersGet: GetUserInputSchema,
	usersGetByUsername: GetUserByUsernameInputSchema,
	searchPosts: SearchPostsInputSchema,
	searchGetLatest: GetLatestPostsInputSchema,
	searchGetFrontpage: GetFrontpageInputSchema,
	searchGetTodays: GetTodaysPostsInputSchema,
	updatesGet: GetUpdatesInputSchema,
} as const;

export const HackerNewsEndpointOutputSchemas = {
	itemsGet: GetItemResponseSchema,
	itemsGetWithId: GetItemWithIdResponseSchema,
	itemsGetMaxId: GetMaxItemIdResponseSchema,
	storiesGetTop: GetTopStoriesResponseSchema,
	storiesGetBest: GetBestStoriesResponseSchema,
	storiesGetNew: GetNewStoriesResponseSchema,
	storiesGetAsk: GetAskStoriesResponseSchema,
	storiesGetShow: GetShowStoriesResponseSchema,
	storiesGetJobs: GetJobStoriesResponseSchema,
	usersGet: GetUserResponseSchema,
	usersGetByUsername: GetUserByUsernameResponseSchema,
	searchPosts: SearchPostsResponseSchema,
	searchGetLatest: GetLatestPostsResponseSchema,
	searchGetFrontpage: GetFrontpageResponseSchema,
	searchGetTodays: GetTodaysPostsResponseSchema,
	updatesGet: GetUpdatesResponseSchema,
} as const;

export type HackerNewsEndpointInputs = {
	[K in keyof typeof HackerNewsEndpointInputSchemas]: z.infer<
		(typeof HackerNewsEndpointInputSchemas)[K]
	>;
};

export type HackerNewsEndpointOutputs = {
	[K in keyof typeof HackerNewsEndpointOutputSchemas]: z.infer<
		(typeof HackerNewsEndpointOutputSchemas)[K]
	>;
};

export type GetItemResponse = z.infer<typeof GetItemResponseSchema>;
export type GetItemWithIdResponse = z.infer<typeof GetItemWithIdResponseSchema>;
export type GetMaxItemIdResponse = z.infer<typeof GetMaxItemIdResponseSchema>;
export type GetTopStoriesResponse = z.infer<typeof GetTopStoriesResponseSchema>;
export type GetBestStoriesResponse = z.infer<
	typeof GetBestStoriesResponseSchema
>;
export type GetNewStoriesResponse = z.infer<typeof GetNewStoriesResponseSchema>;
export type GetAskStoriesResponse = z.infer<typeof GetAskStoriesResponseSchema>;
export type GetShowStoriesResponse = z.infer<
	typeof GetShowStoriesResponseSchema
>;
export type GetJobStoriesResponse = z.infer<typeof GetJobStoriesResponseSchema>;
export type GetUserResponse = z.infer<typeof GetUserResponseSchema>;
export type GetUserByUsernameResponse = z.infer<
	typeof GetUserByUsernameResponseSchema
>;
export type SearchPostsResponse = z.infer<typeof SearchPostsResponseSchema>;
export type GetLatestPostsResponse = z.infer<
	typeof GetLatestPostsResponseSchema
>;
export type GetFrontpageResponse = z.infer<typeof GetFrontpageResponseSchema>;
export type GetTodaysPostsResponse = z.infer<
	typeof GetTodaysPostsResponseSchema
>;
export type GetUpdatesResponse = z.infer<typeof GetUpdatesResponseSchema>;
