import { inspect } from 'node:util';
import { ApiError } from 'corsair/http';
import { describePersistiqError, makePersistiqRequest } from './client';
import { unauthorized } from './test-fixtures';

const API_KEY = 'pq-test-key';

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

describe('makePersistiqRequest', () => {
	it('authenticates in the x-api-key header', async () => {
		respond({ status: 'success' }, 200);

		await makePersistiqRequest(API_KEY, { method: 'GET', path: '/v1/users' });

		const sent = lastCall();
		expect(sent.url).toBe('https://api.persistiq.com/v1/users');
		expect(sent.headers.get('x-api-key')).toBe(API_KEY);
	});

	it('keeps the status and envelope detail on the rebuilt error', async () => {
		respond(unauthorized, 401);

		const error = await failure(
			makePersistiqRequest(API_KEY, { method: 'GET', path: '/v1/users' }),
		);
		expect(error.status).toBe(401);
		expect(error.message).toContain('Failed to find api key');
		// R8: core's own ApiError, so management maps it to its real status.
		expect(error.name).toBe('ApiError');
		expect(error.constructor).toBe(ApiError);
	});

	it('keeps no request body on the rebuilt error', async () => {
		respond(unauthorized, 401);

		const error = await failure(
			makePersistiqRequest(API_KEY, {
				method: 'POST',
				path: '/v1/leads',
				body: { email: 'john@example.com' },
			}),
		);
		const printed = inspect(error);
		expect(printed).not.toContain('john@example.com');
		expect(error.message).not.toContain('john@example.com');
	});

	it('masks the key PersistIQ echoes in its 401 message and body', async () => {
		respond(
			{
				status: 'error',
				error: {
					reason: 'unauthorized',
					message: `Failed to find api key: ${API_KEY}.  Did you set header 'x-api-key' correctly?`,
				},
			},
			401,
		);

		const error = await failure(
			makePersistiqRequest(API_KEY, { method: 'GET', path: '/v1/users' }),
		);
		expect(error.message).toContain('Failed to find api key: [redacted]');
		expect(error.message).not.toContain(API_KEY);
		expect(JSON.stringify(error.body)).not.toContain(API_KEY);
		expect(inspect(error, { depth: 10 })).not.toContain(API_KEY);
	});

	it('masks an email address used as the lead id in the error URL', async () => {
		respond({ status: 'error', error: { reason: 'not_found' } }, 404);

		const error = await failure(
			makePersistiqRequest(API_KEY, {
				method: 'GET',
				path: `/v1/leads/${encodeURIComponent('john@example.com')}`,
			}),
		);
		expect(error.url).toBe('/v1/leads/[email]');
		expect(inspect(error, { depth: 10 })).not.toContain('example.com');
	});

	it('lets transport failures through unwrapped', async () => {
		fetchMock.mockRejectedValueOnce(new Error('connection reset'));

		await expect(
			makePersistiqRequest(API_KEY, { method: 'GET', path: '/v1/users' }),
		).rejects.toThrow('connection reset');
	});

	it('retries a 429 at the transport, honouring Retry-After', async () => {
		respond({ status: 'error', error: { message: 'Slow down' } }, 429);
		respond({ status: 'success' }, 200);

		const result = await makePersistiqRequest(API_KEY, {
			method: 'GET',
			path: '/v1/users',
		});
		expect(result).toEqual({ status: 'success' });
		expect(fetchMock).toHaveBeenCalledTimes(2);
	});
});

describe('describePersistiqError', () => {
	it('reads the documented { status, error } envelope', () => {
		expect(describePersistiqError(unauthorized, 'fallback')).toBe(
			"Failed to find api key: invalid.  Did you set header 'x-api-key' correctly?",
		);
	});

	it('uses the reason when the message is absent', () => {
		expect(
			describePersistiqError(
				{ status: 'error', error: { reason: 'bad_request' } },
				'fallback',
			),
		).toBe('bad_request');
	});

	it('falls back on anything else', () => {
		expect(describePersistiqError(null, 'fallback')).toBe('fallback');
	});
});
