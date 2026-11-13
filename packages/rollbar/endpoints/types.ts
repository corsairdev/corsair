import { z } from 'zod';

/**
 * A value in one of Rollbar's free-form maps. Its keys and nesting are the
 * caller's own, so the leaves are scalars and one level of list or map.
 */
export type RollbarJson =
	| string
	| number
	| boolean
	| null
	| RollbarJson[]
	| { [key: string]: RollbarJson };

export const RollbarJsonSchema: z.ZodType<RollbarJson> = z.lazy(() =>
	z.union([
		z.string(),
		z.number(),
		z.boolean(),
		z.null(),
		z.array(RollbarJsonSchema),
		z.record(z.string(), RollbarJsonSchema),
	]),
);

/** The map type the occurrence context blocks and event data use. */
export const JsonMapSchema = z.record(z.string(), RollbarJsonSchema);

/** Rollbar pages by number and reports `total_count` beside each page. */
const PageSchema = z
	.number()
	.int()
	.min(1)
	.optional()
	.describe('1-based page. Rollbar returns 20 per page unless `limit` is set.');

const LimitSchema = z
	.number()
	.int()
	.min(1)
	.max(100)
	.optional()
	.describe('Records per page, up to 100.');

/** Rollbar documents four levels as the filter values. */
const LevelSchema = z.enum(['critical', 'error', 'warning', 'info', 'debug']);

const StatusSchema = z.enum(['active', 'resolved', 'muted']);

/** `items.list` also filters on `archived`, which an update cannot set. */
const StatusFilterSchema = z.enum(['active', 'resolved', 'muted', 'archived']);

/**
 * An account or personal access token reaches several projects, so the item and
 * occurrence routes need the project named. A project token ignores it.
 */
const ProjectIdSchema = z
	.number()
	.int()
	.positive()
	.optional()
	.describe(
		'Required with an account or personal access token, which Rollbar otherwise refuses with 403 "Requires project access". A project access token ignores it.',
	);

/**
 * `GET /items` returns each `id` as a numeric string while `GET /item/{id}`
 * returns a number, so both are read and a string is converted.
 */
const ItemIdSchema = z.union([
	z.number(),
	z
		.string()
		.regex(/^\d+$/)
		.transform((value) => Number(value)),
]);

/**
 * `page` and `total_count` are declared rather than added by a transform,
 * because the docs generator reads a transform's input side and would omit them.
 */
const pagingFields = {
	page: z.number().nullable(),
	total_count: z
		.number()
		.nullable()
		.describe(
			'Total matches, or null when the project has more than 100,000 items.',
		),
};

// ── items ─────────────────────────────────────────────────────────────────

const ItemsListInputSchema = z.object({
	page: PageSchema,
	limit: LimitSchema,
	status: StatusFilterSchema.optional(),
	level: z
		.array(LevelSchema)
		.optional()
		.describe(
			'Sent as a repeated parameter, so several levels can be asked for.',
		),
	environment: z.string().optional(),
	framework: z.string().optional(),
	query: z.string().optional().describe('A search string.'),
	project_ids: z
		.array(z.number().int())
		.optional()
		.describe('Account tokens only: search these projects.'),
	assigned_user: z.string().optional().describe('A user id or email.'),
	assigned_team: z.string().optional(),
	is_snoozed: z.boolean().optional(),
});

export type ItemsListInput = z.input<typeof ItemsListInputSchema>;

const ItemSchema = z
	.object({
		id: ItemIdSchema.nullish(),
		public_item_id: z.number().nullish(),
		group_item_id: z.number().nullish(),
		project_id: z.number().nullish(),
		counter: z.number().nullish(),
		title: z.string().nullish(),
		hash: z.string().nullish(),
		environment: z.string().nullish(),
		platform: z.string().nullish(),
		framework: z.string().nullish(),
		level: z.string().nullish(),
		status: z.string().nullish(),
		group_status: z.number().nullish(),
		total_occurrences: z.number().nullish(),
		unique_occurrences: z.number().nullish(),
		last_occurrence_id: z.number().nullish(),
		last_occurrence_timestamp: z.number().nullish(),
		first_occurrence_id: z.number().nullish(),
		first_occurrence_timestamp: z.number().nullish(),
		last_activated_timestamp: z.number().nullish(),
		last_resolved_timestamp: z.number().nullish(),
		last_modified_by: z.number().nullish(),
		assigned_user_id: z.number().nullish(),
		assigned_team_id: z.number().nullish(),
		resolved_in_version: z.string().nullish(),
		title_lock: z.number().nullish(),
		level_lock: z.number().nullish(),
		controlling_id: z.number().nullish(),
		activating_occurrence_id: z.number().nullish(),
		// A per-integration blob whose shape depends on which integrations the
		// account has: `null` in a list, an object on `GET /item/{id}`.
		integrations_data: z.union([z.string(), JsonMapSchema]).nullish(),
	})
	.loose();

