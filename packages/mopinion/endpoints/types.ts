import { z } from 'zod';

// The v3.0.0-alpha spec documents no response schemas, so output schemas
// type the documented `_meta` object exactly (developer.mopinion.com,
// Requests and Responses > Metadata) and pass the rest of the body through
// loose. Input parameters come from the spec's path/query definitions.

/** Mopinion's default page: 10 entries, up to 1000 via limit. */
export const MOPINION_DEFAULT_PAGE_SIZE = 10;
export const MOPINION_MAX_PAGE_SIZE = 1000;

// ── _meta (documented in Requests and Responses > Metadata) ───────────────

export const MetaSchema = z
	.object({
		code: z.number().nullish(),
		message: z.string().nullish(),
		has_more: z.boolean().nullish(),
		previous: z.union([z.string(), z.boolean()]).nullish(),
		next: z.union([z.string(), z.boolean()]).nullish(),
		count: z.number().nullish(),
		total: z.number().nullish(),
		// unknown: warnings are free-form messages, e.g. ignored filters.
		warnings: z.array(z.unknown()).nullish(),
		changed: z.number().nullish(),
		previous_attributes: z.record(z.string(), z.unknown()).nullish(),
	})
	.loose();

export type MopinionMeta = z.infer<typeof MetaSchema>;

// Response shapes from the 2.5 API (live calls on a trial account, 11-24,
// and the 2.x spec at developer.mopinion.com/specs/2_latest.json). Single
// resources come back as the resource's fields next to `_meta`; lists (fields,
// feedback, deployments) and a feedback item come back as `{ data: [...],
// _meta }`. Every field is nullish and unknown fields pass through.

const ResponseMeta = { _meta: MetaSchema.nullish() };

const DatasetSchema = z
	.object({
		id: z.number().nullish(),
		name: z.string().nullish(),
		report_id: z.number().nullish(),
		description: z.string().nullish(),
		data_source: z.string().nullish(),
	})
	.loose();

const ReportSchema = z
	.object({
		id: z.number().nullish(),
		name: z.string().nullish(),
		description: z.string().nullish(),
		language: z.string().nullish(),
		created: z.string().nullish(),
		dataSets: z.array(DatasetSchema).nullish(),
	})
	.loose();

const AccountSchema = z
	.object({
		name: z.string().nullish(),
		package: z.string().nullish(),
		enddate: z.string().nullish(),
		number_users: z.number().nullish(),
		number_charts: z.number().nullish(),
		number_forms: z.number().nullish(),
		number_reports: z.number().nullish(),
		reports: z.array(ReportSchema).nullish(),
		...ResponseMeta,
	})
	.loose();

const FieldSchema = z
	.object({
		key: z.string().nullish(),
		label: z.string().nullish(),
		short_label: z.string().nullish(),
		type: z.string().nullish(),
		report_id: z.number().nullish(),
		dataset_id: z.number().nullish(),
	})
	.loose();

const FeedbackValueSchema = z
	.object({
		key: z.string().nullish(),
		label: z.string().nullish(),
		// unknown: an answer is a string for text and score fields, but a
		// field type can carry a number, a list or an object.
		value: z.unknown(),
	})
	.loose();

const FeedbackSchema = z
	.object({
		id: z.number().nullish(),
		created: z.string().nullish(),
		report_id: z.number().nullish(),
		dataset_id: z.number().nullish(),
		fields: z.array(FeedbackValueSchema).nullish(),
		tags: z.array(z.string()).nullish(),
	})
	.loose();

const DeploymentSchema = z
	.object({
		id: z.string().nullish(),
		key: z.string().nullish(),
		name: z.string().nullish(),
		domain: z.string().nullish(),
		org_id: z.number().nullish(),
		datetime: z.string().nullish(),
		published: z.boolean().nullish(),
		revision: z.number().nullish(),
		type: z.string().nullish(),
		// unknown: targeting rules are `{ id, if: [...], then: [...] }` trees whose
		// conditions Mopinion defines per trigger type.
		rules: z.array(z.unknown()).nullish(),
	})
	.loose();

function listOf<T extends z.ZodType>(item: T) {
	return z.object({ data: z.array(item).nullish(), ...ResponseMeta }).loose();
}

const DatasetResponseSchema = DatasetSchema.extend(ResponseMeta);
const ReportResponseSchema = ReportSchema.extend(ResponseMeta);
const DeploymentResponseSchema = DeploymentSchema.extend(ResponseMeta);
const FieldListSchema = listOf(FieldSchema);
const FeedbackListSchema = listOf(FeedbackSchema);
const DeploymentListSchema = listOf(DeploymentSchema);

export type MopinionAccount = z.infer<typeof AccountSchema>;
export type MopinionDataset = z.infer<typeof DatasetResponseSchema>;
export type MopinionReport = z.infer<typeof ReportResponseSchema>;
export type MopinionDeployment = z.infer<typeof DeploymentResponseSchema>;
export type MopinionFieldList = z.infer<typeof FieldListSchema>;
export type MopinionFeedbackList = z.infer<typeof FeedbackListSchema>;
export type MopinionDeploymentList = z.infer<typeof DeploymentListSchema>;

