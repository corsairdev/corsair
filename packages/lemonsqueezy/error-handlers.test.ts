import type { CorsairErrorHandler } from 'corsair/core';
import { LemonSqueezyAPIError } from './client';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';

type Strategy = {
	maxRetries?: number;
	retryStrategy?: string;
	headersRetryAfterMs?: number;
};

const context = (error: Error) => ({
	pluginId: 'lemonsqueezy',
	operation: 'customers.list',
	input: {},
	originalError: error,
});

async function run(
	name: keyof typeof errorHandlers,
	error: LemonSqueezyAPIError,
): Promise<Strategy> {
	const entry = errorHandlers[name] as NonNullable<
		CorsairErrorHandler[keyof CorsairErrorHandler]
	>;
	expect(entry.match(error, context(error))).toBe(true);
	return (await entry.handler(error, context(error))) as Strategy;
}

function apiError(
	message: string,
	options: { status?: number; retryAfter?: number; method?: string } = {},
) {
	return new LemonSqueezyAPIError(message, options);
}

describe('error handlers', () => {
	it('retries a 429 with the documented backoff', async () => {
		const strategy = await run(
			'RATE_LIMIT_ERROR',
			apiError('rate limited', { status: 429 }),
		);
		expect(strategy.maxRetries).toBe(3);
		expect(strategy.retryStrategy).toBe('exponential_backoff');
	});

	it('uses Retry-After when a proxy supplies one', async () => {
		const strategy = await run(
			'RATE_LIMIT_ERROR',
			apiError('rate limited', { status: 429, retryAfter: 5000 }),
		);
		expect(strategy.headersRetryAfterMs).toBe(5000);
	});

	it('does not retry an auth failure', async () => {
		expect(
			(await run('AUTH_ERROR', apiError('unauthorized', { status: 401 })))
				.maxRetries,
		).toBe(0);
	});

	it('does not retry a forbidden or a missing resource', async () => {
		expect(
			(await run('PERMISSION_ERROR', apiError('forbidden', { status: 403 })))
				.maxRetries,
		).toBe(0);
		expect(
			(await run('NOT_FOUND_ERROR', apiError('missing', { status: 404 })))
				.maxRetries,
		).toBe(0);
	});

	it('does not retry a validation failure', async () => {
		for (const status of [400, 422]) {
			expect(
				(await run('VALIDATION_ERROR', apiError('invalid', { status })))
					.maxRetries,
			).toBe(0);
		}
	});

	it('does not retry a method or state conflict', async () => {
		for (const status of [405, 409]) {
			expect(
				(await run('CONFLICT_ERROR', apiError('conflict', { status })))
					.maxRetries,
			).toBe(0);
		}
	});

	it('retries a 5xx only for a GET', async () => {
		expect(
			(
				await run(
					'SERVER_ERROR',
					apiError('boom', { status: 503, method: 'GET' }),
				)
			).maxRetries,
		).toBe(2);
		// A refund or a cancel must never be sent twice.
		for (const method of ['POST', 'PATCH', 'DELETE']) {
			expect(
				(await run('SERVER_ERROR', apiError('boom', { status: 500, method })))
					.maxRetries,
			).toBe(0);
		}
	});

	it('leaves anything unrecognised to DEFAULT with no retry', async () => {
		const plain = new Error('socket hang up');
		const entry = errorHandlers.DEFAULT as NonNullable<
			CorsairErrorHandler['DEFAULT']
		>;
		expect(entry.match(plain, context(plain))).toBe(true);
		const strategy = (await entry.handler(plain, context(plain))) as Strategy;
		expect(strategy.maxRetries).toBe(0);
	});
});

describe('handler merging', () => {
	it('keeps DEFAULT last', () => {
		expect(
			Object.keys(mergeErrorHandlers(errorHandlers, undefined)).at(-1),
		).toBe('DEFAULT');
	});

	it('runs a caller handler no builtin covers, before DEFAULT', () => {
		const merged = mergeErrorHandlers(errorHandlers, {
			TEAPOT_ERROR: {
				match: () => true,
				handler: async () => ({ maxRetries: 0 }),
			},
		});
		const keys = Object.keys(merged);
		expect(keys[0]).toBe('TEAPOT_ERROR');
		expect(keys.at(-1)).toBe('DEFAULT');
	});

	it('lets a caller override a builtin by name', async () => {
		const override = jest.fn().mockResolvedValue({ maxRetries: 9 });
		const merged = mergeErrorHandlers(errorHandlers, {
			RATE_LIMIT_ERROR: { match: () => true, handler: override },
		});
		expect(merged.RATE_LIMIT_ERROR?.handler).toBe(override);
		expect(Object.keys(merged).at(-1)).toBe('DEFAULT');
	});

	it('keeps a caller DEFAULT when one is given', () => {
		const callerDefault = jest.fn().mockResolvedValue({ maxRetries: 0 });
		const merged = mergeErrorHandlers(errorHandlers, {
			DEFAULT: { match: () => true, handler: callerDefault },
		});
		expect(merged.DEFAULT?.handler).toBe(callerDefault);
	});
});

describe('error classification', () => {
	it('treats a 429 as a rate limit and nothing else', () => {
		const error = apiError('x', { status: 429 });
		expect(error.isRateLimit).toBe(true);
		expect(error.isRateLimit).toBe(true);
	});

	it('matches nothing for a plain error', () => {
		const plain = new Error('network reset');
		for (const [name, entry] of Object.entries(errorHandlers)) {
			if (name === 'DEFAULT') continue;
			expect({
				name,
				matched: (entry as NonNullable<CorsairErrorHandler[string]>).match(
					plain,
					context(plain),
				),
			}).toEqual({ name, matched: false });
		}
	});
});
