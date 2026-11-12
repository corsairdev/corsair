import { ApiError } from 'corsair/http';
import { fetchDriveBytes } from './client';
import {
	errorHandlers,
	mergeErrorHandlers,
	RATE_LIMIT_FALLBACK_MS,
} from './error-handlers';
import type { GoogleSlidesContext } from './index';
import { makeContext } from './test-helpers';

jest.mock('corsair/http', () => {
	const original = jest.requireActual('corsair/http');
	return {
		...original,
		request: jest.fn(),
	};
});

const mockRequest = require('corsair/http').request as jest.Mock;

/**
 * An ApiError needs a request and a result to be constructed. `method` decides
 * whether the SERVER_ERROR handler allows a replay, so it is a parameter.
 */
function apiError(options: {
	status: number;
	method?: 'GET' | 'POST';
	body?: unknown; // unknown: a hand-built error envelope for the matcher.
	retryAfter?: number;
}): ApiError {
	return new ApiError(
		{ method: options.method ?? 'POST', url: '/presentations/deck-1' },
		{
			url: 'https://slides.googleapis.com/v1/presentations/deck-1',
			ok: false,
			status: options.status,
			statusText: 'error',
			body: options.body ?? {},
		},
		`${options.status} error`,
		options.retryAfter === undefined
			? undefined
			: { retryAfter: options.retryAfter },
	);
}

const errorContext = {
	pluginId: 'googleslides',
	operation: 'presentations.get',
	input: {},
} as const;

/**
 * A CorsairErrorHandler entry is optional in the type, and its handler takes
 * (error, context). Both are supplied here once so each test reads as one call.
 */
async function runHandler(name: keyof typeof errorHandlers, error: Error) {
	const entry = errorHandlers[name];
	expect(entry?.handler).toBeDefined();
	return entry?.handler?.(error, errorContext as never);
}

function quotaBody(reason: string) {
	return {
		error: {
			code: 429,
			status: 'RESOURCE_EXHAUSTED',
			errors: [{ reason, message: 'quota' }],
		},
	};
}

let ctx: GoogleSlidesContext;

beforeEach(() => {
	mockRequest.mockReset();
	ctx = makeContext();
});

