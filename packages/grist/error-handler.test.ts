import { ApiError } from 'corsair/http';
import { errorHandlers } from './error-handlers';

function buildApiError(status: number, message: string, retryAfter?: number) {
	return new ApiError(
		{ method: 'GET', url: '/orgs' },
		{
			url: 'https://docs.getgrist.com/api/orgs',
			ok: false,
			status,
			statusText: message,
			body: {},
		},
		message,
		retryAfter === undefined ? undefined : { retryAfter },
	);
}

function routeError(error: Error): string {
	const entry = Object.entries(errorHandlers).find(([, h]) => h.match(error));
	if (!entry) throw new Error('No handler matched');
	return entry[0];
}

describe('Grist errorHandlers', () => {
	it('routes 429 to RATE_LIMIT_ERROR and returns maxRetries: 0 (transport-owned)', async () => {
		const error = buildApiError(429, 'Too Many Requests', 3000);
		expect(routeError(error)).toBe('RATE_LIMIT_ERROR');
		await expect(errorHandlers.RATE_LIMIT_ERROR.handler()).resolves.toEqual({
			maxRetries: 0,
		});
	});

	it('routes text rate limit errors when status is absent', () => {
		expect(routeError(new Error('Rate limited by Grist API'))).toBe(
			'RATE_LIMIT_ERROR',
		);
		expect(routeError(new Error('Too many requests, slow down'))).toBe(
			'RATE_LIMIT_ERROR',
		);
	});

	it('routes 401 and 403 to AUTH_ERROR with no retries', async () => {
		expect(routeError(buildApiError(401, 'Unauthorized'))).toBe('AUTH_ERROR');
		expect(routeError(buildApiError(403, 'Forbidden'))).toBe('AUTH_ERROR');
		await expect(errorHandlers.AUTH_ERROR.handler()).resolves.toEqual({
			maxRetries: 0,
		});
	});

	it('routes 404 to NOT_FOUND_ERROR with no retries', async () => {
		const error = buildApiError(404, 'Document Not Found');
		expect(routeError(error)).toBe('NOT_FOUND_ERROR');
		await expect(errorHandlers.NOT_FOUND_ERROR.handler()).resolves.toEqual({
			maxRetries: 0,
		});
	});

	it('routes 400 and 422 to VALIDATION_ERROR with no retries', async () => {
		expect(routeError(buildApiError(400, 'Bad Request'))).toBe(
			'VALIDATION_ERROR',
		);
		expect(routeError(buildApiError(422, 'Unprocessable Entity'))).toBe(
			'VALIDATION_ERROR',
		);
		await expect(errorHandlers.VALIDATION_ERROR.handler()).resolves.toEqual({
			maxRetries: 0,
		});
	});

	it('routes 500 and 503 to SERVER_ERROR with no retries', async () => {
		expect(routeError(buildApiError(500, 'Internal Server Error'))).toBe(
			'SERVER_ERROR',
		);
		expect(routeError(buildApiError(503, 'Service Unavailable'))).toBe(
			'SERVER_ERROR',
		);
		await expect(errorHandlers.SERVER_ERROR.handler()).resolves.toEqual({
			maxRetries: 0,
		});
	});

	it('routes unclassified errors to DEFAULT with no retries', async () => {
		const error = new Error('Unexpected network failure');
		expect(routeError(error)).toBe('DEFAULT');
		await expect(errorHandlers.DEFAULT.handler()).resolves.toEqual({
			maxRetries: 0,
		});
	});
});
