/**
 * Captured from the live API (`https://api.opensea.io/api/v2`). The collection,
 * stats, traits, listings and offers bodies are real responses for
 * `boredapeyachtclub`, trimmed to the fields the plugin reads. The NFT and
 * events fixtures follow the published OpenAPI spec, since those routes need an
 * API key this build did not have.
 */

export const chainsFixture = {
	chains: [
		{
			chain: 'ethereum',
			name: 'Ethereum',
			symbol: 'ETH',
			supports_swaps: true,
			block_explorer: 'Etherscan',
			block_explorer_url: 'https://etherscan.io',
		},
		{
			chain: 'solana',
			name: 'Solana',
			symbol: 'SOL',
			supports_swaps: true,
			block_explorer: 'Solscan',
			block_explorer_url: 'https://solscan.io/',
		},
	],
} as const;

export const collectionFixture = {
	collection: 'boredapeyachtclub',
	name: 'Bored Ape Yacht Club',
	description:
		'The Bored Ape Yacht Club is a collection of 10,000 unique Bored Ape NFTs.',
	image_url: 'https://i2c.seadn.io/collection/boredapeyachtclub/image/1a09',
	banner_image_url:
		'https://i2c.seadn.io/collection/boredapeyachtclub/banner/3dd',
	owner: '0xa858ddc0445d8131dac4d1de01f834ffcba52ef1',
	safelist_status: 'verified',
	category: 'pfps',
	is_disabled: false,
	is_nsfw: false,
	trait_offers_enabled: true,
	collection_offers_enabled: true,
	opensea_url: 'https://opensea.io/collection/boredapeyachtclub',
	project_url: 'http://www.boredapeyachtclub.com/',
	wiki_url: '',
	discord_url: 'https://discord.gg/3P5K3dzgdB',
	telegram_url: '',
	twitter_username: 'BoredApeYC',
	instagram_username: '',
	contracts: [
		{
			address: '0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d',
			chain: 'ethereum',
		},
	],
	total_supply: 9996,
	unique_item_count: 9996,
	created_date: '2021-04-22',
} as const;

export const collectionsPageFixture = {
	collections: [collectionFixture],
	next: 'LXBrPTIxNTAwMDAwMDA',
} as const;

/** The last page: `next` is null. */
export const collectionsLastPageFixture = {
	collections: [collectionFixture],
	next: null,
} as const;

export const collectionStatsFixture = {
	total: {
		volume: 1585660.8318983612,
		volume_symbol: 'ETH',
		sales: 41231,
		num_owners: 6487,
		floor_price: 9.4,
		floor_price_symbol: 'ETH',
	},
	intervals: [
		{ interval: 'one_day', volume: 210.5, volume_symbol: 'ETH', sales: 12 },
	],
} as const;

/** Captured live: `categories` maps a trait name to its value type. */
export const traitsFixture = {
	categories: {
		Background: 'string',
		Clothes: 'string',
		Earring: 'string',
	},
	counts: {
		Background: 10000,
	},
} as const;

/** One listing row, trimmed. `value` is a wei string, not a number. */
export const listingFixture = {
	order_hash:
		'0x830a0a93980e21a464208a182b62ba5e8eee008d8e8d3062ee10ce075beb53f4',
	chain: 'ethereum',
	protocol_address: '0x0000000000000068f116a894984e2db1123eb395',
	asset: {
		identifier: '9933',
		contract: '0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d',
	},
	remaining_quantity: 1,
	order_created_at: 1794260807,
	price: {
		current: {
			currency: 'ETH',
			decimals: 18,
			value: '5900000000000000000',
		},
	},
	price_per_item: {
		currency: 'ETH',
		decimals: 18,
		value: '5900000000000000000',
	},
	type: 'basic',
	status: 'ACTIVE',
	protocol_data: {
		parameters: { offerer: '0x0000000000000000000000000000000000000000' },
		signature: '0xdeadbeef',
	},
} as const;

export const listingsPageFixture = {
	listings: [listingFixture],
	next: 'MTAwMDAwMDAwMA',
} as const;

export const listingsLastPageFixture = {
	listings: [listingFixture],
	next: null,
} as const;

export const offersPageFixture = {
	offers: [listingFixture],
	next: null,
} as const;

/** Follows the spec's `NftDetailed`; not captured, as the route needs a key. */
export const nftFixture = {
	nft: {
		identifier: '1',
		collection: 'boredapeyachtclub',
		contract: '0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d',
		token_standard: 'erc721',
		name: 'Bored Ape #1',
		description: null,
		image_url: 'https://i2c.seadn.io/example.png',
		display_image_url: 'https://i2c.seadn.io/example.png',
		display_animation_url: null,
		original_image_url: 'https://i2c.seadn.io/example.png',
		original_animation_url: null,
		animation_url: null,
		metadata_url: 'ipfs://example',
		opensea_url: 'https://opensea.io/assets/ethereum/0xbc4/1',
		creator: '0x0000000000000000000000000000000000000000',
		owners: [{ address: '0xowner', quantity: 1 }],
		traits: [
			{
				trait_type: 'Background',
				display_type: null,
				max_value: null,
				value: 'Blue',
			},
		],
		is_disabled: false,
		is_nsfw: false,
		is_suspicious: false,
		updated_at: '2026-11-09T00:00:00.000000',
		decimals: null,
		estimated_value_usd: null,
	},
} as const;

export const nftsPageFixture = {
	nfts: [nftFixture.nft],
	next: null,
} as const;

/** Follows the spec's `AssetEventsResponse`; the row shape is loose by design. */
export const eventsPageFixture = {
	asset_events: [
		{
			event_type: 'sale',
			order_hash: '0xabc',
			chain: 'ethereum',
			transaction: '0xtx',
			event_timestamp: 1794260807,
			from_address: '0xfrom',
			to_address: '0xto',
			quantity: 1,
			payment: {
				quantity: '1',
				token_address: '0x0000000000000000000000000000000000000000',
			},
			nft: {
				identifier: '1',
				contract: '0xbc4',
				collection: 'boredapeyachtclub',
			},
		},
	],
	next: null,
} as const;

export const searchFixture = {
	results: [
		{
			type: 'collection',
			collection: { collection: 'boredapeyachtclub', name: 'BAYC' },
		},
		{ type: 'nft', nft: { identifier: '1', collection: 'boredapeyachtclub' } },
	],
} as const;

// ── Errors, captured live ─────────────────────────────────────────────────

/** A missing key. HTTP 401 on every marketplace route. */
export const missingKeyBody = {
	errors: ['Missing an API Key, which is required for this request.'],
} as const;

/** A key that OpenSea does not recognise. HTTP 401. */
export const invalidKeyBody = { errors: ['Invalid API key'] } as const;

/** The router's own 404, before any handler runs. A different envelope. */
export const notFoundBody = {
	error: { message: 'Not Found', status: 'NOT_FOUND', code: 404 },
} as const;
