import { AuthMissingError } from 'corsair/core';
import { ApiError, request } from 'corsair/http';
import {
	FATHOM_API_BASE,
	FathomAPIError,
	makeFathomRequest,
	redactSensitiveData,
} from './client';

jest.mock('corsair/http', () => {
	const actual = jest.requireActual('corsair/http');
	return { ...actual, request: jest.fn() };
});

const mockRequest = jest.mocked(request);

function buildApiError(
	status: number,
	message: string,
	retryAfter?: number,
	// `unknown` because response body payload is untrusted.
	body: unknown = {},
) {
	return new ApiError(
		{ method: 'GET', url: '/account' },
		{
			url: 'https://api.usefathom.com/v1/account',
			ok: false,
			status,
			statusText: message,
			body,
		},
		message,
		retryAfter === undefined ? undefined : { retryAfter },
	);
}

beforeEach(() => {
	mockRequest.mockReset();
});

describe('makeFathomRequest', () => {
	it('sends Authorization: Bearer <apiKey> and Accept: application/json', async () => {
		mockRequest.mockResolvedValue({ id: 123, object: 'account' });

		await makeFathomRequest('/account', 'test-api-token-123', {
			method: 'GET',
		});

		expect(mockRequest).toHaveBeenCalledTimes(1);
		expect(mockRequest.mock.calls[0]?.[0]).toMatchObject({
			BASE: FATHOM_API_BASE,
			HEADERS: {
				Authorization: 'Bearer test-api-token-123',
				'Content-Type': 'application/json',
				Accept: 'application/json',
			},
		});
		expect(mockRequest.mock.calls[0]?.[1]).toEqual(
			expect.objectContaining({
				method: 'GET',
				url: '/account',
			}),
		);
	});

	it('throws AuthMissingError when apiKey is explicitly empty without network call', async () => {
		await expect(
			makeFathomRequest('/account', '', { method: 'GET' }),
		).rejects.toThrow(AuthMissingError);

		expect(mockRequest).not.toHaveBeenCalled();
	});

	it('throws AuthMissingError when apiKey is undefined without network call', async () => {
		await expect(
			makeFathomRequest('/account', undefined, { method: 'GET' }),
		).rejects.toThrow(AuthMissingError);

		expect(mockRequest).not.toHaveBeenCalled();
	});

	it('serializes object and array query parameters into JSON strings', async () => {
		mockRequest.mockResolvedValue([]);

		const filter = [{ property: 'pathname', operator: 'is', value: '/about' }];
		await makeFathomRequest('/aggregations', 'test-key', {
			method: 'GET',
			query: {
				entity: 'pageview',
				limit: 100,
				filters: filter,
			},
		});

		expect(mockRequest).toHaveBeenCalledTimes(1);
		expect(mockRequest.mock.calls[0]?.[1]?.query).toEqual({
			entity: 'pageview',
			limit: 100,
			filters: JSON.stringify(filter),
		});
	});

	it('forwards request body on POST and DELETE requests', async () => {
		mockRequest.mockResolvedValue({ id: 'site_1' });

		await makeFathomRequest('/sites', 'test-key', {
			method: 'POST',
			body: { name: 'Test Site' },
		});

		expect(mockRequest.mock.calls[0]?.[1]).toEqual(
			expect.objectContaining({
				method: 'POST',
				body: { name: 'Test Site' },
			}),
		);
	});

	it('redacts credentials and apiKey from thrown ApiError messages and bodies', async () => {
		const rawError = buildApiError(
			400,
			'Invalid request with token test-secret-token',
			undefined,
			{
				error: 'failed',
				password: 'my-super-secret-password',
				share_password: 'nested-share-password',
				token: 'test-secret-token',
			},
		);
		mockRequest.mockRejectedValue(rawError);

		// `unknown` because rejection value has no static type before caught.
		const error: unknown = await makeFathomRequest(
			'/sites',
			'test-secret-token',
			{
				method: 'POST',
				body: { name: 'Site' },
			},
		).catch((e: unknown) => e);

		expect(error).toBeInstanceOf(ApiError);
		const sanitized = error as ApiError;
		expect(sanitized.message).not.toContain('test-secret-token');
		expect(sanitized.message).toContain('[redacted]');
		expect(sanitized.body).toEqual({
			error: 'failed',
			password: '[redacted]',
			share_password: '[redacted]',
			token: '[redacted]',
		});
	});

	it('preserves status and retryAfter on rate limit ApiError', async () => {
		const rateLimitErr = buildApiError(429, 'Too Many Requests', 5000);
		mockRequest.mockRejectedValue(rateLimitErr);

		// `unknown` because rejection value has no static type before caught.
		const error: unknown = await makeFathomRequest(
			'/account',
			'test-token',
		).catch((e: unknown) => e);

		expect(error).toBeInstanceOf(ApiError);
		const apiErr = error as ApiError;
		expect(apiErr.status).toBe(429);
		expect(apiErr.retryAfter).toBe(5000);
	});

	it('wraps generic non-ApiError in FathomAPIError with sanitized message', async () => {
		mockRequest.mockRejectedValue(
			new Error('Network drop with test-token-secret'),
		);

		// `unknown` because rejection value has no static type before caught.
		const error: unknown = await makeFathomRequest(
			'/account',
			'test-token-secret',
		).catch((e: unknown) => e);

		expect(error).toBeInstanceOf(FathomAPIError);
		const fathomErr = error as FathomAPIError;
		expect(fathomErr.message).not.toContain('test-token-secret');
		expect(fathomErr.message).toContain('[redacted]');
	});
});

