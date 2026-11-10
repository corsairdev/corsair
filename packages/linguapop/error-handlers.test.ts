import type { CorsairErrorHandler, RetryStrategy } from 'corsair/core';
import { ZodError } from 'zod';
import { LinguapopAPIError } from './client';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';

type HandlerName = keyof typeof errorHandlers;

// Mirrors corsair core: the first handler whose match() passes, in key order.
function classify(error: Error): HandlerName {
	const name = (Object.keys(errorHandlers) as HandlerName[]).find((key) =>
		errorHandlers[key].match(error),
	);
	if (!name) throw new Error('DEFAULT should always match');
	return name;
}

async function strategy(error: Error): Promise<RetryStrategy> {
	return errorHandlers[classify(error)].handler(error);
}

function apiError(
	status: number,
	options: {
		method?: string;
		retryAfter?: number;
		invalidApiKey?: boolean;
	} = {},
) {
	return new LinguapopAPIError(`Linguapop ${status}: failed`, {
		status,
		method: options.method ?? 'GET',
		retryAfter: options.retryAfter,
		invalidApiKey: options.invalidApiKey,
	});
}

function transportError(method: string, timedOut = false) {
	return new LinguapopAPIError('fetch failed', {
		method,
		transport: true,
		timedOut,
	});
}

describe('Linguapop error handlers', () => {
	it.each(['GET', 'POST'])(
		'retries a 429 on %s three times with backoff, since the request never ran',
		async (method) => {
			const error = apiError(429, { method });

			expect(classify(error)).toBe('RATE_LIMIT_ERROR');
			expect(await strategy(error)).toEqual({
				maxRetries: 3,
				headersRetryAfterMs: undefined,
				retryStrategy: 'exponential_backoff',
			});
		},
	);

	it('passes Retry-After through as the delay', async () => {
		const result = await strategy(apiError(429, { retryAfter: 4000 }));

		expect(result.headersRetryAfterMs).toBe(4000);
	});

	it('leaves the delay to the backoff strategy when there is no Retry-After', async () => {
		const result = await strategy(apiError(429));

		expect(result.headersRetryAfterMs).toBeUndefined();
		expect(result.retryStrategy).toBe('exponential_backoff');
	});

	it('never retries an unrecognised key, which Linguapop answers with a 400', async () => {
		const error = apiError(400, { invalidApiKey: true, method: 'POST' });

		expect(classify(error)).toBe('AUTH_ERROR');
		expect(await strategy(error)).toEqual({ maxRetries: 0 });
	});

	it.each([401, 403])('never retries a %i', async (status) => {
		const error = apiError(status);

		expect(classify(error)).toBe('AUTH_ERROR');
		expect(await strategy(error)).toEqual({ maxRetries: 0 });
	});

	it.each([400, 404, 405, 422])(
		'never retries a %i validation or routing failure',
		async (status) => {
			const error = apiError(status, { method: 'POST' });

			expect(classify(error)).toBe('VALIDATION_ERROR');
			expect(await strategy(error)).toEqual({ maxRetries: 0 });
		},
	);

	it('never retries a schema failure, such as an HTML body for a missing route', async () => {
		const error = new ZodError([]);

		expect(classify(error)).toBe('VALIDATION_ERROR');
		expect(await strategy(error)).toEqual({ maxRetries: 0 });
	});

	it.each([500, 502, 503])('retries a %i on a read', async (status) => {
		const error = apiError(status, { method: 'GET' });

		expect(classify(error)).toBe('SERVER_ERROR');
		expect(await strategy(error)).toEqual({
			maxRetries: 2,
			retryStrategy: 'exponential_backoff',
		});
	});

	it.each([500, 502, 503])(
		'does not replay a %i on sendInvitation, which may already have created an invitation',
		async (status) => {
			const error = apiError(status, { method: 'POST' });

			expect(classify(error)).toBe('DEFAULT');
			expect(await strategy(error)).toEqual({ maxRetries: 0 });
		},
	);

	it('retries a dropped connection on a read only', async () => {
		const read = transportError('GET');
		const write = transportError('POST');

		expect(classify(read)).toBe('TRANSPORT_ERROR');
		expect((await strategy(read)).maxRetries).toBe(2);
		expect(classify(write)).toBe('TRANSPORT_ERROR');
		expect((await strategy(write)).maxRetries).toBe(0);
	});

	it('retries a timeout once on a read and never on a write', async () => {
		const read = transportError('GET', true);
		const write = transportError('POST', true);

		expect(classify(read)).toBe('TIMEOUT_ERROR');
		expect((await strategy(read)).maxRetries).toBe(1);
		expect(classify(write)).toBe('TIMEOUT_ERROR');
		expect((await strategy(write)).maxRetries).toBe(0);
	});

	it('treats a 408 as a timeout', () => {
		expect(classify(apiError(408))).toBe('TIMEOUT_ERROR');
	});

	it('sends anything else to DEFAULT without a retry', async () => {
		const error = new Error('unexpected');

		expect(classify(error)).toBe('DEFAULT');
		expect(await strategy(error)).toEqual({ maxRetries: 0 });
	});

	it('keeps DEFAULT as the last key', () => {
		expect(Object.keys(errorHandlers).at(-1)).toBe('DEFAULT');
	});
});

describe('mergeErrorHandlers', () => {
	const custom: CorsairErrorHandler = {
		QUOTA_ERROR: {
			match: (error: Error) =>
				error instanceof LinguapopAPIError && error.status === 500,
			handler: async () => ({ maxRetries: 9 }),
		},
	};

	it('returns the built-ins untouched when the caller adds nothing', () => {
		expect(mergeErrorHandlers(errorHandlers, undefined)).toBe(errorHandlers);
	});

	it('puts caller handlers first and DEFAULT last', () => {
		const names = Object.keys(mergeErrorHandlers(errorHandlers, custom));

		expect(names[0]).toBe('QUOTA_ERROR');
		expect(names.at(-1)).toBe('DEFAULT');
		expect(names).toEqual(expect.arrayContaining(Object.keys(errorHandlers)));
	});

	it('runs a caller handler for a status no built-in covers instead of DEFAULT', async () => {
		const merged = mergeErrorHandlers(errorHandlers, custom);
		const error = apiError(500, { method: 'POST' });
		const first = Object.entries(merged).find(([, entry]) =>
			entry?.match(error, {
				pluginId: 'linguapop',
				operation: 'invitations.create',
				input: {},
				originalError: error,
			}),
		);

		expect(first?.[0]).toBe('QUOTA_ERROR');
	});

	it('lets a caller override a built-in by name and keeps its place first', () => {
		const override: CorsairErrorHandler = {
			RATE_LIMIT_ERROR: {
				match: () => true,
				handler: async () => ({ maxRetries: 1 }),
			},
		};

		const merged = mergeErrorHandlers(errorHandlers, override);

		expect(Object.keys(merged)[0]).toBe('RATE_LIMIT_ERROR');
		expect(merged.RATE_LIMIT_ERROR).toBe(override.RATE_LIMIT_ERROR);
	});

	it('uses the caller DEFAULT when one is given', () => {
		const userDefault = {
			match: () => true,
			handler: async () => ({ maxRetries: 5 }),
		};

		const merged = mergeErrorHandlers(errorHandlers, {
			DEFAULT: userDefault,
		});

		expect(merged.DEFAULT).toBe(userDefault);
		expect(Object.keys(merged).at(-1)).toBe('DEFAULT');
	});
});
