import { z } from 'zod';

const FaqSortBySchema = z.enum([
	'id',
	'bot_id',
	'question',
	'answer',
	'error_reason',
	'status',
	'characters',
	'migration_status',
	'created_at',
	'updated_at',
]);

const ChatHistoryItemSchema = z
	.object({
		message: z.string().optional(),
		sent: z.boolean().optional(),
	})
	.passthrough();

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
	chat_history: z.array(ChatHistoryItemSchema).optional(),
});

export type GenerateResponseInput = z.infer<typeof GenerateResponseInputSchema>;

const GenerateResponseResponseSchema = z
	.object({
		answer: z.string(),
		message_id: z.string().uuid().optional(),
		sources: z.array(z.unknown()).optional(),
		chat_history: z.array(z.unknown()).optional(),
		generated_images: z.array(z.string()).nullable().optional(),
		follow_up_questions: z.array(z.string()).optional(),
		human_handoff_status: z.boolean().optional(),
		user_options: z.array(z.unknown()).optional(),
		chat_ended: z.boolean().optional(),
		end_chat_feedback: z.string().optional(),
	})
	.passthrough();

export type GenerateResponseResponse = z.infer<
	typeof GenerateResponseResponseSchema
>;

const GetAllFaqsInputSchema = z.object({
	search_query: z.string().optional(),
	sort_by: FaqSortBySchema.optional(),
	sort_order: z.enum(['asc', 'desc']).optional(),
	page: z.number().int().positive().optional(),
	size: z.number().int().positive().optional(),
});

export type GetAllFaqsInput = z.infer<typeof GetAllFaqsInputSchema>;

const FaqItemSchema = z
	.object({
		id: z.union([z.string(), z.number()]).optional(),
		question: z.string().optional(),
		answer: z.string().optional(),
	})
	.passthrough();

const GetAllFaqsResponseSchema = z
	.object({
		items: z.array(FaqItemSchema).optional(),
		total: z.number().optional(),
		page: z.number().optional(),
		size: z.number().optional(),
	})
	.passthrough();

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
