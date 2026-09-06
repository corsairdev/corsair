import { z } from 'zod';

// ─────────────────────────────────────────────────────────────────────────────
// Core Canny Models
// ─────────────────────────────────────────────────────────────────────────────

export const CannyUserSchema = z
	.object({
		id: z.string(),
		created: z.string(),
		email: z.string().nullable().optional(),
		name: z.string(),
		userID: z.string().nullable().optional(),
		url: z.string(),
		isAdmin: z.boolean(),
		avatarURL: z.string().nullable().optional(),
	})
	.passthrough();

export type CannyUser = z.infer<typeof CannyUserSchema>;

export const CannyBoardSchema = z
	.object({
		id: z.string(),
		created: z.string(),
		isPrivate: z.boolean(),
		name: z.string(),
		postCount: z.number(),
		privateComments: z.boolean().optional(),
		token: z.string().optional(),
		url: z.string(),
	})
	.passthrough();

export type CannyBoardModel = z.infer<typeof CannyBoardSchema>;

export const CannyCategorySchema = z
	.object({
		id: z.string(),
		name: z.string(),
		url: z.string().optional(),
		postCount: z.number().optional(),
		parentID: z.string().nullable().optional(),
	})
	.passthrough();

export type CannyCategory = z.infer<typeof CannyCategorySchema>;

export const CannyTagSchema = z
	.object({
		id: z.string(),
		name: z.string(),
		url: z.string().optional(),
		postCount: z.number().optional(),
	})
	.passthrough();

export type CannyTag = z.infer<typeof CannyTagSchema>;

export const CannyPostSchema = z
	.object({
		id: z.string(),
		author: CannyUserSchema,
		board: CannyBoardSchema,
		category: CannyCategorySchema.nullable().optional(),
		commentCount: z.number(),
		created: z.string(),
		details: z.string().optional(),
		eta: z.string().nullable().optional(),
		imageURLs: z.array(z.string()).optional(),
		score: z.number(),
		status: z.string(),
		tags: z.array(CannyTagSchema).optional(),
		title: z.string(),
		url: z.string(),
		owner: CannyUserSchema.nullable().optional(),
		customFields: z
			.record(
				z.string(),
				z.union([z.string(), z.number(), z.boolean(), z.null()]),
			)
			.optional(),
	})
	.passthrough();

export type CannyPostModel = z.infer<typeof CannyPostSchema>;

export const CannyCommentSchema = z
	.object({
		id: z.string(),
		author: CannyUserSchema,
		board: CannyBoardSchema.optional(),
		created: z.string(),
		deleteStatus: z.string().nullable().optional(),
		imageURLs: z.array(z.string()).optional(),
		internal: z.boolean().optional(),
		likeCount: z.number().optional(),
		parentID: z.string().nullable().optional(),
		post: CannyPostSchema.optional(),
		value: z.string(),
	})
	.passthrough();

export type CannyCommentModel = z.infer<typeof CannyCommentSchema>;

export const CannyVoteSchema = z
	.object({
		id: z.string(),
		board: CannyBoardSchema.optional(),
		by: CannyUserSchema.nullable().optional(),
		created: z.string(),
		post: CannyPostSchema.optional(),
		voter: CannyUserSchema.optional(),
	})
	.passthrough();

export type CannyVoteModel = z.infer<typeof CannyVoteSchema>;

// Aliases matching prompt
export type Board = CannyBoardModel;
export type Post = CannyPostModel;
export type Comment = CannyCommentModel;
export type Vote = CannyVoteModel;
export type User = CannyUser;
export type Category = CannyCategory;
export type Tag = CannyTag;

// ─────────────────────────────────────────────────────────────────────────────
// Boards Endpoint Schemas & Types
// ─────────────────────────────────────────────────────────────────────────────

export const BoardsListInputSchema = z
	.object({})
	.strict()
	.optional()
	.default({});

export type BoardsListInput = z.infer<typeof BoardsListInputSchema>;

export const BoardsListResponseSchema = z.object({
	boards: z.array(CannyBoardSchema),
});

export type BoardsListResponse = z.infer<typeof BoardsListResponseSchema>;

export const BoardsRetrieveInputSchema = z.object({
	id: z.string(),
});

export type BoardsRetrieveInput = z.infer<typeof BoardsRetrieveInputSchema>;

export const BoardsRetrieveResponseSchema = CannyBoardSchema;

export type BoardsRetrieveResponse = z.infer<
	typeof BoardsRetrieveResponseSchema
>;

// ─────────────────────────────────────────────────────────────────────────────
// Posts Endpoint Schemas & Types
// ─────────────────────────────────────────────────────────────────────────────

