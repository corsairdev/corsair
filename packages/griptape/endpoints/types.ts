import { z } from 'zod';

export const AssistantDetailSchema = z.object({
	assistant_id: z.uuid(),
	created_at: z.string().datetime(),
	created_by: z.string(),
	description: z.string(),
	input: z.string().optional(),
	knowledge_base_ids: z.array(z.uuid()),
	model: z.string().optional(),
	name: z.string(),
	organization_id: z.uuid(),
	retriever_ids: z.array(z.uuid()),
	ruleset_ids: z.array(z.uuid()),
	structure_ids: z.array(z.uuid()),
	tool_ids: z.array(z.uuid()),
	updated_at: z.string().datetime(),
});

const AssistantGetInputSchema = z.object({
	assistant_id: z.uuid(),
});

const AssistantGetResponseSchema = AssistantDetailSchema;

const PaginationSchema = z.object({
	next_page: z.number().optional(),
	page_number: z.number(),
	page_size: z.number(),
	previous_page: z.number().optional(),
	total_count: z.number(),
	total_pages: z.number(),
});

const AssistantListInputSchema = z.object({
	page: z.number().optional(),
	page_size: z.number().optional(),
});

const AssistantListResponseSchema = z.object({
	assistants: z.array(AssistantDetailSchema),
	pagination: PaginationSchema,
});

export type AssistantListInput = z.infer<typeof AssistantListInputSchema>;

export type AssistantListResponse = z.infer<typeof AssistantListResponseSchema>;

export type AssistantGetInput = z.infer<typeof AssistantGetInputSchema>;

export type AssistantGetResponse = z.infer<typeof AssistantGetResponseSchema>;

export type GriptapeEndpointInputs = {
	assistantList: AssistantListInput;
	assistantGet: AssistantGetInput;
};

export type GriptapeEndpointOutputs = {
	assistantList: AssistantListResponse;
	assistantGet: AssistantGetResponse;
};

export const GriptapeEndpointInputSchemas = {
	assistantList: AssistantListInputSchema,
	assistantGet: AssistantGetInputSchema,
} as const;

export const GriptapeEndpointOutputSchemas = {
	assistantList: AssistantListResponseSchema,
	assistantGet: AssistantGetResponseSchema,
} as const;
