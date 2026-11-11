import { z } from 'zod';

// Field names, types, bounds and enums follow Mistral's OpenAPI spec
// (https://docs.mistral.ai/openapi.yaml). Inputs use Mistral's own snake_case
// names so a body goes out as written. Outputs are `.loose()`: fields Mistral
// adds later pass through instead of failing the parse.

// ── Shared ──────────────────────────────────────────────────────────────────

// unknown: free-form key/value metadata Mistral stores and echoes back.
const MetadataSchema = z.record(z.string(), z.unknown());

// unknown: a JSON Schema object, any shape the caller's tool or format needs.
const JsonSchemaObject = z.record(z.string(), z.unknown());

const ModelSchema = z
	.string()
	.min(1)
	.describe(
		'Model id, for example mistral-small-latest. models.list lists the ones this key can use.',
	);

const PageSizeSchema = (max: number) =>
	z.number().int().min(1).max(max).optional();

const PageTokenSchema = z
	.string()
	.min(1)
	.optional()
	.describe('next_page_token from the previous page.');

const StopSchema = z.union([z.string(), z.array(z.string())]);

const ReasoningEffortSchema = z.enum([
	'none',
	'minimal',
	'low',
	'medium',
	'high',
	'xhigh',
	'max',
]);

const UsageSchema = z
	.object({
		prompt_tokens: z.number().int().nullish(),
		completion_tokens: z.number().int().nullish(),
		total_tokens: z.number().int().nullish(),
		prompt_audio_seconds: z.number().nullish(),
	})
	.loose();

// ── Messages ────────────────────────────────────────────────────────────────

const TextChunkSchema = z.object({
	type: z.literal('text'),
	text: z.string(),
});

const ImageUrlChunkSchema = z.object({
	type: z.literal('image_url'),
	image_url: z.union([
		z.string(),
		z.object({ url: z.string(), detail: z.string().optional() }),
	]),
});

const DocumentUrlChunkSchema = z.object({
	type: z.literal('document_url'),
	document_url: z.string(),
	document_name: z.string().optional(),
});

const FileChunkSchema = z.object({
	type: z.literal('file'),
	file_id: z.string().describe('Id of a file uploaded with files.upload.'),
});

const AudioChunkSchema = z.object({
	type: z.literal('input_audio'),
	input_audio: z.string().describe('Base64 audio, or an audio URL.'),
});

// Chunk types without a dedicated schema here (thinking, reference, resource)
// still pass: each is an object with its own `type`.
const OtherChunkSchema = z.object({ type: z.string() }).loose();

const ContentChunkSchema = z.union([
	TextChunkSchema,
	ImageUrlChunkSchema,
	DocumentUrlChunkSchema,
	FileChunkSchema,
	AudioChunkSchema,
	OtherChunkSchema,
]);

const ContentSchema = z.union([z.string(), z.array(ContentChunkSchema)]);

const ToolCallSchema = z
	.object({
		id: z.string().optional(),
		type: z.literal('function').optional(),
		function: z.object({
			name: z.string(),
			// unknown: arguments are the model's JSON for the caller's own tool.
			arguments: z.union([z.string(), z.record(z.string(), z.unknown())]),
		}),
		index: z.number().int().optional(),
	})
	.loose();

const MessageSchema = z.discriminatedUnion('role', [
	z.object({ role: z.literal('system'), content: ContentSchema }),
	z.object({ role: z.literal('user'), content: ContentSchema.nullable() }),
	z.object({
		role: z.literal('assistant'),
		content: ContentSchema.nullish(),
		tool_calls: z.array(ToolCallSchema).optional(),
		prefix: z
			.boolean()
			.optional()
			.describe('True on a last assistant message the answer must start with.'),
	}),
	z.object({
		role: z.literal('tool'),
		content: ContentSchema.nullable(),
		tool_call_id: z.string().optional(),
		name: z.string().optional(),
	}),
]);

const MessagesSchema = z
	.array(MessageSchema)
	.min(1)
	.describe(
		'Conversation so far: { role: "system" | "user" | "assistant" | "tool", content }.',
	);

// ── Tools and formats ───────────────────────────────────────────────────────

const FunctionSchema = z.object({
	name: z.string().min(1),
	description: z.string().optional(),
	strict: z.boolean().optional(),
	parameters: JsonSchemaObject.describe(
		"JSON Schema of the function's arguments.",
	),
});

const ToolConfigurationSchema = z.object({
	exclude: z.array(z.string()).optional(),
	include: z.array(z.string()).optional(),
	requires_confirmation: z.array(z.string()).optional(),
});

const FunctionToolSchema = z.object({
	type: z.literal('function'),
	function: FunctionSchema,
});

const ImageGenerationToolSchema = z.object({
	type: z.literal('image_generation'),
	tool_configuration: ToolConfigurationSchema.optional(),
});

const DocumentLibraryToolSchema = z.object({
	type: z.literal('document_library'),
	library_ids: z.array(z.string()).min(1),
	tool_configuration: ToolConfigurationSchema.optional(),
});

const ConnectorToolSchema = z.object({
	type: z.literal('connector'),
	connector_id: z.string().min(1),
	// unknown: OAuth2 token or API key auth, as the connector defines it.
	authorization: z.record(z.string(), z.unknown()).optional(),
	tool_configuration: ToolConfigurationSchema.optional(),
});

const CompletionToolSchema = z.discriminatedUnion('type', [
	FunctionToolSchema,
	ImageGenerationToolSchema,
	DocumentLibraryToolSchema,
	ConnectorToolSchema,
]);

