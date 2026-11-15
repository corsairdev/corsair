import { ApiError } from 'corsair/http';
import { errorHandlers } from './error-handlers';

function apiError(status: number, message: string, retryAfter?: number) {
	return new ApiError(
		{ method: 'GET', url: '/v2/me' },
		{
			url: 'https://api.companyenrich.com/v2/me',
			ok: false,
			status,
			statusText: message,
			body: { title: message, status },
		},
		message,
		retryAfter === undefined ? undefined : { retryAfter },
	);
}

function route(error: Error): string {
	const matched = Object.entries(errorHandlers).find(([, handler]) =>
		handler.match(error),
	);
	if (matched === undefined) {
		throw new Error('No CompanyEnrich error handler matched.');
	}
	return matched[0];
}

describe('CompanyEnrich error handlers', () => {
	it('routes 429 to RATE_LIMIT_ERROR and forwards retryAfter when present', async () => {
		const error = apiError(429, 'Too Many Requests', 1750);

		expect(route(error)).toBe('RATE_LIMIT_ERROR');
		await expect(
			errorHandlers.RATE_LIMIT_ERROR.handler(error),
		).resolves.toEqual({ maxRetries: 5, headersRetryAfterMs: 1750 });
	});

	it('routes 402 to INSUFFICIENT_CREDITS_ERROR without retrying', async () => {
		const error = apiError(402, 'Payment Required');

		expect(route(error)).toBe('INSUFFICIENT_CREDITS_ERROR');
		await expect(
			errorHandlers.INSUFFICIENT_CREDITS_ERROR.handler(),
		).resolves.toEqual({ maxRetries: 0 });
	});

	it('routes 401 and 403 to AUTH_ERROR without retrying', async () => {
		expect(route(apiError(401, 'Unauthorized'))).toBe('AUTH_ERROR');
		expect(route(apiError(403, 'Forbidden'))).toBe('AUTH_ERROR');
		await expect(errorHandlers.AUTH_ERROR.handler()).resolves.toEqual({
			maxRetries: 0,
		});
	});

	it('routes 400 to BAD_REQUEST_ERROR without retrying', async () => {
		const error = apiError(400, 'Bad Request');

		expect(route(error)).toBe('BAD_REQUEST_ERROR');
		await expect(errorHandlers.BAD_REQUEST_ERROR.handler()).resolves.toEqual({
			maxRetries: 0,
		});
	});

	it('routes 404 to NOT_FOUND_ERROR and 422 to VALIDATION_ERROR', async () => {
		expect(route(apiError(404, 'Not Found'))).toBe('NOT_FOUND_ERROR');
		expect(route(apiError(422, 'Unprocessable Entity'))).toBe(
			'VALIDATION_ERROR',
		);
		await expect(errorHandlers.NOT_FOUND_ERROR.handler()).resolves.toEqual({
			maxRetries: 0,
		});
		await expect(errorHandlers.VALIDATION_ERROR.handler()).resolves.toEqual({
			maxRetries: 0,
		});
	});

	it('routes unknown failures to DEFAULT without retrying', async () => {
		const error = apiError(500, 'Internal Server Error');

		expect(route(error)).toBe('DEFAULT');
		await expect(errorHandlers.DEFAULT.handler()).resolves.toEqual({
			maxRetries: 0,
		});
	});
});
