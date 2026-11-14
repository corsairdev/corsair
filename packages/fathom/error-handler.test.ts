import { ApiError } from 'corsair/http';
import { errorHandlers } from './error-handlers';
import { fathom } from './index';

function buildApiError(
	status: number,
	message: string,
	retryAfter?: number,
	// `unknown` because response body payload is untrusted JSON.
	body: unknown = {},
) {
	return new ApiError(
		{ method: 'GET', url: '/sites' },
		{
			url: 'https://api.usefathom.com/v1/sites',
			ok: false,
			status,
			statusText: message,
			body,
		},
		message,
		retryAfter === undefined ? undefined : { retryAfter },
	);
}

function routeError(error: Error): string {
	const match = Object.entries(errorHandlers).find(([, entry]) =>
		entry.match(error),
	);
	if (!match) throw new Error('No error handler matched');
	return match[0];
}

describe('Fathom errorHandlers', () => {
	it('routes 429 status and rate limit messages to RATE_LIMIT_ERROR with maxRetries 0 (transport owns retries)', async () => {
		const err429 = buildApiError(429, 'Too Many Requests', 2000);
		expect(routeError(err429)).toBe('RATE_LIMIT_ERROR');
		await expect(errorHandlers.RATE_LIMIT_ERROR.handler()).resolves.toEqual({
			maxRetries: 0,
		});

		expect(routeError(new Error('Too Many Attempts.'))).toBe(
			'RATE_LIMIT_ERROR',
		);
		expect(
			routeError(
				new Error('api_concurrency_limit_reached: wait for requests to finish'),
			),
		).toBe('RATE_LIMIT_ERROR');
		expect(routeError(new Error('Rate limit exceeded'))).toBe(
			'RATE_LIMIT_ERROR',
		);
	});

	it('routes 401 and 403 to AUTH_ERROR with maxRetries 0', async () => {
		expect(routeError(buildApiError(401, 'Unauthorized'))).toBe('AUTH_ERROR');
		expect(routeError(buildApiError(403, 'Forbidden'))).toBe('AUTH_ERROR');
		expect(routeError(new Error('Unauthenticated'))).toBe('AUTH_ERROR');
		expect(
			routeError(
				new Error("This token doesn't have permission to access this endpoint"),
			),
		).toBe('AUTH_ERROR');

		await expect(errorHandlers.AUTH_ERROR.handler()).resolves.toEqual({
			maxRetries: 0,
		});
	});

	it('routes 404 to NOT_FOUND_ERROR with maxRetries 0', async () => {
		const err404 = buildApiError(404, 'Not Found');
		expect(routeError(err404)).toBe('NOT_FOUND_ERROR');
		expect(routeError(new Error('Site not found'))).toBe('NOT_FOUND_ERROR');

		await expect(errorHandlers.NOT_FOUND_ERROR.handler()).resolves.toEqual({
			maxRetries: 0,
		});
	});

	it('routes 410 to GONE_ERROR with maxRetries 0', async () => {
		const err410 = buildApiError(
			410,
			'Gone: This endpoint has been retired and no longer functions',
		);
		expect(routeError(err410)).toBe('GONE_ERROR');
		expect(
			routeError(
				new Error(
					'This endpoint is no longer available. Track the event on your site',
				),
			),
		).toBe('GONE_ERROR');

		await expect(errorHandlers.GONE_ERROR.handler()).resolves.toEqual({
			maxRetries: 0,
		});
	});

	it('routes 400 and 422 to BAD_REQUEST_ERROR with maxRetries 0', async () => {
		expect(routeError(buildApiError(400, 'Bad Request'))).toBe(
			'BAD_REQUEST_ERROR',
		);
		expect(routeError(buildApiError(422, 'Unprocessable Entity'))).toBe(
			'BAD_REQUEST_ERROR',
		);
		expect(routeError(new Error('Validation failed for name'))).toBe(
			'BAD_REQUEST_ERROR',
		);

		await expect(errorHandlers.BAD_REQUEST_ERROR.handler()).resolves.toEqual({
			maxRetries: 0,
		});
	});

	it('routes 5xx errors to SERVER_ERROR with maxRetries 0', async () => {
		expect(routeError(buildApiError(500, 'Internal Server Error'))).toBe(
			'SERVER_ERROR',
		);
		expect(routeError(buildApiError(502, 'Bad Gateway'))).toBe('SERVER_ERROR');
		expect(routeError(buildApiError(503, 'Service Unavailable'))).toBe(
			'SERVER_ERROR',
		);
		expect(routeError(new Error('Service unavailable'))).toBe('SERVER_ERROR');

		await expect(errorHandlers.SERVER_ERROR.handler()).resolves.toEqual({
			maxRetries: 0,
		});
	});

	it('routes unhandled errors to DEFAULT with maxRetries 0', async () => {
		const mysteryError = new Error('Random unexpected error');
		expect(routeError(mysteryError)).toBe('DEFAULT');
		await expect(errorHandlers.DEFAULT.handler()).resolves.toEqual({
			maxRetries: 0,
		});
	});

	it('orders caller handlers before built-ins and DEFAULT last', () => {
		const customRateLimit = {
			match: () => false,
			handler: async () => ({ maxRetries: 99 }),
		};
		const customDefault = {
			match: () => true,
			handler: async () => ({ maxRetries: 10 }),
		};

		const plugin = fathom({
			errorHandlers: {
				CUSTOM_HANDLER: customRateLimit,
				DEFAULT: customDefault,
			},
		});

		const handlerKeys = Object.keys(plugin.errorHandlers ?? {});
		expect(handlerKeys[0]).toBe('CUSTOM_HANDLER');
		expect(handlerKeys[handlerKeys.length - 1]).toBe('DEFAULT');
	});
});
