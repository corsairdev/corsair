import { ApiError } from 'corsair/http';
import { errorHandlers } from './error-handlers';

describe('Vestaboard Error Handlers Tests', () => {
	it('matches 429 rate limit error', async () => {
		const error = new ApiError(
			{ method: 'GET', url: 'https://rw.vestaboard.com' },
			{ status: 429, statusText: 'Too Many Requests', ok: false, url: 'https://rw.vestaboard.com' },
			'Rate limited',
		);
		expect(errorHandlers.RATE_LIMIT_ERROR.match(error)).toBe(true);
		const result = await errorHandlers.RATE_LIMIT_ERROR.handler(error);
		expect(result.maxRetries).toBe(3);
	});

	it('matches 401 unauthorized auth error', async () => {
		const error = new ApiError(
			{ method: 'GET', url: 'https://rw.vestaboard.com' },
			{ status: 401, statusText: 'Unauthorized', ok: false, url: 'https://rw.vestaboard.com' },
			'Invalid Key',
		);
		expect(errorHandlers.AUTH_ERROR.match(error)).toBe(true);
		const result = await errorHandlers.AUTH_ERROR.handler(error);
		expect(result.maxRetries).toBe(0);
	});

	it('matches 403 forbidden permission error', async () => {
		const error = new ApiError(
			{ method: 'GET', url: 'https://platform.vestaboard.com' },
			{ status: 403, statusText: 'Forbidden', ok: false, url: 'https://platform.vestaboard.com' },
			'Forbidden access',
		);
		expect(errorHandlers.PERMISSION_ERROR.match(error)).toBe(true);
		const result = await errorHandlers.PERMISSION_ERROR.handler(error);
		expect(result.maxRetries).toBe(0);
	});

	it('matches 404 not found error', async () => {
		const error = new ApiError(
			{ method: 'GET', url: 'https://platform.vestaboard.com' },
			{ status: 404, statusText: 'Not Found', ok: false, url: 'https://platform.vestaboard.com' },
			'Not found',
		);
		expect(errorHandlers.NOT_FOUND_ERROR.match(error)).toBe(true);
		const result = await errorHandlers.NOT_FOUND_ERROR.handler(error);
		expect(result.maxRetries).toBe(0);
	});

	it('falls back to default error handler', async () => {
		const genericError = new Error('Random unexpected error');
		expect(errorHandlers.DEFAULT.match(genericError)).toBe(true);
		const result = await errorHandlers.DEFAULT.handler(genericError);
		expect(result.maxRetries).toBe(0);
	});
});
