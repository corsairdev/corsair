import {
	OpenseaEndpointInputSchemas as Inputs,
	OPENSEA_CHAINS,
	OPENSEA_EVENT_TYPES,
	OpenseaEndpointOutputSchemas as Outputs,
} from './endpoints/types';
import {
	accountFixture,
	bestOfferFixture,
	chainsFixture,
	collectionFixture,
	collectionStatsFixture,
	collectionsLastPageFixture,
	collectionsPageFixture,
	eventsPageFixture,
	floorPricesFixture,
	holdersFixture,
	listingFixture,
	listingsLastPageFixture,
	listingsPageFixture,
	nftFixture,
	nftsPageFixture,
	offersPageFixture,
	orderFixture,
	ownersFixture,
	portfolioFixture,
	searchFixture,
	traitsFixture,
} from './test-fixtures';

/**
 * Every output schema is parsed against the response the API sends for it, so a
 * shape the schema has drifted from fails here rather than in production. The
 * collection, stats, traits, listings and offers fixtures are real captured
 * bodies; the rest follow the published OpenAPI spec.
 */
describe('output schemas accept the documented responses', () => {
	const cases = [
		['chains.list', Outputs.chainsList, chainsFixture],
		['collections.list', Outputs.collectionsList, collectionsPageFixture],
		[
			'collections.list (last page)',
			Outputs.collectionsList,
			collectionsLastPageFixture,
		],
		['collections.get', Outputs.collectionsGet, collectionFixture],
		['collections.stats', Outputs.collectionsStats, collectionStatsFixture],
		['collections.top', Outputs.collectionsTop, collectionsPageFixture],
		[
			'collections.trending',
			Outputs.collectionsTrending,
			collectionsPageFixture,
		],
		['collection.nfts', Outputs.collectionNfts, nftsPageFixture],
		['nfts.get', Outputs.nftsGet, nftFixture],
		['events.list', Outputs.eventsList, eventsPageFixture],
		['search.search', Outputs.search, searchFixture],
		['traits.list', Outputs.traitsList, traitsFixture],
		['listings.best', Outputs.listingsBest, listingsPageFixture],
		[
			'listings.best (last page)',
			Outputs.listingsBest,
			listingsLastPageFixture,
		],
		['offers.collection', Outputs.offersCollection, offersPageFixture],
		['contract.nfts', Outputs.contractNfts, nftsPageFixture],
		['nfts.owners', Outputs.nftsOwners, ownersFixture],
		['events.collection', Outputs.eventsCollection, eventsPageFixture],
		['listings.all', Outputs.listingsAll, listingsPageFixture],
		['offers.all', Outputs.offersAll, offersPageFixture],
		['offers.best', Outputs.offersBest, bestOfferFixture],
		['orders.get', Outputs.ordersGet, orderFixture],
		[
			'collections.floorPrices',
			Outputs.collectionsFloorPrices,
			floorPricesFixture,
		],
		['collections.holders', Outputs.collectionsHolders, holdersFixture],
		['accounts.get', Outputs.accountsGet, accountFixture],
		['accounts.portfolio', Outputs.accountsPortfolio, portfolioFixture],
	] as const;

	for (const [name, schema, fixture] of cases) {
		it(`${name} parses its response`, () => {
			// unknown: the fixture is one of several unrelated shapes, narrowed by
			// the schema under test.
			// unknown: the fixture is one of several unrelated shapes, narrowed by the schema.
			const result = (
				schema as { safeParse: (v: unknown) => { success: boolean } }
			).safeParse(fixture);
			expect(result.success).toBe(true);
		});
	}
});

describe('output schemas reject wrong shapes', () => {
	it('rejects a chains body whose `chains` is a string', () => {
		expect(Outputs.chainsList.safeParse({ chains: 'ethereum' }).success).toBe(
			false,
		);
	});

	it('requires `chains` rather than treating a missing array as empty', () => {
		expect(Outputs.chainsList.safeParse({}).success).toBe(false);
	});

	it('requires `collections` on a page', () => {
		expect(Outputs.collectionsList.safeParse({ next: null }).success).toBe(
			false,
		);
	});

	it('rejects a collection missing its slug', () => {
		expect(
			Outputs.collectionsGet.safeParse({ name: 'Bored Ape Yacht Club' })
				.success,
		).toBe(false);
	});

	it('rejects a stats body whose `total` is missing', () => {
		expect(Outputs.collectionsStats.safeParse({ intervals: [] }).success).toBe(
			false,
		);
	});

	it('rejects a price that lost its string form', () => {
		// The wei value is a string on purpose; a number there is a bad shape.
		expect(
			Outputs.listingsBest.safeParse({
				listings: [{ chain: 'ethereum', price: { current: { value: 59 } } }],
				next: null,
			}).success,
		).toBe(false);
	});

	it('declares the per-value counts that traits.list returns', () => {
		// Live /traits/{slug}: a string trait maps each value to how many NFTs
		// carry it, a numeric trait carries `min` and `max`.
		expect(Object.keys(Outputs.traitsList.shape)).toContain('counts');
		const parsed = Outputs.traitsList.parse({
			categories: { Background: 'string', Level: 'number' },
			counts: {
				Background: { Blue: 1242, Gray: 1169 },
				Level: { min: 1, max: 99 },
			},
		});
		expect(parsed.counts?.Background).toEqual({ Blue: 1242, Gray: 1169 });
		expect(Outputs.traitsList.safeParse({ categories: {} }).success).toBe(true);
	});

	it('rejects a traits body whose categories are not strings', () => {
		expect(
			Outputs.traitsList.safeParse({ categories: { Background: ['Blue'] } })
				.success,
		).toBe(false);
	});

	it('rejects an NFT missing its identifier', () => {
		expect(
			Outputs.nftsGet.safeParse({ nft: { collection: 'x' } }).success,
		).toBe(false);
	});
});

