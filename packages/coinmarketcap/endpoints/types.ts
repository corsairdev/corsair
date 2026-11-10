import { z } from 'zod';

// Inputs use CoinMarketCap's own query parameter names, and a comma-separated
// parameter is a string array here. Outputs are `.loose()` with their
// documented fields nullish, so a field CoinMarketCap adds or omits cannot fail
// a call that has already happened. Field reference:
// https://coinmarketcap.com/api/documentation/pro-api-reference/

// ── Shared pieces ────────────────────────────────────────────────────────────

const ApiStatusSchema = z
	.object({
		timestamp: z.string().optional(),
		// A number on /v1 and /v2 routes, a string on /v3 routes.
		error_code: z.union([z.number(), z.string()]).optional(),
		error_message: z.string().nullish(),
		elapsed: z.union([z.number(), z.string()]).optional(),
		credit_count: z.number().optional(),
		notice: z.string().nullish(),
		total_count: z.number().optional(),
	})
	.loose();

const AuxFieldSchema = z
	.string()
	.describe(
		'Comma-separated supplemental fields, for example "platform,first_historical_data".',
	);

/** A comma-separated query parameter, written as an array and joined on send. */
function csvArray(description: string) {
	return z.array(z.string().min(1)).min(1).describe(description);
}

/**
 * `id` and `symbol` (and `slug`) are exclusive: CoinMarketCap answers
 * `'value' contains a conflict between exclusive peers`. Fail before sending.
 */
function requireExactlyOne(
	keys: readonly string[],
	// unknown: one refinement serves four input schemas; it only reads named keys.
	value: Record<string, unknown>,
	ctx: z.RefinementCtx,
): void {
	const present = keys.filter((key) => value[key] !== undefined);
	if (present.length === 1) return;
	ctx.addIssue({
		code: 'custom',
		path: [keys[0] as string],
		message:
			present.length === 0
				? `Pass one of ${keys.join(', ')}.`
				: `Pass only one of ${keys.join(', ')}; got ${present.join(' and ')}.`,
	});
}

const PositiveId = z.number().int().positive();

const QuoteObjectSchema = z
	.object({
		id: z.number().optional().describe('The quote currency CMC ID.'),
		symbol: z.string().optional().describe('The quote currency symbol.'),
		price: z.number().nullish(),
		volume_24h: z.number().nullish(),
		cex_volume_24h: z.number().nullish(),
		dex_volume_24h: z.number().nullish(),
		volume_24h_reported: z.number().nullish(),
		volume_7d: z.number().nullish(),
		volume_7d_reported: z.number().nullish(),
		volume_30d: z.number().nullish(),
		volume_30d_reported: z.number().nullish(),
		volume_change_24h: z.number().nullish(),
		percent_change_1h: z.number().nullish(),
		percent_change_24h: z.number().nullish(),
		percent_change_7d: z.number().nullish(),
		percent_change_30d: z.number().nullish(),
		percent_change_60d: z.number().nullish(),
		percent_change_90d: z.number().nullish(),
		market_cap: z.number().nullish(),
		market_cap_dominance: z.number().nullish(),
		fully_diluted_market_cap: z.number().nullish(),
		minted_market_cap: z.number().nullish(),
		market_cap_by_total_supply: z.number().nullish(),
		tvl: z.number().nullish(),
		last_updated: z.string().nullish(),
	})
	.loose();

const PlatformSchema = z
	.object({
		// A number on `/v1/cryptocurrency/map` and the `/v3` routes, a string
		// ("1027") on `/v2/cryptocurrency/info`.
		id: z.union([z.number(), z.string()]).nullish(),
		slug: z.string().nullish(),
		name: z.string().nullish(),
		symbol: z.string().nullish(),
		token_address: z.string().nullish(),
	})
	.loose();

/** `/v1/cryptocurrency/map` returns tag slugs; `/v3` listings return objects. */
const TagObjectSchema = z
	.object({
		slug: z.string().nullish(),
		name: z.string().nullish(),
		category: z.string().nullish(),
	})
	.loose();

const CryptoTagSchema = z.union([z.string(), TagObjectSchema]);

