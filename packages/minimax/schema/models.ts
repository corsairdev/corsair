import { z } from 'zod';
import { MiniMaxModelIdSchema } from './model-ids';

export const ListModelsInputSchema = z.object({});
export type ListModelsInput = z.infer<typeof ListModelsInputSchema>;

const ModelObjectSchema = z.object({
	id: MiniMaxModelIdSchema,
	object: z.literal('model'),
	owned_by: z.literal('minimax'),
});
export type ModelObject = z.infer<typeof ModelObjectSchema>;

export const ListModelsResponseSchema = z.object({
	object: z.literal('list'),
	data: z.array(ModelObjectSchema),
});
export type ListModelsResponse = z.infer<typeof ListModelsResponseSchema>;