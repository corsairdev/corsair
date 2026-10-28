import { z } from 'zod';
import { CampaignScheduleSchema, SequencesSchema } from './campaign-schedule';
import type { UnverifiedWriteResult } from './schema-helpers';
import {
	bool,
	Id,
	IsoDate,
	num,
	obj,
	Paging,
	page,
	str,
	write,
} from './schema-helpers';
import {
	INSTANTLY_EXTENDED_WRITE_OPERATIONS,
	InstantlyExtendedInputSchemas,
	InstantlyExtendedOutputSchemas,
} from './types-extended';

export {
	type UnverifiedWriteResult,
	UnverifiedWriteResultSchema,
} from './schema-helpers';

// Inputs follow https://api.instantly.ai/openapi/api_v2.json and keep its
// snake_case names, so they match Instantly's docs. Outputs type the fields
// agents use and pass everything else through (`.loose()`); every field is
// nullish because live responses omit many of them (and some differ from the
// spec: accounts come back with `added_by: "api"`, not a UUID).

const CustomVariables = z
	.record(z.string(), z.union([z.string(), z.number(), z.boolean(), z.null()]))
	.describe(
		'Custom variables for personalization, e.g. { "pain_point": "slow onboarding" }. Values must be strings, numbers, booleans or null; use them in copy as {{pain_point}}',
	);

const InterestValue = z
	.number()
	.int()
	.describe(
		'Interest status: 1 Interested, 2 Meeting booked, 3 Meeting completed, 4 Won, 0 Out of office, -1 Not interested, -2 Wrong person, -3 Lost, -4 No show, or a custom label value',
	);

// ── Accounts (sending mailboxes) ──────────────────────────────────────────

const AccountSchema = z
	.object({
		email: z.string(),
		first_name: str,
		last_name: str,
		organization: str,
		status: num.describe(
			'1 Active, 2 Paused, 3 Paused for maintenance, -1 Connection error, -2 Soft bounce error, -3 Sending error',
		),
		warmup_status: num.describe(
			'0 Paused, 1 Active, -1 Banned, -2 Spam folder unknown, -3 Permanent suspension',
		),
		provider_code: num.describe(
			'1 IMAP/SMTP, 2 Google, 3 Microsoft, 4 AWS, 8 AirMail, 11 AirMail Instant',
		),
		daily_limit: num.describe('Campaign emails this account sends per day'),
		sending_gap: num.describe('Minutes between emails from this account'),
		stat_warmup_score: num,
		warmup: obj.describe('Warmup settings: limit, increment, reply_rate'),
		status_message: obj.describe('Last connection or sending error'),
		setup_pending: bool,
		is_managed_account: bool,
		enable_slow_ramp: bool,
		tracking_domain_name: str,
		tracking_domain_status: str,
		signature: str,
		reply_to: str,
		timestamp_created: str,
		timestamp_updated: str,
		timestamp_warmup_start: str,
	})
	.loose();

const AccountsListInputSchema = z.object({
	...Paging,
	search: z.string().optional().describe('Match account emails'),
	status: z
		.union([
			z.literal(1),
			z.literal(2),
			z.literal(3),
			z.literal(-1),
			z.literal(-2),
			z.literal(-3),
		])
		.optional()
		.describe(
			'1 Active, 2 Paused, 3 Maintenance, -1 Connection error, -2 Soft bounce error, -3 Sending error',
		),
	provider_code: z
		.union([
			z.literal(1),
			z.literal(2),
			z.literal(3),
			z.literal(4),
			z.literal(8),
			z.literal(11),
		])
		.optional(),
	filter: z
		.enum([
			'ACC_FILTER_PAUSED',
			'ACC_FILTER_ERROR',
			'ACC_FILTER_NO_CTD',
			'ACC_FILTER_PW_ACCOUNTS',
			'ACC_FILTER_DFY',
			'ACC_FILTER_DFY_SETUP_PENDING',
			'ACC_FILTER_W_ACTIVE',
			'ACC_FILTER_W_PAUSED',
			'ACC_FILTER_W_ERROR',
		])
		.optional()
		.describe(
			'Paused, has errors, no custom tracking domain, pre-warmed, DFY, DFY setup pending, or warmup active / paused / erroring',
		),
	tag_ids: z
		.array(z.string())
		.optional()
		.describe('Accounts with any of these tag IDs'),
});

const AccountEmailInputSchema = z.object({
	email: z.string().min(3).describe('Sending account email address'),
});

const AccountsGetWarmupAnalyticsInputSchema = z.object({
	emails: z
		.array(z.string().min(3))
		.min(1)
		.max(100)
		.describe('Sending account emails, up to 100'),
});

const WarmupDaySchema = z
	.object({ sent: num, received: num, landed_inbox: num, landed_spam: num })
	.loose();

