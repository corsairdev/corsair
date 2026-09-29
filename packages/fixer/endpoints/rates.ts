import { logEventFromContext } from 'corsair/core';
import type { FixerEndpoints } from '..';
import { makeFixerRequest } from '../client';
import {
	RatesConvertInputSchema,
	RatesConvertOutputSchema,
	RatesHistoricalInputSchema,
	RatesHistoricalOutputSchema,
	RatesLatestInputSchema,
	RatesLatestOutputSchema,
} from './types';

export const latest: FixerEndpoints['ratesLatest'] = async (ctx, rawInput) => {
	const input = RatesLatestInputSchema.parse(rawInput);
	const response = RatesLatestOutputSchema.parse(
		await makeFixerRequest<unknown>('latest', ctx.key, {
			method: 'GET',
			query: {
				base: input.base,
				symbols: input.symbols?.join(','),
			},
		}),
	);

	await logEventFromContext(
		ctx,
		'fixer.rates.latest',
		{
			base: input.base ?? 'EUR',
			symbols: input.symbols,
		},
		'completed',
	);

	return response;
};

export const convert: FixerEndpoints['ratesConvert'] = async (
	ctx,
	rawInput,
) => {
	const input = RatesConvertInputSchema.parse(rawInput);
	const response = RatesConvertOutputSchema.parse(
		await makeFixerRequest<unknown>('convert', ctx.key, {
			method: 'GET',
			query: {
				from: input.from,
				to: input.to,
				amount: input.amount,
				date: input.date,
			},
		}),
	);

	await logEventFromContext(
		ctx,
		'fixer.rates.convert',
		{
			from: input.from,
			to: input.to,
			amount: input.amount,
		},
		'completed',
	);

	return response;
};

export const historical: FixerEndpoints['ratesHistorical'] = async (
	ctx,
	rawInput,
) => {
	const input = RatesHistoricalInputSchema.parse(rawInput);
	const response = RatesHistoricalOutputSchema.parse(
		await makeFixerRequest<unknown>(input.date, ctx.key, {
			method: 'GET',
			query: {
				base: input.base,
				symbols: input.symbols?.join(','),
			},
		}),
	);

	await logEventFromContext(
		ctx,
		'fixer.rates.historical',
		{
			date: input.date,
			base: input.base ?? 'EUR',
			symbols: input.symbols,
		},
		'completed',
	);

	return response;
};
