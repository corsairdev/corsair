import type { CorsairErrorHandler } from 'corsair/core';
import { LoopsAPIError } from './client';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';

function handler<K extends keyof typeof errorHandlers>(name: K) {
	return errorHandlers[name];
}

function loopsError(
	message: string,
	options: ConstructorParameters<typeof LoopsAPIError>[1] = {},
): LoopsAPIError {
	return new LoopsAPIError(message, options);
}

describe('Loops error handler matching', () => {
	it('retries a 429 three times with the exponential strategy', async () => {
		const error = loopsError('Loops 429: Rate limit exceeded', {
			status: 429,
			method: 'GET',
		});

		expect(handler('RATE_LIMIT_ERROR').match(error)).toBe(true);
		const result = await handler('RATE_LIMIT_ERROR').handler(error);
		expect(result).toEqual({
			maxRetries: 3,
			headersRetryAfterMs: undefined,
			retryStrategy: 'exponential_backoff',
		});
	});

	it('keeps a Retry-After header value when Loops ever sends one', async () => {
		const error = loopsError('Loops 429: Rate limit exceeded', {
			status: 429,
			retryAfter: 4000,
		});

		const result = await handler('RATE_LIMIT_ERROR').handler(error);
		expect(result?.headersRetryAfterMs).toBe(4000);
	});

	it('sends a disabled-feature 401 to FEATURE_NOT_ENABLED, not to AUTH_ERROR', async () => {
		const error = loopsError(
			'Loops 401: Invalid API key or content API not enabled for this team',
			{ status: 401, featureNotEnabled: true },
		);

		expect(handler('FEATURE_NOT_ENABLED').match(error)).toBe(true);
		expect(handler('AUTH_ERROR').match(error)).toBe(true);
		expect(handler('RATE_LIMIT_ERROR').match(error)).toBe(false);
		const result = await handler('FEATURE_NOT_ENABLED').handler();
		expect(result?.maxRetries).toBe(0);
	});

	it('never retries a plain 401', async () => {
		const error = loopsError('Loops 401: Invalid API key', { status: 401 });

		expect(handler('AUTH_ERROR').match(error)).toBe(true);
		expect(handler('FEATURE_NOT_ENABLED').match(error)).toBe(false);
		const result = await handler('AUTH_ERROR').handler();
		expect(result?.maxRetries).toBe(0);
	});

	it('never retries a 409 duplicate contact or reused idempotency key', async () => {
		const error = loopsError('Loops 409: Email already exists', {
			status: 409,
		});

		expect(handler('CONFLICT_ERROR').match(error)).toBe(true);
		const result = await handler('CONFLICT_ERROR').handler();
		expect(result?.maxRetries).toBe(0);
	});

	it('never retries validation, not-found or wrong-method errors', async () => {
		for (const status of [400, 404, 405]) {
			const error = loopsError(`Loops ${status}: bad request`, { status });
			expect(handler('VALIDATION_ERROR').match(error)).toBe(true);
			const result = await handler('VALIDATION_ERROR').handler();
			expect(result?.maxRetries).toBe(0);
		}
	});

	it('treats a 2xx success:false envelope as validation, not as a retriable failure', async () => {
		const error = loopsError('Loops: Email already exists', {
			envelopeFailure: true,
			method: 'POST',
		});

		expect(handler('VALIDATION_ERROR').match(error)).toBe(true);
	});

	it('replays a 5xx on a read but not on a plain write', async () => {
		const read = loopsError('Loops 500', { status: 500, method: 'GET' });
		const write = loopsError('Loops 500', { status: 500, method: 'POST' });

		expect(handler('SERVER_ERROR').match(read)).toBe(true);
		expect(handler('SERVER_ERROR').match(write)).toBe(false);
		const result = await handler('SERVER_ERROR').handler();
		expect(result?.maxRetries).toBe(2);
	});

	it('replays a 5xx on a write that carries an idempotency key', async () => {
		const error = loopsError('Loops 503', {
			status: 503,
			method: 'POST',
			hasIdempotency: true,
		});

		expect(handler('SERVER_ERROR').match(error)).toBe(true);
	});

	it('retries a dropped read as a transport failure and not a dropped write', async () => {
		const read = loopsError('fetch failed', {
			method: 'GET',
			transport: true,
		});
		const write = loopsError('fetch failed', {
			method: 'POST',
			transport: true,
		});

		expect(handler('TRANSPORT_ERROR').match(read)).toBe(true);
		expect(handler('TRANSPORT_ERROR').match(write)).toBe(false);
	});

	it('lets a foreign error fall through to DEFAULT', async () => {
		const error = new Error('something else');

		for (const name of Object.keys(errorHandlers) as Array<
			keyof typeof errorHandlers
		>) {
			if (name === 'DEFAULT') continue;
			expect(handler(name).match(error)).toBe(false);
		}
		expect(handler('DEFAULT').match()).toBe(true);
	});
});

describe('mergeErrorHandlers', () => {
	const builtin = {
		AUTH_ERROR: {
			match: () => false,
			handler: async () => ({ maxRetries: 0 }),
		},
		DEFAULT: {
			match: () => true,
			handler: async () => ({ maxRetries: 0 }),
		},
	} satisfies CorsairErrorHandler;

	it('puts the caller handlers first so core runs them before the builtins', () => {
		const callerCallOrder: string[] = [];
		const merged = mergeErrorHandlers(builtin, {
			QUOTA_ERROR: {
				match: () => true,
				handler: async () => {
					callerCallOrder.push('caller');
					return { maxRetries: 0 };
				},
			},
		});

		const keys = Object.keys(merged);
		expect(keys.indexOf('QUOTA_ERROR')).toBeLessThan(
			keys.indexOf('DEFAULT'),
		);
	});

	it('keeps DEFAULT last when the caller overrides it', () => {
		const merged = mergeErrorHandlers(builtin, {
			DEFAULT: { match: () => true, handler: async () => ({ maxRetries: 9 }) },
		});

		const keys = Object.keys(merged);
		expect(keys[keys.length - 1]).toBe('DEFAULT');
		expect(merged.DEFAULT).toBeDefined();
	});

	it('returns the builtins untouched when the caller adds nothing', () => {
		expect(mergeErrorHandlers(builtin, undefined)).toBe(builtin);
	});
});
