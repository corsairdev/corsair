import { ApiError } from 'corsair/http';
import { makeSurfRequest } from './client';

jest.mock('corsair/http', () => {
	const actual = jest.requireActual('corsair/http');
	return { ...actual, request: jest.fn() };
});

import { request } from 'corsair/http';

const mockRequest = request as jest.MockedFunction<typeof request>;

describe('surf client', () => {
	beforeEach(() => {
		mockRequest.mockReset();
	});

	it('sends a bearer token and does not retry inside the transport', async () => {
		mockRequest.mockResolvedValue({ data: [] });
		await makeSurfRequest('/gateway/v1/market/fear-greed', 'x_key_test');
		const config = mockRequest.mock.calls[0]?.[0];
		const options = mockRequest.mock.calls[0]?.[2];
		expect(config?.TOKEN).toBe('x_key_test');
		expect(options?.rateLimitConfig?.enabled).toBe(true);
		expect(options?.rateLimitConfig?.maxRetries).toBe(0);
	});

	it('reads an object error envelope instead of [object Object]', async () => {
		const cause = new ApiError(
			{ method: 'GET', url: '/gateway/v1/market/price' },
			{
				url: 'https://api.asksurf.ai/gateway/v1/market/price',
				ok: false,
				status: 402,
				statusText: 'Payment Required',
				body: {
					error: { code: 'PAID_BALANCE_ZERO', message: 'credits exhausted' },
				},
			},
			'fallback',
		);
		mockRequest.mockRejectedValue(cause);
		await expect(
			makeSurfRequest('/gateway/v1/market/price', 'x_key_test', {
				query: { symbol: 'BTC' },
			}),
		).rejects.toMatchObject({
			message: 'credits exhausted',
			code: 'PAID_BALANCE_ZERO',
			status: 402,
		});
	});

	it('makes one fetch on a 429 and keeps Retry-After', async () => {
		const cause = new ApiError(
			{ method: 'GET', url: '/gateway/v1/market/fear-greed' },
			{
				url: 'https://api.asksurf.ai/gateway/v1/market/fear-greed',
				ok: false,
				status: 429,
				statusText: 'Too Many Requests',
				body: { error: { code: 'RATE_LIMITED', message: 'slow down' } },
			},
			'slow down',
			{ retryAfter: 2_000 },
		);
		mockRequest.mockRejectedValue(cause);
		await expect(
			makeSurfRequest('/gateway/v1/market/fear-greed', 'x_key_test'),
		).rejects.toMatchObject({ status: 429, retryAfter: 2_000 });
		expect(mockRequest).toHaveBeenCalledTimes(1);
	});
});
