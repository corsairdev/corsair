import { ZodError } from 'zod';
import { YandexAPIError } from './client';
import { errorHandlers } from './error-handlers';
import {
	badArgument,
	invalidToken,
	permissionDenied,
	resourceExhausted,
	unknownKey,
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
	// unknown: each case passes one of Yandex's gRPC-shaped error bodies.
	body: unknown = {},
	options: { retryAfter?: number } = {},
) {
	return new YandexAPIError(`Yandex ${status}: failed`, {
		status,
		body,
		...options,
	});
}

describe('Yandex error handlers', () => {
	it('retries gRPC 8 as a rate limit, with backoff', async () => {
		const error = apiError(429, resourceExhausted);
		expect(classify(error)).toBe('RATE_LIMIT_ERROR');
		expect(await strategy(error)).toEqual({
			maxRetries: 3,
			headersRetryAfterMs: undefined,
			retryStrategy: 'exponential_backoff',
		});
	});

	it('retries an HTTP 429 too, even without a gRPC code', async () => {
		const error = apiError(429, {}, { retryAfter: 2000 });
		expect(classify(error)).toBe('RATE_LIMIT_ERROR');
		expect(await strategy(error)).toEqual({
			maxRetries: 3,
			headersRetryAfterMs: 2000,
			retryStrategy: 'exponential_backoff',
		});
	});

	it.each([
		['an unknown key', unknownKey],
		['a bad IAM token', invalidToken],
	])('does not retry %s, a gRPC 16', async (_label, body) => {
		const error = apiError(401, body);
		expect(classify(error)).toBe('AUTH_ERROR');
		expect(await strategy(error)).toEqual({ maxRetries: 0 });
	});

	it('does not retry gRPC 7, which a role change would have to fix', async () => {
		const error = apiError(403, permissionDenied);
		expect(classify(error)).toBe('PERMISSION_ERROR');
		expect(await strategy(error)).toEqual({ maxRetries: 0 });
	});

	it('does not retry gRPC 3, a bad argument', async () => {
		const error = apiError(400, badArgument);
		// The HTTP status is 400 whatever the gRPC code says, so the code is what
		// separates this from a credential failure.
		expect(classify(error)).toBe('VALIDATION_ERROR');
		expect(await strategy(error)).toEqual({ maxRetries: 0 });
	});

	it('does not retry a ZodError, which never reached the network', async () => {
		expect(classify(new ZodError([]))).toBe('VALIDATION_ERROR');
	});

	it('replays a 5xx, since translation has no side effect', async () => {
		const error = apiError(500, {});
		expect(classify(error)).toBe('SERVER_ERROR');
		expect(await strategy(error)).toEqual({
			maxRetries: 2,
			retryStrategy: 'exponential_backoff',
		});
	});

	it('does not retry a 503 twice over', async () => {
		// A 503 is a server error, not a rate limit, so it takes the 5xx path.
		expect(classify(apiError(503, {}))).toBe('SERVER_ERROR');
	});

	it('falls back to DEFAULT for anything else', async () => {
		expect(classify(new Error('other'))).toBe('DEFAULT');
	});
});
