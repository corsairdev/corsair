import type { CorsairErrorHandler, RetryStrategy } from 'corsair/core';
import { ApiError } from 'corsair/http';
import { MailssoAPIError, MailssoSubscriptionRequiredError } from './client';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';

const context = {
	pluginId: 'mailsso',
	operation: 'validations.single',
	input: {},
	originalError: new Error('test'),
};

/** Mirrors core/errors/handler.ts: the first key whose match passes wins. */
async function resolve(
	handlers: CorsairErrorHandler,
	error: Error,
): Promise<{ name: string | undefined; strategy: RetryStrategy | undefined }> {
	const name = Object.keys(handlers).find((key) =>
		handlers[key]?.match(error, context),
	);
	const strategy = await handlers[name ?? 'DEFAULT']?.handler(error, context);
	return { name, strategy };
}

function apiError(
	status: number,
	method: 'GET' | 'POST',
	message: string,
	retryAfter?: number,
): MailssoAPIError {
	return new MailssoAPIError(message, { status, method, retryAfter });
}

describe('error handlers', () => {
	it('keeps DEFAULT as the last key', () => {
		const keys = Object.keys(errorHandlers);
		expect(keys.at(-1)).toBe('DEFAULT');
		expect(new Set(keys).size).toBe(keys.length);
	});

	it('sends a paid-plan error to its own handler, ahead of AUTH_ERROR, and never retries it', async () => {
		const error = new MailssoSubscriptionRequiredError(
			'Paid subscription required to use list validations',
			{ status: 401, method: 'POST' },
		);

		const { name, strategy } = await resolve(errorHandlers, error);

		expect(name).toBe('SUBSCRIPTION_REQUIRED_ERROR');
		expect(strategy).toEqual({ maxRetries: 0 });
		// A plain 401 is the auth error, not the plan error.
		expect(
			(await resolve(errorHandlers, apiError(401, 'GET', 'Unauthorized'))).name,
		).toBe('AUTH_ERROR');
	});

	it('does not retry a bad key', async () => {
		const { name, strategy } = await resolve(
			errorHandlers,
			apiError(401, 'GET', 'Unauthorized'),
		);

		expect(name).toBe('AUTH_ERROR');
		expect(strategy).toEqual({ maxRetries: 0 });
	});

	it.each([
		[400, 'POST', 'Batch lists need at least 2 different emails.'],
		[400, 'GET', 'invalid job id'],
		[404, 'GET', 'the job does not exist'],
	] as const)(
		'does not retry a %s on a %s (%s)',
		async (status, method, message) => {
			const { name, strategy } = await resolve(
				errorHandlers,
				apiError(status, method, message),
			);

			expect(name).toBe('VALIDATION_ERROR');
			expect(strategy).toEqual({ maxRetries: 0 });
		},
	);

	it('does not retry a schema failure', async () => {
		const zodLike = new Error('bad');
		zodLike.name = 'ZodError';

		const { name, strategy } = await resolve(errorHandlers, zodLike);

		expect(name).toBe('VALIDATION_ERROR');
		expect(strategy).toEqual({ maxRetries: 0 });
	});

	it('retries a 429 three times with backoff when there is no Retry-After', async () => {
		const { name, strategy } = await resolve(
			errorHandlers,
			apiError(429, 'GET', 'Slow down'),
		);

		expect(name).toBe('RATE_LIMIT_ERROR');
		expect(strategy).toEqual({
			maxRetries: 3,
			headersRetryAfterMs: undefined,
			retryStrategy: 'exponential_backoff',
		});
	});

	it('uses the Retry-After the client read', async () => {
		const { strategy } = await resolve(
			errorHandlers,
			apiError(429, 'GET', 'Slow down', 7000),
		);

		expect(strategy?.headersRetryAfterMs).toBe(7000);
		expect(strategy?.maxRetries).toBe(3);
	});

	it('recognises a 429 that arrives as an ApiError cause', async () => {
		const cause = new ApiError(
			{ method: 'GET', url: '/v1/validate' },
			{
				url: 'https://api.mails.so/v1/validate',
				ok: false,
				status: 429,
				statusText: 'Too Many Requests',
				body: { data: null, error: 'Slow down' },
			},
			'Too Many Requests',
			{ retryAfter: 2000 },
		);

		const { name, strategy } = await resolve(
			errorHandlers,
			new MailssoAPIError('Slow down', { cause }),
		);

		expect(name).toBe('RATE_LIMIT_ERROR');
		expect(strategy?.headersRetryAfterMs).toBe(2000);
	});

	it('retries a 5xx on a read, twice, with backoff', async () => {
		const { name, strategy } = await resolve(
			errorHandlers,
			apiError(500, 'GET', 'failed to check job status'),
		);

		expect(name).toBe('SERVER_ERROR');
		expect(strategy).toEqual({
			maxRetries: 2,
			retryStrategy: 'exponential_backoff',
		});
	});

	it('does not replay a write on a 5xx', async () => {
		for (const status of [500, 502, 503]) {
			const { name, strategy } = await resolve(
				errorHandlers,
				apiError(status, 'POST', 'Server error'),
			);
			expect(name).toBe('DEFAULT');
			expect(strategy).toEqual({ maxRetries: 0 });
		}
	});

	it('retries a dropped connection on a read but not on a write', async () => {
		const read = await resolve(
			errorHandlers,
			new MailssoAPIError('fetch failed', { method: 'GET', transport: true }),
		);
		const write = await resolve(
			errorHandlers,
			new MailssoAPIError('fetch failed', { method: 'POST', transport: true }),
		);

		expect(read.name).toBe('NETWORK_ERROR');
		expect(read.strategy?.maxRetries).toBe(2);
		expect(write.name).toBe('DEFAULT');
		expect(write.strategy).toEqual({ maxRetries: 0 });
	});

	it('does not retry a 200 whose body carried an error', async () => {
		const { name, strategy } = await resolve(
			errorHandlers,
			apiError(200, 'GET', 'Something went wrong.'),
		);

		expect(name).toBe('DEFAULT');
		expect(strategy).toEqual({ maxRetries: 0 });
	});

	it('lets DEFAULT claim an error nothing else matches', async () => {
		const { name } = await resolve(errorHandlers, new Error('anything'));

		expect(name).toBe('DEFAULT');
	});
});

