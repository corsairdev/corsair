import { ApiError } from 'corsair/http';
import { errorHandlers } from './error-handlers';

function apiError(status: number, message: string, retryAfter?: number) {
	return new ApiError(
		{ method: 'GET', url: '/services/v2/user' },
		{
			url: 'https://www.digicert.com/services/v2/user',
			ok: false,
			status,
			statusText: message,
			body: {},
		},
		message,
		retryAfter === undefined ? undefined : { retryAfter },
	);
}

describe('DigiCert error handlers', () => {
	it('matches 429 and extracts Retry-After without a second retry owner', async () => {
		const error = apiError(429, 'Too Many Requests', 4000);
		expect(errorHandlers.RATE_LIMIT_ERROR.match(error)).toBe(true);
		expect(await errorHandlers.RATE_LIMIT_ERROR.handler(error)).toEqual({
			maxRetries: 0,
			headersRetryAfterMs: 4000,
		});
	});

	it.each([401, 403])(
		'matches auth status %s without retrying',
		async (status) => {
			const error = apiError(status, 'Forbidden');
			expect(errorHandlers.AUTH_ERROR.match(error)).toBe(true);
			expect(await errorHandlers.AUTH_ERROR.handler()).toEqual({
				maxRetries: 0,
			});
		},
	);

	it('does not retry the default provider error', async () => {
		expect(await errorHandlers.DEFAULT.handler()).toEqual({ maxRetries: 0 });
	});
});
