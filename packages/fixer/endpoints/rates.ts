import { logEventFromContext } from 'corsair/core';
import type { FixerEndpoints } from '..';
import { makeFixerRequest } from '../client';
import { FixerEndpointOutputSchemas } from './types';

/**
 * Retrieves real-time exchange rates for all or specified symbols relative to a base currency.
 */
export const latest: FixerEndpoints['ratesLatest'] = async (ctx, input) => {
	const response = await makeFixerRequest('latest', ctx.key, {
		method: 'GET',
		query: {
			base: input.base,
			symbols: input.symbols,
		},
		schema: FixerEndpointOutputSchemas.ratesLatest,
	});

	await logEventFromContext(
		ctx,
		'fixer.rates.latest',
		{ base: input.base, symbols: input.symbols },
		'completed',
	);
	return response;
};

/**
 * Retrieves historical exchange rates for a given date formatted as YYYY-MM-DD.
 */
export const historical: FixerEndpoints['ratesHistorical'] = async (
	ctx,
	input,
) => {
	const response = await makeFixerRequest(input.date, ctx.key, {
		method: 'GET',
		query: {
			base: input.base,
			symbols: input.symbols,
		},
		schema: FixerEndpointOutputSchemas.ratesHistorical,
	});

	await logEventFromContext(
		ctx,
		'fixer.rates.historical',
		{ date: input.date, base: input.base, symbols: input.symbols },
		'completed',
	);
	return response;
};

/**
 * Converts a monetary amount from one currency to another using real-time or historical rates.
 */
export const convert: FixerEndpoints['ratesConvert'] = async (ctx, input) => {
	const response = await makeFixerRequest('convert', ctx.key, {
		method: 'GET',
		query: {
			from: input.from,
			to: input.to,
			amount: input.amount,
			date: input.date,
		},
		schema: FixerEndpointOutputSchemas.ratesConvert,
	});

	await logEventFromContext(
		ctx,
		'fixer.rates.convert',
		{ from: input.from, to: input.to, amount: input.amount, date: input.date },
		'completed',
	);
	return response;
};

/**
 * Retrieves daily time-series exchange rates between two dates for specified currencies.
 */
export const timeseries: FixerEndpoints['ratesTimeseries'] = async (
	ctx,
	input,
) => {
	const response = await makeFixerRequest('timeseries', ctx.key, {
		method: 'GET',
		query: {
			start_date: input.start_date,
			end_date: input.end_date,
			base: input.base,
			symbols: input.symbols,
		},
		schema: FixerEndpointOutputSchemas.ratesTimeseries,
	});

	await logEventFromContext(
		ctx,
		'fixer.rates.timeseries',
		{
			start_date: input.start_date,
			end_date: input.end_date,
			base: input.base,
			symbols: input.symbols,
		},
		'completed',
	);
	return response;
};

/**
 * Retrieves currency exchange rate fluctuation metrics (change and percentage change) over a date range.
 */
export const fluctuation: FixerEndpoints['ratesFluctuation'] = async (
	ctx,
	input,
) => {
	const response = await makeFixerRequest('fluctuation', ctx.key, {
		method: 'GET',
		query: {
			start_date: input.start_date,
			end_date: input.end_date,
			base: input.base,
			symbols: input.symbols,
		},
		schema: FixerEndpointOutputSchemas.ratesFluctuation,
	});

	await logEventFromContext(
		ctx,
		'fixer.rates.fluctuation',
		{
			start_date: input.start_date,
			end_date: input.end_date,
			base: input.base,
			symbols: input.symbols,
		},
		'completed',
	);
	return response;
};
