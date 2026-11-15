import { ZodError } from 'zod';
import { TwoCaptchaAPIError } from './client';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';
import {
	badParameters,
	noSlot,
	unsolvable,
	wrongKeyFormat,
	zeroBalance,
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

/**
 * Builds an error the way the endpoint does when the envelope says `status: 0`,
 * which is the common 2Captcha failure: HTTP 200 with a code.
 */
function fromEnvelope(
	body: { request: string; error_text?: string },
	status?: number,
) {
	return new TwoCaptchaAPIError(`refused: ${body.request}`, {
		code: body.request,
		providerMessage: body.error_text,
		status,
	});
}

describe('2Captcha error handlers', () => {
	it('does not retry a zero balance, which no replay fixes', async () => {
		const error = fromEnvelope(zeroBalance);
		expect(classify(error)).toBe('INSUFFICIENT_BALANCE_ERROR');
		expect(await strategy(error)).toEqual({ maxRetries: 0 });
	});

	it('does not retry an unsolvable captcha', async () => {
		const error = fromEnvelope(unsolvable);
		expect(classify(error)).toBe('VALIDATION_ERROR');
		expect(await strategy(error)).toEqual({ maxRetries: 0 });
	});

	it('does not retry a bad parameter', async () => {
		expect(classify(fromEnvelope(badParameters))).toBe('VALIDATION_ERROR');
	});

	it('does not retry a wrong key', async () => {
		const error = fromEnvelope(wrongKeyFormat);
		expect(classify(error)).toBe('AUTH_ERROR');
		expect(await strategy(error)).toEqual({ maxRetries: 0 });
	});

	it('does not retry a key that has no account', () => {
		expect(
			classify(fromEnvelope({ request: 'ERROR_KEY_DOES_NOT_EXIST' })),
		).toBe('AUTH_ERROR');
	});

	it('retries no-slot-available, which is a full queue', async () => {
		const error = fromEnvelope(noSlot);
		expect(classify(error)).toBe('RATE_LIMIT_ERROR');
		expect(await strategy(error)).toEqual({
			maxRetries: 3,
			headersRetryAfterMs: undefined,
			retryStrategy: 'exponential_backoff',
		});
	});

	it('retries ERROR_TOO_MANY_REQUESTS', () => {
		expect(classify(fromEnvelope({ request: 'ERROR_TOO_MANY_REQUESTS' }))).toBe(
			'RATE_LIMIT_ERROR',
		);
	});

	it('handles both the 429 and the body code on the same error', () => {
		// A gateway 429 may carry no code at all; the status has to be enough.
		expect(classify(new TwoCaptchaAPIError('429', { status: 429 }))).toBe(
			'RATE_LIMIT_ERROR',
		);
		expect(classify(fromEnvelope({ request: 'ERROR_NO_SLOT_AVAILABLE' }))).toBe(
			'RATE_LIMIT_ERROR',
		);
	});

	it('honours Retry-After on a 429', async () => {
		const error = new TwoCaptchaAPIError('429', {
			status: 429,
			retryAfter: 5000,
		});
		expect(await strategy(error)).toEqual({
			maxRetries: 3,
			headersRetryAfterMs: 5000,
			retryStrategy: 'exponential_backoff',
		});
	});

	it('does not retry a Zod rejection', () => {
		expect(classify(new ZodError([]))).toBe('VALIDATION_ERROR');
	});

	it('retries a 5xx on a read', async () => {
		const error = new TwoCaptchaAPIError('5xx', { status: 503, method: 'GET' });
		expect(classify(error)).toBe('SERVER_ERROR');
		expect(await strategy(error)).toEqual({
			maxRetries: 2,
			retryStrategy: 'exponential_backoff',
		});
	});

	it('does not replay a task create on a 5xx', () => {
		// A replay would create a second billable task.
		expect(
			classify(new TwoCaptchaAPIError('5xx', { status: 500, method: 'POST' })),
		).toBe('DEFAULT');
	});

	it('leaves anything unrecognised to DEFAULT with no retry', async () => {
		expect(classify(new Error('socket hang up'))).toBe('DEFAULT');
		expect(await strategy(new Error('socket hang up'))).toEqual({
			maxRetries: 0,
		});
	});

	it('keeps DEFAULT last in the builtin map', () => {
		expect(Object.keys(errorHandlers).at(-1)).toBe('DEFAULT');
	});

	it('orders the balance check before the rate limit', () => {
		// A 429 that names a zero balance must not be retried three times.
		const error = new TwoCaptchaAPIError('429', {
			status: 429,
			code: 'ERROR_ZERO_BALANCE',
		});
		expect(classify(error)).toBe('INSUFFICIENT_BALANCE_ERROR');
	});
});

describe('mergeErrorHandlers', () => {
	it('keeps a caller handler reachable when the builtin has no match for it', () => {
		const merged = mergeErrorHandlers(errorHandlers, {
			CUSTOM: { match: () => true, handler: async () => ({ maxRetries: 7 }) },
		});

		const first = Object.keys(merged).find((key) =>
			merged[key as keyof typeof merged]?.match(new Error('x'), {} as never),
		);
		expect(first).toBe('CUSTOM');
	});

	it('keeps the caller DEFAULT last and winning', async () => {
		const merged = mergeErrorHandlers(errorHandlers, {
			DEFAULT: { match: () => true, handler: async () => ({ maxRetries: 9 }) },
		});

		expect(Object.keys(merged).at(-1)).toBe('DEFAULT');
		expect(await merged.DEFAULT?.handler(new Error('x'), {} as never)).toEqual({
			maxRetries: 9,
		});
	});

	it('lets a caller override a builtin name', async () => {
		const merged = mergeErrorHandlers(errorHandlers, {
			AUTH_ERROR: {
				match: () => true,
				handler: async () => ({ maxRetries: 1 }),
			},
		});

		expect(
			await merged.AUTH_ERROR?.handler(new Error('x'), {} as never),
		).toEqual({ maxRetries: 1 });
	});

	it('returns the builtin map unchanged when the caller passes nothing', () => {
		expect(mergeErrorHandlers(errorHandlers, undefined)).toBe(errorHandlers);
	});
});
