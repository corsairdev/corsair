import { inspect } from 'node:util';
import {
	describeLobError,
	LobAPIError,
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
async function failure(promise: Promise<unknown>): Promise<LobAPIError> {
	const error = await promise.catch((caught: unknown) => caught);
	expect(error).toBeInstanceOf(LobAPIError);
	if (!(error instanceof LobAPIError)) throw error;
	return error;
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

	it('reads message and code from the wrapped error envelope', async () => {
		respond(unauthorized, 401);

		const error = await failure(
			makeLobRequest(API_KEY, {
				method: 'GET',
				path: '/addresses',
			}),
		);
		expect(error.status).toBe(401);
		expect(error.code).toBe('unauthorized');
		expect(error.method).toBe('GET');
		expect(error.hasIdempotency).toBe(false);
		expect(error.isRateLimit).toBe(false);
		expect(error.message).toBe('Lob 401 unauthorized: Missing authentication');
	});

	it('treats a plain 429 and a body-coded 429 as rate limits', async () => {
		respond({}, 429);
		const plain = await failure(
			makeLobRequest(API_KEY, { method: 'GET', path: '/addresses' }),
		);
		expect(plain.isRateLimit).toBe(true);
		expect(plain.code).toBeUndefined();

		respond(rateLimited, 429);
		const coded = await failure(
			makeLobRequest(API_KEY, { method: 'POST', path: '/postcards', body: {} }),
		);
		expect(coded.isRateLimit).toBe(true);
		expect(coded.code).toBe('rate_limit_exceeded');
	});

	it('marks an idempotency-keyed send as replay-safe', async () => {
		respond(rateLimited, 429);

		const error = await failure(
			makeLobRequest(API_KEY, {
				method: 'POST',
				path: '/postcards',
				body: {},
				headers: { 'Idempotency-Key': 'abc-123' },
			}),
		);
		expect(error.hasIdempotency).toBe(true);
	});

	it('keeps the cause on a transport failure, where no body was sent', async () => {
		fetchMock.mockRejectedValueOnce(new TypeError('fetch failed'));

		const error = await failure(
			makeLobRequest(API_KEY, {
				method: 'GET',
				path: '/addresses',
			}),
		);
		expect(error.message).toContain('fetch failed');
		expect(error.status).toBeUndefined();
		expect(error.method).toBe('GET');
		expect(error.hasIdempotency).toBe(false);
		expect(error.cause).toBeInstanceOf(TypeError);
	});

	it('wraps a fetch timeout', async () => {
		fetchMock.mockRejectedValueOnce(
			new DOMException('The operation timed out', 'TimeoutError'),
		);

		const error = await failure(
			makeLobRequest(API_KEY, {
				method: 'POST',
				path: '/postcards',
				body: {},
			}),
		);
		expect(error.message).toContain('timed out');
		expect(error.status).toBeUndefined();
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
});
