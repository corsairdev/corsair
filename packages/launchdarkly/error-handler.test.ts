import { ApiError } from 'corsair/http';
import { errorHandlers } from './error-handlers';

function makeApiError(status: number, message: string, retryAfter?: number) {
	return new ApiError(
		{ method: 'GET', url: '/api/v2/test' },
		{
			url: 'https://app.launchdarkly.com/api/v2/test',
			ok: false,
			status,
			statusText: message,
			body: { code: message, message },
		},
		message,
		retryAfter === undefined ? undefined : { retryAfter },
	);
}

describe('LaunchDarkly error handlers', () => {
	it('RATE_LIMIT_ERROR matches 429 status and message, returning retryAfter', async () => {
		const err429 = makeApiError(429, 'Rate limited', 2500);
		expect(errorHandlers.RATE_LIMIT_ERROR.match(err429)).toBe(true);

		const result = await errorHandlers.RATE_LIMIT_ERROR.handler(err429);
		expect(result).toEqual({
			maxRetries: 2,
			headersRetryAfterMs: 2500,
		});

		const messageErr = new Error('Too many requests, slow down');
		expect(errorHandlers.RATE_LIMIT_ERROR.match(messageErr)).toBe(true);
		const messageResult =
			await errorHandlers.RATE_LIMIT_ERROR.handler(messageErr);
		expect(messageResult).toEqual({
			maxRetries: 2,
			headersRetryAfterMs: undefined,
		});
	});

	it('AUTH_ERROR matches 401 and 403 status codes and auth messages', async () => {
		const err401 = makeApiError(401, 'Unauthorized');
		const err403 = makeApiError(403, 'Forbidden');
		const errToken = new Error('invalid account id');

		expect(errorHandlers.AUTH_ERROR.match(err401)).toBe(true);
		expect(errorHandlers.AUTH_ERROR.match(err403)).toBe(true);
		expect(errorHandlers.AUTH_ERROR.match(errToken)).toBe(true);

		const res401 = await errorHandlers.AUTH_ERROR.handler();
		expect(res401).toEqual({ maxRetries: 0 });
	});

	it('NOT_FOUND_ERROR matches 404 status and not found messages', async () => {
		const err404 = makeApiError(404, 'Not Found');
		const textErr = new Error('Resource not_found');

		expect(errorHandlers.NOT_FOUND_ERROR.match(err404)).toBe(true);
		expect(errorHandlers.NOT_FOUND_ERROR.match(textErr)).toBe(true);

		const res = await errorHandlers.NOT_FOUND_ERROR.handler();
		expect(res).toEqual({ maxRetries: 0 });
	});

	it('VALIDATION_ERROR matches 400 and 422 status and validation messages', async () => {
		const err400 = makeApiError(400, 'Invalid request');
		const err422 = makeApiError(422, 'Unprocessable Entity');
		const textErr = new Error('validation_failed: key is required');

		expect(errorHandlers.VALIDATION_ERROR.match(err400)).toBe(true);
		expect(errorHandlers.VALIDATION_ERROR.match(err422)).toBe(true);
		expect(errorHandlers.VALIDATION_ERROR.match(textErr)).toBe(true);

		const res = await errorHandlers.VALIDATION_ERROR.handler();
		expect(res).toEqual({ maxRetries: 0 });
	});

	it('CONFLICT_ERROR matches 409 status and conflict messages', async () => {
		const err409 = makeApiError(409, 'Status conflict');
		expect(errorHandlers.CONFLICT_ERROR.match(err409)).toBe(true);

		const res = await errorHandlers.CONFLICT_ERROR.handler();
		expect(res).toEqual({ maxRetries: 0 });
	});

	it('SERVER_ERROR matches 5xx status codes', async () => {
		const err500 = makeApiError(500, 'Internal Server Error');
		const err502 = makeApiError(502, 'Bad Gateway');
		const err503 = makeApiError(503, 'Service Unavailable');

		expect(errorHandlers.SERVER_ERROR.match(err500)).toBe(true);
		expect(errorHandlers.SERVER_ERROR.match(err502)).toBe(true);
		expect(errorHandlers.SERVER_ERROR.match(err503)).toBe(true);

		const res = await errorHandlers.SERVER_ERROR.handler();
		expect(res).toEqual({ maxRetries: 0 });
	});

	it('DEFAULT matches any error and terminates retries', async () => {
		expect(errorHandlers.DEFAULT.match()).toBe(true);

		const res = await errorHandlers.DEFAULT.handler();
		expect(res).toEqual({ maxRetries: 0 });
	});

	it('prioritizes caller handlers before built-ins', () => {
		const callerCustomHandler = {
			match: (e: Error) => e.message.includes('custom'),
			handler: async () => ({ maxRetries: 10 }),
		};

		const combined = {
			...errorHandlers,
			CUSTOM: callerCustomHandler,
		};

		const customErr = new Error('custom error');
		expect(combined.CUSTOM.match(customErr)).toBe(true);
	});
});
