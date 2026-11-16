import type { CorsairErrorHandler } from 'corsair/core';
import { ApiError } from 'corsair/http';
import { errorHandlers as builtinHandlers } from './error-handlers';

// The literal map is narrower than the type core uses (its match takes a
// context argument), so widen once here rather than at each call site.
const errorHandlers: CorsairErrorHandler = builtinHandlers;

// The error core's request() throws, as the client passes it on.
function build(options: { status?: number; method?: string }) {
	return new ApiError(
		{ method: (options.method ?? 'GET') as 'GET', url: '/companies' },
		{
			url: 'https://app.suitedash.com/secure-api/companies',
			ok: false,
			status: options.status ?? 500,
			statusText: 'failed',
			body: { success: false, message: 'failed', data: [] },
		},
		`SuiteDash ${options.status}`,
	);
}

const context = (error: Error) => ({
	pluginId: 'suitedash',
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

describe('suitedash error handlers', () => {
	it('does not retry a 429, because the limit is a monthly allowance', async () => {
		// Every retry spends another call from the same exhausted plan allowance.
		await expect(
			run('RATE_LIMIT_ERROR', build({ status: 429 })),
		).resolves.toEqual({ maxRetries: 0 });
	});

	it.each([401, 403])('does not retry a %i', async (status) => {
		await expect(run('AUTH_ERROR', build({ status }))).resolves.toEqual({
			maxRetries: 0,
		});
	});

	it.each([400, 404, 405, 422])('does not retry a %i', async (status) => {
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

	it('replays a 5xx on a read', async () => {
		await expect(
			run('SERVER_ERROR', build({ status: 500, method: 'GET' })),
		).resolves.toEqual({
			maxRetries: 2,
			retryStrategy: 'exponential_backoff',
		});
	});

	it('does not replay a 5xx on a write, which would spend another monthly call', () => {
		expect(
			matches('SERVER_ERROR', build({ status: 500, method: 'POST' })),
		).toBe(false);
	});

	it('matches everything in DEFAULT so it has to stay last', async () => {
		const error = build({ status: 418, method: 'GET' });
		expect(matches('DEFAULT', error)).toBe(true);
		await expect(run('DEFAULT', error)).resolves.toEqual({ maxRetries: 0 });
	});
});

describe('suitedash error classification', () => {
	it('separates auth from the exhausted allowance', () => {
		expect(matches('AUTH_ERROR', build({ status: 401 }))).toBe(true);
		expect(matches('RATE_LIMIT_ERROR', build({ status: 401 }))).toBe(false);
		expect(matches('RATE_LIMIT_ERROR', build({ status: 429 }))).toBe(true);
		expect(matches('AUTH_ERROR', build({ status: 429 }))).toBe(false);
	});
});
