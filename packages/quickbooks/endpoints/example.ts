import { logEventFromContext } from 'corsair/core';
import type { QuickBooksEndpoints } from '..';
import type { QuickBooksEndpointOutputs } from './types';
import { makeQuickBooksRequest } from '../client';

export const get: QuickBooksEndpoints['exampleGet'] = async (ctx, input) => {
	const response = await makeQuickBooksRequest<QuickBooksEndpointOutputs['exampleGet']>(
		`example/${input.id}`,
		ctx.key,
		{ method: 'GET' },
	);

	await logEventFromContext(ctx, 'quickbooks.example.get', { ...input }, 'completed');
	return response;
};
