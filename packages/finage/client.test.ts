import type { ApiRequestOptions } from 'corsair/http';
import { ApiError, request } from 'corsair/http';
import { FINAGE_API_BASE, FinageAPIError, makeFinageRequest } from './client';

jest.mock('corsair/http', () => {
	const actual = jest.requireActual('corsair/http');
	return { ...actual, request: jest.fn() };
});

const httpRequest = jest.mocked(request);

describe('Finage HTTP client', () => {
	it('sends GET requests with the API key in Finage apikey query parameter', async () => {
		httpRequest.mockResolvedValueOnce({ symbol: 'AAPL' });

		await makeFinageRequest('/last/stock/AAPL', 'secret-key', {
			limit: 10,
			includeExtended: false,
		});

		expect(httpRequest).toHaveBeenCalledWith(
			expect.objectContaining({
				BASE: FINAGE_API_BASE,
				WITH_CREDENTIALS: false,
				TOKEN: undefined,
			}),
			expect.objectContaining({
				method: 'GET',
				url: '/last/stock/AAPL',
				query: {
					limit: 10,
					includeExtended: false,
					apikey: 'secret-key',
				},
			}),
			expect.objectContaining({
				rateLimitConfig: expect.objectContaining({
					enabled: true,
					maxRetries: 0,
				}),
			}),
		);
	});

	it('wraps provider errors with status, code, and Retry-After metadata', async () => {
		httpRequest.mockRejectedValueOnce(
			new ApiError(
				{ method: 'GET', url: '/last/stock/AAPL' } as ApiRequestOptions,
				{
					url: 'https://api.finage.co.uk/last/stock/AAPL',
					ok: false,
					status: 429,
					statusText: 'Too Many Requests',
					body: {
						error: {
							code: 'rate_limited',
							message: 'Too many requests',
						},
					},
				},
				'Too Many Requests',
				{ retryAfter: 30_000 },
			),
		);

		const error = await makeFinageRequest(
			'/last/stock/AAPL',
			'secret-key',
		).catch((caught: unknown) => caught); // unknown: rejection value, narrowed below

		expect(error).toBeInstanceOf(FinageAPIError);
		expect(error).toMatchObject({
			name: 'FinageAPIError',
			status: 429,
			code: 'rate_limited',
			retryAfter: 30_000,
			message: 'rate_limited: Too many requests',
		});
	});

	it('wraps non-Error rejections without losing the plugin error type', async () => {
		httpRequest.mockRejectedValueOnce('offline');

		await expect(
			makeFinageRequest('/last/stock/AAPL', 'secret-key'),
		).rejects.toMatchObject({
			name: 'FinageAPIError',
			message: 'Unknown Finage API error',
		});
	});
});
