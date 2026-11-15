import { z } from 'zod';

const id = z.string().min(1);
const fields = z.string().min(1).optional();
const cursor = z.string().min(1).optional();
const pageSize = z.number().int().positive().optional();
const listOptions = {
	fields,
	limit: pageSize,
	after: cursor,
	before: cursor,
};
const status = z.enum(['ACTIVE', 'PAUSED', 'DELETED', 'ARCHIVED']);
const budget = z.number().int().nonnegative().max(Number.MAX_SAFE_INTEGER);

// Meta objects have a large, versioned set of optional fields. `passthrough`
// keeps documented forward-compatible response fields while validating IDs.
export const MetaAdsObjectSchema = z
	.object({
		id: z.string(),
		account_id: z.string().optional(),
		name: z.string().nullable().optional(),
		status: z.string().nullable().optional(),
		configured_status: z.string().nullable().optional(),
		effective_status: z.string().nullable().optional(),
	})
	.passthrough();

export const MetaAdsListSchema = z.object({
	data: z.array(MetaAdsObjectSchema),
	paging: z
		.object({
			cursors: z
				.object({ before: z.string().optional(), after: z.string().optional() })
				.optional(),
		})
		.optional(),
});

export const MetaAdsMutationSchema = z
	.object({ id: z.string().optional(), success: z.boolean().optional() })
	.refine((value) => value.id !== undefined || value.success !== undefined);

export const MetaAdsDeleteSchema = z.object({ success: z.boolean() });

export const AccountListInputSchema = z
	.object({
		fields,
		limit: pageSize,
		after: cursor,
		before: cursor,
	})
	.strict();
export const AccountGetInputSchema = z
	.object({ accountId: id, fields })
	.strict();
export const AccountSchema = MetaAdsObjectSchema;

const accountListInput = AccountListInputSchema;
const accountListOutput = MetaAdsListSchema;
const accountGetInput = AccountGetInputSchema;
const accountGetOutput = AccountSchema;

const campaignListInput = z.object({ accountId: id, ...listOptions }).strict();
const campaignGetInput = z.object({ campaignId: id, fields }).strict();
const campaignCreateInput = z
	.object({
		accountId: id,
		name: z.string().min(1),
		objective: z.enum([
			'OUTCOME_AWARENESS',
			'OUTCOME_ENGAGEMENT',
			'OUTCOME_LEADS',
			'OUTCOME_SALES',
			'OUTCOME_TRAFFIC',
			'OUTCOME_APP_PROMOTION',
			'APP_INSTALLS',
			'BRAND_AWARENESS',
			'CONVERSIONS',
			'LEAD_GENERATION',
			'LINK_CLICKS',
			'REACH',
			'VIDEO_VIEWS',
		]),
		specialAdCategories: z.array(
			z.enum([
				'NONE',
				'EMPLOYMENT',
				'HOUSING',
				'CREDIT',
				'ISSUES_ELECTIONS_POLITICS',
				'ONLINE_GAMBLING_AND_GAMING',
				'FINANCIAL_PRODUCTS_SERVICES',
			]),
		),
		status: z.enum(['ACTIVE', 'PAUSED']).optional(),
		dailyBudget: budget.optional(),
		lifetimeBudget: budget.optional(),
		idempotencyKey: z
			.string()
			.regex(/^[A-Za-z0-9_-]{1,128}$/)
			.optional(),
	})
	.strict()
	.refine(
		(value) =>
			!(value.dailyBudget !== undefined && value.lifetimeBudget !== undefined),
	);
const campaignUpdateInput = z
	.object({
		campaignId: id,
		name: z.string().min(1).optional(),
		status: status.optional(),
		dailyBudget: budget.optional(),
		lifetimeBudget: budget.optional(),
		spendCap: budget.optional(),
	})
	.strict()
	.refine((value) => Object.keys(value).some((key) => key !== 'campaignId'));

