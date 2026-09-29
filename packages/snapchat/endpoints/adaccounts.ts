import { createEndpoint } from './factory';

// ─── List / Get Ad Accounts ───────────────────────────────────────────────────
export const listAdAccountsEndpoint = createEndpoint('listAdAccounts', {
	path: (input) => `/organizations/${String(input.organization_id)}/adaccounts`,
});

export const getAdAccountEndpoint = createEndpoint('getAdAccount', {
	path: (input) => `/adaccounts/${String(input.ad_account_id)}`,
});

export const createAdAccountEndpoint = createEndpoint('createAdAccount', {
	method: 'POST',
	path: (input) => `/organizations/${String(input.organization_id)}/adaccounts`,
	body: (input) => ({ adaccounts: input.adaccounts }),
});

export const updateAdAccountEndpoint = createEndpoint('updateAdAccount', {
	method: 'PUT',
	path: (input) => `/organizations/${String(input.organization_id)}/adaccounts`,
	body: (input) => ({ adaccounts: input.adaccounts }),
});

// ─── Account Roles ────────────────────────────────────────────────────────────
export const createAccountRoleEndpoint = createEndpoint('createAccountRole', {
	method: 'POST',
	path: (input) => `/adaccounts/${String(input.ad_account_id)}/roles`,
	body: (input) => ({ roles: input.roles }),
});

export const listAccountRolesEndpoint = createEndpoint('listAccountRoles', {
	path: (input) => `/adaccounts/${String(input.ad_account_id)}/roles`,
});

// ─── Ad Account Ad Squads (listing) ──────────────────────────────────────────
export const getAdaccountsAdsquadsEndpoint = createEndpoint(
	'getAdaccountsAdsquads',
	{
		path: (input) => `/adaccounts/${String(input.ad_account_id)}/adsquads`,
	},
);

export const getAdaccountsAdSquadUiRenderDataEndpoint = createEndpoint(
	'getAdaccountsAdSquadUiRenderData',
	{
		path: (input) =>
			`/adaccounts/${String(input.ad_account_id)}/adsquads/ui_data`,
	},
);

// ─── Dynamic Templates ────────────────────────────────────────────────────────
export const getAdaccountsDynamicTemplatesEndpoint = createEndpoint(
	'getAdaccountsDynamicTemplates',
	{
		path: (input) =>
			`/adaccounts/${String(input.ad_account_id)}/dynamic_templates`,
	},
);

export const createAdaccountsDynamicTemplatesEndpoint = createEndpoint(
	'createAdaccountsDynamicTemplates',
	{
		method: 'POST',
		path: (input) =>
			`/adaccounts/${String(input.adaccount_id)}/dynamic_templates`,
		body: (input) => ({ dynamic_templates: input.dynamic_templates }),
	},
);

// ─── Event Details ─────────────────────────────────────────────────────────────
export const getAdaccountsEventDetailsEndpoint = createEndpoint(
	'getAdaccountsEventDetails',
	{
		path: (input) => `/adaccounts/${String(input.ad_account_id)}/event_details`,
	},
);

export const createAdaccountsEventDetailsEndpoint = createEndpoint(
	'createAdaccountsEventDetails',
	{
		method: 'POST',
		path: (input) => `/adaccounts/${String(input.ad_account_id)}/event_details`,
		body: (input) => ({ event_details: input.event_details }),
	},
);

// ─── Interaction Zones ────────────────────────────────────────────────────────
export const getAdaccountsInteractionZonesEndpoint = createEndpoint(
	'getAdaccountsInteractionZones',
	{
		path: (input) =>
			`/adaccounts/${String(input.ad_account_id)}/interaction_zones`,
	},
);

export const createAdaccountsInteractionZonesEndpoint = createEndpoint(
	'createAdaccountsInteractionZones',
	{
		method: 'POST',
		path: (input) =>
			`/adaccounts/${String(input.ad_account_id)}/interaction_zones`,
		body: (input) => ({ interaction_zones: input.interaction_zones }),
	},
);