const AccountsGetWarmupAnalyticsResponseSchema = z
	.object({
		email_date_data: z
			.record(z.string(), z.record(z.string(), WarmupDaySchema))
			.nullish()
			.describe('Per account, per day (YYYY-MM-DD) warmup counts'),
		aggregate_data: z
			.record(
				z.string(),
				z
					.object({
						sent: num,
						received: num,
						landed_inbox: num,
						landed_spam: num,
						health_score: num.describe('0 to 100'),
						health_score_label: str,
					})
					.loose(),
			)
			.nullish()
			.describe('Per account totals and health score'),
	})
	.loose();

const AccountsWarmupInputSchema = z.object({
	emails: z
		.array(z.string().min(3))
		.min(1)
		.max(100)
		.describe('Sending account emails, up to 100'),
});

const BackgroundJobSchema = z
	.object({
		id: z.string(),
		type: str,
		status: str.describe(
			'pending, in-progress, success, failed, draining, paused or cancelled',
		),
		progress: num.describe('0 to 100'),
		workspace_id: str,
		created_at: str,
		updated_at: str,
	})
	.loose();

// ── Campaigns ─────────────────────────────────────────────────────────────

const CampaignSettings = {
	campaign_schedule: CampaignScheduleSchema,
	sequences: SequencesSchema.optional(),
	email_list: z
		.array(z.string().min(3))
		.optional()
		.describe('Sending account emails to rotate through'),
	email_tag_list: z
		.array(z.string())
		.optional()
		.describe('Account tag IDs whose accounts send for this campaign'),
	daily_limit: z
		.number()
		.int()
		.min(0)
		.nullish()
		.describe('Most emails the campaign sends per day'),
	daily_max_leads: z
		.number()
		.int()
		.min(0)
		.nullish()
		.describe('Most new leads contacted per day'),
	email_gap: z.number().min(0).nullish().describe('Minutes between emails'),
	random_wait_max: z
		.number()
		.min(0)
		.nullish()
		.describe('Extra random wait, in minutes, up to this'),
	stop_on_reply: z
		.boolean()
		.nullish()
		.describe('Stop the sequence for a lead once they reply'),
	stop_on_auto_reply: z
		.boolean()
		.nullish()
		.describe('Also stop on auto-replies such as out-of-office'),
	stop_for_company: z
		.boolean()
		.nullish()
		.describe(
			'Stop the sequence for every lead at the same company (domain) when one replies',
		),
	text_only: z.boolean().nullish().describe('Send every email as plain text'),
	first_email_text_only: z
		.boolean()
		.nullish()
		.describe('Send only the first email as plain text'),
	link_tracking: z.boolean().nullish(),
	open_tracking: z.boolean().optional(),
	insert_unsubscribe_header: z.boolean().nullish(),
	prioritize_new_leads: z.boolean().nullish(),
	match_lead_esp: z
		.boolean()
		.nullish()
		.describe("Send from accounts on the lead's email provider"),
	allow_risky_contacts: z.boolean().nullish(),
	disable_bounce_protect: z.boolean().nullish(),
	is_evergreen: z.boolean().nullish(),
	pl_value: z.number().nullish().describe('Value of each positive lead'),
	cc_list: z.array(z.string()).optional(),
	bcc_list: z.array(z.string()).optional(),
	auto_variant_select: z
		.object({ trigger: z.enum(['reply_rate', 'click_rate', 'open_rate']) })
		.nullish()
		.describe('Pick the winning A/B variant automatically by this metric'),
};

const CampaignsCreateInputSchema = z.object({
	name: z.string().min(1),
	...CampaignSettings,
});

const { campaign_schedule: _schedule, ...OptionalCampaignSettings } =
	CampaignSettings;

const CampaignsUpdateInputSchema = z.object({
	id: Id('Campaign'),
	name: z.string().min(1).optional(),
	campaign_schedule: CampaignScheduleSchema.optional(),
	...OptionalCampaignSettings,
});

const CampaignStatusLiteral = z.union([
	z.literal(-99),
	z.literal(-2),
	z.literal(-1),
	z.literal(0),
	z.literal(1),
	z.literal(2),
	z.literal(3),
	z.literal(4),
]);

const CAMPAIGN_STATUS_TEXT =
	'0 Draft, 1 Active, 2 Paused, 3 Completed, 4 Running subsequences, -1 Accounts unhealthy, -2 Bounce protect, -99 Account suspended';

const CampaignSchema = z
	.object({
		id: z.string(),
		name: str,
		status: num.describe(CAMPAIGN_STATUS_TEXT),
		not_sending_status: num.describe(
			'Why an active campaign is not sending: 1 outside its schedule, 2 waiting for a lead, 3 campaign daily limit hit, 4 every account at its daily limit, 99 error',
		),
		campaign_schedule: obj,
		// unknown: steps and variants are passed through as returned.
		sequences: z.array(z.unknown()).nullish(),
		email_list: z.array(z.string()).nullish(),
		email_tag_list: z.array(z.string()).nullish(),
		daily_limit: num,
		daily_max_leads: num,
		email_gap: num,
		random_wait_max: num,
		stop_on_reply: bool,
		stop_on_auto_reply: bool,
		stop_for_company: bool,
		text_only: bool,
		first_email_text_only: bool,
		link_tracking: bool,
		open_tracking: bool,
		is_evergreen: bool,
		pl_value: num,
		organization: str,
		timestamp_created: str,
		timestamp_updated: str,
	})
	.loose();

