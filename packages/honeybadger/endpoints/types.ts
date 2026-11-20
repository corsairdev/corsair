import { z } from 'zod';

// Inputs use Honeybadger's own names. A field Honeybadger documents as
// `string | null` takes `null` here, because null resets or clears it and is a
// different instruction from leaving the field out. Outputs are `.loose()` with
// the documented fields nullish, so a field Honeybadger adds or drops cannot
// fail a call that already happened.
//
// Every path, parameter, body field and response field below comes from the
// published spec at https://docs.honeybadger.io/api/v3/openapi.json.

// ── Shared scalars ─────────────────────────────────────────────────────────

/** Project IDs are short opaque strings such as `Xk9mZp`. */
const ProjectIdSchema = z.string().min(1).describe('The project ID.');
/** Fault IDs keep their v2 numbers, as strings. */
const FaultIdSchema = z.string().min(1).describe('The fault ID.');
const CheckInIdSchema = z.string().min(1).describe('The check-in ID.');
const SiteIdSchema = z.uuid().describe('The uptime site ID, a UUID.');
const DeployIdSchema = z.string().min(1).describe('The deploy ID.');
const CommentIdSchema = z.string().min(1).describe('The comment ID.');

/**
 * Unix timestamp in seconds. Honeybadger documents these as numbers and
 * rejects an ISO string, so a date is not accepted here.
 */
const UnixSecondsSchema = z
	.number()
	.describe('A Unix timestamp in seconds, not an ISO 8601 string.');

const PageSchema = z
	.number()
	.int()
	.min(1)
	.optional()
	.describe('Page number, 1-indexed. Defaults to 1.');
const PerPageSchema = z
	.number()
	.int()
	.min(1)
	.max(100)
	.optional()
	.describe('Items per page, 1 to 100. Defaults to 25.');
/**
 * Page size on the time-ordered collections. Honeybadger treats a value above
 * 100 as 100, so the upper bound is enforced here instead of being rounded
 * silently.
 */
const LimitSchema = z
	.number()
	.int()
	.min(1)
	.max(100)
	.optional()
	.describe('Maximum items to return, 1 to 100. Defaults to 25.');

const WebLinksSchema = z
	.object({ web: z.string() })
	.describe('Links into the Honeybadger web UI.');

const MetaSchema = z
	.object({ request_id: z.string().optional() })
	.describe('Request metadata. Quote `request_id` when contacting support.');

const PaginationSchema = z.object({
	page: z.number().optional(),
	per_page: z.number().optional(),
});

/** Time-ordered collections page on a cursor rather than a page number. */
const CursorPaginationSchema = z.object({
	limit: z.number().optional(),
	has_older: z.boolean().optional(),
	has_newer: z.boolean().optional(),
	oldest_cursor: z.string().nullish(),
	newest_cursor: z.string().nullish(),
});

const OffsetLinksSchema = z
	.object({
		self: z.string().optional(),
		first: z.string().nullish(),
		prev: z.string().nullish(),
		next: z.string().nullish(),
	})
	.describe('Root-relative paths, to be resolved against the API host.');

const CursorLinksSchema = z.object({
	self: z.string().optional(),
	older: z.string().nullish(),
	newer: z.string().nullish(),
});

// ── projects ───────────────────────────────────────────────────────────────

export const ProjectSchema = z
	.object({
		id: z.string(),
		account_id: z.string(),
		name: z.string(),
		active: z.boolean().nullish(),
		disable_public_links: z.boolean().nullish(),
		environments: z.array(z.string()).nullish(),
		resolve_errors_on_deploy: z.boolean().nullish(),
		user_url: z.string().nullish(),
		source_url: z.string().nullish(),
		user_search_field: z.string().nullish(),
		asana_workspace_id: z.string().nullish(),
		customer_throttle: z.number().nullish(),
		language: z.string().nullish(),
		fault_count: z.number().nullish(),
		unresolved_fault_count: z.number().nullish(),
		last_notice_at: z.string().nullish(),
		earliest_notice_at: z.string().nullish(),
		purge_days: z.number().nullish(),
		created_at: z.string().nullish(),
		links: WebLinksSchema.nullish(),
	})
	.loose();
export type HoneybadgerProject = z.infer<typeof ProjectSchema>;

export const ProjectsListInputSchema = z
	.object({
		name: z
			.string()
			.optional()
			.describe('Exact project name to match. Omitted lists every project.'),
		page: PageSchema,
		per_page: PerPageSchema,
	})
	.strict();
export type ProjectsListInput = z.input<typeof ProjectsListInputSchema>;

const ProjectsListResponseSchema = z
	.object({
		data: z.array(ProjectSchema),
		pagination: PaginationSchema.nullish(),
		links: OffsetLinksSchema.nullish(),
		meta: MetaSchema.nullish(),
	})
	.loose();
export type ProjectsListResponse = z.infer<typeof ProjectsListResponseSchema>;

export const ProjectsGetInputSchema = z
	.object({ project_id: ProjectIdSchema })
	.strict();
export type ProjectsGetInput = z.input<typeof ProjectsGetInputSchema>;

const ProjectsGetResponseSchema = z
	.object({ data: ProjectSchema, meta: MetaSchema.nullish() })
	.loose();
export type ProjectsGetResponse = z.infer<typeof ProjectsGetResponseSchema>;

/** The writable half of a project, shared by create and update. */
const ProjectWriteShape = {
	resolve_errors_on_deploy: z
		.boolean()
		.nullish()
		.describe(
			'Resolve every open fault when a deploy is recorded. Null resets it to true.',
		),
	disable_public_links: z
		.boolean()
		.nullish()
		.describe(
			'Disallow shareable public fault links. Null resets it to false.',
		),
	language: z
		.string()
		.nullish()
		.describe('Primary language, used to format backtraces. Null clears it.'),
	user_url: z
		.string()
		.nullish()
		.describe(
			'Template linking an affected user into your own system. `[user_id]` and `[user_email]` are substituted. Null clears it.',
		),
	source_url: z
		.string()
		.nullish()
		.describe(
			'Template linking a backtrace line to your source host. `[file]` and `[line]` are substituted. Null clears it.',
		),
	user_search_field: z
		.string()
		.nullish()
		.describe(
			'Context key identifying the affected user when it is not `context.user_email` or `context.user_id`. Null clears it.',
		),
	asana_workspace_id: z
		.string()
		.nullish()
		.describe(
			"Asana workspace used by the project's Asana integration. Null clears it.",
		),
	customer_throttle: z
		.number()
		.int()
		.nullish()
		.describe('Notices accepted per minute before throttling. Null clears it.'),
	purge_days: z
		.number()
		.int()
		.nullish()
		.describe(
			'Days to retain notices. Changing it requires custom retention on the account; without it only the current value is accepted. Null clears it.',
		),
} as const;

/**
 * `.loose()`, not `.strict()`: Honeybadger documents that "the `data` object
 * from a GET can be sent back as is", with read-only fields ignored. The body
 * builder sends only the writable keys, so an extra field is dropped here
 * rather than failing before the request.
 */
export const ProjectsCreateInputSchema = z
	.object({
		name: z.string().min(1).describe('Project name.'),
		...ProjectWriteShape,
		team_id: z
			.string()
			.optional()
			.describe(
				'Puts the new project in this team. Create-only, and needs `team:write` in addition to `projects:create`.',
			),
		disable_email_notifications: z
			.boolean()
			.optional()
			.describe(
				'Create-only. Members added with the project get email notifications switched off. Not stored or returned.',
			),
	})
	.loose();
export type ProjectsCreateInput = z.input<typeof ProjectsCreateInputSchema>;

const ProjectsCreateResponseSchema = z
	.object({ data: ProjectSchema, meta: MetaSchema.nullish() })
	.loose();
export type ProjectsCreateResponse = z.infer<
	typeof ProjectsCreateResponseSchema
>;

/** Loose for the same reason as create: a GET's `data` can be sent back. */
export const ProjectsUpdateInputSchema = z
	.object({
		project_id: ProjectIdSchema,
		name: z.string().min(1).optional().describe('Project name.'),
		...ProjectWriteShape,
	})
	.loose();
export type ProjectsUpdateInput = z.input<typeof ProjectsUpdateInputSchema>;

const ProjectsUpdateResponseSchema = z
	.object({ data: ProjectSchema, meta: MetaSchema.nullish() })
	.loose();
export type ProjectsUpdateResponse = z.infer<
	typeof ProjectsUpdateResponseSchema
>;

export const ProjectsDeleteInputSchema = z
	.object({ project_id: ProjectIdSchema })
	.strict();
export type ProjectsDeleteInput = z.input<typeof ProjectsDeleteInputSchema>;

const ProjectsDeleteResponseSchema = z.object({
	deleted: z.literal(true),
	project_id: z.string(),
});
export type ProjectsDeleteResponse = z.infer<
	typeof ProjectsDeleteResponseSchema
>;

