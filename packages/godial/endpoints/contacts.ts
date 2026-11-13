import { logEventFromContext } from 'corsair/core';
import { makeGoDialRequest } from '../client';
import type { GoDialEndpoints } from '../index';
import {
	GoDialEndpointInputSchemas,
	GoDialEndpointOutputSchemas,
} from './types';

export const add: GoDialEndpoints['contactsAdd'] = async (ctx, input) => {
	const parsedInput = GoDialEndpointInputSchemas.contactsAdd.parse(input);
	const response = await makeGoDialRequest('/meta/api/externals/contact/add', {
		method: 'POST',
		apiKey: ctx.key,
		body: parsedInput,
	});
	const parsedResponse =
		GoDialEndpointOutputSchemas.contactsAdd.parse(response);
	await logEventFromContext(ctx, 'godial.contacts.add', {}, 'completed');
	return parsedResponse;
};
