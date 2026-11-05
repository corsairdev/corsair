import 'dotenv/config';
import { makeOpenWeatherMapRequest } from './client';
import type {
	AirPollutionResponse,
	CircleCityResponse,
	CurrentWeatherResponse,
	DaySummaryResponse,
	Forecast5DayResponse,
	GeocodingByZipResponse,
	GeocodingDirectResponse,
	GeocodingReverseResponse,
	OneCallResponse,
	OverviewResponse,
	Station,
	StationGetMeasurementsResponse,
	StationsListResponse,
	TimeMachineResponse,
	WeatherMapTileResponse,
} from './endpoints/types';
import { OpenWeatherMapEndpointOutputSchemas } from './endpoints/types';

const TEST_API_KEY = process.env.OPENWEATHERMAP_API_KEY;
const RUN_INTEGRATION_TESTS =
	process.env.OPENWEATHERMAP_INTEGRATION_TESTS === '1';
const describeIfApiKey =
	TEST_API_KEY && RUN_INTEGRATION_TESTS ? describe : describe.skip;

// London coordinates
const TEST_LAT = 51.5074;
const TEST_LON = -0.1278;

describeIfApiKey('OpenWeatherMap API Type Tests', () => {
	const apiKey = TEST_API_KEY!;
	describe('oneCall', () => {
		it('oneCall returns correct type', async () => {
			const response = await makeOpenWeatherMapRequest<OneCallResponse>(
				'onecall',
				apiKey,
				{
					query: {
						lat: TEST_LAT,
						lon: TEST_LON,
						units: 'metric',
					},
				},
			);

			OpenWeatherMapEndpointOutputSchemas.oneCall.parse(response);
			expect(response.timezone).toBeTruthy();
		});
	});

	describe('weather.current', () => {
		it('current weather by coordinates returns correct type', async () => {
			const response = await makeOpenWeatherMapRequest<CurrentWeatherResponse>(
				'weather',
				apiKey,
				{
					api: 'data25',
					query: {
						lat: TEST_LAT,
						lon: TEST_LON,
						units: 'metric',
					},
				},
			);

			OpenWeatherMapEndpointOutputSchemas.currentWeather.parse(response);
			expect(response.coord?.lat).toBeDefined();
		});
	});

	describe('weather.forecast5Day', () => {
		it('forecast5Day by coordinates returns correct type', async () => {
			const response = await makeOpenWeatherMapRequest<Forecast5DayResponse>(
				'forecast',
				apiKey,
				{
					api: 'data25',
					query: {
						lat: TEST_LAT,
						lon: TEST_LON,
						units: 'metric',
					},
				},
			);

			OpenWeatherMapEndpointOutputSchemas.forecast5Day.parse(response);
			expect(response.list?.length).toBeGreaterThan(0);
		});
	});

	describe('weather.circleCity', () => {
		it('circleCity returns correct type', async () => {
			const response = await makeOpenWeatherMapRequest<CircleCityResponse>(
				'find',
				apiKey,
				{
					api: 'data25',
					query: {
						lat: TEST_LAT,
						lon: TEST_LON,
						cnt: 5,
						units: 'metric',
					},
				},
			);

			OpenWeatherMapEndpointOutputSchemas.circleCity.parse(response);
			expect(response.count).toBeGreaterThan(0);
		});
	});

	describe('timeMachine', () => {
		it('timeMachine returns correct type', async () => {
			const historicalTimestamp = 1609459200;

			const response = await makeOpenWeatherMapRequest<TimeMachineResponse>(
				'onecall/timemachine',
				apiKey,
				{
					query: {
						lat: TEST_LAT,
						lon: TEST_LON,
						dt: historicalTimestamp,
						units: 'metric',
					},
				},
			);

			OpenWeatherMapEndpointOutputSchemas.timeMachine.parse(response);
			expect(response.data.length).toBeGreaterThan(0);
		});
	});

	describe('daySummary', () => {
		it('daySummary returns correct type', async () => {
			const response = await makeOpenWeatherMapRequest<DaySummaryResponse>(
				'onecall/day_summary',
				apiKey,
				{
					query: {
						lat: TEST_LAT,
						lon: TEST_LON,
						date: '2024-01-01',
						units: 'metric',
					},
				},
			);

			OpenWeatherMapEndpointOutputSchemas.daySummary.parse(response);
			expect(response.date).toBe('2024-01-01');
		});
	});

	describe('overview', () => {
		it('overview returns correct type', async () => {
			const response = await makeOpenWeatherMapRequest<OverviewResponse>(
				'onecall/overview',
				apiKey,
				{
					query: {
						lat: TEST_LAT,
						lon: TEST_LON,
						units: 'metric',
					},
				},
			);

			OpenWeatherMapEndpointOutputSchemas.overview.parse(response);
			expect(response.weather_overview).toBeTruthy();
		});
	});

	describe('airPollution', () => {
		it('current air pollution returns correct type', async () => {
			const response = await makeOpenWeatherMapRequest<AirPollutionResponse>(
				'air_pollution',
				apiKey,
				{
					api: 'data25',
					query: { lat: TEST_LAT, lon: TEST_LON },
				},
			);

			OpenWeatherMapEndpointOutputSchemas.airPollutionCurrent.parse(response);
			expect(response.list?.length).toBeGreaterThan(0);
		});

		it('air pollution forecast returns correct type', async () => {
			const response = await makeOpenWeatherMapRequest<AirPollutionResponse>(
				'air_pollution/forecast',
				apiKey,
				{
					api: 'data25',
					query: { lat: TEST_LAT, lon: TEST_LON },
				},
			);

			OpenWeatherMapEndpointOutputSchemas.airPollutionForecast.parse(response);
			expect(response.list?.length).toBeGreaterThan(0);
		});

		it('air pollution history returns correct type', async () => {
			const end = Math.floor(Date.now() / 1000);
			const start = end - 86400;

			const response = await makeOpenWeatherMapRequest<AirPollutionResponse>(
				'air_pollution/history',
				apiKey,
				{
					api: 'data25',
					query: {
						lat: TEST_LAT,
						lon: TEST_LON,
						start,
						end,
					},
				},
			);

			OpenWeatherMapEndpointOutputSchemas.airPollutionHistory.parse(response);
		});
	});

	describe('geocoding', () => {
		it('direct geocoding returns correct type', async () => {
			const response = await makeOpenWeatherMapRequest<GeocodingDirectResponse>(
				'direct',
				apiKey,
				{
					api: 'geo',
					query: { q: 'London,UK', limit: 1 },
				},
			);

			OpenWeatherMapEndpointOutputSchemas.geocodingDirect.parse(response);
			expect(response.length).toBeGreaterThan(0);
		});

		it('reverse geocoding returns correct type', async () => {
			const response =
				await makeOpenWeatherMapRequest<GeocodingReverseResponse>(
					'reverse',
					apiKey,
					{
						api: 'geo',
						query: { lat: TEST_LAT, lon: TEST_LON, limit: 1 },
					},
				);

			OpenWeatherMapEndpointOutputSchemas.geocodingReverse.parse(response);
			expect(response.length).toBeGreaterThan(0);
		});

		it('geocoding by zip returns correct type', async () => {
			const response = await makeOpenWeatherMapRequest<GeocodingByZipResponse>(
				'zip',
				apiKey,
				{
					api: 'geo',
					query: { zip: 'SW1A,GB' },
				},
			);

			OpenWeatherMapEndpointOutputSchemas.geocodingByZip.parse(response);
			expect(response.lat).toBeDefined();
		});
	});

	describe('maps.weatherMapTile', () => {
		it('weather map tile returns PNG base64', async () => {
			const response = await makeOpenWeatherMapRequest<WeatherMapTileResponse>(
				'weather/TA2/1/0/0',
				apiKey,
				{
					api: 'maps2',
					responseType: 'binary',
				},
			);

			OpenWeatherMapEndpointOutputSchemas.weatherMapTile.parse(response);
			expect(response.contentType).toBe('image/png');
			expect(response.dataBase64.length).toBeGreaterThan(0);
		});
	});

	describe('stations lifecycle', () => {
		const externalId = `corsair-test-${Date.now()}`;
		let stationId: string | undefined;

		afterAll(async () => {
			if (!stationId) return;
			await makeOpenWeatherMapRequest<{ success: true }>(
				`stations/${stationId}`,
				apiKey,
				{
					method: 'DELETE',
					responseType: 'empty',
				},
			);
		});

		it('lists stations', async () => {
			const response = await makeOpenWeatherMapRequest<StationsListResponse>(
				'stations',
				apiKey,
			);

			OpenWeatherMapEndpointOutputSchemas.stationsList.parse(response);
			expect(Array.isArray(response)).toBe(true);
		});

		it('creates a station', async () => {
			const response = await makeOpenWeatherMapRequest<Station>(
				'stations',
				apiKey,
				{
					method: 'POST',
					body: {
						external_id: externalId,
						name: 'Corsair Test Station',
						latitude: TEST_LAT,
						longitude: TEST_LON,
						altitude: 10,
					},
				},
			);

			const created =
				OpenWeatherMapEndpointOutputSchemas.stationsCreate.parse(response);
			stationId = created.id;
			expect(stationId).toBeTruthy();
		});

		it('gets the created station', async () => {
			const response = await makeOpenWeatherMapRequest<Station>(
				`stations/${stationId!}`,
				apiKey,
			);

			OpenWeatherMapEndpointOutputSchemas.stationsGet.parse(response);
			expect(response.external_id).toBe(externalId);
		});

		it('updates the station', async () => {
			const response = await makeOpenWeatherMapRequest<Station>(
				`stations/${stationId!}`,
				apiKey,
				{
					method: 'PUT',
					body: {
						external_id: externalId,
						name: 'Corsair Test Station Updated',
						latitude: TEST_LAT,
						longitude: TEST_LON,
						altitude: 12,
					},
				},
			);

			OpenWeatherMapEndpointOutputSchemas.stationsUpdate.parse(response);
			expect(response.name).toContain('Updated');
		});

		it('submits station measurements', async () => {
			const response = await makeOpenWeatherMapRequest<{ success: true }>(
				'measurements',
				apiKey,
				{
					method: 'POST',
					body: [
						{
							station_id: stationId!,
							dt: Math.floor(Date.now() / 1000),
							temperature: 15,
							humidity: 60,
							pressure: 1013,
						},
					],
					responseType: 'empty',
				},
			);

			OpenWeatherMapEndpointOutputSchemas.stationsSubmitMeasurements.parse(
				response,
			);
		});

		it('gets station measurements', async () => {
			const to = Math.floor(Date.now() / 1000);
			const from = to - 3600;

			const response =
				await makeOpenWeatherMapRequest<StationGetMeasurementsResponse>(
					'measurements',
					apiKey,
					{
						query: {
							station_id: stationId!,
							type: 'm',
							from,
							to,
							limit: 10,
						},
					},
				);

			OpenWeatherMapEndpointOutputSchemas.stationsGetMeasurements.parse(
				response,
			);
		});
	});
});
