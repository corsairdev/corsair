import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';
import {
	BASIN_API_BASE,
	BASIN_RATE_LIMIT_CONFIG,
	BasinAPIError,
	makeBasinRequest,
} from '../client';

jest.mock('corsair/http', () => {
	const actual = jest.requireActual('corsair/http');
	return {
		...actual,
		request: jest.fn(),
	};
});

const mockedRequest = request as jest.MockedFunction<typeof request>;

describe('Basin client', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	describe('BasinAPIError', () => {
		it('constructs basic error with message and code', () => {
			const err = new BasinAPIError('Something went wrong', 'ERR_CODE');
			expect(err.name).toBe('BasinAPIError');
			expect(err.message).toBe('Something went wrong');
			expect(err.code).toBe('ERR_CODE');
			expect(err.status).toBeUndefined();
			expect(err.retryAfter).toBeUndefined();
		});

		it('extracts status, statusText, body, and retryAfter from ApiError cause', () => {
			const apiError = new ApiError(
				{ method: 'GET', url: '/forms' },
				{
					body: { error: 'Rate limit exceeded' },
					ok: false,
					status: 429,
					statusText: 'Too Many Requests',
					url: 'https://usebasin.com/api/v1/forms',
				},
				'Too Many Requests',
				{ retryAfter: 30 },
			);

			const err = new BasinAPIError(apiError.message, '429', {
				cause: apiError,
			});
			expect(err.name).toBe('BasinAPIError');
			expect(err.status).toBe(429);
			expect(err.statusText).toBe('Too Many Requests');
			expect(err.body).toEqual({ error: 'Rate limit exceeded' });
			expect(err.retryAfter).toBe(30);
		});
	});

	describe('makeBasinRequest', () => {
		it('formats default Authorization header with Token prefix', async () => {
			mockedRequest.mockResolvedValueOnce({ id: 1, name: 'Form 1' });

			const result = await makeBasinRequest('forms', 'my-api-key');

			expect(mockedRequest).toHaveBeenCalledTimes(1);
			const call = mockedRequest.mock.calls[0];
			expect(call).toBeDefined();
			const [config, requestOptions, extra] = call as [
				OpenAPIConfig,
				ApiRequestOptions,
				any,
			];
			expect(config.BASE).toBe(BASIN_API_BASE);
			expect((config.HEADERS as Record<string, string>)?.Authorization).toBe(
				'Token my-api-key',
			);
			expect(requestOptions.method).toBe('GET');
			expect(requestOptions.url).toBe('/forms');
			expect(extra?.rateLimitConfig).toEqual(BASIN_RATE_LIMIT_CONFIG);
			expect(result).toEqual({ id: 1, name: 'Form 1' });
		});

		// Basin accepts only `Token <key>`; a Bearer header returns 401
		// invalid_token. A key pasted in with either prefix is normalised so a
		// stored credential like "Bearer abc" cannot fail every request.
		it('normalises a prefixed apiKey to the Token scheme', async () => {
			mockedRequest.mockResolvedValueOnce({ id: 2 });

			await makeBasinRequest('forms', 'Bearer bearer-token-123');
			const call0 = mockedRequest.mock.calls[0] as [OpenAPIConfig, any, any];
			expect((call0[0].HEADERS as Record<string, string>)?.Authorization).toBe(
				'Token bearer-token-123',
			);

			await makeBasinRequest('forms', 'Token token-456');
			const call1 = mockedRequest.mock.calls[1] as [OpenAPIConfig, any, any];
			expect((call1[0].HEADERS as Record<string, string>)?.Authorization).toBe(
				'Token token-456',
			);

			await makeBasinRequest('forms', 'plain-key-789');
			const call2 = mockedRequest.mock.calls[2] as [OpenAPIConfig, any, any];
			expect((call2[0].HEADERS as Record<string, string>)?.Authorization).toBe(
				'Token plain-key-789',
			);
		});

		it('cleans leading slash in endpoint', async () => {
			mockedRequest.mockResolvedValueOnce({});
			await makeBasinRequest('/projects/123', 'key');
			const call = mockedRequest.mock.calls[0] as [any, ApiRequestOptions, any];
			expect(call[1].url).toBe('/projects/123');
		});

		it('passes query parameters for GET requests', async () => {
			mockedRequest.mockResolvedValueOnce([]);
			await makeBasinRequest('submissions', 'key', {
				method: 'GET',
				query: { page: 2, query: 'contact' },
			});

			const call = mockedRequest.mock.calls[0] as [any, ApiRequestOptions, any];
			expect(call[1].query).toEqual({ page: 2, query: 'contact' });
		});

		it('passes body for POST, PUT, and PATCH requests', async () => {
			mockedRequest.mockResolvedValueOnce({ id: 10 });
			await makeBasinRequest('forms', 'key', {
				method: 'POST',
				body: { name: 'New Form' },
			});
			const call0 = mockedRequest.mock.calls[0] as [
				any,
				ApiRequestOptions,
				any,
			];
			expect(call0[1].body).toEqual({
				name: 'New Form',
			});

			mockedRequest.mockResolvedValueOnce({ id: 10 });
			await makeBasinRequest('forms/10', 'key', {
				method: 'PUT',
				body: { name: 'Updated Form' },
			});
			const call1 = mockedRequest.mock.calls[1] as [
				any,
				ApiRequestOptions,
				any,
			];
			expect(call1[1].body).toEqual({
				name: 'Updated Form',
			});

			mockedRequest.mockResolvedValueOnce({ id: 10 });
			await makeBasinRequest('submissions/10', 'key', {
				method: 'PATCH',
				body: { spam: true },
			});
			const call2 = mockedRequest.mock.calls[2] as [
				any,
				ApiRequestOptions,
				any,
			];
			expect(call2[1].body).toEqual({ spam: true });
		});

		it('handles 204 No Content safely by returning success object', async () => {
			mockedRequest.mockResolvedValueOnce(undefined);
			const result = await makeBasinRequest('forms/123', 'key', {
				method: 'DELETE',
			});
			expect(result).toEqual({ success: true });
		});

		it('wraps ApiError into BasinAPIError preserving status and cause', async () => {
			const apiError = new ApiError(
				{ method: 'GET', url: '/forms' },
				{
					body: { error: 'Unauthorized' },
					ok: false,
					status: 401,
					statusText: 'Unauthorized',
					url: 'https://usebasin.com/api/v1/forms',
				},
				'Unauthorized',
			);
			mockedRequest.mockRejectedValueOnce(apiError);

			await expect(makeBasinRequest('forms', 'bad-key')).rejects.toThrow(
				BasinAPIError,
			);
		});

		it('wraps standard Error into BasinAPIError', async () => {
			mockedRequest.mockRejectedValueOnce(new Error('Network offline'));

			await expect(makeBasinRequest('forms', 'key')).rejects.toThrow(
				'Network offline',
			);
		});

		it('wraps unknown exceptions into BasinAPIError', async () => {
			mockedRequest.mockRejectedValueOnce('string error');

			await expect(makeBasinRequest('forms', 'key')).rejects.toThrow(
				'Unknown Basin error',
			);
		});
	});
});
