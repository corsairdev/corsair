import { inspect } from 'node:util';
import { ApiError } from 'corsair/http';
import {
	describeSplitwiseError,
	isNotLoggedIn,
	makeSplitwiseRequest,
	SPLITWISE_API_BASE,
	SplitwiseOperationError,
} from './client';
import { forbidden, unauthorized } from './test-fixtures';
import { captureError } from './test-helpers';

const API_KEY = 'sw-test-key';

let fetchMock: jest.SpyInstance;

// unknown: response bodies are arbitrary JSON.
// unknown: response bodies are arbitrary JSON; each test passes its own.
function respond(
	body: unknown,
	status = 200,
	headers: Record<string, string> = {},
) {
	fetchMock.mockResolvedValueOnce(
		new Response(JSON.stringify(body), {
			status,
			headers: { 'Content-Type': 'application/json', ...headers },
		}),
	);
}

function lastRequest() {
	const [url, init] = fetchMock.mock.calls.at(-1) as [string, RequestInit];
	return {
		url: String(url),
		method: init.method,
		headers: new Headers(init.headers),
		// unknown: the parsed request body, whatever the endpoint serialized.
		body: init.body ? (JSON.parse(String(init.body)) as unknown) : undefined, // unknown: asserted inline.
	};
}

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch');
});

afterEach(() => {
	fetchMock.mockRestore();
});

describe('makeSplitwiseRequest', () => {
	it('sends the personal API key as a Bearer token', async () => {
		respond({ user: {} });

		await makeSplitwiseRequest(API_KEY, {
			method: 'GET',
			path: 'get_current_user',
		});

		const sent = lastRequest();
		expect(sent.url).toBe(`${SPLITWISE_API_BASE}/get_current_user`);
		expect(sent.headers.get('authorization')).toBe(`Bearer ${API_KEY}`);
		expect(sent.headers.get('accept')).toBe('application/json');
	});

	it('serializes a query string and drops undefined values', async () => {
		respond({ expenses: [] });

		await makeSplitwiseRequest(API_KEY, {
			method: 'GET',
			path: 'get_expenses',
			query: { group_id: 321, limit: 20, offset: undefined },
		});

		const url = new URL(lastRequest().url);
		expect(url.searchParams.get('group_id')).toBe('321');
		expect(url.searchParams.get('limit')).toBe('20');
		expect(url.searchParams.has('offset')).toBe(false);
	});

	it('sends a JSON body on POST with the charset Splitwise documents', async () => {
		respond({ success: true });

		await makeSplitwiseRequest(API_KEY, {
			method: 'POST',
			path: 'delete_expense/51023',
			body: { note: 'x' },
		});

		const sent = lastRequest();
		expect(sent.method).toBe('POST');
		expect(sent.headers.get('content-type')).toBe(
			'application/json; charset=utf-8',
		);
		expect(sent.body).toEqual({ note: 'x' });
	});

	it('sends no body on a POST that has none', async () => {
		respond({ success: true });

		await makeSplitwiseRequest(API_KEY, {
			method: 'POST',
			path: 'delete_group/321',
		});

		const sent = lastRequest();
		expect(sent.body).toBeUndefined();
		expect(sent.headers.get('content-type')).toBeNull();
	});

	it('passes the 401 through as core ApiError', async () => {
		respond(unauthorized, 401);

		const error = await captureError(
			makeSplitwiseRequest(API_KEY, {
				method: 'GET',
				path: 'get_current_user',
			}),
		);

		expect(error).toBeInstanceOf(ApiError);
		expect((error as ApiError).status).toBe(401);
		expect(isNotLoggedIn(error)).toBe(true);
	});

	it('reads the first 403 message out of the errors map', async () => {
		respond(forbidden, 403);

		const error = await captureError(
			makeSplitwiseRequest(API_KEY, {
				method: 'GET',
				path: 'get_group/321',
			}),
		);

		expect((error as ApiError).status).toBe(403);
		expect(describeSplitwiseError(403, (error as ApiError).body, '')).toContain(
			'you do not have permission',
		);
	});

	it('retries a 429 in core and keeps Retry-After on the final error', async () => {
		// Core makes 1 attempt plus 3 retries.
		for (let i = 0; i < 4; i += 1) respond({}, 429, { 'Retry-After': '1' });

		const error = await captureError(
			makeSplitwiseRequest(API_KEY, {
				method: 'GET',
				path: 'get_current_user',
			}),
		);

		expect(error).toBeInstanceOf(ApiError);
		expect((error as ApiError).retryAfter).toBe(1000);
		expect((error as ApiError).status).toBe(429);
	}, 20_000);

	it('records the method so writes are not replayed on a 5xx', async () => {
		respond({}, 500);

		const error = await captureError(
			makeSplitwiseRequest(API_KEY, {
				method: 'POST',
				path: 'create_expense',
				body: {},
			}),
		);

		expect((error as ApiError).request.method).toBe('POST');
	});

	it('drops the request body, which can hold a password, from the error', async () => {
		respond({ errors: { base: ['bad'] } }, 400);

		const error = await captureError(
			makeSplitwiseRequest(API_KEY, {
				method: 'POST',
				path: 'update_user/1',
				body: { password: 'hunter2-secret', email: 'a@example.com' },
			}),
		);

		expect(error).toBeInstanceOf(ApiError);
		expect((error as ApiError).request.body).toBeUndefined();
		expect(inspect(error)).not.toContain('hunter2-secret');
		expect(inspect(error)).not.toContain('a@example.com');
	});

	it('never puts the key in the error message or its inspection', async () => {
		respond(unauthorized, 401);

		const error = await captureError(
			makeSplitwiseRequest(API_KEY, {
				method: 'GET',
				path: 'get_current_user',
			}),
		);

		expect((error as Error).message).not.toContain(API_KEY);
		expect(inspect(error)).not.toContain(API_KEY);
		expect(JSON.stringify(error)).not.toContain(API_KEY);
	});
});

