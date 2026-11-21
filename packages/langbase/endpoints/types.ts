import { z } from 'zod';

const JsonObjectSchema = z.record(z.string(), z.json());
const StringMetadataSchema = z.record(z.string(), z.string());

const ContentPartSchema = z
	.object({
		type: z.string().min(1),
		text: z.string().optional(),
		image_url: z
			.object({
				url: z.string().min(1),
				detail: z.string().optional(),
			})
			.strict()
			.optional(),
	})
	.strict();

const ToolCallSchema = z
	.object({
		id: z.string().min(1),
		type: z.literal('function'),
		function: z
			.object({
				name: z.string().min(1),
				arguments: z.string(),
			})
			.strict(),
	})
	.strict();

const RunMessageSchema = z
	.object({
		role: z.enum(['system', 'user', 'assistant', 'tool']),
		// Langbase documents text, structured text/image content, null tool-call
		// content, and omitted content on the pipe-run message shape.
		content: z
			.union([z.string(), z.array(ContentPartSchema), z.null()])
			.optional(),
		tool_call_id: z.string().optional(),
		name: z.string().optional(),
		// Langbase's Agent tool-calling example resubmits assistant messages with
		// tool_calls before appending each tool result.
		tool_calls: z.array(ToolCallSchema).optional(),
	})
	.strict();

const PipeConfigurationMessageSchema = z
	.object({
		role: z.enum(['system', 'user', 'assistant', 'tool']),
		content: z.string(),
		name: z.enum(['json', 'safety', 'opening', 'rag']).optional(),
	})
	.strict();

export const MessageSchema = z
	.object({
		role: z.enum(['system', 'user', 'assistant', 'tool']),
		content: z.string().nullable(),
		name: z.string().optional(),
		tool_call_id: z.string().optional(),
		tool_calls: z.array(ToolCallSchema).optional(),
	})
	.strict();

const PipeMemorySchema = z.object({ name: z.string().min(1) }).strict();

const PipeToolSchema = z
	.object({
		type: z.literal('function'),
		function: z
			.object({
				name: z.string().min(1),
				description: z.string().optional(),
				parameters: JsonObjectSchema.optional(),
			})
			.strict(),
	})
	.strict();

const ToolChoiceSchema = z.union([
	z.enum(['auto', 'required']),
	z
		.object({
			type: z.literal('function'),
			function: z.object({ name: z.string().min(1) }).strict(),
		})
		.strict(),
]);

const ResponseFormatSchema = z.union([
	z.object({ type: z.literal('text') }).strict(),
	z.object({ type: z.literal('json_object') }).strict(),
	z
		.object({
			type: z.literal('json_schema'),
			json_schema: z
				.object({
					description: z.string().optional(),
					name: z.string().min(1),
					// Provider-defined JSON Schema; JSON values keep this serializable.
					schema: JsonObjectSchema.optional(),
					strict: z.boolean().nullable().optional(),
				})
				.strict(),
		})
		.strict(),
]);

const PipeConfigurationShape = {
	description: z.string().optional(),
	status: z.enum(['public', 'private']).optional(),
	model: z.string().min(1).optional(),
	stream: z.boolean().optional(),
	json: z.boolean().optional(),
	store: z.boolean().optional(),
	moderate: z.boolean().optional(),
	top_p: z.number().min(0).max(1).optional(),
	max_tokens: z.number().int().positive().optional(),
	temperature: z.number().min(0).optional(),
	presence_penalty: z.number().optional(),
	frequency_penalty: z.number().optional(),
	stop: z.array(z.string()).max(4).optional(),
	tools: z.array(PipeToolSchema).optional(),
	tool_choice: ToolChoiceSchema.optional(),
	parallel_tool_calls: z.boolean().optional(),
	messages: z.array(PipeConfigurationMessageSchema).optional(),
	variables: z.record(z.string(), z.string()).optional(),
	memory: z.array(PipeMemorySchema).optional(),
	response_format: ResponseFormatSchema.optional(),
};