const adSetListInput = z.object({ accountId: id, ...listOptions }).strict();
const adSetGetInput = z.object({ adSetId: id, fields }).strict();
// `targeting` is a provider-defined JSON object with many nested, versioned keys.
const targeting = z.record(z.string(), z.unknown());
const adSetCreateInput = z
	.object({
		accountId: id,
		campaignId: id,
		name: z.string().min(1),
		optimizationGoal: z.enum([
			'NONE',
			'APP_INSTALLS',
			'AD_RECALL_LIFT',
			'ENGAGED_USERS',
			'EVENT_RESPONSES',
			'IMPRESSIONS',
			'LEAD_GENERATION',
			'QUALITY_LEAD',
			'LINK_CLICKS',
			'OFFSITE_CONVERSIONS',
			'PAGE_LIKES',
			'POST_ENGAGEMENT',
			'QUALITY_CALL',
			'REACH',
			'LANDING_PAGE_VIEWS',
			'VISIT_INSTAGRAM_PROFILE',
			'ENGAGED_PAGE_VIEWS',
			'VALUE',
			'THRUPLAY',
			'DERIVED_EVENTS',
			'APP_INSTALLS_AND_OFFSITE_CONVERSIONS',
			'CONVERSATIONS',
			'IN_APP_VALUE',
			'MESSAGING_PURCHASE_CONVERSION',
			'MESSAGING_DEEP_CONVERSATION_AND_FOLLOW',
			'SUBSCRIBERS',
			'REMINDERS_SET',
			'MEANINGFUL_CALL_ATTEMPT',
			'PROFILE_VISIT',
			'PROFILE_AND_PAGE_ENGAGEMENT',
			'ADVERTISER_SILOED_VALUE',
			'AUTOMATIC_OBJECTIVE',
			'MESSAGING_APPOINTMENT_CONVERSION',
		]),
		billingEvent: z.enum([
			'APP_INSTALLS',
			'CLICKS',
			'IMPRESSIONS',
			'LINK_CLICKS',
			'NONE',
			'OFFER_CLAIMS',
			'PAGE_LIKES',
			'POST_ENGAGEMENT',
			'THRUPLAY',
			'PURCHASE',
			'LISTING_INTERACTION',
		]),
		targeting,
		status: z.enum(['ACTIVE', 'PAUSED']).optional(),
		dailyBudget: budget.optional(),
		lifetimeBudget: budget.optional(),
		startTime: z.string().optional(),
		endTime: z.string().optional(),
		idempotencyKey: z
			.string()
			.regex(/^[A-Za-z0-9_-]{1,128}$/)
			.optional(),
	})
	.strict()
	.refine(
		(value) =>
			!(value.dailyBudget !== undefined && value.lifetimeBudget !== undefined),
	)
	.refine(
		(value) =>
			value.lifetimeBudget === undefined || value.endTime !== undefined,
	);
const adSetUpdateInput = z
	.object({
		adSetId: id,
		name: z.string().min(1).optional(),
		status: status.optional(),
		dailyBudget: budget.optional(),
		lifetimeBudget: budget.optional(),
		endTime: z.string().optional(),
	})
	.strict()
	.refine((value) => Object.keys(value).some((key) => key !== 'adSetId'));

const adListInput = z.object({ accountId: id, ...listOptions }).strict();
const adGetInput = z.object({ adId: id, fields }).strict();
const adCreateInput = z
	.object({
		accountId: id,
		adSetId: id,
		name: z.string().min(1),
		creativeId: id,
		status: z.enum(['ACTIVE', 'PAUSED']).optional(),
		idempotencyKey: z
			.string()
			.regex(/^[A-Za-z0-9_-]{1,128}$/)
			.optional(),
	})
	.strict();
const adUpdateInput = z
	.object({
		adId: id,
		name: z.string().min(1).optional(),
		status: status.optional(),
	})
	.strict()
	.refine((value) => value.name !== undefined || value.status !== undefined);

const creativeListInput = z.object({ accountId: id, ...listOptions }).strict();
const creativeGetInput = z.object({ creativeId: id, fields }).strict();
// This narrow create supports existing Page posts; complex creative specs and media uploads are excluded.
const creativeCreateInput = z
	.object({
		accountId: id,
		name: z.string().min(1).max(100),
		objectStoryId: id,
		idempotencyKey: z
			.string()
			.regex(/^[A-Za-z0-9_-]{1,128}$/)
			.optional(),
	})
	.strict();
const creativeUpdateInput = z
	.object({ creativeId: id, name: z.string().min(1).max(100) })
	.strict();
const creativeDeleteInput = z.object({ creativeId: id }).strict();

const audienceListInput = z.object({ accountId: id, ...listOptions }).strict();
const audienceGetInput = z.object({ audienceId: id, fields }).strict();
const audienceCreateInput = z
	.object({
		accountId: id,
		name: z.string().min(1),
		description: z.string().optional(),
		subtype: z.literal('CUSTOM').default('CUSTOM'),
	})
	.strict();
const audienceUpdateInput = z
	.object({
		audienceId: id,
		name: z.string().min(1).optional(),
		description: z.string().optional(),
	})
	.strict()
	.refine(
		(value) => value.name !== undefined || value.description !== undefined,
	);
