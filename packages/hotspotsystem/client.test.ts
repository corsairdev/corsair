import { ApiError } from 'corsair/http';
import {
	configWith,
	describeFailure,
	HOTSPOTSYSTEM_API_BASE,
	HOTSPOTSYSTEM_API_KEY_HEADER,
	HotspotSystemTransportError,
	makeHotspotSystemPageRequest,
	makeHotspotSystemRequest,
	readErrorMessage,
	segment,
} from './client';
import { rejection } from './test-helpers';

const KEY = 'sn-secret-key';

let fetchMock: jest.SpyInstance;

// unknown: a response body is arbitrary JSON until the client reads it.
function respond(
	body: unknown,
	{
		status = 200,
		headers = {},
	}: { status?: number; headers?: Record<string, string> } = {},
) {
	fetchMock.mockResolvedValueOnce(
		new Response(JSON.stringify(body), {
			status,
			headers: { 'Content-Type': 'application/json', ...headers },
		}),
	);
}

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch');
});

afterEach(() => {
	fetchMock.mockRestore();
	jest.restoreAllMocks();
});

describe('configWith', () => {
	it('puts the key in the documented header, not the URL', () => {
		const config = configWith(KEY);
		expect(config.BASE).toBe(HOTSPOTSYSTEM_API_BASE);
		const headers = config.HEADERS as Record<string, string>;
		expect(headers[HOTSPOTSYSTEM_API_KEY_HEADER]).toBe(KEY);
		expect(config.BASE).not.toContain(KEY);
	});
});

