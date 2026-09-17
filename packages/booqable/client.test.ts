import { ApiError, request } from 'corsair/http';
import { BooqableAPIError, makeBooqableRequest } from './client';

jest.mock('corsair/http', () => {
	const original = jest.requireActual('corsair/http');
	return {
		...original,
		request: jest.fn(),
	};
});

const mockRequest = request as jest.Mock;

describe('makeBooqableRequest', () => {
	beforeEach(() => {
		mockRequest.mockReset();
	});

	it('serializes nested filter query params', async () => {
		mockRequest.mockResolvedValue({ data: [] });
		await makeBooqableRequest('/orders', 'key', 'acme', {
			query: {
				filter: { status: 'reserved', starts_at: { gte: '2018-01-01' } },
			},
		});

		expect(mockRequest).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({
				query: {
					filter: { status: 'reserved', starts_at: { gte: '2018-01-01' } },
				},
			}),
		);
	});

	it('wraps ApiError in BooqableAPIError with status and retryAfter', async () => {
		const apiError = new ApiError(
			{ url: '/orders', method: 'GET' },
			{
				url: '/orders',
				ok: false,
				status: 401,
				statusText: 'Unauthorized',
				body: {},
			},
			'unauthorized',
		);
		mockRequest.mockRejectedValue(apiError);

		try {
			await makeBooqableRequest('/orders', 'key', 'acme');
			fail('expected throw');
		} catch (error) {
			expect(error).toBeInstanceOf(BooqableAPIError);
			expect((error as BooqableAPIError).status).toBe(401);
		}
	});
});
