import { z } from 'zod';
import { CampaignScheduleSchema, SequencesSchema } from './campaign-schedule';
import {
	bool,
	freeForm,
	list,
	num,
	obj,
	page,
	str,
	untyped,
	write,
} from './schema-helpers';
import { ACCEPTED_TIMEZONES } from './timezones';

// Schemas for the rest of Instantly API v2: everything beyond the cold-email
// core in types.ts. Inputs follow https://api.instantly.ai/openapi/api_v2.json
// field for field (names, enums, limits and descriptions); outputs type each
// top-level field and pass the rest through, every field nullish. The email
// and prompt template endpoints are not in that spec: their inputs follow
// Instantly's own MCP server and their outputs the live list responses.

const AccountsCreateInput = z.object({
	email: z.string().describe('Email address of the account'),
	first_name: z.string().describe('First name associated with the account'),
	last_name: z.string().describe('Last name associated with the account'),
	warmup: z
		.object({
			limit: z
				.number()
				.optional()
				.describe('Email sending limit for the account'),
			advanced: z
				.object({
					warm_ctd: z
						.boolean()
						.optional()
						.describe('Whether the account is in warm CTD mode'),
					open_rate: z
						.number()
						.optional()
						.describe('Email open rate for the account'),
					important_rate: z
						.number()
						.optional()
						.describe('Important email rate for the account'),
					read_emulation: z
						.boolean()
						.optional()
						.describe('Whether read emulation is enabled'),
					spam_save_rate: z
						.number()
						.optional()
						.describe('Spam save rate for the account'),
					weekday_only: z
						.boolean()
						.optional()
						.describe('Whether to send emails only on weekdays'),
				})
				.optional()
				.describe('Advanced settings for the account'),
			warmup_custom_ftag: z
				.string()
				.optional()
				.describe('Custom tag for the account'),
			increment: z
				.enum(['disabled', '0', '1', '2', '3', '4'])
				.optional()
				.describe(
					'Daily increment added to the sending limit, starting from 0, until the full daily limit is reached (slow ramp). Gradually increases sending volume to improve deliverability. Set to `disabled` to send at the full daily...; 0 0, 1 1, 2 2, 3 3, 4 4, disabled Disabled',
				),
			reply_rate: z.number().optional().describe('Reply rate for the account'),
		})
		.optional()
		.describe('Warmup configuration for the account'),
	daily_limit: z
		.number()
		.nullable()
		.optional()
		.describe('Daily email sending limit'),
	tracking_domain_name: z
		.string()
		.nullable()
		.optional()
		.describe('Tracking domain'),
	tracking_domain_status: z
		.string()
		.nullable()
		.optional()
		.describe('Tracking domain status'),
	enable_slow_ramp: z
		.boolean()
		.nullable()
		.optional()
		.describe('Whether to enable slow ramp up for sending limits'),
	inbox_placement_test_limit: z
		.number()
		.min(0)
		.nullable()
		.optional()
		.describe('The limit for inbox placement tests'),
	provider_code: z
		.union([
			z.literal(1),
			z.literal(2),
			z.literal(3),
			z.literal(4),
			z.literal(8),
			z.literal(11),
		])
		.describe(
			'Provider code for the account. Please make sure to specify the right provider code, otherwise your account will not work.; 1 Custom IMAP/SMTP, 2 Google, 3 Microsoft, 4 AWS, 8 AirMail, 11 Airmail Instant',
		),
	sending_gap: z
		.number()
		.min(0)
		.max(1440)
		.optional()
		.describe(
			'The gap between emails sent from this account in minutes (minimum wait time when used with multiple campaigns)',
		),
	signature: z
		.string()
		.nullable()
		.optional()
		.describe('Email signature for the account'),
	reply_to: z.string().optional(),
	imap_username: z.string(),
	imap_password: z.string(),
	imap_host: z.string(),
	imap_port: z.number(),
	smtp_username: z.string(),
	smtp_password: z.string(),
	smtp_host: z.string(),
	smtp_port: z.number(),
	warmup_custom_ftag: z.string().optional(),
	skip_cname_check: z.boolean().optional(),
});

const AccountsUpdateInput = z.object({
	email: z.string().min(1).describe('The email of the account to update'),
	first_name: z
		.string()
		.optional()
		.describe('First name associated with the account'),
	last_name: z
		.string()
		.optional()
		.describe('Last name associated with the account'),
	warmup: z
		.object({
			limit: z
				.number()
				.optional()
				.describe('Email sending limit for the account'),
			advanced: z
				.object({
					warm_ctd: z
						.boolean()
						.optional()
						.describe('Whether the account is in warm CTD mode'),
					open_rate: z
						.number()
						.optional()
						.describe('Email open rate for the account'),
					important_rate: z
						.number()
						.optional()
						.describe('Important email rate for the account'),
					read_emulation: z
						.boolean()
						.optional()
						.describe('Whether read emulation is enabled'),
					spam_save_rate: z
						.number()
						.optional()
						.describe('Spam save rate for the account'),
					weekday_only: z
						.boolean()
						.optional()
						.describe('Whether to send emails only on weekdays'),
				})
				.optional()
				.describe('Advanced settings for the account'),
			warmup_custom_ftag: z
				.string()
				.optional()
				.describe('Custom tag for the account'),
			increment: z
				.enum(['disabled', '0', '1', '2', '3', '4'])
				.optional()
				.describe(
					'Daily increment added to the sending limit, starting from 0, until the full daily limit is reached (slow ramp). Gradually increases sending volume to improve deliverability. Set to `disabled` to send at the full daily...; 0 0, 1 1, 2 2, 3 3, 4 4, disabled Disabled',
				),
			reply_rate: z.number().optional().describe('Reply rate for the account'),
		})
		.optional()
		.describe('Warmup configuration for the account'),
	daily_limit: z
		.number()
		.nullable()
		.optional()
		.describe('Daily email sending limit'),
	tracking_domain_name: z
		.string()
		.nullable()
		.optional()
		.describe('Tracking domain'),
	tracking_domain_status: z
		.string()
		.nullable()
		.optional()
		.describe('Tracking domain status'),
	enable_slow_ramp: z
		.boolean()
		.nullable()
		.optional()
		.describe('Whether to enable slow ramp up for sending limits'),
	inbox_placement_test_limit: z
		.number()
		.min(0)
		.nullable()
		.optional()
		.describe('The limit for inbox placement tests'),
	sending_gap: z
		.number()
		.min(0)
		.max(1440)
		.optional()
		.describe(
			'The gap between emails sent from this account in minutes (minimum wait time when used with multiple campaigns)',
		),
	signature: z
		.string()
		.nullable()
		.optional()
		.describe('Email signature for the account'),
	reply_to: z
		.string()
		.nullable()
		.optional()
		.describe('Custom reply-to email address for the account'),
	skip_cname_check: z.boolean().optional(),
	remove_tracking_domain: z.boolean().optional(),
});

const AccountsDeleteInput = z.object({
	email: z.string().min(1).describe('The email of the account to get'),
});

const AccountsGetDailyAnalyticsInput = z.object({
	start_date: z
		.string()
		.optional()
		.describe(
			'Start date for the analytics period. Defaults to a 30-day window ending at end_date. The maximum range is 31 days.',
		),
	end_date: z
		.string()
		.optional()
		.describe(
			'End date for the analytics period. Defaults to the current date.',
		),
	emails: z
		.array(z.string())
		.min(1)
		.max(200)
		.optional()
		.describe(
			'Email accounts to include. This filter is required and accepts at most 200 unique accounts.',
		),
});

const AccountsPauseManyInput = z.object({
	emails: z
		.array(z.string())
		.min(1)
		.max(100)
		.describe('Email addresses to pause. Duplicate values are ignored.'),
});

const AccountsMarkFixedInput = z.object({
	email: z.string().min(1).describe('Account email'),
});

const AccountsGetTrackingDomainStatusInput = z.object({
	host: z.string().describe('Custom tracking domain host'),
});

const AccountsTestVitalsInput = z.object({
	accounts: z.array(z.string()).optional(),
});

const AccountsMoveToWorkspaceInput = z.object({
	emails: z
		.array(z.string())
		.min(1)
		.describe('Array of email addresses of the accounts to move'),
	source_workspace_id: z
		.string()
		.describe(
			'ID of the source workspace (the workspace that the accounts are currently in)',
		),
	destination_workspace_id: z
		.string()
		.describe(
			'ID of the destination workspace (the workspace that the accounts will be moved to)',
		),
});

const AccountsListCampaignsInput = z.object({
	email: z.string().min(1).describe('Email'),
	limit: z.number().optional(),
	starting_after: z.string().optional(),
});

const CampaignsDeleteInput = z.object({
	id: z.string().min(1).describe('The ID of the item to delete'),
});

const CampaignsSearchByLeadInput = z.object({
	search: z.string().optional().describe('Search by lead email'),
	sort_column: z.string().optional().describe('Sort campaigns by column name'),
	sort_order: z.string().optional().describe('Sort direction'),
});

const CampaignsGetDailyAnalyticsInput = z.object({
	campaign_id: z
		.string()
		.optional()
		.describe(
			'Campaign ID (optional). Leave this field empty to get the analytics for all campaigns',
		),
	start_date: z
		.string()
		.optional()
		.describe(
			'Start of the analytics range. Accepts a date-only value (`YYYY-MM-DD`) or a full ISO 8601 timestamp. Date-only values are interpreted as UTC midnight — e.g. `2026-04-07` is treated as `2026-04-07T00:00:00.000Z`.',
		),
	end_date: z
		.string()
		.optional()
		.describe(
			'End of the analytics range. Accepts a date-only value (`YYYY-MM-DD`) or a full ISO 8601 timestamp. Date-only values are interpreted as UTC midnight — e.g. `2026-04-07` is treated as `2026-04-07T00:00:00.000Z`.',
		),
	campaign_status: z
		.union([
			z.literal(-99),
			z.literal(-1),
			z.literal(-2),
			z.literal(0),
			z.literal(1),
			z.literal(2),
			z.literal(3),
			z.literal(4),
		])
		.optional()
		.describe(
			'Filter by campaign status (only the analytics for the campaigns with the specified status will be returned); 0 Draft, 1 Active, 2 Paused, 3 Completed, 4 Running Subsequences, -99 Account Suspended, -1 Accounts Unhealthy, -2 Bounce Protect',
		),
});

const CampaignsShareInput = z.object({
	id: z.string().min(1).describe('Campaign ID'),
});

const CampaignsCreateFromSharedInput = z.object({
	id: z.string().min(1).describe('Campaign ID'),
});

const CampaignsExportInput = z.object({
	id: z.string().min(1).describe('Campaign ID'),
});

const CampaignsDuplicateInput = z.object({
	id: z.string().min(1).describe('Campaign ID'),
	name: z
		.string()
		.optional()
		.describe(
			'Campaign new name (optional). If not provided, it will default to CAMPAIGN NAME (copy).',
		),
});

const CampaignsCountLaunchedInput = z.object({});

const CampaignsAddVariablesInput = z.object({
	id: z.string().min(1).describe('Campaign ID'),
	variables: z.array(z.string()),
});

const CampaignsGetSendingStatusInput = z.object({
	id: z.string().min(1).describe('Campaign ID'),
	with_ai_summary: z
		.boolean()
		.optional()
		.describe('Include AI-generated summary'),
});

const SubsequencesCreateInput = z.object({
	parent_campaign: z.string().describe('ID of the parent campaign'),
	name: z.string().describe('Name of the subsequence'),
	conditions: z
		.object({
			crm_status: z
				.array(z.number().min(-30000).max(30000))
				.optional()
				.describe(
					'Lead CRM statuses that trigger the subsequence. Accepts the built-in statuses listed below, or the interest status of a custom lead label.',
				),
			lead_activity: z
				.array(z.union([z.literal(4), z.literal(91), z.literal(2)]))
				.optional()
				.describe('Lead activities that trigger the subsequence.'),
			reply_contains: z.string().optional(),
		})
		.describe('Conditions that trigger the subsequence'),
	subsequence_schedule: CampaignScheduleSchema.optional().describe(
		"Schedule for the subsequence; omit to use the parent campaign's. Time zones take the same aliases as campaigns (America/New_York is sent as America/Detroit)",
	),
	sequences: SequencesSchema.optional(),
	auto_variant_select: z
		.object({ trigger: z.enum(['reply_rate', 'click_rate', 'open_rate']) })
		.nullable()
		.optional()
		.describe(
			'Automatically select the winning variant for each step using open, click, or reply rate. Set to `null` to disable automatic selection.',
		),
	daily_limit_mode: z
		.enum(['inherit', 'custom', 'unlimited'])
		.optional()
		.describe(
			'Daily limit mode for the subsequence. "inherit" uses the parent campaign limit, "custom" uses a subsequence-specific limit, "unlimited" bypasses the campaign-level daily limit.',
		),
	daily_limit: z
		.number()
		.nullable()
		.optional()
		.describe(
			'Custom daily limit for the subsequence. Only used when `daily_limit_mode` is "custom".',
		),
	ignore_account_daily_limit: z
		.boolean()
		.optional()
		.describe(
			'When enabled, the subsequence will send even when sending accounts have reached their daily limit.',
		),
});

const SubsequencesListInput = z
	.object({
		limit: z
			.number()
			.int()
			.min(1)
			.max(100)
			.optional()
			.describe('The number of items to return'),
		starting_after: z
			.string()
			.optional()
			.describe(
				'The ID of the last item in the previous page - used for pagination. You can use the value of the `next_starting_after` field from the previous response.',
			),
		parent_campaign: z
			.string()
			.optional()
			.describe('The ID of the campaign to list the subsequences of.'),
		parent_campaign_not: z
			.string()
			.optional()
			.describe(
				"The ID of a campaign to exclude subsequences of, returning reusable subsequences from the workspace's other campaigns instead.",
			),
		search: z
			.string()
			.optional()
			.describe('The search query to filter the subsequences by.'),
	})
	.refine(
		(input) =>
			input.parent_campaign !== undefined ||
			input.parent_campaign_not !== undefined,
		{
			// Instantly answers 400 without one (checked live 2026-10-28); the
			// spec marks neither required.
			message: 'Pass parent_campaign or parent_campaign_not',
			path: ['parent_campaign'],
		},
	);

const SubsequencesGetInput = z.object({
	id: z.string().min(1).describe('The ID of the requested item'),
});

const SubsequencesUpdateInput = z.object({
	id: z.string().min(1).describe('The ID of the item to update'),
	name: z.string().optional().describe('Name of the subsequence'),
	conditions: z
		.object({
			crm_status: z
				.array(z.number().min(-30000).max(30000))
				.optional()
				.describe(
					'Lead CRM statuses that trigger the subsequence. Accepts the built-in statuses listed below, or the interest status of a custom lead label.',
				),
			lead_activity: z
				.array(z.union([z.literal(4), z.literal(91), z.literal(2)]))
				.optional()
				.describe('Lead activities that trigger the subsequence.'),
			reply_contains: z.string().optional(),
		})
		.optional()
		.describe('Conditions that trigger the subsequence'),
	subsequence_schedule: CampaignScheduleSchema.optional().describe(
		"Schedule for the subsequence; omit to use the parent campaign's. Time zones take the same aliases as campaigns (America/New_York is sent as America/Detroit)",
	),
	sequences: SequencesSchema.optional(),
	auto_variant_select: z
		.object({ trigger: z.enum(['reply_rate', 'click_rate', 'open_rate']) })
		.nullable()
		.optional()
		.describe(
			'Automatically select the winning variant for each step using open, click, or reply rate. Set to `null` to disable automatic selection.',
		),
	daily_limit_mode: z
		.enum(['inherit', 'custom', 'unlimited'])
		.optional()
		.describe(
			'Daily limit mode for the subsequence. "inherit" uses the parent campaign limit, "custom" uses a subsequence-specific limit, "unlimited" bypasses the campaign-level daily limit.',
		),
	daily_limit: z
		.number()
		.nullable()
		.optional()
		.describe(
			'Custom daily limit for the subsequence. Only used when `daily_limit_mode` is "custom".',
		),
	ignore_account_daily_limit: z
		.boolean()
		.optional()
		.describe(
			'When enabled, the subsequence will send even when sending accounts have reached their daily limit.',
		),
});

const SubsequencesDeleteInput = z.object({
	id: z.string().min(1).describe('The ID of the item to delete'),
});

const SubsequencesDuplicateInput = z.object({
	id: z.string().min(1).describe('The ID of the subsequence to duplicate.'),
	parent_campaign: z
		.string()
		.describe('The ID of the campaign to duplicate the subsequence to.'),
	name: z
		.string()
		.optional()
		.describe(
			'The name of the duplicate subsequence. Defaults to the source subsequence name when omitted.',
		),
});

const SubsequencesPauseInput = z.object({
	id: z.string().min(1).describe('Subsequence ID'),
});

const SubsequencesResumeInput = z.object({
	id: z.string().min(1).describe('The ID of the subsequence to resume.'),
});

const SubsequencesGetAnalyticsInput = z.object({
	campaign_id: z
		.string()
		.describe('The ID of the campaign to fetch subsequence analytics for.'),
});

const SubsequencesGetStepAnalyticsInput = z.object({
	id: z.string().min(1).describe('The ID of the subsequence to analyze.'),
	start_date: z
		.string()
		.optional()
		.describe(
			'Inclusive start of the analytics range. Accepts a date-only value (`YYYY-MM-DD`) or an ISO 8601 timestamp. Timestamps are normalized to their UTC calendar date.',
		),
	end_date: z
		.string()
		.optional()
		.describe(
			'Inclusive end of the analytics range. Accepts a date-only value (`YYYY-MM-DD`) or an ISO 8601 timestamp. Timestamps are normalized to their UTC calendar date.',
		),
});

const SubsequencesGetSendingStatusInput = z.object({
	id: z.string().min(1).describe('Subsequence ID'),
	with_ai_summary: z
		.boolean()
		.optional()
		.describe('Include AI-generated summary'),
});

const LeadsDeleteManyInput = z.object({
	campaign_id: z
		.string()
		.optional()
		.describe(
			'The ID of the campaign to delete leads from. Required if `list_id` is not provided.',
		),
	list_id: z
		.string()
		.optional()
		.describe(
			'The ID of the list to delete leads from. Required if `campaign_id` is not provided.',
		),
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
			'Optional status filter. Only delete leads with this status.; 1 Active, 2 Paused, 3 Completed, -1 Bounced, -2 Unsubscribed, -3 Skipped',
		),
	ids: z
		.array(z.string())
		.optional()
		.describe(
			'Optional array of specific lead IDs to delete. When provided, only these leads will be deleted from the specified campaign or list.',
		),
	limit: z
		.number()
		.int()
		.min(1)
		.max(10000)
		.optional()
		.describe(
			'Maximum number of leads to delete. If not specified, all matching leads will be deleted.',
		),
});

const LeadsMergeInput = z.object({
	lead_id: z.string().describe('The ID of the lead to merge.'),
	destination_lead_id: z
		.string()
		.describe('The ID of the destination lead to merge into.'),
});

const LeadsRemoveFromSubsequenceInput = z.object({
	id: z.string().describe('The ID of the lead to remove from the subsequence.'),
});

const LeadsAssignInput = z.object({
	search: z
		.string()
		.optional()
		.describe('The search query to filter leads by.'),
	filter: z
		.enum([
			'FILTER_VAL_CONTACTED',
			'FILTER_VAL_NOT_CONTACTED',
			'FILTER_VAL_COMPLETED',
			'FILTER_VAL_UNSUBSCRIBED',
			'FILTER_VAL_ACTIVE',
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
			'FILTER_VAL_BOUNCED',
			'FILTER_VAL_SKIPPED',
			'FILTER_VAL_RISKY',
			'FILTER_VAL_INVALID',
			'FILTER_VAL_VALID',
			'FILTER_VAL_CATCH_ALL',
			'FILTER_VAL_NOT_VERIFIED',
			'FILTER_VAL_IN_SUBSEQUENCE',
			'FILTER_VAL_OPENED_NO_REPLY',
			'FILTER_VAL_COMPLETED_NO_REPLY',
			'FILTER_VAL_NO_OPENS',
			'FILTER_VAL_REPLIED',
			'FILTER_VAL_LINK_CLICKED',
		])
		.optional()
		.describe('The filter to apply to the leads.'),
	campaign: z
		.string()
		.optional()
		.describe('The ID of the campaign to filter leads by.'),
	list_id: z
		.string()
		.optional()
		.describe('The ID of the list to filter leads by.'),
	in_campaign: z
		.boolean()
		.optional()
		.describe('Whether the leads are in the campaign.'),
	in_list: z
		.boolean()
		.optional()
		.describe('Whether the leads are in the list.'),
	organization_user_ids: z.array(z.string()).min(1),
	smart_view_id: z
		.string()
		.optional()
		.describe('The ID of the smart view to filter leads by.'),
	ids: z
		.array(z.string())
		.optional()
		.describe('The IDs of the leads to filter by.'),
	limit: z
		.number()
		.int()
		.min(0)
		.optional()
		.describe('The limit of the number of leads to return.'),
	queries: z
		.array(
			z.object({
				actionType: z
					.enum([
						'reply',
						'email-open',
						'last-contacted',
						'link-click',
						'lead-status',
						'lead-status-change',
					])
					.describe(
						'reply Reply, email-open Email Opened, last-contacted Last Contacted, link-click Link Click, lead-status Lead Status, lead-status-change Lead Status Change',
					),
				values: freeForm(),
			}),
		)
		.optional(),
	assigned_to: z
		.string()
		.optional()
		.describe(
			'Filter leads by their current owner (the user they are currently assigned to).',
		),
	has_clause: z
		.boolean()
		.optional()
		.describe(
			'Whether this endpoint should list data based on the filters currently applied in the web app.',
		),
});

const LeadsMoveInput = z.object({
	search: z
		.string()
		.optional()
		.describe(
			'A search string to search the leads against - can be First Name, Last Name, or Email',
		),
	filter: z
		.string()
		.optional()
		.describe(
			'Filter criteria for leads. For custom lead labels, use the `interest_status` field.; FILTER_VAL_CONTACTED Filter for contacted leads, FILTER_VAL_NOT_CONTACTED Filter for not contacted leads, FILTER_VAL_COMPLETED Filter for completed leads, FILTER_VAL_UNSUBSCRIBED Filter for unsubscrib',
		),
	campaign: z.string().optional().describe('Campaign ID to filter leads'),
	list_id: z.string().optional().describe('List ID to filter leads'),
	in_campaign: z
		.boolean()
		.optional()
		.describe('Whether the lead is in a campaign'),
	in_list: z.boolean().optional().describe('Whether the lead is in a list'),
	ids: z
		.array(z.string())
		.optional()
		.describe(
			'Array of lead IDs to include. When using this parameter, you must provide either `campaign` or `list_id` to specify which campaign or list to filter the leads from. This parameter acts as a filter within the specified...',
		),
	queries: z
		.array(
			z.object({
				actionType: z.enum([
					'reply',
					'email-open',
					'last-contacted',
					'link-click',
					'lead-status',
					'lead-status-change',
				]),
				values: freeForm(),
			}),
		)
		.optional(),
	excluded_ids: z
		.array(z.string())
		.optional()
		.describe('Array of lead IDs to exclude'),
	contacts: z
		.array(z.string())
		.optional()
		.describe('Array of emails the leads needs to have'),
	to_campaign_id: z
		.string()
		.optional()
		.describe('The ID of the campaign to move the leads to.'),
	to_list_id: z
		.string()
		.optional()
		.describe('The ID of the list to move the leads to.'),
	ignore_resource_filter_clauses: z
		.boolean()
		.optional()
		.describe(
			'Whether to ignore saved lead-finder clauses for the source campaign/list when selecting leads to move.',
		),
	check_duplicates_in_campaigns: z
		.boolean()
		.optional()
		.describe('Whether to check duplicates in campaigns.'),
	skip_leads_in_verification: z
		.boolean()
		.optional()
		.describe('Whether to skip leads in verification.'),
	skip_invalid_emails: z
		.boolean()
		.optional()
		.describe(
			'Whether to leave behind leads whose email verified as invalid or risky. Leads that were never verified still move.',
		),
	limit: z
		.number()
		.optional()
		.describe('The limit of the number of leads to move.'),
	assigned_to: z
		.string()
		.optional()
		.describe('The ID of the user to assign the leads to.'),
	esp_code: z
		.union([
			z.literal(0),
			z.literal(1),
			z.literal(2),
			z.literal(3),
			z.literal(8),
			z.literal(9),
			z.literal(10),
			z.literal(12),
			z.literal(13),
			z.literal(999),
			z.literal(1000),
		])
		.optional()
		.describe(
			'The ESP code to move the leads for.; 0 In Queue, 1 Google, 2 Microsoft, 3 Zoho, 8 AirMail, 9 Yahoo, 10 Yandex, 12 Webde, 13 Liberoit, 999 Other, 1000 Not Found',
		),
	esg_code: z
		.enum(['0', '1', '2', '3', '4', 'all', 'none'])
		.optional()
		.describe(
			'The ESG code to move the leads for.; 0 In Queue, 1 Barracuda, 2 Mimecast, 3 Proofpoint, 4 Cisco, all All, none None',
		),
	copy_leads: z.boolean().optional().describe('Whether to copy the leads.'),
	check_duplicates: z
		.boolean()
		.optional()
		.describe('Whether to check duplicates.'),
	reset_interest_status: z
		.boolean()
		.optional()
		.describe(
			'Whether to reset the interest status of leads when moving or copying them. When true, the interest status will be reset. When false, the existing interest status will be preserved; for non-copy campaign-to-campaign...',
		),
});

const LeadsMoveToSubsequenceInput = z.object({
	subsequence_id: z.string(),
	id: z.string(),
});

const LeadListsGetInput = z.object({
	id: z.string().min(1).describe('The ID of the requested item'),
});

const LeadListsUpdateInput = z.object({
	id: z.string().min(1).describe('The ID of the item to update'),
	has_enrichment_task: z
		.boolean()
		.nullable()
		.optional()
		.describe(
			'Whether this list runs the enrichment process on every added lead or not',
		),
	owned_by: z
		.string()
		.nullable()
		.optional()
		.describe(
			'User ID of the owner of this lead list. Defaults to the user that created the list',
		),
	name: z.string().optional().describe('Name of the lead list'),
});

const LeadListsDeleteInput = z.object({
	id: z.string().min(1).describe('The ID of the item to delete'),
});

const LeadListsGetVerificationStatsInput = z.object({
	id: z.string().min(1).describe('id of the leadLists item'),
});

const LeadLabelsCreateInput = z.object({
	label: z.string().describe('Display label for the custom lead label'),
	interest_status_label: z
		.enum(['positive', 'negative', 'neutral'])
		.describe(
			'Interest status label associated with this label; positive Positive, negative Negative, neutral Neutral',
		),
	description: z
		.string()
		.nullable()
		.optional()
		.describe('Detailed description of the custom lead label purpose'),
	use_with_ai: z
		.boolean()
		.nullable()
		.optional()
		.describe('Whether this label should be used with AI features'),
});

const LeadLabelsListInput = z.object({
	limit: z
		.number()
		.int()
		.min(1)
		.max(100)
		.optional()
		.describe('The number of items to return'),
	starting_after: z
		.string()
		.optional()
		.describe('The starting after timestamp to filter lead labels by.'),
	search: z
		.string()
		.optional()
		.describe('The search query to filter lead labels.'),
	interest_status: z
		.enum(['positive', 'neutral', 'negative'])
		.optional()
		.describe('The interest status to filter lead labels by.'),
});

const LeadLabelsGetInput = z.object({
	id: z.string().min(1).describe('The ID of the requested item'),
});