const audienceDeleteInput = z.object({ audienceId: id }).strict();

const insightFields = z
	.array(
		z.enum([
			'impressions',
			'reach',
			'frequency',
			'spend',
			'clicks',
			'inline_link_clicks',
			'cpc',
			'cpm',
			'ctr',
			'date_start',
			'date_stop',
			'account_id',
			'campaign_id',
			'adset_id',
			'ad_id',
		]),
	)
	.min(1);
const datePreset = z.enum([
	'today',
	'yesterday',
	'this_month',
	'last_month',
	'this_quarter',
	'maximum',
	'data_maximum',
	'last_3d',
	'last_7d',
	'last_14d',
	'last_28d',
	'last_30d',
	'last_90d',
	'last_week_mon_sun',
	'last_week_sun_sat',
	'last_quarter',
	'last_year',
	'this_week_mon_today',
	'this_week_sun_today',
	'this_year',
]);
const insightsInput = z
	.object({
		accountId: id,
		fields: insightFields,
		datePreset: datePreset.optional(),
		since: z
			.string()
			.regex(/^\d{4}-\d{2}-\d{2}$/)
			.optional(),
		until: z
			.string()
			.regex(/^\d{4}-\d{2}-\d{2}$/)
			.optional(),
		level: z.enum(['account', 'campaign', 'adset', 'ad']).optional(),
		limit: pageSize,
		after: cursor,
	})
	.strict()
	.refine((value) => !(value.datePreset && (value.since || value.until)))
	.refine(
		(value) => (value.since === undefined) === (value.until === undefined),
	);
export const InsightsListSchema = z.object({
	data: z.array(
		z
			.object({
				account_id: z.string().optional(),
				campaign_id: z.string().optional(),
				adset_id: z.string().optional(),
				ad_id: z.string().optional(),
				date_start: z.string().optional(),
				date_stop: z.string().optional(),
				impressions: z.string().optional(),
				reach: z.string().optional(),
				frequency: z.string().optional(),
				spend: z.string().optional(),
				clicks: z.string().optional(),
				inline_link_clicks: z.string().optional(),
				cpc: z.string().optional(),
				cpm: z.string().optional(),
				ctr: z.string().optional(),
			})
			// Insights metrics depend on the requested field set and are extensible in Meta's docs.
			.passthrough(),
	),
	paging: MetaAdsListSchema.shape.paging,
});

export type MetaAdsEndpointInputs = {
	accountsList: z.infer<typeof accountListInput>;
	accountsGet: z.infer<typeof accountGetInput>;
	campaignsList: z.infer<typeof campaignListInput>;
	campaignsGet: z.infer<typeof campaignGetInput>;
	campaignsCreate: z.infer<typeof campaignCreateInput>;
	campaignsUpdate: z.infer<typeof campaignUpdateInput>;
	campaignsDelete: { campaignId: string };
	adSetsList: z.infer<typeof adSetListInput>;
	adSetsGet: z.infer<typeof adSetGetInput>;
	adSetsCreate: z.infer<typeof adSetCreateInput>;
	adSetsUpdate: z.infer<typeof adSetUpdateInput>;
	adSetsDelete: { adSetId: string };
	adsList: z.infer<typeof adListInput>;
	adsGet: z.infer<typeof adGetInput>;
	adsCreate: z.infer<typeof adCreateInput>;
	adsUpdate: z.infer<typeof adUpdateInput>;
	adsDelete: { adId: string };
	creativesList: z.infer<typeof creativeListInput>;
	creativesGet: z.infer<typeof creativeGetInput>;
	creativesCreate: z.infer<typeof creativeCreateInput>;
	creativesUpdate: z.infer<typeof creativeUpdateInput>;
	creativesDelete: z.infer<typeof creativeDeleteInput>;
	audiencesList: z.infer<typeof audienceListInput>;
	audiencesGet: z.infer<typeof audienceGetInput>;
	audiencesCreate: z.infer<typeof audienceCreateInput>;
	audiencesUpdate: z.infer<typeof audienceUpdateInput>;
	audiencesDelete: z.infer<typeof audienceDeleteInput>;
	insightsList: z.infer<typeof insightsInput>;
};

