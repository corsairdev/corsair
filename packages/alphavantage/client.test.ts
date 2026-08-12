/**
 * Covers the transport: how the query string is assembled, how Alpha Vantage's
 * HTTP-200 error bodies are classified, and how the CSV-only endpoints are
 * decoded. Network access is mocked, so this runs in CI.
 */
import {
	AlphaVantageApiError,
	assertNoAlphaVantageError,
	makeAlphaVantageAnalyticsRequest,
	makeAlphaVantageCsvRequest,
	makeAlphaVantageRequest,
	parseCsv,
	splitCsvLine,
} from './client';

const TEST_KEY = 'test-alphavantage-key';

let lastUrl: string | undefined;

/** Stubs global fetch with a JSON response and records the request URL. */
function mockJson(body: unknown, status = 200) {
	global.fetch = (async (url: string) => {
		lastUrl = String(url);
		return {
			ok: status >= 200 && status < 300,
			status,
			statusText: 'OK',
			url: String(url),
			headers: new Headers({ 'Content-Type': 'application/json' }),
			json: async () => body,
			text: async () => JSON.stringify(body),
		};
	}) as unknown as typeof global.fetch;
}

/** Stubs global fetch with a text response, as the CSV endpoints return. */
function mockText(body: string, contentType = 'application/x-download') {
	global.fetch = (async (url: string) => {
		lastUrl = String(url);
		return {
			ok: true,
			status: 200,
			statusText: 'OK',
			url: String(url),
			headers: new Headers({ 'Content-Type': contentType }),
			json: async () => JSON.parse(body),
			text: async () => body,
		};
	}) as unknown as typeof global.fetch;
}

beforeEach(() => {
	lastUrl = undefined;
});

describe('request construction', () => {
	it('sends the function name and api key as query parameters', async () => {
		mockJson({ ok: true });

		await makeAlphaVantageRequest('GLOBAL_QUOTE', TEST_KEY, { symbol: 'IBM' });

		const url = new URL(lastUrl ?? '');
		expect(url.origin).toBe('https://www.alphavantage.co');
		expect(url.pathname).toBe('/query');
		expect(url.searchParams.get('function')).toBe('GLOBAL_QUOTE');
		expect(url.searchParams.get('apikey')).toBe(TEST_KEY);
		expect(url.searchParams.get('symbol')).toBe('IBM');
	});

	it('cannot have its function overridden by a caller-supplied parameter', async () => {
		mockJson({ ok: true });

		await makeAlphaVantageRequest('GLOBAL_QUOTE', TEST_KEY, {
			function: 'OVERVIEW',
		});

		const url = new URL(lastUrl ?? '');
		expect(url.searchParams.get('function')).toBe('GLOBAL_QUOTE');
	});

	it('uses the separate analytics host and does not send a function', async () => {
		mockJson({ meta_data: {}, payload: {} });

		await makeAlphaVantageAnalyticsRequest(
			'timeseries/running_analytics',
			TEST_KEY,
			{ SYMBOLS: 'AAPL' },
		);

		const url = new URL(lastUrl ?? '');
		expect(url.origin).toBe('https://alphavantageapi.co');
		expect(url.pathname).toBe('/timeseries/running_analytics');
		expect(url.searchParams.get('function')).toBeNull();
		expect(url.searchParams.get('SYMBOLS')).toBe('AAPL');
	});
});

describe('error classification', () => {
	it('treats an Error Message body as an invalid request', () => {
		expect(() =>
			assertNoAlphaVantageError({
				'Error Message': 'This API function (NOPE) does not exist.',
			}),
		).toThrow(AlphaVantageApiError);

		try {
			assertNoAlphaVantageError({ 'Error Message': 'bad call' });
		} catch (error) {
			expect((error as AlphaVantageApiError).kind).toBe('invalid_request');
		}
	});

	it('treats a Note body as a rate limit', () => {
		try {
			assertNoAlphaVantageError({ Note: 'call frequency is 5 per minute' });
			throw new Error('expected a throw');
		} catch (error) {
			expect((error as AlphaVantageApiError).kind).toBe('rate_limit');
		}
	});

	it('separates a premium notice from a daily-allowance notice', () => {
		try {
			assertNoAlphaVantageError({
				Information:
					'Thank you for using Alpha Vantage! This is a premium endpoint.',
			});
			throw new Error('expected a throw');
		} catch (error) {
			expect((error as AlphaVantageApiError).kind).toBe('premium');
		}

		try {
			assertNoAlphaVantageError({
				Information:
					'We have detected your API key and our standard rate limit is 25 requests per day.',
			});
			throw new Error('expected a throw');
		} catch (error) {
			expect((error as AlphaVantageApiError).kind).toBe('rate_limit');
		}
	});

	it('lets a successful body through untouched', () => {
		expect(() =>
			assertNoAlphaVantageError({ 'Global Quote': { '01. symbol': 'IBM' } }),
		).not.toThrow();
	});

	it('raises the error through the request helper, not just the assertion', async () => {
		mockJson({ 'Error Message': 'the parameter apikey is invalid' });

		await expect(
			makeAlphaVantageRequest('GLOBAL_QUOTE', TEST_KEY, { symbol: 'IBM' }),
		).rejects.toThrow(AlphaVantageApiError);
	});

	it('does not mistake a non-object body for an error envelope', () => {
		expect(() => assertNoAlphaVantageError(null)).not.toThrow();
		expect(() => assertNoAlphaVantageError([1, 2, 3])).not.toThrow();
		expect(() => assertNoAlphaVantageError('plain text')).not.toThrow();
	});
});

describe('CSV decoding', () => {
	it('splits a simple row', () => {
		expect(splitCsvLine('A,B,C')).toEqual(['A', 'B', 'C']);
	});

	it('keeps commas that sit inside a quoted field', () => {
		expect(splitCsvLine('GOOG,"Alphabet, Inc.",NASDAQ')).toEqual([
			'GOOG',
			'Alphabet, Inc.',
			'NASDAQ',
		]);
	});

	it('unescapes a doubled quote inside a quoted field', () => {
		expect(splitCsvLine('X,"say ""hi""",Y')).toEqual(['X', 'say "hi"', 'Y']);
	});

	it('maps rows onto the header', () => {
		const rows = parseCsv(
			'symbol,name,exchange\nIBM,International Business Machines,NYSE\n',
		);
		expect(rows).toEqual([
			{
				symbol: 'IBM',
				name: 'International Business Machines',
				exchange: 'NYSE',
			},
		]);
	});

	it('returns nothing for an empty payload', () => {
		expect(parseCsv('')).toEqual([]);
		expect(parseCsv('\n\n')).toEqual([]);
	});

	it('fetches and decodes a CSV endpoint', async () => {
		mockText('symbol,name\nIBM,International Business Machines\n');

		const rows = await makeAlphaVantageCsvRequest('LISTING_STATUS', TEST_KEY, {
			state: 'active',
		});

		const url = new URL(lastUrl ?? '');
		expect(url.searchParams.get('function')).toBe('LISTING_STATUS');
		expect(url.searchParams.get('state')).toBe('active');
		expect(rows).toHaveLength(1);
		expect(rows[0]?.symbol).toBe('IBM');
	});

	it('still reports an error body returned by a CSV endpoint', async () => {
		mockText(
			JSON.stringify({ Information: 'This is a premium endpoint.' }),
			'application/json',
		);

		await expect(
			makeAlphaVantageCsvRequest('EARNINGS_CALENDAR', TEST_KEY),
		).rejects.toThrow(AlphaVantageApiError);
	});
});
