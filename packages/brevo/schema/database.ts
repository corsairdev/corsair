import { z } from 'zod';

/**
 * Brevo Contact Entity Schema
 * @see https://developers.brevo.com/reference/getcontactinfo
 */
export const BrevoContact = z
	.object({
		id: z.union([z.number(), z.string()]),
		email: z.string().optional(),
		emailBlacklisted: z.boolean().optional(),
		smsBlacklisted: z.boolean().optional(),
		createdAt: z.coerce.date().nullable().optional(),
		modifiedAt: z.coerce.date().nullable().optional(),
		attributes: z.record(z.string(), z.unknown()).optional(),
	})
	.catchall(z.unknown());

/**
 * Brevo Email Campaign Entity Schema
 * @see https://developers.brevo.com/reference/getemailcampaign
 */
export const BrevoCampaign = z
	.object({
		id: z.union([z.number(), z.string()]),
		name: z.string(),
		subject: z.string().optional(),
		type: z.string().optional(),
		status: z.string().optional(),
		scheduledAt: z.coerce.date().nullable().optional(),
		createdAt: z.coerce.date().nullable().optional(),
		modifiedAt: z.coerce.date().nullable().optional(),
	})
	.catchall(z.unknown());

export type BrevoContact = z.infer<typeof BrevoContact>;
export type BrevoCampaign = z.infer<typeof BrevoCampaign>;
