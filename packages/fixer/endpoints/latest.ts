import { logEventFromContext } from 'corsair/core';
import { fixerGet, joinSymbols } from '../client';
import type { FixerEndpoints } from '../index';
import type { ExchangeRatesResponse } from './types';
import { FixerEndpointInputSchemas, FixerEndpointOutputSchemas } from './types';

async function cacheSnapshot(
	ctx: Parameters<FixerEndpoints['ratesLatest']>[0],
	result: ExchangeRatesResponse,
): Promise<void> {
	if (!ctx.db?.rates) {
		return;
	}
	try {
		await ctx.db.rates.upsertByEntityId(`${result.base}:${result.date}`, {
			base: result.base,
			date: result.date,
			timestamp: result.timestamp,
			rates: result.rates,
			captured_at: new Date(),
		});
	} catch (error) {
		console.warn(
			`[fixer] Failed to cache rates snapshot ${result.base}:${result.date}:`,
			error,
		);
	}
}

export const latest: FixerEndpoints['ratesLatest'] = async (ctx, rawInput) => {
	const input = FixerEndpointInputSchemas.ratesLatest.parse(rawInput);

	const raw = await fixerGet<unknown>('/latest', ctx.key, {
		base: input.base,
		symbols: joinSymbols(input.symbols),
	});
	const result = FixerEndpointOutputSchemas.ratesLatest.parse(raw);

	await cacheSnapshot(ctx, result);

	await logEventFromContext(
		ctx,
		'fixer.rates.latest',
		{ base: input.base, symbols: input.symbols },
		'completed',
	);

	return result;
};
