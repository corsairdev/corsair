import { spotlightr, spotlightrEndpointSchemas } from './index';

/**
 * Live smoke test. It runs only when `SPOTLIGHTR_API_KEY` is set, and it only
 * reads: the account it points at is real, so creating or deleting a video here
 * would change someone's library.
 *
 * Every answer goes through its endpoint's output schema before the assertion,
 * so a field Spotlightr types differently than the schema expects fails here.
 */
const API_KEY = process.env.SPOTLIGHTR_API_KEY;
const describeIfKey = API_KEY ? describe : describe.skip;

if (!API_KEY) {
	// Say so out loud: a skipped suite reads as a pass in the summary otherwise.
	console.warn(
		'SPOTLIGHTR_API_KEY is not set, skipping the live Spotlightr tests',
	);
}

describeIfKey('Spotlightr live API', () => {
	const videos = spotlightrEndpointSchemas['videos.list'];
	const projects = spotlightrEndpointSchemas['projects.list'];
	const domains = spotlightrEndpointSchemas['domains.list'];

	// The raw client, built the way the plugin builds it.
	async function get(path: string, query?: Record<string, string | number>) {
		const { makeSpotlightrRequest } = await import('./client');
		return makeSpotlightrRequest(API_KEY ?? '', { method: 'GET', path, query });
	}

	it('lists videos through the output schema', async () => {
		const parsed = videos.output.parse(await get('api/videos'));
		expect(Array.isArray(parsed)).toBe(true);
	});

	it('lists projects through the output schema', async () => {
		const parsed = projects.output.parse(await get('groups'));
		expect(Array.isArray(parsed)).toBe(true);
	});

	it('lists embed domains through the output schema', async () => {
		const parsed = domains.output.parse(await get('api/user/domain'));
		expect(Array.isArray(parsed)).toBe(true);
	});

	it('is wired with the key it was given', () => {
		expect(spotlightr({ key: API_KEY }).id).toBe('spotlightr');
	});
});
