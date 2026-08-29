import { AuthMissingError, logEventFromContext } from 'corsair/core';
import { ApiError, request } from 'corsair/http';
import {
	makeStormglassRequest,
	StormglassAPIError,
	StormglassRateLimitError,
} from './client';
import { point as elevationPoint } from './endpoints/elevation';
import { point as solarPoint } from './endpoints/solar';
import { extremesPoint, stationsArea, stationsList } from './endpoints/tide';
import {
	StormglassEndpointInputSchemas,
	StormglassEndpointOutputSchemas,
} from './endpoints/types';
import { point as weatherPoint } from './endpoints/weather';
import { errorHandlers } from './error-handlers';
import { stormglass } from './index';

jest.mock('corsair/core', () => {
	class AuthMissingError extends Error {
		constructor(plugin: string, authType: string) {
			super(`Missing ${authType} for ${plugin}`);
			this.name = 'AuthMissingError';
		}
	}
	return {
		AuthMissingError,
		logEventFromContext: jest.fn(),
	};
});

jest.mock('corsair/http', () => {
	const actual = jest.requireActual('corsair/http');
	return {
		...actual,
		request: jest.fn(),
	};
});

const mockRequest = request as jest.MockedFunction<typeof request>;

beforeEach(() => {
	mockRequest.mockReset();
	jest.mocked(logEventFromContext).mockReset();
});

const mockCtx = {
	key: 'test-api-key',
	$getAccountId: async () => 'test-account',
} as never;

function lastRequestOptions() {
	expect(mockRequest).toHaveBeenCalled();
	const call = mockRequest.mock.calls[0];
	expect(call).toBeDefined();
	return call?.[1];
}

function lastRequestConfig() {
	expect(mockRequest).toHaveBeenCalled();
	const call = mockRequest.mock.calls[0];
	expect(call).toBeDefined();
	return call?.[0];
}

describe('Stormglass plugin instantiation', () => {
	it('creates plugin instance with correct metadata', () => {
		const plugin = stormglass({ key: 'test-api-key' });
		expect(plugin.id).toBe('stormglass');
		expect(plugin.authConfig?.api_key?.account).toEqual(['one']);
		expect(plugin.endpoints?.elevation.point).toBeDefined();
		expect(plugin.endpoints?.tide.stationsArea).toBeDefined();
		expect(plugin.endpoints?.tide.stationsList).toBeDefined();
		expect(plugin.endpoints?.tide.extremesPoint).toBeDefined();
		expect(plugin.endpoints?.solar.point).toBeDefined();
		expect(plugin.endpoints?.weather.point).toBeDefined();
		expect(Object.keys(plugin.endpointSchemas ?? {})).toHaveLength(6);
	});

	it('returns an explicit key from keyBuilder', async () => {
		const plugin = stormglass({ key: 'explicit-key' });
		await expect(
			plugin.keyBuilder?.(
				{
					authType: 'api_key',
					keys: { get_api_key: async () => 'stored-key' },
				} as never,
				'endpoint',
			),
		).resolves.toBe('explicit-key');
	});

	it('falls back to the stored api key when no explicit key is given', async () => {
		const plugin = stormglass();
		await expect(
			plugin.keyBuilder?.(
				{
					authType: 'api_key',
					keys: { get_api_key: async () => 'stored-key' },
				} as never,
				'endpoint',
			),
		).resolves.toBe('stored-key');
	});

	it('throws AuthMissingError when no API key is stored', async () => {
		const plugin = stormglass();
		await expect(
			plugin.keyBuilder?.(
				{
					authType: 'api_key',
					keys: { get_api_key: async () => undefined },
				} as never,
				'endpoint',
			),
		).rejects.toThrow(AuthMissingError);
	});

	it('registers input and output schemas for every endpoint', () => {
		const keys = Object.keys(StormglassEndpointInputSchemas);
		expect(keys).toHaveLength(6);
		for (const key of keys) {
			expect(
				StormglassEndpointOutputSchemas[
					key as keyof typeof StormglassEndpointOutputSchemas
				],
			).toBeDefined();
		}
	});
});

