import type { CorsairErrorHandler } from 'corsair/core';
import { SimilarwebAPIError } from './client';
import { errorHandlers as builtinHandlers } from './error-handlers';

// The literal map is narrower than the type core uses (its match takes a
// context argument), so widen once here rather than at each call site.
const errorHandlers: CorsairErrorHandler = builtinHandlers;

function build(options: {
	status?: number;
	method?: string;
	retryAfter?: number;
	body?: string;
}) {
	return new SimilarwebAPIError(`Similarweb ${options.status}`, {
		status: options.status,
		method: options.method,
		retryAfter: options.retryAfter,
		body: options.body,
	});
}

const context = (error: Error) => ({
	pluginId: 'similarweb',
	operation: 'test',
	input: {},
	originalError: error,
});

async function run(name: keyof typeof errorHandlers, error: Error) {
	const entry = errorHandlers[name];
	if (!entry) throw new Error(`missing handler ${name}`);
	return entry.handler(error, context(error));
}

function matches(name: keyof typeof errorHandlers, error: Error) {
	return errorHandlers[name]?.match(error, context(error));
}

describe('similarweb error handlers', () => {
	it('retries a 429 three times and keeps the Retry-After value', async () => {
		const result = await run(
			'RATE_LIMIT_ERROR',
			build({ status: 429, retryAfter: 2000 }),
		);

		expect(result).toMatchObject({
			maxRetries: 3,
			headersRetryAfterMs: 2000,
			retryStrategy: 'exponential_backoff',
		});
	});

	it('leaves the fallback delay unset when no Retry-After arrived', async () => {
		const result = await run('RATE_LIMIT_ERROR', build({ status: 429 }));

		expect(result).toEqual({
			maxRetries: 3,
			headersRetryAfterMs: undefined,
			retryStrategy: 'exponential_backoff',
		});
	});

	it.each([401, 403])('does not retry a %i', async (status) => {
		await expect(run('AUTH_ERROR', build({ status }))).resolves.toEqual({
			maxRetries: 0,
		});
	});

	it('matches a 403 that reports no credits, because either way it is the account', () => {
		expect(
			matches('AUTH_ERROR', build({ status: 403, body: 'no credits left' })),
		).toBe(true);
	});

	it('does not retry a 404', async () => {
		await expect(
			run('NOT_FOUND_ERROR', build({ status: 404, body: 'Data not found' })),
		).resolves.toEqual({ maxRetries: 0 });
	});

	it('reads a 404 body of "Data not found" as not found even with a 200 status', () => {
		expect(
			matches(
				'NOT_FOUND_ERROR',
				build({ status: 404, body: 'Data not found' }),
			),
		).toBe(true);
	});

	it.each([400, 422])('does not retry a %i', async (status) => {
		await expect(run('VALIDATION_ERROR', build({ status }))).resolves.toEqual({
			maxRetries: 0,
		});
	});

	it('matches a ZodError without a status', async () => {
		const zodError = new Error('invalid input');
		zodError.name = 'ZodError';

		await expect(run('VALIDATION_ERROR', zodError)).resolves.toEqual({
			maxRetries: 0,
		});
	});

	it('replays a 500, because every route here is a read', async () => {
		await expect(
			run('SERVER_ERROR', build({ status: 500, method: 'GET' })),
		).resolves.toEqual({
			maxRetries: 2,
			retryStrategy: 'exponential_backoff',
		});
	});

	it('matches everything in DEFAULT so it has to stay last', async () => {
		const error = build({ status: 418, method: 'GET' });
		expect(matches('DEFAULT', error)).toBe(true);
		await expect(run('DEFAULT', error)).resolves.toEqual({ maxRetries: 0 });
	});
});

describe('similarweb error classification', () => {
	it('keeps the plain-text reason and truncates a long one', () => {
		const error = build({ status: 401, body: 'invalid API key' });

		expect(error.reason).toBe('invalid API key');
		expect(build({ status: 500, body: 'x'.repeat(500) }).reason).toHaveLength(
			300,
		);
	});

	it('does not treat a 404 as an auth problem', () => {
		expect(build({ status: 404 }).isAuthError).toBe(false);
		expect(build({ status: 404 }).isDataNotFound).toBe(true);
	});
});