const OccurrenceBucketsSchema = z
	.array(
		z
			.object({
				timestamp: z.number().describe('Start of the interval, Unix seconds.'),
				count: z.number().describe('Notices recorded in this interval.'),
			})
			.loose(),
	)
	.describe('One entry per interval, oldest first, including empty intervals.');

export const OCCURRENCE_PERIODS = ['hour', 'day', 'week', 'month'] as const;
const OccurrencePeriodSchema = z
	.enum(OCCURRENCE_PERIODS)
	.describe(
		'Window to report over. `hour` gives 61 one-minute buckets, `day` 25 hourly, `week` 8 daily, `month` 31 daily. Defaults to `hour`.',
	);

export const ProjectsOccurrencesInputSchema = z
	.object({
		project_id: ProjectIdSchema,
		period: OccurrencePeriodSchema.optional(),
		environment: z
			.string()
			.optional()
			.describe('Only count notices from faults in this environment.'),
	})
	.strict();
export type ProjectsOccurrencesInput = z.input<
	typeof ProjectsOccurrencesInputSchema
>;

const ProjectsOccurrencesResponseSchema = z
	.object({
		data: z
			.object({
				project_id: z.string(),
				buckets: OccurrenceBucketsSchema,
			})
			.loose(),
		meta: MetaSchema.extend({
			period: z.string().nullish(),
			interval: z.string().nullish(),
		}).nullish(),
	})
	.loose();
export type ProjectsOccurrencesResponse = z.infer<
	typeof ProjectsOccurrencesResponseSchema
>;

export const OccurrencesListInputSchema = z
	.object({
		period: OccurrencePeriodSchema.optional(),
		environment: z
			.string()
			.optional()
			.describe('Only count notices from faults in this environment.'),
		page: PageSchema,
		per_page: PerPageSchema,
	})
	.strict();
export type OccurrencesListInput = z.input<typeof OccurrencesListInputSchema>;

const OccurrencesListResponseSchema = z
	.object({
		data: z.array(
			z
				.object({ project_id: z.string(), buckets: OccurrenceBucketsSchema })
				.loose(),
		),
		pagination: PaginationSchema.nullish(),
		links: OffsetLinksSchema.nullish(),
		meta: MetaSchema.nullish(),
	})
	.loose();
export type OccurrencesListResponse = z.infer<
	typeof OccurrencesListResponseSchema
>;

export const ProjectsStatsInputSchema = z
	.object({ project_id: ProjectIdSchema })
	.strict();
export type ProjectsStatsInput = z.input<typeof ProjectsStatsInputSchema>;

const ProjectsStatsResponseSchema = z
	.object({
		data: z
			.object({
				id: z.string(),
				fault_count: z.number(),
				unresolved_fault_count: z.number(),
				notice_count_today: z.number(),
				notice_count_week: z.number(),
				notice_count_month: z.number(),
			})
			.loose(),
		meta: MetaSchema.nullish(),
	})
	.loose();
export type ProjectsStatsResponse = z.infer<typeof ProjectsStatsResponseSchema>;

// ── faults ─────────────────────────────────────────────────────────────────

export const FaultSchema = z
	.object({
		id: z.string(),
		project_id: z.string(),
		message: z.string(),
		klass: z.string().nullish(),
		component: z.string().nullish(),
		action: z.string().nullish(),
		environment: z.string().nullish(),
		resolved: z.boolean().nullish(),
		ignored: z.boolean().nullish(),
		created_at: z.string().nullish(),
		last_notice_at: z.string().nullish(),
		notices_count: z.number().nullish(),
		comments_count: z.number().nullish(),
		tags: z.array(z.string()).nullish(),
		assignee_id: z.string().nullish(),
		snoozed: z.boolean().nullish(),
		assignee: z
			.object({
				id: z.string(),
				name: z.string().nullish(),
				email: z.string().nullish(),
			})
			.loose()
			.nullish(),
		last_notice_deploy: z.record(z.string(), z.json()).nullish(),
		tickets: z
			.array(z.object({ url: z.string(), integration_id: z.string() }).loose())
			.nullish(),
		resolve_on_deploy: z.boolean().nullish(),
		recording_paused_until: z.string().nullish(),
		notices_count_in_range: z.number().nullish(),
		links: WebLinksSchema.nullish(),
	})
	.loose();
export type HoneybadgerFault = z.infer<typeof FaultSchema>;

export const FAULT_ORDERS = ['recent', 'frequent'] as const;
export const FAULT_SORTS = ['asc', 'desc'] as const;

/** The `q` and time filters List faults and Get fault counts share. */
const FaultFilterShape = {
	q: z
		.string()
		.optional()
		.describe(
			"Search query in the web UI's error search syntax, such as `environment:production`, `is:resolved` or `class:ArgumentError`. Prefix a filter with `-` to negate it.",
		),
	created_after: UnixSecondsSchema.optional().describe(
		'Only faults first seen after this Unix timestamp.',
	),
	occurred_after: UnixSecondsSchema.optional().describe(
		"Only occurrences after this Unix timestamp. A value before the project's retention window is moved up to it.",
	),
	occurred_before: UnixSecondsSchema.optional().describe(
		'Only occurrences before this Unix timestamp.',
	),
} as const;

export const FaultsListInputSchema = z
	.object({
		project_id: ProjectIdSchema,
		...FaultFilterShape,
		order: z
			.enum(FAULT_ORDERS)
			.optional()
			.describe(
				'`recent` sorts by last occurrence, `frequent` by occurrence count. Omitted sorts by creation time.',
			),
		sort: z
			.enum(FAULT_SORTS)
			.optional()
			.describe(
				'Direction for `order`. Defaults to `desc` for `recent` and `frequent`, `asc` for creation time.',
			),
		page: PageSchema,
		per_page: PerPageSchema,
	})
	.strict();
export type FaultsListInput = z.input<typeof FaultsListInputSchema>;

const FaultsListResponseSchema = z
	.object({
		data: z.array(FaultSchema),
		pagination: PaginationSchema.nullish(),
		links: OffsetLinksSchema.nullish(),
		meta: MetaSchema.nullish(),
	})
	.loose();
export type FaultsListResponse = z.infer<typeof FaultsListResponseSchema>;

export const FaultsGetInputSchema = z
	.object({ project_id: ProjectIdSchema, fault_id: FaultIdSchema })
	.strict();
export type FaultsGetInput = z.input<typeof FaultsGetInputSchema>;

const FaultsGetResponseSchema = z
	.object({ data: FaultSchema, meta: MetaSchema.nullish() })
	.loose();
export type FaultsGetResponse = z.infer<typeof FaultsGetResponseSchema>;

export const FaultsUpdateInputSchema = z
	.object({
		project_id: ProjectIdSchema,
		fault_id: FaultIdSchema,
		resolved: z.boolean().optional().describe('Mark the fault resolved.'),
		ignored: z
			.boolean()
			.optional()
			.describe('Ignore the fault, which stops data collection for it.'),
		assignee_id: z
			.string()
			.nullish()
			.describe('ID of a user on the project. Null unassigns.'),
		tags: z
			.array(z.string())
			.nullish()
			.describe('Tags for the fault. Null clears them.'),
		resolve_on_deploy: z
			.boolean()
			.optional()
			.describe(
				"Resolve the fault when the project's next deploy is recorded, in any environment. Cancelled by resolving or ignoring the fault first.",
			),
	})
	.strict();
export type FaultsUpdateInput = z.input<typeof FaultsUpdateInputSchema>;

const FaultsUpdateResponseSchema = z
	.object({ data: FaultSchema, meta: MetaSchema.nullish() })
	.loose();
export type FaultsUpdateResponse = z.infer<typeof FaultsUpdateResponseSchema>;

export const FaultsDeleteInputSchema = z
	.object({ project_id: ProjectIdSchema, fault_id: FaultIdSchema })
	.strict();
export type FaultsDeleteInput = z.input<typeof FaultsDeleteInputSchema>;

const FaultsDeleteResponseSchema = z.object({
	deleted: z.literal(true),
	project_id: z.string(),
	fault_id: z.string(),
});
export type FaultsDeleteResponse = z.infer<typeof FaultsDeleteResponseSchema>;

/**
 * The selector every bulk fault operation takes. The API requires one of
 * `fault_ids` or `all`; `q` and the time filters narrow what `all` matches.
 */
const FaultSelectionShape = {
	fault_ids: z
		.array(z.string().min(1))
		.min(1)
		.optional()
		.describe(
			'IDs of the faults to change. If any ID is not a fault in this project, nothing changes.',
		),
	all: z
		.boolean()
		.optional()
		.describe(
			'Apply to every fault the other filters match. Required to make an unbounded change explicit; ignored when `fault_ids` is set.',
		),
	dry_run: z
		.boolean()
		.optional()
		.describe(
			'Report what the request would change without changing it. The response has the same shape, with `dry_run` echoed back.',
		),
	q: z
		.string()
		.optional()
		.describe('Search query applied when `fault_ids` is left out.'),
	created_after: UnixSecondsSchema.optional().describe(
		'Applied when `fault_ids` is left out, alongside `q`.',
	),
	occurred_after: UnixSecondsSchema.optional().describe(
		'Applied when `fault_ids` is left out, alongside `q`.',
	),
	occurred_before: UnixSecondsSchema.optional().describe(
		'Applied when `fault_ids` is left out, alongside `q`.',
	),
} as const;

