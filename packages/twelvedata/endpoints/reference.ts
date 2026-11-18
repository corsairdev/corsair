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

/**
 * ETFs answer the same `{ data }` envelope as `stocks`, with the same fields.
 */
export const etf: TwelveDataEndpoints['etfList'] = async (ctx, input) =>
	call(
		ctx,
		{
			event: 'reference.etf',
			operation: 'reference.etf',
			input: TwelveDataEndpointInputSchemas.listEtf,
			output: TwelveDataEndpointOutputSchemas.listEtf,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: 'etf',
			query: {
				symbol: parsed.symbol,
				exchange: parsed.exchange,
				country: parsed.country,
			},
		}),
		{ log: (_parsed, result) => ({ etfs: result.data.length }) },
	);

/**
 * Funds and bonds answer `{ result: { count, list } }`, not the `{ data }` array
 * the other reference lists use.
 */
export const funds: TwelveDataEndpoints['fundsList'] = async (ctx, input) =>
	call(
		ctx,
		{
			event: 'reference.funds',
			operation: 'reference.funds',
			input: TwelveDataEndpointInputSchemas.listFunds,
			output: TwelveDataEndpointOutputSchemas.listFunds,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: 'funds',
			query: {
				country: parsed.country,
				symbol: parsed.symbol,
				page: parsed.page,
				outputsize: parsed.outputsize,
			},
		}),
		{ log: (_parsed, result) => ({ funds: result.result.list.length }) },
	);

export const bonds: TwelveDataEndpoints['bondsList'] = async (ctx, input) =>
	call(
		ctx,
		{
			event: 'reference.bonds',
			operation: 'reference.bonds',
			input: TwelveDataEndpointInputSchemas.listBonds,
			output: TwelveDataEndpointOutputSchemas.listBonds,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: 'bonds',
			query: {
				symbol: parsed.symbol,
				exchange: parsed.exchange,
				country: parsed.country,
				page: parsed.page,
				outputsize: parsed.outputsize,
			},
		}),
		{ log: (_parsed, result) => ({ bonds: result.result.list.length }) },
	);
