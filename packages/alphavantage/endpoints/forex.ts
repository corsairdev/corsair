import { logEventFromContext } from 'corsair/core';
import { makeAlphaVantageRequest } from '../client';
import type { AlphaVantageEndpoints } from '../index';
import { auditPayload } from './logging';
import { assertNotEmpty, assertSeriesHasData, compactQuery } from './shared';
import type { AlphaVantageEndpointOutputs } from './types';

/** The current rate for one currency pair, including bid and ask where known. */
export const exchangeRate: AlphaVantageEndpoints['forexExchangeRate'] = async (
	ctx,
	input,
) => {
	const result = await makeAlphaVantageRequest<
		AlphaVantageEndpointOutputs['forexExchangeRate']
	>(
		'CURRENCY_EXCHANGE_RATE',
		ctx.key,
		compactQuery({
			from_currency: input.from_currency,
			to_currency: input.to_currency,
		}),
	);

	assertNotEmpty(
		result['Realtime Currency Exchange Rate'],
		'forex.exchangeRate',
		`${input.from_currency}/${input.to_currency}`,
	);

	await logEventFromContext(
		ctx,
		'alphavantage.forex.exchangeRate',
		auditPayload(input, ['from_currency', 'to_currency']),
		'completed',
	);
	return result;
};

/**
 * Intraday bars for a currency pair.
 *
 * Premium-plan only — verified live: a free-tier key receives the premium
 * notice. The daily, weekly and monthly forex operations are all free.
 */
export const intraday: AlphaVantageEndpoints['forexIntraday'] = async (
	ctx,
	input,
) => {
	const result = await makeAlphaVantageRequest<
		AlphaVantageEndpointOutputs['forexIntraday']
	>(
		'FX_INTRADAY',
		ctx.key,
		compactQuery({
			from_symbol: input.from_symbol,
			to_symbol: input.to_symbol,
			interval: input.interval,
			outputsize: input.outputsize,
		}),
	);

	assertSeriesHasData(
		result,
		'forex.intraday',
		`${input.from_symbol}/${input.to_symbol}`,
	);

	await logEventFromContext(
		ctx,
		'alphavantage.forex.intraday',
		auditPayload(input, ['from_symbol', 'to_symbol', 'interval']),
		'completed',
	);
	return result;
};

/** Daily bars for a currency pair. */
export const daily: AlphaVantageEndpoints['forexDaily'] = async (
	ctx,
	input,
) => {
	const result = await makeAlphaVantageRequest<
		AlphaVantageEndpointOutputs['forexDaily']
	>(
		'FX_DAILY',
		ctx.key,
		compactQuery({
			from_symbol: input.from_symbol,
			to_symbol: input.to_symbol,
			outputsize: input.outputsize,
		}),
	);

	assertSeriesHasData(
		result,
		'forex.daily',
		`${input.from_symbol}/${input.to_symbol}`,
	);

	await logEventFromContext(
		ctx,
		'alphavantage.forex.daily',
		auditPayload(input, ['from_symbol', 'to_symbol']),
		'completed',
	);
	return result;
};

/** Weekly bars for a currency pair. */
export const weekly: AlphaVantageEndpoints['forexWeekly'] = async (
	ctx,
	input,
) => {
	const result = await makeAlphaVantageRequest<
		AlphaVantageEndpointOutputs['forexWeekly']
	>(
		'FX_WEEKLY',
		ctx.key,
		compactQuery({
			from_symbol: input.from_symbol,
			to_symbol: input.to_symbol,
		}),
	);

	assertSeriesHasData(
		result,
		'forex.weekly',
		`${input.from_symbol}/${input.to_symbol}`,
	);

	await logEventFromContext(
		ctx,
		'alphavantage.forex.weekly',
		auditPayload(input, ['from_symbol', 'to_symbol']),
		'completed',
	);
	return result;
};

/** Monthly bars for a currency pair. */
export const monthly: AlphaVantageEndpoints['forexMonthly'] = async (
	ctx,
	input,
) => {
	const result = await makeAlphaVantageRequest<
		AlphaVantageEndpointOutputs['forexMonthly']
	>(
		'FX_MONTHLY',
		ctx.key,
		compactQuery({
			from_symbol: input.from_symbol,
			to_symbol: input.to_symbol,
		}),
	);

	assertSeriesHasData(
		result,
		'forex.monthly',
		`${input.from_symbol}/${input.to_symbol}`,
	);

	await logEventFromContext(
		ctx,
		'alphavantage.forex.monthly',
		auditPayload(input, ['from_symbol', 'to_symbol']),
		'completed',
	);
	return result;
};
