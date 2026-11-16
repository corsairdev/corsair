import type { CorsairErrorHandler } from 'corsair/core';
import { ApiError } from 'corsair/http';
import { SignpathAPIError } from './client';
import { errorHandlers as builtinHandlers } from './error-handlers';

// The literal map is narrower than the type core uses (its match takes a
// context argument), so widen once here rather than at each call site.
const errorHandlers: CorsairErrorHandler = builtinHandlers;

// HTTP failures reach the handlers as core's ApiError, as the client throws them.
function build(options: {
	status: number;
	method?: 'GET' | 'POST';
	retryAfter?: number;
}) {
	return new ApiError(
		{ method: options.method ?? 'GET', url: '/v1/org/Projects' },
		{
			url: 'https://app.signpath.io/Api/v1/org/Projects',
			ok: false,
			status: options.status,
			statusText: '',
			body: { title: 'error' },
		},
		`SignPath ${options.status}`,
		{ retryAfter: options.retryAfter },
	);
}

const context = (error: Error) => ({
	pluginId: 'signpath',
	operation: 'test',
	input: {},
	originalError: error,
});

// Picks the handler the way core does (first match in key order) and checks it
// is the expected one, so a broken matcher fails the test.
async function run(name: keyof typeof errorHandlers, error: Error) {
	const selected = Object.entries(errorHandlers).find(([, entry]) =>
		entry?.match(error, context(error)),
	);
	expect(selected?.[0]).toBe(name);
	const entry = errorHandlers[name];
	if (!entry) throw new Error(`missing handler ${name}`);
	return entry.handler(error, context(error));
}

describe('signpath error handlers', () => {
	it('retries a 429 three times with backoff and the Retry-After value', async () => {
		const result = await run(
			'RATE_LIMIT_ERROR',
			build({ status: 429, retryAfter: 2500 }),
		);

		expect(result).toMatchObject({
			maxRetries: 3,
			headersRetryAfterMs: 2500,
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

	it('does not retry a 401', async () => {
		await expect(run('AUTH_ERROR', build({ status: 401 }))).resolves.toEqual({
			maxRetries: 0,
		});
	});

	it('does not retry a 403', async () => {
		await expect(
			run('PERMISSION_ERROR', build({ status: 403 })),
		).resolves.toEqual({
			maxRetries: 0,
		});
	});

	it.each([400, 404, 410])('does not retry a %i', async (status) => {
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

	it('replays a 500 on a read', async () => {
		await expect(
			run('SERVER_ERROR', build({ status: 500, method: 'GET' })),
		).resolves.toEqual({
			maxRetries: 2,
			retryStrategy: 'exponential_backoff',
		});
	});

	it('does not replay a 500 on a write', async () => {
		const error = build({ status: 500, method: 'POST' });
		expect(
			errorHandlers.SERVER_ERROR?.match(error, {
				pluginId: 'signpath',
				operation: 'test',
				input: {},
				originalError: error,
			}),
		).toBe(false);
	});

	it('matches everything in DEFAULT so it has to stay last', async () => {
		const error = build({ status: 418, method: 'GET' });
		expect(
			errorHandlers.DEFAULT?.match(error, {
				pluginId: 'signpath',
				operation: 'test',
				input: {},
				originalError: error,
			}),
		).toBe(true);
		await expect(run('DEFAULT', error)).resolves.toEqual({ maxRetries: 0 });
	});
});

describe('signpath transport errors', () => {
	it('falls through to DEFAULT without a status', async () => {
		const error = new SignpathAPIError('fetch failed', { method: 'GET' });
		await expect(run('DEFAULT', error)).resolves.toEqual({ maxRetries: 0 });
	});
});
