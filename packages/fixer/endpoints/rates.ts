import { logEventFromContext } from 'corsair/core';
import type { FixerEndpoints } from '..';
import { makeFixerRequest } from '../client';
import type { FixerEndpointOutputs } from './types';

export const latest: FixerEndpoints['ratesLatest'] = async (ctx, input) => {
	const response = await makeFixerRequest<FixerEndpointOutputs['ratesLatest']>(
		'latest',
		ctx.key,
		{
			method: 'GET',
			query: {
				base: input.base,
				symbols: input.symbols,
			},
		},
	);

	await logEventFromContext(
		ctx,
		'fixer.rates.latest',
		{ base: input.base, symbols: input.symbols },
		'completed',
	);
	return response;
};

export const historical: FixerEndpoints['ratesHistorical'] = async (
	ctx,
	input,
) => {
	const response = await makeFixerRequest<
		FixerEndpointOutputs['ratesHistorical']
	>(input.date, ctx.key, {
		method: 'GET',
		query: {
			base: input.base,
			symbols: input.symbols,
		},
	});

	await logEventFromContext(
		ctx,
		'fixer.rates.historical',
		{ date: input.date, base: input.base, symbols: input.symbols },
		'completed',
	);
	return response;
};

export const convert: FixerEndpoints['ratesConvert'] = async (ctx, input) => {
	const response = await makeFixerRequest<FixerEndpointOutputs['ratesConvert']>(
		'convert',
		ctx.key,
		{
			method: 'GET',
			query: {
				from: input.from,
				to: input.to,
				amount: input.amount,
				date: input.date,
			},
		},
	);

	await logEventFromContext(
		ctx,
		'fixer.rates.convert',
		{ from: input.from, to: input.to, amount: input.amount, date: input.date },
		'completed',
	);
	return response;
};

export const timeseries: FixerEndpoints['ratesTimeseries'] = async (
	ctx,
	input,
) => {
	const response = await makeFixerRequest<
		FixerEndpointOutputs['ratesTimeseries']
	>('timeseries', ctx.key, {
		method: 'GET',
		query: {
			start_date: input.start_date,
			end_date: input.end_date,
			base: input.base,
			symbols: input.symbols,
		},
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

export const fluctuation: FixerEndpoints['ratesFluctuation'] = async (
	ctx,
	input,
) => {
	const response = await makeFixerRequest<
		FixerEndpointOutputs['ratesFluctuation']
	>('fluctuation', ctx.key, {
		method: 'GET',
		query: {
			start_date: input.start_date,
			end_date: input.end_date,
			base: input.base,
			symbols: input.symbols,
		},
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
