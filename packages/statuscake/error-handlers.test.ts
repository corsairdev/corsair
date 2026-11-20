import { ZodError } from 'zod';
import { StatusCakeAPIError } from './client';
import { errorHandlers } from './error-handlers';
import { validationError } from './test-fixtures';

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
	// unknown: each case passes one of the documented error bodies, or none.
	body: unknown = {},
	options: { retryAfter?: number; method?: string } = {},
) {
	return new StatusCakeAPIError(`StatusCake ${status}: failed`, {
		status,
		body,
		path: '/uptime',
		method: options.method ?? 'POST',
		retryAfter: options.retryAfter,
	});
}

describe('StatusCake error handlers', () => {
	it('retries a 429 with backoff and no header delay', async () => {
		const error = apiError(429);
		expect(classify(error)).toBe('RATE_LIMIT_ERROR');
		expect(await strategy(error)).toEqual({
			maxRetries: 3,
			headersRetryAfterMs: undefined,
			retryStrategy: 'exponential_backoff',
		});
	});

	it('waits the documented x-ratelimit-reset seconds when present', async () => {
		const error = apiError(429, validationError, { retryAfter: 7000 });
		expect(classify(error)).toBe('RATE_LIMIT_ERROR');
		expect(await strategy(error)).toEqual({
			maxRetries: 3,
			headersRetryAfterMs: 7000,
			retryStrategy: 'exponential_backoff',
		});
	});

	it('does not retry a 401 from a wrong or deleted token', async () => {
		const error = apiError(401, { message: 'Unauthorised' });
		expect(classify(error)).toBe('AUTH_ERROR');
		expect(await strategy(error)).toEqual({ maxRetries: 0 });
	});

	it('treats the gateway bare 403 denial as an auth error', async () => {
		// Probed live: a bogus bearer is denied before the API app runs, with
		// no body at all.
		const error = apiError(403, null);
		expect(classify(error)).toBe('AUTH_ERROR');
		expect(await strategy(error)).toEqual({ maxRetries: 0 });
	});

	it('does not read an app-level 403 with a body as an auth denial', async () => {
		const error = apiError(403, { message: 'forbidden resource' });
		expect(classify(error)).not.toBe('AUTH_ERROR');
	});

	it('does not retry a 404 for a missing resource', async () => {
		const error = apiError(404);
		expect(classify(error)).toBe('NOT_FOUND_ERROR');
		expect(await strategy(error)).toEqual({ maxRetries: 0 });
	});

	it.each([400, 409, 422])(
		'does not retry another 4xx (%i), which the docs say needs a changed request',
		async (status) => {
			const error = apiError(status);
			expect(classify(error)).toBe('VALIDATION_ERROR');
			expect(await strategy(error)).toEqual({ maxRetries: 0 });
		},
	);

	it('does not retry an input that failed zod validation', async () => {
		const error = new ZodError([]);
		expect(classify(error)).toBe('VALIDATION_ERROR');
		expect(await strategy(error)).toEqual({ maxRetries: 0 });
	});

	it.each([500, 502, 503])('retries a read that got a %i', async (status) => {
		const error = apiError(status, {}, { method: 'GET' });
		expect(classify(error)).toBe('SERVER_ERROR');
		expect(await strategy(error)).toEqual({
			maxRetries: 2,
			retryStrategy: 'exponential_backoff',
		});
	});

	it('does not replay a failed POST: a create can have gone through', async () => {
		const error = apiError(500, {}, { method: 'POST' });
		expect(classify(error)).toBe('DEFAULT');
		expect(await strategy(error)).toEqual({ maxRetries: 0 });
	});

	it.each(['PUT', 'DELETE'] as const)(
		'does not replay a failed %s',
		async (method) => {
			const error = apiError(500, {}, { method });
			expect(classify(error)).toBe('DEFAULT');
			expect(await strategy(error)).toEqual({ maxRetries: 0 });
		},
	);

	it('does not replay a request that timed out', async () => {
		const timeout = new Error('The operation timed out');
		timeout.name = 'TimeoutError';
		expect(classify(timeout)).toBe('DEFAULT');
		expect(await strategy(timeout)).toEqual({ maxRetries: 0 });
	});

	it('falls back to DEFAULT for anything else', async () => {
		const error = new Error('something unexpected');
		expect(classify(error)).toBe('DEFAULT');
		expect(await strategy(error)).toEqual({ maxRetries: 0 });
	});
});
