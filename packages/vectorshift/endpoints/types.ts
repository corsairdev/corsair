import { z } from 'zod';

// Inputs use VectorShift's own parameter names. Outputs are `.loose()` and
// their documented fields nullish.
// Reference: https://docs.vectorshift.ai/api-reference/overview
//
// Every response is `{ status: 'success' | 'failed', ... }`, so a call that
// returns 200 can still have failed. The plugin treats only `success` as a
// result and raises the `failed` variant as an error, since a silent failure
// would otherwise look like an empty success.

/** Outputs are free-form: a pipeline may return any shape it likes. */
const OutputsSchema = z
	.record(z.string(), z.unknown())
	.describe(
		'Output name to value. A value may be a string, number, boolean, list, map or file.',
	);

const RunStatusSchema = z.enum(['success', 'failed']);

// ── pipelines ─────────────────────────────────────────────────────────────

const PipelinesListInputSchema = z.object({
	include_shared: z
		.boolean()
		.optional()
		.describe('Also list pipelines shared with you.'),
	verbose: z
		.boolean()
		.optional()
		.describe('Also return the full pipeline objects, not only their ids.'),
});

export type PipelinesListInput = z.infer<typeof PipelinesListInputSchema>;

/**
 * Without `verbose` only `object_ids` comes back; with it, `objects` holds the
 * full pipelines. Both are reported so a caller can tell which it got.
 */
const PipelinesListResponseSchema = z
	.object({
		status: RunStatusSchema,
		object_ids: z.array(z.string()).nullish(),
		objects: z.array(z.record(z.string(), z.unknown())).nullish(),
	})
	.loose();

export type PipelinesListResponse = z.infer<typeof PipelinesListResponseSchema>;

const PipelinesRunInputSchema = z.object({
	id: z.string().min(1).describe('The pipeline id.'),
	inputs: OutputsSchema.optional().describe(
		'Input name to value, matching the pipeline input nodes.',
	),
});

export type PipelinesRunInput = z.infer<typeof PipelinesRunInputSchema>;

/** A run answers its `run_id` and every output node value. */
const PipelinesRunResponseSchema = z
	.object({
		status: RunStatusSchema,
		run_id: z.string().nullish(),
		outputs: z.record(z.string(), z.unknown()).nullish(),
	})
	.loose();

export type PipelinesRunResponse = z.infer<typeof PipelinesRunResponseSchema>;

const PipelinesBulkRunInputSchema = z.object({
	id: z.string().min(1).describe('The pipeline id to run repeatedly.'),
	runs: z
		.array(
			z
				.object({
					inputs: OutputsSchema.optional(),
				})
				.loose(),
		)
		.min(1)
		.describe('One entry per run, each with its own inputs. Run in parallel.'),
});

export type PipelinesBulkRunInput = z.infer<typeof PipelinesBulkRunInputSchema>;

const PipelinesBulkRunResponseSchema = z
	.object({
		status: RunStatusSchema,
		run_outputs: z
			.array(
				z
					.object({
						run_id: z.string().nullish(),
						outputs: z.record(z.string(), z.unknown()).nullish(),
					})
					.loose(),
			)
			.nullish(),
	})
	.loose();

export type PipelinesBulkRunResponse = z.infer<
	typeof PipelinesBulkRunResponseSchema
>;

const PipelinesCreateInputSchema = z.object({
	name: z.string().min(1),
	description: z.string().optional(),
	config: z
		.record(z.string(), z.unknown())
		.describe(
			'The pipeline graph. Required by the API but its shape is defined by the builder, so it is passed through unchanged.',
		),
});

export type PipelinesCreateInput = z.infer<typeof PipelinesCreateInputSchema>;

const PipelinesCreateResponseSchema = z
	.object({
		status: RunStatusSchema,
		id: z.string().nullish(),
	})
	.loose();

export type PipelinesCreateResponse = z.infer<
	typeof PipelinesCreateResponseSchema
>;

// ── knowledge bases ───────────────────────────────────────────────────────

