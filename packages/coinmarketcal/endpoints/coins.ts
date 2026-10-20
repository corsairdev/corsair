import { logEventFromContext } from 'corsair/core';
import type { CoinmarketcalEndpoints } from '..';
import { makeCoinmarketcalRequest } from '../client';
import { persistCoins } from './persist';
import {
	CoinmarketcalEndpointInputSchemas,
	CoinmarketcalEndpointOutputSchemas,
} from './types';

export const list: CoinmarketcalEndpoints['coinsList'] = async (
	ctx,
	rawInput,
) => {
	const input = CoinmarketcalEndpointInputSchemas.coinsList.parse(rawInput);
	const raw = await makeCoinmarketcalRequest<object>('/v2/coins', ctx.key, {
		method: 'GET',
		query: input,
	});
	const response = CoinmarketcalEndpointOutputSchemas.coinsList.parse(raw);

	await persistCoins(ctx, response.data);

	await logEventFromContext(
		ctx,
		'coinmarketcal.coins.list',
		{ ...input },
		'completed',
	);

	return response;
};

export const get: CoinmarketcalEndpoints['coinsGet'] = async (
	ctx,
	rawInput,
) => {
	const input = CoinmarketcalEndpointInputSchemas.coinsGet.parse(rawInput);
	const raw = await makeCoinmarketcalRequest<object>(
		`/v2/coins/${encodeURIComponent(input.slug)}`,
		ctx.key,
		{
			method: 'GET',
		},
	);
	const response = CoinmarketcalEndpointOutputSchemas.coinsGet.parse(raw);

	await persistCoins(ctx, [response]);

	await logEventFromContext(
		ctx,
		'coinmarketcal.coins.get',
		{ slug: input.slug },
		'completed',
	);

	return response;
};
