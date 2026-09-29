import { makeTripadvisorRequest } from './client';
import {
	GeoDetailsResponseSchema,
	LocationDetailsResponseSchema,
	LocationPhotosResponseSchema,
	LocationReviewsResponseSchema,
	LocationsNearbyResponseSchema,
	LocationsSearchNearbyResponseSchema,
} from './endpoints/types';

// Live tests run only when a real key is provided via the environment.
// Nothing is hardcoded here so CI without a key skips this suite (R6).
const API_KEY = process.env.TRIPADVISOR_API_KEY;
const describeLive = API_KEY ? describe : describe.skip;

function liveKey(): string {
	const key = process.env.TRIPADVISOR_API_KEY;
	if (!key) {
		throw new Error('TRIPADVISOR_API_KEY is required for live tests');
	}
	return key;
}

// Coordinates from the Terra "Search Nearby Locations Catalog" doc example.
const LISBON_LAT = 38.72;
const LISBON_LON = -9.14;

describeLive('Tripadvisor live API', () => {
	let locationId = 0;
	let geoId = 0;

	it('searches catalog locations near Lisbon', async () => {
		const response = await makeTripadvisorRequest(
			'/catalog/locations/nearby',
			liveKey(),
			{
				method: 'GET',
				query: { lat: LISBON_LAT, lon: LISBON_LON, radius: 5, size: 5 },
			},
		);

		const parsed = LocationsNearbyResponseSchema.parse(response);
		expect(parsed.data.length).toBeGreaterThan(0);
		const first = parsed.data[0]?.location;
		expect(first?.id).toEqual(expect.any(Number));
		expect(first?.geo_id).toEqual(expect.any(Number));
		if (first) {
			locationId = first.id;
			geoId = first.geo_id;
		}
	});

	it('reads full details for the discovered location', async () => {
		const response = await makeTripadvisorRequest(
			`/locations/${locationId}`,
			liveKey(),
			{ method: 'GET', query: {} },
		);

		const parsed = LocationDetailsResponseSchema.parse(response);
		expect(parsed.id).toBe(locationId);
		expect(parsed.names.length).toBeGreaterThan(0);
	});

	it('reads photos for the discovered location', async () => {
		const response = await makeTripadvisorRequest(
			`/locations/${locationId}/photos`,
			liveKey(),
			{ method: 'GET', query: { size: 2 } },
		);

		const parsed = LocationPhotosResponseSchema.parse(response);
		expect(Array.isArray(parsed.data)).toBe(true);
	});

	it('reads reviews for the discovered location', async () => {
		const response = await makeTripadvisorRequest(
			`/locations/${locationId}/reviews`,
			liveKey(),
			{ method: 'GET', query: { size: 2 } },
		);

		const parsed = LocationReviewsResponseSchema.parse(response);
		expect(Array.isArray(parsed.data)).toBe(true);
	});

	it('reads geo details for the discovered geo', async () => {
		const response = await makeTripadvisorRequest(`/geos/${geoId}`, liveKey(), {
			method: 'GET',
			query: {},
		});

		const parsed = GeoDetailsResponseSchema.parse(response);
		expect(parsed.id).toBe(geoId);
		expect(parsed.names.length).toBeGreaterThan(0);
	});

	it('finds hotels near Lisbon with the full nearby search', async () => {
		const response = await makeTripadvisorRequest(
			'/locations/nearby',
			liveKey(),
			{
				method: 'GET',
				query: {
					lat: LISBON_LAT,
					lon: LISBON_LON,
					radius: 10,
					category: 'HOTEL',
					size: 2,
				},
			},
		);

		const parsed = LocationsSearchNearbyResponseSchema.parse(response);
		expect(Array.isArray(parsed.data)).toBe(true);
	});
});
