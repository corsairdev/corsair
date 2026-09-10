import { makeContextSevenMcpRequest } from './client';
import { errorHandlers } from './error-handlers';

jest.mock('corsair/http', () => ({
	request: jest.fn(),
	ApiError: class extends Error {
		constructor(
			request: unknown,
			response: {
				url: string;
				status: number;
				statusText: string;
				body: unknown;
			},
			message: string,
			rateLimitInfo?: { retryAfter?: number },
		) {
			super(message);
			this.name = 'ApiError';
			this.url = response.url;
			this.status = response.status;
			this.statusText = response.statusText;
			this.body = response.body;
			this.request = request;
			this.retryAfter = rateLimitInfo?.retryAfter;
		}
		url: string;
		status: number;
		statusText: string;
		body: unknown;
		request: unknown;
		retryAfter?: number;
	},
}));

jest.mock('corsair/core', () => {
	const actual = jest.requireActual('corsair/core') as Record<string, unknown>;
	return {
		...actual,
		logEventFromContext: jest.fn(),
	};
});

import { ApiError, request } from 'corsair/http';

const mockRequest = jest.mocked(request);

const apiError = (status: number, statusText: string, retryAfter?: number) =>
	new ApiError(
		{ method: 'GET', url: '/test' },
		{
			url: 'https://context7.com/api/test',
			ok: false,
			status,
			statusText,
			body: {},
		},
		`Request failed with status ${status}`,
		{ retryAfter },
	);

describe('Context7 error handlers', () => {
	it('matches 429 ApiError as rate limit and does not retry at the binding layer', async () => {
		expect(
			errorHandlers.RATE_LIMIT_ERROR.match(apiError(429, 'Too Many')),
		).toBe(true);
		const decision = await errorHandlers.RATE_LIMIT_ERROR.handler();
		expect(decision.maxRetries).toBe(0);
	});

	it('matches 401 and 403 as auth errors', async () => {
		expect(errorHandlers.AUTH_ERROR.match(apiError(401, 'Unauthorized'))).toBe(
			true,
		);
		expect(errorHandlers.AUTH_ERROR.match(apiError(403, 'Forbidden'))).toBe(
			true,
		);
		const decision = await errorHandlers.AUTH_ERROR.handler();
		expect(decision.maxRetries).toBe(0);
	});

	it('matches invalid_api_key message text as auth', () => {
		expect(errorHandlers.AUTH_ERROR.match(new Error('invalid_api_key'))).toBe(
			true,
		);
	});

	it('keeps DEFAULT last', () => {
		const keys = Object.keys(errorHandlers);
		expect(keys[keys.length - 1]).toBe('DEFAULT');
	});

	it('has a catch-all DEFAULT handler that never retries', async () => {
		expect(errorHandlers.DEFAULT.match()).toBe(true);
		const decision = await errorHandlers.DEFAULT.handler();
		expect(decision.maxRetries).toBe(0);
	});

	it('makeContextSevenMcpRequest throws AuthMissingError when the api key is missing', async () => {
		const { AuthMissingError } = jest.requireActual('corsair/core') as {
			AuthMissingError: new (...args: unknown[]) => Error;
		};
		await expect(
			makeContextSevenMcpRequest('/v2/libs/search', ''),
		).rejects.toBeInstanceOf(AuthMissingError);
		expect(mockRequest).not.toHaveBeenCalled();
	});

	it('makeContextSevenMcpRequest preserves status and retryAfter from ApiError', async () => {
		mockRequest.mockRejectedValueOnce(apiError(429, 'Too Many', 2000));
		const error = await makeContextSevenMcpRequest(
			'/v2/libs/search',
			'k',
		).catch((e: unknown) => e);
		expect(error).toBeInstanceOf(ApiError);
		const api = error as InstanceType<typeof ApiError> & {
			status?: number;
			retryAfter?: number;
		};
		expect(api.status).toBe(429);
		expect(api.retryAfter).toBe(2000);
	});
});
