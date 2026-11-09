import type { CorsairErrorHandler, ErrorContext } from 'corsair/core';
import { CraftmypdfAPIError } from './client';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';

// Core calls match and handler with the operation's context; this plugin's
// handlers read only the error, but the type still requires both arguments.
const context: ErrorContext = {
	pluginId: 'craftmypdf',
	operation: 'account.getInfo',
	input: {},
	originalError: new Error('placeholder'),
};

// The plugin's own map is narrowed by `satisfies` to one-argument handlers;
// core calls them through this wider type, so the test does too.
const handlers: CorsairErrorHandler = errorHandlers;

type HandlerResult = {
	maxRetries?: number;
	headersRetryAfterMs?: number;
};

async function run(
	name: keyof typeof errorHandlers,
	error: Error,
): Promise<HandlerResult> {
	const entry = handlers[name];
	if (!entry?.match(error, context)) throw new Error(`${name} did not match`);
	const result = await entry.handler?.(error, context);
	return {
		maxRetries: result?.maxRetries ?? 0,
		headersRetryAfterMs: result?.headersRetryAfterMs,
	};
}

function firstMatch(error: Error): string | undefined {
	return Object.entries(handlers).find(([, entry]) =>
		entry?.match(error, context),
	)?.[0];
}

function apiError(
	status: number,
	message: string,
	method: 'GET' | 'POST' = 'POST',
	retryAfter?: number,
) {
	return new CraftmypdfAPIError(message, { status, method, retryAfter });
}

describe('craftmypdf error handlers', () => {
	it('retries a 429 with the Retry-After delay', async () => {
		const error = apiError(429, 'Too Many Requests', 'GET', 3000);

		expect(firstMatch(error)).toBe('RATE_LIMIT_ERROR');
		await expect(run('RATE_LIMIT_ERROR', error)).resolves.toEqual({
			maxRetries: 3,
			headersRetryAfterMs: 3000,
		});
	});

	it('retries a 429 that carried no Retry-After', async () => {
		const error = apiError(429, 'Too Many Requests', 'GET');

		const result = await run('RATE_LIMIT_ERROR', error);
		expect(result.maxRetries).toBe(3);
		expect(result.headersRetryAfterMs).toBeUndefined();
	});

	it('never retries a rejected key, which arrives as a 400', async () => {
		for (const message of ['Invalid API Key', 'Invalid api key or token']) {
			const error = apiError(400, message);

			expect(firstMatch(error)).toBe('AUTH_ERROR');
			await expect(run('AUTH_ERROR', error)).resolves.toEqual({
				maxRetries: 0,
				headersRetryAfterMs: undefined,
			});
		}
	});

	it('does not retry another 400 such as a malformed body', async () => {
		const error = apiError(400, 'template_id is required');

		expect(firstMatch(error)).toBe('VALIDATION_ERROR');
		await expect(run('VALIDATION_ERROR', error)).resolves.toMatchObject({
			maxRetries: 0,
		});
	});

	it('does not retry a Zod rejection', async () => {
		const error = new Error('invalid input');
		error.name = 'ZodError';

		expect(firstMatch(error)).toBe('VALIDATION_ERROR');
	});

	it('does not retry an unknown route', async () => {
		expect(firstMatch(apiError(404, 'Not Found', 'GET'))).toBe(
			'NOT_FOUND_ERROR',
		);
	});

	it('replays a read that failed with a 5xx', async () => {
		const error = apiError(503, 'Service Unavailable', 'GET');

		expect(firstMatch(error)).toBe('SERVER_ERROR');
		await expect(run('SERVER_ERROR', error)).resolves.toMatchObject({
			maxRetries: 2,
		});
	});

	it('never replays a write that failed with a 5xx', async () => {
		// A create that timed out at the gateway may still bill a credit.
		const error = apiError(503, 'Service Unavailable', 'POST');

		expect(firstMatch(error)).toBe('DEFAULT');
		await expect(run('DEFAULT', error)).resolves.toMatchObject({
			maxRetries: 0,
		});
	});

	it('falls back to no retries for an unrecognised error', async () => {
		const error = new Error('socket hang up');

		expect(firstMatch(error)).toBe('DEFAULT');
	});
});

describe('mergeErrorHandlers', () => {
	const builtin: CorsairErrorHandler = {
		RATE_LIMIT_ERROR: errorHandlers.RATE_LIMIT_ERROR,
		DEFAULT: { match: () => true, handler: async () => ({ maxRetries: 0 }) },
	};

	it('returns the builtin map unchanged with no user handlers', () => {
		expect(mergeErrorHandlers(builtin, undefined)).toBe(builtin);
	});

	it('runs a caller handler for a status no builtin covers', () => {
		const merged = mergeErrorHandlers(builtin, {
			CUSTOM: { match: () => true, handler: async () => ({ maxRetries: 1 }) },
		});

		const matched = Object.entries(merged).find(([, entry]) =>
			entry?.match?.(new Error('x'), context),
		);
		// The caller's key comes first, so DEFAULT cannot claim the error.
		expect(matched?.[0]).toBe('CUSTOM');
		expect(Object.keys(merged).at(-1)).toBe('DEFAULT');
	});

	it('keeps the caller DEFAULT ahead of the builtin one', async () => {
		const merged = mergeErrorHandlers(builtin, {
			DEFAULT: { match: () => true, handler: async () => ({ maxRetries: 9 }) },
		});

		const result = await merged.DEFAULT?.handler?.(new Error('x'), context);
		expect(result?.maxRetries).toBe(9);
	});

	it('keeps a builtin the caller did not name', () => {
		const merged = mergeErrorHandlers(builtin, {
			CUSTOM: { match: () => false, handler: async () => ({ maxRetries: 0 }) },
		});

		expect(merged.RATE_LIMIT_ERROR).toBe(builtin.RATE_LIMIT_ERROR);
	});
});
