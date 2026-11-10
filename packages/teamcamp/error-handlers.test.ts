import type { CorsairErrorHandler } from 'corsair/core';
import { TeamcampAPIError } from './client';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';

type Strategy = {
	maxRetries?: number;
	retryStrategy?: string;
	headersRetryAfterMs?: number;
};

const context = (error: Error) => ({
	pluginId: 'teamcamp',
	operation: 'projects.list',
	input: {},
	originalError: error,
});

async function run(
	name: keyof typeof errorHandlers,
	error: TeamcampAPIError,
): Promise<Strategy> {
	const entry = errorHandlers[name] as NonNullable<
		CorsairErrorHandler[keyof CorsairErrorHandler]
	>;
	expect(entry.match(error, context(error))).toBe(true);
	return (await entry.handler(error, context(error))) as Strategy;
}

function apiError(
	message: string,
	options: {
		status?: number;
		resourceNotFound?: boolean;
		retryAfter?: number;
		method?: string;
	} = {},
) {
	return new TeamcampAPIError(message, options);
}

describe('error handlers', () => {
	it('does not retry a real auth failure', async () => {
		expect(
			(await run('AUTH_ERROR', apiError('bad key', { status: 401 })))
				.maxRetries,
		).toBe(0);
		expect(
			(
				await run(
					'AUTH_ERROR',
					apiError('bad key', { status: 403, resourceNotFound: false }),
				)
			).maxRetries,
		).toBe(0);
	});

	it('routes a resource-scoped 403 to NOT_FOUND, not AUTH', async () => {
		const error = apiError('missing', { status: 403, resourceNotFound: true });
		// AUTH_ERROR must not claim it: the key is fine, the id is not.
		const authEntry = errorHandlers.AUTH_ERROR as NonNullable<
			CorsairErrorHandler['AUTH_ERROR']
		>;
		expect(authEntry.match(error, context(error))).toBe(false);
		expect((await run('NOT_FOUND_ERROR', error)).maxRetries).toBe(0);
	});

	it('does not retry a 404', async () => {
		expect(
			(await run('NOT_FOUND_ERROR', apiError('missing', { status: 404 })))
				.maxRetries,
		).toBe(0);
	});

	it('retries a 429 with a backoff, using Retry-After when sent', async () => {
		const bare = await run(
			'RATE_LIMIT_ERROR',
			apiError('slow down', { status: 429 }),
		);
		expect(bare.maxRetries).toBe(3);
		expect(bare.retryStrategy).toBe('exponential_backoff');

		const headed = await run(
			'RATE_LIMIT_ERROR',
			apiError('slow down', { status: 429, retryAfter: 4000 }),
		);
		expect(headed.headersRetryAfterMs).toBe(4000);
	});

	it('does not retry a bad parameter', async () => {
		expect(
			(await run('VALIDATION_ERROR', apiError('bad', { status: 400 })))
				.maxRetries,
		).toBe(0);
	});

	it('retries a 5xx only for a GET', async () => {
		expect(
			(
				await run(
					'SERVER_ERROR',
					apiError('boom', { status: 500, method: 'GET' }),
				)
			).maxRetries,
		).toBe(2);
		for (const method of ['POST', 'PUT', 'DELETE']) {
			expect(
				(await run('SERVER_ERROR', apiError('boom', { status: 503, method })))
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

	it('lets a caller override a builtin by name and keeps DEFAULT last', () => {
		const override = jest.fn().mockResolvedValue({ maxRetries: 9 });
		const merged = mergeErrorHandlers(errorHandlers, {
			SERVER_ERROR: { match: () => true, handler: override },
		});
		expect(merged.SERVER_ERROR?.handler).toBe(override);
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
	it('separates a bad key from a missing resource on the same 403', () => {
		const badKey = apiError('x', { status: 403, resourceNotFound: false });
		const missing = apiError('x', { status: 403, resourceNotFound: true });
		expect(badKey.isAuthError).toBe(true);
		expect(missing.isAuthError).toBe(false);
		expect(missing.resourceNotFound).toBe(true);
	});

	it('treats a 401 as an auth failure even on a resource call', () => {
		const error = apiError('x', { status: 401, resourceNotFound: false });
		expect(error.isAuthError).toBe(true);
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
