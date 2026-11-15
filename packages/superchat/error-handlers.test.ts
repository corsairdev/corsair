import type { CorsairErrorHandler } from 'corsair/core';
import { SuperchatAPIError } from './client';
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
	return new SuperchatAPIError(`Superchat ${options.status}`, {
		status: options.status,
		method: options.method,
		retryAfter: options.retryAfter,
		body: options.body,
	});
}

const context = (error: Error) => ({
	pluginId: 'superchat',
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

describe('superchat error handlers', () => {
	it('retries a 429 three times and keeps the Retry-After value', async () => {
		const result = await run(
			'RATE_LIMIT_ERROR',
			build({ status: 429, retryAfter: 6000 }),
		);

		expect(result).toMatchObject({
			maxRetries: 3,
			headersRetryAfterMs: 6000,
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

	it('matches a 403 as auth, not as a missing scope', () => {
		// Superchat uses 403 for a key it does not recognise, so this must not
		// fall through to a permission handler that does not exist here.
		expect(matches('AUTH_ERROR', build({ status: 403 }))).toBe(true);
	});

	it('does not retry a 404', async () => {
		await expect(
			run('NOT_FOUND_ERROR', build({ status: 404 })),
		).resolves.toEqual({ maxRetries: 0 });
	});

	it.each([400, 405, 422])('does not retry a %i', async (status) => {
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

	it('does not replay a 5xx on a write, because a message may already have been delivered', () => {
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

describe('superchat error classification', () => {
	it('reads the code and user message from the envelope', () => {
		const error = build({
			status: 405,
			body: {
				exception: 'ApplicationException',
				exceptionCode: 'MethodNotAllowedException',
				userErrorMessage: 'Methode nicht erlaubt',
			},
		});

		expect(error.code).toBe('MethodNotAllowedException');
		expect(error.userMessage).toBe('Methode nicht erlaubt');
		// A 405 is neither auth nor not-found; it means the base lost its v1.0.
		expect(error.isAuthError).toBe(false);
		expect(error.isNotFound).toBe(false);
	});

	it('reads a NotFoundException code as not found even without a 404', () => {
		expect(
			build({ status: 400, body: { exceptionCode: 'NotFoundException' } })
				.isNotFound,
		).toBe(true);
	});
});
