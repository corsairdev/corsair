import { logEventFromContext } from 'corsair/core';
import { fixerGet, joinSymbols } from '../client';
import type { FixerEndpoints } from '../index';
import type { ExchangeRatesResponse } from './types';
import { FixerEndpointInputSchemas, FixerEndpointOutputSchemas } from './types';

async function cacheSnapshot(
	ctx: Parameters<FixerEndpoints['ratesLatest']>[0],
	result: ExchangeRatesResponse,
	symbols?: string[],
): Promise<void> {
	if (!ctx.db?.rates) {
		return;
	}
	// A filtered request only returns a subset of `rates`, so it must not
	// collide with (or overwrite) the full base:date snapshot's cache entry.
	const symbolsKey = joinSymbols(symbols);
	const entityId = symbolsKey
		? `${result.base}:${result.date}:${symbolsKey}`
		: `${result.base}:${result.date}`;
	try {
		await ctx.db.rates.upsertByEntityId(entityId, {
			base: result.base,
			date: result.date,
			timestamp: result.timestamp,
			rates: result.rates,
			captured_at: new Date(),
		});
	} catch (error) {
		console.warn(`[fixer] Failed to cache rates snapshot ${entityId}:`, error);
	}
}

export const latest: FixerEndpoints['ratesLatest'] = async (ctx, rawInput) => {
	const input = FixerEndpointInputSchemas.ratesLatest.parse(rawInput);

	const raw = await fixerGet<unknown>('/latest', ctx.key, {
		base: input.base,
		symbols: joinSymbols(input.symbols),
	});
	const result = FixerEndpointOutputSchemas.ratesLatest.parse(raw);

	await cacheSnapshot(ctx, result, input.symbols);

	await logEventFromContext(
		ctx,
		'fixer.rates.latest',
		{ base: input.base, symbols: input.symbols },
		'completed',
	);

	return result;
};
