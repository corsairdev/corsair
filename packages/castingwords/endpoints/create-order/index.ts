import { logEventFromContext } from 'corsair/core';
import { makeCastingwordsRequest } from '../../client';
import type { CastingwordsEndpoints } from '..';
import { CastingwordsEndpointOutputSchemas } from '../types';

export const createOrder: CastingwordsEndpoints['createOrder'] = async (
	ctx,
	input,
) => {
	const response = await makeCastingwordsRequest<unknown>(
		'order_url',
		ctx.key,
		{
			method: 'POST',
			form: {
				url: input.url,
				sku: input.sku,
				test: input.test ? '1' : undefined,
				notes: input.notes,
				name: input.names,
			},
		},
	);
	const parsed = CastingwordsEndpointOutputSchemas.createOrder.parse(response);
	await logEventFromContext(
		ctx,
		'castingwords.create_order',
		{ url: input.url },
		'completed',
	);
	return parsed;
};
