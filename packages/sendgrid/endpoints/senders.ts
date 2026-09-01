import { logEventFromContext } from 'corsair/core';
import type { SendGridEndpoints } from '..';
import { makeSendGridRequest } from '../client';
import type { SendGridEndpointOutputs } from './types';

export const getAll: SendGridEndpoints['sendersGetAll'] = async (
	ctx,
	input,
) => {
	const query: Record<string, string | number | boolean | undefined> = {};
	if (input.limit) query.limit = input.limit;
	if (input.lastSeenID) query.lastSeenID = input.lastSeenID;
	if (input.id) query.id = input.id;

	const response = await makeSendGridRequest<
		SendGridEndpointOutputs['sendersGetAll']
	>('verified_senders', ctx.key, {
		method: 'GET',
		query,
	});

	await logEventFromContext(
		ctx,
		'sendgrid.senders.getAll',
		{ result_count: response.results.length },
		'completed',
	);
	return response;
};
