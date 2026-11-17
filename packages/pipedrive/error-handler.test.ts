import { ApiError } from 'corsair/http';
import { errorHandlers } from './error-handlers';

function providerError(status: number, retryAfter?: number) {
	return new ApiError(
		{ method: 'GET', url: '/deals' },
		{
			url: 'https://api.pipedrive.com/api/v2/deals',
			ok: false,
			status,
			statusText: 'Provider error',
			body: {},
		},
		'Provider error',
		retryAfter === undefined ? undefined : { retryAfter },
	);
}

function handlerFor(error: Error): string | undefined {
	return Object.entries(errorHandlers).find(([, handler]) =>
		handler.match(error),
	)?.[0];
}

describe('Pipedrive error handlers', () => {
	it('retries a transient burst limit once using the documented reset interval', async () => {
		const error = providerError(429, 1200);
		expect(handlerFor(error)).toBe('RATE_LIMIT_ERROR');
		await expect(
			errorHandlers.RATE_LIMIT_ERROR.handler(error),
		).resolves.toEqual({
			maxRetries: 1,
			headersRetryAfterMs: 1200,
		});
	});

	it('does not retry a 429 without a reset header because daily tokens reset on a daily schedule', async () => {
		const error = providerError(429);
		await expect(
			errorHandlers.RATE_LIMIT_ERROR.handler(error),
		).resolves.toEqual({
			maxRetries: 0,
			headersRetryAfterMs: undefined,
		});
	});

	it('routes authentication and not-found failures without retrying', async () => {
		expect(handlerFor(providerError(401))).toBe('AUTH_ERROR');
		expect(handlerFor(providerError(403))).toBe('AUTH_ERROR');
		expect(handlerFor(providerError(404))).toBe('NOT_FOUND_ERROR');
		await expect(errorHandlers.AUTH_ERROR.handler()).resolves.toEqual({
			maxRetries: 0,
		});
	});

	it('leaves other statuses to the no-retry default', async () => {
		expect(handlerFor(providerError(422))).toBe('DEFAULT');
		expect(handlerFor(providerError(500))).toBe('DEFAULT');
		await expect(errorHandlers.DEFAULT.handler()).resolves.toEqual({
			maxRetries: 0,
		});
	});

	it('does not retry non-ApiError errors', () => {
		expect(errorHandlers.RATE_LIMIT_ERROR.match(new Error('429'))).toBe(false);
		expect(handlerFor(new Error('unknown'))).toBe('DEFAULT');
	});
});