/**
 * The API answers 422 when a bulk request names neither `fault_ids` nor
 * `all`, so the same rule fails here before a call is spent on it. Resolve,
 * unresolve, ignore and unignore take exactly this input, so they share it.
 */
export const FaultsResolveInputSchema = z
	.object({
		project_id: ProjectIdSchema,
		...FaultSelectionShape,
	})
	.superRefine((value, ctx) => {
		if (value.fault_ids === undefined && value.all !== true) {
			ctx.addIssue({
				code: 'custom',
				path: ['fault_ids'],
				message:
					'Send `fault_ids`, or `all: true` to apply the change to every fault the other filters match.',
			});
		}
	});
export type FaultsResolveInput = z.input<typeof FaultsResolveInputSchema>;

const FaultBulkResultSchema = z
	.object({
		count: z
			.number()
			.describe('How many faults changed. Exact, and counts what changed.'),
		dry_run: z.boolean().describe('True when nothing was written.'),
		fault_ids: z
			.array(z.string())
			.describe('Changed fault IDs, capped at 100.'),
		fault_ids_truncated: z.boolean().nullish(),
	})
	.loose();
export type FaultBulkResult = z.infer<typeof FaultBulkResultSchema>;

const FaultBulkResponseSchema = z
	.object({ data: FaultBulkResultSchema, meta: MetaSchema.nullish() })
	.loose();
export type FaultBulkResponse = z.infer<typeof FaultBulkResponseSchema>;

export const FaultsSummaryInputSchema = z
	.object({ project_id: ProjectIdSchema, ...FaultFilterShape })
	.strict();
export type FaultsSummaryInput = z.input<typeof FaultsSummaryInputSchema>;

const FaultsSummaryResponseSchema = z
	.object({
		data: z
			.object({
				total: z.number(),
				environments: z.array(
					z
						.object({
							environment: z.string().nullish(),
							resolved: z.boolean(),
							ignored: z.boolean(),
							count: z.number(),
						})
						.loose(),
				),
			})
			.loose(),
		meta: MetaSchema.nullish(),
	})
	.loose();
export type FaultsSummaryResponse = z.infer<typeof FaultsSummaryResponseSchema>;

export const FaultsAssignInputSchema = z
	.object({
		project_id: ProjectIdSchema,
		fault_id: FaultIdSchema,
		assignee_id: z.string().min(1).describe('ID of a user on the project.'),
	})
	.strict();
export type FaultsAssignInput = z.input<typeof FaultsAssignInputSchema>;

const FaultsAssignResponseSchema = z
	.object({ data: FaultSchema, meta: MetaSchema.nullish() })
	.loose();
export type FaultsAssignResponse = z.infer<typeof FaultsAssignResponseSchema>;

export const FaultsUnassignInputSchema = z
	.object({ project_id: ProjectIdSchema, fault_id: FaultIdSchema })
	.strict();
export type FaultsUnassignInput = z.input<typeof FaultsUnassignInputSchema>;

export const FaultsMergeInputSchema = z
	.object({
		project_id: ProjectIdSchema,
		fault_id: FaultIdSchema.describe(
			'The fault that is merged away into `target_fault_id`.',
		),
		target_fault_id: z
			.string()
			.min(1)
			.describe('The fault to keep. The fault in the path is merged into it.'),
	})
	.strict();
export type FaultsMergeInput = z.input<typeof FaultsMergeInputSchema>;

const FaultsMergeResponseSchema = z
	.object({
		data: z
			.object({
				batch_id: z.string().describe('Identifies the background merge.'),
				source_id: z.string(),
				target_id: z.string(),
			})
			.loose(),
		meta: MetaSchema.nullish(),
	})
	.loose();
export type FaultsMergeResponse = z.infer<typeof FaultsMergeResponseSchema>;

const FAULT_PAUSE_TIMES = ['hour', 'day', 'week'] as const;

export const FaultsPauseRecordingInputSchema = z
	.object({
		project_id: ProjectIdSchema,
		fault_id: FaultIdSchema,
		time: z
			.enum(FAULT_PAUSE_TIMES)
			.describe(
				'How long notices are discarded. Pausing again replaces the end time.',
			),
	})
	.strict();
export type FaultsPauseRecordingInput = z.input<
	typeof FaultsPauseRecordingInputSchema
>;

const FaultsPauseRecordingResponseSchema = z
	.object({ data: FaultSchema, meta: MetaSchema.nullish() })
	.loose();
export type FaultsPauseRecordingResponse = z.infer<
	typeof FaultsPauseRecordingResponseSchema
>;

export const FaultsResumeRecordingInputSchema = z
	.object({ project_id: ProjectIdSchema, fault_id: FaultIdSchema })
	.strict();
export type FaultsResumeRecordingInput = z.input<
	typeof FaultsResumeRecordingInputSchema
>;

const FaultsResumeRecordingResponseSchema = FaultsPauseRecordingResponseSchema;
export type FaultsResumeRecordingResponse = z.infer<
	typeof FaultsResumeRecordingResponseSchema
>;

/** `count` is one of three values, not any integer. */
export const FAULT_SNOOZE_COUNTS = [10, 100, 1000] as const;

export const FaultsSnoozeInputSchema = z
	.object({
		project_id: ProjectIdSchema,
		fault_id: FaultIdSchema,
		time: z
			.enum(FAULT_PAUSE_TIMES)
			.optional()
			.describe('Snooze for this long. Send one of `time` or `count`.'),
		count: z
			.union([z.literal(10), z.literal(100), z.literal(1000)])
			.optional()
			.describe(
				'Snooze until this many further occurrences have arrived. Send one of `time` or `count`.',
			),
	})
	.strict()
	.superRefine((value, ctx) => {
		const given = [value.time, value.count].filter(
			(field) => field !== undefined,
		);
		// The API documents "send one of `time` or `count`" but not what it does
		// with both or neither, so the choice is made here instead of guessed.
		if (given.length !== 1) {
			ctx.addIssue({
				code: 'custom',
				path: ['time'],
				message: 'Send exactly one of `time` or `count`.',
			});
		}
	});
export type FaultsSnoozeInput = z.input<typeof FaultsSnoozeInputSchema>;

const FaultsSnoozeResponseSchema = z
	.object({ data: FaultSchema, meta: MetaSchema.nullish() })
	.loose();
export type FaultsSnoozeResponse = z.infer<typeof FaultsSnoozeResponseSchema>;

export const FaultsUnsnoozeInputSchema = z
	.object({ project_id: ProjectIdSchema, fault_id: FaultIdSchema })
	.strict();
export type FaultsUnsnoozeInput = z.input<typeof FaultsUnsnoozeInputSchema>;

const FaultsUnsnoozeResponseSchema = FaultsSnoozeResponseSchema;
export type FaultsUnsnoozeResponse = z.infer<
	typeof FaultsUnsnoozeResponseSchema
>;

export const FaultsAffectedUsersInputSchema = z
	.object({
		project_id: ProjectIdSchema,
		fault_id: FaultIdSchema,
		q: z.string().optional(),
	})
	.strict();
export type FaultsAffectedUsersInput = z.input<
	typeof FaultsAffectedUsersInputSchema
>;

const FaultsAffectedUsersResponseSchema = z
	.object({
		data: z.array(
			z
				.object({
					user: z
						.string()
						.describe(
							'The affected user as the reporting client identified them: not a Honeybadger user ID, and not necessarily an email.',
						),
					count: z.number(),
				})
				.loose(),
		),
		meta: MetaSchema.nullish(),
	})
	.loose();
export type FaultsAffectedUsersResponse = z.infer<
	typeof FaultsAffectedUsersResponseSchema
>;

export const FaultsOccurrencesInputSchema = z
	.object({
		project_id: ProjectIdSchema,
		fault_id: FaultIdSchema,
		occurred_after: UnixSecondsSchema.optional().describe(
			'Start of the window. With neither bound the window is the last hour; with only `occurred_before`, the hour before it.',
		),
		occurred_before:
			UnixSecondsSchema.optional().describe('End of the window.'),
		q: z.string().optional().describe('Search query to narrow the counts.'),
	})
	.strict();
export type FaultsOccurrencesInput = z.input<
	typeof FaultsOccurrencesInputSchema
>;

const FaultsOccurrencesResponseSchema = z
	.object({
		data: z.array(
			z.object({ timestamp: z.number(), count: z.number() }).loose(),
		),
		meta: MetaSchema.extend({
			window: z
				.object({ occurred_after: z.number(), occurred_before: z.number() })
				.loose()
				.nullish(),
			interval_seconds: z.number().nullish(),
			retention_truncated: z.boolean().nullish(),
		}).nullish(),
	})
	.loose();
export type FaultsOccurrencesResponse = z.infer<
	typeof FaultsOccurrencesResponseSchema