const AgentToolSchema = z.discriminatedUnion('type', [
	FunctionToolSchema,
	z.object({
		type: z.literal('web_search'),
		tool_configuration: ToolConfigurationSchema.optional(),
	}),
	z.object({
		type: z.literal('web_search_premium'),
		tool_configuration: ToolConfigurationSchema.optional(),
	}),
	z.object({
		type: z.literal('code_interpreter'),
		tool_configuration: ToolConfigurationSchema.optional(),
	}),
	ImageGenerationToolSchema,
	DocumentLibraryToolSchema,
	ConnectorToolSchema,
]);

const ToolChoiceSchema = z.union([
	z.enum(['auto', 'none', 'any', 'required']),
	z.object({
		type: z.literal('function'),
		function: z.object({ name: z.string() }),
	}),
]);

const ResponseFormatSchema = z.object({
	type: z.enum(['text', 'json_object', 'json_schema']),
	json_schema: z
		.object({
			name: z.string(),
			description: z.string().optional(),
			schema: JsonSchemaObject,
			strict: z.boolean().optional(),
		})
		.optional(),
});

const GuardrailSchema = z.object({
	block_on_error: z.boolean().optional(),
	// unknown: moderation model settings (thresholds, action), passed through.
	moderation_llm_v1: z.record(z.string(), z.unknown()).optional(),
	// unknown: as above, for the v2 moderation model.
	moderation_llm_v2: z.record(z.string(), z.unknown()).optional(),
});

const PredictionSchema = z.object({
	type: z.literal('content'),
	content: z.string(),
});

// ── Completions ─────────────────────────────────────────────────────────────

const CompletionShape = {
	max_tokens: z.number().int().min(0).optional(),
	min_tokens: z.number().int().min(0).optional(),
	stop: StopSchema.optional(),
	random_seed: z.number().int().min(0).optional(),
	metadata: MetadataSchema.optional(),
	messages: MessagesSchema,
	response_format: ResponseFormatSchema.optional(),
	tools: z.array(CompletionToolSchema).optional(),
	tool_choice: ToolChoiceSchema.optional(),
	presence_penalty: z.number().min(-2).max(2).optional(),
	frequency_penalty: z.number().min(-2).max(2).optional(),
	repetition_penalty: z.number().max(2).optional(),
	top_k: z.number().int().min(-1).optional(),
	n: z.number().int().min(1).optional(),
	logprobs: z.boolean().optional(),
	top_logprobs: z.number().int().optional(),
	prediction: PredictionSchema.optional(),
	parallel_tool_calls: z.boolean().optional(),
	reasoning_effort: ReasoningEffortSchema.optional(),
	prompt_mode: z.literal('reasoning').optional(),
	guardrails: z.array(GuardrailSchema).optional(),
	prompt_cache_key: z.string().optional(),
	service_tier: z.enum(['auto', 'standard_only']).optional(),
};

const ChatCompleteInputSchema = z.object({
	model: ModelSchema,
	temperature: z.number().min(0).max(1.5).optional(),
	top_p: z.number().max(1).optional(),
	safe_prompt: z
		.boolean()
		.optional()
		.describe("Prepend Mistral's safety system prompt."),
	...CompletionShape,
});

const AgentsCompleteInputSchema = z.object({
	agent_id: z.string().min(1).describe('Id of the agent to run.'),
	...CompletionShape,
});

const FimCompleteInputSchema = z.object({
	model: ModelSchema.describe('A code model, for example codestral-latest.'),
	prompt: z.string().describe('Code before the gap.'),
	suffix: z.string().optional().describe('Code after the gap.'),
	temperature: z.number().min(0).max(1.5).optional(),
	top_p: z.number().max(1).optional(),
	max_tokens: z.number().int().min(0).optional(),
	min_tokens: z.number().int().min(0).optional(),
	stop: StopSchema.optional(),
	random_seed: z.number().int().min(0).optional(),
	metadata: MetadataSchema.optional(),
	prompt_cache_key: z.string().optional(),
});

const AssistantOutputMessageSchema = z
	.object({
		role: z.string().nullish(),
		// unknown: chunk objects (text, thinking, reference…) as Mistral returns them.
		content: z.union([z.string(), z.array(z.unknown())]).nullish(),
		tool_calls: z.array(ToolCallSchema).nullish(),
		prefix: z.boolean().nullish(),
	})
	.loose();

const CompletionResponseSchema = z
	.object({
		id: z.string(),
		object: z.string().nullish(),
		model: z.string(),
		created: z.number().int().nullish(),
		usage: UsageSchema.nullish(),
		choices: z.array(
			z
				.object({
					index: z.number().int(),
					message: AssistantOutputMessageSchema.nullish(),
					finish_reason: z
						.string()
						.nullish()
						.describe('stop, length, model_length, error or tool_calls.'),
				})
				.loose(),
		),
	})
	.loose();

// ── Embeddings, classifiers, OCR ────────────────────────────────────────────

const TextInputSchema = z.union([
	z.string().min(1),
	z.array(z.string().min(1)).min(1),
]);

const EmbeddingsCreateInputSchema = z.object({
	model: ModelSchema.describe('An embedding model, for example mistral-embed.'),
	input: TextInputSchema.describe('One text or a list of texts.'),
	output_dimension: z.number().int().min(1).optional(),
	output_dtype: z
		.enum(['float', 'int8', 'uint8', 'binary', 'ubinary'])
		.optional(),
	encoding_format: z.enum(['float', 'base64']).optional(),
	metadata: MetadataSchema.optional(),
});

const EmbeddingsCreateResponseSchema = z
	.object({
		id: z.string().nullish(),
		object: z.string().nullish(),
		model: z.string().nullish(),
		usage: UsageSchema.nullish(),
		data: z.array(
			z
				.object({
					object: z.string().nullish(),
					// A string when encoding_format is base64.
					embedding: z.union([z.array(z.number()), z.string()]).nullish(),
					index: z.number().int().nullish(),
				})
				.loose(),
		),
	})
	.loose();

