import { z } from 'zod';

/**
 * Resend Email Entity Schema
 * @see https://resend.com/docs/api-reference/emails/get-email
 */
export const ResendEmail = z
	.object({
		id: z.string(),
		from: z.string(),
		to: z.array(z.string()),
		subject: z.string().optional(),
		created_at: z.coerce.date().nullable().optional(),
	})
	.catchall(z.unknown());

/**
 * Resend Domain Entity Schema
 * @see https://resend.com/docs/api-reference/domains/get-domain
 */
export const ResendDomain = z
	.object({
		id: z.string(),
		name: z.string(),
		status: z.enum([
			'not_started',
			'validation',
			'scheduled',
			'ready',
			'error',
			'verified',
			'pending',
			'failed',
			'partially_verified',
			'partially_failed',
		]),
		created_at: z.coerce.date().nullable().optional(),
		region: z.string().optional(),
	})
	.catchall(z.unknown());

/**
 * Resend Contact Entity Schema
 * @see https://resend.com/docs/api-reference/contacts/get-contact
 */
export const ResendContact = z
	.object({
		id: z.string(),
		email: z.string(),
		first_name: z.string().nullable().optional(),
		last_name: z.string().nullable().optional(),
		created_at: z.coerce.date().nullable().optional(),
		unsubscribed: z.boolean().optional(),
	})
	.catchall(z.unknown());

export type ResendEmail = z.infer<typeof ResendEmail>;
export type ResendDomain = z.infer<typeof ResendDomain>;
export type ResendContact = z.infer<typeof ResendContact>;