export const RunPipeInputSchema = z
	.object({
		name: z.string().min(1),
		messages: z.array(RunMessageSchema).min(1),
		stream: z.literal(false).default(false),
		threadId: z.string().min(1).optional(),
		memory: z.array(PipeMemorySchema).optional(),
		variables: z.record(z.string(), z.string()).optional(),
		tools: z.array(PipeToolSchema).optional(),
	})
	.strict();
export type RunPipeInput = z.input<typeof RunPipeInputSchema>;

export const RunPipeOutputSchema = z.object({
	completion: z.string(),
	// `raw` is provider JSON; z.json() validates its recursive JSON shape.
	raw: JsonObjectSchema,
});
export type RunPipeOutput = z.infer<typeof RunPipeOutputSchema>;

export const RunAgentInputSchema = z
	.object({
		model: z.string().min(1),
		input: z.union([z.string(), z.array(RunMessageSchema)]),
		instructions: z.string().optional(),
		stream: z.literal(false).default(false),
		tools: z.array(PipeToolSchema).optional(),
		tool_choice: ToolChoiceSchema.optional(),
		parallel_tool_calls: z.boolean().optional(),
		reasoning_effort: z.enum(['none', 'low', 'medium', 'high']).optional(),
		top_p: z.number().min(0).max(1).optional(),
		max_tokens: z.number().int().positive().optional(),
		temperature: z.number().min(0).max(2).optional(),
		presence_penalty: z.number().optional(),
		frequency_penalty: z.number().optional(),
		stop: z.array(z.string()).max(4).optional(),
		// Provider-defined model options remain JSON-only and cannot carry functions.
		customModelParams: JsonObjectSchema.optional(),
	})
	.strict();
export type RunAgentInput = z.input<typeof RunAgentInputSchema>;

const AgentChoiceMessageSchema = z
	.object({
		role: z.enum(['system', 'user', 'assistant', 'tool']),
		content: z.string().nullable().optional(),
		name: z.string().nullable().optional(),
		tool_call_id: z.string().nullable().optional(),
		tool_calls: z.array(ToolCallSchema).optional(),
	})
	.strict();

const AgentChoiceSchema = z
	.object({
		index: z.number().int(),
		message: AgentChoiceMessageSchema,
		logprobs: z.boolean().nullable(),
		finish_reason: z.string(),
	})
	.strict();

export const RunAgentOutputSchema = z
	.object({
		output: z.string().nullable(),
		id: z.string(),
		object: z.string(),
		created: z.number(),
		model: z.string(),
		choices: z.array(AgentChoiceSchema),
		usage: z
			.object({
				prompt_tokens: z.number(),
				completion_tokens: z.number(),
				total_tokens: z.number(),
			})
			.strict(),
		system_fingerprint: z.string().nullable(),
		rawResponse: z
			.object({ headers: StringMetadataSchema })
			.strict()
			.optional(),
	})
	.strict();
export type RunAgentOutput = z.infer<typeof RunAgentOutputSchema>;

export const ListPipesInputSchema = z.object({}).strict();
export type ListPipesInput = z.infer<typeof ListPipesInputSchema>;

export const PipeSchema = z.object({
	name: z.string(),
	description: z.string().optional(),
	status: z.enum(['public', 'private']).optional(),
	owner_login: z.string().optional(),
	url: z.string().optional(),
	model: z.string().optional(),
	stream: z.boolean().optional(),
	json: z.boolean().optional(),
	store: z.boolean().optional(),
	moderate: z.boolean().optional(),
	top_p: z.number().optional(),
	max_tokens: z.number().optional(),
	temperature: z.number().optional(),
	presence_penalty: z.number().optional(),
	frequency_penalty: z.number().optional(),
	stop: z.array(z.string()).optional(),
	tool_choice: ToolChoiceSchema.optional(),
	parallel_tool_calls: z.boolean().optional(),
	messages: z
		.array(
			z.object({
				role: z.enum(['system', 'user', 'assistant', 'tool']),
				content: z.string().nullable(),
				name: z
					.enum(['json', 'safety', 'opening', 'rag'])
					.nullable()
					.optional(),
			}),
		)
		.optional(),
	variables: z
		.array(z.object({ name: z.string(), value: z.string() }).strict())
		.optional(),
	tools: z.array(JsonObjectSchema).optional(),
	memory: z.array(PipeMemorySchema).optional(),
});
export type Pipe = z.infer<typeof PipeSchema>;

