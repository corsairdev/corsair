import { logEventFromContext } from 'corsair/core';
import type { EmeliaEndpoints } from '..';
import { makeEmeliaRestRequest } from '../client';
import type { EmeliaEndpointOutputs } from './types';

// Legacy LinkedIn campaigns (/linkedin/*) — method + path verified per page;
// request detail NOT FOUND in static docs. Delete-contact identifies the
// contact by its LinkedIn URL per docs prose.

export const createCampaign: EmeliaEndpoints['linkedinCreateCampaign'] = async (
	ctx,
	input,
) => {
	const response = await makeEmeliaRestRequest<
		EmeliaEndpointOutputs['linkedinCreateCampaign']
	>('/linkedin/campaigns', ctx.key, {
		method: 'POST',
		body: { name: input.name },
	});

	await logEventFromContext(
		ctx,
		'emelia.linkedin.createCampaign',
		{ name: input.name },
		'completed',
	);
	return response;
};

export const listCampaigns: EmeliaEndpoints['linkedinListCampaigns'] = async (
	ctx,
	input,
) => {
	const response = await makeEmeliaRestRequest<
		EmeliaEndpointOutputs['linkedinListCampaigns']
	>('/linkedin/campaigns', ctx.key, {
		method: 'GET',
		query: {
			page: input?.page,
			limit: input?.limit,
		},
	});

	await logEventFromContext(
		ctx,
		'emelia.linkedin.listCampaigns',
		{ ...input },
		'completed',
	);
	return response;
};

export const deleteContact: EmeliaEndpoints['linkedinDeleteContact'] = async (
	ctx,
	input,
) => {
	const response = await makeEmeliaRestRequest<
		EmeliaEndpointOutputs['linkedinDeleteContact']
	>('/linkedin/campaign/contacts', ctx.key, {
		method: 'DELETE',
		body: { campaignId: input.campaignId, contactUrl: input.contactUrl },
	});

	await logEventFromContext(
		ctx,
		'emelia.linkedin.deleteContact',
		{ campaignId: input.campaignId },
		'completed',
	);
	return response;
};

export const getActivities: EmeliaEndpoints['linkedinGetActivities'] = async (
	ctx,
	input,
) => {
	const response = await makeEmeliaRestRequest<
		EmeliaEndpointOutputs['linkedinGetActivities']
	>(
		`/linkedin/campaigns/${encodeURIComponent(input.campaignId)}/activities`,
		ctx.key,
		{ method: 'GET' },
	);

	await logEventFromContext(
		ctx,
		'emelia.linkedin.getActivities',
		{ campaignId: input.campaignId },
		'completed',
	);
	return response;
};
