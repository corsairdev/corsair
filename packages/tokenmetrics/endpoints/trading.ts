import { logEventFromContext } from 'corsair/core';
import type { TokenMetricsEndpoints } from '..';
import { makeTokenMetricsRequest } from '../client';
import {
	GetTradingSignalsInputSchema,
	TradingSignalsResponseSchema,
} from './types';

export const getSignals: TokenMetricsEndpoints['tradingGetSignals'] = async (
	ctx,
	rawInput,
) => {
	const input = GetTradingSignalsInputSchema.parse(rawInput);
	const response = TradingSignalsResponseSchema.parse(
		await makeTokenMetricsRequest<unknown>('/trading-signals', ctx.key, input),
	);
	await logEventFromContext(
		ctx,
		'tokenmetrics.trading.getSignals',
		{ count: response.data.length },
		'completed',
	);
	return response;
};
