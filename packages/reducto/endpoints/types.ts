import { z } from 'zod';

// Response objects are `.loose()` so a field Reducto adds later still reaches
// the caller. Request objects are loose for the same reason: the OpenAPI spec
// grows, and an unknown config key should be forwarded, not stripped.

export const UploadRefSchema = z
	.object({
		file_id: z.string().min(1),
		presigned_url: z.string().nullable().optional(),
	})
	.loose();

// A public URL, a presigned URL, `reducto://…`, `jobid://…`, a list of those,
// or the object returned by upload.
export const DocumentInputSchema = z.union([
	z.string().min(1),
	z.array(z.string().min(1)).min(1),
	UploadRefSchema,
]);

export const PageRangeSchema = z
	.object({
		start: z.number().int().nullable().optional(),
		end: z.number().int().nullable().optional(),
	})
	.loose();

export const PageRangeInputSchema = z
	.union([PageRangeSchema, z.array(PageRangeSchema), z.array(z.number().int())])
	.nullable()
	.optional();

export const AgenticItemSchema = z
	.object({
		scope: z.enum(['text', 'table', 'figure']),
		prompt: z.string().nullable().optional(),
		mode: z.enum(['default', 'auto', 'max']).optional(),
		advanced_chart_agent: z.boolean().optional(),
		return_overlays: z.boolean().optional(),
	})
	.loose();

export const EnhanceSchema = z
	.object({
		agentic: z.array(AgenticItemSchema).optional(),
		advanced_chart_agent: z.boolean().optional(),
		summarize_figures: z.boolean().optional(),
		intelligent_ordering: z.boolean().optional(),
	})
	.loose();

export const ChunkingSchema = z
	.object({
		chunk_mode: z
			.enum([
				'variable',
				'section',
				'page',
				'disabled',
				'block',
				'page_sections',
			])
			.optional(),
		chunk_size: z.number().int().nullable().optional(),
		chunk_overlap: z.number().int().optional(),
	})
	.loose();

export const RetrievalSchema = z
	.object({
		chunking: ChunkingSchema.optional(),
		filter_blocks: z
			.array(
				z.enum([
					'Header',
					'Footer',
					'Title',
					'Section Header',
					'Page Number',
					'List Item',
					'Figure',
					'Table',
					'Key Value',
					'Text',
					'Comment',
					'Signature',
				]),
			)
			.optional(),
		embedding_optimized: z.boolean().optional(),
	})
	.loose();

export const FormattingSchema = z
	.object({
		add_page_markers: z.boolean().optional(),
		table_output_format: z
			.enum(['html', 'json', 'md', 'jsonbbox', 'dynamic', 'csv'])
			.optional(),
		merge_tables: z.boolean().optional(),
		include: z
			.array(
				z.enum([
					'change_tracking',
					'highlight',
					'comments',
					'hyperlinks',
					'signatures',
					'ignore_watermarks',
				]),
			)
			.optional(),
	})
	.loose();

export const SpreadsheetSchema = z
	.object({
		split_large_tables: z
			.object({
				enabled: z.boolean().optional(),
				size: z.number().int().optional(),
			})
			.loose()
			.optional(),
		include: z
			.array(z.enum(['cell_colors', 'formula', 'dropdowns']))
			.optional(),
		clustering: z.enum(['accurate', 'fast', 'disabled']).optional(),
		exclude: z.array(z.string()).optional(),
		max_cell_count: z.number().int().nullable().optional(),
	})
	.loose();

export const ParseSettingsSchema = z
	.object({
		ocr_system: z.enum(['standard', 'legacy']).optional(),
		extraction_mode: z.enum(['ocr', 'hybrid']).optional(),
		force_url_result: z.boolean().optional(),
		force_file_extension: z.string().nullable().optional(),
		return_ocr_data: z.boolean().optional(),
		return_images: z.array(z.enum(['figure', 'table', 'page'])).optional(),
		embed_pdf_metadata: z.boolean().optional(),
		extract_document_properties: z.boolean().optional(),
		embed_pdf_metadata_dpi: z.number().int().min(50).max(250).optional(),
		persist_results: z.boolean().optional(),
		timeout: z.number().nullable().optional(),
		page_range: PageRangeInputSchema,
		document_password: z.string().nullable().optional(),
		model: z.string().nullable().optional(),
	})
	.loose();

