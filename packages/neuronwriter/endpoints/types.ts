import { z } from 'zod';

// Inputs use NEURONwriter's own parameter names. Outputs are `.loose()` and
// their documented fields nullish, so a field the provider adds cannot fail a
// call that has already happened.
//
// `get-query` is a polling call: it answers `{ status }` and only adds the
// recommendations once `status` is `ready`. So the analysis fields are all
// optional and the caller branches on the status.

const QueryIdSchema = z
	.string()
	.min(1)
	.describe('The query id, from analysis.start.');

const ProjectIdSchema = z
	.string()
	.min(1)
	.describe(
		"The project id, from the project's URL: app.neuronwriter.com/project/view/{id}.",
	);

// ── projects.list ─────────────────────────────────────────────────────────

const ProjectsListInputSchema = z.object({});

export type ProjectsListInput = z.input<typeof ProjectsListInputSchema>;

const ProjectSchema = z
	.object({
		project: z.string().nullish(),
		name: z.string().nullish(),
		language: z.string().nullish(),
		engine: z.string().nullish(),
	})
	.loose();

export type NeuronwriterProject = z.infer<typeof ProjectSchema>;

const ProjectsListResponseSchema = z.object({
	projects: z.array(ProjectSchema),
});

export type ProjectsListResponse = z.infer<typeof ProjectsListResponseSchema>;

// ── analysis.start ────────────────────────────────────────────────────────

export const NEURONWRITER_COMPETITOR_MODES = [
	'top10',
	'top30',
	'top-intent',
] as const;

const AnalysisStartInputSchema = z.object({
	project: ProjectIdSchema,
	keyword: z.string().min(1).describe('The keyword to analyse.'),
	engine: z.string().min(1).describe('The search engine, e.g. google.co.uk.'),
	language: z.string().min(1).describe('The content language, e.g. English.'),
	competitors_mode: z
		.enum(NEURONWRITER_COMPETITOR_MODES)
		.optional()
		.describe(
			'Which competitors to analyse: top10 (the default), top30, or top-intent for up to ten pages matching the dominant intent.',
		),
});

export type AnalysisStartInput = z.input<typeof AnalysisStartInputSchema>;

const AnalysisStartResponseSchema = z.object({
	query: z.string(),
	query_url: z.string().nullish(),
	share_url: z.string().nullish(),
	readonly_url: z.string().nullish(),
});

export type AnalysisStartResponse = z.infer<typeof AnalysisStartResponseSchema>;

// ── analysis.get ──────────────────────────────────────────────────────────

export const NEURONWRITER_QUERY_STATUSES = [
	'not found',
	'waiting',
	'in progress',
	'ready',
] as const;

const AnalysisGetInputSchema = z.object({ query: QueryIdSchema });

export type AnalysisGetInput = z.input<typeof AnalysisGetInputSchema>;

const MetricSchema = z
	.object({ median: z.number().nullish(), target: z.number().nullish() })
	.loose();

const MetricsSchema = z
	.object({
		word_count: MetricSchema.nullish(),
		readability: MetricSchema.nullish(),
	})
	.loose();

/** A term with its usage share, and on some lists the suggested count range. */
const TermSchema = z
	.object({
		t: z.string().nullish(),
		usage_pc: z.number().nullish(),
		sugg_usage: z.array(z.number()).nullish(),
	})
	.loose();

const EntitySchema = z
	.object({
		t: z.string().nullish(),
		importance: z.number().nullish(),
		relevance: z.number().nullish(),
		confidence: z.number().nullish(),
		/** Provider pairs, e.g. `['wikipedia', '']`. */
		links: z.array(z.array(z.string())).nullish(),
	})
	.loose();

const TermsSchema = z
	.object({
		title: z.array(TermSchema).nullish(),
		desc: z.array(TermSchema).nullish(),
		h1: z.array(TermSchema).nullish(),
		h2: z.array(TermSchema).nullish(),
		content_basic: z.array(TermSchema).nullish(),
		content_extended: z.array(TermSchema).nullish(),
		entities: z.array(EntitySchema).nullish(),
	})
	.loose();

const TermsTxtSchema = z
	.object({
		title: z.string().nullish(),
		desc_title: z.string().nullish(),
		h1: z.string().nullish(),
		h2: z.string().nullish(),
		content_basic: z.string().nullish(),
		content_extended: z.string().nullish(),
	})
	.loose();

const QuestionSchema = z.object({ q: z.string().nullish() }).loose();

const IdeasSchema = z
	.object({
		suggest_questions: z.array(QuestionSchema).nullish(),
		people_also_ask: z.array(QuestionSchema).nullish(),
		content_questions: z.array(QuestionSchema).nullish(),
	})
	.loose();

const CompetitorSchema = z
	.object({
		rank: z.number().nullish(),
		url: z.string().nullish(),
		title: z.string().nullish(),
		desc: z.string().nullish(),
		// The docs print a blank score for an unscored competitor, so an empty
		// string is accepted alongside a number.
		content_score: z.union([z.number(), z.string()]).nullish(),
	})
	.loose();

const AnalysisGetResponseSchema = z.object({
	status: z.string(),
	metrics: MetricsSchema.nullish(),
	terms: TermsSchema.nullish(),
	terms_txt: TermsTxtSchema.nullish(),
	ideas: IdeasSchema.nullish(),
	competitors: z.array(CompetitorSchema).nullish(),
});

export type AnalysisGetResponse = z.infer<typeof AnalysisGetResponseSchema>;

// ── queries.list ──────────────────────────────────────────────────────────

export const NEURONWRITER_QUERY_SOURCES = ['neuron', 'neuron-api'] as const;

