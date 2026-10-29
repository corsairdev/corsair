import { ApiError } from 'corsair/http';
import { AppointoAPIError, makeAppointoRequest } from './client';

jest.mock('corsair/http', () => {
	const actual = jest.requireActual('corsair/http');
	return {
		...actual,
		request: jest.fn(),
	};
});

const { request } = jest.requireMock('corsair/http') as {
	request: jest.Mock;
};

describe('makeAppointoRequest', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('sends APPOINTO-TOKEN and disables transport retries', async () => {
		request.mockResolvedValueOnce([{ id: 1 }]);
		await makeAppointoRequest('products', 'tok_test', { method: 'GET' });
		expect(request).toHaveBeenCalledWith(
			expect.objectContaining({
				BASE: 'https://app.appointo.me/api',
				HEADERS: expect.objectContaining({
					'APPOINTO-TOKEN': 'tok_test',
				}),
			}),
			expect.objectContaining({ method: 'GET', url: 'products' }),
			expect.objectContaining({
				rateLimitConfig: expect.objectContaining({ enabled: false }),
			}),
		);
		expect(request.mock.calls[0][0].TOKEN).toBeUndefined();
	});

	it('rethrows ApiError so plugin handlers keep status and retryAfter', async () => {
		const apiError = new ApiError(
			{ method: 'GET', url: 'products' },
			{
				url: 'https://app.appointo.me/api/products',
				ok: false,
				status: 429,
				statusText: 'Too Many Requests',
				body: { error_code: 'rate_limited', message: 'slow down' },
			},
			'Too Many Requests',
			{ retryAfter: 2000 },
		);
		request.mockRejectedValueOnce(apiError);
		await expect(makeAppointoRequest('products', 'tok_test')).rejects.toBe(
			apiError,
		);
	});

	it('wraps non-ApiError failures as AppointoAPIError', async () => {
		request.mockRejectedValueOnce(new Error('socket hang up'));
		await expect(makeAppointoRequest('products', 'tok_test')).rejects.toEqual(
			expect.any(AppointoAPIError),
		);
	});
});