describe('describeSplitwiseError', () => {
	it('prefers the 401 `error` field', () => {
		expect(describeSplitwiseError(401, unauthorized, 'fallback')).toBe(
			'Splitwise 401: Invalid API Request: you are not logged in',
		);
	});

	it('falls back to `errors.base[0]`', () => {
		expect(
			describeSplitwiseError(404, { errors: { base: ['gone'] } }, 'x'),
		).toBe('Splitwise 404: gone');
	});

	it('uses the fallback for a body with no message at all', () => {
		expect(describeSplitwiseError(502, '<html>', 'Bad Gateway')).toBe(
			'Splitwise 502: Bad Gateway',
		);
		expect(describeSplitwiseError(undefined, null, 'offline')).toBe('offline');
	});

	it('ignores a non-array `errors.base`', () => {
		expect(
			describeSplitwiseError(400, { errors: { base: 'nope' } }, 'Bad Request'),
		).toBe('Splitwise 400: Bad Request');
	});
});

describe('error classes', () => {
	it('carries the provider error map on a failed write', () => {
		const error = new SplitwiseOperationError('did not apply', {
			base: ['The user has a non-zero balance'],
		});
		expect(error.name).toBe('SplitwiseOperationError');
		expect(error.errors.base).toEqual(['The user has a non-zero balance']);
	});

	it('recognises the not-logged-in 401', () => {
		const error = new ApiError(
			{ method: 'GET', url: 'get_current_user' },
			{
				url: 'https://secure.splitwise.com/api/v3.0/get_current_user',
				ok: false,
				status: 401,
				statusText: 'Unauthorized',
				body: { error: 'Invalid API Request: you are not logged in' },
			},
			'Unauthorized',
		);
		expect(isNotLoggedIn(error)).toBe(true);
		expect(
			isNotLoggedIn(new Error('Invalid API Request: you are not logged in')),
		).toBe(false);
	});
});