/** The asset fields `/v3` listings and quotes share. */
const CryptoAssetFields = {
	id: z.number().describe('The CoinMarketCap cryptocurrency ID.'),
	name: z.string().nullish(),
	symbol: z.string().nullish(),
	slug: z.string().nullish(),
	platform: PlatformSchema.nullish(),
	tags: z.array(CryptoTagSchema).nullish(),
	is_active: z.number().nullish(),
	infinite_supply: z.boolean().nullish(),
	is_market_cap_included_in_calc: z.number().nullish(),
	is_fiat: z.number().nullish(),
	circulating_supply: z.number().nullish(),
	total_supply: z.number().nullish(),
	max_supply: z.number().nullish(),
	date_added: z.string().nullish(),
	num_market_pairs: z.number().nullish(),
	cmc_rank: z.number().nullish(),
	last_updated: z.string().nullish(),
	tvl_ratio: z.number().nullish(),
	self_reported_circulating_supply: z.number().nullish(),
	self_reported_market_cap: z.number().nullish(),
	unlocked_circulating_supply: z.number().nullish(),
	unlocked_market_cap: z.number().nullish(),
	minted_market_cap: z.number().nullish(),
};

/**
 * A listing entry. The market data lives in `quote`, which the `/v3` route
 * returns as an array with one entry per requested currency, so it is declared
 * here rather than left to `.loose()` as an unknown key.
 */
const ListingAssetSchema = z
	.object({
		...CryptoAssetFields,
		quote: z.array(QuoteObjectSchema),
	})
	.loose();

export type ListingAsset = z.infer<typeof ListingAssetSchema>;

// ── cryptocurrency.listings ──────────────────────────────────────────────────

/**
 * CoinMarketCap rejects anything outside 1-5000 with
 * `'limit' should be a positive number in range [1, 5000]`.
 */
export const COINMARKETCAP_MAX_LIMIT = 5000;

/** The listings route answers 100 when `limit` is omitted. */
export const COINMARKETCAP_DEFAULT_LISTINGS_LIMIT = 100;

export const COINMARKETCAP_LISTINGS_SORTS = [
	'market_cap',
	'market_cap_strict',
	'name',
	'symbol',
	'date_added',
	'price',
	'circulating_supply',
	'total_supply',
	'max_supply',
	'num_market_pairs',
	'market_cap_by_total_supply_strict',
	'volume_24h',
	'volume_7d',
	'volume_30d',
	'percent_change_1h',
	'percent_change_24h',
	'percent_change_7d',
] as const;

const ListingsLatestInputSchema = z.object({
	start: z
		.number()
		.int()
		.min(1)
		.optional()
		.describe('1-based index of the first result. Defaults to 1.'),
	limit: z
		.number()
		.int()
		.min(1)
		.max(COINMARKETCAP_MAX_LIMIT)
		.optional()
		.describe(
			`How many results to return. Defaults to ${COINMARKETCAP_DEFAULT_LISTINGS_LIMIT}; the maximum is ${COINMARKETCAP_MAX_LIMIT}. Each 250 results costs one credit.`,
		),
	price_min: z.number().optional().describe('Minimum USD price.'),
	price_max: z.number().optional().describe('Maximum USD price.'),
	market_cap_min: z.number().optional().describe('Minimum market cap in USD.'),
	market_cap_max: z.number().optional().describe('Maximum market cap in USD.'),
	volume_24h_min: z
		.number()
		.optional()
		.describe('Minimum rolling 24 hour USD volume.'),
	volume_24h_max: z
		.number()
		.optional()
		.describe('Maximum rolling 24 hour USD volume.'),
	circulating_supply_min: z.number().optional(),
	circulating_supply_max: z.number().optional(),
	percent_change_24h_min: z
		.number()
		.optional()
		.describe('Minimum 24 hour percent change, so -50 for a 50% drop.'),
	percent_change_24h_max: z.number().optional(),
	convert: csvArray(
		'Quote currencies by symbol, such as ["USD"] or ["USD", "EUR"]. Each one past the first costs an extra credit, and a plan may cap how many it allows.',
	).optional(),
	convert_id: csvArray(
		'Quote currencies by CMC ID instead of symbol. Cannot be combined with `convert`.',
	).optional(),
	sort: z
		.enum(COINMARKETCAP_LISTINGS_SORTS)
		.optional()
		.describe('Field to sort by. Defaults to market_cap.'),
	sort_dir: z
		.enum(['asc', 'desc'])
		.optional()
		.describe('Sort direction. Defaults to desc.'),
	cryptocurrency_type: z
		.enum(['all', 'coins', 'tokens'])
		.optional()
		.describe('Limit the result to coins, tokens or both. Defaults to all.'),
	tag: z
		.string()
		.optional()
		.describe('Only assets carrying this tag, such as "defi" or "layer-2".'),
	aux: AuxFieldSchema.optional(),
});