const ClassifyTextInputSchema = z.object({
	model: ModelSchema.describe(
		'A moderation or classifier model, for example mistral-moderation-latest.',
	),
	input: TextInputSchema.describe('One text or a list of texts.'),
	metadata: MetadataSchema.optional(),
});

const ModerateChatInputSchema = z.object({
	model: ModelSchema.describe(
		'A moderation model, for example mistral-moderation-latest.',
	),
	input: z
		.union([MessagesSchema, z.array(MessagesSchema).min(1)])
		.describe('One conversation, or a list of conversations.'),
});

const ClassifyChatInputSchema = z.object({
	model: ModelSchema.describe('A fine-tuned classifier model id.'),
	input: z
		.union([
			z.object({ messages: MessagesSchema }),
			z.array(z.object({ messages: MessagesSchema })).min(1),
		])
		.describe('{ messages } or a list of them.'),
});

const ModerationResponseSchema = z
	.object({
		id: z.string(),
		model: z.string(),
		results: z.array(
			z
				.object({
					categories: z.record(z.string(), z.boolean()).nullish(),
					category_scores: z.record(z.string(), z.number()).nullish(),
				})
				.loose(),
		),
	})
	.loose();

const ClassificationResponseSchema = z
	.object({
		id: z.string(),
		model: z.string(),
		results: z.array(
			z.record(
				z.string(),
				z.object({ scores: z.record(z.string(), z.number()) }).loose(),
			),
		),
	})
	.loose();

const OcrDocumentSchema = z.discriminatedUnion('type', [
	DocumentUrlChunkSchema,
	ImageUrlChunkSchema,
	FileChunkSchema,
]);

const OcrProcessInputSchema = z.object({
	model: ModelSchema.describe('An OCR model, for example mistral-ocr-latest.'),
	document: OcrDocumentSchema.describe(
		'{ type: "document_url", document_url } for a PDF, { type: "image_url", image_url } for an image, or { type: "file", file_id } for an uploaded file.',
	),
	pages: z
		.union([z.string(), z.array(z.number().int().min(0))])
		.optional()
		.describe('Pages to read, 0-based, for example [0, 1] or "0-3".'),
	include_image_base64: z.boolean().optional(),
	image_limit: z.number().int().optional(),
	image_min_size: z.number().int().optional(),
	bbox_annotation_format: ResponseFormatSchema.optional(),
	document_annotation_format: ResponseFormatSchema.optional(),
	document_annotation_prompt: z.string().optional(),
	table_format: z.enum(['markdown', 'html']).optional(),
	extract_header: z.boolean().optional(),
	extract_footer: z.boolean().optional(),
	include_blocks: z.boolean().optional(),
	confidence_scores_granularity: z.enum(['word', 'page', 'block']).optional(),
});

const OcrProcessResponseSchema = z
	.object({
		model: z.string(),
		pages: z.array(
			z
				.object({
					index: z.number().int(),
					markdown: z.string(),
					images: z
						.array(
							z
								.object({
									id: z.string(),
									image_base64: z.string().nullish(),
									image_annotation: z.string().nullish(),
								})
								.loose(),
						)
						.nullish(),
					header: z.string().nullish(),
					footer: z.string().nullish(),
					dimensions: z
						.object({
							dpi: z.number().int(),
							height: z.number().int(),
							width: z.number().int(),
						})
						.loose()
						.nullish(),
				})
				.loose(),
		),
		document_annotation: z.string().nullish(),
		usage_info: z
			.object({
				pages_processed: z.number().int(),
				doc_size_bytes: z.number().int().nullish(),
			})
			.loose(),
	})
	.loose();

// ── Files ───────────────────────────────────────────────────────────────────

const FilePurposeSchema = z.enum([
	'fine-tune',
	'batch',
	'ocr',
	'agentic_safety',
]);

const FileIdSchema = z
	.string()
	.min(1)
	.describe('File id (uuid), from files.upload or files.list.');

const Base64Schema = z
	.string()
	.min(1)
	.describe('File content, base64 (a data: URL prefix is accepted).');

const FileObjectShape = {
	id: z.string(),
	object: z.string(),
	bytes: z.number().int(),
	created_at: z.number().int(),
	filename: z.string(),
	// Strings, not enums: a purpose or source Mistral adds must not fail a read.
	purpose: z.string(),
	sample_type: z.string().nullish(),
	num_lines: z.number().int().nullish(),
	mimetype: z.string().nullish(),
	source: z.string().nullish(),
	signature: z.string().nullish(),
	expires_at: z.number().int().nullish(),
	visibility: z.string().nullish(),
};

const FileObjectSchema = z.object(FileObjectShape).loose();

const FilesListInputSchema = z.object({
	page: z.number().int().min(0).optional(),
	page_size: z.number().int().min(1).optional(),
	include_total: z.boolean().optional(),
	purpose: FilePurposeSchema.optional(),
	search: z.string().optional(),
	sample_type: z
		.array(
			z.enum([
				'pretrain',
				'instruct',
				'batch_request',
				'batch_result',
				'batch_error',
			]),
		)
		.optional(),
	source: z.array(z.enum(['upload', 'repository', 'mistral'])).optional(),
	mimetypes: z.array(z.string()).optional(),
});

const FilesListResponseSchema = z
	.object({
		data: z.array(FileObjectSchema),
		object: z.string(),
		total: z.number().int().nullish(),
	})
	.loose();

const FilesUploadInputSchema = z.object({
	filename: z
		.string()
		.min(1)
		.describe('Name to store the file under, for example requests.jsonl.'),
	content_base64: Base64Schema,
	purpose: FilePurposeSchema.optional().describe(
		'fine-tune, batch (a .jsonl of requests for batch.create), ocr or agentic_safety.',
	),
	visibility: z.enum(['workspace', 'user']).optional(),
	expiry: z
		.number()
		.int()
		.optional()
		.describe('Hours until Mistral deletes the file.'),
});