const LeadLabelsUpdateInput = z.object({
	id: z.string().min(1).describe('The ID of the item to update'),
	label: z
		.string()
		.optional()
		.describe('Display label for the custom lead label'),
	interest_status_label: z
		.enum(['positive', 'negative', 'neutral'])
		.optional()
		.describe(
			'Interest status label associated with this label; positive Positive, negative Negative, neutral Neutral',
		),
	description: z
		.string()
		.nullable()
		.optional()
		.describe('Detailed description of the custom lead label purpose'),
	use_with_ai: z
		.boolean()
		.nullable()
		.optional()
		.describe('Whether this label should be used with AI features'),
});

const LeadLabelsDeleteInput = z.object({
	id: z.string().min(1).describe('The ID of the item to delete'),
	reassigned_status: z
		.number()
		.optional()
		.describe('The interest status to reassign leads and emails to.'),
});

const LeadLabelsTestAiReplyLabelInput = z.object({
	reply_text: z.string().describe('The reply text to classify.'),
});

const CustomTagsCreateInput = z.object({
	label: z
		.string()
		.min(1)
		.describe(
			'Display label for the custom tag. Must be unique per workspace after trimming whitespace.',
		),
	description: z
		.string()
		.nullable()
		.optional()
		.describe('Detailed description of the custom tag purpose'),
});

const CustomTagsListInput = z.object({
	limit: z
		.number()
		.int()
		.min(1)
		.max(100)
		.optional()
		.describe('The number of items to return'),
	starting_after: z
		.string()
		.optional()
		.describe(
			'The ID of the last item in the previous page - used for pagination. You can use the value of the `next_starting_after` field from the previous response.',
		),
	search: z
		.string()
		.optional()
		.describe('The search query to filter custom tags.'),
	resource_ids: z
		.string()
		.optional()
		.describe(
			'The list of resource ids to filter custom tags by. A resource id is the id of an account or a campaign.',
		),
	tag_ids: z
		.string()
		.optional()
		.describe('The list of tag ids to filter custom tags by.'),
});

const CustomTagsGetInput = z.object({
	id: z.string().min(1).describe('The ID of the requested item'),
});

const CustomTagsUpdateInput = z.object({
	id: z.string().min(1).describe('The ID of the item to update'),
	label: z
		.string()
		.min(1)
		.optional()
		.describe(
			'Display label for the custom tag. Must be unique per workspace after trimming whitespace.',
		),
	description: z
		.string()
		.nullable()
		.optional()
		.describe('Detailed description of the custom tag purpose'),
});

const CustomTagsDeleteInput = z.object({
	id: z.string().min(1).describe('The ID of the item to delete'),
});

const CustomTagsToggleResourceInput = z.object({
	tag_ids: z
		.array(z.string())
		.min(1)
		.describe('The list of tag ids to assign or unassign'),
	resource_type: z
		.union([z.literal(1), z.literal(2), z.literal(3)])
		.describe(
			'The resource type to assign or unassign the tags to; 1 Account, 2 Campaign, 3 Workspace',
		),
	resource_ids: z
		.array(z.string())
		.min(1)
		.optional()
		.describe(
			'The list of resource ids to assign or unassign. A resource id is the id of an account or a campaign. Required unless `selected_all` is `true`.',
		),
	excluded_resource_ids: z
		.array(z.string())
		.min(1)
		.optional()
		.describe(
			'Optional list of resource ids to exclude when `selected_all` is `true`.',
		),
	assign: z.boolean().describe('Whether to assign the tags to the resources.'),
	selected_all: z
		.boolean()
		.optional()
		.describe('Whether to select all resources.'),
	filter: z
		.union([
			z
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
				.nullable(),
			z.object({
				tag_id: z.union([z.string(), z.enum(['no-tag'])]).optional(),
				tag_ids: z.array(z.string()).min(1).optional(),
				tag_ids_all: z.array(z.string()).min(1).optional(),
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
					.nullable()
					.optional()
					.describe(
						'ACC_FILTER_PAUSED Paused, ACC_FILTER_ERROR Error, ACC_FILTER_NO_CTD No CTD, ACC_FILTER_PW_ACCOUNTS PW Accounts, ACC_FILTER_DFY DFY, ACC_FILTER_DFY_SETUP_PENDING DFY Setup Pending, ACC_FILTER_W_ACTIVE ',
					),
				search: z.string().optional(),
			}),
		])
		.optional()
		.describe(
			'Optional selected-all filter. Accepts the existing account-status string shape and the merged object shape for account status, tag, any-tag, all-tags, and search criteria.',
		),
	search: z
		.string()
		.optional()
		.describe(
			'Optional selected-all search query. If omitted, `filter.search` is used when present.',
		),
});

const CustomTagMappingsListInput = z.object({
	limit: z
		.number()
		.int()
		.min(1)
		.max(100)
		.optional()
		.describe('The number of items to return'),
	starting_after: z
		.string()
		.optional()
		.describe(
			'The ID of the last item in the previous page - used for pagination. You can use the value of the `next_starting_after` field from the previous response.',
		),
	resource_ids: z
		.string()
		.optional()
		.describe(
			'The list of resource ids to filter custom tag mappings by. A resource id is the id of an account or a campaign.',
		),
});

const EmailsSendTestInput = z.object({
	eaccount: z
		.string()
		.describe(
			'The email account that will be used to send this email. It has to be an email account connected to your workspace.',
		),
	to_address_email_list: z
		.string()
		.describe(
			'Comma-separated list of recipients that will receive the test email.',
		),
	subject: z.string().describe('Subject line of the test email.'),
	body: z
		.object({
			html: z
				.string()
				.describe(
					'HTML body of the test email. Use `` tags for delivered email line breaks.',
				),
		})
		.describe(
			'HTML body of the test email. Use `` tags for delivered email line breaks.',
		),
});

const EmailsForwardInput = z.object({
	body: z
		.object({
			html: z
				.string()
				.optional()
				.describe(
					'HTML body of the forwarded email. Use `` tags for delivered email line breaks.',
				),
			text: z
				.string()
				.optional()
				.describe(
					'Text body of the forwarded email. Newline characters are preserved as delivered line breaks.',
				),
		})
		.optional()
		.describe(
			'Optional body content for the forwarded email. When `include_original_body` is `true`, this can be used as a note before the appended original email content. You can specify either the `html` or the `text` field, or...',
		),
	include_original_body: z
		.boolean()
		.optional()
		.describe(
			'When true, append the original email headers and content after the provided body. Default: false.',
		),
	eaccount: z
		.string()
		.optional()
		.describe(
			'The email account that will be used to send this email. It has to be an email account connected to your workspace',
		),
	reply_to_uuid: z
		.string()
		.optional()
		.describe('The id of the email you want to forward'),
	to_address_email_list: z
		.string()
		.optional()
		.describe(
			'Comma-separated list of recipients that will receive the forwarded email',
		),
	subject: z
		.string()
		.optional()
		.describe('Subject line of the forwarded email message'),
	cc_address_email_list: z
		.string()
		.optional()
		.describe('Comma-separated list of CC email addresses'),
	bcc_address_email_list: z
		.string()
		.optional()
		.describe('Comma-separated list of BCC email addresses'),
	reply_to: z
		.string()
		.optional()
		.describe(
			'Reply-to email address that recipients should use when replying',
		),
	forwarded_attachments: z
		.string()
		.optional()
		.describe(
			'JSON-encoded forwarded attachment metadata from the original email',
		),
	assigned_to: z
		.string()
		.optional()
		.describe('The user id assigned to the lead'),
});

const EmailsUpdateInput = z.object({
	id: z.string().min(1).describe('The ID of the item to update'),
	is_unread: z
		.number()
		.nullable()
		.optional()
		.describe('Indicates if the email is unread'),
	reminder_ts: z
		.string()
		.nullable()
		.optional()
		.describe('Timestamp for the reminder.'),
});

const EmailsDeleteInput = z.object({
	id: z.string().min(1).describe('The ID of the item to delete'),
});

const EmailVerificationVerifyInput = z.object({
	email: z.string().describe('The email address to verify'),
	webhook_url: z
		.string()
		.optional()
		.describe(
			'A webhook URL to receive the verification results. If the email verification takes more than 10 seconds we will send the results to this URL.',
		),
});

const EmailVerificationGetStatusInput = z.object({
	email: z.string().min(1).describe('The email address to verify'),
});

const BlocklistGetInput = z.object({
	id: z.string().min(1).describe('The ID of the requested item'),
});

const BlocklistUpdateInput = z.object({
	id: z.string().min(1).describe('The ID of the item to update'),
	bl_value: z.string().optional().describe('The email or domain to block'),
});

const BlocklistDeleteAllInput = z.object({
	domains_only: z.boolean().optional().describe('Filter by domain'),
	search: z.string().optional().describe('Search by value'),
});

const BlocklistAddManyInput = z.object({
	bl_values: z
		.array(z.string())
		.min(1)
		.max(1000)
		.describe('List of domains or emails to block'),
});

const BlocklistRemoveManyInput = z.object({
	ids: z
		.array(z.string())
		.min(1)
		.max(1000)
		.describe('List block list entry ids to delete'),
});

const BlocklistDownloadCsvInput = z.object({
	domains_only: z.boolean().optional().describe('Filter by domain'),
	search: z.string().optional().describe('Search by value'),
});

const WebhooksGetInput = z.object({
	id: z.string().min(1).describe('The ID of the requested item'),
});

const WebhooksUpdateInput = z.object({
	id: z.string().min(1).describe('The ID of the item to update'),
	campaign: z
		.string()
		.nullable()
		.optional()
		.describe(
			'Optional campaign UUID to filter events (null = all campaigns in workspace)',
		),
	name: z
		.string()
		.nullable()
		.optional()
		.describe('Optional user-defined name for the webhook'),
	target_hook_url: z
		.string()
		.optional()
		.describe('Target URL to send webhook payloads'),
	event_type: z
		.enum([
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
		])
		.nullable()
		.optional()
		.describe(
			'Type of event to trigger the webhook (null for custom label events). Set to "all_events" to subscribe to all events - including custom label events',
		),
	custom_interest_value: z
		.number()
		.nullable()
		.optional()
		.describe(
			'Custom interest value - corresponds to LeadLabel.interest_status (used for custom label events)',
		),
	headers: z
		.record(z.string(), z.string())
		.nullable()
		.optional()
		.describe(
			'Optional HTTP headers to include when delivering webhook payloads (key-value pairs)',
		),
});

const WebhooksTestInput = z.object({
	id: z.string().min(1).describe('id of the webhooks item'),
});

const WebhooksResumeInput = z.object({
	id: z.string().min(1).describe('id of the webhooks item'),
});

const WebhookEventsListInput = z.object({
	limit: z
		.number()
		.int()
		.min(1)
		.max(100)
		.optional()
		.describe('The number of items to return'),
	starting_after: z
		.string()
		.optional()
		.describe(
			'The ID of the last item in the previous page - used for pagination. You can use the value of the `next_starting_after` field from the previous response.',
		),
	success: z.boolean().optional().describe('Filter by success status'),
	from: z
		.string()
		.optional()
		.describe('Inclusive start of the window (YYYY-MM-DD).'),
	to: z
		.string()
		.optional()
		.describe('Inclusive end of the window (YYYY-MM-DD).'),
	search: z
		.string()
		.optional()
		.describe('Search by exact webhook URL or lead email match'),
});

const WebhookEventsGetInput = z.object({
	id: z.string().min(1).describe('The ID of the requested item'),
});

const WebhookEventsGetSummaryInput = z.object({
	from: z
		.string()
		.optional()
		.describe('Inclusive start of the window (YYYY-MM-DD).'),
	to: z
		.string()
		.optional()
		.describe('Inclusive end of the window (YYYY-MM-DD).'),
});

const WebhookEventsGetSummaryByDateInput = z.object({
	from: z
		.string()
		.optional()
		.describe('Inclusive start of the window (YYYY-MM-DD).'),
	to: z
		.string()
		.optional()
		.describe('Inclusive end of the window (YYYY-MM-DD).'),
});

const InboxPlacementTestsCreateInput = z.object({
	name: z.string().describe('Name of the inbox placement test'),
	delivery_mode: z
		.union([z.literal(1), z.literal(2)])
		.nullable()
		.optional()
		.describe(
			'Whether to send emails one by one or all together; 1 One by one, 2 All together',
		),
	description: z
		.string()
		.nullable()
		.optional()
		.describe('Description of the inbox placement test'),
	schedule: z
		.object({
			days: z
				.record(z.string(), z.boolean())
				.optional()
				.describe(
					'Days of the week when the test will run, where keys are integers (0-6, 0 = Sunday) and values are booleans indicating active days.',
				),
			timing: z
				.object({
					from: z
						.string()
						.optional()
						.describe(
							'The time of day when the test will start (24-hour format).',
						),
				})
				.optional()
				.describe('Timing configuration for the scheduled test.'),
			timezone: z
				.enum(ACCEPTED_TIMEZONES)
				.optional()
				.describe(
					'Timezone in which the schedule is set, in IANA timezone format.',
				),
		})
		.optional()
		.describe(
			'Specifies the date and time when the automated inbox placement tests will be sent.',
		),
	type: z
		.union([z.literal(1), z.literal(2)])
		.describe(
			'Whether the inbox placement test is a one-time test or an automated test',
		),
	sending_method: z
		.union([z.literal(1), z.literal(2)])
		.describe(
			'Whether the inbox placement test will be sent from Instantly or from outside Instantly; 1 From Instantly, 2 From Outside Instantly',
		),
	campaign_id: z.string().nullable().optional().describe('Campaign ID'),
	email_subject: z
		.string()
		.describe('Email subject of the inbox placement test'),
	email_body: z.string().describe('Email body of the inbox placement test'),
	emails: z
		.array(z.string())
		.describe('Emails to send the inbox placement test to'),
	test_code: z
		.string()
		.nullable()
		.optional()
		.describe(
			'Code for identifying inbox placement tests sent from outside Instantly. Use ptid_ followed by letters, numbers, hyphens, or underscores. When creating a test, the ptid_ prefix is added automatically if omitted. The full...',
		),
	tags: z
		.array(z.string())
		.nullable()
		.optional()
		.describe('List of tag IDs to use for sending emails'),
	text_only: z
		.boolean()
		.nullable()
		.optional()
		.describe('Disables open tracking'),
	recipients_labels: z
		.array(
			z.object({
				region: z.string().describe('The region to send emails to'),
				sub_region: z.string().describe('The sub-region to send emails to'),
				type: z.string().describe('The type of email to send'),
				esp: z
					.string()
					.describe('The Email Service Provider (ESP) to send emails to'),
			}),
		)
		.optional()
		.describe(
			'A list of email providers and their corresponding types to which emails will be sent. To retrieve the available options, use the `GET: /inbox-placement-tests/email-service-provider-options` endpoint',
		),
	timestamp_next_run: z
		.string()
		.nullable()
		.optional()
		.describe('Timestamp when the inbox placement test will run next'),
	automations: z
		.array(
			z.object({
				when: freeForm(),
				then: freeForm().describe('Actions to take when condition is met'),
			}),
		)
		.nullable()
		.optional()
		.describe('Optional automations to trigger based on conditions'),
	status: z
		.union([z.literal(1), z.literal(2), z.literal(3)])
		.nullable()
		.optional()
		.describe(
			'Status of the inbox placement test; 1 Active, 2 Paused, 3 Completed',
		),
	not_sending_status: z
		.enum(['daily_limits_hit', 'other'])
		.nullable()
		.optional()
		.describe(
			'Why the inbox placement test is currently not sending. It will be an empty string if there are no issues.; daily_limits_hit Daily limits hit, other Other reason',
		),
	run_immediately: z
		.boolean()
		.optional()
		.describe(
			'Run the test immediately after creation, as well as on the schedule',
		),
});

const InboxPlacementTestsListInput = z.object({
	limit: z
		.number()
		.int()
		.min(1)
		.max(100)
		.optional()
		.describe('The number of items to return'),
	starting_after: z
		.string()
		.optional()
		.describe(
			'The ID of the last item in the previous page - used for pagination. You can use the value of the `next_starting_after` field from the previous response.',
		),
	search: z.string().optional(),
	status: z.union([z.literal(1), z.literal(2), z.literal(3)]).optional(),
	sort_order: z
		.enum(['asc', 'desc'])
		.optional()
		.describe(
			'Sort order for the results. Results are always sorted by id (which is timestamp-sorted due to UUIDv7).',
		),
});

const InboxPlacementTestsGetInput = z.object({
	id: z.string().min(1).describe('The ID of the requested item'),
	with_metadata: z
		.boolean()
		.optional()
		.describe(
			'Whether to include additional metadata about the inbox placement test',
		),
});

const InboxPlacementTestsUpdateInput = z.object({
	id: z.string().min(1).describe('The ID of the item to update'),
	name: z.string().optional().describe('Name of the inbox placement test'),
	schedule: z
		.object({
			days: z
				.record(z.string(), z.boolean())
				.optional()
				.describe(
					'Days of the week when the test will run, where keys are integers (0-6, 0 = Sunday) and values are booleans indicating active days.',
				),
			timing: z
				.object({
					from: z
						.string()
						.optional()
						.describe(
							'The time of day when the test will start (24-hour format).',
						),
				})
				.optional()
				.describe('Timing configuration for the scheduled test.'),
			timezone: z
				.enum(ACCEPTED_TIMEZONES)
				.optional()
				.describe(
					'Timezone in which the schedule is set, in IANA timezone format.',
				),
		})
		.optional()
		.describe(
			'Specifies the date and time when the automated inbox placement tests will be sent.',
		),
	automations: z
		.array(
			z.object({
				when: freeForm(),
				then: freeForm().describe('Actions to take when condition is met'),
			}),
		)
		.nullable()
		.optional()
		.describe('Optional automations to trigger based on conditions'),
	status: z
		.union([z.literal(1), z.literal(2), z.literal(3)])
		.nullable()
		.optional()
		.describe(
			'Status of the inbox placement test; 1 Active, 2 Paused, 3 Completed',
		),
});

const InboxPlacementTestsDeleteInput = z.object({
	id: z.string().min(1).describe('The ID of the item to delete'),
});

const InboxPlacementTestsListEspOptionsInput = z.object({});

const InboxPlacementAnalyticsListInput = z.object({
	limit: z
		.number()
		.int()
		.min(1)
		.max(100)
		.optional()
		.describe('The number of items to return'),
	starting_after: z
		.string()
		.optional()
		.describe(
			'The ID of the last item in the previous page - used for pagination. You can use the value of the `next_starting_after` field from the previous response.',
		),
	test_id: z.string(),
	date_from: z.string().optional(),
	date_to: z.string().optional(),
	recipient_geo: z
		.string()
		.optional()
		.describe('A comma-separated list of recipient geo values.'),
	recipient_type: z
		.string()
		.optional()
		.describe('A comma-separated list of recipient type values.'),
	recipient_esp: z
		.string()
		.optional()
		.describe('A comma-separated list of recipient ESP values.'),
	sender_email: z.string().optional(),
});

const InboxPlacementAnalyticsGetInput = z.object({
	id: z.string().min(1).describe('The ID of the requested item'),
});

const InboxPlacementAnalyticsGetStatsByTestInput = z.object({
	test_ids: z.array(z.string()).min(1),
	date_from: z.string().optional(),
	date_to: z.string().optional(),
	recipient_geo: z
		.array(z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4)]))
		.optional(),
	recipient_type: z.array(z.union([z.literal(1), z.literal(2)])).optional(),
	recipient_esp: z
		.array(
			z.union([
				z.literal(1),
				z.literal(2),
				z.literal(8),
				z.literal(12),
				z.literal(13),
			]),
		)
		.optional(),
	sender_email: z.string().optional(),
});

const InboxPlacementAnalyticsGetDeliverabilityInsightsInput = z.object({
	test_id: z.string(),
	date_from: z.string().optional(),
	date_to: z.string().optional(),
	previous_date_from: z.string().optional(),
	previous_date_to: z.string().optional(),
	show_previous: z.boolean().optional(),
	recipient_geo: z
		.array(z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4)]))
		.optional(),
	recipient_type: z.array(z.union([z.literal(1), z.literal(2)])).optional(),
	recipient_esp: z
		.array(
			z.union([
				z.literal(1),
				z.literal(2),
				z.literal(8),
				z.literal(12),
				z.literal(13),
			]),
		)
		.optional(),
});

const InboxPlacementAnalyticsGetStatsByDateInput = z.object({
	test_id: z.string(),
	date_from: z.string().optional(),
	date_to: z.string().optional(),
	recipient_geo: z
		.array(z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4)]))
		.optional(),
	recipient_type: z.array(z.union([z.literal(1), z.literal(2)])).optional(),
	recipient_esp: z
		.array(
			z.union([
				z.literal(1),
				z.literal(2),
				z.literal(8),
				z.literal(12),
				z.literal(13),
			]),
		)
		.optional(),
	sender_email: z.string().optional(),
});

const InboxPlacementReportsListInput = z.object({
	limit: z
		.number()
		.int()
		.min(1)
		.max(100)
		.optional()
		.describe('The number of items to return'),
	starting_after: z
		.string()
		.optional()
		.describe(
			'The ID of the last item in the previous page - used for pagination. You can use the value of the `next_starting_after` field from the previous response.',
		),
	test_id: z.string(),
	date_from: z.string().optional(),
	date_to: z.string().optional(),
	skip_spam_assassin_report: z
		.boolean()
		.optional()
		.describe('Flag to skip including spam_assassin_report JSON'),
	skip_blacklist_report: z
		.boolean()
		.optional()
		.describe('Flag to skip including blacklist_report JSON'),
});

const InboxPlacementReportsGetInput = z.object({
	id: z.string().min(1).describe('The ID of the requested item'),
});

const WorkspaceUpdateInput = z.object({
	name: z.string().optional().describe('Name of the workspace'),
	org_logo_url: z
		.string()
		.nullable()
		.optional()
		.describe('URL to workspace logo'),
});

const WorkspaceScheduleRemovalInput = z.object({});

const WorkspaceCancelRemovalInput = z.object({});

const WorkspaceSetWhitelabelDomainInput = z.object({
	domain: z.string().describe('The agency domain to set for the workspace'),
});

const WorkspaceGetWhitelabelDomainInput = z.object({});

const WorkspaceDeleteWhitelabelDomainInput = z.object({});

const WorkspaceChangeOwnerInput = z.object({
	email: z.string(),
	sec: z.string(),
});

const WorkspaceMembersCreateInput = z.object({
	email: z.string().describe('Email address of the workspace member'),
	user_email: z
		.string()
		.nullable()
		.optional()
		.describe('Email address of the user'),
	nickname: z
		.string()
		.max(80)
		.nullable()
		.optional()
		.describe(
			'Private workspace member nickname visible only to the workspace owner',
		),
	role: z
		.enum(['owner', 'admin', 'editor', 'view', 'client'])
		.describe(
			'THe role of the workspace member defining their access level. While the "owner" role is listed in the enum, it cannot be created via the API, and is only assigned to the user who creates the workspace.; owner Owner - Full access and workspace management, admin Admin - Full access except workspace deletion, editor Editor - Can edit but not manage workspace settings, view View - Read-only access, clien',
		),
	permissions: z
		.array(
			z.enum([
				'dashboard.view',
				'campaigns.view',
				'campaigns.create',
				'campaigns.edit',
				'campaigns.delete',
				'organization.manage',
				'organization.integrations',
				'organization.billing',
				'organization.users.manage',
				'leadFinder.view',
				'customLeadLabels.create',
				'customLeadLabels.edit',
				'customLeadLabels.delete',
				'unibox.all',
				'analytics.view',
				'websiteChat.view',
				'websiteChat.manage',
				'agency.manage',
				'accounts.view',
				'accounts.manage',
				'leadManagement.view',
				'leads.move',
				'crm.view',
				'websiteVisitors.view',
				'blocklist.manage',
				'preferences.manage',
				'inboxPlacement.view',
				'aiAgents.manage',
				'workspaceGroupMembers.invite',
				'workspaceGroupMembers.remove',
				'workspaceGroupMembers.leave',
			]),
		)
		.nullable()
		.optional()
		.describe(
			'The permissions for this workspace member. Used in the app to restrict access to certain sections',
		),
});

const WorkspaceMembersListInput = z.object({
	limit: z
		.number()
		.int()
		.min(1)
		.max(100)
		.optional()
		.describe('The number of items to return'),
	starting_after: z
		.string()
		.optional()
		.describe(
			'The ID of the last item in the previous page - used for pagination. You can use the value of the `next_starting_after` field from the previous response.',
		),
	accepted: z
		.boolean()
		.optional()
		.describe('Filter workspace members by invitation acceptance status'),
	search: z.string().optional().describe('Search by name or email'),
});

const WorkspaceMembersGetInput = z.object({
	id: z.string().min(1).describe('The ID of the requested item'),
});

const WorkspaceMembersUpdateInput = z.object({
	id: z.string().min(1).describe('The ID of the item to update'),
	nickname: z
		.string()
		.max(80)
		.nullable()
		.optional()
		.describe(
			'Private workspace member nickname visible only to the workspace owner',
		),
	role: z
		.enum(['owner', 'admin', 'editor', 'view', 'client'])
		.optional()
		.describe(
			'THe role of the workspace member defining their access level. While the "owner" role is listed in the enum, it cannot be created via the API, and is only assigned to the user who creates the workspace.; owner Owner - Full access and workspace management, admin Admin - Full access except workspace deletion, editor Editor - Can edit but not manage workspace settings, view View - Read-only access, clien',
		),
});

const WorkspaceMembersDeleteInput = z.object({
	id: z.string().min(1).describe('The ID of the item to delete'),
});

const WorkspaceGroupMembersCreateInput = z.object({
	sub_workspace_id: z.string().describe('The id of the sub workspace'),
});

const WorkspaceGroupMembersListInput = z.object({
	limit: z
		.number()
		.int()
		.min(1)
		.max(100)
		.optional()
		.describe('The number of items to return'),
	starting_after: z
		.string()
		.optional()
		.describe(
			'The ID of the last item in the previous page - used for pagination. You can use the value of the `next_starting_after` field from the previous response.',
		),
});

const WorkspaceGroupMembersGetInput = z.object({
	id: z.string().min(1).describe('The ID of the requested item'),
});

const WorkspaceGroupMembersDeleteInput = z.object({
	id: z.string().min(1).describe('The ID of the item to delete'),
});

const WorkspaceGroupMembersGetAdminInput = z.object({});

const BillingGetPlanDetailsInput = z.object({});

const BillingGetSubscriptionDetailsInput = z.object({});

const AuditLogsListInput = z.object({
	limit: z
		.number()
		.int()
		.min(1)
		.max(1000)
		.optional()
		.describe('The number of items to return'),
	starting_after: z
		.string()
		.optional()
		.describe(
			'The ID of the last item in the previous page - used for pagination. You can use the value of the `next_starting_after` field from the previous response.',
		),
	activity_type: z.number().optional().describe('Filter by activity type'),
	search: z.string().optional().describe('Search term to filter logs'),
	start_date: z.string().optional().describe('Start date to filter logs'),
	end_date: z.string().optional().describe('End date to filter logs'),
});

