/**
 * Error classification for `DopplerAPIError`, and the fallback message-match
 * path for a bare `Error` that never reached one.
 */
import { DopplerAPIError } from './client';
import { errorHandlers } from './error-handlers';

function classify(error: Error): string {
	for (const [name, handler] of Object.entries(errorHandlers)) {
		if (handler.match(error)) return name;
	}
	return 'UNMATCHED';
}

describe('Doppler error handlers', () => {
	describe('rate limiting', () => {
		it('classifies a 429 DopplerAPIError', () => {
			expect(classify(new DopplerAPIError('rate limited', 429))).toBe(
				'RATE_LIMIT_ERROR',
			);
		});

		it('retries', async () => {
			const result = await errorHandlers.RATE_LIMIT_ERROR.handler(
				new DopplerAPIError('rate limited', 429),
			);
			expect(result.maxRetries).toBeGreaterThan(0);
		});

		it('honours the server-sent retry-after instead of a blind backoff', async () => {
			const result = await errorHandlers.RATE_LIMIT_ERROR.handler(
				new DopplerAPIError('rate limited', 429, 45_000),
			);
			expect(result.headersRetryAfterMs).toBe(45_000);
		});

		it('leaves headersRetryAfterMs undefined when Doppler sent no retry-after', async () => {
			const result = await errorHandlers.RATE_LIMIT_ERROR.handler(
				new DopplerAPIError('rate limited', 429),
			);
			expect(result.headersRetryAfterMs).toBeUndefined();
		});

		it('falls back to a message match for a bare Error', () => {
			expect(classify(new Error('429 too many requests'))).toBe(
				'RATE_LIMIT_ERROR',
			);
		});
	});

	describe('authentication', () => {
		it('classifies a 401', () => {
			expect(classify(new DopplerAPIError('Invalid Auth token', 401))).toBe(
				'AUTH_ERROR',
			);
		});

		it('never retries', async () => {
			const result = await errorHandlers.AUTH_ERROR.handler();
			expect(result.maxRetries).toBe(0);
		});
	});

	describe('permission / plan-gated', () => {
		it('classifies a 403 confirmed live on plan-gated routes (service accounts, groups, change requests)', () => {
			expect(
				classify(new DopplerAPIError('You do not have access to groups.', 403)),
			).toBe('PERMISSION_ERROR');
		});

		it('never retries - retrying cannot change the plan', async () => {
			const result = await errorHandlers.PERMISSION_ERROR.handler();
			expect(result.maxRetries).toBe(0);
		});
	});

	describe('not found', () => {
		it('classifies a 404', () => {
			expect(
				classify(
					new DopplerAPIError(
						"Could not find requested project 'nonexistent'",
						404,
					),
				),
			).toBe('NOT_FOUND_ERROR');
		});
	});

	/**
	 * A `DopplerAPIError` is classified by `.status` alone once it has one -
	 * never by scanning its message, even when the message happens to contain
	 * a trigger word for a different bucket. The message fallback exists only
	 * for a bare `Error` that never reached a `DopplerAPIError`.
	 */
	describe('status takes priority over message text', () => {
		it('a 500 whose body happens to mention "forbidden" is not misclassified as PERMISSION_ERROR', () => {
			expect(
				classify(
					new DopplerAPIError(
						'Internal error while checking if forbidden words are present',
						500,
					),
				),
			).not.toBe('PERMISSION_ERROR');
		});

		it('a 500 whose body happens to mention "not found" is not misclassified as NOT_FOUND_ERROR', () => {
			expect(
				classify(
					new DopplerAPIError(
						'The requested resource was not found in cache',
						500,
					),
				),
			).not.toBe('NOT_FOUND_ERROR');
		});
	});

	describe('default', () => {
		it('classifies anything unmatched as DEFAULT and never retries', async () => {
			expect(classify(new DopplerAPIError('boom', 500))).toBe('DEFAULT');
			const result = await errorHandlers.DEFAULT.handler();
			expect(result.maxRetries).toBe(0);
		});
	});
});