const CampaignsListInputSchema = z.object({
	...Paging,
	search: z.string().optional().describe('Match campaign names'),
	status: CampaignStatusLiteral.optional().describe(CAMPAIGN_STATUS_TEXT),
	tag_ids: z.array(z.string()).optional(),
});

const CampaignIdInputSchema = z.object({ id: Id('Campaign') });

const AnalyticsRange = {
	start_date: IsoDate.optional(),
	end_date: IsoDate.optional(),
};

const CampaignsGetAnalyticsInputSchema = z.object({
	id: z.string().min(1).optional().describe('One campaign; omit for all'),
	ids: z.array(z.string().min(1)).optional().describe('Several campaigns'),
	...AnalyticsRange,
	exclude_total_leads_count: z
		.boolean()
		.optional()
		.describe('Skip leads_count, which makes the call much faster'),
});

const CampaignAnalyticsSchema = z
	.object({
		campaign_id: z.string(),
		campaign_name: str,
		campaign_status: num,
		campaign_is_evergreen: bool,
		leads_count: num,
		contacted_count: num,
		new_leads_contacted_count: num,
		emails_sent_count: num,
		open_count: num,
		open_count_unique: num,
		reply_count: num,
		reply_count_unique: num.describe(
			'First reply per lead, auto-replies excluded',
		),
		reply_count_automatic: num,
		link_click_count: num,
		link_click_count_unique: num,
		bounced_count: num,
		unsubscribed_count: num,
		completed_count: num,
		total_opportunities: num,
		total_opportunity_value: num,
	})
	.loose();

const CampaignsGetAnalyticsOverviewInputSchema = z.object({
	id: z.string().min(1).optional().describe('One campaign; omit for all'),
	ids: z.array(z.string().min(1)).optional(),
	...AnalyticsRange,
	campaign_status:
		CampaignStatusLiteral.optional().describe(CAMPAIGN_STATUS_TEXT),
	expand_crm_events: z
		.boolean()
		.optional()
		.describe(
			'Count every interest status change, not only the first per lead',
		),
});

const CampaignAnalyticsOverviewSchema = z
	.object({
		emails_sent_count: num,
		contacted_count: num,
		new_leads_contacted_count: num,
		open_count: num,
		open_count_unique: num,
		reply_count: num,
		reply_count_unique: num,
		reply_count_automatic: num,
		link_click_count: num,
		link_click_count_unique: num,
		bounced_count: num,
		unsubscribed_count: num,
		completed_count: num,
		total_opportunities: num,
		total_opportunity_value: num,
		total_interested: num,
		total_meeting_booked: num,
		total_meeting_completed: num,
		total_closed: num,
	})
	.loose();

const CampaignsGetStepAnalyticsInputSchema = z.object({
	campaign_id: z
		.string()
		.min(1)
		.optional()
		.describe('One campaign; omit for all'),
	...AnalyticsRange,
	include_opportunities_count: z
		.boolean()
		.optional()
		.describe('Add opportunities, meetings_booked and won per step'),
});

const StepAnalyticsSchema = z
	.object({
		step: z
			.union([z.string(), z.number()])
			.nullish()
			.describe('Step number; null when unknown'),
		variant: z
			.union([z.string(), z.number()])
			.nullish()
			.describe('Variant from 0: 0 = A, 1 = B'),
		sent: num,
		opened: num,
		unique_opened: num,
		replies: num,
		unique_replies: num,
		replies_automatic: num,
		clicks: num,
		unique_clicks: num,
		opportunities: num,
		unique_opportunities: num,
		meetings_booked: num,
		won: num,
	})
	.loose();

// ── Leads ─────────────────────────────────────────────────────────────────

const LeadFields = {
	email: z.string().nullish().describe('Lead email address'),
	first_name: z.string().nullish(),
	last_name: z.string().nullish(),
	company_name: z.string().nullish(),
	job_title: z.string().nullish(),
	phone: z.string().nullish(),
	website: z.string().nullish(),
	personalization: z
		.string()
		.nullish()
		.describe('Personalized opening line, used as {{personalization}}'),
	pl_value_lead: z.string().nullish().describe('Potential value of the lead'),
	assigned_to: z.string().nullish().describe('Workspace user ID'),
	custom_variables: CustomVariables.optional(),
};