export const ParseOptionsSchema = z
	.object({
		enhance: EnhanceSchema.optional(),
		retrieval: RetrievalSchema.optional(),
		formatting: FormattingSchema.optional(),
		spreadsheet: SpreadsheetSchema.optional(),
		settings: ParseSettingsSchema.optional(),
	})
	.loose();

export const DirectWebhookSchema = z
	.object({
		mode: z.literal('direct'),
		url: z.string().min(1),
	})
	.loose();

export const SvixWebhookSchema = z
	.object({
		mode: z.literal('svix'),
		channels: z.array(z.string()).optional(),
	})
	.loose();

export const DisabledWebhookSchema = z
	.object({
		mode: z.literal('disabled'),
		channels: z.array(z.string()).optional(),
	})
	.loose();

export const WebhookConfigSchema = z.discriminatedUnion('mode', [
	DirectWebhookSchema,
	SvixWebhookSchema,
	DisabledWebhookSchema,
]);

export const AsyncConfigSchema = z
	.object({
		// z.unknown() is used because async metadata is a caller-defined map.
		metadata: z.record(z.string(), z.unknown()).nullable().optional(),
		priority: z.boolean().optional(),
		webhook: WebhookConfigSchema.nullable().optional(),
	})
	.loose();

const parseFields = {
	input: DocumentInputSchema,
	enhance: EnhanceSchema.optional(),
	retrieval: RetrievalSchema.optional(),
	formatting: FormattingSchema.optional(),
	spreadsheet: SpreadsheetSchema.optional(),
	settings: ParseSettingsSchema.optional(),
};

export const ParseInputSchema = z.object(parseFields).loose();

export const ParseAsyncInputSchema = ParseInputSchema.extend({
	async: AsyncConfigSchema.optional(),
	queue_priority: z.enum(['auto', 'standard', 'batch']).optional(),
});

export const InstructionsSchema = z
	.object({
		// z.unknown() is used because instructions.schema is the caller's JSON Schema.
		schema: z.unknown().optional(),
		system_prompt: z.string().optional(),
	})
	.loose();

export const ExtractSettingsSchema = z
	.object({
		include_images: z.boolean().optional(),
		optimize_for_latency: z.boolean().optional(),
		force_url_result: z.boolean().optional(),
		array_extract: z.boolean().optional(),
		deep_extract: z.boolean().optional(),
		citations: z
			.object({
				enabled: z.boolean().optional(),
				numerical_confidence: z.boolean().optional(),
				parent_block: z.string().optional(),
			})
			.loose()
			.optional(),
		page_range: PageRangeInputSchema,
	})
	.loose();

const extractFields = {
	input: DocumentInputSchema,
	parsing: ParseOptionsSchema.optional(),
	instructions: InstructionsSchema.optional(),
	settings: ExtractSettingsSchema.optional(),
};

export const ExtractInputSchema = z.object(extractFields).loose();

export const ExtractAsyncInputSchema = ExtractInputSchema.extend({
	async: AsyncConfigSchema.optional(),
	queue_priority: z.enum(['auto', 'standard', 'batch']).optional(),
});

export const SplitCategorySchema = z
	.object({
		name: z.string().min(1),
		description: z.string().min(1),
		partition_key: z.string().nullable().optional(),
	})
	.loose();

export const SplitSettingsSchema = z
	.object({
		table_cutoff: z.enum(['truncate', 'preserve']).optional(),
		allow_page_overlap: z.boolean().optional(),
		auto_partition: z.boolean().optional(),
		deep_split: z.boolean().optional(),
		force_url_result: z.boolean().optional(),
	})
	.loose();

