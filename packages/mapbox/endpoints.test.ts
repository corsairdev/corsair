import { MapboxAPIError } from './client';
import { MapboxEndpointOutputSchemas as Outputs } from './endpoints/types';
import { mapbox } from './index';
import {
	directionsRoute,
	directionsRouteTraffic,
	errorBodies,
	geocodingForwardParis,
	geocodingNoMatch,
	geocodingReverseParis,
	isochronePolygons,
	matrixDurations,
	matrixDurationsDistances,
	tilequeryBuildings,
	tripsOptimized,
} from './test-fixtures';
import type { FetchMock } from './test-harness';
import {
	API_KEY,
	captureError,
	GEO_JSON,
	installFetchMock,
	makeContext,
	respond,
} from './test-harness';

let fetchMock: FetchMock;

beforeEach(() => {
	fetchMock = installFetchMock();
	jest.spyOn(console, 'warn').mockImplementation(() => undefined);
});

afterEach(() => {
	jest.restoreAllMocks();
});

const plugin = mapbox({ key: API_KEY });
// `CorsairPlugin.endpoints` is optional on the type; this plugin always sets it.
const endpoints = plugin.endpoints as NonNullable<typeof plugin.endpoints>;

const PARIS = { longitude: 2.35, latitude: 48.85 };
const NEARBY = { longitude: 2.3, latitude: 48.86 };

/** Rejections raised before any request is sent never reach fetch. */
async function rejects(promise: Promise<object>): Promise<string> {
	const error = await captureError(promise);
	expect(error).toBeInstanceOf(Error);
	expect(fetchMock).not.toHaveBeenCalled();
	return error instanceof Error ? error.message : '';
}

