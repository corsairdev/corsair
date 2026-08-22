import { z } from 'zod';

const UUID_REGEX =
	/^[0-9(a-f|A-F)]{8}-[0-9(a-f|A-F)]{4}-4[0-9(a-f|A-F)]{3}-[89ab][0-9(a-f|A-F)]{3}-[0-9(a-f|A-F)]{12}$/;

export const AssistantDetailSchema = z.object({
	assistant_id: z.string().regex(UUID_REGEX),
	created_at: z.string().datetime(),
	created_by: z.string(),
	description: z.string(),
	input: z.string().optional(),
	knowledge_base_ids: z.array(z.string().regex(UUID_REGEX)),
	model: z.string().optional(),
	name: z.string(),
	organization_id: z.string().regex(UUID_REGEX),
	retriever_ids: z.array(z.string().regex(UUID_REGEX)),
	ruleset_ids: z.array(z.string().regex(UUID_REGEX)),
	structure_ids: z.array(z.string().regex(UUID_REGEX)),
	tool_ids: z.array(z.string().regex(UUID_REGEX)),
	updated_at: z.string().datetime(),
});

const AssistantGetInputSchema = z.object({
	assistant_id: z.string().regex(UUID_REGEX),
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
