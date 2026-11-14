import { z } from 'zod';

// Postiz's Public API. The UI calls a connected account a "channel"; the API
// calls it an "integration", and that is the word used here. Outputs are
// `.loose()` with documented fields nullish, so a field Postiz adds or omits
// cannot fail a call that has already happened.
// Reference: https://docs.postiz.com/public-api/introduction

/** The three ways a post can be created. */
export const POSTIZ_POST_TYPES = ['draft', 'schedule', 'now'] as const;

/** The states a stored post can be in. */
export const POSTIZ_POST_STATES = [
	'QUEUE',
	'PUBLISHED',
	'ERROR',
	'DRAFT',
] as const;

const IdSchema = z.string().min(1);

/**
 * Any JSON value. Provider settings differ per platform and are merged by key,
 * so a nested object is described exactly rather than left untyped.
 */
export type PostizJsonValue =
	| string
	| number
	| boolean
	| null
	| PostizJsonValue[]
	| { [key: string]: PostizJsonValue };

export const PostizJsonValueSchema: z.ZodType<PostizJsonValue> = z.lazy(() =>
	z.union([
		z.string(),
		z.number(),
		z.boolean(),
		z.null(),
		z.array(PostizJsonValueSchema),
		z.record(z.string(), PostizJsonValueSchema),
	]),
);

/** The settings object: an open map whose `__type` names the platform. */
export const PostizSettingsSchema = z
	.object({
		/** The platform discriminator, such as `x` or `linkedin`. */
		__type: z.string().nullish(),
	})
	.loose();

export type PostizSettings = z.infer<typeof PostizSettingsSchema>;

// ── integrations ──────────────────────────────────────────────────────────

export const IntegrationCustomerSchema = z
	.object({
		id: IdSchema.nullish(),
		name: z.string().nullish(),
	})
	.loose();

export type PostizIntegrationCustomer = z.infer<
	typeof IntegrationCustomerSchema
>;

export const IntegrationSchema = z
	.object({
		id: IdSchema.nullish(),
		name: z.string().nullish().describe('The account name shown in the UI.'),
		identifier: z
			.string()
			.nullish()
			.describe('The platform, such as `x` or `linkedin`.'),
		picture: z.string().nullish(),
		disabled: z
			.boolean()
			.nullish()
			.describe('True when the channel is paused.'),
		profile: z.string().nullish(),
		customer: IntegrationCustomerSchema.nullish(),
	})
	.loose();

export type PostizIntegration = z.infer<typeof IntegrationSchema>;

const IntegrationsListInputSchema = z.object({
	group: z
		.string()
		.min(1)
		.optional()
		.describe('Only channels assigned to this customer (group) id.'),
});

export type IntegrationsListInput = z.infer<typeof IntegrationsListInputSchema>;

/** The route answers a bare array, not an envelope. */
export const IntegrationsListOutputSchema = z.object({
	integrations: z.array(IntegrationSchema),
});

export type IntegrationsListOutput = z.infer<
	typeof IntegrationsListOutputSchema
>;

const IsConnectedInputSchema = z.object({});

export type IsConnectedInput = z.infer<typeof IsConnectedInputSchema>;

const IsConnectedOutputSchema = z
	.object({
		connected: z
			.boolean()
			.describe('True when the key is valid and the workspace is reachable.'),
	})
	.loose();

export type IsConnectedOutput = z.infer<typeof IsConnectedOutputSchema>;

const FindSlotInputSchema = z.object({
	id: IdSchema.describe('The integration id whose posting schedule to read.'),
});

export type FindSlotInput = z.infer<typeof FindSlotInputSchema>;

const FindSlotOutputSchema = z
	.object({
		date: z
			.string()
			.min(1)
			.describe('The next free slot, as an ISO 8601 UTC timestamp.'),
	})
	.loose();

export type FindSlotOutput = z.infer<typeof FindSlotOutputSchema>;

// ── posts ─────────────────────────────────────────────────────────────────

/** A media reference the upload routes return and a post carries. */
export const PostizMediaSchema = z.object({
	id: IdSchema.describe('The uploaded media id.'),
	path: z.string().min(1).describe('The hosted URL of the media.'),
	thumbnailTimestamp: z
		.number()
		.optional()
		.describe(
			'Milliseconds into a video to use as its cover. Only some platforms honour it.',
		),
});

export type PostizMedia = z.infer<typeof PostizMediaSchema>;

/** One part of a post; a thread sends several. */
export const PostizPostContentSchema = z.object({
	content: z.string().describe('The text. An empty string is allowed.'),
	image: z
		.array(PostizMediaSchema)
		.optional()
		.describe('Media to attach to this part.'),
	id: z
		.string()
		.min(1)
		.optional()
		.describe('Set when updating an existing part rather than adding one.'),
});

export type PostizPostContent = z.infer<typeof PostizPostContentSchema>;