describe('output parsing', () => {
	it('geocoding.forward keeps the feature, its context and the loose fields', async () => {
		respond(fetchMock, geocodingForwardParis, 200, { contentType: GEO_JSON });
		const { ctx } = makeContext();

		const result = await endpoints.geocoding.forward(ctx, { q: 'Paris' });

		const feature = result.features[0];
		expect(feature?.properties.name).toBe('Paris');
		expect(feature?.properties.feature_type).toBe('place');
		// Coordinates are [longitude, latitude].
		expect(feature?.geometry.coordinates).toEqual([2.348392, 48.853495]);
		expect(feature?.properties.coordinates).toMatchObject({
			longitude: 2.348392,
			latitude: 48.853495,
		});
		expect(feature?.properties.context?.country?.name).toBe('France');
		expect(feature?.properties.bbox).toHaveLength(4);
	});

	it('geocoding.forward returns an empty features list for no match, not an error', async () => {
		respond(fetchMock, geocodingNoMatch, 200, { contentType: GEO_JSON });
		const { ctx } = makeContext();

		const result = await endpoints.geocoding.forward(ctx, { q: 'zzzzqqqxxxx' });

		expect(result.features).toEqual([]);
	});

	it('geocoding.reverse reads address features with routable points', async () => {
		respond(fetchMock, geocodingReverseParis, 200, { contentType: GEO_JSON });
		const { ctx } = makeContext();

		const result = await endpoints.geocoding.reverse(ctx, {
			longitude: 2.3522,
			latitude: 48.8566,
		});

		expect(result.features[0]?.properties.feature_type).toBe('address');
		expect(result.features[0]?.properties.coordinates.accuracy).toBe('rooftop');
	});

	it('directions.route reads the route, its legs and the waypoints', async () => {
		respond(fetchMock, directionsRoute);
		const { ctx } = makeContext();

		const result = await endpoints.directions.route(ctx, {
			profile: 'mapbox/driving',
			coordinates: [PARIS, NEARBY],
		});

		expect(result.code).toBe('Ok');
		expect(result.routes[0]?.distance).toBe(4450.118);
		expect(result.routes[0]?.legs).toHaveLength(1);
		// Without overview: "full" the geometry is an encoded polyline.
		expect(typeof result.routes[0]?.geometry).toBe('string');
		expect(result.waypoints?.[0]?.name).toBe('Rue de Bièvre');
	});

	it('directions.route reads geojson geometry and annotations with null congestion values', async () => {
		respond(fetchMock, directionsRouteTraffic);
		const { ctx } = makeContext();

		const result = await endpoints.directions.route(ctx, {
			profile: 'mapbox/driving-traffic',
			coordinates: [PARIS, NEARBY],
			overview: 'full',
			geometries: 'geojson',
			annotations: ['duration', 'congestion'],
		});

		const geometry = result.routes[0]?.geometry;
		expect(typeof geometry === 'object' && geometry?.type).toBe('LineString');
		expect(result.routes[0]?.legs[0]?.annotation?.duration).toHaveLength(3);
		expect(typeof result.routes[0]?.legs[0]?.annotation?.congestion?.[0]).toBe(
			'string',
		);
	});

	it('matrix.calculate reads durations, distances and the snapped points', async () => {
		respond(fetchMock, matrixDurationsDistances);
		const { ctx } = makeContext();

		const result = await endpoints.matrix.calculate(ctx, {
			profile: 'mapbox/driving',
			coordinates: [PARIS, NEARBY, { longitude: 2.4, latitude: 48.87 }],
			annotations: ['duration', 'distance'],
		});

		expect(result.durations?.[0]).toEqual([0, 1143.6, 1525.8]);
		expect(result.distances?.[1]?.[0]).toBeGreaterThan(0);
		expect(result.sources).toHaveLength(3);
		expect(result.destinations[0]?.name).toBe('Boulevard Saint-Germain');
	});

	it('matrix.calculate accepts null where no route exists', () => {
		const withNull = {
			...matrixDurations,
			durations: [
				[0, null],
				[12, 0],
			],
		};

		expect(Outputs.matrixCalculate.parse(withNull).durations?.[0]).toEqual([
			0,
			null,
		]);
	});

	it('isochrone.get reads polygon contours, largest first as Mapbox sends them', async () => {
		respond(fetchMock, isochronePolygons);
		const { ctx } = makeContext();

		const result = await endpoints.isochrone.get(ctx, {
			profile: 'mapbox/driving',
			coordinate: PARIS,
			contours_minutes: [5, 10],
			polygons: true,
		});

		expect(result.features.map((f) => f.properties.contour)).toEqual([10, 5]);
		expect(result.features[0]?.properties.metric).toBe('time');
		expect(result.features[0]?.geometry.type).toBe('Polygon');
	});

	it('tilequery.query reads features nearest first with the tilequery block', async () => {
		respond(fetchMock, tilequeryBuildings);
		const { ctx } = makeContext();

		const result = await endpoints.tilequery.query(ctx, {
			tileset_ids: ['mapbox.mapbox-streets-v8'],
			coordinate: { longitude: 2.3522, latitude: 48.8566 },
			limit: 2,
		});

		expect(result.features).toHaveLength(2);
		expect(result.features[0]?.properties.tilequery).toMatchObject({
			distance: 0,
			layer: 'building',
		});
		// A feature id can be a number.
		expect(result.features[0]?.id).toBe(284089);
	});

	it('trips.optimize reads the waypoint order and the trip', async () => {
		respond(fetchMock, tripsOptimized);
		const { ctx } = makeContext();

		const result = await endpoints.trips.optimize(ctx, {
			profile: 'mapbox/driving',
			coordinates: [PARIS, NEARBY, { longitude: 2.4, latitude: 48.87 }],
			roundtrip: false,
			source: 'first',
			destination: 'last',
		});

		expect(result.waypoints.map((w) => w.waypoint_index)).toEqual([0, 1, 2]);
		expect(result.trips).toHaveLength(1);
		expect(result.trips[0]?.legs).toHaveLength(2);
	});
});

