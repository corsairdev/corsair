import { z } from 'zod';
import {
	PubloraAccount,
	PubloraPlatformPost,
	PubloraPost,
} from '../schema/database';

/**
 * Every Publora route answers a JSON object with `success: true` plus the
 * route's own fields. Response schemas are loose so a field Publora adds
 * later does not break a read.
 * Spec: https://docs.publora.com/openapi.json
 */

const S = z.string().nullable().optional();

const PostGroupIdInput = z
	.string()
	.min(1)
	.describe('Post group id (postGroupId) from posts.create or posts.list');

const PLATFORM_TYPES = [
	'twitter',
	'linkedin',
	'instagram',
	'threads',
	'tiktok',
	'youtube',
	'facebook',
	'bluesky',
	'mastodon',
	'telegram',
	'pinterest',
] as const;

const COMMENT_PLATFORM_TYPES = [
	'linkedin',
	'twitter',
	'threads',
	'bluesky',
	'mastodon',
	'instagram',
	'facebook',
	'youtube',
	'tiktok',
	'telegram',
] as const;

const POST_GROUP_STATUSES = [
	'draft',
	'scheduled',
	'published',
	'failed',
	'partially_published',
] as const;

const WEBHOOK_EVENTS = [
	'post.scheduled',
	'post.published',
	'post.failed',
	'post.demoted',
	'token.expiring',
] as const;

const IdempotencyKeyInput = z
	.string()
	.min(1)
	.max(200)
	.optional()
	.describe(
		'Sent as the Idempotency-Key header. A repeat with the same key and body within 24 hours returns the first result instead of acting twice; the same key with another body is rejected with 422.',
	);

/**
 * `components.schemas.PlatformSettingsInput`. The settings differ per
 * network (YouTube title and privacy, TikTok viewer setting, Instagram
 * videoType, Threads replyControl, X replyTo and quote, Telegram silent
 * message, LinkedIn repost) and Publora rejects an unknown key with
 * PLATFORM_SETTING_UNKNOWN, so the object is passed through as is.
 */
const PlatformSettingsInput = z
	.record(z.string(), z.record(z.string(), z.unknown()))
	.optional()
	.describe(
		'Per-network settings keyed by platform, e.g. { youtube: { title, privacy }, tiktok: { viewerSetting }, instagram: { videoType: "REELS" } }. See https://docs.publora.com/endpoints/create-post',
	);

/** `components.schemas.FirstCommentSequenceItem`. */
const FirstCommentInput = z.object({
	text: z.string().min(1).max(25000).describe('Comment text'),
	platforms: z
		.array(z.enum(COMMENT_PLATFORM_TYPES))
		.optional()
		.describe(
			'Platform types (not connection ids) that get the comment; omit for every supported target',
		),
	delaySeconds: z
		.number()
		.int()
		.min(0)
		.max(86400)
		.optional()
		.describe(
			'Wait after publication (first comment) or after the previous comment',
		),
});

const MediaUrlsInput = z
	.array(z.string().url())
	.min(1)
	.max(10)
	.optional()
	.describe(
		'Public https image or video URLs that Publora downloads (images 25 MB, videos 150 MB, 300 MB in total). Instagram, TikTok and YouTube need media.',
	);

/** `components.schemas.Warning`: a notice about a request that still succeeded. */
const WarningSchema = z
	.object({
		code: z.string(),
		message: S,
		requested: S,
		effective: S,
		platforms: z.array(z.string()).nullable().optional(),
	})
	.loose();

/**
 * GET /platform-connections
 * Official: https://docs.publora.com/endpoints/platform-connections
 */
const ListAccountsResponseSchema = z
	.object({
		success: z.boolean().optional(),
		connections: z.array(PubloraAccount),
	})
	.loose();

/**
 * GET /account-context
 * Official: https://docs.publora.com/endpoints/account-context
 *
 * Plan, features, publishing quotas and schedule horizon of the account
 * behind the key. Advisory only: it reserves nothing.
 */
const GetContextInputSchema = z.object({
	scheduledTime: z
		.string()
		.optional()
		.describe(
			'ISO 8601 date-time of a planned batch; selects its monthly quota period. Omit for the current period.',
		),
});

const QuotaSchema = z
	.object({
		metric: S,
		scope: S,
		unit: S,
		limit: z.number().nullable().optional(),
		used: z.number().nullable().optional(),
		remaining: z.number().nullable().optional(),
		resetAt: S,
	})
	.loose();

