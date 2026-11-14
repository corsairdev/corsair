import { ApiError } from 'corsair/http';
import { errorHandlers } from './error-handlers';
import { honeyhive } from './index';

function makeApiError(status: number, message: string, retryAfter?: number) {
	return new ApiError(
		{ method: 'GET', url: '/v1/events' },
		{
			url: 'https://api.honeyhive.ai/v1/events',
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
	const match = Object.entries(errorHandlers).find(([, entry]) =>
		entry.match(error),
	);
	if (!match) throw new Error('No error handler matched');
	return match[0];
}

describe('HoneyHive errorHandlers', () => {
	it('routes HTTP 429 to RATE_LIMIT_ERROR and returns maxRetries: 0 for single-owner rate limiting', async () => {
		const error = makeApiError(429, 'Too Many Requests', 2500);
		expect(routeError(error)).toBe('RATE_LIMIT_ERROR');
		const result = await errorHandlers.RATE_LIMIT_ERROR.handler();
		expect(result).toEqual({ maxRetries: 0 });
	});

	it('routes text rate limit messages to RATE_LIMIT_ERROR', async () => {
		expect(routeError(new Error('Rate limit exceeded'))).toBe(
			'RATE_LIMIT_ERROR',
		);
		expect(routeError(new Error('too many requests'))).toBe('RATE_LIMIT_ERROR');
		expect(routeError(new Error('client is rate_limited'))).toBe(
			'RATE_LIMIT_ERROR',
		);
		expect(routeError(new Error('error 429'))).toBe('RATE_LIMIT_ERROR');
	});

	it('routes HTTP 401 and 403 to AUTH_ERROR and returns maxRetries: 0', async () => {
		const err401 = makeApiError(401, 'Unauthorized');
		const err403 = makeApiError(403, 'Forbidden');
		expect(routeError(err401)).toBe('AUTH_ERROR');
		expect(routeError(err403)).toBe('AUTH_ERROR');

		const result = await errorHandlers.AUTH_ERROR.handler();
		expect(result).toEqual({ maxRetries: 0 });
	});

	it('routes text auth error messages to AUTH_ERROR', () => {
		expect(routeError(new Error('Unauthorized token'))).toBe('AUTH_ERROR');
		expect(routeError(new Error('Forbidden access'))).toBe('AUTH_ERROR');
		expect(routeError(new Error('invalid api key'))).toBe('AUTH_ERROR');
		expect(routeError(new Error('invalid_auth'))).toBe('AUTH_ERROR');
	});

	it('routes HTTP 404 to NOT_FOUND_ERROR and returns maxRetries: 0', async () => {
		const error = makeApiError(404, 'Not Found');
		expect(routeError(error)).toBe('NOT_FOUND_ERROR');
		const result = await errorHandlers.NOT_FOUND_ERROR.handler();
		expect(result).toEqual({ maxRetries: 0 });
	});

	it('routes HTTP 400 and 422 to BAD_REQUEST_ERROR and returns maxRetries: 0', async () => {
		const err400 = makeApiError(400, 'Bad Request');
		const err422 = makeApiError(422, 'Unprocessable Entity');
		expect(routeError(err400)).toBe('BAD_REQUEST_ERROR');
		expect(routeError(err422)).toBe('BAD_REQUEST_ERROR');

		const result = await errorHandlers.BAD_REQUEST_ERROR.handler();
		expect(result).toEqual({ maxRetries: 0 });
	});

	it('routes text validation errors to BAD_REQUEST_ERROR', () => {
		expect(routeError(new Error('bad request payload'))).toBe(
			'BAD_REQUEST_ERROR',
		);
		expect(routeError(new Error('invalid request body'))).toBe(
			'BAD_REQUEST_ERROR',
		);
		expect(routeError(new Error('validation error in schema'))).toBe(
			'BAD_REQUEST_ERROR',
		);
	});

	it('routes HTTP 500, 502, 503 to SERVER_ERROR and returns maxRetries: 0', async () => {
		for (const status of [500, 502, 503]) {
			const error = makeApiError(status, 'Server Error');
			expect(routeError(error)).toBe('SERVER_ERROR');
		}

		const result = await errorHandlers.SERVER_ERROR.handler();
		expect(result).toEqual({ maxRetries: 0 });
	});

	it('routes text server errors to SERVER_ERROR', () => {
		expect(routeError(new Error('internal server error'))).toBe('SERVER_ERROR');
		expect(routeError(new Error('bad gateway upstream'))).toBe('SERVER_ERROR');
		expect(routeError(new Error('service unavailable'))).toBe('SERVER_ERROR');
	});

	it('routes unmatched errors to DEFAULT and returns maxRetries: 0', async () => {
		const unhandled = new Error('Random unexpected error');
		expect(routeError(unhandled)).toBe('DEFAULT');
		const result = await errorHandlers.DEFAULT.handler();
		expect(result).toEqual({ maxRetries: 0 });
	});

	it('preserves caller error handlers before built-ins with DEFAULT last', async () => {
		const customRateLimitHandler = jest
			.fn()
			.mockResolvedValue({ maxRetries: 1 });
		const customDefaultHandler = jest.fn().mockResolvedValue({ maxRetries: 2 });

		const plugin = honeyhive({
			errorHandlers: {
				CUSTOM_ERROR: {
					match: (err: Error) => err.message.includes('custom_flag'),
					handler: customRateLimitHandler,
				},
				DEFAULT: {
					match: () => true,
					handler: customDefaultHandler,
				},
			},
		});

		const handlers = plugin.errorHandlers;
		const handlerKeys = Object.keys(handlers);

		expect(handlerKeys[0]).toBe('CUSTOM_ERROR');
		expect(handlerKeys[handlerKeys.length - 1]).toBe('DEFAULT');

		const customError = new Error('this has a custom_flag');
		const customEntry = Object.entries(handlers).find(([, entry]) =>
			entry.match(customError),
		);
		expect(customEntry?.[0]).toBe('CUSTOM_ERROR');

		const fallbackError = new Error('completely unmatched');
		const defaultEntry = Object.entries(handlers).find(([, entry]) =>
			entry.match(fallbackError),
		);
		expect(defaultEntry?.[0]).toBe('DEFAULT');
		if (defaultEntry) {
			const res = await defaultEntry[1].handler(fallbackError);
			expect(res).toEqual({ maxRetries: 2 });
		}
	});
});
