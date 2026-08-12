import { z } from 'zod';

/**
 * Locally persisted Alpha Vantage entities.
 *
 * Alpha Vantage is a read-only market-data API: almost everything it returns is
 * a price or an indicator that is stale the moment it is stored, so caching it
 * would be actively harmful. Only the security reference data is persisted.
 *
 * `symbols` maps a ticker to its name, exchange and asset type. That mapping is
 * the identifier every other operation needs, it changes only when a security
 * lists or delists, and the free tier allows just 25 requests per day — so
 * resolving a ticker from cache instead of spending a request on
 * `SYMBOL_SEARCH` or the 1 MB `LISTING_STATUS` download is a real saving.
 *
 * Time series, quotes, fundamentals, commodities and economic indicators are
 * deliberately NOT stored.
 */

export const AlphaVantageSymbolEntity = z.object({
	/** Ticker as Alpha Vantage returns it, e.g. `IBM` or `TSCO.LON`. */
	symbol: z.string(),
	name: z.string().nullable().optional(),
	exchange: z.string().nullable().optional(),
	assetType: z.string().nullable().optional(),
	region: z.string().nullable().optional(),
	currency: z.string().nullable().optional(),
	ipoDate: z.string().nullable().optional(),
	delistingDate: z.string().nullable().optional(),
	/** `Active` or `Delisted` in `LISTING_STATUS`; absent from search results. */
	status: z.string().nullable().optional(),
});
export type AlphaVantageSymbolEntity = z.infer<typeof AlphaVantageSymbolEntity>;
