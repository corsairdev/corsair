import { logEventFromContext } from 'corsair/core';
import type { CoinmarketcalEndpoints } from '..';
import { makeCoinmarketcalRequest } from '../client';
import type { CoinmarketcalEndpointOutputs } from './types';

export const get: CoinmarketcalEndpoints['exampleGet'] = async (ctx, input) => {
	const response = await makeCoinmarketcalRequest<
		CoinmarketcalEndpointOutputs['exampleGet']
	>('/v2/coins', ctx.key, {
		method: 'GET',
		query: input,
	});

	await logEventFromContext(
		ctx,
		'coinmarketcal.coins.list',
		{ ...input },
		'completed',
	);

	return response;
};
