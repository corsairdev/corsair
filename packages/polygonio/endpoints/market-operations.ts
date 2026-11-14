import type { PolygonioEndpoints } from '..';
import { nextPageRequest } from '../client';
import { call } from './call';
import {
	PolygonioEndpointInputSchemas as Inputs,
	PolygonioEndpointOutputSchemas as Outputs,
} from './types';

export const status: PolygonioEndpoints['marketStatus'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'market.status',
			input: Inputs.marketStatus,
			output: Outputs.marketStatus,
		},
		input,
		() => ({ method: 'GET', path: '/v1/marketstatus/now' }),
		{ log: (_, result) => ({ market: result.market ?? undefined }) },
	);

/**
 * This route answers a bare array, not the usual envelope, so `shape` wraps it
 * and the output schema validates a list rather than a `results` field.
 */
export const holidays: PolygonioEndpoints['marketHolidays'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'market.holidays',
			input: Inputs.marketHolidays,
			output: Outputs.marketHolidays,
		},
		input,
		() => ({ method: 'GET', path: '/v1/marketstatus/upcoming' }),
		{
			shape: (raw) => ({ holidays: raw }),
			log: (_, result) => ({ count: result.holidays.length }),
		},
	);

export const exchanges: PolygonioEndpoints['exchanges'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'market.exchanges',
			input: Inputs.exchanges,
			output: Outputs.exchanges,
		},
		input,
		({ asset_class, locale, nextUrl }) =>
			(nextUrl === undefined ? undefined : nextPageRequest(nextUrl)) ?? {
				method: 'GET',
				path: '/v3/reference/exchanges',
				query: { asset_class, locale },
			},
		{ log: (_, result) => ({ count: result.results?.length ?? 0 }) },
	);