describe('makeHotspotSystemPageRequest', () => {
	it('sends the query as written and returns the body', async () => {
		respond({ items: [], metadata: { total_count: 0 } });

		const page = await makeHotspotSystemPageRequest(KEY, {
			method: 'GET',
			path: '/locations',
			query: { limit: 10, offset: 0, sort: '-name', fields: 'id,name' },
		});

		expect(page.body).toEqual({ items: [], metadata: { total_count: 0 } });
		expect(page.next_offset).toBeUndefined();

		const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
		const parsed = new URL(String(url));
		expect(parsed.pathname).toBe('/v2.0/locations');
		expect(parsed.searchParams.get('limit')).toBe('10');
		expect(parsed.searchParams.get('offset')).toBe('0');
		expect(parsed.searchParams.get('sort')).toBe('-name');
		expect(parsed.searchParams.get('fields')).toBe('id,name');
		expect(new Headers(init.headers).get(HOTSPOTSYSTEM_API_KEY_HEADER)).toBe(
			KEY,
		);
		expect(parsed.search).not.toContain(KEY);
	});

	it('drops undefined query values instead of sending empty ones', async () => {
		respond({ items: [] });

		await makeHotspotSystemPageRequest(KEY, {
			method: 'GET',
			path: '/locations',
			query: { limit: undefined, sort: '-name' },
		});

		const parsed = new URL(String((fetchMock.mock.calls[0] as [string])[0]));
		expect(parsed.searchParams.has('limit')).toBe(false);
		expect(parsed.searchParams.get('sort')).toBe('-name');
	});

	it('returns the next offset from the Link header', async () => {
		respond(
			{ items: [{ id: '1' }] },
			{
				headers: {
					Link: '<https://api.hotspotsystem.com/v2.0/locations?limit=10&offset=10>; rel="next"',
				},
			},
		);

		const page = await makeHotspotSystemPageRequest(KEY, {
			method: 'GET',
			path: '/locations',
		});

		expect(page.next_offset).toBe(10);
	});

	it('throws a typed error with the status and provider message', async () => {
		respond({ error: 'Internal Server Error' }, { status: 500 });

		const error = (await rejection(
			makeHotspotSystemPageRequest(KEY, { method: 'GET', path: '/locations' }),
		)) as ApiError;

		expect(error).toBeInstanceOf(ApiError);
		expect(error.status).toBe(500);
		expect(error.message).toBe('HotspotSystem 500: Internal Server Error');
		expect(error.request.method).toBe('GET');
		expect(error.request.url).toBe('/locations');
	});

	it('reads Retry-After as milliseconds', async () => {
		respond(
			{ error: 'slow down' },
			{ status: 429, headers: { 'Retry-After': '7' } },
		);

		const error = (await rejection(
			makeHotspotSystemPageRequest(KEY, { method: 'GET', path: '/locations' }),
		)) as ApiError;

		expect(error.retryAfter).toBe(7000);
	});

	it('turns a dropped connection into a transport error', async () => {
		fetchMock.mockRejectedValueOnce(new TypeError('fetch failed'));

		const error = (await rejection(
			makeHotspotSystemPageRequest(KEY, { method: 'GET', path: '/locations' }),
		)) as HotspotSystemTransportError;

		expect(error).toBeInstanceOf(HotspotSystemTransportError);
		expect(error.timedOut).toBe(false);
		expect(error.message).toBe('fetch failed');
	});

	it('marks a timeout as timed out', async () => {
		fetchMock.mockRejectedValueOnce(
			new DOMException(
				'The operation was aborted due to timeout',
				'TimeoutError',
			),
		);

		const error = (await rejection(
			makeHotspotSystemPageRequest(KEY, { method: 'GET', path: '/locations' }),
		)) as HotspotSystemTransportError;

		expect(error.timedOut).toBe(true);
	});

	it('keeps the status when the body drops after the headers arrive', async () => {
		// The connection can fail between the headers and the body. A failed
		// response is still described by its status, so that is what is reported.
		fetchMock.mockResolvedValueOnce({
			ok: false,
			status: 503,
			statusText: 'Service Unavailable',
			headers: new Headers(),
			text: async () => {
				throw new TypeError('terminated');
			},
		});

		const error = (await rejection(
			makeHotspotSystemPageRequest(KEY, { method: 'GET', path: '/locations' }),
		)) as ApiError;

		expect(error).toBeInstanceOf(ApiError);
		expect(error.status).toBe(503);
	});

	it('turns a dropped body on a 2xx into a transport error', async () => {
		fetchMock.mockResolvedValueOnce({
			ok: true,
			status: 200,
			statusText: 'OK',
			headers: new Headers(),
			text: async () => {
				throw new TypeError('terminated');
			},
		});

		const error = (await rejection(
			makeHotspotSystemPageRequest(KEY, { method: 'GET', path: '/locations' }),
		)) as HotspotSystemTransportError;

		expect(error).toBeInstanceOf(HotspotSystemTransportError);
		expect(error.message).toBe('terminated');
	});

	it('does not put the key in the error, whatever the request carried', async () => {
		respond({ error: 'nope' }, { status: 400 });

		const error = (await rejection(
			makeHotspotSystemPageRequest(KEY, { method: 'GET', path: '/locations' }),
		)) as ApiError;

		const inspect = require('node:util').inspect(error) as string;
		expect(error.message).not.toContain(KEY);
		expect(inspect).not.toContain(KEY);
		expect(JSON.stringify(error)).not.toContain(KEY);
	});
});

