import { AuthMissingError } from 'corsair/core';
import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';
import {
	GOSQUARED_API_BASE,
	GosquaredAPIError,
	makeGosquaredRequest,
	redactSensitiveData,
	sanitizeError,
} from './client';

jest.mock('corsair/http', () => {
	const actual = jest.requireActual('corsair/http');
	return {
		...actual,
		request: jest.fn(),
	};
});

const mockRequest = jest.mocked(request);

beforeEach(() => {
	mockRequest.mockReset();
});

describe('GoSquared client tests', () => {
	describe('makeGosquaredRequest', () => {
		it('passes api_key and site_token in query parameters to OpenAPI config', async () => {
			mockRequest.mockResolvedValue({ success: true });

			await makeGosquaredRequest('/now/v3/overview', 'test-key', {
				method: 'GET',
				siteToken: 'GSN-123456-X',
				query: { minimal: true },
			});

			expect(mockRequest).toHaveBeenCalledTimes(1);
			const [config, requestOptions] = mockRequest.mock.calls[0] ?? [];
			expect(config).toMatchObject({
				BASE: GOSQUARED_API_BASE,
				VERSION: '1.0.0',
				TIMEOUT: 30000,
			});
			expect(requestOptions).toMatchObject({
				method: 'GET',
				url: '/now/v3/overview',
				query: {
					api_key: 'test-key',
					site_token: 'GSN-123456-X',
					minimal: true,
				},
			});
		});

		it('supports keyless/public calls when apiKey is undefined', async () => {
			mockRequest.mockResolvedValue({ success: true });

			await makeGosquaredRequest('/now/v3/overview', undefined, {
				method: 'GET',
				query: { minimal: true },
			});

			expect(mockRequest).toHaveBeenCalledTimes(1);
			const [, requestOptions] = mockRequest.mock.calls[0] ?? [];
			expect(requestOptions?.query).not.toHaveProperty('api_key');
		});

		it('throws AuthMissingError when apiKey is explicitly empty', async () => {
			// `unknown` because catch variable has untyped error shape.
			const error = await makeGosquaredRequest('/account/v1/sites', '').catch(
				(caught: unknown) => caught,
			);

			expect(error).toBeInstanceOf(AuthMissingError);
			expect((error as AuthMissingError).pluginId).toBe('gosquared');
			expect((error as AuthMissingError).authType).toBe('api_key');
			expect(mockRequest).not.toHaveBeenCalled();
		});

		it('forwards JSON body on POST requests', async () => {
			mockRequest.mockResolvedValue({ success: true });

			const payload = {
				event: { name: 'Purchase' },
			};

			await makeGosquaredRequest('/tracking/v1/event', 'test-key', {
				method: 'POST',
				body: payload,
				siteToken: 'GSN-123',
			});

			expect(mockRequest).toHaveBeenCalledTimes(1);
			const [, requestOptions] = mockRequest.mock.calls[0] ?? [];
			expect(requestOptions).toMatchObject({
				method: 'POST',
				url: '/tracking/v1/event',
				body: payload,
				query: {
					api_key: 'test-key',
					site_token: 'GSN-123',
				},
			});
		});

		it('rethrows ApiError with sanitized payload', async () => {
			const apiErr = new ApiError(
				{
					method: 'POST',
					url: '/tracking/v1/event',
					body: {
						apiKey: 'super-secret-key',
						siteToken: 'secret-token',
						event: 'Click',
					},
				},
				{
					url: 'https://api.gosquared.com/tracking/v1/event',
					ok: false,
					status: 400,
					statusText: 'Bad Request',
					body: {
						message: 'Invalid parameter',
						apiKey: 'super-secret-key',
					},
				},
				'Bad Request',
			);

			mockRequest.mockRejectedValue(apiErr);

			// `unknown` because rejection reason is untyped before assertion.
			const caught = await makeGosquaredRequest(
				'/tracking/v1/event',
				'test-key',
			).catch((e: unknown) => e);

			expect(caught).toBeInstanceOf(ApiError);
			const sanitized = caught as ApiError;
			expect(sanitized.status).toBe(400);
			expect(sanitized.request.body).toEqual({
				apiKey: '[REDACTED]',
				siteToken: '[REDACTED]',
				event: 'Click',
			});
			expect(sanitized.body).toEqual({
				message: 'Invalid parameter',
				apiKey: '[REDACTED]',
			});
		});

		it('wraps generic non-Error rejections in GosquaredAPIError', async () => {
			mockRequest.mockRejectedValue('network failure');

			// `unknown` because non-error rejection has unknown type.
			const caught = await makeGosquaredRequest('/now/v3/pages', 'test').catch(
				(e: unknown) => e,
			);
			expect(caught).toBeInstanceOf(GosquaredAPIError);
			expect((caught as GosquaredAPIError).message).toBe('Unknown error');
		});
	});

	describe('redactSensitiveData', () => {
		it('redacts sensitive fields by name case-insensitively and regardless of delimiters', () => {
			const input = {
				api_key: 'secret1',
				apiKey: 'secret2',
				'site-token': 'token1',
				sitetoken: 'token2',
				password: 'pass',
				token: 'tok',
				safeField: 'visible',
				nested: {
					authorization: 'auth_header',
					secret: 'shh',
					name: 'safeName',
				},
				array: [{ secretaccesskey: 'key1' }, 'plainString'],
			};

			// `unknown` because redacted output retains arbitrary dictionary shape.
			const result = redactSensitiveData(input) as Record<string, unknown>;
			expect(result.api_key).toBe('[REDACTED]');
			expect(result.apiKey).toBe('[REDACTED]');
			expect(result['site-token']).toBe('[REDACTED]');
			expect(result.sitetoken).toBe('[REDACTED]');
			expect(result.password).toBe('[REDACTED]');
			expect(result.token).toBe('[REDACTED]');
			expect(result.safeField).toBe('visible');

			// `unknown` because nested object properties are dynamically shaped.
			const nested = result.nested as Record<string, unknown>;
			expect(nested.authorization).toBe('[REDACTED]');
			expect(nested.secret).toBe('[REDACTED]');
			expect(nested.name).toBe('safeName');

			// `unknown` because array elements contain arbitrary nested structures.
			const arr = result.array as unknown[];
			expect(arr[0]).toEqual({ secretaccesskey: '[REDACTED]' });
			expect(arr[1]).toBe('plainString');
		});

		it('handles primitives without alteration', () => {
			expect(redactSensitiveData('regular text')).toBe('regular text');
			expect(redactSensitiveData(42)).toBe(42);
			expect(redactSensitiveData(null)).toBeNull();
			expect(redactSensitiveData(undefined)).toBeUndefined();
		});
	});

	describe('sanitizeError', () => {
		it('preserves generic Error instances', () => {
			const baseErr = new Error('Generic failure');
			const sanitized = sanitizeError(baseErr);
			expect(sanitized).toBe(baseErr);
		});

		it('preserves ApiError status and rate-limit metadata while redacting bodies', () => {
			const apiErr = new ApiError(
				{ method: 'GET', url: '/now/v3/overview' },
				{
					url: 'https://api.gosquared.com/now/v3/overview',
					ok: false,
					status: 429,
					statusText: 'Too Many Requests',
					body: { token: 'secret-val' },
				},
				'Too Many Requests',
				{ retryAfter: 4000 },
			);

			const sanitized = sanitizeError(apiErr) as ApiError;
			expect(sanitized.status).toBe(429);
			expect(sanitized.retryAfter).toBe(4000);
			expect(sanitized.body).toEqual({ token: '[REDACTED]' });
		});
	});

	describe('real transport rate-limit retryAfter parsing', () => {
		it('extracts retryAfter from 429 response via real corsair/http request', async () => {
			const realHttp = jest.requireActual('corsair/http') as {
				request: typeof request;
			};

			const mockResponse = new Response(
				JSON.stringify({ code: 4002, message: 'Rate limit exceeded' }),
				{
					status: 429,
					headers: {
						'Content-Type': 'application/json',
						'retry-after': '4',
					},
				},
			);

			const originalFetch = global.fetch;
			global.fetch = jest.fn().mockResolvedValue(mockResponse);

			try {
				const config: OpenAPIConfig = {
					BASE: 'https://api.gosquared.com',
					VERSION: '1.0.0',
					WITH_CREDENTIALS: false,
					CREDENTIALS: 'omit',
				};
				const requestOptions: ApiRequestOptions = {
					method: 'GET',
					url: '/now/v3/overview',
				};

				// `unknown` because request rejection type is untyped before verification.
				const error = await realHttp
					.request(config, requestOptions, {
						rateLimitConfig: {
							enabled: true,
							maxRetries: 0,
							initialRetryDelay: 0,
							backoffMultiplier: 1,
							headerNames: { retryAfter: 'retry-after' },
						},
					})
					.catch((caught: unknown) => caught);

				expect(error).toBeInstanceOf(ApiError);
				const apiError = error as ApiError;
				expect(apiError.status).toBe(429);
				expect(apiError.retryAfter).toBe(4000);
				expect(global.fetch).toHaveBeenCalledTimes(1);
			} finally {
				global.fetch = originalFetch;
			}
		});
	});
});
