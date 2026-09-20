import { createEndpoint } from './factory';

// ─── Campaigns ────────────────────────────────────────────────────────────────
export const listCampaignsEndpoint = createEndpoint('listCampaigns', {
	path: (input) => `/adaccounts/${String(input.ad_account_id)}/campaigns`,
});

export const getCampaignEndpoint = createEndpoint('getCampaign', {
	path: (input) => `/campaigns/${String(input.campaign_id)}`,
});

export const createCampaignEndpoint = createEndpoint('createCampaign', {
	method: 'POST',
	path: (input) => `/adaccounts/${String(input.ad_account_id)}/campaigns`,
	body: (input) => ({
		campaigns: [
			{
				name: input.name,
				start_time: input.start_time,
				...(input as Record<string, unknown>),
			},
		],
	}),
});

export const updateCampaignEndpoint = createEndpoint('updateCampaign', {
	method: 'PUT',
	path: (input) => `/adaccounts/${String(input.ad_account_id)}/campaigns`,
	body: (input) => ({
		campaigns: [
			{
				id: input.campaign_id,
				...(input as Record<string, unknown>),
			},
		],
	}),
});

export const deleteCampaignEndpoint = createEndpoint('deleteCampaign', {
	method: 'DELETE',
	path: (input) => `/campaigns/${String(input.campaign_id)}`,
	body: () => undefined,
});

export const getCampaignStatsEndpoint = createEndpoint('getCampaignStats', {
	path: (input) => `/campaigns/${String(input.campaign_id)}/stats`,
	query: (input) => ({
		fields: input.fields as string | undefined,
		granularity: input.granularity as string | undefined,
		start_time: input.start_time as string | undefined,
		end_time: input.end_time as string | undefined,
	}),
});

export const getCampaignChangelogEndpoint = createEndpoint(
	'getCampaignChangelog',
	{
		path: (input) => `/campaigns/${String(input.campaign_id)}/changelog`,
	},
);

export const getCampaignsByIdsEndpoint = createEndpoint('getCampaignsByIds', {
	method: 'POST',
	path: (input) => `/adaccounts/${String(input.ad_account_id)}/campaigns/batch`,
	body: (input) => ({ entity_ids: input.entity_ids }),
});

export const listAdsByCampaignEndpoint = createEndpoint('listAdsByCampaign', {
	path: (input) => `/campaigns/${String(input.campaign_id)}/ads`,
});