>;

// ── notices ────────────────────────────────────────────────────────────────

const NoticeFrameSchema = z
	.object({
		file: z.string().nullish(),
		line: z.number().nullish(),
		column: z.number().nullish(),
		method: z.string().nullish(),
		in_app: z.boolean().nullish(),
		mapping: z.string().nullish(),
		source: z
			.array(
				z
					.object({
						first_line: z.number(),
						lines: z.array(z.string()),
					})
					.loose(),
			)
			.nullish(),
	})
	.loose();

export const NoticeSchema = z
	.object({
		id: z.string(),
		fault_id: z.string(),
		project_id: z.string(),
		environment: z.string().nullish(),
		message: z.string().nullish(),
		created_at: z.string().nullish(),
		request: z
			.object({
				url: z.string().nullish(),
				component: z.string().nullish(),
				action: z.string().nullish(),
				params: z.record(z.string(), z.json()).nullish(),
				session: z.record(z.string(), z.json()).nullish(),
			})
			.loose()
			.nullish(),
		context: z.record(z.string(), z.json()).nullish(),
		backtrace: z.array(NoticeFrameSchema).nullish(),
		backtrace_mode: z.string().nullish(),
		backtrace_total_frames: z.number().nullish(),
		backtrace_truncated: z.boolean().nullish(),
		request_fields_removed: z.array(z.string()).nullish(),
		links: WebLinksSchema.nullish(),
	})
	.loose();
export type HoneybadgerNotice = z.infer<typeof NoticeSchema>;

const UnmappedSchema = z
	.boolean()
	.optional()
	.describe(
		'Return the backtrace as the client reported it instead of source-mapped. Defaults to false.',
	);

export const NoticesListInputSchema = z
	.object({
		project_id: ProjectIdSchema,
		fault_id: FaultIdSchema,
		limit: LimitSchema,
		before: z
			.string()
			.optional()
			.describe(
				'Cursor for older notices, taken from `links.older` or `pagination.oldest_cursor`.',
			),
		after: z
			.string()
			.optional()
			.describe(
				'Cursor for newer notices, taken from `pagination.newest_cursor`.',
			),
		unmapped: UnmappedSchema,
	})
	.strict();
export type NoticesListInput = z.input<typeof NoticesListInputSchema>;

const NoticesListResponseSchema = z
	.object({
		data: z.array(NoticeSchema),
		pagination: CursorPaginationSchema.nullish(),
		links: CursorLinksSchema.nullish(),
		meta: MetaSchema.nullish(),
	})
	.loose();
export type NoticesListResponse = z.infer<typeof NoticesListResponseSchema>;

export const NoticesGetInputSchema = z
	.object({
		uuid: z
			.uuid()
			.describe(
				'The notice UUID, which addresses it without its project or fault.',
			),
		unmapped: UnmappedSchema,
	})
	.strict();
export type NoticesGetInput = z.input<typeof NoticesGetInputSchema>;

const NoticesGetResponseSchema = z
	.object({ data: NoticeSchema, meta: MetaSchema.nullish() })
	.loose();
export type NoticesGetResponse = z.infer<typeof NoticesGetResponseSchema>;

// ── comments ───────────────────────────────────────────────────────────────

export const CommentSchema = z
	.object({
		id: z.string(),
		fault_id: z.string(),
		author: z
			.object({
				id: z.string().nullish(),
				name: z.string().nullish(),
				email: z.string().nullish(),
			})
			.loose()
			.nullish(),
		body: z.string().nullish(),
		source: z.string().nullish(),
		event: z.string().nullish(),
		created_at: z.string().nullish(),
		links: WebLinksSchema.nullish(),
	})
	.loose();
export type HoneybadgerComment = z.infer<typeof CommentSchema>;

export const CommentsListInputSchema = z
	.object({
		project_id: ProjectIdSchema,
		fault_id: FaultIdSchema,
		limit: LimitSchema,
		before: z.string().optional().describe('Cursor for older comments.'),
		after: z.string().optional().describe('Cursor for newer comments.'),
	})
	.strict();
export type CommentsListInput = z.input<typeof CommentsListInputSchema>;

const CommentsListResponseSchema = z
	.object({
		data: z.array(CommentSchema),
		pagination: CursorPaginationSchema.nullish(),
		links: CursorLinksSchema.nullish(),
		meta: MetaSchema.nullish(),
	})
	.loose();
export type CommentsListResponse = z.infer<typeof CommentsListResponseSchema>;

export const CommentsGetInputSchema = z
	.object({
		project_id: ProjectIdSchema,
		fault_id: FaultIdSchema,
		comment_id: CommentIdSchema,
	})
	.strict();
export type CommentsGetInput = z.input<typeof CommentsGetInputSchema>;

const CommentsGetResponseSchema = z
	.object({ data: CommentSchema, meta: MetaSchema.nullish() })
	.loose();
export type CommentsGetResponse = z.infer<typeof CommentsGetResponseSchema>;

export const CommentsCreateInputSchema = z
	.object({
		project_id: ProjectIdSchema,
		fault_id: FaultIdSchema,
		body: z
			.string()
			.min(1)
			.describe(
				'The comment text. `@mentions` notify the named project members.',
			),
	})
	.strict();
export type CommentsCreateInput = z.input<typeof CommentsCreateInputSchema>;

const CommentsCreateResponseSchema = z
	.object({ data: CommentSchema, meta: MetaSchema.nullish() })
	.loose();
export type CommentsCreateResponse = z.infer<
	typeof CommentsCreateResponseSchema
>;

export const CommentsUpdateInputSchema = z
	.object({
		project_id: ProjectIdSchema,
		fault_id: FaultIdSchema,
		comment_id: CommentIdSchema,
		body: z.string().min(1).describe('The new comment text.'),
	})
	.strict();
export type CommentsUpdateInput = z.input<typeof CommentsUpdateInputSchema>;

const CommentsUpdateResponseSchema = z
	.object({ data: CommentSchema, meta: MetaSchema.nullish() })
	.loose();
export type CommentsUpdateResponse = z.infer<
	typeof CommentsUpdateResponseSchema
>;

export const CommentsDeleteInputSchema = z
	.object({
		project_id: ProjectIdSchema,
		fault_id: FaultIdSchema,
		comment_id: CommentIdSchema,
	})
	.strict();
export type CommentsDeleteInput = z.input<typeof CommentsDeleteInputSchema>;

const CommentsDeleteResponseSchema = z.object({
	deleted: z.literal(true),
	project_id: z.string(),
	fault_id: z.string(),
	comment_id: z.string(),
});
export type CommentsDeleteResponse = z.infer<
	typeof CommentsDeleteResponseSchema
>;

// ── deploys ────────────────────────────────────────────────────────────────

export const DeploySchema = z
	.object({
		id: z.string(),
		project_id: z.string(),
		environment: z.string().nullish(),
		revision: z.string().nullish(),
		repository: z.string().nullish(),
		local_username: z.string().nullish(),
		created_at: z.string().nullish(),
	})
	.loose();
export type HoneybadgerDeploy = z.infer<typeof DeploySchema>;

export const DeploysListInputSchema = z
	.object({
		project_id: ProjectIdSchema,
		limit: LimitSchema,
		before: z.string().optional().describe('Cursor for older deploys.'),
		after: z.string().optional().describe('Cursor for newer deploys.'),
		environment: z
			.string()
			.optional()
			.describe('Exact environment name to match. Ignored when blank.'),
		local_username: z
			.string()
			.optional()
			.describe(
				'Exact deploy username to match. Ignored when blank; combines with `environment`.',
			),
	})
	.strict();
export type DeploysListInput = z.input<typeof DeploysListInputSchema>;

const DeploysListResponseSchema = z
	.object({
		data: z.array(DeploySchema),
		pagination: CursorPaginationSchema.nullish(),
		links: CursorLinksSchema.nullish(),
		meta: MetaSchema.nullish(),
	})
	.loose();
export type DeploysListResponse = z.infer<typeof DeploysListResponseSchema>;

export const DeploysGetInputSchema = z
	.object({ project_id: ProjectIdSchema, deploy_id: DeployIdSchema })
	.strict();
export type DeploysGetInput = z.input<typeof DeploysGetInputSchema>;

const DeploysGetResponseSchema = z
	.object({ data: DeploySchema, meta: MetaSchema.nullish() })
	.loose();
export type DeploysGetResponse = z.infer<typeof DeploysGetResponseSchema>;

export const DeploysDeleteInputSchema = z
	.object({ project_id: ProjectIdSchema, deploy_id: DeployIdSchema })
	.strict();
export type DeploysDeleteInput = z.input<typeof DeploysDeleteInputSchema>;

const DeploysDeleteResponseSchema = z.object({
	deleted: z.literal(true),
	project_id: z.string(),
	deploy_id: z.string(),
});
export type DeploysDeleteResponse = z.infer<typeof DeploysDeleteResponseSchema>;

// ── environments ───────────────────────────────────────────────────────────

