import { ZodError } from 'zod';
import { WatiAPIError } from './client';
import { errorHandlers } from './error-handlers';
import {
	badRequest,
	forbidden,
	invalidToken,
	missingToken,
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
	return new WatiAPIError(`WATI ${status}: failed`, {
		status,
		body,
		...options,
	});
}

describe('WATI error handlers', () => {
	it('retries a 429 with backoff', async () => {
		expect(classify(apiError(429, rateLimited))).toBe('RATE_LIMIT_ERROR');
		expect(
			await strategy(apiError(429, rateLimited, { retryAfter: 1200 })),
		).toEqual({
			maxRetries: 3,
			headersRetryAfterMs: 1200,
			retryStrategy: 'exponential_backoff',
		});
	});

	it.each([
		['a missing token', missingToken],
		['an invalid token', invalidToken],
	])('does not retry %s', async (_label, body) => {
		const error = apiError(401, body);
		expect(classify(error)).toBe('AUTH_ERROR');
		expect(await strategy(error)).toEqual({ maxRetries: 0 });
	});

	it('treats a bare 401 as auth', () => {
		expect(classify(apiError(401, {}))).toBe('AUTH_ERROR');
	});

	it('does not retry a 403, which role, plan or channel access would have to fix', async () => {
		const error = apiError(403, forbidden);
		expect(classify(error)).toBe('PERMISSION_ERROR');
		expect(await strategy(error)).toEqual({ maxRetries: 0 });
	});

	it('does not retry a 404', async () => {
		expect(classify(apiError(404, {}))).toBe('NOT_FOUND_ERROR');
	});

	it.each([400, 422])('does not retry a %i', async (status) => {
		const error = apiError(status, badRequest);
		expect(classify(error)).toBe('VALIDATION_ERROR');
		expect(await strategy(error)).toEqual({ maxRetries: 0 });
	});

	it('does not retry a ZodError, which never reached the network', async () => {
		expect(classify(new ZodError([]))).toBe('VALIDATION_ERROR');
	});

	it('replays a 5xx on a read', async () => {
		const error = apiError(500, {}, { method: 'GET' });
		expect(classify(error)).toBe('SERVER_ERROR');
		expect(await strategy(error)).toEqual({
			maxRetries: 2,
			retryStrategy: 'exponential_backoff',
		});
	});

	it.each(['POST', 'PUT', 'DELETE'])(
		'does not replay a 5xx on a %s, which may have sent a message',
		async (method) => {
			expect(classify(apiError(500, {}, { method }))).toBe('DEFAULT');
		},
	);

	it('falls back to DEFAULT for anything else', async () => {
		expect(classify(new Error('other'))).toBe('DEFAULT');
	});
});
