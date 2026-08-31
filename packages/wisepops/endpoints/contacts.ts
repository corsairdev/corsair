import { logEventFromContext } from 'corsair/core';
import type { WisepopsEndpoints } from '..';
import { makeWisepopsRequest } from '../client';
import type { WisepopsEndpointOutputs } from './types';

export const get: WisepopsEndpoints['contactsGet'] = async (ctx, input) => {
	const response = await makeWisepopsRequest<
		WisepopsEndpointOutputs['contactsGet']
	>('api2/contacts', ctx.key, { method: 'GET', query: input });

	await logEventFromContext(
		ctx,
		'wisepops.contacts.get',
		{ ...input },
		'completed',
	);
	return response;
};
