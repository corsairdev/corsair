import { z } from 'zod';

// Inputs use Woodpecker's own parameter names; a comma-separated query
// parameter is an array here. Outputs are `.loose()` and their documented
// fields nullish, so a field Woodpecker adds or omits cannot fail a call that
// has already happened. Field reference: https://developers.woodpecker.co/docs

const CampaignIdSchema = z.number().int().positive();

export const WOODPECKERCO_CAMPAIGN_STATUSES = [
	'RUNNING',
	'DRAFT',
	'EDITED',
	'PAUSED',
	'STOPPED',
	'COMPLETED',
] as const;

const CampaignStatusSchema = z.enum(WOODPECKERCO_CAMPAIGN_STATUSES);

// ── campaigns.list ────────────────────────────────────────────────────────

const CampaignsListInputSchema = z.object({
	status: z
		.array(CampaignStatusSchema)
		.min(1)
		.optional()
		.describe('Only campaigns in these statuses.'),
	id: z
		.array(CampaignIdSchema)
		.min(1)
		.optional()
		.describe(
			'Only these campaigns. Exactly one ID also returns its `stats`; several return the plain list.',
		),
});

export type CampaignsListInput = z.infer<typeof CampaignsListInputSchema>;

const CampaignStatsSchema = z
	.object({
		prospects: z.number().nullish(),
		delivery: z.number().nullish(),
		invalid: z.number().nullish(),
		bounced: z.number().nullish(),
		queue: z.number().nullish(),
		sent: z.number().nullish(),
		check: z.number().nullish(),
		autoreplied: z.number().nullish(),
		opened: z.number().nullish(),
		optout: z.number().nullish(),
		clicked: z.number().nullish(),
		replied: z.number().nullish(),
		interested: z.number().nullish(),
		maybe_later: z.number().nullish(),
		not_interested: z.number().nullish(),
		// unknown: per-step objects, passed through as Woodpecker sends them.
		emails: z.array(z.record(z.string(), z.unknown())).nullish(),
	})
	.loose();

export const CampaignSchema = z
	.object({
		id: z.number(),
		name: z.string().nullish(),
		// A string rather than the enum: an unknown status must not fail a read.
		status: z.string().nullish(),
		created: z.string().nullish(),
		from_name: z.string().nullish(),
		from_names: z.array(z.string()).nullish(),
		from_email: z.string().nullish(),
		from_emails: z.array(z.string()).nullish(),
		gdpr_unsubscribe: z.boolean().nullish(),
		folder_name: z.string().nullish(),
		folder_id: z.number().nullish(),
		per_day: z.number().nullish(),
		bcc: z.string().nullish(),
		cc: z.string().nullish(),
		stats: CampaignStatsSchema.nullish(),
		timestamp: z.string().nullish(),
	})
	.loose();

export type WoodpeckerCoCampaign = z.infer<typeof CampaignSchema>;

const CampaignsListResponseSchema = z.object({
	campaigns: z.array(CampaignSchema),
});

export type CampaignsListResponse = z.infer<typeof CampaignsListResponseSchema>;

// ── campaigns.run / pause / stop ──────────────────────────────────────────

const CampaignActionInputSchema = z.object({
	campaign_id: CampaignIdSchema.describe('The campaign to change.'),
});

export type CampaignActionInput = z.infer<typeof CampaignActionInputSchema>;

// Woodpecker answers these three with an empty 200.
const CampaignActionResponseSchema = z.object({
	success: z.literal(true),
	campaign_id: z.number(),
});

export type CampaignActionResponse = z.infer<
	typeof CampaignActionResponseSchema
>;

// ── campaigns.deleteStep ──────────────────────────────────────────────────

const CampaignsDeleteStepInputSchema = z.object({
	campaign_id: CampaignIdSchema.describe(
		'The campaign, in DRAFT or EDITED status.',
	),
	// The campaign payload shows string IDs and the docs' samples use integers.
	step_id: z
		.union([z.string().min(1), z.number().int().positive()])
		.describe(
			"The EMAIL or LINKEDIN step's `id` from the campaign's `steps`. It cannot be the first step after START or a step that has processed prospects.",
		),
});

