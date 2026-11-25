import {
	LINKHUT_API_BASE,
	LINKHUT_MIN_INTERVAL_MS,
	LinkhutAPIError,
	linkhutRequestGap,
	makeLinkhutRequest,
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

	it('reads the errors of the 401 envelope into the message and code', async () => {
		const fetchMock = mockFetchResponse({ status: 401, body: unauthenticated });

		const error = (await captureError(
			makeLinkhutRequest(API_KEY, {
				method: 'GET',
				path: '/v1/posts/update',
				replayable: true,
			}),
		)) as LinkhutAPIError;

		expect(error).toBeInstanceOf(LinkhutAPIError);
		expect(error.status).toBe(401);
		expect(error.code).toBe('Unauthenticated');
		expect(error.message).toBe(
			'Linkhut HTTP 401 Unauthorized: Unauthenticated',
		);
		expect(error.isTransportError).toBe(false);
		expect(fetchMock).toHaveBeenCalledTimes(1);
	});

	it('falls back to the status text when an error body carries no message', async () => {
		mockFetchResponse({ status: 503, body: html });

		const error = (await captureError(
			makeLinkhutRequest(API_KEY, {
				method: 'GET',
				path: '/v1/posts/update',
				replayable: true,
			}),
		)) as LinkhutAPIError;

		expect(error.message).toBe('Linkhut HTTP 503 Service Unavailable');
		expect(error.code).toBeUndefined();
		expect(error.isThrottled).toBe(true);
	});

	it('carries the Retry-After header in milliseconds', async () => {
		mockFetchResponse({
			status: 429,
			body: unauthenticated,
			headers: { 'retry-after': '2' },
		});

		const error = (await captureError(
			makeLinkhutRequest(API_KEY, {
				method: 'GET',
				path: '/v1/posts/update',
				replayable: true,
			}),
		)) as LinkhutAPIError;

		expect(error.status).toBe(429);
		expect(error.retryAfter).toBe(2000);
	});

	it('wraps a dropped connection as a transport error and keeps the cause', async () => {
		mockFetchRejection(new TypeError('fetch failed'));

		const error = (await captureError(
			makeLinkhutRequest(API_KEY, {
				method: 'GET',
				path: '/v1/posts/update',
				replayable: true,
			}),
		)) as LinkhutAPIError;

		expect(error.status).toBeUndefined();
		expect(error.isTransportError).toBe(true);
		expect(error.message).toBe('fetch failed');
		expect(error.cause).toBeInstanceOf(TypeError);
	});

	it('reads a rejected string reason', async () => {
		mockFetchRejection('999');

		const error = (await captureError(
			makeLinkhutRequest(API_KEY, {
				method: 'GET',
				path: '/v1/posts/update',
				replayable: true,
			}),
		)) as LinkhutAPIError;

		expect(error.isTransportError).toBe(true);
		expect(error.message).toBe('999');
	});

	it('keeps the API key out of the error, its JSON form and its inspect form', async () => {
		mockFetchResponse({ status: 401, body: unauthenticated });

		const error = (await captureError(
			makeLinkhutRequest(API_KEY, {
				method: 'GET',
				path: '/v1/posts/update',
				replayable: true,
			}),
		)) as LinkhutAPIError;

		expect(error.message).not.toContain(API_KEY);
		expect(JSON.stringify(error)).not.toContain(API_KEY);
		// The cause carries no request record, so nothing else can print the
		// Authorization header.
		expect(error.cause).toBeUndefined();
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
