import { ZodError } from 'zod';
import { VirustotalAPIError } from './client';
import { errorHandlers } from './error-handlers';
import {
	invalidKey,
	missingKey,
	notAvailableYet,
	notFound,
	quotaExceeded,
	tooManyRequests,
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
	// unknown: each case passes one of the API's error bodies.
	body: unknown = {},
	options: { retryAfter?: number; method?: string } = {},
) {
	return new VirustotalAPIError(`VirusTotal ${status}: failed`, {
		status,
		body,
		...options,
	});
}

describe('VirusTotal error handlers', () => {
	it('retries a burst 429 with backoff', async () => {
		const error = apiError(429, tooManyRequests);
		expect(classify(error)).toBe('RATE_LIMIT_ERROR');
		expect(await strategy(error)).toEqual({
			maxRetries: 3,
			headersRetryAfterMs: undefined,
			retryStrategy: 'exponential_backoff',
		});
	});

	it('does not retry a spent quota, even though it is also a 429', async () => {
		const error = apiError(429, quotaExceeded);
		expect(classify(error)).toBe('QUOTA_ERROR');
		expect(await strategy(error)).toEqual({ maxRetries: 0 });
	});

	it.each(['GET', 'POST'])(
		'retries a rate-limited %s, which was refused before it ran',
		async (method) => {
			expect(classify(apiError(429, tooManyRequests, { method }))).toBe(
				'RATE_LIMIT_ERROR',
			);
		},
	);

	it('honours Retry-After when VirusTotal sends one', async () => {
		const error = apiError(429, tooManyRequests, { retryAfter: 3000 });
		expect(await strategy(error)).toEqual({
			maxRetries: 3,
			headersRetryAfterMs: 3000,
			retryStrategy: 'exponential_backoff',
		});
	});

	it.each([
		['a 401', apiError(401, invalidKey)],
		['a wrong key', new VirustotalAPIError('x', { body: invalidKey })],
		['a missing key', new VirustotalAPIError('x', { body: missingKey })],
	])('does not retry %s', async (_label, error) => {
		expect(classify(error)).toBe('AUTH_ERROR');
		expect(await strategy(error)).toEqual({ maxRetries: 0 });
	});

	it('does not retry a 403, which a plan change would have to fix', async () => {
		expect(classify(apiError(403, {}))).toBe('PERMISSION_ERROR');
	});

	it('does not retry a 404', async () => {
		expect(classify(apiError(404, notFound))).toBe('NOT_FOUND_ERROR');
	});

	it('does not retry NotAvailableYet, but keeps it distinct from a 404', async () => {
		const error = apiError(400, notAvailableYet);
		expect(classify(error)).toBe('NOT_READY_ERROR');
		expect(await strategy(error)).toEqual({ maxRetries: 0 });
	});

	it.each([400, 409, 424])('does not retry a %i', async (status) => {
		expect(classify(apiError(status, {}))).toBe('VALIDATION_ERROR');
	});

	it('does not retry a ZodError, which never reached the network', async () => {
		expect(classify(new ZodError([]))).toBe('VALIDATION_ERROR');
	});

	it('replays a 503 on a read, which the docs say may succeed on retry', async () => {
		const error = apiError(503, {}, { method: 'GET' });
		expect(classify(error)).toBe('SERVER_ERROR');
		expect(await strategy(error)).toEqual({
			maxRetries: 2,
			retryStrategy: 'exponential_backoff',
		});
	});

	it.each(['POST', 'DELETE'])(
		'does not replay a 5xx on a %s, which may have gone through',
		async (method) => {
			expect(classify(apiError(500, {}, { method }))).toBe('DEFAULT');
		},
	);

	it('falls back to DEFAULT for anything else', async () => {
		expect(classify(new Error('other'))).toBe('DEFAULT');
	});
});
