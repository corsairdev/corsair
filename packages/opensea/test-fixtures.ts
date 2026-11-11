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

/**
 * Captured live and trimmed: `categories` maps a trait name to its value type,
 * and `counts` maps it to how many NFTs carry each value.
 */
export const traitsFixture = {
	categories: {
		Background: 'string',
		Clothes: 'string',
		Earring: 'string',
	},
	counts: {
		Background: { Gray: 1169, Aquamarine: 1265, Yellow: 1283 },
		Clothes: { 'Smoking Jacket': 221, 'Bone Necklace': 203 },
		Earring: { 'Silver Hoop': 882 },
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

export const nftFixture = {
	nft: {
		identifier: '1',
		collection: 'boredapeyachtclub',
		contract: '0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d',
		token_standard: 'erc721',
		name: '',
		description: '',
		image_url:
			'https://i2c.seadn.io/ethereum/0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d/399ac6f35935d93930b68fa64cd307/5d399ac6f35935d93930b68fa64cd307.png',
		display_image_url:
			'https://i2c.seadn.io/ethereum/0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d/399ac6f35935d93930b68fa64cd307/5d399ac6f35935d93930b68fa64cd307.png',
		display_animation_url: null,
		original_image_url: 'ipfs://QmPbxeGcXhYQQNgsC6a36dDyYUcHgMLnGKnF8pVFmGsvqi',
		original_animation_url: null,
		animation_url: null,
		metadata_url:
			'https://ipfs2.seadn.io/ipfs/QmeSjSinHpPnmXmspMjwiXyN6zS4E9zccariGR3jxcaWtq/1',
		opensea_url:
			'https://opensea.io/assets/ethereum/0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d/1',
		creator: '',
		owners: [
			{
				address: '0x46efbaedc92067e6d60e84ed6395099723252496',
				quantity: 1,
				quantity_string: '1',
			},
		],
		traits: [
			{
				trait_type: 'Fur',
				display_type: null,
				max_value: null,
				value: 'Robot',
			},
			{
				trait_type: 'Eyes',
				display_type: null,
				max_value: null,
				value: 'Blue Beams',
			},
			{
				trait_type: 'Mouth',
				display_type: null,
				max_value: null,
				value: 'Grin',
			},
			{
				trait_type: 'Clothes',
				display_type: null,
				max_value: null,
				value: 'Vietnam Jacket',
			},
			{
				trait_type: 'Background',
				display_type: null,
				max_value: null,
				value: 'Orange',
			},
		],
		is_disabled: false,
		is_nsfw: false,
		is_suspicious: false,
		updated_at: '2026-11-10T02:27:13.518957',
		decimals: null,
		estimated_value_usd: null,
	},
} as const;

export const nftsPageFixture = {
	nfts: [
		{
			identifier: '9999',
			collection: 'boredapeyachtclub',
			contract: '0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d',
			token_standard: 'erc721',
			name: '',
			description: '',
			image_url:
				'https://i2c.seadn.io/ethereum/0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d/38a4a67da722f825e3911cb1f35701/0d38a4a67da722f825e3911cb1f35701.png',
			display_image_url:
				'https://i2c.seadn.io/ethereum/0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d/38a4a67da722f825e3911cb1f35701/0d38a4a67da722f825e3911cb1f35701.png',
			display_animation_url: null,
			metadata_url:
				'https://ipfs2.seadn.io/ipfs/QmeSjSinHpPnmXmspMjwiXyN6zS4E9zccariGR3jxcaWtq/9999',
			opensea_url:
				'https://opensea.io/assets/ethereum/0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d/9999',
			updated_at: '2026-11-10T02:27:15.525017',
			is_disabled: false,
			is_nsfw: false,
			original_image_url:
				'ipfs://QmejYePrutbfWEV8wA3ogTHi2cf2j6hoaPhZSc6vNE43nH',
			original_animation_url: null,
			traits: [
				{
					trait_type: 'Fur',
					display_type: null,
					max_value: null,
					value: 'Gray',
				},
				{
					trait_type: 'Hat',
					display_type: null,
					max_value: null,
					value: 'Army Hat',
				},
				{
					trait_type: 'Eyes',
					display_type: null,
					max_value: null,
					value: 'Scumbag',
				},
				{
					trait_type: 'Mouth',
					display_type: null,
					max_value: null,
					value: 'Bored Unshaven',
				},
				{
					trait_type: 'Earring',
					display_type: null,
					max_value: null,
					value: 'Gold Hoop',
				},
				{
					trait_type: 'Background',
					display_type: null,
					max_value: null,
					value: 'Purple',
				},
			],
			estimated_value_usd: null,
			decimals: null,
		},
	],
	next: 'WyIyMDIxLTA1LTAxVDA4OjM1OjE3WiIsOTk5OSwiNjg1M2RjZmQtNDEzMi0zNmI2LWFlMDQtMTQ2ODI1M2U3M2U5Il0',
} as const;

export const eventsPageFixture = {
	asset_events: [
		{
			event_type: 'order',
			event_timestamp: 1794277633,
			order_hash:
				'0xa66e4186cd226c101d739bb03a292ec5452df2a5f3404568d2a18cfea3153276',
			protocol_address: '0x0000000000000068f116a894984e2db1123eb395',
			chain: 'ape_chain',
			payment: {
				quantity: '499997286100000000000',
				token_address: '0x0000000000000000000000000000000000000000',
				decimals: 18,
				symbol: 'APE',
			},
			order_type: 'listing',
			start_date: 1794277633,
			expiration_date: 1794278533,
			asset: {
				identifier: '261',
				collection: 'paradox-blood-of-ape',
				contract: '0x59b30ed9dd5838509980f39d503244567b11120e',
				token_standard: 'erc721',
				name: '#261 Sanatu The Deadly',
			},
		},
	],
	next: 'WyIwMWExYzM0Ny1lZWUzLTdmZGMtYTEyOS0xY2UzMDYzZDMyOGUiXQ',
} as const;

export const searchFixture = {
	results: [
		{
			type: 'token',
			token: {
				address: '0x4d224452801aced8b2f0aebe155379bb5d594381',
				chain: 'ethereum',
				name: 'ApeCoin',
				symbol: 'APE',
				image_url:
					'https://i2c.seadn.io/ethereum/66f1372eb87f18045db374ec/19c2e64b826f71a5b770d03c3a937b/2119c2e64b826f71a5b770d03c3a937b.png',
				usd_price: '0.1017850409',
				decimals: 18,
				opensea_url:
					'https://opensea.io/token/ethereum/0x4d224452801aced8b2f0aebe155379bb5d594381',
			},
		},
		{
			type: 'token',
			token: {
				address: '0x0000000000000000000000000000000000000000',
				chain: 'ape_chain',
				name: 'Ape',
				symbol: 'APE',
				image_url: 'https://raw2.seadn.io/currency_logos/APE.svg',
				usd_price: '0.101493',
				decimals: 18,
				opensea_url:
					'https://opensea.io/token/ape_chain/0x0000000000000000000000000000000000000000',
			},
		},
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

// ── Captured from the live API with a real key ────────────────────────────

export const ownersFixture = {
	owners: [
		{
			address: '0x46efbaedc92067e6d60e84ed6395099723252496',
			quantity: 1,
			quantity_string: '1',
		},
	],
	next: null,
} as const;

export const floorPricesFixture = {
	floor_prices: [
		{
			time: 1794211644.768,
			usd_price: '11954.648199',
			token_unit: 5.7199,
			symbol: null,
			chain: 'ethereum',
		},
		{
			time: 1794229070.751,
			usd_price: '12277.670277',
			token_unit: 5.7777,
			symbol: null,
			chain: 'ethereum',
		},
	],
} as const;

/** `percentage` is a fraction: 0.0127 means 1.27%. */
export const holdersFixture = {
	holders: [
		{
			address: '0x68a24ab6dc7e2f8dedd2993eb178a68e0b7473d4',
			quantity: 127,
			percentage: 0.0127,
		},
		{
			address: '0xf395767ae0e947504651a33ac2899520c551955d',
			quantity: 117,
			percentage: 0.0117,
		},
	],
	next: 'WzExNywiMHhmMzk1NzY3YWUwZTk0NzUwNDY1MWEzM2FjMjg5OTUyMGM1NTE5NTVkIl0',
} as const;

export const accountFixture = {
	address: '0xaba7161a7fb69c88e16ed9f455ce62b791ee4d03',
	username: 'BoredApeYachtClub',
	display_name: 'BoredApeYachtClub',
	ens_name: null,
	is_verified: true,
	is_agent: false,
	follower_count: 12,
	following_count: 0,
	profile_image_url:
		'https://i2c.seadn.io/profiles/0xaba7161a7fb69c88e16ed9f455ce62b791ee4d03/avatar/bd0639d4297f57bbb88c840dc7a0df/82bd0639d4297f57bbb88c840dc7a0df.png',
	banner_image_url:
		'https://i2c.seadn.io/profiles/0xaba7161a7fb69c88e16ed9f455ce62b791ee4d03/banner/3dc0bdd11ad92fb560fb8311b51451/e73dc0bdd11ad92fb560fb8311b51451.jpeg',
	bio: 'BAYC is a collection of 10,000 Bored Ape NFTs. Owning a Bored Ape doubles as your membership to the Club.',
	joined_date: '2021-04-23',
} as const;

/**
 * Captured live for a wallet with no history: `pnl_absolute` and
 * `pnl_percentage` are absent rather than zero, and every figure is a string.
 */
export const portfolioFixture = {
	total_value_usd: '0.00',
	nft_value_usd: '0.00',
	token_value_usd: '0.00',
	timeframe: 'DAY',
} as const;

/** `/orders/chain/...` wraps the order; `offers.best` returns it bare. */
export const orderFixture = {
	order: {
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
	},
} as const;

export const bestOfferFixture = {
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
} as const;
