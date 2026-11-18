import { ReamazeAPIError } from './client';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';

function handler(name: keyof typeof errorHandlers) {
	return errorHandlers[name];
}

describe('Re:amaze error handler matching', () => {
	it('matches a 429 and keeps Retry-After', async () => {
		const error = new ReamazeAPIError('Too Many Requests', {
			status: 429,
			retryAfter: 5000,
		});

		expect(handler('RATE_LIMIT_ERROR').match(error)).toBe(true);
		expect(await handler('RATE_LIMIT_ERROR').handler(error)).toEqual({
			maxRetries: 3,
			headersRetryAfterMs: 5000,
			retryStrategy: 'exponential_backoff',
		});
	});

	it('sends no Retry-After value when the API did not', async () => {
		const error = new ReamazeAPIError('Too Many Requests', { status: 429 });
		const strategy = await handler('RATE_LIMIT_ERROR').handler(error);

		expect(strategy).toMatchObject({ maxRetries: 3 });
		// Assert absence, not "not equal to 5000": `not.toHaveProperty(key, value)`
		// still passes when the key exists with any other value. Spread into a
		// record because the declared strategy type omits the optional field.
		expect(
			(strategy as Record<string, unknown>).headersRetryAfterMs,
		).toBeUndefined();
	});

	it('never retries a 401 or 403', async () => {
		for (const status of [401, 403]) {
			const error = new ReamazeAPIError('nope', { status });
			expect(handler('AUTH_ERROR').match(error)).toBe(true);
			expect(await handler('AUTH_ERROR').handler(error)).toEqual({
				maxRetries: 0,
			});
		}
	});

	it('never retries a 404', async () => {
		const error = new ReamazeAPIError('Not Found', { status: 404 });
		expect(handler('NOT_FOUND_ERROR').match(error)).toBe(true);
		expect(await handler('NOT_FOUND_ERROR').handler(error)).toEqual({
			maxRetries: 0,
		});
	});

	it('never retries a 422, which repeats on the same body', async () => {
		const error = new ReamazeAPIError("Re:amaze 422: name can't be blank", {
			status: 422,
		});

		expect(handler('VALIDATION_ERROR').match(error)).toBe(true);
		expect(await handler('VALIDATION_ERROR').handler(error)).toEqual({
			maxRetries: 0,
		});
	});

	it('matches a ZodError as validation', () => {
		const zod = Object.assign(new Error('invalid input'), { name: 'ZodError' });
		expect(handler('VALIDATION_ERROR').match(zod)).toBe(true);
	});

	it('replays a 5xx read', async () => {
		const error = new ReamazeAPIError('gateway', {
			status: 502,
			method: 'GET',
		});

		expect(handler('SERVER_ERROR').match(error)).toBe(true);
		expect(await handler('SERVER_ERROR').handler(error)).toEqual({
			maxRetries: 2,
			retryStrategy: 'exponential_backoff',
		});
	});

	it('never replays a 5xx write, which may have committed', () => {
		// A create that timed out could have created the record already, so a
		// replay would duplicate it.
		for (const method of ['POST', 'PUT', 'DELETE']) {
			const error = new ReamazeAPIError('gateway', { status: 502, method });
			expect(handler('SERVER_ERROR').match(error)).toBe(false);
		}
	});

	it('keeps DEFAULT last after a caller adds a handler', () => {
		const merged = mergeErrorHandlers(errorHandlers, {
			QUOTA_ERROR: {
				match: () => false,
				handler: async () => ({ maxRetries: 0 }),
			},
		});
		const names = Object.keys(merged);

		expect(names.at(-1)).toBe('DEFAULT');
		expect(names.indexOf('QUOTA_ERROR')).toBeLessThan(names.indexOf('DEFAULT'));
		expect(names).toContain('RATE_LIMIT_ERROR');
	});

	it('lets a caller handler keep its key and its fallback win', async () => {
		const custom = {
			QUOTA_ERROR: {
				match: () => true,
				handler: async () => ({ maxRetries: 7 }),
			},
			DEFAULT: {
				match: () => true,
				handler: async () => ({ maxRetries: 9 }),
			},
		};
		const merged = mergeErrorHandlers(errorHandlers, custom);

		expect(Object.keys(merged).at(-1)).toBe('DEFAULT');
		expect(await merged.DEFAULT?.handler(new Error('x'), {} as never)).toEqual({
			maxRetries: 9,
		});
		expect(
			await merged.QUOTA_ERROR?.handler(new Error('x'), {} as never),
		).toEqual({ maxRetries: 7 });
	});

	it('returns the builtin handlers when no caller handlers are given', () => {
		expect(mergeErrorHandlers(errorHandlers, undefined)).toBe(errorHandlers);
	});
});

describe('Re:amaze error classification', () => {
	it('classifies the three live error bodies', async () => {
		const { describeReamazeError } = await import('./client');

		// Unknown resource.
		expect(
			describeReamazeError(404, { errors: 'Not Found' }, 'fallback'),
		).toEqual({
			message: 'Re:amaze 404: Not Found',
			code: undefined,
			details: ['Not Found'],
		});

		// Unknown route.
		expect(
			describeReamazeError(404, { status: 404, error: 'Not Found' }, 'fallback')
				.message,
		).toBe('Re:amaze 404: Not Found');

		// Validation, where each field maps to its messages.
		const validation = describeReamazeError(
			422,
			{
				errors: {
					'logins.email': ["can't be blank"],
					name: ["can't be blank"],
				},
			},
			'fallback',
		);
		expect(validation.message).toBe(
			"Re:amaze 422: logins.email can't be blank",
		);
		expect(validation.details).toEqual([
			"logins.email can't be blank",
			"name can't be blank",
		]);
	});

	it('falls back when the body is not a recognised shape', async () => {
		const { describeReamazeError } = await import('./client');

		expect(
			describeReamazeError(404, '<html>Not Found</html>', 'gateway'),
		).toEqual({
			message: 'Re:amaze 404: gateway',
			code: undefined,
			details: [],
		});
	});

	it('treats 401 and 403 as auth errors', () => {
		expect(new ReamazeAPIError('x', { status: 401 }).isAuthError).toBe(true);
		expect(new ReamazeAPIError('x', { status: 403 }).isAuthError).toBe(true);
		expect(new ReamazeAPIError('x', { status: 404 }).isAuthError).toBe(false);
	});

	it('classifies 404, 429 and 422', () => {
		expect(new ReamazeAPIError('x', { status: 404 }).isNotFound).toBe(true);
		expect(new ReamazeAPIError('x', { status: 429 }).isRateLimit).toBe(true);
		expect(new ReamazeAPIError('x', { status: 422 }).isUnprocessable).toBe(
			true,
		);
		expect(new ReamazeAPIError('x', { status: 500 }).isNotFound).toBe(false);
	});
});
