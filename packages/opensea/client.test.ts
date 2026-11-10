import {
	describeOpenseaError,
	makeOpenseaRequest,
	OpenseaAPIError,
	OpenseaTransportError,
	segment,
} from './client';
import { invalidKeyBody, missingKeyBody, notFoundBody } from './test-fixtures';

const API_KEY = 'opensea-test-key';

let fetchMock: jest.SpyInstance;

// unknown: a response body is arbitrary JSON or text until the client reads it.
function respond(
	// unknown: a response body is arbitrary JSON or text until the client reads it.
	body: unknown,
	status: number,
	headers: Record<string, string> = {},
) {
	fetchMock.mockResolvedValueOnce(
		new Response(typeof body === 'string' ? body : JSON.stringify(body), {
			status,
			headers: {
				'Content-Type':
					typeof body === 'string' ? 'text/plain' : 'application/json',
				...headers,
			},
		}),
	);
}

// unknown: a rejection can be any value until the instanceof check narrows it.
async function failure(promise: Promise<unknown>): Promise<OpenseaAPIError> {
	const error = await promise.catch((e: unknown) => e);
	expect(error).toBeInstanceOf(OpenseaAPIError);
	if (!(error instanceof OpenseaAPIError)) throw error;
	return error;
}

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch');
});

afterEach(() => {
	fetchMock.mockRestore();
	jest.restoreAllMocks();
});

describe('makeOpenseaRequest', () => {
	it('sends the key in x-api-key and nowhere else', async () => {
		respond({ chains: [] }, 200);

		await makeOpenseaRequest(API_KEY, { method: 'GET', path: '/chains' });

		const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
		const headers = new Headers(init.headers);
		expect(headers.get('x-api-key')).toBe(API_KEY);
		expect(headers.get('authorization')).toBeNull();
		expect(url).not.toContain(API_KEY);
	});

	it('calls the documented host and the /api/v2 prefix', async () => {
		respond({ collections: [], next: null }, 200);

		await makeOpenseaRequest(API_KEY, { method: 'GET', path: '/collections' });

		const [url] = fetchMock.mock.calls[0] as [string];
		const parsed = new URL(url);
		expect(parsed.origin).toBe('https://api.opensea.io');
		expect(parsed.pathname).toBe('/api/v2/collections');
	});

	it('sends a repeated query value comma-joined, not as repeated keys', async () => {
		respond({ asset_events: [], next: null }, 200);

		await makeOpenseaRequest(API_KEY, {
			method: 'GET',
			path: '/events',
			query: { event_type: ['sale', 'transfer'].join(','), limit: 5 },
		});

		const [url] = fetchMock.mock.calls[0] as [string];
		const search = new URL(url).searchParams;
		expect(search.get('event_type')).toBe('sale,transfer');
		expect(search.get('limit')).toBe('5');
	});

	it('drops undefined query values', async () => {
		respond({ collections: [], next: null }, 200);

		await makeOpenseaRequest(API_KEY, {
			method: 'GET',
			path: '/collections',
			query: { chain: undefined, limit: 2 },
		});

		const [url] = fetchMock.mock.calls[0] as [string];
		const search = new URL(url).searchParams;
		expect(search.has('chain')).toBe(false);
		expect(search.get('limit')).toBe('2');
	});

	it('sends a JSON body on a POST', async () => {
		respond({ ok: true }, 200);

		await makeOpenseaRequest(API_KEY, {
			method: 'POST',
			path: '/search',
			body: { query: 'ape' },
		});

		const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
		expect(JSON.parse(String(init.body))).toEqual({ query: 'ape' });
		expect(new Headers(init.headers).get('content-type')).toContain(
			'application/json',
		);
	});

	it('returns the parsed body', async () => {
		respond({ chains: [{ chain: 'ethereum' }] }, 200);

		const body = await makeOpenseaRequest(API_KEY, {
			method: 'GET',
			path: '/chains',
		});

		expect(body).toEqual({ chains: [{ chain: 'ethereum' }] });
	});

	it('reads the string-array error envelope on a 401', async () => {
		respond(missingKeyBody, 401);

		const error = await failure(
			makeOpenseaRequest(API_KEY, { method: 'GET', path: '/collections' }),
		);

		expect(error.status).toBe(401);
		expect(error.kind).toBe('unauthorized');
		expect(error.message).toContain('Missing an API Key');
	});

	it('reads the invalid-key variant', async () => {
		respond(invalidKeyBody, 401);

		const error = await failure(
			makeOpenseaRequest(API_KEY, { method: 'GET', path: '/collections' }),
		);

		expect(error.message).toContain('Invalid API key');
		expect(error.kind).toBe('unauthorized');
	});

	/**
	 * The router answers an unknown path with `{ error: { message, status } }`,
	 * a different envelope from the marketplace routes' `{ errors: [...] }`.
	 * Reading only one of them would print "OpenSea 404: Not Found" from the
	 * fallback instead of the provider's text.
	 */
	it('reads the object error envelope with its stable status code', async () => {
		respond(notFoundBody, 404);

		const error = await failure(
			makeOpenseaRequest(API_KEY, { method: 'GET', path: '/nope' }),
		);

		expect(error.kind).toBe('not_found');
		expect(error.code).toBe('NOT_FOUND');
		expect(error.message).toContain('Not Found');
	});

	it('keeps Retry-After on a 429', async () => {
		respond({ errors: ['Too many requests'] }, 429, { 'Retry-After': '3' });

		const error = await failure(
			makeOpenseaRequest(API_KEY, { method: 'GET', path: '/collections' }),
		);

		expect(error.kind).toBe('rate_limited');
		expect(error.retryAfter).toBe(3000);
	});

	/**
	 * The Greptile P1: retries must wait until the window resets. OpenSea sends
	 * `x-ratelimit-reset` as a unix timestamp and no `Retry-After`, so with only
	 * `retry-after` configured every retry waited the 1s fallback and burned the
	 * budget inside the same exhausted window.
	 */
	it('turns x-ratelimit-reset into a wait when Retry-After is absent', async () => {
		const resetSeconds = Math.floor(Date.now() / 1000) + 30;
		respond({ errors: ['Too many requests'] }, 429, {
			'x-ratelimit-reset': String(resetSeconds),
			'x-ratelimit-remaining': '0',
		});

		const error = await failure(
			makeOpenseaRequest(API_KEY, { method: 'GET', path: '/collections' }),
		);

		expect(error.kind).toBe('rate_limited');
		expect(error.retryAfter).toBeDefined();
		// About 30 seconds, not the 1s fallback and not 30 hours.
		expect(error.retryAfter).toBeGreaterThan(25_000);
		expect(error.retryAfter).toBeLessThanOrEqual(30_000);
	});

	it('lets the reset header win over Retry-After when both are present', async () => {
		// `corsair/http` applies `resetTime` after `retryAfter`, so the window
		// reset is what a caller gets. Pinned so a core change is visible here.
		respond({ errors: ['Too many requests'] }, 429, {
			'Retry-After': '2',
			'x-ratelimit-reset': String(Math.floor(Date.now() / 1000) + 30),
		});

		const error = await failure(
			makeOpenseaRequest(API_KEY, { method: 'GET', path: '/collections' }),
		);

		expect(error.retryAfter).toBeGreaterThan(25_000);
	});

	it('reports a 5xx as a server error', async () => {
		respond('upstream died', 503);

		const error = await failure(
			makeOpenseaRequest(API_KEY, { method: 'GET', path: '/collections' }),
		);

		expect(error.kind).toBe('server');
		expect(error.status).toBe(503);
	});

	it('reports a transport failure without a response', async () => {
		fetchMock.mockRejectedValueOnce(new TypeError('fetch failed'));

		const error = await makeOpenseaRequest(API_KEY, {
			method: 'GET',
			path: '/chains',
			// unknown: a rejection can be any value until the instanceof check narrows it.
		}).catch((e: unknown) => e);

		expect(error).toBeInstanceOf(OpenseaTransportError);
		if (!(error instanceof OpenseaTransportError)) throw error;
		expect(error.kind).toBe('network');
		expect(error.method).toBe('GET');
	});

	it('reports a timeout as a timeout', async () => {
		fetchMock.mockRejectedValueOnce(
			new DOMException('The operation timed out.', 'TimeoutError'),
		);

		const error = await makeOpenseaRequest(API_KEY, {
			method: 'GET',
			path: '/collections',
		}).catch((e: unknown) => e);

		expect(error).toBeInstanceOf(OpenseaTransportError);
		if (!(error instanceof OpenseaTransportError)) throw error;
		expect(error.kind).toBe('timeout');
	});
});