const KnowledgeBasesCreateInputSchema = z.object({
	name: z.string().min(1),
	description: z.string().optional(),
	file_processing_implementation: z
		.enum(['Default', 'Textract', 'Unstructured', 'LlamaParse', 'Other'])
		.optional()
		.describe('Which parser reads uploaded files.'),
	chunk_size: z.number().int().optional(),
	chunk_overlap: z.number().int().optional(),
	analyze_documents: z.boolean().optional(),
	apify_key: z
		.string()
		.optional()
		.describe('Only for the Apify-backed implementation.'),
});

export type KnowledgeBasesCreateInput = z.infer<
	typeof KnowledgeBasesCreateInputSchema
>;

const KnowledgeBasesCreateResponseSchema = z
	.object({
		status: RunStatusSchema,
		id: z.string().nullish().describe('The new knowledge base id.'),
	})
	.loose();

export type KnowledgeBasesCreateResponse = z.infer<
	typeof KnowledgeBasesCreateResponseSchema
>;

/**
 * Fetch one knowledge base by id or by name. The API accepts either, but not
 * neither, so the schema enforces that before the request.
 */
const KnowledgeBasesGetInputSchema = z
	.object({
		id: z.string().optional(),
		name: z
			.string()
			.optional()
			.describe('The knowledge base name, as an alternative to the id.'),
		username: z
			.string()
			.optional()
			.describe('Narrows a name lookup to a user. Only with `name`.'),
		org_name: z
			.string()
			.optional()
			.describe('Narrows a name lookup to an organization. Only with `name`.'),
	})
	.superRefine((value, ctx) => {
		if (value.id === undefined && value.name === undefined) {
			ctx.addIssue({
				code: 'custom',
				path: ['id'],
				message: 'A knowledge base needs an id or a name to look up.',
			});
		}
		if (value.id !== undefined && value.name !== undefined) {
			ctx.addIssue({
				code: 'custom',
				path: ['name'],
				message: 'Send either an id or a name, not both.',
			});
		}
		if (value.id !== undefined && (value.username || value.org_name)) {
			ctx.addIssue({
				code: 'custom',
				path: ['username'],
				message: 'username and org_name only apply to a name lookup.',
			});
		}
	});

export type KnowledgeBasesGetInput = z.infer<
	typeof KnowledgeBasesGetInputSchema
>;

const KnowledgeBasesGetResponseSchema = z
	.object({
		status: RunStatusSchema,
		object: z.record(z.string(), z.unknown()).nullish(),
	})
	.loose();

export type KnowledgeBasesGetResponse = z.infer<
	typeof KnowledgeBasesGetResponseSchema
>;

/**
 * Query a knowledge base.
 *
 * `config` toggles a lot of behaviour, and every field is optional, so only
 * the ones that change the answer are surfaced with descriptions; the rest are
 * accepted as a passthrough object.
 */
const KnowledgeBasesQueryInputSchema = z.object({
	id: z.string().min(1).describe('The knowledge base id.'),
	queries: z
		.array(z.string().min(1))
		.min(1)
		.describe('One or more questions, answered against the same retrieval.'),
	context: z.string().optional().describe('Extra context for the answer.'),
	search_metadata: z
		.object({
			filter: z.string().optional().describe('A metadata filter expression.'),
			opensearch_filter: z.string().optional(),
			top_k: z
				.number()
				.int()
				.optional()
				.describe('How many chunks to retrieve.'),
			group_by_key: z.string().optional(),
		})
		.loose()
		.optional(),
	config: z
		.object({
			rerank_documents: z.boolean().optional(),
			generate_metadata_filters: z.boolean().optional(),
			transform_query: z.boolean().optional(),
			answer_multi_query: z.boolean().optional(),
			expand_query: z.boolean().optional(),
			do_advanced_qa: z.boolean().optional(),
			format_context_for_llm: z.boolean().optional(),
			generate_ai_doc_summaries: z.boolean().optional(),
			retrieval_unit: z.string().optional(),
			score_cutoff: z.number().optional(),
			retrieval_config: z
				.object({
					max_documents: z.number().int().optional(),
					data_fusion_method: z.string().optional(),
				})
				.loose()
				.optional(),
			reranking_config: z
				.object({
					reranking_model: z.string().optional(),
					api_key: z.string().optional(),
					num_chunks_to_rerank: z.number().int().optional(),
				})
				.loose()
				.optional(),
			question_answering_config: z
				.object({
					qa_model: z.string().optional(),
					advanced_qa_mode: z.string().optional(),
				})
				.loose()
				.optional(),
			hybrid_search_config: z
				.object({
					alpha: z.number().optional(),
					fusion_method: z.string().optional(),
				})
				.loose()
				.optional(),
		})
		.loose()
		.optional()
		.describe('Retrieval and answering switches. Every field is optional.'),
});

