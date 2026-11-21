import { inspect } from 'node:util';
import { ApiError } from 'corsair/http';
import { describePerigonError, makePerigonRequest } from './client';
import { invalidKey } from './test-fixtures';

const API_KEY = 'pg-test-key';

let fetchMock: jest.SpyInstance;

// unknown: response bodies are arbitrary JSON or text.
function respond(body: unknown, status: number) {
	fetchMock.mockResolvedValueOnce(
		new Response(typeof body === 'string' ? body : JSON.stringify(body), {
			status,
			headers: { 'Content-Type': 'application/json' },
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

function lastCall() {
	const [url, init] = fetchMock.mock.calls.at(-1) as [string, RequestInit];
	return { url, init, headers: new Headers(init.headers) };
}

beforeEach(() => {
	// Any call a test did not queue a response for throws, so no test can
	// reach the real API.
	fetchMock = jest.spyOn(globalThis, 'fetch').mockImplementation(() => {
		throw new Error('unmocked fetch in a unit test');
	});
});

afterEach(() => {
	fetchMock.mockRestore();
});

describe('makePerigonRequest', () => {
	it('authenticates in the x-api-key header, not the URL', async () => {
		respond({ articles: [] }, 200);

		await makePerigonRequest(API_KEY, {
			method: 'GET',
			path: '/v1/articles/all',
			query: { page: 2 },
		});

		const sent = lastCall();
		expect(sent.url).toBe('https://api.perigon.io/v1/articles/all?page=2');
		expect(sent.headers.get('x-api-key')).toBe(API_KEY);
		expect(sent.url).not.toContain(API_KEY);
	});

	it('keeps the status and envelope detail on the rebuilt error', async () => {
		respond(invalidKey, 401);

		const error = await failure(
			makePerigonRequest(API_KEY, { method: 'GET', path: '/v1/articles/all' }),
		);
		expect(error.status).toBe(401);
		expect(error.message).toContain('Invalid API key');
		// R8: core's own ApiError, so management maps it to its real status.
		expect(error.name).toBe('ApiError');
		expect(error.constructor).toBe(ApiError);
	});

	it('keeps no licensed article content on the rebuilt error', async () => {
		respond(invalidKey, 401);

		const error = await failure(
			makePerigonRequest(API_KEY, {
				method: 'GET',
				path: '/v1/articles/all',
				query: { q: 'licensed body text probe' },
			}),
		);
		const printed = inspect(error);
		expect(printed).not.toContain('licensed body text probe');
	});

	it('lets transport failures through unwrapped', async () => {
		fetchMock.mockRejectedValueOnce(new Error('connection reset'));

		await expect(
			makePerigonRequest(API_KEY, { method: 'GET', path: '/v1/articles/all' }),
		).rejects.toThrow('connection reset');
	});

	it('retries a 429 at the transport, honouring Retry-After', async () => {
		respond({ message: 'Slow down' }, 429);
		respond({ articles: [] }, 200);

		const result = await makePerigonRequest(API_KEY, {
			method: 'GET',
			path: '/v1/articles/all',
		});
		expect(result).toEqual({ articles: [] });
		expect(fetchMock).toHaveBeenCalledTimes(2);
	});
});

describe('describePerigonError', () => {
	it('reads the documented { status, message, timestamp } envelope', () => {
		expect(describePerigonError(invalidKey, 'fallback')).toBe(
			'Invalid API key.',
		);
	});

	it('falls back on anything else', () => {
		expect(describePerigonError(null, 'fallback')).toBe('fallback');
	});
});
