import { ZodError } from 'zod';
import { VectorshiftAPIError } from './client';
import { VectorshiftRunFailedError } from './endpoints/call';
import { errorHandlers } from './error-handlers';
import {
	badRequest,
	invalidKey,
	missingHeader,
	rateLimited,
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
	return new VectorshiftAPIError(`VectorShift ${status}: failed`, {
		status,
		body,
		...options,
	});
}

describe('VectorShift error handlers', () => {
	it('retries a 429 with backoff', async () => {
		const error = apiError(429, rateLimited);
		expect(classify(error)).toBe('RATE_LIMIT_ERROR');
		expect(await strategy(error)).toEqual({
			maxRetries: 3,
			headersRetryAfterMs: undefined,
			retryStrategy: 'exponential_backoff',
		});
	});

	it('honours Retry-After when VectorShift sends one', async () => {
		const error = apiError(429, rateLimited, { retryAfter: 1000 });
		expect(await strategy(error)).toEqual({
			maxRetries: 3,
			headersRetryAfterMs: 1000,
			retryStrategy: 'exponential_backoff',
		});
	});

	it.each(['GET', 'POST'])(
		'retries a rate-limited %s, which never ran',
		async (method) => {
			expect(classify(apiError(429, rateLimited, { method }))).toBe(
				'RATE_LIMIT_ERROR',
			);
		},
	);

	it('does not retry a 401', async () => {
		const error = apiError(401, invalidKey);
		expect(classify(error)).toBe('AUTH_ERROR');
		expect(await strategy(error)).toEqual({ maxRetries: 0 });
	});

	it('recognises the missing-header message without a status', async () => {
		const error = new VectorshiftAPIError('failed', { body: missingHeader });
		expect(classify(error)).toBe('AUTH_ERROR');
	});

	it('does not retry a 403', async () => {
		expect(classify(apiError(403, badRequest))).toBe('PERMISSION_ERROR');
	});

	it('does not retry a 404', async () => {
		expect(classify(apiError(404, badRequest))).toBe('NOT_FOUND_ERROR');
	});

	it.each([400, 422])('does not retry a %i', async (status) => {
		const error = apiError(status, badRequest);
		expect(classify(error)).toBe('VALIDATION_ERROR');
		expect(await strategy(error)).toEqual({ maxRetries: 0 });
	});

	it('does not retry a ZodError', async () => {
		expect(classify(new ZodError([]))).toBe('VALIDATION_ERROR');
	});

	it('does not replay a 200 that reported a failed run', async () => {
		const error = new VectorshiftRunFailedError('pipelines.run', 'node failed');
		expect(classify(error)).toBe('RUN_FAILED_ERROR');
		expect(await strategy(error)).toEqual({ maxRetries: 0 });
	});

	it('replays a 5xx on a read', async () => {
		const error = apiError(500, {}, { method: 'GET' });
		expect(classify(error)).toBe('SERVER_ERROR');
		expect(await strategy(error)).toEqual({
			maxRetries: 2,
			retryStrategy: 'exponential_backoff',
		});
	});

	it.each(['POST'])(
		'does not replay a 5xx on a %s, which may have had side effects',
		async (method) => {
			expect(classify(apiError(500, {}, { method }))).toBe('DEFAULT');
		},
	);

	it('falls back to DEFAULT for anything else', async () => {
		expect(classify(new Error('other'))).toBe('DEFAULT');
	});
});
