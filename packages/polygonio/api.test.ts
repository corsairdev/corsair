// Live Polygon.io smoke tests. Excluded from the default run; run with:
//
//   POLYGONIO_API_KEY=... pnpm test:live
//
// Every test is a read, and every answer is parsed through the same output
// schema a caller receives, so a field typed wrongly cannot pass silently. A
// free key covers the market-status, reference and end-of-day routes only, so
// real-time snapshots stay out.
import { ApiError } from 'corsair/http';
import {
	isCredentialRejection,
	makePolygonioRequest,
	POLYGONIO_API_BASE,
} from './client';
import {
	ExchangeSchema,
	MarketHolidaySchema,
	PolygonioEndpointOutputSchemas,
	TickerSchema,
} from './endpoints/types';
import { captureError } from './test-helpers';

const LIVE_KEY = process.env.POLYGONIO_API_KEY ?? '';

if (LIVE_KEY.length === 0) {
	// Same check the gate prints, so a skipped run cannot read as a pass.
	console.warn('Skipping Polygon.io live tests: POLYGONIO_API_KEY is not set.');
}
const describeLive = LIVE_KEY.length > 0 ? describe : describe.skip;

describeLive('Polygon.io live API', () => {
	// The free Basic plan allows 5 calls a minute, and core's 429 retries give
	// up after about 7 seconds, so the suite spaces its calls instead.
	beforeEach(() => new Promise((resolve) => setTimeout(resolve, 13_000)));

	it('reads the current market status', async () => {
		const raw = await makePolygonioRequest(LIVE_KEY, {
			method: 'GET',
			path: '/v1/marketstatus/now',
		});
		const parsed = PolygonioEndpointOutputSchemas.marketStatus.parse(raw);

		// The API documents the market as open, closed, extended-hours or
		// early-close, so any value here is one of its own.
		expect(typeof parsed.market === 'string' || parsed.market === null).toBe(
			true,
		);
	});

	it('lists upcoming market holidays, which this route answers as a bare array', async () => {
		const raw = await makePolygonioRequest(LIVE_KEY, {
			method: 'GET',
			path: '/v1/marketstatus/upcoming',
		});
		const parsed = PolygonioEndpointOutputSchemas.marketHolidays.parse({
			holidays: raw,
		});

		expect(Array.isArray(parsed.holidays)).toBe(true);
		for (const holiday of parsed.holidays) {
			expect(MarketHolidaySchema.safeParse(holiday).success).toBe(true);
		}
	});

	it('lists tickers through the output schema', async () => {
		const raw = await makePolygonioRequest(LIVE_KEY, {
			method: 'GET',
			path: '/v3/reference/tickers',
			query: { market: 'stocks', limit: 5 },
		});
		const parsed = PolygonioEndpointOutputSchemas.tickersList.parse(raw);

		expect(Array.isArray(parsed.results)).toBe(true);
		// A row the docs print as `{ ticker, name, active, ... }` must parse, which
		// is what proves the schema matches the wire format.
		for (const ticker of parsed.results ?? []) {
			expect(TickerSchema.safeParse(ticker).success).toBe(true);
		}
	});

	it('reads one ticker overview', async () => {
		const raw = await makePolygonioRequest(LIVE_KEY, {
			method: 'GET',
			path: '/v3/reference/tickers/AAPL',
		});
		const parsed = PolygonioEndpointOutputSchemas.tickerOverview.parse(raw);

		expect(TickerSchema.safeParse(parsed.results).success).toBe(true);
	});

	it('lists exchanges with their MICs', async () => {
		const raw = await makePolygonioRequest(LIVE_KEY, {
			method: 'GET',
			path: '/v3/reference/exchanges',
			query: { asset_class: 'stocks', locale: 'us' },
		});
		const parsed = PolygonioEndpointOutputSchemas.exchanges.parse(raw);

		expect(Array.isArray(parsed.results)).toBe(true);
		for (const exchange of parsed.results ?? []) {
			expect(ExchangeSchema.safeParse(exchange).success).toBe(true);
		}
	});

	it('reads an end-of-day bar, which a free key may cover', async () => {
		// A range well in the past, so the end-of-day tier can serve it.
		const raw = await captureError(
			makePolygonioRequest(LIVE_KEY, {
				method: 'GET',
				path: '/v2/aggs/ticker/AAPL/range/1/day/2024-01-02/2024-01-05',
				query: { limit: 5 },
			}),
		);

		// HTTP failures arrive as core's ApiError, which the client passes through.
		if (raw instanceof ApiError && raw.status === 403) {
			// A plan that does not include aggregates is documented behaviour, not a
			// defect in the schema, so the run warns rather than failing on it.
			console.warn(
				'Skipping the end-of-day bar check: this plan does not include aggregates.',
			);
			return;
		}
		if (raw instanceof Error) throw raw;

		const parsed = PolygonioEndpointOutputSchemas.bars.parse(raw);
		// `results` is optional: a window with no qualifying trades omits it.
		expect(parsed.results === undefined || Array.isArray(parsed.results)).toBe(
			true,
		);
		const bars = parsed.results ?? [];
		if (bars.length > 0) {
			// The bar keys are the API's single letters, so a typo would fail here.
			expect(typeof bars[0]?.c).toBe('number');
			expect(typeof bars[0]?.t).toBe('number');
		}
	});

	it('rejects an unrecognised key as a credential failure', async () => {
		const error = await captureError(
			makePolygonioRequest('definitely-not-a-key', {
				method: 'GET',
				path: '/v1/marketstatus/now',
			}),
		);

		expect(error).toBeInstanceOf(ApiError);
		if (!(error instanceof ApiError)) return;
		expect(error.status).toBe(401);
		expect(isCredentialRejection(error.status, error.body)).toBe(true);
		// The key rode in the query string, so nothing may echo it back.
		expect(JSON.stringify(error)).not.toContain('definitely-not-a-key');
	});

	it('uses the host the plugin was named for', () => {
		expect(POLYGONIO_API_BASE).toBe('https://api.polygon.io');
	});
});
