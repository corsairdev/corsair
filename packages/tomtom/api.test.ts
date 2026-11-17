import { tomtom, tomtomEndpointSchemas } from './index';

/**
 * Live smoke test. It runs only when `TOMTOM_API_KEY` is set.
 *
 * The free tier allows 2,500 search requests a month, so the calls here stay
 * few and read-only. Every answer is parsed through its output schema before
 * asserting.
 */
const API_KEY = process.env.TOMTOM_API_KEY;
const describeIfKey = API_KEY ? describe : describe.skip;

if (!API_KEY) {
	// Say so out loud: a skipped suite reads as a pass in the summary otherwise.
	console.warn('TOMTOM_API_KEY is not set, skipping the live TomTom tests');
}

describeIfKey('TomTom live API', () => {
	const fuzzy = tomtomEndpointSchemas['search.fuzzy'];
	const geocode = tomtomEndpointSchemas['search.geocode'];
	const reverse = tomtomEndpointSchemas['search.reverseGeocode'];
	const flow = tomtomEndpointSchemas['traffic.flow'];

	// The raw client, built the way the plugin builds it.
	async function get(
		path: string,
		query?: Record<string, string | number | boolean>,
	) {
		const { makeTomTomRequest } = await import('./client');
		return makeTomTomRequest(API_KEY ?? '', { method: 'GET', path, query });
	}

	it('searches for a place through the output schema', async () => {
		const parsed = fuzzy.output.parse(
			await get('search/2/search/amsterdam.json', { limit: 1 }),
		);
		expect(parsed.results.length).toBeLessThanOrEqual(1);
		if (parsed.results.length > 0) {
			expect(typeof parsed.results[0]?.type).toBe('string');
		}
	});

	it('geocodes an address through the output schema', async () => {
		const parsed = geocode.output.parse(
			await get('search/2/geocode/Damrak%201%20Amsterdam.json', { limit: 1 }),
		);
		expect(Array.isArray(parsed.results)).toBe(true);
	});

	it('reverse geocodes a point through the output schema', async () => {
		const parsed = reverse.output.parse(
			await get('search/2/reverseGeocode/52.378,4.9.json'),
		);
		expect(parsed.addresses.length).toBeGreaterThan(0);
	});

	it('reads traffic flow at a point through the output schema', async () => {
		const parsed = flow.output.parse(
			await get('traffic/services/4/flowSegmentData/absolute/10/json', {
				point: '52.37,4.89',
			}),
		);
		expect(parsed.flowSegmentData).toBeDefined();
	});

	it('is wired with the key it was given', () => {
		expect(tomtom({ key: API_KEY }).id).toBe('tomtom');
	});
});
