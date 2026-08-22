import { z } from 'zod';

const BotSchema = z.object({
	id: z.string(),
	name: z.string(),
	description: z.string().nullable().optional(),
	model: z.string().nullable().optional(),
	backstory: z.string().nullable().optional(),
	createdAt: z.coerce.date().nullable().optional(),
	updatedAt: z.coerce.date().nullable().optional(),
});
export type Bot = z.infer<typeof BotSchema>;

const BotsListInputSchema = z.object({
	cursor: z.string().optional(),
	limit: z.number().int().positive().max(100).optional(),
	order: z.enum(['asc', 'desc']).optional(),
});
export type BotsListInput = z.infer<typeof BotsListInputSchema>;

const BotsListResponseSchema = z.object({
	data: z.array(BotSchema),
	meta: z.object({ cursor: z.string().nullable().optional() }).optional(),
});
export type BotsListResponse = z.infer<typeof BotsListResponseSchema>;

const BotsGetInputSchema = z.object({
	id: z.string(),
});
export type BotsGetInput = z.infer<typeof BotsGetInputSchema>;

const BotsGetResponseSchema = BotSchema;
export type BotsGetResponse = z.infer<typeof BotsGetResponseSchema>;

export type ChatbotkitEndpointInputs = {
	botsList: BotsListInput;
	botsGet: BotsGetInput;
};

export type ChatbotkitEndpointOutputs = {
	botsList: BotsListResponse;
	botsGet: BotsGetResponse;
};

export const ChatbotkitEndpointInputSchemas = {
	botsList: BotsListInputSchema,
	botsGet: BotsGetInputSchema,
} as const;

export const ChatbotkitEndpointOutputSchemas = {
	botsList: BotsListResponseSchema,
	botsGet: BotsGetResponseSchema,
} as const;
