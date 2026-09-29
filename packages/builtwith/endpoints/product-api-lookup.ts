import { logEventFromContext } from 'corsair/core';
import type { BuiltWithEndpoints } from '..';
import { makeBuiltWithRequest } from '../client';
import type { BuiltWithEndpointOutputs } from './types';

export const productApiLookup: BuiltWithEndpoints['productApiLookup'] = async (
	ctx,
	input,
) => {
	const query: Record<string, string | number> = {
		QUERY: input.query,
	};

	if (input.limit !== undefined) query.LIMIT = input.limit;
	if (input.page !== undefined) query.PAGE = input.page;

	const response = await makeBuiltWithRequest<
		BuiltWithEndpointOutputs['productApiLookup']
	>('productv1/api.json', ctx.key, {
		method: 'GET',
		query,
	});

	await logEventFromContext(
		ctx,
		'builtwith.product.api.lookup',
		{ ...input },
		'completed',
	);

	return response;
};
