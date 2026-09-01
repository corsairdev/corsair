import { z } from 'zod';

/**
 * Marketing Campaigns contact (ContactRequest / stored contact fields).
 * Official: PUT /v3/marketing/contacts
 * https://www.twilio.com/docs/sendgrid/api-reference/contacts/add-or-update-a-contact
 */
export const SendGridContact = z
	.object({
		id: z.string().optional(),
		email: z.string().email().optional(),
		phone_number_id: z.string().optional(),
		external_id: z.string().optional(),
		anonymous_id: z.string().optional(),
		first_name: z.string().optional(),
		last_name: z.string().optional(),
		address_line_1: z.string().optional(),
		address_line_2: z.string().optional(),
		alternate_emails: z.array(z.string()).optional(),
		city: z.string().optional(),
		country: z.string().optional(),
		postal_code: z.string().optional(),
		state_province_region: z.string().optional(),
		custom_fields: z
			.record(z.string(), z.union([z.string(), z.number()]))
			.optional(),
	})
	.catchall(z.unknown());

export type SendGridContact = z.infer<typeof SendGridContact>;

/**
 * Marketing Campaigns list.
 * Official: GET/POST /v3/marketing/lists
 * https://www.twilio.com/docs/sendgrid/api-reference/lists/get-all-lists
 */
export const SendGridList = z
	.object({
		id: z.string(),
		name: z.string(),
		contact_count: z.number(),
		_metadata: z.record(z.string(), z.unknown()).optional(),
	})
	.catchall(z.unknown());

export type SendGridList = z.infer<typeof SendGridList>;

/**
 * Bounce suppression record.
 * Official: GET /v3/suppression/bounces
 * https://www.twilio.com/docs/sendgrid/api-reference/bounces-api/retrieve-all-bounces
 */
export const SendGridBounce = z
	.object({
		created: z.number(),
		email: z.string(),
		reason: z.string(),
		status: z.string(),
	})
	.catchall(z.unknown());

export type SendGridBounce = z.infer<typeof SendGridBounce>;

/**
 * Verified sender identity.
 * Official: GET /v3/verified_senders (VerifiedSenderResponse)
 * https://www.twilio.com/docs/sendgrid/api-reference/sender-verification/get-all-verified-senders
 */
export const SendGridVerifiedSender = z
	.object({
		id: z.number(),
		nickname: z.string(),
		from_email: z.string(),
		from_name: z.string().optional(),
		reply_to: z.string().optional(),
		reply_to_name: z.string().optional(),
		address: z.string().optional(),
		address2: z.string().optional(),
		state: z.string().optional(),
		city: z.string().optional(),
		zip: z.string().optional(),
		country: z.string().optional(),
		verified: z.boolean(),
		locked: z.boolean().optional(),
	})
	.catchall(z.unknown());

export type SendGridVerifiedSender = z.infer<typeof SendGridVerifiedSender>;
