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
	// unknown: a rejection can be any value until the instanceof check narrows it.
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

	it('pages with the cursor it got back', async () => {
		const first = Outputs.collectionsList.parse(
			await makeOpenseaRequest(API_KEY as string, {
				method: 'GET',
				path: '/collections',
				query: { limit: 2 },
			}),
		);
		expect(first.collections).toHaveLength(2);
		if (!first.next) return;

		const second = Outputs.collectionsList.parse(
			await makeOpenseaRequest(API_KEY as string, {
				method: 'GET',
				path: '/collections',
				query: { limit: 2, next: first.next },
			}),
		);
		// A cursor that did not advance would repeat the same slugs.
		const firstSlugs = first.collections.map((c) => c.collection);
		const secondSlugs = second.collections.map((c) => c.collection);
		expect(secondSlugs).not.toEqual(firstSlugs);
	});

	it('reads a keyed NFT by chain, contract and id', async () => {
		const raw = await makeOpenseaRequest(API_KEY as string, {
			method: 'GET',
			path: '/chain/ethereum/contract/0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D/nfts/1',
		});
		const result = Outputs.nftsGet.parse(raw);
		expect(result.nft.identifier).toBe('1');
		expect(result.nft.contract.toLowerCase()).toBe(
			'0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d',
		);
	});

	it('reads events and search', async () => {
		const events = Outputs.eventsList.parse(
			await makeOpenseaRequest(API_KEY as string, {
				method: 'GET',
				path: '/events',
				query: { limit: 1 },
			}),
		);
		expect(events.asset_events.length).toBeGreaterThan(0);

		const search = Outputs.search.parse(
			await makeOpenseaRequest(API_KEY as string, {
				method: 'GET',
				path: '/search',
				query: { query: 'ape' },
			}),
		);
		expect(search.results.length).toBeGreaterThan(0);
		expect(search.results[0]?.type).toBeTruthy();
	});

	it('reads best listings and collection offers', async () => {
		const listings = Outputs.listingsBest.parse(
			await makeOpenseaRequest(API_KEY as string, {
				method: 'GET',
				path: '/listings/collection/boredapeyachtclub/best',
				query: { limit: 1 },
			}),
		);
		expect(listings.listings.length).toBeGreaterThan(0);
		expect(listings.listings[0]?.order_hash).toBeTruthy();

		const offers = Outputs.offersCollection.parse(
			await makeOpenseaRequest(API_KEY as string, {
				method: 'GET',
				path: '/offers/collection/boredapeyachtclub',
				query: { limit: 1 },
			}),
		);
		expect(offers.offers.length).toBeGreaterThan(0);
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
