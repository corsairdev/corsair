import { ApiError } from 'corsair/http';
import { errorHandlers } from './error-handlers';

function apiError(status: number): ApiError {
	return new ApiError(
		{
			method: 'GET',
			url: 'https://quickbooks.api.intuit.com/v3/company/123/query',
		},
		{
			url: 'https://quickbooks.api.intuit.com/v3/company/123/query',
			ok: false,
			status,
			statusText: 'Provider error',
			body: { Fault: { Error: [{ Message: 'redacted provider detail' }] } },
		},
		'QuickBooks request failed',
		status === 429 ? { retryAfter: 60_000 } : undefined,
	);
}

describe('QuickBooks error handlers', () => {
	it('lets the shared transport own 429 retries and Retry-After', async () => {
		const error = apiError(429);
		const handler = errorHandlers.RATE_LIMIT_ERROR;
		expect(handler?.match(error)).toBe(true);
		await expect(handler?.handler()).resolves.toEqual({ maxRetries: 0 });
		expect(error.retryAfter).toBe(60_000);
	});

	it.each([
		[400, 'BAD_REQUEST_ERROR'],
		[401, 'AUTH_ERROR'],
		[403, 'PERMISSION_ERROR'],
		[404, 'NOT_FOUND_ERROR'],
	] as const)('does not retry HTTP %i', async (status, name) => {
		const error = apiError(status);
		const handler = errorHandlers[name];
		expect(handler?.match(error)).toBe(true);
		await expect(handler?.handler()).resolves.toEqual({ maxRetries: 0 });
	});

	it('does not retry other failures by default', async () => {
		const error = apiError(503);
		const handler = errorHandlers.DEFAULT;
		expect(handler?.match()).toBe(true);
		await expect(handler?.handler()).resolves.toEqual({ maxRetries: 0 });
	});
});
