/**
 * Unit tests for the WhoisFreaks transport helper: apiKey placement,
 * method/body/query forwarding, and — critically — that provider ApiErrors
 * propagate unchanged so the plugin error-handlers can match on status
 * (429/401/404) and retryAfter.
 *
 * Note on unknown: caught errors surface as unknown because the tests assert
 * identity (toBe), not shape.
 */
import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';
import { makeWhoisfreaksRequest } from './client';

jest.mock('corsair/http', () => ({
	...jest.requireActual('corsair/http'),
	request: jest.fn(),
}));

// unknown: the cast bridges the mocked transport boundary (typed helper -> jest.Mock).
const mockRequest = request as unknown as jest.Mock;

function apiError(status: number, message: string): ApiError {
	return new ApiError(
		{ method: 'GET', url: '/v2.0/whois/live' },
		{
			url: 'https://api.whoisfreaks.com/v2.0/whois/live',
			ok: false,
			status,
			statusText: 'Error',
			body: { message },
		},
		message,
	);
}

beforeEach(() => {
	mockRequest.mockReset();
});

describe('makeWhoisfreaksRequest', () => {
	it('sends the apiKey as a query parameter against the provider base URL', async () => {
		mockRequest.mockResolvedValue({ status: true });
		const result = await makeWhoisfreaksRequest('/v2.0/whois/live', 'key-123', {
			query: { whois: 'live', domainName: 'example.com' },
		});

		expect(result).toEqual({ status: true });
		expect(mockRequest).toHaveBeenCalledTimes(1);
		const [config, options] = mockRequest.mock.calls[0] as [
			OpenAPIConfig,
			ApiRequestOptions,
		];
		expect(config.BASE).toBe('https://api.whoisfreaks.com');
		expect(options.method).toBe('GET');
		expect(options.url).toBe('/v2.0/whois/live');
		expect(options.query).toMatchObject({
			apiKey: 'key-123',
			whois: 'live',
			domainName: 'example.com',
		});
	});

	it('forwards POST bodies for bulk lookups', async () => {
		mockRequest.mockResolvedValue({ bulk_whois_response: [] });
		await makeWhoisfreaksRequest('/v2.0/bulkwhois/live', 'key-123', {
			method: 'POST',
			body: { domainNames: ['example.com'] },
		});

		const [, options] = mockRequest.mock.calls[0] as [
			OpenAPIConfig,
			ApiRequestOptions,
		];
		expect(options.method).toBe('POST');
		expect(options.body).toEqual({ domainNames: ['example.com'] });
	});

	it('omits a body on GET requests', async () => {
		mockRequest.mockResolvedValue({});
		await makeWhoisfreaksRequest('/v1.0/geolocation', 'key-123', {
			query: { ip: '8.8.8.8' },
		});

		const [, options] = mockRequest.mock.calls[0] as [
			OpenAPIConfig,
			ApiRequestOptions,
		];
		expect(options.body).toBeUndefined();
	});

	it('rethrows ApiErrors unchanged so status-based handlers can match', async () => {
		const providerError = apiError(429, 'Please slow down.');
		mockRequest.mockRejectedValue(providerError);

		const caught = await makeWhoisfreaksRequest('/v2.0/whois/live', 'key-123', {
			query: { whois: 'live', domainName: 'example.com' },
		}).catch((error: unknown) => error);

		expect(caught).toBe(providerError);
		expect(caught).toBeInstanceOf(ApiError);
	});

	it('propagates non-provider errors without wrapping', async () => {
		const networkError = new Error('fetch failed');
		mockRequest.mockRejectedValue(networkError);

		await expect(
			makeWhoisfreaksRequest('/v1.0/geolocation', 'key-123', {
				query: { ip: '8.8.8.8' },
			}),
		).rejects.toBe(networkError);
	});
});