const BackgroundJobsListInput = z.object({
	limit: z
		.number()
		.int()
		.min(1)
		.max(100)
		.optional()
		.describe('The number of items to return'),
	starting_after: z.string().optional(),
	ids: z
		.string()
		.optional()
		.describe(
			'The ID of the job. Multiple IDs can be provided as a comma-separated list',
		),
	included_ids: z
		.string()
		.optional()
		.describe(
			'The ID of the job to be included in the response. Multiple IDs can be provided as a comma-separated list',
		),
	excluded_ids: z
		.string()
		.optional()
		.describe(
			'The ID of the job to be excluded from the response. Multiple IDs can be provided as a comma-separated list',
		),
	type: z
		.enum([
			'move-leads',
			'import-leads',
			'export-leads',
			'update-warmup-accounts',
			'rename-variable',
			'broadcast-ai-generate',
			'broadcast-website-scrape',
			'import-subscribers-from-crm',
			'resync-subscriber-crm-tags',
			'journey-ai-build',
			'delete-leads',
		])
		.optional()
		.describe('The type of the job'),
	entity_type: z
		.enum([
			'list',
			'campaign',
			'workspace',
			'broadcast',
			'subscriber-group-sync',
			'subscriber-group',
			'journey',
		])
		.optional()
		.describe('The type of the entity'),
	entity_id: z
		.string()
		.optional()
		.describe(
			'The ID of the entity. Multiple IDs can be provided as a comma-separated list',
		),
	status: z
		.string()
		.optional()
		.describe(
			'The status of the job. Multiple statuses can be provided as a comma-separated list. Valid statuses are: pending, in-progress, success, failed, draining, paused, cancelled',
		),
	sort_column: z
		.enum(['created_at', 'updated_at'])
		.optional()
		.describe(
			'The column to sort the results by; created_at Created at, updated_at Updated at',
		),
	sort_order: z
		.enum(['asc', 'desc'])
		.optional()
		.describe(
			'The order to sort the results by; asc Ascending, desc Descending',
		),
});

const BackgroundJobsGetInput = z.object({
	id: z.string().min(1).describe('The ID of the requested item'),
	data_fields: z
		.string()
		.optional()
		.describe(
			'Comma-separated list of fields to include from the `data` object (e.g., "success_count,failed_count" or "moved_lead_emails,moved_leads"). For `move-leads` jobs, `moved_lead_emails` is capped at 10,000 entries.',
		),
});

const ApiKeysCreateInput = z.object({
	name: z.string(),
	scopes: z.array(
		z.enum([
			'all:all',
			'all:create',
			'all:read',
			'all:update',
			'all:delete',
			'ai_agents:all',
			'ai_agents:create',
			'ai_agents:read',
			'ai_agents:update',
			'ai_agents:delete',
			'api_keys:all',
			'api_keys:create',
			'api_keys:read',
			'api_keys:update',
			'api_keys:delete',
			'audit_logs:all',
			'audit_logs:create',
			'audit_logs:read',
			'audit_logs:update',
			'audit_logs:delete',
			'custom_prompt_templates:all',
			'custom_prompt_templates:create',
			'custom_prompt_templates:read',
			'custom_prompt_templates:update',
			'custom_prompt_templates:delete',
			'account_campaign_mappings:all',
			'account_campaign_mappings:create',
			'account_campaign_mappings:read',
			'account_campaign_mappings:update',
			'account_campaign_mappings:delete',
			'campaigns:all',
			'campaigns:create',
			'campaigns:read',
			'campaigns:update',
			'campaigns:delete',
			'inbox_placement_tests:all',
			'inbox_placement_tests:create',
			'inbox_placement_tests:read',
			'inbox_placement_tests:update',
			'inbox_placement_tests:delete',
			'inbox_placement_analytics:all',
			'inbox_placement_analytics:create',
			'inbox_placement_analytics:read',
			'inbox_placement_analytics:update',
			'inbox_placement_analytics:delete',
			'inbox_placement_reports:all',
			'inbox_placement_reports:create',
			'inbox_placement_reports:read',
			'inbox_placement_reports:update',
			'inbox_placement_reports:delete',
			'lead_lists:all',
			'lead_lists:create',
			'lead_lists:read',
			'lead_lists:update',
			'lead_lists:delete',
			'leads:all',
			'leads:create',
			'leads:read',
			'leads:update',
			'leads:delete',
			'background-jobs:all',
			'background-jobs:create',
			'background-jobs:read',
			'background-jobs:update',
			'background-jobs:delete',
			'custom_tags:all',
			'custom_tags:create',
			'custom_tags:read',
			'custom_tags:update',
			'custom_tags:delete',
			'custom_tag_mappings:all',
			'custom_tag_mappings:create',
			'custom_tag_mappings:read',
			'custom_tag_mappings:update',
			'custom_tag_mappings:delete',
			'crm_actions:all',
			'crm_actions:create',
			'crm_actions:read',
			'crm_actions:update',
			'crm_actions:delete',
			'accounts:all',
			'accounts:create',
			'accounts:read',
			'accounts:update',
			'accounts:delete',
			'block_list_entries:all',
			'block_list_entries:create',
			'block_list_entries:read',
			'block_list_entries:update',
			'block_list_entries:delete',
			'lead-labels:all',
			'lead-labels:create',
			'lead-labels:read',
			'lead-labels:update',
			'lead-labels:delete',
			'email_verifications:all',
			'email_verifications:create',
			'email_verifications:read',
			'emails:all',
			'emails:create',
			'emails:read',
			'emails:update',
			'emails:delete',
			'email_templates:all',
			'email_templates:create',
			'email_templates:read',
			'email_templates:update',
			'email_templates:delete',
			'workspaces:all',
			'workspaces:create',
			'workspaces:read',
			'workspaces:update',
			'workspaces:delete',
			'workspace_billing:all',
			'workspace_billing:create',
			'workspace_billing:read',
			'workspace_billing:update',
			'workspace_billing:delete',
			'workspace_group_members:all',
			'workspace_group_members:create',
			'workspace_group_members:read',
			'workspace_group_members:update',
			'workspace_group_members:delete',
			'workspace_members:all',
			'workspace_members:create',
			'workspace_members:read',
			'workspace_members:update',
			'workspace_members:delete',
			'subsequences:all',
			'subsequences:create',
			'subsequences:read',
			'subsequences:update',
			'subsequences:delete',
			'supersearch_enrichments:all',
			'supersearch_enrichments:create',
			'supersearch_enrichments:read',
			'supersearch_enrichments:update',
			'supersearch_enrichments:delete',
			'ai_sdr:all',
			'ai_sdr:create',
			'ai_sdr:read',
			'ai_sdr:update',
			'ai_sdr:delete',
			'ai_sdr_replies:all',
			'ai_sdr_replies:create',
			'ai_sdr_replies:read',
			'ai_sdr_replies:update',
			'ai_sdr_replies:delete',
			'ai_inbox_manager_analytics:all',
			'ai_inbox_manager_analytics:create',
			'ai_inbox_manager_analytics:read',
			'ai_inbox_manager_analytics:update',
			'ai_inbox_manager_analytics:delete',
			'sales_flows:all',
			'sales_flows:create',
			'sales_flows:read',
			'sales_flows:update',
			'sales_flows:delete',
			'webhooks:all',
			'webhooks:create',
			'webhooks:read',
			'webhooks:update',
			'webhooks:delete',
			'webhook_events:all',
			'webhook_events:create',
			'webhook_events:read',
			'webhook_events:update',
			'webhook_events:delete',
			'email_marketing_events:all',
			'email_marketing_events:create',
			'email_marketing_events:read',
			'security_tokens:all',
			'security_tokens:create',
			'security_tokens:read',
			'security_tokens:update',
			'security_tokens:delete',
			'dfy_email_account_orders:all',
			'dfy_email_account_orders:create',
			'dfy_email_account_orders:read',
			'dfy_email_account_orders:update',
			'dfy_email_account_orders:delete',
			'auth:all',
			'auth:create',
			'auth:read',
			'auth:update',
			'auth:delete',
		]),
	),
});

const ApiKeysListInput = z.object({
	limit: z
		.number()
		.int()
		.min(1)
		.max(100)
		.optional()
		.describe('The number of items to return'),
	starting_after: z
		.string()
		.optional()
		.describe(
			'The ID of the last item in the previous page - used for pagination. You can use the value of the `next_starting_after` field from the previous response.',
		),
});

const ApiKeysDeleteInput = z.object({
	id: z.string().min(1).describe('The ID of the item to delete'),
});

const EmailTemplatesListInput = z.object({
	limit: z
		.number()
		.int()
		.min(1)
		.max(100)
		.optional()
		.describe('Items per page, 1 to 100'),
	starting_after: z
		.string()
		.optional()
		.describe('Cursor: next_starting_after from the previous page'),
	search: z.string().optional().describe('Search by template name'),
});

const EmailTemplatesCreateInput = z.object({
	name: z.string().describe('Template name'),
	body: z.string().describe('Email body, HTML or text'),
});

const EmailTemplatesDeleteInput = z.object({
	id: z.string().min(1).describe('Template ID'),
});

const CustomPromptTemplatesListInput = z.object({
	limit: z
		.number()
		.int()
		.min(1)
		.max(100)
		.optional()
		.describe('Items per page, 1 to 100'),
	starting_after: z
		.string()
		.optional()
		.describe('Cursor: next_starting_after from the previous page'),
	search: z.string().optional().describe('Search by template name'),
});

const CustomPromptTemplatesGetInput = z.object({
	id: z.string().min(1).describe('Template ID'),
});

const CustomPromptTemplatesCreateInput = z.object({
	name: z.string().describe('Template name'),
	prompt: z
		.string()
		.describe('Prompt text; `{{property}}` placeholders take lead fields'),
	category: z
		.union([
			z.literal(1),
			z.literal(2),
			z.literal(3),
			z.literal(4),
			z.literal(5),
			z.literal(6),
		])
		.describe(
			'1 Copywriting, 2 Cleaning, 3 Sales, 4 Marketing, 5 Other, 6 Personalization',
		),
	is_public: z.boolean().describe('Whether other workspaces can see it'),
	description: z.string().optional(),
	model_version: z.string().optional().describe('Model, e.g. gpt-4o'),
	template_type: z.enum(['custom', 'public']).optional(),
});

const CustomPromptTemplatesUpdateInput = z.object({
	id: z.string().min(1).describe('Template ID'),
	name: z.string().optional().describe('Template name'),
	prompt: z
		.string()
		.optional()
		.describe('Prompt text; `{{property}}` placeholders take lead fields'),
	category: z
		.union([
			z.literal(1),
			z.literal(2),
			z.literal(3),
			z.literal(4),
			z.literal(5),
			z.literal(6),
		])
		.optional()
		.describe(
			'1 Copywriting, 2 Cleaning, 3 Sales, 4 Marketing, 5 Other, 6 Personalization',
		),
	is_public: z
		.boolean()
		.optional()
		.describe('Whether other workspaces can see it'),
	description: z.string().optional(),
	model_version: z.string().optional().describe('Model, e.g. gpt-4o'),
	template_type: z.enum(['custom', 'public']).optional(),
});

const CustomPromptTemplatesDeleteInput = z.object({
	id: z.string().min(1).describe('Template ID'),
});

const CrmActionsListPhoneNumbersInput = z.object({});

const CrmActionsDeletePhoneNumberInput = z.object({
	id: z.string().min(1).describe('The phone number record id to delete'),
});

const EngageItemsListInput = z.object({
	limit: z
		.number()
		.int()
		.min(1)
		.max(100)
		.optional()
		.describe('The number of items to return'),
	starting_after: z
		.string()
		.optional()
		.describe(
			'The ID of the last item in the previous page - used for pagination. You can use the value of the `next_starting_after` field from the previous response.',
		),
	type: z
		.string()
		.optional()
		.describe('Comma-separated item types: ai_agent, automation'),
	status: z
		.string()
		.optional()
		.describe('Comma-separated status values: Active, Paused, Draft, Error'),
	ai_agent_type: z
		.union([
			z.literal(1),
			z.literal(2),
			z.literal(3),
			z.literal(4),
			z.literal(7),
			z.literal(8),
			z.literal(9),
			z.literal(10),
			z.literal(6),
			z.literal(11),
		])
		.optional()
		.describe(
			'Filter by agent sub-type. Implies type=ai_agent — automations have no sub-type.; 1 AI Inbox Manager, 2 AI Sales Agent, 3 AI Deliverability Agent, 4 AI Affiliate Agent, 6 AI Lead Finder Agent, 7 AI Recruiting Agent, 8 AI Investment Agent, 9 AI User Research Agent, 10 AI Partnership',
		),
	search: z.string().optional().describe('Text search on agent name'),
});

const EngageItemsDeleteManyInput = z.object({
	items: z
		.array(
			z.object({
				id: z.string(),
				type: z.enum(['ai_agent', 'automation']).optional(),
			}),
		)
		.min(1)
		.max(100),
});

const DomainForwardingGetInput = z.object({
	domain: z.string().min(1).describe('The domain to manage forwarding for'),
});

const DomainForwardingSetInput = z.object({
	domain: z.string().min(1).describe('The domain to manage forwarding for'),
	forwarding_domain: z
		.string()
		.min(1)
		.describe('Destination domain visitors are forwarded to'),
	forwarding_mode: z
		.enum(['redirect', 'stealth'])
		.optional()
		.describe('How the forwarding domain is applied. Defaults to `redirect`.'),
});

const DomainForwardingRemoveInput = z.object({
	domain: z.string().min(1).describe('The domain to manage forwarding for'),
});

const AccountsCreateOutput = z
	.object({
		email: str.describe('Email address of the account'),
		timestamp_created: str.describe('Timestamp when the account was created'),
		timestamp_updated: str.describe(
			'Timestamp when the account was last updated',
		),
		first_name: str.describe('First name associated with the account'),
		last_name: str.describe('Last name associated with the account'),
		warmup: obj.describe('Warmup configuration for the account'),
		added_by: str.describe('User ID who added the account'),
		daily_limit: num.describe('Daily email sending limit'),
		daily_limit_max: num.describe(
			'Maximum daily email sending limit for AirMail accounts',
		),
		warmup_limit_max: num.describe(
			'Maximum daily warmup sending limit for AirMail accounts',
		),
		modified_by: str.describe('User ID who last modified the account'),
		tracking_domain_name: str.describe('Tracking domain'),
		tracking_domain_status: str.describe('Tracking domain status'),
		status: num.describe(
			'Current status of the account; 1 Active, 2 Paused, 3 Temporarily paused for maintenance; will be automatically resumed shortly, -1 Connection Error, -2 Soft Bounce Error, -3 Sending Error',
		),
		enable_slow_ramp: bool.describe(
			'Whether to enable slow ramp up for sending limits',
		),
		inbox_placement_test_limit: num.describe(
			'The limit for inbox placement tests',
		),
		organization: str.describe('Organization ID that owns this account'),
		warmup_status: num.describe(
			'Current warmup status of the account; 0 Paused, 1 Active, -1 Banned, -2 Spam Folder Unknown, -3 Permanent Suspension',
		),
		status_message: obj.describe('Status message for the account'),
		timestamp_warmup_start: str.describe('Timestamp when warmup was started'),
		provider_code: num.describe(
			'Provider code for the account. Please make sure to specify the right provider code, otherwise your account will not work.; 1 Custom IMAP/SMTP, 2 Google, 3 Microsoft, 4 AWS, 8 AirMail, 11 Airmail Instant',
		),
		setup_pending: bool.describe('Whether account setup is pending'),
		is_managed_account: bool.describe('Whether this is a managed account'),
		stat_warmup_score: num.describe('Warmup score for the account'),
		sending_gap: num.describe(
			'The gap between emails sent from this account in minutes (minimum wait time when used with multiple campaigns)',
		),
		signature: str.describe('Email signature for the account'),
		reply_to: str.describe('Custom reply-to email address for the account'),
		autofix_failed: bool.describe(
			'Whether automatic reconnection attempts have failed. null = in progress, true = failed, false = succeeded.',
		),
	})
	.loose();

const AccountsUpdateOutput = z
	.object({
		email: str.describe('Email address of the account'),
		timestamp_created: str.describe('Timestamp when the account was created'),
		timestamp_updated: str.describe(
			'Timestamp when the account was last updated',
		),
		first_name: str.describe('First name associated with the account'),
		last_name: str.describe('Last name associated with the account'),
		warmup: obj.describe('Warmup configuration for the account'),
		added_by: str.describe('User ID who added the account'),
		daily_limit: num.describe('Daily email sending limit'),
		daily_limit_max: num.describe(
			'Maximum daily email sending limit for AirMail accounts',
		),
		warmup_limit_max: num.describe(
			'Maximum daily warmup sending limit for AirMail accounts',
		),
		modified_by: str.describe('User ID who last modified the account'),
		tracking_domain_name: str.describe('Tracking domain'),
		tracking_domain_status: str.describe('Tracking domain status'),
		status: num.describe(
			'Current status of the account; 1 Active, 2 Paused, 3 Temporarily paused for maintenance; will be automatically resumed shortly, -1 Connection Error, -2 Soft Bounce Error, -3 Sending Error',
		),
		enable_slow_ramp: bool.describe(
			'Whether to enable slow ramp up for sending limits',
		),
		inbox_placement_test_limit: num.describe(
			'The limit for inbox placement tests',
		),
		organization: str.describe('Organization ID that owns this account'),
		warmup_status: num.describe(
			'Current warmup status of the account; 0 Paused, 1 Active, -1 Banned, -2 Spam Folder Unknown, -3 Permanent Suspension',
		),
		status_message: obj.describe('Status message for the account'),
		timestamp_warmup_start: str.describe('Timestamp when warmup was started'),
		provider_code: num.describe(
			'Provider code for the account. Please make sure to specify the right provider code, otherwise your account will not work.; 1 Custom IMAP/SMTP, 2 Google, 3 Microsoft, 4 AWS, 8 AirMail, 11 Airmail Instant',
		),
		setup_pending: bool.describe('Whether account setup is pending'),
		is_managed_account: bool.describe('Whether this is a managed account'),
		stat_warmup_score: num.describe('Warmup score for the account'),
		sending_gap: num.describe(
			'The gap between emails sent from this account in minutes (minimum wait time when used with multiple campaigns)',
		),
		signature: str.describe('Email signature for the account'),
		reply_to: str.describe('Custom reply-to email address for the account'),
		autofix_failed: bool.describe(
			'Whether automatic reconnection attempts have failed. null = in progress, true = failed, false = succeeded.',
		),
	})
	.loose();

const AccountsDeleteOutput = z
	.object({
		email: str.describe('Email address of the account'),
		timestamp_created: str.describe('Timestamp when the account was created'),
		timestamp_updated: str.describe(
			'Timestamp when the account was last updated',
		),
		first_name: str.describe('First name associated with the account'),
		last_name: str.describe('Last name associated with the account'),
		warmup: obj.describe('Warmup configuration for the account'),
		added_by: str.describe('User ID who added the account'),
		daily_limit: num.describe('Daily email sending limit'),
		daily_limit_max: num.describe(
			'Maximum daily email sending limit for AirMail accounts',
		),
		warmup_limit_max: num.describe(
			'Maximum daily warmup sending limit for AirMail accounts',
		),
		modified_by: str.describe('User ID who last modified the account'),
		tracking_domain_name: str.describe('Tracking domain'),
		tracking_domain_status: str.describe('Tracking domain status'),
		status: num.describe(
			'Current status of the account; 1 Active, 2 Paused, 3 Temporarily paused for maintenance; will be automatically resumed shortly, -1 Connection Error, -2 Soft Bounce Error, -3 Sending Error',
		),
		enable_slow_ramp: bool.describe(
			'Whether to enable slow ramp up for sending limits',
		),
		inbox_placement_test_limit: num.describe(
			'The limit for inbox placement tests',
		),
		organization: str.describe('Organization ID that owns this account'),
		warmup_status: num.describe(
			'Current warmup status of the account; 0 Paused, 1 Active, -1 Banned, -2 Spam Folder Unknown, -3 Permanent Suspension',
		),
		status_message: obj.describe('Status message for the account'),
		timestamp_warmup_start: str.describe('Timestamp when warmup was started'),
		provider_code: num.describe(
			'Provider code for the account. Please make sure to specify the right provider code, otherwise your account will not work.; 1 Custom IMAP/SMTP, 2 Google, 3 Microsoft, 4 AWS, 8 AirMail, 11 Airmail Instant',
		),
		setup_pending: bool.describe('Whether account setup is pending'),
		is_managed_account: bool.describe('Whether this is a managed account'),
		stat_warmup_score: num.describe('Warmup score for the account'),
		sending_gap: num.describe(
			'The gap between emails sent from this account in minutes (minimum wait time when used with multiple campaigns)',
		),
		signature: str.describe('Email signature for the account'),
		reply_to: str.describe('Custom reply-to email address for the account'),
		autofix_failed: bool.describe(
			'Whether automatic reconnection attempts have failed. null = in progress, true = failed, false = succeeded.',
		),
	})
	.loose();

const AccountsGetDailyAnalyticsOutput = z.array(
	z
		.object({
			date: str.describe(
				'The date of the analytics entry, in YYYY-MM-DD format',
			),
			email_account: str.describe('The email account that sent the emails'),
			sent: num.describe(
				'The total number of campaign emails sent on this date by this account, including emails for subsequences',
			),
			bounced: num.describe(
				'The number of emails that bounced on this date for this account for campaigns - including subsequences',
			),
			contacted: num.describe(
				'The total number of unique contacts who received an email on this date from this account',
			),
			new_leads_contacted: num.describe(
				'The total number of new leads contacted on this date from this account',
			),
			opened: num.describe(
				'The total number of opened emails on this date for this account',
			),
			unique_opened: num.describe(
				'The total number of unique opened emails on this date for this account',
			),
			replies: num.describe(
				'The total number of replies received on this date for this account',
			),
			unique_replies: num.describe(
				'The total number of unique replies received on this date for this account',
			),
			replies_automatic: num.describe(
				'The total number of automatic replies detected on this date for this account',
			),
			unique_replies_automatic: num.describe(
				'The total number of unique automatic replies detected on this date for this account',
			),
			clicks: num.describe(
				'The total number of links clicked on this date for this account',
			),
			unique_clicks: num.describe(
				'The total number of unique links clicked on this date for this account. Unique meaning from unique leads, not unique links',
			),
		})
		.loose(),
);

const AccountsPauseManyOutput = z
	.object({
		paused_emails: z.array(z.string()).nullish(),
		failed_emails: z.array(z.string()).nullish(),
	})
	.loose();

const AccountsMarkFixedOutput = z
	.object({
		email: str.describe('Email address of the account'),
		timestamp_created: str.describe('Timestamp when the account was created'),
		timestamp_updated: str.describe(
			'Timestamp when the account was last updated',
		),
		first_name: str.describe('First name associated with the account'),
		last_name: str.describe('Last name associated with the account'),
		warmup: obj.describe('Warmup configuration for the account'),
		added_by: str.describe('User ID who added the account'),
		daily_limit: num.describe('Daily email sending limit'),
		daily_limit_max: num.describe(
			'Maximum daily email sending limit for AirMail accounts',
		),
		warmup_limit_max: num.describe(
			'Maximum daily warmup sending limit for AirMail accounts',
		),
		modified_by: str.describe('User ID who last modified the account'),
		tracking_domain_name: str.describe('Tracking domain'),
		tracking_domain_status: str.describe('Tracking domain status'),
		status: num.describe(
			'Current status of the account; 1 Active, 2 Paused, 3 Temporarily paused for maintenance; will be automatically resumed shortly, -1 Connection Error, -2 Soft Bounce Error, -3 Sending Error',
		),
		enable_slow_ramp: bool.describe(
			'Whether to enable slow ramp up for sending limits',
		),
		inbox_placement_test_limit: num.describe(
			'The limit for inbox placement tests',
		),
		organization: str.describe('Organization ID that owns this account'),
		warmup_status: num.describe(
			'Current warmup status of the account; 0 Paused, 1 Active, -1 Banned, -2 Spam Folder Unknown, -3 Permanent Suspension',
		),
		status_message: obj.describe('Status message for the account'),
		timestamp_warmup_start: str.describe('Timestamp when warmup was started'),
		provider_code: num.describe(
			'Provider code for the account. Please make sure to specify the right provider code, otherwise your account will not work.; 1 Custom IMAP/SMTP, 2 Google, 3 Microsoft, 4 AWS, 8 AirMail, 11 Airmail Instant',
		),
		setup_pending: bool.describe('Whether account setup is pending'),
		is_managed_account: bool.describe('Whether this is a managed account'),
		stat_warmup_score: num.describe('Warmup score for the account'),
		sending_gap: num.describe(
			'The gap between emails sent from this account in minutes (minimum wait time when used with multiple campaigns)',
		),
		signature: str.describe('Email signature for the account'),
		reply_to: str.describe('Custom reply-to email address for the account'),
		autofix_failed: bool.describe(
			'Whether automatic reconnection attempts have failed. null = in progress, true = failed, false = succeeded.',
		),
	})
	.loose();

const AccountsGetTrackingDomainStatusOutput = z
	.object({ success: bool, ssl: bool, cname: bool, host: str })
	.loose();

const AccountsTestVitalsOutput = z
	.object({
		status: str,
		success_list: list,
		failure_list: list,
	})
	.loose();

const AccountsMoveToWorkspaceOutput = z
	.object({
		status: str.describe('success The accounts were moved successfully '),
	})
	.loose();

const AccountsListCampaignsOutput = page(
	z
		.object({
			campaign_id: str,
			campaign_name: str,
			timestamp_created: str.describe(
				'Timestamp when the campaign was created',
			),
			status: num.describe(
				'Campaign Status; 0 Draft, 1 Active, 2 Paused, 3 Completed, 4 Running Subsequences, -99 Account Suspended, -1 Accounts Unhealthy, -2 Bounce Protect',
			),
		})
		.loose(),
);

const CampaignsDeleteOutput = z.object({}).loose();

const CampaignsSearchByLeadOutput = page(
	z
		.object({
			id: str.describe('Unique identifier for the campaign'),
			name: str.describe('Name of the campaign'),
			pl_value: num.describe('Value of every positive lead'),
			status: num.describe(
				'Campaign Status; 0 Draft, 1 Active, 2 Paused, 3 Completed, 4 Running Subsequences, -99 Account Suspended, -1 Accounts Unhealthy, -2 Bounce Protect',
			),
			is_evergreen: bool.describe('Whether the campaign is evergreen'),
			campaign_schedule: obj.describe('Campaign schedule'),
			sequences: list,
			timestamp_created: str.describe(
				'Timestamp when the campaign was created',
			),
			timestamp_updated: str.describe(
				'Timestamp when the campaign was last updated',
			),
			email_gap: num.describe('The gap between emails in minutes'),
			random_wait_max: num.describe('The maximum random wait time in minutes'),
			text_only: bool.describe('Whether the campaign is text only'),
			first_email_text_only: bool.describe(
				'Whether the campaign is send the first email as a text only',
			),
			email_list: z.array(z.string()).nullish(),
			daily_limit: num.describe('The daily limit for sending emails'),
			stop_on_reply: bool.describe('Whether to stop the campaign on reply'),
			email_tag_list: z.array(z.string()).nullish(),
			link_tracking: bool.describe('Whether to track links in emails'),
			open_tracking: bool.describe('Whether to track opens in emails'),
			stop_on_auto_reply: bool.describe(
				'Whether to stop the campaign on auto reply',
			),
			daily_max_leads: num.describe('The daily maximum new leads to contact'),
			prioritize_new_leads: bool.describe('Whether to prioritize new leads'),
			auto_variant_select: obj.describe('Auto variant select settings'),
			match_lead_esp: bool.describe('Whether to match leads by ESP'),
			not_sending_status: num.describe(
				'Campaign not sending status; 1 Campaign is currently not within its sending schedule., 2 Campaign is currently waiting for a lead to process., 3 Campaign has reached its daily sending limit., 4 All sending accounts for this campa',
			),
			stop_for_company: bool.describe(
				'Whether to stop the campaign for the entire company(domain) when a lead replies',
			),
			core_variables: obj.describe('Campaign core variables'),
			custom_variables: obj.describe('Campaign custom variables'),
			insert_unsubscribe_header: bool.describe(
				'Whether to insert an unsubscribe header in emails',
			),
			allow_risky_contacts: bool.describe('Whether to allow risky contacts'),
			disable_bounce_protect: bool.describe(
				'Whether to disable bounce protection',
			),
			limit_emails_per_company_override: obj.describe(
				'Overrides the workspace-wide limit emails per company setting for this campaign.',
			),
			cc_list: z.array(z.string()).nullish(),
			bcc_list: z.array(z.string()).nullish(),
			organization: str.describe('Organization ID'),
			owned_by: str.describe('Owner ID'),
			created_by: str.describe('ID of the user who created the campaign'),
			ai_sdr_id: str.describe('AI Sales Agent ID that created this campaign'),
			provider_routing_rules: list,
		})
		.loose(),
);

