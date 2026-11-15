import type { CorsairErrorHandler } from 'corsair/core';
import { ApiError } from 'corsair/http';
import { PrismicAPIError } from './client';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';
import { prismic } from './index';

const CONTEXT = {
	pluginId: 'prismic',
	operation: 'documents.search',
	input: {},
	originalError: new Error('placeholder'),
};

// The exported map is a `satisfies` literal, so its members know only the
// arguments they use. Typing it as the core map is what the runtime sees.
const HANDLERS: CorsairErrorHandler = errorHandlers;

/** Core's ApiError for a Prismic answer, which is what the handlers see. */
function apiError(
	status: number,
	options: {
		method?: 'GET' | 'POST' | 'PUT';
		// unknown: each Prismic API sends a different error shape.
		body?: Untyped;
		retryAfter?: number;
	} = {},
) {
	return new ApiError(
		{ method: options.method ?? 'GET', url: '/documents/search' },
		{
			url: 'https://my-cafe.cdn.prismic.io/api/v2/documents/search',
			ok: false,
			status,
			statusText: 'error',
			body: options.body,
		},
		`Prismic ${status}`,
		{ retryAfter: options.retryAfter },
	);
}

type Untyped = unknown; // unknown: see the note above.

function route(error: Error): string {
	const match = Object.entries(HANDLERS).find(([, entry]) =>
		entry?.match(error, { ...CONTEXT, originalError: error }),
	);
	if (!match) throw new Error('no handler matched');
	return match[0];
}

describe('Prismic errorHandlers', () => {
	it('routes a rejected credential to AUTH_ERROR without a retry', async () => {
		const error = apiError(401, {
			body: { type: 'api_security_error', message: 'Invalid access token' },
		});

		expect(route(error)).toBe('AUTH_ERROR');
		await expect(HANDLERS.AUTH_ERROR?.handler(error, CONTEXT)).resolves.toEqual(
			{
				maxRetries: 0,
			},
		);
	});

	it("routes the Migration API's access-denied 403 to AUTH_ERROR", () => {
		const error = apiError(403, {
			method: 'POST',
			body: {
				Message:
					'User is not authorized to access this resource with an explicit deny in an identity-based policy',
			},
		});

		expect(route(error)).toBe('AUTH_ERROR');
	});

	it('routes a 429 to RATE_LIMIT_ERROR without a second round of retries', async () => {
		// Core's request() has already retried the 429 three times.
		const error = apiError(429);

		expect(route(error)).toBe('RATE_LIMIT_ERROR');
		await expect(
			HANDLERS.RATE_LIMIT_ERROR?.handler(error, CONTEXT),
		).resolves.toEqual({
			maxRetries: 0,
			headersRetryAfterMs: undefined,
		});
	});

	it('keeps a Retry-After when the rate limiter sends one', async () => {
		const error = apiError(429, { method: 'POST', retryAfter: 2000 });

		const result = await HANDLERS.RATE_LIMIT_ERROR?.handler(error, CONTEXT);
		expect(result?.headersRetryAfterMs).toBe(2000);
	});

	it('routes a field-error body to VALIDATION_ERROR whatever the status', async () => {
		// The Migration API reports bad fields in the body; whatever status a
		// proxy puts on it, the request must change.
		const error = apiError(409, {
			method: 'POST',
			body: [{ property: 'title', error: 'must be a string' }],
		});

		expect(route(error)).toBe('VALIDATION_ERROR');
		await expect(
			HANDLERS.VALIDATION_ERROR?.handler(error, CONTEXT),
		).resolves.toEqual({ maxRetries: 0 });
	});

	it('routes 400, 404 and 422 to VALIDATION_ERROR with no retry', async () => {
		for (const status of [400, 404, 422]) {
			expect(route(apiError(status))).toBe('VALIDATION_ERROR');
		}
	});

	it('routes a ZodError to VALIDATION_ERROR', () => {
		const zodError = Object.assign(new Error('invalid input'), {
			name: 'ZodError',
		});

		expect(route(zodError)).toBe('VALIDATION_ERROR');
	});

	it('replays a transport failure on a read but never on a migration write', async () => {
		const read = new PrismicAPIError('fetch failed', {
			method: 'GET',
			transport: true,
		});
		const write = new PrismicAPIError('fetch failed', {
			method: 'POST',
			transport: true,
		});

		expect(route(read)).toBe('NETWORK_ERROR');
		expect(route(write)).toBe('NETWORK_ERROR');
		await expect(
			HANDLERS.NETWORK_ERROR?.handler(read, CONTEXT),
		).resolves.toMatchObject({ maxRetries: 2 });
		await expect(
			HANDLERS.NETWORK_ERROR?.handler(write, CONTEXT),
		).resolves.toMatchObject({ maxRetries: 0 });
	});

	it('replays a 5xx on a read and refuses to on a write', async () => {
		const read = apiError(503);
		const write = apiError(503, { method: 'PUT' });

		expect(route(read)).toBe('SERVER_ERROR');
		await expect(
			HANDLERS.SERVER_ERROR?.handler(read, CONTEXT),
		).resolves.toMatchObject({ maxRetries: 2 });
		expect(route(write)).toBe('DEFAULT');
		await expect(HANDLERS.DEFAULT?.handler(write, CONTEXT)).resolves.toEqual({
			maxRetries: 0,
		});
	});

	it('routes an unrecognised error to DEFAULT with no retry', async () => {
		const error = new Error('something else');
		expect(route(error)).toBe('DEFAULT');
		await expect(HANDLERS.DEFAULT?.handler(error, CONTEXT)).resolves.toEqual({
			maxRetries: 0,
		});
	});
});

describe('mergeErrorHandlers', () => {
	it('puts caller keys first, keeps every builtin, and leaves DEFAULT last', () => {
		const caller = {
			match: (error: Error) => error.message.startsWith('custom_'),
			handler: async () => ({ maxRetries: 7 }),
		};
		const merged = prismic({ errorHandlers: { CUSTOM: caller } }).errorHandlers;
		if (!merged) throw new Error('errorHandlers missing');
		const keys = Object.keys(merged);

		expect(keys[0]).toBe('CUSTOM');
		expect(keys.at(-1)).toBe('DEFAULT');
		for (const name of Object.keys(HANDLERS)) {
			expect(keys).toContain(name);
		}
	});

	it('keeps a caller DEFAULT in the final position', () => {
		const callerDefault = {
			match: () => true,
			handler: async () => ({ maxRetries: 9 }),
		};
		const merged = mergeErrorHandlers(errorHandlers, {
			DEFAULT: callerDefault,
		});

		expect(Object.keys(merged).at(-1)).toBe('DEFAULT');
		expect(merged.DEFAULT).toBe(callerDefault);
	});
});