export type ListingsLatestInput = z.input<typeof ListingsLatestInputSchema>;

const ListingsLatestResponseSchema = z.object({
	assets: z.array(ListingAssetSchema),
	status: ApiStatusSchema.optional(),
});

export type ListingsLatestResponse = z.infer<
	typeof ListingsLatestResponseSchema
>;

// ── cryptocurrency.map ───────────────────────────────────────────────────────

const CryptocurrencyMapInputSchema = z
	.object({
		listing_status: z
			.array(z.enum(['active', 'inactive', 'untracked']))
			.min(1)
			.optional()
			.describe('Which listing statuses to include. Defaults to active.'),
		start: z
			.number()
			.int()
			.min(1)
			.optional()
			.describe('1-based index of the first result. Defaults to 1.'),
		limit: z
			.number()
			.int()
			.min(1)
			.max(COINMARKETCAP_MAX_LIMIT)
			.optional()
			.describe(
				`How many results to return. Defaults to every match; the maximum is ${COINMARKETCAP_MAX_LIMIT}.`,
			),
		sort: z
			.enum(['cmc_rank', 'id'])
			.optional()
			.describe('Field to sort by. Defaults to id.'),
		symbol: csvArray(
			'Tickers to resolve to CMC IDs, such as ["BTC", "ETH"]. When set, the API ignores every other option except `aux`.',
		).optional(),
		aux: z
			.string()
			.optional()
			.describe(
				'Comma-separated supplemental fields: platform, first_historical_data, last_historical_data, is_active, status.',
			),
	})
	.superRefine((value, ctx) => {
		if (value.symbol === undefined) return;
		// CoinMarketCap ignores the filter, paging and sort options when `symbol`
		// is set, so a paged lookup here would silently return the wrong rows.
		// `aux` is still applied, so it is allowed.
		const ignored = (
			['listing_status', 'start', 'limit', 'sort'] as const
		).filter((key) => value[key] !== undefined);
		if (ignored.length === 0) return;
		ctx.addIssue({
			code: 'custom',
			path: ['symbol'],
			message: `\`symbol\` makes CoinMarketCap ignore ${ignored.join(', ')}; pass it on its own.`,
		});
	});

export type CryptocurrencyMapInput = z.infer<
	typeof CryptocurrencyMapInputSchema
>;

const CryptocurrencyMapEntrySchema = z
	.object({
		id: z.number().describe('The CoinMarketCap cryptocurrency ID.'),
		name: z.string().nullish(),
		symbol: z.string().nullish(),
		slug: z.string().nullish(),
		rank: z.number().nullish(),
		is_active: z.number().nullish(),
		status: z.string().nullish(),
		first_historical_data: z.string().nullish(),
		last_historical_data: z.string().nullish(),
		platform: PlatformSchema.nullish(),
	})
	.loose();

export type CryptocurrencyMapEntry = z.infer<
	typeof CryptocurrencyMapEntrySchema
>;

const CryptocurrencyMapResponseSchema = z.object({
	cryptocurrencies: z.array(CryptocurrencyMapEntrySchema),
	status: ApiStatusSchema.optional(),
});

export type CryptocurrencyMapResponse = z.infer<
	typeof CryptocurrencyMapResponseSchema
>;

// ── cryptocurrency.quotes ───────────────────────────────────────────────────

