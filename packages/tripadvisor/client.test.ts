import { request } from 'corsair/http';
import { makeTripadvisorRequest } from './client';

jest.mock('corsair/http', () => ({
	request: jest.fn(),
}));

const mockRequest = jest.mocked(request);

describe('Tripadvisor client', () => {
	afterEach(() => {
		jest.clearAllMocks();
	});

	it('uses the documented API base and X-API-Key header', async () => {
		mockRequest.mockResolvedValueOnce({ data: [], pagination: {} });

		await makeTripadvisorRequest('/catalog/locations/nearby', 'secret-key', {
			method: 'GET',
			query: { lat: 38.72, lon: -9.14, radius: 5, locale: ['en-US', 'pt-PT'] },
		});

		expect(mockRequest).toHaveBeenCalledWith(
			{
				BASE: 'https://terra.tripadvisor.com/api',
				VERSION: '1.0.0',
				WITH_CREDENTIALS: false,
				CREDENTIALS: 'omit',
				TOKEN: undefined,
				HEADERS: {
					Accept: 'application/json',
					'X-API-Key': 'secret-key',
				},
			},
			{
				method: 'GET',
				url: '/catalog/locations/nearby',
				body: undefined,
				mediaType: undefined,
				query: {
					lat: 38.72,
					lon: -9.14,
					radius: 5,
					locale: ['en-US', 'pt-PT'],
				},
			},
		);
	});
});
