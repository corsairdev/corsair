import { request } from 'corsair/http';
import { makeCountdownApiRequest } from './client';

jest.mock('corsair/http', () => ({
	request: jest.fn(),
}));

const mockHttpRequest = request as jest.MockedFunction<typeof request>;

describe('makeCountdownApiRequest', () => {
	beforeEach(() => {
		jest.clearAllMocks();
		mockHttpRequest.mockResolvedValue({ ok: true } as never);
	});

	it('sends a GET to /request on the Countdown API host with api_key', async () => {
		await makeCountdownApiRequest('/request', 'test-api-key', {
			type: 'search',
			search_term: 'memory cards',
			ebay_domain: 'ebay.com',
		});

		expect(mockHttpRequest).toHaveBeenCalledTimes(1);
		expect(mockHttpRequest).toHaveBeenCalledWith(
			expect.objectContaining({
				BASE: 'https://api.countdownapi.com',
			}),
			expect.objectContaining({
				method: 'GET',
				url: '/request',
				query: {
					type: 'search',
					search_term: 'memory cards',
					ebay_domain: 'ebay.com',
					api_key: 'test-api-key',
				},
			}),
		);
	});

	it('omits undefined query values', async () => {
		await makeCountdownApiRequest('/request', 'test-api-key', {
			type: 'product',
			epid: '15029998723',
			url: undefined,
		});

		const options = mockHttpRequest.mock.calls[0]?.[1];
		expect(options?.query).toEqual({
			type: 'product',
			epid: '15029998723',
			api_key: 'test-api-key',
		});
		expect(options?.query).not.toHaveProperty('url');
	});
});
