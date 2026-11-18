import { logEventFromContext } from 'corsair/core';
import type { CoinmarketcalEndpoints } from '..';
import { makeCoinmarketcalRequest } from '../client';
import { persistCategories } from './persist';
import {
	CoinmarketcalEndpointInputSchemas,
	CoinmarketcalEndpointOutputSchemas,
} from './types';

export const list: CoinmarketcalEndpoints['categoriesList'] = async (
	ctx,
	rawInput,
) => {
	const input =
		CoinmarketcalEndpointInputSchemas.categoriesList.parse(rawInput);
	const raw = await makeCoinmarketcalRequest<object>(
		'/v2/categories',
		ctx.key,
		{
			method: 'GET',
			query: input,
		},
	);
	const response = CoinmarketcalEndpointOutputSchemas.categoriesList.parse(raw);

	await persistCategories(ctx, response.data);

	await logEventFromContext(
		ctx,
		'coinmarketcal.categories.list',
		{ ...input },
		'completed',
	);

	return response;
};
