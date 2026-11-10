import {
	describeRocketReachError,
	makeRocketReachRequest,
	ROCKETREACH_API_BASE,
	RocketReachAPIError,
} from './client';
import {
	INVALID_KEY,
	NO_LOOKUP_CREDITS,
	NO_VERIFICATION_CREDITS,
	RATE_LIMITED,
} from './test-fixtures';

const API_KEY = 'rocketreach-secret-test-key';

let fetchMock: jest.SpyInstance;

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch');
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
async function failure(
	promise: Promise<unknown>,
): Promise<RocketReachAPIError> {
	const error = await promise.catch((e: unknown) => e);
	expect(error).toBeInstanceOf(RocketReachAPIError);
	if (!(error instanceof RocketReachAPIError)) throw error;
	return error;
}

describe('RocketReach client', () => {
	it('points at the documented v2 host', () => {
		expect(ROCKETREACH_API_BASE).toBe('https://api.rocketreach.co/api/v2');
	});

	it('sends the key in Api-Key and never in the query string', async () => {
		respond({ id: 1 }, 200);

		await makeRocketReachRequest(API_KEY, {
			method: 'GET',
			path: '/account/',
			replayable: true,
		});

		const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
		expect(url).toBe('https://api.rocketreach.co/api/v2/account/');
		const headers = new Headers(init.headers);
		expect(headers.get('api-key')).toBe(API_KEY);
		expect(headers.get('accept')).toBe('application/json');
		// The query-parameter transport is deprecated, so it is never used.
		expect(url).not.toContain('api_key');
		expect(headers.get('authorization')).toBeNull();
	});

	it('serialises a search body as JSON', async () => {
		respond([], 201);

		await makeRocketReachRequest(API_KEY, {
			method: 'POST',
			path: '/person/search',
			body: { query: { current_title: ['CTO'] }, page_size: 10 },
			replayable: true,
		});

		const init = fetchMock.mock.calls[0][1] as RequestInit;
		expect(new Headers(init.headers).get('content-type')).toContain(
			'application/json',
		);
		expect(JSON.parse(String(init.body))).toEqual({
			query: { current_title: ['CTO'] },
			page_size: 10,
		});
	});

	it('reads the error_code slug from a failure body', async () => {
		respond(INVALID_KEY, 401);

		const error = await failure(
			makeRocketReachRequest(API_KEY, {
				method: 'GET',
				path: '/account/',
				replayable: true,
			}),
		);

		expect(error.status).toBe(401);
		expect(error.code).toBe('authentication_failed');
		expect(error.message).toBe(
			'RocketReach 401 (authentication_failed): Invalid API key',
		);
		expect(error.isAuthError).toBe(true);
	});

	it('keeps the integer error_code of an insufficient-credits 402', async () => {
		respond(NO_VERIFICATION_CREDITS, 402);

		const error = await failure(
			makeRocketReachRequest(API_KEY, {
				method: 'POST',
				path: '/email/verify/',
				replayable: false,
			}),
		);

		expect(error.status).toBe(402);
		expect(error.code).toBe(202);
		// The pool and where to buy more are what a caller needs.
		expect(error.creditType).toBe('email_verification');
		expect(error.purchaseUrl).toContain('purchase_credits');
		expect(error.isOutOfCredits).toBe(true);
	});

	it('treats a 403 with no credit_type as out of lookup credits', async () => {
		respond(NO_LOOKUP_CREDITS, 403);

		const error = await failure(
			makeRocketReachRequest(API_KEY, {
				method: 'GET',
				path: '/person/lookup',
				replayable: false,
			}),
		);

		expect(error.status).toBe(403);
		// The docs say a 403 on a lookup is a spent balance, not a permission
		// problem, and unlike a 402 it carries no structured credit fields.
		expect(error.isOutOfLookupCredits).toBe(true);
		expect(error.creditType).toBeUndefined();
		expect(error.message).toContain('run out of lookup credits');
	});

	it('records whether the failed call may be replayed', async () => {
		respond(RATE_LIMITED, 429, { 'Retry-After': '7' });

		const error = await failure(
			makeRocketReachRequest(API_KEY, {
				method: 'GET',
				path: '/person/lookup',
				replayable: false,
			}),
		);

		expect(error.replayable).toBe(false);
		expect(error.method).toBe('GET');
		// corsair/http reports Retry-After in milliseconds.
		expect(error.retryAfter).toBe(7000);
	});

	it('wraps a transport failure and keeps its cause', async () => {
		const cause = new Error('socket hang up');
		fetchMock.mockRejectedValueOnce(cause);

		const error = await failure(
			makeRocketReachRequest(API_KEY, {
				method: 'GET',
				path: '/account/',
				replayable: true,
			}),
		);

		expect(error.status).toBeUndefined();
		expect(error.cause).toBe(cause);
	});

	it('drops the cause of an HTTP error, which would retain the Api-Key header', async () => {
		respond(INVALID_KEY, 401);

		const error = await failure(
			makeRocketReachRequest(API_KEY, {
				method: 'GET',
				path: '/account/',
				replayable: true,
			}),
		);

		expect(error.cause).toBeUndefined();
	});

	it('returns a named response header instead of a body', async () => {
		fetchMock.mockResolvedValueOnce(
			new Response(null, {
				status: 200,
				headers: { 'RR-Request-ID': '3f2504e0-4f89-11d3-9a0c-0305e82c3301' },
			}),
		);

		const result = await makeRocketReachRequest(API_KEY, {
			method: 'POST',
			path: '/bulkLookup',
			body: { queries: [{ email: 'a@b.com' }] },
			responseHeader: 'RR-Request-ID',
			replayable: false,
		});

		expect(result).toBe('3f2504e0-4f89-11d3-9a0c-0305e82c3301');
	});
});

describe('describeRocketReachError', () => {
	it('names the error_code alongside the status', () => {
		expect(
			describeRocketReachError(
				400,
				{ detail: 'Bad email', error_code: 'invalid' },
				'x',
			),
		).toBe('RocketReach 400 (invalid): Bad email');
	});

	it('omits an error_code that just repeats the detail', () => {
		expect(
			describeRocketReachError(
				400,
				{ detail: 'invalid', error_code: 'invalid' },
				'x',
			),
		).toBe('RocketReach 400: invalid');
	});

	it('falls back to the supplied message when the body has none', () => {
		expect(describeRocketReachError(500, null, 'Server error')).toBe(
			'RocketReach 500: Server error',
		);
	});

	it('accepts the message key as well as detail', () => {
		expect(describeRocketReachError(401, { message: 'No key' }, 'x')).toBe(
			'RocketReach 401: No key',
		);
	});

	it('returns the bare message with no status', () => {
		expect(describeRocketReachError(undefined, {}, 'Network error')).toBe(
			'Network error',
		);
	});

	it('keeps the code without a status', () => {
		expect(
			describeRocketReachError(
				undefined,
				{ detail: 'Down', error_code: 'x' },
				'y',
			),
		).toBe('x: Down');
	});
});
