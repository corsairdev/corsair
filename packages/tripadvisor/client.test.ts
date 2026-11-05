import { ApiError, request } from 'corsair/http';
import { makeTripadvisorRequest, TripadvisorAPIError } from './client';

jest.mock('corsair/http', () => {
	const actual = jest.requireActual('corsair/http');
	return {
		...actual,
		request: jest.fn(),
	};
});

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

	it('keeps status and Retry-After when the provider rate-limits', async () => {
		mockRequest.mockRejectedValueOnce(
			new ApiError(
				{ method: 'GET', url: '/locations/123' },
				{
					url: 'https://terra.tripadvisor.com/api/locations/123',
					ok: false,
					status: 429,
					statusText: 'Too Many Requests',
					body: null,
				},
				'Too Many Requests',
				{ retryAfter: 1500 },
			),
		);

		await expect(
			makeTripadvisorRequest('/locations/123', 'secret-key', { method: 'GET' }),
		).rejects.toMatchObject({
			name: 'TripadvisorAPIError',
			status: 429,
			retryAfter: 1500,
		});
	});

	it('wraps provider auth failures with their status', async () => {
		mockRequest.mockRejectedValueOnce(
			new ApiError(
				{ method: 'GET', url: '/locations/123' },
				{
					url: 'https://terra.tripadvisor.com/api/locations/123',
					ok: false,
					status: 401,
					statusText: 'Unauthorized',
					body: null,
				},
				'Unauthorized',
			),
		);

		await expect(
			makeTripadvisorRequest('/locations/123', 'bad-key', { method: 'GET' }),
		).rejects.toMatchObject({
			name: 'TripadvisorAPIError',
			status: 401,
		});
	});

	it('wraps unexpected failures without inventing a status', async () => {
		mockRequest.mockRejectedValueOnce(new Error('network down'));

		// unknown is used here because rejected values are untyped wire
		// data; it is narrowed below with toBeInstanceOf/toMatchObject.
		const error = await makeTripadvisorRequest('/locations/123', 'k', {
			method: 'GET',
		}).catch((caught: unknown) => caught);

		expect(error).toBeInstanceOf(TripadvisorAPIError);
		expect(error).toMatchObject({ message: 'network down', status: undefined });
	});
});