const FileIdInputSchema = z.object({ file_id: FileIdSchema });

const FilesGetResponseSchema = z
	.object({ ...FileObjectShape, deleted: z.boolean().nullish() })
	.loose();

const DeletedSchema = z
	.object({
		id: z.string(),
		object: z.string().nullish(),
		deleted: z.boolean().nullish(),
	})
	.loose();

const FilesGetSignedUrlInputSchema = z.object({
	file_id: FileIdSchema,
	expiry: z
		.number()
		.int()
		.min(1)
		.optional()
		.describe('Hours the URL stays valid (Mistral default 24).'),
});

const FilesGetSignedUrlResponseSchema = z.object({ url: z.string() }).loose();

// ── Models ──────────────────────────────────────────────────────────────────

const ModelIdSchema = z
	.string()
	.min(1)
	.describe(
		'Model id, for example mistral-small-latest or ft:… for a fine-tune.',
	);

const ModelCardSchema = z
	.object({
		id: z.string(),
		object: z.string().nullish(),
		created: z.number().int().nullish(),
		owned_by: z.string().nullish(),
		// unknown: capability flags (completion_chat, vision, ocr…); new ones appear often.
		capabilities: z.record(z.string(), z.unknown()).nullish(),
		name: z.string().nullish(),
		description: z.string().nullish(),
		max_context_length: z.number().int().nullish(),
		aliases: z.array(z.string()).nullish(),
		deprecation: z.string().nullish(),
		deprecation_replacement_model: z.string().nullish(),
		default_model_temperature: z.number().nullish(),
		type: z.string().nullish().describe('base or fine-tuned.'),
		job: z.string().nullish(),
		root: z.string().nullish(),
		archived: z.boolean().nullish(),
	})
	.loose();

const ModelsListInputSchema = z.object({
	provider: z.string().optional(),
	model: z.string().optional(),
});

const ModelsListResponseSchema = z
	.object({
		object: z.string().nullish(),
		data: z.array(ModelCardSchema).nullish(),
	})
	.loose();

const ModelIdInputSchema = z.object({ model_id: ModelIdSchema });

const ModelsUpdateInputSchema = z.object({
	model_id: ModelIdSchema,
	name: z.string().optional(),
	description: z.string().optional(),
});

const FineTunedModelSchema = z
	.object({
		id: z.string(),
		object: z.string().nullish(),
		created: z.number().int().nullish(),
		owned_by: z.string().nullish(),
		workspace_id: z.string().nullish(),
		root: z.string().nullish(),
		root_version: z.string().nullish(),
		archived: z.boolean().nullish(),
		name: z.string().nullish(),
		description: z.string().nullish(),
		// unknown: capability flags (completion_chat, vision, ocr…); new ones appear often.
		capabilities: z.record(z.string(), z.unknown()).nullish(),
		max_context_length: z.number().int().nullish(),
		aliases: z.array(z.string()).nullish(),
		job: z.string().nullish(),
		model_type: z.string().nullish().describe('completion or classifier.'),
	})
	.loose();

const ArchiveResponseSchema = z
	.object({
		id: z.string(),
		object: z.string().nullish(),
		archived: z.boolean().nullish(),
	})
	.loose();

// ── Batch ───────────────────────────────────────────────────────────────────

/** Every status a batch job can report, in the spec's order. */
export const BATCH_JOB_STATUSES = [
	'QUEUED',
	'RUNNING',
	'SUCCESS',
	'FAILED',
	'TIMEOUT_EXCEEDED',
	'CANCELLATION_REQUESTED',
	'CANCELLED',
] as const;

const BatchJobStatusSchema = z.enum(BATCH_JOB_STATUSES);

const BatchEndpointSchema = z.enum([
	'/v1/chat/completions',
	'/v1/embeddings',
	'/v1/fim/completions',
	'/v1/moderations',
	'/v1/chat/moderations',
	'/v1/ocr',
	'/v1/classifications',
	'/v1/chat/classifications',
	'/v1/conversations',
	'/v1/audio/transcriptions',
]);

const BatchJobIdSchema = z
	.string()
	.min(1)
	.describe('Batch job id (uuid), from batch.create or batch.list.');

const BatchJobSchema = z
	.object({
		id: z.string(),
		object: z.string().nullish(),
		input_files: z.array(z.string()),
		// unknown: the caller's own metadata, echoed back.
		metadata: z.record(z.string(), z.unknown()).nullish(),
		endpoint: z.string(),
		model: z.string().nullish(),
		agent_id: z.string().nullish(),
		output_file: z
			.string()
			.nullish()
			.describe('File id of the results; read it with files.getSignedUrl.'),
		error_file: z.string().nullish(),
		errors: z.array(
			z
				.object({ message: z.string(), count: z.number().int().nullish() })
				.loose(),
		),
		// unknown: inline results, each shaped like the endpoint's own response.
		outputs: z.array(z.record(z.string(), z.unknown())).nullish(),
		status: BatchJobStatusSchema,
		created_at: z.number().int(),
		total_requests: z.number().int(),
		completed_requests: z.number().int(),
		succeeded_requests: z.number().int(),
		failed_requests: z.number().int(),
		started_at: z.number().int().nullish(),
		completed_at: z.number().int().nullish(),
	})
	.loose();

