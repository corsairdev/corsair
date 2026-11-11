import { AuthMissingError, logEventFromContext } from 'corsair/core';
import type { KalshiEndpoints } from '..';
import { makeKalshiRequest } from '../client';
import {
	KalshiEndpointInputSchemas,
	KalshiEndpointOutputSchemas,
} from './types';

export const list: KalshiEndpoints['marketsList'] = async (ctx, input) => {
	const parsed = KalshiEndpointInputSchemas.marketsList.parse(input);
	if (!ctx.key) {
		throw new AuthMissingError('kalshi', 'api_key');
	}
	const response = await makeKalshiRequest('/markets', ctx.key, {
		method: 'GET',
		query: parsed,
	});

	await logEventFromContext(
		ctx,
		'kalshi.markets.list',
		{ ...parsed },
		'completed',
	);
	return KalshiEndpointOutputSchemas.marketsList.parse(response);
};

export const get: KalshiEndpoints['marketsGet'] = async (ctx, input) => {
	const parsed = KalshiEndpointInputSchemas.marketsGet.parse(input);
	if (!ctx.key) {
		throw new AuthMissingError('kalshi', 'api_key');
	}
	const response = await makeKalshiRequest(
		`/markets/${encodeURIComponent(parsed.ticker)}`,
		ctx.key,
		{ method: 'GET' },
	);

	await logEventFromContext(
		ctx,
		'kalshi.markets.get',
		{ ...parsed },
		'completed',
	);
	return KalshiEndpointOutputSchemas.marketsGet.parse(response);
};

export const orderbook: KalshiEndpoints['marketsOrderbook'] = async (
	ctx,
	input,
) => {
	const parsed = KalshiEndpointInputSchemas.marketsOrderbook.parse(input);
	if (!ctx.key) {
		throw new AuthMissingError('kalshi', 'api_key');
	}
	const response = await makeKalshiRequest(
		`/markets/${encodeURIComponent(parsed.ticker)}/orderbook`,
		ctx.key,
		{ method: 'GET', query: { depth: parsed.depth } },
	);

	await logEventFromContext(
		ctx,
		'kalshi.markets.orderbook',
		{ ...parsed },
		'completed',
	);
	return KalshiEndpointOutputSchemas.marketsOrderbook.parse(response);
};

export const trades: KalshiEndpoints['marketsTrades'] = async (ctx, input) => {
	const parsed = KalshiEndpointInputSchemas.marketsTrades.parse(input);
	if (!ctx.key) {
		throw new AuthMissingError('kalshi', 'api_key');
	}
	const response = await makeKalshiRequest('/markets/trades', ctx.key, {
		method: 'GET',
		query: parsed,
	});

	await logEventFromContext(
		ctx,
		'kalshi.markets.trades',
		{ ...parsed },
		'completed',
	);
	return KalshiEndpointOutputSchemas.marketsTrades.parse(response);
};

export const Markets = {
	list,
	get,
	orderbook,
	trades,
} as const;