const splitFields = {
	input: DocumentInputSchema,
	parsing: ParseOptionsSchema.optional(),
	split_description: z.array(SplitCategorySchema).min(1),
	split_rules: z.string().optional(),
	settings: SplitSettingsSchema.optional(),
};

export const SplitInputSchema = z.object(splitFields).loose();

export const SplitAsyncInputSchema = SplitInputSchema.extend({
	async: AsyncConfigSchema.optional(),
});

export const EditOptionsSchema = z
	.object({
		color: z.string().optional(),
		font_size: z.number().nullable().optional(),
		llm_provider_preference: z.string().nullable().optional(),
		enable_overflow_pages: z.boolean().optional(),
		flatten: z.boolean().optional(),
	})
	.loose();

const editFields = {
	document_url: z.union([z.string().min(1), UploadRefSchema]),
	edit_instructions: z.string().min(1),
	edit_options: EditOptionsSchema.optional(),
	// z.unknown() is used because form_schema items are caller-supplied field locations.
	form_schema: z.array(z.unknown()).nullable().optional(),
	priority: z.boolean().optional(),
};

export const EditInputSchema = z.object(editFields).loose();

export const EditAsyncInputSchema = EditInputSchema.extend({
	webhook: WebhookConfigSchema.optional(),
});

export const ClassificationCategorySchema = z
	.object({
		category: z.string().min(1),
		criteria: z.array(z.string()).min(1),
	})
	.loose();

export const ClassifyInputSchema = z
	.object({
		input: DocumentInputSchema,
		classification_schema: z.array(ClassificationCategorySchema).optional(),
		// z.unknown() is used because OpenAPI leaves category_groups as an open object.
		category_groups: z.record(z.string(), z.unknown()).optional(),
		page_range: PageRangeInputSchema,
		document_metadata: z.string().nullable().optional(),
		model: z.enum(['default', 'accurate']).optional(),
		priority: z.boolean().optional(),
		force_url_result: z.boolean().optional(),
	})
	.loose();

export const ClassifyAsyncInputSchema = ClassifyInputSchema.extend({
	async: AsyncConfigSchema.optional(),
});

export const PipelineInputSchema = z
	.object({
		input: DocumentInputSchema,
		pipeline_id: z.string().min(1),
		settings: z
			.object({
				document_password: z.string().nullable().optional(),
			})
			.loose()
			.optional(),
	})
	.loose();

export const PipelineAsyncInputSchema = PipelineInputSchema.extend({
	async: AsyncConfigSchema.optional(),
});

export const JobIdInputSchema = z.object({
	job_id: z.string().min(1),
});

export const DeleteJobInputSchema = JobIdInputSchema.extend({
	include_persisted: z.boolean().optional(),
});

export const ListJobsInputSchema = z.object({
	exclude_configs: z.boolean().optional(),
	cursor: z.string().nullable().optional(),
	limit: z.number().int().min(1).max(500).optional(),
});

export const UploadInputSchema = z.object({
	file: z.instanceof(Blob),
	extension: z.string().nullable().optional(),
});

export const DeleteUploadInputSchema = z.object({
	file_id: z.string().min(1),
});

export const VersionInputSchema = z.object({});

export const ConfigureWebhookInputSchema = z.object({});

// ParseUsage in the OpenAPI spec. Split and pipeline reuse it.
export const ParseUsageSchema = z
	.object({
		num_pages: z.number(),
		credits: z.number().nullable().optional(),
	})
	.loose();

// ExtractUsage requires both counters.
export const ExtractUsageSchema = ParseUsageSchema.extend({
	num_fields: z.number(),
});

// ClassifyUsage requires both counters. The classify response itself may omit usage.
export const ClassifyUsageSchema = ParseUsageSchema.extend({
	num_categories: z.number(),
});

