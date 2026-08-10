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
		const sampleResponse = [
			{
				macAddress: '00:11:22:33:44:55',
				info: {
					name: 'Backyard Station',
					location: 'Patio',
				},
				lastData: {
					dateutc: 1720000000000,
					date: '2024-07-03 12:00:00',
					tz: 'America/Los_Angeles',
					tempf: 72.5,
					humidity: 44,
				},
			},
		];

		mockedRequest.mockResolvedValueOnce(sampleResponse);

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

		expect(config.BASE).toBe('https://api.ambientweather.net');
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
				url: 'https://api.ambientweather.net/v1/devices',
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

	it('lists devices using the packed account credentials', async () => {
		const response = [
			{
				macAddress: '00:11:22:33:44:55',
				info: {
					name: 'Backyard Station',
					location: 'Patio',
				},
				lastData: {
					dateutc: 1720000000000,
					date: '2024-07-03 12:00:00',
					tz: 'America/Los_Angeles',
					tempf: 72.5,
					humidity: 44,
				},
			},
		];

		mockedRequest.mockResolvedValueOnce(response);

		const ctx = {
			key: packAmbientWeatherCredentials({
				apiKey: 'user-api-key',
				applicationKey: 'developer-app-key',
			}),
		} as Parameters<typeof list>[0];

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
	});

	it('fetches device history with path params and query args', async () => {
		const response = [
			{
				dateutc: 1720000000000,
				date: '2024-07-03 12:00:00',
				tz: 'America/Los_Angeles',
				tempf: 72.5,
				humidity: 44,
			},
		];

		mockedRequest.mockResolvedValueOnce(response);

		const ctx = {
			key: packAmbientWeatherCredentials({
				apiKey: 'user-api-key',
				applicationKey: 'developer-app-key',
			}),
		} as Parameters<typeof getData>[0];

		const parsed = await getData(ctx, {
			macAddress: '00:11:22:33:44:55',
			limit: 12,
			endDate: 1720000000000,
		});

		AmbientWeatherDeviceDataResponseSchema.parse(parsed);
		expect(mockedRequest).toHaveBeenCalledTimes(1);
		expect(mockedRequest.mock.calls[0]?.[1]).toMatchObject({
			url: '/v1/devices/00%3A11%3A22%3A33%3A44%3A55',
			query: {
				apiKey: 'user-api-key',
				applicationKey: 'developer-app-key',
				limit: 12,
				endDate: 1720000000000,
			},
		});
	});
});

describe('ambientweather factory', () => {
	it('registers the two read endpoints with the expected auth config', () => {
		const plugin = ambientweather();

		expect(plugin.id).toBe('ambientweather');
		expect(plugin.authConfig).toEqual(ambientweatherAuthConfig);
		expect(plugin.endpoints).toBeDefined();
		expect(plugin.endpoints!.devices.list).toEqual(expect.any(Function));
		expect(plugin.endpoints!.devices.getData).toEqual(expect.any(Function));
		expect(Object.keys(plugin.webhooks ?? {})).toHaveLength(0);
	});
});
