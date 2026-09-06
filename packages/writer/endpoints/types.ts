import type { CorsairEndpoint, CorsairPluginContext } from 'corsair/core';
import { z } from 'zod';
import type { WriterSchema } from '../schema';

const ModelSchema = z.object({ id: z.string(), name: z.string() });
const ModelsResponseSchema = z.object({ models: z.array(ModelSchema) });
const CompletionChoiceSchema = z.object({
	text: z.string(),
	log_probs: z.unknown().nullable().optional(),
});
const CompletionInputSchema = z.object({
	model: z.string(),
	prompt: z.string(),
	max_tokens: z.number().int().positive().optional(),
	temperature: z.number().min(0).optional(),
	top_p: z.number().min(0).max(1).optional(),
	stop: z.array(z.string()).optional(),
	best_of: z.number().int().positive().optional(),
	random_seed: z.number().int().optional(),
	stream: z.boolean().optional(),
});
const CompletionResponseSchema = z.object({
	choices: z.array(CompletionChoiceSchema),
	model: z.string(),
});
const ChatMessageSchema = z.object({
	role: z.enum(['user', 'assistant', 'system', 'tool']),
	content: z.string(),
});
const ChatInputSchema = z.object({
	model: z.string(),
	messages: z.array(CHatMessageSchema).min(1),
	temperature: z.number().min(0).optional(),
	stream: z.boolean().optional(),
});
const ChatChoiceSchema = z.object({
	index: z.number().int(),
	finish_reason: z.string().nullable().optional(),
	message: z.object({ role: z.string(), content: z.string().nullable() }),
});
const ChatUsageSchema = z.object({
	prompt_tokens: z.number().int(),
	total_tokens: z.number().int(),
	completion_tokens: z.number().int(),
});
const ChatResponseSchema = z.object({
	id: z.string(),
	object: z.literal('chat.completion'),
	choices: z.array(ChatChoiceSchema).min(1),
	created: z.number().int(),
	model: z.string(),
	usage: ChatUsageSchema.optional(),
});
export type CompletionInput = x.infer<typeof CompletionInputSchema>;
export type ChatInput = z.infer<typeof ChatInputSchema>;
export type WriterEndpointInputs = {
	listModels: Record<string, never>;
	createCompletion: CompletionInput;
	createChat: ChatInput;
};
export type WriterEndpointOutputs = {
	listModels: z.infer<typeof ModelsResponseSchema>;
	createCompletion: z.infer<typeof CompletionResponseSchema>;
	createChat: z.infer<typeof ChatResponseSchema>;
};
export const WriterEndpointInputSchemas = {
	listModels: z.object({}),
	createCompletion: CompletionInputSchema,
	createChat: ChatInputSchema,
} as const;
export const WriterEndpointOutputSchemas = {
	listModels: ModelsResponseSchema,
	createCompletion: CompletionResponseSchema,
	createChat: ChatResponseSchema,
} as const;
type WriterEndpoint<K extends keyof WriterEndpointInputs> = CorsairEndpoint<
	CorsairPluginContext<typeof WriterSchema, Record<string, unknown>>,
	WriterEndpointInputs[K],
	WriterEndpointOutputs[K]
>;
export type WriterEndpoints = {
	listModels: WriterEndpoint<'listModels'>;
	createCompletion: WriterEndpoint<'createCompletion'>;
	createChat: WriterEndpoint<'createChat'>;
};
