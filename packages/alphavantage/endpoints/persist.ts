import type { AlphaVantageSymbolEntity } from '../schema/database';

/**
 * Minimal structural view of a Corsair entity store. Only the operation the
 * Alpha Vantage endpoints need is declared, so the helper stays usable whatever
 * else the concrete store exposes.
 */
type EntityStore<T> = {
	upsertByEntityId: (entityId: string, data: T) => Promise<unknown>;
};

/**
 * Caching is best-effort: a plugin call must not fail because the local mirror
 * could not be written.
 */
async function safely(operation: () => Promise<unknown>, what: string) {
	try {
		await operation();
	} catch (error) {
		console.warn(`[ALPHAVANTAGE] failed to cache ${what}:`, error);
	}
}

/**
 * A candidate row on its way into the cache.
 *
 * The ticker is optional here even though the stored entity requires it: rows
 * arriving from a CSV download are typed as `Record<string, string>`, so a
 * malformed line can yield an undefined ticker. Rows without one are skipped
 * rather than pushed onto the caller to filter.
 */
type SymbolCandidate = Omit<AlphaVantageSymbolEntity, 'symbol'> & {
	symbol?: string | undefined;
};

/**
 * Mirrors one security's reference data into the local cache.
 *
 * Nothing here is ever evicted. Alpha Vantage has no delete semantics — a
 * security that stops trading is reported as `Delisted` by `LISTING_STATUS`
 * rather than disappearing — so the delisted row stays, with its status
 * updated, and remains useful for resolving historical tickers.
 */
export async function cacheSymbol(
	store: EntityStore<AlphaVantageSymbolEntity> | undefined,
	candidate: SymbolCandidate | undefined | null,
) {
	const ticker = candidate?.symbol;
	if (!store || !candidate || !ticker) return;
	await safely(
		() => store.upsertByEntityId(ticker, { ...candidate, symbol: ticker }),
		`symbol ${ticker}`,
	);
}

/** Mirrors many securities, skipping rows with no ticker. */
export async function cacheSymbols(
	store: EntityStore<AlphaVantageSymbolEntity> | undefined,
	symbols: readonly (SymbolCandidate | undefined | null)[],
) {
	if (!store) return;
	for (const symbol of symbols) {
		await cacheSymbol(store, symbol);
	}
}
