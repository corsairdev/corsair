import { toneden, tonedenEndpointSchemas } from './index';

/**
 * Live smoke test. It runs only when `TONEDEN_ACCESS_TOKEN` is set.
 *
 * ToneDen issues access tokens through an OAuth authorization-code flow that a
 * person has to complete in a browser, so a token has to be pasted in rather
 * than obtained here. The calls are read-only and few.
 *
 * Every answer is parsed through its output schema before asserting.
 */
const ACCESS_TOKEN = process.env.TONEDEN_ACCESS_TOKEN;
const describeIfToken = ACCESS_TOKEN ? describe : describe.skip;

if (!ACCESS_TOKEN) {
	// Say so out loud: a skipped suite reads as a pass in the summary otherwise.
	console.warn(
		'TONEDEN_ACCESS_TOKEN is not set, skipping the live ToneDen tests',
	);
}

describeIfToken('ToneDen live API', () => {
	const links = tonedenEndpointSchemas['links.list'];
	const validPath = tonedenEndpointSchemas['links.validPath'];

	// The raw client, built the way the plugin builds it.
	async function get(
		path: string,
		query?: Record<string, string | number | boolean>,
	) {
		const { makeToneDenRequest } = await import('./client');
		return makeToneDenRequest(ACCESS_TOKEN ?? '', {
			method: 'GET',
			path,
			query,
		});
	}

	it('lists links through the output schema', async () => {
		const parsed = links.output.parse(await get('links', { limit: 1 }));
		expect(Array.isArray(parsed.links)).toBe(true);
	});

	it('checks a path through the output schema', async () => {
		const parsed = validPath.output.parse(
			await get('links/validPath', { path: 'this-path-is-probably-taken' }),
		);
		// Both answers are valid outcomes; only the shape matters here.
		expect(typeof parsed.valid).toBe('boolean');
	});

	it('is wired with the token it was given', () => {
		expect(toneden({ authType: 'api_key', key: ACCESS_TOKEN }).id).toBe(
			'toneden',
		);
	});
});
