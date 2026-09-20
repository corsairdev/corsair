import { HERE_HOSTS, makeHereImageRequest, makeHereRequest } from './client';
import {
	coordinatesToTileIndices,
	getMapImage,
	webMercatorTile,
} from './endpoints/maps';
import {
	computeMatrix,
	decodeRouteHandle,
	findWaypointSequence,
	getIsolines,
	getMatrixProfile,
	getMatrixResult,
	getRoutes,
	listMatrixProfiles,
	postRoutes,
} from './endpoints/routing';
import {
	autocomplete,
	autosuggest,
	browse,
	discover,
	geocode,
	lookup,
	reverseGeocode,
} from './endpoints/search';
import {
	getIncidentById,
	getTrafficFlow,
	getTrafficIncidents,
} from './endpoints/traffic';
import { getDepartures, getStations } from './endpoints/transit';
import {
	getAstronomyForecast,
	getWeatherAlerts,
	getWeatherForecastDaily,
	getWeatherForecastHourly,
	getWeatherObservation,
} from './endpoints/weather';
import { here } from './index';

jest.mock('./client', () => {
	const actual = jest.requireActual('./client');
	return {
		...actual,
		makeHereRequest: jest.fn(),
		makeHereImageRequest: jest.fn(),
	};
});

jest.mock('corsair/core', () => ({
	logEventFromContext: jest.fn().mockResolvedValue(undefined),
	AuthMissingError: class AuthMissingError extends Error {},
}));

const mockedRequest = makeHereRequest as jest.MockedFunction<
	typeof makeHereRequest
>;
const mockedImage = makeHereImageRequest as jest.MockedFunction<
	typeof makeHereImageRequest
>;

const ctx = { key: 'test-key', options: {} } as any;

beforeEach(() => {
	jest.clearAllMocks();
	mockedRequest.mockResolvedValue({ items: [] });
});

describe('HERE plugin', () => {
	it('registers api_key auth only', () => {
		const plugin = here({ key: 'k' });
		expect(plugin.id).toBe('here');
		expect(plugin.authConfig?.api_key?.account).toEqual(['one']);
		expect(Object.keys(plugin.endpointSchemas ?? {})).toHaveLength(28);
	});
});

describe('HERE search', () => {
	it('geocodes with /v1/geocode', async () => {
		mockedRequest.mockResolvedValue({
			items: [{ title: 'Berlin', id: 'here:p:1' }],
		});
		const result = await geocode(ctx, { q: 'Berlin' });
		expect(mockedRequest).toHaveBeenCalledWith(
			HERE_HOSTS.geocode,
			'/v1/geocode',
			'test-key',
			{ query: expect.objectContaining({ q: 'Berlin' }) },
		);
		expect(result.items?.[0]?.title).toBe('Berlin');
	});

	it('reverse geocodes with /v1/revgeocode', async () => {
		await reverseGeocode(ctx, { at: '52.52,13.40' });
		expect(mockedRequest).toHaveBeenCalledWith(
			HERE_HOSTS.revgeocode,
			'/v1/revgeocode',
			'test-key',
			{ query: expect.objectContaining({ at: '52.52,13.40' }) },
		);
	});

	it('discovers, browses, suggests, autocompletes, and looks up', async () => {
		await discover(ctx, { q: 'coffee', at: '52.52,13.40' });
		await browse(ctx, { at: '52.52,13.40', categories: '100-1000' });
		await autosuggest(ctx, { q: 'ber', at: '52.52,13.40' });
		await autocomplete(ctx, { q: 'Invaliden' });
		mockedRequest.mockResolvedValue({ title: 'Place', id: 'here:p:1' });
		await lookup(ctx, { id: 'here:p:1' });
		expect(mockedRequest).toHaveBeenCalledTimes(5);
	});
});

