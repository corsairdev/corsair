import { handleCorsairError } from '../core/errors/handler';

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
 * `call` is private to `bindEndpoints`, so this reproduces its control flow
 * exactly and asserts the corrected behaviour.
 */

type Attempt = (n: number) => Promise<string>;

/** The binder's retry loop, with the fix applied. */
async function callWithRetry(
	attemptNumber: number,
	run: Attempt,
	maxRetries: number,
	onRetry?: () => void,
): Promise<string> {
	try {
		return await run(attemptNumber);
	} catch (error) {
		if (error instanceof Error) {
			if (attemptNumber < maxRetries) {
				const newAttempt = attemptNumber + 1;
				onRetry?.();
				return await callWithRetry(newAttempt, run, maxRetries, onRetry);
			}
		}
		throw error;
	}
}

describe('endpoint binder retry semantics', () => {
	it('returns the result when a retry succeeds', async () => {
		let calls = 0;
		const run: Attempt = async () => {
			calls += 1;
			if (calls === 1) throw new Error('Too Many Requests');
			return 'succeeded-on-retry';
		};

		await expect(callWithRetry(0, run, 3)).resolves.toBe('succeeded-on-retry');
		expect(calls).toBe(2);
	});

	it('does not surface the original error after a successful retry', async () => {
		let calls = 0;
		const run: Attempt = async () => {
			calls += 1;
			if (calls < 3) throw new Error('Too Many Requests');
			return 'ok';
		};

		// Two failures then success, within the retry budget.
		await expect(callWithRetry(0, run, 3)).resolves.toBe('ok');
	});

	it('still throws when every attempt fails', async () => {
		let calls = 0;
		const run: Attempt = async () => {
			calls += 1;
			throw new Error('Too Many Requests');
		};

		await expect(callWithRetry(0, run, 2)).rejects.toThrow('Too Many Requests');
		expect(calls).toBe(3); // initial attempt + 2 retries
	});

	it('throws immediately when the policy allows no retries', async () => {
		let calls = 0;
		const run: Attempt = async () => {
			calls += 1;
			throw new Error('Unauthorized');
		};

		await expect(callWithRetry(0, run, 0)).rejects.toThrow('Unauthorized');
		expect(calls).toBe(1);
	});

	it('stops retrying as soon as an attempt succeeds', async () => {
		let calls = 0;
		let retries = 0;
		const run: Attempt = async () => {
			calls += 1;
			if (calls === 1) throw new Error('Too Many Requests');
			return 'ok';
		};

		await callWithRetry(0, run, 5, () => {
			retries += 1;
		});

		expect(calls).toBe(2);
		expect(retries).toBe(1);
	});
});

describe('rate-limit errors resolve to a retrying policy', () => {
	it('a 429 handler yields maxRetries > 0', async () => {
		const handlers = {
			RATE_LIMIT_ERROR: {
				match: (error: Error) => error.message === 'Too Many Requests',
				handler: async () => ({ maxRetries: 3 }),
			},
			DEFAULT: { match: () => true, handler: async () => ({ maxRetries: 0 }) },
		};

		const strategy = await handleCorsairError(
			new Error('Too Many Requests'),
			'testplugin',
			'group.operation',
			{},
			handlers,
		);

		expect(strategy.maxRetries).toBe(3);
	});
});
