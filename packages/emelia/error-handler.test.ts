import { ApiError } from 'corsair/http';
import { EmeliaAPIError } from './client';
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

	it('forwards retryAfter in milliseconds without reconverting', async () => {
		const cause = new ApiError(
			{ method: 'GET', url: '/webhook' },
			{
				url: 'https://api.emelia.io/webhook',
				ok: false,
				status: 429,
				statusText: 'Too Many Requests',
				body: '',
			},
			'Too Many Requests',
			{ retryAfter: 1500 },
		);
		const wrapped = new EmeliaAPIError('Too Many Requests', { cause });
		expect(wrapped.retryAfter).toBe(1500);

		const result = await errorHandlers.RATE_LIMIT_ERROR.handler(wrapped);
		expect(result.maxRetries).toBe(3);
		expect(result.headersRetryAfterMs).toBe(1500);
	});
});
