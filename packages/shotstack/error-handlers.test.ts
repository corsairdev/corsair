import type { ErrorContext } from 'corsair/core';
import { ApiError } from 'corsair/http';
import { ZodError } from 'zod';
import { makeShotstackRequest } from './client';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';
import { generationQuotaError } from './test-fixtures';

const CONTEXT: ErrorContext = {
	pluginId: 'shotstack',
	operation: 'renders.get',
	input: {},
	originalError: new Error('original'),
};

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
	// The literals declare a one-parameter handler, so the context is not
	// passed here; the merged-map case below uses the full signature.
	return errorHandlers[classify(error)].handler(error);
}

// Errors come from the real client against a mocked fetch, so the request
// facts the handlers read are the ones production attaches.
async function apiError(
	status: number | undefined,
	options: {
		code?: string;
		retryAfter?: number;
		method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
		hasIdempotency?: boolean;
		transport?: boolean;
		message?: string;
	} = {},
): Promise<Error> {
	const fetchMock = jest.spyOn(globalThis, 'fetch');
	try {
		if (options.transport || status === undefined) {
			fetchMock.mockRejectedValueOnce(new TypeError('fetch failed'));
		} else {
			const body: Record<string, unknown> = {
				error: options.message ?? 'failed',
			};
			if (options.code) body.code = options.code;
			fetchMock.mockResolvedValueOnce(
				new Response(JSON.stringify(body), {
					status,
					headers: {
						'Content-Type': 'application/json',
						...(options.retryAfter !== undefined
							? { 'Retry-After': String(options.retryAfter / 1000) }
							: {}),
					},
				}),
			);
		}
		try {
			await makeShotstackRequest('test-key', {
				method: options.method ?? 'GET',
				service: 'edit',
				path: '/render/x',
				headers: options.hasIdempotency
					? { 'Idempotency-Key': 'key-1' }
					: undefined,
			});
		} catch (error) {
			return error as Error;
		}
		throw new Error('expected the request to fail');
	} finally {
		fetchMock.mockRestore();
	}
}

