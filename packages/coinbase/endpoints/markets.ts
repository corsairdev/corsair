import { logEventFromContext } from 'corsair/core';
import { z } from 'zod';
import type { CoinbaseEndpoints } from '..';
import { makeCoinbaseRequest } from '../client';
import { AccountsListOutputSchema } from './types';

const BrokeragePayload = z.unknown();

async function brokerage<T>(
	ctx: { key: string },
	path: string,
	schema: { parse: (data: unknown) => T },
	query?: Record<string, string | number | boolean | undefined>,
): Promise<T> {
	return makeCoinbaseRequest(path, ctx.key, { schema, query });
}

export const listMarketProducts: CoinbaseEndpoints['listMarketProducts'] =
	async (ctx, input) => {
		const result = await brokerage(
			ctx,
			'/api/v3/brokerage/market/products',
			BrokeragePayload,
			{
				limit: input.limit,
				offset: input.offset,
				product_type: input.product_type,
				product_ids: input.product_ids,
			},
		);
		await logEventFromContext(
			ctx,
			'coinbase.markets.listProducts',
			input,
			'completed',
		);
		return result;
	};

export const listExchangeProducts: CoinbaseEndpoints['listExchangeProducts'] =
	async (ctx, input) => {
		const result = await brokerage(
			ctx,
			'/api/v3/brokerage/market/products',
			BrokeragePayload,
			{
				limit: input.limit,
				offset: input.offset,
				product_type: input.product_type,
			},
		);
		await logEventFromContext(
			ctx,
			'coinbase.markets.listExchangeProducts',
			input,
			'completed',
		);
		return result;
	};

export const getProduct: CoinbaseEndpoints['getProduct'] = async (
	ctx,
	input,
) => {
	const result = await brokerage(
		ctx,
		`/api/v3/brokerage/market/products/${encodeURIComponent(input.product_id)}`,
		BrokeragePayload,
	);
	await logEventFromContext(
		ctx,
		'coinbase.markets.getProduct',
		input,
		'completed',
	);
	return result;
};

export const getMarketProductBook: CoinbaseEndpoints['getMarketProductBook'] =
	async (ctx, input) => {
		const result = await brokerage(
			ctx,
			'/api/v3/brokerage/market/product_book',
			BrokeragePayload,
			{ product_id: input.product_id, limit: input.limit },
		);
		await logEventFromContext(
			ctx,
			'coinbase.markets.getMarketProductBook',
			input,
			'completed',
		);
		return result;
	};

export const getProductBook: CoinbaseEndpoints['getProductBook'] = async (
	ctx,
	input,
) => {
	const result = await brokerage(
		ctx,
		'/api/v3/brokerage/market/product_book',
		BrokeragePayload,
		{ product_id: input.product_id, limit: input.limit },
	);
	await logEventFromContext(
		ctx,
		'coinbase.markets.getProductBook',
		input,
		'completed',
	);
	return result;
};

export const getProductsTicker: CoinbaseEndpoints['getProductsTicker'] = async (
	ctx,
	input,
) => {
	const result = await brokerage(
		ctx,
		`/api/v3/brokerage/market/products/${encodeURIComponent(input.product_id)}/ticker`,
		BrokeragePayload,
		{ limit: input.limit },
	);
	await logEventFromContext(
		ctx,
		'coinbase.markets.getTicker',
		input,
		'completed',
	);
	return result;
};

export const getPublicMarketTrades: CoinbaseEndpoints['getPublicMarketTrades'] =
	async (ctx, input) => {
		const result = await brokerage(
			ctx,
			`/api/v3/brokerage/market/products/${encodeURIComponent(input.product_id)}/ticker`,
			BrokeragePayload,
			{ limit: input.limit },
		);
		await logEventFromContext(
			ctx,
			'coinbase.markets.getPublicTrades',
			input,
			'completed',
		);
		return result;
	};

export const listProductsTrades: CoinbaseEndpoints['listProductsTrades'] =
	async (ctx, input) => {
		const result = await brokerage(
			ctx,
			`/api/v3/brokerage/market/products/${encodeURIComponent(input.product_id)}/ticker`,
			BrokeragePayload,
			{ limit: input.limit },
		);
		await logEventFromContext(
			ctx,
			'coinbase.markets.listTrades',
			input,
			'completed',
		);
		return result;
	};

export const listProductCandles: CoinbaseEndpoints['listProductCandles'] =
	async (ctx, input) => {
		const result = await brokerage(
			ctx,
			`/api/v3/brokerage/market/products/${encodeURIComponent(input.product_id)}/candles`,
			BrokeragePayload,
			{
				start: input.start,
				end: input.end,
				granularity: input.granularity,
			},
		);
		await logEventFromContext(
			ctx,
			'coinbase.markets.listProductCandles',
			input,
			'completed',
		);
		return result;
	};

export const listProductsCandles: CoinbaseEndpoints['listProductsCandles'] =
	async (ctx, input) => {
		const result = await brokerage(
			ctx,
			`/api/v3/brokerage/market/products/${encodeURIComponent(input.product_id)}/candles`,
			BrokeragePayload,
			{
				start: input.start,
				end: input.end,
				granularity: input.granularity,
			},
		);
		await logEventFromContext(
			ctx,
			'coinbase.markets.listProductsCandles',
			input,
			'completed',
		);
		return result;
	};

export const getProductsVolumeSummary: CoinbaseEndpoints['getProductsVolumeSummary'] =
	async (ctx, input) => {
		const result = await brokerage(
			ctx,
			'/api/v3/brokerage/market/products',
			BrokeragePayload,
			{ limit: input.limit },
		);
		await logEventFromContext(
			ctx,
			'coinbase.markets.getVolumeSummary',
			input,
			'completed',
		);
		return result;
	};

export const listProductsStats: CoinbaseEndpoints['listProductsStats'] = async (
	ctx,
	input,
) => {
	const result = await brokerage(
		ctx,
		`/api/v3/brokerage/market/products/${encodeURIComponent(input.product_id)}`,
		BrokeragePayload,
	);
	await logEventFromContext(
		ctx,
		'coinbase.markets.listStats',
		input,
		'completed',
	);
	return result;
};

export const getServerTime: CoinbaseEndpoints['getServerTime'] = async (
	ctx,
	input,
) => {
	const result = await brokerage(
		ctx,
		'/api/v3/brokerage/time',
		BrokeragePayload,
	);
	await logEventFromContext(
		ctx,
		'coinbase.markets.getServerTime',
		input,
		'completed',
	);
	return result;
};

export const getExchangeCurrency: CoinbaseEndpoints['getExchangeCurrency'] =
	async (ctx, input) => {
		const result = await brokerage(
			ctx,
			`/v2/currencies/${encodeURIComponent(input.currency_id)}`,
			z.object({ data: z.unknown() }).loose(),
		);
		await logEventFromContext(
			ctx,
			'coinbase.markets.getCurrency',
			input,
			'completed',
		);
		return result;
	};

export const listWallets: CoinbaseEndpoints['listWallets'] = async (
	ctx,
	input,
) => {
	const result = await makeCoinbaseRequest('/v2/accounts', ctx.key, {
		schema: AccountsListOutputSchema,
		query: {
			limit: input.limit,
			starting_after: input.starting_after,
			ending_before: input.ending_before,
			order: input.order,
		},
	});
	await logEventFromContext(
		ctx,
		'coinbase.markets.listWallets',
		input,
		'completed',
	);
	return result;
};
