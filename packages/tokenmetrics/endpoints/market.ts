import { logEventFromContext } from 'corsair/core';
import type { TokenMetricsEndpoints } from '..';
import { makeTokenMetricsRequest } from '../client';
import {
	GetPriceInputSchema,
	GetTopMarketCapInputSchema,
	PriceResponseSchema,
	TopMarketCapResponseSchema,
} from './types';

export const getPrice: TokenMetricsEndpoints['marketGetPrice'] = async (
	ctx,
	rawInput,
) => {
	const input = GetPriceInputSchema.parse(rawInput);
	const response = PriceResponseSchema.parse(
		await makeTokenMetricsRequest<unknown>('/price', ctx.key, input),
	);
	await logEventFromContext(
		ctx,
		'tokenmetrics.market.getPrice',
		{ symbol: input.symbol, tokenId: input.token_id },
		'completed',
	);
	return response;
};
export const getTopMarketCap: TokenMetricsEndpoints['marketGetTopMarketCap'] =
	async (ctx, rawInput) => {
		const input = GetTopMarketCapInputSchema.parse(rawInput);
		const response = TopMarketCapResponseSchema.parse(
			await makeTokenMetricsRequest<unknown>(
				'/top-market-cap-tokens',
				ctx.key,
				{ top_k: input.top_k ?? 100, page: input.page ?? 0 },
			),
		);
		await logEventFromContext(
			ctx,
			'tokenmetrics.market.getTopMarketCap',
			{ count: response.data.length },
			'completed',
		);
		return response;
	};
