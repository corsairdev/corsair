import { DeployHQAPIError } from './client';
import { errorHandlers } from './error-handlers';
import { deployhq } from './index';

describe('DeployHQ error handling', () => {
	it('recognizes 429 and 503 and forwards Retry-After with no nested retries', async () => {
		const rateLimitHandler = errorHandlers.RATE_LIMIT_ERROR;
		for (const status of [429, 503]) {
			const error = new DeployHQAPIError('rate limited', status, 4_000);
			expect(rateLimitHandler.match(error)).toBe(true);
			await expect(rateLimitHandler.handler(error)).resolves.toEqual({
				maxRetries: 0,
				headersRetryAfterMs: 4_000,
			});
		}
	});

	it('routes authentication failures without retries', async () => {
		for (const status of [401, 403]) {
			const error = new DeployHQAPIError('authentication failed', status);
			expect(errorHandlers.AUTH_ERROR.match(error)).toBe(true);
			await expect(errorHandlers.AUTH_ERROR.handler()).resolves.toEqual({
				maxRetries: 0,
			});
		}
	});

	it('does not retry validation, missing-resource, or server errors by default', async () => {
		for (const status of [400, 404, 422, 500]) {
			const error = new DeployHQAPIError('request failed', status);
			expect(errorHandlers.DEFAULT.match()).toBe(true);
			await expect(errorHandlers.DEFAULT.handler()).resolves.toEqual({
				maxRetries: 0,
			});
			expect(errorHandlers.AUTH_ERROR.match(error)).toBe(false);
			expect(errorHandlers.RATE_LIMIT_ERROR.match(error)).toBe(false);
		}
	});

	it('keeps DEFAULT last so first-match dispatch preserves status-specific handling', () => {
		expect(Object.keys(errorHandlers).at(-1)).toBe('DEFAULT');
	});

	it('orders caller-specific handlers before built-ins and keeps DEFAULT last', () => {
		const plugin = deployhq({
			errorHandlers: {
				CUSTOM: {
					match: () => false,
					handler: async () => ({ maxRetries: 0 }),
				},
				DEFAULT: {
					match: () => true,
					handler: async () => ({ maxRetries: 0 }),
				},
			},
		});
		expect(Object.keys(plugin.errorHandlers ?? {})).toEqual([
			'CUSTOM',
			'RATE_LIMIT_ERROR',
			'AUTH_ERROR',
			'DEFAULT',
		]);
	});
});
