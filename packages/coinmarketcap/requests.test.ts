import { logEventFromContext } from 'corsair/core';
import { CoinMarketCapAPIError } from './client';
import {
	exchangeInfo,
	globalMetrics,
	info,
	keyInfo,
	listings,
	map,
	priceConversion,
	quotes,
} from './endpoints';
import type { ListingsLatestResponse } from './endpoints/types';
import {
	conversionByIdResponse,
	conversionBySymbolResponse,
	errorResponse,
	exchangeInfoResponse,
	globalResponse,
	infoResponse,
	infoResponseBySymbol,
	keyInfoResponse,
	listingsResponse,
	mapResponse,
	quotesResponse,
	unknownRouteResponse,
	v2Status,
} from './test-fixtures';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn().mockResolvedValue(null),
}));

const mockLog = jest.mocked(logEventFromContext);
const API_KEY = 'cmc-test-key';

// never parameters: every concrete endpoint is assignable to this because
// parameters are contravariant. Each endpoint returns its own output type, so
// the shared return is unknown.
// unknown: each endpoint returns its own output type, so the shared return is unknown.
type AnyEndpoint = (ctx: never, input: never) => Promise<unknown>;

// unknown: negative cases pass values no schema accepts.
function invoke(endpoint: AnyEndpoint, input: unknown) {
	// Safe: the fake context only carries what the endpoints read (ctx.key).
	return endpoint({ key: API_KEY } as never, input as never);
}

let fetchMock: jest.SpyInstance;

// unknown: response bodies are arbitrary JSON.
function respond(body: unknown, status = 200) {
	fetchMock.mockResolvedValueOnce(
		new Response(JSON.stringify(body), {
			status,
			headers: { 'Content-Type': 'application/json' },
		}),
	);
}

function lastRequest() {
	const [url, init] = fetchMock.mock.calls.at(-1) as [string, RequestInit];
	const parsed = new URL(url);
	return {
		origin: parsed.origin,
		path: parsed.pathname,
		query: Object.fromEntries(parsed.searchParams),
		method: init.method,
		headers: new Headers(init.headers),
	};
}

function expectAuthenticated(path: string) {
	const sent = lastRequest();
	expect(sent.origin).toBe('https://pro-api.coinmarketcap.com');
	expect(sent.path).toBe(path);
	expect(sent.method).toBe('GET');
	expect(sent.headers.get('x-cmc_pro_api_key')).toBe(API_KEY);
	expect(sent.headers.get('authorization')).toBeNull();
}

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch');
	mockLog.mockClear();
});

afterEach(() => {
	fetchMock.mockRestore();
});

