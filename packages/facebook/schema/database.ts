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
		// unknown: Messenger attachment payloads vary by attachment type and are not stable enough for a stricter shared schema.
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
		// unknown: the conversations endpoint returns evolving Graph API fields that are preserved verbatim for debugging and replay.
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
		// unknown: the Page picture object can contain nested variant-specific fields that differ across Graph API responses.
		picture: z.unknown().optional(),
		createdAt: z.coerce.date().nullable().optional(),
		// unknown: the raw page response is stored as-is because Graph API page fields are caller-dependent and extensible.
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
		// unknown: quick reply payloads are application-defined and may include arbitrary nested metadata.
		quick_reply: z.unknown().optional(),
		// unknown: reply_to payloads are passed through from Messenger and can vary across message reply surfaces.
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
		// unknown: the raw Messenger webhook event is preserved because event payloads differ by subtype and Meta can add fields over time.
		raw: z.unknown().optional(),
	})
	.passthrough();

export type FacebookParticipant = z.infer<typeof FacebookParticipant>;
export type FacebookMessageAttachment = z.infer<
	typeof FacebookMessageAttachment
>;
export type FacebookConversation = z.infer<typeof FacebookConversation>;
export type FacebookPage = z.infer<typeof FacebookPage>;
export type FacebookMessage = z.infer<typeof FacebookMessage>;