const QuotesLatestInputSchema = z
	.object({
		id: csvArray('CoinMarketCap IDs, such as ["1", "1027"].').optional(),
		slug: csvArray('Slugs, such as ["bitcoin", "ethereum"].').optional(),
		symbol: csvArray('Tickers, such as ["BTC", "ETH"].').optional(),
		convert: csvArray(
			'Quote currencies by symbol. Each one past the first costs an extra credit.',
		).optional(),
		convert_id: csvArray(
			'Quote currencies by CMC ID. Cannot be combined with `convert`.',
		).optional(),
		aux: AuxFieldSchema.optional(),
		skip_invalid: z
			.boolean()
			.optional()
			.describe(
				'Skip unknown identifiers instead of failing the whole call. Defaults to false.',
			),
	})
	.superRefine((value, ctx) =>
		requireExactlyOne(['id', 'slug', 'symbol'], value, ctx),
	);

export type QuotesLatestInput = z.input<typeof QuotesLatestInputSchema>;

const CryptoQuoteSchema = z
	.object({
		...CryptoAssetFields,
		// The /v3 routes return an array with one entry per `convert` currency.
		quote: z.array(QuoteObjectSchema),
	})
	.loose();

export type CryptoQuote = z.infer<typeof CryptoQuoteSchema>;

const QuotesLatestResponseSchema = z.object({
	quotes: z.array(CryptoQuoteSchema),
	status: ApiStatusSchema.optional(),
});

export type QuotesLatestResponse = z.infer<typeof QuotesLatestResponseSchema>;

// ── cryptocurrency.info ─────────────────────────────────────────────────────

const CryptocurrencyInfoInputSchema = z
	.object({
		id: csvArray('CoinMarketCap IDs, such as ["1", "1027"].').optional(),
		slug: csvArray('Slugs, such as ["bitcoin"].').optional(),
		symbol: csvArray('Tickers, such as ["BTC"].').optional(),
		address: z
			.string()
			.min(1)
			.optional()
			.describe('A contract address, when the asset is a token.'),
		// The API takes a boolean here, unlike every other route, which reads
		// the same option as a string.
		skip_invalid: z
			.boolean()
			.optional()
			.describe('Skip unknown identifiers instead of failing the whole call.'),
		aux: z
			.string()
			.optional()
			.describe(
				'Comma-separated supplemental fields: urls, logo, description, tags, platform, date_added, notice, status.',
			),
	})
	.superRefine((value, ctx) =>
		requireExactlyOne(['id', 'slug', 'symbol', 'address'], value, ctx),
	);

export type CryptocurrencyInfoInput = z.input<
	typeof CryptocurrencyInfoInputSchema
>;

const AssetUrlsSchema = z
	.object({
		website: z.array(z.string()).nullish(),
		twitter: z.array(z.string()).nullish(),
		reddit: z.array(z.string()).nullish(),
		message_board: z.array(z.string()).nullish(),
		chat: z.array(z.string()).nullish(),
		facebook: z.array(z.string()).nullish(),
		explorer: z.array(z.string()).nullish(),
		technical_doc: z.array(z.string()).nullish(),
		source_code: z.array(z.string()).nullish(),
		announcement: z.array(z.string()).nullish(),
	})
	.loose();

const CryptocurrencyInfoSchema = z
	.object({
		id: z.number(),
		name: z.string().nullish(),
		symbol: z.string().nullish(),
		category: z.string().nullish(),
		slug: z.string().nullish(),
		logo: z.string().nullish(),
		description: z.string().nullish(),
		date_added: z.string().nullish(),
		date_launched: z.string().nullish(),
		notice: z.string().nullish(),
		tags: z.array(z.string()).nullish(),
		// CoinMarketCap's own spelling; both keys arrive alongside each other.
		'tag-names': z.array(z.string()).nullish(),
		'tag-groups': z.array(z.string()).nullish(),
		subreddit: z.string().nullish(),
		twitter_username: z.string().nullish(),
		infinite_supply: z.boolean().nullish(),
		is_hidden: z.number().nullish(),
		platform: PlatformSchema.nullish(),
		urls: AssetUrlsSchema.nullish(),
	})
	.loose();

export type CryptocurrencyInfo = z.infer<typeof CryptocurrencyInfoSchema>;