describe('Elevation for Point', () => {
	it('fetches elevation for a coordinate', async () => {
		mockRequest.mockResolvedValue({
			data: { elevation: 15.42, time: '2026-08-29T00:00:00+00:00' },
			meta: { lat: 27.9, lng: -82.8 },
		});

		const input = StormglassEndpointInputSchemas.elevationPoint.parse({
			lat: 27.9,
			lng: -82.8,
		});
		const result = await elevationPoint(mockCtx, input);

		expect(result).toEqual({
			data: { elevation: 15.42, time: '2026-08-29T00:00:00+00:00' },
			meta: { lat: 27.9, lng: -82.8 },
		});
		StormglassEndpointOutputSchemas.elevationPoint.parse(result);

		const opts = lastRequestOptions();
		expect(opts?.url).toBe('elevation/point');
		expect(opts?.query).toEqual({ lat: 27.9, lng: -82.8 });
		expect(logEventFromContext).toHaveBeenCalledWith(
			mockCtx,
			'stormglass.elevation.point',
			input,
			'completed',
		);
	});

	it('rejects out-of-range latitude', () => {
		expect(() =>
			StormglassEndpointInputSchemas.elevationPoint.parse({ lat: 200, lng: 0 }),
		).toThrow();
	});
});

describe('Tide Stations', () => {
	it('lists tide stations in a bounding box', async () => {
		mockRequest.mockResolvedValue({
			data: [{ name: 'Station A', lat: 38.0, lng: -122.0, distance: 1.2 }],
			meta: { box: '38.0,-122.0:37.5,-122.5' },
		});

		const input = StormglassEndpointInputSchemas.tideStationsArea.parse({
			box: '38.0,-122.0:37.5,-122.5',
		});
		const result = await stationsArea(mockCtx, input);

		expect(result.data).toHaveLength(1);
		StormglassEndpointOutputSchemas.tideStationsArea.parse(result);

		const opts = lastRequestOptions();
		expect(opts?.url).toBe('tide/stations');
		expect(opts?.query).toEqual({ box: '38.0,-122.0:37.5,-122.5' });
	});

	it('rejects a malformed bounding box', () => {
		expect(() =>
			StormglassEndpointInputSchemas.tideStationsArea.parse({
				box: 'not-a-box',
			}),
		).toThrow();
	});

	it('lists all tide stations with no query params', async () => {
		mockRequest.mockResolvedValue({
			data: [{ name: 'Station B', lat: 10, lng: 20 }],
		});

		const input = StormglassEndpointInputSchemas.tideStationsList.parse({});
		const result = await stationsList(mockCtx, input);

		expect(result.data).toHaveLength(1);
		StormglassEndpointOutputSchemas.tideStationsList.parse(result);

		const opts = lastRequestOptions();
		expect(opts?.url).toBe('tide/stations');
		expect(opts?.query).toBeUndefined();
		expect(logEventFromContext).toHaveBeenCalledWith(
			mockCtx,
			'stormglass.tide.stationsList',
			{},
			'completed',
		);
	});
});

describe('Tide Extremes for a Point', () => {
	it('fetches tide extremes for a coordinate', async () => {
		mockRequest.mockResolvedValue({
			data: [
				{ height: 0.5, time: '2026-08-29T01:00:00+00:00', type: 'high' },
				{ height: -0.2, time: '2026-08-29T07:00:00+00:00', type: 'low' },
			],
			meta: { datum: 'MLLW' },
		});

		const input = StormglassEndpointInputSchemas.tideExtremesPoint.parse({
			lat: 27.9,
			lng: -82.8,
			start: '2026-08-29T00:00:00+00:00',
			end: '2026-08-30T00:00:00+00:00',
			datum: 'MLLW',
		});
		const result = await extremesPoint(mockCtx, input);

		expect(result.data).toHaveLength(2);
		StormglassEndpointOutputSchemas.tideExtremesPoint.parse(result);

		const opts = lastRequestOptions();
		expect(opts?.url).toBe('tide/extremes/point');
		expect(opts?.query).toEqual({
			lat: 27.9,
			lng: -82.8,
			start: '2026-08-29T00:00:00+00:00',
			end: '2026-08-30T00:00:00+00:00',
			datum: 'MLLW',
		});
	});
});