export type RollbarItem = z.infer<typeof ItemSchema>;

const ItemsListResponseSchema = z.object({
	items: z.array(ItemSchema),
	...pagingFields,
});

export type ItemsListResponse = z.infer<typeof ItemsListResponseSchema>;

const ItemsGetInputSchema = z.object({
	item_id: z.number().int().positive(),
	project_id: ProjectIdSchema,
});

export type ItemsGetInput = z.input<typeof ItemsGetInputSchema>;

const ItemsGetResponseSchema = z.object({ item: ItemSchema });
export type ItemsGetResponse = z.infer<typeof ItemsGetResponseSchema>;

const ItemsUpdateInputSchema = z
	.object({
		item_id: z.number().int().positive(),
		project_id: ProjectIdSchema,
		status: StatusSchema.optional(),
		level: LevelSchema.optional(),
		title: z.string().optional().describe('A new title, up to 255 characters.'),
		assigned_user_id: z
			.number()
			.int()
			.nullable()
			.optional()
			.describe('The user to assign, or null to clear the assignment.'),
		assigned_team_id: z
			.number()
			.int()
			.nullable()
			.optional()
			.describe('The team to assign, or null to clear the assignment.'),
		resolved_in_version: z
			.string()
			.max(40)
			.optional()
			.describe('The version the item is resolved in, up to 40 characters.'),
		snooze_enabled: z.boolean().optional(),
		snooze_expiration_in_seconds: z.number().int().min(1).optional(),
	})
	.superRefine((value, ctx) => {
		// A snooze needs a duration, and a duration is meaningless without it.
		if (value.snooze_enabled === true) {
			if (value.snooze_expiration_in_seconds === undefined) {
				ctx.addIssue({
					code: 'custom',
					message:
						'`snooze_expiration_in_seconds` is required when `snooze_enabled` is true.',
					path: ['snooze_expiration_in_seconds'],
				});
			}
		}
	});

export type ItemsUpdateInput = z.input<typeof ItemsUpdateInputSchema>;

const ItemUpdateResultSchema = z
	.object({
		status: z.string().nullish(),
		resolved_in_version: z.string().nullish(),
		title: z.string().nullish(),
		level: z.string().nullish(),
		assigned_user_id: z.number().nullish(),
		assigned_team_id: z.number().nullish(),
		snooze_enabled: z.boolean().nullish(),
		snooze_expiration_in_seconds: z.number().nullish(),
	})
	.loose();

const ItemsUpdateResponseSchema = z.object({
	item: ItemUpdateResultSchema,
});

export type ItemsUpdateResponse = z.infer<typeof ItemsUpdateResponseSchema>;

const ItemCommentsInputSchema = z.object({
	item_id: z.number().int().positive(),
	project_id: ProjectIdSchema,
	page: PageSchema,
});

export type ItemCommentsInput = z.input<typeof ItemCommentsInputSchema>;

const CommentSchema = z
	.object({
		id: z.number().nullish(),
		type: z.string().nullish(),
		source: z
			.string()
			.nullish()
			.describe(
				'`comment` or `resolve_note`. Ids can repeat across sources, so (`source`, `id`) identifies a comment.',
			),
		item_id: z.number().nullish(),
		user_id: z.number().nullish(),
		username: z.string().nullish(),
		text: z.string().nullish(),
		timestamp: z.number().nullish(),
		via_api: z.boolean().nullish(),
	})
	.loose();

export type RollbarComment = z.infer<typeof CommentSchema>;

const ItemCommentsResponseSchema = z.object({
	comments: z.array(CommentSchema),
	...pagingFields,
});

export type ItemCommentsResponse = z.infer<typeof ItemCommentsResponseSchema>;