const CampaignsGetDailyAnalyticsOutput = z.array(
	z
		.object({
			date: str.describe(
				'The date of the analytics entry, in YYYY-MM-DD format',
			),
			sent: num.describe('The total number of sent emails'),
			contacted: num.describe(
				'The total number of unique contacts who received an email that day',
			),
			new_leads_contacted: num.describe(
				'The total number of new leads contacted that day',
			),
			opened: num.describe('The total number of opened emails'),
			unique_opened: num.describe('The total number of unique opened emails'),
			replies: num.describe('The total number of replies'),
			unique_replies: num.describe('The total number of unique replies'),
			replies_automatic: num.describe(
				'The total number of automatic replies detected',
			),
			unique_replies_automatic: num.describe(
				'The total number of unique automatic replies detected',
			),
			clicks: num.describe('The total number of links clicked'),
			unique_clicks: num.describe(
				'The total number of unique links clicked. Unique meaning from unique leads, not unique links. For instance, if a lead clicked a link 3...',
			),
			opportunities: num.describe(
				'The total number of unique opportunities created from the campaign on that day',
			),
			unique_opportunities: num.describe(
				'The total number of unique opportunities created from unique leads from the campaign on that day',
			),
		})
		.loose(),
);

const CampaignsShareOutput = z.object({}).loose();

const CampaignsCreateFromSharedOutput = z
	.object({
		id: str.describe('Unique identifier for the campaign'),
		name: str.describe('Name of the campaign'),
		pl_value: num.describe('Value of every positive lead'),
		status: num.describe(
			'Campaign Status; 0 Draft, 1 Active, 2 Paused, 3 Completed, 4 Running Subsequences, -99 Account Suspended, -1 Accounts Unhealthy, -2 Bounce Protect',
		),
		is_evergreen: bool.describe('Whether the campaign is evergreen'),
		campaign_schedule: obj.describe('Campaign schedule'),
		sequences: list,
		timestamp_created: str.describe('Timestamp when the campaign was created'),
		timestamp_updated: str.describe(
			'Timestamp when the campaign was last updated',
		),
		email_gap: num.describe('The gap between emails in minutes'),
		random_wait_max: num.describe('The maximum random wait time in minutes'),
		text_only: bool.describe('Whether the campaign is text only'),
		first_email_text_only: bool.describe(
			'Whether the campaign is send the first email as a text only',
		),
		email_list: z.array(z.string()).nullish(),
		daily_limit: num.describe('The daily limit for sending emails'),
		stop_on_reply: bool.describe('Whether to stop the campaign on reply'),
		email_tag_list: z.array(z.string()).nullish(),
		link_tracking: bool.describe('Whether to track links in emails'),
		open_tracking: bool.describe('Whether to track opens in emails'),
		stop_on_auto_reply: bool.describe(
			'Whether to stop the campaign on auto reply',
		),
		daily_max_leads: num.describe('The daily maximum new leads to contact'),
		prioritize_new_leads: bool.describe('Whether to prioritize new leads'),
		auto_variant_select: obj.describe('Auto variant select settings'),
		match_lead_esp: bool.describe('Whether to match leads by ESP'),
		not_sending_status: num.describe(
			'Campaign not sending status; 1 Campaign is currently not within its sending schedule., 2 Campaign is currently waiting for a lead to process., 3 Campaign has reached its daily sending limit., 4 All sending accounts for this campa',
		),
		stop_for_company: bool.describe(
			'Whether to stop the campaign for the entire company(domain) when a lead replies',
		),
		core_variables: obj.describe('Campaign core variables'),
		custom_variables: obj.describe('Campaign custom variables'),
		insert_unsubscribe_header: bool.describe(
			'Whether to insert an unsubscribe header in emails',
		),
		allow_risky_contacts: bool.describe('Whether to allow risky contacts'),
		disable_bounce_protect: bool.describe(
			'Whether to disable bounce protection',
		),
		limit_emails_per_company_override: obj.describe(
			'Overrides the workspace-wide limit emails per company setting for this campaign.',
		),
		cc_list: z.array(z.string()).nullish(),
		bcc_list: z.array(z.string()).nullish(),
		organization: str.describe('Organization ID'),
		owned_by: str.describe('Owner ID'),
		created_by: str.describe('ID of the user who created the campaign'),
		ai_sdr_id: str.describe('AI Sales Agent ID that created this campaign'),
		provider_routing_rules: list,
	})
	.loose();

const CampaignsExportOutput = z
	.object({
		id: str.describe('Unique identifier for the campaign'),
		name: str.describe('Name of the campaign'),
		pl_value: num.describe('Value of every positive lead'),
		status: num.describe(
			'Campaign Status; 0 Draft, 1 Active, 2 Paused, 3 Completed, 4 Running Subsequences, -99 Account Suspended, -1 Accounts Unhealthy, -2 Bounce Protect',
		),
		is_evergreen: bool.describe('Whether the campaign is evergreen'),
		campaign_schedule: obj.describe('Campaign schedule'),
		sequences: list,
		timestamp_created: str.describe('Timestamp when the campaign was created'),
		timestamp_updated: str.describe(
			'Timestamp when the campaign was last updated',
		),
		email_gap: num.describe('The gap between emails in minutes'),
		random_wait_max: num.describe('The maximum random wait time in minutes'),
		text_only: bool.describe('Whether the campaign is text only'),
		first_email_text_only: bool.describe(
			'Whether the campaign is send the first email as a text only',
		),
		email_list: z.array(z.string()).nullish(),
		daily_limit: num.describe('The daily limit for sending emails'),
		stop_on_reply: bool.describe('Whether to stop the campaign on reply'),
		email_tag_list: z.array(z.string()).nullish(),
		link_tracking: bool.describe('Whether to track links in emails'),
		open_tracking: bool.describe('Whether to track opens in emails'),
		stop_on_auto_reply: bool.describe(
			'Whether to stop the campaign on auto reply',
		),
		daily_max_leads: num.describe('The daily maximum new leads to contact'),
		prioritize_new_leads: bool.describe('Whether to prioritize new leads'),
		auto_variant_select: obj.describe('Auto variant select settings'),
		match_lead_esp: bool.describe('Whether to match leads by ESP'),
		not_sending_status: num.describe(
			'Campaign not sending status; 1 Campaign is currently not within its sending schedule., 2 Campaign is currently waiting for a lead to process., 3 Campaign has reached its daily sending limit., 4 All sending accounts for this campa',
		),
		stop_for_company: bool.describe(
			'Whether to stop the campaign for the entire company(domain) when a lead replies',
		),
		core_variables: obj.describe('Campaign core variables'),
		custom_variables: obj.describe('Campaign custom variables'),
		insert_unsubscribe_header: bool.describe(
			'Whether to insert an unsubscribe header in emails',
		),
		allow_risky_contacts: bool.describe('Whether to allow risky contacts'),
		disable_bounce_protect: bool.describe(
			'Whether to disable bounce protection',
		),
		limit_emails_per_company_override: obj.describe(
			'Overrides the workspace-wide limit emails per company setting for this campaign.',
		),
		cc_list: z.array(z.string()).nullish(),
		bcc_list: z.array(z.string()).nullish(),
		organization: str.describe('Organization ID'),
		owned_by: str.describe('Owner ID'),
		created_by: str.describe('ID of the user who created the campaign'),
		ai_sdr_id: str.describe('AI Sales Agent ID that created this campaign'),
		provider_routing_rules: list,
	})
	.loose();

const CampaignsDuplicateOutput = z
	.object({
		id: str.describe('Unique identifier for the campaign'),
		name: str.describe('Name of the campaign'),
		pl_value: num.describe('Value of every positive lead'),
		status: num.describe(
			'Campaign Status; 0 Draft, 1 Active, 2 Paused, 3 Completed, 4 Running Subsequences, -99 Account Suspended, -1 Accounts Unhealthy, -2 Bounce Protect',
		),
		is_evergreen: bool.describe('Whether the campaign is evergreen'),
		campaign_schedule: obj.describe('Campaign schedule'),
		sequences: list,
		timestamp_created: str.describe('Timestamp when the campaign was created'),
		timestamp_updated: str.describe(
			'Timestamp when the campaign was last updated',
		),
		email_gap: num.describe('The gap between emails in minutes'),
		random_wait_max: num.describe('The maximum random wait time in minutes'),
		text_only: bool.describe('Whether the campaign is text only'),
		first_email_text_only: bool.describe(
			'Whether the campaign is send the first email as a text only',
		),
		email_list: z.array(z.string()).nullish(),
		daily_limit: num.describe('The daily limit for sending emails'),
		stop_on_reply: bool.describe('Whether to stop the campaign on reply'),
		email_tag_list: z.array(z.string()).nullish(),
		link_tracking: bool.describe('Whether to track links in emails'),
		open_tracking: bool.describe('Whether to track opens in emails'),
		stop_on_auto_reply: bool.describe(
			'Whether to stop the campaign on auto reply',
		),
		daily_max_leads: num.describe('The daily maximum new leads to contact'),
		prioritize_new_leads: bool.describe('Whether to prioritize new leads'),
		auto_variant_select: obj.describe('Auto variant select settings'),
		match_lead_esp: bool.describe('Whether to match leads by ESP'),
		not_sending_status: num.describe(
			'Campaign not sending status; 1 Campaign is currently not within its sending schedule., 2 Campaign is currently waiting for a lead to process., 3 Campaign has reached its daily sending limit., 4 All sending accounts for this campa',
		),
		stop_for_company: bool.describe(
			'Whether to stop the campaign for the entire company(domain) when a lead replies',
		),
		core_variables: obj.describe('Campaign core variables'),
		custom_variables: obj.describe('Campaign custom variables'),
		insert_unsubscribe_header: bool.describe(
			'Whether to insert an unsubscribe header in emails',
		),
		allow_risky_contacts: bool.describe('Whether to allow risky contacts'),
		disable_bounce_protect: bool.describe(
			'Whether to disable bounce protection',
		),
		limit_emails_per_company_override: obj.describe(
			'Overrides the workspace-wide limit emails per company setting for this campaign.',
		),
		cc_list: z.array(z.string()).nullish(),
		bcc_list: z.array(z.string()).nullish(),
		organization: str.describe('Organization ID'),
		owned_by: str.describe('Owner ID'),
		created_by: str.describe('ID of the user who created the campaign'),
		ai_sdr_id: str.describe('AI Sales Agent ID that created this campaign'),
		provider_routing_rules: list,
	})
	.loose();

const CampaignsCountLaunchedOutput = z.object({ count: num }).loose();

const CampaignsAddVariablesOutput = z
	.object({
		id: str.describe('Unique identifier for the campaign'),
		name: str.describe('Name of the campaign'),
		pl_value: num.describe('Value of every positive lead'),
		status: num.describe(
			'Campaign Status; 0 Draft, 1 Active, 2 Paused, 3 Completed, 4 Running Subsequences, -99 Account Suspended, -1 Accounts Unhealthy, -2 Bounce Protect',
		),
		is_evergreen: bool.describe('Whether the campaign is evergreen'),
		campaign_schedule: obj.describe('Campaign schedule'),
		sequences: list,
		timestamp_created: str.describe('Timestamp when the campaign was created'),
		timestamp_updated: str.describe(
			'Timestamp when the campaign was last updated',
		),
		email_gap: num.describe('The gap between emails in minutes'),
		random_wait_max: num.describe('The maximum random wait time in minutes'),
		text_only: bool.describe('Whether the campaign is text only'),
		first_email_text_only: bool.describe(
			'Whether the campaign is send the first email as a text only',
		),
		email_list: z.array(z.string()).nullish(),
		daily_limit: num.describe('The daily limit for sending emails'),
		stop_on_reply: bool.describe('Whether to stop the campaign on reply'),
		email_tag_list: z.array(z.string()).nullish(),
		link_tracking: bool.describe('Whether to track links in emails'),
		open_tracking: bool.describe('Whether to track opens in emails'),
		stop_on_auto_reply: bool.describe(
			'Whether to stop the campaign on auto reply',
		),
		daily_max_leads: num.describe('The daily maximum new leads to contact'),
		prioritize_new_leads: bool.describe('Whether to prioritize new leads'),
		auto_variant_select: obj.describe('Auto variant select settings'),
		match_lead_esp: bool.describe('Whether to match leads by ESP'),
		not_sending_status: num.describe(
			'Campaign not sending status; 1 Campaign is currently not within its sending schedule., 2 Campaign is currently waiting for a lead to process., 3 Campaign has reached its daily sending limit., 4 All sending accounts for this campa',
		),
		stop_for_company: bool.describe(
			'Whether to stop the campaign for the entire company(domain) when a lead replies',
		),
		core_variables: obj.describe('Campaign core variables'),
		custom_variables: obj.describe('Campaign custom variables'),
		insert_unsubscribe_header: bool.describe(
			'Whether to insert an unsubscribe header in emails',
		),
		allow_risky_contacts: bool.describe('Whether to allow risky contacts'),
		disable_bounce_protect: bool.describe(
			'Whether to disable bounce protection',
		),
		limit_emails_per_company_override: obj.describe(
			'Overrides the workspace-wide limit emails per company setting for this campaign.',
		),
		cc_list: z.array(z.string()).nullish(),
		bcc_list: z.array(z.string()).nullish(),
		organization: str.describe('Organization ID'),
		owned_by: str.describe('Owner ID'),
		created_by: str.describe('ID of the user who created the campaign'),
		ai_sdr_id: str.describe('AI Sales Agent ID that created this campaign'),
		provider_routing_rules: list,
	})
	.loose();

const CampaignsGetSendingStatusOutput = z
	.object({
		diagnostics: obj.describe(
			'Raw sending status data. Some fields may be missing when campaign is out of schedule.',
		),
		summary: obj.describe('Human-readable summary of the sending status'),
	})
	.loose();

const SubsequencesCreateOutput = z
	.object({
		id: str.describe('Unique identifier for the subsequence'),
		timestamp_created: str.describe(
			'Timestamp when the subsequence was created',
		),
		parent_campaign: str.describe('ID of the parent campaign'),
		workspace: str.describe('ID of the workspace this subsequence belongs to'),
		status: num.describe(
			'Status of the subsequence; 0 Draft - The subsequence is in draft mode and not yet active, 1 Active - The subsequence is currently running, 2 Paused - The subsequence has been manually paused, 3 Completed - The subsequence has f',
		),
		timestamp_leads_updated: str.describe(
			'Timestamp when the leads were last updated',
		),
		name: str.describe('Name of the subsequence'),
		conditions: obj.describe('Conditions that trigger the subsequence'),
		subsequence_schedule: obj.describe(
			"Schedule configuration for the subsequence. When omitted on create, inherits the parent campaign's schedule.",
		),
		sequences: list,
		auto_variant_select: obj.describe(
			'Automatically select the winning variant for each step using open, click, or reply rate. Set to `null` to disable automatic selection.',
		),
		daily_limit_mode: str.describe(
			'Daily limit mode for the subsequence. "inherit" uses the parent campaign limit, "custom" uses a subsequence-specific limit, "unlimited"...',
		),
		daily_limit: num.describe(
			'Custom daily limit for the subsequence. Only used when `daily_limit_mode` is "custom".',
		),
		ignore_account_daily_limit: bool.describe(
			'When enabled, the subsequence will send even when sending accounts have reached their daily limit.',
		),
	})
	.loose();

const SubsequencesListOutput = page(
	z
		.object({
			id: str.describe('Unique identifier for the subsequence'),
			timestamp_created: str.describe(
				'Timestamp when the subsequence was created',
			),
			parent_campaign: str.describe('ID of the parent campaign'),
			workspace: str.describe(
				'ID of the workspace this subsequence belongs to',
			),
			status: num.describe(
				'Status of the subsequence; 0 Draft - The subsequence is in draft mode and not yet active, 1 Active - The subsequence is currently running, 2 Paused - The subsequence has been manually paused, 3 Completed - The subsequence has f',
			),
			timestamp_leads_updated: str.describe(
				'Timestamp when the leads were last updated',
			),
			name: str.describe('Name of the subsequence'),
			conditions: obj.describe('Conditions that trigger the subsequence'),
			subsequence_schedule: obj.describe(
				"Schedule configuration for the subsequence. When omitted on create, inherits the parent campaign's schedule.",
			),
			sequences: list,
			auto_variant_select: obj.describe(
				'Automatically select the winning variant for each step using open, click, or reply rate. Set to `null` to disable automatic selection.',
			),
			daily_limit_mode: str.describe(
				'Daily limit mode for the subsequence. "inherit" uses the parent campaign limit, "custom" uses a subsequence-specific limit, "unlimited"...',
			),
			daily_limit: num.describe(
				'Custom daily limit for the subsequence. Only used when `daily_limit_mode` is "custom".',
			),
			ignore_account_daily_limit: bool.describe(
				'When enabled, the subsequence will send even when sending accounts have reached their daily limit.',
			),
		})
		.loose(),
);

const SubsequencesGetOutput = z
	.object({
		id: str.describe('Unique identifier for the subsequence'),
		timestamp_created: str.describe(
			'Timestamp when the subsequence was created',
		),
		parent_campaign: str.describe('ID of the parent campaign'),
		workspace: str.describe('ID of the workspace this subsequence belongs to'),
		status: num.describe(
			'Status of the subsequence; 0 Draft - The subsequence is in draft mode and not yet active, 1 Active - The subsequence is currently running, 2 Paused - The subsequence has been manually paused, 3 Completed - The subsequence has f',
		),
		timestamp_leads_updated: str.describe(
			'Timestamp when the leads were last updated',
		),
		name: str.describe('Name of the subsequence'),
		conditions: obj.describe('Conditions that trigger the subsequence'),
		subsequence_schedule: obj.describe(
			"Schedule configuration for the subsequence. When omitted on create, inherits the parent campaign's schedule.",
		),
		sequences: list,
		auto_variant_select: obj.describe(
			'Automatically select the winning variant for each step using open, click, or reply rate. Set to `null` to disable automatic selection.',
		),
		daily_limit_mode: str.describe(
			'Daily limit mode for the subsequence. "inherit" uses the parent campaign limit, "custom" uses a subsequence-specific limit, "unlimited"...',
		),
		daily_limit: num.describe(
			'Custom daily limit for the subsequence. Only used when `daily_limit_mode` is "custom".',
		),
		ignore_account_daily_limit: bool.describe(
			'When enabled, the subsequence will send even when sending accounts have reached their daily limit.',
		),
	})
	.loose();

const SubsequencesUpdateOutput = z
	.object({
		id: str.describe('Unique identifier for the subsequence'),
		timestamp_created: str.describe(
			'Timestamp when the subsequence was created',
		),
		parent_campaign: str.describe('ID of the parent campaign'),
		workspace: str.describe('ID of the workspace this subsequence belongs to'),
		status: num.describe(
			'Status of the subsequence; 0 Draft - The subsequence is in draft mode and not yet active, 1 Active - The subsequence is currently running, 2 Paused - The subsequence has been manually paused, 3 Completed - The subsequence has f',
		),
		timestamp_leads_updated: str.describe(
			'Timestamp when the leads were last updated',
		),
		name: str.describe('Name of the subsequence'),
		conditions: obj.describe('Conditions that trigger the subsequence'),
		subsequence_schedule: obj.describe(
			"Schedule configuration for the subsequence. When omitted on create, inherits the parent campaign's schedule.",
		),
		sequences: list,
		auto_variant_select: obj.describe(
			'Automatically select the winning variant for each step using open, click, or reply rate. Set to `null` to disable automatic selection.',
		),
		daily_limit_mode: str.describe(
			'Daily limit mode for the subsequence. "inherit" uses the parent campaign limit, "custom" uses a subsequence-specific limit, "unlimited"...',
		),
		daily_limit: num.describe(
			'Custom daily limit for the subsequence. Only used when `daily_limit_mode` is "custom".',
		),
		ignore_account_daily_limit: bool.describe(
			'When enabled, the subsequence will send even when sending accounts have reached their daily limit.',
		),
	})
	.loose();

const SubsequencesDeleteOutput = z
	.object({
		id: str.describe('Unique identifier for the subsequence'),
		timestamp_created: str.describe(
			'Timestamp when the subsequence was created',
		),
		parent_campaign: str.describe('ID of the parent campaign'),
		workspace: str.describe('ID of the workspace this subsequence belongs to'),
		status: num.describe(
			'Status of the subsequence; 0 Draft - The subsequence is in draft mode and not yet active, 1 Active - The subsequence is currently running, 2 Paused - The subsequence has been manually paused, 3 Completed - The subsequence has f',
		),
		timestamp_leads_updated: str.describe(
			'Timestamp when the leads were last updated',
		),
		name: str.describe('Name of the subsequence'),
		conditions: obj.describe('Conditions that trigger the subsequence'),
		subsequence_schedule: obj.describe(
			"Schedule configuration for the subsequence. When omitted on create, inherits the parent campaign's schedule.",
		),
		sequences: list,
		auto_variant_select: obj.describe(
			'Automatically select the winning variant for each step using open, click, or reply rate. Set to `null` to disable automatic selection.',
		),
		daily_limit_mode: str.describe(
			'Daily limit mode for the subsequence. "inherit" uses the parent campaign limit, "custom" uses a subsequence-specific limit, "unlimited"...',
		),
		daily_limit: num.describe(
			'Custom daily limit for the subsequence. Only used when `daily_limit_mode` is "custom".',
		),
		ignore_account_daily_limit: bool.describe(
			'When enabled, the subsequence will send even when sending accounts have reached their daily limit.',
		),
	})
	.loose();

const SubsequencesDuplicateOutput = z
	.object({
		id: str.describe('Unique identifier for the subsequence'),
		timestamp_created: str.describe(
			'Timestamp when the subsequence was created',
		),
		parent_campaign: str.describe('ID of the parent campaign'),
		workspace: str.describe('ID of the workspace this subsequence belongs to'),
		status: num.describe(
			'Status of the subsequence; 0 Draft - The subsequence is in draft mode and not yet active, 1 Active - The subsequence is currently running, 2 Paused - The subsequence has been manually paused, 3 Completed - The subsequence has f',
		),
		timestamp_leads_updated: str.describe(
			'Timestamp when the leads were last updated',
		),
		name: str.describe('Name of the subsequence'),
		conditions: obj.describe('Conditions that trigger the subsequence'),
		subsequence_schedule: obj.describe(
			"Schedule configuration for the subsequence. When omitted on create, inherits the parent campaign's schedule.",
		),
		sequences: list,
		auto_variant_select: obj.describe(
			'Automatically select the winning variant for each step using open, click, or reply rate. Set to `null` to disable automatic selection.',
		),
		daily_limit_mode: str.describe(
			'Daily limit mode for the subsequence. "inherit" uses the parent campaign limit, "custom" uses a subsequence-specific limit, "unlimited"...',
		),
		daily_limit: num.describe(
			'Custom daily limit for the subsequence. Only used when `daily_limit_mode` is "custom".',
		),
		ignore_account_daily_limit: bool.describe(
			'When enabled, the subsequence will send even when sending accounts have reached their daily limit.',
		),
	})
	.loose();

const SubsequencesPauseOutput = z
	.object({
		id: str.describe('Unique identifier for the subsequence'),
		timestamp_created: str.describe(
			'Timestamp when the subsequence was created',
		),
		parent_campaign: str.describe('ID of the parent campaign'),
		workspace: str.describe('ID of the workspace this subsequence belongs to'),
		status: num.describe(
			'Status of the subsequence; 0 Draft - The subsequence is in draft mode and not yet active, 1 Active - The subsequence is currently running, 2 Paused - The subsequence has been manually paused, 3 Completed - The subsequence has f',
		),
		timestamp_leads_updated: str.describe(
			'Timestamp when the leads were last updated',
		),
		name: str.describe('Name of the subsequence'),
		conditions: obj.describe('Conditions that trigger the subsequence'),
		subsequence_schedule: obj.describe(
			"Schedule configuration for the subsequence. When omitted on create, inherits the parent campaign's schedule.",
		),
		sequences: list,
		auto_variant_select: obj.describe(
			'Automatically select the winning variant for each step using open, click, or reply rate. Set to `null` to disable automatic selection.',
		),
		daily_limit_mode: str.describe(
			'Daily limit mode for the subsequence. "inherit" uses the parent campaign limit, "custom" uses a subsequence-specific limit, "unlimited"...',
		),
		daily_limit: num.describe(
			'Custom daily limit for the subsequence. Only used when `daily_limit_mode` is "custom".',
		),
		ignore_account_daily_limit: bool.describe(
			'When enabled, the subsequence will send even when sending accounts have reached their daily limit.',
		),
	})
	.loose();

const SubsequencesResumeOutput = z
	.object({
		id: str.describe('Unique identifier for the subsequence'),
		timestamp_created: str.describe(
			'Timestamp when the subsequence was created',
		),
		parent_campaign: str.describe('ID of the parent campaign'),
		workspace: str.describe('ID of the workspace this subsequence belongs to'),
		status: num.describe(
			'Status of the subsequence; 0 Draft - The subsequence is in draft mode and not yet active, 1 Active - The subsequence is currently running, 2 Paused - The subsequence has been manually paused, 3 Completed - The subsequence has f',
		),
		timestamp_leads_updated: str.describe(
			'Timestamp when the leads were last updated',
		),
		name: str.describe('Name of the subsequence'),
		conditions: obj.describe('Conditions that trigger the subsequence'),
		subsequence_schedule: obj.describe(
			"Schedule configuration for the subsequence. When omitted on create, inherits the parent campaign's schedule.",
		),
		sequences: list,
		auto_variant_select: obj.describe(
			'Automatically select the winning variant for each step using open, click, or reply rate. Set to `null` to disable automatic selection.',
		),
		daily_limit_mode: str.describe(
			'Daily limit mode for the subsequence. "inherit" uses the parent campaign limit, "custom" uses a subsequence-specific limit, "unlimited"...',
		),
		daily_limit: num.describe(
			'Custom daily limit for the subsequence. Only used when `daily_limit_mode` is "custom".',
		),
		ignore_account_daily_limit: bool.describe(
			'When enabled, the subsequence will send even when sending accounts have reached their daily limit.',
		),
	})
	.loose();

const SubsequencesGetAnalyticsOutput = z.array(
	z
		.object({
			subsequence_id: str,
			emails_sent: num,
			unique_opens: num,
			unique_replies: num,
		})
		.loose(),
);