describe('wrong-shaped responses are rejected', () => {
	it('geocoding.forward rejects a features field that is not an array', async () => {
		respond(
			fetchMock,
			{ type: 'FeatureCollection', features: { not: 'a list' } },
			200,
			{ contentType: GEO_JSON },
		);
		const { ctx } = makeContext();

		const error = await captureError(
			endpoints.geocoding.forward(ctx, { q: 'Paris' }),
		);

		expect(error).toMatchObject({ name: 'ZodError' });
	});

	it('geocoding.forward rejects a feature whose coordinates are strings', async () => {
		const broken = structuredClone(geocodingForwardParis);
		// @ts-expect-error -- a deliberately malformed known field
		broken.features[0].geometry.coordinates = ['2.35', '48.85'];
		respond(fetchMock, broken, 200, { contentType: GEO_JSON });
		const { ctx } = makeContext();

		const error = await captureError(
			endpoints.geocoding.forward(ctx, { q: 'Paris' }),
		);

		expect(error).toMatchObject({ name: 'ZodError' });
	});

	it('directions.route rejects a route without legs', async () => {
		respond(fetchMock, {
			code: 'Ok',
			routes: [{ distance: 1, duration: 1 }],
		});
		const { ctx } = makeContext();

		const error = await captureError(
			endpoints.directions.route(ctx, {
				profile: 'mapbox/driving',
				coordinates: [PARIS, NEARBY],
			}),
		);

		expect(error).toMatchObject({ name: 'ZodError' });
	});

	it('matrix.calculate rejects a duration table with a string cell', async () => {
		respond(fetchMock, {
			code: 'Ok',
			durations: [[0, '12']],
			sources: [],
			destinations: [],
		});
		const { ctx } = makeContext();

		const error = await captureError(
			endpoints.matrix.calculate(ctx, {
				profile: 'mapbox/driving',
				coordinates: [PARIS, NEARBY],
			}),
		);

		expect(error).toMatchObject({ name: 'ZodError' });
	});

	it('isochrone.get rejects a contour with no metric', async () => {
		respond(fetchMock, {
			features: [
				{
					properties: { contour: 5 },
					geometry: { type: 'LineString', coordinates: [[0, 0]] },
				},
			],
		});
		const { ctx } = makeContext();

		const error = await captureError(
			endpoints.isochrone.get(ctx, {
				profile: 'mapbox/driving',
				coordinate: PARIS,
				contours_minutes: [5],
			}),
		);

		expect(error).toMatchObject({ name: 'ZodError' });
	});

	it('tilequery.query rejects a feature without the tilequery block', async () => {
		respond(fetchMock, {
			type: 'FeatureCollection',
			features: [
				{
					type: 'Feature',
					geometry: { type: 'Point', coordinates: [0, 0] },
					properties: {},
				},
			],
		});
		const { ctx } = makeContext();

		const error = await captureError(
			endpoints.tilequery.query(ctx, {
				tileset_ids: ['mapbox.mapbox-streets-v8'],
				coordinate: PARIS,
			}),
		);

		expect(error).toMatchObject({ name: 'ZodError' });
	});

	it('trips.optimize rejects a body with no trips', async () => {
		respond(fetchMock, { code: 'Ok', waypoints: [] });
		const { ctx } = makeContext();

		const error = await captureError(
			endpoints.trips.optimize(ctx, {
				profile: 'mapbox/driving',
				coordinates: [PARIS, NEARBY],
			}),
		);

		expect(error).toMatchObject({ name: 'ZodError' });
	});
});

