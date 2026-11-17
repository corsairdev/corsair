import type { OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';
import { THINKIFIC_API_BASE, THINKIFIC_RATE_LIMIT_CONFIG } from './client';
import { errorHandlers } from './error-handlers';
import { thinkific } from './index';

function apiError(status: number): ApiError {
	return new ApiError(
		{ method: 'GET', url: '/courses' },
		{
			url: `${THINKIFIC_API_BASE}/courses`,
			ok: false,
			status,
			statusText: 'Thinkific error',
			body: { error: 'Request failed' },
		},
		`Thinkific API request failed with status ${status}`,
		{ retryAfter: 1500, rateLimitReset: Date.now() + 1500 },
	);
}

describe('Thinkific error handling', () => {
	afterEach(() => {
		jest.restoreAllMocks();
	});

	it('recognizes 429 and leaves retries to the transport', async () => {
		const error = apiError(429);
		expect(errorHandlers.RATE_LIMIT_ERROR.match(error)).toBe(true);
		await expect(errorHandlers.RATE_LIMIT_ERROR.handler()).resolves.toEqual({
			maxRetries: 0,
		});
		expect(error.retryAfter).toBe(1500);
	});

	it('uses the official RateLimit-Reset header to populate retry timing', async () => {
		const resetAt = Math.floor(Date.now() / 1000) + 60;
		jest.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
			new Response(JSON.stringify({ error: 'Too many requests' }), {
				status: 429,
				headers: {
					'Content-Type': 'application/json',
					'RateLimit-Reset': String(resetAt),
				},
			}),
		);
		const config: OpenAPIConfig = {
			BASE: THINKIFIC_API_BASE,
			VERSION: 'v1',
			WITH_CREDENTIALS: false,
			CREDENTIALS: 'omit',
		};

		// `unknown` because the actual transport rejects with a rate-limit error or another runtime value.
		const failure: unknown = await request(
			config,
			{ method: 'GET', url: 'courses' },
			{
				rateLimitConfig: {
					...THINKIFIC_RATE_LIMIT_CONFIG,
					maxRetries: 0,
				},
			},
		).catch((caught: unknown) => caught);

		if (!(failure instanceof ApiError)) {
			throw new Error('Expected the shared transport to expose ApiError');
		}
		expect(failure.status).toBe(429);
		expect(failure.rateLimitReset).toBe(resetAt * 1000);
		expect(failure.retryAfter).toBeGreaterThan(0);
	});

	it.each([401, 403])(
		'does not retry authentication status %s',
		async (status) => {
			const error = apiError(status);
			expect(errorHandlers.AUTH_ERROR.match(error)).toBe(true);
			await expect(errorHandlers.AUTH_ERROR.handler()).resolves.toEqual({
				maxRetries: 0,
			});
		},
	);

	it.each([400, 422])('does not retry validation status %s', async (status) => {
		const error = apiError(status);
		expect(errorHandlers.BAD_REQUEST_ERROR.match(error)).toBe(true);
		await expect(errorHandlers.BAD_REQUEST_ERROR.handler()).resolves.toEqual({
			maxRetries: 0,
		});
	});

	it('does not retry 404 or other failures that could replay writes', async () => {
		const notFound = apiError(404);
		const serverError = apiError(500);
		expect(errorHandlers.NOT_FOUND_ERROR.match(notFound)).toBe(true);
		await expect(errorHandlers.NOT_FOUND_ERROR.handler()).resolves.toEqual({
			maxRetries: 0,
		});
		await expect(errorHandlers.DEFAULT.handler()).resolves.toEqual({
			maxRetries: 0,
		});
	});

	it('keeps the catch-all handler last', () => {
		expect(Object.keys(errorHandlers).at(-1)).toBe('DEFAULT');
	});

	it('allows callers to override built-in handlers while preserving DEFAULT', async () => {
		const callerAuthHandler = {
			match: (error: Error) => error.message === 'caller-specific auth failure',
			handler: async () => ({ maxRetries: 2 }),
		};
		const plugin = thinkific({
			errorHandlers: { AUTH_ERROR: callerAuthHandler },
		});
		const handlers = plugin.errorHandlers;
		if (!handlers) throw new Error('Expected Thinkific error handlers');
		const authHandler = handlers.AUTH_ERROR;
		if (!authHandler) throw new Error('Expected the caller auth handler');

		expect(authHandler).toBe(callerAuthHandler);
		expect(Object.keys(handlers).at(-1)).toBe('DEFAULT');
		const error = new Error('caller-specific auth failure');
		await expect(
			authHandler.handler(error, {
				pluginId: 'thinkific',
				operation: 'users.list',
				input: {},
				originalError: error,
			}),
		).resolves.toEqual({ maxRetries: 2 });
	});
});
