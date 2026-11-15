import { EmailOctopusAPIError } from './client';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';

function apiError(status: number, method = 'GET') {
	return new EmailOctopusAPIError(`EmailOctopus ${status}`, {
		status,
		method,
	});
}

async function strategy(name: keyof typeof errorHandlers, error: Error) {
	const handler = errorHandlers[name];
	const match = handler.match as (error: Error) => boolean;
	const run = handler.handler as (
		error: Error,
	) => Promise<{ maxRetries: number }>;
	expect(match(error)).toBe(true);
	return run(error);
}

describe('emailoctopus error handlers', () => {
	it('retries a 429 and keeps the Retry-After delay', async () => {
		const error = new EmailOctopusAPIError('limited', {
			status: 429,
			method: 'POST',
			retryAfter: 2000,
		});

		await expect(strategy('RATE_LIMIT_ERROR', error)).resolves.toEqual({
			maxRetries: 3,
			headersRetryAfterMs: 2000,
			retryStrategy: 'exponential_backoff',
		});
	});

	it.each([
		['AUTH_ERROR', 401],
		['PERMISSION_ERROR', 403],
		['CONFLICT_ERROR', 409],
		['VALIDATION_ERROR', 400],
		['VALIDATION_ERROR', 404],
		['VALIDATION_ERROR', 422],
	] as const)('does not retry %s (%s)', async (name, status) => {
		await expect(strategy(name, apiError(status, 'POST'))).resolves.toEqual({
			maxRetries: 0,
		});
	});

	it('retries a GET 500 and not a POST 500', async () => {
		await expect(
			strategy('SERVER_ERROR', apiError(500, 'GET')),
		).resolves.toEqual({
			maxRetries: 2,
			retryStrategy: 'exponential_backoff',
		});
		expect(
			(errorHandlers.SERVER_ERROR.match as (error: Error) => boolean)(
				apiError(500, 'POST'),
			),
		).toBe(false);
	});

	it('matches the first handler and keeps DEFAULT last after a merge', () => {
		const names = Object.keys(errorHandlers);
		expect(names.at(-1)).toBe('DEFAULT');
		const matchDefault = errorHandlers.DEFAULT.match as (
			error: Error,
		) => boolean;
		const matchRateLimit = errorHandlers.RATE_LIMIT_ERROR.match as (
			error: Error,
		) => boolean;
		expect(matchDefault(apiError(418))).toBe(true);
		expect(matchRateLimit(apiError(418))).toBe(false);

		const merged = mergeErrorHandlers(errorHandlers, {
			QUOTA_ERROR: {
				match: () => false,
				handler: async () => ({ maxRetries: 0 }),
			},
		});
		const mergedNames = Object.keys(merged);
		expect(mergedNames.at(-1)).toBe('DEFAULT');
		expect(mergedNames).toContain('QUOTA_ERROR');
		expect(mergedNames.indexOf('RATE_LIMIT_ERROR')).toBeLessThan(
			mergedNames.indexOf('DEFAULT'),
		);
	});
});