export type KnowledgeBasesQueryInput = z.infer<
	typeof KnowledgeBasesQueryInputSchema
>;

/** The answer shape is defined by the retrieval config, so it passes through. */
const KnowledgeBasesQueryResponseSchema = z
	.object({
		status: RunStatusSchema,
		result: z.record(z.string(), z.unknown()).nullish(),
	})
	.loose();

export type KnowledgeBasesQueryResponse = z.infer<
	typeof KnowledgeBasesQueryResponseSchema
>;

// ── chatbots ──────────────────────────────────────────────────────────────

const VersionSchema = z
	.union([
		z.literal('latest'),
		z.object({
			major: z.number().int(),
			minor: z.number().int(),
			patch: z.number().int(),
		}),
	])
	.optional()
	.describe('`latest`, or an exact major.minor.patch. Defaults to latest.');

const ChatbotsCreateInputSchema = z.object({
	pipeline: z.object({
		id: z.string().min(1),
		version: VersionSchema,
	}),
	name: z.string().min(1),
	description: z.string(),
	deployment_options: z.record(z.string(), z.unknown()),
	access_config: z.record(z.string(), z.unknown()),
	twilio_config: z.record(z.string(), z.unknown()),
	slack_config: z.record(z.string(), z.unknown()),
	deployed: z.boolean(),
	input: z.string().describe('The pipeline input node the message is fed to.'),
	output: z
		.string()
		.describe('The pipeline output node the reply is read from.'),
});

export type ChatbotsCreateInput = z.infer<typeof ChatbotsCreateInputSchema>;

const ChatbotsCreateResponseSchema = z
	.object({
		status: RunStatusSchema,
		id: z.string().nullish(),
	})
	.loose();

export type ChatbotsCreateResponse = z.infer<
	typeof ChatbotsCreateResponseSchema
>;

/**
 * Send a message to a chatbot. Either `text` or base64 `audio`, never both —
 * the schema enforces the same rule the API documents.
 *
 * `stream` is not offered: the plugin returns parsed JSON, and a
 * server-sent-event response would have to be consumed as a stream.
 */
const ChatbotsRunInputSchema = z
	.object({
		id: z.string().min(1),
		text: z.string().min(1).optional(),
		audio: z.string().min(1).optional().describe('Base64-encoded audio.'),
		conversation_id: z
			.string()
			.optional()
			.describe('Continue an existing conversation. Omit to start one.'),
	})
	.superRefine((value, ctx) => {
		if (value.text === undefined && value.audio === undefined) {
			ctx.addIssue({
				code: 'custom',
				path: ['text'],
				message: 'A chatbot message needs text or audio.',
			});
		}
		if (value.text !== undefined && value.audio !== undefined) {
			ctx.addIssue({
				code: 'custom',
				path: ['audio'],
				message: 'Send either text or audio, not both.',
			});
		}
	});

export type ChatbotsRunInput = z.infer<typeof ChatbotsRunInputSchema>;

const ChatbotsRunResponseSchema = z
	.object({
		status: RunStatusSchema,
		conversation_id: z
			.string()
			.nullish()
			.describe('Pass this back to continue the conversation.'),
		output_message: z.string().nullish(),
		follow_up_questions: z.array(z.string()).nullish(),
	})
	.loose();

export type ChatbotsRunResponse = z.infer<typeof ChatbotsRunResponseSchema>;

// ── transformations ───────────────────────────────────────────────────────

const TransformationsCreateInputSchema = z.object({
	name: z.string().min(1),
	description: z.string(),
	function_name: z.string().min(1).describe('The Python function to call.'),
	function: z.string().min(1).describe('The function source.'),
	input_schema: z
		.record(z.string(), z.string())
		.describe('Argument name to type, for the generated signature.'),
	output_schema: z.record(z.string(), z.string()),
});

