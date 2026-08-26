import { logEventFromContext } from 'corsair/core';
import type { BoxheroEndpoints } from '..';
import { makeBoxheroRequest } from '../client';
import type { BoxheroEndpointOutputs } from './types';

export const listBasic: BoxheroEndpoints['transactionsListBasic'] = async (
	ctx,
	input,
) => {
	const query: Record<string, string | number | undefined> = {};
	if (input?.type) query.type = input.type;
	if (input?.cursor !== undefined) query.cursor = input.cursor;
	if (input?.limit !== undefined) query.limit = input.limit;

	const response = await makeBoxheroRequest<
		BoxheroEndpointOutputs['transactionsListBasic']
	>('/v1/transactions', ctx.key, {
		method: 'GET',
		query,
	});

	await logEventFromContext(
		ctx,
		'boxhero.transactions.listBasic',
		input ?? {},
		'completed',
	);
	return response;
};
