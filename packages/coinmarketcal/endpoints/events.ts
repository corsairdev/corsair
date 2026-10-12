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

export const get: CoinmarketcalEndpoints['eventsGet'] = async (ctx, input) => {
	const response = await makeCoinmarketcalRequest<
		CoinmarketcalEndpointOutputs['eventsGet']
	>(`/v2/events/${encodeURIComponent(input.id)}`, ctx.key, {
		method: 'GET',
	});

	await logEventFromContext(
		ctx,
		'coinmarketcal.events.get',
		{ id: input.id },
		'completed',
	);

	return response;
};