describe('HERE routing', () => {
	it('calculates GET routes', async () => {
		mockedRequest.mockResolvedValue({ routes: [{ id: 'r1' }] });
		const result = await getRoutes(ctx, {
			origin: '52.53,13.38',
			destination: '52.52,13.36',
		});
		expect(mockedRequest).toHaveBeenCalledWith(
			HERE_HOSTS.router,
			'/v8/routes',
			'test-key',
			{
				query: expect.objectContaining({
					origin: '52.53,13.38',
					destination: '52.52,13.36',
					transportMode: 'car',
				}),
			},
		);
		expect(result.routes?.[0]?.id).toBe('r1');
	});

	it('posts routes and isolines and matrix calls', async () => {
		mockedRequest.mockResolvedValue({ routes: [] });
		await postRoutes(ctx, {
			origin: '52.53,13.38',
			destination: '52.52,13.36',
			body: { avoid: { features: ['tollRoad'] } },
		});
		mockedRequest.mockResolvedValue({ isolines: [] });
		await getIsolines(ctx, {
			origin: '52.53,13.38',
			rangeValues: '600',
		});
		mockedRequest.mockResolvedValue({ matrixId: 'm1' });
		await computeMatrix(ctx, {
			origins: [{ lat: 52.53, lng: 13.38 }],
			destinations: [{ lat: 52.52, lng: 13.36 }],
		});
		await getMatrixResult(ctx, { matrixId: 'm1' });
		await listMatrixProfiles(ctx, {});
		await getMatrixProfile(ctx, { profileId: 'carFast' });
		await decodeRouteHandle(ctx, {
			routeHandle: 'h1',
			transportMode: 'car',
		});
		expect(mockedRequest).toHaveBeenCalledWith(
			HERE_HOSTS.router,
			'/v8/routes/h1',
			'test-key',
			{
				query: expect.objectContaining({ transportMode: 'car' }),
			},
		);
		mockedRequest.mockResolvedValue({ results: [] });
		await findWaypointSequence(ctx, {
			start: '52.53,13.38',
			destination: '52.52,13.36',
			destination1: '52.525,13.37',
		});
		expect(mockedRequest).toHaveBeenCalledWith(
			HERE_HOSTS.wps,
			'/v8/findsequence2',
			'test-key',
			expect.objectContaining({
				query: expect.objectContaining({
					start: '52.53,13.38',
					end: '52.52,13.36',
				}),
			}),
		);
	});
});

describe('HERE weather traffic transit maps', () => {
	it('requests weather products', async () => {
		mockedRequest.mockResolvedValue({ places: [] });
		await getWeatherObservation(ctx, { q: 'Berlin' });
		await getWeatherForecastDaily(ctx, { q: 'Berlin' });
		await getWeatherForecastHourly(ctx, { q: 'Berlin' });
		await getAstronomyForecast(ctx, { q: 'Berlin' });
		await getWeatherAlerts(ctx, { q: 'Berlin' });
		expect(mockedRequest).toHaveBeenCalledWith(
			HERE_HOSTS.weather,
			'/v3/report',
			'test-key',
			{
				query: expect.objectContaining({
					products: 'observation',
					q: 'Berlin',
				}),
			},
		);
	});

	it('requests traffic and transit', async () => {
		mockedRequest.mockResolvedValue({ results: [] });
		await getTrafficFlow(ctx, {
			in: 'bbox:13.38,52.52,13.42,52.54',
		});
		await getTrafficIncidents(ctx, {
			in: 'bbox:13.38,52.52,13.42,52.54',
		});
		await getIncidentById(ctx, { id: 'inc-1' });
		mockedRequest.mockResolvedValue({ stations: [] });
		await getStations(ctx, { in: '52.52,13.40;r=500' });
		mockedRequest.mockResolvedValue({ boards: [] });
		await getDepartures(ctx, { in: '52.52,13.40;r=500' });
		expect(mockedRequest).toHaveBeenCalledWith(
			HERE_HOSTS.traffic,
			'/v7/flow',
			'test-key',
			expect.objectContaining({
				query: expect.objectContaining({
					in: 'bbox:13.38,52.52,13.42,52.54',
				}),
			}),
		);
	});

	it('fetches a map image and converts tile indices', async () => {
		mockedImage.mockResolvedValue({
			contentType: 'image/png',
			imageBase64: 'abc',
		});
		const image = await getMapImage(ctx, { lat: 52.52, lng: 13.4 });
		expect(image.imageBase64).toBe('abc');
		expect(webMercatorTile(0, 0, 1)).toEqual({ x: 1, y: 1, z: 1 });
		expect(webMercatorTile(0, 180, 1).x).toBe(0);
		expect(webMercatorTile(90, 0, 1).y).toBe(0);
		await expect(
			coordinatesToTileIndices(ctx, { lat: 0, lng: 0, zoom: 1 }),
		).resolves.toEqual({ x: 1, y: 1, z: 1 });
	});
});
