import { z } from 'zod';

export const ModelsListInputSchema = z.object({});
export type ModelsListInput = z.infer<typeof ModelsListInputSchema>;

const ModelObjectSchema = z.object({
	id: z.string(),
	object: z.literal('model'),
	created: z.number(),
	owned_by: z.string(),
});
export type ModelObject = z.infer<typeof ModelObjectSchema>;

export const ModelsListResponseSchema = z.object({
	object: z.literal('list'),
	data: z.array(ModelObjectSchema),
});
export type ModelsListResponse = z.infer<typeof ModelsListResponseSchema>;

export const ModelsRetrieveInputSchema = z.object({
	model: z.string(),
});
export type ModelsRetrieveInput = z.infer<typeof ModelsRetrieveInputSchema>;

export const ModelsRetrieveResponseSchema = ModelObjectSchema;
export type ModelsRetrieveResponse = z.infer<
	typeof ModelsRetrieveResponseSchema
>;

// --- Engines (legacy, deprecated) ---

export const EnginesListInputSchema = z.object({});
export type EnginesListInput = z.infer<typeof EnginesListInputSchema>;

const EngineObjectSchema = z.object({
	id: z.string(),
	object: z.literal('engine'),
	owner: z.string().optional(),
	ready: z.boolean().optional(),
});
export type EngineObject = z.infer<typeof EngineObjectSchema>;

export const EnginesListResponseSchema = z.object({
	object: z.literal('list'),
	data: z.array(EngineObjectSchema),
});
export type EnginesListResponse = z.infer<typeof EnginesListResponseSchema>;

export const EnginesRetrieveInputSchema = z.object({
	engineId: z.string(),
});
export type EnginesRetrieveInput = z.infer<typeof EnginesRetrieveInputSchema>;

export const EnginesRetrieveResponseSchema = EngineObjectSchema;
export type EnginesRetrieveResponse = z.infer<
	typeof EnginesRetrieveResponseSchema
>;
