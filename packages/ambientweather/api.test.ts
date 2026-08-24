import {
	AmbientWeatherRateLimitError,
	makeAmbientWeatherRequest,
	packAmbientWeatherCredentials,
	parseAmbientWeatherKey,
} from './client';
import { getData, list } from './endpoints/devices';
import {
	AmbientWeatherDeviceDataResponseSchema,
	AmbientWeatherEndpointOutputSchemas,
} from './endpoints/types';
import { ambientweather, ambientweatherAuthConfig } from './index';

const mockFetch = jest.fn();

beforeAll(() => {
	globalThis.fetch = mockFetch as typeof fetch;
});

beforeEach(() => {
	mockFetch.mockReset();
});

function jsonResponse(body: unknown, init?: ResponseInit): Response {
	return new Response(JSON.stringify(body), {
		status: 200,
		headers: { 'Content-Type': 'application/json' },
		...init,
	});
}

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
		mockFetch.mockResolvedValueOnce(jsonResponse([sampleDevice]));

		const response = await makeAmbientWeatherRequest(
			'/v1/devices',
			'user-api-key',
			'developer-app-key',
			{ query: { limit: 1 } },
		);

		AmbientWeatherEndpointOutputSchemas.devicesList.parse(response);
		expect(mockFetch).toHaveBeenCalledTimes(1);

		const called = mockFetch.mock.calls[0]?.[0];
		expect(called).toBeInstanceOf(URL);
		const url = called as URL;
		expect(url.origin).toBe('https://rt.ambientweather.net');
		expect(url.pathname).toBe('/v1/devices');
		expect(url.searchParams.get('apiKey')).toBe('user-api-key');
		expect(url.searchParams.get('applicationKey')).toBe('developer-app-key');
		expect(url.searchParams.get('limit')).toBe('1');
	});

	it('wraps 429 responses in AmbientWeatherRateLimitError', async () => {
		mockFetch.mockResolvedValueOnce(
			jsonResponse(
				{ error: 'rate limited' },
				{ status: 429, statusText: 'Too Many Requests' },
			),
		);

		await expect(
			makeAmbientWeatherRequest(
				'/v1/devices',
				'user-api-key',
				'developer-app-key',
			),
		).rejects.toBeInstanceOf(AmbientWeatherRateLimitError);
		expect(mockFetch).toHaveBeenCalledTimes(1);
	});

	it('parses Retry-After delta-seconds and HTTP-date', async () => {
		mockFetch.mockResolvedValueOnce(
			new Response(JSON.stringify({ error: 'rate limited' }), {
				status: 429,
				statusText: 'Too Many Requests',
				headers: {
					'Content-Type': 'application/json',
					'Retry-After': '2',
				},
			}),
		);

		await expect(
			makeAmbientWeatherRequest(
				'/v1/devices',
				'user-api-key',
				'developer-app-key',
			),
		).rejects.toMatchObject({
			name: 'AmbientWeatherRateLimitError',
			retryAfter: 2000,
		});

		const future = new Date(Date.now() + 5000).toUTCString();
		mockFetch.mockResolvedValueOnce(
			new Response(JSON.stringify({ error: 'rate limited' }), {
				status: 429,
				statusText: 'Too Many Requests',
				headers: {
					'Content-Type': 'application/json',
					'Retry-After': future,
				},
			}),
		);

		const err = await makeAmbientWeatherRequest(
			'/v1/devices',
			'user-api-key',
			'developer-app-key',
		).catch((error: unknown) => error);
		expect(err).toBeInstanceOf(AmbientWeatherRateLimitError);
		expect((err as AmbientWeatherRateLimitError).retryAfter).toBeGreaterThan(0);
	});
});

describe('ambientweather endpoints', () => {
	it('lists devices and upserts them into the devices entity', async () => {
		mockFetch.mockResolvedValueOnce(jsonResponse([sampleDevice]));
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
		expect(mockFetch).toHaveBeenCalledTimes(1);
		const url = mockFetch.mock.calls[0]?.[0] as URL;
		expect(url.pathname).toBe('/v1/devices');
		expect(url.searchParams.get('apiKey')).toBe('user-api-key');
		expect(url.searchParams.get('applicationKey')).toBe('developer-app-key');
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
		mockFetch.mockResolvedValueOnce(jsonResponse([reading]));
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
		expect(mockFetch).toHaveBeenCalledTimes(1);
		const url = mockFetch.mock.calls[0]?.[0] as URL;
		expect(url.pathname).toBe('/v1/devices/00%3A11%3A22%3A33%3A44%3A55');
		expect(url.searchParams.get('apiKey')).toBe('user-api-key');
		expect(url.searchParams.get('applicationKey')).toBe('developer-app-key');
		expect(url.searchParams.get('endDate')).toBe('1720000000000');
		expect(url.searchParams.has('limit')).toBe(false);
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
