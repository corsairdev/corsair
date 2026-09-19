import { ApiError } from 'corsair/http';
import { errorHandlers } from './error-handlers';

function apiError(status: number, message: string, retryAfter?: number) {
	return new ApiError(
		{ method: 'GET', url: '/v1/business/bot-faq/all' },
		{
			url: 'https://api.botsonic.ai/v1/business/bot-faq/all',
			ok: false,
			status,
			statusText: message,
			body: {},
		},
		message,
		retryAfter === undefined ? undefined : { retryAfter },
	);
}

function route(error: Error): string {
	const match = Object.entries(errorHandlers).find(([, entry]) =>
		entry.match(error),
	);
	if (!match) throw new Error('no handler matched');
	return match[0];
}

describe('Botsonic errorHandlers', () => {
	it('routes Too Many Requests text when status is absent', () => {
		expect(route(new Error('Too Many Requests'))).toBe('RATE_LIMIT_ERROR');
	});

	it('routes 401 to AUTH_ERROR', () => {
		expect(route(apiError(401, 'Unauthorized'))).toBe('AUTH_ERROR');
	});

	it('routes unknown errors to DEFAULT with no retries', async () => {
		const error = apiError(500, 'Internal Server Error');
		expect(route(error)).toBe('DEFAULT');
		await expect(errorHandlers.DEFAULT.handler()).resolves.toEqual({
			maxRetries: 0,
		});
	});
});