const GetContextResponseSchema = z
	.object({
		success: z.boolean().optional(),
		context: z
			.object({
				plan: z.object({ key: S, name: S }).loose().nullable().optional(),
				features: z.record(z.string(), z.boolean()).nullable().optional(),
				quotas: z
					.object({
						monthlyPosts: QuotaSchema.nullable().optional(),
						scheduledPosts: QuotaSchema.nullable().optional(),
						scheduleHorizon: z
							.object({
								limit: z.number().nullable().optional(),
								maxScheduledDate: S,
							})
							.loose()
							.nullable()
							.optional(),
						connections: QuotaSchema.nullable().optional(),
					})
					.loose()
					.nullable()
					.optional(),
				allowedPlatforms: z.array(z.string()).nullable().optional(),
				serverTime: S,
				advisory: z.boolean().nullable().optional(),
			})
			.loose(),
	})
	.loose();

/**
 * POST /create-post
 * Official: https://docs.publora.com/endpoints/create-post
 *
 * Without scheduledTime or publishNow the post is saved as a draft. With a
 * future scheduledTime it is scheduled. publishNow publishes right away.
 */
const CreatePostInputSchema = z.object({
	content: z
		.string()
		.optional()
		.describe(
			'Post text. Required unless the only target is a LinkedIn repost.',
		),
	platforms: z
		.array(z.string().min(1))
		.min(1)
		.describe(
			'Connection ids from accounts.list (platformId, e.g. "linkedin-ABC123"), each at most once',
		),
	scheduledTime: z
		.string()
		.optional()
		.describe(
			'ISO 8601 UTC date-time to publish at. Omit (and leave publishNow off) to save a draft.',
		),
	publishNow: z
		.boolean()
		.optional()
		.describe(
			'Publish immediately. Cannot be combined with a future scheduledTime.',
		),
	platformSettings: PlatformSettingsInput,
	firstComments: z
		.array(FirstCommentInput)
		.max(3)
		.optional()
		.describe(
			'Up to three comments Publora posts under the published post (LinkedIn, X, Threads, Bluesky, Mastodon)',
		),
	mediaUrls: MediaUrlsInput,
	idempotencyKey: IdempotencyKeyInput,
});

const CreatePostResponseSchema = z
	.object({
		success: z.boolean().optional(),
		postGroupId: z.string(),
		/** The time actually stored; null for a draft. */
		scheduledTime: S,
		warnings: z.array(WarningSchema).optional(),
	})
	.loose();

/**
 * GET /get-post/{postGroupId}
 * Official: https://docs.publora.com/endpoints/get-post
 */
const GetPostInputSchema = z.object({
	postGroupId: PostGroupIdInput,
});

const GetPostResponseSchema = PubloraPost.extend({
	success: z.boolean().optional(),
	platformSettings: z.record(z.string(), z.unknown()).nullable().optional(),
	posts: z.array(PubloraPlatformPost).nullable().optional(),
	media: z
		.array(
			z
				.object({
					mediaId: S,
					fileName: S,
					type: S,
					mimeType: S,
					status: S,
					url: S,
				})
				.loose(),
		)
		.nullable()
		.optional(),
}).loose();

/**
 * GET /list-posts
 * Official: https://docs.publora.com/endpoints/list-posts
 *
 * Page-numbered. `pagination.hasNextPage` says whether `page + 1` exists.
 */
const ListPostsInputSchema = z.object({
	page: z
		.number()
		.int()
		.min(1)
		.optional()
		.describe('Page number, starting at 1'),
	limit: z
		.number()
		.int()
		.min(1)
		.max(100)
		.optional()
		.describe('Posts per page (1-100, default 20)'),
	status: z.enum(POST_GROUP_STATUSES).optional(),
	platform: z.enum(PLATFORM_TYPES).optional(),
	sortBy: z.enum(['createdAt', 'updatedAt', 'scheduledTime']).optional(),
	sortOrder: z.enum(['asc', 'desc']).optional(),
	fromDate: z
		.string()
		.optional()
		.describe('Only posts scheduled after this ISO 8601 date'),
	toDate: z
		.string()
		.optional()
		.describe('Only posts scheduled before this ISO 8601 date'),
});

const ListPostsResponseSchema = z
	.object({
		success: z.boolean().optional(),
		posts: z.array(PubloraPost),
		pagination: z
			.object({
				page: z.number().optional(),
				limit: z.number().optional(),
				totalItems: z.number().optional(),
				totalPages: z.number().optional(),
				hasNextPage: z.boolean().optional(),
				hasPrevPage: z.boolean().optional(),
			})
			.loose()
			.optional(),
	})
	.loose();

/**
 * PUT /update-post/{postGroupId}
 * Official: https://docs.publora.com/endpoints/update-post
 *
 * Only draft and scheduled groups can change. Every field is a patch;
 * `platforms` replaces the whole target list.
 */
