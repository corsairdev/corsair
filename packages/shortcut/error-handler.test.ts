import { ApiError } from 'corsair/http';
import { ShortcutNetworkError } from './client';
import { errorHandlers } from './error-handlers';

const makeApiError = (status: number, retryAfter?: number): ApiError =>
	new ApiError(
		{ method: 'GET', url: '/api/v3/stories' },
		{
			url: 'https://api.app.shortcut.com/api/v3/stories',
			ok: false,
			status,
			statusText: 'Provider response',
			body: undefined,
		},
		`HTTP ${status}`,
		{ retryAfter },
	);

const context = (operation: string) => ({
	pluginId: 'shortcut',
	operation,
	input: {},
	originalError: new Error('redacted'),
});

describe('Shortcut error handlers', () => {
	it('leaves 429 retry ownership to the shared transport and keeps Retry-After', async () => {
		const error = makeApiError(429, 3000);
		expect(errorHandlers.RATE_LIMIT_ERROR?.match(error)).toBe(true);
		await expect(errorHandlers.RATE_LIMIT_ERROR?.handler()).resolves.toEqual({
			maxRetries: 0,
		});
		expect(error.retryAfter).toBe(3000);
	});

	it('classifies authentication and validation failures without retrying', async () => {
		for (const status of [401, 403]) {
			const error = makeApiError(status);
			expect(errorHandlers.AUTH_ERROR?.match(error)).toBe(true);
			await expect(errorHandlers.AUTH_ERROR?.handler()).resolves.toEqual({
				maxRetries: 0,
			});
		}
		for (const status of [400, 422]) {
			const error = makeApiError(status);
			expect(errorHandlers.BAD_REQUEST_ERROR?.match(error)).toBe(true);
		}
	});

	it('retries server and network failures only for reads', async () => {
		const serverError = makeApiError(503);
		await expect(
			errorHandlers.SERVER_ERROR?.handler(serverError, context('getStory.get')),
		).resolves.toEqual({ maxRetries: 2 });
		await expect(
			errorHandlers.SERVER_ERROR?.handler(
				serverError,
				context('queryStories.post'),
			),
		).resolves.toEqual({ maxRetries: 2 });
		await expect(
			errorHandlers.SERVER_ERROR?.handler(
				serverError,
				context('createStory.post'),
			),
		).resolves.toEqual({ maxRetries: 0 });

		const networkError = new ShortcutNetworkError();
		await expect(
			errorHandlers.NETWORK_ERROR?.handler(
				networkError,
				context('getStory.get'),
			),
		).resolves.toEqual({ maxRetries: 2 });
		await expect(
			errorHandlers.NETWORK_ERROR?.handler(
				networkError,
				context('queryStories.post'),
			),
		).resolves.toEqual({ maxRetries: 2 });
		await expect(
			errorHandlers.NETWORK_ERROR?.handler(
				networkError,
				context('createStory.post'),
			),
		).resolves.toEqual({ maxRetries: 0 });
	});

	it('keeps the catch-all handler non-retrying', async () => {
		await expect(errorHandlers.DEFAULT?.handler()).resolves.toEqual({
			maxRetries: 0,
		});
	});
});