const BatchListInputSchema = z.object({
	page: z.number().int().min(0).optional(),
	page_size: z.number().int().min(1).optional(),
	model: z.string().optional(),
	agent_id: z.string().optional(),
	created_after: z
		.string()
		.optional()
		.describe('ISO 8601 date-time, for example 2026-11-01T00:00:00Z.'),
	created_by_me: z.boolean().optional(),
	status: z.array(BatchJobStatusSchema).optional(),
	order_by: z.enum(['created', '-created']).optional(),
});

const BatchListResponseSchema = z
	.object({
		data: z.array(BatchJobSchema).nullish(),
		object: z.string().nullish(),
		total: z.number().int(),
	})
	.loose();

const BatchCreateInputSchema = z
	.object({
		endpoint: BatchEndpointSchema.describe(
			'The API every request in the batch calls.',
		),
		input_files: z
			.array(z.string().min(1))
			.min(1)
			.optional()
			.describe(
				'Ids of .jsonl files uploaded with purpose batch, one request per line.',
			),
		requests: z
			.array(
				z.object({
					custom_id: z.string().optional(),
					// unknown: the request body of `endpoint`, for example { messages }.
					body: z.record(z.string(), z.unknown()),
				}),
			)
			.min(1)
			.optional()
			.describe('Requests inline, instead of input_files.'),
		model: z.string().optional(),
		agent_id: z.string().optional(),
		metadata: z.record(z.string(), z.string()).optional(),
		timeout_hours: z.number().int().min(1).max(168).optional(),
	})
	.refine((v) => (v.input_files ? 1 : 0) + (v.requests ? 1 : 0) === 1, {
		message: 'Pass exactly one of input_files or requests.',
		path: ['input_files'],
	});

const BatchGetInputSchema = z.object({
	job_id: BatchJobIdSchema,
	inline: z
		.boolean()
		.optional()
		.describe('Include the results in outputs (small batches only).'),
});

const BatchJobIdInputSchema = z.object({ job_id: BatchJobIdSchema });

// ── Responses ───────────────────────────────────────────────────────────────

const ResponsesInputSchema = z
	.union([
		z.string().min(1),
		// unknown: response items (message, function_call, function_call_output,
		// reasoning) each carry their own fields; Mistral validates them.
		z
			.array(z.record(z.string(), z.unknown()))
			.min(1),
	])
	.describe(
		'A prompt, or a list of items such as { role: "user", content: "…" }.',
	);

const ResponsesToolSchema = z
	.object({
		type: z.enum(['function', 'namespace']),
		name: z.string().min(1),
		description: z.string().optional(),
		parameters: JsonSchemaObject.optional(),
		strict: z.boolean().optional(),
		// unknown: a namespace's own function tools.
		tools: z.array(z.record(z.string(), z.unknown())).optional(),
	})
	.loose();

const ResponsesShape = {
	model: ModelSchema,
	input: ResponsesInputSchema,
	instructions: z.string().optional(),
	tools: z.array(ResponsesToolSchema).optional(),
	tool_choice: z
		.union([
			z.enum(['none', 'auto', 'required']),
			z.object({ type: z.literal('function'), name: z.string() }),
		])
		.optional(),
	parallel_tool_calls: z.boolean().optional(),
	reasoning: z.object({ effort: ReasoningEffortSchema.optional() }).optional(),
	text: z
		.object({
			// unknown: text, json_object or json_schema format config.
			format: z.record(z.string(), z.unknown()).optional(),
			verbosity: z.enum(['low', 'medium', 'high']).optional(),
		})
		.optional(),
};

const ResponsesCreateInputSchema = z.object({
	...ResponsesShape,
	max_output_tokens: z.number().int().optional(),
	temperature: z.number().min(0).max(1.5).optional(),
	top_p: z.number().max(1).optional(),
	metadata: z.record(z.string(), z.string()).optional(),
	max_tool_calls: z.number().int().optional(),
	prompt_cache_key: z.string().optional(),
});

const ResponsesCreateResponseSchema = z
	.object({
		id: z.string(),
		object: z.string(),
		created_at: z.number(),
		model: z.string(),
		status: z.string().nullish(),
		// unknown: output items (message, function_call, reasoning) by type.
		output: z.array(z.record(z.string(), z.unknown())),
		error: z
			.object({ code: z.string(), message: z.string() })
			.loose()
			.nullish(),
		incomplete_details: z
			.object({ reason: z.string().nullish() })
			.loose()
			.nullish(),
		usage: z
			.object({
				input_tokens: z.number().int(),
				output_tokens: z.number().int(),
				total_tokens: z.number().int(),
			})
			.loose()
			.nullish(),
	})
	.loose();

const ResponsesCountInputTokensResponseSchema = z
	.object({ input_tokens: z.number().int(), object: z.string() })
	.loose();

// ── Agents (beta) ───────────────────────────────────────────────────────────

const AgentIdSchema = z
	.string()
	.min(1)
	.describe('Agent id, from agents.create or agents.list.');

const CompletionArgsSchema = z.object({
	stop: StopSchema.optional(),
	presence_penalty: z.number().min(-2).max(2).optional(),
	frequency_penalty: z.number().min(-2).max(2).optional(),
	temperature: z.number().min(0).max(1).optional(),
	top_p: z.number().min(0).max(1).optional(),
	max_tokens: z.number().int().min(0).optional(),
	random_seed: z.number().int().min(0).optional(),
	prediction: PredictionSchema.optional(),
	response_format: ResponseFormatSchema.optional(),
	tool_choice: z.enum(['auto', 'none', 'any', 'required']).optional(),
	reasoning_effort: ReasoningEffortSchema.optional(),
});

const AgentShape = {
	instructions: z.string().optional(),
	tools: z.array(AgentToolSchema).optional(),
	completion_args: CompletionArgsSchema.optional(),
	guardrails: z.array(GuardrailSchema).optional(),
	description: z.string().optional(),
	handoffs: z
		.array(z.string())
		.optional()
		.describe('Ids of agents this one can hand the conversation to.'),
	metadata: MetadataSchema.optional(),
	version_message: z.string().optional(),
};