const ItemCommentCreateInputSchema = z.object({
	item_id: z.number().int().positive(),
	project_id: z
		.number()
		.int()
		.positive()
		.describe('The project that holds the item. Rollbar requires it here.'),
	body: z
		.string()
		.min(1)
		.describe('The comment text, sent to Rollbar as `comment`.'),
});

export type ItemCommentCreateInput = z.input<
	typeof ItemCommentCreateInputSchema
>;

const ItemCommentCreateResponseSchema = z.object({
	comment_id: z.number().nullish(),
	result: CommentSchema.nullish(),
});

export type ItemCommentCreateResponse = z.infer<
	typeof ItemCommentCreateResponseSchema
>;

const ItemEventsInputSchema = z.object({
	item_id: z.number().int().positive(),
	project_id: ProjectIdSchema,
	page: PageSchema,
});

export type ItemEventsInput = z.input<typeof ItemEventsInputSchema>;

const ItemEventSchema = z
	.object({
		id: z.number().nullish(),
		type: z
			.string()
			.nullish()
			.describe(
				'Such as `item_comment`, `item_status_history` or `item_level_history`. The other fields depend on it and are kept as sent.',
			),
		item_id: z.number().nullish(),
		user_id: z.number().nullish(),
		username: z.string().nullish(),
		timestamp: z.number().nullish(),
		text: z.string().nullish(),
		status: z.string().nullish(),
		level: z.string().nullish(),
		comment: z.string().nullish(),
	})
	.loose();

export type RollbarItemEvent = z.infer<typeof ItemEventSchema>;

const ItemEventsResponseSchema = z.object({
	events: z.array(ItemEventSchema),
	...pagingFields,
});

export type ItemEventsResponse = z.infer<typeof ItemEventsResponseSchema>;

// ── occurrences ───────────────────────────────────────────────────────────

/** `/instances` allows larger pages than the other list routes. */
const OccurrenceLimitSchema = z
	.number()
	.int()
	.min(1)
	.max(5000)
	.optional()
	.describe('Records per page, up to 5000.');

const OccurrencesListInputSchema = z.object({
	page: PageSchema,
	limit: OccurrenceLimitSchema,
	project_id: z
		.number()
		.int()
		.optional()
		.describe('Account tokens only: read this project.'),
	last_id: z
		.number()
		.int()
		.optional()
		.describe('Only occurrences after this id, for a forward walk.'),
});

export type OccurrencesListInput = z.input<typeof OccurrencesListInputSchema>;

const OccurrenceSchema = z
	.object({
		id: z.number().nullish(),
		project_id: z.number().nullish(),
		item_id: z.number().nullish(),
		timestamp: z.number().nullish(),
		version: z.number().nullish(),
		billable: z.number().nullish(),
		// The payload the notifier sent (environment, level, body with the trace
		// chain, request, person, server), kept as Rollbar stored it.
		data: JsonMapSchema.nullish(),
	})
	.loose();

export type RollbarOccurrence = z.infer<typeof OccurrenceSchema>;

const OccurrencesListResponseSchema = z.object({
	occurrences: z.array(OccurrenceSchema),
	...pagingFields,
});

export type OccurrencesListResponse = z.infer<
	typeof OccurrencesListResponseSchema
>;

const OccurrencesGetInputSchema = z.object({
	occurrence_id: z.number().int().positive(),
	project_id: ProjectIdSchema,
});

export type OccurrencesGetInput = z.input<typeof OccurrencesGetInputSchema>;

const OccurrencesGetResponseSchema = z.object({
	occurrence: OccurrenceSchema,
});

export type OccurrencesGetResponse = z.infer<
	typeof OccurrencesGetResponseSchema
>;

// ── projects ──────────────────────────────────────────────────────────────

const ProjectsListInputSchema = z.object({});

export type ProjectsListInput = z.input<typeof ProjectsListInputSchema>;

const ProjectSchema = z
	.object({
		id: z.number().nullish(),
		name: z.string().nullish(),
		account_id: z.number().nullish(),
		status: z.string().nullish(),
		date_created: z.number().nullish(),
		date_modified: z.number().nullish(),
		// A project's settings are stored as sent; its tokens have their own route.
		settings_data: JsonMapSchema.nullish(),
	})
	.loose();

export type RollbarProject = z.infer<typeof ProjectSchema>;

const ProjectsListResponseSchema = z.object({
	projects: z.array(ProjectSchema),
});

