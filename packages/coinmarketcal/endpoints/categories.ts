import { logEventFromContext } from 'corsair/core';
import type { CoinmarketcalEndpoints } from '..';
import { makeCoinmarketcalRequest } from '../client';
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

	await logEventFromContext(
		ctx,
		'coinmarketcal.categories.list',
		{ ...input },
		'completed',
	);

	return response;
};
