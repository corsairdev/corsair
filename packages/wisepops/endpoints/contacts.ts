import { logEventFromContext } from 'corsair/core';
import type { WisepopsEndpoints } from '..';
import { makeWisepopsRequest } from '../client';
import type { WisepopsEndpointOutputs } from './types';
import {
	WisepopsEndpointInputSchemas,
	WisepopsEndpointOutputSchemas,
} from './types';

export const get: WisepopsEndpoints['contactsGet'] = async (ctx, input) => {
	const validatedInput = WisepopsEndpointInputSchemas.contactsGet.parse(input);
	const response = await makeWisepopsRequest<
		WisepopsEndpointOutputs['contactsGet']
	>('api2/contacts', ctx.key, { method: 'GET', query: validatedInput });

	await logEventFromContext(
		ctx,
		'wisepops.contacts.get',
		{ ...validatedInput },
		'completed',
	);
	return WisepopsEndpointOutputSchemas.contactsGet.parse(response);
};
