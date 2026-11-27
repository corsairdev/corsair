import { inspect } from 'node:util';
import {
	DubAPIError,
	describeDubError,
	makeDubRequest,
	segment,
} from './client';
import {
	errorEnvelope,
	link,
	rateLimited,
	unauthorized,
} from './test-fixtures';

const API_KEY = 'dub_test_secret_key';

let fetchMock: jest.SpyInstance;

// unknown: response bodies are arbitrary JSON or text.
function respond(
	body: unknown,
	status: number,
	headers: Record<string, string> = {},
) {
	fetchMock.mockResolvedValueOnce(
		new Response(typeof body === 'string' ? body : JSON.stringify(body), {
			status,
			headers: {
				'Content-Type':
					typeof body === 'string' ? 'image/svg+xml' : 'application/json',
				...headers,
			},
		}),
	);
}

// unknown: a rejection can be any value until the instanceof check narrows it.
async function failure(promise: Promise<unknown>): Promise<DubAPIError> {
	const error = await promise.catch((e: unknown) => e);
	expect(error).toBeInstanceOf(DubAPIError);
	if (!(error instanceof DubAPIError)) throw error;
	return error;
}

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch');
});

afterEach(() => {
	fetchMock.mockRestore();
});

describe('makeDubRequest', () => {
	it('authenticates with a Bearer header against api.dub.co', async () => {
		respond([link], 200);

		const result = await makeDubRequest(API_KEY, {
			method: 'GET',
			path: '/links',
			query: { domain: 'dub.sh', search: undefined },
		});

		expect(result).toEqual([link]);
		const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
		expect(url).toBe('https://api.dub.co/links?domain=dub.sh');
		expect(init.method).toBe('GET');
		const headers = new Headers(init.headers);
		expect(headers.get('authorization')).toBe(`Bearer ${API_KEY}`);
	});

	it('POSTs a JSON body with a JSON content type', async () => {
		respond(link, 200);

		await makeDubRequest(API_KEY, {
			method: 'POST',
			path: '/links',
			body: { url: 'https://dub.co', domain: 'dub.sh' },
		});

		const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
		expect(new Headers(init.headers).get('content-type')).toBe(
			'application/json',
		);
		expect(JSON.parse(String(init.body))).toEqual({
			url: 'https://dub.co',
			domain: 'dub.sh',
		});
	});

	it('omits query params set to undefined', async () => {
		respond([], 200);

		await makeDubRequest(API_KEY, {
			method: 'GET',
			path: '/links',
			query: { showArchived: false, search: undefined },
		});

		const [url] = fetchMock.mock.calls[0] as [string, RequestInit];
		expect(url).toBe('https://api.dub.co/links?showArchived=false');
	});

	it('reads the code and message of the error envelope', async () => {
		respond(unauthorized, 401);

		const error = await failure(
			makeDubRequest(API_KEY, { method: 'GET', path: '/links' }),
		);
		expect(error.status).toBe(401);
		expect(error.code).toBe('unauthorized');
		expect(error.message).toBe(
			'Dub 401 unauthorized: Missing Authorization header.',
		);
		expect(error.isRateLimit).toBe(false);
	});

	it('reads a 400 bad_request envelope', async () => {
		respond(errorEnvelope('bad_request', 'Invalid request body.'), 400);

		const error = await failure(
			makeDubRequest(API_KEY, {
				method: 'POST',
				path: '/links',
				body: {},
			}),
		);
		expect(error.status).toBe(400);
		expect(error.code).toBe('bad_request');
		expect(error.idempotent).toBe(false);
	});

	it('treats a 429 as a rate limit and reads Retry-After', async () => {
		respond(rateLimited, 429, { 'Retry-After': '30' });

		const error = await failure(
			makeDubRequest(API_KEY, { method: 'GET', path: '/analytics' }),
		);
		expect(error.isRateLimit).toBe(true);
		expect(error.retryAfter).toBe(30_000);
		expect(error.idempotent).toBe(true);
		expect(fetchMock).toHaveBeenCalledTimes(1);
	});

	it('reads the body code of a non-429 rate limit', async () => {
		respond(rateLimited, 503);

		const error = await failure(
			makeDubRequest(API_KEY, { method: 'GET', path: '/links' }),
		);
		expect(error.isRateLimit).toBe(true);
	});

	it('marks a GET as replay-safe and a write as not', async () => {
		respond(unauthorized, 401);
		respond(unauthorized, 401);

		const read = await failure(
			makeDubRequest(API_KEY, { method: 'GET', path: '/links' }),
		);
		const write = await failure(
			makeDubRequest(API_KEY, {
				method: 'POST',
				path: '/links',
				body: { url: 'https://dub.co' },
			}),
		);
		expect(read.idempotent).toBe(true);
		expect(write.idempotent).toBe(false);
	});

	it('marks upsert as replay-safe even though it is a write', async () => {
		respond(unauthorized, 401);

		const error = await failure(
			makeDubRequest(API_KEY, {
				method: 'PUT',
				path: '/links/upsert',
				body: { url: 'https://dub.co' },
				idempotent: true,
			}),
		);
		expect(error.idempotent).toBe(true);
	});

	it('wraps network failures and keeps the cause', async () => {
		fetchMock.mockRejectedValueOnce(new TypeError('fetch failed'));

		const error = await failure(
			makeDubRequest(API_KEY, { method: 'GET', path: '/links' }),
		);
		expect(error.message).toContain('fetch failed');
		expect(error.status).toBeUndefined();
		expect(error.method).toBe('GET');
		expect(error.cause).toBeInstanceOf(TypeError);
	});

	it('wraps a fetch timeout', async () => {
		fetchMock.mockRejectedValueOnce(
			new DOMException('The operation timed out', 'TimeoutError'),
		);

		const error = await failure(
			makeDubRequest(API_KEY, {
				method: 'POST',
				path: '/track/lead',
				body: {},
			}),
		);
		expect(error.message).toContain('timed out');
		expect(error.status).toBeUndefined();
		expect(error.idempotent).toBe(false);
	});

	it('leaves the API key out of errors', async () => {
		respond(unauthorized, 401);

		const error = await failure(
			makeDubRequest(API_KEY, { method: 'GET', path: '/links' }),
		);
		expect(error.message).not.toContain(API_KEY);
		expect(error.message).not.toContain('dub_test_secret');
		expect(JSON.stringify(error)).not.toContain(API_KEY);
		expect(error.cause).toBeUndefined();
		// util.inspect prints enumerable properties, unlike JSON.stringify.
		expect(inspect(error, { depth: 5 })).not.toContain(API_KEY);
	});
});

describe('describeDubError', () => {
	it('falls back when the body is not the envelope', () => {
		expect(describeDubError(503, '<html>down</html>', 'Unavailable')).toBe(
			'Dub 503: Unavailable',
		);
		expect(describeDubError(undefined, undefined, 'timeout')).toBe('timeout');
	});

	it('keeps the code in the label', () => {
		expect(describeDubError(429, rateLimited, 'fallback')).toBe(
			'Dub 429 rate_limit_exceeded: Too many requests. Please retry later.',
		);
	});
});

describe('segment', () => {
	it('encodes a value for one path segment', () => {
		expect(segment('a/b?c')).toBe('a%2Fb%3Fc');
	});
});
