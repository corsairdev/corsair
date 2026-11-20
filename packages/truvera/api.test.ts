import { truvera, truveraEndpointSchemas } from './index';

/**
 * Live smoke test. It runs only when `TRUVERA_API_KEY` is set.
 *
 * It reads the account's own resources and never issues a credential: on the
 * production host an issuance is a permanent, signed record, and on the testnet
 * host it still spends the account's transaction allowance. Verifying a
 * credential the caller supplies would need a real one, so the write paths stay
 * unverified here.
 *
 * Every answer is parsed through its output schema before asserting.
 */
const API_KEY = process.env.TRUVERA_API_KEY;
const describeIfKey = API_KEY ? describe : describe.skip;

if (!API_KEY) {
	// Say so out loud: a skipped suite reads as a pass in the summary otherwise.
	console.warn('TRUVERA_API_KEY is not set, skipping the live Truvera tests');
}

describeIfKey('Truvera live API', () => {
	const dids = truveraEndpointSchemas['dids.list'];
	const schemas = truveraEndpointSchemas['schemas.list'];
	const registries = truveraEndpointSchemas['registries.list'];
	const credentials = truveraEndpointSchemas['credentials.list'];

	// The raw client, built the way the plugin builds it.
	async function get(path: string, query?: Record<string, string | number>) {
		const { makeTruveraRequest } = await import('./client');
		return makeTruveraRequest(API_KEY ?? '', { method: 'GET', path, query });
	}

	it('lists DIDs through the output schema', async () => {
		const parsed = dids.output.parse(await get('dids'));
		expect(Array.isArray(parsed)).toBe(true);
	});

	it('lists schemas through the output schema', async () => {
		const parsed = schemas.output.parse(await get('schemas'));
		expect(Array.isArray(parsed)).toBe(true);
	});

	it('lists registries through the output schema', async () => {
		const parsed = registries.output.parse(await get('registries'));
		expect(Array.isArray(parsed)).toBe(true);
	});

	it('lists credential metadata through the output schema', async () => {
		const parsed = credentials.output.parse(
			await get('credentials', { limit: 1 }),
		);
		expect(Array.isArray(parsed)).toBe(true);
		expect(parsed.length).toBeLessThanOrEqual(1);
	});

	it('is wired with the key it was given', () => {
		expect(truvera({ key: API_KEY }).id).toBe('truvera');
	});
});