export type ProjectsListResponse = z.infer<typeof ProjectsListResponseSchema>;

// ── deploys ───────────────────────────────────────────────────────────────

const DeploysListInputSchema = z.object({
	page: PageSchema,
	project_id: ProjectIdSchema,
});

export type DeploysListInput = z.input<typeof DeploysListInputSchema>;

const DeploySchema = z
	.object({
		id: z.number().nullish(),
		project_id: z.number().nullish(),
		environment: z.string().nullish(),
		revision: z.string().nullish(),
		comment: z.string().nullish(),
		status: z.string().nullish(),
		local_username: z.string().nullish(),
		user_id: z.number().nullish(),
		username: z.string().nullish(),
		start_time: z.number().nullish(),
		finish_time: z.number().nullish(),
	})
	.loose();

export type RollbarDeploy = z.infer<typeof DeploySchema>;

const DeploysListResponseSchema = z.object({
	deploys: z.array(DeploySchema),
	...pagingFields,
});

export type DeploysListResponse = z.infer<typeof DeploysListResponseSchema>;

const DeployCreateInputSchema = z.object({
	environment: z.string().min(1).describe('The environment deployed to.'),
	revision: z
		.string()
		.min(1)
		.describe('The revision deployed, up to 40 characters.'),
	project_id: z.number().int().optional(),
	comment: z.string().optional(),
	local_username: z.string().optional(),
	rollbar_username: z.string().optional(),
	status: z.enum(['started', 'succeeded', 'failed', 'timed_out']).optional(),
});

export type DeployCreateInput = z.input<typeof DeployCreateInputSchema>;

const DeployCreateResponseSchema = z.object({
	deploy_id: z.number().nullish(),
});

export type DeployCreateResponse = z.infer<typeof DeployCreateResponseSchema>;

// ── Registry ──────────────────────────────────────────────────────────────

export type RollbarEndpointInputs = {
	itemsList: ItemsListInput;
	itemsGet: ItemsGetInput;
	itemsUpdate: ItemsUpdateInput;
	itemComments: ItemCommentsInput;
	itemCommentCreate: ItemCommentCreateInput;
	itemEvents: ItemEventsInput;
	occurrencesList: OccurrencesListInput;
	occurrencesGet: OccurrencesGetInput;
	projectsList: ProjectsListInput;
	deploysList: DeploysListInput;
	deploysCreate: DeployCreateInput;
};

export type RollbarEndpointOutputs = {
	itemsList: ItemsListResponse;
	itemsGet: ItemsGetResponse;
	itemsUpdate: ItemsUpdateResponse;
	itemComments: ItemCommentsResponse;
	itemCommentCreate: ItemCommentCreateResponse;
	itemEvents: ItemEventsResponse;
	occurrencesList: OccurrencesListResponse;
	occurrencesGet: OccurrencesGetResponse;
	projectsList: ProjectsListResponse;
	deploysList: DeploysListResponse;
	deploysCreate: DeployCreateResponse;
};

export const RollbarEndpointInputSchemas = {
	itemsList: ItemsListInputSchema,
	itemsGet: ItemsGetInputSchema,
	itemsUpdate: ItemsUpdateInputSchema,
	itemComments: ItemCommentsInputSchema,
	itemCommentCreate: ItemCommentCreateInputSchema,
	itemEvents: ItemEventsInputSchema,
	occurrencesList: OccurrencesListInputSchema,
	occurrencesGet: OccurrencesGetInputSchema,
	projectsList: ProjectsListInputSchema,
	deploysList: DeploysListInputSchema,
	deploysCreate: DeployCreateInputSchema,
} as const;

export const RollbarEndpointOutputSchemas = {
	itemsList: ItemsListResponseSchema,
	itemsGet: ItemsGetResponseSchema,
	itemsUpdate: ItemsUpdateResponseSchema,
	itemComments: ItemCommentsResponseSchema,
	itemCommentCreate: ItemCommentCreateResponseSchema,
	itemEvents: ItemEventsResponseSchema,
	occurrencesList: OccurrencesListResponseSchema,
	occurrencesGet: OccurrencesGetResponseSchema,
	projectsList: ProjectsListResponseSchema,
	deploysList: DeploysListResponseSchema,
	deploysCreate: DeployCreateResponseSchema,
} as const;
