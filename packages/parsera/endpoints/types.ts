import { z } from 'zod';

// ── Shared building blocks ─────────────────────────────────────────────────

/** One attribute to extract, as every extraction endpoint takes them. */
export const AttributeSchema = z
	.object({
		name: z.string().min(1).describe('Attribute name the result is keyed by'),
		description: z
			.string()
			.min(1)
			.describe('What to extract for this attribute'),
	})
	.loose()
	.describe('An attribute to extract from the page');
export type Attribute = z.infer<typeof AttributeSchema>;

/** Cookies, as the docs define them: name → value records plus sameSite. */
const CookieSchema = z
	// unknown: each cookie entry maps arbitrary cookie names to values, so
	// the record cannot be stricter.
	.record(z.string(), z.unknown())
	.describe(
		'Cookie record: keys are cookie names with their values, plus an optional sameSite of Strict, Lax or None',
	);

/** Proxy country, as the docs' Proxy Countries page lists them. */
const proxyCountry = z
	.string()
	.min(1)
	.optional()
	.describe('Proxy country, e.g. "Germany" or "UnitedStates"');

const promptOrAttributes = (label: string) =>
	z
		.object({
			prompt: z
				.string()
				.optional()
				.describe('Prompt describing what to extract'),
			attributes: z
				.array(AttributeSchema)
				.optional()
				.describe('Attribute list describing what to extract'),
		})
		.superRefine((input, ctx) => {
			if (
				!input.prompt &&
				(!input.attributes || input.attributes.length === 0)
			) {
				ctx.addIssue({
					code: 'custom',
					path: ['prompt'],
					message: `Give a prompt or at least one attribute to ${label}`,
				});
			}
		});

/** The extraction result. The docs publish no fixed schema. */
export const ExtractionResultSchema = z
	// unknown: the answer's shape is caller-defined by the attributes or
	// prompt sent, so it stays an open record.
	.record(z.string(), z.unknown())
	.describe(
		'The extracted data: attribute values keyed by attribute name, or the structure the prompt produced',
	);
export type ExtractionResult = z.infer<typeof ExtractionResultSchema>;

// ── extractor ──────────────────────────────────────────────────────────────

export const ExtractInputSchema = promptOrAttributes('extract')
	.extend({
		url: z.string().url().describe('URL of the webpage to extract data from'),
		mode: z
			.enum(['standard'])
			.optional()
			.describe('Extractor mode; standard is the documented value'),
		proxy_country: proxyCountry,
		cookies: z
			.array(CookieSchema)
			.optional()
			.describe('Cookies to use during extraction'),
	})
	.describe('Extract structured data from a URL with the LLM extractor');
export type ExtractInput = z.infer<typeof ExtractInputSchema>;

export const ExtractOutputSchema = ExtractionResultSchema;
export type ExtractOutput = z.infer<typeof ExtractOutputSchema>;

export const ParseInputSchema = promptOrAttributes('parse')
	.extend({
		content: z
			.string()
			.min(1)
			.describe('Raw HTML or text content to extract data from'),
	})
	.describe('Parse data from HTML or text content you already have');
export type ParseInput = z.infer<typeof ParseInputSchema>;

export const ParseOutputSchema = ExtractionResultSchema;
export type ParseOutput = z.infer<typeof ParseOutputSchema>;

export const CreateExtractorScraperInputSchema = z
	.object({})
	.describe('Input for creating an empty extractor scraper (none)');
export type CreateExtractorScraperInput = z.infer<
	typeof CreateExtractorScraperInputSchema
>;

export const CreatedScraperSchema = z
	.object({
		template_id: z
			.string()
			.min(1)
			.describe('Scraper id (the API spells it template_id)'),
	})
	.loose()
	.describe('A newly created scraper');
export type CreatedScraper = z.infer<typeof CreatedScraperSchema>;

export const CreateExtractorScraperOutputSchema = CreatedScraperSchema.describe(
	'The empty extractor scraper',
);
export type CreateExtractorScraperOutput = z.infer<
	typeof CreateExtractorScraperOutputSchema