describe('Mapbox answers that say no', () => {
	it('directions.route throws NoSegment, which Mapbox sends with HTTP 200', async () => {
		respond(fetchMock, errorBodies.noSegment);
		const { ctx } = makeContext();

		const error = await captureError(
			endpoints.directions.route(ctx, {
				profile: 'mapbox/driving',
				coordinates: [PARIS, NEARBY],
			}),
		);

		expect(error).toBeInstanceOf(MapboxAPIError);
		expect(error).toMatchObject({ code: 'NoSegment', status: 200 });
	});

	it('matrix.calculate throws a 422 InvalidInput with its code', async () => {
		respond(fetchMock, errorBodies.navigationValidation, 422);
		const { ctx } = makeContext();

		const error = await captureError(
			endpoints.matrix.calculate(ctx, {
				profile: 'mapbox/driving',
				coordinates: [PARIS, NEARBY],
			}),
		);

		expect(error).toMatchObject({ code: 'InvalidInput', status: 422 });
	});

	it('trips.optimize throws NotImplemented', async () => {
		respond(fetchMock, errorBodies.notImplemented);
		const { ctx } = makeContext();

		const error = await captureError(
			endpoints.trips.optimize(ctx, {
				profile: 'mapbox/driving',
				coordinates: [PARIS, NEARBY],
			}),
		);

		expect(error).toMatchObject({ code: 'NotImplemented' });
	});

	it('tilequery.query throws a 404 for a tileset that does not exist', async () => {
		respond(fetchMock, errorBodies.tilequeryNotFound, 404);
		const { ctx } = makeContext();

		const error = await captureError(
			endpoints.tilequery.query(ctx, {
				tileset_ids: ['nonexistent.tileset'],
				coordinate: PARIS,
			}),
		);

		expect(error).toMatchObject({ status: 404 });
	});

	it('geocoding.forward throws the 422 Mapbox sends for a bad query', async () => {
		respond(fetchMock, errorBodies.geocodingValidation, 422);
		const { ctx } = makeContext();

		const error = await captureError(
			endpoints.geocoding.forward(ctx, { q: 'Paris' }),
		);

		expect(error).toMatchObject({
			status: 422,
			code: 'VALIDATION_ERROR',
		});
	});

	it('isochrone.get throws on a bad token', async () => {
		respond(fetchMock, errorBodies.invalidToken, 401);
		const { ctx } = makeContext();

		const error = await captureError(
			endpoints.isochrone.get(ctx, {
				profile: 'mapbox/driving',
				coordinate: PARIS,
				contours_minutes: [5],
			}),
		);

		expect(error).toMatchObject({ status: 401 });
	});
});

