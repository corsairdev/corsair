import { logEventFromContext } from 'corsair/core';
import type { AppointoEndpoints } from '..';
import { makeAppointoRequest } from '../client';
import type { AppointoEndpointOutputs } from './types';

export const list: AppointoEndpoints['subscriptionsList'] = async (
	ctx,
	input,
) => {
	const query: Record<string, string | undefined> = {};
	if (input?.search_term) query.search_term = input.search_term;

	const response = await makeAppointoRequest<
		AppointoEndpointOutputs['subscriptionsList']
	>('appointment_subscriptions', ctx.key, {
		method: 'GET',
		query,
	});

	await logEventFromContext(
		ctx,
		'appointo.subscriptions.list',
		{ ...input },
		'completed',
	);
	return response;
};
