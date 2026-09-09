import type { ErrorContext } from 'corsair/core';
import { ApiError } from 'corsair/http';
import { NorthflankAPIError } from './client';
import { errorHandlers } from './error-handlers';

describe('Northflank errorHandlers', () => {
	it('matches 429 rate limit errors and returns exponential backoff for read operations', async () => {
		const apiError = new ApiError(
			{ method: 'GET', url: 'https://api.northflank.com/v1/projects' },
			{
				url: 'https://api.northflank.com/v1/projects',
				status: 429,
				statusText: 'Too Many Requests',
				body: { message: 'Rate limit exceeded' },
				ok: false,
			},
			'Rate limit exceeded',
		);
		const error = new NorthflankAPIError(apiError.message, { cause: apiError });

		expect(errorHandlers.RATE_LIMIT_ERROR.match(error)).toBe(true);

		const readContext: ErrorContext = {
			pluginId: 'northflank',
			operation: 'projects.list',
			input: {},
			originalError: error,
		};
		const strategy = await errorHandlers.RATE_LIMIT_ERROR.handler(
			error,
			readContext,
		);
		expect(strategy).toEqual({
			maxRetries: 3,
			retryStrategy: 'exponential_backoff',
		});
	});

	it('does NOT retry 429 rate limit errors for write/mutating operations to prevent duplicate resources', async () => {
		const apiError = new ApiError(
			{ method: 'POST', url: 'https://api.northflank.com/v1/projects' },
			{
				url: 'https://api.northflank.com/v1/projects',
				status: 429,
				statusText: 'Too Many Requests',
				body: { message: 'Rate limit exceeded' },
				ok: false,
			},
			'Rate limit exceeded',
		);
		const error = new NorthflankAPIError(apiError.message, { cause: apiError });

		const writeOperations = [
			'projects.create',
			'projects.update',
			'services.createCombined',
			'services.updateCombined',
			'secrets.create',
			'secrets.update',
		];

		for (const operation of writeOperations) {
			const writeContext: ErrorContext = {
				pluginId: 'northflank',
				operation,
				input: {},
				originalError: error,
			};
			const strategy = await errorHandlers.RATE_LIMIT_ERROR.handler(
				error,
				writeContext,
			);
			expect(strategy).toEqual({ maxRetries: 0 });
		}
	});

	it('matches 401 and 403 authentication errors and does not retry', async () => {
		const apiError401 = new ApiError(
			{ method: 'GET', url: 'https://api.northflank.com/v1/projects' },
			{
				url: 'https://api.northflank.com/v1/projects',
				status: 401,
				statusText: 'Unauthorized',
				body: {},
				ok: false,
			},
			'Unauthorized',
		);
		const error401 = new NorthflankAPIError('Unauthorized', {
			cause: apiError401,
		});

		expect(errorHandlers.AUTH_ERROR.match(error401)).toBe(true);
		const strategy401 = await errorHandlers.AUTH_ERROR.handler(error401);
		expect(strategy401).toEqual({ maxRetries: 0 });

		const apiError403 = new ApiError(
			{ method: 'GET', url: 'https://api.northflank.com/v1/projects' },
			{
				url: 'https://api.northflank.com/v1/projects',
				status: 403,
				statusText: 'Forbidden',
				body: {},
				ok: false,
			},
			'Forbidden',
		);
		const error403 = new NorthflankAPIError('Forbidden', {
			cause: apiError403,
		});

		expect(errorHandlers.AUTH_ERROR.match(error403)).toBe(true);
		const strategy403 = await errorHandlers.AUTH_ERROR.handler(error403);
		expect(strategy403).toEqual({ maxRetries: 0 });
	});

	it('matches 404 not found errors and does not retry', async () => {
		const apiError = new ApiError(
			{
				method: 'GET',
				url: 'https://api.northflank.com/v1/projects/not-found',
			},
			{
				url: 'https://api.northflank.com/v1/projects/not-found',
				status: 404,
				statusText: 'Not Found',
				body: {},
				ok: false,
			},
			'Not Found',
		);
		const error = new NorthflankAPIError('Not Found', { cause: apiError });

		expect(errorHandlers.NOT_FOUND_ERROR.match(error)).toBe(true);
		const strategy = await errorHandlers.NOT_FOUND_ERROR.handler(error);
		expect(strategy).toEqual({ maxRetries: 0 });
	});

	it('matches 5xx server errors and retries with backoff for reads, but not writes', async () => {
		const apiError = new ApiError(
			{ method: 'GET', url: 'https://api.northflank.com/v1/projects' },
			{
				url: 'https://api.northflank.com/v1/projects',
				status: 502,
				statusText: 'Bad Gateway',
				body: {},
				ok: false,
			},
			'Bad Gateway',
		);
		const error = new NorthflankAPIError('Bad Gateway', { cause: apiError });

		expect(errorHandlers.SERVER_ERROR.match(error)).toBe(true);

		// Read operation -> retried
		const readContext: ErrorContext = {
			pluginId: 'northflank',
			operation: 'projects.list',
			input: {},
			originalError: error,
		};
		const strategy = await errorHandlers.SERVER_ERROR.handler(
			error,
			readContext,
		);
		expect(strategy).toEqual({
			maxRetries: 2,
			retryStrategy: 'exponential_backoff',
		});

		// Write operation -> NOT retried
		const writeContext: ErrorContext = {
			pluginId: 'northflank',
			operation: 'projects.create',
			input: {},
			originalError: error,
		};
		const writeStrategy = await errorHandlers.SERVER_ERROR.handler(
			error,
			writeContext,
		);
		expect(writeStrategy).toEqual({ maxRetries: 0 });
	});

	it('catches generic errors in default handler with 0 retries', async () => {
		const genericError = new Error('Something unexpected');
		expect(errorHandlers.DEFAULT.match(genericError)).toBe(true);
		const strategy = await errorHandlers.DEFAULT.handler(genericError);
		expect(strategy).toEqual({ maxRetries: 0 });
	});
});