describe('input rules reject before any request is sent', () => {
	describe('coordinates', () => {
		it('rejects a latitude above 90, the classic swapped-order mistake', async () => {
			const { ctx } = makeContext();

			// A longitude passed in the latitude slot is caught when it is out of
			// range. In-range swaps cannot be detected; the order of the named
			// fields on the URL is pinned in requests.test.ts.
			await rejects(
				endpoints.geocoding.reverse(ctx, { longitude: 2.35, latitude: 100 }),
			);
		});

		it('rejects a longitude beyond 180', async () => {
			const { ctx } = makeContext();

			await rejects(
				endpoints.geocoding.reverse(ctx, { longitude: 181, latitude: 1 }),
			);
		});

		it('accepts the boundary values', async () => {
			respond(fetchMock, geocodingNoMatch, 200, { contentType: GEO_JSON });
			const { ctx } = makeContext();

			await expect(
				endpoints.geocoding.reverse(ctx, { longitude: -180, latitude: 90 }),
			).resolves.toBeDefined();
		});

		it('rejects a bare [lon, lat] array where an object is required', async () => {
			const { ctx } = makeContext();

			await rejects(
				endpoints.directions.route(ctx, {
					profile: 'mapbox/driving',
					// Coordinates are { longitude, latitude } objects, not arrays.
					coordinates: [
						[2.35, 48.85],
						[2.3, 48.86],
					] as never,
				}),
			);
		});
	});

	describe('geocoding.forward', () => {
		it('rejects a blank, over-long, semicolon or 21-word query', async () => {
			const { ctx } = makeContext();

			await rejects(endpoints.geocoding.forward(ctx, { q: '   ' }));
			await rejects(endpoints.geocoding.forward(ctx, { q: 'a'.repeat(257) }));
			await rejects(endpoints.geocoding.forward(ctx, { q: 'a;b' }));
			await rejects(
				endpoints.geocoding.forward(ctx, {
					q: Array.from({ length: 21 }, (_, i) => `w${i}`).join(' '),
				}),
			);
		});

		it('accepts 256 characters and 20 words', async () => {
			respond(fetchMock, geocodingNoMatch, 200, { contentType: GEO_JSON });
			respond(fetchMock, geocodingNoMatch, 200, { contentType: GEO_JSON });
			const { ctx } = makeContext();

			await expect(
				endpoints.geocoding.forward(ctx, { q: 'a'.repeat(256) }),
			).resolves.toBeDefined();
			await expect(
				endpoints.geocoding.forward(ctx, {
					q: Array.from({ length: 20 }, (_, i) => `w${i}`).join(' '),
				}),
			).resolves.toBeDefined();
		});

		it('rejects limit 0 and 11, which Mapbox ignores without an error', async () => {
			const { ctx } = makeContext();

			await rejects(endpoints.geocoding.forward(ctx, { q: 'a', limit: 0 }));
			await rejects(endpoints.geocoding.forward(ctx, { q: 'a', limit: 11 }));
			await rejects(endpoints.geocoding.forward(ctx, { q: 'a', limit: 1.5 }));
		});

		it('rejects a type, worldview, country and language Mapbox does not know', async () => {
			const { ctx } = makeContext();

			await rejects(
				// @ts-expect-error -- poi is not a v6 geocoding type
				endpoints.geocoding.forward(ctx, { q: 'a', types: ['poi'] }),
			);
			await rejects(
				// @ts-expect-error -- xx is not a worldview
				endpoints.geocoding.forward(ctx, { q: 'a', worldview: 'xx' }),
			);
			await rejects(
				endpoints.geocoding.forward(ctx, { q: 'a', country: ['fra'] }),
			);
			await rejects(
				endpoints.geocoding.forward(ctx, { q: 'a', language: 'not a tag' }),
			);
		});

		it('rejects a bbox that is reversed or out of range', async () => {
			const { ctx } = makeContext();

			await rejects(
				endpoints.geocoding.forward(ctx, {
					q: 'a',
					bbox: [2.5, 48.9, 2.2, 48.8],
				}),
			);
			await rejects(
				endpoints.geocoding.forward(ctx, {
					q: 'a',
					bbox: [0, 0, 0, 91],
				}),
			);
		});
	});

	describe('geocoding.reverse', () => {
		it('rejects limit above 5 and limit above 1 without exactly one type', async () => {
			const { ctx } = makeContext();
			const base = { longitude: 2.35, latitude: 48.85 };

			await rejects(
				endpoints.geocoding.reverse(ctx, {
					...base,
					limit: 6,
					types: ['address'],
				}),
			);
			await rejects(endpoints.geocoding.reverse(ctx, { ...base, limit: 2 }));
			await rejects(
				endpoints.geocoding.reverse(ctx, {
					...base,
					limit: 2,
					types: ['address', 'place'],
				}),
			);
		});

		it('accepts limit 5 with one type', async () => {
			respond(fetchMock, geocodingReverseParis, 200, { contentType: GEO_JSON });
			const { ctx } = makeContext();

			await expect(
				endpoints.geocoding.reverse(ctx, {
					longitude: 2.35,
					latitude: 48.85,
					limit: 5,
					types: ['address'],
				}),
			).resolves.toBeDefined();
		});
	});

	describe('directions.route', () => {
		it('rejects a profile that is not listed and one without its namespace', async () => {
			const { ctx } = makeContext();

			await rejects(
				endpoints.directions.route(ctx, {
					// @ts-expect-error -- flying is not a routing profile
					profile: 'mapbox/flying',
					coordinates: [PARIS, NEARBY],
				}),
			);
			await rejects(
				endpoints.directions.route(ctx, {
					// @ts-expect-error -- the profile needs its mapbox/ prefix
					profile: 'driving',
					coordinates: [PARIS, NEARBY],
				}),
			);
		});

		it('rejects 1 coordinate and 26 coordinates, and accepts 2 and 25', async () => {
			respond(fetchMock, directionsRoute);
			respond(fetchMock, directionsRoute);
			const { ctx } = makeContext();
			const points = (count: number) =>
				Array.from({ length: count }, (_, i) => ({
					longitude: 2 + i / 100,
					latitude: 48.85,
				}));

			await rejects(
				endpoints.directions.route(ctx, {
					profile: 'mapbox/driving',
					coordinates: points(1),
				}),
			);
			await rejects(
				endpoints.directions.route(ctx, {
					profile: 'mapbox/driving',
					coordinates: points(26),
				}),
			);
			await expect(
				endpoints.directions.route(ctx, {
					profile: 'mapbox/driving',
					coordinates: points(2),
				}),
			).resolves.toBeDefined();
			await expect(
				endpoints.directions.route(ctx, {
					profile: 'mapbox/driving-traffic',
					coordinates: points(25),
				}),
			).resolves.toBeDefined();
		});

		it('rejects annotations without overview full', async () => {
			const { ctx } = makeContext();

			await rejects(
				endpoints.directions.route(ctx, {
					profile: 'mapbox/driving',
					coordinates: [PARIS, NEARBY],
					annotations: ['duration'],
				}),
			);
			await rejects(
				endpoints.directions.route(ctx, {
					profile: 'mapbox/driving',
					coordinates: [PARIS, NEARBY],
					annotations: ['duration'],
					overview: 'simplified',
				}),
			);
		});

		it('rejects traffic-only and driving-only annotations on other profiles', async () => {
			const { ctx } = makeContext();

			await rejects(
				endpoints.directions.route(ctx, {
					profile: 'mapbox/driving',
					coordinates: [PARIS, NEARBY],
					overview: 'full',
					annotations: ['congestion'],
				}),
			);
			await rejects(
				endpoints.directions.route(ctx, {
					profile: 'mapbox/cycling',
					coordinates: [PARIS, NEARBY],
					overview: 'full',
					annotations: ['maxspeed'],
				}),
			);
		});

		it('rejects language without steps', async () => {
			const { ctx } = makeContext();

			await rejects(
				endpoints.directions.route(ctx, {
					profile: 'mapbox/driving',
					coordinates: [PARIS, NEARBY],
					language: 'fr',
				}),
			);
		});

		it('rejects exclude values the profile does not support', async () => {
			const { ctx } = makeContext();

			await rejects(
				endpoints.directions.route(ctx, {
					profile: 'mapbox/walking',
					coordinates: [PARIS, NEARBY],
					exclude: ['toll'],
				}),
			);
			await rejects(
				endpoints.directions.route(ctx, {
					profile: 'mapbox/cycling',
					coordinates: [PARIS, NEARBY],
					exclude: ['motorway'],
				}),
			);
		});

		it('rejects a geometries or overview value that is not listed', async () => {
			const { ctx } = makeContext();

			await rejects(
				endpoints.directions.route(ctx, {
					profile: 'mapbox/driving',
					coordinates: [PARIS, NEARBY],
					// @ts-expect-error -- foo is not a geometry format
					geometries: 'foo',
				}),
			);
			await rejects(
				endpoints.directions.route(ctx, {
					profile: 'mapbox/driving',
					coordinates: [PARIS, NEARBY],
					// @ts-expect-error -- overview takes full, simplified or false
					overview: 'none',
				}),
			);
		});
	});

	describe('matrix.calculate', () => {
		const points = (count: number) =>
			Array.from({ length: count }, (_, i) => ({
				longitude: 2 + i / 100,
				latitude: 48.85,
			}));

		it('caps traffic at 10 coordinates and the others at 25', async () => {
			respond(fetchMock, matrixDurations);
			respond(fetchMock, matrixDurations);
			const { ctx } = makeContext();

			await rejects(
				endpoints.matrix.calculate(ctx, {
					profile: 'mapbox/driving-traffic',
					coordinates: points(11),
				}),
			);
			await rejects(
				endpoints.matrix.calculate(ctx, {
					profile: 'mapbox/driving',
					coordinates: points(26),
				}),
			);
			await expect(
				endpoints.matrix.calculate(ctx, {
					profile: 'mapbox/driving-traffic',
					coordinates: points(10),
				}),
			).resolves.toBeDefined();
			await expect(
				endpoints.matrix.calculate(ctx, {
					profile: 'mapbox/driving',
					coordinates: points(25),
				}),
			).resolves.toBeDefined();
		});

		it('rejects a source or destination index outside the coordinates', async () => {
			const { ctx } = makeContext();

			await rejects(
				endpoints.matrix.calculate(ctx, {
					profile: 'mapbox/driving',
					coordinates: points(3),
					sources: [3],
				}),
			);
			await rejects(
				endpoints.matrix.calculate(ctx, {
					profile: 'mapbox/driving',
					coordinates: points(3),
					destinations: [0, 5],
				}),
			);
			await rejects(
				endpoints.matrix.calculate(ctx, {
					profile: 'mapbox/driving',
					coordinates: points(3),
					sources: [-1],
				}),
			);
		});

		it('rejects an annotation other than duration or distance', async () => {
			const { ctx } = makeContext();

			await rejects(
				endpoints.matrix.calculate(ctx, {
					profile: 'mapbox/driving',
					coordinates: points(2),
					// @ts-expect-error -- speed is not a matrix annotation
					annotations: ['speed'],
				}),
			);
		});
	});

	describe('isochrone.get', () => {
		const base = { profile: 'mapbox/driving', coordinate: PARIS } as const;

		it('needs exactly one of contours_minutes and contours_meters', async () => {
			const { ctx } = makeContext();

			await rejects(endpoints.isochrone.get(ctx, base));
			await rejects(
				endpoints.isochrone.get(ctx, {
					...base,
					contours_minutes: [5],
					contours_meters: [500],
				}),
			);
		});

		it('limits minutes to 1-60 and meters to 1-100000, four at most', async () => {
			respond(fetchMock, isochronePolygons);
			respond(fetchMock, isochronePolygons);
			const { ctx } = makeContext();

			await rejects(
				endpoints.isochrone.get(ctx, { ...base, contours_minutes: [61] }),
			);
			await rejects(
				endpoints.isochrone.get(ctx, { ...base, contours_minutes: [0] }),
			);
			await rejects(
				endpoints.isochrone.get(ctx, { ...base, contours_meters: [100_001] }),
			);
			await rejects(
				endpoints.isochrone.get(ctx, {
					...base,
					contours_minutes: [1, 2, 3, 4, 5],
				}),
			);
			await expect(
				endpoints.isochrone.get(ctx, { ...base, contours_minutes: [60] }),
			).resolves.toBeDefined();
			await expect(
				endpoints.isochrone.get(ctx, { ...base, contours_meters: [100_000] }),
			).resolves.toBeDefined();
		});

		it('rejects contours that are not strictly increasing, which Mapbox accepts silently', async () => {
			const { ctx } = makeContext();

			await rejects(
				endpoints.isochrone.get(ctx, { ...base, contours_minutes: [10, 5] }),
			);
			await rejects(
				endpoints.isochrone.get(ctx, { ...base, contours_minutes: [5, 5] }),
			);
		});

		it('rejects colors that do not match the contours or are not six hex digits', async () => {
			const { ctx } = makeContext();

			await rejects(
				endpoints.isochrone.get(ctx, {
					...base,
					contours_minutes: [5, 10],
					contours_colors: ['ff0000'],
				}),
			);
			await rejects(
				endpoints.isochrone.get(ctx, {
					...base,
					contours_minutes: [5],
					contours_colors: ['#ff0000'],
				}),
			);
		});

		it('rejects denoise outside 0-1, negative generalize, a bad depart_at', async () => {
			const { ctx } = makeContext();
			const withMinutes = { ...base, contours_minutes: [5] };

			await rejects(
				endpoints.isochrone.get(ctx, { ...withMinutes, denoise: 2 }),
			);
			await rejects(
				endpoints.isochrone.get(ctx, { ...withMinutes, generalize: -1 }),
			);
			await rejects(
				endpoints.isochrone.get(ctx, { ...withMinutes, depart_at: 'tomorrow' }),
			);
		});

		it('rejects exclude on a non-driving profile, which Mapbox ignores silently', async () => {
			const { ctx } = makeContext();

			await rejects(
				endpoints.isochrone.get(ctx, {
					profile: 'mapbox/walking',
					coordinate: PARIS,
					contours_minutes: [5],
					exclude: ['toll'],
				}),
			);
		});
	});

	describe('tilequery.query', () => {
		const base = {
			tileset_ids: ['mapbox.mapbox-streets-v8'],
			coordinate: PARIS,
		};

		it('limits limit to 1-50 and radius to 0 or more', async () => {
			respond(fetchMock, tilequeryBuildings);
			respond(fetchMock, tilequeryBuildings);
			const { ctx } = makeContext();

			await rejects(endpoints.tilequery.query(ctx, { ...base, limit: 0 }));
			await rejects(endpoints.tilequery.query(ctx, { ...base, limit: 51 }));
			await rejects(endpoints.tilequery.query(ctx, { ...base, radius: -5 }));
			await expect(
				endpoints.tilequery.query(ctx, { ...base, limit: 50, radius: 0 }),
			).resolves.toBeDefined();
			await expect(
				endpoints.tilequery.query(ctx, { ...base, limit: 1 }),
			).resolves.toBeDefined();
		});

		it('takes 1 to 25 tileset IDs in tileset-ID form', async () => {
			const { ctx } = makeContext();
			const ids = (count: number) =>
				Array.from({ length: count }, (_, i) => `user.tileset${i}`);

			await rejects(
				endpoints.tilequery.query(ctx, { ...base, tileset_ids: [] }),
			);
			await rejects(
				endpoints.tilequery.query(ctx, { ...base, tileset_ids: ids(26) }),
			);
			await rejects(
				endpoints.tilequery.query(ctx, {
					...base,
					tileset_ids: ['no-dot-id'],
				}),
			);
			await rejects(
				endpoints.tilequery.query(ctx, {
					...base,
					tileset_ids: ['a.b/../../c'],
				}),
			);
		});

		it('rejects a geometry that is not polygon, linestring or point', async () => {
			const { ctx } = makeContext();

			await rejects(
				endpoints.tilequery.query(ctx, {
					...base,
					// @ts-expect-error -- foo is not a geometry type
					geometry: 'foo',
				}),
			);
		});
	});

	describe('trips.optimize', () => {
		const points = (count: number) =>
			Array.from({ length: count }, (_, i) => ({
				longitude: 2 + i / 100,
				latitude: 48.85,
			}));

		it('takes 2 to 12 coordinates', async () => {
			respond(fetchMock, tripsOptimized);
			respond(fetchMock, tripsOptimized);
			const { ctx } = makeContext();

			await rejects(
				endpoints.trips.optimize(ctx, {
					profile: 'mapbox/driving',
					coordinates: points(1),
				}),
			);
			await rejects(
				endpoints.trips.optimize(ctx, {
					profile: 'mapbox/driving',
					coordinates: points(13),
				}),
			);
			await expect(
				endpoints.trips.optimize(ctx, {
					profile: 'mapbox/driving',
					coordinates: points(2),
				}),
			).resolves.toBeDefined();
			await expect(
				endpoints.trips.optimize(ctx, {
					profile: 'mapbox/driving',
					coordinates: points(12),
				}),
			).resolves.toBeDefined();
		});

		it('rejects roundtrip false unless source is first and destination is last', async () => {
			respond(fetchMock, tripsOptimized);
			const { ctx } = makeContext();
			const base = {
				profile: 'mapbox/driving',
				coordinates: points(3),
				roundtrip: false,
			} as const;

			await rejects(endpoints.trips.optimize(ctx, base));
			await rejects(
				endpoints.trips.optimize(ctx, { ...base, source: 'first' }),
			);
			await rejects(
				endpoints.trips.optimize(ctx, { ...base, destination: 'last' }),
			);
			await rejects(
				endpoints.trips.optimize(ctx, {
					...base,
					source: 'any',
					destination: 'any',
				}),
			);
			await expect(
				endpoints.trips.optimize(ctx, {
					...base,
					source: 'first',
					destination: 'last',
				}),
			).resolves.toBeDefined();
		});

		it('rejects annotations without overview full and language without steps', async () => {
			const { ctx } = makeContext();
			const base = {
				profile: 'mapbox/driving',
				coordinates: points(3),
			} as const;

			await rejects(
				endpoints.trips.optimize(ctx, { ...base, annotations: ['duration'] }),
			);
			await rejects(endpoints.trips.optimize(ctx, { ...base, language: 'fr' }));
		});

		it('rejects values Mapbox does not list for source and destination', async () => {
			const { ctx } = makeContext();
			const base = {
				profile: 'mapbox/driving',
				coordinates: points(3),
			} as const;

			await rejects(
				// @ts-expect-error -- source takes any or first
				endpoints.trips.optimize(ctx, { ...base, source: 'last' }),
			);
			await rejects(
				// @ts-expect-error -- destination takes any or last
				endpoints.trips.optimize(ctx, { ...base, destination: 'first' }),
			);
		});
	});
});
