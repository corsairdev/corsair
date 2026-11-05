import { z } from 'zod';

export const OpenRouterModelEntity = z.object({
	id: z.string(),
	name: z.string().optional(),
	description: z.string().optional(),
	context_length: z.number().optional(),
	created: z.number().optional(),
});
export type OpenRouterModelEntity = z.infer<typeof OpenRouterModelEntity>;

export const OpenRouterProviderEntity = z.object({
	slug: z.string(),
	name: z.string(),
	headquarters: z.string().nullable().optional(),
});
export type OpenRouterProviderEntity = z.infer<typeof OpenRouterProviderEntity>;

export const OpenRouterGenerationEntity = z.object({
	id: z.string(),
	model: z.string().optional(),
	provider: z.string().optional(),
	total_cost: z.number().nullable().optional(),
	prompt_tokens: z.number().optional(),
	completion_tokens: z.number().optional(),
	created_at: z.string().optional(),
});
export type OpenRouterGenerationEntity = z.infer<
	typeof OpenRouterGenerationEntity
>;
