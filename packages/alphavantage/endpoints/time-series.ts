import { logEventFromContext } from 'corsair/core';
import { makeAlphaVantageRequest } from '../client';
import type { AlphaVantageEndpoints } from '../index';
import { auditPayload } from './logging';
import {
	assertNotEmpty,
	assertSeriesHasData,
	booleanParam,
	compactQuery,
	listParam,
} from './shared';
import type { AlphaVantageEndpointOutputs } from './types';

/**
 * Intraday bars at 1–60 minute resolution, optionally for one past month.
 *
 * Premium-plan only. Alpha Vantage has moved all intraday data behind the
 * paywall: a free-tier key gets `{"Information": "... premium endpoint ..."}`
 * with HTTP 200, which the client turns into a permission error. The response
 * shape declared for this operation is the same series envelope its daily and
 * weekly siblings return, so it is not modelled from guesswork even though it
 * could not be exercised live.
 */
export const intraday: AlphaVantageEndpoints['timeSeriesIntraday'] = async (
	ctx,
	input,
) => {
	const result = await makeAlphaVantageRequest<
		AlphaVantageEndpointOutputs['timeSeriesIntraday']
	>(
		'TIME_SERIES_INTRADAY',
		ctx.key,
		compactQuery({
			symbol: input.symbol,
			interval: input.interval,
			adjusted: booleanParam(input.adjusted),
			extended_hours: booleanParam(input.extended_hours),
			month: input.month,
			outputsize: input.outputsize,
		}),
	);

	assertSeriesHasData(result, 'timeSeries.intraday', input.symbol);

	await logEventFromContext(
		ctx,
		'alphavantage.timeSeries.intraday',
		auditPayload(input, ['symbol', 'interval', 'month', 'outputsize']),
		'completed',
	);
	return result;
};

/**
 * Historical intraday bars beyond the default window.
 *
 * Alpha Vantage retired the standalone `TIME_SERIES_INTRADAY_EXTENDED` function
 * and folded it into `TIME_SERIES_INTRADAY`, which now reaches back more than
 * twenty years through its `month` parameter. The operation is kept because the
 * catalog lists it, and the legacy `slice` argument (`year1month1` …
 * `year2month12`) is translated into the equivalent `month` so existing callers
 * keep working.
 *
 * Premium-plan only, for the same reason as `intraday` — it routes through the
 * same provider function.
 */
export const intradayExtended: AlphaVantageEndpoints['timeSeriesIntradayExtended'] =
	async (ctx, input) => {
		const month = input.month ?? monthFromSlice(input.slice);

		const result = await makeAlphaVantageRequest<
			AlphaVantageEndpointOutputs['timeSeriesIntradayExtended']
		>(
			'TIME_SERIES_INTRADAY',
			ctx.key,
			compactQuery({
				symbol: input.symbol,
				interval: input.interval,
				adjusted: booleanParam(input.adjusted),
				month,
				outputsize: 'full',
			}),
		);

		assertSeriesHasData(result, 'timeSeries.intradayExtended', input.symbol);

		await logEventFromContext(
			ctx,
			'alphavantage.timeSeries.intradayExtended',
			auditPayload(input, ['symbol', 'interval', 'slice', 'month']),
			'completed',
		);
		return result;
	};

/**
 * Converts a legacy slice into the `YYYY-MM` the current API expects.
 * `year1month1` is the most recent complete month, counting backwards.
 */
function monthFromSlice(slice: string | undefined): string | undefined {
	if (!slice) return undefined;
	const match = /^year([12])month([1-9]|1[0-2])$/.exec(slice);
	if (!match) return undefined;

	const yearOffset = Number(match[1]) - 1;
	const monthOffset = Number(match[2]) - 1;
	const monthsBack = yearOffset * 12 + monthOffset;

	const now = new Date();
	// Day 1 avoids month-end rollover when stepping backwards.
	const target = new Date(
		Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - monthsBack, 1),
	);
	const year = target.getUTCFullYear();
	const month = String(target.getUTCMonth() + 1).padStart(2, '0');
	return `${year}-${month}`;
}

/** Daily OHLCV bars. */
export const daily: AlphaVantageEndpoints['timeSeriesDaily'] = async (
	ctx,
	input,
) => {
	const result = await makeAlphaVantageRequest<
		AlphaVantageEndpointOutputs['timeSeriesDaily']
	>(
		'TIME_SERIES_DAILY',
		ctx.key,
		compactQuery({ symbol: input.symbol, outputsize: input.outputsize }),
	);

	assertSeriesHasData(result, 'timeSeries.daily', input.symbol);

	await logEventFromContext(
		ctx,
		'alphavantage.timeSeries.daily',
		auditPayload(input, ['symbol', 'outputsize']),
		'completed',
	);
	return result;
};