const QueriesListInputSchema = z.object({
	project: ProjectIdSchema,
	status: z
		.enum(NEURONWRITER_QUERY_STATUSES)
		.optional()
		.describe('Only queries in this state.'),
	source: z
		.enum(NEURONWRITER_QUERY_SOURCES)
		.optional()
		.describe('Only queries created in the app or through the API.'),
	created: z
		.string()
		.datetime({ offset: true })
		.optional()
		.describe('Only queries created at this instant.'),
	updated: z
		.string()
		.datetime({ offset: true })
		.optional()
		.describe('Only queries last updated at this instant.'),
	keyword: z.string().min(1).optional(),
	language: z.string().min(1).optional(),
	engine: z.string().min(1).optional(),
	tags: z
		.union([z.string().min(1), z.array(z.string().min(1)).min(1)])
		.optional()
		.describe('Only queries carrying these tags. Every tag must be present.'),
});

export type QueriesListInput = z.input<typeof QueriesListInputSchema>;

const QuerySummarySchema = z
	.object({
		query: z.string().nullish(),
		created: z.string().nullish(),
		updated: z.string().nullish(),
		keyword: z.string().nullish(),
		language: z.string().nullish(),
		engine: z.string().nullish(),
		source: z.string().nullish(),
		tags: z.array(z.string()).nullish(),
	})
	.loose();

export type NeuronwriterQuerySummary = z.infer<typeof QuerySummarySchema>;

const QueriesListResponseSchema = z.object({
	queries: z.array(QuerySummarySchema),
});

export type QueriesListResponse = z.infer<typeof QueriesListResponseSchema>;

// ── content.get ───────────────────────────────────────────────────────────

const ContentGetInputSchema = z.object({
	query: QueryIdSchema,
	revision_type: z
		.enum(['manual', 'all'])
		.optional()
		.describe(
			'manual for the last saved revision, all to include autosaves. NEURONwriter defaults to manual.',
		),
});

export type ContentGetInput = z.input<typeof ContentGetInputSchema>;

const ContentRevisionSchema = z
	.object({
		content: z.string().nullish(),
		title: z.string().nullish(),
		description: z.string().nullish(),
		created: z.string().nullish(),
		type: z.string().nullish(),
	})
	.loose();

export type ContentGetResponse = z.infer<typeof ContentRevisionSchema>;

// ── content.import and content.evaluate ───────────────────────────────────

/**
 * Both methods take the same body, so they share one schema. One of `html` or
 * `url` is required; the `id` and `class` selectors only apply to `url`.
 */
const ContentPayloadSchema = z
	.object({
		query: QueryIdSchema,
		html: z.string().min(1).optional().describe('The HTML to send.'),
		url: z
			.string()
			.url()
			.optional()
			.describe('A page to fetch and parse instead of sending HTML.'),
		title: z
			.string()
			.optional()
			.describe('Overrides the title found in the HTML or page.'),
		description: z
			.string()
			.optional()
			.describe('Overrides the meta description found in the HTML or page.'),
		id: z
			.string()
			.min(1)
			.optional()
			.describe(
				'The element id holding the content, when importing from a url.',
			),
		class: z
			.string()
			.min(1)
			.optional()
			.describe(
				'The element class holding the content, when importing from a url.',
			),
	})
	.superRefine((value, ctx) => {
		// The provider needs one of the two, and both at once is ambiguous.
		if (!value.html && !value.url) {
			ctx.addIssue({
				code: 'custom',
				message: 'Either html or url is required.',
			});
		}
		if (value.html && value.url) {
			ctx.addIssue({
				code: 'custom',
				message: 'Send either html or url, not both.',
			});
		}
	});

export type ContentImportInput = z.input<typeof ContentPayloadSchema>;

const ContentResultSchema = z
	.object({
		status: z.string().nullish(),
		content_score: z
			.number()
			.nullish()
			.describe('The content score of the imported or evaluated text.'),
		error: z
			.string()
			.nullish()
			.describe('The reason an import or evaluation failed, when one did.'),
	})
	.loose();

export type ContentImportResponse = z.infer<typeof ContentResultSchema>;

/** `/evaluate-content` takes and answers the same shape as an import. */
export type ContentEvaluateInput = ContentImportInput;
export type ContentEvaluateResponse = ContentImportResponse;

// ── Registry ──────────────────────────────────────────────────────────────

export type NeuronwriterEndpointInputs = {
	projectsList: ProjectsListInput;
	analysisStart: AnalysisStartInput;
	analysisGet: AnalysisGetInput;
	queriesList: QueriesListInput;
	contentGet: ContentGetInput;
	contentImport: ContentImportInput;
	contentEvaluate: ContentEvaluateInput;
};

export type NeuronwriterEndpointOutputs = {
	projectsList: ProjectsListResponse;
	analysisStart: AnalysisStartResponse;
	analysisGet: AnalysisGetResponse;
	queriesList: QueriesListResponse;
	contentGet: ContentGetResponse;
	contentImport: ContentImportResponse;
	contentEvaluate: ContentEvaluateResponse;
};

export const NeuronwriterEndpointInputSchemas = {
	projectsList: ProjectsListInputSchema,
	analysisStart: AnalysisStartInputSchema,
	analysisGet: AnalysisGetInputSchema,
	queriesList: QueriesListInputSchema,
	contentGet: ContentGetInputSchema,
	contentImport: ContentPayloadSchema,
	contentEvaluate: ContentPayloadSchema,
} as const;

export const NeuronwriterEndpointOutputSchemas = {
	projectsList: ProjectsListResponseSchema,
	analysisStart: AnalysisStartResponseSchema,
	analysisGet: AnalysisGetResponseSchema,
	queriesList: QueriesListResponseSchema,
	contentGet: ContentRevisionSchema,
	contentImport: ContentResultSchema,
	contentEvaluate: ContentResultSchema,
} as const;
