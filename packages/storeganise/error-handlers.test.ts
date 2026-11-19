import type { CorsairErrorHandler } from 'corsair/core';
import { StoreganiseAPIError } from './client';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';

// unknown: handlers accept any thrown value until the status check narrows it.
function apiError(
	status: number | undefined,
	method: 'GET' | 'PUT' = 'GET',
): StoreganiseAPIError {
	return new StoreganiseAPIError('Storeganise error', { status, method });
}

// Runs the map the way core does: first matching key wins. Handler
// signatures are (error, context); the context stays undefined here.
async function verdict(error: Error) {
	const handlers: CorsairErrorHandler = errorHandlers;
	for (const entry of Object.values(handlers)) {
		if (entry?.match(error, {} as never)) {
			return (await entry.handler(error, {} as never)) as {
				maxRetries: number;
			};
		}
	}
	return undefined;
}

describe('error handlers', () => {
	it('does not retry a bad credential (401)', async () => {
		const decision = await verdict(apiError(401));
		expect(decision?.maxRetries).toBe(0);
	});

	it('does not retry validation errors (400) or unknown resources (404)', async () => {
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
		const decision = await verdict(apiError(503));
		expect(decision?.maxRetries).toBe(2);
	});

	it('does not replay the documented write on a 5xx', async () => {
		const decision = await verdict(apiError(502, 'PUT'));
		expect(decision?.maxRetries).toBe(0);
	});

	it('does not retry anything else', async () => {
		const decision = await verdict(apiError(409));
		expect(decision?.maxRetries).toBe(0);
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
		expect(keys).toContain('AUTH_ERROR');
	});

	it('lets the caller override a builtin value', () => {
		const merged = mergeErrorHandlers(errorHandlers, {
			AUTH_ERROR: {
				match: () => true,
				handler: async () => ({ maxRetries: 5 }),
			},
		});
		// The caller's handler wins in key order because core takes the first
		// match, and mergeErrorHandlers keeps builtin keys behind caller keys.
		const first = Object.entries(merged).find(([key]) =>
			['AUTH_ERROR', 'VALIDATION_ERROR', 'SERVER_ERROR', 'DEFAULT'].includes(
				key,
			),
		);
		expect(first?.[0]).toBe('AUTH_ERROR');
		expect(first?.[1]?.match(new Error('anything'), {} as never)).toBe(true);
	});

	it('returns the builtin map unchanged when there is no caller config', () => {
		expect(mergeErrorHandlers(errorHandlers, undefined)).toBe(errorHandlers);
	});
});
