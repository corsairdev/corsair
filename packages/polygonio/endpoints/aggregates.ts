import type { PolygonioEndpoints } from '..';
import { nextPageRequest, segment } from '../client';
import { call } from './call';
import {
	PolygonioEndpointInputSchemas as Inputs,
	PolygonioEndpointOutputSchemas as Outputs,
} from './types';

/** The custom-bars route, the only one whose answers `bars` pages through. */
const BARS_ROUTE =
	/^\/v2\/aggs\/ticker\/[^/]+\/range\/[^/]+\/[^/]+\/[^/]+\/[^/]+$/;

export const bars: PolygonioEndpoints['bars'] = (ctx, input) =>
	call(
		ctx,
		{ event: 'bars', input: Inputs.bars, output: Outputs.bars },
		input,
		(parsed) => {
			if (parsed.nextUrl !== undefined)
				return nextPageRequest(parsed.nextUrl, BARS_ROUTE);
			const { ticker, multiplier, timespan, from, to, ...query } = parsed;
			// The refinement rejects a call that omits any of these, so reaching the
			// path with one unset would mean the schema and this handler disagreed.
			if (
				ticker === undefined ||
				multiplier === undefined ||
				timespan === undefined ||
				from === undefined ||
				to === undefined
			) {
				throw new Error('bars was parsed without its first-page filters');
			}
			return {
				method: 'GET',
				path: `/v2/aggs/ticker/${segment(ticker)}/range/${segment(multiplier)}/${segment(timespan)}/${segment(from)}/${segment(to)}`,
				query,
			};
		},
		{ log: (_, result) => ({ count: result.results?.length ?? 0 }) },
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
		{ log: (_, result) => ({ count: result.results?.length ?? 0 }) },
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
		({ date, adjusted, include_otc }) => ({
			method: 'GET',
			path: `/v2/aggs/grouped/locale/us/market/stocks/${segment(date)}`,
			query: { adjusted, include_otc },
		}),
		{ log: (_, result) => ({ count: result.results?.length ?? 0 }) },
	);
