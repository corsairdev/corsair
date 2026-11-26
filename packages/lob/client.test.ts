import { inspect } from 'node:util';
import { ApiError } from 'corsair/http';
import {
	describeLobError,
	lobErrorCode,
	lobRequestInfo,
	makeLobRequest,
	segment,
} from './client';
import {
	addressOk,
	rateLimited,
	unauthorized,
	usVerificationOk,
} from './test-fixtures';

const API_KEY = 'test_fake_key_0000';

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
					typeof body === 'string' ? 'text/plain' : 'application/json',
				...headers,
			},
		}),
	);
}

// unknown: a rejection can be any value until the instanceof check narrows it.
async function failure(promise: Promise<unknown>): Promise<ApiError> {
	const error = await promise.catch((caught: unknown) => caught);
	expect(error).toBeInstanceOf(ApiError);
	if (!(error instanceof ApiError)) throw error;
	return error;
}

// unknown: a rejection can be any value until the checks narrow it. A
// DOMException from fetch is not an Error in jest's realm, so only the
// shape is checked.
async function transportFailure(promise: Promise<unknown>): Promise<Error> {
	const error = await promise.catch((caught: unknown) => caught);
	expect(error).not.toBeInstanceOf(ApiError);
	if (error === null || typeof error !== 'object' || !('message' in error)) {
		throw error;
	}
	return error as Error;
}

// Core retries a 429 three times with 1 s, 2 s and 4 s waits; fake timers
// run those waits instantly.
async function withRetries<T>(promise: Promise<T>): Promise<T> {
	// Settle-handlers go on first, so a rejection while timers advance is
	// never reported as unhandled.
	const settled = promise.then(
		(value) => ({ ok: true as const, value }),
		(error: unknown) => ({ ok: false as const, error }),
	);
	for (let i = 0; i < 4; i++) await jest.advanceTimersByTimeAsync(5_000);
	const outcome = await settled;
	if (outcome.ok) return outcome.value;
	throw outcome.error;
}

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch');
});

afterEach(() => {
	fetchMock.mockRestore();
});

