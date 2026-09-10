import { z } from 'zod';
import { ChatfaiCharacter, ChatfaiConversation } from '../schema';

export const CharactersSearchInputSchema = z.object({
	q: z
		.string()
		.min(1)
		.describe('Search query for public characters by name or keyword'),
});
export type CharactersSearchInput = z.infer<typeof CharactersSearchInputSchema>;

export const CharactersSearchOutputSchema = z.object({
	characters: z.array(ChatfaiCharacter),
});
export type CharactersSearchOutput = z.infer<
	typeof CharactersSearchOutputSchema
>;

export const CharactersGetInputSchema = z.object({
	id: z.string().min(1).describe('Public character ID'),
});
export type CharactersGetInput = z.infer<typeof CharactersGetInputSchema>;

export const CharactersGetOutputSchema = ChatfaiCharacter;
export type CharactersGetOutput = z.infer<typeof CharactersGetOutputSchema>;

export const ConversationsListInputSchema = z.object({
	limit: z.number().int().positive().optional(),
	cursor: z.string().min(1).optional(),
});
export type ConversationsListInput = z.infer<
	typeof ConversationsListInputSchema
>;

export const ConversationsListOutputSchema = z.object({
	conversations: z.array(ChatfaiConversation),
	nextCursor: z.string().nullable().optional(),
});
export type ConversationsListOutput = z.infer<
	typeof ConversationsListOutputSchema
>;

export const ChatfaiEndpointInputSchemas = {
	charactersSearch: CharactersSearchInputSchema,
	charactersGet: CharactersGetInputSchema,
	conversationsList: ConversationsListInputSchema,
} as const;

export const ChatfaiEndpointOutputSchemas = {
	charactersSearch: CharactersSearchOutputSchema,
	charactersGet: CharactersGetOutputSchema,
	conversationsList: ConversationsListOutputSchema,
} as const;

export type ChatfaiEndpointInputs = {
	[K in keyof typeof ChatfaiEndpointInputSchemas]: z.infer<
		(typeof ChatfaiEndpointInputSchemas)[K]
	>;
};

export type ChatfaiEndpointOutputs = {
	[K in keyof typeof ChatfaiEndpointOutputSchemas]: z.infer<
		(typeof ChatfaiEndpointOutputSchemas)[K]
	>;
};
