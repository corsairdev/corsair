import { errorHandlers } from './error-handlers';

describe('Dovetail error handlers', () => {
	it('matches and handles rate limit errors', async () => {
		const handler = errorHandlers.RATE_LIMIT_ERROR;
		expect(handler.match(new Error('rate_limited'))).toBe(true);
		expect(handler.match(new Error('Rate limit exceeded'))).toBe(true);
		expect(handler.match(new Error('TooManyRequests 429'))).toBe(true);
		expect(handler.match(new Error('different error'))).toBe(false);

		const result = await handler.handler(new Error('rate_limited'));
		expect(result.maxRetries).toBe(5);
		expect(result.headersRetryAfterMs).toBeUndefined();
	});

	it('matches and handles authentication errors', async () => {
		const handler = errorHandlers.AUTH_ERROR;
		expect(handler.match(new Error('unauthorized'))).toBe(true);
		expect(handler.match(new Error('invalid_auth'))).toBe(true);
		expect(handler.match(new Error('not_authenticated'))).toBe(true);
		expect(handler.match(new Error('HTTP 401 error'))).toBe(true);
		expect(handler.match(new Error('other error'))).toBe(false);

		const result = await handler.handler();
		expect(result.maxRetries).toBe(0);
	});

	it('matches and handles permission errors', async () => {
		const handler = errorHandlers.PERMISSION_ERROR;
		expect(handler.match(new Error('forbidden'))).toBe(true);
		expect(handler.match(new Error('permission_denied'))).toBe(true);
		expect(handler.match(new Error('insufficient_permissions'))).toBe(true);
		expect(handler.match(new Error('HTTP 403 error'))).toBe(true);
		expect(handler.match(new Error('other error'))).toBe(false);

		const result = await handler.handler();
		expect(result.maxRetries).toBe(0);
	});

	it('matches and handles not found errors', async () => {
		const handler = errorHandlers.NOT_FOUND_ERROR;
		expect(handler.match(new Error('not_found'))).toBe(true);
		expect(handler.match(new Error('notfound'))).toBe(true);
		expect(handler.match(new Error('HTTP 404 error'))).toBe(true);
		expect(handler.match(new Error('other error'))).toBe(false);

		const result = await handler.handler();
		expect(result.maxRetries).toBe(0);
	});

	it('matches and handles validation errors', async () => {
		const handler = errorHandlers.VALIDATION_ERROR;
		expect(handler.match(new Error('validationerror'))).toBe(true);
		expect(handler.match(new Error('validation_error'))).toBe(true);
		expect(handler.match(new Error('unprocessable'))).toBe(true);
		expect(handler.match(new Error('bad_request'))).toBe(true);
		expect(handler.match(new Error('HTTP 400 error'))).toBe(true);
		expect(handler.match(new Error('HTTP 422 error'))).toBe(true);
		expect(handler.match(new Error('other error'))).toBe(false);

		const result = await handler.handler();
		expect(result.maxRetries).toBe(0);
	});

	it('matches and handles server errors', async () => {
		const handler = errorHandlers.SERVER_ERROR;
		expect(handler.match(new Error('internalerror'))).toBe(true);
		expect(handler.match(new Error('server error'))).toBe(true);
		expect(handler.match(new Error('HTTP 500 error'))).toBe(true);
		expect(handler.match(new Error('HTTP 502 error'))).toBe(true);
		expect(handler.match(new Error('HTTP 503 error'))).toBe(true);
		expect(handler.match(new Error('client error'))).toBe(false);

		const result = await handler.handler();
		expect(result.maxRetries).toBe(3);
	});

	it('matches and handles default fallback errors', async () => {
		const handler = errorHandlers.DEFAULT;
		expect(handler.match(new Error('any unhandled error'))).toBe(true);

		const result = await handler.handler();
		expect(result.maxRetries).toBe(0);
	});
});
