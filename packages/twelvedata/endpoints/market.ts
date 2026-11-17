import type { TwelveDataEndpoints } from '..';
import { call } from './call';
import {
	TwelveDataEndpointInputSchemas,
	TwelveDataEndpointOutputSchemas,
} from './types';

export const quote: TwelveDataEndpoints['quote'] = async (ctx, input) =>
	call(
		ctx,
		{
			event: 'quote',
			operation: 'market.quote',
			input: TwelveDataEndpointInputSchemas.quote,
			output: TwelveDataEndpointOutputSchemas.quote,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: 'quote',
			query: {
				symbol: parsed.symbol,
				exchange: parsed.exchange,
				country: parsed.country,
			},
		}),
		{
			log: (parsed, result) => ({
				symbol: result.symbol ?? parsed.symbol,
				currency: result.currency ?? undefined,
			}),
		},
	);

export const price: TwelveDataEndpoints['price'] = async (ctx, input) =>
	call(
		ctx,
		{
			event: 'price',
			operation: 'market.price',
			input: TwelveDataEndpointInputSchemas.price,
			output: TwelveDataEndpointOutputSchemas.price,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: 'price',
			query: {
				symbol: parsed.symbol,
				exchange: parsed.exchange,
				country: parsed.country,
			},
		}),
		{ log: (parsed) => ({ symbol: parsed.symbol }) },
	);

export const timeSeries: TwelveDataEndpoints['timeSeries'] = async (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'timeSeries',
			operation: 'market.timeSeries',
			input: TwelveDataEndpointInputSchemas.timeSeries,
			output: TwelveDataEndpointOutputSchemas.timeSeries,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: 'time_series',
			query: {
				symbol: parsed.symbol,
				interval: parsed.interval,
				exchange: parsed.exchange,
				outputsize: parsed.outputsize,
				start_date: parsed.start_date,
				end_date: parsed.end_date,
				order: parsed.order,
				timezone: parsed.timezone,
			},
		}),
		{
			log: (parsed, result) => ({
				symbol: parsed.symbol,
				interval: parsed.interval,
				candles: result.values.length,
			}),
		},
	);

export const exchangeRate: TwelveDataEndpoints['exchangeRate'] = async (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'exchangeRate',
			operation: 'market.exchangeRate',
			input: TwelveDataEndpointInputSchemas.exchangeRate,
			output: TwelveDataEndpointOutputSchemas.exchangeRate,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: 'exchange_rate',
			query: { symbol: parsed.symbol },
		}),
		{ log: (parsed) => ({ symbol: parsed.symbol }) },
	);

export const apiUsage: TwelveDataEndpoints['apiUsage'] = async (ctx, input) =>
	call(
		ctx,
		{
			event: 'apiUsage',
			operation: 'market.apiUsage',
			input: TwelveDataEndpointInputSchemas.apiUsage,
			output: TwelveDataEndpointOutputSchemas.apiUsage,
		},
		input,
		() => ({ method: 'GET', path: 'api_usage' }),
		{
			log: (_parsed, result) => ({
				current_usage: result.current_usage ?? undefined,
				plan_limit: result.plan_limit ?? undefined,
			}),
		},
	);
