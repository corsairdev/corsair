import { AmbeeEndpointInputSchemas, AmbeeEndpointOutputSchemas } from './types';

describe('input schemas', () => {
	it('rejects out-of-range coordinates before an API call is made', () => {
		expect(
			AmbeeEndpointInputSchemas.airQualityGetLatestByLatLng.safeParse({
				lat: 91,
				lng: 0,
			}).success,
		).toBe(false);
		expect(
			AmbeeEndpointInputSchemas.airQualityGetLatestByLatLng.safeParse({
				lat: 0,
				lng: 181,
			}).success,
		).toBe(false);
		expect(
			AmbeeEndpointInputSchemas.airQualityGetLatestByLatLng.safeParse({
				lat: 12.99,
				lng: 77.57,
			}).success,
		).toBe(true);
	});

	it('accepts either a coordinate pair or a place name for pollen, but not neither or both', () => {
		expect(
			AmbeeEndpointInputSchemas.pollenGetLatest.safeParse({
				lat: 41.38,
				lng: 2.16,
			}).success,
		).toBe(true);
		expect(
			AmbeeEndpointInputSchemas.pollenGetLatest.safeParse({
				place: 'Barcelona',
			}).success,
		).toBe(true);
		expect(
			AmbeeEndpointInputSchemas.pollenGetLatest.safeParse({ speciesRisk: true })
				.success,
		).toBe(false);
		expect(
			AmbeeEndpointInputSchemas.pollenGetLatest.safeParse({
				lat: 41.38,
				lng: 2.16,
				place: 'Barcelona',
			}).success,
		).toBe(false);
	});

	it('requires a three-letter ISO country code', () => {
		expect(
			AmbeeEndpointInputSchemas.airQualityGetLatestByPostalCode.safeParse({
				postalCode: '560020',
				countryCode: 'IND',
			}).success,
		).toBe(true);
		expect(
			AmbeeEndpointInputSchemas.airQualityGetLatestByPostalCode.safeParse({
				postalCode: '560020',
				countryCode: 'IN',
			}).success,
		).toBe(false);
	});

	it('limits the pollen forecast horizon to the two Ambee supports', () => {
		expect(
			AmbeeEndpointInputSchemas.pollenGetForecast.safeParse({
				place: 'california',
				hours: 120,
			}).success,
		).toBe(true);
		expect(
			AmbeeEndpointInputSchemas.pollenGetForecast.safeParse({
				place: 'california',
				hours: 72,
			}).success,
		).toBe(false);
	});

	it('requires both ends of a history range', () => {
		expect(
			AmbeeEndpointInputSchemas.airQualityGetHistoryByLatLng.safeParse({
				lat: 12.99,
				lng: 77.57,
				from: '2026-07-13 12:16:44',
			}).success,
		).toBe(false);
	});

	it('restricts the fire type filter to reported or detected', () => {
		expect(
			AmbeeEndpointInputSchemas.fireGetLatestByPlace.safeParse({
				place: 'Virgin, UT',
				type: 'smouldering',
			}).success,
		).toBe(false);
	});
});

