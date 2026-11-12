import { mapbox } from './index';
import {
	directionsRoute,
	geocodingForwardParis,
	geocodingReverseParis,
	isochronePolygons,
	matrixDurations,
	tilequeryBuildings,
	tripsOptimized,
} from './test-fixtures';
import type { FetchMock } from './test-harness';
import {
	API_KEY,
	GEO_JSON,
	installFetchMock,
	lastRequest,
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

/** Every request is a GET to api.mapbox.com with the token only in the query. */
function expectAuthInQueryOnly() {
	const { init, query, headers, parsed } = lastRequest(fetchMock);
	expect(init.method).toBe('GET');
	expect(init.body).toBeUndefined();
	expect(parsed.origin).toBe('https://api.mapbox.com');
	expect(query.get('access_token')).toBe(API_KEY);
	expect(headers.get('authorization')).toBeNull();
	expect(headers.get('x-api-key')).toBeNull();
}

describe('geocoding.forward request', () => {
	it('GETs /search/geocode/v6/forward with every option on the query', async () => {
		respond(fetchMock, geocodingForwardParis, 200, { contentType: GEO_JSON });
		const { ctx } = makeContext();

		const result = await endpoints.geocoding.forward(ctx, {
			q: 'Paris',
			autocomplete: false,
			bbox: [2.2, 48.8, 2.5, 48.9],
			country: ['fr', 'DE'],
			language: 'fr',
			limit: 3,
			proximity: { longitude: -95.5, latitude: 33.6 },
			types: ['place', 'locality'],
			worldview: 'us',
		});

		const { parsed, query } = lastRequest(fetchMock);
		expect(parsed.pathname).toBe('/search/geocode/v6/forward');
		expect(Object.fromEntries(query)).toEqual({
			q: 'Paris',
			autocomplete: 'false',
			bbox: '2.2,48.8,2.5,48.9',
			country: 'fr,DE',
			language: 'fr',
			limit: '3',
			// longitude first
			proximity: '-95.5,33.6',
			types: 'place,locality',
			worldview: 'us',
			access_token: API_KEY,
		});
		expectAuthInQueryOnly();
		expect(result.features[0]?.properties.name).toBe('Paris');
	});

	it('sends only q and the token when nothing else is set', async () => {
		respond(fetchMock, geocodingForwardParis, 200, { contentType: GEO_JSON });
		const { ctx } = makeContext();

		await endpoints.geocoding.forward(ctx, { q: '1600 Pennsylvania Ave' });

		expect(Object.fromEntries(lastRequest(fetchMock).query)).toEqual({
			q: '1600 Pennsylvania Ave',
			access_token: API_KEY,
		});
	});

	it('passes proximity "ip" through as the literal string', async () => {
		respond(fetchMock, geocodingForwardParis, 200, { contentType: GEO_JSON });
		const { ctx } = makeContext();

		await endpoints.geocoding.forward(ctx, { q: 'Paris', proximity: 'ip' });

		expect(lastRequest(fetchMock).query.get('proximity')).toBe('ip');
	});
});

describe('geocoding.reverse request', () => {
	it('GETs /search/geocode/v6/reverse with longitude and latitude by name', async () => {
		respond(fetchMock, geocodingReverseParis, 200, { contentType: GEO_JSON });
		const { ctx } = makeContext();

		await endpoints.geocoding.reverse(ctx, {
			longitude: 2.3522,
			latitude: 48.8566,
			country: ['fr'],
			language: 'en',
			limit: 2,
			types: ['address'],
			worldview: 'us',
		});

		const { parsed, query } = lastRequest(fetchMock);
		expect(parsed.pathname).toBe('/search/geocode/v6/reverse');
		expect(Object.fromEntries(query)).toEqual({
			longitude: '2.3522',
			latitude: '48.8566',
			country: 'fr',
			language: 'en',
			limit: '2',
			types: 'address',
			worldview: 'us',
			access_token: API_KEY,
		});
		expectAuthInQueryOnly();
	});
});

describe('directions.route request', () => {
	it('puts the profile and lon,lat pairs in the path and the options on the query', async () => {
		respond(fetchMock, directionsRoute);
		const { ctx } = makeContext();

		await endpoints.directions.route(ctx, {
			profile: 'mapbox/driving',
			coordinates: [PARIS, NEARBY, { longitude: 2.4, latitude: 48.87 }],
			alternatives: true,
			annotations: ['duration', 'distance'],
			continue_straight: false,
			exclude: ['toll', 'ferry'],
			geometries: 'geojson',
			overview: 'full',
			steps: true,
			language: 'fr',
		});

		const { parsed, query } = lastRequest(fetchMock);
		// longitude,latitude per pair, pairs joined by ;
		expect(decodeURIComponent(parsed.pathname)).toBe(
			'/directions/v5/mapbox/driving/2.35,48.85;2.3,48.86;2.4,48.87',
		);
		expect(Object.fromEntries(query)).toEqual({
			alternatives: 'true',
			annotations: 'duration,distance',
			continue_straight: 'false',
			exclude: 'toll,ferry',
			geometries: 'geojson',
			overview: 'full',
			steps: 'true',
			language: 'fr',
			access_token: API_KEY,
		});
		expectAuthInQueryOnly();
	});

	it('keeps the traffic profile segment intact', async () => {
		respond(fetchMock, directionsRoute);
		const { ctx } = makeContext();

		await endpoints.directions.route(ctx, {
			profile: 'mapbox/driving-traffic',
			coordinates: [PARIS, NEARBY],
		});

		expect(lastRequest(fetchMock).parsed.pathname).toBe(
			'/directions/v5/mapbox/driving-traffic/2.35,48.85;2.3,48.86',
		);
	});
});

describe('matrix.calculate request', () => {
	it('GETs the matrix path with annotations and index lists', async () => {
		respond(fetchMock, matrixDurations);
		const { ctx } = makeContext();

		await endpoints.matrix.calculate(ctx, {
			profile: 'mapbox/cycling',
			coordinates: [PARIS, NEARBY, { longitude: 2.4, latitude: 48.87 }],
			annotations: ['duration', 'distance'],
			sources: [0, 1],
			destinations: [2],
		});

		const { parsed, query } = lastRequest(fetchMock);
		expect(decodeURIComponent(parsed.pathname)).toBe(
			'/directions-matrix/v1/mapbox/cycling/2.35,48.85;2.3,48.86;2.4,48.87',
		);
		expect(Object.fromEntries(query)).toEqual({
			annotations: 'duration,distance',
			// semicolon-separated, percent-encoded by the shared client
			sources: '0;1',
			destinations: '2',
			access_token: API_KEY,
		});
		expectAuthInQueryOnly();
	});

	it('sends "all" for sources when asked', async () => {
		respond(fetchMock, matrixDurations);
		const { ctx } = makeContext();

		await endpoints.matrix.calculate(ctx, {
			profile: 'mapbox/walking',
			coordinates: [PARIS, NEARBY],
			sources: 'all',
		});

		expect(lastRequest(fetchMock).query.get('sources')).toBe('all');
	});
});

describe('isochrone.get request', () => {
	it('GETs the isochrone path with the contours on the query', async () => {
		respond(fetchMock, isochronePolygons);
		const { ctx } = makeContext();

		await endpoints.isochrone.get(ctx, {
			profile: 'mapbox/walking',
			coordinate: PARIS,
			contours_minutes: [5, 10],
			contours_colors: ['ff0000', '00ff00'],
			polygons: true,
			denoise: 0.5,
			generalize: 50,
			depart_at: '2026-12-01T08:00',
		});

		const { parsed, query } = lastRequest(fetchMock);
		expect(parsed.pathname).toBe('/isochrone/v1/mapbox/walking/2.35,48.85');
		expect(Object.fromEntries(query)).toEqual({
			contours_minutes: '5,10',
			contours_colors: 'ff0000,00ff00',
			polygons: 'true',
			denoise: '0.5',
			generalize: '50',
			depart_at: '2026-12-01T08:00',
			access_token: API_KEY,
		});
		expectAuthInQueryOnly();
	});

	it('sends contours_meters and exclude for a driving profile', async () => {
		respond(fetchMock, isochronePolygons);
		const { ctx } = makeContext();

		await endpoints.isochrone.get(ctx, {
			profile: 'mapbox/driving',
			coordinate: PARIS,
			contours_meters: [500, 1000],
			exclude: ['toll', 'motorway'],
		});

		const { query } = lastRequest(fetchMock);
		expect(query.get('contours_meters')).toBe('500,1000');
		expect(query.get('contours_minutes')).toBeNull();
		expect(query.get('exclude')).toBe('toll,motorway');
	});
});

describe('tilequery.query request', () => {
	it('GETs /v4/{tilesets}/tilequery/{lon},{lat}.json with the filters on the query', async () => {
		respond(fetchMock, tilequeryBuildings);
		const { ctx } = makeContext();

		await endpoints.tilequery.query(ctx, {
			tileset_ids: ['mapbox.mapbox-streets-v8', 'mapbox.mapbox-terrain-v2'],
			coordinate: { longitude: 2.3522, latitude: 48.8566 },
			radius: 100,
			limit: 2,
			dedupe: false,
			geometry: 'polygon',
			layers: ['building', 'poi_label'],
		});

		const { parsed, query } = lastRequest(fetchMock);
		expect(decodeURIComponent(parsed.pathname)).toBe(
			'/v4/mapbox.mapbox-streets-v8,mapbox.mapbox-terrain-v2/tilequery/2.3522,48.8566.json',
		);
		expect(Object.fromEntries(query)).toEqual({
			radius: '100',
			limit: '2',
			dedupe: 'false',
			geometry: 'polygon',
			layers: 'building,poi_label',
			access_token: API_KEY,
		});
		expectAuthInQueryOnly();
	});
});

describe('trips.optimize request', () => {
	it('GETs the optimized-trips v1 path with the trip options on the query', async () => {
		respond(fetchMock, tripsOptimized);
		const { ctx } = makeContext();

		await endpoints.trips.optimize(ctx, {
			profile: 'mapbox/driving',
			coordinates: [PARIS, NEARBY, { longitude: 2.4, latitude: 48.87 }],
			roundtrip: false,
			source: 'first',
			destination: 'last',
			geometries: 'geojson',
			overview: 'full',
			annotations: ['duration'],
			steps: true,
			language: 'en',
		});

		const { parsed, query, init } = lastRequest(fetchMock);
		expect(init.method).toBe('GET');
		expect(decodeURIComponent(parsed.pathname)).toBe(
			'/optimized-trips/v1/mapbox/driving/2.35,48.85;2.3,48.86;2.4,48.87',
		);
		expect(Object.fromEntries(query)).toEqual({
			roundtrip: 'false',
			source: 'first',
			destination: 'last',
			geometries: 'geojson',
			overview: 'full',
			annotations: 'duration',
			steps: 'true',
			language: 'en',
			access_token: API_KEY,
		});
		expectAuthInQueryOnly();
	});
});

describe('logging', () => {
	it('looks up the account to record the event', async () => {
		respond(fetchMock, geocodingForwardParis, 200, { contentType: GEO_JSON });
		const { ctx, accountIdRequested } = makeContext();

		await endpoints.geocoding.forward(ctx, { q: 'Paris' });

		expect(accountIdRequested()).toBe(true);
	});
});
