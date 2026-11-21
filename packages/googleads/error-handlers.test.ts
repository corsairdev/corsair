import type { CorsairErrorHandler, RetryStrategy } from 'corsair/core';
import { ApiError } from 'corsair/http';
import { GoogleAdsTransportError } from './client';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';
import { googleads } from './index';

const SEARCH = '/customers/1/googleAds:search';
const STREAM = '/customers/1/googleAds:searchStream';
const FIELDS = '/googleAdsFields:search';
const LIST = '/customers:listAccessibleCustomers';
const MUTATE = '/customers/1/campaigns:mutate';

/** An ApiError shaped the way core's request() throws one. */
function apiError(
	status: number,
	path: string = MUTATE,
	method: 'GET' | 'POST' = 'POST',
	// unknown: a provider body; each test states its own.
	body: unknown = {
		error: { code: status, message: 'failed', status: 'FAILED' },
	},
	retryAfter?: number,
): ApiError {
	return new ApiError(
		{ method, url: path },
		{
			url: `https://googleads.googleapis.com/v26${path}`,
			ok: false,
			status,
			statusText: 'failed',
			body,
		},
		'failed',
		retryAfter === undefined ? undefined : { retryAfter },
	);
}

/** A 429 body carrying one QuotaError and, optionally, Google's retry delay. */
function quotaBody(quotaError: string, retryDelay?: string) {
	return {
		error: {
			code: 429,
			message: 'Resource has been exhausted (e.g. check quota).',
			status: 'RESOURCE_EXHAUSTED',
			details: [
				{
					'@type':
						'type.googleapis.com/google.ads.googleads.v26.errors.GoogleAdsFailure',
					errors: [
						{
							errorCode: { quotaError },
							message: 'Too many requests.',
							...(retryDelay
								? {
										details: {
											quotaErrorDetails: {
												rateScope: 'DEVELOPER',
												rateName: 'Number of operations',
												retryDelay,
											},
										},
									}
								: {}),
						},
					],
					requestId: 'req-1',
				},
			],
		},
	};
}

/** Runs a handler the way core does: first named match in key order, else DEFAULT. */
async function handlerFor(
	error: Error,
	handlers: CorsairErrorHandler = errorHandlers,
): Promise<RetryStrategy> {
	const name = Object.keys(handlers).find(
		(key) =>
			key !== 'DEFAULT' &&
			handlers[key]?.match?.(error, {
				pluginId: 'googleads',
				operation: 'reporting.search',
				input: {},
				originalError: error,
			}),
	);
	const picked = handlers[name ?? 'DEFAULT']?.handler;
	if (!picked) throw new Error('no handler matched, not even DEFAULT');
	return picked(error, {
		pluginId: 'googleads',
		operation: 'reporting.search',
		input: {},
		originalError: error,
	});
}

describe('rate limits and quotas', () => {
	it('retries a bare 429 with backoff', async () => {
		const strategy = await handlerFor(apiError(429));

		expect(strategy.maxRetries).toBe(3);
		expect(strategy.retryStrategy).toBe('exponential_backoff_jitter');
		expect(strategy.headersRetryAfterMs).toBeUndefined();
	});

	it("retries the short-term rate limit and forwards Google's retry delay", async () => {
		const strategy = await handlerFor(
			apiError(
				429,
				SEARCH,
				'POST',
				quotaBody('RESOURCE_TEMPORARILY_EXHAUSTED', '3s'),
			),
		);

		expect(strategy.maxRetries).toBe(3);
		expect(strategy.headersRetryAfterMs).toBe(3000);
	});

	it('forwards ApiError.retryAfter when the body names no delay', async () => {
		const strategy = await handlerFor(
			apiError(429, MUTATE, 'POST', undefined, 2000),
		);

		expect(strategy.maxRetries).toBe(3);
		expect(strategy.headersRetryAfterMs).toBe(2000);
	});

	it.each([
		'RESOURCE_EXHAUSTED',
		'EXCESSIVE_LONG_TERM_QUERY_RESOURCE_CONSUMPTION',
		'ACCESS_PROHIBITED',
	])(
		'does not retry QuotaError %s, which no short wait clears',
		async (code) => {
			const strategy = await handlerFor(
				apiError(429, SEARCH, 'POST', quotaBody(code)),
			);

			expect(strategy.maxRetries).toBe(0);
		},
	);

	it('does not retry when Google says to wait longer than a minute', async () => {
		const strategy = await handlerFor(
			apiError(
				429,
				SEARCH,
				'POST',
				quotaBody('RESOURCE_TEMPORARILY_EXHAUSTED', '86158s'),
			),
		);

		expect(strategy.maxRetries).toBe(0);
	});

	it('copes with a 429 whose body is not JSON', async () => {
		const strategy = await handlerFor(
			apiError(429, SEARCH, 'POST', '<html>Too Many Requests</html>'),
		);

		expect(strategy.maxRetries).toBe(3);
	});
});

