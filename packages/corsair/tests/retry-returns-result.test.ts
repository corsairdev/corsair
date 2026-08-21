import { bindEndpointsRecursively } from '../core/endpoints/bind';

/**
 * Regression cover for the shared endpoint binder's retry path.
 *
 * The binder previously did:
 *
 *     await call(newAttempt, callCtx, callArgs);   // result discarded
 *     ...
 *     throw error;                                  // original error rethrown
 *
 * so an operation that failed once (e.g. HTTP 429) and then succeeded on retry
 * still surfaced the original failure to the caller. For mutations that made
 * the outcome ambiguous: the write had actually landed.
 *
 * These tests drive the real binder rather than a copy of its control flow, so
 * they fail if the discarded-result behaviour comes back.
 */

/** Retry immediately: `headersRetryAfterMs` short-circuits the backoff table. */
const retryHandlers = {
	RETRYABLE: {
		match: (error: Error) => error.message === 'Too Many Requests',
		handler: async () => ({ maxRetries: 3, headersRetryAfterMs: 1 }),
	},
	DEFAULT: {
		match: () => true,
		handler: async () => ({ maxRetries: 0 }),
	},
} as never;

/** Binds a single endpoint through the real binder and returns the bound fn. */
function bind(
	endpoint: (ctx: unknown, args: unknown) => Promise<unknown>,
	errorHandlers: unknown = retryHandlers,
) {
	const tree: Record<string, unknown> = {};
	bindEndpointsRecursively({
		endpoints: { run: endpoint },
		hooks: undefined,
		ctx: {},
		tree,
		pluginId: 'test',
		errorHandlers: errorHandlers as never,
		currentPath: [],
		keyBuilder: undefined,
		database: {} as never,
	});
	return tree.run as (args?: unknown) => Promise<unknown>;
}

describe('endpoint binder retry semantics', () => {
	it('returns the result when a retry succeeds', async () => {
		let calls = 0;
		const run = bind(async () => {
			calls += 1;
			if (calls === 1) throw new Error('Too Many Requests');
			return 'succeeded-on-retry';
		});

		await expect(run({})).resolves.toBe('succeeded-on-retry');
		expect(calls).toBe(2);
	});

	it('does not surface the original error after a successful retry', async () => {
		let calls = 0;
		const run = bind(async () => {
			calls += 1;
			if (calls < 3) throw new Error('Too Many Requests');
			return 'eventually-ok';
		});

		await expect(run({})).resolves.toBe('eventually-ok');
		expect(calls).toBe(3);
	});

	it('stops retrying as soon as an attempt succeeds', async () => {
		let calls = 0;
		const run = bind(async () => {
			calls += 1;
			if (calls === 1) throw new Error('Too Many Requests');
			return 'ok';
		});

		await run({});
		// One failure plus one success — the remaining budget goes unused.
		expect(calls).toBe(2);
	});

	it('still throws when every attempt fails', async () => {
		let calls = 0;
		const run = bind(async () => {
			calls += 1;
			throw new Error('Too Many Requests');
		});

		await expect(run({})).rejects.toThrow('Too Many Requests');
		// Initial attempt plus the three the policy allows.
		expect(calls).toBe(4);
	});

	it('throws immediately when the policy allows no retries', async () => {
		let calls = 0;
		const run = bind(async () => {
			calls += 1;
			throw new Error('Unauthorized');
		});

		await expect(run({})).rejects.toThrow('Unauthorized');
		expect(calls).toBe(1);
	});

	it('passes the caller arguments through to the retried attempt', async () => {
		const seen: unknown[] = [];
		let calls = 0;
		const run = bind(async (_ctx, args) => {
			calls += 1;
			seen.push(args);
			if (calls === 1) throw new Error('Too Many Requests');
			return 'ok';
		});

		await run({ id: 'abc' });
		expect(seen).toEqual([{ id: 'abc' }, { id: 'abc' }]);
	});
});
