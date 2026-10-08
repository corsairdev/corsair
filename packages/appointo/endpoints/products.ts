import { logEventFromContext } from 'corsair/core';
import type { AppointoEndpoints } from '..';
import { makeAppointoRequest } from '../client';
import type { AppointoEndpointOutputs } from './types';

export const list: AppointoEndpoints['productsList'] = async (ctx, input) => {
	const query: Record<string, string | number | undefined> = {};
	if (input?.limit) query.limit = input.limit;
	if (input?.search_term) query.search_term = input.search_term;
	if (input?.offset) query.offset = input.offset;

	const response = await makeAppointoRequest<
		AppointoEndpointOutputs['productsList']
	>('products', ctx.key, {
		method: 'GET',
		query,
	});

	await logEventFromContext(
		ctx,
		'appointo.products.list',
		{ ...input },
		'completed',
	);
	return response;
};
