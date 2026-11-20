import { ApiError } from '../async-core/ApiError';
import type { ApiRequestOptions } from '../async-core/ApiRequestOptions';
import type { OpenAPIConfig } from '../async-core/OpenAPI';
import type { RateLimitConfig } from '../async-core/rate-limit';
import { request } from '../async-core/request';

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

function mockAlways429() {
	return jest.spyOn(global, 'fetch').mockImplementation(
		async () =>
			new Response(JSON.stringify({ error: 'rate_limited' }), {
				status: 429,
				statusText: 'Too Many Requests',
				headers: { 'content-type': 'application/json' },
			}),
	);
}

async function captureError(promise: Promise<unknown>): Promise<unknown> {
	try {
		await promise;
	} catch (error) {
		return error;
	}
	throw new Error('Expected request to reject');
}

afterEach(() => {
	jest.restoreAllMocks();
});

describe('request() with rateLimitConfig.enabled = false', () => {
	it('does not retry a 429 when rate-limit handling is disabled', async () => {
		const fetchMock = mockAlways429();

		const error = await captureError(
			request(config, options, {
				rateLimitConfig: { ...baseRateLimitConfig, enabled: false },
			}),
		);

		expect(error).toBeInstanceOf(ApiError);
		expect(error).toMatchObject({ status: 429 });
		expect(fetchMock).toHaveBeenCalledTimes(1);
	});

	it('still retries a 429 up to maxRetries when rate-limit handling is enabled', async () => {
		const fetchMock = mockAlways429();

		const error = await captureError(
			request(config, options, {
				rateLimitConfig: baseRateLimitConfig,
			}),
		);

		expect(error).toBeInstanceOf(ApiError);
		expect(error).toMatchObject({ status: 429 });
		expect(fetchMock).toHaveBeenCalledTimes(baseRateLimitConfig.maxRetries + 1);
	});
});
