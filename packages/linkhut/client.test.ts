import { ApiError } from 'corsair/http';
import {
	LINKHUT_API_BASE,
	LINKHUT_MIN_INTERVAL_MS,
	linkhutRequestFacts,
	linkhutRequestGap,
	makeLinkhutRequest,
	normaliseLinkhutKey,
} from './client';
import { unauthenticated } from './test-fixtures';
import {
	captureError,
	mockFetchRejection,
	mockFetchResponse,
} from './test-helpers';

const API_KEY = 'linkhut-live-token';

// The one-second gap is a live-API etiquette rule; no test needs it.
beforeEach(() => {
	linkhutRequestGap.minIntervalMs = 0;
});

afterEach(() => {
	linkhutRequestGap.minIntervalMs = LINKHUT_MIN_INTERVAL_MS;
	jest.restoreAllMocks();
});

/** The fetch call as the client issued it: URL string plus RequestInit. */
function sentCall(mock: ReturnType<typeof mockFetchResponse>): {
	url: URL;
	init: RequestInit;
} {
	const [url, init] = mock.mock.calls[0] as [string, RequestInit];
	return { url: new URL(url), init };
}

describe('makeLinkhutRequest', () => {
	it('sends the token as a Bearer header and never as a query parameter', async () => {
		const fetchMock = mockFetchResponse({ body: { update_time: 'x' } });

		await makeLinkhutRequest(API_KEY, {
			method: 'GET',
			path: '/v1/posts/update',
			replayable: true,
		});

		const { url, init } = sentCall(fetchMock);
		expect(url.origin).toBe('https://api.ln.ht');
		expect(url.pathname).toBe('/v1/posts/update');
		expect(init.method).toBe('GET');
		const headers = new Headers(init.headers);
		expect(headers.get('authorization')).toBe(`Bearer ${API_KEY}`);
		expect(url.searchParams.has('auth_token')).toBe(false);
	});

	it('asks for JSON and names itself in the User-Agent, as the etiquette page requires', async () => {
		const fetchMock = mockFetchResponse({ body: { update_time: 'x' } });

		await makeLinkhutRequest(API_KEY, {
			method: 'GET',
			path: '/v1/posts/update',
			replayable: true,
		});

		const headers = new Headers(sentCall(fetchMock).init.headers);
		expect(headers.get('accept')).toBe('application/json');
		expect(headers.get('user-agent')).toBe('Corsair Linkhut integration');
	});

	it('sends every defined query value and drops the undefined ones', async () => {
		const fetchMock = mockFetchResponse({ body: { posts: [] } });

		await makeLinkhutRequest(API_KEY, {
			method: 'GET',
			path: '/v1/posts/get',
			query: {
				tag: 'git oss',
				dt: '2020-12-24T00:00:00Z',
				url: 'https://sourcehut.org/',
				hashes: undefined,
				meta: undefined,
			},
			replayable: true,
		});

		const { url } = sentCall(fetchMock);
		expect(url.pathname).toBe('/v1/posts/get');
		expect(url.searchParams.get('tag')).toBe('git oss');
		expect(url.searchParams.get('dt')).toBe('2020-12-24T00:00:00Z');
		expect(url.searchParams.get('url')).toBe('https://sourcehut.org/');
		expect(url.searchParams.has('hashes')).toBe(false);
		expect(url.searchParams.has('meta')).toBe(false);
	});

	it('keeps an empty-string query value, because corsair/http drops undefined only', async () => {
		const fetchMock = mockFetchResponse({ body: { update_time: 'x' } });

		await makeLinkhutRequest(API_KEY, {
			method: 'GET',
			path: '/v1/posts/update',
			query: { tag: '' },
			replayable: true,
		});

		const { url } = sentCall(fetchMock);
		expect(url.search).toBe('?tag=');
	});

	it('throws core ApiError with the 401 envelope message', async () => {
		const fetchMock = mockFetchResponse({ status: 401, body: unauthenticated });

		const error = (await captureError(
			makeLinkhutRequest(API_KEY, {
				method: 'GET',
				path: '/v1/posts/update',
				replayable: true,
			}),
		)) as ApiError;

		expect(error).toBeInstanceOf(ApiError);
		expect(error.status).toBe(401);
		expect(error.body).toEqual(unauthenticated);
		expect(error.message).toBe('Linkhut HTTP 401: Unauthenticated');
		expect(linkhutRequestFacts(error)).toEqual({
			method: 'GET',
			replayable: true,
			transport: false,
		});
		expect(fetchMock).toHaveBeenCalledTimes(1);
	});

	it('drops an HTML error body and keeps the status in the message', async () => {
		mockFetchResponse({ status: 503, body: html });

		const error = (await captureError(
			makeLinkhutRequest(API_KEY, {
				method: 'GET',
				path: '/v1/posts/update',
				replayable: false,
			}),
		)) as ApiError;

		expect(error).toBeInstanceOf(ApiError);
		expect(error.message).toBe('Linkhut HTTP 503');
		expect(error.body).toBeUndefined();
		expect(linkhutRequestFacts(error)?.replayable).toBe(false);
	});

	it('keeps bookmark data from the query out of the error', async () => {
		mockFetchResponse({ status: 500, body: { result_code: 'x' } });

		const error = (await captureError(
			makeLinkhutRequest(API_KEY, {
				method: 'GET',
				path: '/v1/posts/add',
				query: {
					url: 'https://private.example/secret-page',
					description: 'mine',
				},
				replayable: false,
			}),
		)) as ApiError;

		expect(error.request).toEqual({ method: 'GET', url: '/v1/posts/add' });
		expect(error.url).toBe('https://api.ln.ht/v1/posts/add');
		expect(JSON.stringify(error)).not.toContain('private.example');
	});

	it('lets core retry a 429 and carries Retry-After in milliseconds', async () => {
		jest.useFakeTimers();
		const fetchMock = mockFetchResponse({
			status: 429,
			body: unauthenticated,
			headers: { 'retry-after': '2' },
		});

		const pending = captureError(
			makeLinkhutRequest(API_KEY, {
				method: 'GET',
				path: '/v1/posts/update',
				replayable: true,
			}),
		);
		await jest.advanceTimersByTimeAsync(10_000);
		const error = (await pending) as ApiError;
		jest.useRealTimers();

		expect(error.status).toBe(429);
		expect(error.retryAfter).toBe(2000);
		// One attempt plus core's three retries.
		expect(fetchMock).toHaveBeenCalledTimes(4);
	});

	it('turns a dropped connection into a fixed-message transport error', async () => {
		mockFetchRejection(new TypeError('fetch failed'));

		const error = (await captureError(
			makeLinkhutRequest(API_KEY, {
				method: 'GET',
				path: '/v1/posts/update',
				replayable: true,
			}),
		)) as Error;

		expect(error).not.toBeInstanceOf(ApiError);
		expect(error.message).toBe(
			'Linkhut request failed before a response arrived (TypeError)',
		);
		expect(error.cause).toBeUndefined();
		expect(linkhutRequestFacts(error)).toEqual({
			method: 'GET',
			replayable: true,
			transport: true,
		});
	});

	it('reads a rejected string reason as a transport error', async () => {
		mockFetchRejection('999');

		const error = (await captureError(
			makeLinkhutRequest(API_KEY, {
				method: 'GET',
				path: '/v1/posts/update',
				replayable: true,
			}),
		)) as Error;

		expect(linkhutRequestFacts(error)?.transport).toBe(true);
		expect(error.message).toBe(
			'Linkhut request failed before a response arrived',
		);
	});

	it('does not repeat a transport message that quotes the key', async () => {
		mockFetchRejection(
			new TypeError(
				`Headers.append: "Bearer ${API_KEY}" is an invalid header value.`,
			),
		);

		const error = (await captureError(
			makeLinkhutRequest(API_KEY, {
				method: 'GET',
				path: '/v1/posts/update',
				replayable: true,
			}),
		)) as Error;

		expect(error.message).not.toContain(API_KEY);
		expect(JSON.stringify(error)).not.toContain(API_KEY);
		expect(error.cause).toBeUndefined();
	});

	it('trims a pasted key and refuses one with inner whitespace before sending', async () => {
		const fetchMock = mockFetchResponse({ body: { update_time: 'x' } });

		await makeLinkhutRequest(`${API_KEY}\n`, {
			method: 'GET',
			path: '/v1/posts/update',
			replayable: true,
		});
		const { init } = sentCall(fetchMock);
		expect(new Headers(init.headers).get('authorization')).toBe(
			`Bearer ${API_KEY}`,
		);

		const error = (await captureError(
			makeLinkhutRequest(`\n${API_KEY}x\ny`, {
				method: 'GET',
				path: '/v1/posts/update',
				replayable: true,
			}),
		)) as Error;
		expect(error.message).toBe(
			'Linkhut API key is empty or holds whitespace or control characters',
		);
		expect(error.message).not.toContain(API_KEY);
		expect(fetchMock).toHaveBeenCalledTimes(1);
		expect(() => normaliseLinkhutKey('   ')).toThrow();
	});

	it('keeps the API key out of an HTTP error, its JSON form and its request', async () => {
		mockFetchResponse({ status: 401, body: unauthenticated });

		const error = (await captureError(
			makeLinkhutRequest(API_KEY, {
				method: 'GET',
				path: '/v1/posts/update',
				replayable: true,
			}),
		)) as ApiError;

		expect(error.message).not.toContain(API_KEY);
		expect(JSON.stringify(error)).not.toContain(API_KEY);
		expect(JSON.stringify(error.request)).not.toContain(API_KEY);
	});
});

