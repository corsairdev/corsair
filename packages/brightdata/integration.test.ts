import { BrightDataAPIError, makeBrightDataRequest } from './client';
import {
	BrightDataCities,
	BrightDataCountries,
	BrightDataDataset,
	BrightDataZone,
} from './schema';

const LIVE_KEY = process.env.BRIGHTDATA_API_KEY;
const describeLive = LIVE_KEY ? describe : describe.skip;

describeLive('Bright Data live REST API', () => {
	it('rejects an invalid API key on GET /countrieslist', async () => {
		const err = await makeBrightDataRequest(
			'/countrieslist',
			'invalid-live-check',
		).catch((error: unknown) => error);
		expect(err).toBeInstanceOf(BrightDataAPIError);
		expect((err as BrightDataAPIError).status).toBe(401);
	});
});

describeLive('Bright Data live REST API (authenticated)', () => {
	it('returns countries from GET /countrieslist', async () => {
		const parsed = BrightDataCountries.parse(
			await makeBrightDataRequest('/countrieslist', LIVE_KEY),
		);
		expect(Object.keys(parsed).length).toBeGreaterThan(0);
	});

	it('returns DatasetListItem[] from GET /datasets/list', async () => {
		const datasets = BrightDataDataset.array().parse(
			await makeBrightDataRequest('/datasets/list', LIVE_KEY),
		);
		expect(datasets.length).toBeGreaterThan(0);
		expect(datasets[0]?.id.length).toBeGreaterThan(0);
	});

	it('returns Zone[] from GET /zone/get_active_zones', async () => {
		const zones = BrightDataZone.array().parse(
			await makeBrightDataRequest('/zone/get_active_zones', LIVE_KEY),
		);
		expect(Array.isArray(zones)).toBe(true);
	});

	it('returns city slugs from GET /zone/static/cities', async () => {
		const cities = BrightDataCities.parse(
			await makeBrightDataRequest('/zone/static/cities', LIVE_KEY, {
				query: { country: 'us' },
			}),
		);
		expect(cities.length).toBeGreaterThan(0);
		expect(cities[0]?.length).toBeGreaterThan(0);
	});

	it('GET /datasets/v3/progress/{id} errors on an unknown snapshot', async () => {
		const err = await makeBrightDataRequest(
			'/datasets/v3/progress/s_not_a_real_snapshot',
			LIVE_KEY as string,
		).catch((error: unknown) => error);
		expect(err).toBeInstanceOf(BrightDataAPIError);
		expect((err as BrightDataAPIError).status).toBeGreaterThanOrEqual(400);
	});
});
