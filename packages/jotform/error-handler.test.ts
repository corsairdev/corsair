import { ApiError } from 'corsair/http';
import { errorHandlers } from './error-handlers';
import { jotform } from './index';

function makeApiError(status: number, message: string, retryAfter?: number) {
	return new ApiError(
		{ method: 'GET', url: '/user' },
		{
			url: 'https://api.jotform.com/user',
			ok: false,
			status,
			statusText: message,
			body: { message },
		},
		message,
		retryAfter === undefined ? undefined : { retryAfter },
	);
}

describe('Jotform errorHandlers', () => {
	it('matches quota exhaustion before generic rate limits and disables retries', async () => {
		const quotaError = makeApiError(429, 'Daily API call limit reached');
		expect(errorHandlers.QUOTA_EXHAUSTED_ERROR.match(quotaError)).toBe(true);

		const result =
			await errorHandlers.QUOTA_EXHAUSTED_ERROR.handler(quotaError);
		expect(result).toEqual({ maxRetries: 0 });
	});

	it('matches transient 429 rate limit errors and extracts Retry-After', async () => {
		const rateLimitError = makeApiError(429, 'Too Many Requests', 5000);
		expect(errorHandlers.RATE_LIMIT_ERROR.match(rateLimitError)).toBe(true);

		const result = await errorHandlers.RATE_LIMIT_ERROR.handler(rateLimitError);
		expect(result).toEqual({ maxRetries: 3, headersRetryAfterMs: 5000 });
	});

	it('matches authentication errors on 401 and 403', async () => {
		const unauthorized = makeApiError(401, 'Unauthorized');
		const forbidden = makeApiError(403, 'Forbidden');

		expect(errorHandlers.AUTH_ERROR.match(unauthorized)).toBe(true);
		expect(errorHandlers.AUTH_ERROR.match(forbidden)).toBe(true);

		await expect(
			errorHandlers.AUTH_ERROR.handler(unauthorized),
		).resolves.toEqual({
			maxRetries: 0,
		});
	});

	it('matches not found errors on 404', async () => {
		const notFound = makeApiError(404, 'User not found');
		expect(errorHandlers.NOT_FOUND_ERROR.match(notFound)).toBe(true);

		await expect(
			errorHandlers.NOT_FOUND_ERROR.handler(notFound),
		).resolves.toEqual({
			maxRetries: 0,
		});
	});

	it('matches bad request errors on 400 and 422', async () => {
		const badRequest = makeApiError(400, 'Bad Request');
		const unprocessable = makeApiError(422, 'Unprocessable Entity');

		expect(errorHandlers.BAD_REQUEST_ERROR.match(badRequest)).toBe(true);
		expect(errorHandlers.BAD_REQUEST_ERROR.match(unprocessable)).toBe(true);

		await expect(
			errorHandlers.BAD_REQUEST_ERROR.handler(badRequest),
		).resolves.toEqual({
			maxRetries: 0,
		});
	});

	it('matches server errors on 5xx', async () => {
		const serverError = makeApiError(500, 'Internal Server Error');
		expect(errorHandlers.SERVER_ERROR.match(serverError)).toBe(true);

		await expect(
			errorHandlers.SERVER_ERROR.handler(serverError),
		).resolves.toEqual({
			maxRetries: 0,
		});
	});

	it('falls back to DEFAULT for unclassified errors', async () => {
		const genericError = new Error('Unexpected network glitch');
		expect(errorHandlers.DEFAULT.match(genericError)).toBe(true);

		await expect(errorHandlers.DEFAULT.handler(genericError)).resolves.toEqual({
			maxRetries: 0,
		});
	});

	it('preserves caller handlers with precedence while keeping DEFAULT last', () => {
		const customHandler = {
			match: () => true,
			handler: async () => ({ maxRetries: 7 }),
		};

		const plugin = jotform({
			errorHandlers: {
				CUSTOM_ERROR: customHandler,
			},
		});

		const handlerKeys = Object.keys(plugin.errorHandlers ?? {});
		expect(handlerKeys[0]).toBe('CUSTOM_ERROR');
		expect(handlerKeys[handlerKeys.length - 1]).toBe('DEFAULT');
	});
});
