import type { RateLimitConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';
import { z } from 'zod';
import { makeWhautomateRequest } from './client';

jest.mock('corsair/http', () => {
	const original = jest.requireActual('corsair/http');
	return {
		...original,
		request: jest.fn(),
	};
});

const mockRequest = request as jest.Mock;

const schema = z.object({ ok: z.boolean() });

function apiErrorLike(fields: {
	status: number;
	statusText?: string;
	retryAfter?: number;
	body?: unknown;
}): ApiError {
	return Object.setPrototypeOf(
		{
			status: fields.status,
			statusText: fields.statusText ?? '',
			retryAfter: fields.retryAfter,
			body: fields.body,
		},
		ApiError.prototype,
	) as ApiError;
}

beforeEach(() => {
	mockRequest.mockReset();
	mockRequest.mockResolvedValue({ ok: true });
});

describe('Whautomate client', () => {
	it('sends the api key only via x-api-key', async () => {
		await makeWhautomateRequest(
			'https://api.example.com',
			'secret-key',
			'/contacts',
			schema,
		);

		const { config } = lastCall();
		expect(config.HEADERS['x-api-key']).toBe('secret-key');
		expect(config.HEADERS.Authorization).toBeUndefined();
		expect(config.TOKEN).toBeUndefined();
	});

	it('appends /v1 to hosts that omit it', async () => {
		await makeWhautomateRequest(
			'https://api.example.com/',
			'k',
			'/contacts',
			schema,
		);
		const { config } = lastCall();
		expect(config.BASE).toBe('https://api.example.com/v1');
	});

	it('keeps /v1 when the host already ends with it', async () => {
		await makeWhautomateRequest(
			'https://api.example.com/v1/',
			'k',
			'/contacts',
			schema,
		);
		const { config } = lastCall();
		expect(config.BASE).toBe('https://api.example.com/v1');
	});

	it('throws a typed error when the host is missing', async () => {
		await expect(
			makeWhautomateRequest('', 'k', '/contacts', schema),
		).rejects.toMatchObject({
			name: 'WhautomateAPIError',
			code: 'MISSING_API_HOST',
		});
	});

	it('throws a typed error when the key is missing', async () => {
		await expect(
			makeWhautomateRequest('https://api.example.com', '', '/contacts', schema),
		).rejects.toMatchObject({
			name: 'WhautomateAPIError',
			code: 'MISSING_API_KEY',
		});
	});

	it('throws instead of returning raw responses that violate the schema', async () => {
		mockRequest.mockResolvedValue({ unexpected: true });
		await expect(
			makeWhautomateRequest('/contacts', 'k', '/contacts', schema),
		).rejects.toMatchObject({
			name: 'WhautomateAPIError',
			code: 'SCHEMA_VALIDATION_FAILED',
		});
	});

	it('returns parsed data when the response matches the schema', async () => {
		const result = await makeWhautomateRequest('/x', 'k', '/x', schema);
		expect(result).toEqual({ ok: true });
	});

	it('preserves status and retry-after from ApiError rejections', async () => {
		mockRequest.mockRejectedValue(
			apiErrorLike({
				status: 429,
				retryAfter: 30,
				body: { message: 'slow down' },
			}),
		);

		await expect(
			makeWhautomateRequest('/contacts', 'k', '/contacts', schema),
		).rejects.toMatchObject({
			name: 'WhautomateAPIError',
			status: 429,
			retryAfter: 30,
			body: { message: 'slow down' },
		});
	});

	it('does not replay write requests on 429', async () => {
		mockRequest.mockRejectedValue(apiErrorLike({ status: 429, retryAfter: 5 }));

		await expect(
			makeWhautomateRequest(
				'https://api.example.com',
				'k',
				'/contacts',
				schema,
				{
					method: 'POST',
					body: { name: 'Ada' },
				},
			),
		).rejects.toMatchObject({ status: 429 });
		expect(mockRequest).toHaveBeenCalledTimes(1);
		const { config } = lastCall();
		expect(config.BASE).toBe('https://api.example.com/v1');
	});

	it('keeps transport rate-limit retries enabled for GET requests', async () => {
		await makeWhautomateRequest('/contacts', 'k', '/contacts', schema, {
			method: 'GET',
			query: { page: 1 },
		});
		const call = mockRequest.mock.calls[mockRequest.mock.calls.length - 1];
		const retryOptions = call?.[2] as { rateLimitConfig: RateLimitConfig };
		expect(retryOptions.rateLimitConfig.enabled).toBe(true);
		expect(retryOptions.rateLimitConfig.maxRetries).toBe(5);
	});

	it('disables transport rate-limit retries for write requests', async () => {
		await makeWhautomateRequest('/services/sv1', 'k', '/services/sv1', schema, {
			method: 'PATCH',
			body: { name: 'New name' },
		});
		const call = mockRequest.mock.calls[mockRequest.mock.calls.length - 1];
		const retryOptions = call?.[2] as { rateLimitConfig: RateLimitConfig };
		expect(retryOptions.rateLimitConfig.enabled).toBe(false);
	});

	it('omits the body for GET requests', async () => {
		await makeWhautomateRequest('/contacts', 'k', '/contacts', schema, {
			method: 'GET',
			query: { page: 1 },
		});
		const { options } = lastCall();
		expect(options.body).toBeUndefined();
		expect(options.query).toEqual({ page: 1 });
	});

	function lastCall() {
		const call = mockRequest.mock.calls[mockRequest.mock.calls.length - 1];
		return { config: call?.[0], options: call?.[1] };
	}
});
