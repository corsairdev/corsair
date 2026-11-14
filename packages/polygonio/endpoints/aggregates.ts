import type { PolygonioEndpoints } from '..';
import { segment } from '../client';
import { call, nextPageRequest } from './call';
import {
	PolygonioEndpointInputSchemas as Inputs,
	PolygonioEndpointOutputSchemas as Outputs,
} from './types';

export const bars: PolygonioEndpoints['bars'] = (ctx, input) =>
	call(
		ctx,
		{ event: 'bars', input: Inputs.bars, output: Outputs.bars },
		input,
		({ ticker, multiplier, timespan, from, to, nextUrl, ...query }) =>
			nextPageRequest(nextUrl) ?? {
				method: 'GET',
				path: `/v2/aggs/ticker/${segment(ticker)}/range/${segment(multiplier)}/${segment(timespan)}/${segment(from)}/${segment(to)}`,
				query,
			},
		{ log: (_, result) => ({ count: result.results.length }) },
	);

export const previousDay: PolygonioEndpoints['previousDay'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'previousDay',
			input: Inputs.previousDay,
			output: Outputs.previousDay,
		},
		input,
		({ ticker, adjusted }) => ({
			method: 'GET',
			path: `/v2/aggs/ticker/${segment(ticker)}/prev`,
			query: { adjusted },
		}),
		{ log: (_, result) => ({ count: result.results.length }) },
	);

export const dailySummary: PolygonioEndpoints['dailySummary'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'dailySummary',
			input: Inputs.dailySummary,
			output: Outputs.dailySummary,
		},
		input,
		({ ticker, date, adjusted }) => ({
			method: 'GET',
			path: `/v1/open-close/${segment(ticker)}/${segment(date)}`,
			query: { adjusted },
		}),
		{ log: ({ ticker, date }) => ({ ticker, date }) },
	);

export const marketSummary: PolygonioEndpoints['marketSummary'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'marketSummary',
			input: Inputs.marketSummary,
			output: Outputs.marketSummary,
		},
		input,
		({ date, nextUrl, ...query }) =>
			nextPageRequest(nextUrl) ?? {
				method: 'GET',
				path: `/v2/aggs/grouped/locale/us/market/stocks/${segment(date)}`,
				query,
			},
		{ log: (_, result) => ({ count: result.results.length }) },
	);
