import type { CorsairErrorHandler } from 'corsair/core';
import { makeLoopsRequest } from './client';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';
import {
	captureError,
	currentFetch,
	installFetchMock,
	jsonResponse,
	mockFetch,
	restoreFetchMock,
} from './test-helpers';

function handler<K extends keyof typeof errorHandlers>(name: K) {
	return errorHandlers[name];
}

/**
 * Produces the error the client really throws for a Loops answer, so the
 * handlers are tested against core's ApiError and not a hand-made object.
 */
async function loopsError(
	message: string,
	options: {
		status?: number;
		method?: 'GET' | 'POST';
		hasIdempotency?: boolean;
		envelopeFailure?: boolean;
		transport?: boolean;
		retryAfterSeconds?: number;
	} = {},
): Promise<Error> {
	if (options.transport) {
		currentFetch().mockRejectedValueOnce(new TypeError(message));
	} else {
		mockFetch(
			jsonResponse(
				{ success: false, message },
				{
					status: options.envelopeFailure ? 200 : (options.status ?? 400),
					headers: {
						'Content-Type': 'application/json',
						...(options.retryAfterSeconds === undefined
							? {}
							: { 'Retry-After': String(options.retryAfterSeconds) }),
					},
				},
			),
		);
	}
	return (await captureError(
		makeLoopsRequest('test-key', {
			method: options.method ?? 'POST',
			path: '/v1/test',
			idempotencyKey: options.hasIdempotency ? 'idem-1' : undefined,
		}),
	)) as Error;
}

const context = {
	pluginId: 'loops',
	operation: 'test',
	input: {},
	originalError: new Error('test'),
};

/**
 * Mirrors core's handleCorsairError (not exported): the first key other than
 * DEFAULT whose match passes wins, else DEFAULT. Returns the winning key.
 */
function dispatch(handlers: CorsairErrorHandler, error: Error): string {
	return (
		Object.keys(handlers).find(
			(name) => name !== 'DEFAULT' && handlers[name]?.match(error, context),
		) ?? 'DEFAULT'
	);
}

beforeEach(installFetchMock);
afterEach(restoreFetchMock);

describe('Loops error handler matching', () => {
	it('retries a 429 three times with the exponential strategy', async () => {
		const error = await loopsError('Loops 429: Rate limit exceeded', {
			status: 429,
			method: 'GET',
		});

		expect(handler('RATE_LIMIT_ERROR').match(error)).toBe(true);
		const result = await handler('RATE_LIMIT_ERROR').handler(error);
		expect(result).toEqual({
			maxRetries: 3,
			headersRetryAfterMs: undefined,
			retryStrategy: 'exponential_backoff',
		});
	});

	it('does not retry a 429 for a used-up upload or preview quota', async () => {
		mockFetch(
			jsonResponse(
				{
					message:
						'Upload limit exceeded: max 50 uploads per 24 hours. Please contact support if you need to increase your upload limit.',
					maxUploads: 50,
					windowHours: 24,
				},
				{ status: 429 },
			),
		);
		const uploads = (await captureError(
			makeLoopsRequest('test-key', {
				method: 'POST',
				path: '/v1/uploads/a_1/complete',
			}),
		)) as Error;
		const preview = await loopsError('The daily preview limit was reached.', {
			status: 429,
		});
		const rateLimit = await loopsError('Rate limit exceeded', { status: 429 });

		expect(dispatch(errorHandlers, uploads)).toBe('QUOTA_EXHAUSTED');
		expect(dispatch(errorHandlers, preview)).toBe('QUOTA_EXHAUSTED');
		expect(dispatch(errorHandlers, rateLimit)).toBe('RATE_LIMIT_ERROR');
		expect(await handler('QUOTA_EXHAUSTED').handler()).toEqual({
			maxRetries: 0,
		});
	});

	it('keeps a Retry-After header value when Loops ever sends one', async () => {
		const error = await loopsError('Loops 429: Rate limit exceeded', {
			status: 429,
			retryAfterSeconds: 4,
		});

		const result = await handler('RATE_LIMIT_ERROR').handler(error);
		expect(result?.headersRetryAfterMs).toBe(4000);
	});

	it('sends a disabled-feature 401 to FEATURE_NOT_ENABLED, not to AUTH_ERROR', async () => {
		const error = await loopsError(
			'Loops 401: Invalid API key or content API not enabled for this team',
			{ status: 401 },
		);

		// Both match; key order decides, so check what core would pick.
		expect(handler('AUTH_ERROR').match(error)).toBe(true);
		expect(dispatch(errorHandlers, error)).toBe('FEATURE_NOT_ENABLED');
		const result = await handler('FEATURE_NOT_ENABLED').handler();
		expect(result?.maxRetries).toBe(0);
	});

	it('never retries a plain 401', async () => {
		const error = await loopsError('Loops 401: Invalid API key', {
			status: 401,
		});

		expect(handler('AUTH_ERROR').match(error)).toBe(true);
		expect(handler('FEATURE_NOT_ENABLED').match(error)).toBe(false);
		const result = await handler('AUTH_ERROR').handler();
		expect(result?.maxRetries).toBe(0);
	});

	it('never retries a 409 duplicate contact or reused idempotency key', async () => {
		const error = await loopsError('Loops 409: Email already exists', {
			status: 409,
		});

		expect(handler('CONFLICT_ERROR').match(error)).toBe(true);
		const result = await handler('CONFLICT_ERROR').handler();
		expect(result?.maxRetries).toBe(0);
	});

	it('never retries validation, not-found or wrong-method errors', async () => {
		for (const status of [400, 404, 405]) {
			const error = await loopsError(`Loops ${status}: bad request`, {
				status,
			});
			expect(handler('VALIDATION_ERROR').match(error)).toBe(true);
			const result = await handler('VALIDATION_ERROR').handler();
			expect(result?.maxRetries).toBe(0);
		}
	});

	it('treats a 2xx success:false envelope as validation, not as a retriable failure', async () => {
		const error = await loopsError('Loops: Email already exists', {
			envelopeFailure: true,
			method: 'POST',
		});

		expect(handler('VALIDATION_ERROR').match(error)).toBe(true);
	});

	it('replays a 5xx on a read but not on a plain write', async () => {
		const read = await loopsError('Loops 500', { status: 500, method: 'GET' });
		const write = await loopsError('Loops 500', {
			status: 500,
			method: 'POST',
		});

		expect(handler('SERVER_ERROR').match(read)).toBe(true);
		expect(handler('SERVER_ERROR').match(write)).toBe(false);
		const result = await handler('SERVER_ERROR').handler();
		expect(result?.maxRetries).toBe(2);
	});

	it('replays a 5xx on a write that carries an idempotency key', async () => {
		const error = await loopsError('Loops 503', {
			status: 503,
			method: 'POST',
			hasIdempotency: true,
		});

		expect(handler('SERVER_ERROR').match(error)).toBe(true);
	});

	it('retries a dropped read as a transport failure and not a dropped write', async () => {
		const read = await loopsError('fetch failed', {
			method: 'GET',
			transport: true,
		});
		const write = await loopsError('fetch failed', {
			method: 'POST',
			transport: true,
		});

		expect(handler('TRANSPORT_ERROR').match(read)).toBe(true);
		expect(handler('TRANSPORT_ERROR').match(write)).toBe(false);
	});

	it('lets a foreign error fall through to DEFAULT', async () => {
		const error = new Error('something else');

		for (const name of Object.keys(errorHandlers) as Array<
			keyof typeof errorHandlers
		>) {
			if (name === 'DEFAULT') continue;
			expect(handler(name).match(error)).toBe(false);
		}
		expect(handler('DEFAULT').match()).toBe(true);
	});
});