const html = '<!DOCTYPE html><html><body>linkhut</body></html>';

describe('linkhutRequestGap', () => {
	it('waits about one second between two requests, as the etiquette page requires', async () => {
		jest.useFakeTimers();
		linkhutRequestGap.minIntervalMs = LINKHUT_MIN_INTERVAL_MS;
		const fetchMock = mockFetchResponse({ body: { update_time: 'x' } });

		await makeLinkhutRequest(API_KEY, {
			method: 'GET',
			path: '/v1/posts/update',
			replayable: true,
		});
		const second = makeLinkhutRequest(API_KEY, {
			method: 'GET',
			path: '/v1/posts/update',
			replayable: true,
		});

		// The first request took no wait, so the second owes the full interval.
		await jest.advanceTimersByTimeAsync(LINKHUT_MIN_INTERVAL_MS - 1);
		expect(fetchMock).toHaveBeenCalledTimes(1);
		await jest.advanceTimersByTimeAsync(1);
		await second;
		expect(fetchMock).toHaveBeenCalledTimes(2);

		jest.useRealTimers();
	});

	it('sends two requests back to back when the gap is off', async () => {
		const fetchMock = mockFetchResponse({ body: { update_time: 'x' } });

		await Promise.all([
			makeLinkhutRequest(API_KEY, {
				method: 'GET',
				path: '/v1/posts/update',
				replayable: true,
			}),
			makeLinkhutRequest(API_KEY, {
				method: 'GET',
				path: '/v1/posts/update',
				replayable: true,
			}),
		]);
		expect(fetchMock).toHaveBeenCalledTimes(2);
	});

	it('names the base url', () => {
		expect(LINKHUT_API_BASE).toBe('https://api.ln.ht');
	});
});
