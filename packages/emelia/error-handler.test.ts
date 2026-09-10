import { errorHandlers } from './error-handlers';

describe('Emelia Error Handlers', () => {
	it('handles rate limit errors with retry', async () => {
		const handler = errorHandlers.RATE_LIMIT_ERROR;
		expect(
			handler.match(new Error('Rate_Limited: 429 too many requests')),
		).toBe(true);

		const result = await handler.handler(new Error('Rate limit exceeded'));
		expect(result.maxRetries).toBe(3);
	});

	it('handles auth errors without retrying', async () => {
		const handler = errorHandlers.AUTH_ERROR;
		expect(handler.match(new Error('Unauthorized: Invalid API key'))).toBe(
			true,
		);

		const result = await handler.handler();
		expect(result.maxRetries).toBe(0);
	});

	it('handles permission errors without retrying', async () => {
		const handler = errorHandlers.PERMISSION_ERROR;
		expect(handler.match(new Error('Forbidden: access denied'))).toBe(true);

		const result = await handler.handler();
		expect(result.maxRetries).toBe(0);
	});

	it('handles not-found errors without retrying', async () => {
		const handler = errorHandlers.NOT_FOUND_ERROR;
		expect(handler.match(new Error('Campaign not found'))).toBe(true);

		const result = await handler.handler();
		expect(result.maxRetries).toBe(0);
	});

	it('falls through to the default handler', async () => {
		const handler = errorHandlers.DEFAULT;
		expect(handler.match()).toBe(true);

		const result = await handler.handler();
		expect(result.maxRetries).toBe(0);
	});
});