describe('describeOpenseaError', () => {
	it('joins a multi-entry errors array', () => {
		expect(
			describeOpenseaError(
				400,
				{ errors: ['bad slug', 'bad chain'] },
				'fallback',
			),
		).toBe('OpenSea 400: bad slug; bad chain');
	});

	it('prefers the nested error message and appends its status code', () => {
		expect(describeOpenseaError(404, notFoundBody, 'fallback')).toBe(
			'OpenSea 404 NOT_FOUND: Not Found',
		);
	});

	it('falls back when the body carries no readable text', () => {
		expect(describeOpenseaError(500, null, 'boom')).toBe('OpenSea 500: boom');
	});
});

describe('segment', () => {
	it('encodes a value so it cannot leave its path segment', () => {
		expect(segment('../collections')).toBe('..%2Fcollections');
	});

	it('leaves a slug and a token id readable', () => {
		expect(segment('boredapeyachtclub')).toBe('boredapeyachtclub');
		expect(segment('9933')).toBe('9933');
	});

	it('refuses a dot segment, which fetch would resolve away', () => {
		// encodeURIComponent leaves `.` and `..` as they are, and the URL parser
		// then drops them: /collections/../stats is requested as /stats.
		expect(() => segment('..')).toThrow(OpenseaAPIError);
		expect(() => segment('.')).toThrow(OpenseaAPIError);
		expect(segment('...')).toBe('...');
		expect(segment('a.b')).toBe('a.b');
	});
});