export const UrlResultSchema = z
	.object({
		type: z.literal('url'),
		url: z.string(),
		result_id: z.string(),
	})
	.loose();

export const FullResultSchema = z
	.object({
		type: z.literal('full'),
		chunks: z.array(
			z
				.object({
					content: z.string(),
					embed: z.string().optional(),
					// z.unknown() is used because block layout fields vary by parse model.
					blocks: z.array(z.unknown()).optional(),
				})
				.loose(),
		),
	})
	.loose();

export const ParseResultSchema = z.union([FullResultSchema, UrlResultSchema]);

export const ParseResponseSchema = z
	.object({
		job_id: z.string(),
		duration: z.number(),
		usage: ParseUsageSchema,
		result: ParseResultSchema,
		pdf_url: z.string().nullable().optional(),
		studio_link: z.string().nullable().optional(),
	})
	.loose();

export const AsyncJobIdResponseSchema = z
	.object({
		job_id: z.string(),
	})
	.loose();

export const ExtractResponseSchema = z
	.object({
		usage: ExtractUsageSchema,
		// z.unknown() is used because extract result values follow the caller's schema.
		result: z.union([
			z.array(z.unknown()),
			z.record(z.string(), z.unknown()),
			UrlResultSchema,
		]),
		citations: z
			.union([z.array(z.unknown()), UrlResultSchema])
			.nullable()
			.optional(),
		job_id: z.string().nullable().optional(),
		duration: z.number().nullable().optional(),
		studio_link: z.string().nullable().optional(),
	})
	.loose();

export const SplitResponseSchema = z
	.object({
		usage: ParseUsageSchema,
		result: z.union([
			z
				.object({
					splits: z.array(
						z
							.object({
								name: z.string(),
								pages: z.array(z.number()),
							})
							.loose(),
					),
				})
				.loose(),
			UrlResultSchema,
			// z.unknown() is used because deep split returns a shape other than splits[].
			z.record(z.string(), z.unknown()),
		]),
		job_id: z.string().nullable().optional(),
		duration: z.number().nullable().optional(),
	})
	.loose();

export const EditResponseSchema = z
	.object({
		document_url: z.string(),
		job_id: z.string().nullable().optional(),
		// z.unknown() is used because returned form_schema widgets are provider-defined.
		form_schema: z.array(z.unknown()).nullable().optional(),
		usage: ParseUsageSchema.nullable().optional(),
	})
	.loose();

export const ClassifyResponseSchema = z
	.object({
		job_id: z.string(),
		result: z.union([
			z.object({ category: z.string() }).loose(),
			UrlResultSchema,
		]),
		duration: z.number().nullable().optional(),
		usage: ClassifyUsageSchema.nullable().optional(),
	})
	.loose();

export const PipelineResponseSchema = z
	.object({
		job_id: z.string(),
		usage: ParseUsageSchema,
		// z.unknown() is used because a pipeline result is the Studio pipeline's own schema.
		result: z.unknown(),
	})
	.loose();

export const JobResponseSchema = z
	.object({
		status: z.string(),
		// z.unknown() is used because a finished job result is the payload of whichever operation ran.
		result: z.unknown().nullable().optional(),
		progress: z.number().nullable().optional(),
		reason: z.string().nullable().optional(),
		// z.unknown() is used because job error bodies are unstructured provider objects.
		error: z.unknown().nullable().optional(),
		type: z.string().nullable().optional(),
		// z.unknown() is used because OpenAPI types source as an unconstrained object or null.
		source: z.unknown().nullable().optional(),
		num_pages: z.number().nullable().optional(),
		total_pages: z.number().nullable().optional(),
		duration: z.number().nullable().optional(),
		created_at: z.string().nullable().optional(),
		// z.unknown() is used because OpenAPI types bucket as an unconstrained object or null.
		bucket: z.unknown().nullable().optional(),
	})
	.loose();

