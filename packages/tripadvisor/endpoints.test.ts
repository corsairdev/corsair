import { logEventFromContext } from 'corsair/core';
import { makeTripadvisorRequest } from './client';
import { Catalog, Geo, Location, Locations } from './endpoints';
import type {
	GeoDetailsResponse,
	LocationDetailsResponse,
	LocationPhotosResponse,
	LocationReviewsResponse,
	LocationsNearbyResponse,
	LocationsSearchNearbyResponse,
	TripadvisorContext,
} from './index';

jest.mock('corsair/core', () => ({
	logEventFromContext: jest.fn().mockResolvedValue(null),
}));
jest.mock('./client', () => ({
	makeTripadvisorRequest: jest.fn(),
}));

const mockRequest = jest.mocked(makeTripadvisorRequest);
const mockLog = jest.mocked(logEventFromContext);
// why safe: endpoint implementations only read ctx.key and pass ctx to the
// mocked logEventFromContext, so the remaining context fields are never used.
const context = {
	key: 'tripadvisor-test-key',
} as unknown as TripadvisorContext;

const nearbyFixture: LocationsNearbyResponse = {
	data: [
		{
			location: {
				id: 123,
				descriptions: [{ language: 'en', value: 'A great place' }],
				geo: 'Lisbon',
				geo_id: 1,
				names: [{ language: 'en', value: 'Example Restaurant', primary: true }],
				coordinates: { latitude: 38.72, longitude: -9.14 },
			},
			distance_kilometers: 0.5,
			distance_miles: 0.31,
			bearing: 42,
		},
	],
	pagination: { page: 1, size: 20, total_elements: 1, total_pages: 1 },
};

const detailsFixture: LocationDetailsResponse = {
	descriptions: [{ language: 'en', value: 'A great place' }],
	geo: 'Lisbon',
	geo_id: 1,
	id: 123,
	names: [{ language: 'en', value: 'Example Restaurant', primary: true }],
	photos: { total_count: 10 },
	status: { value: 'OPEN' },
};

const photosFixture: LocationPhotosResponse = {
	data: [
		{
			id: 9,
			location_id: 123,
			photo: { key: 'photo-key', media_type: 'image/jpeg' },
			publish_ts: '2024-01-01T00:00:00Z',
			source: { name: 'Traveler' },
		},
	],
	pagination: { page: 0, size: 20, total_elements: 1, total_pages: 1 },
};

const reviewsFixture: LocationReviewsResponse = {
	data: [
		{
			id: 42,
			publish_ts: '2024-01-02T00:00:00Z',
			rating: 5,
			subratings: [],
			text: [{ language: 'en', value: 'Loved it', primary: true }],
			title: [{ language: 'en', value: 'Great', primary: true }],
			travel_date: '2023-12',
			trip_type: 'COUPLES',
		},
	],
	pagination: { page: 1, size: 20, total_elements: 1, total_pages: 1 },
};

const geoFixture: GeoDetailsResponse = {
	descriptions: [{ language: 'en', value: 'Capital of Portugal' }],
	id: 1,
	names: [{ language: 'en', value: 'Lisbon', primary: true }],
	type: { id: 1, name: 'City' },
};

const nearbyFullFixture: LocationsSearchNearbyResponse = {
	data: [
		{
			bearing: 42,
			distance_kilometers: 0.5,
			distance_miles: 0.31,
			location: detailsFixture,
		},
	],
	pagination: { page: 1, size: 10, total_elements: 1, total_pages: 1 },
};

