import { ApiError } from 'corsair/http';
import { ZodError } from 'zod';
import type { LinklyRequestFacts } from './client';
import { rememberRequestFacts } from './client';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';
import { linklyError, rateLimited, validationError } from './test-fixtures';

type HandlerName = keyof typeof errorHandlers;

// The handler context core passes; no handler here reads it.
function context() {
	return {
		pluginId: 'linkly',
		operation: 'test',
		input: {},
		originalError: new Error('test'),
	};
}

// Mirrors corsair core: the first handler whose match() passes, in key order.
function classify(error: Error): HandlerName {
	const name = (Object.keys(errorHandlers) as HandlerName[]).find((key) =>
		errorHandlers[key].match(error),
	);
	if (!name) throw new Error('DEFAULT should always match');
	return name;
}

async function strategy(error: Error) {
	// Every builtin handler decides from the match alone, so none reads the error.
	return errorHandlers[classify(error)].handler();
}

function apiError(
	status: number,
	body: unknown = {}, // unknown: each case passes one of Linkly's error bodies
	facts: Partial<LinklyRequestFacts> = {},
) {
	const method = facts.method ?? 'GET';
	const error = new ApiError(
		{ method, url: '/api/v1/test' },
		{
			url: 'https://api.linklyhq.com/api/v1/test',
			ok: false,
			status,
			statusText: 'x',
			body,
		},
		`Linkly ${status}: failed`,
	);
	rememberRequestFacts(error, {
		method,
		replaySafe: facts.replaySafe ?? method === 'GET',
	});
	return error;
}

function transportError(error: Error, facts: LinklyRequestFacts) {
	rememberRequestFacts(error, facts);
	return error;
}

