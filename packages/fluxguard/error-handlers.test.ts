import { FluxguardAPIError } from './client';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';

function apiError(status: number, method = 'GET'): FluxguardAPIError {
	return new FluxguardAPIError(`Fluxguard ${status}: test`, { status, method });
}

/** What a handler may return; the map is a Partial, so every field is optional. */
type RetryDecision = {
	maxRetries?: number;
	headersRetryAfterMs?: number;
	retryStrategy?:
		| 'exponential_backoff'
		| 'linear_1s'
		| 'linear_2s'
		| 'linear_3s'
		| 'linear_4s'
		| 'exponential_backoff_jitter';
};

async function resolve(
	error: Error,
): Promise<{ name: string; result: RetryDecision }> {
	for (const [name, handler] of Object.entries(errorHandlers)) {
		if (handler.match(error)) {
			const result = (await handler.handler?.(error)) ?? {};
			return { name, result };
		}
	}
	throw new Error('no handler matched');
}

describe('Fluxguard error handlers', () => {
	it('retries a 429 with the documented backoff', async () => {
		const { name, result } = await resolve(apiError(429));
		expect(name).toBe('RATE_LIMIT_ERROR');
		expect(result).toEqual({
			maxRetries: 3,
			headersRetryAfterMs: undefined,
			retryStrategy: 'exponential_backoff',
		});
	});

	it('uses the Retry-After value when Fluxguard sends one', async () => {
		const error = new FluxguardAPIError('too many', {
			status: 429,
			retryAfter: 12_000,
		});
		const { result } = await resolve(error);
		expect(result?.headersRetryAfterMs).toBe(12_000);
	});

	it('never retries a 403, which covers a bad key and a missing route', async () => {
		const { name, result } = await resolve(apiError(403));
		expect(name).toBe('PERMISSION_ERROR');
		expect(result?.maxRetries).toBe(0);
	});

	it('never retries a 400 invalid body', async () => {
		const { name, result } = await resolve(apiError(400));
		expect(name).toBe('VALIDATION_ERROR');
		expect(result?.maxRetries).toBe(0);
	});

	it('never retries a 404 unknown page or site', async () => {
		const { result } = await resolve(apiError(404, 'DELETE'));
		expect(result?.maxRetries).toBe(0);
	});

	it('replays a 5xx read, which cannot have changed anything', async () => {
		const { name, result } = await resolve(apiError(500, 'GET'));
		expect(name).toBe('SERVER_ERROR');
		expect(result).toEqual({
			maxRetries: 2,
			retryStrategy: 'exponential_backoff',
		});
	});

	it('does not replay a 5xx write, which may have landed', async () => {
		const { name, result } = await resolve(apiError(502, 'POST'));
		expect(name).toBe('DEFAULT');
		expect(result?.maxRetries).toBe(0);
	});

	it('does not replay a 5xx delete', async () => {
		const { name } = await resolve(apiError(503, 'DELETE'));
		expect(name).toBe('DEFAULT');
	});

	it('matches a ZodError from input validation without calling the API', async () => {
		const error = new Error('invalid');
		error.name = 'ZodError';
		const { name, result } = await resolve(error);
		expect(name).toBe('VALIDATION_ERROR');
		expect(result?.maxRetries).toBe(0);
	});

	it('falls back to DEFAULT for an error with no status', async () => {
		const { name, result } = await resolve(new Error('socket hang up'));
		expect(name).toBe('DEFAULT');
		expect(result?.maxRetries).toBe(0);
	});

	describe('mergeErrorHandlers', () => {
		it('returns the builtin map when the caller gives none', () => {
			expect(mergeErrorHandlers(errorHandlers, undefined)).toBe(errorHandlers);
		});

		it('keeps DEFAULT last', () => {
			const merged = mergeErrorHandlers(errorHandlers, {
				QUOTA_ERROR: { match: () => false, handler: async () => ({}) },
			});
			expect(Object.keys(merged).at(-1)).toBe('DEFAULT');
		});

		it('puts a caller handler first so it beats DEFAULT', () => {
			const merged = mergeErrorHandlers(errorHandlers, {
				MY_ERROR: { match: () => false, handler: async () => ({}) },
			});
			const keys = Object.keys(merged);
			expect(keys.indexOf('MY_ERROR')).toBeLessThan(keys.indexOf('DEFAULT'));
			expect(keys.indexOf('MY_ERROR')).toBe(0);
		});

		it('lets a caller override a builtin status handler', () => {
			const override = {
				match: () => true,
				handler: async () => ({ maxRetries: 9 }),
			};
			const merged = mergeErrorHandlers(errorHandlers, {
				PERMISSION_ERROR: override,
			});
			expect(merged.PERMISSION_ERROR).toBe(override);
			expect(Object.keys(merged)).toContain('RATE_LIMIT_ERROR');
		});

		it('uses the caller DEFAULT over the builtin one', () => {
			const userDefault = {
				match: () => true,
				handler: async () => ({ maxRetries: 7 }),
			};
			const merged = mergeErrorHandlers(errorHandlers, {
				DEFAULT: userDefault,
			});
			expect(merged.DEFAULT).toBe(userDefault);
		});
	});
});
