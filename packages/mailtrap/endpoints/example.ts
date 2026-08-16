import { logEventFromContext } from 'corsair/core';
import type { MailtrapEndpoints } from '..';
import { makeMailtrapRequest } from '../client';
import type { MailtrapEndpointOutputs } from './types';

export const get: MailtrapEndpoints['exampleGet'] = async (ctx, input) => {
	const response = await makeMailtrapRequest<
		MailtrapEndpointOutputs['exampleGet']
	>(`example/${input.id}`, ctx.key, { method: 'GET' });

	await logEventFromContext(
		ctx,
		'mailtrap.example.get',
		{ ...input },
		'completed',
	);
	return response;
};
