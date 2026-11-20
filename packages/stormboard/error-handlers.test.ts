import type { CorsairErrorHandler } from 'corsair/core';
import { ApiError } from 'corsair/http';
import { StormboardAPIError } from './client';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';

// The client throws HTTP failures as core's ApiError, so the handlers are
// tested against that.
function apiError(
	status: number,
	method: 'GET' | 'POST' = 'GET',
	retryAfter?: number,
): ApiError {
	return new ApiError(
		{ method, url: '/storms/list' },
		{
			url: 'https://api.stormboard.com/storms/list',
			ok: false,
			status,
			statusText: '',
			body: null,
		},
		'Stormboard error',
		{ retryAfter },
	);
}

// Runs the map the way core does: first matching key wins.
async function verdict(error: Error) {
	const handlers: CorsairErrorHandler = errorHandlers;
	for (const entry of Object.values(handlers)) {
		if (entry?.match(error, {} as never)) {
			return (await entry.handler(error, {} as never)) as {
				maxRetries: number;
				headersRetryAfterMs?: number;
			};
		}
	}
	return undefined;
}

describe('error handlers', () => {
	it('waits out Retry-After on a 429', async () => {
		const decision = await verdict(apiError(429, 'GET', 4000));
		expect(decision?.maxRetries).toBe(3);
		expect(decision?.headersRetryAfterMs).toBe(4000);
	});

	it('does not retry auth failures, which are 403 on Stormboard', async () => {
		expect((await verdict(apiError(403)))?.maxRetries).toBe(0);
		expect((await verdict(apiError(401)))?.maxRetries).toBe(0);
	});

	it('does not retry validation failures or unknown routes', async () => {
		expect((await verdict(apiError(400)))?.maxRetries).toBe(0);
		expect((await verdict(apiError(404)))?.maxRetries).toBe(0);
	});

	it('does not retry zod failures', async () => {
		const decision = await verdict(
			new (class extends Error {
				name = 'ZodError';
			})('bad payload'),
		);
		expect(decision?.maxRetries).toBe(0);
	});

	it('replays a failed GET on a 5xx, which never ran', async () => {
		expect((await verdict(apiError(500)))?.maxRetries).toBe(2);
	});

	it('does not replay a create on a 5xx: creates have no idempotency contract', async () => {
		expect((await verdict(apiError(502, 'POST')))?.maxRetries).toBe(0);
	});

	it('reads a StormboardAPIError too (network failures)', async () => {
		const error = new StormboardAPIError('socket hang up', {
			status: 503,
			method: 'GET',
		});
		expect((await verdict(error))?.maxRetries).toBe(2);
	});

	it('does not retry anything else', async () => {
		expect((await verdict(apiError(409)))?.maxRetries).toBe(0);
	});
});

describe('mergeErrorHandlers', () => {
	it('keeps DEFAULT last when the caller adds handlers', () => {
		const merged = mergeErrorHandlers(errorHandlers, {
			CONFLICT_ERROR: {
				match: (error: Error) => error.message.includes('conflict'),
				handler: async () => ({ maxRetries: 0 }),
			},
		});
		const keys = Object.keys(merged);
		expect(keys.at(-1)).toBe('DEFAULT');
		expect(keys).toContain('CONFLICT_ERROR');
		expect(keys).toContain('RATE_LIMIT_ERROR');
	});

	it('lets the caller override a builtin value', () => {
		const merged = mergeErrorHandlers(errorHandlers, {
			AUTH_ERROR: {
				match: () => true,
				handler: async () => ({ maxRetries: 5 }),
			},
		});
		const first = Object.entries(merged).find(([key]) =>
			[
				'AUTH_ERROR',
				'RATE_LIMIT_ERROR',
				'VALIDATION_ERROR',
				'SERVER_ERROR',
				'DEFAULT',
			].includes(key),
		);
		expect(first?.[0]).toBe('AUTH_ERROR');
		expect(first?.[1]?.match(new Error('anything'), {} as never)).toBe(true);
	});

	it('returns the builtin map unchanged when there is no caller config', () => {
		expect(mergeErrorHandlers(errorHandlers, undefined)).toBe(errorHandlers);
	});
});
