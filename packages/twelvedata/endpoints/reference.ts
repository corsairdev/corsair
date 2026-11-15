import type { TwelveDataEndpoints } from '..';
import { call } from './call';
import {
	TwelveDataEndpointInputSchemas,
	TwelveDataEndpointOutputSchemas,
} from './types';

export const stocks: TwelveDataEndpoints['stocksList'] = async (ctx, input) =>
	call(
		ctx,
		{
			event: 'reference.stocks',
			operation: 'reference.stocks',
			input: TwelveDataEndpointInputSchemas.listStocks,
			output: TwelveDataEndpointOutputSchemas.listStocks,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: 'stocks',
			query: {
				symbol: parsed.symbol,
				exchange: parsed.exchange,
				country: parsed.country,
				type: parsed.type,
			},
		}),
		{ log: (_parsed, result) => ({ stocks: result.data.length }) },
	);

export const forexPairs: TwelveDataEndpoints['forexPairsList'] = async (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'reference.forexPairs',
			operation: 'reference.forexPairs',
			input: TwelveDataEndpointInputSchemas.listForexPairs,
			output: TwelveDataEndpointOutputSchemas.listForexPairs,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: 'forex_pairs',
			query: {
				currency_base: parsed.currency_base,
				currency_quote: parsed.currency_quote,
			},
		}),
		{ log: (_parsed, result) => ({ pairs: result.data.length }) },
	);

export const cryptocurrencies: TwelveDataEndpoints['cryptocurrenciesList'] =
	async (ctx, input) =>
		call(
			ctx,
			{
				event: 'reference.cryptocurrencies',
				operation: 'reference.cryptocurrencies',
				input: TwelveDataEndpointInputSchemas.listCryptocurrencies,
				output: TwelveDataEndpointOutputSchemas.listCryptocurrencies,
			},
			input,
			(parsed) => ({
				method: 'GET',
				path: 'cryptocurrencies',
				query: { symbol: parsed.symbol, exchange: parsed.exchange },
			}),
			{ log: (_parsed, result) => ({ pairs: result.data.length }) },
		);

export const exchanges: TwelveDataEndpoints['exchangesList'] = async (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'reference.exchanges',
			operation: 'reference.exchanges',
			input: TwelveDataEndpointInputSchemas.listExchanges,
			output: TwelveDataEndpointOutputSchemas.listExchanges,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: 'exchanges',
			query: { country: parsed.country },
		}),
		{ log: (_parsed, result) => ({ exchanges: result.data.length }) },
	);
