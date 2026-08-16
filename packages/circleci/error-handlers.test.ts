/**
 * Error classification across both error types this plugin can throw:
 * `CircleCIAPIError` (REST, any of the three REST bases) and
 * `CircleCIGraphQLError` (a 200 carrying `errors[]`).
 */
import { CircleCIAPIError, CircleCIGraphQLError } from './client';
import { errorHandlers } from './error-handlers';

function classify(error: Error): string {
	for (const [name, handler] of Object.entries(errorHandlers)) {
		if (handler.match(error)) return name;
	}
	return 'UNMATCHED';
}

describe('CircleCI error handlers', () => {
	describe('rate limiting', () => {
		it('classifies a 429 CircleCIAPIError', () => {
			expect(classify(new CircleCIAPIError('rate limited', 429))).toBe(
				'RATE_LIMIT_ERROR',
			);
		});

		it('retries', async () => {
			const result = await errorHandlers.RATE_LIMIT_ERROR.handler(
				new CircleCIAPIError('rate limited', 429),
			);
			expect(result.maxRetries).toBeGreaterThan(0);
		});

		it('honours the server-sent Retry-After instead of a blind backoff', async () => {
			const result = await errorHandlers.RATE_LIMIT_ERROR.handler(
				new CircleCIAPIError('rate limited', 429, undefined, 45_000),
			);
			expect(result.headersRetryAfterMs).toBe(45_000);
		});

		it('leaves headersRetryAfterMs undefined when CircleCI sent no Retry-After', async () => {
			const result = await errorHandlers.RATE_LIMIT_ERROR.handler(
				new CircleCIAPIError('rate limited', 429),
			);
			expect(result.headersRetryAfterMs).toBeUndefined();
		});

		it('leaves headersRetryAfterMs undefined for a non-CircleCIAPIError rate-limit signal', async () => {
			const result = await errorHandlers.RATE_LIMIT_ERROR.handler(
				new Error('429 too many requests'),
			);
			expect(result.headersRetryAfterMs).toBeUndefined();
		});
	});

	describe('authentication', () => {
		it('classifies a 401', () => {
			expect(classify(new CircleCIAPIError('unauthorized', 401))).toBe(
				'AUTH_ERROR',
			);
		});

		it('never retries', async () => {
			const result = await errorHandlers.AUTH_ERROR.handler();
			expect(result.maxRetries).toBe(0);
		});
	});

	describe('permission / not-accessible', () => {
		it('classifies a 403 CircleCIAPIError', () => {
			expect(classify(new CircleCIAPIError('Forbidden', 403))).toBe(
				'PERMISSION_ERROR',
			);
		});

		it('classifies a GraphQL "Permission denied" the same way', () => {
			const error = new CircleCIGraphQLError('Permission denied', [
				{ message: 'Permission denied' },
			]);
			expect(classify(error)).toBe('PERMISSION_ERROR');
		});

		it('never retries - confirmed live this covers "does not exist" as well as "no access"', async () => {
			const result = await errorHandlers.PERMISSION_ERROR.handler();
			expect(result.maxRetries).toBe(0);
		});
	});

	describe('not found', () => {
		it('classifies a 404 CircleCIAPIError', () => {
			expect(classify(new CircleCIAPIError('Not Found', 404))).toBe(
				'NOT_FOUND_ERROR',
			);
		});
	});

	describe('other GraphQL failures', () => {
		it('classifies a GraphQL error that is not a permission failure', () => {
			const error = new CircleCIGraphQLError('bad input', [
				{
					message:
						"For argument 'input', no value provided for non-nullable key",
				},
			]);
			expect(classify(error)).toBe('GRAPHQL_ERROR');
		});

		it('never retries a GraphQL validation failure', async () => {
			const result = await errorHandlers.GRAPHQL_ERROR.handler();
			expect(result.maxRetries).toBe(0);
		});
	});

	describe('classification order', () => {
		it('a 403 GraphQL error matches PERMISSION_ERROR before falling through to GRAPHQL_ERROR', () => {
			const error = new CircleCIGraphQLError('Permission denied', [
				{ message: 'Permission denied' },
			]);
			// PERMISSION_ERROR is declared before GRAPHQL_ERROR in the handler
			// object - this pins that ordering rather than assuming it.
			expect(classify(error)).toBe('PERMISSION_ERROR');
			expect(classify(error)).not.toBe('GRAPHQL_ERROR');
		});
	});

	describe('everything else', () => {
		it('falls through to DEFAULT without retrying', async () => {
			expect(classify(new CircleCIAPIError('teapot', 418))).toBe('DEFAULT');
			const result = await errorHandlers.DEFAULT.handler();
			expect(result.maxRetries).toBe(0);
		});

		it('does not misclassify an ordinary error as rate-limited or GraphQL', () => {
			expect(classify(new Error('something unrelated'))).toBe('DEFAULT');
		});
	});

	describe('a CircleCIAPIError is classified by status alone, never by scanning its message', () => {
		// `ApiError`'s message embeds the response body verbatim for any status
		// this plugin does not explicitly map, so a genuine unrelated failure
		// (500, in every case here) whose body happens to mention a job number,
		// org id, or any digit string containing a trigger word must not be
		// reclassified as rate-limiting, an auth failure, or a not-found. Each
		// case below plants exactly that collision.
		const collisions: [string, string][] = [
			['a job number that reads as a rate-limit trigger', 'job 429 failed'],
			['a job number that reads as an auth trigger', 'job 401 failed'],
			[
				'a body that mentions "not found" for an unrelated reason',
				'Generic Error: status: 500; status text: Internal Server Error; body: {"message":"upstream dependency not found in registry"}',
			],
		];

		for (const [label, message] of collisions) {
			it(`does not misclassify: ${label}`, () => {
				const error = new CircleCIAPIError(message, 500);
				const result = classify(error);
				expect(result).not.toBe('RATE_LIMIT_ERROR');
				expect(result).not.toBe('AUTH_ERROR');
				expect(result).not.toBe('NOT_FOUND_ERROR');
				expect(result).toBe('DEFAULT');
			});
		}

		it('a bare Error (no status to check instead) still falls back to its message - the one case the fallback exists for', () => {
			expect(classify(new Error('429 too many requests'))).toBe(
				'RATE_LIMIT_ERROR',
			);
			expect(classify(new Error('401 unauthorized'))).toBe('AUTH_ERROR');
			expect(classify(new Error('resource not found'))).toBe('NOT_FOUND_ERROR');
		});
	});
});