describe('Solar Data for a Point', () => {
	it('joins params into a comma-separated query string', async () => {
		mockRequest.mockResolvedValue({
			hours: [{ time: '2026-08-29T00:00:00+00:00', uvIndex: { sg: 4 } }],
			meta: {},
		});

		const input = StormglassEndpointInputSchemas.solarPoint.parse({
			lat: 27.9,
			lng: -82.8,
			params: ['uvIndex', 'solarDownwardRadiationFlux'],
			source: 'sg',
		});
		const result = await solarPoint(mockCtx, input);

		expect(result.hours).toHaveLength(1);
		StormglassEndpointOutputSchemas.solarPoint.parse(result);

		const opts = lastRequestOptions();
		expect(opts?.url).toBe('solar/point');
		expect(opts?.query).toMatchObject({
			lat: 27.9,
			lng: -82.8,
			params: 'uvIndex,solarDownwardRadiationFlux',
			source: 'sg',
		});
	});

	it('requires at least one param', () => {
		expect(() =>
			StormglassEndpointInputSchemas.solarPoint.parse({
				lat: 0,
				lng: 0,
				params: [],
			}),
		).toThrow();
	});
});

describe('Weather Data for a Point', () => {
	it('joins params into a comma-separated query string', async () => {
		mockRequest.mockResolvedValue({
			hours: [
				{
					time: '2026-08-29T00:00:00+00:00',
					airTemperature: { noaa: 24.1, sg: 23.8 },
					waveHeight: { sg: 0.4 },
				},
			],
			meta: {},
		});

		const input = StormglassEndpointInputSchemas.weatherPoint.parse({
			lat: 27.9,
			lng: -82.8,
			params: ['airTemperature', 'waveHeight'],
			start: '2026-08-29T00:00:00+00:00',
		});
		const result = await weatherPoint(mockCtx, input);

		expect(result.hours).toHaveLength(1);
		StormglassEndpointOutputSchemas.weatherPoint.parse(result);

		const opts = lastRequestOptions();
		expect(opts?.url).toBe('weather/point');
		expect(opts?.query).toMatchObject({
			lat: 27.9,
			lng: -82.8,
			params: 'airTemperature,waveHeight',
			start: '2026-08-29T00:00:00+00:00',
		});
	});
});

describe('auth header', () => {
	it('sends the raw API key in the Authorization header, not Bearer-prefixed', async () => {
		mockRequest.mockResolvedValue({ data: { elevation: 1 } });

		await makeStormglassRequest('elevation/point', 'raw-key', {
			query: { lat: 0, lng: 0 },
		});

		const config = lastRequestConfig();
		expect(config?.HEADERS).toEqual({ Authorization: 'raw-key' });
		expect(config?.TOKEN).toBeUndefined();
	});
});

describe('rate-limit and auth errors', () => {
	it('preserves Retry-After on HTTP 429', async () => {
		mockRequest.mockRejectedValue(
			new ApiError(
				{ method: 'GET', url: 'weather/point' },
				{
					url: 'https://api.stormglass.io/v2/weather/point',
					ok: false,
					status: 429,
					statusText: 'Too Many Requests',
					body: { errors: { key: 'Too Many Requests' } },
				},
				'Too Many Requests',
				{ retryAfter: 2000 },
			),
		);

		const err = await makeStormglassRequest('weather/point', 'k').catch(
			(error: unknown) => error,
		);
		expect(err).toBeInstanceOf(StormglassRateLimitError);
		expect((err as StormglassRateLimitError).retryAfterMs).toBe(2000);
		expect(errorHandlers.RATE_LIMIT_ERROR.match(err as Error)).toBe(true);
		await expect(
			errorHandlers.RATE_LIMIT_ERROR.handler(err as Error),
		).resolves.toEqual({ maxRetries: 5, headersRetryAfterMs: 2000 });
	});

	it('maps 401 to AUTH_ERROR with no retry', async () => {
		mockRequest.mockRejectedValue(
			new ApiError(
				{ method: 'GET', url: 'weather/point' },
				{
					url: 'https://api.stormglass.io/v2/weather/point',
					ok: false,
					status: 401,
					statusText: 'Unauthorized',
					body: { errors: { key: 'No Authorization header was found' } },
				},
				'Unauthorized',
			),
		);

		const err = await makeStormglassRequest('weather/point', 'bad-key').catch(
			(error: unknown) => error,
		);
		expect(err).toBeInstanceOf(StormglassAPIError);
		expect((err as StormglassAPIError).status).toBe(401);
		expect((err as StormglassAPIError).message).toBe(
			'No Authorization header was found',
		);
		expect(errorHandlers.AUTH_ERROR.match(err as Error)).toBe(true);
		await expect(errorHandlers.AUTH_ERROR.handler()).resolves.toEqual({
			maxRetries: 0,
		});
	});
});