/** Weekly OHLCV bars. */
export const weekly: AlphaVantageEndpoints['timeSeriesWeekly'] = async (
	ctx,
	input,
) => {
	const result = await makeAlphaVantageRequest<
		AlphaVantageEndpointOutputs['timeSeriesWeekly']
	>('TIME_SERIES_WEEKLY', ctx.key, compactQuery({ symbol: input.symbol }));

	assertSeriesHasData(result, 'timeSeries.weekly', input.symbol);

	await logEventFromContext(
		ctx,
		'alphavantage.timeSeries.weekly',
		auditPayload(input, ['symbol']),
		'completed',
	);
	return result;
};

/** Weekly bars including dividend and split adjustments. */
export const weeklyAdjusted: AlphaVantageEndpoints['timeSeriesWeeklyAdjusted'] =
	async (ctx, input) => {
		const result = await makeAlphaVantageRequest<
			AlphaVantageEndpointOutputs['timeSeriesWeeklyAdjusted']
		>(
			'TIME_SERIES_WEEKLY_ADJUSTED',
			ctx.key,
			compactQuery({ symbol: input.symbol }),
		);

		assertSeriesHasData(result, 'timeSeries.weeklyAdjusted', input.symbol);

		await logEventFromContext(
			ctx,
			'alphavantage.timeSeries.weeklyAdjusted',
			auditPayload(input, ['symbol']),
			'completed',
		);
		return result;
	};

/** Monthly OHLCV bars. */
export const monthly: AlphaVantageEndpoints['timeSeriesMonthly'] = async (
	ctx,
	input,
) => {
	const result = await makeAlphaVantageRequest<
		AlphaVantageEndpointOutputs['timeSeriesMonthly']
	>('TIME_SERIES_MONTHLY', ctx.key, compactQuery({ symbol: input.symbol }));

	assertSeriesHasData(result, 'timeSeries.monthly', input.symbol);

	await logEventFromContext(
		ctx,
		'alphavantage.timeSeries.monthly',
		auditPayload(input, ['symbol']),
		'completed',
	);
	return result;
};

/** Monthly bars including dividend and split adjustments. */
export const monthlyAdjusted: AlphaVantageEndpoints['timeSeriesMonthlyAdjusted'] =
	async (ctx, input) => {
		const result = await makeAlphaVantageRequest<
			AlphaVantageEndpointOutputs['timeSeriesMonthlyAdjusted']
		>(
			'TIME_SERIES_MONTHLY_ADJUSTED',
			ctx.key,
			compactQuery({ symbol: input.symbol }),
		);

		assertSeriesHasData(result, 'timeSeries.monthlyAdjusted', input.symbol);

		await logEventFromContext(
			ctx,
			'alphavantage.timeSeries.monthlyAdjusted',
			auditPayload(input, ['symbol']),
			'completed',
		);
		return result;
	};

/**
 * The latest price and volume for one ticker.
 *
 * An unknown ticker comes back as `{"Global Quote": {}}` with no error key, so
 * the empty case is turned into an explicit not-found here.
 */
export const globalQuote: AlphaVantageEndpoints['timeSeriesGlobalQuote'] =
	async (ctx, input) => {
		const result = await makeAlphaVantageRequest<
			AlphaVantageEndpointOutputs['timeSeriesGlobalQuote']
		>('GLOBAL_QUOTE', ctx.key, compactQuery({ symbol: input.symbol }));

		assertNotEmpty(
			result['Global Quote'],
			'timeSeries.globalQuote',
			input.symbol,
		);

		await logEventFromContext(
			ctx,
			'alphavantage.timeSeries.globalQuote',
			auditPayload(input, ['symbol']),
			'completed',
		);
		return result;
	};

/**
 * Quotes for up to 100 tickers in one call.
 *
 * This is a premium-plan operation. On the free tier Alpha Vantage answers with
 * a notice and an explicitly artificial sample payload rather than an error, so
 * the notice is surfaced to the caller unchanged instead of being mistaken for
 * data.
 */
export const realtimeBulkQuotes: AlphaVantageEndpoints['timeSeriesRealtimeBulkQuotes'] =
	async (ctx, input) => {
		const result = await makeAlphaVantageRequest<
			AlphaVantageEndpointOutputs['timeSeriesRealtimeBulkQuotes']
		>(
			'REALTIME_BULK_QUOTES',
			ctx.key,
			compactQuery({ symbol: listParam(input.symbols) }),
		);

		await logEventFromContext(
			ctx,
			'alphavantage.timeSeries.realtimeBulkQuotes',
			{ count: input.symbols.length },
			'completed',
		);
		return result;
	};
