import { z } from 'zod';

/** A Mailchimp audience/list. */
export const MailchimpList = z.object({
	id: z.string(),
	web_id: z.number().optional(),
	name: z.string(),
	date_created: z.coerce.date().nullable().optional(),
	stats: z.record(z.string(), z.unknown()).optional(),
});
export type MailchimpList = z.infer<typeof MailchimpList>;

/** A list member (subscriber). `id` is the MD5 subscriber hash. */
export const MailchimpMember = z.object({
	id: z.string(),
	list_id: z.string(),
	email_address: z.string(),
	status: z.string(),
	full_name: z.string().optional(),
	last_changed: z.coerce.date().nullable().optional(),
});
export type MailchimpMember = z.infer<typeof MailchimpMember>;

/** A campaign. */
export const MailchimpCampaign = z.object({
	id: z.string(),
	web_id: z.number().optional(),
	type: z.string().optional(),
	status: z.string().optional(),
	create_time: z.coerce.date().nullable().optional(),
});
export type MailchimpCampaign = z.infer<typeof MailchimpCampaign>;
