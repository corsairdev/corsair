import { LushaAPIError } from './client';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';

function handler(name: keyof typeof errorHandlers) {
	return errorHandlers[name];
}

/** Builds an error the way client.ts does for an HTTP status. */
function httpError(
	message: string,
	options: { status?: number; method?: string; retryAfter?: number; safeToReplay?: boolean },
): LushaAPIError {
	return new LushaAPIError(message, options);
}

describe('Lusha error handler matching', () => {
	it('matches 402 to the fatal credit handler, not to a retry', () => {
		const error = httpError(
			'Lusha 402: Insufficient credits for this operation',
			{ status: 402, method: 'POST' },
		);
		expect(handler('INSUFFICIENT_BALANCE_ERROR').match(error)).toBe(true);
		expect(handler('RATE_LIMIT_ERROR').match(error)).toBe(false);
		expect(handler('SERVER_ERROR').match(error)).toBe(false);
	});

	it('matches the out-of-credits message even on another status', () => {
		const error = httpError(
			'Lusha 429: Insufficient credits for this operation',
			{ status: 429 },
		);
		expect(handler('INSUFFICIENT_BALANCE_ERROR').match(error)).toBe(true);
	});

	it('matches 429 to the rate-limit handler and reads its Retry-After', async () => {
		const error = httpError('Lusha 429: Too many requests', {
			status: 429,
			retryAfter: 5000,
		});
		expect(handler('RATE_LIMIT_ERROR').match(error)).toBe(true);
		const plan = await handler('RATE_LIMIT_ERROR').handler(error);
		expect(plan).toMatchObject({ maxRetries: 3, headersRetryAfterMs: 5000 });
	});

	it('falls back to the exponential strategy with no Retry-After header', async () => {
		// Lusha documents no Retry-After for 429; the strategy's own delays
		// (1s, 2s, 4s) are the fallback.
		const error = httpError('Lusha 429: Too many requests', { status: 429 });
		const plan = await handler('RATE_LIMIT_ERROR').handler(error);
		expect(plan).toMatchObject({
			maxRetries: 3,
			headersRetryAfterMs: undefined,
			retryStrategy: 'exponential_backoff',
		});
	});

	it('matches 401 to auth and 403 to permission, separately', () => {
		const unauthorized = httpError('Lusha 401: Missing API key', { status: 401 });
		const forbidden = httpError('Lusha 403: Forbidden', { status: 403 });
		expect(handler('AUTH_ERROR').match(unauthorized)).toBe(true);
		expect(handler('PERMISSION_ERROR').match(unauthorized)).toBe(false);
		expect(handler('PERMISSION_ERROR').match(forbidden)).toBe(true);
		expect(handler('AUTH_ERROR').match(forbidden)).toBe(false);
		for (const error of [unauthorized, forbidden]) {
			expect(handler('VALIDATION_ERROR').match(error)).toBe(false);
		}
	});

	it('matches 400, 404, 409 and 451 to validation, which never retries', () => {
		for (const status of [400, 404, 409, 451]) {
			expect(
				handler('VALIDATION_ERROR').match(
					httpError(`Lusha ${status}`, { status }),
				),
			).toBe(true);
		}
		expect(handler('VALIDATION_ERROR').match(new SyntaxError('bad json'))).toBe(false);
	});

	it('matches a ZodError to validation', () => {
		const zodError = new Error('output parse failed');
		zodError.name = 'ZodError';
		expect(handler('VALIDATION_ERROR').match(zodError)).toBe(true);
	});

	it('retries a 503 on a free read (the job store case)', async () => {
		const error = httpError('Lusha 503: Job store unavailable', {
			status: 503,
			method: 'GET',
			safeToReplay: true,
		});
		expect(handler('SERVER_ERROR').match(error)).toBe(true);
		const plan = await handler('SERVER_ERROR').handler(error);
		expect(plan).toMatchObject({
			maxRetries: 2,
			retryStrategy: 'exponential_backoff',
		});
	});

	it('never retries a 503 that a metered call produced', () => {
		const error = httpError('Lusha 503: Unavailable', {
			status: 503,
			method: 'POST',
			safeToReplay: false,
		});
		expect(handler('SERVER_ERROR').match(error)).toBe(false);
		// Nothing else but DEFAULT claims it, and DEFAULT never retries.
		expect(handler('DEFAULT').match(error)).toBe(true);
	});

	it('retries a transport failure once, since it never reached Lusha', async () => {
		const error = httpError('fetch failed', { safeToReplay: true });
		expect(handler('TRANSPORT_ERROR').match(error)).toBe(true);
		expect(handler('SERVER_ERROR').match(error)).toBe(false);
		const plan = await handler('TRANSPORT_ERROR').handler(error);
		expect(plan).toMatchObject({ maxRetries: 1 });
	});

	it('sends a 408 to the timeout handler and honours replay safety', async () => {
		const safe = httpError('Lusha 408: timeout', { status: 408, safeToReplay: true });
		const metered = httpError('Lusha 408: timeout', { status: 408, safeToReplay: false });
		expect(handler('TIMEOUT_ERROR').match(safe)).toBe(true);
		const safePlan = await handler('TIMEOUT_ERROR').handler(safe);
		const meteredPlan = await handler('TIMEOUT_ERROR').handler(metered);
		expect(safePlan).toMatchObject({ maxRetries: 1 });
		expect(meteredPlan).toMatchObject({ maxRetries: 0 });
	});
});

describe('mergeErrorHandlers', () => {
	const builtin = errorHandlers;

	it('keeps DEFAULT last and builtins intact when the caller adds a handler', () => {
		const merged = mergeErrorHandlers(builtin, {
			CUSTOM_451: {
				match: (error: Error) => error.message.includes('451'),
				handler: async () => ({ maxRetries: 0 }),
			},
		});
		const keys = Object.keys(merged);
		expect(keys[keys.length - 1]).toBe('DEFAULT');
		// The caller key exists and the builtins survive.
		expect(keys).toContain('CUSTOM_451');
		expect(keys).toContain('INSUFFICIENT_BALANCE_ERROR');
		expect(keys).toContain('RATE_LIMIT_ERROR');
	});

	it('lets the caller override a builtin value by name', async () => {
		const merged = mergeErrorHandlers(builtin, {
			RATE_LIMIT_ERROR: {
				match: (error: Error) => error instanceof LushaAPIError && error.isRateLimit,
				handler: async () => ({ maxRetries: 1 }),
			},
		});
		expect(merged.RATE_LIMIT_ERROR).toBeDefined();
		const error = httpError('Lusha 429', { status: 429 });
		// The caller's plan wins: one retry, not three.
		const plan = await merged.RATE_LIMIT_ERROR!.handler(error, {
			pluginId: 'lusha',
			operation: 'test',
			input: {},
			originalError: error,
		});
		expect(plan).toMatchObject({ maxRetries: 1 });
	});

	it('returns the builtins untouched when no caller handlers exist', () => {
		expect(mergeErrorHandlers(builtin, undefined)).toBe(builtin);
	});

	it('prefers the caller DEFAULT over the builtin DEFAULT', () => {
		const merged = mergeErrorHandlers(builtin, {
			DEFAULT: { match: () => true, handler: async () => ({ maxRetries: 9 }) },
		});
		const keys = Object.keys(merged);
		expect(keys[keys.length - 1]).toBe('DEFAULT');
	});
});