export const ListPipesOutputSchema = z.array(PipeSchema);
export type ListPipesOutput = z.infer<typeof ListPipesOutputSchema>;

export const GetPipeInputSchema = z
	.object({
		ownerLogin: z.string().min(1),
		pipeName: z.string().min(1),
	})
	.strict();
export type GetPipeInput = z.infer<typeof GetPipeInputSchema>;

export const GetPipeOutputSchema = PipeSchema;
export type GetPipeOutput = z.infer<typeof GetPipeOutputSchema>;

const PipeResourceSchema = z.object({
	name: z.string(),
	description: z.string(),
	status: z.enum(['public', 'private']),
	owner_login: z.string(),
	url: z.string(),
	type: z.enum(['chat', 'generate', 'run']),
	api_key: z.string(),
});

export const CreatePipeInputSchema = z
	.object({
		name: z.string().min(1),
		upsert: z.boolean().optional(),
		...PipeConfigurationShape,
	})
	.strict();
export type CreatePipeInput = z.infer<typeof CreatePipeInputSchema>;

export const CreatePipeOutputSchema = PipeResourceSchema;
export type CreatePipeOutput = z.infer<typeof CreatePipeOutputSchema>;

export const UpdatePipeInputSchema = z
	.object({
		name: z.string().min(1),
		upsert: z.boolean().optional(),
		...PipeConfigurationShape,
	})
	.strict();
export type UpdatePipeInput = z.infer<typeof UpdatePipeInputSchema>;

export const UpdatePipeOutputSchema = PipeResourceSchema;
export type UpdatePipeOutput = z.infer<typeof UpdatePipeOutputSchema>;

// Memory schemas
export const ListMemoryInputSchema = z.object({}).strict();
export type ListMemoryInput = z.infer<typeof ListMemoryInputSchema>;

export const MemorySchema = z.object({
	name: z.string(),
	description: z.string().optional(),
	owner_login: z.string().optional(),
	url: z.string().optional(),
	chunk_size: z.number().optional(),
	chunk_overlap: z.number().optional(),
	embedding_model: z.string().optional(),
	embeddingModel: z.string().optional(),
});
export type MemoryRecord = z.infer<typeof MemorySchema>;

export const ListMemoryOutputSchema = z.array(MemorySchema);
export type ListMemoryOutput = z.infer<typeof ListMemoryOutputSchema>;

export const CreateMemoryInputSchema = z
	.object({
		name: z.string().min(1),
		description: z.string().optional(),
		embedding_model: z
			.enum([
				'openai:text-embedding-3-large',
				'cohere:embed-v4.0',
				'cohere:embed-multilingual-v3.0',
				'cohere:embed-multilingual-light-v3.0',
				'google:text-embedding-004',
			])
			.optional(),
		chunk_size: z.number().int().positive().max(30_000).optional(),
		chunk_overlap: z.number().int().nonnegative().optional(),
		top_k: z.number().int().min(1).max(100).optional(),
	})
	.strict()
	.refine(
		({ chunk_size, chunk_overlap }) =>
			(chunk_overlap ?? 2_048) < (chunk_size ?? 10_000),
		{ message: 'chunk_overlap must be less than chunk_size' },
	);
export type CreateMemoryInput = z.infer<typeof CreateMemoryInputSchema>;

export const CreateMemoryOutputSchema = z.object({
	name: z.string(),
	description: z.string(),
	owner_login: z.string(),
	url: z.string(),
	chunk_size: z.number(),
	chunk_overlap: z.number(),
	embedding_model: z.string(),
});
export type CreateMemoryOutput = z.infer<typeof CreateMemoryOutputSchema>;

export const DeleteMemoryInputSchema = z
	.object({ name: z.string().min(1) })
	.strict();
export type DeleteMemoryInput = z.infer<typeof DeleteMemoryInputSchema>;

export const DeleteMemoryOutputSchema = z.object({ success: z.boolean() });
export type DeleteMemoryOutput = z.infer<typeof DeleteMemoryOutputSchema>;

