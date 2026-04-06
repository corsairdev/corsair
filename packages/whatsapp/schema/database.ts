import { z } from 'zod';

export const WhatsAppContactProfile = z
	.object({
		name: z.string().optional(),
	})
	.passthrough();

export const WhatsAppContact = z
	.object({
		profile: WhatsAppContactProfile.optional(),
		wa_id: z.string().optional(),
	})
	.passthrough();

export const WhatsAppConversation = z
	.object({
		id: z.string(),
		expiration_timestamp: z.string().optional(),
		origin: z
			.object({
				type: z.string().optional(),
			})
			.passthrough()
			.optional(),
			category: z.string().optional(),
			createdAt: z.coerce.date().nullable().optional(),
	})
	.passthrough();

export const WhatsAppMessage = z
	.object({
		id: z.string(),
		messaging_product: z.string().optional(),
		from: z.string().optional(),
		to: z.string().optional(),
		wa_id: z.string().optional(),
		recipient_id: z.string().optional(),
		status: z.string().optional(),
		type: z.string().optional(),
		text: z
			.object({
				body: z.string().optional(),
				preview_url: z.boolean().optional(),
			})
			.passthrough()
			.optional(),
		timestamp: z.string().optional(),
		phone_number_id: z.string().optional(),
		display_phone_number: z.string().optional(),
		conversation: z
			.object({
				id: z.string().optional(),
				expiration_timestamp: z.string().optional(),
				origin: z
					.object({
						type: z.string().optional(),
					})
					.passthrough()
					.optional(),
			})
			.passthrough()
			.optional(),
		pricing: z
			.object({
				billable: z.boolean().optional(),
				category: z.string().optional(),
				pricing_model: z.string().optional(),
			})
			.passthrough()
			.optional(),
		profile: WhatsAppContactProfile.optional(),
		contacts: z.array(WhatsAppContact).optional(),
		direction: z.enum(['inbound', 'outbound']).optional(),
		authorId: z.string().optional(),
		createdAt: z.coerce.date().nullable().optional(),
		raw: z.unknown().optional(),
	})
	.passthrough();

export type WhatsAppContactProfile = z.infer<typeof WhatsAppContactProfile>;
export type WhatsAppContact = z.infer<typeof WhatsAppContact>;
export type WhatsAppConversation = z.infer<typeof WhatsAppConversation>;
export type WhatsAppMessage = z.infer<typeof WhatsAppMessage>;
