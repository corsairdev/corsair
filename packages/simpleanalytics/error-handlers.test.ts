import type { CorsairErrorHandler } from 'corsair/core';
import { SimpleanalyticsAPIError } from './client';
import { errorHandlers as builtinHandlers } from './error-handlers';
import type { JsonObject } from './json';

// The literal map is narrower than the type core uses (its match takes a
// context argument), so widen once here rather than at each call site.
const errorHandlers: CorsairErrorHandler = builtinHandlers;

function build(options: {
	status?: number;
	method?: string;
	retryAfter?: number;
	body?: JsonObject;
}) {
	return new SimpleanalyticsAPIError(`Simple Analytics ${options.status}`, {
		status: options.status,
		method: options.method,
		retryAfter: options.retryAfter,
		body: options.body,
	});
}

const context = (error: Error) => ({
	pluginId: 'simpleanalytics',
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

describe('simpleanalytics error handlers', () => {
	it('retries a 429 three times and keeps the Retry-After value', async () => {
		const result = await run(
			'RATE_LIMIT_ERROR',
			build({ status: 429, retryAfter: 30000 }),
		);

		expect(result).toMatchObject({
			maxRetries: 3,
			headersRetryAfterMs: 30000,
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

	it('treats a body-level auth failure as an auth error', () => {
		const error = build({
			status: 400,
			body: { ok: false, error: 'No valid authorization' },
		});

		expect(matches('AUTH_ERROR', error)).toBe(true);
	});

	it('does not retry a key locked by failed attempts', () => {
		const error = build({
			status: 400,
			body: {
				ok: false,
				error: 'Too many failed attempts, please try again later',
			},
		});

		expect(matches('AUTH_ERROR', error)).toBe(true);
	});

	it('does not retry a 423 badge lock', async () => {
		await expect(
			run(
				'PERMISSION_ERROR',
				build({ status: 423, body: { ok: false, code: 'BADGE_REQUIRED' } }),
			),
		).resolves.toEqual({ maxRetries: 0 });
	});

	it('does not retry a 404', async () => {
		await expect(
			run('NOT_FOUND_ERROR', build({ status: 404 })),
		).resolves.toEqual({ maxRetries: 0 });
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

	it('replays a 5xx on a read', async () => {
		await expect(
			run('SERVER_ERROR', build({ status: 503, method: 'GET' })),
		).resolves.toEqual({
			maxRetries: 2,
			retryStrategy: 'exponential_backoff',
		});
	});

	it('does not replay a 5xx on a write', () => {
		expect(
			matches('SERVER_ERROR', build({ status: 503, method: 'POST' })),
		).toBe(false);
	});

	it('matches everything in DEFAULT so it has to stay last', async () => {
		const error = build({
			status: undefined,
			body: { ok: false, error: 'something else' },
		});
		expect(matches('DEFAULT', error)).toBe(true);
		await expect(run('DEFAULT', error)).resolves.toEqual({ maxRetries: 0 });
	});
});

describe('simpleanalytics error classification', () => {
	it('reads the reason and code from the body', () => {
		const error = build({
			status: 423,
			body: { ok: false, code: 'BADGE_REQUIRED', error: 'Badge required' },
		});

		expect(error.reason).toBe('Badge required');
		expect(error.code).toBe('BADGE_REQUIRED');
		expect(error.isBadgeRequired).toBe(true);
		expect(error.isAuthError).toBe(false);
	});
});
