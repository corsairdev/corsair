import type { ErrorContext } from 'corsair/core';
import { ZodError } from 'zod';
import { DubAPIError } from './client';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';

type HandlerName = keyof typeof errorHandlers;

const context: ErrorContext = {
	pluginId: 'dub',
	operation: 'links.list',
	input: {},
	originalError: new Error('original'),
};

// Mirrors corsair core: the first handler whose match() passes, in key order.
function classify(error: Error): HandlerName {
	const name = (Object.keys(errorHandlers) as HandlerName[]).find((key) =>
		errorHandlers[key]?.match(error, context),
	);
	if (!name) throw new Error('DEFAULT should always match');
	return name;
}

async function strategy(error: Error) {
	return errorHandlers[classify(error)]?.handler(error, context);
}

function apiError(
	status: number,
	bodyCode?: string,
	options: { retryAfter?: number; method?: string; idempotent?: boolean } = {},
) {
	return new DubAPIError(`Dub ${status}: failed`, {
		status,
		code: bodyCode,
		...options,
	});
}

describe('Dub error handlers', () => {
	it('retries a 429 with backoff', async () => {
		const error = apiError(429);
		expect(classify(error)).toBe('RATE_LIMIT_ERROR');
		expect(await strategy(error)).toEqual({
			maxRetries: 3,
			headersRetryAfterMs: undefined,
			retryStrategy: 'exponential_backoff',
		});
	});

	it('retries a body-code rate limit that arrives on another status', async () => {
		const error = apiError(503, 'rate_limit_exceeded');
		expect(classify(error)).toBe('RATE_LIMIT_ERROR');
	});

	it('honours Retry-After when Dub sends one', async () => {
		const error = apiError(429, 'rate_limit_exceeded', { retryAfter: 30_000 });
		expect(await strategy(error)).toEqual({
			maxRetries: 3,
			headersRetryAfterMs: 30_000,
			retryStrategy: 'exponential_backoff',
		});
	});

	it.each([401])('does not retry a %i', async (status) => {
		const error = apiError(status);
		expect(classify(error)).toBe('AUTH_ERROR');
		expect(await strategy(error)).toEqual({ maxRetries: 0 });
	});

	it('does not retry a 403 permission error', async () => {
		const error = apiError(403, 'forbidden');
		expect(classify(error)).toBe('PERMISSION_ERROR');
		expect(await strategy(error)).toEqual({ maxRetries: 0 });
	});

	it('does not retry a 409 conflict, which a retry cannot resolve', async () => {
		const error = apiError(409, 'conflict');
		expect(classify(error)).toBe('CONFLICT_ERROR');
		expect(await strategy(error)).toEqual({ maxRetries: 0 });
	});

	it.each([400, 404, 410, 422])('does not retry a %i', async (status) => {
		const error = apiError(status);
		expect(classify(error)).toBe('VALIDATION_ERROR');
		expect(await strategy(error)).toEqual({ maxRetries: 0 });
	});

	it('does not retry an input that failed zod validation', async () => {
		const error = new ZodError([]);
		expect(classify(error)).toBe('VALIDATION_ERROR');
		expect(await strategy(error)).toEqual({ maxRetries: 0 });
	});

	it.each([500, 502, 503])('replays a read that got a %i', async (status) => {
		const error = apiError(status, undefined, {
			method: 'GET',
			idempotent: true,
		});
		expect(classify(error)).toBe('SERVER_ERROR');
		expect(await strategy(error)).toEqual({
			maxRetries: 2,
			retryStrategy: 'exponential_backoff',
		});
	});

	it.each(['POST', 'PATCH', 'DELETE'])(
		'does not replay a failed %s write, which Dub cannot deduplicate',
		async (method) => {
			const error = apiError(500, undefined, { method, idempotent: false });
			expect(classify(error)).toBe('DEFAULT');
			expect(await strategy(error)).toEqual({ maxRetries: 0 });
		},
	);

	it('replays links.upsert, the one idempotent write', async () => {
		const error = apiError(500, undefined, {
			method: 'PUT',
			idempotent: true,
		});
		expect(classify(error)).toBe('SERVER_ERROR');
	});

	it('does not replay a timed-out write', async () => {
		const timeout = new Error('The operation timed out');
		timeout.name = 'TimeoutError';
		const error = new DubAPIError(timeout.message, {
			cause: timeout,
			method: 'POST',
			idempotent: false,
		});
		expect(classify(error)).toBe('DEFAULT');
		expect(await strategy(error)).toEqual({ maxRetries: 0 });
	});

	it('matches the error envelope codes as well as statuses', () => {
		// A handler only sees DubAPIError fields, so a code without a status
		// (transport-free paths in tests) must still sort correctly.
		expect(classify(new DubAPIError('x', { code: 'unauthorized' }))).toBe(
			'AUTH_ERROR',
		);
		expect(
			classify(new DubAPIError('x', { code: 'unprocessable_entity' })),
		).toBe('VALIDATION_ERROR');
	});

	it('falls back to DEFAULT for anything else', async () => {
		const error = new Error('something unexpected');
		expect(classify(error)).toBe('DEFAULT');
		expect(await strategy(error)).toEqual({ maxRetries: 0 });
	});
});

