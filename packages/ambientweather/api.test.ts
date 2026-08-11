import type { ApiRequestOptions, ApiResult } from 'corsair/http';
import { ApiError, request } from 'corsair/http';
import {
	makeAmbientWeatherRequest,
	packAmbientWeatherCredentials,
	parseAmbientWeatherKey,
} from './client';
import { getData, list } from './endpoints/devices';
import {
	AmbientWeatherDeviceDataResponseSchema,
	AmbientWeatherDeviceListResponseSchema,
	AmbientWeatherEndpointOutputSchemas,
} from './endpoints/types';
import { ambientweather, ambientweatherAuthConfig } from './index';

jest.mock('corsair/http', () => {
	const actual = jest.requireActual(
		'corsair/http',
	) as typeof import('corsair/http');
	return {
		...actual,
		request: jest.fn(),
	};
});

const mockedRequest = request as jest.MockedFunction<typeof request>;

const sampleDevice = {
	macAddress: '00:11:22:33:44:55',
	info: {
		name: 'Backyard Station',
		location: 'Patio',
	},
	lastData: {
		dateutc: 1720000000000,
		date: '2018-01-08T18:35:00.000Z',
		tz: 'America/Los_Angeles',
		tempf: 66.9,
		humidity: 30,
		winddir: 58,
		windspeedmph: 0.9,
		yearlyrainin: 0,
		feelsLike: 66.9,
		dewPoint: 34.45,
	},
};

describe('ambientweather client', () => {
	beforeEach(() => {
		mockedRequest.mockReset();
	});

	it('packs and parses credentials for the key builder', () => {
		const credentials = {
			apiKey: 'user-api-key',
			applicationKey: 'developer-app-key',
		};

		const packed = packAmbientWeatherCredentials(credentials);
		expect(parseAmbientWeatherKey(packed)).toEqual(credentials);
		expect(parseAmbientWeatherKey('not-json')).toBeNull();
	});

	it('adds both auth query params on every request', async () => {
		mockedRequest.mockResolvedValueOnce([sampleDevice]);

		const response = await makeAmbientWeatherRequest(
			'/v1/devices',
			'user-api-key',
			'developer-app-key',
			{
				query: {
					limit: 1,
				},
			},
		);

		AmbientWeatherDeviceListResponseSchema.parse(response);

		expect(mockedRequest).toHaveBeenCalledTimes(1);
		const firstCall = mockedRequest.mock.calls[0];
		expect(firstCall).toBeDefined();
		const [config, requestOptions, requestConfig] = firstCall!;

		expect(config.BASE).toBe('https://rt.ambientweather.net');
		expect(requestOptions.url).toBe('/v1/devices');
		expect(requestOptions.query).toEqual({
			limit: 1,
			apiKey: 'user-api-key',
			applicationKey: 'developer-app-key',
		});
		expect(requestConfig?.rateLimitConfig).toMatchObject({ maxRetries: 0 });
	});

	it('wraps 429 responses in AmbientWeatherRateLimitError', async () => {
		const apiError = new ApiError(
			{ method: 'GET', url: '/v1/devices' } as ApiRequestOptions,
			{
				url: 'https://rt.ambientweather.net/v1/devices',
				ok: false,
				status: 429,
				statusText: 'Too Many Requests',
				body: { error: 'rate limited' },
			} as ApiResult,
			'Too Many Requests',
			{ retryAfter: 1000 },
		);

		mockedRequest.mockRejectedValueOnce(apiError);

		await expect(
			makeAmbientWeatherRequest(
				'/v1/devices',
				'user-api-key',
				'developer-app-key',
			),
		).rejects.toMatchObject({
			name: 'AmbientWeatherRateLimitError',
			code: 429,
			status: 429,
		});
		expect(mockedRequest).toHaveBeenCalledTimes(1);
	});
});