/**
 * `/v2/cryptocurrency/info` keys `data` by the identifier that was passed. A
 * lookup by `symbol` returns an array per key, because symbols are not unique;
 * by `id`, `slug` or `address` it returns one object. Both are flattened into
 * `cryptocurrencies` here, and the provider's key is kept on each entry.
 */
const CryptocurrencyInfoResponseSchema = z.object({
	cryptocurrencies: z.array(
		CryptocurrencyInfoSchema.extend({
			lookup_key: z
				.string()
				.describe('The identifier CoinMarketCap keyed this entry under.'),
		}),
	),
	status: ApiStatusSchema.optional(),
});

export type CryptocurrencyInfoResponse = z.infer<
	typeof CryptocurrencyInfoResponseSchema
>;

// ── globalMetrics.quotes ────────────────────────────────────────────────────

const GlobalMetricsQuotesInputSchema = z.object({
	convert: csvArray(
		'Quote currencies by symbol. Each one past the first costs an extra credit.',
	).optional(),
	convert_id: csvArray(
		'Quote currencies by CMC ID. Cannot be combined with `convert`.',
	).optional(),
});

export type GlobalMetricsQuotesInput = z.input<
	typeof GlobalMetricsQuotesInputSchema
>;

const GlobalQuoteSchema = z
	.object({
		total_market_cap: z.number().nullish(),
		total_volume_24h: z.number().nullish(),
		total_volume_24h_reported: z.number().nullish(),
		altcoin_market_cap: z.number().nullish(),
		altcoin_volume_24h: z.number().nullish(),
		altcoin_volume_24h_reported: z.number().nullish(),
		defi_market_cap: z.number().nullish(),
		defi_volume_24h: z.number().nullish(),
		defi_volume_24h_reported: z.number().nullish(),
		stablecoin_market_cap: z.number().nullish(),
		stablecoin_volume_24h: z.number().nullish(),
		derivatives_volume_24h: z.number().nullish(),
		last_updated: z.string().nullish(),
	})
	.loose();

const GlobalMetricsQuotesResponseSchema = z.object({
	metrics: z
		.object({
			btc_dominance: z.number().nullish(),
			btc_dominance_24h_percentage_change: z.number().nullish(),
			eth_dominance: z.number().nullish(),
			eth_dominance_24h_percentage_change: z.number().nullish(),
			active_cryptocurrencies: z.number().nullish(),
			total_cryptocurrencies: z.number().nullish(),
			active_market_pairs: z.number().nullish(),
			active_exchanges: z.number().nullish(),
			total_exchanges: z.number().nullish(),
			total_crypto_dex_currencies: z.number().nullish(),
			today_change_percent: z.number().nullish(),
			past_24h_incremental_crypto_number: z.number().nullish(),
			past_7d_incremental_crypto_number: z.number().nullish(),
			past_30d_incremental_crypto_number: z.number().nullish(),
			last_updated: z.string().nullish(),
			// Keyed by quote currency symbol, so the caller picks one out.
			quote: z.record(z.string(), GlobalQuoteSchema),
		})
		.loose(),
	status: ApiStatusSchema.optional(),
});

export type GlobalMetricsQuotesResponse = z.infer<
	typeof GlobalMetricsQuotesResponseSchema
>;

// ── tools.priceConversion ───────────────────────────────────────────────────

const PriceConversionInputSchema = z
	.object({
		amount: z
			.number()
			.describe('How much of the source currency to convert, such as 1.5.'),
		id: z
			.number()
			.int()
			.positive()
			.optional()
			.describe(
				'The source currency CMC ID. CoinMarketCap takes exactly one ID here, not a list.',
			),
		symbol: z
			.string()
			.min(1)
			.optional()
			.describe(
				'The source currency ticker. When several assets share it, one result per asset is returned.',
			),
		time: z
			.string()
			.min(1)
			.optional()
			.describe('A Unix or ISO 8601 timestamp to convert at. Defaults to now.'),
		convert: csvArray(
			'Target currencies by symbol, such as ["USD"].',
		).optional(),
		convert_id: csvArray(
			'Target currencies by CMC ID. Cannot be combined with `convert`.',
		).optional(),
	})
	.superRefine((value, ctx) => requireExactlyOne(['id', 'symbol'], value, ctx));

