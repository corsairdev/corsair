import type { CorsairErrorHandler } from 'corsair/core';
import { ApiError } from 'corsair/http';
import { isSimilarwebDataNotFound, similarwebErrorText } from './client';
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
	// Core's ApiError, built the way request() builds it.
	return new ApiError(
		{ method: (options.method ?? 'GET') as 'GET', url: '/v1/website' },
		{
			url: 'https://api.similarweb.com/v1/website',
			ok: false,
			status: options.status ?? 0,
			statusText: '',
			body: options.body,
		},
		`Similarweb ${options.status}`,
		{ retryAfter: options.retryAfter },
	);
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
	it('does not replay a 429 core already retried', async () => {
		const error = build({ status: 429, retryAfter: 2000 });
		expect(matches('RATE_LIMIT_ERROR', error)).toBe(true);
		await expect(run('RATE_LIMIT_ERROR', error)).resolves.toEqual({
			maxRetries: 0,
		});
	});

	it('reads a 401 "Data not found" as not found, before AUTH_ERROR', () => {
		const error = build({ status: 401, body: 'Data not found' });
		const first = Object.keys(builtinHandlers).find((name) =>
			matches(name, error),
		);
		expect(first).toBe('NOT_FOUND_ERROR');
	});

	it('keeps a 401 "invalid API key" an auth error', () => {
		const error = build({ status: 401, body: 'invalid API key' });
		const first = Object.keys(builtinHandlers).find((name) =>
			matches(name, error),
		);
		expect(first).toBe('AUTH_ERROR');
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
	it('reads the plain-text reason and truncates a long one', () => {
		const error = build({ status: 401, body: 'invalid API key' });

		expect(similarwebErrorText(error)).toBe('invalid API key');
		expect(
			similarwebErrorText(build({ status: 500, body: 'x'.repeat(500) })),
		).toHaveLength(300);
		expect(similarwebErrorText(new Error('x'))).toBeUndefined();
	});

	it('reads a 404 as data not found', () => {
		expect(isSimilarwebDataNotFound(build({ status: 404 }))).toBe(true);
		expect(
			isSimilarwebDataNotFound(build({ status: 401, body: 'invalid API key' })),
		).toBe(false);
	});
});
