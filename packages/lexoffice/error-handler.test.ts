import { ApiError } from 'corsair/http';
import { errorHandlers } from './error-handlers';
import { lexoffice } from './index';

function apiError(status: number, message: string, retryAfter?: number) {
	return new ApiError(
		{ method: 'GET', url: '/profile' },
		{
			url: 'https://api.lexware.io/v1/profile',
			ok: false,
			status,
			statusText: message,
			body: { message, status },
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
		throw new Error('No Lexoffice error handler matched.');
	}
	return matched[0];
}

describe('Lexoffice error handlers', () => {
	it('routes 429 to RATE_LIMIT_ERROR and forwards retryAfter', async () => {
		const error = apiError(429, 'Too Many Requests', 2500);

		expect(route(error)).toBe('RATE_LIMIT_ERROR');
		await expect(
			errorHandlers.RATE_LIMIT_ERROR.handler(error),
		).resolves.toEqual({ maxRetries: 5, headersRetryAfterMs: 2500 });
	});

	it('does not treat a non-429 ApiError mentioning 429 as a rate limit', () => {
		const error = new ApiError(
			{ method: 'POST', url: '/invoices' },
			{
				url: 'https://api.lexware.io/v1/invoices',
				ok: false,
				status: 406,
				statusText: 'Not Acceptable',
				body: {},
			},
			'Lexware API request failed: unitPrice 429 is not acceptable',
		);
		expect(errorHandlers.RATE_LIMIT_ERROR.match(error)).toBe(false);
	});

	it('routes 401 and 403 to AUTH_ERROR without retrying', async () => {
		expect(route(apiError(401, 'Unauthorized'))).toBe('AUTH_ERROR');
		expect(route(apiError(403, 'Forbidden'))).toBe('AUTH_ERROR');
		await expect(errorHandlers.AUTH_ERROR.handler()).resolves.toEqual({
			maxRetries: 0,
		});
	});

	it('routes 404 to NOT_FOUND_ERROR without retrying', async () => {
		const error = apiError(404, 'Not Found');
		expect(route(error)).toBe('NOT_FOUND_ERROR');
		await expect(errorHandlers.NOT_FOUND_ERROR.handler()).resolves.toEqual({
			maxRetries: 0,
		});
	});

	it('routes 406 to NOT_ACCEPTABLE_ERROR without retrying', async () => {
		const error = apiError(406, 'Not Acceptable');
		expect(route(error)).toBe('NOT_ACCEPTABLE_ERROR');
		await expect(errorHandlers.NOT_ACCEPTABLE_ERROR.handler()).resolves.toEqual(
			{
				maxRetries: 0,
			},
		);
	});

	it('routes 409 to CONFLICT_ERROR without retrying', async () => {
		const error = apiError(409, 'Conflict: version mismatch');
		expect(route(error)).toBe('CONFLICT_ERROR');
		await expect(errorHandlers.CONFLICT_ERROR.handler()).resolves.toEqual({
			maxRetries: 0,
		});
	});

	it('routes 422 to VALIDATION_ERROR without retrying', async () => {
		const error = apiError(422, 'Unprocessable Entity: validation failed');
		expect(route(error)).toBe('VALIDATION_ERROR');
		await expect(errorHandlers.VALIDATION_ERROR.handler()).resolves.toEqual({
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

	it('routes other errors to DEFAULT without retrying', async () => {
		const error = apiError(500, 'Internal Server Error');
		expect(route(error)).toBe('DEFAULT');
		await expect(errorHandlers.DEFAULT.handler()).resolves.toEqual({
			maxRetries: 0,
		});
	});

	it('orders caller handlers before built-ins and places DEFAULT last', () => {
		const customRateLimitHandler = {
			match: (e: Error) => e.message.includes('custom'),
			handler: async () => ({ maxRetries: 1 }),
		};

		const plugin = lexoffice({
			errorHandlers: {
				CUSTOM_HANDLER: customRateLimitHandler,
			},
		});

		const keys = Object.keys(plugin.errorHandlers ?? {});
		expect(keys[0]).toBe('CUSTOM_HANDLER');
		expect(keys[keys.length - 1]).toBe('DEFAULT');
	});
});
