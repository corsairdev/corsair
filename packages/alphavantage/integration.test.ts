/**
 * Live verification against the real Alpha Vantage API.
 *
 * This file is named to match the CI exclusion in `.github/workflows/
 * pr-checks.yml`, so it never runs without credentials, and it also skips
 * itself when `ALPHAVANTAGE_API_KEY` is absent.
 *
 *   ALPHAVANTAGE_API_KEY=<key> pnpm exec jest integration
 *
 * The free tier allows 25 requests per day, so this suite is deliberately
 * frugal: seven requests, each chosen to exercise a response shape that no
 * other request covers. Requests are paced at 1.2s.
 *
 * Every operation here is a read. Alpha Vantage has no write surface, so unlike
 * a CRUD provider there is nothing to create and nothing to clean up.
 */
import {
	Commodities,
	Forex,
	Fundamentals,
	Market,
	TimeSeries,
} from './endpoints';
import { AlphaVantageEndpointOutputSchemas as Outputs } from './endpoints/types';

const apiKey = process.env.ALPHAVANTAGE_API_KEY;
const describeLive = apiKey ? describe : describe.skip;

type Ctx = Parameters<typeof TimeSeries.daily>[0];

const upserts: { id: string; data: unknown }[] = [];

function makeCtx(): Ctx {
	return {
		key: apiKey ?? '',
		db: {
			symbols: {
				upsertByEntityId: async (id: string, data: unknown) => {
					upserts.push({ id, data });
				},
			},
			companies: {
				upsertByEntityId: async (id: string, data: unknown) => {
					upserts.push({ id, data });
				},
			},
		},
		database: undefined,
		$getAccountId: async () => 'integration-test',
	} as unknown as Ctx;
}

/** Alpha Vantage throttles short bursts; keep a gap between calls. */
const pace = () => new Promise((resolve) => setTimeout(resolve, 1200));

describeLive('Alpha Vantage live API', () => {
	let ctx: Ctx;

	beforeAll(() => {
		ctx = makeCtx();
	});

	afterEach(pace);

	it('returns a quote matching the declared schema', async () => {
		const result = await TimeSeries.globalQuote(ctx, { symbol: 'IBM' });

		expect(() => Outputs.timeSeriesGlobalQuote.parse(result)).not.toThrow();
		expect(result['Global Quote']['01. symbol']).toBe('IBM');
	});

	it('returns a daily series matching the declared schema', async () => {
		const result = await TimeSeries.daily(ctx, {
			symbol: 'IBM',
			outputsize: 'compact',
		});

		expect(() => Outputs.timeSeriesDaily.parse(result)).not.toThrow();

		// The series key is prose and varies by function, so locate it rather
		// than assuming its name.
		const seriesKey = Object.keys(result).find((key) => key !== 'Meta Data');
		expect(seriesKey).toBeDefined();
		const series = (result as Record<string, unknown>)[seriesKey ?? ''];
		expect(Object.keys(series as object).length).toBeGreaterThan(0);
	});

	it('returns a company overview and caches the symbol', async () => {
		upserts.length = 0;
		const result = await Fundamentals.companyOverview(ctx, { symbol: 'IBM' });

		expect(() =>
			Outputs.fundamentalsCompanyOverview.parse(result),
		).not.toThrow();
		expect(result.Symbol).toBe('IBM');
		expect(upserts.map((row) => row.id)).toEqual(['IBM', 'IBM']);
		expect(upserts[1]?.data).toEqual(
			expect.objectContaining({ Symbol: 'IBM' }),
		);
	});

	it('returns a currency exchange rate matching the declared schema', async () => {
		const result = await Forex.exchangeRate(ctx, {
			from_currency: 'USD',
			to_currency: 'JPY',
		});

		expect(() => Outputs.forexExchangeRate.parse(result)).not.toThrow();
		expect(
			result['Realtime Currency Exchange Rate']['5. Exchange Rate'],
		).toMatch(/^\d+(\.\d+)?$/);
	});

	it('returns the shared indicator envelope for a commodity', async () => {
		const result = await Commodities.wheat(ctx, { interval: 'monthly' });

		expect(() => Outputs.commoditiesWheat.parse(result)).not.toThrow();
		expect(result.data.length).toBeGreaterThan(0);
		expect(result.unit).toBeTruthy();
	});

	it('searches symbols and mirrors the matches into the cache', async () => {
		upserts.length = 0;
		const result = await Market.symbolSearch(ctx, { keywords: 'tesco' });

		expect(() => Outputs.marketSymbolSearch.parse(result)).not.toThrow();
		expect(result.bestMatches.length).toBeGreaterThan(0);
		expect(upserts.length).toBe(result.bestMatches.length);
	});

	it('reports an unknown ticker as not-found rather than returning an empty envelope', async () => {
		// Alpha Vantage answers this with {"Global Quote": {}} and HTTP 200; the
		// plugin is what turns it into an error.
		await expect(
			TimeSeries.globalQuote(ctx, { symbol: 'ZZZZ_NOT_A_REAL_TICKER' }),
		).rejects.toThrow(/returned no data for/);
	});
});
