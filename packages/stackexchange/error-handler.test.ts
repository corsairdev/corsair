import { ApiError } from 'corsair/http';
import { errorHandlers } from './error-handlers';

function apiError(
	status: number,
	message: string,
	retryAfter?: number,
): ApiError {
	return new ApiError(
		{ method: 'GET', url: '/questions' },
		{
			ok: false,
			status,
			statusText: message,
			url: 'https://api.stackexchange.com/2.3/questions',
			body: {
				error_id: status,
				error_name: message.toLowerCase().replaceAll(' ', '_'),
			},
		},
		message,
		retryAfter === undefined ? undefined : { retryAfter },
	);
}

describe('Stack Exchange error handling', () => {
	it('recognizes 429 and forwards Retry-After without a nested retry loop', async () => {
		const error = apiError(429, 'Too Many Requests', 4000);
		const handler = errorHandlers.RATE_LIMIT_ERROR;
		expect(handler.match(error)).toBe(true);
		await expect(handler.handler(error)).resolves.toMatchObject({
			maxRetries: 0,
			headersRetryAfterMs: 4000,
		});
	});

	it('recognizes Stack Exchange throttle and server error names on HTTP 400 wrappers', () => {
		const throttle = apiError(400, 'Throttle Violation');
		const internal = apiError(400, 'Internal Error');
		expect(errorHandlers.RATE_LIMIT_ERROR.match(throttle)).toBe(true);
		expect(errorHandlers.BAD_REQUEST_ERROR.match(throttle)).toBe(false);
		expect(errorHandlers.SERVER_ERROR.match(internal)).toBe(true);
		expect(errorHandlers.BAD_REQUEST_ERROR.match(internal)).toBe(false);
	});

	it('recognizes OAuth permission errors by the provider error name', () => {
		const denied = apiError(400, 'Access Denied');
		expect(errorHandlers.AUTH_ERROR.match(denied)).toBe(true);
		expect(errorHandlers.BAD_REQUEST_ERROR.match(denied)).toBe(false);
	});

	it.each([401, 403])(
		'treats %i as an authentication error',
		async (status) => {
			const error = apiError(status, 'Unauthorized');
			expect(errorHandlers.AUTH_ERROR.match(error)).toBe(true);
			await expect(errorHandlers.AUTH_ERROR.handler()).resolves.toEqual({
				maxRetries: 0,
			});
		},
	);

	it.each([400, 422])('treats %i as a caller input error', async (status) => {
		const error = apiError(status, 'Bad Parameter');
		expect(errorHandlers.BAD_REQUEST_ERROR.match(error)).toBe(true);
		await expect(errorHandlers.BAD_REQUEST_ERROR.handler()).resolves.toEqual({
			maxRetries: 0,
		});
	});

	it('matches missing routes and server errors without retrying writes', async () => {
		const missing = apiError(404, 'Not Found');
		const unavailable = apiError(503, 'Service Unavailable');
		expect(errorHandlers.NOT_FOUND_ERROR.match(missing)).toBe(true);
		expect(errorHandlers.SERVER_ERROR.match(unavailable)).toBe(true);
		await expect(errorHandlers.SERVER_ERROR.handler()).resolves.toEqual({
			maxRetries: 0,
		});
	});

	it('keeps the catch-all handler last', () => {
		const keys = Object.keys(errorHandlers);
		expect(keys.at(-1)).toBe('DEFAULT');
	});
});
