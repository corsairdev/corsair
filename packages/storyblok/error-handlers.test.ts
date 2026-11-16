import type { CorsairErrorHandler } from 'corsair/core';
import { ApiError } from 'corsair/http';
import { errorHandlers as builtinHandlers } from './error-handlers';

// The literal map is narrower than the type core uses (its match takes a
// context argument), so widen once here rather than at each call site.
const errorHandlers: CorsairErrorHandler = builtinHandlers;

// HTTP failures reach the handlers as core's ApiError, as the client throws them.
function build(options: {
	status: number;
	method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
	url?: string;
	retryAfter?: number;
}) {
	return new ApiError(
		{
			method: options.method ?? 'GET',
			url: options.url ?? '/v1/spaces/1/stories',
		},
		{
			url: 'https://mapi.storyblok.com/v1/spaces/1/stories',
			ok: false,
			status: options.status,
			statusText: '',
			body: { error: 'error' },
		},
		`Storyblok ${options.status}`,
		{ retryAfter: options.retryAfter },
	);
}

const context = (error: Error) => ({
	pluginId: 'storyblok',
	operation: 'test',
	input: {},
	originalError: error,
});

// Picks the handler the way core does (first match in key order), so a test
// fails when its handler's matcher stops matching.
async function run(name: keyof typeof errorHandlers, error: Error) {
	const selected = Object.entries(errorHandlers).find(([, entry]) =>
		entry?.match(error, context(error)),
	);
	expect(selected?.[0]).toBe(name);
	const entry = errorHandlers[name];
	if (!entry) throw new Error(`missing handler ${name}`);
	return entry.handler(error, context(error));
}

function matches(name: keyof typeof errorHandlers, error: Error) {
	return errorHandlers[name]?.match(error, context(error));
}

describe('storyblok error handlers', () => {
	it('retries a 429 three times and keeps the Retry-After value', async () => {
		const result = await run(
			'RATE_LIMIT_ERROR',
			build({ status: 429, retryAfter: 3000 }),
		);

		expect(result).toMatchObject({
			maxRetries: 3,
			headersRetryAfterMs: 3000,
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

	it('does not retry a 404', async () => {
		await expect(
			run('NOT_FOUND_ERROR', build({ status: 404 })),
		).resolves.toEqual({ maxRetries: 0 });
	});

	it.each([400, 409, 422])('does not retry a %i', async (status) => {
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

	it('does not replay a 5xx on a write', () => {
		expect(
			matches('SERVER_ERROR', build({ status: 500, method: 'POST' })),
		).toBe(false);
		expect(matches('SERVER_ERROR', build({ status: 500, method: 'PUT' }))).toBe(
			false,
		);
	});

	it('matches everything in DEFAULT so it has to stay last', async () => {
		const error = build({ status: 418, method: 'GET' });
		expect(matches('DEFAULT', error)).toBe(true);
		await expect(run('DEFAULT', error)).resolves.toEqual({ maxRetries: 0 });
	});
});

describe('storyblok publish and unpublish', () => {
	it.each(['publish', 'unpublish'])(
		'does not replay a 5xx on the %s GET, which changes state',
		(action) => {
			expect(
				matches(
					'SERVER_ERROR',
					build({
						status: 502,
						method: 'GET',
						url: `/v1/spaces/1/stories/2/${action}`,
					}),
				),
			).toBe(false);
		},
	);
});
