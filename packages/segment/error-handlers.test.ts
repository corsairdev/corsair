import { ZodError } from 'zod';
import { SegmentAPIError } from './client';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';
import { forbiddenBody, rateLimitedBody, unauthorizedBody } from './test-fixtures';

type HandlerName = keyof typeof errorHandlers;

// Mirrors corsair core: the first handler whose match() passes, in key order.
function classify(error: Error): HandlerName {
	const name = (Object.keys(errorHandlers) as HandlerName[]).find((key) =>
		errorHandlers[key].match(error),
	);
	if (!name) throw new Error('DEFAULT should always match');
	return name;
}

async function strategy(error: Error) {
	return errorHandlers[classify(error)].handler(error);
}

function apiError(
	status: number,
	options: { retryAfter?: number; method?: string; message?: string } = {},
) {
	return new SegmentAPIError(
		options.message ?? `Segment ${status}: failed`,
		{ status, ...options },
	);
}

describe('Segment error handlers', () => {
	it('retries a 429 with backoff', async () => {
		const error = apiError(429, { method: 'GET' });
		expect(classify(error)).toBe('RATE_LIMIT_ERROR');
		expect(await strategy(error)).toEqual({
			maxRetries: 3,
			headersRetryAfterMs: undefined,
			retryStrategy: 'exponential_backoff',
		});
	});

	it('honours a Retry-After header on a 429', async () => {
		const error = apiError(429, { retryAfter: 60_000 });
		expect(await strategy(error)).toEqual({
			maxRetries: 3,
			headersRetryAfterMs: 60_000,
			retryStrategy: 'exponential_backoff',
		});
	});

	it('honours a body msBeforeNext fallback on a 429', async () => {
		const error = new SegmentAPIError('Segment 429: Rate limit exceeded', {
			status: 429,
			retryAfter: 2500,
		});
		expect(await strategy(error)).toEqual({
			maxRetries: 3,
			headersRetryAfterMs: 2500,
			retryStrategy: 'exponential_backoff',
		});
	});

	// Segment checks auth before routing: the 403 body is identical for every
	// path, so it is always a token problem, never a missing resource.
	it('does not retry a 403 bad token', async () => {
		const error = apiError(403, {
			message: 'Segment 403: Not authorized to perform this operation',
		});
		expect(classify(error)).toBe('AUTH_ERROR');
		expect(await strategy(error)).toEqual({ maxRetries: 0 });
	});

	it('does not retry a 401 missing header', async () => {
		const error = apiError(401, {
			message: 'Segment 401: Authorization header is required',
		});
		expect(classify(error)).toBe('AUTH_ERROR');
		expect(await strategy(error)).toEqual({ maxRetries: 0 });
	});

	it('classifies the real error bodies, not just statuses', () => {
		const forbidden = new SegmentAPIError(
			'Segment 403: Not authorized to perform this operation',
			{ status: 403 },
		);
		const unauthorized = new SegmentAPIError(
			'Segment 401: Authorization header is required',
			{ status: 401 },
		);
		expect(classify(forbidden)).toBe('AUTH_ERROR');
		expect(classify(unauthorized)).toBe('AUTH_ERROR');
		expect(forbiddenBody.errors[0]?.type).toBe('forbidden');
		expect(unauthorizedBody.errors[0]?.type).toBe('unauthorized');
	});

	it.each([400, 404])('does not retry a %i', async (status) => {
		const error = apiError(status);
		expect(classify(error)).toBe('VALIDATION_ERROR');
		expect(await strategy(error)).toEqual({ maxRetries: 0 });
	});

	it('does not retry an input that failed zod validation', async () => {
		const error = new ZodError([]);
		expect(classify(error)).toBe('VALIDATION_ERROR');
		expect(await strategy(error)).toEqual({ maxRetries: 0 });
	});

	it('does not retry a 422 validation failure', async () => {
		const error = apiError(422, { method: 'POST' });
		expect(classify(error)).toBe('DEFAULT');
		expect(await strategy(error)).toEqual({ maxRetries: 0 });
	});

	it.each([500, 502, 503])('retries a read that got a %i', async (status) => {
		const error = apiError(status, { method: 'GET' });
		expect(classify(error)).toBe('SERVER_ERROR');
		expect(await strategy(error)).toEqual({
			maxRetries: 2,
			retryStrategy: 'exponential_backoff',
		});
	});

	it.each(['POST', 'PUT', 'PATCH', 'DELETE'])(
		'does not replay a failed %s on a 5xx',
		async (method) => {
			const error = apiError(500, { method });
			expect(classify(error)).toBe('DEFAULT');
			expect(await strategy(error)).toEqual({ maxRetries: 0 });
		},
	);

	it('does not replay a write that timed out', async () => {
		const timeout = new DOMException('The operation timed out', 'TimeoutError');
		const error = new SegmentAPIError(timeout.message, { method: 'POST' });
		expect(classify(error)).toBe('DEFAULT');
		expect(await strategy(error)).toEqual({ maxRetries: 0 });
	});

	it('falls back to DEFAULT for anything else', async () => {
		const error = new Error('something unexpected');
		expect(classify(error)).toBe('DEFAULT');
		expect(await strategy(error)).toEqual({ maxRetries: 0 });
	});
});