export const EnvironmentSchema = z
	.object({
		id: z.string(),
		project_id: z.string(),
		name: z.string(),
		notifications: z.boolean().nullish(),
		created_at: z.string().nullish(),
	})
	.loose();
export type HoneybadgerEnvironment = z.infer<typeof EnvironmentSchema>;

export const EnvironmentsListInputSchema = z
	.object({
		project_id: ProjectIdSchema,
		page: PageSchema,
		per_page: PerPageSchema,
	})
	.strict();
export type EnvironmentsListInput = z.input<typeof EnvironmentsListInputSchema>;

const EnvironmentsListResponseSchema = z
	.object({
		data: z.array(EnvironmentSchema),
		pagination: PaginationSchema.nullish(),
		links: OffsetLinksSchema.nullish(),
		meta: MetaSchema.nullish(),
	})
	.loose();
export type EnvironmentsListResponse = z.infer<
	typeof EnvironmentsListResponseSchema
>;

export const EnvironmentsGetInputSchema = z
	.object({ project_id: ProjectIdSchema, environment_id: z.string().min(1) })
	.strict();
export type EnvironmentsGetInput = z.input<typeof EnvironmentsGetInputSchema>;

const EnvironmentsGetResponseSchema = z
	.object({ data: EnvironmentSchema, meta: MetaSchema.nullish() })
	.loose();
export type EnvironmentsGetResponse = z.infer<
	typeof EnvironmentsGetResponseSchema
>;

export const EnvironmentsCreateInputSchema = z
	.object({
		project_id: ProjectIdSchema,
		name: z
			.string()
			.min(1)
			.max(255)
			.describe('Environment name. Unique per project, and case-sensitive.'),
		notifications: z
			.boolean()
			.nullish()
			.describe(
				'Whether errors in this environment notify. Null means the default, true.',
			),
	})
	.strict();
export type EnvironmentsCreateInput = z.input<
	typeof EnvironmentsCreateInputSchema
>;

const EnvironmentsCreateResponseSchema = z
	.object({ data: EnvironmentSchema, meta: MetaSchema.nullish() })
	.loose();
export type EnvironmentsCreateResponse = z.infer<
	typeof EnvironmentsCreateResponseSchema
>;

export const EnvironmentsUpdateInputSchema = z
	.object({
		project_id: ProjectIdSchema,
		environment_id: z.string().min(1),
		notifications: z
			.boolean()
			.nullish()
			.describe(
				'Whether errors in this environment notify. Null resets it to true.',
			),
	})
	.strict();
export type EnvironmentsUpdateInput = z.input<
	typeof EnvironmentsUpdateInputSchema
>;

const EnvironmentsUpdateResponseSchema = EnvironmentsCreateResponseSchema;
export type EnvironmentsUpdateResponse = z.infer<
	typeof EnvironmentsUpdateResponseSchema
>;

export const EnvironmentsDeleteInputSchema = z
	.object({ project_id: ProjectIdSchema, environment_id: z.string().min(1) })
	.strict();
export type EnvironmentsDeleteInput = z.input<
	typeof EnvironmentsDeleteInputSchema
>;

const EnvironmentsDeleteResponseSchema = z.object({
	deleted: z.literal(true),
	project_id: z.string(),
	environment_id: z.string(),
});
export type EnvironmentsDeleteResponse = z.infer<
	typeof EnvironmentsDeleteResponseSchema
>;

const EnvironmentIdsSchema = z
	.array(z.string().min(1))
	.min(1)
	.describe(
		"IDs of the environments to change. If any ID is not one of the project's environments, nothing changes.",
	);

export const EnvironmentsBulkDeleteInputSchema = z
	.object({
		project_id: ProjectIdSchema,
		environment_ids: EnvironmentIdsSchema,
	})
	.strict();
export type EnvironmentsBulkDeleteInput = z.input<
	typeof EnvironmentsBulkDeleteInputSchema
>;

const CountResponseSchema = z
	.object({
		data: z.object({ count: z.number() }).loose(),
		meta: MetaSchema.nullish(),
	})
	.loose();
export type CountResponse = z.infer<typeof CountResponseSchema>;

export const EnvironmentsBulkUpdateInputSchema = z
	.object({
		project_id: ProjectIdSchema,
		environment_ids: EnvironmentIdsSchema,
		notifications: z
			.boolean()
			.describe('Whether notifications should fire for these environments.'),
	})
	.strict();
export type EnvironmentsBulkUpdateInput = z.input<
	typeof EnvironmentsBulkUpdateInputSchema
>;

// ── check-ins ──────────────────────────────────────────────────────────────

export const CHECK_IN_SCHEDULE_TYPES = ['simple', 'cron'] as const;
export const CHECK_IN_STATES = [
	'pending',
	'reporting',
	'missing',
	'paused',
] as const;

/**
 * A duration such as `5 minutes`, `1 hour 30 minutes` or `01:30:00`. This is
 * the pattern Honeybadger publishes, so a value it would reject fails here.
 */
const DurationPattern =
	/^(\d+ (second|minute|hour|day|week|month|year)s?)( \d+ (second|minute|hour|day|week|month|year)s?)*$|^\d\d:\d\d:\d\d$/;

const DurationSchema = z
	.string()
	.regex(
		DurationPattern,
		'A duration such as `5 minutes`, `1 hour 30 minutes` or `01:30:00`.',
	);

export const CheckInSchema = z
	.object({
		id: z.string(),
		project_id: z.string(),
		name: z.string().nullish(),
		slug: z.string().nullish(),
		schedule_type: z.string().nullish(),
		state: z.string().nullish(),
		reported_at: z.string().nullish(),
		expected_at: z.string().nullish(),
		missed_count: z.number().nullish(),
		grace_period: z.string().nullish(),
		report_url: z.string().nullish(),
		cron_schedule: z.string().nullish(),
		cron_timezone: z.string().nullish(),
		report_period: z.string().nullish(),
		created_at: z.string().nullish(),
		links: WebLinksSchema.nullish(),
	})
	.loose();
export type HoneybadgerCheckIn = z.infer<typeof CheckInSchema>;

export const CheckInsListInputSchema = z
	.object({
		project_id: ProjectIdSchema,
		page: PageSchema,
		per_page: PerPageSchema,
	})
	.strict();
export type CheckInsListInput = z.input<typeof CheckInsListInputSchema>;

const CheckInsListResponseSchema = z
	.object({
		data: z.array(CheckInSchema),
		pagination: PaginationSchema.nullish(),
		links: OffsetLinksSchema.nullish(),
		meta: MetaSchema.nullish(),
	})
	.loose();
export type CheckInsListResponse = z.infer<typeof CheckInsListResponseSchema>;

export const CheckInsGetInputSchema = z
	.object({ project_id: ProjectIdSchema, check_in_id: CheckInIdSchema })
	.strict();
export type CheckInsGetInput = z.input<typeof CheckInsGetInputSchema>;

const CheckInsGetResponseSchema = z
	.object({ data: CheckInSchema, meta: MetaSchema.nullish() })
	.loose();
export type CheckInsGetResponse = z.infer<typeof CheckInsGetResponseSchema>;

/** The writable half of a check-in, shared by create, update and replace. */
const CheckInWriteShape = {
	name: z
		.string()
		.nullish()
		.describe(
			'Display name. Null clears it; an unnamed check-in shows its ID.',
		),
	slug: z
		.string()
		.nullish()
		.describe(
			"Short identifier used in the check-in's reporting URL. Renaming it breaks jobs reporting to `…/check_in/<ingestion key>/<slug>`.",
		),
	schedule_type: z
		.enum(CHECK_IN_SCHEDULE_TYPES)
		.optional()
		.describe(
			'`simple` expects a report every `report_period`; `cron` expects reports on a cron schedule and requires `cron_schedule`. Switching to `simple` clears `cron_schedule`; switching to `cron` clears `report_period`. Defaults to `simple` on create.',
		),
	report_period: DurationSchema.nullish().describe(
		'How often a report is expected, for `simple` schedules. Required unless `schedule_type` is `cron`, and may not be zero. Returned in long form.',
	),
	grace_period: DurationSchema.nullish().describe(
		'How long after the expected time before the check-in counts as missing. Null resets it to zero.',
	),
	cron_schedule: z
		.string()
		.nullish()
		.describe('Cron expression, required when `schedule_type` is `cron`.'),
	cron_timezone: z
		.string()
		.nullish()
		.describe(
			'Timezone the cron schedule is evaluated in, as the web app lists it (`Central Time (US & Canada)`), not an IANA identifier. Null resets it to `UTC`.',
		),
} as const;

/**
 * The API requires `report_period` unless the schedule is a cron, and
 * `cron_schedule` with `cron_timezone` when it is. Both rules are checked here
 * so the call is not spent discovering them.
 */
