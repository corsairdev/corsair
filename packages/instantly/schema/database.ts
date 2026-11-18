import { z } from 'zod';

// Local copies of what agents search for: who was contacted, in which
// campaign, and who replied. Rows are written when list/get/create/update
// endpoints return them. Email rows keep the preview, not the full body.

const str = z.string().nullish();
const num = z.number().nullish();
const bool = z.boolean().nullish();

export const InstantlyAccount = z.object({
	id: z.string().describe('The account email'),
	email: z.string(),
	first_name: str,
	last_name: str,
	status: num,
	warmup_status: num,
	provider_code: num,
	daily_limit: num,
	stat_warmup_score: num,
	timestamp_created: str,
	timestamp_updated: str,
});

export const InstantlyCampaign = z.object({
	id: z.string(),
	name: str,
	status: num,
	daily_limit: num,
	stop_on_reply: bool,
	stop_for_company: bool,
	email_list: z.array(z.string()).nullish(),
	timestamp_created: str,
	timestamp_updated: str,
});

export const InstantlyLead = z.object({
	id: z.string(),
	email: str,
	first_name: str,
	last_name: str,
	company_name: str,
	company_domain: str,
	job_title: str,
	campaign: str,
	list_id: str,
	status: num,
	lt_interest_status: num,
	email_reply_count: num,
	timestamp_last_contact: str,
	timestamp_last_reply: str,
	timestamp_created: str,
	timestamp_updated: str,
});

export const InstantlyEmail = z.object({
	id: z.string(),
	thread_id: str,
	subject: str,
	from_address_email: str,
	to_address_email_list: str,
	eaccount: str,
	lead: str,
	campaign_id: str,
	ue_type: num,
	is_unread: num,
	i_status: num,
	content_preview: str,
	timestamp_email: str,
});

export type InstantlyAccount = z.infer<typeof InstantlyAccount>;
export type InstantlyCampaign = z.infer<typeof InstantlyCampaign>;
export type InstantlyLead = z.infer<typeof InstantlyLead>;
export type InstantlyEmail = z.infer<typeof InstantlyEmail>;
