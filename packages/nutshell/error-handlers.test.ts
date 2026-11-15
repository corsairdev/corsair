import type { ErrorContext } from 'corsair/core';
import { ApiError } from 'corsair/http';
import { NutshellAPIError } from './client';
import { errorHandlers } from './error-handlers';

function contextFor(operation: string): ErrorContext {
	return {
		pluginId: 'nutshell',
		operation,
		input: {},
		originalError: new Error('original'),
	};
}

function rateLimitError(retryAfterMs?: number): NutshellAPIError {
	const cause = new ApiError(
		{ method: 'GET', url: '/leads' },
		{
			url: 'https://app.nutshell.com/rest/leads',
			ok: false,
			status: 429,
			statusText: 'Too Many Requests',
			body: { error: { code: 429, message: 'Too Many Requests' } },
		},
		'Too Many Requests',
		{ retryAfter: retryAfterMs },
	);
	return new NutshellAPIError('Nutshell rate limit', { cause });
}

describe('errorHandlers', () => {
	it('retries 429 on reads and preserves the full requested delay', async () => {
		const error = rateLimitError(90_000);

		expect(errorHandlers.RATE_LIMIT_ERROR.match(error)).toBe(true);
		await expect(
			errorHandlers.RATE_LIMIT_ERROR.handler(error, contextFor('leads.list')),
		).resolves.toEqual({
			maxRetries: 5,
			retryStrategy: 'exponential_backoff',
			// A delay longer than a minute must stay intact: capping it made
			// reads retry while Nutshell still considered them blocked.
			headersRetryAfterMs: 90_000,
		});
	});

	it('does not retry 429 on writes', async () => {
		const error = rateLimitError(5_000);

		await expect(
			errorHandlers.RATE_LIMIT_ERROR.handler(error, contextFor('leads.create')),
		).resolves.toEqual({ maxRetries: 0 });
	});

	it('does not retry 401', async () => {
		const cause = new ApiError(
			{ method: 'GET', url: '/leads' },
			{
				url: 'https://app.nutshell.com/rest/leads',
				ok: false,
				status: 401,
				statusText: 'Unauthorized',
				body: undefined,
			},
			'Unauthorized',
		);
		const error = new NutshellAPIError('Nutshell auth failure', { cause });

		expect(errorHandlers.AUTH_ERROR.match(error)).toBe(true);
		await expect(errorHandlers.AUTH_ERROR.handler()).resolves.toEqual({
			maxRetries: 0,
		});
	});

	it('ignores plain errors that are not Nutshell 429s', () => {
		expect(errorHandlers.RATE_LIMIT_ERROR.match(new Error('429'))).toBe(false);
	});
});
