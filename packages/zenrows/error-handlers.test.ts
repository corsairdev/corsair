import type { CorsairErrorHandler } from 'corsair/core';
import { ZenRowsAPIError } from './client';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';

type Strategy = {
	maxRetries?: number;
	retryStrategy?: string;
	headersRetryAfterMs?: number;
};

async function run(
	name: keyof typeof errorHandlers,
	error: Error,
): Promise<Strategy> {
	const entry = errorHandlers[name] as NonNullable<
		CorsairErrorHandler[keyof CorsairErrorHandler]
	>;
	const context = {
		pluginId: 'zenrows',
		operation: 'fetch.page',
		input: {},
		originalError: error,
	};
	expect(entry.match(error, context)).toBe(true);
	return (await entry.handler(error, context)) as Strategy;
}

function apiError(
	message: string,
	options: {
		status?: number;
		code?: string;
		retryAfter?: number;
		method?: string;
	},
) {
	return new ZenRowsAPIError(message, options);
}

describe('error handlers', () => {
	it('never retries an account that is out of credits', async () => {
		for (const code of [
			'AUTH004',
			'AUTH014',
			'AUTH011',
			'api_key_cap_reached',
		]) {
			const strategy = await run(
				'CREDITS_ERROR',
				apiError('out of credits', { status: 402, code }),
			);
			expect(strategy.maxRetries).toBe(0);
		}
		// A crawl stopped on credits answers 429 with a per-crawl code.
		const stopped = await run(
			'CREDITS_ERROR',
			apiError('insufficient', { status: 429, code: 'insufficient_credits' }),
		);
		expect(stopped.maxRetries).toBe(0);
	});

	it('retries both 429 codes, using Retry-After when Zenrows sends one', async () => {
		const withHeader = await run(
			'RATE_LIMIT_ERROR',
			apiError('rate limited', {
				status: 429,
				code: 'AUTH008',
				retryAfter: 7000,
			}),
		);
		expect(withHeader.maxRetries).toBe(3);
		expect(withHeader.headersRetryAfterMs).toBe(7000);

		// A concurrency 429 documents no Retry-After: exponential backoff.
		const concurrency = await run(
			'RATE_LIMIT_ERROR',
			apiError('concurrency', { status: 429, code: 'AUTH006' }),
		);
		expect(concurrency).toEqual({
			maxRetries: 3,
			headersRetryAfterMs: undefined,
			retryStrategy: 'exponential_backoff',
		});
	});

	it('does not retry an auth failure', async () => {
		for (const code of ['AUTH001', 'AUTH002', 'AUTH003', 'AUTH005']) {
			const strategy = await run(
				'AUTH_ERROR',
				apiError('bad key', { status: 401, code }),
			);
			expect(strategy.maxRetries).toBe(0);
		}
	});

	it('does not retry a 403 or a refused Extract page', async () => {
		expect(
			(await run('PERMISSION_ERROR', apiError('blocked', { status: 403 })))
				.maxRetries,
		).toBe(0);
		expect(
			(
				await run(
					'PERMISSION_ERROR',
					apiError('refused', { status: 403, code: 'REQS007' }),
				)
			).maxRetries,
		).toBe(0);
	});

	it('does not retry a bad request, a missing page or a 422', async () => {
		for (const code of ['REQS001', 'REQS004', 'REQS005', 'REQS006']) {
			expect(
				(await run('REQUEST_ERROR', apiError('bad', { status: 400, code })))
					.maxRetries,
			).toBe(0);
		}
		for (const code of ['RESP002', 'RESP007']) {
			expect(
				(
					await run(
						'NOT_FOUND_ERROR',
						apiError('missing', { status: 404, code }),
					)
				).maxRetries,
			).toBe(0);
		}
		expect(
			(
				await run(
					'UNPROCESSABLE_ERROR',
					apiError('no content', { status: 422 }),
				)
			).maxRetries,
		).toBe(0);
	});

	it('does not retry a response that was too large', async () => {
		expect(
			(
				await run(
					'RESPONSE_TOO_LARGE_ERROR',
					apiError('too big', { status: 413 }),
				)
			).maxRetries,
		).toBe(0);
	});

	it('retries a 5xx only for a read', async () => {
		// A GET safe to replay.
		expect(
			(
				await run(
					'SERVER_ERROR',
					apiError('boom', { status: 503, method: 'GET' }),
				)
			).maxRetries,
		).toBe(2);
		// A crawl start is a POST that spends credits.
		expect(
			(
				await run(
					'SERVER_ERROR',
					apiError('boom', { status: 500, method: 'POST' }),
				)
			).maxRetries,
		).toBe(0);
		// A forwarded POST reaches the target with a body.
		expect(
			(
				await run(
					'SERVER_ERROR',
					apiError('boom', { status: 502, method: 'POST' }),
				)
			).maxRetries,
		).toBe(0);
	});

	it('stops after a failed CAPTCHA solve and after a conflict', async () => {
		expect(
			(await run('CAPTCHA_ERROR', apiError('captcha', { status: 424 })))
				.maxRetries,
		).toBe(0);
		expect(
			(await run('CONFLICT_ERROR', apiError('conflict', { status: 409 })))
				.maxRetries,
		).toBe(0);
		expect(
			(await run('CONFLICT_ERROR', apiError('expired', { status: 410 })))
				.maxRetries,
		).toBe(0);
	});

	it('leaves an unrecognised error to DEFAULT with no retry', async () => {
		const plain = new Error('anything');
		const entry = errorHandlers.DEFAULT as NonNullable<
			CorsairErrorHandler['DEFAULT']
		>;
		expect(
			entry.match(plain, {
				pluginId: 'zenrows',
				operation: 'fetch.page',
				input: {},
				originalError: plain,
			}),
		).toBe(true);
		const strategy = (await entry.handler(plain, {
			pluginId: 'zenrows',
			operation: 'fetch.page',
			input: {},
			originalError: plain,
		})) as Strategy;
		expect(strategy.maxRetries).toBe(0);
	});

	it('keeps DEFAULT last after a merge', () => {
		const merged = mergeErrorHandlers(errorHandlers, undefined);
		expect(Object.keys(merged).at(-1)).toBe('DEFAULT');
	});

	it('runs a caller handler that no builtin covers, before DEFAULT', () => {
		const custom = jest.fn().mockResolvedValue({ maxRetries: 0 });
		const merged = mergeErrorHandlers(errorHandlers, {
			TEAPOT_ERROR: {
				match: (error) => error.message === 'teapot',
				handler: custom,
			},
		});
		const keys = Object.keys(merged);
		expect(keys[0]).toBe('TEAPOT_ERROR');
		expect(keys.at(-1)).toBe('DEFAULT');
		// The caller key sits before DEFAULT, so core reaches it first.
		expect(keys.indexOf('TEAPOT_ERROR')).toBeLessThan(keys.indexOf('DEFAULT'));
	});

	it('lets a caller override a builtin handler by name', async () => {
		const override = jest.fn().mockResolvedValue({ maxRetries: 9 });
		const merged = mergeErrorHandlers(errorHandlers, {
			RATE_LIMIT_ERROR: { match: () => true, handler: override },
		});
		expect(merged.RATE_LIMIT_ERROR?.handler).toBe(override);
		expect(Object.keys(merged).at(-1)).toBe('DEFAULT');
	});

	it('keeps the caller DEFAULT when one is given', () => {
		const callerDefault = jest.fn().mockResolvedValue({ maxRetries: 0 });
		const merged = mergeErrorHandlers(errorHandlers, {
			DEFAULT: { match: () => true, handler: callerDefault },
		});
		expect(merged.DEFAULT?.handler).toBe(callerDefault);
		expect(Object.keys(merged).at(-1)).toBe('DEFAULT');
	});
});

describe('error classification', () => {
	it('separates credits from a rate limit on the same 429 status', () => {
		const credits = apiError('x', { status: 429, code: 'AUTH014' });
		const rate = apiError('x', { status: 429, code: 'AUTH006' });
		expect(credits.isOutOfCredits).toBe(true);
		expect(credits.isRateLimit).toBe(true);
		expect(rate.isOutOfCredits).toBe(false);
		// CREDITS_ERROR is checked first, so AUTH014 never reaches the retry.
		expect(errorHandlers.CREDITS_ERROR.match(credits)).toBe(true);
	});

	it('matches nothing for a plain error', () => {
		const plain = new Error('network reset');
		for (const [name, entry] of Object.entries(errorHandlers)) {
			if (name === 'DEFAULT') continue;
			expect(
				(entry as NonNullable<CorsairErrorHandler[string]>).match(plain, {
					pluginId: 'zenrows',
					operation: 'fetch.page',
					input: {},
					originalError: plain,
				}),
			).toBe(false);
		}
	});
});