function refineCheckInSchedule(
	value: {
		schedule_type?: 'simple' | 'cron';
		report_period?: string | null;
		cron_schedule?: string | null;
	},
	ctx: z.RefinementCtx,
): void {
	if (value.schedule_type === 'cron') {
		if (value.cron_schedule === undefined || value.cron_schedule === null) {
			ctx.addIssue({
				code: 'custom',
				path: ['cron_schedule'],
				message: 'A `cron` schedule needs `cron_schedule`.',
			});
		}
		return;
	}
	if (
		value.report_period === undefined ||
		value.report_period === null ||
		value.report_period.length === 0
	) {
		ctx.addIssue({
			code: 'custom',
			path: ['report_period'],
			message: 'A `simple` schedule needs `report_period`.',
		});
	}
}

export const CheckInsCreateInputSchema = z
	.object({ project_id: ProjectIdSchema, ...CheckInWriteShape })
	.strict()
	.superRefine(refineCheckInSchedule);
export type CheckInsCreateInput = z.input<typeof CheckInsCreateInputSchema>;

const CheckInsCreateResponseSchema = z
	.object({ data: CheckInSchema, meta: MetaSchema.nullish() })
	.loose();
export type CheckInsCreateResponse = z.infer<
	typeof CheckInsCreateResponseSchema
>;

export const CheckInsUpdateInputSchema = z
	.object({
		project_id: ProjectIdSchema,
		check_in_id: CheckInIdSchema,
		...CheckInWriteShape,
	})
	.strict();
export type CheckInsUpdateInput = z.input<typeof CheckInsUpdateInputSchema>;

const CheckInsUpdateResponseSchema = CheckInsCreateResponseSchema;
export type CheckInsUpdateResponse = z.infer<
	typeof CheckInsUpdateResponseSchema
>;

export const CheckInsDeleteInputSchema = z
	.object({ project_id: ProjectIdSchema, check_in_id: CheckInIdSchema })
	.strict();
export type CheckInsDeleteInput = z.input<typeof CheckInsDeleteInputSchema>;

const CheckInsDeleteResponseSchema = z.object({
	deleted: z.literal(true),
	project_id: z.string(),
	check_in_id: z.string(),
});
export type CheckInsDeleteResponse = z.infer<
	typeof CheckInsDeleteResponseSchema
>;

export const CheckInsReplaceInputSchema = z
	.object({
		project_id: ProjectIdSchema,
		check_ins: z
			.array(
				z
					.object({
						...CheckInWriteShape,
						// After the spread: the write shape's slug is optional and
						// nullable, but a replace entry is matched by slug, so this
						// one is required.
						slug: z
							.string()
							.min(1)
							.describe(
								'Matches an existing check-in by slug. A match is updated, an unmatched slug creates one.',
							),
					})
					.strict(),
			)
			.min(1)
			.describe(
				"The project's complete set of check-ins. Any check-in this list does not name is deleted.",
			),
	})
	.strict();
export type CheckInsReplaceInput = z.input<typeof CheckInsReplaceInputSchema>;

/**
 * A replace answers one result per entry, not the check-ins themselves: an
 * entry was created, updated, or deleted because the list did not name it.
 */
export const CHECK_IN_REPLACE_OPERATIONS = [
	'create',
	'update',
	'delete',
] as const;

const CheckInsReplaceResultSchema = z
	.object({
		operation: z.enum(CHECK_IN_REPLACE_OPERATIONS),
		slug: z.string(),
		success: z.literal(true),
	})
	.loose();
export type CheckInsReplaceResult = z.infer<typeof CheckInsReplaceResultSchema>;

const CheckInsReplaceResponseSchema = z
	.object({
		data: z.array(CheckInsReplaceResultSchema),
		meta: MetaSchema.nullish(),
	})
	.loose();
export type CheckInsReplaceResponse = z.infer<
	typeof CheckInsReplaceResponseSchema
>;

export const CHECK_IN_EVENT_STATES = [
	'reporting',
	'missing',
	'paused',
] as const;

export const CheckInEventSchema = z
	.object({
		check_in_id: z.string(),
		state: z.string(),
		created_at: z.string().nullish(),
		payload: z
			.string()
			.nullish()
			.describe(
				'The payload reported with the check-in, as it was sent. Retained only on plans with advanced check-ins.',
			),
	})
	.loose();
export type HoneybadgerCheckInEvent = z.infer<typeof CheckInEventSchema>;

export const CheckInsEventsInputSchema = z
	.object({
		project_id: ProjectIdSchema,
		check_in_id: CheckInIdSchema,
		limit: LimitSchema,
		created_before: UnixSecondsSchema.optional().describe(
			'Only items created before this Unix timestamp. Take it from `links.older`; fractional seconds count.',
		),
	})
	.strict();
export type CheckInsEventsInput = z.input<typeof CheckInsEventsInputSchema>;

const CheckInsEventsResponseSchema = z
	.object({
		data: z.array(CheckInEventSchema),
		pagination: CursorPaginationSchema.nullish(),
		links: CursorLinksSchema.nullish(),
		meta: MetaSchema.nullish(),
	})
	.loose();
export type CheckInsEventsResponse = z.infer<
	typeof CheckInsEventsResponseSchema
>;

// ── sites (uptime) ─────────────────────────────────────────────────────────

export const SITE_MATCH_TYPES = [
	'success',
	'exact',
	'include',
	'exclude',
	'jmespath',
] as const;
export const SITE_REQUEST_METHODS = [
	'GET',
	'POST',
	'PUT',
	'PATCH',
	'DELETE',
] as const;
/** Documented as an enum, so a value outside it is refused rather than rounded. */
export const SITE_FREQUENCIES = [1, 2, 5, 15] as const;
export const SITE_LOCATIONS = [
	'Virginia',
	'Frankfurt',
	'Singapore',
	'London',
	'Oregon',
] as const;
export const SITE_STATES = ['pending', 'up', 'down'] as const;

export const SiteSchema = z
	.object({
		id: z.string(),
		project_id: z.string(),
		name: z.string().nullish(),
		url: z.string().nullish(),
		active: z.boolean().nullish(),
		state: z.string().nullish(),
		last_checked_at: z.string().nullish(),
		match_type: z.string().nullish(),
		match: z.string().nullish(),
		request_method: z.string().nullish(),
		frequency: z.number().nullish(),
		locations: z.array(z.string()).nullish(),
		validate_ssl: z.boolean().nullish(),
		request_headers: z.record(z.string(), z.string()).nullish(),
		request_body: z.string().nullish(),
		outage_threshold: z.number().nullish(),
		timeout: z.number().nullish(),
		created_at: z.string().nullish(),
		links: WebLinksSchema.nullish(),
	})
	.loose();
export type HoneybadgerSite = z.infer<typeof SiteSchema>;

/** The writable half of a site, shared by create and update. */
const SiteWriteShape = {
	name: z
		.string()
		.optional()
		.describe('Name shown for the site in Honeybadger and on status pages.'),
	match_type: z
		.enum(SITE_MATCH_TYPES)
		.nullish()
		.describe(
			'How a check decides the site is up. Null resets it to `success`.',
		),
	match: z
		.string()
		.max(255)
		.nullish()
		.describe(
			'What `match_type` compares against. Required unless `match_type` is `success`, and refused with `success`. Null clears it.',
		),
	request_method: z
		.enum(SITE_REQUEST_METHODS)
		.nullish()
		.describe('HTTP method each check sends. Null resets it to `GET`.'),
	validate_ssl: z
		.boolean()
		.nullish()
		.describe(
			'Fail the check when the TLS certificate does not validate. Null resets it to true.',
		),
	request_body: z
		.string()
		.max(32768)
		.nullish()
		.describe('Body to send with the request, up to 32 KB. Null clears it.'),
	request_headers: z
		.record(z.string(), z.string())
		.nullish()
		.describe(
			'Headers to send with the request. Replaces the stored headers; null or `{}` clears them.',
		),
	frequency: z
		.union([z.literal(1), z.literal(2), z.literal(5), z.literal(15)])
		.nullish()
		.describe(
			'Minutes between checks. The plan sets the most frequent allowed. Null resets it to 5.',
		),
	locations: z
		.array(z.enum(SITE_LOCATIONS))
		.nullish()
		.describe('Locations checks run from. Null or empty means every location.'),
	outage_threshold: z
		.number()
		.int()
		.nullish()
		.describe(
			'Consecutive failures before an outage is declared. Null means down once failures reach half the locations.',
		),
	active: z
		.boolean()
		.nullish()
		.describe('Whether monitoring is active. Null resets it to true.'),
	timeout: z
		.number()
		.int()
		.min(1)
		.max(120)
		.nullish()
		.describe(
			'Request timeout in seconds, 1 to 120, and less than the frequency in seconds. Requires the uptime timeout feature on the account.',
		),
} as const;

/**
 * `match` and `match_type` are one decision: every type but `success` needs
 * `match`, and `success` refuses it. Both directions are checked here.
 */
function refineSiteMatch(
	value: { match_type?: string | null; match?: string | null },
	ctx: z.RefinementCtx,
): void {
	const type = value.match_type ?? 'success';
	const hasMatch = value.match !== undefined && value.match !== null;
	if (type === 'success' && hasMatch) {
		ctx.addIssue({
			code: 'custom',
			path: ['match'],
			message: '`match` must be left out when `match_type` is `success`.',
		});
	}
	if (type !== 'success' && !hasMatch) {
		ctx.addIssue({
			code: 'custom',
			path: ['match'],
			message: `\`match\` is required when \`match_type\` is \`${type}\`.`,
		});
	}
}