export type PriceConversionInput = z.input<typeof PriceConversionInputSchema>;

const ConversionQuoteSchema = z
	.object({
		// null, with no `last_updated`, for an asset CoinMarketCap has no price
		// for; a `symbol` lookup returns those alongside the priced ones.
		price: z
			.number()
			.nullish()
			.describe(
				'The converted amount, or null when CoinMarketCap has no price for the asset.',
			),
		last_updated: z.string().nullish(),
	})
	.loose();

const ConversionResultSchema = z
	.object({
		id: z.number(),
		symbol: z.string().nullish(),
		name: z.string().nullish(),
		amount: z.number().nullish(),
		last_updated: z.string().nullish(),
		// Keyed by target currency symbol, or by ID when `convert_id` was passed.
		quote: z.record(z.string(), ConversionQuoteSchema),
	})
	.loose();

export type ConversionResult = z.infer<typeof ConversionResultSchema>;

const PriceConversionResponseSchema = z.object({
	conversions: z.array(ConversionResultSchema),
	status: ApiStatusSchema.optional(),
});

export type PriceConversionResponse = z.infer<
	typeof PriceConversionResponseSchema
>;

// ── exchange.info ───────────────────────────────────────────────────────────

const ExchangeInfoInputSchema = z
	.object({
		id: csvArray('CoinMarketCap exchange IDs, such as ["270"].').optional(),
		slug: csvArray(
			'Exchange slugs, such as ["binance"]. Pass exactly one of `id` or `slug`.',
		).optional(),
		aux: z
			.string()
			.optional()
			.describe(
				'Comma-separated supplemental fields: urls, logo, description, date_launched, notice, status.',
			),
	})
	.superRefine((value, ctx) => requireExactlyOne(['id', 'slug'], value, ctx));

export type ExchangeInfoInput = z.input<typeof ExchangeInfoInputSchema>;

const ExchangeUrlsSchema = z
	.object({
		website: z.array(z.string()).nullish(),
		twitter: z.array(z.string()).nullish(),
		blog: z.array(z.string()).nullish(),
		chat: z.array(z.string()).nullish(),
		fee: z.array(z.string()).nullish(),
		message_board: z.array(z.string()).nullish(),
		// Present on a real response and absent from the documented model.
		actual: z
			.array(z.string())
			.nullish()
			.describe('The affiliate link CoinMarketCap redirects through.'),
		register: z.array(z.string()).nullish(),
	})
	.loose();

const ExchangeTagSchema = z
	.object({
		name: z.string().nullish(),
		slug: z.string().nullish(),
		group: z.string().nullish(),
	})
	.loose();

const ExchangeInfoSchema = z
	.object({
		id: z.number(),
		name: z.string().nullish(),
		slug: z.string().nullish(),
		logo: z.string().nullish(),
		description: z.string().nullish(),
		date_launched: z.string().nullish(),
		notice: z.string().nullish(),
		is_hidden: z.number().nullish(),
		status: z.string().nullish(),
		urls: ExchangeUrlsSchema.nullish(),
		// Live only: absent from the documented response model.
		type: z
			.string()
			.nullish()
			.describe('The exchange category, such as "cex" or "dex".'),
		tags: z.array(ExchangeTagSchema).nullish(),
		maker_fee: z.number().nullish(),
		taker_fee: z.number().nullish(),
		weekly_visits: z.number().nullish(),
		spot_volume_usd: z.number().nullish(),
		spot_volume_last_updated: z.string().nullish(),
		// CoinMarketCap's own spelling: these three are camelCase while every
		// neighbouring field is snake_case.
		porStatus: z
			.string()
			.nullish()
			.describe("Proof-of-reserves status, in CoinMarketCap's camelCase."),
		porAuditStatus: z.string().nullish(),
		porSwitch: z.boolean().nullish(),
	})
	.loose();

export type ExchangeInfo = z.infer<typeof ExchangeInfoSchema>;

