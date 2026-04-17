import 'dotenv/config';
import { makeOpenWeatherMapRequest } from './client';
import type {
	DaySummaryResponse,
	OneCallResponse,
	OverviewResponse,
	TimeMachineResponse,
} from './endpoints/types';
import { OpenWeatherMapEndpointOutputSchemas } from './endpoints/types';

const TEST_API_KEY = process.env.OPENWEATHERMAP_API_KEY!;

// London coordinates
const TEST_LAT = 51.5074;
const TEST_LON = -0.1278;

describe('OpenWeatherMap API Type Tests', () => {
	describe('oneCall', () => {
		it('oneCall returns correct type', async () => {
			const response = await makeOpenWeatherMapRequest<OneCallResponse>(
				'onecall',
				TEST_API_KEY,
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

		it('oneCall with excluded sections returns correct type', async () => {
			const response = await makeOpenWeatherMapRequest<OneCallResponse>(
				'onecall',
				TEST_API_KEY,
				{
					query: {
						lat: TEST_LAT,
						lon: TEST_LON,
						units: 'metric',
						exclude: 'minutely,hourly,alerts',
					},
				},
			);

			OpenWeatherMapEndpointOutputSchemas.oneCall.parse(response);
		});

		it('oneCall with imperial units returns correct type', async () => {
			const response = await makeOpenWeatherMapRequest<OneCallResponse>(
				'onecall',
				TEST_API_KEY,
				{
					query: {
						lat: 40.7128,
						lon: -74.006,
						units: 'imperial',
					},
				},
			);

			OpenWeatherMapEndpointOutputSchemas.oneCall.parse(response);
		});

		it('oneCall with language returns correct type', async () => {
			const response = await makeOpenWeatherMapRequest<OneCallResponse>(
				'onecall',
				TEST_API_KEY,
				{
					query: {
						lat: 48.8566,
						lon: 2.3522,
						units: 'metric',
						lang: 'fr',
					},
				},
			);

			OpenWeatherMapEndpointOutputSchemas.oneCall.parse(response);
		});
	});

	describe('timeMachine', () => {
		it('timeMachine returns correct type', async () => {
			// Historical date: 2021-01-01 00:00:00 UTC
			const historicalTimestamp = 1609459200;

			const response = await makeOpenWeatherMapRequest<TimeMachineResponse>(
				'onecall/timemachine',
				TEST_API_KEY,
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

		it('timeMachine with imperial units returns correct type', async () => {
			// Historical date: 2020-06-15 12:00:00 UTC
			const historicalTimestamp = 1592222400;

			const response = await makeOpenWeatherMapRequest<TimeMachineResponse>(
				'onecall/timemachine',
				TEST_API_KEY,
				{
					query: {
						lat: 40.7128,
						lon: -74.006,
						dt: historicalTimestamp,
						units: 'imperial',
					},
				},
			);

			OpenWeatherMapEndpointOutputSchemas.timeMachine.parse(response);
		});

		it('timeMachine for different location returns correct type', async () => {
			// Historical date: 2022-03-20 00:00:00 UTC
			const historicalTimestamp = 1647734400;

			const response = await makeOpenWeatherMapRequest<TimeMachineResponse>(
				'onecall/timemachine',
				TEST_API_KEY,
				{
					query: {
						lat: 35.6762,
						lon: 139.6503,
						dt: historicalTimestamp,
						units: 'metric',
					},
				},
			);

			OpenWeatherMapEndpointOutputSchemas.timeMachine.parse(response);
		});
	});

	describe('daySummary', () => {
		it('daySummary returns correct type', async () => {
			const response = await makeOpenWeatherMapRequest<DaySummaryResponse>(
				'onecall/day_summary',
				TEST_API_KEY,
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

		it('daySummary with timezone returns correct type', async () => {
			const response = await makeOpenWeatherMapRequest<DaySummaryResponse>(
				'onecall/day_summary',
				TEST_API_KEY,
				{
					query: {
						lat: 48.8566,
						lon: 2.3522,
						date: '2024-06-15',
						units: 'metric',
						tz: '+01:00',
					},
				},
			);

			OpenWeatherMapEndpointOutputSchemas.daySummary.parse(response);
		});

		it('daySummary with imperial units returns correct type', async () => {
			const response = await makeOpenWeatherMapRequest<DaySummaryResponse>(
				'onecall/day_summary',
				TEST_API_KEY,
				{
					query: {
						lat: 40.7128,
						lon: -74.006,
						date: '2024-07-04',
						units: 'imperial',
					},
				},
			);

			OpenWeatherMapEndpointOutputSchemas.daySummary.parse(response);
			expect(response.temperature.max).toBeGreaterThanOrEqual(response.temperature.min);
		});
	});

	describe('overview', () => {
		it('overview returns correct type', async () => {
			const response = await makeOpenWeatherMapRequest<OverviewResponse>(
				'onecall/overview',
				TEST_API_KEY,
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

		it('overview with specific date returns correct type', async () => {
			const tomorrow = new Date();
			tomorrow.setDate(tomorrow.getDate() + 1);
			const tomorrowStr = tomorrow.toISOString().slice(0, 10);

			const response = await makeOpenWeatherMapRequest<OverviewResponse>(
				'onecall/overview',
				TEST_API_KEY,
				{
					query: {
						lat: 40.7128,
						lon: -74.006,
						date: tomorrowStr,
						units: 'imperial',
					},
				},
			);

			OpenWeatherMapEndpointOutputSchemas.overview.parse(response);
		});

		it('overview for different location returns correct type', async () => {
			const response = await makeOpenWeatherMapRequest<OverviewResponse>(
				'onecall/overview',
				TEST_API_KEY,
				{
					query: {
						lat: 35.6762,
						lon: 139.6503,
						units: 'metric',
					},
				},
			);

			OpenWeatherMapEndpointOutputSchemas.overview.parse(response);
			expect(response.weather_overview).toBeTruthy();
		});
	});
});
