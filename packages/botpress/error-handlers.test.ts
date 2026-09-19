import type { ErrorContext } from 'corsair/core';
import { ApiError } from 'corsair/http';
import { errorHandlers } from './error-handlers';

function apiError(status: number, message = 'failed', retryAfter?: number) {
	return new ApiError(
		{ method: 'GET', url: '/v1/admin/workspaces' },
		{
			url: 'https://api.botpress.cloud/v1/admin/workspaces',
			ok: false,
			status,
			statusText: 'Error',
			body: { message },
		},
		message,
		{ retryAfter },
	);
}

function ctx(operation: string, error: Error): ErrorContext {
	return {
		pluginId: 'botpress',
		operation,
		input: {},
		originalError: error,
	};
}

beforeEach(() => {
	jest.spyOn(console, 'warn').mockImplementation(() => {});
	jest.spyOn(console, 'error').mockImplementation(() => {});
});

afterEach(() => {
	jest.restoreAllMocks();
});

describe('errorHandlers', () => {
	it('does not retry a 429 on a charge', async () => {
		const error = apiError(429, 'too many requests', 2000);
		const result = await errorHandlers.RATE_LIMIT_ERROR.handler(
			error,
			ctx('billing.chargeUnpaidInvoices', error),
		);

		expect(result).toEqual({ maxRetries: 0, headersRetryAfterMs: 2000 });
	});

	it('retries a 429 on a read', async () => {
		const error = apiError(429, 'too many requests', 2000);
		const result = await errorHandlers.RATE_LIMIT_ERROR.handler(
			error,
			ctx('workspaces.list', error),
		);

		expect(result).toEqual({ maxRetries: 3, headersRetryAfterMs: 2000 });
	});

	it('does not log provider error bodies', async () => {
		const secret = 'secret invoice payload xyz';
		const error = apiError(403, secret);
		await errorHandlers.PERMISSION_ERROR.handler(
			error,
			ctx('workspaces.get', error),
		);

		const logged = (console.warn as jest.Mock).mock.calls.join(' ');
		expect(logged).not.toContain(secret);
		expect(logged).toContain('status 403');
	});
});