/** A post to one integration. */
export const PostizPostItemSchema = z.object({
	integration: z.object({
		id: IdSchema.describe('The integration id to publish through.'),
	}),
	value: z
		.array(PostizPostContentSchema)
		.min(1)
		.describe('The parts of the post, in order.'),
	group: z
		.string()
		.min(1)
		.optional()
		.describe('Groups related posts, so one delete removes them together.'),
	settings: PostizSettingsSchema.optional().describe(
		"The provider settings. `__type` names the platform, and the rest is that platform's own schema.",
	),
});

export type PostizPostItem = z.infer<typeof PostizPostItemSchema>;

export const PostizTagSchema = z.object({
	value: z.string().min(1),
	label: z.string().min(1),
});

export type PostizTag = z.infer<typeof PostizTagSchema>;

export const PostsCreateInputSchema = z
	.object({
		type: z
			.enum(POSTIZ_POST_TYPES)
			.describe(
				'`draft` saves without publishing, `schedule` queues for `date`, and `now` publishes as soon as Postiz takes it.',
			),
		date: z
			.string()
			.min(1)
			.describe('When to publish, as an ISO 8601 UTC timestamp.'),
		shortLink: z
			.boolean()
			.describe('Whether Postiz shortens the links in the post.'),
		tags: z.array(PostizTagSchema).describe('Tags to attach to the post.'),
		posts: z
			.array(PostizPostItemSchema)
			.min(1)
			.optional()
			.describe(
				'The per-integration posts. Required unless `type` is `draft`.',
			),
		inter: z
			.number()
			.optional()
			.describe('Minutes between the parts of a thread.'),
	})
	.superRefine((value, ctx) => {
		// The API requires posts for anything that will publish; only a draft can
		// omit them, and a publish with none would silently do nothing.
		if (value.type !== 'draft' && value.posts === undefined) {
			ctx.addIssue({
				code: 'custom',
				message: 'Supply at least one post unless `type` is `draft`.',
				path: ['posts'],
			});
		}
	});

export type PostsCreateInput = z.infer<typeof PostsCreateInputSchema>;

export const PostSchema = z
	.object({
		id: IdSchema.nullish(),
		content: z.string().nullish(),
		settings: PostizSettingsSchema.nullish(),
		publishDate: z.string().nullish(),
		releaseURL: z
			.string()
			.nullish()
			.describe('The URL of the published post, once there is one.'),
		state: z
			.string()
			.nullish()
			.describe('`QUEUE`, `PUBLISHED`, `ERROR` or `DRAFT`.'),
		error: z
			.string()
			.nullish()
			.describe("The platform's rejection message, on an `ERROR` post only."),
		integration: z
			.object({
				id: IdSchema.nullish(),
				providerIdentifier: z.string().nullish(),
				name: z.string().nullish(),
				picture: z.string().nullish(),
			})
			.loose()
			.nullish(),
	})
	.loose();

export type PostizPost = z.infer<typeof PostSchema>;

export const PostsListInputSchema = z
	.object({
		startDate: z
			.string()
			.min(1)
			.describe('Inclusive start of the window, as an ISO 8601 timestamp.'),
		endDate: z
			.string()
			.min(1)
			.describe('Inclusive end of the window, as an ISO 8601 timestamp.'),
		customer: z
			.string()
			.min(1)
			.optional()
			.describe('Only posts for this customer (group) id.'),
	})
	.superRefine((value, ctx) => {
		// A reversed window silently returns nothing, which reads as "no posts"
		// rather than as the mistake it is.
		const start = Date.parse(value.startDate);
		const end = Date.parse(value.endDate);
		if (Number.isFinite(start) && Number.isFinite(end) && start > end) {
			ctx.addIssue({
				code: 'custom',
				message: '`startDate` must not be after `endDate`.',
				path: ['startDate'],
			});
		}
	});

export type PostsListInput = z.infer<typeof PostsListInputSchema>;

const PostsListOutputSchema = z.object({
	posts: z.array(PostSchema),
});

export type PostsListOutput = z.infer<typeof PostsListOutputSchema>;

const PostsDeleteInputSchema = z.object({
	id: IdSchema.describe(
		'The post id. Deleting one removes every post in its group.',
	),
});

export type PostsDeleteInput = z.infer<typeof PostsDeleteInputSchema>;

const PostsDeleteOutputSchema = z.object({
	id: IdSchema.describe('The id that was deleted.'),
});

export type PostsDeleteOutput = z.infer<typeof PostsDeleteOutputSchema>;

export const POSTIZ_CHANGE_STATUS_TARGETS = ['draft', 'schedule'] as const;

const PostsChangeStatusInputSchema = z.object({
	id: IdSchema.describe('The post id to move.'),
	status: z
		.enum(POSTIZ_CHANGE_STATUS_TARGETS)
		.describe(
			'`draft` pulls the post back to a draft, and `schedule` returns it to the queue.',
		),
});

export type PostsChangeStatusInput = z.infer<
	typeof PostsChangeStatusInputSchema
>;

const PostsChangeStatusOutputSchema = z.object({
	id: IdSchema.nullish(),
	state: z.string().nullish().describe('The new state, `DRAFT` or `QUEUE`.'),
});

export type PostsChangeStatusOutput = z.infer<
	typeof PostsChangeStatusOutputSchema
>;

