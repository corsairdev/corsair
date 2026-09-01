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
		body: input,
	});

	await logEventFromContext(
		ctx,
		'sendgrid.contacts.addOrUpdate',
		{
			contact_count: input.contacts.length,
			list_count: input.list_ids?.length ?? 0,
		},
		'completed',
	);

	return response;
};
