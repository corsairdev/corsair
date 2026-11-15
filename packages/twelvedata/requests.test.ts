import { TwelveDataAPIError } from './client';
import {
	IndicatorsEndpoints,
	MarketEndpoints,
	ReferenceEndpoints,
} from './endpoints';
import {
	apiUsage,
	badKey,
	bondsList,
	cryptoList,
	etfList,
	exchangeRate,
	exchangesList,
	forexPairsList,
	fundsList,
	macdSeries,
	partialBatch,
	price,
	quote,
	rsiSeries,
	stocksList,
	symbolNotFound,
	timeSeries,
} from './test-fixtures';
import { captureError, invoke } from './test-helpers';

let fetchMock: jest.SpyInstance;

// unknown: response bodies are arbitrary JSON; each test passes its own.
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
		params: Object.fromEntries(parsed.searchParams),
		method: init.method,
	};
}

function expectAuthenticated() {
	const sent = lastRequest();
	expect(sent.origin).toBe('https://api.twelvedata.com');
	expect(sent.params.apikey).toBe('td-test-key');
}

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch');
});

afterEach(() => {
	fetchMock.mockRestore();
});

describe('market data', () => {
	it('market.quote GETs /quote with the symbol', async () => {
		respond(quote);

		const result = (await invoke(MarketEndpoints.quote, {
			symbol: 'AAPL',
			exchange: 'NASDAQ',
		})) as { symbol?: string | null; close?: string | null };

		expectAuthenticated();
		expect(lastRequest()).toMatchObject({ path: '/quote', method: 'GET' });
		expect(lastRequest().params).toEqual({
			symbol: 'AAPL',
			exchange: 'NASDAQ',
			apikey: 'td-test-key',
		});
		expect(result.symbol).toBe('AAPL');
		// Every price is a decimal string, not a number.
		expect(result.close).toBe('211.00');
	});

	it('market.price GETs /price', async () => {
		respond(price);

		const result = (await invoke(MarketEndpoints.price, {
			symbol: 'AAPL',
		})) as { price?: string | null };

		expectAuthenticated();
		expect(lastRequest().path).toBe('/price');
		expect(result.price).toBe('211.66000');
	});

	it('market.timeSeries GETs /time_series with the interval and window', async () => {
		respond(timeSeries);

		const result = (await invoke(MarketEndpoints.timeSeries, {
			symbol: 'AAPL',
			interval: '1day',
			outputsize: 2,
			order: 'desc',
			start_date: '2026-04-30',
		})) as { values: unknown[]; status?: string | null };

		expectAuthenticated();
		expect(lastRequest().path).toBe('/time_series');
		expect(lastRequest().params).toEqual({
			symbol: 'AAPL',
			interval: '1day',
			outputsize: '2',
			order: 'desc',
			start_date: '2026-04-30',
			apikey: 'td-test-key',
		});
		expect(result.values).toHaveLength(2);
		expect(result.status).toBe('ok');
	});

	it('market.timeSeries rejects an interval the provider does not accept', async () => {
		const error = await captureError(
			invoke(MarketEndpoints.timeSeries, { symbol: 'AAPL', interval: '2min' }),
		);

		expect((error as Error).name).toBe('ZodError');
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('market.timeSeries rejects an outputsize above the documented maximum', async () => {
		const error = await captureError(
			invoke(MarketEndpoints.timeSeries, {
				symbol: 'AAPL',
				interval: '1day',
				outputsize: 5001,
			}),
		);

		expect((error as Error).name).toBe('ZodError');
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('market.exchangeRate GETs /exchange_rate', async () => {
		respond(exchangeRate);

		const result = (await invoke(MarketEndpoints.exchangeRate, {
			symbol: 'EUR/USD',
		})) as { rate?: string | null };

		expectAuthenticated();
		expect(lastRequest().path).toBe('/exchange_rate');
		expect(result.rate).toBe('1.08542');
	});

	it('market.apiUsage GETs /api_usage', async () => {
		respond(apiUsage);

		const result = (await invoke(MarketEndpoints.apiUsage, {})) as {
			current_usage?: number | null;
		};

		expectAuthenticated();
		expect(lastRequest().path).toBe('/api_usage');
		expect(result.current_usage).toBe(42);
	});
});

describe('reference data', () => {
	it('reference.stocks GETs /stocks with the filters', async () => {
		respond(stocksList);

		const result = (await invoke(ReferenceEndpoints.stocks, {
			symbol: 'AAPL',
			country: 'Austria',
		})) as { data: { symbol: string }[] };

		expectAuthenticated();
		expect(lastRequest().path).toBe('/stocks');
		expect(lastRequest().params).toEqual({
			symbol: 'AAPL',
			country: 'Austria',
			apikey: 'td-test-key',
		});
		expect(result.data).toHaveLength(2);
	});

	it('reference.stocks sends no filter when none is given', async () => {
		respond(stocksList);

		await invoke(ReferenceEndpoints.stocks, {});

		expect(lastRequest().params).toEqual({ apikey: 'td-test-key' });
	});

	it('reference.forexPairs GETs /forex_pairs', async () => {
		respond(forexPairsList);

		const result = (await invoke(ReferenceEndpoints.forexPairs, {
			currency_base: 'EUR',
		})) as { data: unknown[] };

		expectAuthenticated();
		expect(lastRequest().path).toBe('/forex_pairs');
		expect(lastRequest().params.currency_base).toBe('EUR');
		expect(result.data).toHaveLength(1);
	});

	it('reference.cryptocurrencies GETs /cryptocurrencies', async () => {
		respond(cryptoList);

		await invoke(ReferenceEndpoints.cryptocurrencies, { symbol: '0xBTC/USD' });

		expectAuthenticated();
		expect(lastRequest().path).toBe('/cryptocurrencies');
	});

	it('reference.etf GETs /etf and uses the data envelope', async () => {
		respond(etfList);

		const result = (await invoke(ReferenceEndpoints.etf, {
			symbol: '0000D0',
		})) as { data: { symbol: string }[] };

		expectAuthenticated();
		expect(lastRequest().path).toBe('/etf');
		expect(result.data).toHaveLength(1);
	});

	it('reference.funds GETs /funds and reads the result envelope', async () => {
		respond(fundsList);

		const result = (await invoke(ReferenceEndpoints.funds, {
			country: 'United States',
		})) as { result: { count?: number | null; list: unknown[] } };

		expectAuthenticated();
		expect(lastRequest().path).toBe('/funds');
		expect(result.result.count).toBe(137321);
		expect(result.result.list).toHaveLength(1);
	});

	it('reference.bonds GETs /bonds and reads the result envelope', async () => {
		respond(bondsList);

		const result = (await invoke(ReferenceEndpoints.bonds, {
			symbol: 'ABXL',
		})) as { result: { list: { symbol: string }[] } };

		expectAuthenticated();
		expect(lastRequest().path).toBe('/bonds');
		expect(result.result.list[0]?.symbol).toBe('ABXL');
	});

	it('reference.exchanges GETs /exchanges with the country filter', async () => {
		respond(exchangesList);

		const result = (await invoke(ReferenceEndpoints.exchanges, {
			country: 'United States',
		})) as { data: { code: string }[] };

		expectAuthenticated();
		expect(lastRequest().path).toBe('/exchanges');
		expect(lastRequest().params.country).toBe('United States');
		expect(result.data[0]?.code).toBe('IEXG');
	});
});

describe('indicators', () => {
	it('indicators.rsi GETs /rsi with the period', async () => {
		respond(rsiSeries);

		const result = (await invoke(IndicatorsEndpoints.rsi, {
			symbol: 'AAPL',
			interval: '1day',
			time_period: 14,
		})) as { values?: { rsi?: string | null }[] };

		expectAuthenticated();
		expect(lastRequest().path).toBe('/rsi');
		expect(lastRequest().params).toEqual({
			symbol: 'AAPL',
			interval: '1day',
			time_period: '14',
			apikey: 'td-test-key',
		});
		expect(result.values?.[0]?.rsi).toBe('62.34189');
	});

	it('indicators.macd GETs /macd and keeps its three series', async () => {
		respond(macdSeries);

		const result = (await invoke(IndicatorsEndpoints.macd, {
			symbol: 'AAPL',
			interval: '1day',
		})) as { values?: Record<string, string | null>[] };

		expectAuthenticated();
		expect(lastRequest().path).toBe('/macd');
		expect(result.values?.[0]?.macd).toBe('1.23456');
		expect(result.values?.[0]?.macd_signal).toBe('0.98765');
	});

	it('every indicator route is named after its indicator', async () => {
		const names = [
			'rsi',
			'macd',
			'sma',
			'ema',
			'bbands',
			'stoch',
			'atr',
			'adx',
			'cci',
			'willr',
			'mfi',
			'roc',
			'supertrend',
			'apo',
			'ppo',
			'stochrsi',
			'ultosc',
			'wma',
			'vwma',
			'min',
			'max',
			'stddev',
			'beta',
			'correl',
			'tsf',
		] as const;
		for (const name of names) {
			respond({ values: [] });
			await invoke(IndicatorsEndpoints[name] as never, {
				symbol: 'AAPL',
				interval: '1day',
			});
			expect(lastRequest().path).toBe(`/${name}`);
		}
		// One response per name above.
		expect(fetchMock).toHaveBeenCalledTimes(names.length);
	});

	it('an indicator sends series_type and outputsize when given', async () => {
		respond(rsiSeries);

		await invoke(IndicatorsEndpoints.sma, {
			symbol: 'AAPL',
			interval: '1h',
			time_period: 20,
			series_type: 'open',
			outputsize: 100,
		});

		expect(lastRequest().params).toEqual({
			symbol: 'AAPL',
			interval: '1h',
			time_period: '20',
			series_type: 'open',
			outputsize: '100',
			apikey: 'td-test-key',
		});
	});
});

describe('a 200 is not proof the lookup worked', () => {
	it('throws on a 200 body that says status error', async () => {
		respond(symbolNotFound);

		const error = await captureError(
			invoke(MarketEndpoints.quote, { symbol: 'NOPE' }),
		);

		expect(error).toBeInstanceOf(TwelveDataAPIError);
		expect((error as Error).message).toContain('market.quote');
	});

	it('throws for a batch answer where an entry failed', async () => {
		respond(partialBatch);

		const error = await captureError(
			invoke(MarketEndpoints.quote, { symbol: 'AAPL,BAD' }),
		);

		// A single-object quote parse fails first, which is the right outcome:
		// the caller asked for one quote shape and got a keyed map.
		expect(error).toBeDefined();
	});

	it('turns a 401 into a typed error', async () => {
		respond(badKey, 401);

		const error = await captureError(
			invoke(MarketEndpoints.price, { symbol: 'AAPL' }),
		);

		expect((error as TwelveDataAPIError).status).toBe(401);
	});
});
