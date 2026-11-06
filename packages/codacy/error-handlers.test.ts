import { CodacyAPIError } from './client';
import { errorHandlers } from './error-handlers';

function makeCodacyError(
	status: number | undefined,
	message: string,
	options?: { retryAfter?: number },
): CodacyAPIError {
	const err = new CodacyAPIError(message);
	Object.defineProperty(err, 'status', { value: status, writable: true });
	if (options?.retryAfter !== undefined) {
		Object.defineProperty(err, 'retryAfter', {
			value: options.retryAfter,
			writable: true,
		});
	}
	return err;
}

describe('Codary error handlers', () => {
	it('matches and retries 429 rate limits with the Retry-After header', async () => {
		const error = makeCodacyError(429, 'Rate limit exceeded', {
			retryAfter: 5000,
		});
		expect(errorHandlers.RATE_LIMIT_ERROR.match(error)).toBe(true);
		const result = await errorHandlers.RATE_LIMIT_ERROR.handler(error);
		expect(result.maxRetries).toBe(3);
		expect(result.retryStrategy).toBe('exponential_backoff');
		expect(result.headersRetryAfterMs).toBe(5000);
	});

	it('matches 429 by message when status is missing', async () => {
		const error = makeCodacyError(undefined, 'HTTP 429 Too Many Requests');
		expect(errorHandlers.RATE_LIMIT_ERROR.match(error)).toBe(true);
	});

	it('matches and does not retry 401 auth failures', async () => {
		const error = makeCodacyError(401, 'Unauthorized');
		expect(errorHandlers.AUTH_ERROR.match(error)).toBe(true);
		const result = await errorHandlers.AUTH_ERROR.handler(error);
		expect(result.maxRetries).toBe(0);
	});

	it('matches 403 forbidden', async () => {
		const error = makeCodacyError(403, 'Forbidden');
		expect(errorHandlers.FORBIDDEN_ERROR.match(error)).toBe(true);
		const result = await errorHandlers.FORBIDDEN_ERROR.handler(error);
		expect(result.maxRetries).toBe(0);
	});

	it('matches 404 not found', async () => {
		const error = makeCodacyError(404, 'Not Found');
		expect(errorHandlers.NOT_FOUND_ERROR.match(error)).toBe(true);
		const result = await errorHandlers.NOT_FOUND_ERROR.handler(error);
		expect(result.maxRetries).toBe(0);
	});

	it('matches 422 validation failures', async () => {
		const error = makeCodacyError(422, 'Unprocessable Entity');
		expect(errorHandlers.VALIDATION_ERROR.match(error)).toBe(true);
		const result = await errorHandlers.VALIDATION_ERROR.handler(error);
		expect(result.maxRetries).toBe(0);
	});

	it('retries 5xx server errors up to 2 times', async () => {
		const error = makeCodacyError(500, 'Internal Server Error');
		expect(errorHandlers.SERVER_ERROR.match(error)).toBe(true);
		const result = await errorHandlers.SERVER_ERROR.handler(error);
		expect(result.maxRetries).toBe(2);
		expect(result.retryStrategy).toBe('exponential_backoff');
	});

	it('treats any other error as a default no-retry failure', async () => {
		const error = makeCodacyError(undefined, 'Weird failure');
		expect(errorHandlers.DEFAULT.match(error)).toBe(true);
		const result = await errorHandlers.DEFAULT.handler(error);
		expect(result.maxRetries).toBe(0);
	});
});
