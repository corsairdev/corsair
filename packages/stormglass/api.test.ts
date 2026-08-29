import { logEventFromContext } from 'corsair/core';
import { makeStormglassRequest } from './client';
import { getPoint as getElevationPoint } from './endpoints/elevation';
import { getPoint as getSolarPoint } from './endpoints/solar';
import {
	getExtremesPoint,
	getStationsInArea,
	listStations,
} from './endpoints/tide';
import { getPoint as getWeatherPoint } from './endpoints/weather';
import { stormglass, stormglassAuthConfig } from './index';

jest.mock('./client', () => ({
	makeStormglassRequest: jest.fn(),
}));

jest.mock('corsair/core', () => ({
	logEventFromContext: jest.fn().mockResolvedValue(null),
	AuthMissingError: class AuthMissingError extends Error {},
}));

const mockRequest = makeStormglassRequest as jest.MockedFunction<
	typeof makeStormglassRequest
>;
const mockLogEvent = logEventFromContext as jest.MockedFunction<
	typeof logEventFromContext
>;

function makeCtx() {
	return { key: 'test-api-key', options: {} } as never;
}

beforeEach(() => {
	mockRequest.mockReset();
	mockLogEvent.mockClear();
});

describe('weather.getPoint', () => {
	it('joins params/source into comma-separated query values', async () => {
		mockRequest.mockResolvedValueOnce({ hours: [], meta: {} });

		await getWeatherPoint(makeCtx(), {
			lat: 58.7984,
			lng: 17.8081,
			params: ['waveHeight', 'windSpeed'],
			source: ['sg', 'noaa'],
		});

		expect(mockRequest).toHaveBeenCalledTimes(1);
		const [endpoint, key, options] = mockRequest.mock.calls[0] ?? [];
		expect(endpoint).toBe('weather/point');
		expect(key).toBe('test-api-key');
		expect(options?.query).toMatchObject({
			lat: 58.7984,
			lng: 17.8081,
			params: 'waveHeight,windSpeed',
			source: 'sg,noaa',
		});
		expect(mockLogEvent).toHaveBeenCalledTimes(1);
	});

	it('omits source when not provided', async () => {
		mockRequest.mockResolvedValueOnce({ hours: [], meta: {} });

		await getWeatherPoint(makeCtx(), {
			lat: 0,
			lng: 0,
			params: ['gust'],
		});

		const options = mockRequest.mock.calls[0]?.[2];
		expect(options?.query?.source).toBeUndefined();
	});
});

describe('solar.getPoint', () => {
	it('requests solar/point with joined params', async () => {
		mockRequest.mockResolvedValueOnce({ hours: [], meta: {} });

		await getSolarPoint(makeCtx(), {
			lat: 1,
			lng: 2,
			params: ['uvIndex', 'solarDownwardRadiationFlux'],
		});

		const [endpoint, , options] = mockRequest.mock.calls[0] ?? [];
		expect(endpoint).toBe('solar/point');
		expect(options?.query?.params).toBe('uvIndex,solarDownwardRadiationFlux');
	});
});

describe('tide.getExtremesPoint', () => {
	it('passes lat/lng/start/end through as query params', async () => {
		mockRequest.mockResolvedValueOnce({ data: [], meta: {} });

		await getExtremesPoint(makeCtx(), {
			lat: 58.7984,
			lng: 17.8081,
			start: '2024-01-01T00:00:00Z',
			end: '2024-01-02T00:00:00Z',
		});

		const [endpoint, , options] = mockRequest.mock.calls[0] ?? [];
		expect(endpoint).toBe('tide/extremes/point');
		expect(options?.query).toMatchObject({
			lat: 58.7984,
			lng: 17.8081,
			start: '2024-01-01T00:00:00Z',
			end: '2024-01-02T00:00:00Z',
		});
	});
});

describe('tide.listStations', () => {
	it('requests the full tide/stations catalog with no query params', async () => {
		mockRequest.mockResolvedValueOnce({ data: [], meta: {} });

		await listStations(makeCtx(), {});

		expect(mockRequest).toHaveBeenCalledWith('tide/stations', 'test-api-key');
	});
});

describe('tide.getStationsInArea', () => {
	it('encodes the bounding box as swLat,swLng:neLat,neLng', async () => {
		mockRequest.mockResolvedValueOnce({ data: [], meta: {} });

		await getStationsInArea(makeCtx(), {
			swLat: 58,
			swLng: 17,
			neLat: 59,
			neLng: 18,
		});

		const [endpoint, , options] = mockRequest.mock.calls[0] ?? [];
		expect(endpoint).toBe('tide/stations/area');
		expect(options?.query).toEqual({ box: '58,17:59,18' });
	});
});

describe('elevation.getPoint', () => {
	it('requests elevation/point with lat/lng', async () => {
		mockRequest.mockResolvedValueOnce({ data: { elevation: 12.3 }, meta: {} });

		const result = await getElevationPoint(makeCtx(), { lat: 58, lng: 17 });

		const [endpoint, , options] = mockRequest.mock.calls[0] ?? [];
		expect(endpoint).toBe('elevation/point');
		expect(options?.query).toEqual({ lat: 58, lng: 17 });
		expect(result).toEqual({ data: { elevation: 12.3 }, meta: {} });
	});
});

describe('stormglass factory', () => {
	it('registers all six read endpoints with api_key-only auth and no webhooks', () => {
		const plugin = stormglass();

		expect(plugin.id).toBe('stormglass');
		expect(plugin.authConfig).toEqual(stormglassAuthConfig);
		expect(plugin.schema?.entities).toEqual({});
		expect(plugin.endpoints?.weather.getPoint).toEqual(expect.any(Function));
		expect(plugin.endpoints?.solar.getPoint).toEqual(expect.any(Function));
		expect(plugin.endpoints?.tide.getExtremesPoint).toEqual(
			expect.any(Function),
		);
		expect(plugin.endpoints?.tide.listStations).toEqual(expect.any(Function));
		expect(plugin.endpoints?.tide.getStationsInArea).toEqual(
			expect.any(Function),
		);
		expect(plugin.endpoints?.elevation.getPoint).toEqual(expect.any(Function));
		expect(Object.keys(plugin.webhooks ?? {})).toHaveLength(0);
	});

	it('prefers an explicitly-passed key over the key manager', async () => {
		const plugin = stormglass({ key: 'explicit-key' });
		if (!plugin.keyBuilder) throw new Error('expected keyBuilder to be set');
		const key = await plugin.keyBuilder(
			{ authType: 'api_key' } as never,
			'endpoint',
		);
		expect(key).toBe('explicit-key');
	});
});