const AgentsCreateInputSchema = z.object({
	model: ModelSchema,
	name: z.string().min(1),
	...AgentShape,
});

const AgentsUpdateInputSchema = z.object({
	agent_id: AgentIdSchema,
	model: z.string().min(1).optional(),
	name: z.string().min(1).optional(),
	deployment_chat: z.boolean().optional(),
	...AgentShape,
});

const AgentSchema = z
	.object({
		id: z.string(),
		object: z.string().nullish(),
		name: z.string(),
		model: z.string(),
		description: z.string().nullish(),
		instructions: z.string().nullish(),
		// unknown: tool configs by type (function, web_search, connector…).
		tools: z.array(z.record(z.string(), z.unknown())).nullish(),
		// unknown: sampling settings, echoed back as stored.
		completion_args: z.record(z.string(), z.unknown()).nullish(),
		handoffs: z.array(z.string()).nullish(),
		// unknown: the caller's own metadata, echoed back.
		metadata: z.record(z.string(), z.unknown()).nullish(),
		version: z.number().int(),
		versions: z.array(z.number().int()).nullish(),
		version_message: z.string().nullish(),
		owner_id: z.string().nullish(),
		created_at: z.string(),
		updated_at: z.string(),
		deployment_chat: z.boolean().nullish(),
		source: z.string().nullish(),
	})
	.loose();

const AgentsListInputSchema = z.object({
	page_size: PageSizeSchema(1000),
	page_token: PageTokenSchema,
	name: z.string().optional(),
	search: z.string().optional(),
	id: z.string().optional(),
	deployment_chat: z.boolean().optional(),
	sources: z
		.array(z.enum(['api', 'playground', 'agent_builder_v1']))
		.optional(),
	metadata: MetadataSchema.optional().describe(
		'Only agents whose metadata has these key/values.',
	),
});

const AgentsListResponseSchema = z
	.object({
		object: z.string().nullish(),
		data: z.array(AgentSchema),
		next_page_token: z.string().nullish(),
	})
	.loose();

const AgentsGetInputSchema = z.object({
	agent_id: AgentIdSchema,
	agent_version: z
		.union([z.number().int(), z.string().min(1)])
		.optional()
		.describe('A version number or an alias; the current version if omitted.'),
});

const AgentIdInputSchema = z.object({ agent_id: AgentIdSchema });

const AgentsSetVersionInputSchema = z.object({
	agent_id: AgentIdSchema,
	version: z.number().int().describe('The version to make current.'),
});

const AgentsListVersionsInputSchema = z.object({
	agent_id: AgentIdSchema,
	page: z.number().int().min(0).optional(),
	page_size: PageSizeSchema(100),
});

const AgentsGetVersionInputSchema = z.object({
	agent_id: AgentIdSchema,
	version: z
		.string()
		.min(1)
		.describe('A version number or an alias, as a string.'),
});

const AgentAliasSchema = z
	.object({
		alias: z.string(),
		version: z.number().int(),
		created_at: z.string(),
		updated_at: z.string(),
	})
	.loose();

const AgentsUpsertAliasInputSchema = z.object({
	agent_id: AgentIdSchema,
	alias: z.string().min(1).describe('Alias name, for example production.'),
	version: z.number().int().describe('The version the alias points to.'),
});

const AgentsDeleteAliasInputSchema = z.object({
	agent_id: AgentIdSchema,
	alias: z.string().min(1),
});

/** What an operation returns when Mistral answers 204 No Content. */
const NoContentSchema = z.object({ success: z.literal(true) });

// ── Audio ───────────────────────────────────────────────────────────────────

const AudioSpeechInputSchema = z.object({
	input: z.string().min(1).describe('Text to speak.'),
	model: z.string().optional(),
	voice_id: z.string().optional().describe('A voice from voices.list.'),
	ref_audio: z
		.string()
		.optional()
		.describe('Base64 reference audio to clone, instead of voice_id.'),
	response_format: z.enum(['pcm', 'wav', 'mp3', 'flac', 'opus']).optional(),
	expressiveness: z.number().min(1).max(5).optional(),
	metadata: MetadataSchema.optional(),
});

const AudioSpeechResponseSchema = z
	.object({
		audio_data: z
			.string()
			.describe('The audio, base64, in response_format (mp3 by default).'),
	})
	.loose();

const AudioTranscribeInputSchema = z
	.object({
		model: ModelSchema.describe(
			'A transcription model, for example voxtral-mini-latest.',
		),
		content_base64: Base64Schema.optional(),
		filename: z
			.string()
			.min(1)
			.optional()
			.describe('Name of the audio file, with content_base64.'),
		file_url: z.string().min(1).describe('Public URL of the audio.').optional(),
		file_id: z.string().optional().describe('An uploaded file id.'),
		language: z.string().optional(),
		temperature: z.number().optional(),
		diarize: z.boolean().optional(),
		context_bias: z.array(z.string()).optional(),
		timestamp_granularities: z.array(z.enum(['segment', 'word'])).optional(),
	})
	.refine(
		(v) =>
			(v.content_base64 ? 1 : 0) +
				(v.file_url ? 1 : 0) +
				(v.file_id ? 1 : 0) ===
			1,
		{
			message: 'Pass exactly one of content_base64, file_url or file_id.',
			path: ['content_base64'],
		},
	)
	.refine((v) => !v.content_base64 || v.filename, {
		message: 'filename is required with content_base64.',
		path: ['filename'],
	});

