import { z } from 'zod';
import {
	FacebookConversation as FacebookConversationEntitySchema,
	FacebookMessage as FacebookMessageEntitySchema,
	FacebookPage as FacebookPageEntitySchema,
} from '../schema/database';

const SendMessageInputSchema = z.object({
	recipientId: z.string().min(1),
	text: z.string().min(1),
	messagingType: z.enum(['RESPONSE', 'UPDATE', 'MESSAGE_TAG']).optional(),
	tag: z.string().optional(),
	pageId: z.string().optional(),
	personaId: z.string().optional(),
});

const SendMessageResponseSchema = z
	.object({
		recipient_id: z.string().optional(),
		message_id: z.string().optional(),
	})
	.passthrough();

const GetPageDetailsInputSchema = z.object({
	pageId: z.string().min(1),
	fields: z.array(z.string().min(1)).optional(),
});

const GetPageDetailsResponseSchema = FacebookPageEntitySchema;

const ListConversationsInputSchema = z.object({
	pageId: z.string().min(1),
	platform: z.string().optional(),
	userId: z.string().optional(),
	folder: z.string().optional(),
	limit: z.number().int().positive().max(100).optional(),
	after: z.string().optional(),
	before: z.string().optional(),
	persist: z.boolean().optional(),
});

const ListConversationsResponseSchema = z.object({
	conversations: z.array(FacebookConversationEntitySchema),
	count: z.number().int().min(0),
	paging: z
		.object({
			cursors: z
				.object({
					before: z.string().optional(),
					after: z.string().optional(),
				})
				.passthrough()
				.optional(),
			next: z.string().optional(),
			previous: z.string().optional(),
		})
		.passthrough()
		.optional(),
});

const GetMessagesInputSchema = z.object({
	limit: z.number().int().positive().max(100).optional(),
	offset: z.number().int().min(0).optional(),
	conversationId: z.string().optional(),
	recipientId: z.string().optional(),
	direction: z.enum(['inbound', 'outbound']).optional(),
	status: z.enum(['sent', 'delivered', 'read', 'received']).optional(),
});

const GetMessagesResponseSchema = z.object({
	messages: z.array(FacebookMessageEntitySchema),
	count: z.number().int().min(0),
});

export type SendMessageInput = z.infer<typeof SendMessageInputSchema>;
export type SendMessageResponse = z.infer<typeof SendMessageResponseSchema>;
export type GetPageDetailsInput = z.infer<typeof GetPageDetailsInputSchema>;
export type GetPageDetailsResponse = z.infer<typeof GetPageDetailsResponseSchema>;
export type ListConversationsInput = z.infer<typeof ListConversationsInputSchema>;
export type ListConversationsResponse = z.infer<typeof ListConversationsResponseSchema>;
export type GetMessagesInput = z.infer<typeof GetMessagesInputSchema>;
export type GetMessagesResponse = z.infer<typeof GetMessagesResponseSchema>;

export type FacebookEndpointInputs = {
	sendMessage: SendMessageInput;
	getPageDetails: GetPageDetailsInput;
	listConversations: ListConversationsInput;
	getMessages: GetMessagesInput;
};

export type FacebookEndpointOutputs = {
	sendMessage: SendMessageResponse;
	getPageDetails: GetPageDetailsResponse;
	listConversations: ListConversationsResponse;
	getMessages: GetMessagesResponse;
};

export const FacebookEndpointInputSchemas = {
	sendMessage: SendMessageInputSchema,
	getPageDetails: GetPageDetailsInputSchema,
	listConversations: ListConversationsInputSchema,
	getMessages: GetMessagesInputSchema,
} as const;

export const FacebookEndpointOutputSchemas = {
	sendMessage: SendMessageResponseSchema,
	getPageDetails: GetPageDetailsResponseSchema,
	listConversations: ListConversationsResponseSchema,
	getMessages: GetMessagesResponseSchema,
} as const;
