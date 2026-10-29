/**
 * Exercises the transport: how the version prefix is chosen, how parameters are
 * serialised, where the credential travels, and what happens on a rejection.
 */
import { buildQuery, makeApiNinjasRequest } from './client';

const TEST_KEY = 'test-api-key-not-a-real-credential';

let calls: { url: string; init: RequestInit }[] = [];

/** Stubs fetch with a queue of responses and records every request sent. */
function mockResponses(
	responses: {
		status?: number;
		body?: unknown;
		contentType?: string;
		headers?: Record<string, string>;
	}[],
) {
	let index = 0;
	global.fetch = (async (url: string, init: RequestInit) => {
		calls.push({ url, init });
		const response = responses[Math.min(index, responses.length - 1)];
		index++;
		const status = response?.status ?? 200;
		const contentType = response?.contentType ?? 'application/json';
		return {
			ok: status >= 200 && status < 300,
			status,
			statusText: status === 200 ? 'OK' : 'Error',
			url,
			headers: new Headers({
				'Content-Type': contentType,
				...(response?.headers ?? {}),
			}),
			json: async () => response?.body ?? {},
			text: async () =>
				contentType.includes('json')
					? JSON.stringify(response?.body ?? {})
					: String(response?.body ?? ''),
		};
	}) as unknown as typeof global.fetch;
}

const realFetch = global.fetch;

beforeEach(() => {
	calls = [];
	// Each test stubs fetch; restoring it first keeps a stub from leaking into a
	// test that meant to observe the unstubbed transport.
	global.fetch = realFetch;
});

describe('buildQuery', () => {
	it('drops unset parameters rather than sending them empty', () => {
		// The provider treats an empty string as a supplied-but-blank value, so an
		// omitted optional parameter has to disappear entirely.
		expect(buildQuery({ city: 'London', state: undefined, zip: null })).toEqual(
			{
				city: 'London',
			},
		);
	});

	it('keeps a parameter whose value is legitimately falsy', () => {
		expect(buildQuery({ offset: 0, hit: false, name: '' })).toEqual({
			offset: '0',
			hit: 'false',
			name: '',
		});
	});

	it('JSON-encodes a structured value', () => {
		// The Sudoku solver documents its grid as a JSON array in the query string.
		expect(
			buildQuery({
				puzzle: [
					[1, 0],
					[0, 2],
				],
			}),
		).toEqual({ puzzle: '[[1,0],[0,2]]' });
	});
});

describe('versioned routing', () => {
	it.each([
		['v1', 'sentiment', 'https://api.api-ninjas.com/v1/sentiment'],
		['v2', 'quoteoftheday', 'https://api.api-ninjas.com/v2/quoteoftheday'],
		['v3', 'recipe', 'https://api.api-ninjas.com/v3/recipe'],
	] as const)(
		'sends %s endpoints to the %s prefix',
		async (version, endpoint, expected) => {
			mockResponses([{ body: {} }]);

			await makeApiNinjasRequest(endpoint, TEST_KEY, { version });

			expect(calls[0]?.url).toBe(expected);
		},
	);

	it('defaults to v1 when no version is given', async () => {
		mockResponses([{ body: {} }]);

		await makeApiNinjasRequest('weather', TEST_KEY, {
			query: { lat: 51.5, lon: -0.12 },
		});

		expect(calls[0]?.url).toBe(
			'https://api.api-ninjas.com/v1/weather?lat=51.5&lon=-0.12',
		);
	});
});

describe('credentials', () => {
	it('sends the key in the X-Api-Key header', async () => {
		mockResponses([{ body: {} }]);

		await makeApiNinjasRequest('bitcoin', TEST_KEY);

		const headers = new Headers(calls[0]?.init.headers);
		expect(headers.get('X-Api-Key')).toBe(TEST_KEY);
	});

	it('never puts the key in the query string', async () => {
		mockResponses([{ body: {} }]);

		await makeApiNinjasRequest('bitcoin', TEST_KEY, {
			query: { symbol: 'BTCUSDT' },
		});

		// A key in a URL ends up in every log that records request URLs, and this
		// provider's key is not in the core's redaction list.
		expect(calls[0]?.url).not.toContain(TEST_KEY);
		expect(calls[0]?.url).not.toMatch(/api[-_]?key/i);
	});
});

describe('request shape', () => {
	it('sends a JSON body for the POST endpoints', async () => {
		mockResponses([{ body: { similarity: 0.9 } }]);

		await makeApiNinjasRequest('textsimilarity', TEST_KEY, {
			method: 'POST',
			body: { text_1: 'a', text_2: 'b' },
		});

		const call = calls[0];
		expect(call?.init.method).toBe('POST');
		expect(call?.init.body).toBe(JSON.stringify({ text_1: 'a', text_2: 'b' }));
		expect(new Headers(call?.init.headers).get('Content-Type')).toContain(
			'application/json',
		);
	});

	it('does not attach a body to a GET', async () => {
		mockResponses([{ body: {} }]);

		await makeApiNinjasRequest('sentiment', TEST_KEY, {
			query: { text: 'hello' },
			body: { ignored: true },
		});

		expect(calls[0]?.init.body).toBeUndefined();
	});

	it('overrides Accept for the image endpoints', async () => {
		mockResponses([{ body: '<svg/>', contentType: 'image/svg+xml' }]);

		await makeApiNinjasRequest('qrcode', TEST_KEY, {
			query: { data: 'x', format: 'svg' },
			accept: 'image/svg+xml',
		});

		expect(new Headers(calls[0]?.init.headers).get('Accept')).toBe(
			'image/svg+xml',
		);
	});
});

describe('rate limiting', () => {
	it('retries a 429 and returns the eventual success', async () => {
		// The client waits a second before the first retry. Fake timers keep that
		// out of the suite's runtime while still exercising the delay.
		jest.useFakeTimers();
		mockResponses([
			{ status: 429, body: { error: 'Too Many Requests' } },
			{ status: 200, body: { price: '63115.00' } },
		]);

		try {
			const pending = makeApiNinjasRequest<{ price: string }>(
				'cryptoprice',
				TEST_KEY,
				{ query: { symbol: 'BTCUSDT' } },
			);

			// Let the rejected attempt settle, then run the backoff timer out.
			await jest.advanceTimersByTimeAsync(2000);
			const result = await pending;

			expect(calls).toHaveLength(2);
			expect(result.price).toBe('63115.00');
		} finally {
			jest.useRealTimers();
		}
	});

	it('does not retry a 400', async () => {
		mockResponses([
			{ status: 400, body: { error: 'Invalid text parameter.' } },
		]);

		await expect(
			makeApiNinjasRequest('sentiment', TEST_KEY, { query: { text: '' } }),
		).rejects.toThrow();

		// A rejected request is a caller error here, and every retry spends quota.
		expect(calls).toHaveLength(1);
	});
});
