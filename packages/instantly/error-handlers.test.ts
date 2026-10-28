import type { CorsairErrorHandler, ErrorContext } from 'corsair/core';
import { ZodError } from 'zod';
import { InstantlyAPIError } from './client';
import { createErrorHandlers, mergeErrorHandlers } from './error-handlers';

const READS = new Set(['leads.list', 'emails.list', 'accounts.list']);
const handlers = createErrorHandlers((operation) => READS.has(operation));

function context(operation: string): ErrorContext {
	return {
		pluginId: 'instantly',
		operation,
		input: {},
		originalError: new Error('x'),
	};
}

// Mirrors corsair core: the first handler whose match() passes, in key order.
function classify(error: Error, operation: string): string {
	const ctx = context(operation);
	const name = Object.keys(handlers).find((key) =>
		handlers[key]?.match(error, ctx),
	);
	if (!name) throw new Error('DEFAULT should always match');
	return name;
}

async function strategy(error: Error, operation: string) {
	const name = classify(error, operation);
	const entry = handlers[name];
	if (!entry) throw new Error(`no handler ${name}`);
	return entry.handler(error, context(operation));
}

function apiError(status: number, retryAfter?: number) {
	return new InstantlyAPIError(`Instantly ${status}: failed`, {
		status,
		retryAfter,
		body: { statusCode: status, error: 'x', message: 'failed' },
	});
}

function timeoutError() {
	const cause = new Error('The operation was aborted due to timeout');
	cause.name = 'TimeoutError';
	return new InstantlyAPIError(cause.message, { cause });
}

function networkError() {
	return new InstantlyAPIError('fetch failed', {
		cause: new TypeError('fetch failed'),
	});
}

describe('Instantly error handlers', () => {
	it.each([
		[400, 'VALIDATION_ERROR'],
		[401, 'AUTH_ERROR'],
		[402, 'PLAN_ERROR'],
		[403, 'PERMISSION_ERROR'],
		[404, 'NOT_FOUND_ERROR'],
	])('never retries a %i, even on a read', async (status, name) => {
		const error = apiError(status);
		expect(classify(error, 'leads.list')).toBe(name);
		expect(await strategy(error, 'leads.list')).toEqual({ maxRetries: 0 });
	});

	it('does not retry input that failed zod validation', async () => {
		const error = new ZodError([]);
		expect(classify(error, 'leads.addBulk')).toBe('VALIDATION_ERROR');
		expect(await strategy(error, 'leads.addBulk')).toEqual({ maxRetries: 0 });
	});

	it('retries a rate-limited read after Retry-After', async () => {
		expect(await strategy(apiError(429, 5000), 'leads.list')).toEqual({
			maxRetries: 3,
			headersRetryAfterMs: 5000,
			retryStrategy: 'exponential_backoff_jitter',
		});
	});

	it('spaces emails.list retries 3 seconds apart when Retry-After is missing', async () => {
		expect(await strategy(apiError(429), 'emails.list')).toEqual({
			maxRetries: 3,
			headersRetryAfterMs: 3000,
		});
	});

	it.each([
		'emails.reply',
		'leads.addBulk',
		'leads.create',
		'campaigns.activate',
	])('never retries %s, whatever failed', async (operation) => {
		for (const error of [
			apiError(429, 1000),
			apiError(500),
			apiError(502),
			apiError(504),
			timeoutError(),
			networkError(),
		]) {
			expect(await strategy(error, operation)).toEqual({ maxRetries: 0 });
		}
	});

	it('retries a read on 5xx, timeouts and network failures', async () => {
		expect(classify(apiError(503), 'accounts.list')).toBe('SERVER_ERROR');
		expect(await strategy(apiError(503), 'accounts.list')).toEqual({
			maxRetries: 2,
			retryStrategy: 'exponential_backoff',
		});

		expect(classify(timeoutError(), 'accounts.list')).toBe('TIMEOUT_ERROR');
		expect(await strategy(timeoutError(), 'accounts.list')).toEqual({
			maxRetries: 1,
			retryStrategy: 'linear_2s',
		});

		expect(classify(networkError(), 'accounts.list')).toBe('NETWORK_ERROR');
		expect(await strategy(networkError(), 'accounts.list')).toEqual({
			maxRetries: 2,
			retryStrategy: 'exponential_backoff',
		});
	});

	it('falls through to DEFAULT for anything else', async () => {
		const error = new Error('something odd');
		expect(classify(error, 'leads.list')).toBe('DEFAULT');
		expect(await strategy(error, 'leads.list')).toEqual({ maxRetries: 0 });
	});
});

describe('mergeErrorHandlers', () => {
	const never = {
		match: () => false,
		handler: async () => ({ maxRetries: 0 }),
	};

	it('keeps DEFAULT last when the caller adds handlers', () => {
		const merged = mergeErrorHandlers(handlers, { QUOTA_ERROR: never });
		const names = Object.keys(merged);
		expect(names.at(-1)).toBe('DEFAULT');
		expect(names).toContain('QUOTA_ERROR');
		expect(names).toContain('RATE_LIMIT_ERROR');
	});

	it("uses the caller's DEFAULT and overrides", () => {
		const custom: CorsairErrorHandler = {
			RATE_LIMIT_ERROR: never,
			DEFAULT: never,
		};
		const merged = mergeErrorHandlers(handlers, custom);
		expect(merged.RATE_LIMIT_ERROR).toBe(never);
		expect(merged.DEFAULT).toBe(never);
		expect(mergeErrorHandlers(handlers, undefined)).toBe(handlers);
	});
});
