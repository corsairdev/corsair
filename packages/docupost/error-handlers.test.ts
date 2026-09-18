import { ApiError } from 'corsair/http';
import { errorHandlers } from './error-handlers';

function apiError(status: number, retryAfter?: number): ApiError {
	return new ApiError(
		{ method: 'POST', url: 'sendletter' },
		{
			url: 'https://app.docupost.com/api/1.1/wf/sendletter',
			ok: false,
			status,
			statusText: 'Error',
			body: { message: 'Error' },
		},
		'Error',
		retryAfter !== undefined ? { retryAfter } : undefined,
	);
}

describe('Docupost error handlers', () => {
	it('does not retry rate-limited sends because mail is billable', async () => {
		const error = apiError(429, 1500);
		expect(errorHandlers.RATE_LIMIT_ERROR.match(error)).toBe(true);
		await expect(
			errorHandlers.RATE_LIMIT_ERROR.handler(error),
		).resolves.toEqual(
			expect.objectContaining({
				maxRetries: 0,
				headersRetryAfterMs: 1500,
			}),
		);
	});

	it('does not retry auth failures', async () => {
		const error = apiError(401);
		expect(errorHandlers.AUTH_ERROR.match(error)).toBe(true);
		await expect(errorHandlers.AUTH_ERROR.handler()).resolves.toEqual({
			maxRetries: 0,
		});
	});
});
