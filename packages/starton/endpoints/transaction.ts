import { logEventFromContext } from 'corsair/core';
import type { StartonEndpoints } from '..';
import { encodeStartonPathSegment, makeStartonRequest } from '../client';
import type { StartonTransaction } from '../schema/database';

export const get: StartonEndpoints['transactionGet'] = async (ctx, input) => {
	const response = await makeStartonRequest<StartonTransaction>(
		`v3/transaction/${encodeStartonPathSegment(input.id)}`,
		ctx.key,
		{ method: 'GET' },
	);
	await logEventFromContext(
		ctx,
		'starton.transaction.get',
		{ id: input.id, status: response.status },
		'completed',
	);
	return response;
};
