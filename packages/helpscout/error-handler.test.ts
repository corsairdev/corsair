import type { ErrorContext } from 'corsair/core';
import { ApiError } from 'corsair/http';
import { errorHandlers } from './error-handlers';
import { helpscout } from './index';

const dummyContext: ErrorContext = {
	pluginId: 'helpscout',
	operation: 'test-operation',
	input: {},
	originalError: new Error('test-context-error'),
};

function makeApiError(status: number, message: string, retryAfter?: number) {
	return new ApiError(
		{ method: 'GET', url: '/mailboxes' },
		{
			url: 'https://api.helpscout.net/v2/mailboxes',
			ok: false,
			status,
			statusText: message,
			body: { message },
		},
		message,
		retryAfter === undefined ? undefined : { retryAfter },
	);
}

describe('Help Scout Error Handlers', () => {
	describe('RATE_LIMIT_ERROR', () => {
		it('matches on 429 ApiError and returns maxRetries: 0 for single-owner rate limiting', async () => {
			const err = makeApiError(429, 'Too Many Requests', 5000);
			expect(errorHandlers.RATE_LIMIT_ERROR.match(err, dummyContext)).toBe(
				true,
			);

			const result = await errorHandlers.RATE_LIMIT_ERROR.handler(
				err,
				dummyContext,
			);
			// Required rule: Single-owner rate limiting: RATE_LIMIT_ERROR handler must return { maxRetries: 0 }.
			expect(result).toEqual({ maxRetries: 0 });
		});

		it('matches on message containing rate limit keywords', () => {
			const stringErr = new Error('Client rate limited: too many requests');
			expect(
				errorHandlers.RATE_LIMIT_ERROR.match(stringErr, dummyContext),
			).toBe(true);
		});
	});

	describe('AUTH_ERROR', () => {
		it('matches on 401 and 403 ApiError', async () => {
			const err401 = makeApiError(401, 'Unauthorized');
			const err403 = makeApiError(403, 'Forbidden');

			expect(errorHandlers.AUTH_ERROR.match(err401, dummyContext)).toBe(true);
			expect(errorHandlers.AUTH_ERROR.match(err403, dummyContext)).toBe(true);

			await expect(
				errorHandlers.AUTH_ERROR.handler(err401, dummyContext),
			).resolves.toEqual({
				maxRetries: 0,
			});
		});

		it('matches on error message containing auth keywords', () => {
			expect(
				errorHandlers.AUTH_ERROR.match(
					new Error('invalid token'),
					dummyContext,
				),
			).toBe(true);
			expect(
				errorHandlers.AUTH_ERROR.match(
					new Error('invalid api key'),
					dummyContext,
				),
			).toBe(true);
		});
	});

	describe('NOT_FOUND_ERROR', () => {
		it('matches on 404 ApiError', async () => {
			const err404 = makeApiError(404, 'Resource Not Found');
			expect(errorHandlers.NOT_FOUND_ERROR.match(err404, dummyContext)).toBe(
				true,
			);

			await expect(
				errorHandlers.NOT_FOUND_ERROR.handler(err404, dummyContext),
			).resolves.toEqual({
				maxRetries: 0,
			});
		});
	});

	describe('BAD_REQUEST_ERROR', () => {
		it('matches on 400 and 422 ApiError', async () => {
			const err400 = makeApiError(400, 'Bad Request');
			const err422 = makeApiError(422, 'Unprocessable Entity');

			expect(errorHandlers.BAD_REQUEST_ERROR.match(err400, dummyContext)).toBe(
				true,
			);
			expect(errorHandlers.BAD_REQUEST_ERROR.match(err422, dummyContext)).toBe(
				true,
			);

			await expect(
				errorHandlers.BAD_REQUEST_ERROR.handler(err400, dummyContext),
			).resolves.toEqual({
				maxRetries: 0,
			});
		});
	});

	describe('DEFAULT Handler', () => {
		it('matches any error and returns maxRetries: 0', async () => {
			const unknownErr = new Error('Some unexpected exception');
			expect(errorHandlers.DEFAULT.match(unknownErr, dummyContext)).toBe(true);

			await expect(
				errorHandlers.DEFAULT.handler(unknownErr, dummyContext),
			).resolves.toEqual({
				maxRetries: 0,
			});
		});
	});

	describe('Error Handler Ordering & Caller Overrides', () => {
		it('allows callers to override error handlers while putting DEFAULT last', async () => {
			const customHandler = jest.fn().mockResolvedValue({ maxRetries: 2 });
			const plugin = helpscout({
				errorHandlers: {
					CUSTOM_429: {
						match: (e: Error) => e.message.includes('custom-429'),
						handler: customHandler,
					},
				},
			});

			const handlers = plugin.errorHandlers;
			if (!handlers) {
				throw new Error('plugin.errorHandlers is undefined');
			}
			const handlerKeys = Object.keys(handlers);

			// Caller's custom handler is evaluated first
			expect(handlerKeys[0]).toBe('CUSTOM_429');
			// DEFAULT is always last
			expect(handlerKeys[handlerKeys.length - 1]).toBe('DEFAULT');

			const customErr = new Error('custom-429 limit');
			const custom429 = handlers.CUSTOM_429;
			if (!custom429) {
				throw new Error('handlers.CUSTOM_429 is undefined');
			}
			expect(custom429.match(customErr, dummyContext)).toBe(true);
			await expect(custom429.handler(customErr, dummyContext)).resolves.toEqual(
				{
					maxRetries: 2,
				},
			);
		});
	});
});
