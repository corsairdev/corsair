import { logEventFromContext } from 'corsair/core';
import { makeAlphaVantageRequest } from '../client';
import type { AlphaVantageEndpoints } from '../index';
import { auditPayload } from './logging';
import { assertSeriesHasData, compactQuery } from './shared';
import type { AlphaVantageEndpointOutputs } from './types';

/**
 * Intraday bars for a digital currency quoted in a fiat market.
 *
 * Premium-plan only — verified live: a free-tier key receives the premium
 * notice. The daily, weekly and monthly crypto operations are all free.
 */
export const intraday: AlphaVantageEndpoints['cryptoIntraday'] = async (
	ctx,
	input,
) => {
	const result = await makeAlphaVantageRequest<
		AlphaVantageEndpointOutputs['cryptoIntraday']
	>(
		'CRYPTO_INTRADAY',
		ctx.key,
		compactQuery({
			symbol: input.symbol,
			market: input.market,
			interval: input.interval,
			outputsize: input.outputsize,
		}),
	);

	assertSeriesHasData(
		result,
		'crypto.intraday',
		`${input.symbol}/${input.market}`,
	);

	await logEventFromContext(
		ctx,
		'alphavantage.crypto.intraday',
		auditPayload(input, ['symbol', 'market', 'interval']),
		'completed',
	);
	return result;
};

/** Daily bars for a digital currency. */
export const daily: AlphaVantageEndpoints['cryptoDaily'] = async (
	ctx,
	input,
) => {
	const result = await makeAlphaVantageRequest<
		AlphaVantageEndpointOutputs['cryptoDaily']
	>(
		'DIGITAL_CURRENCY_DAILY',
		ctx.key,
		compactQuery({ symbol: input.symbol, market: input.market }),
	);

	assertSeriesHasData(
		result,
		'crypto.daily',
		`${input.symbol}/${input.market}`,
	);

	await logEventFromContext(
		ctx,
		'alphavantage.crypto.daily',
		auditPayload(input, ['symbol', 'market']),
		'completed',
	);
	return result;
};

/** Weekly bars for a digital currency. */
export const weekly: AlphaVantageEndpoints['cryptoWeekly'] = async (
	ctx,
	input,
) => {
	const result = await makeAlphaVantageRequest<
		AlphaVantageEndpointOutputs['cryptoWeekly']
	>(
		'DIGITAL_CURRENCY_WEEKLY',
		ctx.key,
		compactQuery({ symbol: input.symbol, market: input.market }),
	);

	assertSeriesHasData(
		result,
		'crypto.weekly',
		`${input.symbol}/${input.market}`,
	);

	await logEventFromContext(
		ctx,
		'alphavantage.crypto.weekly',
		auditPayload(input, ['symbol', 'market']),
		'completed',
	);
	return result;
};

/** Monthly bars for a digital currency. */
export const monthly: AlphaVantageEndpoints['cryptoMonthly'] = async (
	ctx,
	input,
) => {
	const result = await makeAlphaVantageRequest<
		AlphaVantageEndpointOutputs['cryptoMonthly']
	>(
		'DIGITAL_CURRENCY_MONTHLY',
		ctx.key,
		compactQuery({ symbol: input.symbol, market: input.market }),
	);

	assertSeriesHasData(
		result,
		'crypto.monthly',
		`${input.symbol}/${input.market}`,
	);

	await logEventFromContext(
		ctx,
		'alphavantage.crypto.monthly',
		auditPayload(input, ['symbol', 'market']),
		'completed',
	);
	return result;
};
