import { ApiError } from 'corsair/http';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';

// unknown: problem bodies are arbitrary JSON.
function apiError(status: number, body: unknown = {}): ApiError {
	return new ApiError(
		{ method: 'GET', url: '/account' },
		{
			url: 'https://api.mopinion.com/account',
			ok: false,
			status,
			statusText: 'x',
			body,
		},
		`Mopinion ${status}`,
	);
}

describe('mopinion error handlers', () => {
	it('leaves a 429 to core, which already retried it', async () => {
		expect(errorHandlers.RATE_LIMIT_ERROR.match(apiError(429))).toBe(true);
		await expect(errorHandlers.RATE_LIMIT_ERROR.handler()).resolves.toEqual({
			maxRetries: 0,
		});
	});

	it('treats 401, 403 and error_code 18 as auth errors', () => {
		expect(errorHandlers.AUTH_ERROR.match(apiError(401))).toBe(true);
		expect(errorHandlers.AUTH_ERROR.match(apiError(403))).toBe(true);
		expect(
			errorHandlers.AUTH_ERROR.match(apiError(400, { error_code: 18 })),
		).toBe(true);
		expect(errorHandlers.AUTH_ERROR.match(apiError(404))).toBe(false);
	});

	it('does not retry validation and not-found errors', () => {
		for (const status of [400, 404, 406, 422]) {
			expect(errorHandlers.VALIDATION_ERROR.match(apiError(status))).toBe(true);
		}
		const zod = new Error('bad');
		zod.name = 'ZodError';
		expect(errorHandlers.VALIDATION_ERROR.match(zod)).toBe(true);
	});

	it('retries a 5xx: every data API route is a GET', async () => {
		expect(errorHandlers.SERVER_ERROR.match(apiError(500))).toBe(true);
		expect(errorHandlers.SERVER_ERROR.match(apiError(404))).toBe(false);
		expect(errorHandlers.SERVER_ERROR.match(new Error('x'))).toBe(false);
		await expect(errorHandlers.SERVER_ERROR.handler()).resolves.toMatchObject({
			maxRetries: 2,
		});
	});

	it('keeps DEFAULT last after merging caller handlers', () => {
		const merged = mergeErrorHandlers(errorHandlers, {
			DEFAULT: { match: () => true, handler: async () => ({ maxRetries: 1 }) },
			CUSTOM: { match: () => false, handler: async () => ({ maxRetries: 0 }) },
		});
		const keys = Object.keys(merged);
		expect(keys.at(-1)).toBe('DEFAULT');
		expect(keys).toContain('CUSTOM');
	});
});
