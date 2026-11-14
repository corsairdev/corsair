import { AuthMissingError } from 'corsair/core';
import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';
import {
	HUBPLANNER_API_BASE,
	HubPlannerAPIError,
	makeHubPlannerRequest,
	redactInPlace,
} from './client';

jest.mock('corsair/http', () => {
	const actual = jest.requireActual('corsair/http');
	return {
		...actual,
		request: jest.fn(),
	};
});

const mockRequest = jest.mocked(request);

function createApiError(
	status: number,
	message: string,
	retryAfter?: number,
	apiKeyToEcho?: string,
): ApiError {
	const reqHeaders: Record<string, string> = {
		'Content-Type': 'application/json',
	};
	if (apiKeyToEcho) {
		reqHeaders.Authorization = apiKeyToEcho;
	}

	return new ApiError(
		{
			method: 'GET',
			url: '/project',
			headers: reqHeaders,
		},
		{
			url: 'https://app.hubplanner.com/api/v1/project',
			ok: false,
			status,
			statusText: message,
			body: apiKeyToEcho ? `Error occurred with key: ${apiKeyToEcho}` : message,
		},
		apiKeyToEcho ? `Request failed with key: ${apiKeyToEcho}` : message,
		retryAfter !== undefined ? { retryAfter } : undefined,
	);
}

beforeEach(() => {
	mockRequest.mockReset();
});

describe('makeHubPlannerRequest', () => {
	it('sends Authorization header with raw API key without Bearer prefix', async () => {
		mockRequest.mockResolvedValueOnce([{ _id: 'proj-1', name: 'Test' }]);

		await makeHubPlannerRequest('/project', 'test-api-key-12345', {
			method: 'GET',
			query: { page: 0, limit: 10 },
		});

		expect(mockRequest).toHaveBeenCalledTimes(1);
		const [config, requestOptions] = mockRequest.mock.calls[0] ?? [];
		expect(config).toMatchObject({
			BASE: HUBPLANNER_API_BASE,
			HEADERS: {
				Authorization: 'test-api-key-12345',
				'Content-Type': 'application/json',
				Accept: 'application/json',
			},
		});
		const headers = config?.HEADERS as Record<string, string> | undefined;
		expect(headers?.Authorization).not.toMatch(/^Bearer\s+/i);
		expect(requestOptions).toMatchObject({
			method: 'GET',
			url: '/project',
			query: { page: 0, limit: 10 },
		});
	});

	it('omits Authorization header when apiKey is undefined', async () => {
		mockRequest.mockResolvedValueOnce([]);

		await makeHubPlannerRequest('/categories', undefined, {
			method: 'GET',
		});

		expect(mockRequest).toHaveBeenCalledTimes(1);
		const [config] = mockRequest.mock.calls[0] ?? [];
		expect(config?.HEADERS).not.toHaveProperty('Authorization');
	});

	it('throws AuthMissingError when apiKey is an empty string without sending network request', async () => {
		await expect(
			makeHubPlannerRequest('/project', '', { method: 'GET' }),
		).rejects.toThrow(AuthMissingError);

		expect(mockRequest).not.toHaveBeenCalled();
	});

	it('redacts credentials in-place without replacing the ApiError instance', async () => {
		const sensitiveKey = 'super-secret-hubplanner-key';
		const rawApiError = createApiError(
			401,
			'Unauthorized',
			undefined,
			sensitiveKey,
		);
		mockRequest.mockRejectedValueOnce(rawApiError);

		// `unknown` because caught rejection is untyped at runtime; narrowed by expect/assertions below.
		let thrownError: unknown;
		try {
			await makeHubPlannerRequest('/project', sensitiveKey, { method: 'GET' });
		} catch (error: unknown) {
			// `unknown` because caught rejection is untyped at runtime; narrowed by expect/assertions below.
			thrownError = error;
		}

		expect(thrownError).toBe(rawApiError);
		expect(thrownError).toBeInstanceOf(ApiError);
		const sanitized = thrownError as ApiError;
		expect(sanitized.status).toBe(401);
		expect(sanitized.request.headers?.Authorization).toBe('[REDACTED]');
		expect(sanitized.message).not.toContain(sensitiveKey);
		expect(sanitized.message).toContain('[REDACTED]');
		expect(sanitized.body).not.toContain(sensitiveKey);
		expect(sanitized.body).toContain('[REDACTED]');
	});

	it('redacts credentials from message on generic Error instances', async () => {
		const sensitiveKey = 'secret-generic-key';
		const genericError = new Error(`Connection failed using ${sensitiveKey}`);
		mockRequest.mockRejectedValueOnce(genericError);

		// `unknown` because caught rejection is untyped at runtime; narrowed by expect/assertions below.
		let thrownError: unknown;
		try {
			await makeHubPlannerRequest('/project', sensitiveKey, { method: 'GET' });
		} catch (error: unknown) {
			// `unknown` because caught rejection is untyped at runtime; narrowed by expect/assertions below.
			thrownError = error;
		}

		expect(thrownError).toBe(genericError);
		expect((thrownError as Error).message).not.toContain(sensitiveKey);
		expect((thrownError as Error).message).toContain('[REDACTED]');
	});

	it('wraps unknown non-Error throws in HubPlannerAPIError', async () => {
		mockRequest.mockRejectedValueOnce('raw string error');

		await expect(
			makeHubPlannerRequest('/project', 'valid-key', { method: 'GET' }),
		).rejects.toThrow(HubPlannerAPIError);
	});

	it('preserves status and retryAfter on rate-limited responses', async () => {
		const rateLimited = createApiError(429, 'Too many requests', 5000);
		mockRequest.mockRejectedValueOnce(rateLimited);

		// `unknown` because caught rejection is untyped at runtime; narrowed by expect/assertions below.
		let thrownError: unknown;
		try {
			await makeHubPlannerRequest('/booking', 'valid-key', { method: 'GET' });
		} catch (error: unknown) {
			// `unknown` because caught rejection is untyped at runtime; narrowed by expect/assertions below.
			thrownError = error;
		}

		expect(thrownError).toBe(rateLimited);
		expect((thrownError as ApiError).status).toBe(429);
		expect((thrownError as ApiError).retryAfter).toBe(5000);
	});
});