export const JobSummarySchema = z
	.object({
		job_id: z.string(),
		status: z.string(),
		type: z.string(),
		raw_config: z.string().optional(),
		created_at: z.string(),
		// z.unknown() is used because OpenAPI types source as an unconstrained object or null.
		source: z.unknown().nullable().optional(),
		num_pages: z.number().nullable().optional(),
		total_pages: z.number().nullable().optional(),
		duration: z.number().nullable().optional(),
		// z.unknown() is used because OpenAPI types bucket as an unconstrained object or null.
		bucket: z.unknown().nullable().optional(),
	})
	.loose();

export const ListJobsResponseSchema = z
	.object({
		jobs: z.array(JobSummarySchema),
		next_cursor: z.string().nullable().optional(),
	})
	.loose();

export const DeleteJobResponseSchema = z
	.object({
		job_id: z.string(),
	})
	.loose();

// OpenAPI declares an empty schema for cancel. A JSON object, null, or an
// omitted body are all valid.
export const CancelJobResponseSchema = z.union([
	// z.unknown() is used because OpenAPI declares an empty object schema for cancel.
	z.record(z.string(), z.unknown()),
	z.null(),
	z.undefined(),
]);

export const UploadResponseSchema = UploadRefSchema;

export const DeleteUploadResponseSchema = z
	.object({
		file_id: z.string(),
	})
	.loose();

export const VersionResponseSchema = z.string().min(1);

export const ConfigureWebhookResponseSchema = z.string().min(1);

export type ParseInput = z.infer<typeof ParseInputSchema>;
export type ParseAsyncInput = z.infer<typeof ParseAsyncInputSchema>;
export type ExtractInput = z.infer<typeof ExtractInputSchema>;
export type ExtractAsyncInput = z.infer<typeof ExtractAsyncInputSchema>;
export type SplitInput = z.infer<typeof SplitInputSchema>;
export type SplitAsyncInput = z.infer<typeof SplitAsyncInputSchema>;
export type EditInput = z.infer<typeof EditInputSchema>;
export type EditAsyncInput = z.infer<typeof EditAsyncInputSchema>;
export type ClassifyInput = z.infer<typeof ClassifyInputSchema>;
export type ClassifyAsyncInput = z.infer<typeof ClassifyAsyncInputSchema>;
export type PipelineInput = z.infer<typeof PipelineInputSchema>;
export type PipelineAsyncInput = z.infer<typeof PipelineAsyncInputSchema>;
export type JobIdInput = z.infer<typeof JobIdInputSchema>;
export type DeleteJobInput = z.infer<typeof DeleteJobInputSchema>;
export type ListJobsInput = z.infer<typeof ListJobsInputSchema>;
export type UploadInput = z.infer<typeof UploadInputSchema>;
export type DeleteUploadInput = z.infer<typeof DeleteUploadInputSchema>;
export type VersionInput = z.infer<typeof VersionInputSchema>;
export type ConfigureWebhookInput = z.infer<typeof ConfigureWebhookInputSchema>;

export type ParseResponse = z.infer<typeof ParseResponseSchema>;
export type AsyncJobIdResponse = z.infer<typeof AsyncJobIdResponseSchema>;
export type ExtractResponse = z.infer<typeof ExtractResponseSchema>;
export type SplitResponse = z.infer<typeof SplitResponseSchema>;
export type EditResponse = z.infer<typeof EditResponseSchema>;
export type ClassifyResponse = z.infer<typeof ClassifyResponseSchema>;
export type PipelineResponse = z.infer<typeof PipelineResponseSchema>;
export type JobResponse = z.infer<typeof JobResponseSchema>;
export type ListJobsResponse = z.infer<typeof ListJobsResponseSchema>;
export type DeleteJobResponse = z.infer<typeof DeleteJobResponseSchema>;
export type CancelJobResponse = z.infer<typeof CancelJobResponseSchema>;
export type UploadResponse = z.infer<typeof UploadResponseSchema>;
export type DeleteUploadResponse = z.infer<typeof DeleteUploadResponseSchema>;
export type VersionResponse = z.infer<typeof VersionResponseSchema>;
export type ConfigureWebhookResponse = z.infer<
	typeof ConfigureWebhookResponseSchema
