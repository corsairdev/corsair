import { ApiError } from 'corsair/http';
import { errorHandlers } from './error-handlers';

function apiError(
	status: number,
	message: string,
	retryAfter?: number,
): ApiError {
	return new ApiError(
		{ method: 'POST', url: '/api/resource' },
		{
			url: 'https://connect.mailerlite.com/api/resource',
			ok: false,
			status,
			statusText: message,
			body: {},
		},
		message,
		retryAfter === undefined ? undefined : { retryAfter },
	);
}

function handlerFor(error: Error): string {
	const matched = Object.entries(errorHandlers).find(([, handler]) =>
		handler.match(error),
	);
	if (!matched) throw new Error('No MailerLite handler matched the error');
	return matched[0];
}

describe('MailerLite error handlers', () => {
	it('routes 429 to rate-limit handling and does not retry writes again', async () => {
		const error = apiError(429, 'Too Many Attempts', 4000);
		expect(handlerFor(error)).toBe('RATE_LIMIT_ERROR');
		await expect(
			errorHandlers.RATE_LIMIT_ERROR.handler(error),
		).resolves.toEqual({ maxRetries: 0 });
		expect(error.retryAfter).toBe(4000);
	});

	it('routes authentication failures before the default handler', async () => {
		expect(handlerFor(apiError(401, 'Unauthorized'))).toBe('AUTH_ERROR');
		expect(handlerFor(apiError(403, 'Forbidden'))).toBe('AUTH_ERROR');
		await expect(errorHandlers.AUTH_ERROR.handler()).resolves.toEqual({
			maxRetries: 0,
		});
	});

	it('routes validation and missing-resource errors without retries', async () => {
		expect(handlerFor(apiError(422, 'Unprocessable Entity'))).toBe(
			'VALIDATION_ERROR',
		);
		expect(handlerFor(apiError(404, 'Not Found'))).toBe('NOT_FOUND_ERROR');
		await expect(errorHandlers.VALIDATION_ERROR.handler()).resolves.toEqual({
			maxRetries: 0,
		});
		await expect(errorHandlers.NOT_FOUND_ERROR.handler()).resolves.toEqual({
			maxRetries: 0,
		});
	});

	it('keeps the default handler last and disables unclassified retries', async () => {
		const entries = Object.keys(errorHandlers);
		expect(entries.at(-1)).toBe('DEFAULT');
		expect(handlerFor(apiError(500, 'Internal Server Error'))).toBe('DEFAULT');
		await expect(errorHandlers.DEFAULT.handler()).resolves.toEqual({
			maxRetries: 0,
		});
	});
});
