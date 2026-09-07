import { logEventFromContext } from 'corsair/core';
import type { TokenMetricsEndpoints } from '..';
import { makeTokenMetricsRequest } from '../client';
import {
	GetTechnicalIndicatorsInputSchema,
	TechnicalIndicatorsResponseSchema,
} from './types';

export const getIndicators: TokenMetricsEndpoints['technicalGetIndicators'] =
	async (ctx, rawInput) => {
		const input = GetTechnicalIndicatorsInputSchema.parse(rawInput);
		const response = TechnicalIndicatorsResponseSchema.parse(
			await makeTokenMetricsRequest<unknown>(
				'/technical-indicators',
				ctx.key,
				input,
			),
		);
		await logEventFromContext(
			ctx,
			'tokenmetrics.technical.getIndicators',
			{ symbol: input.symbol, indicator: input.indicator },
			'completed',
		);
		return response;
	};