type MemoryFilterCondition = [
	string,
	'Eq' | 'NotEq' | 'In' | 'NotIn',
	string | string[],
];
export type MemoryFilter =
	| MemoryFilterCondition
	| ['And' | 'Or', MemoryFilter[]];

const MemoryFilterSchema: z.ZodType<MemoryFilter> = z.lazy(() =>
	z.union([
		z.tuple([
			z.string(),
			z.enum(['Eq', 'NotEq', 'In', 'NotIn']),
			z.union([z.string(), z.array(z.string())]),
		]),
		z.tuple([z.enum(['And', 'Or']), z.array(MemoryFilterSchema)]),
	]),
);

export const RetrieveMemoryInputSchema = z
	.object({
		query: z.string().min(1),
		memory: z
			.array(
				z
					.object({
						name: z.string().min(1),
						filters: MemoryFilterSchema.optional(),
					})
					.strict(),
			)
			.min(1),
		topK: z.number().int().min(1).max(100).optional(),
	})
	.strict();
export type RetrieveMemoryInput = z.infer<typeof RetrieveMemoryInputSchema>;

export const RetrieveMemoryOutputSchema = z.array(
	z.object({
		text: z.string(),
		similarity: z.number().min(0).max(1),
		meta: StringMetadataSchema,
	}),
);
export type RetrieveMemoryOutput = z.infer<typeof RetrieveMemoryOutputSchema>;

// Document schemas
const DocumentPathInputShape = {
	memoryName: z.string().min(1),
	documentName: z.string().min(1),
};

export const ListDocumentsInputSchema = z
	.object({ memoryName: DocumentPathInputShape.memoryName })
	.strict();
export type ListDocumentsInput = z.infer<typeof ListDocumentsInputSchema>;

const DocumentMetadataSchema = z.object({
	size: z.number(),
	type: z.enum([
		'application/pdf',
		'text/plain',
		'text/markdown',
		'text/csv',
		'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
		'application/vnd.ms-excel',
	]),
});

export const MemoryDocumentSchema = z.object({
	name: z.string(),
	status: z.enum(['queued', 'in_progress', 'completed', 'failed']),
	status_message: z.string().nullable(),
	metadata: DocumentMetadataSchema,
	enabled: z.boolean(),
	chunk_size: z.number(),
	chunk_overlap: z.number(),
	owner_login: z.string(),
});

export const ListDocumentsOutputSchema = z.array(MemoryDocumentSchema);
export type ListDocumentsOutput = z.infer<typeof ListDocumentsOutputSchema>;

export const UploadDocumentInputSchema = z
	.object({
		memoryName: z.string().min(1),
		documentName: z.string().min(1),
		// Langbase's documented upload is binary; base64 keeps the endpoint input
		// JSON-serializable before the plugin decodes and uploads it.
		contentBase64: z
			.string()
			.min(4)
			.regex(
				/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/,
			),
		contentType: z.enum([
			'application/pdf',
			'text/plain',
			'text/markdown',
			'text/csv',
		]),
		meta: StringMetadataSchema.refine(
			(value) => Object.keys(value).length <= 10,
		).optional(),
	})
	.strict();
export type UploadDocumentInput = z.infer<typeof UploadDocumentInputSchema>;

export const UploadDocumentOutputSchema = z
	.object({
		ok: z.boolean(),
		status: z.number().int(),
		statusText: z.string(),
	})
	.strict();
export type UploadDocumentOutput = z.infer<typeof UploadDocumentOutputSchema>;

export const DeleteDocumentInputSchema = z
	.object(DocumentPathInputShape)
	.strict();
export type DeleteDocumentInput = z.infer<typeof DeleteDocumentInputSchema>;

export const DeleteDocumentOutputSchema = z.object({ success: z.boolean() });
export type DeleteDocumentOutput = z.infer<typeof DeleteDocumentOutputSchema>;

export const RetryDocumentEmbeddingsInputSchema = z
	.object(DocumentPathInputShape)
	.strict();
export type RetryDocumentEmbeddingsInput = z.infer<
	typeof RetryDocumentEmbeddingsInputSchema
>;

