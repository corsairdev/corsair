import { logEventFromContext } from 'corsair/core';
import type { CoinmarketcalEndpoints } from '..';
import { makeCoinmarketcalRequest } from '../client';
import type { CoinmarketcalEndpointOutputs } from './types';

export const list: CoinmarketcalEndpoints['coinsList'] = async (ctx, input) => {
	const response = await makeCoinmarketcalRequest<
		CoinmarketcalEndpointOutputs['coinsList']
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

export const get: CoinmarketcalEndpoints['coinsGet'] = async (ctx, input) => {
	const response = await makeCoinmarketcalRequest<
		CoinmarketcalEndpointOutputs['coinsGet']
	>(`/v2/coins/${encodeURIComponent(input.symbol)}`, ctx.key, {
		method: 'GET',
	});

	await logEventFromContext(
		ctx,
		'coinmarketcal.coins.get',
		{ symbol: input.symbol },
		'completed',
	);

	return response;
};
