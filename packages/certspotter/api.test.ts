import { certspotter, certspotterEndpointSchemas } from './index';

/**
 * Live smoke test. It runs only when `CERTSPOTTER_API_KEY` is set.
 *
 * The free tier allows 100 single-hostname queries an hour and refuses with a
 * 503 `service_outage` when the system is loaded, which the keyless probe hit.
 * A 503 is therefore treated as a skip with a warning rather than a failure: the
 * free tier's availability is not this plugin's contract.
 *
 * Every answer goes through its endpoint's output schema before asserting.
 */
const API_KEY = process.env.CERTSPOTTER_API_KEY;
const describeIfKey = API_KEY ? describe : describe.skip;

if (!API_KEY) {
	// Say so out loud: a skipped suite reads as a pass in the summary otherwise.
	console.warn(
		'CERTSPOTTER_API_KEY is not set, skipping the live Cert Spotter tests',
	);
}

describeIfKey('Cert Spotter live API', () => {
	const issuances = certspotterEndpointSchemas['issuances.list'];

	// The raw client, built the way the plugin builds it.
	async function get(path: string, query?: Record<string, string | string[]>) {
		const { makeCertSpotterRequest } = await import('./client');
		return makeCertSpotterRequest(API_KEY ?? '', {
			method: 'GET',
			path,
			query,
		});
	}

	it('lists issuances for a well-known domain through the output schema', async () => {
		let raw: unknown;
		try {
			raw = await get('issuances', {
				domain: 'example.com',
				expand: ['dns_names', 'issuer'],
			});
		} catch (error) {
			// The free tier answers 503 service_outage under load.
			if (error instanceof Error && error.message.includes('service_outage')) {
				console.warn(
					'Cert Spotter free tier is unavailable; skipping the read',
				);
				return;
			}
			throw error;
		}

		const parsed = issuances.output.parse(raw);
		expect(Array.isArray(parsed)).toBe(true);
		for (const entry of parsed) {
			expect(typeof entry.id).toBe('string');
			expect(typeof entry.not_after).toBe('string');
		}
	});

	it('is wired with the key it was given', () => {
		expect(certspotter({ key: API_KEY }).id).toBe('certspotter');
	});
});
