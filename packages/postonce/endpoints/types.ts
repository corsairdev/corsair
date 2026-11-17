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

/**
 * PATCH /v1/posts/{id}
 * Official: https://docs.postonce.to/api-reference/update-post
 *
 * Changes a scheduled post before it runs. Only the fields sent change.
 */
const UpdatePostInputSchema = z.object({
	id: PostIdInput,
	content: z.string().optional().describe('New post text'),
	targets: z
		.array(PostTargetInputSchema)
		.optional()
		.describe('Replaces the list of accounts to publish to'),
	media: z
		.array(MediaInputSchema)
		.optional()
		.describe('Replaces the images or video'),
	publish_at: z
		.string()
		.nullable()
		.optional()
		.describe('New ISO-8601 publish time'),
	external_id: z.string().nullable().optional(),
});

/**
 * POST /v1/posts/{id}/publish
 * Official: https://docs.postonce.to/api-reference/publish-post
 */
const PublishPostInputSchema = z.object({ id: PostIdInput });

/**
 * POST /v1/posts/{id}/targets/{targetId}/retry
 * Official: https://docs.postonce.to/api-reference/retry-post-target
 *
 * Retries one failed destination; published siblings are not replayed.
 */
const RetryPostTargetInputSchema = z.object({
	id: PostIdInput,
	targetId: z
		.string()
		.min(1)
		.describe("Id of the failed target, from the post's targets[]"),
});

const RetryPostTargetResponseSchema = PostEnvelopeSchema;

/** Analytics numbers are null until a platform reports them. */
const metric = z.number().nullable().optional();

/**
 * GET /v1/posts/{id}/analytics
 * Official: https://docs.postonce.to/api-reference/get-post-analytics
 */
const GetPostAnalyticsInputSchema = z.object({ id: PostIdInput });

const PostTargetAnalyticsSchema = z
	.object({
		account_id: z.string().optional(),
		platform: z.string().optional(),
		platform_post_id: z.string().nullable().optional(),
		url: z.string().nullable().optional(),
		published_at: z.string().nullable().optional(),
		metrics_status: z
			.string()
			.optional()
			.describe('ok, reconnect, limited or unavailable'),
		views: metric,
		likes: metric,
		comments: metric,
		shares: metric,
		saves: metric,
		engagement_rate: metric,
		last_updated: z.string().nullable().optional(),
	})
	.loose();

const GetPostAnalyticsResponseSchema = z
	.object({
		data: z
			.object({
				id: z.string().optional(),
				media_url: z.string().nullable().optional(),
				targets: z.array(PostTargetAnalyticsSchema).optional(),
			})
			.loose(),
	})
	.loose();

/**
 * GET /v1/analytics
 * Official: https://docs.postonce.to/api-reference/get-analytics
 *
 * Views, likes, comments, shares and saves for posts the connected TikTok,
 * Instagram, YouTube and Facebook accounts published in the range, including
 * posts made outside PostOnce.
 */
const GetAnalyticsInputSchema = z.object({
	days: z
		.union([z.literal(7), z.literal(30), z.literal(90)])
		.optional()
		.describe('Range in days: 7, 30 or 90 (default 30)'),
	account_id: z
		.string()
		.min(1)
		.optional()
		.describe('Only this connected account'),
	external_user_id: z
		.string()
		.min(1)
		.optional()
		.describe('Only accounts connected for this end user of yours'),
});

// The analytics report nests per-account and per-post records whose fields
// PostOnce documents loosely and extends over time; known fields are typed and
// the rest pass through.
const GetAnalyticsResponseSchema = z
	.object({
		data: z
			.object({
				range: z
					.object({
						days: z.number().optional(),
						start: z.string().optional(),
						end: z.string().optional(),
					})
					.loose()
					.optional(),
				accounts: z
					.array(
						z
							.object({
								id: z.string().optional(),
								platform: z.string().optional(),
								username: z.string().nullable().optional(),
								metrics_status: z.string().optional(),
								posts_with_views: z.number().optional(),
								median_views: metric,
								followers: metric,
								followers_observed_at: z.string().nullable().optional(),
							})
							.loose(),
					)
					.optional(),
				posts: z
					.array(
						z
							.object({
								id: z.string().optional(),
								post_id: z.string().nullable().optional(),
								title: z.string().nullable().optional(),
								caption: z.string().nullable().optional(),
							})
							.loose(),
					)
					.optional(),
			})
			.loose(),
	})
	.loose();

