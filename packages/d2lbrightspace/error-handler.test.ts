import { D2lBrightspaceAPIError } from './client';
import { errorHandlers } from './error-handlers';

describe('D2L error handlers', () => {
	it('preserves Retry-After and assigns one retry owner', async () => {
		const error = new D2lBrightspaceAPIError('Rate limited', 429, 4_000);
		expect(errorHandlers.RATE_LIMIT_ERROR.match(error)).toBe(true);
		await expect(
			errorHandlers.RATE_LIMIT_ERROR.handler(error),
		).resolves.toEqual({
			maxRetries: 0,
			headersRetryAfterMs: 4_000,
		});
		const quotaError = new D2lBrightspaceAPIError('Quota delay', 403, 12_000);
		expect(errorHandlers.RATE_LIMIT_ERROR.match(quotaError)).toBe(true);
		await expect(
			errorHandlers.RATE_LIMIT_ERROR.handler(quotaError),
		).resolves.toEqual({
			maxRetries: 0,
			headersRetryAfterMs: 12_000,
		});
	});

	it.each([
		[401, 'AUTH_ERROR'],
		[403, 'PERMISSION_ERROR'],
		[404, 'NOT_FOUND_ERROR'],
		[400, 'BAD_REQUEST_ERROR'],
		[500, 'SERVER_ERROR'],
	] as const)(
		'maps HTTP %s to %s without retrying',
		async (status, handlerName) => {
			const error = new D2lBrightspaceAPIError(
				'Sanitized provider error',
				status,
			);
			const handler = errorHandlers[handlerName];
			expect(handler.match(error)).toBe(true);
			await expect(handler.handler()).resolves.toEqual({ maxRetries: 0 });
		},
	);

	it('does not retry unknown or non-status failures', async () => {
		expect(errorHandlers.DEFAULT.match()).toBe(true);
		await expect(errorHandlers.DEFAULT.handler()).resolves.toEqual({
			maxRetries: 0,
		});
	});
});
