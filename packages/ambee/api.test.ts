import { makeAmbeeRequest, toAmbeeTimestamp } from './client';
import { AmbeeEndpointOutputSchemas } from './endpoints/types';

/**
 * Live contract tests — they call the real Ambee API and therefore need a key.
 *
 * Run locally with:
 *   AMBEE_API_KEY=... pnpm --filter @corsair-dev/ambee test api.test.ts
 *
 * CI excludes `api.test.ts` (see .github/workflows/pr-checks.yml), and the
 * suite skips itself when no key is present so a keyless local run stays green.
 */
const API_KEY = process.env.AMBEE_API_KEY;
const describeLive = API_KEY ? describe : describe.skip;

// Bengaluru — inside every Ambee product's coverage area.
const LAT = 12.9889055;
const LNG = 77.574044;

describeLive('Ambee API contract', () => {
	const key = API_KEY as string;

	it('latest air quality by lat/lng matches the output schema', async () => {
		const response = await makeAmbeeRequest('latest/by-lat-lng', key, {
			query: { lat: LAT, lng: LNG },
		});

		const parsed =
			AmbeeEndpointOutputSchemas.airQualityGetLatestByLatLng.parse(response);
		expect(parsed.message).toBe('success');
		expect(Array.isArray(parsed.stations)).toBe(true);
	});

	it('latest air quality by city matches the output schema', async () => {
		const response = await makeAmbeeRequest('latest/by-city', key, {
			query: { city: 'Bengaluru' },
		});

		const parsed =
			AmbeeEndpointOutputSchemas.airQualityGetLatestByCity.parse(response);
		expect(parsed.message).toBe('success');
	});

	it('latest air quality by postal code matches the output schema', async () => {
		const response = await makeAmbeeRequest('latest/by-postal-code', key, {
			query: { postalCode: '560020', countryCode: 'IND' },
		});

		const parsed =
			AmbeeEndpointOutputSchemas.airQualityGetLatestByPostalCode.parse(
				response,
			);
		expect(parsed.message).toBe('success');
	});

	it('air quality history matches the output schema', async () => {
		const to = new Date();
		const from = new Date(to.getTime() - 12 * 60 * 60 * 1000);

		const response = await makeAmbeeRequest('history/by-lat-lng', key, {
			query: {
				lat: LAT,
				lng: LNG,
				from: toAmbeeTimestamp(from.toISOString()),
				to: toAmbeeTimestamp(to.toISOString()),
			},
		});

		const parsed =
			AmbeeEndpointOutputSchemas.airQualityGetHistoryByLatLng.parse(response);
		expect(parsed.message).toBe('success');
	});

	it('air quality forecast matches the output schema', async () => {
		const response = await makeAmbeeRequest('forecast/aq/by-lat-lng', key, {
			query: { lat: LAT, lng: LNG },
		});

		const parsed =
			AmbeeEndpointOutputSchemas.airQualityGetForecastByLatLng.parse(response);
		expect(parsed.message).toBe('success');
	});

	it('latest weather matches the output schema', async () => {
		const response = await makeAmbeeRequest('weather/latest/by-lat-lng', key, {
			query: { lat: LAT, lng: LNG },
		});

		const parsed = AmbeeEndpointOutputSchemas.weatherGetLatest.parse(response);
		expect(parsed.message).toBe('success');
		expect(typeof parsed.data?.temperature).toBe('number');
	});

	it('weather forecast matches the output schema', async () => {
		const response = await makeAmbeeRequest(
			'weather/forecast/by-lat-lng',
			key,
			{ query: { lat: LAT, lng: LNG } },
		);

		const parsed =
			AmbeeEndpointOutputSchemas.weatherGetForecast.parse(response);
		expect(parsed.message).toBe('success');
		expect(Array.isArray(parsed.data)).toBe(true);
	});

	it('latest pollen matches the output schema', async () => {
		const response = await makeAmbeeRequest('v3/pollen/latest', key, {
			query: { lat: LAT, lng: LNG },
		});

		const parsed = AmbeeEndpointOutputSchemas.pollenGetLatest.parse(response);
		expect(parsed.message).toBe('success');
	});

	it('pollen forecast matches the output schema', async () => {
		const response = await makeAmbeeRequest('v3/pollen/forecast/48hrs', key, {
			query: { lat: LAT, lng: LNG },
		});

		const parsed = AmbeeEndpointOutputSchemas.pollenGetForecast.parse(response);
		expect(parsed.message).toBe('success');
	});

	it('latest fires match the output schema', async () => {
		const response = await makeAmbeeRequest('fire/latest/by-lat-lng', key, {
			query: { lat: 36.2734752809624, lng: -106.7050318 },
		});

		const parsed =
			AmbeeEndpointOutputSchemas.fireGetLatestByLatLng.parse(response);
		expect(parsed.message).toBe('success');
	});

	it('elevation by lat/lng matches the output schema', async () => {
		const response = await makeAmbeeRequest(
			'elevation/latest/by-lat-lng',
			key,
			{
				// San Francisco — inside North America elevation coverage.
				query: { lat: 37.77355324503912, lng: -122.39428048824142 },
			},
		);

		const parsed =
			AmbeeEndpointOutputSchemas.elevationGetByLatLng.parse(response);
		// Free / unsubscribed keys get a documented empty envelope instead of 404.
		expect(['success', 'Data not available!']).toContain(parsed.message);
	});

	it('elevation by place matches the output schema', async () => {
		const response = await makeAmbeeRequest('elevation/latest/by-place', key, {
			query: { place: 'San Francisco, USA' },
		});

		const parsed =
			AmbeeEndpointOutputSchemas.elevationGetByPlace.parse(response);
		expect(['success', 'Data not available!']).toContain(parsed.message);
	});

	it('latest air quality by country code matches the output schema', async () => {
		const response = await makeAmbeeRequest('latest/by-country-code', key, {
			query: { countryCode: 'IND', limit: 2 },
		});

		const parsed =
			AmbeeEndpointOutputSchemas.airQualityGetLatestByCountryCode.parse(
				response,
			);
		expect(parsed.message).toBe('success');
	});

	it('weather history matches the output schema', async () => {
		const to = new Date();
		const from = new Date(to.getTime() - 12 * 60 * 60 * 1000);

		const response = await makeAmbeeRequest('weather/history/by-lat-lng', key, {
			query: {
				lat: LAT,
				lng: LNG,
				from: toAmbeeTimestamp(from.toISOString()),
				to: toAmbeeTimestamp(to.toISOString()),
			},
		});

		const parsed = AmbeeEndpointOutputSchemas.weatherGetHistory.parse(response);
		expect(parsed.message).toBe('success');
		expect(Array.isArray(parsed.data)).toBe(true);
	});

	it('pollen by place matches the output schema', async () => {
		const response = await makeAmbeeRequest('v3/pollen/latest', key, {
			query: { place: 'Barcelona' },
		});

		const parsed = AmbeeEndpointOutputSchemas.pollenGetLatest.parse(response);
		expect(parsed.message).toBe('success');
	});

	it('fire risk by lat/lng matches the output schema', async () => {
		const response = await makeAmbeeRequest('fire/risk/by-lat-lng', key, {
			query: { lat: 22.948819, lng: -101.495951 },
		});

		const parsed =
			AmbeeEndpointOutputSchemas.fireGetRiskByLatLng.parse(response);
		expect(parsed.message).toBe('success');
	});

	it('ILI forecast matches the output schema', async () => {
		const response = await makeAmbeeRequest('ili/forecast/by-lat-lng', key, {
			// San Francisco — inside Ambee ILI coverage (US / limited EU).
			query: { lat: 37.7749, lng: -122.4194, details: false },
		});

		const parsed =
			AmbeeEndpointOutputSchemas.iliGetForecastByLatLng.parse(response);
		expect(parsed.message).toBe('success');
	});

	it('latest natural disasters by country code match the output schema', async () => {
		const response = await makeAmbeeRequest(
			'disasters/latest/by-country-code',
			key,
			{ query: { countryCode: 'IND', limit: 5, page: 1 } },
		);

		const parsed =
			AmbeeEndpointOutputSchemas.disastersGetLatestByCountryCode.parse(
				response,
			);
		expect(parsed.message).toBe('success');
	});

	it('latest natural disasters by continent match the output schema', async () => {
		const response = await makeAmbeeRequest(
			'disasters/latest/by-continent',
			key,
			{ query: { continent: 'ASIA', limit: 5, page: 1 } },
		);

		const parsed =
			AmbeeEndpointOutputSchemas.disastersGetLatestByContinent.parse(response);
		expect(parsed.message).toBe('success');
	});

	it('geocoding matches the output schema', async () => {
		const response = await makeAmbeeRequest('geocode/by-place', key, {
			query: { place: 'new york' },
		});

		const parsed = AmbeeEndpointOutputSchemas.geocodeByPlace.parse(response);
		expect(parsed.message).toBe('success');
	});

	it('reverse geocoding matches the output schema', async () => {
		const response = await makeAmbeeRequest('geocode/reverse/by-lat-lng', key, {
			query: { lat: 42.66548262280807, lng: -73.79192663186527 },
		});

		const parsed =
			AmbeeEndpointOutputSchemas.geocodeReverseByLatLng.parse(response);
		expect(parsed.message).toBe('success');
	});
});