export const getInteractionZoneEndpoint = createEndpoint('getInteractionZone', {
	path: (input) => `/interaction_zones/${String(input.interaction_zone_id)}`,
});

// ─── Leads Report ─────────────────────────────────────────────────────────────
export const getAdaccountsLeadsReportEndpoint = createEndpoint(
	'getAdaccountsLeadsReport',
	{
		path: (input) =>
			`/adaccounts/${String(input.id)}/leads/${String(input.report_run_id)}`,
	},
);

// ─── Mobile Apps (adaccount) ──────────────────────────────────────────────────
export const getAdaccountsMobileAppsEndpoint = createEndpoint(
	'getAdaccountsMobileApps',
	{
		path: (input) => `/adaccounts/${String(input.ad_account_id)}/mobile_apps`,
	},
);

// ─── Offer Disclaimers ────────────────────────────────────────────────────────
export const getAdaccountsOfferDisclaimersEndpoint = createEndpoint(
	'getAdaccountsOfferDisclaimers',
	{
		path: (input) =>
			`/adaccounts/${String(input.ad_account_id)}/offer_disclaimers`,
	},
);

export const createAdaccountsOfferDisclaimersEndpoint = createEndpoint(
	'createAdaccountsOfferDisclaimers',
	{
		method: 'POST',
		path: (input) => `/adaccounts/${String(input.id)}/offer_disclaimers`,
		body: (input) => ({ offer_disclaimers: input.offer_disclaimers }),
	},
);

export const deleteAdaccountsOfferDisclaimersEndpoint = createEndpoint(
	'deleteAdaccountsOfferDisclaimers',
	{
		method: 'DELETE',
		path: (input) =>
			`/adaccounts/${String(input.ad_account_id)}/offer_disclaimers/${String(input.offer_disclaimer_id)}`,
		body: () => undefined,
	},
);

// ─── Spend Guidance ───────────────────────────────────────────────────────────
export const getAdaccountsSpendGuidanceEndpoint = createEndpoint(
	'getAdaccountsSpendGuidance',
	{
		path: (input) =>
			`/adaccounts/${String(input.ad_account_id)}/spend_guidance`,
	},
);

// ─── Stats Report ─────────────────────────────────────────────────────────────
export const getAdaccountsStatsReportEndpoint = createEndpoint(
	'getAdaccountsStatsReport',
	{
		path: (input) =>
			`/adaccounts/${String(input.ad_account_id)}/stats/${String(input.report_run_id)}`,
	},
);

// ─── Targeting Insights ───────────────────────────────────────────────────────
export const createAdaccountsTargetingInsightsEndpoint = createEndpoint(
	'createAdaccountsTargetingInsights',
	{
		method: 'POST',
		path: (input) => `/adaccounts/${String(input.id)}/targeting_insights`,
		body: (input) => ({
			base_spec: input.base_spec,
			targeting_spec: input.targeting_spec,
		}),
	},
);

// ─── Audience Size V2 ─────────────────────────────────────────────────────────
export const createAdaccountsAudienceSizeV2Endpoint = createEndpoint(
	'createAdaccountsAudienceSizeV2',
	{
		method: 'POST',
		path: (input) => `/adaccounts/${String(input.ad_account_id)}/audience_size`,
		body: (input) => ({ targeting: input.targeting }),
	},
);

// ─── Reserved Forecasting ─────────────────────────────────────────────────────
export const createAdaccountsReservedForecastingEndpoint = createEndpoint(
	'createAdaccountsReservedForecasting',
	{
		method: 'POST',
		path: (input) => `/adaccounts/${String(input.id)}/reserved_forecasting`,
		body: (input) => ({
			end_time: input.end_time,
			targeting: input.targeting,
			start_time: input.start_time,
			placement_v2: input.placement_v2,
			optimization_goal: input.optimization_goal,
			delivery_constraint: input.delivery_constraint,
			cap_and_exclusion_config: input.cap_and_exclusion_config,
		}),
	},
);