const LeadSchema = z
	.object({
		id: z.string(),
		email: str,
		first_name: str,
		last_name: str,
		company_name: str,
		company_domain: str,
		job_title: str,
		phone: str,
		website: str,
		personalization: str,
		campaign: str.describe('Campaign ID'),
		list_id: str.describe('Lead list ID'),
		status: num.describe(
			'Read-only: 1 Active, 2 Paused, 3 Completed, -1 Bounced, -2 Unsubscribed, -3 Skipped',
		),
		lt_interest_status: num.describe(
			'1 Interested, 2 Meeting booked, 3 Meeting completed, 4 Won, 0 Out of office, -1 Not interested, -2 Wrong person, -3 Lost, -4 No show; absent = plain Lead',
		),
		email_open_count: num,
		email_reply_count: num,
		email_click_count: num,
		verification_status: num.describe(
			'0 Not verified, 1 Verified, 11 Pending, -1 Invalid, -2 Risky, -3 Catch-all',
		),
		payload: obj.describe('Custom variables'),
		timestamp_created: str,
		timestamp_updated: str,
		timestamp_last_contact: str,
		timestamp_last_reply: str,
		timestamp_last_interest_change: str,
	})
	.loose();

const LEAD_LIST_FILTERS = [
	'FILTER_VAL_CONTACTED',
	'FILTER_VAL_NOT_CONTACTED',
	'FILTER_VAL_COMPLETED',
	'FILTER_VAL_UNSUBSCRIBED',
	'FILTER_VAL_ACTIVE',
	'FILTER_VAL_REPLIED',
	'FILTER_VAL_OPENED_NO_REPLY',
	'FILTER_VAL_COMPLETED_NO_REPLY',
	'FILTER_VAL_NO_OPENS',
	'FILTER_VAL_LINK_CLICKED',
	'FILTER_VAL_BOUNCED',
	'FILTER_VAL_SKIPPED',
	'FILTER_VAL_RISKY',
	'FILTER_VAL_INVALID',
	'FILTER_VAL_VALID',
	'FILTER_VAL_CATCH_ALL',
	'FILTER_VAL_NOT_VERIFIED',
	'FILTER_VAL_IN_SUBSEQUENCE',
	'FILTER_LEAD_INTERESTED',
	'FILTER_LEAD_NOT_INTERESTED',
	'FILTER_LEAD_MEETING_BOOKED',
	'FILTER_LEAD_MEETING_COMPLETED',
	'FILTER_LEAD_CLOSED',
	'FILTER_LEAD_OUT_OF_OFFICE',
	'FILTER_LEAD_WRONG_PERSON',
	'FILTER_LEAD_LOST',
	'FILTER_LEAD_NO_SHOW',
	'FILTER_LEAD_CUSTOM_LABEL_POSITIVE',
	'FILTER_LEAD_CUSTOM_LABEL_NEGATIVE',
] as const;

const LeadsListInputSchema = z.object({
	...Paging,
	campaign: z.string().min(1).optional().describe('Campaign ID'),
	list_id: z.string().min(1).optional().describe('Lead list ID'),
	search: z
		.string()
		.optional()
		.describe('Match email, name, company or job title'),
	filter: z.enum(LEAD_LIST_FILTERS).optional(),
	contacts: z
		.array(z.string())
		.optional()
		.describe('Only leads with these email addresses'),
	ids: z.array(z.string()).optional().describe('Only these lead IDs'),
	excluded_ids: z.array(z.string()).optional(),
	in_campaign: z.boolean().optional(),
	in_list: z.boolean().optional(),
	distinct_contacts: z
		.boolean()
		.optional()
		.describe(
			'One row per email address; the cursor is then the last email instead of the last ID',
		),
});

const LeadIdInputSchema = z.object({ id: Id('Lead') });

const SkipIfInWorkspace = z
	.boolean()
	.default(true)
	.describe(
		'Skip leads already anywhere in the workspace (default true). Every upload counts toward the lifetime contact limit, and re-adding a lead who already replied restarts them at step 1',
	);

const LeadsCreateInputSchema = z.object({
	campaign: z
		.string()
		.min(1)
		.optional()
		.describe('Campaign ID to add the lead to'),
	list_id: z.string().min(1).optional().describe('Lead list ID instead'),
	...LeadFields,
	lt_interest_status: InterestValue.optional(),
	skip_if_in_workspace: SkipIfInWorkspace,
	skip_if_in_campaign: z.boolean().optional(),
	skip_if_in_list: z.boolean().optional(),
	blocklist_id: z
		.string()
		.optional()
		.describe('Check against this blocklist instead of the default'),
	verify_leads_on_import: z.boolean().optional(),
});

const BulkLeadSchema = z.object({
	...LeadFields,
	lt_interest_status: InterestValue.optional(),
});

