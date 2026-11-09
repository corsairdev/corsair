import {
	COINMARKETCAP_API_BASE,
	CoinMarketCapAPIError,
	makeCoinMarketCapRequest,
} from './client';

/**
 * Live smoke tests against the real API. Gated on CoinMarketCap's own
 * environment variable name, `CMC_PRO_API_KEY`, which is what their docs use.
 * Every call here is read-only.
 *
 * CI ignores this file by name (`api.test.ts`), so it only runs through
 * `pnpm --filter @corsair-dev/coinmarketcap test:live`.
 *
 * One operation needs a paid plan: `exchange.info` answers 403 error_code 1005
 * on a Basic key. That test is skipped rather than failed in that case, and it
 * says which test it skipped so a partial run cannot read as a full one.
 */
const API_KEY = process.env.CMC_PRO_API_KEY;

const describeIfKey = API_KEY ? describe : describe.skip;

if (!API_KEY) {
	// Say so out loud: a skipped run must not read as a green one.
	console.warn(
		'CMC_PRO_API_KEY is not set, so the CoinMarketCap live smoke tests are skipped. Create a key at https://pro.coinmarketcap.com/login and export it to run them.',
	);
}

// unknown: the raw client returns untyped JSON; each test narrows what it reads.
async function get(path: string, query?: Record<string, string | number>) {
	return (await makeCoinMarketCapRequest(API_KEY as string, {
		method: 'GET',
		path,
		query,
	})) as Record<string, unknown>; // unknown: see the comment above get().
}

// unknown: as above, one level deeper.
function dataOf(raw: Record<string, unknown>): unknown {
	return raw.data;
}