// ── media ─────────────────────────────────────────────────────────────────

const MediaListInputSchema = z.object({
	page: z
		.number()
		.int()
		.positive()
		.optional()
		.describe('Page number. The library returns 18 files per page.'),
});

export type MediaListInput = z.infer<typeof MediaListInputSchema>;

export const MediaFileSchema = z
	.object({
		id: IdSchema.nullish(),
		name: z.string().nullish(),
		path: z.string().nullish().describe('The hosted URL.'),
		thumbnail: z.string().nullish(),
		alt: z.string().nullish(),
		createdAt: z.string().nullish(),
	})
	.loose();

export type PostizMediaFile = z.infer<typeof MediaFileSchema>;

const MediaListOutputSchema = z.object({
	media: z.array(MediaFileSchema),
});

export type MediaListOutput = z.infer<typeof MediaListOutputSchema>;

// ── notifications ─────────────────────────────────────────────────────────

const NotificationsListInputSchema = z.object({
	page: z
		.number()
		.int()
		.positive()
		.optional()
		.describe('Page number. The API returns 100 notifications per page.'),
});

export type NotificationsListInput = z.infer<
	typeof NotificationsListInputSchema
>;

export const NotificationSchema = z
	.object({
		id: IdSchema.nullish(),
		content: z.string().nullish(),
		link: z.string().nullish(),
		createdAt: z.string().nullish(),
	})
	.loose();

export type PostizNotification = z.infer<typeof NotificationSchema>;

const NotificationsListOutputSchema = z.object({
	notifications: z.array(NotificationSchema),
});

export type NotificationsListOutput = z.infer<
	typeof NotificationsListOutputSchema
>;

// ── analytics ─────────────────────────────────────────────────────────────

const AnalyticsPlatformInputSchema = z.object({
	integration: IdSchema.describe('The integration id to read analytics for.'),
	date: z
		.string()
		.min(1)
		.describe(
			'The period to read, which the API takes as its own window token.',
		),
});

export type AnalyticsPlatformInput = z.infer<
	typeof AnalyticsPlatformInputSchema
>;

/**
 * Each platform reports different metrics, so the row is opened up rather than
 * pinned to one platform's fields.
 */
export const AnalyticsRowSchema = z
	.object({
		label: z.string().nullish(),
		percentageChange: z.number().nullish(),
		data: z.array(z.number()).nullish(),
	})
	.loose();

export type PostizAnalyticsRow = z.infer<typeof AnalyticsRowSchema>;

const AnalyticsPlatformOutputSchema = z.object({
	// Postiz sends a list of metric rows per period; the array is required and
	// may legitimately be empty when a platform reports nothing yet.
	analytics: z.array(AnalyticsRowSchema),
});

export type AnalyticsPlatformOutput = z.infer<
	typeof AnalyticsPlatformOutputSchema
>;

// ── Registry ──────────────────────────────────────────────────────────────

export type PostizEndpointInputs = {
	integrationsList: IntegrationsListInput;
	isConnected: IsConnectedInput;
	findSlot: FindSlotInput;
	postsList: PostsListInput;
	postsCreate: PostsCreateInput;
	postsDelete: PostsDeleteInput;
	postsChangeStatus: PostsChangeStatusInput;
	mediaList: MediaListInput;
	notificationsList: NotificationsListInput;
	analyticsPlatform: AnalyticsPlatformInput;
};

export type PostizEndpointOutputs = {
	integrationsList: IntegrationsListOutput;
	isConnected: IsConnectedOutput;
	findSlot: FindSlotOutput;
	postsList: PostsListOutput;
	postsCreate: PostsListOutput;
	postsDelete: PostsDeleteOutput;
	postsChangeStatus: PostsChangeStatusOutput;
	mediaList: MediaListOutput;
	notificationsList: NotificationsListOutput;
	analyticsPlatform: AnalyticsPlatformOutput;
};

export const PostizEndpointInputSchemas = {
	integrationsList: IntegrationsListInputSchema,
	isConnected: IsConnectedInputSchema,
	findSlot: FindSlotInputSchema,
	postsList: PostsListInputSchema,
	postsCreate: PostsCreateInputSchema,
	postsDelete: PostsDeleteInputSchema,
	postsChangeStatus: PostsChangeStatusInputSchema,
	mediaList: MediaListInputSchema,
	notificationsList: NotificationsListInputSchema,
	analyticsPlatform: AnalyticsPlatformInputSchema,
} as const;

export const PostizEndpointOutputSchemas = {
	integrationsList: IntegrationsListOutputSchema,
	isConnected: IsConnectedOutputSchema,
	findSlot: FindSlotOutputSchema,
	postsList: PostsListOutputSchema,
	// Create answers the same shape a list does, so both parse `{ posts }`.
	postsCreate: PostsListOutputSchema,
	postsDelete: PostsDeleteOutputSchema,
	postsChangeStatus: PostsChangeStatusOutputSchema,
	mediaList: MediaListOutputSchema,
	notificationsList: NotificationsListOutputSchema,
	analyticsPlatform: AnalyticsPlatformOutputSchema,
} as const;