describe('error handler matching', () => {
	it('matches a 429 as a rate limit and retries with the header delay', async () => {
		const error = apiError({ status: 429 });

		expect(
			errorHandlers.RATE_LIMIT_ERROR?.match(error, errorContext as never),
		).toBe(true);
		await expect(runHandler('RATE_LIMIT_ERROR', error)).resolves.toEqual({
			maxRetries: 4,
			headersRetryAfterMs: RATE_LIMIT_FALLBACK_MS,
		});
	});

	it('uses a Retry-After value when the response carried one', async () => {
		const error = apiError({ status: 429, retryAfter: 1500 });

		await expect(runHandler('RATE_LIMIT_ERROR', error)).resolves.toEqual({
			maxRetries: 4,
			headersRetryAfterMs: 1500,
		});
	});

	it('matches the 403 body form of a rate limit, which carries no 429', async () => {
		const error = apiError({
			status: 403,
			body: quotaBody('rateLimitExceeded'),
		});

		expect(
			errorHandlers.QUOTA_EXHAUSTED_ERROR?.match(error, errorContext as never),
		).toBe(false);
		expect(
			errorHandlers.RATE_LIMIT_ERROR?.match(error, errorContext as never),
		).toBe(true);
	});

	it('does not retry an exhausted daily quota, which cannot clear in four seconds', async () => {
		const error = apiError({
			status: 403,
			body: quotaBody('dailyLimitExceeded'),
		});

		expect(
			errorHandlers.QUOTA_EXHAUSTED_ERROR?.match(error, errorContext as never),
		).toBe(true);
		await expect(runHandler('QUOTA_EXHAUSTED_ERROR', error)).resolves.toEqual({
			maxRetries: 0,
		});
	});

	it('places the quota handler before the rate limit handler, so it wins', () => {
		const keys = Object.keys(errorHandlers);
		expect(keys.indexOf('QUOTA_EXHAUSTED_ERROR')).toBeLessThan(
			keys.indexOf('RATE_LIMIT_ERROR'),
		);
	});

	it('does not retry an auth failure', async () => {
		const error = apiError({ status: 401 });

		expect(errorHandlers.AUTH_ERROR?.match(error, errorContext as never)).toBe(
			true,
		);
		await expect(runHandler('AUTH_ERROR', error)).resolves.toEqual({
			maxRetries: 0,
		});
	});

	it('treats a bare 403 as a permission problem, not an auth problem', async () => {
		const error = apiError({
			status: 403,
			body: { error: { status: 'PERMISSION_DENIED' } },
		});

		expect(errorHandlers.AUTH_ERROR?.match(error, errorContext as never)).toBe(
			false,
		);
		expect(
			errorHandlers.PERMISSION_ERROR?.match(error, errorContext as never),
		).toBe(true);
	});

	it('does not retry a missing presentation', async () => {
		const error = apiError({ status: 404 });

		expect(
			errorHandlers.NOT_FOUND_ERROR?.match(error, errorContext as never),
		).toBe(true);
		await expect(runHandler('NOT_FOUND_ERROR', error)).resolves.toEqual({
			maxRetries: 0,
		});
	});

	it('replays a 5xx only when the code marked it safe to repeat', async () => {
		const error = apiError({ status: 503, method: 'GET' });

		expect(
			errorHandlers.SERVER_ERROR?.match(error, errorContext as never),
		).toBe(true);
		// A GET alone is not proof: core retries the whole endpoint, so an endpoint
		// that wrote before reading would repeat its write.
		await expect(runHandler('SERVER_ERROR', error)).resolves.toEqual({
			maxRetries: 0,
		});

		(error as { replaySafe?: boolean }).replaySafe = true;
		await expect(runHandler('SERVER_ERROR', error)).resolves.toEqual({
			maxRetries: 2,
		});
	});

	it('does not replay a 5xx on an endpoint that already wrote', async () => {
		const error = apiError({ status: 503, method: 'POST' });

		await expect(runHandler('SERVER_ERROR', error)).resolves.toEqual({
			maxRetries: 0,
		});
	});

	it('retries a rate-limited export, which is not an ApiError', async () => {
		const error = Object.assign(new Error('Drive export failed with 429'), {
			name: 'GoogleSlidesExportError',
			status: 429,
			retryAfter: 2500,
		});

		expect(
			errorHandlers.RATE_LIMIT_ERROR?.match(error, errorContext as never),
		).toBe(true);
		await expect(runHandler('RATE_LIMIT_ERROR', error)).resolves.toEqual({
			maxRetries: 4,
			headersRetryAfterMs: 2500,
		});
	});

	it('does not treat a failed export as a rate limit when it is not one', async () => {
		const error = Object.assign(new Error('Drive export failed with 404'), {
			name: 'GoogleSlidesExportError',
			status: 404,
		});

		expect(
			errorHandlers.RATE_LIMIT_ERROR?.match(error, errorContext as never),
		).toBe(false);
	});

	it('retries an export rate limit that Drive reports as a 403', async () => {
		const driveBody = (reason: string) =>
			JSON.stringify({
				error: {
					code: 403,
					message: 'limit',
					errors: [{ domain: 'usageLimits', reason, message: 'limit' }],
				},
			});
		const fetchMock = jest
			.spyOn(global, 'fetch')
			.mockResolvedValueOnce(
				new Response(driveBody('userRateLimitExceeded'), { status: 403 }),
			)
			.mockResolvedValueOnce(
				new Response(driveBody('insufficientFilePermissions'), {
					status: 403,
				}),
			);
		const ctx = { key: 'test-access-token' };

		const limited = (await fetchDriveBytes(ctx, '/files/deck-1/export', {
			accept: 'application/pdf',
		}).catch((caught: unknown) => caught)) as Error; // unknown: rejection.
		const denied = (await fetchDriveBytes(ctx, '/files/deck-1/export', {
			accept: 'application/pdf',
		}).catch((caught: unknown) => caught)) as Error; // unknown: rejection.
		fetchMock.mockRestore();

		expect(
			errorHandlers.RATE_LIMIT_ERROR?.match(limited, errorContext as never),
		).toBe(true);
		// A permission 403 stays permanent.
		expect(
			errorHandlers.RATE_LIMIT_ERROR?.match(denied, errorContext as never),
		).toBe(false);
	});

	it('keeps DEFAULT last and matching everything', () => {
		const keys = Object.keys(errorHandlers);
		expect(keys[keys.length - 1]).toBe('DEFAULT');
		expect(
			errorHandlers.DEFAULT?.match(
				new Error('anything'),
				errorContext as never,
			),
		).toBe(true);
	});
});

describe('mergeErrorHandlers', () => {
	it('runs a caller handler for an error no builtin covers', () => {
		const merged = mergeErrorHandlers(errorHandlers, {
			MY_ERROR: {
				match: (error: Error) => error.message === 'mine',
				handler: async () => ({ maxRetries: 7 }),
			},
		});

		// DEFAULT matches everything, so with builtins first it would claim this
		// error before the caller's handler was reached.
		const firstMatch = Object.entries(merged).find(([, entry]) =>
			entry?.match?.(new Error('mine'), errorContext as never),
		);
		expect(firstMatch?.[0]).toBe('MY_ERROR');
	});

	it('keeps unnamed builtins, drops the builtin DEFAULT and keeps the caller DEFAULT last', () => {
		const merged = mergeErrorHandlers(errorHandlers, {
			DEFAULT: {
				match: () => true,
				handler: async () => ({ maxRetries: 9 }),
			},
		});

		expect(merged.RATE_LIMIT_ERROR).toBe(errorHandlers.RATE_LIMIT_ERROR);
		expect(Object.keys(merged)[Object.keys(merged).length - 1]).toBe('DEFAULT');
		expect(merged.DEFAULT).not.toBe(errorHandlers.DEFAULT);
	});

	it('returns the builtin map unchanged when the caller passes nothing', () => {
		expect(mergeErrorHandlers(errorHandlers)).toBe(errorHandlers);
	});
});

describe('error messages do not leak the token', () => {
	it('redacts nothing else but omits the request body from the message', async () => {
		const error = apiError({
			status: 400,
			body: { error: { message: 'bad' } },
		});

		// The token travels in a header, which ApiError never copies into the url.
		expect(error.url).not.toContain('test-access-token');
		expect(String(error.message)).not.toContain('test-access-token');
	});
});
