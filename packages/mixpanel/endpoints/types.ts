import { asRecord } from 'corsair/core';
import { z } from 'zod';

// Inputs use Mixpanel's own parameter names, so a query parameter maps one to
// one. Outputs are `.loose()` and their documented fields nullish, so a field
// Mixpanel adds or omits cannot fail a call that has already happened. The
// specs live inside the reference pages at https://docs.mixpanel.com/reference

/** Mixpanel dates are `yyyy-mm-dd`, inclusive on both ends. */
const DateSchema = z
	.string()
	.regex(/^\d{4}-\d{2}-\d{2}$/, 'Must be a yyyy-mm-dd date');

// ── events.import ─────────────────────────────────────────────────────────

export const MIXPANEL_MAX_EVENTS_PER_IMPORT = 2000;

/**
 * distinct_id values Mixpanel disallows to prevent accidental implementation
 * mistakes (https://docs.mixpanel.com/reference/import-events). The empty
 * string stays valid: it marks an event with no user.
 */
export const MIXPANEL_DISALLOWED_DISTINCT_IDS = [
	'00000000-0000-0000-0000-000000000000',
	'anon',
	'anonymous',
	'nil',
	'none',
	'null',
	'n/a',
	'na',
	'undefined',
	'unknown',
	'<nil>',
	'0',
	'-1',
	'true',
	'false',
	'[]',
	'{}',
] as const;

const distinctIdCheck = (value: string, ctx: z.RefinementCtx) => {
	if (MIXPANEL_DISALLOWED_DISTINCT_IDS.includes(value as never)) {
		ctx.addIssue({
			code: 'custom',
			message: `Mixpanel disallows "${value}" as a distinct_id`,
		});
	}
};

const ImportedEventSchema = z.object({
	event: z.string().min(1).describe('The name of the event.'),
	properties: z
		.object({
			// Unix epoch seconds or milliseconds, or an RFC 3339 string; sent
			// unchanged and let Mixpanel detect the format.
			time: z.union([z.number(), z.string()]),
			distinct_id: z.string().superRefine(distinctIdCheck),
			// Alphanumeric or "-", at most 36 bytes: Mixpanel's deduplication key.
			$insert_id: z
				.string()
				.max(36)
				.regex(/^[A-Za-z0-9-]+$/, 'Only alphanumeric characters and "-"'),
		})
		.loose(),
});

const EventsImportInputSchema = z
	.object({
		strict: z
			.enum(['0', '1'])
			.optional()
			.describe(
				"Defaults to '1': Mixpanel validates the batch and rejects it with per-event errors instead of ingesting silently.",
			),
		events: z
			.array(ImportedEventSchema)
			.min(1)
			.max(MIXPANEL_MAX_EVENTS_PER_IMPORT)
			.describe(
				`Up to ${MIXPANEL_MAX_EVENTS_PER_IMPORT} events and 10 MB uncompressed per request.`,
			),
	})
	.superRefine((value, ctx) => {
		const ids = value.events.map((event) => event.properties.$insert_id);
		const duplicate = ids.find((id, index) => ids.indexOf(id) !== index);
		if (duplicate !== undefined) {
			ctx.addIssue({
				code: 'custom',
				message: `$insert_id "${duplicate}" appears more than once; Mixpanel deduplicates on (event, time, distinct_id, $insert_id)`,
			});
		}
	});

export type EventsImportInput = z.input<typeof EventsImportInputSchema>;

const EventsImportResponseSchema = z
	.object({
		code: z.number().nullish(),
		num_records_imported: z.number(),
		status: z.string().nullish(),
	})
	.loose();

export type EventsImportResponse = z.infer<typeof EventsImportResponseSchema>;

/** One entry of the 400 validation body's `failed_records`. */
const FailedRecordSchema = z
	.object({
		index: z.number().nullish(),
		insert_id: z.string().nullish(),
		field: z.string().nullish(),
		message: z.string().nullish(),
	})
	.loose();

// ── profiles.query ────────────────────────────────────────────────────────

