import type { CorsairErrorHandler } from 'corsair/core';
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

function apiError(
	status: number,
	options: {
		transport?: boolean;
		method?: string;
		credentialsRejected?: boolean;
		fieldErrors?: { property: string; error: string }[];
	} = {},
) {
	return new PrismicAPIError(`Prismic ${status}`, {
		status,
		method: 'GET',
		...options,
	});
}

function route(error: Error): string {
	const match = Object.entries(HANDLERS).find(([, entry]) =>
		entry?.match(error, { ...CONTEXT, originalError: error }),
	);
	if (!match) throw new Error('no handler matched');
	return match[0];
}

describe('Prismic errorHandlers', () => {
	it('routes a rejected credential to AUTH_ERROR without a retry', async () => {
		const error = apiError(401, { credentialsRejected: true });

		expect(route(error)).toBe('AUTH_ERROR');
		await expect(HANDLERS.AUTH_ERROR?.handler(error, CONTEXT)).resolves.toEqual(
			{
				maxRetries: 0,
			},
		);
	});

	it('stops a bare 401 at UNAUTHORIZED_ERROR, which a missing repository answers', () => {
		expect(route(apiError(401))).toBe('UNAUTHORIZED_ERROR');
	});

	it('routes a 429 to RATE_LIMIT_ERROR with a one-second floor', async () => {
		const error = apiError(429);

		expect(route(error)).toBe('RATE_LIMIT_ERROR');
		await expect(
			HANDLERS.RATE_LIMIT_ERROR?.handler(error, CONTEXT),
		).resolves.toEqual({
			maxRetries: 3,
			headersRetryAfterMs: undefined,
			retryStrategy: 'linear_1s',
		});
	});

	it('keeps a Retry-After when the rate limiter sends one', async () => {
		const error = new PrismicAPIError('Prismic 429', {
			status: 429,
			method: 'POST',
			retryAfter: 2000,
		});

		const result = await HANDLERS.RATE_LIMIT_ERROR?.handler(error, CONTEXT);
		expect(result?.headersRetryAfterMs).toBe(2000);
	});

	it('routes a field-error body to VALIDATION_ERROR even without a status', async () => {
		// The Migration API reports bad fields in the body; the status may be 400
		// or absent from a proxy, and either way the request must change.
		const error = apiError(400, {
			fieldErrors: [{ property: 'title', error: 'must be a string' }],
		});

		expect(route(error)).toBe('VALIDATION_ERROR');
		await expect(
			HANDLERS.VALIDATION_ERROR?.handler(error, CONTEXT),
		).resolves.toEqual({ maxRetries: 0 });
	});

	it('routes 404 and 422 to VALIDATION_ERROR with no retry', async () => {
		for (const status of [404, 422]) {
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
		const write = new PrismicAPIError('Prismic 503', {
			status: 503,
			method: 'PUT',
		});

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