>;

export type ReductoEndpointInputs = {
	parse: ParseInput;
	parseAsync: ParseAsyncInput;
	extract: ExtractInput;
	extractAsync: ExtractAsyncInput;
	split: SplitInput;
	splitAsync: SplitAsyncInput;
	edit: EditInput;
	editAsync: EditAsyncInput;
	classify: ClassifyInput;
	classifyAsync: ClassifyAsyncInput;
	pipeline: PipelineInput;
	pipelineAsync: PipelineAsyncInput;
	getJob: JobIdInput;
	listJobs: ListJobsInput;
	cancelJob: JobIdInput;
	deleteJob: DeleteJobInput;
	upload: UploadInput;
	deleteUpload: DeleteUploadInput;
	version: VersionInput;
	configureWebhook: ConfigureWebhookInput;
};

export type ReductoEndpointOutputs = {
	parse: ParseResponse;
	parseAsync: AsyncJobIdResponse;
	extract: ExtractResponse;
	extractAsync: AsyncJobIdResponse;
	split: SplitResponse;
	splitAsync: AsyncJobIdResponse;
	edit: EditResponse;
	editAsync: AsyncJobIdResponse;
	classify: ClassifyResponse;
	classifyAsync: AsyncJobIdResponse;
	pipeline: PipelineResponse;
	pipelineAsync: AsyncJobIdResponse;
	getJob: JobResponse;
	listJobs: ListJobsResponse;
	cancelJob: CancelJobResponse;
	deleteJob: DeleteJobResponse;
	upload: UploadResponse;
	deleteUpload: DeleteUploadResponse;
	version: VersionResponse;
	configureWebhook: ConfigureWebhookResponse;
};

export const ReductoEndpointInputSchemas = {
	parse: ParseInputSchema,
	parseAsync: ParseAsyncInputSchema,
	extract: ExtractInputSchema,
	extractAsync: ExtractAsyncInputSchema,
	split: SplitInputSchema,
	splitAsync: SplitAsyncInputSchema,
	edit: EditInputSchema,
	editAsync: EditAsyncInputSchema,
	classify: ClassifyInputSchema,
	classifyAsync: ClassifyAsyncInputSchema,
	pipeline: PipelineInputSchema,
	pipelineAsync: PipelineAsyncInputSchema,
	getJob: JobIdInputSchema,
	listJobs: ListJobsInputSchema,
	cancelJob: JobIdInputSchema,
	deleteJob: DeleteJobInputSchema,
	upload: UploadInputSchema,
	deleteUpload: DeleteUploadInputSchema,
	version: VersionInputSchema,
	configureWebhook: ConfigureWebhookInputSchema,
} as const;

export const ReductoEndpointOutputSchemas = {
	parse: ParseResponseSchema,
	parseAsync: AsyncJobIdResponseSchema,
	extract: ExtractResponseSchema,
	extractAsync: AsyncJobIdResponseSchema,
	split: SplitResponseSchema,
	splitAsync: AsyncJobIdResponseSchema,
	edit: EditResponseSchema,
	editAsync: AsyncJobIdResponseSchema,
	classify: ClassifyResponseSchema,
	classifyAsync: AsyncJobIdResponseSchema,
	pipeline: PipelineResponseSchema,
	pipelineAsync: AsyncJobIdResponseSchema,
	getJob: JobResponseSchema,
	listJobs: ListJobsResponseSchema,
	cancelJob: CancelJobResponseSchema,
	deleteJob: DeleteJobResponseSchema,
	upload: UploadResponseSchema,
	deleteUpload: DeleteUploadResponseSchema,
	version: VersionResponseSchema,
	configureWebhook: ConfigureWebhookResponseSchema,
} as const;
