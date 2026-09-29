import { createEndpoint } from './factory';

// ─── Ad Squads ────────────────────────────────────────────────────────────────
export const listAdSquadsEndpoint = createEndpoint('listAdSquads', {
	path: (input) => `/campaigns/${String(input.campaign_id)}/adsquads`,
});

export const getAdSquadEndpoint = createEndpoint('getAdSquad', {
	path: (input) => `/adsquads/${String(input.ad_squad_id)}`,
});

export const createAdSquadEndpoint = createEndpoint('createAdSquad', {
	method: 'POST',
	path: (input) => `/campaigns/${String(input.campaign_id)}/adsquads`,
	body: (input) => ({ adsquads: input.adsquads }),
});

export const updateAdSquadEndpoint = createEndpoint('updateAdSquad', {
	method: 'PUT',
	path: (input) => `/campaigns/${String(input.campaign_id)}/adsquads`,
	body: (input) => ({ adsquads: input.adsquads }),
});

export const deleteAdsquadsEndpoint = createEndpoint('deleteAdsquads', {
	method: 'DELETE',
	path: (input) => `/adsquads/${String(input.id)}`,
	body: () => undefined,
});

export const getAdSquadStatsEndpoint = createEndpoint('getAdSquadStats', {
	path: (input) => `/adsquads/${String(input.ad_squad_id)}/stats`,
	query: (input) => ({
		fields: input.fields as string | undefined,
		granularity: input.granularity as string | undefined,
		start_time: input.start_time as string | undefined,
		end_time: input.end_time as string | undefined,
	}),
});

export const getAdSquadRestrictionsEndpoint = createEndpoint(
	'getAdSquadRestrictions',
	{
		path: (input) => `/adsquads/${String(input.ad_squad_id)}/ad_restrictions`,
	},
);

export const getAdSquadTargetingEndpoint = createEndpoint(
	'getAdSquadTargeting',
	{
		path: (input) => `/adsquads/${String(input.ad_squad_id)}/targeting`,
	},
);

export const getAdsquadsAudienceSizeV2Endpoint = createEndpoint(
	'getAdsquadsAudienceSizeV2',
	{
		path: (input) => `/adsquads/${String(input.ad_squad_id)}/audience_size`,
	},
);

export const getAdsquadsStatsReportEndpoint = createEndpoint(
	'getAdsquadsStatsReport',
	{
		path: (input) =>
			`/adsquads/${String(input.ad_squad_id)}/stats/${String(input.report_run_id)}`,
	},
);

// ─── Ads ──────────────────────────────────────────────────────────────────────
export const listAdsByAdSquadEndpoint = createEndpoint('listAdsByAdSquad', {
	path: (input) => `/adsquads/${String(input.ad_squad_id)}/ads`,
});

export const listAdsByAccountEndpoint = createEndpoint('listAdsByAccount', {
	path: (input) => `/adaccounts/${String(input.ad_account_id)}/ads`,
});

export const getAdStatsEndpoint = createEndpoint('getAdStats', {
	path: (input) => `/ads/${String(input.ad_id)}/stats`,
	query: (input) => ({
		fields: input.fields as string | undefined,
		granularity: input.granularity as string | undefined,
		start_time: input.start_time as string | undefined,
		end_time: input.end_time as string | undefined,
	}),
});
