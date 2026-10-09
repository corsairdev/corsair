import { ReductoAPIError } from './client';
import { errorHandlers } from './error-handlers';

function reductoError(
	status: number,
	method: 'GET' | 'POST' | 'DELETE',
	message = 'request failed',
): ReductoAPIError {
	const error = new ReductoAPIError(message, { method });
	Object.assign(error, { status, retryAfter: 2000 });
	return error;
}

function classify(error: Error): string {
	if (errorHandlers.VALIDATION_ERROR.match(error)) return 'VALIDATION_ERROR';
	if (errorHandlers.RATE_LIMIT_ERROR.match(error)) return 'RATE_LIMIT_ERROR';
	if (errorHandlers.AUTH_ERROR.match(error)) return 'AUTH_ERROR';
	if (errorHandlers.BAD_REQUEST_ERROR.match(error)) return 'BAD_REQUEST_ERROR';
	if (errorHandlers.SERVER_ERROR.match(error)) return 'SERVER_ERROR';
	if (errorHandlers.TIMEOUT_ERROR.match(error)) return 'TIMEOUT_ERROR';
	if (errorHandlers.DEFAULT.match()) return 'DEFAULT';
	return 'UNMATCHED';
}

describe('Reducto error handlers', () => {
	it('classifies 429, auth, validation, and server errors', () => {
		expect(classify(reductoError(429, 'GET'))).toBe('RATE_LIMIT_ERROR');
		expect(classify(reductoError(401, 'GET', 'unauthorized'))).toBe(
			'AUTH_ERROR',
		);
		expect(classify(reductoError(422, 'DELETE'))).toBe('VALIDATION_ERROR');
		expect(classify(reductoError(400, 'POST'))).toBe('BAD_REQUEST_ERROR');
		expect(classify(reductoError(500, 'POST'))).toBe('SERVER_ERROR');
		expect(classify(new Error('timed out'))).toBe('TIMEOUT_ERROR');
		expect(classify(new Error('nope'))).toBe('DEFAULT');
	});

	it('retries a rate limit only for GET, and never retries a billed write', async () => {
		const get = await errorHandlers.RATE_LIMIT_ERROR.handler(
			reductoError(429, 'GET'),
		);
		const post = await errorHandlers.RATE_LIMIT_ERROR.handler(
			reductoError(429, 'POST'),
		);
		const server = await errorHandlers.SERVER_ERROR.handler();
		const timeout = await errorHandlers.TIMEOUT_ERROR.handler();

		expect(get).toMatchObject({
			maxRetries: 3,
			headersRetryAfterMs: 2000,
		});
		expect(post).toEqual({ maxRetries: 0 });
		expect(server).toEqual({ maxRetries: 0 });
		expect(timeout).toEqual({ maxRetries: 0 });
	});
});