const AudioTranscribeResponseSchema = z
	.object({
		model: z.string(),
		text: z.string(),
		language: z.string().nullish(),
		segments: z
			.array(
				z
					.object({
						text: z.string(),
						start: z.number().nullish(),
						end: z.number().nullish(),
						speaker_id: z.string().nullish(),
					})
					.loose(),
			)
			.nullish(),
		usage: UsageSchema.nullish(),
	})
	.loose();

const VoiceIdSchema = z.string().min(1).describe('Voice id, from voices.list.');

const VoiceGenderSchema = z.enum(['female', 'male', 'neutral']);

const VoiceSchema = z
	.object({
		id: z.string(),
		name: z.string(),
		slug: z.string().nullish(),
		languages: z.array(z.string()).nullish(),
		gender: z.string().nullish(),
		age: z.number().int().nullish(),
		tags: z.array(z.string()).nullish(),
		color: z.string().nullish(),
		description: z.string().nullish(),
		retention_notice: z.number().int().nullish(),
		created_at: z.string(),
		user_id: z.string().nullish(),
		kind: z.string().nullish(),
		type: z.string().describe('preset or custom.'),
	})
	.loose();

const VoicesListInputSchema = z.object({
	page_size: PageSizeSchema(100),
	page_token: PageTokenSchema,
	type: z.enum(['all', 'custom', 'preset']).optional(),
	gender: z.array(VoiceGenderSchema).optional(),
	language: z.array(z.string()).optional(),
	query: z.string().optional(),
	kind: z.enum(['ivc', 'pvc']).optional(),
});

const VoicesListResponseSchema = z
	.object({
		data: z.array(VoiceSchema),
		next_page_token: z.string().nullish(),
	})
	.loose();

const VoiceIdInputSchema = z.object({ voice_id: VoiceIdSchema });

const VoiceFieldsShape = {
	languages: z.array(z.string()).optional(),
	gender: VoiceGenderSchema.optional(),
	age: z.number().int().min(0).max(120).optional(),
	tags: z.array(z.string()).optional(),
	description: z.string().optional(),
	retention_notice: z.number().int().min(1).max(365).optional(),
};

const VoicesCreateInputSchema = z.object({
	name: z.string().min(1),
	...VoiceFieldsShape,
	color: z.string().optional(),
	sample_audio: z
		.string()
		.optional()
		.describe('Base64 audio sample of the voice to clone.'),
	sample_filename: z.string().optional(),
});

const VoicesUpdateInputSchema = z.object({
	voice_id: VoiceIdSchema,
	name: z.string().min(1).optional(),
	...VoiceFieldsShape,
});

// ── Audio agents ────────────────────────────────────────────────────────────

const AudioAgentIdSchema = z
	.string()
	.min(1)
	.describe('Audio agent id (uuid), from audioAgents.list.');

const AudioAgentConfigurationSchema = z.object({
	llm: z.object({ model: z.string().optional() }).optional(),
	tts: z
		.object({
			model: z.string().optional(),
			voice_id: z.string().optional(),
			expressiveness: z.number().min(1).max(5).optional(),
		})
		.optional(),
	// unknown: speech-to-text settings (model, language, turn detection…).
	stt: z.record(z.string(), z.unknown()).optional(),
	// unknown: turn-taking settings (interruptions, inactivity).
	turn: z.record(z.string(), z.unknown()).optional(),
	instructions: z.string().optional(),
	// unknown: tool configs by type (web_search, function, transfer_call…).
	tools: z.array(z.record(z.string(), z.unknown())).optional(),
	welcome_message: z.string().optional(),
});

const AudioAgentWriteShape = {
	name: z.string().min(1),
	description: z.string().optional(),
	configuration: AudioAgentConfigurationSchema,
};

const AudioAgentSchema = z
	.object({
		id: z.string(),
		owner_id: z.string(),
		name: z.string().nullish(),
		description: z.string().nullish(),
		created_at: z.string(),
		updated_at: z.string(),
		version: z.number().int().nullish(),
		// unknown: the stored configuration, echoed back.
		configuration: z.record(z.string(), z.unknown()).nullish(),
	})
	.loose();

const AudioAgentListResponseSchema = z
	.object({
		data: z.array(AudioAgentSchema),
		next_page_token: z.string().nullish(),
	})
	.loose();

const AudioAgentsListInputSchema = z.object({
	page_size: PageSizeSchema(100),
	page_token: PageTokenSchema,
	search: z.string().optional(),
});

const AudioAgentsGetInputSchema = z.object({
	agent_id: AudioAgentIdSchema,
	version: z.number().int().min(1).optional(),
});

const AudioAgentIdInputSchema = z.object({ agent_id: AudioAgentIdSchema });

const AudioAgentsUpdateInputSchema = z.object({
	agent_id: AudioAgentIdSchema,
	...AudioAgentWriteShape,
});

const AudioAgentPageInputSchema = z.object({
	agent_id: AudioAgentIdSchema,
	page_size: PageSizeSchema(100),
	page_token: PageTokenSchema,
});

const AudioAgentSessionsResponseSchema = z
	.object({
		data: z.array(
			z
				.object({
					id: z.string(),
					agent_id: z.string(),
					started_at: z.string().nullish(),
					duration: z.number().int().nullish(),
					phone_number_id: z.string().nullish(),
				})
				.loose(),
		),
		next_page_token: z.string().nullish(),
	})
	.loose();

// ── Maps ────────────────────────────────────────────────────────────────────

