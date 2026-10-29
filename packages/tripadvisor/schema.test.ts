import {
	GeoDetailsInputSchema,
	GeoDetailsResponseSchema,
	LocationDetailsInputSchema,
	LocationDetailsResponseSchema,
	LocationPhotosInputSchema,
	LocationPhotosResponseSchema,
	LocationReviewsInputSchema,
	LocationReviewsResponseSchema,
	LocationsNearbyInputSchema,
	LocationsSearchNearbyInputSchema,
} from './endpoints/types';
import { TripadvisorSchema } from './schema';

describe('Tripadvisor schema', () => {
	it('declares a semver version', () => {
		expect(TripadvisorSchema.version).toBeDefined();
		expect(TripadvisorSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof TripadvisorSchema.entities).toBe('object');
		expect(TripadvisorSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(TripadvisorSchema.entities))).toBe(true);
		for (const entity of Object.values(TripadvisorSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

describe('Tripadvisor catalog search input', () => {
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

	it('accepts a bounding-box-only search without center coordinates', () => {
		const result = LocationsNearbyInputSchema.safeParse({
			sw_lat: 38.7,
			sw_lon: -9.2,
			ne_lat: 38.8,
			ne_lon: -9.1,
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

	it('rejects partial bounding boxes and center-only searches', () => {
		expect(
			LocationsNearbyInputSchema.safeParse({
				sw_lat: 38.7,
				sw_lon: -9.2,
			}).success,
		).toBe(false);
		expect(
			LocationsNearbyInputSchema.safeParse({ lat: 38.72, lon: -9.14 }).success,
		).toBe(false);
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
});

describe('Tripadvisor location details schemas', () => {
	it('accepts a positive location id with locales', () => {
		expect(
			LocationDetailsInputSchema.safeParse({ id: 123, locale: ['en-US'] })
				.success,
		).toBe(true);
	});

	it('rejects missing or non-positive ids', () => {
		expect(LocationDetailsInputSchema.safeParse({}).success).toBe(false);
		expect(LocationDetailsInputSchema.safeParse({ id: 0 }).success).toBe(false);
		expect(LocationDetailsInputSchema.safeParse({ id: -5 }).success).toBe(
			false,
		);
	});

	it('parses a minimal documented details payload', () => {
		const result = LocationDetailsResponseSchema.safeParse({
			descriptions: [{ language: 'en', value: 'A great place' }],
			geo: 'Lisbon',
			geo_id: 1,
			id: 123,
			names: [{ language: 'en', value: 'Example', primary: true }],
			photos: { total_count: 3 },
			status: { value: 'OPEN' },
		});

		expect(result.success).toBe(true);
	});

	it('rejects details payloads missing required sections', () => {
		expect(LocationDetailsResponseSchema.safeParse({ id: 123 }).success).toBe(
			false,
		);
	});
});

describe('Tripadvisor location photos schemas', () => {
	it('accepts page zero as documented for this endpoint', () => {
		expect(
			LocationPhotosInputSchema.safeParse({ id: 123, page: 0, size: 5 })
				.success,
		).toBe(true);
	});

	it('rejects negative pages and empty sizes', () => {
		expect(
			LocationPhotosInputSchema.safeParse({ id: 123, page: -1 }).success,
		).toBe(false);
		expect(
			LocationPhotosInputSchema.safeParse({ id: 123, size: 0 }).success,
		).toBe(false);
	});

	it('parses a documented photo page', () => {
		const result = LocationPhotosResponseSchema.safeParse({
			data: [
				{
					id: 9,
					location_id: 123,
					photo: { key: 'k' },
					publish_ts: '2024-01-01T00:00:00Z',
					source: { name: 'Management' },
				},
			],
			pagination: { page: 0, size: 20 },
		});

		expect(result.success).toBe(true);
	});

	it('rejects photos with unknown source names', () => {
		const result = LocationPhotosResponseSchema.safeParse({
			data: [
				{
					id: 9,
					location_id: 123,
					photo: {},
					publish_ts: '2024-01-01T00:00:00Z',
					source: { name: 'Robot' },
				},
			],
			pagination: {},
		});

		expect(result.success).toBe(false);
	});
});

describe('Tripadvisor location reviews schemas', () => {
	it('accepts documented review filters', () => {
		expect(
			LocationReviewsInputSchema.safeParse({
				id: 123,
				rating_min: 4,
				trip_type: 'family',
				published_after_ts: '2024-01-01',
				sort_by: 'HIGHEST_RATED',
				language: 'en',
				page: 1,
				size: 10,
			}).success,
		).toBe(true);
	});

	it('rejects malformed dates, ratings and sort orders', () => {
		expect(
			LocationReviewsInputSchema.safeParse({
				id: 123,
				published_after_ts: '01/02/2024',
			}).success,
		).toBe(false);
		expect(
			LocationReviewsInputSchema.safeParse({
				id: 123,
				published_after_ts: '2024-13-45',
			}).success,
		).toBe(false);
		expect(
			LocationReviewsInputSchema.safeParse({ id: 123, rating_min: 6 }).success,
		).toBe(false);
		expect(
			LocationReviewsInputSchema.safeParse({ id: 123, sort_by: 'OLDEST' })
				.success,
		).toBe(false);
	});

	it('parses a documented review page', () => {
		const result = LocationReviewsResponseSchema.safeParse({
			data: [
				{
					id: 42,
					publish_ts: '2024-01-02T00:00:00Z',
					rating: 5,
					subratings: [],
					text: [{ language: 'en', value: 'Loved it' }],
					title: [{ language: 'en', value: 'Great' }],
					travel_date: '2023-12',
					trip_type: 'FAMILY',
				},
			],
			pagination: { page: 1, size: 10, total_elements: 1, total_pages: 1 },
		});

		expect(result.success).toBe(true);
	});

	it('rejects reviews missing required content', () => {
		const result = LocationReviewsResponseSchema.safeParse({
			data: [{ id: 42, rating: 5 }],
			pagination: {},
		});

		expect(result.success).toBe(false);
	});
});

describe('Tripadvisor geo schemas', () => {
	it('accepts a positive geo id', () => {
		expect(GeoDetailsInputSchema.safeParse({ id: 60745 }).success).toBe(true);
		expect(GeoDetailsInputSchema.safeParse({ id: 0 }).success).toBe(false);
	});

	it('parses a documented geo payload with ancestors', () => {
		const result = GeoDetailsResponseSchema.safeParse({
			descriptions: [{ language: 'en', value: 'A city' }],
			hierarchy: {
				ancestors: [{ geo_id: 191, name: 'United States', rank: 0 }],
			},
			id: 60745,
			names: [{ language: 'en', value: 'Boston', primary: true }],
			type: { id: 1, name: 'City' },
		});

		expect(result.success).toBe(true);
	});

	it('rejects geo payloads missing identity sections', () => {
		expect(GeoDetailsResponseSchema.safeParse({ id: 60745 }).success).toBe(
			false,
		);
	});
});

describe('Tripadvisor full nearby search schemas', () => {
	it('accepts a hotel-filtered search for the hotels use case', () => {
		expect(
			LocationsSearchNearbyInputSchema.safeParse({
				lat: 42.36,
				lon: -71.05,
				radius: 10,
				category: 'HOTEL',
				size: 10,
				include_photo: true,
			}).success,
		).toBe(true);
	});

	it('rejects searches without an area definition', () => {
		expect(
			LocationsSearchNearbyInputSchema.safeParse({ category: 'HOTEL' }).success,
		).toBe(false);
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