const LeadsAddBulkInputSchema = z
	.object({
		campaign_id: z
			.string()
			.min(1)
			.optional()
			.describe('Campaign to add the leads to (or list_id, not both)'),
		list_id: z.string().min(1).optional().describe('Lead list instead'),
		leads: z
			.array(BulkLeadSchema)
			.min(1)
			.max(1000)
			.describe('Up to 1,000 leads per call'),
		skip_if_in_workspace: SkipIfInWorkspace,
		skip_if_in_campaign: z
			.boolean()
			.optional()
			.describe('Skip leads already in any campaign'),
		skip_if_in_list: z
			.boolean()
			.optional()
			.describe('Skip leads already in any list'),
		blocklist_id: z.string().nullish(),
		assigned_to: z
			.string()
			.optional()
			.describe('Workspace user ID to assign every lead to'),
		verify_leads_on_import: z.boolean().optional(),
	})
	.refine(
		(input) =>
			(input.campaign_id === undefined) !== (input.list_id === undefined),
		{ message: 'Pass campaign_id or list_id, not both', path: ['campaign_id'] },
	)
	.refine(
		(input) =>
			input.campaign_id === undefined ||
			input.leads.every((lead) => Boolean(lead.email)),
		{
			message: 'Every lead added to a campaign needs an email',
			path: ['leads'],
		},
	);

const LeadsAddBulkResponseSchema = z
	.object({
		status: str,
		total_sent: num.describe('Leads in the request'),
		leads_uploaded: num.describe('Leads created'),
		duplicated_leads: num.describe('Already in this campaign or list'),
		skipped_count: num.describe('Skipped by the skip_if_* flags'),
		in_blocklist: num,
		blocklist_used: str,
		invalid_email_count: num,
		incomplete_count: num,
		duplicate_email_count: num.describe('Repeated within the request'),
		remaining_in_plan: num.describe(
			'Uploads left on the plan (only when adding to a campaign)',
		),
		created_leads: z
			.array(
				z
					.object({
						index: num.describe('Position in the request'),
						id: str,
						email: str,
						first_name: str,
						last_name: str,
					})
					.loose(),
			)
			.nullish(),
	})
	.loose();

const LeadsUpdateInputSchema = z.object({
	id: Id('Lead'),
	first_name: z.string().nullish(),
	last_name: z.string().nullish(),
	company_name: z.string().nullish(),
	job_title: z.string().nullish(),
	phone: z.string().nullish(),
	website: z.string().nullish(),
	personalization: z.string().nullish(),
	pl_value_lead: z.string().nullish(),
	assigned_to: z.string().nullish(),
	custom_variables: CustomVariables.optional().describe(
		"Custom variables to add to the lead's payload",
	),
});

const LeadsUpdateInterestStatusInputSchema = z.object({
	lead_email: z.string().min(3).describe('Email of the lead'),
	interest_value: InterestValue.nullable().describe(
		'1 Interested, 2 Meeting booked, 3 Meeting completed, 4 Won, 0 Out of office, -1 Not interested, -2 Wrong person, -3 Lost, -4 No show, a custom label value, or null to reset to plain Lead',
	),
	campaign_id: z.string().min(1).optional().describe('Only in this campaign'),
	list_id: z.string().min(1).optional().describe('Only in this list'),
	ai_interest_value: z.number().optional(),
	disable_auto_interest: z.boolean().optional(),
});

const AcceptedSchema = z.object({ message: str }).loose();

// ── Lead lists ────────────────────────────────────────────────────────────

const LeadListSchema = z
	.object({
		id: z.string(),
		name: str,
		organization_id: str,
		has_enrichment_task: bool,
		owned_by: str,
		timestamp_created: str,
	})
	.loose();

const LeadListsListInputSchema = z.object({
	...Paging,
	search: z.string().optional(),
	has_enrichment_task: z.boolean().optional(),
});

const LeadListsCreateInputSchema = z.object({
	name: z.string().min(1),
	has_enrichment_task: z
		.boolean()
		.nullish()
		.describe('Enrich every lead added to the list'),
	owned_by: z.string().nullish().describe('Workspace user ID'),
});

// ── Emails (Unibox) ───────────────────────────────────────────────────────

const EmailSchema = z
	.object({
		id: z.string().describe('Email ID; pass as reply_to_uuid to emails.reply'),
		thread_id: str,
		message_id: str,
		subject: str,
		from_address_email: str,
		to_address_email_list: str.describe('Comma-separated'),
		cc_address_email_list: str,
		reply_to: str,
		eaccount: str.describe('Sending account that sent or received it'),
		lead: str.describe('Lead email'),
		lead_id: str,
		campaign_id: str,
		list_id: str,
		ue_type: num.describe(
			'1 Sent from a campaign, 2 Received, 3 Sent manually, 4 Scheduled',
		),
		step: z.union([z.string(), z.number()]).nullish(),
		is_unread: num.describe('1 unread'),
		is_auto_reply: num.describe('1 auto-reply'),
		i_status: num.describe('Interest status of the lead'),
		ai_interest_value: num,
		content_preview: str,
		body: z
			.object({ text: str, html: str })
			.loose()
			.nullish()
			.describe('Full body; an excerpt when body_fallback_reason is set'),
		body_fallback_reason: str,
		timestamp_email: str.describe('When the email was sent or received'),
		timestamp_created: str,
	})
	.loose();

