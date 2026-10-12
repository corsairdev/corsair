import { logEventFromContext } from 'corsair/core';
import type { CoinmarketcalEndpoints } from '..';
import { makeCoinmarketcalRequest } from '../client';
import { persistCategories } from './persist';
import type { CoinmarketcalEndpointOutputs } from './types';

export const list: CoinmarketcalEndpoints['categoriesList'] = async (
	ctx,
	input,
) => {
	const response = await makeCoinmarketcalRequest<
		CoinmarketcalEndpointOutputs['categoriesList']
	>('/v2/categories', ctx.key, {
		method: 'GET',
		query: input,
	});

	await persistCategories(ctx, response.data);

	await logEventFromContext(
		ctx,
		'coinmarketcal.categories.list',
		{ ...input },
		'completed',
	);

	return response;
};