describe('redactInPlace helper', () => {
	it('does nothing when apiKey is omitted or empty', () => {
		const err = new Error('Regular error message');
		redactInPlace(err, undefined);
		expect(err.message).toBe('Regular error message');
	});
});

describe('real transport Retry-After handling', () => {
	const realFetch = global.fetch;

	afterEach(() => {
		global.fetch = realFetch;
	});

	it('parses Retry-After header into retryAfter milliseconds using real transport', async () => {
		// Use live corsair/http request implementation against a mocked fetch
		// `unknown` because request() resolves with generic untyped API payloads
		const actualHttp = jest.requireActual('corsair/http') as {
			request: (
				config: OpenAPIConfig,
				options: ApiRequestOptions,
			) => Promise<unknown>;
		};

		let fetchCallCount = 0;
		global.fetch = jest.fn().mockImplementation(async () => {
			fetchCallCount++;
			return new Response(JSON.stringify({ message: 'Rate limit exceeded' }), {
				status: 429,
				statusText: 'Too Many Requests',
				headers: {
					'Content-Type': 'application/json',
					'Retry-After': '4',
				},
			});
		});

		const config: OpenAPIConfig = {
			BASE: 'https://app.hubplanner.com/api/v1',
			VERSION: '1.0.0',
			WITH_CREDENTIALS: false,
			CREDENTIALS: 'omit',
			HEADERS: {
				Authorization: 'test-key',
				'Content-Type': 'application/json',
			},
		};

		const requestOptions: ApiRequestOptions = {
			method: 'GET',
			url: '/project',
		};

		// `unknown` because caught rejection is untyped at runtime; narrowed by expect/assertions below.
		let caughtError: unknown;
		try {
			await actualHttp.request(config, requestOptions);
		} catch (error: unknown) {
			// `unknown` because caught rejection is untyped at runtime; narrowed by expect/assertions below.
			caughtError = error;
		}

		expect(caughtError).toBeInstanceOf(ApiError);
		const apiErr = caughtError as ApiError;
		expect(apiErr.status).toBe(429);
		// Core converts Retry-After: '4' (seconds) to 4000 milliseconds
		expect(apiErr.retryAfter).toBe(4000);
		// With default rate limiting configured, verify the request executed
		expect(fetchCallCount).toBeGreaterThanOrEqual(1);
	});
});