export type CampaignsDeleteStepInput = z.infer<
	typeof CampaignsDeleteStepInputSchema
>;

const CampaignDetailSchema = z
	.object({
		id: z.number().nullish(),
		name: z.string().nullish(),
		status: z.string().nullish(),
		bounce_shield_autopaused_at: z.string().nullish(),
		email_account_ids: z.array(z.number()).nullish(),
		// unknown: the settings and the recursive step tree are large and change
		// often, so they are passed through as Woodpecker sends them.
		settings: z.record(z.string(), z.unknown()).nullish(),
		steps: z.record(z.string(), z.unknown()).nullish(),
	})
	.loose();

const CampaignsDeleteStepResponseSchema = z.object({
	success: z.literal(true),
	campaign_id: z.number(),
	step_id: z.union([z.string(), z.number()]),
	campaign: CampaignDetailSchema.optional().describe(
		'The campaign as it stands after the deletion.',
	),
});

export type CampaignsDeleteStepResponse = z.infer<
	typeof CampaignsDeleteStepResponseSchema
>;

// ── prospects.addToCampaign ───────────────────────────────────────────────

const snippetFields = {
	snippet1: z.string().optional(),
	snippet2: z.string().optional(),
	snippet3: z.string().optional(),
	snippet4: z.string().optional(),
	snippet5: z.string().optional(),
	snippet6: z.string().optional(),
	snippet7: z.string().optional(),
	snippet8: z.string().optional(),
	snippet9: z.string().optional(),
	snippet10: z.string().optional(),
	snippet11: z.string().optional(),
	snippet12: z.string().optional(),
	snippet13: z.string().optional(),
	snippet14: z.string().optional(),
	snippet15: z.string().optional(),
};

const ProspectInputSchema = z.object({
	// Not z.email(): Woodpecker rejects a bad address per prospect (E_EMAIL)
	// and adds the rest, which a strict check here would prevent.
	email: z.string().min(1),
	status: z
		.enum([
			'ACTIVE',
			'PAUSED',
			'TO-REVIEW',
			'TO-CHECK',
			'BLACKLIST',
			'BOUNCED',
			'INVALID',
			'REPLIED',
		])
		.optional()
		.describe(
			'Defaults to ACTIVE. BLACKLIST, BOUNCED, INVALID and REPLIED need `force`.',
		),
	first_name: z.string().optional(),
	last_name: z.string().optional(),
	company: z.string().optional(),
	website: z.string().optional(),
	linkedin_url: z.string().optional(),
	tags: z
		.string()
		.optional()
		.describe('Tags start with # and are separated by a space.'),
	title: z.string().optional(),
	phone: z.string().optional(),
	address: z.string().optional(),
	city: z.string().optional(),
	state: z.string().optional(),
	country: z.string().optional(),
	industry: z.string().optional(),
	...snippetFields,
});

export type WoodpeckerCoProspectInput = z.infer<typeof ProspectInputSchema>;

const ProspectsAddToCampaignInputSchema = z.object({
	campaign: z.object({
		campaign_id: CampaignIdSchema,
		send_after: z
			.string()
			.optional()
			.describe(
				'The earliest time prospects can be contacted, such as 2025-04-01T00:01:01-0000. Woodpecker says to write + in the time zone as %2B. Sent unchanged.',
			),
	}),
	force: z
		.boolean()
		.optional()
		.describe(
			'Add prospects whose global status is not ACTIVE. Use with caution: they may be contacted again even after replying elsewhere or opting out.',
		),
	file_name: z
		.string()
		.optional()
		.describe('Name of the import batch, shown in the imported column.'),
	prospects: z.array(ProspectInputSchema).min(1).max(20_000),
});

export type ProspectsAddToCampaignInput = z.infer<
	typeof ProspectsAddToCampaignInputSchema
>;

// status, code and msg are set on an entry that was not added.
const ProspectResultSchema = z
	.object({
		email: z.string().nullish(),
		id: z.number().nullish(),
		prospect: z.string().nullish(),
		prospect_campaign: z.string().nullish(),
		status: z.string().nullish(),
		code: z.string().nullish(),
		msg: z.string().nullish(),
	})
	.loose();

