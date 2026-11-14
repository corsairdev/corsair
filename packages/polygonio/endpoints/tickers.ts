import type { PolygonioEndpoints } from '..';
import { nextPageRequest, segment } from '../client';
import { call } from './call';
import {
	PolygonioEndpointInputSchemas as Inputs,
	PolygonioEndpointOutputSchemas as Outputs,
} from './types';

export const list: PolygonioEndpoints['tickersList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'tickers.list',
			input: Inputs.tickersList,
			output: Outputs.tickersList,
		},
		input,
		({
			ticker,
			type,
			market,
			exchange,
			cusip,
			cik,
			date,
			search,
			active,
			// The API's own dotted names; a dot cannot be a TS identifier.
			tickerGte,
			tickerGt,
			tickerLte,
			tickerLt,
			order,
			sort,
			limit,
			nextUrl,
		}) =>
			(nextUrl === undefined ? undefined : nextPageRequest(nextUrl)) ?? {
				method: 'GET',
				path: '/v3/reference/tickers',
				query: {
					ticker,
					type,
					market,
					exchange,
					cusip,
					cik,
					date,
					search,
					active,
					'ticker.gte': tickerGte,
					'ticker.gt': tickerGt,
					'ticker.lte': tickerLte,
					'ticker.lt': tickerLt,
					order,
					sort,
					limit,
				},
			},
		{ log: (_, result) => ({ count: result.results?.length ?? 0 }) },
	);

export const overview: PolygonioEndpoints['tickerOverview'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'tickers.overview',
			input: Inputs.tickerOverview,
			output: Outputs.tickerOverview,
		},
		input,
		({ ticker, date }) => ({
			method: 'GET',
			path: `/v3/reference/tickers/${segment(ticker)}`,
			query: { date },
		}),
		{ log: ({ ticker }) => ({ ticker }) },
	);

export const types: PolygonioEndpoints['tickerTypes'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'tickers.types',
			input: Inputs.tickerTypes,
			output: Outputs.tickerTypes,
		},
		input,
		({ asset_class, locale }) => ({
			method: 'GET',
			path: '/v3/reference/tickers/types',
			query: { asset_class, locale },
		}),
		{ log: (_, result) => ({ count: result.results?.length ?? 0 }) },
	);