>;

export const GetExtractorScraperInputSchema = z
	.object({ scraperId: z.string().min(1).describe('Scraper id') })
	.describe('Input for reading one extractor scraper');
export type GetExtractorScraperInput = z.infer<
	typeof GetExtractorScraperInputSchema
>;

export const GetExtractorScraperOutputSchema = z
	.object({
		template_id: z.string().min(1).describe('Scraper id'),
		type: z.string().nullish().describe('Scraper type, extractor'),
		name: z.string().nullish().describe('Scraper name'),
		url: z.string().nullish().describe('Primary URL the scraper was built on'),
	})
	.loose()
	.describe('An extractor scraper');
export type GetExtractorScraperOutput = z.infer<
	typeof GetExtractorScraperOutputSchema
>;

export const DeleteScraperInputSchema = z
	.object({ scraperId: z.string().min(1).describe('Scraper id') })
	.describe('Delete a scraper');
export type DeleteScraperInput = z.infer<typeof DeleteScraperInputSchema>;

export const DeleteScraperOutputSchema = z
	.object({
		message: z
			.string()
			.min(1)
			.describe('The API confirmation, e.g. "Scraper deleted successfully."'),
	})
	.loose()
	.describe('The delete confirmation the API answers with');
export type DeleteScraperOutput = z.infer<typeof DeleteScraperOutputSchema>;

// ── agent ──────────────────────────────────────────────────────────────────

export const AgentExtractInputSchema = promptOrAttributes('extract')
	.extend({
		url: z.string().url().describe('URL for the agent to start from'),
		callback_url: z
			.string()
			.url()
			.optional()
			.describe('URL to POST results to when extraction completes'),
	})
	.describe(
		'Start a one-shot agentic extraction; answers 202 with a task_id to poll',
	);
export type AgentExtractInput = z.infer<typeof AgentExtractInputSchema>;

export const AgentTaskSchema = z
	.object({
		task_id: z.string().min(1).describe('Extraction task id'),
		status: z
			.enum(['pending', 'running', 'completed', 'failed', 'stopped'])
			.describe('Task status'),
		data: z
			// unknown: extracted records are caller-defined open records, so
			// they cannot be stricter.
			.array(z.record(z.string(), z.unknown()))
			.nullish()
			.describe('The extracted records once the task completed'),
	})
	.loose()
	.describe('An agentic extraction task');
export type AgentTask = z.infer<typeof AgentTaskSchema>;

export const AgentExtractOutputSchema = AgentTaskSchema.describe(
	'The started task; answers 202 Accepted with status pending',
);
export type AgentExtractOutput = z.infer<typeof AgentExtractOutputSchema>;

export const GetAgentTaskInputSchema = z
	.object({ taskId: z.string().min(1).describe('Extraction task id') })
	.describe('Input for reading one agentic extraction task');
export type GetAgentTaskInput = z.infer<typeof GetAgentTaskInputSchema>;

export const GetAgentTaskOutputSchema = AgentTaskSchema.describe(
	'The task with its status and, when completed, its data',
);
export type GetAgentTaskOutput = z.infer<typeof GetAgentTaskOutputSchema>;

export const StopAgentTaskInputSchema = z
	.object({ taskId: z.string().min(1).describe('Extraction task id') })
	.describe('Cancel a running agentic extraction');
export type StopAgentTaskInput = z.infer<typeof StopAgentTaskInputSchema>;

export const StopAgentTaskOutputSchema = AgentTaskSchema.describe(
	'The task as stopped',
);
export type StopAgentTaskOutput = z.infer<typeof StopAgentTaskOutputSchema>;

export const GenerateAgentScraperInputSchema = promptOrAttributes('build from')
	.extend({
		url: z.string().url().describe('URL for the agent to build on'),
		template_id: z
			.string()
			.optional()
			.describe(
				'Existing scraper id to regenerate; a new scraper is created when omitted',
			),
	})
	.describe(
		'Build or regenerate an agentic scraper; answers 202 with a template_id to poll',
	);
