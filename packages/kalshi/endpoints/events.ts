import { AuthMissingError, logEventFromContext } from 'corsair/core';
import type { KalshiEndpoints } from '..';
import { makeKalshiRequest } from '../client';
import {
	KalshiEndpointInputSchemas,
	KalshiEndpointOutputSchemas,
} from './types';

export const list: KalshiEndpoints['eventsList'] = async (ctx, input) => {
	const parsed = KalshiEndpointInputSchemas.eventsList.parse(input);
	if (!ctx.key) {
		throw new AuthMissingError('kalshi', 'api_key');
	}
	const response = await makeKalshiRequest('/events', ctx.key, {
		method: 'GET',
		query: parsed,
	});

	await logEventFromContext(
		ctx,
		'kalshi.events.list',
		{ ...parsed },
		'completed',
	);
	return KalshiEndpointOutputSchemas.eventsList.parse(response);
};

export const get: KalshiEndpoints['eventsGet'] = async (ctx, input) => {
	const parsed = KalshiEndpointInputSchemas.eventsGet.parse(input);
	if (!ctx.key) {
		throw new AuthMissingError('kalshi', 'api_key');
	}
	const response = await makeKalshiRequest(
		`/events/${encodeURIComponent(parsed.event_ticker)}`,
		ctx.key,
		{
			method: 'GET',
			query: { with_nested_markets: parsed.with_nested_markets },
		},
	);

	await logEventFromContext(
		ctx,
		'kalshi.events.get',
		{ ...parsed },
		'completed',
	);
	return KalshiEndpointOutputSchemas.eventsGet.parse(response);
};

export const Events = {
	list,
	get,
} as const;
