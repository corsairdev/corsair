import {
	AirPollutionHistoryInputSchema,
	CircleCityInputSchema,
	CurrentWeatherInputSchema,
	Forecast5DayInputSchema,
	GeocodingDirectInputSchema,
	OpenWeatherMapEndpointInputSchemas,
	OpenWeatherMapEndpointOutputSchemas,
	StationCreateInputSchema,
	WeatherMapTileInputSchema,
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

	it('registers schemas for all 24 endpoints', () => {
		expect(Object.keys(OpenWeatherMapEndpointInputSchemas)).toHaveLength(24);
		expect(Object.keys(OpenWeatherMapEndpointOutputSchemas)).toHaveLength(24);
	});
});
