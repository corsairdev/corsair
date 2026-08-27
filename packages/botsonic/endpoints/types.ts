import { z } from 'zod';

const GenerateResponseInputSchema = z.object({
	input_text: z.string().min(1),
	chat_id: z.string().uuid(),
	source: z.string().optional(),
	starter_question_id: z.string().uuid().optional(),
	is_business_api_request: z.boolean().optional(),
	is_integration_request: z.boolean().optional(),
	integration_user_identifier: z.string().optional(),
	user_unique_identifier: z.string().optional(),
	response_type: z.enum(['text', 'html', 'markdown', 'mrkdwn']).optional(),
	chat_user_id: z.string().optional(),
	extra_metadata: z.record(z.string(), z.unknown()).optional(),
	full_history: z.boolean().optional(),
	message_id: z.string().uuid().optional(),
	timeout: z.number().optional(),
});

export type GenerateResponseInput = z.infer<typeof GenerateResponseInputSchema>;

const GenerateResponseResponseSchema = z.unknown();

export type GenerateResponseResponse = z.infer<
	typeof GenerateResponseResponseSchema
>;

const GetAllFaqsInputSchema = z.object({
	search_query: z.string().optional(),
	sort_by: z.string().optional(),
	sort_order: z.enum(['asc', 'desc']).optional(),
	page: z.number().int().positive().optional(),
	size: z.number().int().positive().optional(),
});

export type GetAllFaqsInput = z.infer<typeof GetAllFaqsInputSchema>;

const GetAllFaqsResponseSchema = z.unknown();

export type GetAllFaqsResponse = z.infer<typeof GetAllFaqsResponseSchema>;

export type BotsonicEndpointInputs = {
	generateResponse: GenerateResponseInput;
	getAllFaqs: GetAllFaqsInput;
};

export type BotsonicEndpointOutputs = {
	generateResponse: GenerateResponseResponse;
	getAllFaqs: GetAllFaqsResponse;
};

export const BotsonicEndpointInputSchemas = {
	generateResponse: GenerateResponseInputSchema,
	getAllFaqs: GetAllFaqsInputSchema,
} as const;

export const BotsonicEndpointOutputSchemas = {
	generateResponse: GenerateResponseResponseSchema,
	getAllFaqs: GetAllFaqsResponseSchema,
} as const;