export const RetryDocumentEmbeddingsOutputSchema = z.object({
	success: z.boolean(),
});
export type RetryDocumentEmbeddingsOutput = z.infer<
	typeof RetryDocumentEmbeddingsOutputSchema
>;

// Thread/context schemas
const ThreadMessageInputSchema = MessageSchema.extend({
	// The API documents arbitrary JSON attachments, validated as JSON values.
	attachments: z.array(z.json()).optional(),
	metadata: StringMetadataSchema.optional(),
}).strict();

export const CreateThreadInputSchema = z
	.object({
		threadId: z.string().min(1).optional(),
		metadata: StringMetadataSchema.optional(),
		messages: z.array(ThreadMessageInputSchema).optional(),
	})
	.strict();
export type CreateThreadInput = z.infer<typeof CreateThreadInputSchema>;

export const ThreadSchema = z.object({
	id: z.string(),
	object: z.literal('thread'),
	created_at: z.number(),
	metadata: StringMetadataSchema.optional(),
});
export type Thread = z.infer<typeof ThreadSchema>;

export const CreateThreadOutputSchema = ThreadSchema;
export type CreateThreadOutput = z.infer<typeof CreateThreadOutputSchema>;

export const GetThreadInputSchema = z
	.object({ threadId: z.string().min(1) })
	.strict();
export type GetThreadInput = z.infer<typeof GetThreadInputSchema>;

export const GetThreadOutputSchema = ThreadSchema;
export type GetThreadOutput = z.infer<typeof GetThreadOutputSchema>;

export const UpdateThreadInputSchema = z
	.object({
		threadId: z.string().min(1),
		metadata: StringMetadataSchema,
	})
	.strict();
export type UpdateThreadInput = z.infer<typeof UpdateThreadInputSchema>;

export const UpdateThreadOutputSchema = ThreadSchema;
export type UpdateThreadOutput = z.infer<typeof UpdateThreadOutputSchema>;

export const DeleteThreadInputSchema = GetThreadInputSchema;
export type DeleteThreadInput = z.infer<typeof DeleteThreadInputSchema>;

export const DeleteThreadOutputSchema = z.object({ success: z.boolean() });
export type DeleteThreadOutput = z.infer<typeof DeleteThreadOutputSchema>;

export const AppendThreadMessagesInputSchema = z
	.object({
		threadId: z.string().min(1),
		messages: z.array(ThreadMessageInputSchema).min(1),
	})
	.strict();
export type AppendThreadMessagesInput = z.infer<
	typeof AppendThreadMessagesInputSchema
>;

export const ThreadMessageOutputSchema = z.object({
	id: z.string(),
	thread_id: z.string(),
	created_at: z.number(),
	role: z.enum(['user', 'assistant', 'system', 'tool']),
	content: z.string().nullable(),
	tool_call_id: z.string().nullable().optional(),
	tool_calls: z.array(ToolCallSchema).optional(),
	name: z.string().nullable().optional(),
	attachments: z.array(z.json()).optional(),
	metadata: StringMetadataSchema.optional(),
});

export const AppendThreadMessagesOutputSchema = z.array(
	ThreadMessageOutputSchema,
);
export type AppendThreadMessagesOutput = z.infer<
	typeof AppendThreadMessagesOutputSchema
>;

export const ListThreadMessagesInputSchema = GetThreadInputSchema;
export type ListThreadMessagesInput = z.infer<
	typeof ListThreadMessagesInputSchema
>;

export const ListThreadMessagesOutputSchema = z.array(
	ThreadMessageOutputSchema,
);
export type ListThreadMessagesOutput = z.infer<
	typeof ListThreadMessagesOutputSchema
>;