const EmailsListInputSchema = z.object({
	...Paging,
	email_type: z
		.enum(['received', 'sent', 'manual'])
		.optional()
		.describe('received = replies from leads'),
	lead: z.string().optional().describe('Lead email'),
	campaign_id: z.string().min(1).optional(),
	list_id: z.string().min(1).optional(),
	eaccount: z
		.string()
		.optional()
		.describe('Sending account email(s), comma-separated'),
	search: z
		.string()
		.optional()
		.describe('A lead email, or thread:<thread_id> for one thread'),
	is_unread: z.boolean().optional(),
	i_status: z.number().int().optional().describe('Interest status'),
	mode: z
		.enum(['emode_focused', 'emode_others', 'emode_all'])
		.optional()
		.describe('Unibox tab: Primary, Others or all'),
	min_timestamp_created: z
		.string()
		.optional()
		.describe('ISO timestamp: only emails stored after this'),
	max_timestamp_created: z.string().optional(),
	latest_of_thread: z
		.boolean()
		.optional()
		.describe('Only the newest email of each thread'),
	preview_only: z
		.boolean()
		.optional()
		.describe('Return content_preview instead of full bodies'),
	sort_order: z.enum(['asc', 'desc']).optional(),
	company_domain: z.string().optional(),
	marked_as_done: z.boolean().optional(),
	assigned_to: z.string().optional(),
});

const EmailIdInputSchema = z.object({ id: Id('Email') });

const EmailsReplyInputSchema = z.object({
	reply_to_uuid: z
		.string()
		.min(1)
		.describe(
			'ID of the email to reply to (from emails.list or a webhook email_id)',
		),
	eaccount: z
		.string()
		.min(3)
		.describe('Sending account in this workspace to reply from'),
	subject: z.string().describe('Subject, usually "Re: " plus the original'),
	body: z
		.object({
			html: z.string().optional().describe('HTML; use <br/> for line breaks'),
			text: z.string().optional(),
		})
		.refine((body) => Boolean(body.html || body.text), {
			message: 'Pass body.html or body.text',
		}),
	cc_address_email_list: z.string().optional().describe('Comma-separated'),
	bcc_address_email_list: z.string().optional().describe('Comma-separated'),
	additional_recipients: z.array(z.string()).optional(),
	reminder_ts: z
		.string()
		.optional()
		.describe('ISO timestamp for a Unibox reminder'),
	assigned_to: z.string().optional(),
});

const ThreadIdInputSchema = z.object({
	thread_id: z.string().min(1).describe('thread_id from an email'),
});

const SuccessSchema = z.object({ success: bool }).loose();

const EmptyInputSchema = z.object({});

const CountSchema = z.object({ count: num }).loose();

// ── Blocklist ─────────────────────────────────────────────────────────────

const BlocklistEntrySchema = z
	.object({
		id: z.string(),
		bl_value: str.describe('Blocked email or domain'),
		is_domain: bool,
		organization_id: str,
		timestamp_created: str,
	})
	.loose();

const BlocklistListInputSchema = z.object({
	...Paging,
	search: z.string().optional(),
	domains_only: z.boolean().optional(),
});

const BlocklistAddInputSchema = z.object({
	bl_value: z
		.string()
		.min(3)
		.describe('Email (jane@acme.com) or domain (acme.com) to block'),
});

const BlocklistRemoveInputSchema = z.object({ id: Id('Blocklist entry') });

// ── Webhooks ──────────────────────────────────────────────────────────────

// Every event_type POST /api/v2/webhooks accepts (its OpenAPI enum). A link
// click subscribes as email_link_clicked; Instantly's payload guide also
// names it link_clicked, and the handler accepts both. auto_reply_received
// is not accepted here (nor listed by GET /webhooks/event-types), so auto
// replies only arrive on an all_events webhook.
export const WEBHOOK_SUBSCRIPTION_EVENTS = [
	'all_events',
	'email_sent',
	'email_opened',
	'email_link_clicked',
	'reply_received',
	'email_bounced',
	'lead_unsubscribed',
	'campaign_completed',
	'account_error',
	'lead_neutral',
	'lead_interested',
	'lead_not_interested',
	'lead_meeting_booked',
	'lead_meeting_completed',
	'lead_closed',
	'lead_out_of_office',
	'lead_wrong_person',
	'lead_no_show',
	'supersearch_enrichment_completed',
] as const;

