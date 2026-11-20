import { ApiError } from 'corsair/http';
import { OpenseoAPIError } from './client';
import { errorHandlers } from './error-handlers';
import { openseo } from './index';

function apiError(status: number, retryAfter?: number) {
	return new ApiError(
		{ method: 'POST', url: '' },
		{
			url: 'https://app.openseo.so/mcp',
			ok: false,
			status,
			statusText: `HTTP ${status}`,
			body: {},
		},
		`HTTP ${status}`,
		retryAfter === undefined ? undefined : { retryAfter },
	);
}

// Core picks the first handler whose matcher accepts the error.
function handlerFor(error: Error): string | undefined {
	return Object.entries(errorHandlers).find(([, handler]) =>
		handler.match(error),
	)?.[0];
}

describe('error handler matching', () => {
	it.each([
		[apiError(402), 'INSUFFICIENT_CREDITS_ERROR'],
		[
			new OpenseoAPIError('INSUFFICIENT_CREDITS', 'INSUFFICIENT_CREDITS'),
			'INSUFFICIENT_CREDITS_ERROR',
		],
		[
			new OpenseoAPIError("You don't have enough credits for this."),
			'INSUFFICIENT_CREDITS_ERROR',
		],
		[
			new OpenseoAPIError('PAYMENT_REQUIRED', 'PAYMENT_REQUIRED'),
			'INSUFFICIENT_CREDITS_ERROR',
		],
		[apiError(429, 1000), 'RATE_LIMIT_ERROR'],
		[new OpenseoAPIError('RATE_LIMITED'), 'RATE_LIMIT_ERROR'],
		[apiError(401), 'AUTH_ERROR'],
		[apiError(403), 'AUTH_ERROR'],
		[new OpenseoAPIError('FORBIDDEN', 'FORBIDDEN'), 'AUTH_ERROR'],
		[new OpenseoAPIError('NOT_FOUND', 'NOT_FOUND'), 'NOT_FOUND_ERROR'],
		[new OpenseoAPIError('Tool nope not found', '-32602'), 'NOT_FOUND_ERROR'],
		[
			new OpenseoAPIError('Input validation error: projectId: Invalid input'),
			'VALIDATION_ERROR',
		],
		[
			new OpenseoAPIError('UNKNOWN_LOCATION Call search_serp_locations'),
			'VALIDATION_ERROR',
		],
		[apiError(503), 'UPSTREAM_UNAVAILABLE_ERROR'],
		[
			new OpenseoAPIError(
				'The data provider is temporarily unavailable; this is not a problem with the request.',
			),
			'UPSTREAM_UNAVAILABLE_ERROR',
		],
		[new Error('something else'), 'DEFAULT'],
	])('%s -> %s', (error, expected) => {
		expect(handlerFor(error)).toBe(expected);
	});

	it('never retries: core already retried 429s and calls may spend credits', async () => {
		for (const handler of Object.values(errorHandlers)) {
			await expect(handler.handler()).resolves.toEqual({
				maxRetries: 0,
			});
		}
	});
});

describe('plugin error handler order', () => {
	it('keeps DEFAULT last when a caller adds handlers', () => {
		const plugin = openseo({
			errorHandlers: {
				DEFAULT: {
					match: () => true,
					handler: async () => ({ maxRetries: 1 }),
				},
				CUSTOM: {
					match: () => false,
					handler: async () => ({ maxRetries: 0 }),
				},
			},
		});
		const names = Object.keys(plugin.errorHandlers ?? {});
		expect(names[names.length - 1]).toBe('DEFAULT');
		expect(names).toContain('CUSTOM');
	});
});