const DraftIdInput = z.string().min(1).describe('Draft id (UUID)');

/** `components.schemas.DraftMediaInput`: `url` and `type` are required. */
const DraftMediaInputSchema = z.object({
	url: z.string().min(1).describe('Image or video URL'),
	type: z.enum(['image', 'video']),
	file_name: z.string().optional(),
	mime_type: z.string().optional(),
	width: z.number().int().min(0).optional(),
	height: z.number().int().min(0).optional(),
	size: z.number().int().min(0).optional().describe('File size in bytes'),
	duration: z.number().min(0).optional().describe('Video duration in seconds'),
	thumbnail_url: z.string().nullable().optional(),
});

const DraftFields = {
	content: z.string().optional().describe('Draft text'),
	candidate_angle: z
		.string()
		.optional()
		.describe('A note on the angle or hook this draft tries'),
	media: z.array(DraftMediaInputSchema).optional(),
	selected_account_ids: z
		.array(z.string().min(1))
		.optional()
		.describe('Connected account ids the draft is meant for'),
	suggested_platforms: z
		.array(z.string())
		.optional()
		.describe('Platform names, e.g. linkedin or x'),
};

const DraftSchema = z
	.object({
		id: z.string(),
		content: z.string().nullable().optional(),
		candidate_angle: z.string().nullable().optional(),
		media: z.array(z.object({}).loose()).nullable().optional(),
		selected_account_ids: z.array(z.string()).nullable().optional(),
		suggested_platforms: z.array(z.string()).nullable().optional(),
		source_type: z.string().nullable().optional(),
		status: z
			.string()
			.optional()
			.describe('inbox, ready, scheduled or archived'),
		created_at: z.string().optional(),
		updated_at: z
			.string()
			.optional()
			.describe('Pass as expected_updated_at to drafts.update'),
	})
	.loose();

const DraftEnvelopeSchema = z.object({ data: DraftSchema }).loose();

/**
 * GET /v1/drafts
 * Official: https://docs.postonce.to/api-reference/list-drafts
 */
const ListDraftsInputSchema = z.object({
	limit: z.number().int().min(1).max(100).optional(),
	after: z
		.string()
		.min(1)
		.optional()
		.describe('meta.next_after from the previous page'),
	after_id: z
		.string()
		.min(1)
		.optional()
		.describe('meta.next_after_id from the previous page'),
	status: z.enum(['inbox', 'ready', 'archived']).optional(),
});

const ListDraftsResponseSchema = z
	.object({
		data: z.array(DraftSchema),
		meta: z
			.object({
				has_more: z.boolean().optional(),
				next_after: z.string().nullable().optional(),
				next_after_id: z.string().nullable().optional(),
			})
			.loose()
			.optional(),
	})
	.loose();

/**
 * POST /v1/drafts
 * Official: https://docs.postonce.to/api-reference/create-draft
 *
 * Saves content without publishing or scheduling it.
 */
const CreateDraftInputSchema = z.object({
	...DraftFields,
	idempotencyKey: z
		.string()
		.min(1)
		.max(200)
		.optional()
		.describe(
			'Sent as the Idempotency-Key header. A repeat with the same body returns the original draft.',
		),
});

/** GET /v1/drafts/{id} */
const GetDraftInputSchema = z.object({ id: DraftIdInput });

/**
 * PATCH /v1/drafts/{id}
 * Official: https://docs.postonce.to/api-reference/update-draft
 *
 * `expected_updated_at` is the draft's current `updated_at`; PostOnce answers
 * 409 when the draft changed since.
 */
