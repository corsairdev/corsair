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

/**
 * Every response body passes through loose; only the documented `_meta`
 * block is typed.
 */
const ResponseSchema = z
	.object({
		_meta: MetaSchema.nullish(),
	})
	.loose();

export type MopinionResponse = z.infer<typeof ResponseSchema>;

// ── list query parameters ─────────────────────────────────────────────────

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
	datasetsGet: { datasetId: string };
	datasetsFields: { datasetId: string };
	datasetsFeedback: z.input<typeof ListQuerySchema> & {
		datasetId: string;
		filters?: Record<string, string | number>;
	};
	datasetsFeedbackItem: { datasetId: string; feedbackId: string };
	reportsGet: { reportId: string };
	reportsFields: { reportId: string };
	reportsFeedback: z.input<typeof ListQuerySchema> & {
		reportId: string;
		filters?: Record<string, string | number>;
	};
	reportsFeedbackItem: { reportId: string; feedbackId: string };
	deploymentsList: Record<string, never>;
	deploymentsGet: { deploymentId: string };
};

export type MopinionEndpointOutputs = {
	accountGet: MopinionResponse;
	datasetsGet: MopinionResponse;
	datasetsFields: MopinionResponse;
	datasetsFeedback: MopinionResponse;
	datasetsFeedbackItem: MopinionResponse;
	reportsGet: MopinionResponse;
	reportsFields: MopinionResponse;
	reportsFeedback: MopinionResponse;
	reportsFeedbackItem: MopinionResponse;
	deploymentsList: MopinionResponse;
	deploymentsGet: MopinionResponse;
};

export const MopinionEndpointInputSchemas = {
	accountGet: z.object({}).loose(),
	datasetsGet: z.object({ datasetId: z.string().min(1) }),
	datasetsFields: z.object({ datasetId: z.string().min(1) }),
	datasetsFeedback: ListQuerySchema.extend({
		datasetId: z.string().min(1),
		filters: FiltersSchema.optional(),
	}),
	datasetsFeedbackItem: z.object({
		datasetId: z.string().min(1),
		feedbackId: z.string().min(1),
	}),
	reportsGet: z.object({ reportId: z.string().min(1) }),
	reportsFields: z.object({ reportId: z.string().min(1) }),
	reportsFeedback: ListQuerySchema.extend({
		reportId: z.string().min(1),
		filters: FiltersSchema.optional(),
	}),
	reportsFeedbackItem: z.object({
		reportId: z.string().min(1),
		feedbackId: z.string().min(1),
	}),
	deploymentsList: z.object({}).loose(),
	deploymentsGet: z.object({ deploymentId: z.string().min(1) }),
} as const;

export const MopinionEndpointOutputSchemas = {
	accountGet: ResponseSchema,
	datasetsGet: ResponseSchema,
	datasetsFields: ResponseSchema,
	datasetsFeedback: ResponseSchema,
	datasetsFeedbackItem: ResponseSchema,
	reportsGet: ResponseSchema,
	reportsFields: ResponseSchema,
	reportsFeedback: ResponseSchema,
	reportsFeedbackItem: ResponseSchema,
	deploymentsList: ResponseSchema,
	deploymentsGet: ResponseSchema,
} as const;
