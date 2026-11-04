import { ApiError } from 'corsair/http';
import type { OrbitAPIError } from './client';
import { makeOrbitRequest } from './client';

jest.mock('corsair/http', () => {
	const actual = jest.requireActual('corsair/http');
	return { ...actual, request: jest.fn() };
});

import { request } from 'corsair/http';

const mockRequest = request as jest.MockedFunction<typeof request>;

describe('orbit client', () => {
	beforeEach(() => {
		mockRequest.mockReset();
	});

	it('sends a bearer token and does not retry inside the transport', async () => {
		mockRequest.mockResolvedValue({ ok: true });
		await makeOrbitRequest('/v3/search/search_1', 'x_key_test');
		const config = mockRequest.mock.calls[0]?.[0];
		const options = mockRequest.mock.calls[0]?.[2];
		expect(config?.TOKEN).toBe('x_key_test');
		expect(options?.rateLimitConfig?.enabled).toBe(true);
		expect(options?.rateLimitConfig?.maxRetries).toBe(0);
	});

	it('reads an object error envelope instead of [object Object]', async () => {
		const cause = new ApiError(
			{ method: 'POST', url: '/v3/search' },
			{
				url: 'https://api.orbitsearch.com/v3/search',
				ok: false,
				status: 402,
				statusText: 'Payment Required',
				body: {
					status: 'failed',
					error: {
						code: 'developer_api_credits_insufficient',
						message: 'Not enough credits',
					},
				},
			},
			'fallback',
		);
		mockRequest.mockRejectedValue(cause);
		await expect(
			makeOrbitRequest('/v3/search', 'x_key_test', {
				method: 'POST',
				body: { query: 'a person' },
			}),
		).rejects.toMatchObject({
			name: 'OrbitAPIError',
			message: 'Not enough credits',
			code: 'developer_api_credits_insufficient',
			status: 402,
		} satisfies Partial<OrbitAPIError>);
	});

	it('makes one fetch on a 429 and keeps Retry-After', async () => {
		const cause = new ApiError(
			{ method: 'GET', url: '/v3/search/search_1' },
			{
				url: 'https://api.orbitsearch.com/v3/search/search_1',
				ok: false,
				status: 429,
				statusText: 'Too Many Requests',
				body: {
					error: {
						code: 'developer_api_key_rate_limited',
						message: 'slow down',
					},
				},
			},
			'slow down',
			{ retryAfter: 2_000 },
		);
		mockRequest.mockRejectedValue(cause);
		await expect(
			makeOrbitRequest('/v3/search/search_1', 'x_key_test'),
		).rejects.toMatchObject({
			status: 429,
			retryAfter: 2_000,
		});
		expect(mockRequest).toHaveBeenCalledTimes(1);
	});
});
