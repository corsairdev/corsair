/**
 * Covers the transport: how the query string is assembled, how Alpha Vantage's
 * HTTP-200 error bodies are classified, and how the CSV-only endpoints are
 * decoded. Network access is mocked, so this runs in CI.
 */
import { ApiError } from 'corsair/http';
import {
	AlphaVantageApiError,
	assertNoAlphaVantageError,
	makeAlphaVantageAnalyticsRequest,
	makeAlphaVantageCsvRequest,
	makeAlphaVantageRequest,
	parseCsv,
	parseRetryAfter,
	sanitizeApiError,
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
function mockText(
	body: string,
	contentType = 'application/x-download',
	status = 200,
	extraHeaders: Record<string, string> = {},
) {
	global.fetch = (async (url: string) => {
		lastUrl = String(url);
		return {
			ok: status >= 200 && status < 300,
			status,
			statusText: status === 200 ? 'OK' : 'Error',
			url: String(url),
			headers: new Headers({ 'Content-Type': contentType, ...extraHeaders }),
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

	it('rejects a non-2xx response instead of parsing the error page as rows', async () => {
		// A gateway in front of the API can answer 5xx with an HTML page, which
		// parseCsv would otherwise turn into a single nonsense row.
		mockText(
			'<html><body>503 Service Unavailable</body></html>',
			'text/html',
			503,
		);

		await expect(
			makeAlphaVantageCsvRequest('LISTING_STATUS', TEST_KEY),
		).rejects.toThrow(/HTTP 503/);
	});

	it('rejects a 429 after one attempt so the plugin handler is the only retry layer', async () => {
		let calls = 0;
		global.fetch = (async (url: string) => {
			calls++;
			return {
				ok: false,
				status: 429,
				statusText: 'Too Many Requests',
				url: String(url),
				headers: new Headers({ 'Retry-After': '0' }),
				json: async () => ({}),
				text: async () => 'rate limited',
			};
		}) as unknown as typeof global.fetch;

		await expect(
			makeAlphaVantageCsvRequest('LISTING_STATUS', TEST_KEY),
		).rejects.toMatchObject({ status: 429 });
		expect(calls).toBe(1);
	});

	it('caps a CSV 429 Retry-After at five seconds', async () => {
		global.fetch = (async (url: string) => {
			return {
				ok: false,
				status: 429,
				statusText: 'Too Many Requests',
				url: String(url),
				headers: new Headers({ 'Retry-After': '120' }),
				json: async () => ({}),
				text: async () => 'rate limited',
			};
		}) as unknown as typeof global.fetch;

		await expect(
			makeAlphaVantageCsvRequest('LISTING_STATUS', TEST_KEY),
		).rejects.toMatchObject({ status: 429, retryAfter: 5_000 });
	});

	it('does not retry a 5xx', async () => {
		let calls = 0;
		global.fetch = (async (url: string) => {
			calls++;
			return {
				ok: false,
				status: 503,
				statusText: 'Service Unavailable',
				url: String(url),
				headers: new Headers(),
				json: async () => ({}),
				text: async () => 'down',
			};
		}) as unknown as typeof global.fetch;

		await expect(
			makeAlphaVantageCsvRequest('LISTING_STATUS', TEST_KEY),
		).rejects.toMatchObject({ status: 503 });
		expect(calls).toBe(1);
	});

	it('does not leak the api key in a CSV transport failure, including in the body', async () => {
		// Gateways routinely echo the request URI into their error page, which is
		// how the key would otherwise end up in `error.body`.
		global.fetch = (async (url: string) => ({
			ok: false,
			status: 500,
			statusText: 'Server Error',
			url: String(url),
			headers: new Headers({ 'Content-Type': 'text/html' }),
			json: async () => ({}),
			text: async () => `<html>Cannot GET ${String(url)}</html>`,
		})) as unknown as typeof global.fetch;

		let caught: unknown;
		try {
			await makeAlphaVantageCsvRequest('LISTING_STATUS', TEST_KEY);
		} catch (error) {
			caught = error;
		}

		const apiError = caught as ApiError;
		expect(apiError.status).toBe(500);
		// The unredacted body would have contained the key, so this asserts the
		// scrubbing rather than the absence of an echo.
		expect(apiError.body).toContain('[REDACTED]');
		expect(apiError.body).not.toContain(TEST_KEY);
		expect(apiError.url).not.toContain(TEST_KEY);
		expect(apiError.request.query?.apikey).toBe('[REDACTED]');
	});
});

describe('Retry-After parsing', () => {
	it('reads a delay in seconds', () => {
		expect(parseRetryAfter('30')).toBe(30_000);
		expect(parseRetryAfter('0')).toBe(0);
	});

	it('reads an HTTP date', () => {
		const tenSeconds = new Date(Date.now() + 10_000).toUTCString();
		const parsed = parseRetryAfter(tenSeconds) ?? 0;
		// Second-granularity in the header makes this approximate.
		expect(parsed).toBeGreaterThan(8_000);
		expect(parsed).toBeLessThanOrEqual(11_000);
	});

	it('ignores a missing or unparseable header', () => {
		expect(parseRetryAfter(null)).toBeUndefined();
		expect(parseRetryAfter('soon')).toBeUndefined();
	});

	it('never returns a negative delay for a date in the past', () => {
		const past = new Date(Date.now() - 60_000).toUTCString();
		expect(parseRetryAfter(past)).toBe(0);
	});
});

describe('api key redaction', () => {
	// Core's ApiError redacts `api_key`, `key`, `token` and `appid`, but Alpha
	// Vantage spells its parameter `apikey`, which is not in that set — so
	// without the plugin's own sanitiser the live key would ride along in every
	// failed request's url and query.
	it('strips the key from an ApiError url, query and message', () => {
		const raw = new ApiError(
			{
				method: 'GET',
				url: `query?function=GLOBAL_QUOTE&apikey=${TEST_KEY}`,
				query: { function: 'GLOBAL_QUOTE', apikey: TEST_KEY },
			},
			{
				url: `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&apikey=${TEST_KEY}`,
				ok: false,
				status: 500,
				statusText: 'Server Error',
				body: 'boom',
			},
			`request to https://www.alphavantage.co/query?apikey=${TEST_KEY} failed`,
		);

		// Confirms the gap is real rather than assumed.
		expect(JSON.stringify({ u: raw.url, q: raw.request.query })).toContain(
			TEST_KEY,
		);

		const safe = sanitizeApiError(raw) as ApiError;

		expect(safe).toBeInstanceOf(ApiError);
		expect(safe.url).not.toContain(TEST_KEY);
		expect(safe.message).not.toContain(TEST_KEY);
		expect(safe.request.query?.apikey).toBe('[REDACTED]');
		expect(safe.status).toBe(500);
		expect(safe.body).toBe('boom');
	});

	it('leaves non-ApiError values alone', () => {
		const plain = new Error('nothing sensitive');
		expect(sanitizeApiError(plain)).toBe(plain);
	});

	it('strips the key from an ApiError raised by the JSON transport', async () => {
		// A non-2xx makes the shared transport construct an ApiError from the
		// request options — which carry `apikey` — so this is the realistic path
		// by which the key would otherwise escape.
		mockJson({ message: 'internal error' }, 500);

		let caught: unknown;
		try {
			await makeAlphaVantageRequest('GLOBAL_QUOTE', TEST_KEY, {
				symbol: 'IBM',
			});
		} catch (error) {
			caught = error;
		}

		expect(caught).toBeInstanceOf(ApiError);
		const apiError = caught as ApiError;
		expect(apiError.status).toBe(500);
		// Serialising the whole error is the assertion that matters: the key must
		// not survive anywhere on it.
		expect(
			JSON.stringify({
				url: apiError.url,
				message: apiError.message,
				request: apiError.request,
			}),
		).not.toContain(TEST_KEY);
		expect(apiError.request.query?.apikey).toBe('[REDACTED]');
	});
});
