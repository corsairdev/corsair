import { z } from 'zod';
import { PostOnceAccount, PostOncePost } from '../schema/database';

/**
 * Every route answers `{ data: … }`; list routes may add `meta`.
 * Spec: https://postonce.to/api/openapi.json
 */

const PostIdInput = z.string().min(1).describe('Aggregate post id (UUID)');

/**
 * `components.schemas.MediaInput`. Only `url` is required; PostOnce does not
 * fetch it during validation.
 */
const MediaInputSchema = z.object({
	url: z
		.string()
		.min(1)
		.describe(
			'Absolute HTTP or HTTPS image or video URL that PostOnce downloads when it publishes',
		),
	type: z.enum(['image', 'video']).optional(),
	width: z.number().int().optional(),
	height: z.number().int().optional(),
	size: z.number().int().optional().describe('File size in bytes'),
	duration: z.number().optional().describe('Video duration in seconds'),
	thumbnail_url: z
		.string()
		.optional()
		.describe(
			'Cover image for a video (JPEG or PNG, 8 MB or less): Instagram Reels and Stories, Facebook Reels and TikTok',
		),
});

/** `components.schemas.PostTargetInput`. */
const PostTargetInputSchema = z.object({
	account_id: z
		.string()
		.min(1)
		.describe('Connected account id from accounts.list'),
	content_override: z
		.string()
		.nullable()
		.optional()
		.describe('Text for this account instead of the shared content'),
	platform_options: z
		.record(z.string(), z.unknown())
		.nullable()
		.optional()
		.describe(
			'Platform-specific settings, e.g. { title } for YouTube or Vimeo, { ai_generated: true } for TikTok, YouTube or Instagram. See https://docs.postonce.to/api-reference/create-post',
		),
});

/**
 * POST /v1/posts
 * Official: https://docs.postonce.to/api-reference/create-post
 *
 * Creates one logical post across the listed accounts. With `publish_at` it
 * is scheduled; without it PostOnce publishes right away.
 */
const CreatePostInputSchema = z.object({
	content: z.string().optional().describe('Post text shared by every target'),
	targets: z
		.array(PostTargetInputSchema)
		.describe('One entry per connected account to publish to'),
	media: z
		.array(MediaInputSchema)
		.optional()
		.describe('Images or a video, by URL'),
	publish_at: z
		.string()
		.nullable()
		.optional()
		.describe(
			'ISO-8601 date-time to schedule the post; omit to publish immediately',
		),
	external_id: z
		.string()
		.nullable()
		.optional()
		.describe('Your own reference, returned on the post'),
	idempotencyKey: z
		.string()
		.min(1)
		.max(200)
		.optional()
		.describe(
			'Sent as the Idempotency-Key header. A repeat with the same body returns the original post instead of creating a duplicate.',
		),
});

const PostEnvelopeSchema = z
	.object({
		data: PostOncePost,
	})
	.loose();

/**
 * GET /v1/posts/{id}
 * Official: https://docs.postonce.to/api-reference/get-post
 */
const GetPostInputSchema = z.object({
	id: PostIdInput,
});

/**
 * GET /v1/posts
 * Official: https://docs.postonce.to/api-reference/list-posts
 *
 * Newest first. `meta.next_cursor` is the `after` value for the next page,
 * or null on the last page.
 */
const ListPostsInputSchema = z.object({
	limit: z
		.number()
		.int()
		.min(1)
		.max(100)
		.optional()
		.describe('Maximum number of posts to return (1-100, default 20)'),
	after: z
		.string()
		.min(1)
		.optional()
		.describe('Cursor from a previous response (meta.next_cursor)'),
});

const ListPostsResponseSchema = z
	.object({
		data: z.array(PostOncePost),
		meta: z
			.object({
				next_cursor: z.string().nullable().optional(),
			})
			.loose()
			.optional(),
	})
	.loose();

/**
 * POST /v1/posts/{id}/cancel
 * Official: https://docs.postonce.to/api-reference/cancel-post
 *
 * Cancels a scheduled or still-pending post. The post record and any content
 * already published on a network are kept.
 */
const CancelPostInputSchema = z.object({
	id: PostIdInput,
});

/**
 * GET /v1/accounts
 * Official: https://docs.postonce.to/api-reference/list-accounts
 *
 * Every account owned by the key's profile, disconnected ones included.
 */
const ListAccountsResponseSchema = z
	.object({
		data: z.array(PostOnceAccount),
	})
	.loose();

export type CreatePostInput = z.infer<typeof CreatePostInputSchema>;
export type GetPostInput = z.infer<typeof GetPostInputSchema>;
export type ListPostsInput = z.infer<typeof ListPostsInputSchema>;
export type CancelPostInput = z.infer<typeof CancelPostInputSchema>;
export type PostResponse = z.infer<typeof PostEnvelopeSchema>;
export type ListPostsResponse = z.infer<typeof ListPostsResponseSchema>;
export type ListAccountsResponse = z.infer<typeof ListAccountsResponseSchema>;

export type PostOnceEndpointInputs = {
	listAccounts: Record<string, never>;
	createPost: CreatePostInput;
	getPost: GetPostInput;
	listPosts: ListPostsInput;
	cancelPost: CancelPostInput;
};

export type PostOnceEndpointOutputs = {
	listAccounts: ListAccountsResponse;
	createPost: PostResponse;
	getPost: PostResponse;
	listPosts: ListPostsResponse;
	cancelPost: PostResponse;
};

export const PostOnceEndpointInputSchemas = {
	listAccounts: z.object({}),
	createPost: CreatePostInputSchema,
	getPost: GetPostInputSchema,
	listPosts: ListPostsInputSchema,
	cancelPost: CancelPostInputSchema,
} as const;

export const PostOnceEndpointOutputSchemas = {
	listAccounts: ListAccountsResponseSchema,
	createPost: PostEnvelopeSchema,
	getPost: PostEnvelopeSchema,
	listPosts: ListPostsResponseSchema,
	cancelPost: PostEnvelopeSchema,
} as const;