describe('cryptocurrency.listings', () => {
	it('defaults the limit the route would otherwise default to 100', async () => {
		respond(listingsResponse);

		await invoke(listings, {});

		expectAuthenticated('/v3/cryptocurrency/listings/latest');
		// Sent explicitly, so the documented default is what the caller asked
		// for rather than an omission the API fills in.
		expect(lastRequest().query).toEqual({ limit: '100' });
	});

	it('sends filters, sort and pagination as query parameters', async () => {
		respond(listingsResponse);

		await invoke(listings, {
			start: 101,
			limit: 50,
			price_min: 1,
			price_max: 10.5,
			market_cap_min: 1_000_000,
			volume_24h_min: 1_000_000_000,
			circulating_supply_max: 21_000_000,
			percent_change_24h_min: -5,
			sort: 'percent_change_24h',
			sort_dir: 'desc',
			cryptocurrency_type: 'tokens',
			tag: 'defi',
			aux: 'platform,tags',
		});

		expect(lastRequest().query).toMatchObject({
			start: '101',
			limit: '50',
			price_min: '1',
			price_max: '10.5',
			market_cap_min: '1000000',
			volume_24h_min: '1000000000',
			circulating_supply_max: '21000000',
			percent_change_24h_min: '-5',
			sort: 'percent_change_24h',
			sort_dir: 'desc',
			cryptocurrency_type: 'tokens',
			tag: 'defi',
			aux: 'platform,tags',
		});
	});

	it('joins an array of quote currencies into one comma-separated value', async () => {
		respond(listingsResponse);

		await invoke(listings, { limit: 1, convert: ['USD', 'EUR', 'BTC'] });

		expect(lastRequest().query.convert).toBe('USD,EUR,BTC');
	});

	it('rejects a limit outside 1-5000 before sending anything', async () => {
		// The API answers 400 "'limit' should be a positive number in range
		// [1, 5000]" for both of these.
		await expect(invoke(listings, { limit: 0 })).rejects.toThrow(/limit/i);
		await expect(invoke(listings, { limit: 5001 })).rejects.toThrow(/limit/i);
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('rejects a sort the API does not document', async () => {
		await expect(invoke(listings, { sort: 'PRICE' })).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('returns the assets and keeps the status object', async () => {
		respond(listingsResponse);

		const result = (await invoke(listings, {})) as {
			assets: { symbol?: string | null }[];
			status?: { credit_count?: number };
		};

		expect(result.assets).toHaveLength(1);
		expect(result.assets[0]?.symbol).toBe('BTC');
		expect(result.status?.credit_count).toBe(1);
		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'coinmarketcap.cryptocurrency.listings',
			expect.objectContaining({ count: 1 }),
			'completed',
		);
	});

	it('types the price so a caller can read it without a cast', async () => {
		respond(listingsResponse);

		const result = (await invoke(listings, {})) as ListingsLatestResponse;

		// `quote` is declared on the asset, not left to `.loose()`, so this is
		// a typed read rather than an unknown one.
		const usd = result.assets[0]?.quote.find((entry) => entry.symbol === 'USD');
		expect(usd?.price).toBe(74630.75941364496);
		expect(usd?.market_cap).toBe(1500819646178.2788);
	});
});

describe('cryptocurrency.map', () => {
	it('sends the symbol list and no other option', async () => {
		respond(mapResponse);

		await invoke(map, { symbol: ['BTC', 'ETH'] });

		expectAuthenticated('/v1/cryptocurrency/map');
		expect(lastRequest().query).toEqual({ symbol: 'BTC,ETH' });
	});

	it('rejects symbol combined with options the API would ignore', async () => {
		// CoinMarketCap ignores the filter, paging and sort options when `symbol`
		// is set, so a paged lookup here would silently return the wrong rows.
		await expect(invoke(map, { symbol: ['BTC'], limit: 10 })).rejects.toThrow(
			/ignore limit/,
		);
		for (const ignored of [
			{ listing_status: ['inactive'] },
			{ start: 5 },
			{ sort: 'cmc_rank' },
		]) {
			await expect(
				invoke(map, { symbol: ['BTC'], ...ignored }),
			).rejects.toThrow(/ignore/);
		}
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('sends aux with a symbol, which the API does apply', async () => {
		// Live on 2026-11-10: ?symbol=BTC&aux=platform,status returned `status`
		// and dropped the default first_historical_data, so aux is honoured.
		respond(mapResponse);

		await invoke(map, { symbol: ['BTC'], aux: 'platform,status' });

		expect(lastRequest().query).toEqual({
			symbol: 'BTC',
			aux: 'platform,status',
		});
	});

	it('sends listing status and paging without a symbol', async () => {
		respond(mapResponse);

		await invoke(map, {
			listing_status: ['active', 'inactive'],
			start: 1,
			limit: 5000,
			sort: 'cmc_rank',
		});

		expect(lastRequest().query).toEqual({
			listing_status: 'active,inactive',
			start: '1',
			limit: '5000',
			sort: 'cmc_rank',
		});
	});

	it('rejects a start below 1 and a limit above 5000', async () => {
		await expect(invoke(map, { start: 0 })).rejects.toThrow();
		await expect(invoke(map, { limit: 5001 })).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('returns the mapped assets', async () => {
		respond(mapResponse);

		const result = (await invoke(map, { symbol: ['BTC'] })) as {
			cryptocurrencies: { id: number; slug?: string | null }[];
		};
		expect(result.cryptocurrencies).toEqual([
			expect.objectContaining({ id: 1, slug: 'bitcoin' }),
		]);
	});

	it('rejects a sort the API does not document', async () => {
		// The API answers: "sort" must be one of [cmc_rank, id].
		await expect(invoke(map, { sort: 'rank' })).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});
});

describe('cryptocurrency.quotes', () => {
	it('sends one identifier form at a time', async () => {
		respond(quotesResponse);

		await invoke(quotes, { id: ['1', '1027'], convert: ['USD'] });

		expectAuthenticated('/v3/cryptocurrency/quotes/latest');
		expect(lastRequest().query).toEqual({ id: '1,1027', convert: 'USD' });
	});

	it('rejects two identifier forms at once', async () => {
		// The API answers "'value' contains a conflict between exclusive peers
		// [id, symbol, slug, address]".
		await expect(
			invoke(quotes, { id: ['1'], symbol: ['BTC'] }),
		).rejects.toThrow(/only one/);
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('rejects a call with no identifier at all', async () => {
		// The API answers "'value' must contain at least one of [id, symbol, slug]".
		await expect(invoke(quotes, {})).rejects.toThrow(/Pass one of/);
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('returns quotes with the array-shaped quote field', async () => {
		respond(quotesResponse);

		const result = (await invoke(quotes, { symbol: ['BTC'] })) as {
			quotes: { quote: { price?: number | null; symbol?: string }[] }[];
		};

		expect(result.quotes).toHaveLength(1);
		expect(result.quotes[0]?.quote[0]?.symbol).toBe('USD');
		expect(result.quotes[0]?.quote[0]?.price).toBe(74630.75941364496);
	});

	it('passes skip_invalid through as a string', async () => {
		respond(quotesResponse);

		await invoke(quotes, { id: ['1'], skip_invalid: true });

		expect(lastRequest().query.skip_invalid).toBe('true');
	});
});

describe('cryptocurrency.info', () => {
	it('flattens a lookup keyed by id', async () => {
		respond(infoResponse);

		const result = (await invoke(info, { id: ['1'] })) as {
			cryptocurrencies: { id: number; lookup_key: string }[];
		};

		expectAuthenticated('/v2/cryptocurrency/info');
		expect(result.cryptocurrencies).toHaveLength(1);
		expect(result.cryptocurrencies[0]?.lookup_key).toBe('1');
		expect(result.cryptocurrencies[0]?.id).toBe(1);
	});

	it('flattens the array a symbol lookup returns per key', async () => {
		respond(infoResponseBySymbol);

		const result = (await invoke(info, { symbol: ['BTC'] })) as {
			cryptocurrencies: { id: number; lookup_key: string }[];
		};

		// Two assets share the BTC ticker, and both keep the key they arrived under.
		expect(result.cryptocurrencies).toHaveLength(2);
		expect(result.cryptocurrencies.map((entry) => entry.id)).toEqual([
			1, 38552,
		]);
		expect(
			result.cryptocurrencies.every((entry) => entry.lookup_key === 'BTC'),
		).toBe(true);
	});

	it('accepts a token, whose platform id arrives as a string', async () => {
		// Live on 2026-11-10: /v2/cryptocurrency/info sends platform.id as a
		// string ("1027") for every token, while /v1/cryptocurrency/map and the
		// /v3 routes send a number.
		respond({
			data: {
				'825': {
					...infoResponse.data['1'],
					id: 825,
					name: 'Tether USDt',
					symbol: 'USDT',
					slug: 'tether',
					category: 'token',
					platform: {
						id: '1027',
						name: 'Ethereum',
						symbol: 'ETH',
						slug: 'ethereum',
						token_address: '0xdac17f958d2ee523a2206206994597c13d831ec7',
					},
				},
			},
			status: v2Status,
		});

		const result = (await invoke(info, { slug: ['tether'] })) as {
			cryptocurrencies: {
				id: number;
				platform?: { id?: number | string | null } | null;
			}[];
		};

		expect(result.cryptocurrencies).toHaveLength(1);
		expect(result.cryptocurrencies[0]?.id).toBe(825);
		expect(result.cryptocurrencies[0]?.platform?.id).toBe('1027');
	});

	it('sends skip_invalid as a real boolean, unlike every other route', async () => {
		respond(infoResponse);

		await invoke(info, { slug: ['bitcoin'], skip_invalid: true });

		expect(lastRequest().query).toEqual({
			slug: 'bitcoin',
			skip_invalid: 'true',
		});
	});

	it('rejects a call with no identifier', async () => {
		await expect(invoke(info, {})).rejects.toThrow(/Pass one of/);
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('rejects two identifier forms at once', async () => {
		await expect(invoke(info, { id: ['1'], address: '0xabc' })).rejects.toThrow(
			/only one/,
		);
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('returns description, logo and urls', async () => {
		respond(infoResponse);

		const result = (await invoke(info, { id: ['1'] })) as {
			cryptocurrencies: {
				logo?: string | null;
				description?: string | null;
				urls?: { website?: string[] | null };
			}[];
		};

		expect(result.cryptocurrencies[0]?.logo).toContain('1.png');
		expect(result.cryptocurrencies[0]?.description).toContain('Bitcoin');
		expect(result.cryptocurrencies[0]?.urls?.website).toEqual([
			'https://bitcoin.org/',
		]);
	});
});

describe('globalMetrics.quotes', () => {
	it('sends a convert list and returns the metrics', async () => {
		respond(globalResponse);

		const result = (await invoke(globalMetrics, {
			convert: ['USD'],
		})) as {
			metrics: {
				btc_dominance?: number | null;
				quote: Record<string, { total_market_cap?: number | null }>;
			};
		};

		expectAuthenticated('/v1/global-metrics/quotes/latest');
		expect(lastRequest().query).toEqual({ convert: 'USD' });
		expect(result.metrics.btc_dominance).toBe(60.1103);
		expect(result.metrics.quote.USD?.total_market_cap).toBe(2496777249345.1523);
	});

	it('sends no query at all when no currency is asked for', async () => {
		respond(globalResponse);

		await invoke(globalMetrics, {});

		expect(lastRequest().query).toEqual({});
	});
});

describe('tools.priceConversion', () => {
	it('wraps the single object an id lookup returns into a list', async () => {
		respond(conversionByIdResponse);

		const result = (await invoke(priceConversion, {
			amount: 2,
			id: 1,
			convert: ['USD'],
		})) as {
			conversions: {
				id: number;
				quote: Record<string, { price: number }>;
			}[];
		};

		expectAuthenticated('/v2/tools/price-conversion');
		expect(lastRequest().query).toEqual({
			amount: '2',
			id: '1',
			convert: 'USD',
		});
		// One entry, not an object the caller has to detect.
		expect(result.conversions).toHaveLength(1);
		expect(result.conversions[0]?.quote.USD?.price).toBe(149261.51882728992);
	});

	it('keeps every entry of a symbol lookup', async () => {
		respond(conversionBySymbolResponse);

		const result = (await invoke(priceConversion, {
			amount: 1,
			symbol: 'BTC',
			convert: ['USD'],
		})) as { conversions: { id: number }[] };

		expect(result.conversions).toHaveLength(2);
		expect(result.conversions.map((entry) => entry.id)).toEqual([1, 38552]);
	});

	it('keeps a same-ticker asset that has no price', async () => {
		// Live on 2026-11-10: 5 of the 14 assets sharing the BTC ticker came back
		// as `quote: { USD: { price: null } }` with no last_updated.
		respond({
			data: [
				...conversionBySymbolResponse.data,
				{
					id: 30938,
					symbol: 'BTC',
					name: 'Satoshi Pumpomoto',
					amount: 1,
					quote: { USD: { price: null } },
				},
			],
			status: v2Status,
		});

		const result = (await invoke(priceConversion, {
			amount: 1,
			symbol: 'BTC',
			convert: ['USD'],
		})) as {
			conversions: {
				id: number;
				quote: Record<string, { price?: number | null }>;
			}[];
		};

		expect(result.conversions.map((entry) => entry.id)).toEqual([
			1, 38552, 30938,
		]);
		expect(result.conversions[0]?.quote.USD?.price).toBe(74600.20213964285);
		expect(result.conversions[2]?.quote.USD?.price).toBeNull();
	});

	it('rejects both identifier forms and neither', async () => {
		// The API answers "'value' must contain at least one of [id, symbol]"
		// and, for both, a conflict between exclusive peers.
		await expect(
			invoke(priceConversion, { amount: 1, id: 1, symbol: 'BTC' }),
		).rejects.toThrow(/only one/);
		await expect(invoke(priceConversion, { amount: 1 })).rejects.toThrow(
			/Pass one of/,
		);
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('rejects a comma-separated id list, which the route refuses', async () => {
		// The API answers "\"id\" should only include a single numeric
		// CoinMarketCap cryptocurrency id".
		await expect(
			invoke(priceConversion, { amount: 1, id: '1,1027' }),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('requires an amount', async () => {
		await expect(invoke(priceConversion, { id: 1 })).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});
});

describe('exchange.info', () => {
	it('sends a slug list to the exchange route', async () => {
		respond(exchangeInfoResponse);

		const result = (await invoke(exchangeInfo, {
			slug: ['binance'],
		})) as { exchanges: { lookup_key: string; name?: string | null }[] };

		expectAuthenticated('/v1/exchange/info');
		expect(lastRequest().query).toEqual({ slug: 'binance' });
		expect(result.exchanges[0]?.lookup_key).toBe('binance');
		expect(result.exchanges[0]?.name).toBe('Binance');
	});

	it('rejects a call with neither id nor slug', async () => {
		await expect(invoke(exchangeInfo, {})).rejects.toThrow(/Pass one of/);
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('rejects both identifier forms at once', async () => {
		await expect(
			invoke(exchangeInfo, { id: ['270'], slug: ['binance'] }),
		).rejects.toThrow(/only one/);
		expect(fetchMock).not.toHaveBeenCalled();
	});
});

describe('key.info', () => {
	it('takes no input and returns plan and usage', async () => {
		respond(keyInfoResponse);

		const result = (await invoke(keyInfo, {})) as {
			plan: { rate_limit_minute?: number | null };
			usage: { current_minute?: { requests_left?: number | null } };
		};

		expectAuthenticated('/v1/key/info');
		expect(lastRequest().query).toEqual({});
		expect(result.plan.rate_limit_minute).toBe(30);
		expect(result.usage.current_minute?.requests_left).toBe(29);
	});

	it('ignores unknown input keys rather than sending them', async () => {
		respond(keyInfoResponse);

		await invoke(keyInfo, { unexpected: 'value' });

		expect(lastRequest().query).toEqual({});
	});
});

describe('a 200 body that reports a failure', () => {
	it('throws instead of returning an empty result', async () => {
		// The /v3 catch-all answers HTTP 200 with error_code "500" for a route
		// it does not serve, so a 2xx is not proof the call worked.
		respond(unknownRouteResponse);

		await expect(invoke(listings, {})).rejects.toBeInstanceOf(
			CoinMarketCapAPIError,
		);
		expect(mockLog).not.toHaveBeenCalled();
	});

	it('throws with the provider message', async () => {
		respond(unknownRouteResponse);

		const error = (await invoke(listings, {}).catch(
			// unknown: a rejection can be any value until the instanceof narrows it.
			(caught: unknown) => caught,
		)) as CoinMarketCapAPIError;

		expect(error.code).toBe(500);
		expect(error.message).toContain('The system is busy');
	});
});

describe('an empty result against a present envelope', () => {
	it('returns an empty list for data: [], which the API really sends', async () => {
		// Verified live: a listings filter that matches nothing answers HTTP 200
		// with data: [] and error_code "0". That is a real empty page.
		respond({
			data: [],
			status: {
				timestamp: '2026-11-09T15:11:10.762Z',
				error_code: '0',
				error_message: '',
				elapsed: 6,
				credit_count: 1,
			},
		});

		const result = (await invoke(listings, {
			price_min: 999_999_999,
			limit: 5,
		})) as ListingsLatestResponse;

		expect(result.assets).toEqual([]);
		expect(result.status?.credit_count).toBe(1);
	});

	it('throws when the envelope carries no data field at all', async () => {
		// A body with a success status and no data is malformed. Returning [] here
		// would make a broken response look like a genuine empty page.
		respond({
			status: {
				timestamp: '2026-11-09T15:11:10.762Z',
				error_code: '0',
				error_message: '',
				elapsed: 6,
				credit_count: 0,
			},
		});

		await expect(invoke(listings, { limit: 5 })).rejects.toBeInstanceOf(
			CoinMarketCapAPIError,
		);
	});

	it('throws for the same reason on the quotes route', async () => {
		respond({ status: { error_code: '0', error_message: '' } });

		await expect(invoke(quotes, { id: ['1'] })).rejects.toBeInstanceOf(
			CoinMarketCapAPIError,
		);
	});

	it('throws on a conversion that carries no data', async () => {
		respond({ status: { error_code: 0, error_message: null } });

		await expect(
			invoke(priceConversion, { amount: 1, id: 1 }),
		).rejects.toBeInstanceOf(CoinMarketCapAPIError);
	});
});

describe('an HTTP error', () => {
	it('surfaces as CoinMarketCapAPIError with the status and code', async () => {
		respond(errorResponse, 400);

		const error = (await invoke(map, { limit: 1 }).catch(
			// unknown: as above.
			(caught: unknown) => caught,
		)) as CoinMarketCapAPIError;

		expect(error).toBeInstanceOf(CoinMarketCapAPIError);
		expect(error.status).toBe(400);
		expect(error.code).toBe(400);
		expect(mockLog).not.toHaveBeenCalled();
	});
});
