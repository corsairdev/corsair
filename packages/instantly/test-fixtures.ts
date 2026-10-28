// Response bodies shaped like live Instantly API v2 answers (accounts,
// workspace and empty lists checked 2026-10-28) and the OpenAPI examples for
// what the test workspace has none of (campaigns, leads, emails). People,
// domains and IDs are made up.

export const WORKSPACE_ID = '0b8f6c1e-4a52-4d7e-9a3c-2f1d5e6a7b80';
export const CAMPAIGN_ID = '01a181d1-c62c-745b-b842-870ce5b29862';
export const LEAD_ID = '01a181d1-c62c-745b-b842-870d0c3a11f4';
export const EMAIL_ID = '01a181d1-c62c-745b-b842-870e55aa2c19';
export const THREAD_ID = '01a181d1-c62c-745b-b842-870f8d0b9e33';
export const WEBHOOK_ID = '01a181d1-c62c-745b-b842-870a582f48f0';
export const BLOCK_ID = '01a181d1-c62c-745b-b842-8710aa4f2e01';
export const LIST_ID = '01a181d1-c62c-745b-b842-8711c0de7a12';
export const SENDER = 'sam@fieldkit-mail.com';

export const account = {
	email: SENDER,
	timestamp_created: '2026-10-27T17:21:30.099Z',
	timestamp_updated: '2026-10-27T17:22:03.166Z',
	first_name: 'Sam',
	last_name: 'Rivera',
	organization: WORKSPACE_ID,
	warmup_status: 1,
	provider_code: 2,
	setup_pending: false,
	is_managed_account: false,
	warmup: { limit: 25, increment: '2', reply_rate: 55 },
	// Live accounts carry "api" here although the spec says a UUID.
	added_by: 'api',
	daily_limit: 15,
	modified_by: 'api',
	status: 1,
	enable_slow_ramp: true,
	timestamp_warmup_start: '2026-10-27T17:22:02.036Z',
	stat_warmup_score: 0,
	sending_gap: 20,
};

export const warmupAnalytics = {
	email_date_data: {
		[SENDER]: {
			'2026-10-27': { sent: 2, landed_inbox: 2, received: 7 },
			'2026-10-28': { sent: 4, landed_inbox: 4, received: 13 },
		},
	},
	aggregate_data: {
		[SENDER]: {
			sent: 6,
			received: 20,
			landed_inbox: 6,
			health_score_label: '100%',
			health_score: 100,
		},
	},
};

export const backgroundJob = {
	id: '01a181d2-0000-7000-8000-000000000001',
	workspace_id: WORKSPACE_ID,
	type: 'update-warmup-accounts',
	progress: 0,
	status: 'pending',
	created_at: '2026-10-28T09:00:00.000Z',
	updated_at: '2026-10-28T09:00:00.000Z',
};

export const schedule = {
	schedules: [
		{
			name: 'Weekdays',
			timing: { from: '09:00', to: '17:00' },
			days: { '1': true, '2': true, '3': true, '4': true, '5': true },
			timezone: 'America/Detroit',
		},
	],
};

export const sequences = [
	{
		steps: [
			{
				type: 'email',
				delay: 3,
				variants: [
					{
						subject: 'Quick question, {{firstName}}',
						body: 'Hi {{firstName}},<br/><br/>{{personalization}}',
					},
				],
			},
			{
				type: 'email',
				delay: 0,
				variants: [{ subject: '', body: 'Following up, {{firstName}}.' }],
			},
		],
	},
];

export const campaign = {
	id: CAMPAIGN_ID,
	name: 'Northeast IT leads',
	status: 0,
	campaign_schedule: schedule,
	sequences,
	email_list: [SENDER],
	daily_limit: 30,
	stop_on_reply: true,
	stop_for_company: true,
	link_tracking: false,
	open_tracking: false,
	timestamp_created: '2026-10-28T09:22:51.052Z',
	timestamp_updated: '2026-10-28T09:22:51.052Z',
	organization: WORKSPACE_ID,
};

export const campaignAnalytics = {
	campaign_name: 'Northeast IT leads',
	campaign_id: CAMPAIGN_ID,
	campaign_status: 1,
	campaign_is_evergreen: false,
	leads_count: 120,
	contacted_count: 80,
	emails_sent_count: 150,
	new_leads_contacted_count: 80,
	open_count: 0,
	reply_count: 6,
	reply_count_unique: 5,
	link_click_count: 0,
	bounced_count: 2,
	unsubscribed_count: 1,
	completed_count: 10,
	total_opportunities: 3,
	total_opportunity_value: 3000,
};

// Live shape (all zeros on the empty test workspace).
export const analyticsOverview = {
	open_count: 0,
	open_count_unique: 0,
	link_click_count: 0,
	reply_count: 6,
	reply_count_unique: 5,
	reply_count_automatic: 1,
	bounced_count: 2,
	unsubscribed_count: 1,
	emails_sent_count: 150,
	contacted_count: 80,
	new_leads_contacted_count: 80,
	total_opportunities: 3,
	total_opportunity_value: 3000,
	total_interested: 3,
	total_meeting_booked: 1,
	total_meeting_completed: 0,
	total_closed: 0,
};

export const stepAnalytics = [
	{
		step: '0',
		variant: '0',
		sent: 80,
		opened: 0,
		unique_opened: 0,
		replies: 4,
		unique_replies: 4,
		replies_automatic: 1,
		unique_replies_automatic: 1,
		clicks: 0,
		unique_clicks: 0,
	},
];