const UpdatePostInputSchema = z.object({
	postGroupId: PostGroupIdInput,
	content: z.string().optional().describe('Replacement post text'),
	platforms: z
		.array(z.string().min(1))
		.optional()
		.describe(
			'Replacement target list (not merged). Send the complete final list of connection ids.',
		),
	status: z
		.enum(['draft', 'scheduled'])
		.optional()
		.describe('Move the post back to draft or schedule it'),
	scheduledTime: z
		.string()
		.optional()
		.describe('New ISO 8601 UTC publish time'),
	publishNow: z
		.boolean()
		.optional()
		.describe('Publish this draft or scheduled post immediately'),
	platformSettings: PlatformSettingsInput,
	firstComments: z
		.array(FirstCommentInput)
		.max(3)
		.nullable()
		.optional()
		.describe('Replace the comments; null or [] removes them'),
	mediaUrls: z
		.array(z.string().url())
		.min(1)
		.max(10)
		.optional()
		.describe('Public https media URLs appended to the existing media'),
	idempotencyKey: IdempotencyKeyInput,
});

const UpdatePostResponseSchema = z
	.object({
		success: z.boolean().optional(),
		message: S,
		scheduledTime: S,
		warnings: z.array(WarningSchema).optional(),
		postGroup: z
			.object({
				_id: z.string(),
				status: S,
				content: S,
				platforms: z.array(z.string()).nullable().optional(),
				scheduledTime: S,
			})
			.loose()
			.optional(),
	})
	.loose();

/**
 * DELETE /delete-post/{postGroupId}
 * Official: https://docs.publora.com/endpoints/delete-post
 */
const DeletePostInputSchema = z.object({
	postGroupId: PostGroupIdInput,
});

const SuccessResponseSchema = z
	.object({
		success: z.boolean(),
	})
	.loose();

/**
 * POST /get-upload-url
 * Official: https://docs.publora.com/endpoints/upload-media
 *
 * Returns a pre-signed URL (valid one hour). PUT the file's bytes to it with
 * the same Content-Type; the file is then attached to the post group.
 */
const CreateMediaUploadInputSchema = z.object({
	postGroupId: PostGroupIdInput.describe(
		'Post group to attach the file to (create a draft first)',
	),
	fileName: z.string().min(1).describe('File name, e.g. "photo.jpg"'),
	contentType: z
		.string()
		.min(1)
		.describe('MIME type: image/*, video/* or application/pdf'),
	type: z
		.enum(['image', 'video', 'document'])
		.optional()
		.describe('Media type; inferred from contentType when omitted'),
});

const CreateMediaUploadResponseSchema = z
	.object({
		success: z.boolean().optional(),
		uploadUrl: z.string(),
		fileUrl: S,
		mediaId: z.string(),
	})
	.loose();

/**
 * POST /complete-media/{mediaFileId}
 * Official: https://docs.publora.com/endpoints/upload-media
 *
 * Optional: checks an uploaded file right away instead of at scheduling.
 */
const CompleteMediaInputSchema = z.object({
	mediaId: z.string().min(1).describe('mediaId from media.createUpload'),
});

const CompleteMediaResponseSchema = z
	.object({
		success: z.boolean().optional(),
		mediaFile: z
			.object({
				_id: z.string(),
				type: S,
				mimeType: S,
				fileName: S,
				url: S,
				status: S,
			})
			.loose(),
	})
	.loose();

/**
 * DELETE /media/{mediaId}
 * Official: https://docs.publora.com/endpoints/upload-media
 */
const DeleteMediaInputSchema = z.object({
	mediaId: z.string().min(1).describe('mediaId of the attached file'),
});

/**
 * Webhook subscriptions.
 * Official: https://docs.publora.com/endpoints/webhooks
 */
const WebhookSchema = z
	.object({
		_id: z.string(),
		name: S,
		url: S,
		events: z.array(z.string()).nullable().optional(),
		isActive: z.boolean().nullable().optional(),
		createdAt: S,
		updatedAt: S,
	})
	.loose();

const ListWebhooksResponseSchema = z
	.object({
		success: z.boolean().optional(),
		webhooks: z.array(WebhookSchema),
	})
	.loose();

const CreateWebhookInputSchema = z.object({
	name: z.string().min(1).describe('A name to recognise the subscription by'),
	url: z.string().url().describe('Public HTTPS URL that receives the events'),
	events: z
		.array(z.enum(WEBHOOK_EVENTS))
		.min(1)
		.describe(
			'post.scheduled, post.published, post.failed, post.demoted (token.expiring is accepted but not sent yet)',
		),
});