describe('Linkly error handlers', () => {
	it('leaves a 429 to core, which already retried it three times', async () => {
		const error = apiError(429, rateLimited);
		expect(classify(error)).toBe('RATE_LIMIT_ERROR');
		expect(await strategy(error)).toEqual({ maxRetries: 0 });
	});

	it('treats a gateway 429 with no Linkly body the same way', async () => {
		const error = apiError(429);
		expect(classify(error)).toBe('RATE_LIMIT_ERROR');
		expect(await strategy(error)).toEqual({ maxRetries: 0 });
	});

	it('does not retry a 401, which is a bad or revoked key', async () => {
		const error = apiError(401, linklyError('Not authorized', 'unauthorized'));
		expect(classify(error)).toBe('AUTH_ERROR');
		expect(await strategy(error)).toEqual({ maxRetries: 0 });
	});

	it('does not retry a 403, which is a plan or permission gap', async () => {
		const error = apiError(403, linklyError('Upgrade needed', 'forbidden'));
		expect(classify(error)).toBe('PERMISSION_ERROR');
		expect(await strategy(error)).toEqual({ maxRetries: 0 });
	});

	it('does not retry a 404, which is a missing link or workspace', async () => {
		const error = apiError(404, linklyError('Link not found', 'not_found'));
		expect(classify(error)).toBe('NOT_FOUND_ERROR');
		expect(await strategy(error)).toEqual({ maxRetries: 0 });
	});

	it('classifies a 400 validation body with no code', async () => {
		const error = apiError(400, validationError);
		expect(classify(error)).toBe('VALIDATION_ERROR');
		expect(await strategy(error)).toEqual({ maxRetries: 0 });
	});

	it('does not retry an input that failed zod validation', async () => {
		const error = new ZodError([]);
		expect(classify(error)).toBe('VALIDATION_ERROR');
		expect(await strategy(error)).toEqual({ maxRetries: 0 });
	});

	it.each([500, 502, 503])('retries a read that got a %i', async (status) => {
		const error = apiError(status, {}, { method: 'GET', replaySafe: true });
		expect(classify(error)).toBe('SERVER_ERROR');
		expect(await strategy(error)).toEqual({
			maxRetries: 2,
			retryStrategy: 'exponential_backoff',
		});
	});

	it('retries a 5xx on the idempotent writes: upsert, delete and restore', async () => {
		for (const method of ['POST', 'DELETE'] as const) {
			const error = apiError(500, {}, { method, replaySafe: true });
			expect(classify(error)).toBe('SERVER_ERROR');
		}
	});

	it('does not replay links.create or webhooks.subscribe on a 5xx', async () => {
		const error = apiError(500, {}, { method: 'POST', replaySafe: false });
		expect(classify(error)).toBe('DEFAULT');
		expect(await strategy(error)).toEqual({ maxRetries: 0 });
	});

	it('retries a dropped connection on a read', async () => {
		const error = transportError(new TypeError('fetch failed'), {
			method: 'GET',
			replaySafe: true,
		});
		expect(classify(error)).toBe('SERVER_ERROR');
		expect(await strategy(error)).toEqual({
			maxRetries: 2,
			retryStrategy: 'exponential_backoff',
		});
	});

	it('does not replay a write that timed out', async () => {
		const timeout = new Error('The operation timed out');
		timeout.name = 'TimeoutError';
		const error = transportError(timeout, {
			method: 'POST',
			replaySafe: false,
		});
		expect(classify(error)).toBe('DEFAULT');
		expect(await strategy(error)).toEqual({ maxRetries: 0 });
	});

	it('does not let a rate-limit body code on a 500 skip the replay check', async () => {
		// CodeRabbit thread on error-handlers.ts:25: a non-429 must fall through
		// to SERVER_ERROR, which refuses to replay links.create.
		const error = apiError(500, rateLimited, {
			method: 'POST',
			replaySafe: false,
		});
		expect(classify(error)).toBe('DEFAULT');
		expect(await strategy(error)).toEqual({ maxRetries: 0 });
	});

	it('classifies a 422 as validation', async () => {
		const error = apiError(422, linklyError('Unprocessable', 'bad_request'));
		expect(classify(error)).toBe('VALIDATION_ERROR');
	});

	it('falls back to DEFAULT for anything else', async () => {
		const error = new Error('something unexpected');
		expect(classify(error)).toBe('DEFAULT');
		expect(await strategy(error)).toEqual({ maxRetries: 0 });
	});
});

describe('mergeErrorHandlers', () => {
	const builtin = errorHandlers;

	it('returns the builtin set untouched when the caller passes none', () => {
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

	it('puts caller keys first, so a caller handler is never shadowed', () => {
		const callerHandler = async () => ({ maxRetries: 7 });
		const merged = mergeErrorHandlers(builtin, {
			UPSTREAM_ERROR: {
				match: () => true,
				handler: callerHandler,
			},
		});
		// Core takes the first key whose match passes; UPSTREAM_ERROR matches
		// everything, so if a builtin key came first it would claim the error.
		expect(Object.keys(merged)[0]).toBe('UPSTREAM_ERROR');
		// Handler invocation needs both arguments; the type is a Partial.
		const invoked = merged.UPSTREAM_ERROR?.handler?.(new Error('x'), context());
		expect(invoked).resolves.toEqual({ maxRetries: 7 });
	});

	it('lets a caller override a builtin key by value', () => {
		const merged = mergeErrorHandlers(builtin, {
			RATE_LIMIT_ERROR: {
				match: () => true,
				handler: async () => ({ maxRetries: 1 }),
			},
		});
		expect(
			merged.RATE_LIMIT_ERROR?.handler(new Error('x'), context()),
		).resolves.toEqual({ maxRetries: 1 });
	});

	it('prefers a caller DEFAULT', () => {
		const callerDefault = {
			match: () => true,
			handler: async () => ({ maxRetries: 5 }),
		};
		const merged = mergeErrorHandlers(builtin, { DEFAULT: callerDefault });
		expect(merged.DEFAULT).toBe(callerDefault);
	});
});
