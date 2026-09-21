import type { CodacyAPIError } from './client';
import {
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
		public body: unknown;
		public retryAfter?: number;

		constructor(
			request: any,
			response: {
				status: number;
				statusText: string;
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

import { request } from 'corsair/http';

const mockRequest = request as unknown as jest.Mock;

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
		);
	});

	it('wraps ApiError into CodacyAPIError preserving status and body', async () => {
		const { ApiError } = require('corsair/http');
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

		const error = (await makeCodacyRequest('/user', 'token', {}).catch(
			(e) => e,
		)) as CodacyAPIError;

		expect(error).toBeInstanceOf(require('./client').CodacyAPIError);
		expect(error.status).toBe(429);
		expect(error.statusText).toBe('Too Many Requests');
		expect(error.body).toEqual({ error: 'rate limit' });
	});

	it('wraps non-ApiError failures too', async () => {
		mockRequest.mockRejectedValueOnce(new Error('network down'));

		const error = (await makeCodacyRequest('/user', 'token', {}).catch(
			(e) => e,
		)) as CodacyAPIError;

		expect(error).toBeInstanceOf(require('./client').CodacyAPIError);
		expect(error.message).toContain('network down');
	});
});
