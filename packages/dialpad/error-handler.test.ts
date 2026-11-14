import type { ApiRequestOptions, ApiResult } from 'corsair/http';
import { ApiError } from 'corsair/http';
import { errorHandlers } from './error-handlers';
import { dialpad } from './index';

function apiError(status: number, retryAfter?: number): ApiError {
	const request: ApiRequestOptions = {
		method: 'GET',
		url: '/api/v2/company',
	};
	const response: ApiResult = {
		url: 'https://dialpad.com/api/v2/company',
		ok: false,
		status,
		statusText: 'provider error',
		body: { message: 'provider error' },
	};
	return new ApiError(
		request,
		response,
		`Dialpad HTTP ${status}`,
		retryAfter === undefined ? undefined : { retryAfter },
	);
}

describe('Dialpad provider error handlers', () => {
	it('captures 429 and Retry-After while leaving retries disabled', async () => {
		const error = apiError(429, 4000);

		expect(errorHandlers.RATE_LIMIT_ERROR.match(error)).toBe(true);
		expect(await errorHandlers.RATE_LIMIT_ERROR.handler()).toEqual({
			maxRetries: 0,
		});
		expect(error.retryAfter).toBe(4000);
	});

	it.each([401, 403])(
		'handles authentication/permission HTTP %s',
		async (status) => {
			const error = apiError(status);

			expect(errorHandlers.AUTH_ERROR.match(error)).toBe(true);
			expect(await errorHandlers.AUTH_ERROR.handler()).toEqual({
				maxRetries: 0,
			});
		},
	);

	it.each([400, 422])('handles request validation HTTP %s', (status) => {
		expect(errorHandlers.VALIDATION_ERROR.match(apiError(status))).toBe(true);
	});

	it('handles 404 and 5xx without retrying side-effecting calls', async () => {
		expect(errorHandlers.NOT_FOUND_ERROR.match(apiError(404))).toBe(true);
		expect(errorHandlers.SERVER_ERROR.match(apiError(500))).toBe(true);
		expect(await errorHandlers.SERVER_ERROR.handler()).toEqual({
			maxRetries: 0,
		});
	});

	it('keeps the catch-all handler last after custom handlers are merged', () => {
		const plugin = dialpad({
			errorHandlers: {
				CUSTOM_ERROR: {
					match: () => false,
					handler: async () => ({ maxRetries: 0 }),
				},
			},
		});
		const handlers = plugin.errorHandlers;
		if (!handlers) throw new Error('Expected plugin error handlers');

		expect(Object.keys(handlers).at(-1)).toBe('DEFAULT');
		expect(handlers.CUSTOM_ERROR).toBeDefined();
	});
});
