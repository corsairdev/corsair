import { z } from 'zod';

export const ListProjectsInputSchema = z.object({
	page: z.number().optional(),
});
export type ListProjectsInput = z.infer<typeof ListProjectsInputSchema>;

export const CreateConversationInputSchema = z.object({
	projectId: z.number(),
	name: z.string().optional(),
});
export type CreateConversationInput = z.infer<
	typeof CreateConversationInputSchema
>;

export const SendMessageInputSchema = z.object({
	projectId: z.number(),
	sessionId: z.string(),
	prompt: z.string(),
});
export type SendMessageInput = z.infer<typeof SendMessageInputSchema>;

export const GetMessagesInputSchema = z.object({
	projectId: z.number(),
	sessionId: z.string(),
	page: z.number().optional(),
});
export type GetMessagesInput = z.infer<typeof GetMessagesInputSchema>;

export const ProjectSchema = z
	.object({
		id: z.coerce.number(),
		project_name: z.string(),
		sitemap_path: z.string().nullable().optional(),
		is_chat_active: z.union([z.boolean(), z.number()]).nullable().optional(),
	})
	.passthrough();

export const ListProjectsResponseSchema = z.object({
	status: z.string(),
	data: z
		.object({
			current_page: z.number().optional(),
			data: z.array(ProjectSchema),
		})
		.passthrough(),
});
export type ListProjectsResponse = z.infer<typeof ListProjectsResponseSchema>;

export const CreateConversationResponseSchema = z.object({
	status: z.string(),
	data: z
		.object({
			session_id: z.string(),
			conversation_name: z.string().nullable().optional(),
		})
		.passthrough(),
});
export type CreateConversationResponse = z.infer<
	typeof CreateConversationResponseSchema
>;

export const SendMessageResponseSchema = z.object({
	status: z.string(),
	data: z
		.object({
			id: z.coerce.number().optional(),
			openai_response: z.string(),
			// Citation objects differ per project and can be strings, IDs, or detailed metadata objects.
			// Kept generic as z.unknown() to prevent strict validation failures on evolving API formats.
			citations: z.array(z.unknown()).nullable().optional(),
		})
		.passthrough(),
});
export type SendMessageResponse = z.infer<typeof SendMessageResponseSchema>;

export const MessageSchema = z
	.object({
		id: z.coerce.number(),
		user_query: z.string().nullable().optional(),
		openai_response: z.string().nullable().optional(),
		role: z.string().optional(),
	})
	.passthrough();

export const GetMessagesResponseSchema = z.object({
	status: z.string(),
	data: z.union([
		z
			.object({
				current_page: z.number().optional(),
				data: z.array(MessageSchema),
			})
			.passthrough(),
		z.array(MessageSchema),
	]),
});
export type GetMessagesResponse = z.infer<typeof GetMessagesResponseSchema>;

export type CustomGPTEndpointInputs = {
	listProjects: ListProjectsInput;
	createConversation: CreateConversationInput;
	sendMessage: SendMessageInput;
	getMessages: GetMessagesInput;
};

export type CustomGPTEndpointOutputs = {
	listProjects: ListProjectsResponse;
	createConversation: CreateConversationResponse;
	sendMessage: SendMessageResponse;
	getMessages: GetMessagesResponse;
};

export const CustomGPTEndpointInputSchemas = {
	listProjects: ListProjectsInputSchema,
	createConversation: CreateConversationInputSchema,
	sendMessage: SendMessageInputSchema,
	getMessages: GetMessagesInputSchema,
} as const;

export const CustomGPTEndpointOutputSchemas = {
	listProjects: ListProjectsResponseSchema,
	createConversation: CreateConversationResponseSchema,
	sendMessage: SendMessageResponseSchema,
	getMessages: GetMessagesResponseSchema,
} as const;