describe('Tripadvisor endpoints', () => {
	afterEach(() => {
		jest.clearAllMocks();
	});

	it('searches catalog nearby and forwards query parameters', async () => {
		mockRequest.mockResolvedValueOnce(nearbyFixture);

		const input = {
			lat: 38.72,
			lon: -9.14,
			radius: 5,
			unit: 'KM' as const,
			page: 1,
			size: 20,
		};
		const response = await Catalog.locationsNearby(context, input);

		expect(response.data[0]?.location.id).toBe(123);
		expect(mockRequest).toHaveBeenCalledWith(
			'/catalog/locations/nearby',
			'tripadvisor-test-key',
			{ method: 'GET', query: input },
		);
		expect(mockLog).toHaveBeenCalledWith(
			context,
			'tripadvisor.catalog.locationsNearby',
			{ ...input, resultCount: 1 },
			'completed',
		);
	});

	it('fetches location details by path id without leaking id into query', async () => {
		mockRequest.mockResolvedValueOnce(detailsFixture);

		const response = await Location.details(context, {
			id: 123,
			locale: ['en-US'],
		});

		expect(response.id).toBe(123);
		expect(response.geo).toBe('Lisbon');
		expect(mockRequest).toHaveBeenCalledWith(
			'/locations/123',
			'tripadvisor-test-key',
			{
				method: 'GET',
				query: { locale: ['en-US'] },
			},
		);
		expect(mockLog).toHaveBeenCalledWith(
			context,
			'tripadvisor.location.details',
			{ id: 123 },
			'completed',
		);
	});

	it('fetches location photos with pagination parameters', async () => {
		mockRequest.mockResolvedValueOnce(photosFixture);

		const response = await Location.photos(context, {
			id: 123,
			page: 0,
			size: 20,
		});

		expect(response.data[0]?.source.name).toBe('Traveler');
		expect(mockRequest).toHaveBeenCalledWith(
			'/locations/123/photos',
			'tripadvisor-test-key',
			{ method: 'GET', query: { page: 0, size: 20 } },
		);
		expect(mockLog).toHaveBeenCalledWith(
			context,
			'tripadvisor.location.photos',
			{ id: 123, resultCount: 1 },
			'completed',
		);
	});

	it('fetches location reviews with rating and language filters', async () => {
		mockRequest.mockResolvedValueOnce(reviewsFixture);

		const response = await Location.reviews(context, {
			id: 123,
			rating_min: 4,
			language: 'en',
			sort_by: 'MOST_RECENT' as const,
		});

		expect(response.data[0]?.rating).toBe(5);
		expect(mockRequest).toHaveBeenCalledWith(
			'/locations/123/reviews',
			'tripadvisor-test-key',
			{
				method: 'GET',
				query: { rating_min: 4, language: 'en', sort_by: 'MOST_RECENT' },
			},
		);
		expect(mockLog).toHaveBeenCalledWith(
			context,
			'tripadvisor.location.reviews',
			{ id: 123, resultCount: 1 },
			'completed',
		);
	});

	it('searches full nearby locations with a hotel category filter', async () => {
		mockRequest.mockResolvedValueOnce(nearbyFullFixture);

		const input = {
			lat: 38.72,
			lon: -9.14,
			radius: 5,
			category: 'HOTEL' as const,
			size: 10,
		};
		const response = await Locations.nearby(context, input);

		expect(response.data[0]?.location.id).toBe(123);
		expect(mockRequest).toHaveBeenCalledWith(
			'/locations/nearby',
			'tripadvisor-test-key',
			{
				method: 'GET',
				query: input,
			},
		);
		expect(mockLog).toHaveBeenCalledWith(
			context,
			'tripadvisor.locations.searchNearby',
			{ ...input, resultCount: 1 },
			'completed',
		);
	});

	it('fetches geo details by path id', async () => {
		mockRequest.mockResolvedValueOnce(geoFixture);

		const response = await Geo.details(context, { id: 1 });

		expect(response.names[0]?.value).toBe('Lisbon');
		expect(mockRequest).toHaveBeenCalledWith(
			'/geos/1',
			'tripadvisor-test-key',
			{
				method: 'GET',
				query: {},
			},
		);
		expect(mockLog).toHaveBeenCalledWith(
			context,
			'tripadvisor.geo.details',
			{ id: 1 },
			'completed',
		);
	});

	it('rejects provider payloads that fail output validation', async () => {
		mockRequest.mockResolvedValueOnce({ unexpected: 'shape' });

		await expect(Location.details(context, { id: 123 })).rejects.toThrow();
		await expect(Location.reviews(context, { id: 123 })).rejects.toThrow();
		expect(mockRequest).toHaveBeenCalledTimes(2);
	});
});
