import { ZodError } from 'zod';
import { WacheteAPIError } from './client';
import { errorHandlers } from './error-handlers';
import {
	invalidCredentials,
	invalidToken,
	missingAuth,
	notFound,
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
	return new WacheteAPIError(`Wachete ${status}: failed`, {
		status,
		body,
		...options,
	});
}

describe('Wachete error handlers', () => {
	it('retries a 429 with backoff', async () => {
		const error = apiError(429);
		expect(classify(error)).toBe('RATE_LIMIT_ERROR');
		expect(await strategy(error)).toEqual({
			maxRetries: 3,
			headersRetryAfterMs: undefined,
			retryStrategy: 'exponential_backoff',
		});
	});

	it('honours Retry-After when Wachete sends one', async () => {
		const error = apiError(429, {}, { retryAfter: 2500 });
		expect(await strategy(error)).toEqual({
			maxRetries: 3,
			headersRetryAfterMs: 2500,
			retryStrategy: 'exponential_backoff',
		});
	});

	it.each([
		['a 401', apiError(401, invalidToken)],
		['an expired token', new WacheteAPIError('x', { body: invalidToken })],
		['a missing header', new WacheteAPIError('x', { body: missingAuth })],
		['bad credentials', new WacheteAPIError('x', { body: invalidCredentials })],
	])('does not retry %s', async (_label, error) => {
		expect(classify(error)).toBe('AUTH_ERROR');
		expect(await strategy(error)).toEqual({ maxRetries: 0 });
	});

	it('treats a 403 as auth too, since the token belongs elsewhere', async () => {
		expect(classify(apiError(403, notFound))).toBe('AUTH_ERROR');
	});

	it('does not retry a 404', async () => {
		const error = apiError(404, notFound);
		expect(classify(error)).toBe('NOT_FOUND_ERROR');
		expect(await strategy(error)).toEqual({ maxRetries: 0 });
	});

	it('does not retry a 400', async () => {
		expect(classify(apiError(400, {}))).toBe('VALIDATION_ERROR');
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

	it.each(['PUT', 'POST', 'DELETE'])(
		'does not replay a 5xx on a %s, which may have gone through',
		async (method) => {
			expect(classify(apiError(500, {}, { method }))).toBe('DEFAULT');
		},
	);

	it('falls back to DEFAULT for anything else', async () => {
		expect(classify(new Error('other'))).toBe('DEFAULT');
	});
});
