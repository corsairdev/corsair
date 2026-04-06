import { z } from 'zod';
import {
	WhatsAppConversation as WhatsAppConversationEntitySchema,
	WhatsAppMessage as WhatsAppMessageEntitySchema,
} from '../schema/database';

const SendMessageInputSchema = z.object({
	phoneNumberId: z.string(),
	to: z.string(),
	text: z.string().min(1),
	recipient_type: z.enum(['individual', 'group']).optional(),
	preview_url: z.boolean().optional(),
});

const SendMessageResponseSchema = z
	.object({
		messaging_product: z.string().optional(),
		contacts: z
			.array(
				z
					.object({
						input: z.string().optional(),
						wa_id: z.string().optional(),
					})
					.passthrough(),
			)
			.optional(),
		messages: z
			.array(
				z
					.object({
						id: z.string(),
						message_status: z.string().optional(),
					})
					.passthrough(),
			)
			.optional(),
	})
	.passthrough();

const GetMessagesInputSchema = z.object({
	limit: z.number().int().positive().max(100).optional(),
	offset: z.number().int().min(0).optional(),
	phoneNumberId: z.string().optional(),
	contactWaId: z.string().optional(),
	direction: z.enum(['inbound', 'outbound']).optional(),
	status: z.string().optional(),
});

const GetMessagesResponseSchema = z.object({
	messages: z.array(WhatsAppMessageEntitySchema),
	count: z.number().int().min(0),
});

const ListConversationsInputSchema = z.object({
	limit: z.number().int().positive().max(100).optional(),
	offset: z.number().int().min(0).optional(),
	category: z.string().optional(),
});

const ListConversationsResponseSchema = z.object({
	conversations: z.array(WhatsAppConversationEntitySchema),
	count: z.number().int().min(0),
});

export type SendMessageInput = z.infer<typeof SendMessageInputSchema>;
export type SendMessageResponse = z.infer<typeof SendMessageResponseSchema>;
export type GetMessagesInput = z.infer<typeof GetMessagesInputSchema>;
export type GetMessagesResponse = z.infer<typeof GetMessagesResponseSchema>;
export type ListConversationsInput = z.infer<typeof ListConversationsInputSchema>;
export type ListConversationsResponse = z.infer<typeof ListConversationsResponseSchema>;

export type WhatsAppEndpointInputs = {
	sendMessage: SendMessageInput;
	getMessages: GetMessagesInput;
	listConversations: ListConversationsInput;
};

export type WhatsAppEndpointOutputs = {
	sendMessage: SendMessageResponse;
	getMessages: GetMessagesResponse;
	listConversations: ListConversationsResponse;
};

export const WhatsAppEndpointInputSchemas = {
	sendMessage: SendMessageInputSchema,
	getMessages: GetMessagesInputSchema,
	listConversations: ListConversationsInputSchema,
} as const;

export const WhatsAppEndpointOutputSchemas = {
	sendMessage: SendMessageResponseSchema,
	getMessages: GetMessagesResponseSchema,
	listConversations: ListConversationsResponseSchema,
} as const;
