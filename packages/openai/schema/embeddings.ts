import { z } from 'zod';

export const EmbeddingsCreateInputSchema = z.object({
	model: z.string(),
	input: z.union([
		z.string(),
		z.array(z.string()),
		z.array(z.number()),
		z.array(z.array(z.number())),
	]),
	encodingFormat: z.enum(['float', 'base64']).optional(),
	dimensions: z.number().optional(),
	user: z.string().optional(),
});
export type EmbeddingsCreateInput = z.infer<typeof EmbeddingsCreateInputSchema>;

const EmbeddingObjectSchema = z.object({
	object: z.literal('embedding'),
	embedding: z.union([z.array(z.number()), z.string()]),
	index: z.number(),
});

export const EmbeddingsCreateResponseSchema = z.object({
	object: z.literal('list'),
	data: z.array(EmbeddingObjectSchema),
	model: z.string(),
	usage: z.object({
		prompt_tokens: z.number(),
		total_tokens: z.number(),
	}),
});
export type EmbeddingsCreateResponse = z.infer<
	typeof EmbeddingsCreateResponseSchema
>;
