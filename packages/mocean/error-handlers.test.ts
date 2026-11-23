import { ZodError } from 'zod';
import { MoceanAPIError } from './client';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';
import {
	authFailedBody,
	maintenanceBody,
	throttledBody,
	verifyAuthFailedBody,
} from './test-fixtures';

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

function bodyError(
	bodyStatus: number | undefined,
	family: 'sms' | 'verify' | 'query',
	// unknown: each case passes one of Mocean's error bodies.
	body: unknown = {},
	options: { status?: number; retryAfter?: number; replayable?: boolean } = {},
) {
	return new MoceanAPIError(`Mocean status ${bodyStatus}`, {
		bodyStatus,
		family,
		body,
		...options,
	});
}

describe('Mocean error handlers', () => {
	it('retries body-status throttling with backoff', async () => {
		const error = bodyError(32, 'sms', throttledBody, { replayable: true });
		expect(classify(error)).toBe('RATE_LIMIT_ERROR');
		expect(await strategy(error)).toEqual({
			maxRetries: 3,
			headersRetryAfterMs: undefined,
			retryStrategy: 'exponential_backoff',
		});
	});

	it('retries the verify family throttling code, which is 1 there', async () => {
		const error = bodyError(1, 'verify', {}, { replayable: true });
		expect(classify(error)).toBe('RATE_LIMIT_ERROR');
	});

	it('does not retry a body auth failure from either family', async () => {
		for (const error of [
			bodyError(1, 'sms', authFailedBody),
			bodyError(2, 'verify', verifyAuthFailedBody),
			bodyError(undefined, 'query', authFailedBody, { status: 401 }),
		]) {
			expect(classify(error)).toBe('AUTH_ERROR');
			expect(await strategy(error)).toEqual({ maxRetries: 0 });
		}
	});

	it('does not retry an insufficient balance from either family', async () => {
		for (const error of [bodyError(2, 'sms'), bodyError(18, 'verify')]) {
			expect(classify(error)).toBe('INSUFFICIENT_BALANCE_ERROR');
			expect(await strategy(error)).toEqual({ maxRetries: 0 });
		}
	});

	it.each([40, 45])('retries body status %i on any method', async (code) => {
		const error = bodyError(code, 'sms', maintenanceBody, {
			replayable: false,
		});
		expect(classify(error)).toBe('RETRYABLE_SERVER_SIDE');
		expect(await strategy(error)).toEqual({
			maxRetries: 2,
			retryStrategy: 'exponential_backoff',
		});
	});

	it.each([3, 21])('retries a verify system error %i', async (code) => {
		const error = bodyError(code, 'verify');
		expect(classify(error)).toBe('RETRYABLE_SERVER_SIDE');
	});

	it('does not retry an unknown body status', async () => {
		const error = bodyError(28, 'sms');
		expect(classify(error)).toBe('VALIDATION_ERROR');
		expect(await strategy(error)).toEqual({ maxRetries: 0 });
	});

	it('does not retry an input that failed zod validation', async () => {
		const error = new ZodError([]);
		expect(classify(error)).toBe('VALIDATION_ERROR');
		expect(await strategy(error)).toEqual({ maxRetries: 0 });
	});

	it.each([500, 502, 503])('retries a read that got a %i', async (status) => {
		const error = bodyError(0, 'query', {}, { status, replayable: true });
		expect(classify(error)).toBe('SERVER_ERROR');
		expect(await strategy(error)).toEqual({
			maxRetries: 2,
			retryStrategy: 'exponential_backoff',
		});
	});

	it.each(['POST'])('does not replay a failed %s on a 5xx', async (method) => {
		const error = new MoceanAPIError('boom', {
			status: 503,
			method,
			replayable: false,
		});
		expect(classify(error)).toBe('DEFAULT');
		expect(await strategy(error)).toEqual({ maxRetries: 0 });
	});

	it('retries a transport failure on a replayable request', async () => {
		const cause = new TypeError('fetch failed');
		const error = new MoceanAPIError(cause.message, {
			cause,
			replayable: true,
		});
		expect(classify(error)).toBe('TRANSPORT_ERROR');
		expect(await strategy(error)).toEqual({
			maxRetries: 2,
			retryStrategy: 'exponential_backoff',
		});
	});

	it('does not retry a transport failure on a send', async () => {
		const cause = new TypeError('fetch failed');
		const error = new MoceanAPIError(cause.message, {
			cause,
			method: 'POST',
			replayable: false,
		});
		expect(classify(error)).toBe('DEFAULT');
	});

	it('falls back to DEFAULT for anything else', async () => {
		const error = new Error('something unexpected');
		expect(classify(error)).toBe('DEFAULT');
		expect(await strategy(error)).toEqual({ maxRetries: 0 });
	});

	it('keeps DEFAULT last when caller handlers are merged', () => {
		const merged = mergeErrorHandlers(errorHandlers, {
			QUOTA_ERROR: {
				match: () => false,
				handler: async () => ({ maxRetries: 0 }),
			},
		});
		const names = Object.keys(merged);
		expect(names.at(-1)).toBe('DEFAULT');
		expect(names).toContain('QUOTA_ERROR');
		expect(names).toContain('RATE_LIMIT_ERROR');
	});

	it('lets a caller override DEFAULT and keeps it last', () => {
		const merged = mergeErrorHandlers(errorHandlers, {
			DEFAULT: {
				match: () => true,
				handler: async () => ({ maxRetries: 5 }),
			},
		});
		expect(Object.keys(merged).at(-1)).toBe('DEFAULT');
	});

	it('returns the builtin handlers unchanged when the caller adds none', () => {
		expect(mergeErrorHandlers(errorHandlers, undefined)).toBe(errorHandlers);
	});
});
