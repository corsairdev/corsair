import type {
	AlphaVantageCompany,
	AlphaVantageSymbolEntity,
} from '../schema/database';
import { AlphaVantageCompanyOverview } from '../schema/database';

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

/**
 * How many cache writes may be in flight at once.
 *
 * `LISTING_STATUS` returns every security Alpha Vantage covers — tens of
 * thousands of rows — and awaiting each write in turn makes that one call take
 * far longer than the request it followed. The cap keeps the improvement
 * without letting a single call flood the database with thousands of
 * simultaneous writes.
 */
const CACHE_WRITE_CONCURRENCY = 16;

/** Mirrors a Company Overview row under its `Symbol`. */
export async function cacheCompany(
	store: EntityStore<AlphaVantageCompany> | undefined,
	overview: unknown,
) {
	if (!store) return;
	const parsed = AlphaVantageCompanyOverview.safeParse(overview);
	if (!parsed.success) return;
	const symbol = parsed.data.Symbol;
	if (!symbol) return;
	await safely(
		() =>
			store.upsertByEntityId(symbol, {
				...parsed.data,
				fetchedAt: new Date(),
			}),
		`company ${symbol}`,
	);
}

/** Mirrors many securities, skipping rows with no ticker. */
export async function cacheSymbols(
	store: EntityStore<AlphaVantageSymbolEntity> | undefined,
	symbols: readonly (SymbolCandidate | undefined | null)[],
) {
	if (!store) return;

	for (let i = 0; i < symbols.length; i += CACHE_WRITE_CONCURRENCY) {
		const batch = symbols.slice(i, i + CACHE_WRITE_CONCURRENCY);
		// `cacheSymbol` swallows its own failures, so no write in a batch can
		// reject and abandon the rest.
		await Promise.all(batch.map((symbol) => cacheSymbol(store, symbol)));
	}
}
