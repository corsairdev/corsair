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

// unused mock-call slots and unasserted json stay unknown: jest records
// the full request() tuple, and a complete OpenAPIConfig union is not practical
type Unused = unknown;

type RequestConfig = {
	BASE: string;
	TOKEN?: string;
	HEADERS: Record<string, string | undefined>;
};

type RequestOptions = {
	method?: string;
	url?: string;
	body?: Unused;
	query?: Unused;
};

function apiErrorLike(fields: {
	status: number;
	statusText?: string;
	retryAfter?: number;
	body?: Unused;
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
	it('sends the api key via x-api-key and APPOINTO-TOKEN', async () => {
		await makeWhautomateRequest(
			'https://api.whautomate.com',
			'secret-key',
			'/contacts',
			schema,
		);

		const { config } = lastCall();
		expect(config.HEADERS['x-api-key']).toBe('secret-key');
		expect(config.HEADERS['APPOINTO-TOKEN']).toBe('secret-key');
		expect(config.HEADERS.Authorization).toBeUndefined();
		expect(config.TOKEN).toBeUndefined();
	});

	it('appends /v1 to hosts that omit it', async () => {
		await makeWhautomateRequest(
			'https://api.whautomate.com/',
			'k',
			'/contacts',
			schema,
		);
		const { config } = lastCall();
		expect(config.BASE).toBe('https://api.whautomate.com/v1');
	});

	it('keeps /v1 when the host already ends with it', async () => {
		await makeWhautomateRequest(
			'https://api.whautomate.com/v1/',
			'k',
			'/contacts',
			schema,
		);
		const { config } = lastCall();
		expect(config.BASE).toBe('https://api.whautomate.com/v1');
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
			makeWhautomateRequest(
				'https://api.whautomate.com',
				'',
				'/contacts',
				schema,
			),
		).rejects.toMatchObject({
			name: 'WhautomateAPIError',
			code: 'MISSING_API_KEY',
		});
	});

	it('throws instead of returning raw responses that violate the schema', async () => {
		mockRequest.mockResolvedValue({ unexpected: true });
		await expect(
			makeWhautomateRequest(
				'https://api.whautomate.com',
				'k',
				'/contacts',
				schema,
			),
		).rejects.toMatchObject({
			name: 'WhautomateAPIError',
			code: 'SCHEMA_VALIDATION_FAILED',
		});
	});

	it('returns parsed data when the response matches the schema', async () => {
		const result = await makeWhautomateRequest(
			'https://api.whautomate.com',
			'k',
			'/x',
			schema,
		);
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
			makeWhautomateRequest(
				'https://api.whautomate.com',
				'k',
				'/contacts',
				schema,
			),
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
				'https://api.whautomate.com',
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
		expect(config.BASE).toBe('https://api.whautomate.com/v1');
	});

	it('keeps transport rate-limit retries enabled for GET requests', async () => {
		await makeWhautomateRequest(
			'https://api.whautomate.com',
			'k',
			'/contacts',
			schema,
			{
				method: 'GET',
				query: { page: 1 },
			},
		);
		const call = mockRequest.mock.calls[mockRequest.mock.calls.length - 1];
		// jest mock.calls is an untyped tuple; only rateLimitConfig is asserted
		const retryOptions = call?.[2] as { rateLimitConfig: RateLimitConfig };
		expect(retryOptions.rateLimitConfig.enabled).toBe(true);
		expect(retryOptions.rateLimitConfig.maxRetries).toBe(5);
	});

	it('disables transport rate-limit retries for write requests', async () => {
		await makeWhautomateRequest(
			'https://api.whautomate.com',
			'k',
			'/services/sv1',
			schema,
			{
				method: 'PUT',
				body: { name: 'New name' },
			},
		);
		const call = mockRequest.mock.calls[mockRequest.mock.calls.length - 1];
		// jest mock.calls is an untyped tuple; only rateLimitConfig is asserted
		const retryOptions = call?.[2] as { rateLimitConfig: RateLimitConfig };
		expect(retryOptions.rateLimitConfig.enabled).toBe(false);
	});

	it('omits the body for GET requests', async () => {
		await makeWhautomateRequest(
			'https://api.whautomate.com',
			'k',
			'/contacts',
			schema,
			{
				method: 'GET',
				query: { page: 1 },
			},
		);
		const { options } = lastCall();
		expect(options.body).toBeUndefined();
		expect(options.query).toEqual({ page: 1 });
	});

	it('rejects http, private, and non-Whautomate api hosts', async () => {
		await expect(
			makeWhautomateRequest(
				'http://api.whautomate.com',
				'k',
				'/contacts',
				schema,
			),
		).rejects.toMatchObject({ code: 'INVALID_API_HOST' });
		await expect(
			makeWhautomateRequest('https://127.0.0.1', 'k', '/contacts', schema),
		).rejects.toMatchObject({ code: 'INVALID_API_HOST' });
		await expect(
			makeWhautomateRequest('https://localhost/v1', 'k', '/contacts', schema),
		).rejects.toMatchObject({ code: 'INVALID_API_HOST' });
		await expect(
			makeWhautomateRequest(
				'https://api.example.com',
				'k',
				'/contacts',
				schema,
			),
		).rejects.toMatchObject({ code: 'INVALID_API_HOST' });
		await expect(
			makeWhautomateRequest('https://[::1]', 'k', '/contacts', schema),
		).rejects.toMatchObject({ code: 'INVALID_API_HOST' });
		expect(mockRequest).not.toHaveBeenCalled();
	});

	it('accepts the India-region Whautomate host', async () => {
		await makeWhautomateRequest(
			'https://api.in.whautomate.com',
			'k',
			'/contacts',
			schema,
		);
		expect(lastCall().config.BASE).toBe('https://api.in.whautomate.com/v1');
	});

	function lastCall(): { config: RequestConfig; options: RequestOptions } {
		const call = mockRequest.mock.calls[mockRequest.mock.calls.length - 1];
		// jest mock.calls is an untyped tuple; only BASE/HEADERS/body/query
		// are asserted, so a full OpenAPIConfig union is not practical
		return {
			config: call?.[0] as RequestConfig,
			options: call?.[1] as RequestOptions,
		};
	}
});
