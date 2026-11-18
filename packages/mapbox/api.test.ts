import { MapboxAPIError } from './client';
import { MapboxEndpointOutputSchemas as Outputs } from './endpoints/types';
import { mapbox } from './index';
import { captureError, makeContext } from './test-harness';

/**
 * Live smoke test against api.mapbox.com. Read-only and few calls: tilequery
 * allows 50 requests a minute and matrix 60, so this makes nine requests in
 * total. CI skips this file by name (api.test.ts). Run it with:
 *
 *   MAPBOX_API_KEY=pk... pnpm --filter @corsair-dev/mapbox test:live
 *
 * Every answer is parsed through its `Outputs.<op>` schema, so a field typed
 * wrongly fails here even when the fixture-based suites pass.
 */
const apiKey = process.env.MAPBOX_API_KEY;
const describeIfKey = apiKey ? describe : describe.skip;

if (!apiKey) {
	console.warn('MAPBOX_API_KEY is not set: the live Mapbox suite is skipped.');
}

const PARIS = { longitude: 2.35, latitude: 48.85 };
const NEARBY = { longitude: 2.3, latitude: 48.86 };
const THIRD = { longitude: 2.4, latitude: 48.87 };

describeIfKey('Mapbox live API', () => {
	const plugin = mapbox({ key: apiKey });
	const endpoints = plugin.endpoints as NonNullable<typeof plugin.endpoints>;
	const { ctx } = makeContext(apiKey ?? '');

	beforeAll(() => {
		jest.spyOn(console, 'warn').mockImplementation(() => undefined);
	});

	afterAll(() => {
		jest.restoreAllMocks();
	});

	it('geocoding.forward finds Paris, with longitude before latitude', async () => {
		const result = Outputs.geocodingForward.parse(
			await endpoints.geocoding.forward(ctx, {
				q: 'Paris',
				limit: 2,
				types: ['place'],
			}),
		);

		const first = result.features[0];
		expect(first?.properties.name).toBe('Paris');
		const [longitude, latitude] = first?.geometry.coordinates ?? [];
		expect(longitude).toBeCloseTo(2.35, 0);
		expect(latitude).toBeCloseTo(48.85, 0);
	});

	it('geocoding.reverse resolves a Paris point to an address in France', async () => {
		const result = Outputs.geocodingReverse.parse(
			await endpoints.geocoding.reverse(ctx, {
				longitude: 2.3522,
				latitude: 48.8566,
			}),
		);

		expect(result.features.length).toBeGreaterThan(0);
		expect(result.features[0]?.properties.context?.country?.name).toBe(
			'France',
		);
	});

	it('directions.route returns an Ok route between two Paris points', async () => {
		const result = Outputs.directionsRoute.parse(
			await endpoints.directions.route(ctx, {
				profile: 'mapbox/driving-traffic',
				coordinates: [PARIS, NEARBY],
				overview: 'full',
				geometries: 'geojson',
				annotations: ['duration', 'congestion_numeric'],
			}),
		);

		expect(result.code).toBe('Ok');
		expect(result.routes[0]?.distance).toBeGreaterThan(1000);
		expect(
			result.routes[0]?.legs[0]?.annotation?.duration?.length,
		).toBeGreaterThan(0);
	});

	it('matrix.calculate returns a 3 by 3 duration table', async () => {
		const result = Outputs.matrixCalculate.parse(
			await endpoints.matrix.calculate(ctx, {
				profile: 'mapbox/driving',
				coordinates: [PARIS, NEARBY, THIRD],
				annotations: ['duration', 'distance'],
			}),
		);

		expect(result.durations).toHaveLength(3);
		expect(result.durations?.[0]?.[0]).toBe(0);
		expect(result.distances).toHaveLength(3);
	});

	it('isochrone.get returns one polygon per contour', async () => {
		const result = Outputs.isochroneGet.parse(
			await endpoints.isochrone.get(ctx, {
				profile: 'mapbox/walking',
				coordinate: PARIS,
				contours_minutes: [5, 10],
				polygons: true,
			}),
		);

		expect(
			result.features.map((f) => f.properties.contour).sort((a, b) => a - b),
		).toEqual([5, 10]);
		expect(result.features[0]?.geometry.type).toBe('Polygon');
	});

	it('tilequery.query finds map features at a point', async () => {
		const result = Outputs.tilequeryQuery.parse(
			await endpoints.tilequery.query(ctx, {
				tileset_ids: ['mapbox.mapbox-streets-v8'],
				coordinate: { longitude: 2.3522, latitude: 48.8566 },
				radius: 100,
				limit: 2,
			}),
		);

		expect(result.features.length).toBeGreaterThan(0);
		expect(
			result.features[0]?.properties.tilequery.distance,
		).toBeGreaterThanOrEqual(0);
	});

	it('trips.optimize orders three stops', async () => {
		const result = Outputs.tripsOptimize.parse(
			await endpoints.trips.optimize(ctx, {
				profile: 'mapbox/driving',
				coordinates: [PARIS, NEARBY, THIRD],
				source: 'first',
				destination: 'last',
				roundtrip: false,
			}),
		);

		expect(
			result.waypoints.map((w) => w.waypoint_index ?? -1).sort((a, b) => a - b),
		).toEqual([0, 1, 2]);
		expect(result.trips[0]?.legs).toHaveLength(2);
	});

	it('directions.route throws NoSegment for a point in the ocean', async () => {
		const error = await captureError(
			endpoints.directions.route(ctx, {
				profile: 'mapbox/driving',
				coordinates: [PARIS, { longitude: -40, latitude: 30 }],
			}),
		);

		expect(error).toBeInstanceOf(MapboxAPIError);
		expect(error).toMatchObject({ code: 'NoSegment', status: 200 });
	});

	it('a rejected token throws a 401 that does not echo the token', async () => {
		const bad = 'pk.invalid-live-test-token';
		const { ctx: badCtx } = makeContext(bad);

		const error = await captureError(
			endpoints.geocoding.forward(badCtx, { q: 'Paris' }),
		);

		expect(error).toMatchObject({ status: 401 });
		expect((error as MapboxAPIError).message).not.toContain(bad);
	});
});
