import { z } from 'zod';

/**
 * Locally persisted Alpha Vantage entities.
 *
 * Prices, indicators, news and transcripts go stale immediately, so they are
 * not stored. Only security identity and the Company Overview profile are
 * mirrored — both are the lookup keys every other operation needs, and the
 * free tier is 25 requests/day.
 *
 * Field names match the official JSON / CSV keys exactly.
 * Docs: https://www.alphavantage.co/documentation/
 */

const AvString = z.string().nullable().optional();

/**
 * Listing & Delisting Status CSV columns, plus Symbol Search extras.
 *
 * LISTING_STATUS (CSV header, live 2026-08-13):
 *   symbol, name, exchange, assetType, ipoDate, delistingDate, status
 *   https://www.alphavantage.co/documentation/#listing-status
 *
 * SYMBOL_SEARCH (`bestMatches[]`, live 2026-08-13):
 *   1. symbol, 2. name, 3. type, 4. region, 5. marketOpen,
 *   6. marketClose, 7. timezone, 8. currency, 9. matchScore
 *   https://www.alphavantage.co/documentation/#symbolsearch
 *
 * `3. type` is stored as `assetType` (same meaning as LISTING_STATUS).
 * `9. matchScore` is a search rank, not identity — not stored.
 */
export const AlphaVantageSymbolEntity = z.object({
	/** LISTING_STATUS `symbol` / SEARCH `1. symbol` / OVERVIEW `Symbol`. */
	symbol: z.string(),
	/** LISTING_STATUS `name` / SEARCH `2. name` / OVERVIEW `Name`. */
	name: AvString,
	/** LISTING_STATUS `exchange` / OVERVIEW `Exchange`. */
	exchange: AvString,
	/** LISTING_STATUS `assetType` / SEARCH `3. type` / OVERVIEW `AssetType`. */
	assetType: AvString,
	/** LISTING_STATUS `ipoDate`. */
	ipoDate: AvString,
	/**
	 * LISTING_STATUS `delistingDate`.
	 * Alpha Vantage writes the string `"null"` for a still-listed security;
	 * handlers store `null` instead.
	 */
	delistingDate: AvString,
	/** LISTING_STATUS `status`: `Active` or `Delisted`. */
	status: AvString,
	/** SEARCH `4. region`. */
	region: AvString,
	/** SEARCH `8. currency` / OVERVIEW `Currency`. */
	currency: AvString,
	/** SEARCH `5. marketOpen`. */
	marketOpen: AvString,
	/** SEARCH `6. marketClose`. */
	marketClose: AvString,
	/** SEARCH `7. timezone`. */
	timezone: AvString,
});
export type AlphaVantageSymbolEntity = z.infer<typeof AlphaVantageSymbolEntity>;

/**
 * Company Overview (`function=OVERVIEW`).
 *
 * Official: https://www.alphavantage.co/documentation/#company-overview
 * Live IBM 2026-08-13: every value is a string, including numerics.
 * Empty / `"None"` / missing fields are stored as-is — treat as null, not zero,
 * before calculations (agent docs + Alpha Vantage).
 *
 * Keys captured from live OVERVIEW (55):
 *   Symbol, AssetType, Name, Description, CIK, Exchange, Currency, Country,
 *   Sector, Industry, Address, OfficialSite, FiscalYearEnd, LatestQuarter,
 *   MarketCapitalization, EBITDA, PERatio, PEGRatio, BookValue,
 *   DividendPerShare, DividendYield, EPS, RevenuePerShareTTM, ProfitMargin,
 *   OperatingMarginTTM, ReturnOnAssetsTTM, ReturnOnEquityTTM, RevenueTTM,
 *   GrossProfitTTM, DilutedEPSTTM, QuarterlyEarningsGrowthYOY,
 *   QuarterlyRevenueGrowthYOY, AnalystTargetPrice, AnalystRatingStrongBuy,
 *   AnalystRatingBuy, AnalystRatingHold, AnalystRatingSell,
 *   AnalystRatingStrongSell, TrailingPE, ForwardPE, PriceToSalesRatioTTM,
 *   PriceToBookRatio, EVToRevenue, EVToEBITDA, Beta, 52WeekHigh, 52WeekLow,
 *   50DayMovingAverage, 200DayMovingAverage, SharesOutstanding, SharesFloat,
 *   PercentInsiders, PercentInstitutions, DividendDate, ExDividendDate
 */
export const AlphaVantageCompanyOverview = z.object({
	Symbol: z.string(),
	AssetType: AvString,
	Name: AvString,
	Description: AvString,
	CIK: AvString,
	Exchange: AvString,
	Currency: AvString,
	Country: AvString,
	Sector: AvString,
	Industry: AvString,
	Address: AvString,
	OfficialSite: AvString,
	FiscalYearEnd: AvString,
	LatestQuarter: AvString,
	MarketCapitalization: AvString,
	EBITDA: AvString,
	PERatio: AvString,
	PEGRatio: AvString,
	BookValue: AvString,
	DividendPerShare: AvString,
	DividendYield: AvString,
	EPS: AvString,
	RevenuePerShareTTM: AvString,
	ProfitMargin: AvString,
	OperatingMarginTTM: AvString,
	ReturnOnAssetsTTM: AvString,
	ReturnOnEquityTTM: AvString,
	RevenueTTM: AvString,
	GrossProfitTTM: AvString,
	DilutedEPSTTM: AvString,
	QuarterlyEarningsGrowthYOY: AvString,
	QuarterlyRevenueGrowthYOY: AvString,
	AnalystTargetPrice: AvString,
	AnalystRatingStrongBuy: AvString,
	AnalystRatingBuy: AvString,
	AnalystRatingHold: AvString,
	AnalystRatingSell: AvString,
	AnalystRatingStrongSell: AvString,
	TrailingPE: AvString,
	ForwardPE: AvString,
	PriceToSalesRatioTTM: AvString,
	PriceToBookRatio: AvString,
	EVToRevenue: AvString,
	EVToEBITDA: AvString,
	Beta: AvString,
	'52WeekHigh': AvString,
	'52WeekLow': AvString,
	'50DayMovingAverage': AvString,
	'200DayMovingAverage': AvString,
	SharesOutstanding: AvString,
	SharesFloat: AvString,
	PercentInsiders: AvString,
	PercentInstitutions: AvString,
	DividendDate: AvString,
	ExDividendDate: AvString,
});
export type AlphaVantageCompanyOverview = z.infer<
	typeof AlphaVantageCompanyOverview
>;

/** Cached Company Overview row, plus when it was written. */
export const AlphaVantageCompany = AlphaVantageCompanyOverview.extend({
	fetchedAt: z.coerce.date().nullable().optional(),
});
export type AlphaVantageCompany = z.infer<typeof AlphaVantageCompany>;
