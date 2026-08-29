import { makeStormglassRequest } from './client';
import type {
	ElevationPointResponse,
	SolarPointResponse,
	TideExtremesPointResponse,
	TideStationsResponse,
	WeatherPointResponse,
} from './endpoints/types';

const LIVE_KEY = process.env.STORMGLASS_API_KEY;
const describeIfKey = LIVE_KEY ? describe : describe.skip;

describeIfKey('Stormglass live API', () => {
	it('fetches elevation for a known coordinate', async () => {
		const res = await makeStormglassRequest<ElevationPointResponse>(
			'elevation/point',
			LIVE_KEY as string,
			{ query: { lat: 27.9, lng: -82.8 } },
		);
		expect(res.data).toBeDefined();
	});

	it('lists all tide stations', async () => {
		const res = await makeStormglassRequest<TideStationsResponse>(
			'tide/stations',
			LIVE_KEY as string,
		);
		expect(Array.isArray(res.data)).toBe(true);
	});

	it('lists tide stations in a bounding box', async () => {
		const res = await makeStormglassRequest<TideStationsResponse>(
			'tide/stations',
			LIVE_KEY as string,
			{ query: { box: '38.0,-122.0:37.5,-122.5' } },
		);
		expect(Array.isArray(res.data)).toBe(true);
	});

	it('fetches tide extremes for a point', async () => {
		const res = await makeStormglassRequest<TideExtremesPointResponse>(
			'tide/extremes/point',
			LIVE_KEY as string,
			{ query: { lat: 27.9, lng: -82.8 } },
		);
		expect(Array.isArray(res.data)).toBe(true);
	});

	it('fetches solar data for a point', async () => {
		const res = await makeStormglassRequest<SolarPointResponse>(
			'solar/point',
			LIVE_KEY as string,
			{ query: { lat: 27.9, lng: -82.8, params: 'uvIndex' } },
		);
		expect(Array.isArray(res.hours)).toBe(true);
	});

	it('fetches weather data for a point', async () => {
		const res = await makeStormglassRequest<WeatherPointResponse>(
			'weather/point',
			LIVE_KEY as string,
			{ query: { lat: 27.9, lng: -82.8, params: 'airTemperature' } },
		);
		expect(Array.isArray(res.hours)).toBe(true);
	});
});