describe('mergeErrorHandlers', () => {
	const builtin = {
		QUOTA: {
			match: () => false,
			handler: async () => ({ maxRetries: 0 }),
		},
		RATE_LIMIT_ERROR: {
			match: () => true,
			handler: async () => ({ maxRetries: 3 }),
		},
		DEFAULT: {
			match: () => true,
			handler: async () => ({ maxRetries: 9 }),
		},
	};

	it('returns the builtin map untouched when the caller passes none', () => {
		expect(mergeErrorHandlers(builtin, undefined)).toBe(builtin);
	});

	it('lets a caller handler for a status no builtin covers run before DEFAULT', () => {
		const merged = mergeErrorHandlers(builtin, {
			UPSTREAM_ERROR: {
				match: () => true,
				handler: async () => ({ maxRetries: 1 }),
			},
		});
		const names = Object.keys(merged);
		expect(names.at(-1)).toBe('DEFAULT');
		expect(names.indexOf('UPSTREAM_ERROR')).toBeGreaterThan(
			names.indexOf('RATE_LIMIT_ERROR'),
		);
	});

	it('keeps a caller override ahead of the builtin of the same name', async () => {
		const merged = mergeErrorHandlers(builtin, {
			RATE_LIMIT_ERROR: {
				match: () => true,
				handler: async () => ({ maxRetries: 7 }),
			},
		});
		const error = new Error('any');
		// core takes the first matching key, so the caller's value must win.
		expect(await merged.RATE_LIMIT_ERROR?.handler(error, {} as never)).toEqual({
			maxRetries: 7,
		});
	});

	it('uses the caller DEFAULT when both define one', async () => {
		const merged = mergeErrorHandlers(builtin, {
			DEFAULT: {
				match: () => true,
				handler: async () => ({ maxRetries: 5 }),
			},
		});
		expect(await merged.DEFAULT?.handler(new Error('x'), {} as never)).toEqual({
			maxRetries: 5,
		});
	});

	it('keeps the builtin DEFAULT when the caller defines none', () => {
		const merged = mergeErrorHandlers(builtin, {
			UPSTREAM_ERROR: {
				match: () => true,
				handler: async () => ({ maxRetries: 1 }),
			},
		});
		expect(Object.keys(merged).at(-1)).toBe('DEFAULT');
	});
});

describe('the documented 429 bodies', () => {
	it('matches rateLimitedBody fields used by the client', () => {
		expect(rateLimitedBody.errors[0]?.type).toBe('RateLimited');
		expect(rateLimitedBody.data.msBeforeNext).toBe(2500);
	});
});
