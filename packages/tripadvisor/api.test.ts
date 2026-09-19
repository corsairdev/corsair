import { logEventFromContext } from 'corsair/core';
import { makeTripadvisorRequest } from './client';
import { Catalog } from './endpoints';
import {
	LocationsNearbyInputSchema,
	LocationsNearbyResponseSchema,
} from './endpoints/types';
import type { TripadvisorContext } from './index';

jest.mock('corsair/core', () => ({
	logEventFromContext: jest.fn().mockResolvedValue(null),
}));
jest.mock('./client', () => ({
	makeTripadvisorRequest: jest.fn(),
}));

const mockRequest = jest.mocked(makeTripadvisorRequest);
const mockLog = jest.mocked(logEventFromContext);
const context = {
	key: 'tripadvisor-test-key',
} as unknown as TripadvisorContext;

const responseFixture = {
	data: [
		{
			location: {
				id: 123,
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

describe('Tripadvisor nearby locations', () => {
	afterEach(() => {
		jest.clearAllMocks();
	});

	it('accepts coordinate and radius search input', () => {
		const result = LocationsNearbyInputSchema.safeParse({
			lat: 38.72,
			lon: -9.14,
			radius: 5,
			unit: 'KM',
			category: 'RESTAURANT',
			size: 20,
		});

		expect(result.success).toBe(true);
	});

	it('accepts location ID and bounding-box search input', () => {
		const result = LocationsNearbyInputSchema.safeParse({
			location_id: '123',
			sw_lat: 38.7,
			sw_lon: -9.2,
			ne_lat: 38.8,
			ne_lon: -9.1,
			locale: ['en-US'],
			sort: ['rating,desc'],
		});

		expect(result.success).toBe(true);
	});

	it('rejects incomplete geographic search criteria', () => {
		const result = LocationsNearbyInputSchema.safeParse({
			lat: 38.72,
			radius: 5,
		});

		expect(result.success).toBe(false);
	});

	it('rejects page sizes above the Tripadvisor limit', () => {
		const result = LocationsNearbyInputSchema.safeParse({
			lat: 38.72,
			lon: -9.14,
			radius: 5,
			size: 21,
		});

		expect(result.success).toBe(false);
	});

	it('returns validated nearby location data and forwards query parameters', async () => {
		mockRequest.mockResolvedValueOnce(responseFixture);

		const input = {
			lat: 38.72,
			lon: -9.14,
			radius: 5,
			unit: 'KM' as const,
			page: 1,
			size: 20,
		};
		const response = await Catalog.locationsNearby(context, input);

		LocationsNearbyResponseSchema.parse(response);
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
});
