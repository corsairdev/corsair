import {
	describeRiteKitError,
	makeRiteKitRequest,
	RITEKIT_API_BASE,
	RiteKitAPIError,
} from './client';
import { BAD_KEY, NO_KEY, OUT_OF_CREDITS, RATE_LIMITED } from './test-fixtures';

const API_KEY = 'ritekit-secret-test-key';

let fetchMock: jest.SpyInstance;

beforeEach(() => {
	// A fetch a test did not queue a response for throws instead of reaching the network.
	fetchMock = jest.spyOn(globalThis, 'fetch').mockImplementation(() => {
		throw new Error('unmocked fetch');
	});
});

afterEach(() => {
	fetchMock.mockRestore();
});

function respond(
	// unknown: response bodies are arbitrary JSON.
	body: unknown,
	status: number,
	headers: Record<string, string> = {},
) {
	fetchMock.mockResolvedValueOnce(
		new Response(JSON.stringify(body), {
			status,
			headers: { 'Content-Type': 'application/json', ...headers },
		}),
	);
}

// unknown: a rejection can be any value until the instanceof check narrows it.
async function failure(promise: Promise<unknown>): Promise<RiteKitAPIError> {
	const error = await promise.catch((e: unknown) => e);
	expect(error).toBeInstanceOf(RiteKitAPIError);
	if (!(error instanceof RiteKitAPIError)) throw error;
	return error;
}

