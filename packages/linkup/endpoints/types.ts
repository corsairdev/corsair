import { z } from 'zod';
import { LinkupCreditEntity, LinkupResponseEntity } from '../schema/database';

// ── Inputs ──────────────────────────────────────────────────────────────────

export const EmptyInputSchema = z.object({});
export type EmptyInput = z.infer<typeof EmptyInputSchema>;

const Domain = z
	.string()
	.regex(/^[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/)
	.describe('A domain such as example.com.');
const DateOnly = z
	.string()
	.regex(/^\d{4}-\d{2}-\d{2}$/)
	.describe('YYYY-MM-DD');

/** Filters shared by search and research. */
const FilterShape = {
	fromDate: DateOnly.optional().describe(
		'Only sources published on or after this date (YYYY-MM-DD).',
	),
	toDate: DateOnly.optional().describe(
		'Only sources published on or before this date (YYYY-MM-DD).',
	),
	includeDomains: z
		.array(Domain)
		.min(1)
		.max(100)
		.optional()
		.describe('Only search these domains.'),
	excludeDomains: z
		.array(Domain)
		.min(1)
		.max(100)
		.optional()
		.describe('Never return these domains.'),
};

const Depth = z
	.enum(['flash', 'fast', 'standard', 'deep'])
	.optional()
	.describe(
		'flash, fast and standard cost the same and get slower and broader in that order; deep runs several searches and costs 10x. Default fast.',
	);

export const QueryInputSchema = z.object({
	q: z
		.string()
		.min(1)
		.max(2000)
		.describe('What to search for, in plain language.'),
	depth: Depth,
	maxResults: z.number().int().min(1).max(100).optional(),
	includeImages: z.boolean().optional().describe('Also return image results.'),
	...FilterShape,
});
export type QueryInput = z.infer<typeof QueryInputSchema>;

export const AnswerInputSchema = z.object({
	q: z.string().min(1).max(2000),
	depth: Depth,
	includeInlineCitations: z
		.boolean()
		.optional()
		.describe('Put numbered citations inside the answer text.'),
	...FilterShape,
});
export type AnswerInput = z.infer<typeof AnswerInputSchema>;

// A JSON Schema object supplied by the caller; its shape is theirs to define.
const JsonSchemaObject = z
	.record(z.string(), z.unknown())
	.describe('JSON Schema (type: object) for the data to return.');

export const StructuredInputSchema = z.object({
	q: z.string().min(1).max(2000),
	schema: JsonSchemaObject,
	depth: Depth,
	includeSources: z
		.boolean()
		.optional()
		.describe('Also return the sources the data came from.'),
	...FilterShape,
});
export type StructuredInput = z.infer<typeof StructuredInputSchema>;

export const FetchInputSchema = z.object({
	url: z.string().url(),
	mode: z
		.enum(['standard', 'pro'])
		.optional()
		.describe('pro gets past harder pages and costs 5x. Default standard.'),
	renderJs: z
		.boolean()
		.optional()
		.describe("Run the page's JavaScript before reading it (costs 5x)."),
	extractImages: z.boolean().optional(),
	includeRawContent: z
		.boolean()
		.optional()
		.describe("Also return the page's raw text."),
	schema: JsonSchemaObject.optional().describe(
		'JSON Schema for typed data to pull from the page.',
	),
	instructions: z
		.string()
		.min(1)
		.max(2000)
		.optional()
		.describe('What to pull from the page, used with schema.'),
});
export type FetchInput = z.infer<typeof FetchInputSchema>;

export const ResponseInputSchema = z.object({
	input: z.string().min(1).max(8000),
	model: z
		.enum(['linkup-standard', 'linkup-deep'])
		.describe('linkup-standard is faster; linkup-deep is more thorough.'),
	instructions: z
		.string()
		.min(1)
		.max(4000)
		.optional()
		.describe('System-style instructions for the answer.'),
});
export type ResponseInput = z.infer<typeof ResponseInputSchema>;

export const ResearchCreateInputSchema = z.object({
	q: z.string().min(1).max(4000).describe('The research question.'),
	reasoningDepth: z
		.enum(['S', 'M', 'L', 'XL'])
		.optional()
		.describe(
			'How hard to work: S $0.25 (default here), M $0.50, L $1.50, XL $2.50 per task.',
		),
	mode: z.enum(['auto', 'answer', 'investigate', 'research']).optional(),
	outputType: z.enum(['sourcedAnswer', 'structured']).optional(),
	schema: JsonSchemaObject.optional().describe(
		'JSON Schema for structured output; needed when outputType is structured.',
	),
	...FilterShape,
});
export type ResearchCreateInput = z.infer<typeof ResearchCreateInputSchema>;

const TaskId = z.string().regex(/^[A-Za-z0-9_-]+$/);

export const TaskIdInputSchema = z.object({ id: TaskId });
export type TaskIdInput = z.infer<typeof TaskIdInputSchema>;

const PageShape = {
	page: z.number().int().min(1).optional(),
	pageSize: z.number().int().min(1).max(100).optional(),
	sortBy: z.enum(['createdAt', 'updatedAt']).optional(),
	sortDirection: z.enum(['asc', 'desc']).optional(),
};

export const ResearchListInputSchema = z.object(PageShape);
export type ResearchListInput = z.infer<typeof ResearchListInputSchema>;

const TaskStatus = z.enum(['pending', 'processing', 'completed', 'failed']);

export const TaskListInputSchema = z.object({
	type: z
		.array(z.enum(['search', 'fetch', 'research']))
		.min(1)
		.optional(),
	status: z.array(TaskStatus).min(1).optional(),
	...PageShape,
});
export type TaskListInput = z.infer<typeof TaskListInputSchema>;

/** One batched call; the input takes the same fields as the matching endpoint's API body. */
export const TaskSpecSchema = z.discriminatedUnion('type', [
	z.object({
		type: z.literal('search'),
		// Same body as POST /v1/search: q, depth and outputType are required.
		input: z
			.object({
				q: z.string().min(1),
				depth: z.enum(['flash', 'fast', 'standard', 'deep']),
				outputType: z.enum(['searchResults', 'sourcedAnswer', 'structured']),
			})
			.loose(),
	}),
	z.object({
		type: z.literal('fetch'),
		// Same body as POST /v1/fetch.
		input: z.object({ url: z.string().url() }).loose(),
	}),
	z.object({
		type: z.literal('research'),
		// Same body as POST /v1/research.
		input: z
			.object({
				q: z.string().min(1),
				outputType: z.enum(['sourcedAnswer', 'structured']),
			})
			.loose(),
	}),
]);

export const TasksCreateInputSchema = z.object({
	tasks: z.array(TaskSpecSchema).min(1).max(100),
});
export type TasksCreateInput = z.infer<typeof TasksCreateInputSchema>;

// ── Outputs ─────────────────────────────────────────────────────────────────

export const SourceSchema = z
	.object({
		name: z.string().optional(),
		url: z.string(),
		snippet: z.string().optional(),
		favicon: z.string().nullable().optional(),
		publishedAt: z.string().optional(),
	})
	.loose();

export const ResultSchema = z
	.object({
		type: z.string().optional(),
		name: z.string().optional(),
		url: z.string(),
		content: z.string().optional(),
		favicon: z.string().nullable().optional(),
		publishedAt: z.string().optional(),
	})
	.loose();

/** An async research or batch task; output depends on the task's type. */
export const TaskSchema = z
	.object({
		id: z.string(),
		type: z.string().optional(),
		status: z.string(),
		createdAt: z.string().optional(),
		updatedAt: z.string().optional(),
		error: z.string().nullable().optional(),
		// The original request body, echoed back.
		input: z.record(z.string(), z.unknown()).optional(),
		// Shape follows the task type and outputType (answer + sources, results, data).
		output: z.unknown().optional(),
	})
	.loose();

export const ListMetaSchema = z.object({
	page: z.number().optional(),
	pageSize: z.number().optional(),
	total: z.number().optional(),
	totalPages: z.number().optional(),
});

export const CreditResponseSchema = z.object({ credit: LinkupCreditEntity });
export type CreditResponse = z.infer<typeof CreditResponseSchema>;

export const SearchResponseSchema = z.object({
	results: z.array(ResultSchema),
});
export type SearchResponse = z.infer<typeof SearchResponseSchema>;

export const AnswerResponseSchema = z.object({
	answer: z.string(),
	sources: z.array(SourceSchema),
});
export type AnswerResponse = z.infer<typeof AnswerResponseSchema>;

export const StructuredResponseSchema = z.object({
	// Matches the caller's schema.
	data: z.unknown(),
	sources: z.array(SourceSchema).optional(),
});
export type StructuredResponse = z.infer<typeof StructuredResponseSchema>;

export const FetchResponseSchema = z.object({
	markdown: z.string(),
	// Typed data when a schema was given; its shape is the caller's.
	data: z.record(z.string(), z.unknown()).optional(),
	rawContent: z.string().optional(),
	images: z.array(z.unknown()).optional(),
	contentType: z.string().optional(),
});
export type FetchResponse = z.infer<typeof FetchResponseSchema>;

export const ResponsesResponseSchema = z.object({
	response: LinkupResponseEntity,
	outputText: z.string(),
});
export type ResponsesResponse = z.infer<typeof ResponsesResponseSchema>;

export const TaskResponseSchema = z.object({ task: TaskSchema });
export type TaskResponse = z.infer<typeof TaskResponseSchema>;

export const TaskListResponseSchema = z.object({
	tasks: z.array(TaskSchema),
	meta: ListMetaSchema.optional(),
	quota: z
		.object({ inFlight: z.number().optional(), limit: z.number().optional() })
		.optional(),
});
export type TaskListResponse = z.infer<typeof TaskListResponseSchema>;

export const EndpointInputSchemas = {
	'credits.get': EmptyInputSchema,
	'search.run': QueryInputSchema,
	'answers.get': AnswerInputSchema,
	'search.structured': StructuredInputSchema,
	'pages.fetch': FetchInputSchema,
	'responses.create': ResponseInputSchema,
	'research.create': ResearchCreateInputSchema,
	'research.get': TaskIdInputSchema,
	'research.list': ResearchListInputSchema,
	'tasks.create': TasksCreateInputSchema,
	'tasks.get': TaskIdInputSchema,
	'tasks.list': TaskListInputSchema,
};

export const EndpointOutputSchemas = {
	'credits.get': CreditResponseSchema,
	'search.run': SearchResponseSchema,
	'answers.get': AnswerResponseSchema,
	'search.structured': StructuredResponseSchema,
	'pages.fetch': FetchResponseSchema,
	'responses.create': ResponsesResponseSchema,
	'research.create': TaskResponseSchema,
	'research.get': TaskResponseSchema,
	'research.list': TaskListResponseSchema,
	'tasks.create': TaskListResponseSchema,
	'tasks.get': TaskResponseSchema,
	'tasks.list': TaskListResponseSchema,
};
