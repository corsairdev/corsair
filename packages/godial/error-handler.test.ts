import { ApiError } from 'corsair/http';
import { z } from 'zod';
import { errorHandlers } from './error-handlers';

function apiError(status: number): ApiError {
	return new ApiError(
		{ method: 'GET', url: '/resource' },
		{
			url: 'https://enterprise.godial.cc/resource',
			status,
			statusText: '',
			ok: status >= 200 && status < 300,
			body: {},
		},
		`HTTP ${status}`,
	);
}

describe('GoDial error handlers', () => {
	it('recognizes 429 and leaves retries to the shared transport', async () => {
		const error = apiError(429);
		expect(errorHandlers.RATE_LIMIT_ERROR.match(error)).toBe(true);
		expect(await errorHandlers.RATE_LIMIT_ERROR.handler()).toEqual({
			maxRetries: 0,
		});
	});

	it('classifies auth, validation, not-found, and server errors', () => {
		expect(errorHandlers.AUTH_ERROR.match(apiError(401))).toBe(true);
		expect(errorHandlers.AUTH_ERROR.match(apiError(403))).toBe(true);
		expect(errorHandlers.VALIDATION_ERROR.match(apiError(400))).toBe(true);
		expect(errorHandlers.VALIDATION_ERROR.match(apiError(422))).toBe(true);
		expect(errorHandlers.NOT_FOUND_ERROR.match(apiError(404))).toBe(true);
		expect(errorHandlers.SERVER_ERROR.match(apiError(500))).toBe(true);
		expect(errorHandlers.SERVER_ERROR.match(apiError(503))).toBe(true);
	});

	it('does not retry contact writes after server errors and handles schema errors', async () => {
		const serverError = apiError(500);
		expect(await errorHandlers.SERVER_ERROR.handler()).toEqual({
			maxRetries: 0,
		});
		const schemaError = z.string().safeParse(42);
		if (!schemaError.success) {
			expect(errorHandlers.DEFAULT.match(schemaError.error)).toBe(true);
		}
	});
});
