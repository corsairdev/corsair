import { logEventFromContext } from 'corsair/core';
import type { CoinmarketcalEndpoints } from '..';
import { makeCoinmarketcalRequest } from '../client';
import type { CoinmarketcalEndpointOutputs } from './types';

export const list: CoinmarketcalEndpoints['eventsList'] = async (
	ctx,
	input,
) => {
	const response = await makeCoinmarketcalRequest<
		CoinmarketcalEndpointOutputs['eventsList']
	>('/v2/events', ctx.key, {
		method: 'GET',
		query: input,
	});

	await logEventFromContext(
		ctx,
		'coinmarketcal.events.list',
		{ ...input },
		'completed',
	);

	return response;
};