export const PostsListInputSchema = z
	.object({
		authorID: z.string().optional(),
		boardID: z.string().optional(),
		categoryID: z.string().optional(),
		companyID: z.string().optional(),
		limit: z.number().int().positive().optional(),
		search: z.string().optional(),
		skip: z.number().int().nonnegative().optional(),
		sort: z
			.enum([
				'newest',
				'oldest',
				'relevance',
				'score',
				'statusChanged',
				'trending',
			])
			.optional(),
		status: z
			.enum([
				'open',
				'under review',
				'planned',
				'in progress',
				'complete',
				'closed',
			])
			.optional(),
		tagID: z.string().optional(),
	})
	.optional()
	.default({});

export type PostsListInput = z.infer<typeof PostsListInputSchema>;

export const PostsListResponseSchema = z.object({
	hasMore: z.boolean(),
	posts: z.array(CannyPostSchema),
});

export type PostsListResponse = z.infer<typeof PostsListResponseSchema>;

export const PostsRetrieveInputSchema = z
	.object({
		id: z.string().optional(),
		url: z.string().optional(),
	})
	.refine((data) => data.id !== undefined || data.url !== undefined, {
		message: 'Either id or url must be provided',
	});

export type PostsRetrieveInput = z.infer<typeof PostsRetrieveInputSchema>;

export const PostsRetrieveResponseSchema = CannyPostSchema;

export type PostsRetrieveResponse = z.infer<typeof PostsRetrieveResponseSchema>;

export const PostsCreateInputSchema = z.object({
	authorID: z.string(),
	boardID: z.string(),
	title: z.string(),
	details: z.string().optional(),
	categoryID: z.string().optional(),
	customFields: z
		.record(
			z.string(),
			z.union([z.string(), z.number(), z.boolean(), z.null()]),
		)
		.optional(),
	eta: z.string().optional(),
	imageURLs: z.array(z.string()).optional(),
	publishedAt: z.string().optional(),
});

export type PostsCreateInput = z.infer<typeof PostsCreateInputSchema>;

export const PostsCreateResponseSchema = z.object({
	id: z.string(),
});

export type PostsCreateResponse = z.infer<typeof PostsCreateResponseSchema>;

export const PostsChangeStatusInputSchema = z.object({
	changerID: z.string(),
	commentValue: z.string().optional(),
	postID: z.string(),
	shouldNotifyVoters: z.boolean().optional(),
	status: z.enum([
		'open',
		'under review',
		'planned',
		'in progress',
		'complete',
		'closed',
	]),
});

export type PostsChangeStatusInput = z.infer<
	typeof PostsChangeStatusInputSchema
>;

export const PostsChangeStatusResponseSchema = CannyPostSchema;

export type PostsChangeStatusResponse = z.infer<
	typeof PostsChangeStatusResponseSchema
>;

export const PostsDeleteInputSchema = z.object({
	postID: z.string(),
});

export type PostsDeleteInput = z.infer<typeof PostsDeleteInputSchema>;

export const PostsDeleteResponseSchema = z.union([
	z.literal('success'),
	z.string(),
]);

export type PostsDeleteResponse = z.infer<typeof PostsDeleteResponseSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// Comments Endpoint Schemas & Types
// ─────────────────────────────────────────────────────────────────────────────

export const CommentsListInputSchema = z
	.object({
		authorID: z.string().optional(),
		boardID: z.string().optional(),
		companyID: z.string().optional(),
		limit: z.number().int().positive().optional(),
		postID: z.string().optional(),
		skip: z.number().int().nonnegative().optional(),
	})
	.optional()
	.default({});

export type CommentsListInput = z.infer<typeof CommentsListInputSchema>;

export const CommentsListResponseSchema = z.object({
	comments: z.array(CannyCommentSchema),
	hasMore: z.boolean(),
});

export type CommentsListResponse = z.infer<typeof CommentsListResponseSchema>;

export const CommentsCreateInputSchema = z.object({
	authorID: z.string(),
	postID: z.string(),
	value: z.string(),
	imageURLs: z.array(z.string()).optional(),
	internal: z.boolean().optional(),
	parentID: z.string().optional(),
});

export type CommentsCreateInput = z.infer<typeof CommentsCreateInputSchema>;

export const CommentsCreateResponseSchema = z.object({
	id: z.string(),
});

export type CommentsCreateResponse = z.infer<
	typeof CommentsCreateResponseSchema
>;

export const CommentsDeleteInputSchema = z.object({
	commentID: z.string(),
});

export type CommentsDeleteInput = z.infer<typeof CommentsDeleteInputSchema>;