const UpdateDraftInputSchema = z.object({
	id: DraftIdInput,
	expected_updated_at: z
		.string()
		.min(1)
		.describe("The draft's updated_at as last read"),
	...DraftFields,
	status: z
		.enum(['inbox', 'ready', 'archived'])
		.optional()
		.describe('Move the draft: archived archives it, inbox restores it'),
});

/**
 * POST /v1/media/uploads
 * Official: https://docs.postonce.to/api-reference/create-media-upload
 *
 * Returns a signed URL to PUT the file's bytes to, and a media_id that
 * media.get turns into a public URL for posts and drafts.
 */
const CreateMediaUploadInputSchema = z.object({
	filename: z
		.string()
		.min(1)
		.describe('File name with extension, e.g. launch.png'),
	content_type: z.enum([
		'image/jpeg',
		'image/png',
		'image/webp',
		'video/mp4',
		'video/quicktime',
		'video/webm',
	]),
});

const CreateMediaUploadResponseSchema = z
	.object({
		data: z
			.object({
				media_id: z.string(),
				content_type: z.string().optional(),
				path: z.string().optional(),
				upload: z
					.object({
						path: z.string().optional(),
						token: z.string().optional(),
						signedUrl: z
							.string()
							.optional()
							.describe('PUT the raw file bytes here; it expires'),
					})
					.loose()
					.optional(),
			})
			.loose(),
	})
	.loose();

/** GET /v1/media/{id} */
const GetMediaInputSchema = z.object({
	id: z.string().min(1).describe('media_id from media.createUpload'),
});

const GetMediaResponseSchema = z
	.object({
		data: z
			.object({
				id: z.string().optional(),
				path: z.string().optional(),
				public_url: z
					.string()
					.optional()
					.describe('Use as media[].url in posts and drafts'),
			})
			.loose(),
	})
	.loose();

const WorkflowIdInput = z.string().min(1).describe('Workflow id');

// Workflow settings hold content filters and per-destination publishing
// options that PostOnce keeps adding to; they pass through as given.
const WorkflowSettingsSchema = z
	.object({
		content_filters: z
			.object({
				types: z
					.object({
						text: z.boolean().optional(),
						image: z.boolean().optional(),
						quote: z.boolean().optional(),
						video: z.boolean().optional(),
					})
					.optional(),
				hashtags: z
					.object({
						include: z.array(z.string()).optional(),
						exclude: z.array(z.string()).optional(),
					})
					.optional(),
			})
			.loose()
			.optional(),
	})
	.loose();

const WorkflowSchema = z
	.object({
		id: z.string(),
		profile_id: z.string().optional(),
		name: z.string().nullable().optional(),
		description: z.string().nullable().optional(),
		source_account_id: z.string().nullable().optional(),
		target_account_ids: z.array(z.string()).nullable().optional(),
		settings: z.object({}).loose().nullable().optional(),
		is_active: z.boolean().optional(),
		future_content_enabled: z.boolean().optional(),
		created_at: z.string().optional(),
		updated_at: z.string().optional(),
		last_checked: z.string().nullable().optional(),
		last_enabled_at: z.string().nullable().optional(),
	})
	.loose();

const WorkflowEnvelopeSchema = z.object({ data: WorkflowSchema }).loose();

const WorkflowFields = {
	name: z.string().min(1),
	description: z.string().nullable().optional(),
	source_account_id: z
		.string()
		.min(1)
		.describe('Connected account whose new posts are copied'),
	target_account_ids: z
		.array(z.string().min(1))
		.min(1)
		.describe('Connected accounts that get each new post'),
	is_active: z.boolean().optional(),
	future_content_enabled: z.boolean().optional(),
	settings: WorkflowSettingsSchema.optional(),
};

/**
 * POST /v1/workflows
 * Official: https://docs.postonce.to/api-reference/create-workflow
 *
 * An active workflow publishes every new post from the source account to the
 * targets from then on.
 */
const CreateWorkflowInputSchema = z.object({
	...WorkflowFields,
	idempotencyKey: z.string().min(1).max(200).optional(),
});

