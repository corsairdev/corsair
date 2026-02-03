import { logEventFromContext } from '../../utils/events';
import type { HubSpotEndpoints } from '..';
import { makeHubSpotRequest } from '../client';
import type {
	AddContactToListResponse,
	RemoveContactFromListResponse,
} from './types';

export const addContact: HubSpotEndpoints['contactListsAddContact'] = async (
	ctx,
	input,
) => {
	const { listId, ...body } = input;
	const endpoint = `/contacts/v1/lists/${listId}/add`;
	const result = await makeHubSpotRequest<AddContactToListResponse>(
		endpoint,
		ctx.options.token,
		{ method: 'POST', body },
	);

	await logEventFromContext(
		ctx,
		'hubspot.contactLists.addContact',
		{ ...input },
		'completed',
	);
	return result;
};

export const removeContact: HubSpotEndpoints['contactListsRemoveContact'] =
	async (ctx, input) => {
		const { listId, ...body } = input;
		const endpoint = `/contacts/v1/lists/${listId}/remove`;
		const result = await makeHubSpotRequest<RemoveContactFromListResponse>(
			endpoint,
			ctx.options.token,
			{ method: 'POST', body },
		);

		await logEventFromContext(
			ctx,
			'hubspot.contactLists.removeContact',
			{ ...input },
			'completed',
		);
		return result;
	};