const ProfilesQueryInputSchema = z
	.object({
		where: z
			.string()
			.optional()
			.describe(
				'An expression to filter profiles by, such as properties["$email"] == "...".',
			),
		distinct_id: z
			.string()
			.optional()
			.describe('Retrieve exactly this profile.'),
		distinct_ids: z
			.array(z.string().min(1))
			.min(1)
			.optional()
			.describe('Retrieve exactly these profiles.'),
		data_group_id: z
			.string()
			.optional()
			.describe(
				'The ID of the group key, to query group profiles instead of user profiles.',
			),
		output_properties: z
			.array(z.string().min(1))
			.min(1)
			.optional()
			.describe(
				'Only return these properties, which speeds the query up considerably.',
			),
		session_id: z
			.string()
			.optional()
			.describe(
				'The id from a previous response, to keep paging through one query.',
			),
		page: z
			.number()
			.int()
			.nonnegative()
			.optional()
			.describe('Pages start at 0 and need the session_id from page 0.'),
		behaviors: z
			.number()
			.int()
			.optional()
			.describe('Needed when filtering with an event selector expression.'),
		as_of_timestamp: z
			.number()
			.int()
			.optional()
			.describe(
				'Required with `behaviors` when exporting more than 1000 profiles.',
			),
		filter_by_cohort: z
			.number()
			.int()
			.positive()
			.optional()
			.describe('Only profiles in this cohort id.'),
		include_all_users: z
			.boolean()
			.optional()
			.describe(
				'With `filter_by_cohort`: false keeps only distinct_ids that have a profile. Defaults to true.',
			),
		workspace_id: z.number().int().positive().optional(),
	})
	.superRefine((value, ctx) => {
		if ((value.page ?? 0) > 0 && !value.session_id) {
			ctx.addIssue({
				code: 'custom',
				message: 'page above 0 needs the session_id from the previous response',
			});
		}
		if (value.behaviors !== undefined && value.filter_by_cohort !== undefined) {
			ctx.addIssue({
				code: 'custom',
				message: 'behaviors and filter_by_cohort are mutually exclusive',
			});
		}
	});

export type ProfilesQueryInput = z.input<typeof ProfilesQueryInputSchema>;

// results rows are `{$distinct_id, $properties}` per the spec, but a row can
// come back flat when output_properties is used, so both fields are nullish.
const ProfileRowSchema = z
	.object({
		$distinct_id: z.union([z.string(), z.number()]).nullish(),
		// unknown: profile rows pass through with whatever properties the
		// project has, including ones this schema has never seen.
		$properties: z.record(z.string(), z.unknown()).nullish(),
	})
	.loose();

const ProfilesQueryResponseSchema = z
	.object({
		page: z.number(),
		page_size: z.number(),
		results: z.array(ProfileRowSchema),
		session_id: z.string().nullish(),
		status: z.string().nullish(),
		total: z.number().nullish(),
		next_page: z
			.number()
			.nullable()
			.describe(
				'Derived: the page to request next while this one came back full, otherwise null. Mixpanel sends session_id and page instead of a cursor.',
			),
	})
	.loose();

export type ProfilesQueryResponse = z.infer<typeof ProfilesQueryResponseSchema>;

// unknown: the raw engage body is an untyped JSON object until its fields are
// narrowed one at a time.
export function nextPageFromEngageResponse(raw: unknown): number | null {
	const record = asRecord(raw);
	const page = record?.page;
	const pageSize = record?.page_size;
	const count = Array.isArray(record?.results)
		? (record.results as unknown[]).length
		: undefined;
	if (
		typeof page !== 'number' ||
		typeof pageSize !== 'number' ||
		count === undefined
	) {
		return null;
	}
	// unknown: results are counted before the schema parses them, so the array
	// is only known to exist, not to be typed.
	return count >= pageSize ? page + 1 : null;
}

// ── cohorts.list ──────────────────────────────────────────────────────────

const CohortsListInputSchema = z.object({
	workspace_id: z.number().int().positive().optional(),
});

export type CohortsListInput = z.input<typeof CohortsListInputSchema>;

const CohortSchema = z
	.object({
		count: z.number().nullish(),
		is_visible: z.number().nullish(),
		description: z.string().nullish(),
		created: z.string().nullish(),
		project_id: z.number().nullish(),
		id: z.number().nullish(),
		name: z.string().nullish(),
	})
	.loose();

const CohortsListResponseSchema = z.object({
	cohorts: z.array(CohortSchema),
});

export type CohortsListResponse = z.infer<typeof CohortsListResponseSchema>;

