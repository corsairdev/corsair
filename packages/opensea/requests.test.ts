import type { OpenseaContext } from './index';
import { opensea } from './index';
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

const API_KEY = 'opensea-test-key';

let fetchMock: jest.SpyInstance;

// unknown: a response body is arbitrary JSON until a schema reads it.
// unknown: a response body is arbitrary JSON until a schema reads it.
function respond(body: unknown, status = 200) {
	fetchMock.mockResolvedValueOnce(
		new Response(JSON.stringify(body), {
			status,
			headers: { 'Content-Type': 'application/json' },
		}),
	);
}

type Logged = { accountIdRequested: boolean };

function makeContext(logged: Logged) {
	// unknown: the endpoints read `key`, and the log path reads `$getAccountId`
	// and `database`. The log writer tolerates a missing database and returns
	// null, so only the account lookup is asserted here. integration.test.ts
	// runs the same endpoints against a real context.
	const ctx = {
		key: API_KEY,
		$getAccountId: jest.fn(async () => {
			logged.accountIdRequested = true;
			return 'account-1';
		}),
	} as const;
	// unknown: only `key` and the log path's two members are read; the endpoint
	// code never touches the rest. integration.test.ts runs the same endpoints
	// against a real context.
	return ctx as unknown as OpenseaContext;
}

function lastCall() {
	const [url, init] = fetchMock.mock.calls.at(-1) as [string, RequestInit];
	return {
		url,
		parsed: new URL(url),
		init,
		headers: new Headers(init.headers),
		body: init.body ? JSON.parse(String(init.body)) : undefined,
	};
}

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch');
});

afterEach(() => {
	fetchMock.mockRestore();
	jest.restoreAllMocks();
});

const plugin = opensea({ key: API_KEY });
// `CorsairPlugin.endpoints` is optional on the type; this plugin always sets it.
const endpoints = plugin.endpoints as NonNullable<typeof plugin.endpoints>;

/** Runs one endpoint with a minimal context and the real input type. */
async function run<In, Out>(
	input: In,
	fn: (ctx: OpenseaContext, input: In) => Promise<Out>,
) {
	const logged: Logged = { accountIdRequested: false };
	const ctx = makeContext(logged);
	const result = await fn(ctx, input);
	return { result, logged };
}

describe('chains', () => {
	it('chains.list GETs /chains with no query', async () => {
		respond(chainsFixture);

		const { result, logged } = await run({}, endpoints.chains.list);

		const { parsed, init, headers } = lastCall();
		expect(init.method).toBe('GET');
		expect(parsed.pathname).toBe('/api/v2/chains');
		expect(parsed.searchParams.toString()).toBe('');
		expect(headers.get('x-api-key')).toBe(API_KEY);
		expect(result.chains).toHaveLength(2);
		expect(logged.accountIdRequested).toBe(true);
	});
});

