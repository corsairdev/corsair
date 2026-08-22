import { z } from 'zod';

export const BotSchema = z.object({
	id: z.string().describe('Unique identifier of the bot'),
	alias: z.string().nullable().optional().describe('Custom alias for the bot'),
	name: z.string().describe('Descriptive name of the bot'),
	description: z
		.string()
		.nullable()
		.optional()
		.describe('Brief description of the bot purpose'),
	blueprintId: z
		.string()
		.nullable()
		.optional()
		.describe('Associated blueprint ID'),
	datasetId: z
		.string()
		.nullable()
		.optional()
		.describe('Associated dataset ID for knowledge retrieval'),
	skillsetId: z
		.string()
		.nullable()
		.optional()
		.describe('Associated skillset ID for tools and capabilities'),
	backstory: z
		.string()
		.nullable()
		.optional()
		.describe(
			'Natural language instructions defining bot personality and behavior',
		),
	model: z
		.string()
		.nullable()
		.optional()
		.describe('AI model configured for the bot'),
	visibility: z
		.string()
		.nullable()
		.optional()
		.describe('Visibility access setting (e.g. private, protected, public)'),
	meta: z
		.record(z.string(), z.unknown())
		.nullable()
		.optional()
		.describe('Custom metadata attached to the bot'),
	createdAt: z
		.number()
		.nullable()
		.optional()
		.describe('Creation timestamp in milliseconds'),
	updatedAt: z
		.number()
		.nullable()
		.optional()
		.describe('Last updated timestamp in milliseconds'),
});
export type Bot = z.infer<typeof BotSchema>;

export const BotsListInputSchema = z.object({
	cursor: z.string().optional().describe('Cursor for pagination'),
	limit: z
		.number()
		.int()
		.positive()
		.max(100)
		.optional()
		.describe('Maximum number of items to return'),
	order: z
		.enum(['asc', 'desc'])
		.optional()
		.describe('Sort order by creation time'),
});
export type BotsListInput = z.infer<typeof BotsListInputSchema>;

export const BotsListResponseSchema = z.object({
	items: z.array(BotSchema).describe('List of bots matching the query'),
	cursor: z
		.string()
		.nullable()
		.optional()
		.describe('Pagination cursor for the next page of results'),
});
export type BotsListResponse = z.infer<typeof BotsListResponseSchema>;

export const BotsGetInputSchema = z.object({
	id: z.string().describe('Unique identifier or alias of the bot to fetch'),
});
export type BotsGetInput = z.infer<typeof BotsGetInputSchema>;

export const BotsGetResponseSchema = BotSchema;
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
