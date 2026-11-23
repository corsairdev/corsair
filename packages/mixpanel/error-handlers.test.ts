import { ZodError } from 'zod';
import { MixpanelAPIError } from './client';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';
import {
	exportUnauthenticatedText,
	importValidationFailed,
	queryRateLimited,
	queryUnauthenticated,
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

function apiError(
	status: number,
	// unknown: each case passes one of Mixpanel's error bodies.
	body: unknown = {},
	options: { retryAfter?: number; method?: string; replayable?: boolean } = {},
) {
	return new MixpanelAPIError(`Mixpanel ${status}: failed`, {
		status,
		body,
		...options,
	});
}

describe('Mixpanel error handlers', () => {
	it('retries a 429 with backoff and no header fallback', async () => {
		const error = apiError(429, queryRateLimited, { replayable: true });
		expect(classify(error)).toBe('RATE_LIMIT_ERROR');
		expect(await strategy(error)).toEqual({
			maxRetries: 3,
			headersRetryAfterMs: undefined,
			retryStrategy: 'exponential_backoff',
		});
	});

	it('honours Retry-After when Mixpanel sends one', async () => {
		const error = apiError(429, queryRateLimited, {
			retryAfter: 30000,
			replayable: true,
		});
		expect(await strategy(error)).toEqual({
			maxRetries: 3,
			headersRetryAfterMs: 30000,
			retryStrategy: 'exponential_backoff',
		});
	});

	it('does not retry a 401, whatever the API answered', async () => {
		for (const body of [queryUnauthenticated, ingestionUnauthenticated()]) {
			const error = apiError(401, body);
			expect(classify(error)).toBe('AUTH_ERROR');
			expect(await strategy(error)).toEqual({ maxRetries: 0 });
		}
	});

	it('treats the plain text export 401 as an auth error', async () => {
		const error = apiError(401, exportUnauthenticatedText);
		expect(classify(error)).toBe('AUTH_ERROR');
	});

	it('does not retry a 403, which a role change might fix', async () => {
		const error = apiError(403);
		expect(classify(error)).toBe('PERMISSION_ERROR');
		expect(await strategy(error)).toEqual({ maxRetries: 0 });
	});

	it.each([400, 404, 422])('does not retry a %i', async (status) => {
		const error = apiError(status, importValidationFailed);
		expect(classify(error)).toBe('VALIDATION_ERROR');
		expect(await strategy(error)).toEqual({ maxRetries: 0 });
	});

	it('does not retry an input that failed zod validation', async () => {
		const error = new ZodError([]);
		expect(classify(error)).toBe('VALIDATION_ERROR');
		expect(await strategy(error)).toEqual({ maxRetries: 0 });
	});

	it('does not retry a 413 batch', async () => {
		const error = apiError(413, { error: 'request exceeds max limit' });
		expect(classify(error)).toBe('REQUEST_TOO_LARGE_ERROR');
		expect(await strategy(error)).toEqual({ maxRetries: 0 });
	});

	it.each([500, 502, 503])(
		'retries a replayable request that got a %i',
		async (status) => {
			const error = apiError(status, {}, { replayable: true });
			expect(classify(error)).toBe('SERVER_ERROR');
			expect(await strategy(error)).toEqual({
				maxRetries: 2,
				retryStrategy: 'exponential_backoff',
			});
		},
	);

	it('does not replay a non-replayable 5xx', async () => {
		const error = apiError(503, {}, { replayable: false });
		expect(classify(error)).toBe('DEFAULT');
		expect(await strategy(error)).toEqual({ maxRetries: 0 });
	});

	it('retries a timeout on a replayable request', async () => {
		const timeout = new Error('The operation timed out');
		timeout.name = 'TimeoutError';
		const error = new MixpanelAPIError(timeout.message, {
			cause: timeout,
			replayable: true,
		});
		expect(classify(error)).toBe('TIMEOUT_ERROR');
		expect(await strategy(error)).toEqual({
			maxRetries: 2,
			retryStrategy: 'exponential_backoff',
		});
	});

	it('retries a transport failure on a replayable request', async () => {
		const cause = new TypeError('fetch failed');
		const error = new MixpanelAPIError(cause.message, {
			cause,
			replayable: true,
		});
		expect(classify(error)).toBe('TRANSPORT_ERROR');
		expect(await strategy(error)).toEqual({
			maxRetries: 2,
			retryStrategy: 'exponential_backoff',
		});
	});

	it('does not retry a transport failure on a non-replayable request', async () => {
		const cause = new TypeError('fetch failed');
		const error = new MixpanelAPIError(cause.message, {
			cause,
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
		const builtin = { ...errorHandlers };
		const merged = mergeErrorHandlers(builtin, {
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

/** Rebuilds the probe body inline so the fixture stays a plain object. */
function ingestionUnauthenticated() {
	return { code: 401, error: 'Invalid credentials', status: 0 };
}