export type GenerateAgentScraperInput = z.infer<
	typeof GenerateAgentScraperInputSchema
>;

export const GenerateAgentScraperOutputSchema = z
	.object({
		template_id: z.string().min(1).describe('Scraper id being generated'),
		status: z.string().describe('Build status, generating'),
	})
	.loose()
	.describe('The scraper build task; answers 202 Accepted');
export type GenerateAgentScraperOutput = z.infer<
	typeof GenerateAgentScraperOutputSchema
>;

export const CreateAgentScraperInputSchema = z
	.object({})
	.describe('Input for creating an empty agentic scraper (none)');
export type CreateAgentScraperInput = z.infer<
	typeof CreateAgentScraperInputSchema
>;

export const CreateAgentScraperOutputSchema = CreatedScraperSchema.describe(
	'The empty agentic scraper',
);
export type CreateAgentScraperOutput = z.infer<
	typeof CreateAgentScraperOutputSchema
>;

export const GetAgentScraperInputSchema = z
	.object({ scraperId: z.string().min(1).describe('Scraper id') })
	.describe('Input for reading one agentic scraper');
export type GetAgentScraperInput = z.infer<typeof GetAgentScraperInputSchema>;

export const GetAgentScraperOutputSchema = z
	.object({
		template_id: z.string().min(1).describe('Scraper id'),
		type: z.string().nullish().describe('Scraper type, agentic'),
		status: z.enum(['generating', 'ready', 'failed']).describe('Build status'),
		name: z.string().nullish().describe('Scraper name'),
		url: z.string().nullish().describe('Primary URL the scraper was built on'),
		sample_data: z
			// unknown: captured sample records are provider-defined, so they
			// cannot be stricter.
			.array(z.record(z.string(), z.unknown()))
			.nullish()
			.describe('Data captured while the agent learned the page'),
		parameters_schema: z
			.array(
				z
					.object({
						name: z.string().describe('Parameter name'),
						type: z
							.string()
							.nullish()
							.describe('Parameter type, e.g. url or string'),
						description: z
							.string()
							.nullish()
							.describe('What the parameter fills in'),
					})
					.loose(),
			)
			.nullish()
			.describe('Parameters the scraper accepts on each run'),
		credits_charged: z
			.number()
			.nullish()
			.describe('Credits charged for the build'),
	})
	.loose()
	.describe('An agentic scraper with its build status');
export type GetAgentScraperOutput = z.infer<typeof GetAgentScraperOutputSchema>;

// ── scrapers ───────────────────────────────────────────────────────────────

const RunParamsSchema = {
	url: z
		.union([z.string().url(), z.array(z.string().url()).max(100)])
		.optional()
		.describe(
			'URL to scrape; extractor scrapers accept an array of up to 100 URLs, agentic scrapers a single URL. Falls back to the scraper default when omitted',
		),
	parameters: z
		// unknown: agentic scraper parameters follow the scraper's own
		// parameters_schema, so the record cannot be stricter.
		.record(z.string(), z.unknown())
		.optional()
		.describe(
			'Custom parameters for agentic scrapers that define a parameters_schema',
		),
	callback_url: z
		.string()
		.url()
		.optional()
		.describe('URL to POST results to when the run completes'),
	proxy_country: proxyCountry,
	cookies: z
		.array(CookieSchema)
		.optional()
		.describe('Cookies to use; ignored for agentic scrapers'),
};

const RunOutputSchema = z
	.object({
		run_id: z
			.string()
			.nullish()
			.describe('Run id, present when the API deferred the run (202)'),
		status: z
			.string()
			.describe(
				'queued or running while in progress; completed or completed_partial with data when done (async); the sync run answers the results',
			),
		completed: z
			.number()
			.nullish()
			.describe('URLs processed so far (async runs)'),
		total: z.number().nullish().describe('Total URLs in the run (async runs)'),
		credits_charged: z
			.number()
			.nullish()
			.describe('Credits charged for the run'),
		data: z
			// unknown: results are keyed by scraped URL, so the record cannot
			// be stricter.
			.record(z.string(), z.array(z.record(z.string(), z.unknown())))
			.nullish()
			.describe('Extracted records keyed by scraped URL'),
	})
	.loose()
	.describe('A scraper run result or, when deferred, the run to poll');
