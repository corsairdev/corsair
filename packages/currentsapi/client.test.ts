import { request } from 'corsair/http';
import { makeCurrentsApiRequest } from './client';

jest.mock('corsair/http', () => ({
	request: jest.fn(),
}));

const mockHttpRequest = request as jest.MockedFunction<typeof request>;

describe('makeCurrentsApiRequest', () => {
	beforeEach(() => {
		jest.clearAllMocks();
		mockHttpRequest.mockResolvedValue({ ok: true });
	});

	it('sends a GET to the Currents host with Bearer auth', async () => {
		await makeCurrentsApiRequest('/search', 'test-api-key', {
			keywords: 'Bitcoin',
			language: 'en',
		});

		expect(mockHttpRequest).toHaveBeenCalledTimes(1);
		expect(mockHttpRequest).toHaveBeenCalledWith(
			expect.objectContaining({
				BASE: 'https://api.currentsapi.services/v1',
				HEADERS: expect.objectContaining({
					Authorization: 'Bearer test-api-key',
				}),
			}),
			expect.objectContaining({
				method: 'GET',
				url: '/search',
				query: {
					keywords: 'Bitcoin',
					language: 'en',
				},
			}),
		);
	});

	it('omits undefined query values', async () => {
		await makeCurrentsApiRequest('/search', 'test-api-key', {
			keywords: 'Bitcoin',
			category: undefined,
		});

		const options = mockHttpRequest.mock.calls[0]?.[1];
		expect(options?.query).toEqual({
			keywords: 'Bitcoin',
		});
		expect(options?.query).not.toHaveProperty('category');
	});

	it('propagates ApiError without wrapping', async () => {
		const apiError = new Error('Rate limited');
		mockHttpRequest.mockRejectedValue(apiError);

		await expect(
			makeCurrentsApiRequest('/search', 'test-api-key', { language: 'en' }),
		).rejects.toBe(apiError);
	});
});