// Input and output registries are kept in lockstep with the endpoint tree.
export const LangbaseEndpointInputSchemas = {
	'agent.run': RunAgentInputSchema,
	'pipes.run': RunPipeInputSchema,
	'pipes.list': ListPipesInputSchema,
	'pipes.get': GetPipeInputSchema,
	'pipes.create': CreatePipeInputSchema,
	'pipes.update': UpdatePipeInputSchema,
	'memory.list': ListMemoryInputSchema,
	'memory.create': CreateMemoryInputSchema,
	'memory.delete': DeleteMemoryInputSchema,
	'memory.retrieve': RetrieveMemoryInputSchema,
	'documents.list': ListDocumentsInputSchema,
	'documents.upload': UploadDocumentInputSchema,
	'documents.delete': DeleteDocumentInputSchema,
	'documents.retryEmbeddings': RetryDocumentEmbeddingsInputSchema,
	'threads.create': CreateThreadInputSchema,
	'threads.get': GetThreadInputSchema,
	'threads.update': UpdateThreadInputSchema,
	'threads.delete': DeleteThreadInputSchema,
	'threads.appendMessages': AppendThreadMessagesInputSchema,
	'threads.listMessages': ListThreadMessagesInputSchema,
} as const;

export const LangbaseEndpointOutputSchemas = {
	'agent.run': RunAgentOutputSchema,
	'pipes.run': RunPipeOutputSchema,
	'pipes.list': ListPipesOutputSchema,
	'pipes.get': GetPipeOutputSchema,
	'pipes.create': CreatePipeOutputSchema,
	'pipes.update': UpdatePipeOutputSchema,
	'memory.list': ListMemoryOutputSchema,
	'memory.create': CreateMemoryOutputSchema,
	'memory.delete': DeleteMemoryOutputSchema,
	'memory.retrieve': RetrieveMemoryOutputSchema,
	'documents.list': ListDocumentsOutputSchema,
	'documents.upload': UploadDocumentOutputSchema,
	'documents.delete': DeleteDocumentOutputSchema,
	'documents.retryEmbeddings': RetryDocumentEmbeddingsOutputSchema,
	'threads.create': CreateThreadOutputSchema,
	'threads.get': GetThreadOutputSchema,
	'threads.update': UpdateThreadOutputSchema,
	'threads.delete': DeleteThreadOutputSchema,
	'threads.appendMessages': AppendThreadMessagesOutputSchema,
	'threads.listMessages': ListThreadMessagesOutputSchema,
} as const;

export type LangbaseEndpointInputs = {
	'agent.run': RunAgentInput;
	'pipes.run': RunPipeInput;
	'pipes.list': ListPipesInput;
	'pipes.get': GetPipeInput;
	'pipes.create': CreatePipeInput;
	'pipes.update': UpdatePipeInput;
	'memory.list': ListMemoryInput;
	'memory.create': CreateMemoryInput;
	'memory.delete': DeleteMemoryInput;
	'memory.retrieve': RetrieveMemoryInput;
	'documents.list': ListDocumentsInput;
	'documents.upload': UploadDocumentInput;
	'documents.delete': DeleteDocumentInput;
	'documents.retryEmbeddings': RetryDocumentEmbeddingsInput;
	'threads.create': CreateThreadInput;
	'threads.get': GetThreadInput;
	'threads.update': UpdateThreadInput;
	'threads.delete': DeleteThreadInput;
	'threads.appendMessages': AppendThreadMessagesInput;
	'threads.listMessages': ListThreadMessagesInput;
};

export type LangbaseEndpointOutputs = {
	'agent.run': RunAgentOutput;
	'pipes.run': RunPipeOutput;
	'pipes.list': ListPipesOutput;
	'pipes.get': GetPipeOutput;
	'pipes.create': CreatePipeOutput;
	'pipes.update': UpdatePipeOutput;
	'memory.list': ListMemoryOutput;
	'memory.create': CreateMemoryOutput;
	'memory.delete': DeleteMemoryOutput;
	'memory.retrieve': RetrieveMemoryOutput;
	'documents.list': ListDocumentsOutput;
	'documents.upload': UploadDocumentOutput;
	'documents.delete': DeleteDocumentOutput;
	'documents.retryEmbeddings': RetryDocumentEmbeddingsOutput;
	'threads.create': CreateThreadOutput;
	'threads.get': GetThreadOutput;
	'threads.update': UpdateThreadOutput;
	'threads.delete': DeleteThreadOutput;
	'threads.appendMessages': AppendThreadMessagesOutput;
	'threads.listMessages': ListThreadMessagesOutput;
};