export const ScraperRunOutputSchema = RunOutputSchema;
export type ScraperRunOutput = z.infer<typeof ScraperRunOutputSchema>;

export const RunScraperInputSchema = z
	.object({
		template_id: z.string().min(1).describe('Scraper id to run'),
		...RunParamsSchema,
	})
	.describe(
		'Run a scraper and wait for results; the API answers 202 with a run_id past five minutes',
	);
export type RunScraperInput = z.infer<typeof RunScraperInputSchema>;

export const RunScraperAsyncInputSchema = z
	.object({
		template_id: z.string().min(1).describe('Scraper id to run'),
		...RunParamsSchema,
	})
	.describe('Run a scraper asynchronously; answers 202 with a run_id to poll');
export type RunScraperAsyncInput = z.infer<typeof RunScraperAsyncInputSchema>;

export const GetRunInputSchema = z
	.object({ runId: z.string().min(1).describe('Run id') })
	.describe('Input for reading one scraper run');
export type GetRunInput = z.infer<typeof GetRunInputSchema>;

export const GetRunOutputSchema = RunOutputSchema.describe(
	'The run with its status and, when completed, its results',
);
export type GetRunOutput = z.infer<typeof GetRunOutputSchema>;

// ── Operation registry ─────────────────────────────────────────────────────

export const ParseraEndpointInputSchemas = {
	extractorExtract: ExtractInputSchema,
	extractorParse: ParseInputSchema,
	extractorCreateScraper: CreateExtractorScraperInputSchema,
	extractorGetScraper: GetExtractorScraperInputSchema,
	extractorDeleteScraper: DeleteScraperInputSchema,
	agentExtract: AgentExtractInputSchema,
	agentGetTask: GetAgentTaskInputSchema,
	agentStopTask: StopAgentTaskInputSchema,
	agentGenerateScraper: GenerateAgentScraperInputSchema,
	agentCreateScraper: CreateAgentScraperInputSchema,
	agentGetScraper: GetAgentScraperInputSchema,
	agentDeleteScraper: DeleteScraperInputSchema,
	scrapersRun: RunScraperInputSchema,
	scrapersRunAsync: RunScraperAsyncInputSchema,
	scrapersGetRun: GetRunInputSchema,
};

export const ParseraEndpointOutputSchemas = {
	extractorExtract: ExtractOutputSchema,
	extractorParse: ParseOutputSchema,
	extractorCreateScraper: CreateExtractorScraperOutputSchema,
	extractorGetScraper: GetExtractorScraperOutputSchema,
	extractorDeleteScraper: DeleteScraperOutputSchema,
	agentExtract: AgentExtractOutputSchema,
	agentGetTask: GetAgentTaskOutputSchema,
	agentStopTask: StopAgentTaskOutputSchema,
	agentGenerateScraper: GenerateAgentScraperOutputSchema,
	agentCreateScraper: CreateAgentScraperOutputSchema,
	agentGetScraper: GetAgentScraperOutputSchema,
	agentDeleteScraper: DeleteScraperOutputSchema,
	scrapersRun: ScraperRunOutputSchema,
	scrapersRunAsync: ScraperRunOutputSchema,
	scrapersGetRun: GetRunOutputSchema,
};

export type ParseraEndpointInputs = {
	[K in keyof typeof ParseraEndpointInputSchemas]: z.input<
		(typeof ParseraEndpointInputSchemas)[K]
	>;
};

export type ParseraEndpointOutputs = {
	[K in keyof typeof ParseraEndpointOutputSchemas]: z.infer<
		(typeof ParseraEndpointOutputSchemas)[K]
	>;
};
