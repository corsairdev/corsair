import { makeOpenseaRequest, OpenseaAPIError } from './client';
import { OpenseaEndpointOutputSchemas as Outputs } from './endpoints/types';

/**
 * Live smoke against the real API. Read-only and few calls: OpenSea publishes a
 * rate limit but no numbers, and a free key's window is small enough that a long
 * chain of calls trips it.
 *
 * Run with `OPENSEA_API_KEY=... pnpm test:live` from `packages/opensea`. CI
 * skips `api.test.ts` by name.
 */
const API_KEY = process.env.OPENSEA_API_KEY;
const describeIfKey = API_KEY ? describe : describe.skip;

// unknown: a rejection can be any value until the instanceof check narrows it.
async function failure(
	// unknown: a rejection can be any value until the instanceof check narrows it.
	promise: Promise<unknown>,
): Promise<OpenseaAPIError> {
	const error = await promise.catch((e: unknown) => e);
	expect(error).toBeInstanceOf(OpenseaAPIError);
	if (!(error instanceof OpenseaAPIError)) throw error;
	return error;
}

if (!API_KEY) {
	console.warn(
		'[opensea] OPENSEA_API_KEY is not set: the live smoke tests are skipped, not passing.',
	);
}

describeIfKey('OpenSea live smoke', () => {
	it('lists chains', async () => {
		const raw = await makeOpenseaRequest(API_KEY as string, {
			method: 'GET',
			path: '/chains',
		});

		const result = Outputs.chainsList.parse(raw);
		expect(result.chains.length).toBeGreaterThan(0);
		expect(result.chains.map((chain) => chain.chain)).toContain('ethereum');
	});

	it('reads one collection and its stats', async () => {
		const raw = await makeOpenseaRequest(API_KEY as string, {
			method: 'GET',
			path: '/collections/boredapeyachtclub',
		});
		const collection = Outputs.collectionsGet.safeParse(raw);
		expect(collection.success).toBe(true);
		if (!collection.success) return;
		expect(collection.data.collection).toBe('boredapeyachtclub');

		const statsRaw = await makeOpenseaRequest(API_KEY as string, {
			method: 'GET',
			path: '/collections/boredapeyachtclub/stats',
		});
		expect(Outputs.collectionsStats.safeParse(statsRaw).success).toBe(true);
	});

	it('reports a rejected key as an auth error', async () => {
		const error = await failure(
			makeOpenseaRequest('not-a-real-key', {
				method: 'GET',
				path: '/collections',
			}),
		);

		expect(error.kind).toBe('unauthorized');
		expect(error.status).toBe(401);
	});
});