const SubsequencesGetStepAnalyticsOutput = z.array(
	z
		.object({
			step: str.describe(
				'Zero-based step index. `0` is the first step. Null when the event could not be attributed to a step.',
			),
			variant: str.describe(
				'Zero-based variant index. `0` is variant A, `1` is variant B, and so on. Null when the event could not be attributed to a variant.',
			),
			sent: num.describe('Total emails sent from this step and variant.'),
			opened: num.describe(
				'Total open events attributed to this step and variant.',
			),
			unique_opened: num.describe(
				'Number of unique leads that opened an email from this step and variant.',
			),
			replies: num.describe(
				'Total replies attributed to this step and variant.',
			),
			unique_replies: num.describe(
				'Number of unique leads that replied to this step and variant.',
			),
			replies_automatic: num.describe(
				'Total automatic replies attributed to this step and variant.',
			),
			unique_replies_automatic: num.describe(
				'Number of unique leads that sent an automatic reply to this step and variant.',
			),
			clicks: num.describe(
				'Total link click events attributed to this step and variant.',
			),
			unique_clicks: num.describe(
				'Number of unique leads that clicked a link in this step and variant.',
			),
		})
		.loose(),
);

const SubsequencesGetSendingStatusOutput = z
	.object({
		diagnostics: obj.describe(
			'Raw sending status data. Some fields may be missing when campaign is out of schedule.',
		),
		summary: obj.describe('Human-readable summary of the sending status'),
	})
	.loose();

const LeadsDeleteManyOutput = z
	.object({ count: num.describe('Number of leads successfully deleted.') })
	.loose();

const LeadsMergeOutput = z
	.object({
		id: str.describe('Unique identifier for the lead'),
		timestamp_created: str.describe('Timestamp when the lead was created'),
		timestamp_updated: str.describe('Timestamp when the lead was last updated'),
		organization: str.describe('Organization ID associated with the lead'),
		campaign: str.describe('Campaign ID associated with the lead'),
		status: num.describe(
			'Status of the lead; 1 Active, 2 Paused, 3 Completed, -1 Bounced, -2 Unsubscribed, -3 Skipped',
		),
		email: str.describe('Email address of the lead'),
		personalization: str.describe('Personalization of the lead'),
		website: str.describe('Website of the lead'),
		last_name: str.describe('Last name of the lead'),
		first_name: str.describe('First name of the lead'),
		company_name: str.describe('Company name of the lead'),
		job_title: str.describe('Job title of the lead'),
		phone: str.describe('Phone number of the lead'),
		email_open_count: num.describe('Number of times the email was opened'),
		email_reply_count: num.describe('Number of times the email was replied to'),
		email_click_count: num.describe('Number of times the email was clicked'),
		company_domain: str.describe('Company domain of the lead'),
		status_summary: obj.describe('Status summary of the lead'),
		payload: obj.describe(
			'Lead custom variables. This object can contain any key, but the values have to be of type string, number, boolean, or null. We do NOT allow...',
		),
		status_summary_subseq: obj.describe(
			'Subsequence status summary of the lead',
		),
		last_step_from: str.describe('Source of the last step'),
		last_step_id: str.describe('ID of the last step'),
		last_step_timestamp_executed: str.describe(
			'Timestamp when the last step was executed',
		),
		email_opened_step: num.describe('Last email step opened by the lead'),
		email_opened_variant: num.describe('Last step variant opened by the lead'),
		email_replied_step: num.describe('Last email step the lead has replied to'),
		email_replied_variant: num.describe(
			'Last step variant the lead has replied to',
		),
		email_clicked_step: num.describe('Last email step the lead has clicked'),
		email_clicked_variant: num.describe(
			'Last step variant the lead has clicked',
		),
		lt_interest_status: num.describe(
			'Lead interest status. It can be either a static value (check below), or a custom status interest value; 0 Out of Office, 1 Interested, 2 Meeting Booked, 3 Meeting Completed, 4 Won, -1 Not Interested, -2 Wrong Person, -3 Lost, -4 No Show',
		),
		subsequence_id: str.describe('ID of the subsequence'),
		verification_status: num.describe(
			'Verification status of the lead; 0 Not verified, 1 Verified, 11 Pending, 12 Pending Verification Job, -1 Invalid, -2 Risky, -3 Catch All, -4 Job Change',
		),
		pl_value_lead: str.describe('Potential value of the lead'),
		timestamp_added_subsequence: str.describe(
			'Timestamp when the lead was added to the subsequence',
		),
		timestamp_last_contact: str.describe(
			'Timestamp of the last contact with the lead',
		),
		timestamp_last_open: str.describe('Timestamp of the last email open'),
		timestamp_last_reply: str.describe('Timestamp of the last email reply'),
		timestamp_last_interest_change: str.describe(
			'Timestamp of the last interest status change',
		),
		timestamp_last_click: str.describe('Timestamp of the last email click'),
		enrichment_status: num.describe(
			'Enrichment status of the lead; 1 Enriched, 11 Pending, -1 Enrichment data not available, -2 Error',
		),
		list_id: str.describe('List ID associated with the lead'),
		last_contacted_from: str.describe('Source of the last contact'),
		uploaded_by_user: str.describe('ID of the user who uploaded the lead'),
		upload_method: str.describe(
			'Method used to upload the lead; manual Manual, api API, website-visitor Website Visitor',
		),
		assigned_to: str.describe('ID of the user assigned to the lead'),
		is_website_visitor: bool.describe(
			'Indicates if the lead is a website visitor',
		),
		timestamp_last_touch: str.describe(
			'Timestamp of the last touch with the lead',
		),
		esp_code: num.describe(
			'ESP code associated with the lead; 0 In Queue, 1 Google, 2 Microsoft, 3 Zoho, 8 AirMail, 9 Yahoo, 10 Yandex, 12 Web.de, 13 Libero.it, 999 Other, 1000 Not Found',
		),
		esg_code: num.describe(
			'ESG code associated with the lead; 0 In Queue, 1 Barracuda, 2 Mimecast, 3 Proofpoint, 4 Cisco',
		),
	})
	.loose();

const LeadsRemoveFromSubsequenceOutput = z
	.object({
		id: str.describe('Unique identifier for the lead'),
		timestamp_created: str.describe('Timestamp when the lead was created'),
		timestamp_updated: str.describe('Timestamp when the lead was last updated'),
		organization: str.describe('Organization ID associated with the lead'),
		campaign: str.describe('Campaign ID associated with the lead'),
		status: num.describe(
			'Status of the lead; 1 Active, 2 Paused, 3 Completed, -1 Bounced, -2 Unsubscribed, -3 Skipped',
		),
		email: str.describe('Email address of the lead'),
		personalization: str.describe('Personalization of the lead'),
		website: str.describe('Website of the lead'),
		last_name: str.describe('Last name of the lead'),
		first_name: str.describe('First name of the lead'),
		company_name: str.describe('Company name of the lead'),
		job_title: str.describe('Job title of the lead'),
		phone: str.describe('Phone number of the lead'),
		email_open_count: num.describe('Number of times the email was opened'),
		email_reply_count: num.describe('Number of times the email was replied to'),
		email_click_count: num.describe('Number of times the email was clicked'),
		company_domain: str.describe('Company domain of the lead'),
		status_summary: obj.describe('Status summary of the lead'),
		payload: obj.describe(
			'Lead custom variables. This object can contain any key, but the values have to be of type string, number, boolean, or null. We do NOT allow...',
		),
		status_summary_subseq: obj.describe(
			'Subsequence status summary of the lead',
		),
		last_step_from: str.describe('Source of the last step'),
		last_step_id: str.describe('ID of the last step'),
		last_step_timestamp_executed: str.describe(
			'Timestamp when the last step was executed',
		),
		email_opened_step: num.describe('Last email step opened by the lead'),
		email_opened_variant: num.describe('Last step variant opened by the lead'),
		email_replied_step: num.describe('Last email step the lead has replied to'),
		email_replied_variant: num.describe(
			'Last step variant the lead has replied to',
		),
		email_clicked_step: num.describe('Last email step the lead has clicked'),
		email_clicked_variant: num.describe(
			'Last step variant the lead has clicked',
		),
		lt_interest_status: num.describe(
			'Lead interest status. It can be either a static value (check below), or a custom status interest value; 0 Out of Office, 1 Interested, 2 Meeting Booked, 3 Meeting Completed, 4 Won, -1 Not Interested, -2 Wrong Person, -3 Lost, -4 No Show',
		),
		subsequence_id: str.describe('ID of the subsequence'),
		verification_status: num.describe(
			'Verification status of the lead; 0 Not verified, 1 Verified, 11 Pending, 12 Pending Verification Job, -1 Invalid, -2 Risky, -3 Catch All, -4 Job Change',
		),
		pl_value_lead: str.describe('Potential value of the lead'),
		timestamp_added_subsequence: str.describe(
			'Timestamp when the lead was added to the subsequence',
		),
		timestamp_last_contact: str.describe(
			'Timestamp of the last contact with the lead',
		),
		timestamp_last_open: str.describe('Timestamp of the last email open'),
		timestamp_last_reply: str.describe('Timestamp of the last email reply'),
		timestamp_last_interest_change: str.describe(
			'Timestamp of the last interest status change',
		),
		timestamp_last_click: str.describe('Timestamp of the last email click'),
		enrichment_status: num.describe(
			'Enrichment status of the lead; 1 Enriched, 11 Pending, -1 Enrichment data not available, -2 Error',
		),
		list_id: str.describe('List ID associated with the lead'),
		last_contacted_from: str.describe('Source of the last contact'),
		uploaded_by_user: str.describe('ID of the user who uploaded the lead'),
		upload_method: str.describe(
			'Method used to upload the lead; manual Manual, api API, website-visitor Website Visitor',
		),
		assigned_to: str.describe('ID of the user assigned to the lead'),
		is_website_visitor: bool.describe(
			'Indicates if the lead is a website visitor',
		),
		timestamp_last_touch: str.describe(
			'Timestamp of the last touch with the lead',
		),
		esp_code: num.describe(
			'ESP code associated with the lead; 0 In Queue, 1 Google, 2 Microsoft, 3 Zoho, 8 AirMail, 9 Yahoo, 10 Yandex, 12 Web.de, 13 Libero.it, 999 Other, 1000 Not Found',
		),
		esg_code: num.describe(
			'ESG code associated with the lead; 0 In Queue, 1 Barracuda, 2 Mimecast, 3 Proofpoint, 4 Cisco',
		),
	})
	.loose();

const LeadsAssignOutput = z.object({ status: str, message: str }).loose();

const LeadsMoveOutput = z
	.object({
		id: str.describe('Unique identifier for the background job'),
		workspace_id: str.describe('Workspace ID'),
		user_id: str.describe(
			'The id of the user that triggered the action that created the job',
		),
		type: str.describe(
			'Type of background job; move-leads Move Leads, import-leads Import Leads, export-leads Export Leads, update-warmup-accounts Update Warmup Accounts, rename-variable Rename Variable, broadcast-ai-generate AI broadcast generati',
		),
		entity_id: str.describe('The id of the entity that the job is related to'),
		entity_type: str.describe(
			'Type of entity; list The entity is a lead list, campaign The entity is a campaign, workspace The entity is a workspace, broadcast The entity is an email-marketing broadcast, subscriber-group-sync The entity is a subs',
		),
		data: obj.describe(
			'Data about the job, used to store any additional information we need to process the job',
		),
		progress: num.describe(
			'Progress of the job as a percentage (from 0 to 100)',
		),
		status: str.describe(
			'Job status; pending The background job is waiting in the queue to be processed, in-progress The background job is being processed, success The background job has been successfully processed, failed The background',
		),
		created_at: str.describe('Timestamp when the job was created'),
		updated_at: str.describe('Timestamp when the job was last updated'),
	})
	.loose();

const LeadsMoveToSubsequenceOutput = z
	.object({
		id: str.describe('Unique identifier for the lead'),
		timestamp_created: str.describe('Timestamp when the lead was created'),
		timestamp_updated: str.describe('Timestamp when the lead was last updated'),
		organization: str.describe('Organization ID associated with the lead'),
		campaign: str.describe('Campaign ID associated with the lead'),
		status: num.describe(
			'Status of the lead; 1 Active, 2 Paused, 3 Completed, -1 Bounced, -2 Unsubscribed, -3 Skipped',
		),
		email: str.describe('Email address of the lead'),
		personalization: str.describe('Personalization of the lead'),
		website: str.describe('Website of the lead'),
		last_name: str.describe('Last name of the lead'),
		first_name: str.describe('First name of the lead'),
		company_name: str.describe('Company name of the lead'),
		job_title: str.describe('Job title of the lead'),
		phone: str.describe('Phone number of the lead'),
		email_open_count: num.describe('Number of times the email was opened'),
		email_reply_count: num.describe('Number of times the email was replied to'),
		email_click_count: num.describe('Number of times the email was clicked'),
		company_domain: str.describe('Company domain of the lead'),
		status_summary: obj.describe('Status summary of the lead'),
		payload: obj.describe(
			'Lead custom variables. This object can contain any key, but the values have to be of type string, number, boolean, or null. We do NOT allow...',
		),
		status_summary_subseq: obj.describe(
			'Subsequence status summary of the lead',
		),
		last_step_from: str.describe('Source of the last step'),
		last_step_id: str.describe('ID of the last step'),
		last_step_timestamp_executed: str.describe(
			'Timestamp when the last step was executed',
		),
		email_opened_step: num.describe('Last email step opened by the lead'),
		email_opened_variant: num.describe('Last step variant opened by the lead'),
		email_replied_step: num.describe('Last email step the lead has replied to'),
		email_replied_variant: num.describe(
			'Last step variant the lead has replied to',
		),
		email_clicked_step: num.describe('Last email step the lead has clicked'),
		email_clicked_variant: num.describe(
			'Last step variant the lead has clicked',
		),
		lt_interest_status: num.describe(
			'Lead interest status. It can be either a static value (check below), or a custom status interest value; 0 Out of Office, 1 Interested, 2 Meeting Booked, 3 Meeting Completed, 4 Won, -1 Not Interested, -2 Wrong Person, -3 Lost, -4 No Show',
		),
		subsequence_id: str.describe('ID of the subsequence'),
		verification_status: num.describe(
			'Verification status of the lead; 0 Not verified, 1 Verified, 11 Pending, 12 Pending Verification Job, -1 Invalid, -2 Risky, -3 Catch All, -4 Job Change',
		),
		pl_value_lead: str.describe('Potential value of the lead'),
		timestamp_added_subsequence: str.describe(
			'Timestamp when the lead was added to the subsequence',
		),
		timestamp_last_contact: str.describe(
			'Timestamp of the last contact with the lead',
		),
		timestamp_last_open: str.describe('Timestamp of the last email open'),
		timestamp_last_reply: str.describe('Timestamp of the last email reply'),
		timestamp_last_interest_change: str.describe(
			'Timestamp of the last interest status change',
		),
		timestamp_last_click: str.describe('Timestamp of the last email click'),
		enrichment_status: num.describe(
			'Enrichment status of the lead; 1 Enriched, 11 Pending, -1 Enrichment data not available, -2 Error',
		),
		list_id: str.describe('List ID associated with the lead'),
		last_contacted_from: str.describe('Source of the last contact'),
		uploaded_by_user: str.describe('ID of the user who uploaded the lead'),
		upload_method: str.describe(
			'Method used to upload the lead; manual Manual, api API, website-visitor Website Visitor',
		),
		assigned_to: str.describe('ID of the user assigned to the lead'),
		is_website_visitor: bool.describe(
			'Indicates if the lead is a website visitor',
		),
		timestamp_last_touch: str.describe(
			'Timestamp of the last touch with the lead',
		),
		esp_code: num.describe(
			'ESP code associated with the lead; 0 In Queue, 1 Google, 2 Microsoft, 3 Zoho, 8 AirMail, 9 Yahoo, 10 Yandex, 12 Web.de, 13 Libero.it, 999 Other, 1000 Not Found',
		),
		esg_code: num.describe(
			'ESG code associated with the lead; 0 In Queue, 1 Barracuda, 2 Mimecast, 3 Proofpoint, 4 Cisco',
		),
	})
	.loose();

const LeadListsGetOutput = z
	.object({
		id: str.describe('Unique identifier for the lead list'),
		organization_id: str.describe('Organization ID that owns this lead list'),
		has_enrichment_task: bool.describe(
			'Whether this list runs the enrichment process on every added lead or not',
		),
		owned_by: str.describe(
			'User ID of the owner of this lead list. Defaults to the user that created the list',
		),
		name: str.describe('Name of the lead list'),
		timestamp_created: str.describe('Timestamp when the lead list was created'),
	})
	.loose();

const LeadListsUpdateOutput = z
	.object({
		id: str.describe('Unique identifier for the lead list'),
		organization_id: str.describe('Organization ID that owns this lead list'),
		has_enrichment_task: bool.describe(
			'Whether this list runs the enrichment process on every added lead or not',
		),
		owned_by: str.describe(
			'User ID of the owner of this lead list. Defaults to the user that created the list',
		),
		name: str.describe('Name of the lead list'),
		timestamp_created: str.describe('Timestamp when the lead list was created'),
	})
	.loose();

const LeadListsDeleteOutput = z.object({}).loose();

const LeadListsGetVerificationStatsOutput = z
	.object({
		stats: obj.describe('Sums up the leads by their verification status'),
		total_leads: num.describe('Total number of leads in the list'),
	})
	.loose();

const LeadLabelsCreateOutput = z
	.object({
		id: str.describe('Unique identifier for the custom lead label'),
		timestamp_created: str.describe(
			'Timestamp when the custom lead label was created',
		),
		created_by: str.describe(
			'User ID of the creator of this label. Null when the label was created by an API key or an internal service',
		),
		organization_id: str.describe(
			'Organization ID that owns this custom lead label',
		),
		label: str.describe('Display label for the custom lead label'),
		interest_status_label: str.describe(
			'Interest status label associated with this label; positive Positive, negative Negative, neutral Neutral',
		),
		interest_status: num.describe(
			'Interest status associated with this label. This is generated automatically by us.',
		),
		description: str.describe(
			'Detailed description of the custom lead label purpose',
		),
		use_with_ai: bool.describe(
			'Whether this label should be used with AI features',
		),
		access_grants: list,
	})
	.loose();

const LeadLabelsListOutput = page(
	z
		.object({
			id: str.describe('Unique identifier for the custom lead label'),
			timestamp_created: str.describe(
				'Timestamp when the custom lead label was created',
			),
			created_by: str.describe(
				'User ID of the creator of this label. Null when the label was created by an API key or an internal service',
			),
			organization_id: str.describe(
				'Organization ID that owns this custom lead label',
			),
			label: str.describe('Display label for the custom lead label'),
			interest_status_label: str.describe(
				'Interest status label associated with this label; positive Positive, negative Negative, neutral Neutral',
			),
			interest_status: num.describe(
				'Interest status associated with this label. This is generated automatically by us.',
			),
			description: str.describe(
				'Detailed description of the custom lead label purpose',
			),
			use_with_ai: bool.describe(
				'Whether this label should be used with AI features',
			),
			access_grants: list,
		})
		.loose(),
);

const LeadLabelsGetOutput = z
	.object({
		id: str.describe('Unique identifier for the custom lead label'),
		timestamp_created: str.describe(
			'Timestamp when the custom lead label was created',
		),
		created_by: str.describe(
			'User ID of the creator of this label. Null when the label was created by an API key or an internal service',
		),
		organization_id: str.describe(
			'Organization ID that owns this custom lead label',
		),
		label: str.describe('Display label for the custom lead label'),
		interest_status_label: str.describe(
			'Interest status label associated with this label; positive Positive, negative Negative, neutral Neutral',
		),
		interest_status: num.describe(
			'Interest status associated with this label. This is generated automatically by us.',
		),
		description: str.describe(
			'Detailed description of the custom lead label purpose',
		),
		use_with_ai: bool.describe(
			'Whether this label should be used with AI features',
		),
		access_grants: list,
	})
	.loose();

const LeadLabelsUpdateOutput = z
	.object({
		id: str.describe('Unique identifier for the custom lead label'),
		timestamp_created: str.describe(
			'Timestamp when the custom lead label was created',
		),
		created_by: str.describe(
			'User ID of the creator of this label. Null when the label was created by an API key or an internal service',
		),
		organization_id: str.describe(
			'Organization ID that owns this custom lead label',
		),
		label: str.describe('Display label for the custom lead label'),
		interest_status_label: str.describe(
			'Interest status label associated with this label; positive Positive, negative Negative, neutral Neutral',
		),
		interest_status: num.describe(
			'Interest status associated with this label. This is generated automatically by us.',
		),
		description: str.describe(
			'Detailed description of the custom lead label purpose',
		),
		use_with_ai: bool.describe(
			'Whether this label should be used with AI features',
		),
		access_grants: list,
	})
	.loose();

const LeadLabelsDeleteOutput = z
	.object({
		id: str.describe('Unique identifier for the custom lead label'),
		timestamp_created: str.describe(
			'Timestamp when the custom lead label was created',
		),
		created_by: str.describe(
			'User ID of the creator of this label. Null when the label was created by an API key or an internal service',
		),
		organization_id: str.describe(
			'Organization ID that owns this custom lead label',
		),
		label: str.describe('Display label for the custom lead label'),
		interest_status_label: str.describe(
			'Interest status label associated with this label; positive Positive, negative Negative, neutral Neutral',
		),
		interest_status: num.describe(
			'Interest status associated with this label. This is generated automatically by us.',
		),
		description: str.describe(
			'Detailed description of the custom lead label purpose',
		),
		use_with_ai: bool.describe(
			'Whether this label should be used with AI features',
		),
		access_grants: list,
	})
	.loose();

const LeadLabelsTestAiReplyLabelOutput = z
	.object({
		result: str.describe('The predicted lead label.'),
		custom_labels_considered: z.array(z.string()).nullish(),
	})
	.loose();

const CustomTagsCreateOutput = z
	.object({
		id: str.describe('Unique identifier for the custom tag'),
		timestamp_created: str.describe(
			'Timestamp when the custom tag was created',
		),
		timestamp_updated: str.describe(
			'Timestamp when the custom tag was last updated',
		),
		organization_id: str.describe('Organization ID that owns this custom tag'),
		label: str.describe(
			'Display label for the custom tag. Must be unique per workspace after trimming whitespace.',
		),
		description: str.describe('Detailed description of the custom tag purpose'),
	})
	.loose();

const CustomTagsListOutput = page(
	z
		.object({
			id: str.describe('Unique identifier for the custom tag'),
			timestamp_created: str.describe(
				'Timestamp when the custom tag was created',
			),
			timestamp_updated: str.describe(
				'Timestamp when the custom tag was last updated',
			),
			organization_id: str.describe(
				'Organization ID that owns this custom tag',
			),
			label: str.describe(
				'Display label for the custom tag. Must be unique per workspace after trimming whitespace.',
			),
			description: str.describe(
				'Detailed description of the custom tag purpose',
			),
		})
		.loose(),
);

const CustomTagsGetOutput = z
	.object({
		id: str.describe('Unique identifier for the custom tag'),
		timestamp_created: str.describe(
			'Timestamp when the custom tag was created',
		),
		timestamp_updated: str.describe(
			'Timestamp when the custom tag was last updated',
		),
		organization_id: str.describe('Organization ID that owns this custom tag'),
		label: str.describe(
			'Display label for the custom tag. Must be unique per workspace after trimming whitespace.',
		),
		description: str.describe('Detailed description of the custom tag purpose'),
	})
	.loose();

const CustomTagsUpdateOutput = z
	.object({
		id: str.describe('Unique identifier for the custom tag'),
		timestamp_created: str.describe(
			'Timestamp when the custom tag was created',
		),
		timestamp_updated: str.describe(
			'Timestamp when the custom tag was last updated',
		),
		organization_id: str.describe('Organization ID that owns this custom tag'),
		label: str.describe(
			'Display label for the custom tag. Must be unique per workspace after trimming whitespace.',
		),
		description: str.describe('Detailed description of the custom tag purpose'),
	})
	.loose();

const CustomTagsDeleteOutput = z
	.object({
		id: str.describe('Unique identifier for the custom tag'),
		timestamp_created: str.describe(
			'Timestamp when the custom tag was created',
		),
		timestamp_updated: str.describe(
			'Timestamp when the custom tag was last updated',
		),
		organization_id: str.describe('Organization ID that owns this custom tag'),
		label: str.describe(
			'Display label for the custom tag. Must be unique per workspace after trimming whitespace.',
		),
		description: str.describe('Detailed description of the custom tag purpose'),
	})
	.loose();

const CustomTagsToggleResourceOutput = z.object({ success: bool }).loose();

const CustomTagMappingsListOutput = page(
	z
		.object({
			id: str.describe('A Unique identifier'),
			tag_id: str.describe('ID of the tag this custom mapping belongs to'),
			resource_id: str.describe(
				'ID of the resource custom tag mapping belongs to, resource_type determines the type of resource',
			),
			resource_type: num.describe(
				'Resource type of custom tag: 1 for accounts, 2 for campaigns, 3 for workspaces; 1 Account, 2 Campaign, 3 Workspace',
			),
			timestamp_created: str.describe(
				'Timestamp when the custom tag mapping was created',
			),
			organization_id: str.describe(
				'Organization ID that owns this custom tag mapping',
			),
		})
		.loose(),
);

const EmailsSendTestOutput = z.object({}).loose();

const EmailsForwardOutput = z
	.object({
		id: str.describe('A Unique identifier'),
		timestamp_created: str.describe(
			'Timestamp when the email was added to our database. This is not the timestamp of the email itself, since the email could have been sent at...',
		),
		timestamp_email: str.describe(
			'The timestamp of the email, as provided by the email server. Please note that the timestamp is not always accurate, as it can be...',
		),
		message_id: str.describe('Unique email ID from the email server'),
		subject: str.describe('Subject line of the email message'),
		from_address_email: str.describe(
			'The sender email address, populated based on the eaccount',
		),
		to_address_email_list: str.describe(
			'Comma-separated list of recipient email addresses',
		),
		cc_address_email_list: str.describe(
			'Comma-separated list of CC email addresses',
		),
		bcc_address_email_list: str.describe(
			'Comma-separated list of BCC email addresses',
		),
		reply_to: str.describe('Reply-to email address'),
		body: obj.describe(
			'An object containing the email body in HTML and text format',
		),
		organization_id: str.describe('The workspace ID'),
		campaign_id: str.describe(
			'The id of the campaign that the email is associated with (it can be null for manually sent emails)',
		),
		subsequence_id: str.describe(
			'The id of the campaign subsequence that the email is associated with (it can be null for manually sent emails)',
		),
		list_id: str.describe('The id of the list (if the lead is part of a list)'),
		lead: str.describe(
			'The email address of the lead that the email is associated with',
		),
		lead_id: str.describe('The lead id (if any)'),
		eaccount: str.describe(
			'The email account that was used to send the email. This needs to be validated to make sure it exists in the user workspace',
		),
		ue_type: num.describe(
			'Email type based on the life cycle of the email; 1 Sent from campaign, 2 Received, 3 Sent, 4 Scheduled',
		),
		step: str.describe('The campaign step that the email is associated with'),
		is_unread: num.describe('Indicates if the email is unread'),
		is_auto_reply: num.describe(
			'Indicates if the email is an auto-reply. 0 (zero) - is false, and 1 is true',
		),
		reminder_ts: str.describe('Timestamp for the reminder.'),
		ai_interest_value: num.describe('AI interest value'),
		ai_assisted: num.describe('Indicates if AI assistance was used'),
		is_focused: num.describe(
			'Indicates if the email is focused (is in the primary tab in the Unibox)',
		),
		i_status: num.describe('Indicates the interest status of the email'),
		thread_id: str.describe(
			'Identifier for the email thread. All the emails in the same thread have the same thread ID',
		),
		content_preview: str.describe(
			'A short preview of the email content (usually the first few lines of the email)',
		),
		body_fallback_reason: str.describe(
			'Set only when `body` is not the full email body. `too_large`: the body was too large to include in a list response. `unavailable`: the body...',
		),
		attachment_json: obj.describe(
			'Attachment metadata for the email. This field is null when there are no attachments.',
		),
		from_address_json: list,
		to_address_json: list,
		cc_address_json: list,
		ai_agent_id: str.describe(
			'ID of the AI agent that sent this email (if applicable)',
		),
	})
	.loose();