export const MistralAiEndpointInputSchemas = {
	chatComplete: ChatCompleteInputSchema,
	fimComplete: FimCompleteInputSchema,
	agentsComplete: AgentsCompleteInputSchema,
	embeddingsCreate: EmbeddingsCreateInputSchema,
	classifiersModerate: ClassifyTextInputSchema,
	classifiersModerateChat: ModerateChatInputSchema,
	classifiersClassify: ClassifyTextInputSchema,
	classifiersClassifyChat: ClassifyChatInputSchema,
	ocrProcess: OcrProcessInputSchema,
	audioSpeech: AudioSpeechInputSchema,
	audioTranscribe: AudioTranscribeInputSchema,
	voicesList: VoicesListInputSchema,
	voicesGet: VoiceIdInputSchema,
	voicesCreate: VoicesCreateInputSchema,
	voicesUpdate: VoicesUpdateInputSchema,
	voicesDelete: VoiceIdInputSchema,
	audioAgentsList: AudioAgentsListInputSchema,
	audioAgentsGet: AudioAgentsGetInputSchema,
	audioAgentsCreate: z.object(AudioAgentWriteShape),
	audioAgentsUpdate: AudioAgentsUpdateInputSchema,
	audioAgentsDelete: AudioAgentIdInputSchema,
	audioAgentsListVersions: AudioAgentPageInputSchema,
	audioAgentsListSessions: AudioAgentPageInputSchema,
	modelsList: ModelsListInputSchema,
	modelsGet: ModelIdInputSchema,
	modelsDelete: ModelIdInputSchema,
	modelsUpdate: ModelsUpdateInputSchema,
	modelsArchive: ModelIdInputSchema,
	modelsUnarchive: ModelIdInputSchema,
	filesList: FilesListInputSchema,
	filesUpload: FilesUploadInputSchema,
	filesGet: FileIdInputSchema,
	filesDelete: FileIdInputSchema,
	filesGetSignedUrl: FilesGetSignedUrlInputSchema,
	batchList: BatchListInputSchema,
	batchCreate: BatchCreateInputSchema,
	batchGet: BatchGetInputSchema,
	batchDelete: BatchJobIdInputSchema,
	batchCancel: BatchJobIdInputSchema,
	responsesCreate: ResponsesCreateInputSchema,
	responsesCountInputTokens: z.object(ResponsesShape),
	agentsCreate: AgentsCreateInputSchema,
	agentsList: AgentsListInputSchema,
	agentsGet: AgentsGetInputSchema,
	agentsUpdate: AgentsUpdateInputSchema,
	agentsDelete: AgentIdInputSchema,
	agentsSetVersion: AgentsSetVersionInputSchema,
	agentsListVersions: AgentsListVersionsInputSchema,
	agentsGetVersion: AgentsGetVersionInputSchema,
	agentsListAliases: AgentIdInputSchema,
	agentsUpsertAlias: AgentsUpsertAliasInputSchema,
	agentsDeleteAlias: AgentsDeleteAliasInputSchema,
} as const;

export const MistralAiEndpointOutputSchemas = {
	chatComplete: CompletionResponseSchema,
	fimComplete: CompletionResponseSchema,
	agentsComplete: CompletionResponseSchema,
	embeddingsCreate: EmbeddingsCreateResponseSchema,
	classifiersModerate: ModerationResponseSchema,
	classifiersModerateChat: ModerationResponseSchema,
	classifiersClassify: ClassificationResponseSchema,
	classifiersClassifyChat: ClassificationResponseSchema,
	ocrProcess: OcrProcessResponseSchema,
	audioSpeech: AudioSpeechResponseSchema,
	audioTranscribe: AudioTranscribeResponseSchema,
	voicesList: VoicesListResponseSchema,
	voicesGet: VoiceSchema,
	voicesCreate: VoiceSchema,
	voicesUpdate: VoiceSchema,
	voicesDelete: VoiceSchema,
	audioAgentsList: AudioAgentListResponseSchema,
	audioAgentsGet: AudioAgentSchema,
	audioAgentsCreate: AudioAgentSchema,
	audioAgentsUpdate: AudioAgentSchema,
	audioAgentsDelete: NoContentSchema,
	audioAgentsListVersions: AudioAgentListResponseSchema,
	audioAgentsListSessions: AudioAgentSessionsResponseSchema,
	modelsList: ModelsListResponseSchema,
	modelsGet: ModelCardSchema,
	modelsDelete: DeletedSchema,
	modelsUpdate: FineTunedModelSchema,
	modelsArchive: ArchiveResponseSchema,
	modelsUnarchive: ArchiveResponseSchema,
	filesList: FilesListResponseSchema,
	filesUpload: FileObjectSchema,
	filesGet: FilesGetResponseSchema,
	filesDelete: DeletedSchema,
	filesGetSignedUrl: FilesGetSignedUrlResponseSchema,
	batchList: BatchListResponseSchema,
	batchCreate: BatchJobSchema,
	batchGet: BatchJobSchema,
	batchDelete: DeletedSchema,
	batchCancel: BatchJobSchema,
	responsesCreate: ResponsesCreateResponseSchema,
	responsesCountInputTokens: ResponsesCountInputTokensResponseSchema,
	agentsCreate: AgentSchema,
	agentsList: AgentsListResponseSchema,
	agentsGet: AgentSchema,
	agentsUpdate: AgentSchema,
	agentsDelete: NoContentSchema,
	agentsSetVersion: AgentSchema,
	agentsListVersions: z.array(AgentSchema),
	agentsGetVersion: AgentSchema,
	agentsListAliases: z.array(AgentAliasSchema),
	agentsUpsertAlias: AgentAliasSchema,
	agentsDeleteAlias: NoContentSchema,
} as const;

type InputSchemas = typeof MistralAiEndpointInputSchemas;
type OutputSchemas = typeof MistralAiEndpointOutputSchemas;

export type MistralAiEndpointInputs = {
	[K in keyof InputSchemas]: z.input<InputSchemas[K]>;
};

export type MistralAiEndpointOutputs = {
	[K in keyof OutputSchemas]: z.output<OutputSchemas[K]>;
};

export type MistralAiOperation = keyof InputSchemas;
