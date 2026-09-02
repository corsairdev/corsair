import { z } from 'zod';

/**
 * Locally persisted Botbaba entities.
 *
 * Only slow-changing structural records are mirrored: bots and conversations.
 * Messages and analytics are high-volume / always-live, so they are not
 * cached locally.
 */

const S = z.string().nullable().optional();
const B = z.boolean().nullable().optional();

export const BotbabaBotEntity = z
	.object({
		id: z.string(),
		name: z.string(),
		description: S,
		status: S,
		channel: S,
		welcomeMessage: S,
		createdAt: z.coerce.date().nullable().optional(),
		updatedAt: z.coerce.date().nullable().optional(),
		isActive: B,
	})
	.loose();
export type BotbabaBotEntity = z.infer<typeof BotbabaBotEntity>;

export const BotbabaConversationEntity = z
	.object({
		id: z.string(),
		botId: z.string(),
		userId: S,
		channel: S,
		status: S,
		createdAt: z.coerce.date().nullable().optional(),
		updatedAt: z.coerce.date().nullable().optional(),
	})
	.loose();
export type BotbabaConversationEntity = z.infer<
	typeof BotbabaConversationEntity
>;