describe('mergeErrorHandlers', () => {
	it('returns the builtins when the caller passes nothing', () => {
		expect(mergeErrorHandlers(errorHandlers, undefined)).toBe(errorHandlers);
	});

	it('runs a caller handler for a status no builtin covers before DEFAULT', async () => {
		const custom: CorsairErrorHandler = {
			TEAPOT_ERROR: {
				match: (error) =>
					error instanceof MailssoAPIError && error.status === 418,
				handler: async () => ({ maxRetries: 9 }),
			},
		};
		const merged = mergeErrorHandlers(errorHandlers, custom);

		const { name, strategy } = await resolve(
			merged,
			apiError(418, 'GET', 'teapot'),
		);

		expect(name).toBe('TEAPOT_ERROR');
		expect(strategy).toEqual({ maxRetries: 9 });
	});

	it('lets a caller override a builtin by name, keeping the caller entry', async () => {
		const custom: CorsairErrorHandler = {
			AUTH_ERROR: {
				match: (error) =>
					error instanceof MailssoAPIError && error.status === 401,
				handler: async () => ({ maxRetries: 1 }),
			},
		};
		const merged = mergeErrorHandlers(errorHandlers, custom);

		const { strategy } = await resolve(
			merged,
			apiError(401, 'GET', 'Unauthorized'),
		);

		expect(strategy).toEqual({ maxRetries: 1 });
	});

	it('puts caller keys first, then builtins, then DEFAULT last', () => {
		const custom: CorsairErrorHandler = {
			TEAPOT_ERROR: {
				match: () => false,
				handler: async () => ({ maxRetries: 0 }),
			},
		};

		const keys = Object.keys(mergeErrorHandlers(errorHandlers, custom));

		expect(keys[0]).toBe('TEAPOT_ERROR');
		expect(keys.at(-1)).toBe('DEFAULT');
		expect(keys).toEqual(['TEAPOT_ERROR', ...Object.keys(errorHandlers)]);
	});

	it('keeps DEFAULT last even when the caller supplies one', async () => {
		const custom: CorsairErrorHandler = {
			DEFAULT: { match: () => true, handler: async () => ({ maxRetries: 5 }) },
			TEAPOT_ERROR: {
				match: () => false,
				handler: async () => ({ maxRetries: 0 }),
			},
		};
		const merged = mergeErrorHandlers(errorHandlers, custom);

		expect(Object.keys(merged).at(-1)).toBe('DEFAULT');
		const { name, strategy } = await resolve(merged, new Error('anything'));
		expect(name).toBe('DEFAULT');
		expect(strategy).toEqual({ maxRetries: 5 });
	});
});
