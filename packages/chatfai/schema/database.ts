import { z } from 'zod';

/**
 * Public ChatFAI character.
 * Official: GET /v1/characters/{id}
 * Official: GET /v1/characters/search?q=
 * https://chatfai.com/developers/docs#tag/characters/paths/~1characters~1{id}/get
 * https://chatfai.com/developers/docs#tag/characters/paths/~1characters~1search/get
 */
export const ChatfaiCharacter = z
	.object({
		id: z.string(),
		uid: z.string(),
		name: z.string(),
		nickname: z.string().nullable().optional(),
		publicDescription: z.string().nullable().optional(),
		image: z.string().nullable().optional(),
		visibility: z.string().optional(),
		categories: z.array(z.string()).optional(),
		featured: z.boolean().optional(),
		firstMessage: z.string().nullable().optional(),
		voiceEnabled: z.boolean().optional(),
		likes: z.number().optional(),
		installs: z.number().optional(),
		followers: z.number().optional(),
		createdAt: z.string().optional(),
		updatedAt: z.string().optional(),
	})
	.loose();

export type ChatfaiCharacter = z.infer<typeof ChatfaiCharacter>;

/**
 * Authenticated ChatFAI conversation.
 * Official: GET /v1/conversations
 * Live envelope: { data: Conversation[], nextCursor: string | null }
 */
export const ChatfaiConversation = z
	.object({
		id: z.string(),
		character_id: z.string().optional(),
		characterId: z.string().optional(),
		title: z.string().optional(),
		createdAt: z.string().optional(),
		updatedAt: z.string().optional(),
	})
	.loose();

export type ChatfaiConversation = z.infer<typeof ChatfaiConversation>;