const StatusSchema = z
	.object({
		status: z.string().nullish(),
		code: z.string().nullish(),
		msg: z.string().nullish(),
	})
	.loose();

const ProspectsAddToCampaignResponseSchema = z
	.object({
		prospects: z.array(ProspectResultSchema).default([]),
		status: StatusSchema.nullish(),
	})
	.loose();

export type ProspectsAddToCampaignResponse = z.infer<
	typeof ProspectsAddToCampaignResponseSchema
>;

// ── prospects.listInCampaigns ─────────────────────────────────────────────

export const WOODPECKERCO_DEFAULT_PER_PAGE = 100;

const ProspectsListInCampaignsInputSchema = z.object({
	campaigns_id: z
		.array(CampaignIdSchema)
		.min(1)
		.describe('The campaigns to read prospects from.'),
	id: z
		.array(z.number().int().positive())
		.min(1)
		.optional()
		.describe('Only these prospects.'),
	status: z
		.enum([
			'ACTIVE',
			'BOUNCED',
			'TO-CHECK',
			'TO-REVIEW',
			'REPLIED',
			'AUTOREPLIED',
			'BLACKLIST',
			'PAUSED',
			'INVALID',
		])
		.optional()
		.describe("The prospect's status in the campaign."),
	contacted: z.boolean().optional(),
	interested: z
		.enum(['INTERESTED', 'MAYBE-LATER', 'NOT-INTERESTED', 'NOT-MARKED'])
		.optional(),
	activity: z
		.enum(['OPENED', 'NOT-OPENED', 'CLICKED', 'NOT-CLICKED'])
		.optional(),
	diff: z
		.string()
		.optional()
		.describe(
			'Only prospects with an activity timestamp after this date, such as 2025-01-15T00:00:00+0200. The + is percent-encoded for you.',
		),
	sort: z
		.string()
		.optional()
		.describe(
			'Fields with + (ascending) or - (descending), comma-separated, such as +company,-last_contacted.',
		),
	page: z.number().int().positive().optional().describe('1-based page.'),
	per_page: z
		.number()
		.int()
		.positive()
		.max(1000)
		.optional()
		.describe(`Defaults to ${WOODPECKERCO_DEFAULT_PER_PAGE}.`),
});

export type ProspectsListInCampaignsInput = z.infer<
	typeof ProspectsListInCampaignsInputSchema
>;

// id and email are optional because the docs disagree on the row: the example
// is flat, while the field table nests it under `prospect`. `.loose()` keeps
// the row either way, along with snippet1-15 and legacy snipet1-4.
export const ProspectSchema = z
	.object({
		id: z.number().nullish(),
		email: z.string().nullish(),
		first_name: z.string().nullish(),
		last_name: z.string().nullish(),
		company: z.string().nullish(),
		organization_id: z.number().nullish(),
		industry: z.string().nullish(),
		website: z.string().nullish(),
		linkedin_url: z.string().nullish(),
		tags: z.string().nullish(),
		title: z.string().nullish(),
		phone: z.string().nullish(),
		address: z.string().nullish(),
		city: z.string().nullish(),
		state: z.string().nullish(),
		country: z.string().nullish(),
		last_contacted: z.string().nullish(),
		// Woodpecker's spelling, with a space.
		'last replied': z.string().nullish(),
		updated: z.string().nullish(),
		encrypted: z.boolean().nullish(),
		// unknown: label to snippet value.
		snippet_labels: z.record(z.string(), z.unknown()).nullish(),
		status: z.string().nullish(),
		interested: z.string().nullish(),
		interest_level: z
			.object({
				level: z.string().nullish(),
				ai_detected: z.boolean().nullish(),
			})
			.loose()
			.nullish(),
		campaign_id: z.number().nullish(),
		campaign_name: z.string().nullish(),
		campaign_email: z.string().nullish(),
		campaign_emails: z.array(z.string()).nullish(),
		followup_after: z.string().nullish(),
		campaign_status: z.string().nullish(),
		sent_mails: z.number().nullish(),
		last_open: z.string().nullish(),
		last_clicked: z.string().nullish(),
		click_url: z.string().nullish(),
	})
	.loose();