describe('ambientweather endpoints', () => {
	beforeEach(() => {
		mockedRequest.mockReset();
	});

	it('lists devices and upserts them into the devices entity', async () => {
		mockedRequest.mockResolvedValueOnce([sampleDevice]);
		const upsertByEntityId = jest.fn().mockResolvedValue(undefined);

		const ctx = {
			key: packAmbientWeatherCredentials({
				apiKey: 'user-api-key',
				applicationKey: 'developer-app-key',
			}),
			db: { devices: { upsertByEntityId } },
		} as unknown as Parameters<typeof list>[0];

		const parsed = await list(ctx, {});

		AmbientWeatherEndpointOutputSchemas.devicesList.parse(parsed);
		expect(mockedRequest).toHaveBeenCalledTimes(1);
		expect(mockedRequest.mock.calls[0]?.[1]).toMatchObject({
			url: '/v1/devices',
			query: {
				apiKey: 'user-api-key',
				applicationKey: 'developer-app-key',
			},
		});
		expect(upsertByEntityId).toHaveBeenCalledWith('00:11:22:33:44:55', {
			macAddress: '00:11:22:33:44:55',
			name: 'Backyard Station',
			location: 'Patio',
			dateutc: 1720000000000,
			date: '2018-01-08T18:35:00.000Z',
			tz: 'America/Los_Angeles',
			tempf: 66.9,
			humidity: 30,
			winddir: 58,
			windspeedmph: 0.9,
			yearlyrainin: 0,
			feelsLike: 66.9,
			dewPoint: 34.45,
		});
	});

	it('fetches device history, omits unset limit, and upserts readings', async () => {
		const reading = {
			dateutc: 1720000000000,
			date: '2018-01-08T18:35:00.000Z',
			tz: 'America/Los_Angeles',
			tempf: 66.9,
			humidity: 30,
			yearlyrainin: 0,
		};
		mockedRequest.mockResolvedValueOnce([reading]);
		const upsertByEntityId = jest.fn().mockResolvedValue(undefined);

		const ctx = {
			key: packAmbientWeatherCredentials({
				apiKey: 'user-api-key',
				applicationKey: 'developer-app-key',
			}),
			db: { readings: { upsertByEntityId } },
		} as unknown as Parameters<typeof getData>[0];

		const parsed = await getData(ctx, {
			macAddress: '00:11:22:33:44:55',
			endDate: 1720000000000,
		});

		AmbientWeatherDeviceDataResponseSchema.parse(parsed);
		expect(mockedRequest).toHaveBeenCalledTimes(1);
		expect(mockedRequest.mock.calls[0]?.[1]).toMatchObject({
			url: '/v1/devices/{macAddress}',
			path: { macAddress: '00:11:22:33:44:55' },
			query: {
				apiKey: 'user-api-key',
				applicationKey: 'developer-app-key',
				endDate: 1720000000000,
			},
		});
		expect(mockedRequest.mock.calls[0]?.[1].query).not.toHaveProperty('limit');
		expect(upsertByEntityId).toHaveBeenCalledWith(
			'00:11:22:33:44:55:1720000000000',
			{
				macAddress: '00:11:22:33:44:55',
				dateutc: 1720000000000,
				date: '2018-01-08T18:35:00.000Z',
				tz: 'America/Los_Angeles',
				tempf: 66.9,
				humidity: 30,
				yearlyrainin: 0,
			},
		);
	});
});

describe('ambientweather factory', () => {
	it('registers the two read endpoints with the expected auth config', () => {
		const plugin = ambientweather();

		expect(plugin.id).toBe('ambientweather');
		expect(plugin.authConfig).toEqual(ambientweatherAuthConfig);
		expect(plugin.schema?.entities).toHaveProperty('devices');
		expect(plugin.schema?.entities).toHaveProperty('readings');
		expect(plugin.endpoints).toBeDefined();
		expect(plugin.endpoints!.devices.list).toEqual(expect.any(Function));
		expect(plugin.endpoints!.devices.getData).toEqual(expect.any(Function));
		expect(Object.keys(plugin.webhooks ?? {})).toHaveLength(0);
	});
});
