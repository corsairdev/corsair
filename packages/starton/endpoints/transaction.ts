import { logEventFromContext } from 'corsair/core';
import type { StartonEndpoints } from '..';
import { encodeStartonPathSegment, makeStartonRequest } from '../client';
import { StartonEndpointOutputSchemas } from './types';

export const get: StartonEndpoints['transactionGet'] = async (ctx, input) => {
	const response = await makeStartonRequest<unknown>(
		`v3/transaction/${encodeStartonPathSegment(input.id)}`,
		ctx.key,
		{ method: 'GET' },
	);
	// Validate the provider payload before returning it as typed data.
	const transaction =
		StartonEndpointOutputSchemas.transactionGet.parse(response);
	await logEventFromContext(
		ctx,
		'starton.transaction.get',
		{ id: input.id, status: transaction.status },
		'completed',
	);
	return transaction;
};