// ── list query parameters ─────────────────────────────────────────────────

/**
 * A resource id: a number (datasets, reports, feedback) or a deployment key.
 * Letters, digits, `_` and `-` only, so `.`, `..` or a slash can't turn the
 * signed path into another route.
 */
const IdSchema = z.union([
	z.number().int().nonnegative(),
	z
		.string()
		.regex(/^[A-Za-z0-9_-]+$/, 'Must be an id: letters, digits, _ or -'),
]);

const ListQuerySchema = z.object({
	page: z.number().int().positive().optional().describe('Defaults to 1.'),
	limit: z
		.number()
		.int()
		.min(0)
		.max(MOPINION_MAX_PAGE_SIZE)
		.optional()
		.describe(
			`Defaults to ${MOPINION_DEFAULT_PAGE_SIZE}, at most ${MOPINION_MAX_PAGE_SIZE}.`,
		),
	sort: z.enum(['created', 'datetime']).optional(),
	order: z.enum(['asc', 'desc']).optional().describe('Defaults to desc.'),
});

/**
 * Mopinion filters are `filter[{modifier}{key}]=value` query parameters, so
 * each entry's key is the bracketed expression, e.g. `{"<<nps": 5}` or
 * `{"date_from": "2026-01-01"}`. Keys: date, rating, nps, ces, ces_inverse,
 * gcr, tags; modifiers: !, <, <<, >, >>. Ignored filters are reported in
 * `_meta.warnings`.
 */
const FiltersSchema = z.record(z.string(), z.union([z.string(), z.number()]));

/** Builds the `filter[...]` query entries from the filters record. */
export function mopinionFilterQuery(
	filters: Record<string, string | number> | undefined,
): Record<string, string | number> {
	const out: Record<string, string | number> = {};
	if (!filters) return out;
	for (const [key, value] of Object.entries(filters)) {
		out[`filter[${key}]`] = value;
	}
	return out;
}

// ── Registry ──────────────────────────────────────────────────────────────

export type MopinionEndpointInputs = {
	accountGet: Record<string, never>;
	datasetsGet: { datasetId: string | number };
	datasetsFields: { datasetId: string | number };
	datasetsFeedback: z.input<typeof ListQuerySchema> & {
		datasetId: string | number;
		filters?: Record<string, string | number>;
	};
	datasetsFeedbackItem: {
		datasetId: string | number;
		feedbackId: string | number;
	};
	reportsGet: { reportId: string | number };
	reportsFields: { reportId: string | number };
	reportsFeedback: z.input<typeof ListQuerySchema> & {
		reportId: string | number;
		filters?: Record<string, string | number>;
	};
	reportsFeedbackItem: {
		reportId: string | number;
		feedbackId: string | number;
	};
	deploymentsList: { page?: number; limit?: number };
	deploymentsGet: { deploymentId: string | number };
};

export type MopinionEndpointOutputs = {
	accountGet: MopinionAccount;
	datasetsGet: MopinionDataset;
	datasetsFields: MopinionFieldList;
	datasetsFeedback: MopinionFeedbackList;
	datasetsFeedbackItem: MopinionFeedbackList;
	reportsGet: MopinionReport;
	reportsFields: MopinionFieldList;
	reportsFeedback: MopinionFeedbackList;
	reportsFeedbackItem: MopinionFeedbackList;
	deploymentsList: MopinionDeploymentList;
	deploymentsGet: MopinionDeployment;
};

export const MopinionEndpointInputSchemas = {
	accountGet: z.object({}),
	datasetsGet: z.object({ datasetId: IdSchema }),
	datasetsFields: z.object({ datasetId: IdSchema }),
	datasetsFeedback: ListQuerySchema.extend({
		datasetId: IdSchema,
		filters: FiltersSchema.optional(),
	}),
	datasetsFeedbackItem: z.object({
		datasetId: IdSchema,
		feedbackId: IdSchema,
	}),
	reportsGet: z.object({ reportId: IdSchema }),
	reportsFields: z.object({ reportId: IdSchema }),
	reportsFeedback: ListQuerySchema.extend({
		reportId: IdSchema,
		filters: FiltersSchema.optional(),
	}),
	reportsFeedbackItem: z.object({
		reportId: IdSchema,
		feedbackId: IdSchema,
	}),
	deploymentsList: z.object({
		page: ListQuerySchema.shape.page,
		limit: ListQuerySchema.shape.limit,
	}),
	deploymentsGet: z.object({ deploymentId: IdSchema }),
} as const;

export const MopinionEndpointOutputSchemas = {
	accountGet: AccountSchema,
	datasetsGet: DatasetResponseSchema,
	datasetsFields: FieldListSchema,
	datasetsFeedback: FeedbackListSchema,
	datasetsFeedbackItem: FeedbackListSchema,
	reportsGet: ReportResponseSchema,
	reportsFields: FieldListSchema,
	reportsFeedback: FeedbackListSchema,
	reportsFeedbackItem: FeedbackListSchema,
	deploymentsList: DeploymentListSchema,
	deploymentsGet: DeploymentResponseSchema,
} as const;
