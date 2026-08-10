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