describe('Shotstack error handlers', () => {
	it('retries a plain 429 with backoff', async () => {
		const error = await apiError(429);
		expect(classify(error)).toBe('RATE_LIMIT_ERROR');
		expect(await strategy(error)).toEqual({
			maxRetries: 3,
			headersRetryAfterMs: undefined,
			retryStrategy: 'exponential_backoff',
		});
	});

	it('matches the rate_limit_error body code even without a 429 status', async () => {
		const error = await apiError(430, { code: 'rate_limit_error' });
		expect(classify(error)).toBe('RATE_LIMIT_ERROR');
	});

	it('honours Retry-After when Shotstack sends one', async () => {
		const error = await apiError(429, { retryAfter: 2000 });
		expect(await strategy(error)).toEqual({
			maxRetries: 3,
			headersRetryAfterMs: 2000,
			retryStrategy: 'exponential_backoff',
		});
	});

	it('does not retry a 429 that names the generation quota, which no retry can fix', async () => {
		const error = await apiError(429, {
			message: `Shotstack 429: ${generationQuotaError.error}`,
		});
		expect(classify(error)).toBe('QUOTA_ERROR');
		expect(await strategy(error)).toEqual({ maxRetries: 0 });
	});

	it('does not retry a 402, the account running out of generation credits', async () => {
		const error = await apiError(402);
		expect(classify(error)).toBe('INSUFFICIENT_BALANCE_ERROR');
		expect(await strategy(error)).toEqual({ maxRetries: 0 });
	});

	it('does not retry a 401 or a 403', async () => {
		for (const status of [401, 403]) {
			const error = await apiError(status);
			expect(classify(error)).toBe(
				status === 401 ? 'AUTH_ERROR' : 'PERMISSION_ERROR',
			);
			expect(await strategy(error)).toEqual({ maxRetries: 0 });
		}
	});

	it('does not retry a 409, the idempotency key reused for a different asset', async () => {
		const error = await apiError(409);
		expect(classify(error)).toBe('CONFLICT_ERROR');
		expect(await strategy(error)).toEqual({ maxRetries: 0 });
	});

	it.each([400, 404])('does not retry a %i', async (status) => {
		const error = await apiError(status);
		expect(classify(error)).toBe('VALIDATION_ERROR');
		expect(await strategy(error)).toEqual({ maxRetries: 0 });
	});

	it('does not retry an input that failed zod validation', async () => {
		const error = new ZodError([]);
		expect(classify(error)).toBe('VALIDATION_ERROR');
		expect(await strategy(error)).toEqual({ maxRetries: 0 });
	});

	it.each([500, 502, 503])('replays a GET that got a %i', async (status) => {
		const error = await apiError(status, { method: 'GET' });
		expect(classify(error)).toBe('SERVER_ERROR');
		expect(await strategy(error)).toEqual({
			maxRetries: 2,
			retryStrategy: 'exponential_backoff',
		});
	});

	it('replays a keyed generate create that got a 5xx, which the Idempotency-Key makes safe', async () => {
		const error = await apiError(503, { method: 'POST', hasIdempotency: true });
		expect(classify(error)).toBe('SERVER_ERROR');
		expect(await strategy(error)).toEqual({
			maxRetries: 2,
			retryStrategy: 'exponential_backoff',
		});
	});

	it.each(['POST', 'DELETE', 'PUT'] as const)(
		'does not replay a failed %s',
		async (method) => {
			const error = await apiError(500, { method });
			expect(classify(error)).toBe('DEFAULT');
			expect(await strategy(error)).toEqual({ maxRetries: 0 });
		},
	);

	it('replays a dropped connection on a read, which never reached Shotstack', async () => {
		const error = await apiError(undefined, { method: 'GET', transport: true });
		expect(classify(error)).toBe('TRANSPORT_ERROR');
		expect(await strategy(error)).toEqual({
			maxRetries: 2,
			retryStrategy: 'exponential_backoff',
		});
	});

	it('does not replay a dropped connection on a write', async () => {
		const error = await apiError(undefined, {
			method: 'POST',
			transport: true,
		});
		expect(classify(error)).toBe('DEFAULT');
		expect(await strategy(error)).toEqual({ maxRetries: 0 });
	});

	it('does not replay a timed-out write', async () => {
		const error = await apiError(undefined, {
			method: 'POST',
			transport: true,
		});
		expect(classify(error)).toBe('DEFAULT');
		expect(await strategy(error)).toEqual({ maxRetries: 0 });
	});

	it('falls back to DEFAULT for anything else', async () => {
		const error = new Error('something unexpected');
		expect(classify(error)).toBe('DEFAULT');
		expect(await strategy(error)).toEqual({ maxRetries: 0 });
	});

	it('keeps DEFAULT last when caller handlers are merged', async () => {
		const merged = mergeErrorHandlers(errorHandlers, {
			RATE_LIMIT_ERROR: {
				match: () => false,
				handler: async () => ({ maxRetries: 9 }),
			},
			CUSTOM_ERROR: {
				match: () => true,
				handler: async () => ({ maxRetries: 1 }),
			},
		});
		const names = Object.keys(merged);
		expect(names.at(-1)).toBe('DEFAULT');
		expect(names.indexOf('CUSTOM_ERROR')).toBeGreaterThan(
			names.indexOf('RATE_LIMIT_ERROR'),
		);
		// The caller's value wins over the builtin's.
		await expect(
			merged.RATE_LIMIT_ERROR?.handler(await apiError(429), CONTEXT),
		).resolves.toEqual({ maxRetries: 9 });
	});

	it('runs a caller handler for a status a builtin also matches, before that builtin', async () => {
		const merged = mergeErrorHandlers(errorHandlers, {
			UPSTREAM_ERROR: {
				match: (error: Error) =>
					error instanceof ApiError && error.status === 503,
				handler: async () => ({ maxRetries: 5 }),
			},
		});
		// Core takes the first match in key order, so the caller's 503 handler
		// must classify ahead of the builtin SERVER_ERROR, not behind it.
		const error503 = await apiError(503, { method: 'GET' });
		const firstMatch = (Object.keys(merged) as (keyof typeof merged)[]).find(
			(key) => merged[key]?.match(error503, CONTEXT),
		);
		expect(firstMatch).toBe('UPSTREAM_ERROR');
	});

	it('keeps the builtin DEFAULT when the caller adds none', () => {
		const merged = mergeErrorHandlers(errorHandlers, {
			CUSTOM_ERROR: {
				match: () => false,
				handler: async () => ({ maxRetries: 0 }),
			},
		});
		expect(Object.keys(merged).at(-1)).toBe('DEFAULT');
	});

	it('returns the builtin set unchanged when there is no caller', () => {
		expect(mergeErrorHandlers(errorHandlers, undefined)).toBe(errorHandlers);
	});
});