const EmailsUpdateOutput = z
	.object({
		id: str.describe('A Unique identifier'),
		timestamp_created: str.describe(
			'Timestamp when the email was added to our database. This is not the timestamp of the email itself, since the email could have been sent at...',
		),
		timestamp_email: str.describe(
			'The timestamp of the email, as provided by the email server. Please note that the timestamp is not always accurate, as it can be...',
		),
		message_id: str.describe('Unique email ID from the email server'),
		subject: str.describe('Subject line of the email message'),
		from_address_email: str.describe(
			'The sender email address, populated based on the eaccount',
		),
		to_address_email_list: str.describe(
			'Comma-separated list of recipient email addresses',
		),
		cc_address_email_list: str.describe(
			'Comma-separated list of CC email addresses',
		),
		bcc_address_email_list: str.describe(
			'Comma-separated list of BCC email addresses',
		),
		reply_to: str.describe('Reply-to email address'),
		body: obj.describe(
			'An object containing the email body in HTML and text format',
		),
		organization_id: str.describe('The workspace ID'),
		campaign_id: str.describe(
			'The id of the campaign that the email is associated with (it can be null for manually sent emails)',
		),
		subsequence_id: str.describe(
			'The id of the campaign subsequence that the email is associated with (it can be null for manually sent emails)',
		),
		list_id: str.describe('The id of the list (if the lead is part of a list)'),
		lead: str.describe(
			'The email address of the lead that the email is associated with',
		),
		lead_id: str.describe('The lead id (if any)'),
		eaccount: str.describe(
			'The email account that was used to send the email. This needs to be validated to make sure it exists in the user workspace',
		),
		ue_type: num.describe(
			'Email type based on the life cycle of the email; 1 Sent from campaign, 2 Received, 3 Sent, 4 Scheduled',
		),
		step: str.describe('The campaign step that the email is associated with'),
		is_unread: num.describe('Indicates if the email is unread'),
		is_auto_reply: num.describe(
			'Indicates if the email is an auto-reply. 0 (zero) - is false, and 1 is true',
		),
		reminder_ts: str.describe('Timestamp for the reminder.'),
		ai_interest_value: num.describe('AI interest value'),
		ai_assisted: num.describe('Indicates if AI assistance was used'),
		is_focused: num.describe(
			'Indicates if the email is focused (is in the primary tab in the Unibox)',
		),
		i_status: num.describe('Indicates the interest status of the email'),
		thread_id: str.describe(
			'Identifier for the email thread. All the emails in the same thread have the same thread ID',
		),
		content_preview: str.describe(
			'A short preview of the email content (usually the first few lines of the email)',
		),
		body_fallback_reason: str.describe(
			'Set only when `body` is not the full email body. `too_large`: the body was too large to include in a list response. `unavailable`: the body...',
		),
		attachment_json: obj.describe(
			'Attachment metadata for the email. This field is null when there are no attachments.',
		),
		from_address_json: list,
		to_address_json: list,
		cc_address_json: list,
		ai_agent_id: str.describe(
			'ID of the AI agent that sent this email (if applicable)',
		),
	})
	.loose();

const EmailsDeleteOutput = z
	.object({
		id: str.describe('A Unique identifier'),
		timestamp_created: str.describe(
			'Timestamp when the email was added to our database. This is not the timestamp of the email itself, since the email could have been sent at...',
		),
		timestamp_email: str.describe(
			'The timestamp of the email, as provided by the email server. Please note that the timestamp is not always accurate, as it can be...',
		),
		message_id: str.describe('Unique email ID from the email server'),
		subject: str.describe('Subject line of the email message'),
		from_address_email: str.describe(
			'The sender email address, populated based on the eaccount',
		),
		to_address_email_list: str.describe(
			'Comma-separated list of recipient email addresses',
		),
		cc_address_email_list: str.describe(
			'Comma-separated list of CC email addresses',
		),
		bcc_address_email_list: str.describe(
			'Comma-separated list of BCC email addresses',
		),
		reply_to: str.describe('Reply-to email address'),
		body: obj.describe(
			'An object containing the email body in HTML and text format',
		),
		organization_id: str.describe('The workspace ID'),
		campaign_id: str.describe(
			'The id of the campaign that the email is associated with (it can be null for manually sent emails)',
		),
		subsequence_id: str.describe(
			'The id of the campaign subsequence that the email is associated with (it can be null for manually sent emails)',
		),
		list_id: str.describe('The id of the list (if the lead is part of a list)'),
		lead: str.describe(
			'The email address of the lead that the email is associated with',
		),
		lead_id: str.describe('The lead id (if any)'),
		eaccount: str.describe(
			'The email account that was used to send the email. This needs to be validated to make sure it exists in the user workspace',
		),
		ue_type: num.describe(
			'Email type based on the life cycle of the email; 1 Sent from campaign, 2 Received, 3 Sent, 4 Scheduled',
		),
		step: str.describe('The campaign step that the email is associated with'),
		is_unread: num.describe('Indicates if the email is unread'),
		is_auto_reply: num.describe(
			'Indicates if the email is an auto-reply. 0 (zero) - is false, and 1 is true',
		),
		reminder_ts: str.describe('Timestamp for the reminder.'),
		ai_interest_value: num.describe('AI interest value'),
		ai_assisted: num.describe('Indicates if AI assistance was used'),
		is_focused: num.describe(
			'Indicates if the email is focused (is in the primary tab in the Unibox)',
		),
		i_status: num.describe('Indicates the interest status of the email'),
		thread_id: str.describe(
			'Identifier for the email thread. All the emails in the same thread have the same thread ID',
		),
		content_preview: str.describe(
			'A short preview of the email content (usually the first few lines of the email)',
		),
		body_fallback_reason: str.describe(
			'Set only when `body` is not the full email body. `too_large`: the body was too large to include in a list response. `unavailable`: the body...',
		),
		attachment_json: obj.describe(
			'Attachment metadata for the email. This field is null when there are no attachments.',
		),
		from_address_json: list,
		to_address_json: list,
		cc_address_json: list,
		ai_agent_id: str.describe(
			'ID of the AI agent that sent this email (if applicable)',
		),
	})
	.loose();

const EmailVerificationVerifyOutput = z
	.object({
		status: str.describe(
			'The request status. Do not use this field to determine the verification status. Please use `verification_status` instead to check the...; success The verification was successful, error The verification was unsuccessful',
		),
		email: str.describe('The email address to verify'),
		verification_status: str.describe(
			'The verification status.; pending The verification is pending, verified The verification is verified, invalid The verification is invalid',
		),
		catch_all: untyped,
		credits: num.describe(
			'The number of verification credits available after the verification',
		),
		credits_used: num.describe('The number of verification credits used'),
	})
	.loose();

const EmailVerificationGetStatusOutput = z
	.object({
		status: str.describe(
			'The request status. Do not use this field to determine the verification status. Please use `verification_status` instead to check the...; success The verification was successful, error The verification was unsuccessful',
		),
		email: str.describe('The email address to verify'),
		verification_status: str.describe(
			'The verification status.; pending The verification is pending, verified The verification is verified, invalid The verification is invalid',
		),
		catch_all: untyped,
		credits: num.describe(
			'The number of verification credits available after the verification',
		),
		credits_used: num.describe('The number of verification credits used'),
	})
	.loose();

const BlocklistGetOutput = z
	.object({
		id: str.describe('Unique identifier for the block list entry'),
		timestamp_created: str.describe(
			'Timestamp when the block list entry was created',
		),
		organization_id: str.describe(
			'Organization ID that owns this block list entry',
		),
		bl_value: str.describe('The email or domain to block'),
		is_domain: bool.describe('Whether this entry blocks an entire domain'),
	})
	.loose();

const BlocklistUpdateOutput = z
	.object({
		id: str.describe('Unique identifier for the block list entry'),
		timestamp_created: str.describe(
			'Timestamp when the block list entry was created',
		),
		organization_id: str.describe(
			'Organization ID that owns this block list entry',
		),
		bl_value: str.describe('The email or domain to block'),
		is_domain: bool.describe('Whether this entry blocks an entire domain'),
	})
	.loose();

const BlocklistDeleteAllOutput = z.array(
	z
		.object({
			id: str.describe('Unique identifier for the block list entry'),
			timestamp_created: str.describe(
				'Timestamp when the block list entry was created',
			),
			organization_id: str.describe(
				'Organization ID that owns this block list entry',
			),
			bl_value: str.describe('The email or domain to block'),
			is_domain: bool.describe('Whether this entry blocks an entire domain'),
		})
		.loose(),
);

const BlocklistAddManyOutput = page(
	z
		.object({
			id: str.describe('Unique identifier for the block list entry'),
			timestamp_created: str.describe(
				'Timestamp when the block list entry was created',
			),
			organization_id: str.describe(
				'Organization ID that owns this block list entry',
			),
			bl_value: str.describe('The email or domain to block'),
			is_domain: bool.describe('Whether this entry blocks an entire domain'),
		})
		.loose(),
);

const BlocklistRemoveManyOutput = z.array(
	z
		.object({
			id: str.describe('Unique identifier for the block list entry'),
			timestamp_created: str.describe(
				'Timestamp when the block list entry was created',
			),
			organization_id: str.describe(
				'Organization ID that owns this block list entry',
			),
			bl_value: str.describe('The email or domain to block'),
			is_domain: bool.describe('Whether this entry blocks an entire domain'),
		})
		.loose(),
);

const BlocklistDownloadCsvOutput = z.string();

const WebhooksGetOutput = z
	.object({
		id: str.describe('Unique identifier for the webhook (UUID)'),
		organization: str.describe(
			'Organization (workspace) UUID that owns this webhook',
		),
		campaign: str.describe(
			'Optional campaign UUID to filter events (null = all campaigns in workspace)',
		),
		name: str.describe('Optional user-defined name for the webhook'),
		target_hook_url: str.describe('Target URL to send webhook payloads'),
		event_type: str.describe(
			'Type of event to trigger the webhook (null for custom label events). Set to "all_events" to subscribe to all events - including custom...',
		),
		custom_interest_value: num.describe(
			'Custom interest value - corresponds to LeadLabel.interest_status (used for custom label events)',
		),
		headers: obj.describe(
			'Optional HTTP headers to include when delivering webhook payloads (key-value pairs)',
		),
		timestamp_created: str.describe('Timestamp when the webhook was created'),
		status: num.describe(
			'Webhook status: 1 = active, -1 = error (disabled due to delivery failures)',
		),
		timestamp_error: str.describe(
			'Timestamp when webhook was disabled due to delivery failures (null if active)',
		),
	})
	.loose();

const WebhooksUpdateOutput = z
	.object({
		id: str.describe('Unique identifier for the webhook (UUID)'),
		organization: str.describe(
			'Organization (workspace) UUID that owns this webhook',
		),
		campaign: str.describe(
			'Optional campaign UUID to filter events (null = all campaigns in workspace)',
		),
		name: str.describe('Optional user-defined name for the webhook'),
		target_hook_url: str.describe('Target URL to send webhook payloads'),
		event_type: str.describe(
			'Type of event to trigger the webhook (null for custom label events). Set to "all_events" to subscribe to all events - including custom...',
		),
		custom_interest_value: num.describe(
			'Custom interest value - corresponds to LeadLabel.interest_status (used for custom label events)',
		),
		headers: obj.describe(
			'Optional HTTP headers to include when delivering webhook payloads (key-value pairs)',
		),
		timestamp_created: str.describe('Timestamp when the webhook was created'),
		status: num.describe(
			'Webhook status: 1 = active, -1 = error (disabled due to delivery failures)',
		),
		timestamp_error: str.describe(
			'Timestamp when webhook was disabled due to delivery failures (null if active)',
		),
	})
	.loose();

const WebhooksTestOutput = z
	.object({
		success: bool,
		message: str,
		response_time_ms: num,
		status_code: num,
		error: str,
	})
	.loose();

const WebhooksResumeOutput = z
	.object({
		id: str.describe('Unique identifier for the webhook (UUID)'),
		organization: str.describe(
			'Organization (workspace) UUID that owns this webhook',
		),
		campaign: str.describe(
			'Optional campaign UUID to filter events (null = all campaigns in workspace)',
		),
		name: str.describe('Optional user-defined name for the webhook'),
		target_hook_url: str.describe('Target URL to send webhook payloads'),
		event_type: str.describe(
			'Type of event to trigger the webhook (null for custom label events). Set to "all_events" to subscribe to all events - including custom...',
		),
		custom_interest_value: num.describe(
			'Custom interest value - corresponds to LeadLabel.interest_status (used for custom label events)',
		),
		headers: obj.describe(
			'Optional HTTP headers to include when delivering webhook payloads (key-value pairs)',
		),
		timestamp_created: str.describe('Timestamp when the webhook was created'),
		status: num.describe(
			'Webhook status: 1 = active, -1 = error (disabled due to delivery failures)',
		),
		timestamp_error: str.describe(
			'Timestamp when webhook was disabled due to delivery failures (null if active)',
		),
	})
	.loose();

const WebhookEventsListOutput = page(
	z
		.object({
			id: str.describe('Unique identifier for the webhook event (UUID)'),
			timestamp_created: str.describe(
				'Timestamp when the webhook event was created',
			),
			timestamp_created_date: str.describe(
				'Date when the webhook event was created (for partitioning)',
			),
			organization_id: str.describe(
				'Organization (workspace) UUID that owns this webhook event',
			),
			payload: obj.describe('JSON payload that was sent/attempted to be sent'),
			success: bool.describe('Whether the webhook call was successful'),
			retry_count: num.describe('Number of retry attempts made'),
			will_retry: bool.describe('Whether the webhook will be retried'),
			webhook_url: str.describe('Target URL where the webhook was sent'),
			status_code: num.describe(
				'HTTP status code received from the webhook endpoint (if any)',
			),
			error_message: str.describe('Error message if the webhook failed'),
			timestamp_next_retry: str.describe(
				'Timestamp for the next retry attempt (if applicable)',
			),
			retry_group_id: str.describe('UUID for grouping retry attempts'),
			retry_successful: bool.describe(
				'Whether the retry was successful (for retry events)',
			),
			lead_email: str.describe(
				'Email address of the lead associated with this webhook event',
			),
			response_time_ms: num.describe(
				'Response time in milliseconds for the webhook call',
			),
		})
		.loose(),
);

const WebhookEventsGetOutput = z
	.object({
		id: str.describe('Unique identifier for the webhook event (UUID)'),
		timestamp_created: str.describe(
			'Timestamp when the webhook event was created',
		),
		timestamp_created_date: str.describe(
			'Date when the webhook event was created (for partitioning)',
		),
		organization_id: str.describe(
			'Organization (workspace) UUID that owns this webhook event',
		),
		payload: obj.describe('JSON payload that was sent/attempted to be sent'),
		success: bool.describe('Whether the webhook call was successful'),
		retry_count: num.describe('Number of retry attempts made'),
		will_retry: bool.describe('Whether the webhook will be retried'),
		webhook_url: str.describe('Target URL where the webhook was sent'),
		status_code: num.describe(
			'HTTP status code received from the webhook endpoint (if any)',
		),
		error_message: str.describe('Error message if the webhook failed'),
		timestamp_next_retry: str.describe(
			'Timestamp for the next retry attempt (if applicable)',
		),
		retry_group_id: str.describe('UUID for grouping retry attempts'),
		retry_successful: bool.describe(
			'Whether the retry was successful (for retry events)',
		),
		lead_email: str.describe(
			'Email address of the lead associated with this webhook event',
		),
		response_time_ms: num.describe(
			'Response time in milliseconds for the webhook call',
		),
	})
	.loose();

const WebhookEventsGetSummaryOutput = z
	.object({
		total_events: num.describe('Total number of webhook events'),
		successful_events: num.describe(
			'Total number of successful webhook events',
		),
		failed_events: num.describe('Total number of failed webhook events'),
		success_rate: num.describe(
			'Percentage (0-100) of successful webhook calls',
		),
		failure_rate: num.describe('Percentage (0-100) of failed webhook calls'),
	})
	.loose();

const WebhookEventsGetSummaryByDateOutput = page(
	z
		.object({
			date: str.describe('Date of the webhook event'),
			total_events: num.describe('Total number of webhook events'),
			successful_events: num.describe(
				'Total number of successful webhook events',
			),
			failed_events: num.describe('Total number of failed webhook events'),
			success_rate: num.describe('Success rate of the webhook events'),
		})
		.loose(),
);

const InboxPlacementTestsCreateOutput = z
	.object({
		id: str.describe('Unique identifier for the inbox placement test'),
		organization_id: str.describe('Organization ID'),
		name: str.describe('Name of the inbox placement test'),
		delivery_mode: num.describe(
			'Whether to send emails one by one or all together; 1 One by one, 2 All together',
		),
		description: str.describe('Description of the inbox placement test'),
		schedule: obj.describe(
			'Specifies the date and time when the automated inbox placement tests will be sent.',
		),
		type: num.describe(
			'Whether the inbox placement test is a one-time test or an automated test',
		),
		sending_method: num.describe(
			'Whether the inbox placement test will be sent from Instantly or from outside Instantly; 1 From Instantly, 2 From Outside Instantly',
		),
		campaign_id: str.describe('Campaign ID'),
		email_subject: str.describe('Email subject of the inbox placement test'),
		email_body: str.describe('Email body of the inbox placement test'),
		emails: z.array(z.string()).nullish(),
		test_code: str.describe(
			'Code for identifying inbox placement tests sent from outside Instantly. Use ptid_ followed by letters, numbers, hyphens, or underscores....',
		),
		tags: z.array(z.string()).nullish(),
		text_only: bool.describe('Disables open tracking'),
		recipients: z.array(z.string()).nullish(),
		recipients_labels: list,
		timestamp_created: str.describe(
			'Timestamp when the inbox placement test was created',
		),
		timestamp_next_run: str.describe(
			'Timestamp when the inbox placement test will run next',
		),
		automations: list,
		status: num.describe(
			'Status of the inbox placement test; 1 Active, 2 Paused, 3 Completed',
		),
		not_sending_status: str.describe(
			'Why the inbox placement test is currently not sending. It will be an empty string if there are no issues.; daily_limits_hit Daily limits hit, other Other reason',
		),
	})
	.loose();

const InboxPlacementTestsListOutput = page(
	z
		.object({
			id: str.describe('Unique identifier for the inbox placement test'),
			organization_id: str.describe('Organization ID'),
			name: str.describe('Name of the inbox placement test'),
			delivery_mode: num.describe(
				'Whether to send emails one by one or all together; 1 One by one, 2 All together',
			),
			description: str.describe('Description of the inbox placement test'),
			schedule: obj.describe(
				'Specifies the date and time when the automated inbox placement tests will be sent.',
			),
			type: num.describe(
				'Whether the inbox placement test is a one-time test or an automated test',
			),
			sending_method: num.describe(
				'Whether the inbox placement test will be sent from Instantly or from outside Instantly; 1 From Instantly, 2 From Outside Instantly',
			),
			campaign_id: str.describe('Campaign ID'),
			email_subject: str.describe('Email subject of the inbox placement test'),
			email_body: str.describe('Email body of the inbox placement test'),
			emails: z.array(z.string()).nullish(),
			test_code: str.describe(
				'Code for identifying inbox placement tests sent from outside Instantly. Use ptid_ followed by letters, numbers, hyphens, or underscores....',
			),
			tags: z.array(z.string()).nullish(),
			text_only: bool.describe('Disables open tracking'),
			recipients: z.array(z.string()).nullish(),
			recipients_labels: list,
			timestamp_created: str.describe(
				'Timestamp when the inbox placement test was created',
			),
			timestamp_next_run: str.describe(
				'Timestamp when the inbox placement test will run next',
			),
			automations: list,
			status: num.describe(
				'Status of the inbox placement test; 1 Active, 2 Paused, 3 Completed',
			),
			not_sending_status: str.describe(
				'Why the inbox placement test is currently not sending. It will be an empty string if there are no issues.; daily_limits_hit Daily limits hit, other Other reason',
			),
		})
		.loose(),
);

const InboxPlacementTestsGetOutput = z
	.object({
		id: str.describe('Unique identifier for the inbox placement test'),
		organization_id: str.describe('Organization ID'),
		name: str.describe('Name of the inbox placement test'),
		delivery_mode: num.describe(
			'Whether to send emails one by one or all together; 1 One by one, 2 All together',
		),
		description: str.describe('Description of the inbox placement test'),
		schedule: obj.describe(
			'Specifies the date and time when the automated inbox placement tests will be sent.',
		),
		type: num.describe(
			'Whether the inbox placement test is a one-time test or an automated test',
		),
		sending_method: num.describe(
			'Whether the inbox placement test will be sent from Instantly or from outside Instantly; 1 From Instantly, 2 From Outside Instantly',
		),
		campaign_id: str.describe('Campaign ID'),
		email_subject: str.describe('Email subject of the inbox placement test'),
		email_body: str.describe('Email body of the inbox placement test'),
		emails: z.array(z.string()).nullish(),
		test_code: str.describe(
			'Code for identifying inbox placement tests sent from outside Instantly. Use ptid_ followed by letters, numbers, hyphens, or underscores....',
		),
		tags: z.array(z.string()).nullish(),
		text_only: bool.describe('Disables open tracking'),
		recipients: z.array(z.string()).nullish(),
		recipients_labels: list,
		timestamp_created: str.describe(
			'Timestamp when the inbox placement test was created',
		),
		timestamp_next_run: str.describe(
			'Timestamp when the inbox placement test will run next',
		),
		automations: list,
		status: num.describe(
			'Status of the inbox placement test; 1 Active, 2 Paused, 3 Completed',
		),
		not_sending_status: str.describe(
			'Why the inbox placement test is currently not sending. It will be an empty string if there are no issues.; daily_limits_hit Daily limits hit, other Other reason',
		),
		metadata: obj.describe(
			'Included only when the `with_metadata` parameter is `true`. Contains additional information about the inbox placement test as associated...',
		),
	})
	.loose();

const InboxPlacementTestsUpdateOutput = z
	.object({
		id: str.describe('Unique identifier for the inbox placement test'),
		organization_id: str.describe('Organization ID'),
		name: str.describe('Name of the inbox placement test'),
		delivery_mode: num.describe(
			'Whether to send emails one by one or all together; 1 One by one, 2 All together',
		),
		description: str.describe('Description of the inbox placement test'),
		schedule: obj.describe(
			'Specifies the date and time when the automated inbox placement tests will be sent.',
		),
		type: num.describe(
			'Whether the inbox placement test is a one-time test or an automated test',
		),
		sending_method: num.describe(
			'Whether the inbox placement test will be sent from Instantly or from outside Instantly; 1 From Instantly, 2 From Outside Instantly',
		),
		campaign_id: str.describe('Campaign ID'),
		email_subject: str.describe('Email subject of the inbox placement test'),
		email_body: str.describe('Email body of the inbox placement test'),
		emails: z.array(z.string()).nullish(),
		test_code: str.describe(
			'Code for identifying inbox placement tests sent from outside Instantly. Use ptid_ followed by letters, numbers, hyphens, or underscores....',
		),
		tags: z.array(z.string()).nullish(),
		text_only: bool.describe('Disables open tracking'),
		recipients: z.array(z.string()).nullish(),
		recipients_labels: list,
		timestamp_created: str.describe(
			'Timestamp when the inbox placement test was created',
		),
		timestamp_next_run: str.describe(
			'Timestamp when the inbox placement test will run next',
		),
		automations: list,
		status: num.describe(
			'Status of the inbox placement test; 1 Active, 2 Paused, 3 Completed',
		),
		not_sending_status: str.describe(
			'Why the inbox placement test is currently not sending. It will be an empty string if there are no issues.; daily_limits_hit Daily limits hit, other Other reason',
		),
	})
	.loose();

const InboxPlacementTestsDeleteOutput = z
	.object({
		id: str.describe('Unique identifier for the inbox placement test'),
		organization_id: str.describe('Organization ID'),
		name: str.describe('Name of the inbox placement test'),
		delivery_mode: num.describe(
			'Whether to send emails one by one or all together; 1 One by one, 2 All together',
		),
		description: str.describe('Description of the inbox placement test'),
		schedule: obj.describe(
			'Specifies the date and time when the automated inbox placement tests will be sent.',
		),
		type: num.describe(
			'Whether the inbox placement test is a one-time test or an automated test',
		),
		sending_method: num.describe(
			'Whether the inbox placement test will be sent from Instantly or from outside Instantly; 1 From Instantly, 2 From Outside Instantly',
		),
		campaign_id: str.describe('Campaign ID'),
		email_subject: str.describe('Email subject of the inbox placement test'),
		email_body: str.describe('Email body of the inbox placement test'),
		emails: z.array(z.string()).nullish(),
		test_code: str.describe(
			'Code for identifying inbox placement tests sent from outside Instantly. Use ptid_ followed by letters, numbers, hyphens, or underscores....',
		),
		tags: z.array(z.string()).nullish(),
		text_only: bool.describe('Disables open tracking'),
		recipients: z.array(z.string()).nullish(),
		recipients_labels: list,
		timestamp_created: str.describe(
			'Timestamp when the inbox placement test was created',
		),
		timestamp_next_run: str.describe(
			'Timestamp when the inbox placement test will run next',
		),
		automations: list,
		status: num.describe(
			'Status of the inbox placement test; 1 Active, 2 Paused, 3 Completed',
		),
		not_sending_status: str.describe(
			'Why the inbox placement test is currently not sending. It will be an empty string if there are no issues.; daily_limits_hit Daily limits hit, other Other reason',
		),
	})
	.loose();

const InboxPlacementTestsListEspOptionsOutput = z.array(
	z.object({ region: str, sub_region: str, type: str, esp: str }).loose(),
);

const InboxPlacementAnalyticsListOutput = page(
	z
		.object({
			id: str.describe(
				'Unique identifier for the inbox placement analytics entry',
			),
			timestamp_created: str.describe(
				'Timestamp when the inbox placement analytics was created',
			),
			timestamp_created_date: str.describe(
				'Date when the inbox placement analytics was created',
			),
			organization_id: str.describe('Organization ID'),
			test_id: str.describe('Inbox Placement Test ID'),
			is_spam: bool.describe(
				'Indicates if the email landed in spam (null if not determined). Only present when record_type is 2 (received).',
			),
			has_category: bool.describe(
				'Indicates if the email was categorized like promotions, social, etc. (null if not determined). Only present when record_type is 2...',
			),
			sender_email: str.describe('Email address of the sender'),
			sender_esp: num.describe(
				'The sender ESP (Email Service Provider). Only present when record_type is 2 (received).; 1 Google, 2 Microsoft, 8 AirMail, 12 Web.de, 13 Libero.it',
			),
			recipient_email: str.describe('Email address of the recipient'),
			recipient_esp: num.describe(
				'The recipient ESP (Email Service Provider); 1 Google, 2 Microsoft, 8 AirMail, 12 Web.de, 13 Libero.it',
			),
			recipient_geo: num.describe(
				'The geographic location of the recipient; 1 United States, 2 Italy, 3 Germany, 4 France',
			),
			recipient_type: num.describe(
				'The type of recipient; 1 Professional, 2 Personal',
			),
			spf_pass: bool.describe(
				'Indicates if the email passed SPF validation. Only present when record_type is 2 (received).',
			),
			dkim_pass: bool.describe(
				'Indicates if the email passed DKIM validation. Only present when record_type is 2 (received).',
			),
			dmarc_pass: bool.describe(
				'Indicates if the email passed DMARC validation. Only present when record_type is 2 (received).',
			),
			smtp_ip_blacklist_report: obj.describe(
				'Blacklist report for the SMTP IP address. Only present when record_type is 2 (received).',
			),
			authentication_failure_results: obj.describe(
				'Details of authentication failures for SPF, DKIM, and DMARC. Only present when record_type is 2 (received).',
			),
			record_type: num.describe(
				'The type of record (sent or received); 1 Sent, 2 Received',
			),
		})
		.loose(),
);