const ExchangeInfoResponseSchema = z.object({
	exchanges: z.array(
		ExchangeInfoSchema.extend({
			lookup_key: z
				.string()
				.describe('The identifier CoinMarketCap keyed this entry under.'),
		}),
	),
	status: ApiStatusSchema.optional(),
});

export type ExchangeInfoResponse = z.infer<typeof ExchangeInfoResponseSchema>;

// ── key.info ────────────────────────────────────────────────────────────────

const KeyInfoInputSchema = z.object({});

export type KeyInfoInput = z.input<typeof KeyInfoInputSchema>;

const KeyInfoResponseSchema = z.object({
	plan: z
		.object({
			credit_limit_monthly: z.number().nullish(),
			credit_limit_monthly_reset: z.string().nullish(),
			credit_limit_monthly_reset_timestamp: z.string().nullish(),
			rate_limit_minute: z.number().nullish(),
		})
		.loose(),
	usage: z
		.object({
			current_minute: z
				.object({
					requests_made: z.number().nullish(),
					requests_left: z.number().nullish(),
				})
				.loose()
				.nullish(),
			current_day: z
				.object({
					credits_used: z.number().nullish(),
					credits_left: z.number().nullish(),
				})
				.loose()
				.nullish(),
			current_month: z
				.object({
					credits_used: z.number().nullish(),
					credits_left: z.number().nullish(),
				})
				.loose()
				.nullish(),
		})
		.loose(),
	status: ApiStatusSchema.optional(),
});

export type KeyInfoResponse = z.infer<typeof KeyInfoResponseSchema>;

// ── Registry ────────────────────────────────────────────────────────────────

export type CoinMarketCapEndpointInputs = {
	cryptocurrencyListings: z.input<typeof ListingsLatestInputSchema>;
	cryptocurrencyMap: z.input<typeof CryptocurrencyMapInputSchema>;
	cryptocurrencyQuotes: z.input<typeof QuotesLatestInputSchema>;
	cryptocurrencyInfo: z.input<typeof CryptocurrencyInfoInputSchema>;
	globalMetricsQuotes: z.input<typeof GlobalMetricsQuotesInputSchema>;
	toolsPriceConversion: z.input<typeof PriceConversionInputSchema>;
	exchangeInfo: z.input<typeof ExchangeInfoInputSchema>;
	keyInfo: z.input<typeof KeyInfoInputSchema>;
};

export type CoinMarketCapEndpointOutputs = {
	cryptocurrencyListings: ListingsLatestResponse;
	cryptocurrencyMap: CryptocurrencyMapResponse;
	cryptocurrencyQuotes: QuotesLatestResponse;
	cryptocurrencyInfo: CryptocurrencyInfoResponse;
	globalMetricsQuotes: GlobalMetricsQuotesResponse;
	toolsPriceConversion: PriceConversionResponse;
	exchangeInfo: ExchangeInfoResponse;
	keyInfo: KeyInfoResponse;
};

export const CoinMarketCapEndpointInputSchemas = {
	cryptocurrencyListings: ListingsLatestInputSchema,
	cryptocurrencyMap: CryptocurrencyMapInputSchema,
	cryptocurrencyQuotes: QuotesLatestInputSchema,
	cryptocurrencyInfo: CryptocurrencyInfoInputSchema,
	globalMetricsQuotes: GlobalMetricsQuotesInputSchema,
	toolsPriceConversion: PriceConversionInputSchema,
	exchangeInfo: ExchangeInfoInputSchema,
	keyInfo: KeyInfoInputSchema,
} as const;

export const CoinMarketCapEndpointOutputSchemas = {
	cryptocurrencyListings: ListingsLatestResponseSchema,
	cryptocurrencyMap: CryptocurrencyMapResponseSchema,
	cryptocurrencyQuotes: QuotesLatestResponseSchema,
	cryptocurrencyInfo: CryptocurrencyInfoResponseSchema,
	globalMetricsQuotes: GlobalMetricsQuotesResponseSchema,
	toolsPriceConversion: PriceConversionResponseSchema,
	exchangeInfo: ExchangeInfoResponseSchema,
	keyInfo: KeyInfoResponseSchema,
} as const;
