import type { ErrorContext } from 'corsair/core';
import { FigmaAPIError } from './client';
import { errorHandlers } from './error-handlers';

function ctx(error: Error): ErrorContext {
	return {
		pluginId: 'figma',
		operation: 'users.getCurrent',
		input: {},
		originalError: error,
	};
}

function route(error: Error): string {
	const match = Object.entries(errorHandlers).find(([, entry]) =>
		entry.match(error, ctx(error)),
	);
	if (!match) throw new Error('no handler matched');
	return match[0];
}

beforeEach(() => {
	jest.spyOn(console, 'warn').mockImplementation(() => {});
	jest.spyOn(console, 'error').mockImplementation(() => {});
});

afterEach(() => {
	jest.restoreAllMocks();
});

describe('errorHandlers', () => {
	it('routes a 429 to the rate-limit handler and retries', async () => {
		const error = new FigmaAPIError('too many requests', 429, 2000);

		expect(route(error)).toBe('RATE_LIMIT_ERROR');
		expect(
			await errorHandlers.RATE_LIMIT_ERROR.handler(error, ctx(error)),
		).toEqual({
			maxRetries: 5,
			headersRetryAfterMs: 2000,
		});
	});

	it('treats 401 as an auth failure that must not be retried', async () => {
		const error = new FigmaAPIError('unauthorized', 401);

		expect(route(error)).toBe('AUTH_ERROR');
		expect(await errorHandlers.AUTH_ERROR.handler(error, ctx(error))).toEqual({
			maxRetries: 0,
		});
	});

	it('falls back to DEFAULT for errors with no status or known message', async () => {
		const error = new Error('socket hang up');

		expect(route(error)).toBe('DEFAULT');
		expect(await errorHandlers.DEFAULT.handler(error, ctx(error))).toEqual({
			maxRetries: 0,
		});
	});
});