const InboxPlacementAnalyticsGetOutput = z
	.object({
		id: str.describe(
			'Unique identifier for the inbox placement analytics entry',
		),
		timestamp_created: str.describe(
			'Timestamp when the inbox placement analytics was created',
		),
		timestamp_created_date: str.describe(
			'Date when the inbox placement analytics was created',
		),
		organization_id: str.describe('Organization ID'),
		test_id: str.describe('Inbox Placement Test ID'),
		is_spam: bool.describe(
			'Indicates if the email landed in spam (null if not determined). Only present when record_type is 2 (received).',
		),
		has_category: bool.describe(
			'Indicates if the email was categorized like promotions, social, etc. (null if not determined). Only present when record_type is 2...',
		),
		sender_email: str.describe('Email address of the sender'),
		sender_esp: num.describe(
			'The sender ESP (Email Service Provider). Only present when record_type is 2 (received).; 1 Google, 2 Microsoft, 8 AirMail, 12 Web.de, 13 Libero.it',
		),
		recipient_email: str.describe('Email address of the recipient'),
		recipient_esp: num.describe(
			'The recipient ESP (Email Service Provider); 1 Google, 2 Microsoft, 8 AirMail, 12 Web.de, 13 Libero.it',
		),
		recipient_geo: num.describe(
			'The geographic location of the recipient; 1 United States, 2 Italy, 3 Germany, 4 France',
		),
		recipient_type: num.describe(
			'The type of recipient; 1 Professional, 2 Personal',
		),
		spf_pass: bool.describe(
			'Indicates if the email passed SPF validation. Only present when record_type is 2 (received).',
		),
		dkim_pass: bool.describe(
			'Indicates if the email passed DKIM validation. Only present when record_type is 2 (received).',
		),
		dmarc_pass: bool.describe(
			'Indicates if the email passed DMARC validation. Only present when record_type is 2 (received).',
		),
		smtp_ip_blacklist_report: obj.describe(
			'Blacklist report for the SMTP IP address. Only present when record_type is 2 (received).',
		),
		authentication_failure_results: obj.describe(
			'Details of authentication failures for SPF, DKIM, and DMARC. Only present when record_type is 2 (received).',
		),
		record_type: num.describe(
			'The type of record (sent or received); 1 Sent, 2 Received',
		),
	})
	.loose();

const InboxPlacementAnalyticsGetStatsByTestOutput = z.array(
	z
		.object({
			test_id: str,
			count: num,
			spam_count: num,
			spam_percent: num,
			inbox_count: num,
			inbox_percent: num,
			category_count: num,
			category_percent: num,
		})
		.loose(),
);

const InboxPlacementAnalyticsGetDeliverabilityInsightsOutput = z.array(
	z
		.object({
			test_id: str,
			from: str,
			to: str,
			previous_from: str,
			previous_to: str,
			sender_esp: num.describe(
				'1 Google, 2 Microsoft, 8 AirMail, 12 Web.de, 13 Libero.it',
			),
			recipient_esp: num.describe(
				'1 Google, 2 Microsoft, 8 AirMail, 12 Web.de, 13 Libero.it',
			),
			spam_percentage: num,
			inbox_percentage: num,
			category_percentage: num,
			prev_spam_percentage: num,
			prev_inbox_percentage: num,
			prev_category_percentage: num,
		})
		.loose(),
);

const InboxPlacementAnalyticsGetStatsByDateOutput = z.array(
	z
		.object({
			timestamp_created_date: str,
			sent_count: num,
			received_count: num,
			spam_count: num,
			inbox_count: num,
			category_count: num,
		})
		.loose(),
);

const InboxPlacementReportsListOutput = page(
	z
		.object({
			id: str.describe(
				'Unique identifier for the inbox placement report entry',
			),
			timestamp_created: str.describe(
				'Timestamp when the inbox placement report was created',
			),
			timestamp_created_date: str.describe(
				'Date when the inbox placement report was created',
			),
			organization_id: str.describe('Organization ID'),
			test_id: str.describe('Inbox Placement Test ID'),
			domain_blacklist_count: num.describe(
				'Count of blacklists the domain is listed on',
			),
			domain: str.describe('Domain of the inbox placement report'),
			domain_ip: str.describe('IP address of the domain'),
			domain_ip_blacklist_count: num.describe(
				'Count of blacklists the domain IP is listed on',
			),
			spam_assassin_score: num.describe(
				'SpamAssassin score for the email, indicating spam likelihood',
			),
			spam_assassin_report: obj.describe(
				'Detailed SpamAssassin analysis report',
			),
			blacklist_report: obj.describe(
				'Detailed blacklist report for the domain or IP',
			),
		})
		.loose(),
);

const InboxPlacementReportsGetOutput = z
	.object({
		id: str.describe('Unique identifier for the inbox placement report entry'),
		timestamp_created: str.describe(
			'Timestamp when the inbox placement report was created',
		),
		timestamp_created_date: str.describe(
			'Date when the inbox placement report was created',
		),
		organization_id: str.describe('Organization ID'),
		test_id: str.describe('Inbox Placement Test ID'),
		domain_blacklist_count: num.describe(
			'Count of blacklists the domain is listed on',
		),
		domain: str.describe('Domain of the inbox placement report'),
		domain_ip: str.describe('IP address of the domain'),
		domain_ip_blacklist_count: num.describe(
			'Count of blacklists the domain IP is listed on',
		),
		spam_assassin_score: num.describe(
			'SpamAssassin score for the email, indicating spam likelihood',
		),
		spam_assassin_report: obj.describe('Detailed SpamAssassin analysis report'),
		blacklist_report: obj.describe(
			'Detailed blacklist report for the domain or IP',
		),
	})
	.loose();

const WorkspaceUpdateOutput = z
	.object({
		id: str.describe('Unique identifier for the workspace'),
		timestamp_created: str.describe('Timestamp when the workspace was created'),
		timestamp_updated: str.describe(
			'Timestamp when the workspace was last updated',
		),
		scheduled_for_removal_at: str.describe(
			'Timestamp when this workspace is scheduled to be removed',
		),
		owner: str.describe('User ID of the workspace owner'),
		name: str.describe('Name of the workspace'),
		plan_id: str.describe('Plan ID for workspace'),
		plan_id_bundle: str.describe('Plan ID for workspace bundle'),
		add_unsub_to_block: bool.describe(
			'Whether to add unsubscribes to block list',
		),
		default_opportunity_value: num.describe('Default value for opportunities'),
		plan_id_leadfinder: str.describe('Plan ID for leadfinder'),
		plan_id_verification: obj.describe('Plan ID for verification service'),
		org_logo_url: str.describe('URL to workspace logo'),
		org_client_domain: str.describe(
			'The domain for the white label agency mode',
		),
		plan_id_crm: str.describe('Plan ID for CRM'),
		plan_id_website_visitor: str.describe(
			'Plan ID for website visitor tracking',
		),
		plan_id_inbox_placement: str.describe('Plan ID for inbox placement'),
	})
	.loose();

const WorkspaceScheduleRemovalOutput = z
	.object({
		id: str.describe('Unique identifier for the workspace'),
		timestamp_created: str.describe('Timestamp when the workspace was created'),
		timestamp_updated: str.describe(
			'Timestamp when the workspace was last updated',
		),
		scheduled_for_removal_at: str.describe(
			'Timestamp when this workspace is scheduled to be removed',
		),
		owner: str.describe('User ID of the workspace owner'),
		name: str.describe('Name of the workspace'),
		plan_id: str.describe('Plan ID for workspace'),
		plan_id_bundle: str.describe('Plan ID for workspace bundle'),
		add_unsub_to_block: bool.describe(
			'Whether to add unsubscribes to block list',
		),
		default_opportunity_value: num.describe('Default value for opportunities'),
		plan_id_leadfinder: str.describe('Plan ID for leadfinder'),
		plan_id_verification: obj.describe('Plan ID for verification service'),
		org_logo_url: str.describe('URL to workspace logo'),
		org_client_domain: str.describe(
			'The domain for the white label agency mode',
		),
		plan_id_crm: str.describe('Plan ID for CRM'),
		plan_id_website_visitor: str.describe(
			'Plan ID for website visitor tracking',
		),
		plan_id_inbox_placement: str.describe('Plan ID for inbox placement'),
	})
	.loose();

const WorkspaceCancelRemovalOutput = z
	.object({
		id: str.describe('Unique identifier for the workspace'),
		timestamp_created: str.describe('Timestamp when the workspace was created'),
		timestamp_updated: str.describe(
			'Timestamp when the workspace was last updated',
		),
		scheduled_for_removal_at: str.describe(
			'Timestamp when this workspace is scheduled to be removed',
		),
		owner: str.describe('User ID of the workspace owner'),
		name: str.describe('Name of the workspace'),
		plan_id: str.describe('Plan ID for workspace'),
		plan_id_bundle: str.describe('Plan ID for workspace bundle'),
		add_unsub_to_block: bool.describe(
			'Whether to add unsubscribes to block list',
		),
		default_opportunity_value: num.describe('Default value for opportunities'),
		plan_id_leadfinder: str.describe('Plan ID for leadfinder'),
		plan_id_verification: obj.describe('Plan ID for verification service'),
		org_logo_url: str.describe('URL to workspace logo'),
		org_client_domain: str.describe(
			'The domain for the white label agency mode',
		),
		plan_id_crm: str.describe('Plan ID for CRM'),
		plan_id_website_visitor: str.describe(
			'Plan ID for website visitor tracking',
		),
		plan_id_inbox_placement: str.describe('Plan ID for inbox placement'),
	})
	.loose();

const WorkspaceSetWhitelabelDomainOutput = z
	.object({
		id: str.describe('Unique identifier for the workspace'),
		timestamp_created: str.describe('Timestamp when the workspace was created'),
		timestamp_updated: str.describe(
			'Timestamp when the workspace was last updated',
		),
		scheduled_for_removal_at: str.describe(
			'Timestamp when this workspace is scheduled to be removed',
		),
		owner: str.describe('User ID of the workspace owner'),
		name: str.describe('Name of the workspace'),
		plan_id: str.describe('Plan ID for workspace'),
		plan_id_bundle: str.describe('Plan ID for workspace bundle'),
		add_unsub_to_block: bool.describe(
			'Whether to add unsubscribes to block list',
		),
		default_opportunity_value: num.describe('Default value for opportunities'),
		plan_id_leadfinder: str.describe('Plan ID for leadfinder'),
		plan_id_verification: obj.describe('Plan ID for verification service'),
		org_logo_url: str.describe('URL to workspace logo'),
		org_client_domain: str.describe(
			'The domain for the white label agency mode',
		),
		plan_id_crm: str.describe('Plan ID for CRM'),
		plan_id_website_visitor: str.describe(
			'Plan ID for website visitor tracking',
		),
		plan_id_inbox_placement: str.describe('Plan ID for inbox placement'),
	})
	.loose();

const WorkspaceGetWhitelabelDomainOutput = z
	.object({
		verified: bool.describe('Whether the domain is verified'),
		name: str.describe('The domain name'),
		verification: list,
	})
	.loose();

const WorkspaceDeleteWhitelabelDomainOutput = z
	.object({
		id: str.describe('Unique identifier for the workspace'),
		timestamp_created: str.describe('Timestamp when the workspace was created'),
		timestamp_updated: str.describe(
			'Timestamp when the workspace was last updated',
		),
		scheduled_for_removal_at: str.describe(
			'Timestamp when this workspace is scheduled to be removed',
		),
		owner: str.describe('User ID of the workspace owner'),
		name: str.describe('Name of the workspace'),
		plan_id: str.describe('Plan ID for workspace'),
		plan_id_bundle: str.describe('Plan ID for workspace bundle'),
		add_unsub_to_block: bool.describe(
			'Whether to add unsubscribes to block list',
		),
		default_opportunity_value: num.describe('Default value for opportunities'),
		plan_id_leadfinder: str.describe('Plan ID for leadfinder'),
		plan_id_verification: obj.describe('Plan ID for verification service'),
		org_logo_url: str.describe('URL to workspace logo'),
		org_client_domain: str.describe(
			'The domain for the white label agency mode',
		),
		plan_id_crm: str.describe('Plan ID for CRM'),
		plan_id_website_visitor: str.describe(
			'Plan ID for website visitor tracking',
		),
		plan_id_inbox_placement: str.describe('Plan ID for inbox placement'),
	})
	.loose();

const WorkspaceChangeOwnerOutput = z
	.object({
		id: str.describe('Unique identifier for the workspace'),
		timestamp_created: str.describe('Timestamp when the workspace was created'),
		timestamp_updated: str.describe(
			'Timestamp when the workspace was last updated',
		),
		scheduled_for_removal_at: str.describe(
			'Timestamp when this workspace is scheduled to be removed',
		),
		owner: str.describe('User ID of the workspace owner'),
		name: str.describe('Name of the workspace'),
		plan_id: str.describe('Plan ID for workspace'),
		plan_id_bundle: str.describe('Plan ID for workspace bundle'),
		add_unsub_to_block: bool.describe(
			'Whether to add unsubscribes to block list',
		),
		default_opportunity_value: num.describe('Default value for opportunities'),
		plan_id_leadfinder: str.describe('Plan ID for leadfinder'),
		plan_id_verification: obj.describe('Plan ID for verification service'),
		org_logo_url: str.describe('URL to workspace logo'),
		org_client_domain: str.describe(
			'The domain for the white label agency mode',
		),
		plan_id_crm: str.describe('Plan ID for CRM'),
		plan_id_website_visitor: str.describe(
			'Plan ID for website visitor tracking',
		),
		plan_id_inbox_placement: str.describe('Plan ID for inbox placement'),
	})
	.loose();

const WorkspaceMembersCreateOutput = z
	.object({
		id: str.describe('Unique identifier for the workspace member'),
		email: str.describe('Email address of the workspace member'),
		user_id: str.describe('User ID of the workspace member'),
		user_email: str.describe('Email address of the user'),
		nickname: str.describe(
			'Private workspace member nickname visible only to the workspace owner',
		),
		name: obj,
		picture_url: str.describe(
			'URL of the profile picture the user uploaded, if any. Returned when listing workspace members.',
		),
		role: str.describe(
			'THe role of the workspace member defining their access level. While the "owner" role is listed in the enum, it cannot be created via the...; owner Owner - Full access and workspace management, admin Admin - Full access except workspace deletion, editor Editor - Can edit but not manage workspace settings, view View - Read-only access, clien',
		),
		timestamp_created: str.describe(
			'Timestamp when the workspace member was created',
		),
		workspace_id: str.describe('ID of the workspace this member belongs to'),
		accepted: bool.describe(
			'Whether the member has accepted the workspace invitation',
		),
		issuer_id: str.describe(
			'ID of the user who added this member to the workspace',
		),
		permissions: z.array(z.string()).nullish(),
	})
	.loose();

const WorkspaceMembersListOutput = page(
	z
		.object({
			id: str.describe('Unique identifier for the workspace member'),
			email: str.describe('Email address of the workspace member'),
			user_id: str.describe('User ID of the workspace member'),
			user_email: str.describe('Email address of the user'),
			nickname: str.describe(
				'Private workspace member nickname visible only to the workspace owner',
			),
			name: obj,
			picture_url: str.describe(
				'URL of the profile picture the user uploaded, if any. Returned when listing workspace members.',
			),
			role: str.describe(
				'THe role of the workspace member defining their access level. While the "owner" role is listed in the enum, it cannot be created via the...; owner Owner - Full access and workspace management, admin Admin - Full access except workspace deletion, editor Editor - Can edit but not manage workspace settings, view View - Read-only access, clien',
			),
			timestamp_created: str.describe(
				'Timestamp when the workspace member was created',
			),
			workspace_id: str.describe('ID of the workspace this member belongs to'),
			accepted: bool.describe(
				'Whether the member has accepted the workspace invitation',
			),
			issuer_id: str.describe(
				'ID of the user who added this member to the workspace',
			),
			permissions: z.array(z.string()).nullish(),
		})
		.loose(),
);

const WorkspaceMembersGetOutput = z
	.object({
		id: str.describe('Unique identifier for the workspace member'),
		email: str.describe('Email address of the workspace member'),
		user_id: str.describe('User ID of the workspace member'),
		user_email: str.describe('Email address of the user'),
		nickname: str.describe(
			'Private workspace member nickname visible only to the workspace owner',
		),
		name: obj,
		picture_url: str.describe(
			'URL of the profile picture the user uploaded, if any. Returned when listing workspace members.',
		),
		role: str.describe(
			'THe role of the workspace member defining their access level. While the "owner" role is listed in the enum, it cannot be created via the...; owner Owner - Full access and workspace management, admin Admin - Full access except workspace deletion, editor Editor - Can edit but not manage workspace settings, view View - Read-only access, clien',
		),
		timestamp_created: str.describe(
			'Timestamp when the workspace member was created',
		),
		workspace_id: str.describe('ID of the workspace this member belongs to'),
		accepted: bool.describe(
			'Whether the member has accepted the workspace invitation',
		),
		issuer_id: str.describe(
			'ID of the user who added this member to the workspace',
		),
		permissions: z.array(z.string()).nullish(),
	})
	.loose();

const WorkspaceMembersUpdateOutput = z
	.object({
		id: str.describe('Unique identifier for the workspace member'),
		email: str.describe('Email address of the workspace member'),
		user_id: str.describe('User ID of the workspace member'),
		user_email: str.describe('Email address of the user'),
		nickname: str.describe(
			'Private workspace member nickname visible only to the workspace owner',
		),
		name: obj,
		picture_url: str.describe(
			'URL of the profile picture the user uploaded, if any. Returned when listing workspace members.',
		),
		role: str.describe(
			'THe role of the workspace member defining their access level. While the "owner" role is listed in the enum, it cannot be created via the...; owner Owner - Full access and workspace management, admin Admin - Full access except workspace deletion, editor Editor - Can edit but not manage workspace settings, view View - Read-only access, clien',
		),
		timestamp_created: str.describe(
			'Timestamp when the workspace member was created',
		),
		workspace_id: str.describe('ID of the workspace this member belongs to'),
		accepted: bool.describe(
			'Whether the member has accepted the workspace invitation',
		),
		issuer_id: str.describe(
			'ID of the user who added this member to the workspace',
		),
		permissions: z.array(z.string()).nullish(),
	})
	.loose();

const WorkspaceMembersDeleteOutput = z
	.object({
		id: str.describe('Unique identifier for the workspace member'),
		email: str.describe('Email address of the workspace member'),
		user_id: str.describe('User ID of the workspace member'),
		user_email: str.describe('Email address of the user'),
		nickname: str.describe(
			'Private workspace member nickname visible only to the workspace owner',
		),
		name: obj,
		picture_url: str.describe(
			'URL of the profile picture the user uploaded, if any. Returned when listing workspace members.',
		),
		role: str.describe(
			'THe role of the workspace member defining their access level. While the "owner" role is listed in the enum, it cannot be created via the...; owner Owner - Full access and workspace management, admin Admin - Full access except workspace deletion, editor Editor - Can edit but not manage workspace settings, view View - Read-only access, clien',
		),
		timestamp_created: str.describe(
			'Timestamp when the workspace member was created',
		),
		workspace_id: str.describe('ID of the workspace this member belongs to'),
		accepted: bool.describe(
			'Whether the member has accepted the workspace invitation',
		),
		issuer_id: str.describe(
			'ID of the user who added this member to the workspace',
		),
		permissions: z.array(z.string()).nullish(),
	})
	.loose();

const WorkspaceGroupMembersCreateOutput = z
	.object({
		id: str.describe('The unique identifier of the workspace group member'),
		admin_workspace_id: str.describe('The id of the admin workspace'),
		sub_workspace_id: str.describe('The id of the sub workspace'),
		status: str.describe(
			'pending The member has been invited to the workspace group but has not yet accepted the invitation., accepted The member has accepted the invitation to the workspace group., rejected The member has re',
		),
		timestamp_created: str,
		timestamp_updated: str,
		sub_workspace_name: str.describe('The name of the sub workspace.'),
		admin_workspace_name: str.describe('The name of the admin workspace.'),
	})
	.loose();

const WorkspaceGroupMembersListOutput = page(
	z
		.object({
			id: str.describe('The unique identifier of the workspace group member'),
			admin_workspace_id: str.describe('The id of the admin workspace'),
			sub_workspace_id: str.describe('The id of the sub workspace'),
			status: str.describe(
				'pending The member has been invited to the workspace group but has not yet accepted the invitation., accepted The member has accepted the invitation to the workspace group., rejected The member has re',
			),
			timestamp_created: str,
			timestamp_updated: str,
			sub_workspace_name: str.describe('The name of the sub workspace.'),
			admin_workspace_name: str.describe('The name of the admin workspace.'),
		})
		.loose(),
);

const WorkspaceGroupMembersGetOutput = z
	.object({
		id: str.describe('The unique identifier of the workspace group member'),
		admin_workspace_id: str.describe('The id of the admin workspace'),
		sub_workspace_id: str.describe('The id of the sub workspace'),
		status: str.describe(
			'pending The member has been invited to the workspace group but has not yet accepted the invitation., accepted The member has accepted the invitation to the workspace group., rejected The member has re',
		),
		timestamp_created: str,
		timestamp_updated: str,
		sub_workspace_name: str.describe('The name of the sub workspace.'),
		admin_workspace_name: str.describe('The name of the admin workspace.'),
	})
	.loose();

const WorkspaceGroupMembersDeleteOutput = z
	.object({
		id: str.describe('The unique identifier of the workspace group member'),
		admin_workspace_id: str.describe('The id of the admin workspace'),
		sub_workspace_id: str.describe('The id of the sub workspace'),
		status: str.describe(
			'pending The member has been invited to the workspace group but has not yet accepted the invitation., accepted The member has accepted the invitation to the workspace group., rejected The member has re',
		),
		timestamp_created: str,
		timestamp_updated: str,
		sub_workspace_name: str.describe('The name of the sub workspace.'),
		admin_workspace_name: str.describe('The name of the admin workspace.'),
	})
	.loose();

const WorkspaceGroupMembersGetAdminOutput = z
	.object({
		workspace_name: str.describe(
			'The workspace name of the admin workspace. When the current workspace has no admin workspace, the workspace name will be "Undefined".',
		),
		has_admin_workspace: bool.describe(
			'Whether the current workspace has an admin workspace',
		),
		workspace_group_member_id: str.describe(
			'The id of the workspace group member. You can use it to leave the admin workspace by calling the DELETE /workspace-group-members/:id...',
		),
	})
	.loose();

const BillingGetPlanDetailsOutput = z
	.object({
		organization_id: str.describe('The id of workspace'),
		organization_name: str.describe('The name of workspace'),
		subscriptions: obj,
		addons: obj,
	})
	.loose();

const BillingGetSubscriptionDetailsOutput = z
	.object({
		subscriptions: list,
		all_subs_cancelled: bool.describe(
			'Indicates whether all subscriptions are either already canceled or scheduled to be canceled at the end of their current billing cycles',
		),
	})
	.loose();

const AuditLogsListOutput = page(
	z
		.object({
			id: str,
			timestamp: str.describe('When the activity occurred'),
			organization_id: str.describe(
				'Organization ID associated with the activity',
			),
			activity_type: num.describe(
				'Type of activity performed; 1 User login, 2 Lead deletion, 3 Campaign deletion, 4 Campaign launch, 5 Campaign pause, 6 Account addition, 7 Account deletion, 8 Lead moved, 9 Lead added, 10 Lead merged, 11 Campaign update, 12 Subs',
			),
			user_agent: str.describe(
				'User agent of the client that performed the activity',
			),
			user_id: str.describe('ID of the user who performed the activity'),
			ip_address: str.describe(
				'IP address from which the activity was performed',
			),
			from_api: bool.describe('Whether the activity was performed via API'),
			api_key_id: str.describe(
				'API key ID that performed the activity, when available',
			),
			affected_count: num.describe('Number of items affected by the activity'),
			campaign_id: str.describe('Associated campaign ID if applicable'),
			webhook_id: str.describe('Associated webhook ID if applicable'),
			subsequence_id: str.describe('Associated subsequence ID if applicable'),
			list_id: str.describe('Associated list ID if applicable'),
			audit_metadata: obj.describe('Sanitized metadata about the audit log'),
			user_name: str.describe('Name of the user who performed the activity'),
		})
		.loose(),
);

const BackgroundJobsListOutput = page(
	z
		.object({
			id: str.describe('Unique identifier for the background job'),
			workspace_id: str.describe('Workspace ID'),
			user_id: str.describe(
				'The id of the user that triggered the action that created the job',
			),
			type: str.describe(
				'Type of background job; move-leads Move Leads, import-leads Import Leads, export-leads Export Leads, update-warmup-accounts Update Warmup Accounts, rename-variable Rename Variable, broadcast-ai-generate AI broadcast generati',
			),
			entity_id: str.describe(
				'The id of the entity that the job is related to',
			),
			entity_type: str.describe(
				'Type of entity; list The entity is a lead list, campaign The entity is a campaign, workspace The entity is a workspace, broadcast The entity is an email-marketing broadcast, subscriber-group-sync The entity is a subs',
			),
			data: obj.describe(
				'Data about the job, used to store any additional information we need to process the job',
			),
			progress: num.describe(
				'Progress of the job as a percentage (from 0 to 100)',
			),
			status: str.describe(
				'Job status; pending The background job is waiting in the queue to be processed, in-progress The background job is being processed, success The background job has been successfully processed, failed The background',
			),
			created_at: str.describe('Timestamp when the job was created'),
			updated_at: str.describe('Timestamp when the job was last updated'),
		})
		.loose(),
);

const BackgroundJobsGetOutput = z
	.object({
		id: str.describe('Unique identifier for the background job'),
		workspace_id: str.describe('Workspace ID'),
		user_id: str.describe(
			'The id of the user that triggered the action that created the job',
		),
		type: str.describe(
			'Type of background job; move-leads Move Leads, import-leads Import Leads, export-leads Export Leads, update-warmup-accounts Update Warmup Accounts, rename-variable Rename Variable, broadcast-ai-generate AI broadcast generati',
		),
		entity_id: str.describe('The id of the entity that the job is related to'),
		entity_type: str.describe(
			'Type of entity; list The entity is a lead list, campaign The entity is a campaign, workspace The entity is a workspace, broadcast The entity is an email-marketing broadcast, subscriber-group-sync The entity is a subs',
		),
		data: obj.describe(
			'Data about the job, used to store any additional information we need to process the job',
		),
		progress: num.describe(
			'Progress of the job as a percentage (from 0 to 100)',
		),
		status: str.describe(
			'Job status; pending The background job is waiting in the queue to be processed, in-progress The background job is being processed, success The background job has been successfully processed, failed The background',
		),
		created_at: str.describe('Timestamp when the job was created'),
		updated_at: str.describe('Timestamp when the job was last updated'),
	})
	.loose();

const ApiKeysCreateOutput = z
	.object({
		id: str,
		name: str,
		scopes: z.array(z.string()).nullish(),
		key: str,
		organization_id: str,
		timestamp_created: str,
		timestamp_updated: str,
	})
	.loose();

