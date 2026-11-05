import { logEventFromContext } from 'corsair/core';
import type { CoinmarketcalEndpoints } from '..';
import { makeCoinmarketcalRequest } from '../client';
import { persistEvents } from './persist';
import {
	CoinmarketcalEndpointInputSchemas,
	CoinmarketcalEndpointOutputSchemas,
} from './types';

export const list: CoinmarketcalEndpoints['eventsList'] = async (
	ctx,
	rawInput,
) => {
	const input = CoinmarketcalEndpointInputSchemas.eventsList.parse(rawInput);
	const raw = await makeCoinmarketcalRequest<object>('/v2/events', ctx.key, {
		method: 'GET',
		query: input,
	});
	const response = CoinmarketcalEndpointOutputSchemas.eventsList.parse(raw);

	await persistEvents(ctx, response.data);

	await logEventFromContext(
		ctx,
		'coinmarketcal.events.list',
		{ ...input },
		'completed',
	);

	return response;
};

export const get: CoinmarketcalEndpoints['eventsGet'] = async (
	ctx,
	rawInput,
) => {
	const input = CoinmarketcalEndpointInputSchemas.eventsGet.parse(rawInput);
	const raw = await makeCoinmarketcalRequest<object>(
		`/v2/events/${encodeURIComponent(input.id)}`,
		ctx.key,
		{
			method: 'GET',
		},
	);
	const response = CoinmarketcalEndpointOutputSchemas.eventsGet.parse(raw);

	await persistEvents(ctx, [response]);

	await logEventFromContext(
		ctx,
		'coinmarketcal.events.get',
		{ id: input.id },
		'completed',
	);

	return response;
};
