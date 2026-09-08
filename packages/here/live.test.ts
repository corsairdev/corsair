jest.mock('corsair/core', () => ({
	logEventFromContext: jest.fn().mockResolvedValue(undefined),
}));

import { coordinatesToTileIndices } from './endpoints/maps';
import { getRoutes } from './endpoints/routing';
import { discover, geocode, reverseGeocode } from './endpoints/search';
import { getStations } from './endpoints/transit';
import { getWeatherObservation } from './endpoints/weather';

const LIVE_KEY = process.env.HERE_API_KEY ?? '';
const describeLive =
	process.env.HERE_LIVE && LIVE_KEY ? describe : describe.skip;

function ctx() {
	return { key: LIVE_KEY, options: {} } as any;
}

describeLive('HERE live API', () => {
	it('geocodes Berlin then reverse-geocodes the first hit', async () => {
		const coded = await geocode(ctx(), {
			q: 'Invalidenstr 117, Berlin',
			limit: 1,
		});
		const position = coded.items?.[0]?.position;
		expect(position?.lat).toEqual(expect.any(Number));
		expect(position?.lng).toEqual(expect.any(Number));

		const reversed = await reverseGeocode(ctx(), {
			at: `${position!.lat},${position!.lng}`,
			limit: 1,
		});
		expect(reversed.items?.[0]?.address?.city).toBeDefined();
	});

	it('discovers a place and calculates a short car route', async () => {
		const found = await discover(ctx(), {
			q: 'Brandenburg Gate',
			at: '52.5163,13.3777',
			limit: 1,
		});
		expect(found.items?.[0]?.title).toEqual(expect.any(String));

		const route = await getRoutes(ctx(), {
			origin: '52.5308,13.3847',
			destination: '52.5163,13.3777',
			return: 'summary',
		});
		expect(route.routes?.length).toBeGreaterThan(0);
	});

	it('reads weather and nearby transit stations', async () => {
		const weather = await getWeatherObservation(ctx(), {
			q: 'Berlin',
			oneObservation: true,
		});
		expect(Array.isArray(weather.places)).toBe(true);

		const stations = await getStations(ctx(), {
			in: '52.5200,13.4050;r=400',
		});
		expect(stations).toBeDefined();
	});

	it('converts coordinates to a Web Mercator tile', async () => {
		const tile = await coordinatesToTileIndices(ctx(), {
			lat: 52.52,
			lng: 13.4,
			zoom: 14,
		});
		expect(tile.z).toBe(14);
		expect(tile.x).toBeGreaterThan(0);
		expect(tile.y).toBeGreaterThan(0);
	});
});