const ApiKeysListOutput = page(
	z
		.object({
			id: str,
			name: str,
			scopes: z.array(z.string()).nullish(),
			key: str,
			organization_id: str,
			timestamp_created: str,
			timestamp_updated: str,
		})
		.loose(),
);

const ApiKeysDeleteOutput = z
	.object({
		id: str,
		name: str,
		scopes: z.array(z.string()).nullish(),
		key: str,
		organization_id: str,
		timestamp_created: str,
		timestamp_updated: str,
	})
	.loose();

const EmailTemplatesListOutput = page(
	z
		.object({
			id: str,
			name: str,
			body: str,
			organization_id: str,
			timestamp_created: str,
		})
		.loose(),
);

const EmailTemplatesCreateOutput = z
	.object({
		id: str,
		name: str,
		body: str,
		organization_id: str,
		timestamp_created: str,
	})
	.loose();

const EmailTemplatesDeleteOutput = z
	.object({
		id: str,
		name: str,
		body: str,
		organization_id: str,
		timestamp_created: str,
	})
	.loose();

const CustomPromptTemplatesListOutput = page(
	z
		.object({
			id: str,
			workspace_id: str,
			created_by: str,
			name: str,
			category: num.describe(
				'1 Copywriting, 2 Cleaning, 3 Sales, 4 Marketing, 5 Other, 6 Personalization',
			),
			prompt: str,
			is_public: bool,
			description: str,
			// unknown: live responses send an array here.
			properties: untyped,
			template_type: str.describe('custom or public'),
			like_count: num,
			execution_count: num,
			created_by_instantly: bool,
		})
		.loose(),
);

const CustomPromptTemplatesGetOutput = z
	.object({
		id: str,
		workspace_id: str,
		created_by: str,
		name: str,
		category: num.describe(
			'1 Copywriting, 2 Cleaning, 3 Sales, 4 Marketing, 5 Other, 6 Personalization',
		),
		prompt: str,
		is_public: bool,
		description: str,
		// unknown: live responses send an array here.
		properties: untyped,
		template_type: str.describe('custom or public'),
		like_count: num,
		execution_count: num,
		created_by_instantly: bool,
	})
	.loose();

const CustomPromptTemplatesCreateOutput = z
	.object({
		id: str,
		workspace_id: str,
		created_by: str,
		name: str,
		category: num.describe(
			'1 Copywriting, 2 Cleaning, 3 Sales, 4 Marketing, 5 Other, 6 Personalization',
		),
		prompt: str,
		is_public: bool,
		description: str,
		// unknown: live responses send an array here.
		properties: untyped,
		template_type: str.describe('custom or public'),
		like_count: num,
		execution_count: num,
		created_by_instantly: bool,
	})
	.loose();

const CustomPromptTemplatesUpdateOutput = z
	.object({
		id: str,
		workspace_id: str,
		created_by: str,
		name: str,
		category: num.describe(
			'1 Copywriting, 2 Cleaning, 3 Sales, 4 Marketing, 5 Other, 6 Personalization',
		),
		prompt: str,
		is_public: bool,
		description: str,
		// unknown: live responses send an array here.
		properties: untyped,
		template_type: str.describe('custom or public'),
		like_count: num,
		execution_count: num,
		created_by_instantly: bool,
	})
	.loose();

const CustomPromptTemplatesDeleteOutput = z
	.object({
		id: str,
		workspace_id: str,
		created_by: str,
		name: str,
		category: num.describe(
			'1 Copywriting, 2 Cleaning, 3 Sales, 4 Marketing, 5 Other, 6 Personalization',
		),
		prompt: str,
		is_public: bool,
		description: str,
		// unknown: live responses send an array here.
		properties: untyped,
		template_type: str.describe('custom or public'),
		like_count: num,
		execution_count: num,
		created_by_instantly: bool,
	})
	.loose();

const CrmActionsListPhoneNumbersOutput = z.array(
	z
		.object({
			id: str.describe('Unique identifier of the phone number record.'),
			timestamp_created: str.describe(
				'Timestamp when the phone number record was created.',
			),
			organization_id: str.describe(
				'Identifier of the organization that owns this phone number.',
			),
			phone_number: str.describe(
				'The phone number in international E.164 format.',
			),
			country: str.describe(
				'Country code where the phone number is registered.',
			),
			locality: str.describe(
				'City or region associated with the phone number.',
			),
			subscription_id: str.describe(
				'Billing subscription ID linked to this phone number.',
			),
			twilio_sid: str.describe('Twilio resource SID for the phone number.'),
			renewal_date: str.describe(
				'Next renewal date for the phone number subscription.',
			),
			price: num.describe('Monthly price for this phone number (USD).'),
		})
		.loose(),
);

const CrmActionsDeletePhoneNumberOutput = z
	.object({
		cleanup_pending: bool.describe(
			'Whether deletion cleanup is still pending after removal from the workspace.',
		),
		id: str.describe('Unique identifier of the deleted phone number record.'),
		timestamp_created: str.describe(
			'Timestamp when the deleted record was originally created.',
		),
		organization_id: str.describe(
			'Identifier of the organization that owned the phone number.',
		),
		phone_number: str.describe('The deleted phone number.'),
		country: str.describe('Country code of the deleted phone number.'),
		locality: str.describe(
			'Region or city associated with the deleted phone number.',
		),
		subscription_id: str.describe(
			'Billing subscription ID associated with this number (if any).',
		),
		twilio_sid: str.describe('Twilio SID of the deleted number.'),
	})
	.loose();

const EngageItemsListOutput = page(
	z
		.object({
			resource_id: str.describe('Original Postgres entity ID'),
			type: str.describe(
				'The type of Engage item: ai_agent, campaign, automation, broadcast, or journey',
			),
			workspace_id: str.describe('Workspace ID that owns this item'),
			name: str.describe('Display name of the item'),
			status: str.describe('Status of the outreach item'),
			metadata: obj.describe('Additional metadata for the outreach item'),
			timestamp_created: str.describe('Creation timestamp'),
			timestamp_updated: str.describe('Last update timestamp'),
			tags: list,
		})
		.loose(),
);

const EngageItemsDeleteManyOutput = z
	.object({
		deleted_ids: z.array(z.string()).nullish(),
		failed: list,
	})
	.loose();

const DomainForwardingGetOutput = z
	.object({
		domain: str.describe('The domain the forwarding configuration applies to'),
		forwarding_domain: str.describe(
			'Destination domain visitors are forwarded to. Null when no forwarding is configured.',
		),
		forwarding_mode: str.describe(
			'How the forwarding domain is applied. Null when no forwarding is configured.; redirect Visitors are redirected and the browser URL changes to the forwarding domain, stealth Visitors stay on this domain while the content is proxied from the forwarding domain',
		),
	})
	.loose();

const DomainForwardingSetOutput = z
	.object({
		domain: str.describe('The domain the forwarding configuration applies to'),
		forwarding_domain: str.describe(
			'Destination domain visitors are forwarded to. Null when no forwarding is configured.',
		),
		forwarding_mode: str.describe(
			'How the forwarding domain is applied. Null when no forwarding is configured.; redirect Visitors are redirected and the browser URL changes to the forwarding domain, stealth Visitors stay on this domain while the content is proxied from the forwarding domain',
		),
	})
	.loose();

const DomainForwardingRemoveOutput = z
	.object({
		domain: str.describe('The domain the forwarding configuration applies to'),
		forwarding_domain: str.describe(
			'Destination domain visitors are forwarded to. Null when no forwarding is configured.',
		),
		forwarding_mode: str.describe(
			'How the forwarding domain is applied. Null when no forwarding is configured.; redirect Visitors are redirected and the browser URL changes to the forwarding domain, stealth Visitors stay on this domain while the content is proxied from the forwarding domain',
		),
	})
	.loose();

export const InstantlyExtendedInputSchemas = {
	accountsCreate: AccountsCreateInput,
	accountsUpdate: AccountsUpdateInput,
	accountsDelete: AccountsDeleteInput,
	accountsGetDailyAnalytics: AccountsGetDailyAnalyticsInput,
	accountsPauseMany: AccountsPauseManyInput,
	accountsMarkFixed: AccountsMarkFixedInput,
	accountsGetTrackingDomainStatus: AccountsGetTrackingDomainStatusInput,
	accountsTestVitals: AccountsTestVitalsInput,
	accountsMoveToWorkspace: AccountsMoveToWorkspaceInput,
	accountsListCampaigns: AccountsListCampaignsInput,
	campaignsDelete: CampaignsDeleteInput,
	campaignsSearchByLead: CampaignsSearchByLeadInput,
	campaignsGetDailyAnalytics: CampaignsGetDailyAnalyticsInput,
	campaignsShare: CampaignsShareInput,
	campaignsCreateFromShared: CampaignsCreateFromSharedInput,
	campaignsExport: CampaignsExportInput,
	campaignsDuplicate: CampaignsDuplicateInput,
	campaignsCountLaunched: CampaignsCountLaunchedInput,
	campaignsAddVariables: CampaignsAddVariablesInput,
	campaignsGetSendingStatus: CampaignsGetSendingStatusInput,
	subsequencesCreate: SubsequencesCreateInput,
	subsequencesList: SubsequencesListInput,
	subsequencesGet: SubsequencesGetInput,
	subsequencesUpdate: SubsequencesUpdateInput,
	subsequencesDelete: SubsequencesDeleteInput,
	subsequencesDuplicate: SubsequencesDuplicateInput,
	subsequencesPause: SubsequencesPauseInput,
	subsequencesResume: SubsequencesResumeInput,
	subsequencesGetAnalytics: SubsequencesGetAnalyticsInput,
	subsequencesGetStepAnalytics: SubsequencesGetStepAnalyticsInput,
	subsequencesGetSendingStatus: SubsequencesGetSendingStatusInput,
	leadsDeleteMany: LeadsDeleteManyInput,
	leadsMerge: LeadsMergeInput,
	leadsRemoveFromSubsequence: LeadsRemoveFromSubsequenceInput,
	leadsAssign: LeadsAssignInput,
	leadsMove: LeadsMoveInput,
	leadsMoveToSubsequence: LeadsMoveToSubsequenceInput,
	leadListsGet: LeadListsGetInput,
	leadListsUpdate: LeadListsUpdateInput,
	leadListsDelete: LeadListsDeleteInput,
	leadListsGetVerificationStats: LeadListsGetVerificationStatsInput,
	leadLabelsCreate: LeadLabelsCreateInput,
	leadLabelsList: LeadLabelsListInput,
	leadLabelsGet: LeadLabelsGetInput,
	leadLabelsUpdate: LeadLabelsUpdateInput,
	leadLabelsDelete: LeadLabelsDeleteInput,
	leadLabelsTestAiReplyLabel: LeadLabelsTestAiReplyLabelInput,
	customTagsCreate: CustomTagsCreateInput,
	customTagsList: CustomTagsListInput,
	customTagsGet: CustomTagsGetInput,
	customTagsUpdate: CustomTagsUpdateInput,
	customTagsDelete: CustomTagsDeleteInput,
	customTagsToggleResource: CustomTagsToggleResourceInput,
	customTagMappingsList: CustomTagMappingsListInput,
	emailsSendTest: EmailsSendTestInput,
	emailsForward: EmailsForwardInput,
	emailsUpdate: EmailsUpdateInput,
	emailsDelete: EmailsDeleteInput,
	emailVerificationVerify: EmailVerificationVerifyInput,
	emailVerificationGetStatus: EmailVerificationGetStatusInput,
	blocklistGet: BlocklistGetInput,
	blocklistUpdate: BlocklistUpdateInput,
	blocklistDeleteAll: BlocklistDeleteAllInput,
	blocklistAddMany: BlocklistAddManyInput,
	blocklistRemoveMany: BlocklistRemoveManyInput,
	blocklistDownloadCsv: BlocklistDownloadCsvInput,
	webhooksGet: WebhooksGetInput,
	webhooksUpdate: WebhooksUpdateInput,
	webhooksTest: WebhooksTestInput,
	webhooksResume: WebhooksResumeInput,
	webhookEventsList: WebhookEventsListInput,
	webhookEventsGet: WebhookEventsGetInput,
	webhookEventsGetSummary: WebhookEventsGetSummaryInput,
	webhookEventsGetSummaryByDate: WebhookEventsGetSummaryByDateInput,
	inboxPlacementTestsCreate: InboxPlacementTestsCreateInput,
	inboxPlacementTestsList: InboxPlacementTestsListInput,
	inboxPlacementTestsGet: InboxPlacementTestsGetInput,
	inboxPlacementTestsUpdate: InboxPlacementTestsUpdateInput,
	inboxPlacementTestsDelete: InboxPlacementTestsDeleteInput,
	inboxPlacementTestsListEspOptions: InboxPlacementTestsListEspOptionsInput,
	inboxPlacementAnalyticsList: InboxPlacementAnalyticsListInput,
	inboxPlacementAnalyticsGet: InboxPlacementAnalyticsGetInput,
	inboxPlacementAnalyticsGetStatsByTest:
		InboxPlacementAnalyticsGetStatsByTestInput,
	inboxPlacementAnalyticsGetDeliverabilityInsights:
		InboxPlacementAnalyticsGetDeliverabilityInsightsInput,
	inboxPlacementAnalyticsGetStatsByDate:
		InboxPlacementAnalyticsGetStatsByDateInput,
	inboxPlacementReportsList: InboxPlacementReportsListInput,
	inboxPlacementReportsGet: InboxPlacementReportsGetInput,
	workspaceUpdate: WorkspaceUpdateInput,
	workspaceScheduleRemoval: WorkspaceScheduleRemovalInput,
	workspaceCancelRemoval: WorkspaceCancelRemovalInput,
	workspaceSetWhitelabelDomain: WorkspaceSetWhitelabelDomainInput,
	workspaceGetWhitelabelDomain: WorkspaceGetWhitelabelDomainInput,
	workspaceDeleteWhitelabelDomain: WorkspaceDeleteWhitelabelDomainInput,
	workspaceChangeOwner: WorkspaceChangeOwnerInput,
	workspaceMembersCreate: WorkspaceMembersCreateInput,
	workspaceMembersList: WorkspaceMembersListInput,
	workspaceMembersGet: WorkspaceMembersGetInput,
	workspaceMembersUpdate: WorkspaceMembersUpdateInput,
	workspaceMembersDelete: WorkspaceMembersDeleteInput,
	workspaceGroupMembersCreate: WorkspaceGroupMembersCreateInput,
	workspaceGroupMembersList: WorkspaceGroupMembersListInput,
	workspaceGroupMembersGet: WorkspaceGroupMembersGetInput,
	workspaceGroupMembersDelete: WorkspaceGroupMembersDeleteInput,
	workspaceGroupMembersGetAdmin: WorkspaceGroupMembersGetAdminInput,
	billingGetPlanDetails: BillingGetPlanDetailsInput,
	billingGetSubscriptionDetails: BillingGetSubscriptionDetailsInput,
	auditLogsList: AuditLogsListInput,
	backgroundJobsList: BackgroundJobsListInput,
	backgroundJobsGet: BackgroundJobsGetInput,
	apiKeysCreate: ApiKeysCreateInput,
	apiKeysList: ApiKeysListInput,
	apiKeysDelete: ApiKeysDeleteInput,
	emailTemplatesList: EmailTemplatesListInput,
	emailTemplatesCreate: EmailTemplatesCreateInput,
	emailTemplatesDelete: EmailTemplatesDeleteInput,
	customPromptTemplatesList: CustomPromptTemplatesListInput,
	customPromptTemplatesGet: CustomPromptTemplatesGetInput,
	customPromptTemplatesCreate: CustomPromptTemplatesCreateInput,
	customPromptTemplatesUpdate: CustomPromptTemplatesUpdateInput,
	customPromptTemplatesDelete: CustomPromptTemplatesDeleteInput,
	crmActionsListPhoneNumbers: CrmActionsListPhoneNumbersInput,
	crmActionsDeletePhoneNumber: CrmActionsDeletePhoneNumberInput,
	engageItemsList: EngageItemsListInput,
	engageItemsDeleteMany: EngageItemsDeleteManyInput,
	domainForwardingGet: DomainForwardingGetInput,
	domainForwardingSet: DomainForwardingSetInput,
	domainForwardingRemove: DomainForwardingRemoveInput,
} as const;

export const InstantlyExtendedOutputSchemas = {
	accountsCreate: write(AccountsCreateOutput),
	accountsUpdate: write(AccountsUpdateOutput),
	accountsDelete: write(AccountsDeleteOutput),
	accountsGetDailyAnalytics: AccountsGetDailyAnalyticsOutput,
	accountsPauseMany: write(AccountsPauseManyOutput),
	accountsMarkFixed: write(AccountsMarkFixedOutput),
	accountsGetTrackingDomainStatus: AccountsGetTrackingDomainStatusOutput,
	accountsTestVitals: AccountsTestVitalsOutput,
	accountsMoveToWorkspace: write(AccountsMoveToWorkspaceOutput),
	accountsListCampaigns: AccountsListCampaignsOutput,
	campaignsDelete: write(CampaignsDeleteOutput),
	campaignsSearchByLead: CampaignsSearchByLeadOutput,
	campaignsGetDailyAnalytics: CampaignsGetDailyAnalyticsOutput,
	campaignsShare: write(CampaignsShareOutput),
	campaignsCreateFromShared: write(CampaignsCreateFromSharedOutput),
	campaignsExport: CampaignsExportOutput,
	campaignsDuplicate: write(CampaignsDuplicateOutput),
	campaignsCountLaunched: CampaignsCountLaunchedOutput,
	campaignsAddVariables: write(CampaignsAddVariablesOutput),
	campaignsGetSendingStatus: CampaignsGetSendingStatusOutput,
	subsequencesCreate: write(SubsequencesCreateOutput),
	subsequencesList: SubsequencesListOutput,
	subsequencesGet: SubsequencesGetOutput,
	subsequencesUpdate: write(SubsequencesUpdateOutput),
	subsequencesDelete: write(SubsequencesDeleteOutput),
	subsequencesDuplicate: write(SubsequencesDuplicateOutput),
	subsequencesPause: write(SubsequencesPauseOutput),
	subsequencesResume: write(SubsequencesResumeOutput),
	subsequencesGetAnalytics: SubsequencesGetAnalyticsOutput,
	subsequencesGetStepAnalytics: SubsequencesGetStepAnalyticsOutput,
	subsequencesGetSendingStatus: SubsequencesGetSendingStatusOutput,
	leadsDeleteMany: write(LeadsDeleteManyOutput),
	leadsMerge: write(LeadsMergeOutput),
	leadsRemoveFromSubsequence: write(LeadsRemoveFromSubsequenceOutput),
	leadsAssign: write(LeadsAssignOutput),
	leadsMove: write(LeadsMoveOutput),
	leadsMoveToSubsequence: write(LeadsMoveToSubsequenceOutput),
	leadListsGet: LeadListsGetOutput,
	leadListsUpdate: write(LeadListsUpdateOutput),
	leadListsDelete: write(LeadListsDeleteOutput),
	leadListsGetVerificationStats: LeadListsGetVerificationStatsOutput,
	leadLabelsCreate: write(LeadLabelsCreateOutput),
	leadLabelsList: LeadLabelsListOutput,
	leadLabelsGet: LeadLabelsGetOutput,
	leadLabelsUpdate: write(LeadLabelsUpdateOutput),
	leadLabelsDelete: write(LeadLabelsDeleteOutput),
	leadLabelsTestAiReplyLabel: LeadLabelsTestAiReplyLabelOutput,
	customTagsCreate: write(CustomTagsCreateOutput),
	customTagsList: CustomTagsListOutput,
	customTagsGet: CustomTagsGetOutput,
	customTagsUpdate: write(CustomTagsUpdateOutput),
	customTagsDelete: write(CustomTagsDeleteOutput),
	customTagsToggleResource: write(CustomTagsToggleResourceOutput),
	customTagMappingsList: CustomTagMappingsListOutput,
	emailsSendTest: write(EmailsSendTestOutput),
	emailsForward: write(EmailsForwardOutput),
	emailsUpdate: write(EmailsUpdateOutput),
	emailsDelete: write(EmailsDeleteOutput),
	emailVerificationVerify: write(EmailVerificationVerifyOutput),
	emailVerificationGetStatus: EmailVerificationGetStatusOutput,
	blocklistGet: BlocklistGetOutput,
	blocklistUpdate: write(BlocklistUpdateOutput),
	blocklistDeleteAll: write(BlocklistDeleteAllOutput),
	blocklistAddMany: write(BlocklistAddManyOutput),
	blocklistRemoveMany: write(BlocklistRemoveManyOutput),
	blocklistDownloadCsv: BlocklistDownloadCsvOutput,
	webhooksGet: WebhooksGetOutput,
	webhooksUpdate: write(WebhooksUpdateOutput),
	webhooksTest: write(WebhooksTestOutput),
	webhooksResume: write(WebhooksResumeOutput),
	webhookEventsList: WebhookEventsListOutput,
	webhookEventsGet: WebhookEventsGetOutput,
	webhookEventsGetSummary: WebhookEventsGetSummaryOutput,
	webhookEventsGetSummaryByDate: WebhookEventsGetSummaryByDateOutput,
	inboxPlacementTestsCreate: write(InboxPlacementTestsCreateOutput),
	inboxPlacementTestsList: InboxPlacementTestsListOutput,
	inboxPlacementTestsGet: InboxPlacementTestsGetOutput,
	inboxPlacementTestsUpdate: write(InboxPlacementTestsUpdateOutput),
	inboxPlacementTestsDelete: write(InboxPlacementTestsDeleteOutput),
	inboxPlacementTestsListEspOptions: InboxPlacementTestsListEspOptionsOutput,
	inboxPlacementAnalyticsList: InboxPlacementAnalyticsListOutput,
	inboxPlacementAnalyticsGet: InboxPlacementAnalyticsGetOutput,
	inboxPlacementAnalyticsGetStatsByTest:
		InboxPlacementAnalyticsGetStatsByTestOutput,
	inboxPlacementAnalyticsGetDeliverabilityInsights:
		InboxPlacementAnalyticsGetDeliverabilityInsightsOutput,
	inboxPlacementAnalyticsGetStatsByDate:
		InboxPlacementAnalyticsGetStatsByDateOutput,
	inboxPlacementReportsList: InboxPlacementReportsListOutput,
	inboxPlacementReportsGet: InboxPlacementReportsGetOutput,
	workspaceUpdate: write(WorkspaceUpdateOutput),
	workspaceScheduleRemoval: write(WorkspaceScheduleRemovalOutput),
	workspaceCancelRemoval: write(WorkspaceCancelRemovalOutput),
	workspaceSetWhitelabelDomain: write(WorkspaceSetWhitelabelDomainOutput),
	workspaceGetWhitelabelDomain: WorkspaceGetWhitelabelDomainOutput,
	workspaceDeleteWhitelabelDomain: write(WorkspaceDeleteWhitelabelDomainOutput),
	workspaceChangeOwner: write(WorkspaceChangeOwnerOutput),
	workspaceMembersCreate: write(WorkspaceMembersCreateOutput),
	workspaceMembersList: WorkspaceMembersListOutput,
	workspaceMembersGet: WorkspaceMembersGetOutput,
	workspaceMembersUpdate: write(WorkspaceMembersUpdateOutput),
	workspaceMembersDelete: write(WorkspaceMembersDeleteOutput),
	workspaceGroupMembersCreate: write(WorkspaceGroupMembersCreateOutput),
	workspaceGroupMembersList: WorkspaceGroupMembersListOutput,
	workspaceGroupMembersGet: WorkspaceGroupMembersGetOutput,
	workspaceGroupMembersDelete: write(WorkspaceGroupMembersDeleteOutput),
	workspaceGroupMembersGetAdmin: WorkspaceGroupMembersGetAdminOutput,
	billingGetPlanDetails: BillingGetPlanDetailsOutput,
	billingGetSubscriptionDetails: BillingGetSubscriptionDetailsOutput,
	auditLogsList: AuditLogsListOutput,
	backgroundJobsList: BackgroundJobsListOutput,
	backgroundJobsGet: BackgroundJobsGetOutput,
	apiKeysCreate: write(ApiKeysCreateOutput),
	apiKeysList: ApiKeysListOutput,
	apiKeysDelete: write(ApiKeysDeleteOutput),
	emailTemplatesList: EmailTemplatesListOutput,
	emailTemplatesCreate: write(EmailTemplatesCreateOutput),
	emailTemplatesDelete: write(EmailTemplatesDeleteOutput),
	customPromptTemplatesList: CustomPromptTemplatesListOutput,
	customPromptTemplatesGet: CustomPromptTemplatesGetOutput,
	customPromptTemplatesCreate: write(CustomPromptTemplatesCreateOutput),
	customPromptTemplatesUpdate: write(CustomPromptTemplatesUpdateOutput),
	customPromptTemplatesDelete: write(CustomPromptTemplatesDeleteOutput),
	crmActionsListPhoneNumbers: CrmActionsListPhoneNumbersOutput,
	crmActionsDeletePhoneNumber: write(CrmActionsDeletePhoneNumberOutput),
	engageItemsList: EngageItemsListOutput,
	engageItemsDeleteMany: write(EngageItemsDeleteManyOutput),
	domainForwardingGet: DomainForwardingGetOutput,
	domainForwardingSet: write(DomainForwardingSetOutput),
	domainForwardingRemove: write(DomainForwardingRemoveOutput),
} as const;

export const INSTANTLY_EXTENDED_WRITE_OPERATIONS = [
	'accountsCreate',
	'accountsUpdate',
	'accountsDelete',
	'accountsPauseMany',
	'accountsMarkFixed',
	'accountsMoveToWorkspace',
	'campaignsDelete',
	'campaignsShare',
	'campaignsCreateFromShared',
	'campaignsDuplicate',
	'campaignsAddVariables',
	'subsequencesCreate',
	'subsequencesUpdate',
	'subsequencesDelete',
	'subsequencesDuplicate',
	'subsequencesPause',
	'subsequencesResume',
	'leadsDeleteMany',
	'leadsMerge',
	'leadsRemoveFromSubsequence',
	'leadsAssign',
	'leadsMove',
	'leadsMoveToSubsequence',
	'leadListsUpdate',
	'leadListsDelete',
	'leadLabelsCreate',
	'leadLabelsUpdate',
	'leadLabelsDelete',
	'customTagsCreate',
	'customTagsUpdate',
	'customTagsDelete',
	'customTagsToggleResource',
	'emailsSendTest',
	'emailsForward',
	'emailsUpdate',
	'emailsDelete',
	'emailVerificationVerify',
	'blocklistUpdate',
	'blocklistDeleteAll',
	'blocklistAddMany',
	'blocklistRemoveMany',
	'webhooksUpdate',
	'webhooksTest',
	'webhooksResume',
	'inboxPlacementTestsCreate',
	'inboxPlacementTestsUpdate',
	'inboxPlacementTestsDelete',
	'workspaceUpdate',
	'workspaceScheduleRemoval',
	'workspaceCancelRemoval',
	'workspaceSetWhitelabelDomain',
	'workspaceDeleteWhitelabelDomain',
	'workspaceChangeOwner',
	'workspaceMembersCreate',
	'workspaceMembersUpdate',
	'workspaceMembersDelete',
	'workspaceGroupMembersCreate',
	'workspaceGroupMembersDelete',
	'apiKeysCreate',
	'apiKeysDelete',
	'emailTemplatesCreate',
	'emailTemplatesDelete',
	'customPromptTemplatesCreate',
	'customPromptTemplatesUpdate',
	'customPromptTemplatesDelete',
	'crmActionsDeletePhoneNumber',
	'engageItemsDeleteMany',
	'domainForwardingSet',
	'domainForwardingRemove',
] as const;
