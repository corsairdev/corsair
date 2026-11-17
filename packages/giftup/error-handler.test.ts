import { ApiError } from 'corsair/http';
import { errorHandlers } from './error-handlers';
import { giftup } from './index';

function makeApiError(status: number, message: string, retryAfter?: number) {
	return new ApiError(
		{ method: 'GET', url: '/ping' },
		{
			url: 'https://api.giftup.app/ping',
			ok: false,
			status,
			statusText: message,
			body: {},
		},
		message,
		retryAfter === undefined ? undefined : { retryAfter },
	);
}

describe('Gift Up! error handlers', () => {
	it('matches 429 and rate limit messages, returning maxRetries 0', async () => {
		const error429 = makeApiError(429, 'Too Many Requests', 5000);
		expect(errorHandlers.RATE_LIMIT_ERROR.match(error429)).toBe(true);

		const result = await errorHandlers.RATE_LIMIT_ERROR.handler(error429);
		expect(result).toEqual({
			maxRetries: 0,
			headersRetryAfterMs: 5000,
		});

		const textError = new Error('You have been rate limited');
		expect(errorHandlers.RATE_LIMIT_ERROR.match(textError)).toBe(true);
	});

	it('matches 401 and 403 authorization errors', async () => {
		const error401 = makeApiError(401, 'Unauthorized');
		const error403 = makeApiError(403, 'Forbidden');
		const textAuth = new Error('Invalid API key provided');

		expect(errorHandlers.AUTH_ERROR.match(error401)).toBe(true);
		expect(errorHandlers.AUTH_ERROR.match(error403)).toBe(true);
		expect(errorHandlers.AUTH_ERROR.match(textAuth)).toBe(true);

		const result = await errorHandlers.AUTH_ERROR.handler(error401);
		expect(result).toEqual({ maxRetries: 0 });
	});

	it('matches 404 not found errors', async () => {
		const error404 = makeApiError(404, 'Not Found');
		const textNotFound = new Error('Gift card not found');

		expect(errorHandlers.NOT_FOUND_ERROR.match(error404)).toBe(true);
		expect(errorHandlers.NOT_FOUND_ERROR.match(textNotFound)).toBe(true);

		const result = await errorHandlers.NOT_FOUND_ERROR.handler(error404);
		expect(result).toEqual({ maxRetries: 0 });
	});

	it('matches 422 unprocessable entity errors', async () => {
		const error422 = makeApiError(422, 'Unprocessable Entity');
		const textValidation = new Error('Validation error on payload');

		expect(errorHandlers.UNPROCESSABLE_ENTITY_ERROR.match(error422)).toBe(true);
		expect(errorHandlers.UNPROCESSABLE_ENTITY_ERROR.match(textValidation)).toBe(
			true,
		);

		const result =
			await errorHandlers.UNPROCESSABLE_ENTITY_ERROR.handler(error422);
		expect(result).toEqual({ maxRetries: 0 });
	});

	it('matches 400 bad request errors', async () => {
		const error400 = makeApiError(400, 'Bad Request');
		const textBadRequest = new Error('Bad request syntax');

		expect(errorHandlers.BAD_REQUEST_ERROR.match(error400)).toBe(true);
		expect(errorHandlers.BAD_REQUEST_ERROR.match(textBadRequest)).toBe(true);

		const result = await errorHandlers.BAD_REQUEST_ERROR.handler(error400);
		expect(result).toEqual({ maxRetries: 0 });
	});

	it('matches 5xx server errors', async () => {
		const error500 = makeApiError(500, 'Internal Server Error');
		const error503 = makeApiError(503, 'Service Unavailable');

		expect(errorHandlers.SERVER_ERROR.match(error500)).toBe(true);
		expect(errorHandlers.SERVER_ERROR.match(error503)).toBe(true);

		const result = await errorHandlers.SERVER_ERROR.handler(error500);
		expect(result).toEqual({ maxRetries: 0 });
	});

	it('DEFAULT matches any error and returns maxRetries 0', async () => {
		const genericError = new Error('Something strange happened');
		expect(errorHandlers.DEFAULT.match(genericError)).toBe(true);

		const result = await errorHandlers.DEFAULT.handler(genericError);
		expect(result).toEqual({ maxRetries: 0 });
	});

	it('preserves caller handlers ahead of built-ins and caller DEFAULT as last', () => {
		const customRateLimit = {
			match: () => true,
			handler: async () => ({ maxRetries: 9 }),
		};
		const customDefault = {
			match: () => true,
			handler: async () => ({ maxRetries: 1 }),
		};

		const instance = giftup({
			errorHandlers: {
				CUSTOM_HANDLER: customRateLimit,
				DEFAULT: customDefault,
			},
		});

		const handlers = instance.errorHandlers;
		if (!handlers) throw new Error('errorHandlers missing');
		const keys = Object.keys(handlers);
		expect(keys[0]).toBe('CUSTOM_HANDLER');
		expect(keys[keys.length - 1]).toBe('DEFAULT');
		expect(handlers.DEFAULT).toBe(customDefault);
	});
});
