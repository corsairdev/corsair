import type { ErrorContext } from 'corsair/core';
import { NorthflankAPIError } from './client';
import { errorHandlers } from './error-handlers';

function rateLimitError(): NorthflankAPIError {
	return new NorthflankAPIError('Rate limit exceeded', { status: 429 });
}

function authError(status: number, message: string): NorthflankAPIError {
	return new NorthflankAPIError(message, { status });
}

function notFoundError(): NorthflankAPIError {
	return new NorthflankAPIError('Not Found', { status: 404 });
}

function serverError(): NorthflankAPIError {
	return new NorthflankAPIError('Bad Gateway', { status: 502 });
}

function operationContext(operation: string, error: Error): ErrorContext {
	return {
		pluginId: 'northflank',
		operation,
		input: {},
		originalError: error,
	};
}

describe('Northflank errorHandlers', () => {
	it('matches 429 rate limit errors and retries reads with backoff', async () => {
		const error = rateLimitError();
		expect(errorHandlers.RATE_LIMIT_ERROR.match(error)).toBe(true);

		const strategy = await errorHandlers.RATE_LIMIT_ERROR.handler(
			error,
			operationContext('projects.list', error),
		);
		expect(strategy).toEqual({
			maxRetries: 3,
			retryStrategy: 'exponential_backoff',
		});
	});

	it('does NOT retry 429 errors for write operations', async () => {
		const writeOperations = [
			'projects.create',
			'projects.createOrUpdate',
			'projects.update',
			'projects.delete',
			'secrets.create',
			'secrets.createOrUpdate',
			'secrets.patch',
			'secrets.update',
		];

		for (const operation of writeOperations) {
			const error = rateLimitError();
			const strategy = await errorHandlers.RATE_LIMIT_ERROR.handler(
				error,
				operationContext(operation, error),
			);
			expect(strategy).toEqual({ maxRetries: 0 });
		}
	});

	it('matches 401 and 403 authentication errors without retry', async () => {
		const error401 = authError(401, 'Unauthorized');
		expect(errorHandlers.AUTH_ERROR.match(error401)).toBe(true);
		await expect(errorHandlers.AUTH_ERROR.handler(error401)).resolves.toEqual({
			maxRetries: 0,
		});

		const error403 = authError(403, 'Forbidden');
		expect(errorHandlers.AUTH_ERROR.match(error403)).toBe(true);
		await expect(errorHandlers.AUTH_ERROR.handler(error403)).resolves.toEqual({
			maxRetries: 0,
		});
	});

	it('matches auth failures by message when status is missing', async () => {
		const error = new NorthflankAPIError('Invalid authentication token');
		expect(errorHandlers.AUTH_ERROR.match(error)).toBe(true);
	});

	it('matches 404 not found errors without retry', async () => {
		const error = notFoundError();
		expect(errorHandlers.NOT_FOUND_ERROR.match(error)).toBe(true);
		await expect(errorHandlers.NOT_FOUND_ERROR.handler(error)).resolves.toEqual(
			{ maxRetries: 0 },
		);
	});

	it('retries 5xx server errors for reads but not writes', async () => {
		const readError = serverError();
		expect(errorHandlers.SERVER_ERROR.match(readError)).toBe(true);
		await expect(
			errorHandlers.SERVER_ERROR.handler(
				readError,
				operationContext('projects.list', readError),
			),
		).resolves.toEqual({
			maxRetries: 2,
			retryStrategy: 'exponential_backoff',
		});

		const writeError = serverError();
		await expect(
			errorHandlers.SERVER_ERROR.handler(
				writeError,
				operationContext('projects.create', writeError),
			),
		).resolves.toEqual({ maxRetries: 0 });
	});

	it('catches generic errors in the default handler with 0 retries', async () => {
		const genericError = new Error('Something unexpected');
		expect(errorHandlers.DEFAULT.match(genericError)).toBe(true);
		await expect(errorHandlers.DEFAULT.handler(genericError)).resolves.toEqual({
			maxRetries: 0,
		});
	});
});
