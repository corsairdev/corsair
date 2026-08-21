import {
	AirPollutionHistoryInputSchema,
	CircleCityInputSchema,
	CurrentWeatherInputSchema,
	Forecast5DayInputSchema,
	GeocodingDirectInputSchema,
	OpenWeatherMapEndpointInputSchemas,
	OpenWeatherMapEndpointOutputSchemas,
	StationCreateInputSchema,
	StationCreateResponseSchema,
	StationGetMeasurementsResponseSchema,
	WeatherMapTileInputSchema,
	WeatherMapTileResponseSchema,
} from './endpoints/types';

describe('OpenWeatherMap schema validation', () => {
	it('accepts current weather by lat/lon', () => {
		const parsed = CurrentWeatherInputSchema.parse({
			lat: 51.5,
			lon: -0.12,
			units: 'metric',
		});
		expect(parsed.lat).toBe(51.5);
	});

	it('rejects multiple location identifiers for current weather', () => {
		expect(() =>
			CurrentWeatherInputSchema.parse({
				q: 'London',
				lat: 51.5,
				lon: -0.12,
			}),
		).toThrow();
	});

	it('accepts forecast input with city name only', () => {
		const parsed = Forecast5DayInputSchema.parse({ q: 'London,uk' });
		expect(parsed.q).toBe('London,uk');
	});

	it('validates air pollution history time range', () => {
		expect(() =>
			AirPollutionHistoryInputSchema.parse({
				lat: 51.5,
				lon: -0.12,
				start: 2000,
				end: 1000,
			}),
		).toThrow();
	});

	it('accepts geocoding direct input', () => {
		const parsed = GeocodingDirectInputSchema.parse({
			q: 'London,UK',
			limit: 1,
		});
		expect(parsed.limit).toBe(1);
	});

	it('accepts circle city input', () => {
		const parsed = CircleCityInputSchema.parse({
			lat: 51.5,
			lon: -0.12,
			cnt: 5,
		});
		expect(parsed.cnt).toBe(5);
	});

	it('accepts weather map tile input', () => {
		const parsed = WeatherMapTileInputSchema.parse({
			layer: 'TA2',
			z: 1,
			x: 0,
			y: 0,
		});
		expect(parsed.layer).toBe('TA2');
	});

	it('requires map tiles to be image/png', () => {
		expect(() =>
			WeatherMapTileResponseSchema.parse({
				contentType: 'image/jpeg',
				dataBase64: 'YWJj',
			}),
		).toThrow();
		expect(() =>
			WeatherMapTileResponseSchema.parse({
				dataBase64: 'YWJj',
			}),
		).toThrow();
		expect(
			WeatherMapTileResponseSchema.parse({
				contentType: 'image/png',
				dataBase64: 'YWJj',
			}).contentType,
		).toBe('image/png');
	});

	it('accepts station create input', () => {
		const parsed = StationCreateInputSchema.parse({
			external_id: 'test-1',
			name: 'Test',
			latitude: 51.5,
			longitude: -0.12,
			altitude: 10,
		});
		expect(parsed.name).toBe('Test');
	});

	it('rejects empty city name as a location selector', () => {
		expect(() => CurrentWeatherInputSchema.parse({ q: '' })).toThrow();
		expect(() => CurrentWeatherInputSchema.parse({ q: '   ' })).toThrow();
		expect(() => CurrentWeatherInputSchema.parse({ zip: '' })).toThrow();
	});

	it('does not forward xml or html weather modes', () => {
		const current = CurrentWeatherInputSchema.parse({
			lat: 51.5,
			lon: -0.12,
			mode: 'xml',
		});
		expect('mode' in current).toBe(false);
		const forecast = Forecast5DayInputSchema.parse({
			q: 'London',
			mode: 'html',
		});
		expect('mode' in forecast).toBe(false);
		const circle = CircleCityInputSchema.parse({
			lat: 51.5,
			lon: -0.12,
			mode: 'xml',
		});
		expect('mode' in circle).toBe(false);
	});

	it('accepts hourly station measurements with nested aggregates', () => {
		const parsed = StationGetMeasurementsResponseSchema.parse([
			{
				station_id: 'abc',
				date: 1500000000,
				temperature: { min: 1, max: 10, average: 5, weight: 2 },
			},
		]);
		expect(parsed).toHaveLength(1);
	});

	it('normalizes station create uppercase ID to id', () => {
		const parsed = StationCreateResponseSchema.parse({
			ID: '583436dd9643a9000196b8d6',
		});
		expect(parsed.id).toBe('583436dd9643a9000196b8d6');
		expect('ID' in parsed).toBe(false);
	});

	it('registers schemas for all 21 endpoints', () => {
		const expectedEndpointKeys = [
			'oneCall',
			'timeMachine',
			'daySummary',
			'overview',
			'currentWeather',
			'forecast5Day',
			'circleCity',
			'airPollutionCurrent',
			'airPollutionForecast',
			'airPollutionHistory',
			'geocodingDirect',
			'geocodingReverse',
			'geocodingByZip',
			'weatherMapTile',
			'stationsList',
			'stationsGet',
			'stationsCreate',
			'stationsUpdate',
			'stationsRemove',
			'stationsGetMeasurements',
			'stationsSubmitMeasurements',
		] as const;

		expect(Object.keys(OpenWeatherMapEndpointInputSchemas).sort()).toEqual(
			[...expectedEndpointKeys].sort(),
		);
		expect(Object.keys(OpenWeatherMapEndpointOutputSchemas).sort()).toEqual(
			[...expectedEndpointKeys].sort(),
		);
		expect(
			Object.keys(OpenWeatherMapEndpointInputSchemas).some((key) =>
				key.startsWith('uv'),
			),
		).toBe(false);
		expect(
			Object.keys(OpenWeatherMapEndpointOutputSchemas).some((key) =>
				key.startsWith('uv'),
			),
		).toBe(false);
	});
});
