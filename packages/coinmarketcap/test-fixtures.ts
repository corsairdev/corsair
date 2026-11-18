/**
 * Fixtures copied from live CoinMarketCap responses, not from the docs'
 * examples: every one here was captured from
 * `https://pro-api.coinmarketcap.com` on 2026-11-09. Field types the docs get
 * wrong show up here, notably `error_code` as a string on the `/v3` routes and
 * `tags` as bare strings on `/v1/cryptocurrency/map`.
 */

/** A `/v3` status object: `error_code` is a string and `elapsed` a number. */
export const v3Status = {
	timestamp: '2026-11-09T15:07:41.156Z',
	error_code: '0',
	error_message: '',
	elapsed: 8,
	credit_count: 1,
};

/** A `/v1` and `/v2` status object: `error_code` is a number. */
export const v2Status = {
	timestamp: '2026-11-09T15:07:41.650Z',
	error_code: 0,
	error_message: null,
	elapsed: 2,
	credit_count: 1,
	notice: null,
};

const quote = {
	id: 2781,
	symbol: 'USD',
	price: 74630.75941364496,
	volume_24h: 29423903157.78866,
	volume_change_24h: 234.676865953079,
	cex_volume_24h: 29358023605.31342,
	dex_volume_24h: 65879552.47523691,
	percent_change_1h: 0.222829572557,
	percent_change_24h: -1.753780000211,
	percent_change_7d: -3.982615274028,
	percent_change_30d: -10.037466552429,
	percent_change_60d: -3.445517132264,
	percent_change_90d: 17.037105634382,
	market_cap: 1500819646178.2788,
	market_cap_dominance: 60.1103,
	fully_diluted_market_cap: 1567245947686.54,
	minted_market_cap: 1500819646178.28,
	tvl: null,
	last_updated: '2026-11-09T15:07:33.024Z',
};

/** One entry from `/v3/cryptocurrency/listings/latest`. */
export const listingsAsset = {
	id: 1,
	name: 'Bitcoin',
	symbol: 'BTC',
	slug: 'bitcoin',
	num_market_pairs: 12045,
	date_added: '2010-07-13T00:00:00.000Z',
	tags: ['mineable', 'pow', 'sha-256', 'store-of-value'],
	max_supply: 21000000,
	circulating_supply: 20109934,
	total_supply: 20109934,
	infinite_supply: false,
	cmc_rank: 1,
	last_updated: '2026-11-09T15:07:33.024Z',
	tvl_ratio: null,
	platform: null,
	self_reported_circulating_supply: null,
	self_reported_market_cap: null,
	minted_market_cap: 1500819646178.28,
	quote: [quote],
};

export const listingsResponse = {
	data: [listingsAsset],
	status: v3Status,
};

/** One entry from `/v1/cryptocurrency/map`; `tags` is absent there. */
export const mapEntry = {
	id: 1,
	name: 'Bitcoin',
	symbol: 'BTC',
	slug: 'bitcoin',
	rank: 1,
	is_active: 1,
	first_historical_data: '2010-07-13T00:05:00.000Z',
	last_historical_data: '2026-11-09T15:05:00.000Z',
	platform: null,
};

export const mapResponse = {
	data: [mapEntry],
	status: v2Status,
};

/** `/v3/cryptocurrency/quotes/latest` returns tags as objects, not strings. */
export const quotesResponse = {
	data: [
		{
			...listingsAsset,
			tags: [
				{ slug: 'mineable', name: 'Mineable', category: 'OTHERS' },
				{ slug: 'pow', name: 'PoW', category: 'ALGORITHM' },
			],
			is_active: 1,
			is_market_cap_included_in_calc: 1,
		},
	],
	status: v3Status,
};

/**
 * `/v2/cryptocurrency/info` keyed by `id`: one object per key. A lookup by
 * `symbol` or `address` returns `{ BTC: [ {...} ] }` instead.
 */
export const infoResponse = {
	data: {
		'1': {
			id: 1,
			name: 'Bitcoin',
			symbol: 'BTC',
			category: 'coin',
			slug: 'bitcoin',
			logo: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1.png',
			description: 'Bitcoin (BTC) is a cryptocurrency launched in 2010.',
			date_added: '2010-07-13T00:00:00.000Z',
			date_launched: '2010-07-13T00:00:00.000Z',
			notice: null,
			tags: ['mineable'],
			'tag-names': ['Mineable'],
			'tag-groups': ['ALGORITHM'],
			subreddit: 'Bitcoin',
			twitter_username: 'bitcoin',
			infinite_supply: false,
			is_hidden: 0,
			platform: null,
			urls: {
				website: ['https://bitcoin.org/'],
				twitter: [],
				reddit: [],
				message_board: [],
				chat: [],
				facebook: [],
				explorer: ['https://blockchain.coinmarketcap.com/chain/bitcoin'],
				technical_doc: [],
				source_code: [],
				announcement: [],
			},
		},
	},
	status: v2Status,
};

/** The same route when `symbol` was passed: an array per key. */
export const infoResponseBySymbol = {
	data: {
		BTC: [
			{
				...infoResponse.data['1'],
				id: 1,
				slug: 'bitcoin',
			},
			{
				...infoResponse.data['1'],
				id: 38552,
				name: 'Bitcoin Base',
				slug: 'bitcoin-base',
			},
		],
	},
	status: v2Status,
};

