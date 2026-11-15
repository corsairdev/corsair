import { ZodError } from 'zod';
import { TikHubAPIError } from './client';
import { errorHandlers } from './error-handlers';

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

function apiError(status: number, retryAfter?: number) {
	return new TikHubAPIError(`TikHub ${status}: failed`, {
		status,
		retryAfter,
		body: { detail: { code: status, message: 'failed' } },
	});
}

describe('TikHub error handlers', () => {
	it('does not retry a 401', async () => {
		const error = apiError(401);
		expect(classify(error)).toBe('AUTH_ERROR');
		expect(await strategy(error)).toEqual({ maxRetries: 0 });
	});

	it('does not retry a 402 insufficient balance', async () => {
		const error = apiError(402);
		expect(classify(error)).toBe('INSUFFICIENT_BALANCE_ERROR');
		expect(await strategy(error)).toEqual({ maxRetries: 0 });
	});

	it('treats an insufficient-balance message as 402 even without the status', () => {
		const error = new TikHubAPIError(
			'Insufficient balance, this endpoint requires payment and does not accept free credits.',
		);
		expect(classify(error)).toBe('INSUFFICIENT_BALANCE_ERROR');
	});

	it('keeps the status-based retry when a 429 mentions insufficient balance', async () => {
		const error = new TikHubAPIError('TikHub 429: insufficient balance', {
			status: 429,
			retryAfter: 2000,
		});
		expect(classify(error)).toBe('RATE_LIMIT_ERROR');
		expect(await strategy(error)).toMatchObject({ maxRetries: 3 });
	});

	it('classifies a failure code from a 200 envelope by that code', () => {
		const error = new TikHubAPIError('TikHub 402: Insufficient balance', {
			body: { code: 402, message: 'Insufficient balance' },
		});
		expect(error.status).toBeUndefined();
		expect(classify(error)).toBe('INSUFFICIENT_BALANCE_ERROR');
	});

	it('retries a 429 after Retry-After', async () => {
		const error = apiError(429, 3000);
		expect(classify(error)).toBe('RATE_LIMIT_ERROR');
		expect(await strategy(error)).toEqual({
			maxRetries: 3,
			headersRetryAfterMs: 3000,
			retryStrategy: 'exponential_backoff',
		});
	});

	it('backs off exponentially on a 429 without Retry-After', async () => {
		expect(await strategy(apiError(429))).toEqual({
			maxRetries: 3,
			headersRetryAfterMs: undefined,
			retryStrategy: 'exponential_backoff',
		});
	});

	it('does not retry a 403 or 404', async () => {
		expect(classify(apiError(403))).toBe('PERMISSION_ERROR');
		expect(classify(apiError(404))).toBe('NOT_FOUND_ERROR');
		expect(await strategy(apiError(403))).toEqual({ maxRetries: 0 });
		expect(await strategy(apiError(404))).toEqual({ maxRetries: 0 });
	});

	it('does not retry a 422 or a local ZodError', async () => {
		expect(classify(apiError(422))).toBe('VALIDATION_ERROR');
		const zodError = new ZodError([]);
		expect(classify(zodError)).toBe('VALIDATION_ERROR');
		expect(await strategy(zodError)).toEqual({ maxRetries: 0 });
	});

	it('retries a 400 because TikHub uses it for unbilled upstream failures', async () => {
		const error = apiError(400);
		expect(classify(error)).toBe('UPSTREAM_ERROR');
		expect(await strategy(error)).toEqual({
			maxRetries: 2,
			retryStrategy: 'exponential_backoff',
		});
	});

	it('retries 5xx responses', async () => {
		for (const status of [500, 502, 503]) {
			expect(classify(apiError(status))).toBe('SERVER_ERROR');
		}
		expect(await strategy(apiError(503))).toEqual({
			maxRetries: 2,
			retryStrategy: 'exponential_backoff',
		});
	});

	it('does not replay a client-side timeout', async () => {
		const timeout = new Error('The operation was aborted due to timeout');
		timeout.name = 'TimeoutError';
		const error = new TikHubAPIError(timeout.message, { cause: timeout });
		expect(classify(error)).toBe('TIMEOUT_ERROR');
		expect(await strategy(error)).toEqual({ maxRetries: 0 });
	});

	it('falls back to DEFAULT for unrelated errors', async () => {
		const error = new Error('boom');
		expect(classify(error)).toBe('DEFAULT');
		expect(await strategy(error)).toEqual({ maxRetries: 0 });
	});

	it('keeps DEFAULT as the last handler', () => {
		expect(Object.keys(errorHandlers).at(-1)).toBe('DEFAULT');
	});
});