export type TransformationsCreateInput = z.infer<
	typeof TransformationsCreateInputSchema
>;

const TransformationsCreateResponseSchema = z
	.object({
		status: RunStatusSchema,
		id: z.string().nullish(),
	})
	.loose();

export type TransformationsCreateResponse = z.infer<
	typeof TransformationsCreateResponseSchema
>;

const TransformationsRunInputSchema = z.object({
	id: z.string().min(1),
	inputs: z
		.record(
			z.string(),
			z.union([
				z.string(),
				z.number(),
				z.boolean(),
				z.array(z.unknown()),
				z.record(z.string(), z.unknown()),
			]),
		)
		.describe(
			'Argument name to value, matching the transformation input schema.',
		),
});

export type TransformationsRunInput = z.infer<
	typeof TransformationsRunInputSchema
>;

const TransformationsRunResponseSchema = z
	.object({
		status: RunStatusSchema,
		result: z.record(z.string(), z.unknown()).nullish(),
	})
	.loose();

export type TransformationsRunResponse = z.infer<
	typeof TransformationsRunResponseSchema
>;

// ── Registry ──────────────────────────────────────────────────────────────

export type VectorshiftEndpointInputs = {
	pipelinesList: PipelinesListInput;
	pipelinesRun: PipelinesRunInput;
	pipelinesBulkRun: PipelinesBulkRunInput;
	pipelinesCreate: PipelinesCreateInput;
	knowledgeBasesCreate: KnowledgeBasesCreateInput;
	knowledgeBasesGet: KnowledgeBasesGetInput;
	knowledgeBasesQuery: KnowledgeBasesQueryInput;
	chatbotsCreate: ChatbotsCreateInput;
	chatbotsRun: ChatbotsRunInput;
	transformationsCreate: TransformationsCreateInput;
	transformationsRun: TransformationsRunInput;
};

export type VectorshiftEndpointOutputs = {
	pipelinesList: PipelinesListResponse;
	pipelinesRun: PipelinesRunResponse;
	pipelinesBulkRun: PipelinesBulkRunResponse;
	pipelinesCreate: PipelinesCreateResponse;
	knowledgeBasesCreate: KnowledgeBasesCreateResponse;
	knowledgeBasesGet: KnowledgeBasesGetResponse;
	knowledgeBasesQuery: KnowledgeBasesQueryResponse;
	chatbotsCreate: ChatbotsCreateResponse;
	chatbotsRun: ChatbotsRunResponse;
	transformationsCreate: TransformationsCreateResponse;
	transformationsRun: TransformationsRunResponse;
};

export const VectorshiftEndpointInputSchemas = {
	pipelinesList: PipelinesListInputSchema,
	pipelinesRun: PipelinesRunInputSchema,
	pipelinesBulkRun: PipelinesBulkRunInputSchema,
	pipelinesCreate: PipelinesCreateInputSchema,
	knowledgeBasesCreate: KnowledgeBasesCreateInputSchema,
	knowledgeBasesGet: KnowledgeBasesGetInputSchema,
	knowledgeBasesQuery: KnowledgeBasesQueryInputSchema,
	chatbotsCreate: ChatbotsCreateInputSchema,
	chatbotsRun: ChatbotsRunInputSchema,
	transformationsCreate: TransformationsCreateInputSchema,
	transformationsRun: TransformationsRunInputSchema,
} as const;

export const VectorshiftEndpointOutputSchemas = {
	pipelinesList: PipelinesListResponseSchema,
	pipelinesRun: PipelinesRunResponseSchema,
	pipelinesBulkRun: PipelinesBulkRunResponseSchema,
	pipelinesCreate: PipelinesCreateResponseSchema,
	knowledgeBasesCreate: KnowledgeBasesCreateResponseSchema,
	knowledgeBasesGet: KnowledgeBasesGetResponseSchema,
	knowledgeBasesQuery: KnowledgeBasesQueryResponseSchema,
	chatbotsCreate: ChatbotsCreateResponseSchema,
	chatbotsRun: ChatbotsRunResponseSchema,
	transformationsCreate: TransformationsCreateResponseSchema,
	transformationsRun: TransformationsRunResponseSchema,
} as const;
