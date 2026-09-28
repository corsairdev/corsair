import { AuthMissingError, logEventFromContext } from 'corsair/core';
import { makeMarketstackRequest } from '../client';
import type { MarketstackEndpoints } from '../index';
import type {
	GetTickerEodLatestResponse,
	GetTickerInfoResponse,
} from './types';
import {
	GetTickerEodInputSchema,
	GetTickerEodLatestInputSchema,
	GetTickerEodLatestResponseSchema,
	GetTickerEodWireResponseSchema,
	GetTickerInfoInputSchema,
	GetTickerInfoResponseSchema,
	ListTickersInputSchema,
	ListTickersWireResponseSchema,
} from './types';

export const getTickerInfo: MarketstackEndpoints['getTickerInfo'] = async (
	ctx,
	input,
) => {
	if (!ctx.key) {
		throw new AuthMissingError('marketstack', 'api_key');
	}

	const { symbol } = GetTickerInfoInputSchema.parse(input);

	const rawResponse = await makeMarketstackRequest<GetTickerInfoResponse>(
		`tickers/${encodeURIComponent(symbol)}`,
		ctx.key,
	);

	const response = GetTickerInfoResponseSchema.parse(rawResponse);

	await logEventFromContext(
		ctx,
		'marketstack.tickers.get',
		{ symbol },
		'completed',
	);

	return response;
};

export const listTickers: MarketstackEndpoints['listTickers'] = async (
	ctx,
	input,
) => {
	if (!ctx.key) {
		throw new AuthMissingError('marketstack', 'api_key');
	}

	const { search, exchange, limit, offset } =
		ListTickersInputSchema.parse(input);

	const rawResponse = await makeMarketstackRequest<unknown>(
		'tickerslist',
		ctx.key,
		{
			query: { search, exchange, limit, offset },
		},
	);

	const wireResponse = ListTickersWireResponseSchema.parse(rawResponse);
	const response = {
		pagination: wireResponse.pagination,
		data: wireResponse.data.map(({ ticker, ...rest }) => ({
			...rest,
			symbol: ticker,
		})),
	};

	await logEventFromContext(
		ctx,
		'marketstack.tickers.list',
		{ search, exchange },
		'completed',
	);

	return response;
};

export const getTickerEod: MarketstackEndpoints['getTickerEod'] = async (
	ctx,
	input,
) => {
	if (!ctx.key) {
		throw new AuthMissingError('marketstack', 'api_key');
	}

	const { symbol, sort, dateFrom, dateTo, limit, offset } =
		GetTickerEodInputSchema.parse(input);

	const rawResponse = await makeMarketstackRequest<unknown>(
		`tickers/${encodeURIComponent(symbol)}/eod`,
		ctx.key,
		{
			query: {
				sort,
				date_from: dateFrom,
				date_to: dateTo,
				limit,
				offset,
			},
		},
	);

	const wireResponse = GetTickerEodWireResponseSchema.parse(rawResponse);
	const response = {
		pagination: wireResponse.pagination,
		data: wireResponse.data.eod,
	};

	await logEventFromContext(
		ctx,
		'marketstack.tickers.getEod',
		{ symbol, dateFrom, dateTo },
		'completed',
	);

	return response;
};

export const getTickerEodLatest: MarketstackEndpoints['getTickerEodLatest'] =
	async (ctx, input) => {
		if (!ctx.key) {
			throw new AuthMissingError('marketstack', 'api_key');
		}

		const { symbol } = GetTickerEodLatestInputSchema.parse(input);

		const rawResponse =
			await makeMarketstackRequest<GetTickerEodLatestResponse>(
				`tickers/${encodeURIComponent(symbol)}/eod/latest`,
				ctx.key,
			);

		const response = GetTickerEodLatestResponseSchema.parse(rawResponse);

		await logEventFromContext(
			ctx,
			'marketstack.tickers.getEodLatest',
			{ symbol },
			'completed',
		);

		return response;
	};