export const CommentsDeleteResponseSchema = z.union([
	z.literal('success'),
	z.string(),
]);

export type CommentsDeleteResponse = z.infer<
	typeof CommentsDeleteResponseSchema
>;

// ─────────────────────────────────────────────────────────────────────────────
// Votes Endpoint Schemas & Types
// ─────────────────────────────────────────────────────────────────────────────

export const VotesListInputSchema = z
	.object({
		boardID: z.string().optional(),
		companyID: z.string().optional(),
		limit: z.number().int().positive().optional(),
		postID: z.string().optional(),
		skip: z.number().int().nonnegative().optional(),
		userID: z.string().optional(),
	})
	.optional()
	.default({});

export type VotesListInput = z.infer<typeof VotesListInputSchema>;

export const VotesListResponseSchema = z.object({
	hasMore: z.boolean(),
	votes: z.array(CannyVoteSchema),
});

export type VotesListResponse = z.infer<typeof VotesListResponseSchema>;

export const VotesCreateInputSchema = z.object({
	postID: z.string(),
	voterID: z.string(),
});

export type VotesCreateInput = z.infer<typeof VotesCreateInputSchema>;

export const VotesCreateResponseSchema = z.union([
	z.literal('success'),
	z.string(),
]);

export type VotesCreateResponse = z.infer<typeof VotesCreateResponseSchema>;

export const VotesDeleteInputSchema = z.object({
	id: z.string().optional(),
	postID: z.string().optional(),
	voterID: z.string().optional(),
});

export type VotesDeleteInput = z.infer<typeof VotesDeleteInputSchema>;

export const VotesDeleteResponseSchema = z.union([
	z.literal('success'),
	z.string(),
]);

export type VotesDeleteResponse = z.infer<typeof VotesDeleteResponseSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// Endpoint Input & Output Collections
// ─────────────────────────────────────────────────────────────────────────────

export type CannyEndpointInputs = {
	boardsList: BoardsListInput;
	boardsRetrieve: BoardsRetrieveInput;
	postsList: PostsListInput;
	postsRetrieve: PostsRetrieveInput;
	postsCreate: PostsCreateInput;
	postsChangeStatus: PostsChangeStatusInput;
	postsDelete: PostsDeleteInput;
	commentsList: CommentsListInput;
	commentsCreate: CommentsCreateInput;
	commentsDelete: CommentsDeleteInput;
	votesList: VotesListInput;
	votesCreate: VotesCreateInput;
	votesDelete: VotesDeleteInput;
};

export type CannyEndpointOutputs = {
	boardsList: BoardsListResponse;
	boardsRetrieve: BoardsRetrieveResponse;
	postsList: PostsListResponse;
	postsRetrieve: PostsRetrieveResponse;
	postsCreate: PostsCreateResponse;
	postsChangeStatus: PostsChangeStatusResponse;
	postsDelete: PostsDeleteResponse;
	commentsList: CommentsListResponse;
	commentsCreate: CommentsCreateResponse;
	commentsDelete: CommentsDeleteResponse;
	votesList: VotesListResponse;
	votesCreate: VotesCreateResponse;
	votesDelete: VotesDeleteResponse;
};

export const CannyEndpointInputSchemas = {
	boardsList: BoardsListInputSchema,
	boardsRetrieve: BoardsRetrieveInputSchema,
	postsList: PostsListInputSchema,
	postsRetrieve: PostsRetrieveInputSchema,
	postsCreate: PostsCreateInputSchema,
	postsChangeStatus: PostsChangeStatusInputSchema,
	postsDelete: PostsDeleteInputSchema,
	commentsList: CommentsListInputSchema,
	commentsCreate: CommentsCreateInputSchema,
	commentsDelete: CommentsDeleteInputSchema,
	votesList: VotesListInputSchema,
	votesCreate: VotesCreateInputSchema,
	votesDelete: VotesDeleteInputSchema,
} as const;

export const CannyEndpointOutputSchemas = {
	boardsList: BoardsListResponseSchema,
	boardsRetrieve: BoardsRetrieveResponseSchema,
	postsList: PostsListResponseSchema,
	postsRetrieve: PostsRetrieveResponseSchema,
	postsCreate: PostsCreateResponseSchema,
	postsChangeStatus: PostsChangeStatusResponseSchema,
	postsDelete: PostsDeleteResponseSchema,
	commentsList: CommentsListResponseSchema,
	commentsCreate: CommentsCreateResponseSchema,
	commentsDelete: CommentsDeleteResponseSchema,
	votesList: VotesListResponseSchema,
	votesCreate: VotesCreateResponseSchema,
	votesDelete: VotesDeleteResponseSchema,
} as const;