describe('mergeErrorHandlers', () => {
	const builtin = errorHandlers;

	it('returns the builtins untouched without a caller map', () => {
		expect(mergeErrorHandlers(builtin, undefined)).toBe(builtin);
	});

	it('keeps DEFAULT last after a merge', () => {
		const merged = mergeErrorHandlers(builtin, {
			QUOTA_ERROR: {
				match: () => false,
				handler: async () => ({ maxRetries: 0 }),
			},
		});
		const names = Object.keys(merged);
		expect(names.at(-1)).toBe('DEFAULT');
		expect(names).toContain('QUOTA_ERROR');
		expect(names).toContain('RATE_LIMIT_ERROR');
	});

	it('lets a caller override a builtin key and keeps the rest', async () => {
		const merged = mergeErrorHandlers(builtin, {
			RATE_LIMIT_ERROR: {
				match: (error: Error) => error instanceof DubAPIError,
				handler: async () => ({ maxRetries: 9 }),
			},
		});
		expect(merged.RATE_LIMIT_ERROR?.handler).not.toBe(
			builtin.RATE_LIMIT_ERROR?.handler,
		);
		const decision = await merged.RATE_LIMIT_ERROR?.handler(
			new DubAPIError('x', { status: 429 }),
			context,
		);
		expect(decision).toEqual({ maxRetries: 9 });
		expect(Object.keys(merged).at(-1)).toBe('DEFAULT');
	});

	it('prefers a caller DEFAULT over the builtin', () => {
		const userDefault = {
			match: () => true,
			handler: async () => ({ maxRetries: 7 }),
		};
		const merged = mergeErrorHandlers(builtin, { DEFAULT: userDefault });
		expect(merged.DEFAULT).toBe(userDefault);
	});

	it('resolves a caller handler for a status no builtin covers', () => {
		// The trap this merge fixes: builtin-first ordering resolved a custom
		// handler to DEFAULT because core takes the first match in key order.
		const merged = mergeErrorHandlers(builtin, {
			OVERLOADED_ERROR: {
				match: (error: Error) =>
					error instanceof DubAPIError && error.status === 529,
				handler: async () => ({ maxRetries: 1 }),
			},
		});
		const error = new DubAPIError('overloaded', { status: 529 });
		let ran: string | undefined;
		for (const [name, entry] of Object.entries(merged)) {
			if (entry?.match(error, context)) {
				ran = name;
				break;
			}
		}
		expect(ran).toBe('OVERLOADED_ERROR');
	});

	it('keeps envelope-driven matches working through real bodies', () => {
		const error = new DubAPIError('Dub 401', {
			status: 401,
			code: 'unauthorized',
		});
		expect(errorHandlers.AUTH_ERROR?.match(error, context)).toBe(true);
		expect(errorHandlers.RATE_LIMIT_ERROR?.match(error, context)).toBe(false);
	});
});