// ── insights.query ────────────────────────────────────────────────────────

const InsightsQueryInputSchema = z.object({
	bookmark_id: z
		.number()
		.int()
		.positive()
		.describe('The id of the saved Insights report.'),
	workspace_id: z.number().int().positive().optional(),
});

export type InsightsQueryInput = z.input<typeof InsightsQueryInputSchema>;

const InsightsQueryResponseSchema = z
	.object({
		computed_at: z.string().nullish(),
		date_range: z
			.object({
				from_date: z.string().nullish(),
				to_date: z.string().nullish(),
			})
			.loose()
			.nullish(),
		headers: z.array(z.string()).nullish(),
		// unknown: a report with a breakdown nests more than {date: count},
		// so the series leaves pass through as Mixpanel sends them.
		series: z.record(z.string(), z.unknown()).nullish(),
	})
	.loose();

export type InsightsQueryResponse = z.infer<typeof InsightsQueryResponseSchema>;

// ── funnels.list ──────────────────────────────────────────────────────────

const FunnelsListInputSchema = z.object({
	workspace_id: z.number().int().positive().optional(),
});

export type FunnelsListInput = z.input<typeof FunnelsListInputSchema>;

const FunnelSchema = z
	.object({
		funnel_id: z.number().nullish(),
		name: z.string().nullish(),
	})
	.loose();

const FunnelsListResponseSchema = z.object({
	funnels: z.array(FunnelSchema),
});

export type FunnelsListResponse = z.infer<typeof FunnelsListResponseSchema>;

// ── retention.query ───────────────────────────────────────────────────────

export const MIXPANEL_MAX_RETENTION_INTERVAL_DAYS = 90;

const RetentionQueryInputSchema = z
	.object({
		from_date: DateSchema.describe('Inclusive.'),
		to_date: DateSchema.describe('Inclusive.'),
		retention_type: z
			.enum(['birth', 'compounded'])
			.optional()
			.describe(
				"Defaults to 'birth' (first time). 'compounded' is recurring retention.",
			),
		born_event: z
			.string()
			.optional()
			.describe("The first event, required when retention_type is 'birth'."),
		event: z
			.string()
			.optional()
			.describe('The returning event. Omit to look across all events.'),
		born_where: z
			.string()
			.optional()
			.describe('An expression to filter born_event by.'),
		where: z
			.string()
			.optional()
			.describe('An expression to filter the returning event by.'),
		interval: z
			.number()
			.int()
			.positive()
			.optional()
			.describe('Defaults to 1. At most 90 when unit is day.'),
		interval_count: z
			.number()
			.int()
			.positive()
			.optional()
			.describe('How many buckets to return. Defaults to 1.'),
		unit: z
			.enum(['day', 'week', 'month'])
			.optional()
			.describe('Defaults to day.'),
		unbounded_retention: z
			.boolean()
			.optional()
			.describe(
				'Accumulate counts from right to left instead of per interval.',
			),
		on: z
			.string()
			.optional()
			.describe('A property expression to segment the returning event on.'),
		limit: z
			.number()
			.int()
			.positive()
			.optional()
			.describe('Top segmentation values; only used with `on`.'),
		workspace_id: z.number().int().positive().optional(),
	})
	.superRefine((value, ctx) => {
		const unitIsDay = (value.unit ?? 'day') === 'day';
		if (
			unitIsDay &&
			(value.interval ?? 1) > MIXPANEL_MAX_RETENTION_INTERVAL_DAYS
		) {
			ctx.addIssue({
				code: 'custom',
				message: `interval cannot be greater than ${MIXPANEL_MAX_RETENTION_INTERVAL_DAYS} when unit is day`,
			});
		}
		if ((value.retention_type ?? 'birth') === 'birth' && !value.born_event) {
			ctx.addIssue({
				code: 'custom',
				message:
					"born_event is required when retention_type is 'birth' (the default)",
			});
		}
	});

export type RetentionQueryInput = z.input<typeof RetentionQueryInputSchema>;

const RetentionBucketSchema = z
	.object({
		counts: z.array(z.number()).nullish(),
		first: z.number().nullish(),
	})
	.loose();

/** The body is one `{date: {counts, first}}` row per cohort day. */
const RetentionQueryResponseSchema = z.record(
	z.string(),
	RetentionBucketSchema,
);

