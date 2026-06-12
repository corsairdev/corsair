import { z } from 'zod';

export const WhatsappMessage = z
	.object({
		id: z.string(),
		from: z.string().optional(),
		to: z.string().optional(),
		type: z.string().optional(),
		text: z.string().optional(),
		status: z.string().optional(),
		direction: z.enum(['inbound', 'outbound']).optional(),
		timestamp: z.string().optional(),
		phoneNumberId: z.string().optional(),
		businessAccountId: z.string().optional(),
		errors: z.array(z.record(z.string(), z.unknown())).optional(),
		conversation: z.record(z.string(), z.unknown()).optional(),
		pricing: z.record(z.string(), z.unknown()).optional(),
		raw: z.record(z.string(), z.unknown()).optional(),
		rawStatus: z.record(z.string(), z.unknown()).optional(),
		createdAt: z.coerce.date().nullable().optional(),
	})
	.loose();

export const WhatsappContact = z
	.object({
		id: z.string(),
		waId: z.string(),
		name: z.string().optional(),
		createdAt: z.coerce.date().nullable().optional(),
	})
	.loose();

export const WhatsappPhoneNumber = z
	.object({
		id: z.string(),
		display_phone_number: z.string().optional(),
		verified_name: z.string().optional(),
		quality_rating: z.string().optional(),
		code_verification_status: z.string().optional(),
		platform_type: z.string().optional(),
		throughput: z.record(z.string(), z.unknown()).optional(),
		createdAt: z.coerce.date().nullable().optional(),
	})
	.loose();

export const WhatsappBusinessProfile = z
	.object({
		id: z.string(),
		phoneNumberId: z.string(),
		about: z.string().optional(),
		address: z.string().optional(),
		description: z.string().optional(),
		email: z.string().optional(),
		profile_picture_url: z.string().optional(),
		websites: z.array(z.string()).optional(),
		vertical: z.string().optional(),
		createdAt: z.coerce.date().nullable().optional(),
	})
	.loose();

export type WhatsappMessage = z.infer<typeof WhatsappMessage>;
export type WhatsappContact = z.infer<typeof WhatsappContact>;
export type WhatsappPhoneNumber = z.infer<typeof WhatsappPhoneNumber>;
export type WhatsappBusinessProfile = z.infer<typeof WhatsappBusinessProfile>;
