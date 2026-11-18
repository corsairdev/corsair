import { logEventFromContext } from 'corsair/core';
import type { FixerEndpoints } from '..';
import { makeFixerRequest } from '../client';
import type { RatesHistoricalOutput, RatesLatestOutput } from './types';
import {
	RatesConvertInputSchema,
	RatesConvertOutputSchema,
	RatesHistoricalInputSchema,
	RatesHistoricalOutputSchema,
	RatesLatestInputSchema,
	RatesLatestOutputSchema,
} from './types';

async function saveSnapshot(
	ctx: Parameters<FixerEndpoints['ratesLatest']>[0],
	response: RatesLatestOutput | RatesHistoricalOutput,
	requestedBase: string | undefined,
	historical: boolean,
) {
	if (!ctx.db.rates || !response.date) {
		return;
	}
	const base = response.base ?? requestedBase ?? 'EUR';
	try {
		const entityId = `${base}:${response.date}`;
		const existing = await ctx.db.rates.findByEntityId(entityId);
		const timestamp = 'timestamp' in response ? response.timestamp : undefined;
		const sameSnapshot =
			existing !== null &&
			(existing.data.timestamp ?? null) === (timestamp ?? null);
		await ctx.db.rates.upsertByEntityId(entityId, {
			base,
			date: response.date,
			timestamp,
			historical,
			rates: sameSnapshot
				? { ...existing.data.rates, ...response.rates }
				: response.rates,
		});
	} catch (error) {
		console.warn('Failed to save rates to database:', error);
	}
}

export const latest: FixerEndpoints['ratesLatest'] = async (ctx, rawInput) => {
	const input = RatesLatestInputSchema.parse(rawInput);
	const response = RatesLatestOutputSchema.parse(
		await makeFixerRequest('latest', ctx.key, {
			base: input.base,
			symbols: input.symbols?.join(','),
		}),
	);

	await saveSnapshot(ctx, response, input.base, false);

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
		await makeFixerRequest('convert', ctx.key, {
			from: input.from,
			to: input.to,
			amount: input.amount,
			date: input.date,
		}),
	);

	if (ctx.db.conversions && response.info) {
		try {
			await ctx.db.conversions.upsertByEntityId(
				`${input.from}:${input.to}:${input.amount}:${input.date ?? 'latest'}`,
				{
					from: input.from,
					to: input.to,
					amount: input.amount,
					rate: response.info.rate,
					result: response.result,
					timestamp: response.info.timestamp,
					date: response.date,
				},
			);
		} catch (error) {
			console.warn('Failed to save conversion to database:', error);
		}
	}

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
		await makeFixerRequest(input.date, ctx.key, {
			base: input.base,
			symbols: input.symbols?.join(','),
		}),
	);

	await saveSnapshot(ctx, response, input.base, true);

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
