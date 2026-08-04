import { z } from 'zod';

// --- Legacy Completions ---

export const CompletionsCreateInputSchema = z.object({
	model: z.string(),
	prompt: z.union([z.string(), z.array(z.string())]),
	maxTokens: z.number().nullable().optional(),
	temperature: z.number().min(0).max(2).nullable().optional(),
	topP: z.number().min(0).max(1).nullable().optional(),
	n: z.number().nullable().optional(),
	stop: z
		.union([z.string(), z.array(z.string())])
		.nullable()
		.optional(),
	presencePenalty: z.number().min(-2).max(2).optional(),
	frequencyPenalty: z.number().min(-2).max(2).optional(),
	logprobs: z.number().nullable().optional(),
	echo: z.boolean().optional(),
	bestOf: z.number().optional(),
	logitBias: z.record(z.string(), z.number()).nullable().optional(),
	user: z.string().optional(),
	suffix: z.string().nullable().optional(),
});
export type CompletionsCreateInput = z.infer<
	typeof CompletionsCreateInputSchema
>;

const CompletionChoiceSchema = z.object({
	text: z.string(),
	index: z.number(),
	// logprobs structure varies with the requested logprobs count; kept loose rather than modeling it.
	logprobs: z.record(z.string(), z.unknown()).nullable(),
	finish_reason: z.string(),
});

export const CompletionsCreateResponseSchema = z.object({
	id: z.string(),
	object: z.literal('text_completion'),
	created: z.number(),
	model: z.string(),
	choices: z.array(CompletionChoiceSchema),
	usage: z
		.object({
			prompt_tokens: z.number(),
			completion_tokens: z.number(),
			total_tokens: z.number(),
		})
		.optional(),
});
export type CompletionsCreateResponse = z.infer<
	typeof CompletionsCreateResponseSchema
>;

// --- Responses API ---

// Input items (message, function_call, tool output, etc.) have a shape that varies by type; kept loose rather than modeling each variant.
const ResponseInputSchema = z.union([
	z.string(),
	z.array(z.record(z.string(), z.unknown())),
]);

// Non-string tool choice targets a specific tool and its shape varies by tool type; kept loose.
const ResponseToolChoiceSchema = z.union([
	z.enum(['none', 'auto', 'required']),
	z.record(z.string(), z.unknown()),
]);

const ReasoningSchema = z
	.object({
		effort: z.enum(['minimal', 'low', 'medium', 'high']).optional(),
	})
	.optional();

export const ResponsesCreateInputSchema = z.object({
	model: z.string(),
	input: ResponseInputSchema,
	instructions: z.string().optional(),
	// Tool definitions vary by tool type (function, file_search, web_search, etc.); kept loose rather than modeling each variant.
	tools: z.array(z.record(z.string(), z.unknown())).optional(),
	toolChoice: ResponseToolChoiceSchema.optional(),
	temperature: z.number().min(0).max(2).nullable().optional(),
	topP: z.number().min(0).max(1).nullable().optional(),
	maxOutputTokens: z.number().nullable().optional(),
	previousResponseId: z.string().optional(),
	store: z.boolean().optional(),
	metadata: z.record(z.string(), z.string()).nullable().optional(),
	truncation: z.enum(['auto', 'disabled']).optional(),
	parallelToolCalls: z.boolean().optional(),
	background: z.boolean().optional(),
	reasoning: ReasoningSchema,
});
export type ResponsesCreateInput = z.infer<typeof ResponsesCreateInputSchema>;

const ResponseObjectSchema = z.object({
	id: z.string(),
	object: z.literal('response'),
	created_at: z.number(),
	status: z.enum([
		'completed',
		'failed',
		'in_progress',
		'cancelled',
		'queued',
		'incomplete',
	]),
	model: z.string(),
	// Output items (message, function_call, reasoning, etc.) have a shape that varies by type; kept loose rather than modeling each variant.
	output: z.array(z.record(z.string(), z.unknown())),
	previous_response_id: z.string().nullable().optional(),
	usage: z
		.object({
			input_tokens: z.number(),
			output_tokens: z.number(),
			total_tokens: z.number(),
		})
		.optional(),
});
export type ResponseObject = z.infer<typeof ResponseObjectSchema>;

