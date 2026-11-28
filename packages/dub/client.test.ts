import { inspect } from 'node:util';
import { ApiError } from 'corsair/http';
import {
	DubTransportError,
	describeDubError,
	dubErrorCode,
	isReplaySafe,
	makeDubRequest,
	redactEmails,
	redactPath,
	segment,
} from './client';
import {
	errorEnvelope,
	link,
	rateLimited,
	unauthorized,
} from './test-fixtures';

const API_KEY = 'dub_test_secret_key';
const CTX = { key: API_KEY };

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
async function failure(promise: Promise<unknown>): Promise<ApiError> {
	const error = await promise.catch((e: unknown) => e);
	expect(error).toBeInstanceOf(ApiError);
	if (!(error instanceof ApiError)) throw error;
	return error;
}

beforeEach(() => {
	// A call no test queued a response for fails here instead of reaching Dub.
	fetchMock = jest.spyOn(globalThis, 'fetch').mockImplementation(() => {
		throw new Error('unmocked fetch in a unit test');
	});
});

afterEach(() => {
	fetchMock.mockRestore();
});

describe('makeDubRequest', () => {
	it('authenticates with a Bearer header against api.dub.co', async () => {
		respond([link], 200);

		const result = await makeDubRequest(CTX, {
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

		await makeDubRequest(CTX, {
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

		await makeDubRequest(CTX, {
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
			makeDubRequest(CTX, { method: 'GET', path: '/links' }),
		);
		expect(error.status).toBe(401);
		expect(dubErrorCode(error)).toBe('unauthorized');
		expect(error.message).toBe(
			'Dub 401 unauthorized: Missing Authorization header.',
		);
	});

	it('reads a 400 bad_request envelope and keeps the method', async () => {
		respond(errorEnvelope('bad_request', 'Invalid url.'), 400);

		const error = await failure(
			makeDubRequest(CTX, {
				method: 'POST',
				path: '/links',
				body: { url: 'nope' },
			}),
		);
		expect(error.status).toBe(400);
		expect(dubErrorCode(error)).toBe('bad_request');
		expect(error.request.method).toBe('POST');
	});

	it('lets core retry a 429 three times, honouring Retry-After', async () => {
		for (let i = 0; i < 4; i++) {
			respond(rateLimited, 429, { 'Retry-After': '0' });
		}

		const error = await failure(
			makeDubRequest(CTX, { method: 'GET', path: '/analytics' }),
		);
		expect(error.status).toBe(429);
		expect(dubErrorCode(error)).toBe('rate_limit_exceeded');
		expect(fetchMock).toHaveBeenCalledTimes(4);
	});

	it('keeps customer data from the request body out of the error', async () => {
		respond(errorEnvelope('conflict', 'Customer exists.'), 409);

		const error = await failure(
			makeDubRequest(CTX, {
				method: 'POST',
				path: '/track/lead',
				body: { customerEmail: 'buyer@example.com' },
			}),
		);
		expect(error.request.body).toBe('[REDACTED]');
		expect(error.request.headers).toBeUndefined();
		expect(inspect(error, { depth: 10 })).not.toContain('buyer@example.com');
	});

	it('never copies a body without the envelope into the message', async () => {
		respond({ detail: 'buyer@example.com failed' }, 418);

		const error = await failure(
			makeDubRequest(CTX, { method: 'GET', path: '/links' }),
		);
		expect(error.message).not.toContain('buyer@example.com');
		expect(JSON.stringify(error.body ?? null)).not.toContain('buyer');
	});

	it('marks reads and upserts as replay-safe, other writes not', () => {
		expect(isReplaySafe('GET', '/links')).toBe(true);
		expect(isReplaySafe('PUT', '/links/upsert')).toBe(true);
		expect(isReplaySafe('PUT', '/partners/links/upsert')).toBe(true);
		expect(isReplaySafe('POST', '/links')).toBe(false);
		expect(isReplaySafe('PATCH', '/links/abc')).toBe(false);
	});

	it('wraps network failures with the method and route, keeping the cause', async () => {
		fetchMock.mockRejectedValueOnce(new TypeError('fetch failed'));

		const error = await makeDubRequest(CTX, {
			method: 'GET',
			path: '/links',
		}).catch((e: unknown) => e);
		expect(error).toBeInstanceOf(DubTransportError);
		if (!(error instanceof DubTransportError)) throw error;
		expect(error.message).toContain('fetch failed');
		expect(error.method).toBe('GET');
		expect(error.path).toBe('/links');
		expect(error.cause).toBeInstanceOf(TypeError);
	});

	it('wraps a fetch timeout', async () => {
		fetchMock.mockRejectedValueOnce(
			new DOMException('The operation timed out', 'TimeoutError'),
		);

		const error = await makeDubRequest(CTX, {
			method: 'POST',
			path: '/track/lead',
			body: {},
		}).catch((e: unknown) => e);
		expect(error).toBeInstanceOf(DubTransportError);
		expect((error as Error).message).toContain('timed out');
	});

	it('leaves the API key out of errors', async () => {
		respond(unauthorized, 401);

		const error = await failure(
			makeDubRequest(CTX, { method: 'GET', path: '/links' }),
		);
		expect(error.message).not.toContain(API_KEY);
		expect(JSON.stringify(error)).not.toContain(API_KEY);
		// util.inspect prints enumerable properties, unlike JSON.stringify.
		expect(inspect(error, { depth: 10 })).not.toContain(API_KEY);
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

describe('redacting echoed input', () => {
	beforeEach(() => {
		fetchMock = jest.spyOn(globalThis, 'fetch').mockImplementation(() => {
			throw new Error('unmocked fetch in a unit test');
		});
	});
	afterEach(() => fetchMock.mockRestore());

	it('removes an email address Dub echoes in its message', async () => {
		respond(
			errorEnvelope('unprocessable_entity', 'Invalid tag: alice@example.com'),
			422,
		);
		const error = await failure(
			makeDubRequest(CTX, { method: 'POST', path: '/links', body: {} }),
		);
		expect(error.message).toBe(
			'Dub 422 unprocessable_entity: Invalid tag: [email]',
		);
		expect(JSON.stringify(error.body)).not.toContain('alice@example.com');
	});
});

describe('linear redaction', () => {
	it('redacts addresses in text and paths without a regex', () => {
		expect(
			describeDubError(422, errorEnvelope('x', 'tag a@b.co is bad'), 'f'),
		).toBe('Dub 422 x: tag [email] is bad');
		expect(redactPath('/customers/ext_buyer%40example.com')).toBe(
			'/customers/[redacted]',
		);
		expect(redactPath('/links/link_123')).toBe('/links/link_123');
		// A long run of one character stays fast (no backtracking).
		const started = Date.now();
		redactEmails(`${'!'.repeat(100_000)}@`);
		expect(Date.now() - started).toBeLessThan(200);
	});

	it('keeps a key that Headers refuses out of the transport error', () => {
		const key = 'dub_key\nINJECTED';
		const error = new DubTransportError(
			'GET',
			'/links',
			new TypeError(`Headers.append: "${key}" is an invalid header value.`),
			key,
		);
		expect(error.message).not.toContain(key);
		expect(error.cause).toBeUndefined();
	});
});