describe('makeLobRequest', () => {
	it('authenticates with Basic and an empty password', async () => {
		respond(usVerificationOk, 200);

		const result = await makeLobRequest(API_KEY, {
			method: 'POST',
			path: '/us_verifications',
			body: { primary_line: '210 King Street', zip_code: '94107' },
		});

		expect(result).toEqual(usVerificationOk);
		const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
		expect(url).toBe('https://api.lob.com/v1/us_verifications');
		expect(init.method).toBe('POST');
		const headers = new Headers(init.headers);
		expect(headers.get('Authorization')).toBe(
			`Basic ${Buffer.from(`${API_KEY}:`).toString('base64')}`,
		);
		const decoded = Buffer.from(
			String(headers.get('Authorization')).slice(6),
			'base64',
		).toString('utf8');
		expect(decoded).toBe(`${API_KEY}:`);
	});

	it('POSTs a JSON body with a JSON content type', async () => {
		respond(addressOk, 200);

		await makeLobRequest(API_KEY, {
			method: 'POST',
			path: '/addresses',
			body: { name: 'Jordan', address_line1: '210 King St' },
		});

		const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
		expect(new Headers(init.headers).get('content-type')).toBe(
			'application/json',
		);
		expect(JSON.parse(String(init.body))).toEqual({
			name: 'Jordan',
			address_line1: '210 King St',
		});
	});

	it('sends query parameters on POSTs too, where the case filter lives', async () => {
		respond(usVerificationOk, 200);

		await makeLobRequest(API_KEY, {
			method: 'POST',
			path: '/us_verifications',
			body: { address: '210 King Street' },
			query: { case: 'proper' },
		});

		const [url] = fetchMock.mock.calls[0] as [string, RequestInit];
		expect(url).toBe('https://api.lob.com/v1/us_verifications?case=proper');
	});

	it('forwards the Idempotency-Key header', async () => {
		respond(addressOk, 200);

		await makeLobRequest(API_KEY, {
			method: 'POST',
			path: '/postcards',
			body: {},
			headers: { 'Idempotency-Key': 'abc-123' },
		});

		const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
		expect(new Headers(init.headers).get('Idempotency-Key')).toBe('abc-123');
	});

	it('throws core ApiError with message and code from the wrapped envelope', async () => {
		respond(unauthorized, 401);

		const error = await failure(
			makeLobRequest(API_KEY, {
				method: 'GET',
				path: '/addresses',
			}),
		);
		expect(error.status).toBe(401);
		expect(lobErrorCode(error)).toBe('unauthorized');
		expect(lobRequestInfo(error)).toEqual({
			method: 'GET',
			hasIdempotency: false,
			transportFailure: false,
		});
		expect(error.message).toBe('Lob 401 unauthorized: Missing authentication');
	});

	it('drops the request body from the error', async () => {
		respond({ error: { message: 'bad', code: 'invalid' } }, 422);

		const error = await failure(
			makeLobRequest(API_KEY, {
				method: 'POST',
				path: '/addresses',
				body: { name: 'Jordan Lee', address_line1: '210 King St' },
			}),
		);
		expect(error.status).toBe(422);
		expect(error.request.body).toBeUndefined();
		expect(JSON.stringify(error)).not.toContain('Jordan');
		expect(inspect(error)).not.toContain('Jordan');
	});

	describe('rate limits', () => {
		beforeEach(() => jest.useFakeTimers());
		afterEach(() => jest.useRealTimers());

		it('retries a 429 through core, then throws it', async () => {
			for (let i = 0; i < 4; i++) respond({}, 429);
			const plain = await failure(
				withRetries(
					makeLobRequest(API_KEY, { method: 'GET', path: '/addresses' }),
				),
			);
			expect(fetchMock).toHaveBeenCalledTimes(4);
			expect(plain.status).toBe(429);
			expect(lobErrorCode(plain)).toBeUndefined();
		});

		it('recovers when a retry succeeds', async () => {
			respond(rateLimited, 429);
			respond(addressOk, 200);
			const result = await withRetries(
				makeLobRequest(API_KEY, { method: 'GET', path: '/addresses/adr_1' }),
			);
			expect(result).toEqual(addressOk);
			expect(fetchMock).toHaveBeenCalledTimes(2);
		});

		it('keeps the body code and the idempotency flag on a keyed send', async () => {
			for (let i = 0; i < 4; i++) respond(rateLimited, 429);
			const error = await failure(
				withRetries(
					makeLobRequest(API_KEY, {
						method: 'POST',
						path: '/postcards',
						body: {},
						headers: { 'Idempotency-Key': 'abc-123' },
					}),
				),
			);
			expect(lobErrorCode(error)).toBe('rate_limit_exceeded');
			expect(lobRequestInfo(error)?.hasIdempotency).toBe(true);
		});
	});

	it('passes a transport failure through, tagged as one', async () => {
		fetchMock.mockRejectedValueOnce(new TypeError('fetch failed'));

		const error = await transportFailure(
			makeLobRequest(API_KEY, {
				method: 'GET',
				path: '/addresses',
			}),
		);
		expect(error).toBeInstanceOf(TypeError);
		expect(error.message).toContain('fetch failed');
		expect(lobRequestInfo(error)).toEqual({
			method: 'GET',
			hasIdempotency: false,
			transportFailure: true,
		});
	});

	it('tags a fetch timeout as a transport failure', async () => {
		fetchMock.mockRejectedValueOnce(
			new DOMException('The operation timed out', 'TimeoutError'),
		);

		const error = await transportFailure(
			makeLobRequest(API_KEY, {
				method: 'POST',
				path: '/postcards',
				body: {},
			}),
		);
		expect(error.message).toContain('timed out');
		expect(lobRequestInfo(error)?.transportFailure).toBe(true);
	});

	it('sends a FormData body as multipart without a JSON content type', async () => {
		respond({ message: 'File uploaded successfully', filename: 'a.csv' }, 202);
		const form = new FormData();
		form.append('file', new Blob(['name\n'], { type: 'text/csv' }), 'a.csv');

		await makeLobRequest(API_KEY, {
			method: 'POST',
			path: '/uploads/upl_1/file',
			body: form,
		});

		const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
		expect(init.body).toBeInstanceOf(FormData);
		expect(new Headers(init.headers).get('content-type')).toBeNull();
	});

	it('leaves the API key out of errors', async () => {
		respond(unauthorized, 401);

		const error = await failure(
			makeLobRequest(API_KEY, {
				method: 'GET',
				path: '/addresses',
				query: { limit: 10 },
			}),
		);
		expect(error.message).not.toContain(API_KEY);
		expect(JSON.stringify(error)).not.toContain(API_KEY);
		expect(inspect(error)).not.toContain(API_KEY);
	});
});

describe('describeLobError', () => {
	it('reads the flat uploads envelope as a message without a code', () => {
		expect(
			describeLobError(403, { code: 403, message: 'Not authorized.' }, 'x'),
		).toBe('Lob 403: Not authorized.');
	});

	it('reads the gateway envelope whose error field is a string', () => {
		// Seen on a keyless probe of /v1/links, /v1/booklets and /v1/snap_packs.
		expect(
			describeLobError(
				401,
				{ statusCode: 401, error: 'Unauthorized', message: 'Invalid user' },
				'x',
			),
		).toBe('Lob 401: Invalid user');
	});

	it('falls back when the body has no error text', () => {
		expect(describeLobError(503, '<html>down</html>', 'Unavailable')).toBe(
			'Lob 503: Unavailable',
		);
		expect(describeLobError(undefined, undefined, 'timeout')).toBe('timeout');
	});
});

describe('segment', () => {
	it('encodes a value for one path segment', () => {
		expect(segment('a/b?c')).toBe('a%2Fb%3Fc');
	});

	it('refuses values that would climb out of the route', () => {
		expect(() => segment('..')).toThrow('Invalid Lob path value');
		expect(() => segment('')).toThrow('Invalid Lob path value');
	});
});
