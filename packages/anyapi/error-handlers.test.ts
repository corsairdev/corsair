import { ZodError } from 'zod';
import { AnyApiAPIError } from './client';
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

function apiError(
	status: number,
	extra: Record<string, unknown> = {},
	retryAfter?: number,
) {
	return new AnyApiAPIError(`AnyAPI ${status}: failed`, {
		status,
		retryAfter,
		body: { error: 'failed', ...extra },
	});
}

const charged = {
	payment: { rail: 'wallet', settlementState: 'indeterminate', costUsd: 0.01 },
};

describe('AnyAPI error handlers', () => {
	it.each([400, 404, 422])('does not retry a %i', async (status) => {
		const error = apiError(status);
		expect(classify(error)).toBe('VALIDATION_ERROR');
		expect(await strategy(error)).toEqual({ maxRetries: 0 });
	});

	it('does not retry an input that failed zod validation', async () => {
		const error = new ZodError([]);
		expect(classify(error)).toBe('VALIDATION_ERROR');
		expect(await strategy(error)).toEqual({ maxRetries: 0 });
	});

	it.each([
		[401, 'AUTH_ERROR'],
		[402, 'INSUFFICIENT_FUNDS_ERROR'],
		[403, 'PERMISSION_ERROR'],
	])('does not retry a %i', async (status, name) => {
		const error = apiError(status);
		expect(classify(error)).toBe(name);
		expect(await strategy(error)).toEqual({ maxRetries: 0 });
	});

	it('never retries a failure that may have been charged', async () => {
		for (const status of [429, 500, 502]) {
			const error = apiError(status, charged);
			expect(classify(error)).toBe('CHARGED_ERROR');
			expect(await strategy(error)).toEqual({ maxRetries: 0 });
		}
	});

	it('waits out a 409 idempotency_in_progress', async () => {
		const error = apiError(409, { code: 'idempotency_in_progress' }, 2000);
		expect(classify(error)).toBe('IDEMPOTENCY_ERROR');
		expect(await strategy(error)).toEqual({
			maxRetries: 3,
			headersRetryAfterMs: 2000,
			retryStrategy: 'exponential_backoff',
		});
	});

	it('does not retry a 409 idempotency_conflict', async () => {
		const error = apiError(409, { code: 'idempotency_conflict' });
		expect(classify(error)).toBe('IDEMPOTENCY_ERROR');
		expect(await strategy(error)).toEqual({ maxRetries: 0 });
	});

	it('retries an uncharged 429 after Retry-After', async () => {
		const error = apiError(429, {}, 1000);
		expect(classify(error)).toBe('RATE_LIMIT_ERROR');
		expect(await strategy(error)).toEqual({
			maxRetries: 3,
			headersRetryAfterMs: 1000,
			retryStrategy: 'exponential_backoff',
		});
	});

	it('retries an uncharged 502 twice', async () => {
		const error = apiError(502);
		expect(classify(error)).toBe('SERVER_ERROR');
		expect(await strategy(error)).toEqual({
			maxRetries: 2,
			retryStrategy: 'exponential_backoff',
		});
	});

	it('does not replay a 504 or a client timeout', async () => {
		expect(classify(apiError(504))).toBe('TIMEOUT_ERROR');
		const timeout = new Error('The operation timed out');
		timeout.name = 'TimeoutError';
		const error = new AnyApiAPIError(timeout.message, { cause: timeout });
		expect(classify(error)).toBe('TIMEOUT_ERROR');
		expect(await strategy(error)).toEqual({ maxRetries: 0 });
	});

	it('falls back to DEFAULT for anything else', async () => {
		const error = new Error('something unexpected');
		expect(classify(error)).toBe('DEFAULT');
		expect(await strategy(error)).toEqual({ maxRetries: 0 });
	});
});