/** PUT /v1/workflows/{id}: only the fields sent change. */
const UpdateWorkflowInputSchema = z.object({
	id: WorkflowIdInput,
	name: WorkflowFields.name.optional(),
	description: WorkflowFields.description,
	source_account_id: WorkflowFields.source_account_id.optional(),
	target_account_ids: WorkflowFields.target_account_ids.optional(),
	is_active: WorkflowFields.is_active,
	future_content_enabled: WorkflowFields.future_content_enabled,
	settings: WorkflowFields.settings,
});

const WorkflowIdOnlyInputSchema = z.object({ id: WorkflowIdInput });

const ListWorkflowsResponseSchema = z
	.object({ data: z.array(WorkflowSchema) })
	.loose();

const DeleteResponseSchema = z
	.object({
		data: z
			.object({
				deleted: z.boolean().optional(),
				id: z.string().optional(),
			})
			.loose(),
	})
	.loose();

const WebhookIdInput = z.string().min(1).describe('Webhook id (UUID)');

const WebhookSchema = z
	.object({
		id: z.string(),
		url: z.string().optional(),
		description: z.string().nullable().optional(),
		events: z
			.array(z.string())
			.optional()
			.describe('post.published, post.partially_published, post.failed'),
		created_at: z.string().optional(),
	})
	.loose();

/**
 * POST /v1/webhooks
 * Official: https://docs.postonce.to/api-reference/create-webhook
 *
 * Up to 5 per account. The response is the only time the signing secret is
 * returned.
 */
const CreateWebhookInputSchema = z.object({
	url: z
		.string()
		.url()
		.describe('Public HTTPS URL; redirects are not followed'),
	description: z.string().max(200).optional(),
});

const CreateWebhookResponseSchema = z
	.object({
		data: WebhookSchema.extend({
			secret: z
				.string()
				.optional()
				.describe('Signing secret (whsec_...), shown only here'),
		}),
	})
	.loose();

const WebhookIdOnlyInputSchema = z.object({ id: WebhookIdInput });

const ListWebhooksResponseSchema = z
	.object({ data: z.array(WebhookSchema) })
	.loose();

const WebhookEnvelopeSchema = z.object({ data: WebhookSchema }).loose();

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
	updatePost: z.infer<typeof UpdatePostInputSchema>;
	publishPost: z.infer<typeof PublishPostInputSchema>;
	retryPostTarget: z.infer<typeof RetryPostTargetInputSchema>;
	getPostAnalytics: z.infer<typeof GetPostAnalyticsInputSchema>;
	getAnalytics: z.infer<typeof GetAnalyticsInputSchema>;
	listDrafts: z.infer<typeof ListDraftsInputSchema>;
	createDraft: z.infer<typeof CreateDraftInputSchema>;
	getDraft: z.infer<typeof GetDraftInputSchema>;
	updateDraft: z.infer<typeof UpdateDraftInputSchema>;
	createMediaUpload: z.infer<typeof CreateMediaUploadInputSchema>;
	getMedia: z.infer<typeof GetMediaInputSchema>;
	listWorkflows: Record<string, never>;
	getWorkflow: z.infer<typeof WorkflowIdOnlyInputSchema>;
	createWorkflow: z.infer<typeof CreateWorkflowInputSchema>;
	updateWorkflow: z.infer<typeof UpdateWorkflowInputSchema>;
	deleteWorkflow: z.infer<typeof WorkflowIdOnlyInputSchema>;
	listWebhooks: Record<string, never>;
	getWebhook: z.infer<typeof WebhookIdOnlyInputSchema>;
	createWebhook: z.infer<typeof CreateWebhookInputSchema>;
	deleteWebhook: z.infer<typeof WebhookIdOnlyInputSchema>;
};