/** `timeout` must be shorter than the interval between checks. */
function refineSiteTimeout(
	value: { frequency?: number | null; timeout?: number | null },
	ctx: z.RefinementCtx,
): void {
	const seconds = value.frequency ?? 5;
	const timeout = value.timeout;
	if (timeout !== undefined && timeout !== null && timeout >= seconds * 60) {
		ctx.addIssue({
			code: 'custom',
			path: ['timeout'],
			message: `\`timeout\` must be less than the frequency in seconds (${seconds * 60}).`,
		});
	}
}

export const SitesListInputSchema = z
	.object({
		project_id: ProjectIdSchema,
		page: PageSchema,
		per_page: PerPageSchema,
	})
	.strict();
export type SitesListInput = z.input<typeof SitesListInputSchema>;

const SitesListResponseSchema = z
	.object({
		data: z.array(SiteSchema),
		pagination: PaginationSchema.nullish(),
		links: OffsetLinksSchema.nullish(),
		meta: MetaSchema.nullish(),
	})
	.loose();
export type SitesListResponse = z.infer<typeof SitesListResponseSchema>;

export const SitesGetInputSchema = z
	.object({ project_id: ProjectIdSchema, site_id: SiteIdSchema })
	.strict();
export type SitesGetInput = z.input<typeof SitesGetInputSchema>;

const SitesGetResponseSchema = z
	.object({ data: SiteSchema, meta: MetaSchema.nullish() })
	.loose();
export type SitesGetResponse = z.infer<typeof SitesGetResponseSchema>;

export const SitesCreateInputSchema = z
	.object({
		project_id: ProjectIdSchema,
		url: z
			.string()
			.regex(
				/^https?:\/\/\S/,
				'Must start with http:// or https://, with no surrounding whitespace.',
			)
			.describe('URL to monitor.'),
		...SiteWriteShape,
	})
	.strict()
	.superRefine(refineSiteMatch)
	.superRefine(refineSiteTimeout);
export type SitesCreateInput = z.input<typeof SitesCreateInputSchema>;

const SitesCreateResponseSchema = z
	.object({ data: SiteSchema, meta: MetaSchema.nullish() })
	.loose();
export type SitesCreateResponse = z.infer<typeof SitesCreateResponseSchema>;

export const SitesUpdateInputSchema = z
	.object({
		project_id: ProjectIdSchema,
		site_id: SiteIdSchema,
		url: z
			.string()
			.regex(
				/^https?:\/\/\S/,
				'Must start with http:// or https://, with no surrounding whitespace.',
			)
			.optional()
			.describe('URL to monitor.'),
		...SiteWriteShape,
	})
	.strict()
	.superRefine(refineSiteTimeout);
export type SitesUpdateInput = z.input<typeof SitesUpdateInputSchema>;

const SitesUpdateResponseSchema = SitesCreateResponseSchema;
export type SitesUpdateResponse = z.infer<typeof SitesUpdateResponseSchema>;

export const SitesDeleteInputSchema = z
	.object({ project_id: ProjectIdSchema, site_id: SiteIdSchema })
	.strict();
export type SitesDeleteInput = z.input<typeof SitesDeleteInputSchema>;

const SitesDeleteResponseSchema = z.object({
	deleted: z.literal(true),
	project_id: z.string(),
	site_id: z.string(),
});
export type SitesDeleteResponse = z.infer<typeof SitesDeleteResponseSchema>;

export const UptimeCheckSchema = z
	.object({
		created_at: z.string().nullish(),
		duration: z
			.number()
			.nullish()
			.describe('Response time in whole milliseconds.'),
		location: z.string().nullish(),
		up: z.boolean().nullish(),
	})
	.loose();
export type HoneybadgerUptimeCheck = z.infer<typeof UptimeCheckSchema>;

export const SitesChecksInputSchema = z
	.object({
		project_id: ProjectIdSchema,
		site_id: SiteIdSchema,
		limit: LimitSchema,
		created_after: UnixSecondsSchema.optional(),
		created_before: UnixSecondsSchema.optional(),
	})
	.strict();
export type SitesChecksInput = z.input<typeof SitesChecksInputSchema>;

const SitesChecksResponseSchema = z
	.object({
		data: z.array(UptimeCheckSchema),
		pagination: CursorPaginationSchema.nullish(),
		links: CursorLinksSchema.nullish(),
		meta: MetaSchema.nullish(),
	})
	.loose();
export type SitesChecksResponse = z.infer<typeof SitesChecksResponseSchema>;

export const OutageSchema = z
	.object({
		id: z.string(),
		site_id: z.string(),
		down_at: z.string().nullish(),
		up_at: z.string().nullish(),
		status: z.number().nullish(),
		reason: z.string().nullish(),
		headers: z.record(z.string(), z.string()).nullish(),
		duration_seconds: z.number().nullish(),
		created_at: z.string().nullish(),
	})
	.loose();
export type HoneybadgerOutage = z.infer<typeof OutageSchema>;

export const SitesOutagesInputSchema = z
	.object({
		project_id: ProjectIdSchema,
		site_id: SiteIdSchema,
		limit: LimitSchema,
		created_after: UnixSecondsSchema.optional(),
		created_before: UnixSecondsSchema.optional(),
	})
	.strict();
export type SitesOutagesInput = z.input<typeof SitesOutagesInputSchema>;

const SitesOutagesResponseSchema = z
	.object({
		data: z.array(OutageSchema),
		pagination: CursorPaginationSchema.nullish(),
		links: CursorLinksSchema.nullish(),
		meta: MetaSchema.nullish(),
	})
	.loose();
export type SitesOutagesResponse = z.infer<typeof SitesOutagesResponseSchema>;

// ── insights ───────────────────────────────────────────────────────────────

// The spec requires no field on a stream, so nothing is required here either.
export const StreamSchema = z
	.object({
		id: z.string().nullish(),
		name: z.string().nullish(),
		slug: z.string().nullish(),
		internal: z.boolean().nullish(),
		project_id: z.string().nullish(),
		created_at: z.string().nullish(),
	})
	.loose();
export type HoneybadgerStream = z.infer<typeof StreamSchema>;

export const StreamsListInputSchema = z
	.object({
		project_id: ProjectIdSchema,
		page: PageSchema,
		per_page: PerPageSchema,
	})
	.strict();
export type StreamsListInput = z.input<typeof StreamsListInputSchema>;

const StreamsListResponseSchema = z
	.object({
		data: z.array(StreamSchema),
		pagination: PaginationSchema.nullish(),
		links: OffsetLinksSchema.nullish(),
		meta: MetaSchema.nullish(),
	})
	.loose();
export type StreamsListResponse = z.infer<typeof StreamsListResponseSchema>;

export const InsightsQueryInputSchema = z
	.object({
		project_id: ProjectIdSchema,
		query: z.string().min(1).describe('BadgerQL query.'),
		stream_ids: z
			.array(z.string().min(1))
			.optional()
			.describe(
				'Streams to search. Omitted or empty searches every stream on the project.',
			),
		ts: z
			.string()
			.optional()
			.describe('Time range for the query, such as `1h`.'),
		timezone: z
			.string()
			.optional()
			.describe('Timezone for time bucketing and display, such as `UTC`.'),
	})
	.strict();
export type InsightsQueryInput = z.input<typeof InsightsQueryInputSchema>;

/**
 * The result's columns depend on the query, so `data` is passed through as
 * whatever object the query produced. `links.web` opens the same query in
 * Insights.
 */
const InsightsQueryResponseSchema = z
	.object({
		data: z.record(z.string(), z.json()),
		links: WebLinksSchema.nullish(),
		meta: MetaSchema.nullish(),
	})
	.loose();
export type InsightsQueryResponse = z.infer<typeof InsightsQueryResponseSchema>;

// ── account ────────────────────────────────────────────────────────────────

export const AccountSchema = z
	.object({
		id: z.string(),
		name: z.string().nullish(),
		email: z.string().nullish(),
		active: z.boolean().nullish(),
		parked: z.boolean().nullish(),
		created_at: z.string().nullish(),
		links: WebLinksSchema.nullish(),
	})
	.loose();
export type HoneybadgerAccount = z.infer<typeof AccountSchema>;

export const AccountGetInputSchema = z.object({}).strict();
export type AccountGetInput = z.input<typeof AccountGetInputSchema>;

const AccountGetResponseSchema = z
	.object({ data: AccountSchema, meta: MetaSchema.nullish() })
	.loose();
export type AccountGetResponse = z.infer<typeof AccountGetResponseSchema>;

export const AccountUsageInputSchema = z.object({}).strict();
export type AccountUsageInput = z.input<typeof AccountUsageInputSchema>;

