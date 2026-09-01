import { logEventFromContext } from 'corsair/core';
import type { SendGridEndpoints } from '..';
import { makeSendGridRequest } from '../client';
import type { SendGridEndpointOutputs } from './types';

export const addOrUpdate: SendGridEndpoints['contactsAddOrUpdate'] = async (
	ctx,
	input,
) => {
	const response = await makeSendGridRequest<
		SendGridEndpointOutputs['contactsAddOrUpdate']
	>('marketing/contacts', ctx.key, {
		method: 'PUT',
		body: input as unknown as Record<string, unknown>,
	});

	await logEventFromContext(
		ctx,
		'sendgrid.contacts.addOrUpdate',
		{
			contact_count: input.contacts.length,
			list_ids: input.list_ids,
		},
		'completed',
	);

	return response;
};
