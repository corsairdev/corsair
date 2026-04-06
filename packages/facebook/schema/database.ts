import { z } from 'zod';

export const FacebookParticipant = z
	.object({
		id: z.string().optional(),
		name: z.string().optional(),
		email: z.string().optional(),
		username: z.string().optional(),
	})
	.passthrough();

export const FacebookMessageAttachment = z
	.object({
		type: z.string().optional(),
		payload: z.unknown().optional(),
	})
	.passthrough();

export const FacebookConversation = z
	.object({
		id: z.string(),
		page_id: z.string().optional(),
		link: z.string().optional(),
		updated_time: z.string().optional(),
		message_count: z.number().int().min(0).optional(),
		unread_count: z.number().int().min(0).optional(),
		snippet: z.string().optional(),
		can_reply: z.boolean().optional(),
		senders: z.array(FacebookParticipant).optional(),
		participants: z.array(FacebookParticipant).optional(),
		createdAt: z.coerce.date().nullable().optional(),
		raw: z.unknown().optional(),
	})
	.passthrough();

export const FacebookPage = z
	.object({
		id: z.string(),
		name: z.string().optional(),
		about: z.string().optional(),
		category: z.string().optional(),
		description: z.string().optional(),
		website: z.string().optional(),
		phone: z.string().optional(),
		fan_count: z.number().optional(),
		followers_count: z.number().optional(),
		verification_status: z.string().optional(),
		is_verified: z.boolean().optional(),
		link: z.string().optional(),
		username: z.string().optional(),
		picture: z.unknown().optional(),
		createdAt: z.coerce.date().nullable().optional(),
		raw: z.unknown().optional(),
	})
	.passthrough();

export const FacebookMessage = z
	.object({
		id: z.string(),
		mid: z.string().optional(),
		page_id: z.string().optional(),
		conversation_id: z.string().optional(),
		from: FacebookParticipant.optional(),
		to: z.array(FacebookParticipant).optional(),
		recipient_id: z.string().optional(),
		sender_id: z.string().optional(),
		text: z.string().optional(),
		attachments: z.array(FacebookMessageAttachment).optional(),
		quick_reply: z.unknown().optional(),
		reply_to: z.unknown().optional(),
		is_echo: z.boolean().optional(),
		app_id: z.number().optional(),
		metadata: z.string().optional(),
		delivery: z
			.object({
				mids: z.array(z.string()).optional(),
				watermark: z.number().optional(),
				seq: z.number().optional(),
			})
			.passthrough()
			.optional(),
		read: z
			.object({
				watermark: z.number().optional(),
				seq: z.number().optional(),
			})
			.passthrough()
			.optional(),
		status: z.enum(['sent', 'delivered', 'read', 'received']).optional(),
		direction: z.enum(['inbound', 'outbound']).optional(),
		timestamp: z.number().optional(),
		authorId: z.string().optional(),
		createdAt: z.coerce.date().nullable().optional(),
		raw: z.unknown().optional(),
	})
	.passthrough();

export type FacebookParticipant = z.infer<typeof FacebookParticipant>;
export type FacebookMessageAttachment = z.infer<typeof FacebookMessageAttachment>;
export type FacebookConversation = z.infer<typeof FacebookConversation>;
export type FacebookPage = z.infer<typeof FacebookPage>;
export type FacebookMessage = z.infer<typeof FacebookMessage>;
