import { ApiError } from 'corsair/http';
import { AnthropicAdministratorAPIError } from './client';
import { errorHandlers } from './error-handlers';

/** Builds the error corsair/http actually throws for a given status. */
function transportError(status: number, message: string, retryAfter?: number) {
	return new ApiError(
		{ method: 'GET', url: '/v1/organizations/users' } as never,
		{
			url: '/v1/organizations/users',
			ok: false,
			status,
			statusText: message,
			body: { type: 'error', error: { type: 'rate_limit_error', message } },
		} as never,
		message,
		retryAfter === undefined ? undefined : { retryAfter },
	);
}

/** Wraps it the way client.ts does. */
function wrapped(
	status: number,
	message: string,
	method: 'GET' | 'POST' | 'DELETE' = 'GET',
	retryAfter?: number,
) {
	const cause = transportError(status, message, retryAfter);
	return new AnthropicAdministratorAPIError(cause.message, { cause, method });
}

describe('error handling survives the client wrapper', () => {
	// AUTH_ERROR intentionally logs guidance about Admin keys; keep test output clean.
	let consoleError: jest.SpyInstance;
	beforeAll(() => {
		consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
	});
	afterAll(() => consoleError.mockRestore());

	it('matches a 429 after wrapping, despite the message being "Too Many Requests"', async () => {
		// corsair throws 429 with the literal message "Too Many Requests" — it
		// contains neither "429" nor "rate_limited", so status must be preserved.
		const error = wrapped(429, 'Too Many Requests', 'GET', 30_000);

		expect(error.message).toBe('Too Many Requests');
		expect(errorHandlers.RATE_LIMIT_ERROR.match(error)).toBe(true);

		const result = await errorHandlers.RATE_LIMIT_ERROR.handler(error);
		expect(result.maxRetries).toBe(3);
		expect(result.headersRetryAfterMs).toBe(30_000);
	});

	it('retries a rate limit on any method', async () => {
		for (const method of ['GET', 'POST', 'DELETE'] as const) {
			const error = wrapped(429, 'Too Many Requests', method);
			expect(errorHandlers.RATE_LIMIT_ERROR.match(error)).toBe(true);
		}
	});

	it('does not retry auth failures', async () => {
		for (const status of [401, 403]) {
			const error = wrapped(status, 'Unauthorized');
			expect(errorHandlers.AUTH_ERROR.match(error)).toBe(true);
			expect((await errorHandlers.AUTH_ERROR.handler(error)).maxRetries).toBe(
				0,
			);
		}
	});

	it('does not retry not-found or invalid-request errors', async () => {
		expect(errorHandlers.NOT_FOUND_ERROR.match(wrapped(404, 'Not Found'))).toBe(
			true,
		);
		expect(
			errorHandlers.INVALID_REQUEST_ERROR.match(wrapped(400, 'Bad Request')),
		).toBe(true);
	});

	it('retries a 5xx on GET but never on a mutation', async () => {
		const read = wrapped(500, 'Internal Server Error', 'GET');
		expect((await errorHandlers.SERVER_ERROR.handler(read)).maxRetries).toBe(2);

		for (const method of ['POST', 'DELETE'] as const) {
			const write = wrapped(503, 'Service Unavailable', method);
			expect(errorHandlers.SERVER_ERROR.match(write)).toBe(true);
			expect((await errorHandlers.SERVER_ERROR.handler(write)).maxRetries).toBe(
				0,
			);
		}
	});

	it('surfaces the Anthropic error type from the response body', () => {
		expect(wrapped(429, 'Too Many Requests').errorType).toBe(
			'rate_limit_error',
		);
	});
});
