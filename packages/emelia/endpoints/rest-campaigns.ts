import { logEventFromContext } from 'corsair/core';
import type { EmeliaEndpoints } from '..';
import { makeEmeliaRestRequest } from '../client';
import type { EmeliaEndpointOutputs } from './types';

// REST: advanced (multichannel) campaigns — docs.emelia.io.
// Method + path verified per endpoint page; request/response detail is
// client-rendered in docs (NOT FOUND), so bodies/outputs stay minimal.

export const create: EmeliaEndpoints['restCreateCampaign'] = async (
	ctx,
	input,
) => {
	const response = await makeEmeliaRestRequest<
		EmeliaEndpointOutputs['restCreateCampaign']
	>('/advanced/campaigns', ctx.key, {
		method: 'POST',
		body: { name: input.name },
	});

	await logEventFromContext(
		ctx,
		'emelia.restCampaigns.create',
		{ name: input.name },
		'completed',
	);
	return response;
};

export const list: EmeliaEndpoints['restListCampaigns'] = async (
	ctx,
	input,
) => {
	const response = await makeEmeliaRestRequest<
		EmeliaEndpointOutputs['restListCampaigns']
	>('/advanced/campaigns', ctx.key, {
		method: 'GET',
		query: {
			page: input?.page,
			limit: input?.limit,
		},
	});

	await logEventFromContext(
		ctx,
		'emelia.restCampaigns.list',
		{ ...input },
		'completed',
	);
	return response;
};

export const getActivities: EmeliaEndpoints['restGetCampaignActivities'] =
	async (ctx, input) => {
		const response = await makeEmeliaRestRequest<
			EmeliaEndpointOutputs['restGetCampaignActivities']
		>(
			`/advanced/campaigns/${encodeURIComponent(input.campaignId)}/activities`,
			ctx.key,
			{
				method: 'GET',
				query: {
					page: input.page,
					limit: input.limit,
				},
			},
		);

		await logEventFromContext(
			ctx,
			'emelia.restCampaigns.getActivities',
			{ campaignId: input.campaignId },
			'completed',
		);
		return response;
	};