describe('collections', () => {
	it('collections.list GETs /collections with every filter', async () => {
		respond(collectionsPageFixture);

		const { result } = await run(
			{
				chain: 'ethereum',
				creator_username: 'apes',
				include_hidden: true,
				order_by: 'seven_day_volume',
				limit: 10,
				next: 'CURSOR',
			},
			endpoints.collections.list,
		);

		const { parsed, init } = lastCall();
		expect(init.method).toBe('GET');
		expect(parsed.pathname).toBe('/api/v2/collections');
		expect(parsed.searchParams.get('chain')).toBe('ethereum');
		expect(parsed.searchParams.get('creator_username')).toBe('apes');
		expect(parsed.searchParams.get('include_hidden')).toBe('true');
		expect(parsed.searchParams.get('order_by')).toBe('seven_day_volume');
		expect(parsed.searchParams.get('limit')).toBe('10');
		expect(parsed.searchParams.get('next')).toBe('CURSOR');
		expect(result.collections).toHaveLength(1);
		expect(result.next).toBe('LXBrPTIxNTAwMDAwMDA');
	});

	it('collections.list omits filters the caller did not pass', async () => {
		respond(collectionsPageFixture);

		await run({}, endpoints.collections.list);

		expect(lastCall().parsed.searchParams.toString()).toBe('');
	});

	it('collections.list reports a null cursor on the last page', async () => {
		respond(collectionsLastPageFixture);

		const { result } = await run({}, endpoints.collections.list);

		expect(result.next).toBeNull();
	});

	it('collections.get GETs /collections/{slug}', async () => {
		respond(collectionFixture);

		const { result } = await run(
			{ slug: 'boredapeyachtclub' },
			endpoints.collections.get,
		);

		const { parsed, init } = lastCall();
		expect(init.method).toBe('GET');
		expect(parsed.pathname).toBe('/api/v2/collections/boredapeyachtclub');
		expect(result.collection).toBe('boredapeyachtclub');
	});

	it('collections.stats sends no request for a dot-segment slug', async () => {
		// `/collections/./stats` would be requested as `/collections/stats`, the
		// collections.get route for a collection named "stats".
		for (const slug of ['.', '..']) {
			await expect(run({ slug }, endpoints.collections.stats)).rejects.toThrow(
				'not a valid path value',
			);
		}
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('collections.stats GETs /collections/{slug}/stats', async () => {
		respond(collectionStatsFixture);

		const { result } = await run(
			{ slug: 'boredapeyachtclub' },
			endpoints.collections.stats,
		);

		const { parsed } = lastCall();
		expect(parsed.pathname).toBe('/api/v2/collections/boredapeyachtclub/stats');
		expect(result.total.floor_price).toBe(9.4);
	});

	it('collections.top GETs /collections/top with a comma-joined chain list', async () => {
		respond(collectionsPageFixture);

		await run(
			{
				sort_by: 'one_day_volume',
				chains: ['ethereum', 'base'],
				category: 'pfps',
				limit: 5,
				cursor: 'C1',
			},
			endpoints.collections.top,
		);

		const { parsed, init } = lastCall();
		expect(init.method).toBe('GET');
		expect(parsed.pathname).toBe('/api/v2/collections/top');
		expect(parsed.searchParams.get('chains')).toBe('ethereum,base');
		expect(parsed.searchParams.get('sort_by')).toBe('one_day_volume');
		expect(parsed.searchParams.get('cursor')).toBe('C1');
	});

	it('collections.trending GETs /collections/trending with a timeframe', async () => {
		respond(collectionsPageFixture);

		await run(
			{ timeframe: 'seven_days', chains: ['ethereum'], limit: 3 },
			endpoints.collections.trending,
		);

		const { parsed } = lastCall();
		expect(parsed.pathname).toBe('/api/v2/collections/trending');
		expect(parsed.searchParams.get('timeframe')).toBe('seven_days');
		expect(parsed.searchParams.get('chains')).toBe('ethereum');
	});

	it('collection.nfts GETs /collection/{slug}/nfts with a trait filter', async () => {
		respond(nftsPageFixture);

		const { result } = await run(
			{
				slug: 'boredapeyachtclub',
				traits: '[{"traitType":"Background","value":"Blue"}]',
				limit: 2,
				next: 'N1',
			},
			endpoints.collection.nfts,
		);

		const { parsed, init } = lastCall();
		expect(init.method).toBe('GET');
		expect(parsed.pathname).toBe('/api/v2/collection/boredapeyachtclub/nfts');
		expect(parsed.searchParams.get('traits')).toBe(
			'[{"traitType":"Background","value":"Blue"}]',
		);
		expect(result.nfts).toHaveLength(1);
	});

	it('traits.list GETs /traits/{slug}', async () => {
		respond(traitsFixture);

		const { result } = await run(
			{ slug: 'boredapeyachtclub' },
			endpoints.traits.list,
		);

		expect(lastCall().parsed.pathname).toBe('/api/v2/traits/boredapeyachtclub');
		expect(result.categories.Background).toBe('string');
	});
});

describe('nfts', () => {
	it('nfts.get puts chain, contract and identifier in the path', async () => {
		respond(nftFixture);

		const { result } = await run(
			{
				chain: 'ethereum',
				address: '0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D',
				identifier: '1',
			},
			endpoints.nfts.get,
		);

		const { parsed, init } = lastCall();
		expect(init.method).toBe('GET');
		expect(parsed.pathname).toBe(
			'/api/v2/chain/ethereum/contract/0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D/nfts/1',
		);
		expect(result.nft.identifier).toBe('1');
	});

	it('nfts.get sends a chain slug newer than the spec', async () => {
		respond(nftFixture);

		await run(
			{ chain: 'arc', address: '0xabc', identifier: '1' },
			endpoints.nfts.get,
		);

		expect(lastCall().parsed.pathname).toBe(
			'/api/v2/chain/arc/contract/0xabc/nfts/1',
		);
	});

	it('nfts.get keeps a large token id as a string', async () => {
		respond(nftFixture);

		await run(
			{
				chain: 'base',
				address: '0xabc',
				identifier: '123456789012345678901234567890',
			},
			endpoints.nfts.get,
		);

		expect(lastCall().parsed.pathname).toBe(
			'/api/v2/chain/base/contract/0xabc/nfts/123456789012345678901234567890',
		);
	});
});

describe('events, search and orders', () => {
	it('events.list GETs /events with a comma-joined event_type list', async () => {
		respond(eventsPageFixture);

		const { result } = await run(
			{
				event_type: ['sale', 'transfer'],
				after: 1794000000,
				before: 1794300000,
				limit: 10,
				next: 'E1',
			},
			endpoints.events.list,
		);

		const { parsed, init } = lastCall();
		expect(init.method).toBe('GET');
		expect(parsed.pathname).toBe('/api/v2/events');
		expect(parsed.searchParams.get('event_type')).toBe('sale,transfer');
		expect(parsed.searchParams.get('after')).toBe('1794000000');
		expect(parsed.searchParams.get('before')).toBe('1794300000');
		expect(result.asset_events).toHaveLength(1);
	});

	it('search.search GETs /search with the query and filters', async () => {
		respond(searchFixture);

		const { result } = await run(
			{
				query: 'bored ape',
				chains: ['ethereum'],
				asset_types: ['collection', 'nft'],
				limit: 5,
			},
			endpoints.search.search,
		);

		const { parsed, init } = lastCall();
		expect(init.method).toBe('GET');
		expect(parsed.pathname).toBe('/api/v2/search');
		expect(parsed.searchParams.get('query')).toBe('bored ape');
		expect(parsed.searchParams.get('chains')).toBe('ethereum');
		expect(parsed.searchParams.get('asset_types')).toBe('collection,nft');
		expect(result.results).toHaveLength(2);
	});

	it('listings.best GETs the collection best listings', async () => {
		respond(listingsPageFixture);

		const { result } = await run(
			{
				slug: 'boredapeyachtclub',
				include_private_listings: false,
				limit: 20,
				next: 'L1',
			},
			endpoints.listings.best,
		);

		const { parsed, init } = lastCall();
		expect(init.method).toBe('GET');
		expect(parsed.pathname).toBe(
			'/api/v2/listings/collection/boredapeyachtclub/best',
		);
		expect(parsed.searchParams.get('include_private_listings')).toBe('false');
		expect(result.listings).toHaveLength(1);
		expect(result.listings[0]?.order_hash).toBe(
			'0x830a0a93980e21a464208a182b62ba5e8eee008d8e8d3062ee10ce075beb53f4',
		);
	});

	it('listings.best reports a null cursor on the last page', async () => {
		respond(listingsLastPageFixture);

		const { result } = await run(
			{ slug: 'boredapeyachtclub' },
			endpoints.listings.best,
		);

		expect(result.next).toBeNull();
	});

	it('offers.collection GETs the collection offers', async () => {
		respond(offersPageFixture);

		const { result } = await run(
			{ slug: 'boredapeyachtclub', limit: 5, next: 'O1' },
			endpoints.offers.collection,
		);

		const { parsed, init } = lastCall();
		expect(init.method).toBe('GET');
		expect(parsed.pathname).toBe('/api/v2/offers/collection/boredapeyachtclub');
		expect(parsed.searchParams.get('limit')).toBe('5');
		expect(result.offers).toHaveLength(1);
	});
});

describe('extended reads', () => {
	it('contract.nfts GETs the contract NFT list', async () => {
		respond(nftsPageFixture);
		await run(
			{ chain: 'ethereum', address: '0xabc', limit: 5, next: 'C1' },
			endpoints.contract.nfts,
		);
		const { parsed, init } = lastCall();
		expect(init.method).toBe('GET');
		expect(parsed.pathname).toBe('/api/v2/chain/ethereum/contract/0xabc/nfts');
		expect(parsed.searchParams.get('limit')).toBe('5');
		expect(parsed.searchParams.get('next')).toBe('C1');
	});

	it('nfts.owners GETs the token owners', async () => {
		respond(ownersFixture);
		const { result } = await run(
			{ chain: 'ethereum', address: '0xabc', identifier: '1', limit: 2 },
			endpoints.nfts.owners,
		);
		expect(lastCall().parsed.pathname).toBe(
			'/api/v2/chain/ethereum/contract/0xabc/nfts/1/owners',
		);
		expect(result.owners.length).toBeGreaterThan(0);
	});

	it('events.collection GETs the collection events with a trait filter', async () => {
		respond(eventsPageFixture);
		await run(
			{
				slug: 'boredapeyachtclub',
				event_type: ['sale'],
				traits: '[{"traitType":"Background","value":"Blue"}]',
				limit: 5,
			},
			endpoints.events.collection,
		);
		const { parsed, init } = lastCall();
		expect(init.method).toBe('GET');
		expect(parsed.pathname).toBe('/api/v2/events/collection/boredapeyachtclub');
		expect(parsed.searchParams.get('event_type')).toBe('sale');
		expect(parsed.searchParams.get('traits')).toBe(
			'[{"traitType":"Background","value":"Blue"}]',
		);
	});

	it('listings.all GETs every listing, comma-joining nothing', async () => {
		respond(listingsPageFixture);
		await run(
			{ slug: 'boredapeyachtclub', maker: '0xmaker', limit: 5 },
			endpoints.listings.all,
		);
		const { parsed } = lastCall();
		expect(parsed.pathname).toBe(
			'/api/v2/listings/collection/boredapeyachtclub/all',
		);
		expect(parsed.searchParams.get('maker')).toBe('0xmaker');
	});

	it('offers.all GETs every offer', async () => {
		respond(offersPageFixture);
		await run(
			{ slug: 'boredapeyachtclub', maker: '0xmaker', limit: 5 },
			endpoints.offers.all,
		);
		const { parsed } = lastCall();
		expect(parsed.pathname).toBe(
			'/api/v2/offers/collection/boredapeyachtclub/all',
		);
		expect(parsed.searchParams.get('maker')).toBe('0xmaker');
	});

	it('offers.best GETs one token best offer', async () => {
		respond(bestOfferFixture);
		const { result } = await run(
			{ slug: 'boredapeyachtclub', identifier: '1' },
			endpoints.offers.best,
		);
		expect(lastCall().parsed.pathname).toBe(
			'/api/v2/offers/collection/boredapeyachtclub/nfts/1/best',
		);
		// Bare order, not wrapped in `order`.
		expect(result.order_hash).toBeTruthy();
	});

	it('orders.get GETs one order by chain, protocol and hash', async () => {
		respond(orderFixture);
		const { result } = await run(
			{
				chain: 'ethereum',
				protocol_address: '0x0000000000000068f116a894984e2db1123eb395',
				order_hash: '0xdeadbeef',
			},
			endpoints.orders.get,
		);
		expect(lastCall().parsed.pathname).toBe(
			'/api/v2/orders/chain/ethereum/protocol/0x0000000000000068f116a894984e2db1123eb395/0xdeadbeef',
		);
		expect(result.order.order_hash).toBeTruthy();
	});

	it('collections.floorPrices GETs the history with a timeframe', async () => {
		respond(floorPricesFixture);
		const { result } = await run(
			{ slug: 'boredapeyachtclub', timeframe: 'seven_days', resolution: 3600 },
			endpoints.collections.floorPrices,
		);
		const { parsed } = lastCall();
		expect(parsed.pathname).toBe(
			'/api/v2/collections/boredapeyachtclub/floor_prices',
		);
		expect(parsed.searchParams.get('timeframe')).toBe('seven_days');
		expect(result.floor_prices.length).toBeGreaterThan(0);
	});

	it('collections.holders GETs holders with a sort direction', async () => {
		respond(holdersFixture);
		await run(
			{ slug: 'boredapeyachtclub', limit: 2, sort_direction: 'desc' },
			endpoints.collections.holders,
		);
		const { parsed } = lastCall();
		expect(parsed.pathname).toBe(
			'/api/v2/collections/boredapeyachtclub/holders',
		);
		expect(parsed.searchParams.get('sort_direction')).toBe('desc');
	});

	it('accounts.get GETs a profile by username', async () => {
		respond(accountFixture);
		const { result } = await run(
			{ address_or_username: 'boredapeyachtclub' },
			endpoints.accounts.get,
		);
		expect(lastCall().parsed.pathname).toBe(
			'/api/v2/accounts/boredapeyachtclub',
		);
		expect(result.address).toBeTruthy();
	});

	it('accounts.portfolio GETs the portfolio with a comma-joined chain list', async () => {
		respond(portfolioFixture);
		const { result } = await run(
			{ address: '0xabc', timeframe: 'WEEK', chains: ['ethereum', 'base'] },
			endpoints.accounts.portfolio,
		);
		const { parsed } = lastCall();
		expect(parsed.pathname).toBe('/api/v2/account/0xabc/portfolio');
		expect(parsed.searchParams.get('chains')).toBe('ethereum,base');
		expect(result.total_value_usd).toBeDefined();
	});
});

describe('auth', () => {
	it('sends the stored key on every operation', async () => {
		respond(chainsFixture);
		await run({}, endpoints.chains.list);
		expect(lastCall().headers.get('x-api-key')).toBe(API_KEY);

		respond(searchFixture);
		await run({ query: 'ape' }, endpoints.search.search);
		expect(lastCall().headers.get('x-api-key')).toBe(API_KEY);
	});
});
