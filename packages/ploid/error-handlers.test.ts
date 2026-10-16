import { PloidAPIError } from './client';
import { errorHandlers } from './error-handlers';

function ploidError(
	status: number | undefined,
	code: string | undefined,
	retryAfterMs?: number,
	message = 'request failed',
): PloidAPIError {
	const error = new PloidAPIError(message, { code });
	Object.assign(error, { status, retryAfter: retryAfterMs });
	return error;
}

function classify(error: Error): string {
	if (errorHandlers.VALIDATION_ERROR.match(error)) return 'VALIDATION_ERROR';
	if (errorHandlers.AUTH_ERROR.match(error)) return 'AUTH_ERROR';
	if (errorHandlers.PAYMENT_ERROR.match(error)) return 'PAYMENT_ERROR';
	if (errorHandlers.RATE_LIMIT_ERROR.match(error)) return 'RATE_LIMIT_ERROR';
	if (errorHandlers.NOT_FOUND_ERROR.match(error)) return 'NOT_FOUND_ERROR';
	if (errorHandlers.CONFLICT_ERROR.match(error)) return 'CONFLICT_ERROR';
	if (errorHandlers.SERVER_ERROR.match(error)) return 'SERVER_ERROR';
	if (errorHandlers.TIMEOUT_ERROR.match(error)) return 'TIMEOUT_ERROR';
	if (errorHandlers.DEFAULT.match()) return 'DEFAULT';
	return 'UNMATCHED';
}

describe('Ploid error handlers', () => {
	it('declares handlers in the load-bearing first-match order', () => {
		// Dispatch walks Object.keys: a budget denial must meet PAYMENT_ERROR
		// before the 429 reaches RATE_LIMIT_ERROR, and DEFAULT must sit last.
		expect(Object.keys(errorHandlers)).toEqual([
			'VALIDATION_ERROR',
			'AUTH_ERROR',
			'PAYMENT_ERROR',
			'RATE_LIMIT_ERROR',
			'NOT_FOUND_ERROR',
			'CONFLICT_ERROR',
			'SERVER_ERROR',
			'TIMEOUT_ERROR',
			'DEFAULT',
		]);
	});

	it('classifies by status', () => {
		expect(classify(ploidError(422, undefined))).toBe('VALIDATION_ERROR');
		expect(classify(ploidError(401, undefined))).toBe('AUTH_ERROR');
		expect(classify(ploidError(402, undefined))).toBe('PAYMENT_ERROR');
		expect(classify(ploidError(429, undefined))).toBe('RATE_LIMIT_ERROR');
		expect(classify(ploidError(404, undefined))).toBe('NOT_FOUND_ERROR');
		expect(classify(ploidError(410, undefined))).toBe('NOT_FOUND_ERROR');
		expect(classify(ploidError(409, undefined))).toBe('CONFLICT_ERROR');
		expect(classify(ploidError(500, undefined))).toBe('SERVER_ERROR');
		expect(classify(ploidError(503, undefined))).toBe('SERVER_ERROR');
		expect(classify(new Error('request timed out'))).toBe('TIMEOUT_ERROR');
		expect(classify(new Error('nope'))).toBe('DEFAULT');
	});

	it('classifies by provider code when the status is missing', () => {
		expect(classify(ploidError(undefined, 'rate_limited'))).toBe(
			'RATE_LIMIT_ERROR',
		);
		expect(classify(ploidError(undefined, 'insufficient_acu'))).toBe(
			'PAYMENT_ERROR',
		);
		expect(classify(ploidError(undefined, 'daily_budget_exceeded'))).toBe(
			'PAYMENT_ERROR',
		);
		expect(classify(ploidError(undefined, 'invalid_api_key'))).toBe(
			'AUTH_ERROR',
		);
		expect(classify(ploidError(undefined, 'revoked_api_key'))).toBe(
			'AUTH_ERROR',
		);
	});

	it('puts a zod failure in VALIDATION_ERROR before any status matcher', () => {
		const zodError = new Error('query or filters required');
		zodError.name = 'ZodError';
		expect(classify(zodError)).toBe('VALIDATION_ERROR');
	});

	it('keeps a budget denial terminal even when it arrives as a 429', () => {
		expect(classify(ploidError(429, 'daily_budget_exceeded'))).toBe(
			'PAYMENT_ERROR',
		);
	});

	it('retries 429 with Retry-After and 5xx with backoff, nothing else', async () => {
		const rateLimit = await errorHandlers.RATE_LIMIT_ERROR.handler(
			ploidError(429, 'rate_limited', 2500),
		);
		const server = await errorHandlers.SERVER_ERROR.handler(
			ploidError(503, undefined),
		);
		const validation = await errorHandlers.VALIDATION_ERROR.handler(
			ploidError(422, undefined),
		);
		const payment = await errorHandlers.PAYMENT_ERROR.handler(
			ploidError(402, 'insufficient_acu'),
		);
		const timeout = await errorHandlers.TIMEOUT_ERROR.handler(
			new Error('request timed out'),
		);

		// 4 attempts total (1 initial + 3 retries); 3 attempts for 5xx.
		expect(rateLimit?.maxRetries).toBe(3);
		expect(rateLimit?.retryStrategy).toBe('exponential_backoff');
		expect(server).toEqual({
			maxRetries: 2,
			retryStrategy: 'exponential_backoff',
		});
		expect(validation).toEqual({ maxRetries: 0 });
		expect(payment).toEqual({ maxRetries: 0 });
		expect(timeout).toEqual({ maxRetries: 0 });
	});

	it('adds jitter on top of Retry-After, never below it', async () => {
		const waits: number[] = [];
		for (let i = 0; i < 20; i += 1) {
			const result = await errorHandlers.RATE_LIMIT_ERROR.handler(
				ploidError(429, 'rate_limited', 2500),
			);
			waits.push(result?.headersRetryAfterMs ?? -1);
		}

		// The framework applies headersRetryAfterMs verbatim, so the jitter
		// lives here: at least the required wait, at most 500 ms on top.
		for (const wait of waits) {
			expect(wait).toBeGreaterThanOrEqual(2500);
			expect(wait).toBeLessThanOrEqual(3000);
		}
		// Deterministic waits would all be identical.
		expect(new Set(waits).size).toBeGreaterThan(1);
	});

	it('caps a hostile Retry-After at one minute', async () => {
		const result = await errorHandlers.RATE_LIMIT_ERROR.handler(
			ploidError(429, 'rate_limited', 3_600_000),
		);
		const wait = result?.headersRetryAfterMs ?? -1;
		expect(wait).toBeGreaterThanOrEqual(60_000);
		expect(wait).toBeLessThanOrEqual(60_500);
	});
});
