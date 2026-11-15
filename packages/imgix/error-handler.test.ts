import { ApiError } from 'corsair/http';
import { errorHandlers } from './error-handlers';
import { imgix } from './index';

function apiError(status: number, message: string, retryAfter?: number) {
	return new ApiError(
		{ method: 'GET', url: 'sources' },
		{
			url: 'https://api.imgix.com/api/v1/sources',
			ok: false,
			status,
			statusText: message,
			body: { message },
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

describe('Imgix errorHandlers', () => {
	it('routes 429 to RATE_LIMIT_ERROR and returns maxRetries: 0', async () => {
		const error = apiError(429, 'Too Many Requests', 1500);
		expect(route(error)).toBe('RATE_LIMIT_ERROR');
		await expect(errorHandlers.RATE_LIMIT_ERROR.handler()).resolves.toEqual({
			maxRetries: 0,
		});
	});

	it('routes text rate limit errors when status is absent', () => {
		expect(route(new Error('too many requests'))).toBe('RATE_LIMIT_ERROR');
		expect(route(new Error('rate_limited error'))).toBe('RATE_LIMIT_ERROR');
		expect(route(new Error('hit rate limit'))).toBe('RATE_LIMIT_ERROR');
	});

	it('routes 401 and 403 to AUTH_ERROR', async () => {
		expect(route(apiError(401, 'Unauthorized'))).toBe('AUTH_ERROR');
		expect(route(apiError(403, 'Forbidden'))).toBe('AUTH_ERROR');
		expect(route(new Error('invalid api key'))).toBe('AUTH_ERROR');
		await expect(errorHandlers.AUTH_ERROR.handler()).resolves.toEqual({
			maxRetries: 0,
		});
	});

	it('routes 404 to NOT_FOUND_ERROR', async () => {
		expect(route(apiError(404, 'Not Found'))).toBe('NOT_FOUND_ERROR');
		expect(route(new Error('Source not found'))).toBe('NOT_FOUND_ERROR');
		await expect(errorHandlers.NOT_FOUND_ERROR.handler()).resolves.toEqual({
			maxRetries: 0,
		});
	});

	it('routes 400 to BAD_REQUEST_ERROR', async () => {
		expect(route(apiError(400, 'Bad Request'))).toBe('BAD_REQUEST_ERROR');
		expect(route(new Error('invalid request body'))).toBe('BAD_REQUEST_ERROR');
		await expect(errorHandlers.BAD_REQUEST_ERROR.handler()).resolves.toEqual({
			maxRetries: 0,
		});
	});

	it('routes unknown 500 errors to DEFAULT with no retries', async () => {
		const error = apiError(500, 'Internal Server Error');
		expect(route(error)).toBe('DEFAULT');
		await expect(errorHandlers.DEFAULT.handler()).resolves.toEqual({
			maxRetries: 0,
		});
	});

	it('lets caller-supplied handlers take precedence over built-ins', async () => {
		const customHandler = jest.fn().mockResolvedValue({ maxRetries: 2 });
		const plugin = imgix({
			errorHandlers: {
				RATE_LIMIT_ERROR: {
					match: () => true,
					handler: customHandler,
				},
			},
		});

		const handlerObj = plugin.errorHandlers?.RATE_LIMIT_ERROR;
		expect(handlerObj).toBeDefined();
		if (handlerObj) {
			const dummyContext = {
				pluginId: 'imgix',
				operation: 'sources.list',
				input: {},
				originalError: apiError(429, 'Rate limited'),
			};
			const result = await handlerObj.handler(
				apiError(429, 'Rate limited'),
				dummyContext,
			);
			expect(result).toEqual({ maxRetries: 2 });
			expect(customHandler).toHaveBeenCalled();
		}
	});
});
