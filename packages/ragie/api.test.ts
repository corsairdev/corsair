import { RagieEndpointOutputSchemas as Outputs } from './endpoints/types';

/**
 * Live smoke, gated on RAGIE_API_KEY. Read-only and two calls total:
 * documents.list (page 1) and retrievals.retrieve, the reads the research
 * marks safe (retrievals is not documented as metered; the paid op is
 * responses.create, which this suite never calls). Every answer is parsed
 * through its output schema before it is asserted on, so a shape drift fails
 * here and not in a caller's hands.
 *
 * api.ragie.ai blocked the research probes at Google's edge, so no live call
 * has ever been made against this plugin; when a key is set this file is the
 * first real verification.
 */
const describeIfKey = process.env.RAGIE_API_KEY ? describe : describe.skip;

if (!process.env.RAGIE_API_KEY) {
	console.warn(
		'RAGIE_API_KEY is not set: the live smoke suite is skipped, and every response shape in this plugin remains unverified.',
	);
}

const BASE = 'https://api.ragie.ai';

const authHeaders = (): Record<string, string> => ({
	Authorization: `Bearer ${process.env.RAGIE_API_KEY ?? ''}`,
	Accept: 'application/json',
});

describeIfKey('ragie live', () => {
	it('lists the first page of documents', async () => {
		const response = await fetch(`${BASE}/documents`, {
			headers: authHeaders(),
		});
		expect(response.ok).toBe(true);
		const parsed = Outputs.documentsList.parse(await response.json());
		expect(Array.isArray(parsed.documents)).toBe(true);
	}, 60_000);

	it('retrieves chunks for a one-word query', async () => {
		const response = await fetch(`${BASE}/retrievals`, {
			method: 'POST',
			headers: { ...authHeaders(), 'Content-Type': 'application/json' },
			body: JSON.stringify({ query: 'test', top_k: 1 }),
		});
		expect(response.ok).toBe(true);
		const parsed = Outputs.retrievalsRetrieve.parse(await response.json());
		expect(Array.isArray(parsed.scored_chunks)).toBe(true);
	}, 60_000);
});