export type RetentionQueryResponse = z.infer<
	typeof RetentionQueryResponseSchema
>;

// ── export.events ─────────────────────────────────────────────────────────

export const MIXPANEL_MAX_EXPORT_LIMIT = 100000;

const ExportEventsInputSchema = z
	.object({
		from_date: DateSchema.describe('Inclusive.'),
		to_date: DateSchema.describe('Inclusive.'),
		event_names: z
			.array(z.string().min(1))
			.min(1)
			.optional()
			.describe('Only these events; omit for all of them.'),
		where: z.string().optional().describe('An expression to filter events by.'),
		limit: z
			.number()
			.int()
			.positive()
			.max(MIXPANEL_MAX_EXPORT_LIMIT)
			.optional()
			.describe(`At most ${MIXPANEL_MAX_EXPORT_LIMIT}.`),
		time_in_ms: z
			.boolean()
			.optional()
			.describe(
				'Defaults to false: timestamps come back with second precision.',
			),
	})
	.superRefine((value, ctx) => {
		if (value.from_date > value.to_date) {
			ctx.addIssue({
				code: 'custom',
				message: 'from_date must not be after to_date',
			});
		}
	});

export type ExportEventsInput = z.input<typeof ExportEventsInputSchema>;

const ExportedEventSchema = z
	.object({
		event: z.string().nullish(),
		// unknown: event properties are free-form by design; Mixpanel stores
		// whatever the sender attached.
		properties: z.record(z.string(), z.unknown()).nullish(),
	})
	.loose();

const ExportEventsResponseSchema = z.object({
	events: z.array(ExportedEventSchema),
});

export type ExportEventsResponse = z.infer<typeof ExportEventsResponseSchema>;

/**
 * Parses the raw export body: one JSON object per line. An empty body means
 * no events matched the range; a malformed line throws, because a silent
 * partial page would look like data.
 */
export function parseExportLines(
	// unknown: the raw export body is JSONL text, but a wrong route answers
	// HTML or an error object, which must fail loudly rather than parse.
	raw: unknown,
): z.infer<typeof ExportedEventSchema>[] {
	if (typeof raw !== 'string') {
		throw new Error(
			`Mixpanel export returned ${typeof raw}, expected newline-delimited JSON text`,
		);
	}
	const lines = raw.split('\n').filter((line) => line.trim().length > 0);
	return lines.map((line, index) => {
		try {
			return JSON.parse(line) as z.infer<typeof ExportedEventSchema>;
		} catch {
			throw new Error(
				`Mixpanel export line ${index} is not valid JSON: ${line.slice(0, 80)}`,
			);
		}
	});
}

// ── Registry ──────────────────────────────────────────────────────────────

export type MixpanelEndpointInputs = {
	eventsImport: EventsImportInput;
	profilesQuery: ProfilesQueryInput;
	cohortsList: CohortsListInput;
	insightsQuery: InsightsQueryInput;
	funnelsList: FunnelsListInput;
	retentionQuery: RetentionQueryInput;
	exportEvents: ExportEventsInput;
};

export type MixpanelEndpointOutputs = {
	eventsImport: EventsImportResponse;
	profilesQuery: ProfilesQueryResponse;
	cohortsList: CohortsListResponse;
	insightsQuery: InsightsQueryResponse;
	funnelsList: FunnelsListResponse;
	retentionQuery: RetentionQueryResponse;
	exportEvents: ExportEventsResponse;
};

export const MixpanelEndpointInputSchemas = {
	eventsImport: EventsImportInputSchema,
	profilesQuery: ProfilesQueryInputSchema,
	cohortsList: CohortsListInputSchema,
	insightsQuery: InsightsQueryInputSchema,
	funnelsList: FunnelsListInputSchema,
	retentionQuery: RetentionQueryInputSchema,
	exportEvents: ExportEventsInputSchema,
} as const;

export const MixpanelEndpointOutputSchemas = {
	eventsImport: EventsImportResponseSchema,
	profilesQuery: ProfilesQueryResponseSchema,
	cohortsList: CohortsListResponseSchema,
	insightsQuery: InsightsQueryResponseSchema,
	funnelsList: FunnelsListResponseSchema,
	retentionQuery: RetentionQueryResponseSchema,
	exportEvents: ExportEventsResponseSchema,
} as const;