describe('transient server failures', () => {
	it.each([
		['GET listAccessibleCustomers', LIST, 'GET'],
		['POST googleAds:search', SEARCH, 'POST'],
		['POST googleAds:searchStream', STREAM, 'POST'],
		['POST googleAdsFields:search', FIELDS, 'POST'],
	] as const)('retries a 503 on the read %s', async (_label, path, method) => {
		const strategy = await handlerFor(apiError(503, path, method));

		expect(strategy.maxRetries).toBe(2);
	});

	it('retries a 504 DEADLINE_EXCEEDED on a search', async () => {
		const strategy = await handlerFor(apiError(504, SEARCH));

		expect(strategy.maxRetries).toBe(2);
	});

	it.each([MUTATE, '/customers/1/googleAds:mutate', '/customers/1:mutate'])(
		'does not replay a 503 on the mutate %s, which has no idempotency key',
		async (path) => {
			const strategy = await handlerFor(apiError(503, path));

			expect(strategy.maxRetries).toBe(0);
		},
	);

	it('retries a 500 on a search, where UNKNOWN and INTERNAL live', async () => {
		const strategy = await handlerFor(apiError(500, SEARCH));

		expect(strategy.maxRetries).toBe(2);
	});

	it('does not replay a 500 on a write', async () => {
		const strategy = await handlerFor(apiError(500, MUTATE));

		expect(strategy.maxRetries).toBe(0);
	});
});

describe('auth and permission failures', () => {
	it.each([401, 403])('does not retry a %i', async (status) => {
		const strategy = await handlerFor(apiError(status));

		expect(strategy.maxRetries).toBe(0);
	});
});

describe('input and state failures', () => {
	it.each([
		['invalid argument', 400],
		['already exists', 409],
	])('does not retry a %s failure (%i)', async (_label, status) => {
		const strategy = await handlerFor(apiError(status));

		expect(strategy.maxRetries).toBe(0);
	});

	it('routes a 404 to NOT_FOUND_ERROR, which no earlier handler claims', async () => {
		const missing = apiError(404);
		const handlers: CorsairErrorHandler = errorHandlers;
		const name = Object.keys(handlers).find(
			(key) =>
				key !== 'DEFAULT' &&
				handlers[key]?.match?.(missing, {
					pluginId: 'googleads',
					operation: 'reporting.search',
					input: {},
					originalError: missing,
				}),
		);

		expect(name).toBe('NOT_FOUND_ERROR');
		expect((await handlerFor(missing)).maxRetries).toBe(0);
	});

	it('does not retry a refused input, which never reached Google', async () => {
		const zodError = new Error('invalid input');
		zodError.name = 'ZodError';

		expect((await handlerFor(zodError)).maxRetries).toBe(0);
	});
});

describe('transport failures', () => {
	it('retries a dropped connection on a read once', async () => {
		const strategy = await handlerFor(
			new GoogleAdsTransportError('fetch failed', true, new TypeError('x')),
		);

		expect(strategy.maxRetries).toBe(1);
	});

	it('does not replay a dropped connection on a mutate', async () => {
		const strategy = await handlerFor(
			new GoogleAdsTransportError('fetch failed', false, new TypeError('x')),
		);

		expect(strategy.maxRetries).toBe(0);
	});
});

describe('merging', () => {
	it('keeps DEFAULT last after a caller adds a handler', async () => {
		const custom = googleads({
			errorHandlers: {
				QUOTA_ERROR: {
					match: () => false,
					handler: async () => ({ maxRetries: 0 }),
				},
			},
		});
		const names = Object.keys(custom.errorHandlers ?? {});

		expect(names.at(-1)).toBe('DEFAULT');
		expect(names.indexOf('QUOTA_ERROR')).toBeLessThan(names.indexOf('DEFAULT'));
	});

	it('lets a caller handler take a status a builtin also matches', async () => {
		const merged = mergeErrorHandlers(errorHandlers, {
			CUSTOM_429: {
				match: (error: Error) =>
					error instanceof ApiError && error.status === 429,
				handler: async () => ({ maxRetries: 9 }),
			},
		});

		expect((await handlerFor(apiError(429), merged)).maxRetries).toBe(9);
	});

	it('keeps the caller DEFAULT as the fallback', async () => {
		const merged = mergeErrorHandlers(errorHandlers, {
			DEFAULT: {
				match: () => true,
				handler: async () => ({ maxRetries: 42 }),
			},
		});

		expect((await handlerFor(new Error('unmatched'), merged)).maxRetries).toBe(
			42,
		);
	});
});