const AccountUsageResponseSchema = z
	.object({
		data: z
			.object({
				id: z.string(),
				quota: z
					.object({
						errors_limit: z.number(),
						errors_consumed: z.number(),
						uptime_limit: z.number().nullish(),
						uptime_consumed: z.number(),
						check_ins_limit: z.number().nullish(),
						check_ins_consumed: z.number(),
					})
					.loose(),
			})
			.loose(),
		meta: MetaSchema.nullish(),
	})
	.loose();
export type AccountUsageResponse = z.infer<typeof AccountUsageResponseSchema>;

export const TOKEN_KINDS = ['user', 'account', 'oauth'] as const;

export const TokenGetInputSchema = z.object({}).strict();
export type TokenGetInput = z.input<typeof TokenGetInputSchema>;

const TokenGetResponseSchema = z
	.object({
		data: z
			.object({
				kind: z.string().nullish(),
				name: z.string().nullish(),
				scopes: z.array(z.string()).nullish(),
				account_id: z.string().nullish(),
				project_ids: z.array(z.string()).nullish(),
				expires_at: z.string().nullish(),
				last_used_at: z.string().nullish(),
			})
			.loose(),
		meta: MetaSchema.nullish(),
	})
	.loose();
export type TokenGetResponse = z.infer<typeof TokenGetResponseSchema>;

// ── registry ───────────────────────────────────────────────────────────────

export const HoneybadgerEndpointInputSchemas = {
	'projects.list': ProjectsListInputSchema,
	'projects.get': ProjectsGetInputSchema,
	'projects.create': ProjectsCreateInputSchema,
	'projects.update': ProjectsUpdateInputSchema,
	'projects.delete': ProjectsDeleteInputSchema,
	'projects.stats': ProjectsStatsInputSchema,
	'projects.occurrences': ProjectsOccurrencesInputSchema,
	'occurrences.list': OccurrencesListInputSchema,
	'faults.list': FaultsListInputSchema,
	'faults.get': FaultsGetInputSchema,
	'faults.update': FaultsUpdateInputSchema,
	'faults.delete': FaultsDeleteInputSchema,
	'faults.resolve': FaultsResolveInputSchema,
	'faults.unresolve': FaultsResolveInputSchema,
	'faults.ignore': FaultsResolveInputSchema,
	'faults.unignore': FaultsResolveInputSchema,
	'faults.summary': FaultsSummaryInputSchema,
	'faults.assign': FaultsAssignInputSchema,
	'faults.unassign': FaultsUnassignInputSchema,
	'faults.merge': FaultsMergeInputSchema,
	'faults.pauseRecording': FaultsPauseRecordingInputSchema,
	'faults.resumeRecording': FaultsResumeRecordingInputSchema,
	'faults.snooze': FaultsSnoozeInputSchema,
	'faults.unsnooze': FaultsUnsnoozeInputSchema,
	'faults.affectedUsers': FaultsAffectedUsersInputSchema,
	'faults.occurrences': FaultsOccurrencesInputSchema,
	'notices.list': NoticesListInputSchema,
	'notices.get': NoticesGetInputSchema,
	'comments.list': CommentsListInputSchema,
	'comments.get': CommentsGetInputSchema,
	'comments.create': CommentsCreateInputSchema,
	'comments.update': CommentsUpdateInputSchema,
	'comments.delete': CommentsDeleteInputSchema,
	'deploys.list': DeploysListInputSchema,
	'deploys.get': DeploysGetInputSchema,
	'deploys.delete': DeploysDeleteInputSchema,
	'environments.list': EnvironmentsListInputSchema,
	'environments.get': EnvironmentsGetInputSchema,
	'environments.create': EnvironmentsCreateInputSchema,
	'environments.update': EnvironmentsUpdateInputSchema,
	'environments.delete': EnvironmentsDeleteInputSchema,
	'environments.bulkDelete': EnvironmentsBulkDeleteInputSchema,
	'environments.bulkUpdate': EnvironmentsBulkUpdateInputSchema,
	'checkIns.list': CheckInsListInputSchema,
	'checkIns.get': CheckInsGetInputSchema,
	'checkIns.create': CheckInsCreateInputSchema,
	'checkIns.update': CheckInsUpdateInputSchema,
	'checkIns.delete': CheckInsDeleteInputSchema,
	'checkIns.replace': CheckInsReplaceInputSchema,
	'checkIns.events': CheckInsEventsInputSchema,
	'sites.list': SitesListInputSchema,
	'sites.get': SitesGetInputSchema,
	'sites.create': SitesCreateInputSchema,
	'sites.update': SitesUpdateInputSchema,
	'sites.delete': SitesDeleteInputSchema,
	'sites.checks': SitesChecksInputSchema,
	'sites.outages': SitesOutagesInputSchema,
	'streams.list': StreamsListInputSchema,
	'insights.query': InsightsQueryInputSchema,
	'account.get': AccountGetInputSchema,
	'account.usage': AccountUsageInputSchema,
	'token.get': TokenGetInputSchema,
} as const;

export const HoneybadgerEndpointOutputSchemas = {
	'projects.list': ProjectsListResponseSchema,
	'projects.get': ProjectsGetResponseSchema,
	'projects.create': ProjectsCreateResponseSchema,
	'projects.update': ProjectsUpdateResponseSchema,
	'projects.delete': ProjectsDeleteResponseSchema,
	'projects.stats': ProjectsStatsResponseSchema,
	'projects.occurrences': ProjectsOccurrencesResponseSchema,
	'occurrences.list': OccurrencesListResponseSchema,
	'faults.list': FaultsListResponseSchema,
	'faults.get': FaultsGetResponseSchema,
	'faults.update': FaultsUpdateResponseSchema,
	'faults.delete': FaultsDeleteResponseSchema,
	'faults.resolve': FaultBulkResponseSchema,
	'faults.unresolve': FaultBulkResponseSchema,
	'faults.ignore': FaultBulkResponseSchema,
	'faults.unignore': FaultBulkResponseSchema,
	'faults.summary': FaultsSummaryResponseSchema,
	'faults.assign': FaultsAssignResponseSchema,
	'faults.unassign': FaultsAssignResponseSchema,
	'faults.merge': FaultsMergeResponseSchema,
	'faults.pauseRecording': FaultsPauseRecordingResponseSchema,
	'faults.resumeRecording': FaultsResumeRecordingResponseSchema,
	'faults.snooze': FaultsSnoozeResponseSchema,
	'faults.unsnooze': FaultsUnsnoozeResponseSchema,
	'faults.affectedUsers': FaultsAffectedUsersResponseSchema,
	'faults.occurrences': FaultsOccurrencesResponseSchema,
	'notices.list': NoticesListResponseSchema,
	'notices.get': NoticesGetResponseSchema,
	'comments.list': CommentsListResponseSchema,
	'comments.get': CommentsGetResponseSchema,
	'comments.create': CommentsCreateResponseSchema,
	'comments.update': CommentsUpdateResponseSchema,
	'comments.delete': CommentsDeleteResponseSchema,
	'deploys.list': DeploysListResponseSchema,
	'deploys.get': DeploysGetResponseSchema,
	'deploys.delete': DeploysDeleteResponseSchema,
	'environments.list': EnvironmentsListResponseSchema,
	'environments.get': EnvironmentsGetResponseSchema,
	'environments.create': EnvironmentsCreateResponseSchema,
	'environments.update': EnvironmentsUpdateResponseSchema,
	'environments.delete': EnvironmentsDeleteResponseSchema,
	'environments.bulkDelete': CountResponseSchema,
	'environments.bulkUpdate': CountResponseSchema,
	'checkIns.list': CheckInsListResponseSchema,
	'checkIns.get': CheckInsGetResponseSchema,
	'checkIns.create': CheckInsCreateResponseSchema,
	'checkIns.update': CheckInsUpdateResponseSchema,
	'checkIns.delete': CheckInsDeleteResponseSchema,
	'checkIns.replace': CheckInsReplaceResponseSchema,
	'checkIns.events': CheckInsEventsResponseSchema,
	'sites.list': SitesListResponseSchema,
	'sites.get': SitesGetResponseSchema,
	'sites.create': SitesCreateResponseSchema,
	'sites.update': SitesUpdateResponseSchema,
	'sites.delete': SitesDeleteResponseSchema,
	'sites.checks': SitesChecksResponseSchema,
	'sites.outages': SitesOutagesResponseSchema,
	'streams.list': StreamsListResponseSchema,
	'insights.query': InsightsQueryResponseSchema,
	'account.get': AccountGetResponseSchema,
	'account.usage': AccountUsageResponseSchema,
	'token.get': TokenGetResponseSchema,
} as const;

export type HoneybadgerEndpointInputs = {
	[K in keyof typeof HoneybadgerEndpointInputSchemas]: z.input<
		(typeof HoneybadgerEndpointInputSchemas)[K]
	>;
};

export type HoneybadgerEndpointOutputs = {
	[K in keyof typeof HoneybadgerEndpointOutputSchemas]: z.output<
		(typeof HoneybadgerEndpointOutputSchemas)[K]
	>;
};
