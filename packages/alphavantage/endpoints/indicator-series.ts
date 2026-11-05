import { logEventFromContext } from 'corsair/core';
import { makeAlphaVantageRequest } from '../client';
import type { AlphaVantageContext } from '../index';
import { auditPayload } from './logging';
import { compactQuery } from './shared';
import type { AlphaVantageIndicatorSeries } from './types';

/**
 * All nine commodity operations and all ten economic indicator operations
 * return the identical `{name, interval, unit, data[]}` envelope and take at
 * most an `interval` — 19 of this plugin's 56 operations.
 *
 * Rather than repeat the same eight lines nineteen times, each is built from
 * this factory. The operations that need more than an interval (currently only
 * the treasury yield, which also takes a maturity) are written out in full at
 * their own definition instead.
 */
export function indicatorSeriesEndpoint(
	functionName: string,
	operation: string,
) {
	return async (
		ctx: AlphaVantageContext,
		input: { interval?: string },
	): Promise<AlphaVantageIndicatorSeries> => {
		const result = await makeAlphaVantageRequest<AlphaVantageIndicatorSeries>(
			functionName,
			ctx.key,
			compactQuery({ interval: input.interval }),
		);

		await logEventFromContext(
			ctx,
			`alphavantage.${operation}`,
			auditPayload(input, ['interval']),
			'completed',
		);
		return result;
	};
}
