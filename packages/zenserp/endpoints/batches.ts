import { logEventFromContext } from 'corsair/core';
import type { ZenserpEndpoints } from '..';
import { makeZenserpRequest } from '../client';
import { BatchesResponseSchema, ListBatchesInputSchema } from './types';

export const list: ZenserpEndpoints['batchesList'] = async (ctx, rawInput) => {
	const input = ListBatchesInputSchema.parse(rawInput);
	const response = BatchesResponseSchema.parse(
		await makeZenserpRequest<unknown>('/api/v1/batches', ctx.key, input),
	);
	await logEventFromContext(
		ctx,
		'zenserp.batches.list',
		{ page: input.page },
		'completed',
	);
	return response;
};