export type WoodpeckerCoProspect = z.infer<typeof ProspectSchema>;

/** What the API sends: an array, or a 200 `{ message }` when nothing matches. */
export const ProspectsRawResponseSchema = z.union([
	z.array(ProspectSchema),
	z.object({ message: z.string() }).loose(),
]);

const ProspectsListInCampaignsResponseSchema = z.object({
	prospects: z.array(ProspectSchema),
	page: z.number(),
	per_page: z.number(),
	next_page: z
		.number()
		.nullable()
		.describe(
			'The next page while this one is full; null once a page comes back short. A full last page leads to one empty page.',
		),
	message: z
		.string()
		.optional()
		.describe("Woodpecker's note when nothing matched."),
});

export type ProspectsListInCampaignsResponse = z.infer<
	typeof ProspectsListInCampaignsResponseSchema
>;

// ── webhooks.listEvents ───────────────────────────────────────────────────

const WebhooksListEventsInputSchema = z.object({});

export type WebhooksListEventsInput = z.infer<
	typeof WebhooksListEventsInputSchema
>;

const WebhookEventSchema = z.object({
	event: z.string(),
	description: z.string(),
	docs_url: z.string(),
});

export type WoodpeckerCoWebhookEvent = z.infer<typeof WebhookEventSchema>;

const WebhooksListEventsResponseSchema = z.object({
	events: z.array(WebhookEventSchema),
});

export type WebhooksListEventsResponse = z.infer<
	typeof WebhooksListEventsResponseSchema
>;

// ── Registry ──────────────────────────────────────────────────────────────

export type WoodpeckerCoEndpointInputs = {
	campaignsList: CampaignsListInput;
	campaignsRun: CampaignActionInput;
	campaignsPause: CampaignActionInput;
	campaignsStop: CampaignActionInput;
	campaignsDeleteStep: CampaignsDeleteStepInput;
	prospectsAddToCampaign: ProspectsAddToCampaignInput;
	prospectsListInCampaigns: ProspectsListInCampaignsInput;
	webhooksListEvents: WebhooksListEventsInput;
};

export type WoodpeckerCoEndpointOutputs = {
	campaignsList: CampaignsListResponse;
	campaignsRun: CampaignActionResponse;
	campaignsPause: CampaignActionResponse;
	campaignsStop: CampaignActionResponse;
	campaignsDeleteStep: CampaignsDeleteStepResponse;
	prospectsAddToCampaign: ProspectsAddToCampaignResponse;
	prospectsListInCampaigns: ProspectsListInCampaignsResponse;
	webhooksListEvents: WebhooksListEventsResponse;
};

export const WoodpeckerCoEndpointInputSchemas = {
	campaignsList: CampaignsListInputSchema,
	campaignsRun: CampaignActionInputSchema,
	campaignsPause: CampaignActionInputSchema,
	campaignsStop: CampaignActionInputSchema,
	campaignsDeleteStep: CampaignsDeleteStepInputSchema,
	prospectsAddToCampaign: ProspectsAddToCampaignInputSchema,
	prospectsListInCampaigns: ProspectsListInCampaignsInputSchema,
	webhooksListEvents: WebhooksListEventsInputSchema,
} as const;

export const WoodpeckerCoEndpointOutputSchemas = {
	campaignsList: CampaignsListResponseSchema,
	campaignsRun: CampaignActionResponseSchema,
	campaignsPause: CampaignActionResponseSchema,
	campaignsStop: CampaignActionResponseSchema,
	campaignsDeleteStep: CampaignsDeleteStepResponseSchema,
	prospectsAddToCampaign: ProspectsAddToCampaignResponseSchema,
	prospectsListInCampaigns: ProspectsListInCampaignsResponseSchema,
	webhooksListEvents: WebhooksListEventsResponseSchema,
} as const;