describe('makeHotspotSystemRequest', () => {
	// The two non-list reads go through `corsair/http` because they need no
	// `Link` header. The transport is mocked so its error handling can be tested
	// without a network.
	it('returns the parsed body', async () => {
		const http = await import('corsair/http');
		const spy = jest
			.spyOn(http, 'request')
			.mockResolvedValueOnce({ ping: 'pong' });

		const body = await makeHotspotSystemRequest(KEY, {
			method: 'GET',
			path: '/ping',
		});

		expect(body).toEqual({ ping: 'pong' });
		const call = spy.mock.calls[0];
		const config = call?.[0];
		const options = call?.[1];
		const headers = config?.HEADERS as Record<string, string>;
		expect(headers[HOTSPOTSYSTEM_API_KEY_HEADER]).toBe(KEY);
		expect(options?.method).toBe('GET');
		expect(options?.url).toBe('/ping');
	});

	it('normalises a provider failure into the plugin error type', async () => {
		const http = await import('corsair/http');
		jest.spyOn(http, 'request').mockRejectedValueOnce(
			new http.ApiError(
				{ method: 'GET', url: '/ping' },
				{
					url: 'https://api.hotspotsystem.com/v2.0/ping',
					ok: false,
					status: 401,
					statusText: 'Unauthorized',
					body: { error: 'Invalid authentication!' },
				},
				'Unauthorized',
			),
		);

		const error = (await rejection(
			makeHotspotSystemRequest(KEY, { method: 'GET', path: '/ping' }),
		)) as ApiError;

		expect(error).toBeInstanceOf(ApiError);
		expect(error.status).toBe(401);
		expect(error.message).toBe('HotspotSystem 401: Invalid authentication!');
	});

	it('rethrows core ApiError with its rate-limit data and no query', async () => {
		const http = await import('corsair/http');
		jest.spyOn(http, 'request').mockRejectedValueOnce(
			new http.ApiError(
				{ method: 'GET', url: '/me', query: { fields: 'email' } },
				{
					url: 'https://api.hotspotsystem.com/v2.0/me',
					ok: false,
					status: 429,
					statusText: 'Too Many Requests',
					body: { error: 'slow down', echoed: 'customer@example.com' },
				},
				'Too Many Requests',
				{ retryAfter: 3000, rateLimitRemaining: 0 },
			),
		);

		const error = (await rejection(
			makeHotspotSystemRequest(KEY, { method: 'GET', path: '/me' }),
		)) as ApiError;

		expect(error).toBeInstanceOf(ApiError);
		expect(error.status).toBe(429);
		expect(error.retryAfter).toBe(3000);
		expect(error.rateLimitRemaining).toBe(0);
		expect(error.request).toEqual({ method: 'GET', url: '/me' });
		expect(error.body).toEqual({ error: 'slow down' });
	});

	it('normalises a transport failure into the plugin error type', async () => {
		const http = await import('corsair/http');
		jest.spyOn(http, 'request').mockRejectedValueOnce(new TypeError('boom'));

		const error = (await rejection(
			makeHotspotSystemRequest(KEY, { method: 'GET', path: '/ping' }),
		)) as HotspotSystemTransportError;

		expect(error).toBeInstanceOf(HotspotSystemTransportError);
		expect(error.timedOut).toBe(false);
		expect(error.message).toBe('boom');
	});
});

describe('readErrorMessage and describeFailure', () => {
	it('reads the documented error object', () => {
		expect(readErrorMessage({ error: 'Invalid authentication!' })).toBe(
			'Invalid authentication!',
		);
	});

	it('returns nothing for a body that is not the documented shape', () => {
		expect(readErrorMessage(undefined)).toBeUndefined();
		expect(readErrorMessage('Oops!')).toBeUndefined();
		expect(readErrorMessage({ error: 42 })).toBeUndefined();
		expect(readErrorMessage({ error: '' })).toBeUndefined();
	});

	it('renders the status before the message', () => {
		expect(describeFailure(500, { error: 'Boom' }, 'fallback')).toBe(
			'HotspotSystem 500: Boom',
		);
	});

	it('falls back when the body carries no message', () => {
		expect(describeFailure(500, undefined, 'Internal Server Error')).toBe(
			'HotspotSystem 500: Internal Server Error',
		);
		expect(describeFailure(undefined, undefined, 'boom')).toBe(
			'HotspotSystem: boom',
		);
	});
});

describe('segment', () => {
	it('encodes a path segment', () => {
		expect(segment('a/b c')).toBe('a%2Fb%20c');
	});
});