const WebhookSchema = z
	.object({
		id: z.string(),
		name: str,
		target_hook_url: str,
		event_type: str.describe('null for a custom label webhook'),
		campaign: str.describe('Campaign ID; null = every campaign'),
		custom_interest_value: num,
		headers: z
			.record(z.string(), z.string())
			.nullish()
			.describe('Header names sent with each delivery; values are redacted'),
		status: num.describe('1 active, -1 disabled after failed deliveries'),
		timestamp_error: str,
		timestamp_created: str,
		organization: str,
	})
	.loose();

const WebhooksListInputSchema = z.object({
	...Paging,
	campaign: z.string().min(1).optional(),
	event_type: z.enum(WEBHOOK_SUBSCRIPTION_EVENTS).optional(),
});

const WebhooksCreateInputSchema = z.object({
	target_hook_url: z
		.url({ protocol: /^https?$/ })
		.describe('Where Instantly POSTs events, e.g. your Corsair webhook URL'),
	event_type: z
		.enum(WEBHOOK_SUBSCRIPTION_EVENTS)
		.nullable()
		.describe(
			'One event, all_events (includes custom labels), or null with custom_interest_value for one custom label',
		),
	campaign: z
		.string()
		.min(1)
		.nullish()
		.describe('Only this campaign; omit for every campaign'),
	name: z.string().nullish(),
	custom_interest_value: z
		.number()
		.nullish()
		.describe('Custom label value, when event_type is null'),
	headers: z
		.record(z.string(), z.string())
		.optional()
		.describe('Extra headers sent with each delivery'),
	attach_secret: z
		.boolean()
		.default(true)
		.describe(
			"Send the plugin's webhook secret as the x-corsair-webhook-secret header so Corsair can verify deliveries (default true). If no secret is set, the call fails before anything is created; pass false for a URL outside Corsair",
		),
});

const WebhookIdInputSchema = z.object({ id: Id('Webhook') });

const WebhookEventTypesSchema = z
	.object({
		event_types: z
			.array(
				z
					.object({
						id: z.string().describe('event_type value'),
						label: str,
						type: str.describe('standard or custom_label'),
					})
					.loose(),
			)
			.nullish(),
	})
	.loose();

// ── Workspace ─────────────────────────────────────────────────────────────

const WorkspaceSchema = z
	.object({
		id: z.string(),
		name: str,
		owner: str,
		plan_id: str.describe('e.g. pid_g_v2 (Growth)'),
		plan_id_leadfinder: str,
		add_unsub_to_block: bool,
		default_opportunity_value: num,
		timestamp_created: str,
		timestamp_updated: str,
	})
	.loose();

// ── Exports ───────────────────────────────────────────────────────────────

export const InstantlyEndpointInputSchemas = {
	accountsList: AccountsListInputSchema,
	accountsGet: AccountEmailInputSchema,
	accountsGetWarmupAnalytics: AccountsGetWarmupAnalyticsInputSchema,
	accountsPause: AccountEmailInputSchema,
	accountsResume: AccountEmailInputSchema,
	accountsEnableWarmup: AccountsWarmupInputSchema,
	accountsDisableWarmup: AccountsWarmupInputSchema,
	campaignsList: CampaignsListInputSchema,
	campaignsGet: CampaignIdInputSchema,
	campaignsCreate: CampaignsCreateInputSchema,
	campaignsUpdate: CampaignsUpdateInputSchema,
	campaignsActivate: CampaignIdInputSchema,
	campaignsPause: CampaignIdInputSchema,
	campaignsGetAnalytics: CampaignsGetAnalyticsInputSchema,
	campaignsGetAnalyticsOverview: CampaignsGetAnalyticsOverviewInputSchema,
	campaignsGetStepAnalytics: CampaignsGetStepAnalyticsInputSchema,
	leadsList: LeadsListInputSchema,
	leadsGet: LeadIdInputSchema,
	leadsCreate: LeadsCreateInputSchema,
	leadsAddBulk: LeadsAddBulkInputSchema,
	leadsUpdate: LeadsUpdateInputSchema,
	leadsUpdateInterestStatus: LeadsUpdateInterestStatusInputSchema,
	leadsDelete: LeadIdInputSchema,
	leadListsList: LeadListsListInputSchema,
	leadListsCreate: LeadListsCreateInputSchema,
	emailsList: EmailsListInputSchema,
	emailsGet: EmailIdInputSchema,
	emailsReply: EmailsReplyInputSchema,
	emailsMarkThreadRead: ThreadIdInputSchema,
	emailsCountUnread: EmptyInputSchema,
	blocklistList: BlocklistListInputSchema,
	blocklistAdd: BlocklistAddInputSchema,
	blocklistRemove: BlocklistRemoveInputSchema,
	webhooksList: WebhooksListInputSchema,
	webhooksCreate: WebhooksCreateInputSchema,
	webhooksDelete: WebhookIdInputSchema,
	webhooksListEventTypes: EmptyInputSchema,
	workspaceGet: EmptyInputSchema,
	...InstantlyExtendedInputSchemas,
} as const;

