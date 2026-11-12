import {
	bracketQuery,
	describeRefinerError,
	listQuery,
	makeRefinerRequest,
	REFINER_API_BASE,
	RefinerAPIError,
	segment,
} from './client';
import { NO_API_KEY, NOT_FOUND, RATE_LIMITED } from './test-fixtures';

const API_KEY = 'refiner-secret-test-key';

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
async function failure(promise: Promise<unknown>): Promise<RefinerAPIError> {
	const error = await promise.catch((e: unknown) => e);
	expect(error).toBeInstanceOf(RefinerAPIError);
	if (!(error instanceof RefinerAPIError)) throw error;
	return error;
}

describe('Refiner client', () => {
	it('points at the documented v1 host', () => {
		expect(REFINER_API_BASE).toBe('https://api.refiner.io/v1');
	});

	it('sends the key as a Bearer token', async () => {
		respond({ message: 'ok' }, 200);

		await makeRefinerRequest(API_KEY, {
			method: 'GET',
			path: '/account',
			replayable: true,
		});

		// The spy records fetch's arguments untyped; fetch was called as (url, init).
		const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
		expect(url).toBe('https://api.refiner.io/v1/account');
		const headers = new Headers(init.headers);
		expect(headers.get('authorization')).toBe(`Bearer ${API_KEY}`);
		expect(headers.get('accept')).toBe('application/json');
		// The alternative transports are never used.
		expect(url).not.toContain('api_key');
		expect(headers.get('x-api-key')).toBeNull();
	});

	it('serialises a body as JSON with a JSON media type', async () => {
		respond({ message: 'ok' }, 200);

		await makeRefinerRequest(API_KEY, {
			method: 'POST',
			path: '/identify-user',
			body: { id: 'user-1', email: 'a@b.com' },
			replayable: true,
		});

		// The spy records fetch's arguments untyped; the second one is the init.
		const init = fetchMock.mock.calls[0][1] as RequestInit;
		expect(new Headers(init.headers).get('content-type')).toContain(
			'application/json',
		);
		expect(JSON.parse(String(init.body))).toEqual({
			id: 'user-1',
			email: 'a@b.com',
		});
	});

	it('reads a 401 with no code in the body', async () => {
		respond(NO_API_KEY, 401);

		const error = await failure(
			makeRefinerRequest(API_KEY, {
				method: 'GET',
				path: '/account',
				replayable: true,
			}),
		);

		expect(error.status).toBe(401);
		expect(error.message).toBe('Refiner 401: No API key found in headers');
		expect(error.isAuthError).toBe(true);
	});

	it('keeps a code that differs from the status', async () => {
		respond(NOT_FOUND, 404);

		const error = await failure(
			makeRefinerRequest(API_KEY, {
				method: 'GET',
				path: '/contact',
				replayable: true,
			}),
		);

		expect(error.message).toBe('Refiner 404: Resource or route not found.');
		expect(error.code).toBe(404);
		expect(error.isNotFound).toBe(true);
	});

	it('records whether the failed call may be replayed', async () => {
		respond(RATE_LIMITED, 429, { 'Retry-After': '5' });

		const error = await failure(
			makeRefinerRequest(API_KEY, {
				method: 'POST',
				path: '/track-event',
				replayable: false,
			}),
		);

		expect(error.replayable).toBe(false);
		expect(error.method).toBe('POST');
		// corsair/http reports Retry-After in milliseconds.
		expect(error.retryAfter).toBe(5000);
	});

	it('wraps a transport failure and keeps its cause', async () => {
		const cause = new Error('socket hang up');
		fetchMock.mockRejectedValueOnce(cause);

		const error = await failure(
			makeRefinerRequest(API_KEY, {
				method: 'GET',
				path: '/account',
				replayable: true,
			}),
		);

		expect(error.status).toBeUndefined();
		expect(error.cause).toBe(cause);
	});

	it('drops the cause of an HTTP error, which would retain the bearer token', async () => {
		respond(NO_API_KEY, 401);

		const error = await failure(
			makeRefinerRequest(API_KEY, {
				method: 'GET',
				path: '/account',
				replayable: true,
			}),
		);

		expect(error.cause).toBeUndefined();
	});
});

describe('bracketQuery', () => {
	it('turns a filter object into bracketed keys', () => {
		expect(bracketQuery('response_data', { nps: 9 })).toEqual({
			'response_data[nps]': 9,
		});
	});

	it('builds one key per entry', () => {
		const query = bracketQuery('contact_data', {
			country: 'France',
			plan: 'pro',
		});

		expect(Object.keys(query)).toHaveLength(2);
		expect(query['contact_data[country]']).toBe('France');
		expect(query['contact_data[plan]']).toBe('pro');
	});

	it('returns nothing for an absent filter', () => {
		expect(bracketQuery('response_data', undefined)).toEqual({});
	});

	it('keeps a boolean value a boolean', () => {
		expect(bracketQuery('account_data', { trial: true })).toEqual({
			'account_data[trial]': true,
		});
	});
});

describe('listQuery', () => {
	it('builds one indexed key per value', () => {
		expect(listQuery('form_uuids', ['a', 'b'])).toEqual({
			'form_uuids[0]': 'a',
			'form_uuids[1]': 'b',
		});
	});

	it('returns nothing for an empty or absent list', () => {
		expect(listQuery('form_uuids', [])).toEqual({});
		expect(listQuery('form_uuids', undefined)).toEqual({});
	});
});

describe('segment', () => {
	it('percent-encodes a value', () => {
		expect(segment('a/b c')).toBe('a%2Fb%20c');
	});
});

describe('describeRefinerError', () => {
	it('omits a code that repeats the status', () => {
		expect(describeRefinerError(404, { error: 'Nope', code: 404 }, 'x')).toBe(
			'Refiner 404: Nope',
		);
	});

	it('adds a code that differs from the status', () => {
		expect(describeRefinerError(502, { error: 'Down', code: 500 }, 'x')).toBe(
			'Refiner 502 500: Down',
		);
	});

	it('falls back to the supplied message', () => {
		expect(describeRefinerError(500, null, 'Server error')).toBe(
			'Refiner 500: Server error',
		);
	});

	it('accepts a message key as well as error', () => {
		expect(describeRefinerError(400, { message: 'Bad' }, 'x')).toBe(
			'Refiner 400: Bad',
		);
	});

	it('returns the bare text with no status', () => {
		expect(describeRefinerError(undefined, {}, 'Network error')).toBe(
			'Network error',
		);
	});
});