describe('mergeErrorHandlers', () => {
	const builtin = {
		AUTH_ERROR: {
			match: () => false,
			handler: async () => ({ maxRetries: 0 }),
		},
		DEFAULT: {
			match: () => true,
			handler: async () => ({ maxRetries: 0 }),
		},
	} satisfies CorsairErrorHandler;

	it('puts the caller handlers first so core runs them before the builtins', () => {
		// Both match the same error; the caller's must win.
		const merged = mergeErrorHandlers(
			{ ...builtin, AUTH_ERROR: { ...builtin.AUTH_ERROR, match: () => true } },
			{
				QUOTA_ERROR: {
					match: () => true,
					handler: async () => ({ maxRetries: 4 }),
				},
			},
		);

		expect(dispatch(merged, new Error('Loops 401: Invalid API key'))).toBe(
			'QUOTA_ERROR',
		);
		const keys = Object.keys(merged);
		expect(keys[keys.length - 1]).toBe('DEFAULT');
	});

	it('lets a caller handler under a builtin-covered key win', async () => {
		// Core takes the first key whose match passes, so a builtin AUTH_ERROR
		// placed before the caller's would claim every 401 first.
		const merged = mergeErrorHandlers(builtin, {
			AUTH_ERROR: {
				match: () => true,
				handler: async () => ({ maxRetries: 7 }),
			},
		});

		const error = new Error('Loops 401: Invalid API key');
		const context = {
			pluginId: 'loops',
			operation: 'test',
			input: {},
			originalError: error,
		};
		expect(merged.AUTH_ERROR?.match(error, context)).toBe(true);
		await expect(merged.AUTH_ERROR?.handler(error, context)).resolves.toEqual({
			maxRetries: 7,
		});
		const keys = Object.keys(merged);
		expect(keys.indexOf('AUTH_ERROR')).toBeLessThan(keys.indexOf('DEFAULT'));
	});

	it('keeps DEFAULT last when the caller overrides it', () => {
		const merged = mergeErrorHandlers(builtin, {
			DEFAULT: { match: () => true, handler: async () => ({ maxRetries: 9 }) },
		});

		const keys = Object.keys(merged);
		expect(keys[keys.length - 1]).toBe('DEFAULT');
		expect(merged.DEFAULT).toBeDefined();
	});

	it('returns the builtins untouched when the caller adds nothing', () => {
		expect(mergeErrorHandlers(builtin, undefined)).toBe(builtin);
	});
});