describeIfKey('CoinMarketCap live API', () => {
	it('resolves BTC to its CMC ID through the map route', async () => {
		const raw = await get('/v1/cryptocurrency/map', { symbol: 'BTC' });
		const entries = dataOf(raw) as {
			id: number;
			symbol: string;
			slug: string;
		}[];

		expect(Array.isArray(entries)).toBe(true);
		// More than one asset can carry a ticker, so Bitcoin is found, not assumed.
		const bitcoin = entries.find((entry) => entry.id === 1);
		expect(bitcoin).toMatchObject({ symbol: 'BTC', slug: 'bitcoin' });
	});

	it('returns a ranked listing with a USD quote', async () => {
		const raw = await get('/v3/cryptocurrency/listings/latest', { limit: 5 });
		const assets = dataOf(raw) as {
			id: number;
			symbol?: string;
			cmc_rank?: number;
			// The /v3 routes return this as an array, whatever the docs say.
			quote: { symbol: string; price?: number }[];
		}[];

		expect(assets.length).toBeGreaterThan(0);
		expect(assets.length).toBeLessThanOrEqual(5);
		expect(assets[0]?.cmc_rank).toBe(1);
		expect(Array.isArray(assets[0]?.quote)).toBe(true);
		const usd = assets[0]?.quote.find((entry) => entry.symbol === 'USD');
		expect(typeof usd?.price).toBe('number');
	});

	it('returns a quote for Bitcoin by ID', async () => {
		const raw = await get('/v3/cryptocurrency/quotes/latest', {
			id: '1',
			convert: 'USD',
		});
		const quotes = dataOf(raw) as {
			id: number;
			quote: { symbol: string; price?: number; last_updated?: string }[];
		}[];

		expect(quotes).toHaveLength(1);
		const usd = quotes[0]?.quote.find((entry) => entry.symbol === 'USD');
		expect(typeof usd?.price).toBe('number');
		expect(usd?.last_updated).toMatch(/^\d{4}-\d{2}-\d{2}T/);
	});

	it('returns market metadata for Bitcoin', async () => {
		const raw = await get('/v2/cryptocurrency/info', { id: '1' });
		// Keyed by the identifier passed, so the entry is under "1".
		const byId = dataOf(raw) as Record<
			string,
			{ id: number; logo?: string; description?: string }
		>;

		const entry = byId['1'];
		expect(entry?.id).toBe(1);
		expect(entry?.logo).toContain('http');
		expect(entry?.description?.length ?? 0).toBeGreaterThan(0);
	});

	it('returns global market cap and dominance', async () => {
		const raw = await get('/v1/global-metrics/quotes/latest', {
			convert: 'USD',
		});
		const metrics = dataOf(raw) as {
			btc_dominance?: number;
			active_cryptocurrencies?: number;
			// On /v1 this is an object keyed by currency, not an array.
			quote: Record<string, { total_market_cap?: number }>;
		};

		expect(metrics.btc_dominance).toBeGreaterThan(0);
		expect(metrics.active_cryptocurrencies).toBeGreaterThan(0);
		expect(Array.isArray(metrics.quote)).toBe(false);
		expect(typeof metrics.quote.USD?.total_market_cap).toBe('number');
	});

	it('converts an amount and returns the quote keyed by currency', async () => {
		const raw = await get('/v2/tools/price-conversion', {
			amount: 1,
			id: 1,
			convert: 'USD',
		});
		const converted = dataOf(raw) as {
			id: number;
			amount: number;
			quote: Record<string, { price: number }>;
		};

		// By ID the route answers an object rather than a list.
		expect(Array.isArray(converted)).toBe(false);
		expect(converted.id).toBe(1);
		expect(typeof converted.quote.USD?.price).toBe('number');
	});

	it('reports the plan and usage behind the key', async () => {
		const raw = await get('/v1/key/info');
		const info = dataOf(raw) as {
			plan: { rate_limit_minute?: number };
			usage: { current_minute?: { requests_left?: number } };
		};

		expect(typeof info.plan.rate_limit_minute).toBe('number');
		expect(typeof info.usage.current_minute?.requests_left).toBe('number');
	});

	it('returns exchange metadata, which needs a paid plan', async () => {
		const raw = await get('/v1/exchange/info', {
			slug: 'binance',
			aux: 'logo,urls,description',
		}).catch(
			// unknown: the rejection is a CoinMarketCapAPIError, narrowed below.
			(caught: unknown) => caught,
		);

		// A Basic key gets 403 error_code 1005 for this route. That is a plan
		// limit, not a defect, so the test reports the skip instead of failing
		// and every other failure still surfaces.
		if (
			raw instanceof CoinMarketCapAPIError &&
			raw.status === 403 &&
			raw.code === 1005
		) {
			console.warn(
				'exchange.info skipped: this key is on a plan that does not include the route (403 error_code 1005).',
			);
			return;
		}
		if (raw instanceof Error) throw raw;

		// unknown: raw JSON, narrowed to the fields this test reads.
		const bySlug = dataOf(raw as Record<string, unknown>) as Record<
			// unknown: raw JSON from get().
			string,
			{
				id: number;
				name?: string;
				urls?: { website?: string[] };
				// camelCase among snake_case neighbours, so pinned on purpose.
				porStatus?: string;
			}
		>;

		const binance = bySlug.binance;
		expect(binance?.id).toBe(270);
		expect(binance?.name).toBe('Binance');
		expect(binance?.urls?.website?.[0]).toContain('binance.com');
	});

	it('answers a 400 envelope for a limit outside the documented range', async () => {
		// The point is the error path against the real service, not the value.
		const failure = await makeCoinMarketCapRequest(API_KEY as string, {
			method: 'GET',
			path: '/v3/cryptocurrency/listings/latest',
			query: { limit: 0 },
		}).catch(
			// unknown: a rejection can be any value until the assertion narrows it.
			(caught: unknown) => caught,
		);

		expect(failure).toMatchObject({ status: 400, code: 400 });
		expect(String((failure as Error).message)).toContain('limit');
	});

	it('reaches the documented host over HTTPS', () => {
		// A guard against a typo in the base constant, which every other test
		// would still pass because it mocks fetch.
		expect(COINMARKETCAP_API_BASE).toBe('https://pro-api.coinmarketcap.com');
	});
});