export type PostOnceEndpointOutputs = {
	listAccounts: ListAccountsResponse;
	createPost: PostResponse;
	getPost: PostResponse;
	listPosts: ListPostsResponse;
	cancelPost: PostResponse;
	updatePost: PostResponse;
	publishPost: PostResponse;
	retryPostTarget: z.infer<typeof RetryPostTargetResponseSchema>;
	getPostAnalytics: z.infer<typeof GetPostAnalyticsResponseSchema>;
	getAnalytics: z.infer<typeof GetAnalyticsResponseSchema>;
	listDrafts: z.infer<typeof ListDraftsResponseSchema>;
	createDraft: z.infer<typeof DraftEnvelopeSchema>;
	getDraft: z.infer<typeof DraftEnvelopeSchema>;
	updateDraft: z.infer<typeof DraftEnvelopeSchema>;
	createMediaUpload: z.infer<typeof CreateMediaUploadResponseSchema>;
	getMedia: z.infer<typeof GetMediaResponseSchema>;
	listWorkflows: z.infer<typeof ListWorkflowsResponseSchema>;
	getWorkflow: z.infer<typeof WorkflowEnvelopeSchema>;
	createWorkflow: z.infer<typeof WorkflowEnvelopeSchema>;
	updateWorkflow: z.infer<typeof WorkflowEnvelopeSchema>;
	deleteWorkflow: z.infer<typeof DeleteResponseSchema>;
	listWebhooks: z.infer<typeof ListWebhooksResponseSchema>;
	getWebhook: z.infer<typeof WebhookEnvelopeSchema>;
	createWebhook: z.infer<typeof CreateWebhookResponseSchema>;
	deleteWebhook: z.infer<typeof DeleteResponseSchema>;
};

export const PostOnceEndpointInputSchemas = {
	listAccounts: z.object({}),
	createPost: CreatePostInputSchema,
	getPost: GetPostInputSchema,
	listPosts: ListPostsInputSchema,
	cancelPost: CancelPostInputSchema,
	updatePost: UpdatePostInputSchema,
	publishPost: PublishPostInputSchema,
	retryPostTarget: RetryPostTargetInputSchema,
	getPostAnalytics: GetPostAnalyticsInputSchema,
	getAnalytics: GetAnalyticsInputSchema,
	listDrafts: ListDraftsInputSchema,
	createDraft: CreateDraftInputSchema,
	getDraft: GetDraftInputSchema,
	updateDraft: UpdateDraftInputSchema,
	createMediaUpload: CreateMediaUploadInputSchema,
	getMedia: GetMediaInputSchema,
	listWorkflows: z.object({}),
	getWorkflow: WorkflowIdOnlyInputSchema,
	createWorkflow: CreateWorkflowInputSchema,
	updateWorkflow: UpdateWorkflowInputSchema,
	deleteWorkflow: WorkflowIdOnlyInputSchema,
	listWebhooks: z.object({}),
	getWebhook: WebhookIdOnlyInputSchema,
	createWebhook: CreateWebhookInputSchema,
	deleteWebhook: WebhookIdOnlyInputSchema,
} as const;

export const PostOnceEndpointOutputSchemas = {
	listAccounts: ListAccountsResponseSchema,
	createPost: PostEnvelopeSchema,
	getPost: PostEnvelopeSchema,
	listPosts: ListPostsResponseSchema,
	cancelPost: PostEnvelopeSchema,
	updatePost: PostEnvelopeSchema,
	publishPost: PostEnvelopeSchema,
	retryPostTarget: RetryPostTargetResponseSchema,
	getPostAnalytics: GetPostAnalyticsResponseSchema,
	getAnalytics: GetAnalyticsResponseSchema,
	listDrafts: ListDraftsResponseSchema,
	createDraft: DraftEnvelopeSchema,
	getDraft: DraftEnvelopeSchema,
	updateDraft: DraftEnvelopeSchema,
	createMediaUpload: CreateMediaUploadResponseSchema,
	getMedia: GetMediaResponseSchema,
	listWorkflows: ListWorkflowsResponseSchema,
	getWorkflow: WorkflowEnvelopeSchema,
	createWorkflow: WorkflowEnvelopeSchema,
	updateWorkflow: WorkflowEnvelopeSchema,
	deleteWorkflow: DeleteResponseSchema,
	listWebhooks: ListWebhooksResponseSchema,
	getWebhook: WebhookEnvelopeSchema,
	createWebhook: CreateWebhookResponseSchema,
	deleteWebhook: DeleteResponseSchema,
} as const;
