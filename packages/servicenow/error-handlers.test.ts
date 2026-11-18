import { ServicenowAPIError } from './client';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';

function handler(name: keyof typeof errorHandlers) {
	return errorHandlers[name];
}

describe('ServiceNow error handler matching', () => {
	it('matches a 429 and keeps Retry-After', async () => {
		const error = new ServicenowAPIError('Too Many Requests', {
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

	it('never retries a 401 or 403', async () => {
		for (const status of [401, 403]) {
			const error = new ServicenowAPIError('nope', { status });
			expect(handler('AUTH_ERROR').match(error)).toBe(true);
			expect(await handler('AUTH_ERROR').handler(error)).toEqual({
				maxRetries: 0,
			});
		}
	});

	it('never retries a 404, which is usually a missing table', async () => {
		const error = new ServicenowAPIError('No Record found', { status: 404 });
		expect(handler('NOT_FOUND_ERROR').match(error)).toBe(true);
		expect(await handler('NOT_FOUND_ERROR').handler(error)).toEqual({
			maxRetries: 0,
		});
	});

	it('matches a 400, a 405 and a ZodError as validation', () => {
		const zod = Object.assign(new Error('invalid input'), { name: 'ZodError' });

		expect(
			handler('VALIDATION_ERROR').match(
				new ServicenowAPIError('x', { status: 400 }),
			),
		).toBe(true);
		expect(
			handler('VALIDATION_ERROR').match(
				new ServicenowAPIError('x', { status: 405 }),
			),
		).toBe(true);
		expect(handler('VALIDATION_ERROR').match(zod)).toBe(true);
	});

	it('replays a 5xx read', async () => {
		const error = new ServicenowAPIError('gateway', {
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
		for (const method of ['POST', 'PATCH', 'DELETE']) {
			const error = new ServicenowAPIError('gateway', { status: 502, method });
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
});