describe('redactSensitiveData helper', () => {
	it('redacts sensitive keys regardless of case and separators', () => {
		const input = {
			api_key: 'key1',
			apiKey: 'key2',
			'x-api-key': 'key3',
			share_password: 'pwd',
			SharePassword: 'pwd2',
			normal_field: 'safe_value',
			nested: {
				secret: 'supersecret',
				count: 42,
			},
		};

		// `unknown` because sanitized output is an untrusted JSON structure.
		const output: unknown = redactSensitiveData(input);
		expect(output).toEqual({
			api_key: '[redacted]',
			apiKey: '[redacted]',
			'x-api-key': '[redacted]',
			share_password: '[redacted]',
			SharePassword: '[redacted]',
			normal_field: 'safe_value',
			nested: {
				secret: '[redacted]',
				count: 42,
			},
		});
	});

	it('redacts occurrences of secret string inside text and arrays', () => {
		const input = ['Authorization Bearer secret123', 'safe'];
		// `unknown` because sanitized output is an untrusted JSON structure.
		const output: unknown = redactSensitiveData(input, 'secret123');
		expect(output).toEqual(['Authorization Bearer [redacted]', 'safe']);
	});
});

describe('real transport rate-limit test via jest.requireActual', () => {
	it('uses real transport with 429 and parses Retry-After header', async () => {
		const actualHttp =
			jest.requireActual<typeof import('corsair/http')>('corsair/http');

		const originalFetch = globalThis.fetch;
		try {
			globalThis.fetch = jest.fn().mockImplementation(() =>
				Promise.resolve({
					ok: false,
					status: 429,
					statusText: 'Too Many Requests',
					headers: new Headers({
						'retry-after': '4',
						'content-type': 'application/json',
					}),
					json: () => Promise.resolve({ error: 'Too Many Requests' }),
					text: () =>
						Promise.resolve(JSON.stringify({ error: 'Too Many Requests' })),
					clone() {
						return this;
					},
				}),
			);

			// `unknown` because rejection value has no static type before caught.
			const error: unknown = await actualHttp
				.request(
					{
						BASE: FATHOM_API_BASE,
						VERSION: '1.0.0',
						WITH_CREDENTIALS: false,
						CREDENTIALS: 'omit',
					},
					{
						method: 'GET',
						url: '/account',
					},
					{
						rateLimitConfig: {
							enabled: true,
							maxRetries: 0,
							initialRetryDelay: 0,
							backoffMultiplier: 1,
							headerNames: { retryAfter: 'retry-after' },
						},
					},
				)
				.catch((e: unknown) => e);

			expect(error).toBeInstanceOf(actualHttp.ApiError);
			const apiErr = error as InstanceType<typeof actualHttp.ApiError>;
			expect(apiErr.status).toBe(429);
			expect(apiErr.retryAfter).toBe(4000);
		} finally {
			globalThis.fetch = originalFetch;
		}
	});
});
