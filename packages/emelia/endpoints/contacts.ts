import { logEventFromContext } from 'corsair/core';
import type { EmeliaEndpoints } from '..';
import { makeEmeliaRequest } from '../client';
import type { EmeliaEndpointOutputs } from './types';

const CONTACT_LISTS_QUERY = `
query contact_lists {
	contact_lists {
		_id
		name
		contactCount
		fields
		usedInCampaign
	}
}
`;

const ADD_CONTACTS_TO_LIST_MUTATION = `
mutation addContactsToListHook($id: ID!, $contact: JSON!) {
	addContactsToListHook(id: $id, contact: $contact)
}
`;

export const listLists: EmeliaEndpoints['contactsListLists'] = async (
	ctx,
	input,
) => {
	const response = await makeEmeliaRequest<
		EmeliaEndpointOutputs['contactsListLists']
	>(CONTACT_LISTS_QUERY, ctx.key);

	await logEventFromContext(
		ctx,
		'emelia.contacts.listLists',
		{ ...input },
		'completed',
	);
	return response;
};

export const addToList: EmeliaEndpoints['contactsAddToList'] = async (
	ctx,
	input,
) => {
	const response = await makeEmeliaRequest<
		EmeliaEndpointOutputs['contactsAddToList']
	>(ADD_CONTACTS_TO_LIST_MUTATION, ctx.key, {
		id: input.id,
		contact: input.contact,
	});

	await logEventFromContext(
		ctx,
		'emelia.contacts.addToList',
		{ id: input.id },
		'completed',
	);
	return response;
};