export type MetaAdsEndpointOutputs = {
	accountsList: z.infer<typeof accountListOutput>;
	accountsGet: z.infer<typeof accountGetOutput>;
	campaignsList: z.infer<typeof MetaAdsListSchema>;
	campaignsGet: z.infer<typeof MetaAdsObjectSchema>;
	campaignsCreate: z.infer<typeof MetaAdsMutationSchema>;
	campaignsUpdate: { success: boolean };
	campaignsDelete: z.infer<typeof MetaAdsDeleteSchema>;
	adSetsList: z.infer<typeof MetaAdsListSchema>;
	adSetsGet: z.infer<typeof MetaAdsObjectSchema>;
	adSetsCreate: z.infer<typeof MetaAdsMutationSchema>;
	adSetsUpdate: { success: boolean };
	adSetsDelete: z.infer<typeof MetaAdsDeleteSchema>;
	adsList: z.infer<typeof MetaAdsListSchema>;
	adsGet: z.infer<typeof MetaAdsObjectSchema>;
	adsCreate: z.infer<typeof MetaAdsMutationSchema>;
	adsUpdate: { success: boolean };
	adsDelete: z.infer<typeof MetaAdsDeleteSchema>;
	creativesList: z.infer<typeof MetaAdsListSchema>;
	creativesGet: z.infer<typeof MetaAdsObjectSchema>;
	creativesCreate: z.infer<typeof MetaAdsMutationSchema>;
	audiencesList: z.infer<typeof MetaAdsListSchema>;
	audiencesGet: z.infer<typeof MetaAdsObjectSchema>;
	audiencesCreate: z.infer<typeof MetaAdsMutationSchema>;
	audiencesUpdate: { success: boolean };
	audiencesDelete: z.infer<typeof MetaAdsDeleteSchema>;
	insightsList: z.infer<typeof InsightsListSchema>;
};

export const MetaAdsEndpointInputSchemas = {
	accountsList: accountListInput,
	accountsGet: accountGetInput,
	campaignsList: campaignListInput,
	campaignsGet: campaignGetInput,
	campaignsCreate: campaignCreateInput,
	campaignsUpdate: campaignUpdateInput,
	campaignsDelete: z.object({ campaignId: id }).strict(),
	adSetsList: adSetListInput,
	adSetsGet: adSetGetInput,
	adSetsCreate: adSetCreateInput,
	adSetsUpdate: adSetUpdateInput,
	adSetsDelete: z.object({ adSetId: id }).strict(),
	adsList: adListInput,
	adsGet: adGetInput,
	adsCreate: adCreateInput,
	adsUpdate: adUpdateInput,
	adsDelete: z.object({ adId: id }).strict(),
	creativesList: creativeListInput,
	creativesGet: creativeGetInput,
	creativesCreate: creativeCreateInput,
	creativesUpdate: creativeUpdateInput,
	creativesDelete: creativeDeleteInput,
	audiencesList: audienceListInput,
	audiencesGet: audienceGetInput,
	audiencesCreate: audienceCreateInput,
	audiencesUpdate: audienceUpdateInput,
	audiencesDelete: audienceDeleteInput,
	insightsList: insightsInput,
} as const;

export const MetaAdsEndpointOutputSchemas = {
	accountsList: accountListOutput,
	accountsGet: accountGetOutput,
	campaignsList: MetaAdsListSchema,
	campaignsGet: MetaAdsObjectSchema,
	campaignsCreate: MetaAdsMutationSchema,
	campaignsUpdate: MetaAdsDeleteSchema,
	campaignsDelete: MetaAdsDeleteSchema,
	adSetsList: MetaAdsListSchema,
	adSetsGet: MetaAdsObjectSchema,
	adSetsCreate: MetaAdsMutationSchema,
	adSetsUpdate: MetaAdsDeleteSchema,
	adSetsDelete: MetaAdsDeleteSchema,
	adsList: MetaAdsListSchema,
	adsGet: MetaAdsObjectSchema,
	adsCreate: MetaAdsMutationSchema,
	adsUpdate: MetaAdsDeleteSchema,
	adsDelete: MetaAdsDeleteSchema,
	creativesList: MetaAdsListSchema,
	creativesGet: MetaAdsObjectSchema,
	creativesCreate: MetaAdsMutationSchema,
	creativesUpdate: MetaAdsDeleteSchema,
	creativesDelete: MetaAdsDeleteSchema,
	audiencesList: MetaAdsListSchema,
	audiencesGet: MetaAdsObjectSchema,
	audiencesCreate: MetaAdsMutationSchema,
	audiencesUpdate: MetaAdsDeleteSchema,
	audiencesDelete: MetaAdsDeleteSchema,
	insightsList: InsightsListSchema,
} as const;
