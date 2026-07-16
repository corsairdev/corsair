import { z } from 'zod';

const TextContentPartSchema = z.object({
	type: z.literal('text'),
	text: z.string(),
});

const ImageContentPartSchema = z.object({
	type: z.literal('image_url'),
	image_url: z.object({
		url: z.string(),
		detail: z.enum(['auto', 'low', 'high']).optional(),
	}),
});

const AudioContentPartSchema = z.object({
	type: z.literal('input_audio'),
	input_audio: z.object({
		data: z.string(),
		format: z.enum(['wav', 'mp3']),
	}),
});

const FileContentPartSchema = z.object({
	type: z.literal('file'),
	file: z.object({
		file_id: z.string().optional(),
		filename: z.string().optional(),
		file_data: z.string().optional(),
	}),
});

const ContentPartSchema = z.union([
	TextContentPartSchema,
	ImageContentPartSchema,
	AudioContentPartSchema,
	FileContentPartSchema,
]);

const MessageContentSchema = z.union([z.string(), z.array(ContentPartSchema)]);

const ToolCallSchema = z.object({
	id: z.string(),
	type: z.literal('function'),
	function: z.object({
		name: z.string(),
		arguments: z.string(),
	}),
});

const ChatMessageSchema = z.object({
	role: z.enum(['system', 'developer', 'user', 'assistant', 'tool']),
	content: MessageContentSchema.nullable().optional(),
	name: z.string().optional(),
	tool_calls: z.array(ToolCallSchema).optional(),
	tool_call_id: z.string().optional(),
	refusal: z.string().nullable().optional(),
});
export type ChatMessage = z.infer<typeof ChatMessageSchema>;

const FunctionToolSchema = z.object({
	type: z.literal('function'),
	function: z.object({
		name: z.string(),
		description: z.string().optional(),
		// Function tool parameters are an arbitrary JSON Schema object defined by the caller.
		parameters: z.record(z.string(), z.unknown()).optional(),
		strict: z.boolean().nullable().optional(),
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
	z.object({
		type: z.literal('json_schema'),
		json_schema: z.object({
			name: z.string(),
			description: z.string().optional(),
			// json_schema is an arbitrary JSON Schema document defined by the caller.
			schema: z.record(z.string(), z.unknown()).optional(),
			strict: z.boolean().nullable().optional(),
		}),
	}),
]);

export const ChatCreateCompletionInputSchema = z.object({
	model: z.string(),
	messages: z.array(ChatMessageSchema),
	frequencyPenalty: z.number().min(-2).max(2).optional(),
	logitBias: z.record(z.string(), z.number()).nullable().optional(),
	logprobs: z.boolean().nullable().optional(),
	topLogprobs: z.number().min(0).max(20).nullable().optional(),
	maxCompletionTokens: z.number().nullable().optional(),
	n: z.number().nullable().optional(),
	presencePenalty: z.number().min(-2).max(2).optional(),
	responseFormat: ResponseFormatSchema.optional(),
	seed: z.number().nullable().optional(),
	serviceTier: z.enum(['auto', 'default', 'flex', 'priority']).optional(),
	stop: z
		.union([z.string(), z.array(z.string())])
		.nullable()
		.optional(),
	store: z.boolean().nullable().optional(),
	metadata: z.record(z.string(), z.string()).nullable().optional(),
	temperature: z.number().min(0).max(2).nullable().optional(),
	topP: z.number().min(0).max(1).nullable().optional(),
	tools: z.array(FunctionToolSchema).optional(),
	toolChoice: ToolChoiceSchema.optional(),
	parallelToolCalls: z.boolean().optional(),
	reasoningEffort: z.enum(['minimal', 'low', 'medium', 'high']).optional(),
	user: z.string().optional(),
});
export type ChatCreateCompletionInput = z.infer<
	typeof ChatCreateCompletionInputSchema
>;

const ChoiceSchema = z.object({
	index: z.number(),
	message: z.object({
		role: z.literal('assistant'),
		content: z.string().nullable(),
		refusal: z.string().nullable().optional(),
		tool_calls: z.array(ToolCallSchema).optional(),
	}),
	// logprobs structure varies with the requested top_logprobs count; kept loose rather than modeling it.
	logprobs: z.record(z.string(), z.unknown()).nullable().optional(),
	finish_reason: z.enum([
		'stop',
		'length',
		'tool_calls',
		'content_filter',
		'function_call',
	]),
});

export const ChatCreateCompletionResponseSchema = z.object({
	id: z.string(),
	object: z.literal('chat.completion'),
	created: z.number(),
	model: z.string(),
	choices: z.array(ChoiceSchema),
	system_fingerprint: z.string().optional(),
	service_tier: z.string().optional(),
	usage: z
		.object({
			prompt_tokens: z.number(),
			completion_tokens: z.number(),
			total_tokens: z.number(),
		})
		.optional(),
});
export type ChatCreateCompletionResponse = z.infer<
	typeof ChatCreateCompletionResponseSchema
>;