describe('accepts the nullish values the API sends', () => {
	it('takes a collection with its empty-string links and null fields', () => {
		expect(
			Outputs.collectionsGet.safeParse({
				...collectionFixture,
				description: null,
				wiki_url: '',
				telegram_url: '',
				instagram_username: '',
			}).success,
		).toBe(true);
	});

	it('takes a listing with no protocol_data at all', () => {
		const { protocol_data: _omitted, ...withoutProtocol } = listingFixture;
		expect(
			Outputs.listingsBest.safeParse({
				listings: [withoutProtocol],
				next: null,
			}).success,
		).toBe(true);
	});

	it('takes a page whose cursor is absent rather than null', () => {
		const { next: _omitted, ...withoutCursor } = listingsPageFixture;
		expect(Outputs.listingsBest.safeParse(withoutCursor).success).toBe(true);
	});

	it('takes an event row with only the fields that type needs', () => {
		expect(
			Outputs.eventsList.safeParse({
				asset_events: [{ event_type: 'transfer' }],
				next: null,
			}).success,
		).toBe(true);
	});
});

describe('input descriptions say what the API reference says', () => {
	it('describes a trait filter as a JSON array of traitType and value', () => {
		for (const schema of [
			Inputs.collectionNfts,
			Inputs.listingsBest,
			Inputs.eventsCollection,
		]) {
			const text = schema.shape.traits.description ?? '';
			expect(text).toContain('[{"traitType":"Background","value":"Red"}]');
			expect(text).not.toContain('trait_type:value');
		}
	});

	it('describes resolution as a number of points, not seconds', () => {
		const text = Inputs.collectionsFloorPrices.shape.resolution.description;
		expect(text).toContain('data points');
		expect(text).not.toContain('seconds');
	});

	it('names the values search takes for asset_types', () => {
		expect(Inputs.search.shape.asset_types.description).toContain(
			'`collection`, `nft`, `token`, `account`',
		);
	});
});

describe('input schemas reject what the API would refuse', () => {
	it('accepts a chain OpenSea added after the spec snapshot', () => {
		// The live /chains route lists `arc` and `elysium`; the spec's
		// ChainIdentifier enum does not yet. The slug is passed through so a new
		// chain works without a release, and OpenSea refuses one it does not index.
		expect(
			Inputs.nftsGet.safeParse({
				chain: 'arc',
				address: '0xabc',
				identifier: '1',
			}).success,
		).toBe(true);
		expect(
			Inputs.collectionsTop.safeParse({ chains: ['elysium', 'ethereum'] })
				.success,
		).toBe(true);
		expect(Inputs.collectionsList.safeParse({ chain: '' }).success).toBe(false);
		expect(Inputs.collectionsList.safeParse({ chain: 1 }).success).toBe(false);
	});

	it('lists the chains known when this was written', () => {
		// A reference list, not a gate: the spec's 26 plus the two /chains adds.
		expect(OPENSEA_CHAINS).toHaveLength(28);
		expect(OPENSEA_CHAINS).toContain('solana');
		expect(OPENSEA_CHAINS).toContain('ape_chain');
		expect(OPENSEA_CHAINS).toContain('arc');
	});

	it('rejects an event type outside the enum', () => {
		expect(
			Inputs.eventsList.safeParse({ event_type: ['refund'] }).success,
		).toBe(false);
		expect(Inputs.eventsList.safeParse({ event_type: ['sale'] }).success).toBe(
			true,
		);
	});

	it('accepts every event type the spec lists, mint included', () => {
		// The spec's enum on `event_type` for /events and /events/collection/{slug}.
		for (const type of [
			'sale',
			'transfer',
			'mint',
			'listing',
			'offer',
			'trait_offer',
			'collection_offer',
		]) {
			expect(Inputs.eventsList.safeParse({ event_type: [type] }).success).toBe(
				true,
			);
			expect(
				Inputs.eventsCollection.safeParse({ slug: 'a', event_type: [type] })
					.success,
			).toBe(true);
		}
		expect(OPENSEA_EVENT_TYPES).toContain('mint');
	});

	it('rejects an empty slug', () => {
		expect(Inputs.collectionsGet.safeParse({ slug: '' }).success).toBe(false);
		expect(Inputs.traitsList.safeParse({ slug: '' }).success).toBe(false);
	});

	it('requires a search query', () => {
		expect(Inputs.search.safeParse({}).success).toBe(false);
		expect(Inputs.search.safeParse({ query: 'ape' }).success).toBe(true);
	});

	it('rejects a token identifier sent as a number', () => {
		// Ids past the safe integer range would arrive rounded, so the schema
		// takes a string only.
		expect(
			Inputs.nftsGet.safeParse({
				chain: 'ethereum',
				address: '0xabc',
				identifier: 1,
			}).success,
		).toBe(false);
	});

	it('rejects a page size below 1', () => {
		expect(Inputs.collectionsList.safeParse({ limit: 0 }).success).toBe(false);
		expect(Inputs.eventsList.safeParse({ limit: 0 }).success).toBe(false);
	});

	it('rejects an empty chain array where one value is required', () => {
		expect(Inputs.collectionsTop.safeParse({ chains: [] }).success).toBe(false);
	});

	it('rejects an empty event_type array', () => {
		expect(Inputs.eventsList.safeParse({ event_type: [] }).success).toBe(false);
	});

	it('accepts an empty input for the routes that take none', () => {
		expect(Inputs.chainsList.safeParse({}).success).toBe(true);
	});
});
