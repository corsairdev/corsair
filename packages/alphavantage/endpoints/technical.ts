import { logEventFromContext } from 'corsair/core';
import { makeAlphaVantageRequest } from '../client';
import type { AlphaVantageEndpoints } from '../index';
import { auditPayload } from './logging';
import { assertSeriesHasData, compactQuery } from './shared';
import type { AlphaVantageEndpointOutputs } from './types';

/**
 * Any of Alpha Vantage's technical indicators.
 *
 * Alpha Vantage exposes roughly fifty separate functions here — `SMA`, `EMA`,
 * `RSI`, `MACD`, `BBANDS`, `STOCH` and so on — that differ only in which extra
 * parameters they accept. The OSS catalog collapses them into this single
 * operation, so the indicator is a parameter rather than fifty near-identical
 * endpoints.
 *
 * Indicator-specific parameters (`fastperiod`, `nbdevup`, `matype`, …) are
 * passed through `extra_params`. They are forwarded verbatim, so an unknown
 * name is rejected by the provider rather than silently dropped here.
 *
 * The response envelope matches the time-series shape, with the series key
 * naming the indicator (`"Technical Analysis: RSI"`). One inconsistency worth
 * knowing: the `Meta Data` block on indicator responses numbers its keys with
 * colons (`"1: Symbol"`) where the price series use periods (`"1. Information"`).
 */
export const indicator: AlphaVantageEndpoints['technicalIndicator'] = async (
	ctx,
	input,
) => {
	const result = await makeAlphaVantageRequest<
		AlphaVantageEndpointOutputs['technicalIndicator']
	>(
		input.indicator,
		ctx.key,
		compactQuery({
			...Object.fromEntries(
				Object.entries(input.extra_params ?? {}).filter(
					([key]) =>
						!['function', 'apikey', 'datatype'].includes(key.toLowerCase()),
				),
			),
			symbol: input.symbol,
			interval: input.interval,
			time_period: input.time_period,
			series_type: input.series_type,
			month: input.month,
		}),
	);

	assertSeriesHasData(
		result,
		'technical.indicator',
		`${input.symbol} ${input.indicator}`,
	);

	await logEventFromContext(
		ctx,
		'alphavantage.technical.indicator',
		auditPayload(input, ['indicator', 'symbol', 'interval', 'time_period']),
		'completed',
	);
	return result;
};
