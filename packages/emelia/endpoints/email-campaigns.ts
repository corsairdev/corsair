import { logEventFromContext } from 'corsair/core';
import type { EmeliaEndpoints } from '..';
import { makeEmeliaRestRequest } from '../client';
import type { EmeliaEndpointOutputs } from './types';

// Legacy email campaigns (/emails/campaign/*) — still served per docs.
// Request detail NOT FOUND in static docs; bodies mirror the GraphQL
// mutation arguments (campaign identifier + contact/email).

export const addContact: EmeliaEndpoints['emailAddContact'] = async (
	ctx,
	input,
) => {
	const response = await makeEmeliaRestRequest<
		EmeliaEndpointOutputs['emailAddContact']
	>('/emails/campaign/contacts', ctx.key, {
		method: 'POST',
		body: { campaignId: input.campaignId, contact: input.contact },
	});

	await logEventFromContext(
		ctx,
		'emelia.emailCampaigns.addContact',
		{ campaignId: input.campaignId },
		'completed',
	);
	return response;
};

export const listContacts: EmeliaEndpoints['emailListContacts'] = async (
	ctx,
	input,
) => {
	const response = await makeEmeliaRestRequest<
		EmeliaEndpointOutputs['emailListContacts']
	>('/emails/campaign/contacts', ctx.key, {
		method: 'GET',
		query: {
			campaignId: input?.campaignId,
			page: input?.page,
			limit: input?.limit,
		},
	});

	await logEventFromContext(
		ctx,
		'emelia.emailCampaigns.listContacts',
		{ ...input },
		'completed',
	);
	return response;
};

export const deleteContact: EmeliaEndpoints['emailDeleteContact'] = async (
	ctx,
	input,
) => {
	const response = await makeEmeliaRestRequest<
		EmeliaEndpointOutputs['emailDeleteContact']
	>('/emails/campaign/contacts', ctx.key, {
		method: 'DELETE',
		body: { campaignId: input.campaignId, email: input.email },
	});

	await logEventFromContext(
		ctx,
		'emelia.emailCampaigns.deleteContact',
		// Email omitted: event payloads persist to corsair_events.
		{ campaignId: input.campaignId },
		'completed',
	);
	return response;
};