describe('output schemas', () => {
	it('requires the Ambee status envelope', () => {
		expect(
			AmbeeEndpointOutputSchemas.airQualityGetLatestByLatLng.safeParse({
				stations: [],
			}).success,
		).toBe(false);
	});

	it('accepts a station whose sensors report only some pollutants', () => {
		const parsed =
			AmbeeEndpointOutputSchemas.airQualityGetLatestByCity.safeParse({
				message: 'success',
				stations: [{ PM25: 12.5, city: 'Bengaluru' }],
			});

		expect(parsed.success).toBe(true);
	});

	it('passes provider-side fields we do not model through untouched', () => {
		const parsed = AmbeeEndpointOutputSchemas.weatherGetLatest.parse({
			message: 'success',
			lat: 40,
			lng: -77,
			data: { temperature: 70, someNewAmbeeField: 'kept' },
		});

		expect(parsed.data).toMatchObject({ someNewAmbeeField: 'kept' });
	});

	it('normalises weather history/forecast data when Ambee returns an object', () => {
		const asPoint = AmbeeEndpointOutputSchemas.weatherGetForecast.parse({
			message: 'success',
			data: { temperature: 70, humidity: 40 },
		});
		expect(asPoint.data).toEqual([{ temperature: 70, humidity: 40 }]);

		const nested = AmbeeEndpointOutputSchemas.weatherGetHistory.parse({
			message: 'success',
			data: { forecast: [{ temperature: 71 }, { temperature: 72 }] },
		});
		expect(nested.data).toHaveLength(2);
	});

	it('accepts the per-species pollen breakdown as an open record', () => {
		const parsed = AmbeeEndpointOutputSchemas.pollenGetLatest.parse({
			message: 'success',
			data: [
				{
					Count: { grass_pollen: 0 },
					Species: { Tree: { Alder: 1, Birch: 0 }, Others: 0 },
				},
			],
		});

		expect(parsed.data?.[0]?.Species).toEqual({
			Tree: { Alder: 1, Birch: 0 },
			Others: 0,
		});
	});

	it('accepts geocode coordinates whether Ambee returns them as strings or numbers', () => {
		expect(
			AmbeeEndpointOutputSchemas.geocodeByPlace.safeParse({
				message: 'success',
				data: [{ lat: '40.71', lng: '-74.00' }],
			}).success,
		).toBe(true);
		expect(
			AmbeeEndpointOutputSchemas.geocodeByPlace.safeParse({
				message: 'success',
				data: [{ lat: 40.71, lng: -74.0 }],
			}).success,
		).toBe(true);
	});

	it('covers every endpoint with an input and an output schema', () => {
		const inputKeys = Object.keys(AmbeeEndpointInputSchemas).sort();
		const outputKeys = Object.keys(AmbeeEndpointOutputSchemas).sort();

		expect(inputKeys).toEqual(outputKeys);
		expect(inputKeys).toHaveLength(29);
	});

	it('restricts the disasters continent filter to Ambee’s codes', () => {
		expect(
			AmbeeEndpointInputSchemas.disastersGetLatestByContinent.safeParse({
				continent: 'NAR',
			}).success,
		).toBe(true);
		expect(
			AmbeeEndpointInputSchemas.disastersGetLatestByContinent.safeParse({
				continent: 'Atlantis',
			}).success,
		).toBe(false);
	});

	it('rejects non-positive pagination values on the disasters endpoints', () => {
		expect(
			AmbeeEndpointInputSchemas.disastersGetLatestByCountryCode.safeParse({
				countryCode: 'IND',
				page: 0,
			}).success,
		).toBe(false);
		expect(
			AmbeeEndpointInputSchemas.disastersGetLatestByCountryCode.safeParse({
				countryCode: 'IND',
				page: 2,
				limit: 50,
			}).success,
		).toBe(true);
	});

	it('restricts disasters eventType to Ambee’s documented codes', () => {
		expect(
			AmbeeEndpointInputSchemas.disastersGetLatestByCountryCode.safeParse({
				countryCode: 'IND',
				eventType: 'EQ',
			}).success,
		).toBe(true);
		expect(
			AmbeeEndpointInputSchemas.disastersGetLatestByCountryCode.safeParse({
				countryCode: 'IND',
				eventType: 'ASTEROID',
			}).success,
		).toBe(false);
	});

	it('accepts a disasters payload under either `result` or `data`', () => {
		expect(
			AmbeeEndpointOutputSchemas.disastersGetLatestByLatLng.safeParse({
				message: 'success',
				result: [{ event_type: 'EQ' }],
			}).success,
		).toBe(true);
		expect(
			AmbeeEndpointOutputSchemas.disastersGetLatestByLatLng.safeParse({
				message: 'success',
				data: [{ event_type: 'FL' }],
			}).success,
		).toBe(true);
	});

	it('makes `to` optional only on the global disasters history endpoint', () => {
		expect(
			AmbeeEndpointInputSchemas.disastersGetHistoryByDateRange.safeParse({
				from: '2026-07-01 15:00:00',
			}).success,
		).toBe(true);
		expect(
			AmbeeEndpointInputSchemas.disastersGetHistoryByCountryCode.safeParse({
				countryCode: 'IND',
				from: '2026-07-01 15:00:00',
			}).success,
		).toBe(false);
	});
});
