import { z } from 'zod';

// ─────────────────────────────────────────────────────────────────────────────
// Messages
// ─────────────────────────────────────────────────────────────────────────────

const ToolCallSchema = z.object({
	id: z.string(),
	type: z.literal('function'),
	function: z.object({
		name: z.string(),
		arguments: z.string(),
	}),
});
export type ToolCall = z.infer<typeof ToolCallSchema>;

const ChatMessageSchema = z.object({
	role: z.enum(['system', 'user', 'assistant', 'tool']),
	content: z.string().nullable().optional(),
	name: z.string().optional(),
	tool_calls: z.array(ToolCallSchema).optional(),
	tool_call_id: z.string().optional(),
	prefix: z.boolean().optional(),
});
export type ChatMessage = z.infer<typeof ChatMessageSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// Tools
// ─────────────────────────────────────────────────────────────────────────────

const FunctionToolSchema = z.object({
	type: z.literal('function'),
	function: z.object({
		name: z.string(),
		description: z.string().optional(),
		// Function tool parameters are an arbitrary JSON Schema object defined by the caller.
		parameters: z.record(z.string(), z.unknown()).optional(),
	}),
});

const ToolChoiceSchema = z.union([
	z.enum(['none', 'auto', 'required']),
	z.object({
		type: z.literal('function'),
		function: z.object({ name: z.string() }),
	}),
]);

const ResponseFormatSchema = z.union([
	z.object({ type: z.literal('text') }),
	z.object({ type: z.literal('json_object') }),
]);

// ─────────────────────────────────────────────────────────────────────────────
// Create Chat Completion
// ─────────────────────────────────────────────────────────────────────────────

export const ChatCreateCompletionInputSchema = z.object({
	/** `deepseek-chat` for general use, `deepseek-reasoner` for chain-of-thought reasoning. */
	model: z.enum(['deepseek-chat', 'deepseek-reasoner']),
	messages: z.array(ChatMessageSchema),
	frequencyPenalty: z.number().min(-2).max(2).optional(),
	maxTokens: z.number().optional(),
	presencePenalty: z.number().min(-2).max(2).optional(),
	responseFormat: ResponseFormatSchema.optional(),
	stop: z
		.union([z.string(), z.array(z.string())])
		.nullable()
		.optional(),
	// Ignored by the API when model is 'deepseek-reasoner'.
	temperature: z.number().min(0).max(2).nullable().optional(),
	topP: z.number().min(0).max(1).nullable().optional(),
	tools: z.array(FunctionToolSchema).optional(),
	toolChoice: ToolChoiceSchema.optional(),
	logprobs: z.boolean().nullable().optional(),
	topLogprobs: z.number().min(0).max(20).nullable().optional(),
});
export type ChatCreateCompletionInput = z.infer<
	typeof ChatCreateCompletionInputSchema
>;

const ChoiceSchema = z.object({
	index: z.number(),
	message: z.object({
		role: z.literal('assistant'),
		content: z.string().nullable(),
		// Chain-of-thought output, present only for model: 'deepseek-reasoner'.
		reasoning_content: z.string().nullable().optional(),
		tool_calls: z.array(ToolCallSchema).optional(),
	}),
	logprobs: z
		.object({
			// Token logprob entries; shape is undocumented beyond being an array.
			content: z.array(z.unknown()).nullable(),
		})
		.nullable()
		.optional(),
	finish_reason: z.enum([
		'stop',
		'length',
		'content_filter',
		'tool_calls',
		'insufficient_system_resource',
	]),
});

export const ChatCreateCompletionResponseSchema = z.object({
	id: z.string(),
	object: z.literal('chat.completion'),
	created: z.number(),
	model: z.string(),
	choices: z.array(ChoiceSchema),
	system_fingerprint: z.string().optional(),
	usage: z
		.object({
			prompt_tokens: z.number(),
			completion_tokens: z.number(),
			total_tokens: z.number(),
			prompt_cache_hit_tokens: z.number().optional(),
			prompt_cache_miss_tokens: z.number().optional(),
			completion_tokens_details: z
				.object({
					reasoning_tokens: z.number().optional(),
				})
				.optional(),
		})
		.optional(),
});
export type ChatCreateCompletionResponse = z.infer<
	typeof ChatCreateCompletionResponseSchema
>;
