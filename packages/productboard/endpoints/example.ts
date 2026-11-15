import { logEventFromContext } from 'corsair/core';
import type { ProductboardEndpoints } from '..';
import type { ProductboardEndpointOutputs } from './types';
import { makeProductboardRequest } from '../client';

export const get: ProductboardEndpoints['exampleGet'] = async (ctx, input) => {
	const response = await makeProductboardRequest<ProductboardEndpointOutputs['exampleGet']>(
		`example/${input.id}`,
		ctx.key,
		{ method: 'GET' },
	);

	await logEventFromContext(ctx, 'productboard.example.get', { ...input }, 'completed');
	return response;
};