export const ResponsesCreateResponseSchema = ResponseObjectSchema;
export type ResponsesCreateResponse = z.infer<
	typeof ResponsesCreateResponseSchema
>;

export const ResponsesRetrieveInputSchema = z.object({
	responseId: z.string(),
});
export type ResponsesRetrieveInput = z.infer<
	typeof ResponsesRetrieveInputSchema
>;
export const ResponsesRetrieveResponseSchema = ResponseObjectSchema;
export type ResponsesRetrieveResponse = z.infer<
	typeof ResponsesRetrieveResponseSchema
>;

export const ResponsesDeleteInputSchema = z.object({
	responseId: z.string(),
});
export type ResponsesDeleteInput = z.infer<typeof ResponsesDeleteInputSchema>;
export const ResponsesDeleteResponseSchema = z.object({
	id: z.string(),
	object: z.literal('response.deleted'),
	deleted: z.boolean(),
});
export type ResponsesDeleteResponse = z.infer<
	typeof ResponsesDeleteResponseSchema
>;

export const ResponsesCancelInputSchema = z.object({
	responseId: z.string(),
});
export type ResponsesCancelInput = z.infer<typeof ResponsesCancelInputSchema>;
export const ResponsesCancelResponseSchema = ResponseObjectSchema;
export type ResponsesCancelResponse = z.infer<
	typeof ResponsesCancelResponseSchema
>;

export const ResponsesCompactInputSchema = z.object({
	model: z.string(),
	// See ResponseInputSchema above: input item shape varies by type, kept loose.
	input: z.array(z.record(z.string(), z.unknown())),
});
export type ResponsesCompactInput = z.infer<typeof ResponsesCompactInputSchema>;

export const ResponsesCompactResponseSchema = z.object({
	id: z.string(),
	object: z.literal('response.compaction'),
	created_at: z.number(),
	// See ResponseObjectSchema above: output item shape varies by type, kept loose.
	output: z.array(z.record(z.string(), z.unknown())),
	usage: z
		.object({
			input_tokens: z.number(),
			output_tokens: z.number(),
			total_tokens: z.number(),
		})
		.optional(),
});
export type ResponsesCompactResponse = z.infer<
	typeof ResponsesCompactResponseSchema
>;

export const ResponsesListInputItemsInputSchema = z.object({
	responseId: z.string(),
	limit: z.number().optional(),
	order: z.enum(['asc', 'desc']).optional(),
	after: z.string().optional(),
	before: z.string().optional(),
});
export type ResponsesListInputItemsInput = z.infer<
	typeof ResponsesListInputItemsInputSchema
>;

export const ResponsesListInputItemsResponseSchema = z.object({
	object: z.literal('list'),
	// See ResponseInputSchema above: input item shape varies by type, kept loose.
	data: z.array(z.record(z.string(), z.unknown())),
	first_id: z.string().optional(),
	last_id: z.string().optional(),
	has_more: z.boolean(),
});
export type ResponsesListInputItemsResponse = z.infer<
	typeof ResponsesListInputItemsResponseSchema
>;

// --- Chat Completions storage CRUD ---

// Stored chat completion fields beyond id/object/created/model vary (choices, usage, metadata, etc.); using catchall to accept them.
const StoredChatCompletionObjectSchema = z
	.object({
		id: z.string(),
		object: z.literal('chat.completion'),
		created: z.number(),
		model: z.string(),
	})
	.catchall(z.unknown());
export type StoredChatCompletionObject = z.infer<
	typeof StoredChatCompletionObjectSchema
