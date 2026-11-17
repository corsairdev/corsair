import { logEventFromContext } from 'corsair/core';
import { ApiError, request } from 'corsair/http';
import type { TripadvisorContentApiContext } from './context';
import { listReviews, searchLocations } from './endpoints/read';

jest.mock('corsair/core', () => {
	const actual = jest.requireActual('corsair/core');
	return {
		...actual,
		logEventFromContext: jest.fn().mockResolvedValue(undefined),
	};
});
jest.mock('corsair/http', () => {
	const actual = jest.requireActual('corsair/http');
	return { ...actual, request: jest.fn() };
});

const mockRequest = jest.mocked(request);
const mockLog = jest.mocked(logEventFromContext);

function context(key?: string): TripadvisorContentApiContext {
	return { key } as unknown as TripadvisorContentApiContext;
}

describe('tripadvisor content api', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('stores a location and sends the key as a query param', async () => {
		mockRequest.mockResolvedValue({
			data: [
				{
					location_id: '187147',
					name: 'London',
					address_obj: { city: 'London' },
				},
			],
		});
		const result = await searchLocations(context('sekrit'), {
			searchQuery: 'secret-city',
		});
		expect(result.locations[0]).toEqual({ id: '187147', name: 'London' });
		expect(JSON.stringify(result.locations)).not.toContain('address');
		expect(mockRequest.mock.calls[0]?.[1]).toMatchObject({
			url: '/api/v1/location/search',
			query: { key: 'sekrit', searchQuery: 'secret-city', language: 'en' },
		});
		expect(mockRequest.mock.calls[0]?.[0]?.TOKEN).toBeUndefined();
		expect(mockLog.mock.calls[0]?.[2]).toEqual({ count: 1 });
		expect(JSON.stringify(mockLog.mock.calls[0]?.[2])).not.toContain(
			'secret-city',
		);
	});

	it('stores a review and drops the text and username', async () => {
		mockRequest.mockResolvedValue({
			data: [
				{
					id: 9,
					rating: 5,
					published_date: '2022-01-01T00:00:00-0500',
					text: 'secret review',
					title: 'secret title',
					user: { username: 'secret-user' },
				},
			],
		});
		const result = await listReviews(context(), { locationId: '187147' });
		expect(result.reviews[0]).toEqual({
			id: '9',
			rating: 5,
			publishedDate: '2022-01-01T00:00:00-0500',
		});
		expect(JSON.stringify(result.reviews)).not.toContain('secret');
	});

	it('rejects a non-numeric location id before calling the API', async () => {
		await expect(
			listReviews(context(), { locationId: 'london' }),
		).rejects.toThrow();
		expect(mockRequest).not.toHaveBeenCalled();
	});

	it('lets an HTTP 401 through unchanged', async () => {
		const error = new ApiError(
			{ method: 'GET', url: '/api/v1/location/search' },
			{
				url: 'https://api.content.tripadvisor.com/api/v1/location/search',
				ok: false,
				status: 401,
				statusText: 'Unauthorized',
				body: { message: 'Unauthorized' },
			},
			'Unauthorized',
		);
		mockRequest.mockRejectedValue(error);
		await expect(
			searchLocations(context(), { searchQuery: 'london' }),
		).rejects.toBe(error);
	});
});
