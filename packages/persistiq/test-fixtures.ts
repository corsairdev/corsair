/**
 * Response fixtures shaped after the PersistIQ OpenAPI spec
 * (persistiq.com/api-docs/v1/swagger.json).
 */

export const unauthorized = {
	status: 'error',
	error: {
		reason: 'unauthorized',
		message:
			"Failed to find api key: invalid.  Did you set header 'x-api-key' correctly?",
	},
};

/** The fields every list answer carries beside its named array. */
export const PAGE = {
	status: 'success',
	errors: [],
	has_more: false,
	next_page: null,
};

export const user = {
	id: 'u_1',
	name: 'Jane Roe',
	email: 'jane@example.com',
	activated: true,
	salesforce_id: null,
	default_mailbox_id: 'mb_1',
	mailboxes: [{ id: 'mb_1', email: 'jane@example.com', campaign_ids: ['c_1'] }],
};

export const lead = {
	id: 'l_1',
	status: 'Replied',
	data: { email: 'john@example.com', first_name: 'John' },
	creator_id: 'u_1',
	owner_id: 'u_1',
	bounced: false,
	optedout: false,
	sent_count: 3,
	replied_count: 1,
	last_sent_at: '2025-11-20T10:00:00.000Z',
};

export const campaign = {
	id: 'c_1',
	name: 'Q4 outbound',
	creator: { id: 'u_1', name: 'Jane Roe', email: 'jane@example.com' },
	stats: {
		prospects_contacted: 10,
		prospects_reached: 9,
		prospects_opened: 5,
		prospects_replied: 1,
		prospects_bounced: 1,
		prospects_optedout: 0,
		total_prospects: 12,
	},
};

export const campaignLead = {
	id: 'cl_1',
	campaign_id: 'c_1',
	mailbox_id: 'mb_1',
	lead,
};

export const leadField = {
	id: 'f_1',
	name: 'first_name',
	label: 'First Name',
};

export const leadStatus = {
	id: 's_1',
	name: 'Replied',
};

export const dncDomain = {
	id: 'd_1',
	name: 'example.com',
};

export const event = {
	id: 'e_1',
	event_type: 'email_sent',
	data: { lead_id: 'l_1' },
	created_at: '2025-11-20T10:00:00.000Z',
};

export const tag = {
	id: 't_1',
	name: 'priority',
};

export const webhookSettings = {
	post_new_prospect: true,
	post_new_prospect_url: 'https://example.com/webhooks/persistiq',
	post_updated_prospect: false,
	post_updated_prospect_url: null,
	raw_events: false,
	raw_events_url: null,
	post_email_reply: false,
	post_email_reply_url: null,
	post_email_opened: false,
	post_email_opened_url: null,
};

export const reply = {
	id: 'r_1',
	from_email: 'john@example.com',
	to_emails: ['jane@example.com'],
	cc_emails: [],
	subject: 'Re: hello',
	body: '<p>Sounds good</p>',
	preview: 'Sounds good',
	sent_at: '2025-11-20T11:00:00.000Z',
	sentiment: 'positive',
	kind: 'reply',
	lead_id: 'l_1',
	campaign_id: 'c_1',
	step_message_id: 'sm_1',
};