>;

export const ChatCompletionsListInputSchema = z.object({
	model: z.string().optional(),
	metadata: z.record(z.string(), z.string()).optional(),
	after: z.string().optional(),
	limit: z.number().optional(),
	order: z.enum(['asc', 'desc']).optional(),
});
export type ChatCompletionsListInput = z.infer<
	typeof ChatCompletionsListInputSchema
>;

export const ChatCompletionsListResponseSchema = z.object({
	object: z.literal('list'),
	// See StoredChatCompletionObjectSchema above: fields beyond the required ones vary, kept loose.
	data: z.array(z.record(z.string(), z.unknown())),
	first_id: z.string().optional(),
	last_id: z.string().optional(),
	has_more: z.boolean(),
});
export type ChatCompletionsListResponse = z.infer<
	typeof ChatCompletionsListResponseSchema
>;

export const ChatCompletionsRetrieveInputSchema = z.object({
	completionId: z.string(),
});
export type ChatCompletionsRetrieveInput = z.infer<
	typeof ChatCompletionsRetrieveInputSchema
>;
export const ChatCompletionsRetrieveResponseSchema =
	StoredChatCompletionObjectSchema;
export type ChatCompletionsRetrieveResponse = z.infer<
	typeof ChatCompletionsRetrieveResponseSchema
>;

export const ChatCompletionsUpdateInputSchema = z.object({
	completionId: z.string(),
	metadata: z.record(z.string(), z.string()).nullable(),
});
export type ChatCompletionsUpdateInput = z.infer<
	typeof ChatCompletionsUpdateInputSchema
>;
export const ChatCompletionsUpdateResponseSchema =
	StoredChatCompletionObjectSchema;
export type ChatCompletionsUpdateResponse = z.infer<
	typeof ChatCompletionsUpdateResponseSchema
>;

export const ChatCompletionsDeleteInputSchema = z.object({
	completionId: z.string(),
});
export type ChatCompletionsDeleteInput = z.infer<
	typeof ChatCompletionsDeleteInputSchema
>;
export const ChatCompletionsDeleteResponseSchema = z.object({
	id: z.string(),
	object: z.literal('chat.completion.deleted'),
	deleted: z.boolean(),
});
export type ChatCompletionsDeleteResponse = z.infer<
	typeof ChatCompletionsDeleteResponseSchema
>;

export const ChatCompletionsListMessagesInputSchema = z.object({
	completionId: z.string(),
	after: z.string().optional(),
	limit: z.number().optional(),
	order: z.enum(['asc', 'desc']).optional(),
});
export type ChatCompletionsListMessagesInput = z.infer<
	typeof ChatCompletionsListMessagesInputSchema
>;

export const ChatCompletionsListMessagesResponseSchema = z.object({
	object: z.literal('list'),
	// Stored message fields vary by role/content type; kept loose rather than modeling each variant.
	data: z.array(z.record(z.string(), z.unknown())),
	first_id: z.string().optional(),
	last_id: z.string().optional(),
	has_more: z.boolean(),
});
export type ChatCompletionsListMessagesResponse = z.infer<
	typeof ChatCompletionsListMessagesResponseSchema
>;

// --- Token counting ---

export const TokensCountInputInputSchema = z.object({
	model: z.string(),
	// See ResponseInputSchema above: input item shape varies by type, kept loose.
	input: z.union([z.string(), z.array(z.record(z.string(), z.unknown()))]),
	// See ResponsesCreateInputSchema above: tool definition shape varies by tool type, kept loose.
	tools: z.array(z.record(z.string(), z.unknown())).optional(),
});
export type TokensCountInputInput = z.infer<typeof TokensCountInputInputSchema>;

export const TokensCountInputResponseSchema = z.object({
	input_tokens: z.number(),
});
export type TokensCountInputResponse = z.infer<
	typeof TokensCountInputResponseSchema
>;