/** `/v1/global-metrics/quotes/latest`. */
export const globalResponse = {
	data: {
		active_cryptocurrencies: 14731,
		active_exchanges: 941,
		active_market_pairs: 129385,
		total_cryptocurrencies: 28907,
		total_exchanges: 1327,
		total_crypto_dex_currencies: 1254390,
		btc_dominance: 60.1103,
		btc_dominance_24h_percentage_change: 0.1502,
		eth_dominance: 10.3608,
		eth_dominance_24h_percentage_change: -0.0421,
		today_change_percent: -1.7537,
		last_updated: '2026-11-09T15:07:42.150Z',
		past_24h_incremental_crypto_number: 12,
		past_7d_incremental_crypto_number: 84,
		past_30d_incremental_crypto_number: 351,
		quote: {
			USD: {
				total_market_cap: 2496777249345.1523,
				total_volume_24h: 78540822493.76,
				total_volume_24h_reported: 620782289549.21,
				altcoin_market_cap: 994074558595.3174,
				altcoin_volume_24h: 49335332193.41513,
				altcoin_volume_24h_reported: 418582209863.51,
				defi_market_cap: 120000000000,
				defi_volume_24h: 5000000000,
				stablecoin_market_cap: 300000000000,
				stablecoin_volume_24h: 40000000000,
				derivatives_volume_24h: 90000000000,
				last_updated: '2026-11-09T15:07:00.000Z',
			},
		},
	},
	status: v2Status,
};

/**
 * `/v2/tools/price-conversion` by `id` answers one object; by `symbol` it
 * answers an array, because a ticker is not unique.
 */
export const conversionByIdResponse = {
	data: {
		id: 1,
		symbol: 'BTC',
		name: 'Bitcoin',
		amount: 2,
		quote: {
			USD: {
				price: 149261.51882728992,
				last_updated: '2026-11-09T15:06:05.000Z',
			},
		},
		last_updated: '2026-11-09T15:07:33.024Z',
	},
	status: v2Status,
};

export const conversionBySymbolResponse = {
	data: [
		{
			id: 1,
			symbol: 'BTC',
			name: 'Bitcoin',
			amount: 1,
			quote: {
				USD: {
					price: 74600.20213964285,
					last_updated: '2026-11-09T15:06:05.000Z',
				},
			},
			last_updated: '2026-11-09T15:07:03.027Z',
		},
		{
			id: 38552,
			symbol: 'BTC',
			name: 'Bitcoin Base',
			amount: 1,
			quote: {
				USD: {
					price: 0.0031165823108679136,
					last_updated: '2026-11-09T15:06:05.000Z',
				},
			},
			last_updated: '2026-11-09T15:07:03.027Z',
		},
	],
	status: v2Status,
};

/**
 * `/v1/exchange/info` keyed by slug, captured from a live response. The
 * payload carries more fields than the documented model, and three of them are
 * camelCase (`porStatus`, `porAuditStatus`, `porSwitch`) among snake_case
 * neighbours.
 */
export const exchangeInfoResponse = {
	data: {
		binance: {
			id: 270,
			name: 'Binance',
			slug: 'binance',
			logo: 'https://s2.coinmarketcap.com/static/img/exchanges/64x64/270.png',
			description:
				'## What Is Binance?\n\nBinance is a cryptocurrency exchange.',
			date_launched: null,
			notice: null,
			is_hidden: 0,
			status: null,
			type: '',
			maker_fee: 0.02,
			taker_fee: 0.04,
			weekly_visits: 12_000_000,
			spot_volume_usd: 9_800_000_000,
			spot_volume_last_updated: '2026-11-09T14:00:00.000Z',
			tags: [
				{
					name: '[Internal] Order book Exchange',
					slug: 'order-book-exchange',
					group: 'PROPERTY',
				},
			],
			porStatus: '1',
			porAuditStatus: '2',
			porSwitch: true,
			urls: {
				website: ['https://www.binance.com/'],
				actual: ['https://www.binance.com/?ref=40896146'],
				blog: ['https://www.binance.com/en/blog'],
				chat: ['https://t.me/binanceexchange'],
				fee: ['https://www.binance.com/en/fee/schedule'],
				twitter: ['https://twitter.com/binance'],
				register: ['https://accounts.binance.com/en/register?ref=40896146'],
			},
		},
	},
	status: v2Status,
};

/** `/v1/key/info`, from the documented response model. */ export const keyInfoResponse =
	{
		data: {
			plan: {
				credit_limit_monthly: 10000,
				credit_limit_monthly_reset: '00 days, 11 hours, 22 minutes, 12 seconds',
				credit_limit_monthly_reset_timestamp: '2026-12-01T00:00:00.000Z',
				rate_limit_minute: 30,
			},
			usage: {
				current_minute: { requests_made: 1, requests_left: 29 },
				current_day: { credits_used: 9 },
				current_month: { credits_used: 9 },
			},
		},
		status: v2Status,
	};

/** A 400 as the API sends it: a real error code inside a `status` object. */
export const errorResponse = {
	status: {
		timestamp: '2026-11-09T15:08:07.888Z',
		error_code: '400',
		error_message: "'limit' should be a positive number in range [1, 5000]",
		elapsed: 0,
		credit_count: 0,
	},
};

/** A 429: the minute limit and the anonymous allowance share the status. */
export const rateLimitResponse = {
	status: {
		timestamp: '2026-11-09T15:10:50.491Z',
		error_code: '1022',
		error_message:
			"You've reached the limit for anonymous access. Sign in to activate a free API plan or upgrade for higher limits.",
		elapsed: 1,
		credit_count: 0,
	},
};

/**
 * The `/v3` catch-all. A route that does not exist answers HTTP 200 with this
 * body, so a 2xx is not proof the call worked.
 */
export const unknownRouteResponse = {
	status: {
		timestamp: '2026-11-09T15:05:14.950Z',
		error_code: '500',
		error_message: 'The system is busy, please try again later!',
		elapsed: '0',
		credit_count: 0,
	},
};
