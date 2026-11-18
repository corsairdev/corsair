import { CallinglyAPIError, makeCallinglyRequest } from './client';
import { errorHandlers } from './error-handlers';

const fetchMock = jest.spyOn(globalThis, 'fetch');

beforeEach(() => fetchMock.mockReset());
afterAll(() => fetchMock.mockRestore());

async function failure(request: ReturnType<typeof makeCallinglyRequest>) {
	const error = await request.then(
		() => undefined,
		(reason: Error) => reason,
	);
	if (!(error instanceof CallinglyAPIError)) {
		throw new Error('expected a CallinglyAPIError');
	}
	return error;
}

describe('makeCallinglyRequest', () => {
	it('adds account_id to the query for GET and to the body for POST', async () => {
		fetchMock.mockImplementation(async () => new Response('[]'));

		await makeCallinglyRequest('teams', 'key', { accountId: 42 });
		expect(String(fetchMock.mock.calls[0]?.[0])).toBe(
			'https://api.callingly.com/v1/teams?account_id=42',
		);

		await makeCallinglyRequest('teams', 'key', {
			method: 'POST',
			body: { name: 'Main Team' },
			accountId: 42,
		});
		expect(fetchMock.mock.calls[1]?.[1]?.body).toBe(
			JSON.stringify({ account_id: 42, name: 'Main Team' }),
		);
	});

	it('maps a 401 to AUTH_ERROR with no retries', async () => {
		fetchMock.mockResolvedValueOnce(
			new Response(JSON.stringify({ message: 'Unauthenticated.' }), {
				status: 401,
			}),
		);
		const error = await failure(makeCallinglyRequest('leads', 'bad-key'));

		expect(error.message).toBe('Unauthenticated.');
		expect(error.status).toBe(401);
		expect(errorHandlers.AUTH_ERROR.match(error)).toBe(true);
		expect(errorHandlers.RATE_LIMIT_ERROR.match(error)).toBe(false);
		await expect(errorHandlers.AUTH_ERROR.handler()).resolves.toEqual({
			maxRetries: 0,
		});
	});

	it('maps a 429 to RATE_LIMIT_ERROR and honours Retry-After on reads', async () => {
		fetchMock.mockResolvedValueOnce(
			new Response(JSON.stringify({ message: 'Too Many Attempts.' }), {
				status: 429,
				headers: { 'Retry-After': '7' },
			}),
		);
		const error = await failure(makeCallinglyRequest('calls', 'key'));

		expect(error.retryAfterMs).toBe(7000);
		expect(errorHandlers.RATE_LIMIT_ERROR.match(error)).toBe(true);
		await expect(
			errorHandlers.RATE_LIMIT_ERROR.handler(error),
		).resolves.toEqual({
			maxRetries: 3,
			headersRetryAfterMs: 7000,
			retryStrategy: 'exponential_backoff',
		});
	});

	it('never retries a rate-limited POST /calls, which dials a real phone', async () => {
		fetchMock.mockResolvedValueOnce(new Response('', { status: 429 }));
		const error = await failure(
			makeCallinglyRequest('calls', 'key', {
				method: 'POST',
				body: { team_id: 1, phone_number: '+14801234567' },
			}),
		);

		expect(error.message).toBe('Callingly request failed (429)');
		await expect(
			errorHandlers.RATE_LIMIT_ERROR.handler(error),
		).resolves.toEqual({
			maxRetries: 0,
			headersRetryAfterMs: undefined,
			retryStrategy: 'exponential_backoff',
		});
	});

	it('wraps network failures in CallinglyAPIError', async () => {
		fetchMock.mockRejectedValueOnce(new TypeError('fetch failed'));
		const error = await failure(makeCallinglyRequest('teams', 'key'));

		expect(error.message).toBe('fetch failed');
		expect(error.status).toBeUndefined();
		expect(errorHandlers.DEFAULT.match()).toBe(true);
	});
});