// ─── Creative Elements ────────────────────────────────────────────────────────
export const createAdaccountsCreativeElementsEndpoint = createEndpoint(
	'createAdaccountsCreativeElements',
	{
		method: 'POST',
		path: (input) => `/adaccounts/${String(input.id)}/creative_elements`,
		body: (input) => ({ creative_elements: input.creative_elements }),
	},
);

// ─── Lead Generation Forms ────────────────────────────────────────────────────
export const getAdAccountsLeadGenerationFormsEndpoint = createEndpoint(
	'getAdAccountsLeadGenerationForms',
	{
		path: (input) =>
			`/adaccounts/${String(input.ad_account_id)}/lead_gen_forms`,
	},
);

// ─── Ad Account Stats ─────────────────────────────────────────────────────────
export const getAdAccountsStatsEndpoint = createEndpoint('getAdAccountsStats', {
	path: (input) => `/adaccounts/${String(input.ad_account_id)}/stats`,
	query: (input) => ({
		fields: input.fields as string | undefined,
		granularity: input.granularity as string | undefined,
		start_time: input.start_time as string | undefined,
		end_time: input.end_time as string | undefined,
	}),
});

// ─── Pixels ───────────────────────────────────────────────────────────────────
export const getPixelsEndpoint = createEndpoint('getPixels', {
	path: (input) => `/adaccounts/${String(input.ad_account_id)}/pixels`,
});

// ─── Invoices ─────────────────────────────────────────────────────────────────
export const listInvoicesEndpoint = createEndpoint('listInvoices', {
	path: (input) => `/adaccounts/${String(input.ad_account_id)}/invoices`,
});

export const getInvoiceEndpoint = createEndpoint('getInvoice', {
	path: (input) =>
		`/adaccounts/${String(input.ad_account_id)}/invoices/${String(input.invoice_id)}`,
});

// ─── Creatives ────────────────────────────────────────────────────────────────
export const listCreativesEndpoint = createEndpoint('listCreatives', {
	path: (input) => `/adaccounts/${String(input.ad_account_id)}/creatives`,
});

// ─── Media ────────────────────────────────────────────────────────────────────
export const listMediaEndpoint = createEndpoint('listMedia', {
	path: (input) => `/adaccounts/${String(input.ad_account_id)}/media`,
});

export const getMediaEndpoint = createEndpoint('getMedia', {
	path: (input) => `/media/${String(input.media_id)}`,
});

export const getMediaByIdsEndpoint = createEndpoint('getMediaByIds', {
	method: 'POST',
	path: (input) => `/adaccounts/${String(input.ad_account_id)}/media/batch`,
	body: (input) => ({ entity_ids: input.entity_ids }),
});

export const createMediaEndpoint = createEndpoint('createMedia', {
	method: 'POST',
	path: (input) => `/adaccounts/${String(input.ad_account_id)}/media`,
	body: (input) => ({ media: input.media }),
});

export const copyMediaEndpoint = createEndpoint('copyMedia', {
	method: 'POST',
	path: (input) =>
		`/adaccounts/${String(input.destination_ad_account_id)}/media/copy`,
	body: (input) => ({ media_copy: input.media_copy }),
});

export const getMediaStatsEndpoint = createEndpoint('getMediaStats', {
	path: (input) => `/media/${String(input.media_id)}/stats`,
	query: (input) => ({
		fields: input.fields as string | undefined,
		granularity: input.granularity as string | undefined,
	}),
});

export const uploadMediaMultipartEndpoint = createEndpoint(
	'uploadMediaMultipart',
	{
		method: 'POST',
		path: (input) => `/media/${String(input.media_id)}/upload`,
		multipart: true,
		body: (input) => input,
	},
);
