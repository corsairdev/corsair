import { logEventFromContext } from 'corsair/core';
import type { ZenserpEndpoints } from '..';
import { makeZenserpRequest } from '../client';
import {
	ShoppingProductInputSchema,
	ShoppingProductResponseSchema,
} from './types';

export const getProduct: ZenserpEndpoints['shoppingGetProduct'] = async (
	ctx,
	rawInput,
) => {
	const input = ShoppingProductInputSchema.parse(rawInput);
	const response = ShoppingProductResponseSchema.parse(
		await makeZenserpRequest<unknown>('/api/v1/shopping', ctx.key, {
			product_id: input.productId,
			location: input.location,
			gl: input.gl,
			hl: input.hl,
		}),
	);
	await logEventFromContext(
		ctx,
		'zenserp.shopping.getProduct',
		{ productId: input.productId },
		'completed',
	);
	return response;
};
