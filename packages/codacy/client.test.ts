import {
	CodacyAPIError,
	getCodacyBaseUrl,
	getCodacyCredentials,
	makeCodacyRequest,
	tryGetStoredValue,
} from './client';

describe('getCodacyBaseUrl', () => {
	it('builds the v3 URL', () => {
		expect(getCodacyBaseUrl()).toBe('https://api.codacy.com/api/v3');
	});
});

describe('tryGetStoredValue', () => {
	it('returns the value when the getter resolves', async () => {
		const value = await tryGetStoredValue(() => Promise.resolve('test-value'));
		expect(value).toBe('test-value');
	});

	it('returns undefined when the getter resolves to null', async () => {
		const value = await tryGetStoredValue(() => Promise.resolve(null));
		expect(value).toBeUndefined();
	});

	it('returns undefined when the getter resolves to undefined', async () => {
		const value = await tryGetStoredValue(() => Promise.resolve(undefined));
		expect(value).toBeUndefined();
	});

	it('swallows the "no dek found" error (account has no DEK yet)', async () => {
		const error = new Error(
			'No DEK found for account (tenant: "default", integration: "codacy")',
		);
		const value = await tryGetStoredValue(() => Promise.reject(error));
		expect(value).toBeUndefined();
	});

	it('propagates any other error (decryption failure, db error, ...)', async () => {
		const boom = new Error('database is down');
		await expect(tryGetStoredValue(() => Promise.reject(boom))).rejects.toBe(
			boom,
		);
	});
});

describe('getCodacyCredentials', () => {
	it('uses the key from ctx', async () => {
		const ctx = {
			key: 'test-token',
		};
		const token = await getCodacyCredentials(ctx);
		expect(token).toBe('test-token');
	});

	it('throws AuthMissingError when no API key is present', async () => {
		const ctx = {
			key: undefined,
		};
		await expect(getCodacyCredentials(ctx)).rejects.toThrow(
			'[auth-missing:codacy:api_key]',
		);
	});
});

jest.mock('corsair/http', () => ({
	request: jest.fn(),
	ApiError: class MockApiError extends Error {
		public status: number;
		public statusText: string;
		// unknown: mirrors ApiError.body, the provider's raw error payload.
		public body: unknown;
		public retryAfter?: number;

		constructor(
			_request: { method: string; url: string },
			response: {
				status: number;
				statusText: string;
				// unknown: mirrors ApiResult.body, the raw response payload.
				body: unknown;
				url: string;
			},
			message: string,
			rateLimitInfo?: { retryAfter?: number },
		) {
			super(message);
			this.name = 'ApiError';
			this.status = response.status;
			this.statusText = response.statusText;
			this.body = response.body;
			this.retryAfter = rateLimitInfo?.retryAfter;
		}
		isRateLimitError() {
			return this.status === 429;
		}
	},
}));

import { ApiError, request } from 'corsair/http';

const mockRequest = jest.mocked(request);

/** Awaits a call that should fail and returns its CodacyAPIError. */
async function rejectionOf(promise: Promise<unknown>): Promise<CodacyAPIError> {
	try {
		await promise;
	} catch (error) {
		if (error instanceof CodacyAPIError) return error;
		throw error;
	}
	throw new Error('expected the request to fail');
}

describe('makeCodacyRequest', () => {
	beforeEach(() => {
		mockRequest.mockReset();
	});

	it('sends the token in the api-token header (not Bearer)', async () => {
		mockRequest.mockResolvedValueOnce({ data: { id: 1 } });

		await makeCodacyRequest('/user', 'test-token', {});

		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({
				TOKEN: undefined,
				HEADERS: expect.objectContaining({
					'api-token': 'test-token',
				}),
			}),
			expect.objectContaining({
				method: 'GET',
				url: '/user',
			}),
			expect.anything(),
		);
	});

	it('passes cursor pagination query parameters through', async () => {
		mockRequest.mockResolvedValueOnce({ data: [] });

		await makeCodacyRequest('/user/organizations', 'token', {
			query: { cursor: 'abc123', limit: 10 },
		});

		expect(mockRequest).toHaveBeenCalledWith(
			expect.any(Object),
			expect.objectContaining({
				query: { cursor: 'abc123', limit: 10 },
				method: 'GET',
				url: '/user/organizations',
			}),
			expect.anything(),
		);
	});

	it('leaves 429 retries to RATE_LIMIT_ERROR but still reads Retry-After', async () => {
		mockRequest.mockResolvedValueOnce({ data: [] });

		await makeCodacyRequest('/tools', 'token');

		// One retry owner: the HTTP client makes a single attempt, and the
		// plugin's error handler retries up to three times (four requests).
		expect(mockRequest).toHaveBeenCalledWith(
			expect.any(Object),
			expect.any(Object),
			{
				rateLimitConfig: expect.objectContaining({
					enabled: true,
					maxRetries: 0,
					headerNames: { retryAfter: 'retry-after' },
				}),
			},
		);
	});

	it('wraps ApiError into CodacyAPIError preserving status and body', async () => {
		const apiError = new ApiError(
			{ method: 'GET', url: '/user' },
			{
				url: 'https://api.codacy.com/api/v3/user',
				ok: false,
				status: 429,
				statusText: 'Too Many Requests',
				body: { error: 'rate limit' },
			},
			'Too Many Requests',
			{ retryAfter: 5000 },
		);
		mockRequest.mockRejectedValueOnce(apiError);

		const error = await rejectionOf(makeCodacyRequest('/user', 'token', {}));

		expect(error.status).toBe(429);
		expect(error.statusText).toBe('Too Many Requests');
		expect(error.body).toEqual({ error: 'rate limit' });
	});

	it('wraps non-ApiError failures too', async () => {
		mockRequest.mockRejectedValueOnce(new Error('network down'));

		const error = await rejectionOf(makeCodacyRequest('/user', 'token', {}));

		expect(error.message).toContain('network down');
	});
});
