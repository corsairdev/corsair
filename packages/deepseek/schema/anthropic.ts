import { z } from 'zod';

// ─────────────────────────────────────────────────────────────────────────────
// Content blocks
// ─────────────────────────────────────────────────────────────────────────────
// Images and documents are not supported by DeepSeek's Anthropic-compatible
// endpoint, so only text / tool_use / tool_result blocks are modeled here.

const TextBlockSchema = z.object({
	type: z.literal('text'),
	text: z.string(),
});

const ToolUseBlockSchema = z.object({
	type: z.literal('tool_use'),
	id: z.string(),
	name: z.string(),
	// Tool input is an arbitrary JSON object shaped by the tool's input_schema.
	input: z.record(z.string(), z.unknown()),
});

const ToolResultBlockSchema = z.object({
	type: z.literal('tool_result'),
	tool_use_id: z.string(),
	content: z.union([z.string(), z.array(TextBlockSchema)]).optional(),
	is_error: z.boolean().optional(),
});

const ThinkingBlockSchema = z.object({
	type: z.literal('thinking'),
	thinking: z.string(),
	signature: z.string(),
});

const RedactedThinkingBlockSchema = z.object({
	type: z.literal('redacted_thinking'),
	data: z.string(),
});

const ContentBlockSchema = z.union([
	TextBlockSchema,
	ToolUseBlockSchema,
	ToolResultBlockSchema,
	ThinkingBlockSchema,
	RedactedThinkingBlockSchema,
]);

const MessageContentSchema = z.union([z.string(), z.array(ContentBlockSchema)]);

const AnthropicMessageSchema = z.object({
	role: z.enum(['user', 'assistant']),
	content: MessageContentSchema,
});
export type AnthropicMessage = z.infer<typeof AnthropicMessageSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// Tools
// ─────────────────────────────────────────────────────────────────────────────

const AnthropicToolSchema = z.object({
	name: z.string(),
	description: z.string().optional(),
	// input_schema is an arbitrary JSON Schema object defined by the caller.
	input_schema: z.record(z.string(), z.unknown()),
});

const ToolChoiceSchema = z.union([
	z.object({
		type: z.literal('auto'),
		disable_parallel_tool_use: z.boolean().optional(),
	}),
	z.object({
		type: z.literal('any'),
		disable_parallel_tool_use: z.boolean().optional(),
	}),
	z.object({
		type: z.literal('tool'),
		name: z.string(),
		disable_parallel_tool_use: z.boolean().optional(),
	}),
]);

// ─────────────────────────────────────────────────────────────────────────────
// Thinking mode
// ─────────────────────────────────────────────────────────────────────────────

const ThinkingConfigSchema = z.union([
	z.object({ type: z.literal('enabled'), budget_tokens: z.number() }),
	z.object({ type: z.literal('disabled') }),
]);

// ─────────────────────────────────────────────────────────────────────────────
// Create Message
// ─────────────────────────────────────────────────────────────────────────────

export const AnthropicCreateMessageInputSchema = z.object({
	model: z.enum(['deepseek-chat', 'deepseek-reasoner']),
	maxTokens: z.number(),
	messages: z.array(AnthropicMessageSchema),
	system: z.union([z.string(), z.array(TextBlockSchema)]).optional(),
	stopSequences: z.array(z.string()).optional(),
	temperature: z.number().min(0).max(1).optional(),
	topP: z.number().min(0).max(1).optional(),
	topK: z.number().optional(),
	tools: z.array(AnthropicToolSchema).optional(),
	toolChoice: ToolChoiceSchema.optional(),
	thinking: ThinkingConfigSchema.optional(),
	metadata: z.object({ user_id: z.string().optional() }).optional(),
});
export type AnthropicCreateMessageInput = z.infer<
	typeof AnthropicCreateMessageInputSchema
>;

export const AnthropicCreateMessageResponseSchema = z.object({
	id: z.string(),
	type: z.literal('message'),
	role: z.literal('assistant'),
	model: z.string(),
	content: z.array(ContentBlockSchema),
	stop_reason: z
		.enum(['end_turn', 'max_tokens', 'stop_sequence', 'tool_use'])
		.nullable(),
	stop_sequence: z.string().nullable().optional(),
	usage: z.object({
		input_tokens: z.number(),
		output_tokens: z.number(),
		cache_creation_input_tokens: z.number().nullable().optional(),
		cache_read_input_tokens: z.number().nullable().optional(),
	}),
});
export type AnthropicCreateMessageResponse = z.infer<
	typeof AnthropicCreateMessageResponseSchema
>;
