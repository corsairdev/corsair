import { ApiError } from 'corsair/http';
import { errorHandlers } from './error-handlers';

function apiError(status: number, message = 'error'): ApiError {
	return new ApiError(
		{ method: 'GET', url: '/x' },
		{ url: '/x', ok: false, status, statusText: message, body: null },
		message,
	);
}

describe('Kibana error handlers', () => {
	it('matches 429 as rate-limit with 5 retries', async () => {
		const err = apiError(429, 'Too Many Requests');
		expect(errorHandlers.RATE_LIMIT_ERROR.match(err)).toBe(true);
		const res = await errorHandlers.RATE_LIMIT_ERROR.handler(err);
		expect(res.maxRetries).toBe(5);
	});

	it('matches 401 as auth error with 0 retries', async () => {
		const err = apiError(401, 'Unauthorized');
		expect(errorHandlers.RATE_LIMIT_ERROR.match(err)).toBe(false);
		expect(errorHandlers.AUTH_ERROR.match(err)).toBe(true);
		const res = await errorHandlers.AUTH_ERROR.handler(err);
		expect(res.maxRetries).toBe(0);
	});

	it('matches 403 as permission error with 0 retries', async () => {
		const err = apiError(403, 'Forbidden');
		expect(errorHandlers.PERMISSION_ERROR.match(err)).toBe(true);
		const res = await errorHandlers.PERMISSION_ERROR.handler(err);
		expect(res.maxRetries).toBe(0);
	});

	it('matches 404 as not-found with 0 retries', async () => {
		const err = apiError(404, 'Not Found');
		expect(errorHandlers.NOT_FOUND_ERROR.match(err)).toBe(true);
		const res = await errorHandlers.NOT_FOUND_ERROR.handler(err);
		expect(res.maxRetries).toBe(0);
		expect(errorHandlers.AUTH_ERROR.match(err)).toBe(false);
	});

	it('falls through to DEFAULT with 0 retries', async () => {
		const err = new Error('some unexpected failure');
		expect(errorHandlers.DEFAULT.match(err)).toBe(true);
		const res = await errorHandlers.DEFAULT.handler(err);
		expect(res.maxRetries).toBe(0);
	});
});
