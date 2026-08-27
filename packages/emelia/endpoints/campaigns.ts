import { logEventFromContext } from 'corsair/core';
import type { EmeliaEndpoints } from '..';
import { makeEmeliaRequest } from '../client';
import type { EmeliaEndpointOutputs } from './types';

const ALL_CAMPAIGNS_QUERY = `
query all_campaigns($options: JSON) {
	all_campaigns(options: $options) {
		_id
		name
		status
		createdAt
		provider
		useManyProviders
		plannedStart
	}
}
`;

const ADD_CONTACT_TO_CAMPAIGN_MUTATION = `
mutation addContactToCampaignHook($id: ID!, $contact: JSON!) {
	addContactToCampaignHook(id: $id, contact: $contact)
}
`;

const REMOVE_CONTACT_FROM_CAMPAIGN_MUTATION = `
mutation removeOneContactFromCampaign($id: ID!, $email: String!) {
	removeOneContactFromCampaign(id: $id, email: $email)
}
`;

export const list: EmeliaEndpoints['campaignsList'] = async (ctx, input) => {
	const response = await makeEmeliaRequest<
		EmeliaEndpointOutputs['campaignsList']
	>(ALL_CAMPAIGNS_QUERY, ctx.key, {
		options: input?.options,
	});

	await logEventFromContext(
		ctx,
		'emelia.campaigns.list',
		{ ...input },
		'completed',
	);
	return response;
};

export const addContact: EmeliaEndpoints['campaignsAddContact'] = async (
	ctx,
	input,
) => {
	const response = await makeEmeliaRequest<
		EmeliaEndpointOutputs['campaignsAddContact']
	>(ADD_CONTACT_TO_CAMPAIGN_MUTATION, ctx.key, {
		id: input.id,
		contact: input.contact,
	});

	await logEventFromContext(
		ctx,
		'emelia.campaigns.addContact',
		{ id: input.id },
		'completed',
	);
	return response;
};

export const removeContact: EmeliaEndpoints['campaignsRemoveContact'] = async (
	ctx,
	input,
) => {
	const response = await makeEmeliaRequest<
		EmeliaEndpointOutputs['campaignsRemoveContact']
	>(REMOVE_CONTACT_FROM_CAMPAIGN_MUTATION, ctx.key, {
		id: input.id,
		email: input.email,
	});

	await logEventFromContext(
		ctx,
		'emelia.campaigns.removeContact',
		{ id: input.id, email: input.email },
		'completed',
	);
	return response;
};