describe('RiteKit client', () => {
	it('points at the documented host', () => {
		expect(RITEKIT_API_BASE).toBe('https://api.ritekit.com');
	});

	it('sends the Client ID as the client_id query parameter', async () => {
		respond({ result: true, message: 'OK' }, 200);

		await makeRiteKitRequest(API_KEY, {
			method: 'GET',
			path: '/v1/link/cta',
			replayable: true,
		});

		const request = fetchMock.mock.calls[0][0] as string;
		const parsed = new URL(request);
		expect(parsed.origin).toBe('https://api.ritekit.com');
		expect(parsed.pathname).toBe('/v1/link/cta');
		expect(parsed.searchParams.get('client_id')).toBe(API_KEY);
	});

	it('does not put the Client ID in an Authorization header', async () => {
		respond({ result: true }, 200);

		await makeRiteKitRequest(API_KEY, {
			method: 'GET',
			path: '/v1/search/trending',
			replayable: true,
		});

		const init = fetchMock.mock.calls[0][1] as RequestInit;
		const headers = new Headers(init.headers);
		expect(headers.get('authorization')).toBeNull();
		expect(headers.get('x-api-key')).toBeNull();
	});

	it('lets an input not override the Client ID', async () => {
		respond({ result: true }, 200);

		await makeRiteKitRequest(API_KEY, {
			method: 'GET',
			path: '/v1/stats/multiple-hashtags',
			// A caller cannot smuggle a different credential past the builder.
			query: { tags: 'jobs', client_id: 'someone-elses-key' },
			replayable: true,
		});

		const parsed = new URL(fetchMock.mock.calls[0][0] as string);
		expect(parsed.searchParams.get('client_id')).toBe(API_KEY);
		expect(parsed.searchParams.getAll('client_id')).toHaveLength(1);
	});

	it('passes the query parameters through', async () => {
		respond({ result: true }, 200);

		await makeRiteKitRequest(API_KEY, {
			method: 'GET',
			path: '/v1/stats/multiple-hashtags',
			query: { tags: 'jobs,hello' },
			replayable: true,
		});

		const parsed = new URL(fetchMock.mock.calls[0][0] as string);
		// One comma-separated value, not two parameters.
		expect(parsed.searchParams.getAll('tags')).toEqual(['jobs,hello']);
	});

	it('sends a JSON body with a JSON media type for a POST', async () => {
		respond({ result: true }, 200);

		await makeRiteKitRequest(API_KEY, {
			method: 'POST',
			path: '/api/v2/file/convert-video',
			body: { source: 'https://example.com/v.mp4' },
			replayable: false,
		});

		const init = fetchMock.mock.calls[0][1] as RequestInit;
		expect(new Headers(init.headers).get('content-type')).toContain(
			'application/json',
		);
		expect(JSON.parse(String(init.body))).toEqual({
			source: 'https://example.com/v.mp4',
		});
	});

	it('reads "Verification failed" as an auth error', async () => {
		respond(BAD_KEY, 401);

		const error = await failure(
			makeRiteKitRequest(API_KEY, {
				method: 'GET',
				path: '/v1/link/cta',
				replayable: true,
			}),
		);

		expect(error.status).toBe(401);
		expect(error.message).toBe('RiteKit 401: Verification failed');
		expect(error.isAuthError).toBe(true);
	});

	it('keeps the info hint, which names the fix', async () => {
		respond(NO_KEY, 401);

		const error = await failure(
			makeRiteKitRequest(API_KEY, {
				method: 'GET',
				path: '/v1/link/cta',
				replayable: true,
			}),
		);

		expect(error.info).toBeDefined();
		expect(error.message).toContain('Endpoint is not accessible');
		expect(error.message).toContain('authenticate your call');
	});

	it('reads 402 as an exhausted monthly quota, not a rate limit', async () => {
		respond(OUT_OF_CREDITS, 402);

		const error = await failure(
			makeRiteKitRequest(API_KEY, {
				method: 'GET',
				path: '/v1/stats/multiple-hashtags',
				replayable: true,
			}),
		);

		expect(error.isQuotaExhausted).toBe(true);
		expect(error.status).toBe(402);
	});

	it('does not report a 429 rate limit as exhausted credits', async () => {
		respond(RATE_LIMITED, 429);

		const error = await failure(
			makeRiteKitRequest(API_KEY, {
				method: 'GET',
				path: '/v1/stats/multiple-hashtags',
				replayable: true,
			}),
		);

		expect(error.status).toBe(429);
		expect(error.isQuotaExhausted).toBe(false);
	});

	it('records whether the failed call may be replayed', async () => {
		respond(RATE_LIMITED, 429, { 'Retry-After': '3' });

		const error = await failure(
			makeRiteKitRequest(API_KEY, {
				method: 'POST',
				path: '/api/v2/file/convert-video',
				replayable: false,
			}),
		);

		expect(error.replayable).toBe(false);
		expect(error.method).toBe('POST');
		// corsair/http reports Retry-After in milliseconds.
		expect(error.retryAfter).toBe(3000);
	});

	it('wraps a transport failure and keeps its cause', async () => {
		const cause = new Error('socket hang up');
		fetchMock.mockRejectedValueOnce(cause);

		const error = await failure(
			makeRiteKitRequest(API_KEY, {
				method: 'GET',
				path: '/v1/link/cta',
				replayable: true,
			}),
		);

		expect(error.status).toBeUndefined();
		expect(error.message).toBe('socket hang up');
		expect(error.cause).toBe(cause);
	});

	it('drops the cause of an HTTP error, which would retain the Client ID', async () => {
		respond(BAD_KEY, 401);

		const error = await failure(
			makeRiteKitRequest(API_KEY, {
				method: 'GET',
				path: '/v1/link/cta',
				replayable: true,
			}),
		);

		expect(error.cause).toBeUndefined();
	});

	it('accepts an override header for a route that answers with something else', async () => {
		respond({ result: true }, 200);

		await makeRiteKitRequest(API_KEY, {
			method: 'GET',
			path: '/v2/image/quote',
			accept: 'image/*',
			replayable: true,
		});

		const init = fetchMock.mock.calls[0][1] as RequestInit;
		expect(new Headers(init.headers).get('accept')).toBe('image/*');
	});
});

describe('describeRiteKitError', () => {
	it('leaves out a code that repeats the status', () => {
		expect(describeRiteKitError(404, { code: 404, message: 'Nope' }, 'x')).toBe(
			'RiteKit 404: Nope',
		);
	});

	it('adds a code that differs from the status', () => {
		expect(describeRiteKitError(502, { code: 500, message: 'Down' }, 'x')).toBe(
			'RiteKit 502 500: Down',
		);
	});

	it('appends the info hint in parentheses', () => {
		expect(
			describeRiteKitError(
				401,
				{ message: 'Denied', info: 'see the docs' },
				'x',
			),
		).toBe('RiteKit 401: Denied (see the docs)');
	});

	it('falls back to the supplied message when the body has none', () => {
		expect(describeRiteKitError(500, null, 'Server error')).toBe(
			'RiteKit 500: Server error',
		);
	});

	it('returns the bare message with no status', () => {
		expect(describeRiteKitError(undefined, {}, 'Network error')).toBe(
			'Network error',
		);
	});
});