/** Operations that change something in Instantly; see UnverifiedWriteResult. */
export const INSTANTLY_WRITE_OPERATIONS: ReadonlySet<string> = new Set([
	'accountsPause',
	'accountsResume',
	'accountsEnableWarmup',
	'accountsDisableWarmup',
	'campaignsCreate',
	'campaignsUpdate',
	'campaignsActivate',
	'campaignsPause',
	'leadsCreate',
	'leadsAddBulk',
	'leadsUpdate',
	'leadsUpdateInterestStatus',
	'leadsDelete',
	'leadListsCreate',
	'emailsReply',
	'emailsMarkThreadRead',
	'blocklistAdd',
	'blocklistRemove',
	'webhooksCreate',
	'webhooksDelete',
	...INSTANTLY_EXTENDED_WRITE_OPERATIONS,
]);

export const InstantlyEndpointOutputSchemas = {
	accountsList: page(AccountSchema),
	accountsGet: AccountSchema,
	accountsGetWarmupAnalytics: AccountsGetWarmupAnalyticsResponseSchema,
	accountsPause: write(AccountSchema),
	accountsResume: write(AccountSchema),
	accountsEnableWarmup: write(BackgroundJobSchema),
	accountsDisableWarmup: write(BackgroundJobSchema),
	campaignsList: page(CampaignSchema),
	campaignsGet: CampaignSchema,
	campaignsCreate: write(CampaignSchema),
	campaignsUpdate: write(CampaignSchema),
	campaignsActivate: write(CampaignSchema),
	campaignsPause: write(CampaignSchema),
	campaignsGetAnalytics: z.array(CampaignAnalyticsSchema),
	campaignsGetAnalyticsOverview: CampaignAnalyticsOverviewSchema,
	campaignsGetStepAnalytics: z.array(StepAnalyticsSchema),
	leadsList: page(LeadSchema),
	leadsGet: LeadSchema,
	// A create skipped by skip_if_in_workspace may answer without an id.
	leadsCreate: write(LeadSchema.partial().loose()),
	leadsAddBulk: write(LeadsAddBulkResponseSchema),
	leadsUpdate: write(LeadSchema),
	leadsUpdateInterestStatus: write(AcceptedSchema),
	leadsDelete: write(LeadSchema.partial().loose()),
	leadListsList: page(LeadListSchema),
	leadListsCreate: write(LeadListSchema),
	emailsList: page(EmailSchema),
	emailsGet: EmailSchema,
	emailsReply: write(EmailSchema.partial().loose()),
	emailsMarkThreadRead: write(SuccessSchema),
	emailsCountUnread: CountSchema,
	blocklistList: page(BlocklistEntrySchema),
	blocklistAdd: write(BlocklistEntrySchema),
	blocklistRemove: write(BlocklistEntrySchema.partial().loose()),
	webhooksList: page(WebhookSchema),
	webhooksCreate: write(WebhookSchema),
	webhooksDelete: write(WebhookSchema.partial().loose()),
	webhooksListEventTypes: WebhookEventTypesSchema,
	workspaceGet: WorkspaceSchema,
	...InstantlyExtendedOutputSchemas,
} as const;

export type InstantlyOperation = keyof typeof InstantlyEndpointInputSchemas;

/** What callers pass (defaults such as skip_if_in_workspace optional). */
export type InstantlyEndpointInputs = {
	[K in InstantlyOperation]: z.input<(typeof InstantlyEndpointInputSchemas)[K]>;
};

/** Inputs after their schema ran (defaults filled in). */
export type InstantlyParsedInputs = {
	[K in InstantlyOperation]: z.output<
		(typeof InstantlyEndpointInputSchemas)[K]
	>;
};

/** Outputs whose response matched its schema (never an UnverifiedWriteResult). */
export type InstantlyVerifiedOutputs = {
	[K in InstantlyOperation]: Exclude<
		InstantlyEndpointOutputs[K],
		UnverifiedWriteResult
	>;
};

export type InstantlyEndpointOutputs = {
	[K in InstantlyOperation]: z.infer<
		(typeof InstantlyEndpointOutputSchemas)[K]
	>;
};

export type InstantlyAccount = z.infer<typeof AccountSchema>;
export type InstantlyCampaign = z.infer<typeof CampaignSchema>;
export type InstantlyLead = z.infer<typeof LeadSchema>;
export type InstantlyEmail = z.infer<typeof EmailSchema>;
export type InstantlyWebhookSubscription = z.infer<typeof WebhookSchema>;
export type CampaignsCreateInput = InstantlyEndpointInputs['campaignsCreate'];
export type LeadsAddBulkInput = InstantlyEndpointInputs['leadsAddBulk'];
export type LeadsAddBulkResponse = InstantlyEndpointOutputs['leadsAddBulk'];
export type EmailsReplyInput = InstantlyEndpointInputs['emailsReply'];
