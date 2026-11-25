import type { CorsairErrorHandler } from 'corsair/core';
import { ListcleanAPIError } from './client';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';

// Widened to the core interface, whose handler and match take both arguments.
const handlers: CorsairErrorHandler = errorHandlers;

// Handlers match in key order, so the first entry whose match passes decides.
// unknown: each branch returns a different plan shape, so the decision is
// untyped until the assertion narrows it.
function decide(error: Error): { name: string; decision: unknown } {
	for (const [name, entry] of Object.entries(handlers)) {
		if (name === 'DEFAULT') continue;
		if (entry?.match(error, {} as never)) {
			return { name, decision: entry.handler(error, {} as never) };
		}
	}
	return {
		name: 'DEFAULT',
		decision: handlers.DEFAULT?.handler(error, {} as never),
	};
}

// unknown: same shape variety as decide(); assertions narrow each plan.
async function planOf(error: Error): Promise<{ name: string; plan: unknown }> {
	const { name, decision } = decide(error);
	return { name, plan: await (decision as Promise<{ maxRetries: number }>) };
}

describe('Listclean error handlers', () => {
	it('retries a 429 with exponential backoff and passes Retry-After through', async () => {
		const withHeader = new ListcleanAPIError('Slow', {
			status: 429,
			retryAfter: 3000,
			replayable: false,
		});
		const { name, plan } = await planOf(withHeader);
		expect(name).toBe('RATE_LIMIT_ERROR');
		expect(plan).toEqual({
			maxRetries: 3,
			headersRetryAfterMs: 3000,
			retryStrategy: 'exponential_backoff',
		});
	});

	it('retries a 429 with backoff alone when no header came', async () => {
		const { plan } = await planOf(
			new ListcleanAPIError('Slow', { status: 429, replayable: false }),
		);
		expect(plan).toMatchObject({
			maxRetries: 3,
			retryStrategy: 'exponential_backoff',
		});
		expect(
			(plan as { headersRetryAfterMs?: number }).headersRetryAfterMs,
		).toBeUndefined();
	});

	it('does not retry a refused key (401)', async () => {
		const { name, plan } = await planOf(
			new ListcleanAPIError('Invalid token or token expired', {
				status: 401,
				replayable: true,
			}),
		);
		expect(name).toBe('AUTH_ERROR');
		expect(plan).toEqual({ maxRetries: 0 });
	});

	it('does not retry invalid input (400) or a missing route (404)', async () => {
		const badRequest = await planOf(
			new ListcleanAPIError('Parameter emails is required', { status: 400 }),
		);
		expect(badRequest.name).toBe('VALIDATION_ERROR');
		const notFound = await planOf(
			new ListcleanAPIError('Listclean 404: page not found', { status: 404 }),
		);
		expect(notFound.name).toBe('VALIDATION_ERROR');
		expect(notFound.plan).toEqual({ maxRetries: 0 });
	});

	it('replays a read after a 5xx and never a billed or destructive call', async () => {
		const read = await planOf(
			new ListcleanAPIError('upstream broke', {
				status: 500,
				replayable: true,
			}),
		);
		expect(read.name).toBe('SERVER_ERROR');
		expect(read.plan).toMatchObject({
			maxRetries: 2,
			retryStrategy: 'exponential_backoff',
		});

		const billed = await planOf(
			new ListcleanAPIError('upstream broke', {
				status: 500,
				replayable: false,
			}),
		);
		expect(billed.plan).toEqual({ maxRetries: 0 });

		const destroyed = await planOf(
			new ListcleanAPIError('upstream broke', {
				status: 503,
				method: 'DELETE',
				replayable: false,
			}),
		);
		// The gate is the flag, not the method: a delete stays unreplayed.
		expect(destroyed.plan).toEqual({ maxRetries: 0 });
	});

	it('replays a dropped connection only when the operation is replayable', async () => {
		const read = await planOf(
			new ListcleanAPIError('fetch failed', {
				transport: true,
				replayable: true,
			}),
		);
		expect(read.name).toBe('TRANSPORT_ERROR');
		expect(read.plan).toMatchObject({ maxRetries: 2 });

		const billed = await planOf(
			new ListcleanAPIError('fetch failed', {
				transport: true,
				replayable: false,
			}),
		);
		expect(billed.plan).toEqual({ maxRetries: 0 });
	});

	it('sends an unexpected error to DEFAULT with no retries', async () => {
		const { name, plan } = await planOf(new Error('something else'));
		expect(name).toBe('DEFAULT');
		expect(plan).toEqual({ maxRetries: 0 });
	});

	it('lets a caller override a handler, adds unnamed builtins after, and keeps DEFAULT last', () => {
		const callerCustom: { match: (error: Error) => boolean } = {
			match: (error) => error.message.includes('custom'),
		};
		const merged = mergeErrorHandlers(errorHandlers, {
			AUTH_ERROR: {
				match: () => false,
				handler: async () => ({ maxRetries: 0 }),
			},
			CUSTOM: {
				match: callerCustom.match,
				handler: async () => ({ maxRetries: 0 }),
			},
			DEFAULT: { match: () => true, handler: async () => ({ maxRetries: 0 }) },
		});

		const keys = Object.keys(merged);
		// The caller's value wins the AUTH_ERROR slot, the builtin entries the
		// caller did not name survive, and DEFAULT closes the map.
		expect(keys[keys.length - 1]).toBe('DEFAULT');
		expect(keys.indexOf('CUSTOM')).toBeLessThan(
			keys.indexOf('RATE_LIMIT_ERROR'),
		);
		for (const builtin of [
			'RATE_LIMIT_ERROR',
			'SERVER_ERROR',
			'TRANSPORT_ERROR',
		]) {
			expect(merged[builtin]).toBeDefined();
		}
	});
});