const CreateWebhookResponseSchema = z
	.object({
		success: z.boolean().optional(),
		webhook: WebhookSchema.extend({
			/** Signing secret; returned only here. */
			secret: S,
		}).loose(),
	})
	.loose();

const UpdateWebhookInputSchema = z.object({
	id: z.string().min(1).describe('Webhook id (_id)'),
	name: z.string().min(1).optional(),
	url: z.string().url().optional(),
	events: z.array(z.enum(WEBHOOK_EVENTS)).min(1).optional(),
	isActive: z.boolean().optional().describe('Pause or resume deliveries'),
});

const WebhookEnvelopeSchema = z
	.object({
		success: z.boolean().optional(),
		webhook: WebhookSchema,
	})
	.loose();

const DeleteWebhookInputSchema = z.object({
	id: z.string().min(1).describe('Webhook id (_id)'),
});

export type ListAccountsResponse = z.infer<typeof ListAccountsResponseSchema>;
export type ListPostsResponse = z.infer<typeof ListPostsResponseSchema>;
export type GetPostResponse = z.infer<typeof GetPostResponseSchema>;

export type PubloraEndpointInputs = {
	listAccounts: Record<string, never>;
	getContext: z.infer<typeof GetContextInputSchema>;
	createPost: z.infer<typeof CreatePostInputSchema>;
	getPost: z.infer<typeof GetPostInputSchema>;
	listPosts: z.infer<typeof ListPostsInputSchema>;
	updatePost: z.infer<typeof UpdatePostInputSchema>;
	deletePost: z.infer<typeof DeletePostInputSchema>;
	createMediaUpload: z.infer<typeof CreateMediaUploadInputSchema>;
	completeMedia: z.infer<typeof CompleteMediaInputSchema>;
	deleteMedia: z.infer<typeof DeleteMediaInputSchema>;
	listWebhooks: Record<string, never>;
	createWebhook: z.infer<typeof CreateWebhookInputSchema>;
	updateWebhook: z.infer<typeof UpdateWebhookInputSchema>;
	deleteWebhook: z.infer<typeof DeleteWebhookInputSchema>;
};

export type PubloraEndpointOutputs = {
	listAccounts: ListAccountsResponse;
	getContext: z.infer<typeof GetContextResponseSchema>;
	createPost: z.infer<typeof CreatePostResponseSchema>;
	getPost: GetPostResponse;
	listPosts: ListPostsResponse;
	updatePost: z.infer<typeof UpdatePostResponseSchema>;
	deletePost: z.infer<typeof SuccessResponseSchema>;
	createMediaUpload: z.infer<typeof CreateMediaUploadResponseSchema>;
	completeMedia: z.infer<typeof CompleteMediaResponseSchema>;
	deleteMedia: z.infer<typeof SuccessResponseSchema>;
	listWebhooks: z.infer<typeof ListWebhooksResponseSchema>;
	createWebhook: z.infer<typeof CreateWebhookResponseSchema>;
	updateWebhook: z.infer<typeof WebhookEnvelopeSchema>;
	deleteWebhook: z.infer<typeof SuccessResponseSchema>;
};

export const PubloraEndpointInputSchemas = {
	listAccounts: z.object({}),
	getContext: GetContextInputSchema,
	createPost: CreatePostInputSchema,
	getPost: GetPostInputSchema,
	listPosts: ListPostsInputSchema,
	updatePost: UpdatePostInputSchema,
	deletePost: DeletePostInputSchema,
	createMediaUpload: CreateMediaUploadInputSchema,
	completeMedia: CompleteMediaInputSchema,
	deleteMedia: DeleteMediaInputSchema,
	listWebhooks: z.object({}),
	createWebhook: CreateWebhookInputSchema,
	updateWebhook: UpdateWebhookInputSchema,
	deleteWebhook: DeleteWebhookInputSchema,
} as const;

export const PubloraEndpointOutputSchemas = {
	listAccounts: ListAccountsResponseSchema,
	getContext: GetContextResponseSchema,
	createPost: CreatePostResponseSchema,
	getPost: GetPostResponseSchema,
	listPosts: ListPostsResponseSchema,
	updatePost: UpdatePostResponseSchema,
	deletePost: SuccessResponseSchema,
	createMediaUpload: CreateMediaUploadResponseSchema,
	completeMedia: CompleteMediaResponseSchema,
	deleteMedia: SuccessResponseSchema,
	listWebhooks: ListWebhooksResponseSchema,
	createWebhook: CreateWebhookResponseSchema,
	updateWebhook: WebhookEnvelopeSchema,
	deleteWebhook: SuccessResponseSchema,
} as const;