export const lead = {
	id: LEAD_ID,
	timestamp_created: '2026-10-28T09:30:00.000Z',
	timestamp_updated: '2026-10-28T09:30:00.000Z',
	organization: WORKSPACE_ID,
	campaign: CAMPAIGN_ID,
	status: 1,
	email: 'jordan@acme-logistics.com',
	first_name: 'Jordan',
	last_name: 'Lee',
	company_name: 'Acme Logistics',
	company_domain: 'acme-logistics.com',
	job_title: 'IT Director',
	email_open_count: 0,
	email_reply_count: 0,
	email_click_count: 0,
	payload: { pain_point: 'slow onboarding' },
	status_summary: {},
	verification_status: 1,
	upload_method: 'api',
};

export const bulkAddResult = {
	status: 'success',
	total_sent: 2,
	leads_uploaded: 1,
	in_blocklist: 0,
	blocklist_used: null,
	duplicated_leads: 0,
	skipped_count: 1,
	invalid_email_count: 0,
	incomplete_count: 0,
	duplicate_email_count: 0,
	remaining_in_plan: 998,
	created_leads: [
		{
			index: 0,
			id: LEAD_ID,
			email: 'jordan@acme-logistics.com',
			first_name: 'Jordan',
			last_name: 'Lee',
		},
	],
};

export const leadList = {
	id: LIST_ID,
	organization_id: WORKSPACE_ID,
	has_enrichment_task: false,
	owned_by: null,
	name: 'Boston IT directors',
	timestamp_created: '2026-10-28T09:00:00.000Z',
};

export const email = {
	id: EMAIL_ID,
	timestamp_created: '2026-10-28T10:00:05.000Z',
	timestamp_email: '2026-10-28T10:00:00.000Z',
	message_id: '<CAF=reply@mail.acme-logistics.com>',
	subject: 'Re: Quick question, Jordan',
	from_address_email: 'jordan@acme-logistics.com',
	to_address_email_list: SENDER,
	body: {
		text: 'Sounds good, send me times.',
		html: '<p>Sounds good, send me times.</p>',
	},
	organization_id: WORKSPACE_ID,
	campaign_id: CAMPAIGN_ID,
	lead: 'jordan@acme-logistics.com',
	lead_id: LEAD_ID,
	eaccount: SENDER,
	ue_type: 2,
	step: '1',
	is_unread: 1,
	is_auto_reply: 0,
	i_status: 1,
	thread_id: THREAD_ID,
	content_preview: 'Sounds good, send me times.',
};

export const blocklistEntry = {
	id: BLOCK_ID,
	timestamp_created: '2026-10-28T09:00:00.000Z',
	organization_id: WORKSPACE_ID,
	bl_value: 'competitor.com',
	is_domain: true,
};

export const webhookSubscription = {
	id: WEBHOOK_ID,
	organization: WORKSPACE_ID,
	campaign: null,
	name: 'Corsair replies',
	target_hook_url: 'https://app.example.com/api/webhook',
	event_type: 'reply_received',
	custom_interest_value: null,
	headers: { 'x-corsair-webhook-secret': 'whsec-live-value' },
	timestamp_created: '2026-10-28T09:22:51.052Z',
	status: 1,
	timestamp_error: null,
};

// Live answer from GET /webhooks/event-types (first entries).
export const eventTypes = {
	event_types: [
		{ id: 'email_sent', label: 'Email Sent', type: 'standard' },
		{ id: 'reply_received', label: 'Reply Received', type: 'standard' },
		{
			id: 'custom_label_any_positive',
			label: 'Lead is marked with any positive custom label',
			type: 'custom_label',
		},
	],
};

// Live answer from GET /workspaces/current (made-up IDs).
export const workspace = {
	id: WORKSPACE_ID,
	timestamp_created: '2026-10-27T14:29:02.849Z',
	timestamp_updated: '2026-10-27T14:29:02.848Z',
	owner: '7a1b2c3d-4e5f-4a6b-8c7d-9e0f1a2b3c4d',
	name: 'My Organization',
	plan_id: 'pid_g_v2',
	plan_id_leadfinder: 'pid_free',
};

// Webhook payload per https://developer.instantly.ai/guides/webhook-events.
export function webhookPayload(
	eventType: string,
	extra: Record<string, unknown> = {},
) {
	return {
		timestamp: '2026-10-28T10:00:00.000Z',
		event_type: eventType,
		workspace: WORKSPACE_ID,
		campaign_id: CAMPAIGN_ID,
		campaign_name: 'Northeast IT leads',
		lead_email: 'jordan@acme-logistics.com',
		email_account: SENDER,
		step: 1,
		variant: 1,
		is_first: true,
		// Lead fields Instantly merges in from the workspace.
		firstName: 'Jordan',
		companyName: 'Acme Logistics',
		...extra,
	};
}

export const replyPayload = {
	...webhookPayload('reply_received'),
	email_id: EMAIL_ID,
	unibox_url: 'https://app.instantly.ai/app/unibox?thread_search=x',
	reply_subject: 'Re: Quick question, Jordan',
	reply_text_snippet: 'Sounds good, send me times.',
	reply_text: 'Sounds good, send me times.',
	reply_html: '<p>Sounds good, send me times.</p>',
};

// Fastify error bodies, as Instantly sends them.
export function errorBody(
	statusCode: number,
	message: string,
	extra: Record<string, unknown> = {},
) {
	const reasons: Record<number, string> = {
		400: 'Bad Request',
		401: 'Unauthorized',
		402: 'Payment Required',
		403: 'Forbidden',
		404: 'Not Found',
		429: 'Too Many Requests',
		500: 'Internal Server Error',
	};
	return {
		statusCode,
		error: reasons[statusCode] ?? 'Error',
		message,
		...extra,
	};
}
