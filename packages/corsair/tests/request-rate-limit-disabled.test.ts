import { ApiError } from '../async-core/ApiError';
import type { ApiRequestOptions } from '../async-core/ApiRequestOptions';
import type { OpenAPIConfig } from '../async-core/OpenAPI';
import type { RateLimitConfig } from '../async-core/rate-limit';
import { request } from '../async-core/request';

const originalFetch = global.fetch;

const config: OpenAPIConfig = {
	BASE: 'https://api.example.com',
	VERSION: '1',
	WITH_CREDENTIALS: false,
	CREDENTIALS: 'same-origin',
};

const options: ApiRequestOptions = {
	method: 'GET',
	url: '/limited',
};

const baseRateLimitConfig: RateLimitConfig = {
	enabled: true,
	maxRetries: 2,
	initialRetryDelay: 1,
	backoffMultiplier: 1,
	headerNames: {},
};

function mockAlways429(): jest.Mock {
	const fetchMock = jest.fn(
		async () =>
			new Response(JSON.stringify({ error: 'rate_limited' }), {
				status: 429,
				statusText: 'Too Many Requests',
				headers: { 'content-type': 'application/json' },
			}),
	);
	global.fetch = fetchMock as unknown as typeof fetch;
	return fetchMock;
}

afterEach(() => {
	global.fetch = originalFetch;
});

describe('request() with rateLimitConfig.enabled = false', () => {
	it('does not retry a 429 when rate-limit handling is disabled', async () => {
		const fetchMock = mockAlways429();

		const promise = request(config, options, {
			rateLimitConfig: { ...baseRateLimitConfig, enabled: false },
		});

		await expect(promise).rejects.toMatchObject({ status: 429 });
		await expect(promise).rejects.toBeInstanceOf(ApiError);
		expect(fetchMock).toHaveBeenCalledTimes(1);
	});

	it('still retries a 429 up to maxRetries when rate-limit handling is enabled', async () => {
		const fetchMock = mockAlways429();

		const promise = request(config, options, {
			rateLimitConfig: baseRateLimitConfig,
		});

		await expect(promise).rejects.toMatchObject({ status: 429 });
		expect(fetchMock).toHaveBeenCalledTimes(baseRateLimitConfig.maxRetries + 1);
	});
});
