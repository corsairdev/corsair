import { z } from 'zod';

// Field names are OpenSea's own, read from the published OpenAPI spec
// (https://api.opensea.io/api/v2/openapi.json, OpenAPI 3.1). Nothing is
// renamed: the API mixes `order_hash` and `remaining_quantity` with camelCase
// on a few routes, and a tidied name would be a silent wrong result for anyone
// reading OpenSea's own docs.
//
// Outputs are `.loose()`. Fields the spec marks required stay required, and a
// field only observed as nullish is `.nullish()`: the spec is a snapshot, and a
// new optional field must not fail a call that already happened.

/**
 * The chains OpenSea indexed when this was written: the spec's
 * `ChainIdentifier` enum plus `arc` and `elysium`, which the live `/chains`
 * route already lists and the spec does not. A reference list, not a gate:
 * OpenSea adds chains faster than the spec records them, so a `chain` input
 * takes any slug and the API refuses one it does not index.
 */
export const OPENSEA_CHAINS = [
	'base',
	'ethereum',
	'zora',
	'arbitrum',
	'sei',
	'avalanche',
	'polygon',
	'optimism',
	'ape_chain',
	'flow',
	'soneium',
	'ronin',
	'bera_chain',
	'solana',
	'shape',
	'unichain',
	'gunzilla',
	'abstract',
	'animechain',
	'hyperevm',
	'somnia',
	'monad',
	'hyperliquid',
	'megaeth',
	'ink',
	'robinhood',
	'arc',
	'elysium',
] as const;

export const ChainIdentifierSchema = z
	.string()
	.min(1)
	.describe(
		'The chain slug, such as `ethereum`, `base` or `solana`. `chains.list` returns the current set; OpenSea refuses a slug it does not index.',
	);

/**
 * Event types accepted by `events.list` and `events.collection`. The spec's
 * enum is `sale`, `transfer`, `mint`, `listing`, `offer`, `trait_offer` and
 * `collection_offer`. `order` and `redemption` are not in that enum (`order`
 * is the `event_type` a listing or offer row comes back with). They stay
 * accepted here so OpenSea, not this schema, decides whether the filter is
 * valid.
 */
export const OPENSEA_EVENT_TYPES = [
	'sale',
	'transfer',
	'mint',
	'order',
	'redemption',
	'listing',
	'offer',
	'collection_offer',
	'trait_offer',
] as const;

const ChainSchema = z
	.object({
		chain: z.string(),
		name: z.string(),
		symbol: z.string().nullish(),
		supports_swaps: z.boolean().nullish(),
		block_explorer: z.string().nullish(),
		block_explorer_url: z.string().nullish(),
	})
	.loose();

export type OpenseaChain = z.infer<typeof ChainSchema>;

const ChainsListInputSchema = z.object({});

export type ChainsListInput = z.input<typeof ChainsListInputSchema>;

const ChainsListResponseSchema = z
	.object({
		chains: z.array(ChainSchema),
	})
	.loose();

export type ChainsListResponse = z.infer<typeof ChainsListResponseSchema>;

// ── Collections ───────────────────────────────────────────────────────────

const ContractSchema = z
	.object({
		address: z.string(),
		chain: z.string(),
	})
	.loose();

export const CollectionSchema = z
	.object({
		collection: z.string(),
		name: z.string(),
		description: z.string().nullish(),
		image_url: z.string().nullish(),
		banner_image_url: z.string().nullish(),
		owner: z.string().nullish(),
		safelist_status: z.string().nullish(),
		category: z.string().nullish(),
		is_disabled: z.boolean().nullish(),
		is_nsfw: z.boolean().nullish(),
		trait_offers_enabled: z.boolean().nullish(),
		collection_offers_enabled: z.boolean().nullish(),
		opensea_url: z.string().nullish(),
		project_url: z.string().nullish(),
		wiki_url: z.string().nullish(),
		discord_url: z.string().nullish(),
		telegram_url: z.string().nullish(),
		twitter_username: z.string().nullish(),
		instagram_username: z.string().nullish(),
		contracts: z.array(ContractSchema).nullish(),
	})
	.loose();

export type OpenseaCollection = z.infer<typeof CollectionSchema>;

const CollectionsListInputSchema = z.object({
	chain: ChainIdentifierSchema.optional(),
	creator_username: z
		.string()
		.min(1)
		.optional()
		.describe('Only collections made by this OpenSea account.'),
	include_hidden: z
		.boolean()
		.optional()
		.describe('Include collections hidden from search and browse.'),
	order_by: z
		.string()
		.min(1)
		.optional()
		.describe(
			'Field to sort by. The spec types this as a free string and names no values.',
		),
	limit: z
		.number()
		.int()
		.min(1)
		.optional()
		.describe('How many to return. The API defaults to 50.'),
	next: z
		.string()
		.min(1)
		.optional()
		.describe('The `next` cursor from a previous page.'),
});

export type CollectionsListInput = z.input<typeof CollectionsListInputSchema>;

const CollectionsListResponseSchema = z
	.object({
		collections: z.array(CollectionSchema),
		next: z
			.string()
			.nullish()
			.describe('Cursor for the next page; null on the last one.'),
	})
	.loose();

export type CollectionsListResponse = z.infer<
	typeof CollectionsListResponseSchema
>;

const CollectionsGetInputSchema = z.object({
	slug: z
		.string()
		.min(1)
		.describe('The collection slug, such as `boredapeyachtclub`.'),
});

export type CollectionsGetInput = z.input<typeof CollectionsGetInputSchema>;

/** A single collection arrives bare, not wrapped in an array or a key. */
const CollectionsGetResponseSchema = CollectionSchema;

export type CollectionsGetResponse = z.infer<
	typeof CollectionsGetResponseSchema
>;

const CollectionsStatsInputSchema = z.object({
	slug: z.string().min(1).describe('The collection slug.'),
});

export type CollectionsStatsInput = z.input<typeof CollectionsStatsInputSchema>;

const TotalStatSchema = z
	.object({
		volume: z.number().nullish(),
		volume_symbol: z.string().nullish(),
		sales: z.number().nullish(),
		num_owners: z.number().nullish(),
		floor_price: z.number().nullish(),
		floor_price_symbol: z.string().nullish(),
	})
	.loose();

const IntervalStatSchema = z
	.object({
		interval: z.string(),
		volume: z.number().nullish(),
		volume_symbol: z.string().nullish(),
		sales: z.number().nullish(),
	})
	.loose();

const CollectionsStatsResponseSchema = z
	.object({
		total: TotalStatSchema,
		intervals: z.array(IntervalStatSchema),
	})
	.loose();

export type CollectionsStatsResponse = z.infer<
	typeof CollectionsStatsResponseSchema
>;

const CollectionsTopInputSchema = z.object({
	sort_by: z
		.string()
		.min(1)
		.optional()
		.describe('Ranking metric. The API defaults to `one_day_volume`.'),
	chains: z
		.array(ChainIdentifierSchema)
		.min(1)
		.optional()
		.describe('Only collections on these chains.'),
	category: z.string().min(1).optional().describe('Only this category.'),
	limit: z.number().int().min(1).optional().describe('Defaults to 50.'),
	cursor: z
		.string()
		.min(1)
		.optional()
		.describe(
			"The previous response's `next` value. This route calls it `cursor`.",
		),
});

export type CollectionsTopInput = z.input<typeof CollectionsTopInputSchema>;

const TrendingCollectionsInputSchema = z.object({
	timeframe: z
		.string()
		.min(1)
		.optional()
		.describe(
			'Window to rank by, such as `one_hour`, `one_day`, `seven_days` or `thirty_days`. The API defaults to `one_day`.',
		),
	chains: z
		.array(ChainIdentifierSchema)
		.min(1)
		.optional()
		.describe('Only collections on these chains.'),
	category: z.string().min(1).optional().describe('Only this category.'),
	limit: z.number().int().min(1).optional().describe('Defaults to 20.'),
	cursor: z
		.string()
		.min(1)
		.optional()
		.describe(
			"The previous response's `next` value. This route calls it `cursor`.",
		),
});

export type TrendingCollectionsInput = z.input<
	typeof TrendingCollectionsInputSchema
>;

// `top` and `trending` share the page shape the spec documents for both.
const RankedCollectionsResponseSchema = z
	.object({
		collections: z.array(CollectionSchema),
		next: z.string().nullish(),
	})
	.loose();

export type RankedCollectionsResponse = z.infer<
	typeof RankedCollectionsResponseSchema
>;

// ── NFTs ──────────────────────────────────────────────────────────────────

const OwnerSchema = z
	.object({
		address: z.string(),
		quantity: z.number().nullish(),
		// Observed live, and absent from the spec.
		quantity_string: z.string().nullish(),
	})
	.loose();

const TraitSchema = z
	.object({
		trait_type: z.string(),
		display_type: z.string().nullish(),
		max_value: z.string().nullish(),
		value: z.union([z.string(), z.number(), z.boolean()]).nullish(),
	})
	.loose();

export const NftSchema = z
	.object({
		identifier: z.string(),
		collection: z.string(),
		contract: z.string(),
		token_standard: z.string(),
		name: z.string().nullish(),
		description: z.string().nullish(),
		image_url: z.string().nullish(),
		display_image_url: z.string().nullish(),
		display_animation_url: z.string().nullish(),
		original_image_url: z.string().nullish(),
		original_animation_url: z.string().nullish(),
		animation_url: z.string().nullish(),
		metadata_url: z.string().nullish(),
		opensea_url: z.string().nullish(),
		creator: z.string().nullish(),
		owners: z.array(OwnerSchema).nullish(),
		traits: z.array(TraitSchema).nullish(),
		is_disabled: z.boolean().nullish(),
		is_nsfw: z.boolean().nullish(),
		is_suspicious: z.boolean().nullish(),
		updated_at: z.string().nullish(),
		decimals: z.number().nullish(),
		estimated_value_usd: z.number().nullish(),
	})
	.loose();

export type OpenseaNft = z.infer<typeof NftSchema>;

const CollectionNftsInputSchema = z.object({
	slug: z.string().min(1).describe('The collection slug.'),
	traits: z
		.string()
		.min(1)
		.optional()
		.describe(
			'JSON array of trait filters, sent as a string: `[{"traitType":"Background","value":"Red"}]`. Several filters are AND-combined.',
		),
	has_agent_binding: z
		.boolean()
		.optional()
		.describe('Only NFTs with (or without) an agent binding.'),
	limit: z.number().int().min(1).optional().describe('Page size.'),
	next: z.string().min(1).optional().describe('The `next` cursor.'),
});

export type CollectionNftsInput = z.input<typeof CollectionNftsInputSchema>;

const NftListResponseSchema = z
	.object({
		nfts: z.array(NftSchema),
		next: z.string().nullish(),
	})
	.loose();

export type NftListResponse = z.infer<typeof NftListResponseSchema>;

const NftsGetInputSchema = z.object({
	chain: ChainIdentifierSchema,
	address: z
		.string()
		.min(1)
		.describe('The contract address that holds the token.'),
	identifier: z
		.string()
		.min(1)
		.describe('The token id within that contract, as a string.'),
});

export type NftsGetInput = z.input<typeof NftsGetInputSchema>;

/** Wrapped in `nft`, and `nft` itself is required. */
const NftResponseSchema = z
	.object({
		nft: NftSchema,
	})
	.loose();

export type NftGetResponse = z.infer<typeof NftResponseSchema>;

const ContractNftsInputSchema = z.object({
	chain: ChainIdentifierSchema,
	address: z.string().min(1).describe('The contract address.'),
	limit: z.number().int().min(1).optional().describe('Page size.'),
	next: z.string().min(1).optional().describe('The `next` cursor.'),
});

export type ContractNftsInput = z.input<typeof ContractNftsInputSchema>;

const ContractNftInputSchema = z.object({
	chain: ChainIdentifierSchema,
	address: z.string().min(1).describe('The contract address.'),
	identifier: z.string().min(1).describe('The token id, as a string.'),
});

export type ContractNftInput = z.input<typeof ContractNftInputSchema>;

const OwnersInputSchema = z.object({
	chain: ChainIdentifierSchema,
	address: z.string().min(1).describe('The contract address.'),
	identifier: z.string().min(1).describe('The token id, as a string.'),
	limit: z.number().int().min(1).optional().describe('Defaults to 20.'),
	next: z.string().min(1).optional().describe('The `next` cursor.'),
});

export type OwnersInput = z.input<typeof OwnersInputSchema>;

/** Captured live: `address`, `quantity` and `quantity_string`. */
const OwnersResponseSchema = z
	.object({
		owners: z.array(OwnerSchema),
		next: z.string().nullish(),
	})
	.loose();

export type OwnersResponse = z.infer<typeof OwnersResponseSchema>;

// ── Events ────────────────────────────────────────────────────────────────

/**
 * The spec declares `asset_events` as an untyped array, so the row shape is
 * taken from what the endpoint sends rather than documented: every row carries
 * an `event_type` and the fields that type needs. Kept loose on purpose, since
 * the spec gives no field list to pin.
 */
const AssetEventSchema = z
	.object({
		event_type: z.string().nullish(),
		// Observed live on transfer rows; the spec gives no field list for these.
		transfer_type: z.string().nullish(),
		order_hash: z.string().nullish(),
		chain: z.string().nullish(),
		transaction: z.string().nullish(),
		event_timestamp: z.number().nullish(),
		from_address: z.string().nullish(),
		to_address: z.string().nullish(),
		quantity: z.number().nullish(),
		// unknown: the payment payload varies by event type; the spec gives no shape.
		payment: z.record(z.string(), z.unknown()).nullish(),
		// unknown: a nested NFT summary, whose fields differ per event type.
		nft: z.record(z.string(), z.unknown()).nullish(),
	})
	.loose();

export type OpenseaAssetEvent = z.infer<typeof AssetEventSchema>;

const EventsListInputSchema = z.object({
	event_type: z
		.array(z.enum(OPENSEA_EVENT_TYPES))
		.min(1)
		.optional()
		.describe('Only these event types.'),
	after: z
		.number()
		.int()
		.optional()
		.describe('Only events after this unix timestamp.'),
	before: z
		.number()
		.int()
		.optional()
		.describe('Only events before this unix timestamp.'),
	limit: z.number().int().min(1).optional().describe('Page size.'),
	next: z.string().min(1).optional().describe('The `next` cursor.'),
});

export type EventsListInput = z.input<typeof EventsListInputSchema>;

const EventsListResponseSchema = z
	.object({
		asset_events: z.array(AssetEventSchema),
		next: z.string().nullish(),
	})
	.loose();

export type EventsListResponse = z.infer<typeof EventsListResponseSchema>;

const CollectionEventsInputSchema = z.object({
	slug: z.string().min(1).describe('The collection slug.'),
	event_type: z
		.array(z.enum(OPENSEA_EVENT_TYPES))
		.min(1)
		.optional()
		.describe('Only these event types.'),
	traits: z
		.string()
		.min(1)
		.optional()
		.describe(
			'JSON array of trait filters, sent as a string: `[{"traitType":"Background","value":"Red"}]`. Several filters are AND-combined.',
		),
	after: z
		.number()
		.int()
		.optional()
		.describe('Only events after this unix timestamp.'),
	before: z
		.number()
		.int()
		.optional()
		.describe('Only events before this unix timestamp.'),
	limit: z.number().int().min(1).optional().describe('Page size.'),
	next: z.string().min(1).optional().describe('The `next` cursor.'),
});

export type CollectionEventsInput = z.input<typeof CollectionEventsInputSchema>;

// ── Search and traits ─────────────────────────────────────────────────────

const SearchInputSchema = z.object({
	query: z.string().min(1).describe('What to search for.'),
	chains: z
		.array(ChainIdentifierSchema)
		.min(1)
		.optional()
		.describe('Only results on these chains.'),
	asset_types: z
		.array(z.string())
		.min(1)
		.optional()
		.describe(
			'Only these result kinds: `collection`, `nft`, `token`, `account`. The API defaults to collections and tokens.',
		),
	limit: z.number().int().min(1).optional().describe('Defaults to 20.'),
});

export type SearchInput = z.input<typeof SearchInputSchema>;

/**
 * One result, tagged by `type`. Exactly one of the four payload keys is set and
 * the spec does not say which pairs with which `type`, so all are optional here
 * and the caller branches on `type`.
 */
const SearchResultSchema = z
	.object({
		type: z.string(),
		// unknown: one payload key per result type, shaped by the spec's own
		// sub-schemas; the caller branches on `type` before reading it.
		collection: z.record(z.string(), z.unknown()).nullish(),
		// unknown: a nested NFT summary, whose fields differ per event type.
		nft: z.record(z.string(), z.unknown()).nullish(),
		// unknown: same reason as `collection` above.
		account: z.record(z.string(), z.unknown()).nullish(),
		// unknown: same reason as `collection` above.
		token: z.record(z.string(), z.unknown()).nullish(),
	})
	.loose();

export type OpenseaSearchResult = z.infer<typeof SearchResultSchema>;

const SearchResponseSchema = z
	.object({
		results: z.array(SearchResultSchema),
	})
	.loose();

export type SearchResponse = z.infer<typeof SearchResponseSchema>;

const TraitsListInputSchema = z.object({
	slug: z.string().min(1).describe('The collection slug.'),
});

export type TraitsListInput = z.input<typeof TraitsListInputSchema>;

/**
 * `categories` maps a trait name to its value **type** (`"string"`,
 * `"number"`). `counts` maps the same name to its values: for a string trait,
 * each value and how many NFTs carry it (`{ "Blue": 1242 }`); for a numeric
 * trait, `min` and `max`.
 */
const TraitsResponseSchema = z
	.object({
		categories: z.record(z.string(), z.string()),
		// unknown: one object per trait, value counts or a min/max pair depending
		// on the trait's type. Left open so a new trait type cannot fail the call.
		counts: z.record(z.string(), z.unknown()).nullish(),
	})
	.loose();

export type TraitsListResponse = z.infer<typeof TraitsResponseSchema>;

// ── Listings and offers ───────────────────────────────────────────────────

/**
 * An order's `protocol_data` is a Seaport payload whose depth changes with the
 * order type, so it is passed through rather than typed field by field.
 */
const OrderProtocolDataSchema = z
	.object({
		// unknown: a Seaport payload whose depth changes with the order type.
		parameters: z.record(z.string(), z.unknown()).nullish(),
		signature: z.string().nullish(),
	})
	.loose();

const OrderAssetSchema = z
	.object({
		contract: z.string(),
		identifier: z.string().nullish(),
	})
	.loose();

/** A Seaport price, with the value as a decimal string in the currency's base units. */
const OrderPriceSchema = z
	.object({
		currency: z.string().nullish(),
		decimals: z.number().nullish(),
		// A string, because an 18-decimal wei amount is past the safe integer
		// range: 5900000000000000000 would arrive rounded.
		value: z.string().nullish(),
	})
	.loose();

const OrderSchema = z
	.object({
		order_hash: z.string().nullish(),
		chain: z.string(),
		protocol: z.string().nullish(),
		protocol_address: z.string().nullish(),
		remaining_quantity: z.number().nullish(),
		order_created_at: z.number().nullish(),
		asset: OrderAssetSchema.nullish(),
		protocol_data: OrderProtocolDataSchema.nullish(),
		/** Present on listing and offer rows; the spec types this loosely. */
		price: z.object({ current: OrderPriceSchema.nullish() }).loose().nullish(),
		price_per_item: OrderPriceSchema.nullish(),
		type: z.string().nullish(),
		status: z.string().nullish(),
	})
	.loose();

export type OpenseaOrder = z.infer<typeof OrderSchema>;

const BestListingsInputSchema = z.object({
	slug: z.string().min(1).describe('The collection slug.'),
	include_private_listings: z
		.boolean()
		.optional()
		.describe('Include listings not shown on the public marketplace.'),
	traits: z
		.string()
		.min(1)
		.optional()
		.describe(
			'JSON array of trait filters, sent as a string: `[{"traitType":"Background","value":"Red"}]`. Several filters are AND-combined.',
		),
	limit: z.number().int().min(1).optional().describe('Page size.'),
	next: z.string().min(1).optional().describe('The `next` cursor.'),
});

export type BestListingsInput = z.input<typeof BestListingsInputSchema>;

const ListingsResponseSchema = z
	.object({
		listings: z.array(OrderSchema),
		next: z.string().nullish(),
	})
	.loose();

export type ListingsResponse = z.infer<typeof ListingsResponseSchema>;

const CollectionOffersInputSchema = z.object({
	slug: z.string().min(1).describe('The collection slug.'),
	limit: z.number().int().min(1).optional().describe('Page size.'),
	next: z.string().min(1).optional().describe('The `next` cursor.'),
});

export type CollectionOffersInput = z.input<typeof CollectionOffersInputSchema>;

const OffersResponseSchema = z
	.object({
		offers: z.array(OrderSchema),
		next: z.string().nullish(),
	})
	.loose();

export type OffersResponse = z.infer<typeof OffersResponseSchema>;

const AllListingsInputSchema = z.object({
	slug: z.string().min(1).describe('The collection slug.'),
	include_private_listings: z
		.boolean()
		.optional()
		.describe('Include listings not shown on the public marketplace.'),
	maker: z
		.string()
		.min(1)
		.optional()
		.describe('Only listings signed by this wallet address.'),
	limit: z.number().int().min(1).optional().describe('Page size.'),
	next: z.string().min(1).optional().describe('The `next` cursor.'),
});

export type AllListingsInput = z.input<typeof AllListingsInputSchema>;

const AllOffersInputSchema = z.object({
	slug: z.string().min(1).describe('The collection slug.'),
	maker: z
		.string()
		.min(1)
		.optional()
		.describe('Only offers made from this wallet address.'),
	limit: z.number().int().min(1).optional().describe('Page size.'),
	next: z.string().min(1).optional().describe('The `next` cursor.'),
});

export type AllOffersInput = z.input<typeof AllOffersInputSchema>;

const BestOfferInputSchema = z.object({
	slug: z.string().min(1).describe('The collection slug.'),
	identifier: z
		.string()
		.min(1)
		.describe('The token id within the collection, as a string.'),
});

export type BestOfferInput = z.input<typeof BestOfferInputSchema>;

/**
 * The best offer arrives **bare**, not wrapped in `order`, which is what live
 * responses show even though the published spec describes the same `Offer`
 * object the list routes nest. Captured: the top-level keys are `order_hash`,
 * `chain`, `protocol_data`, `protocol_address`, `asset`, `remaining_quantity`,
 * `order_created_at`, `criteria`, `price`, `price_per_item` and `status`. An
 * unknown token answers 404 `NFT with identifier … not found in collection …`.
 */
const BestOfferResponseSchema = OrderSchema;

export type BestOfferResponse = z.infer<typeof BestOfferResponseSchema>;

/** A single order under `/orders/chain/...` arrives wrapped under `order`. */
const OrderResponseSchema = z
	.object({
		order: OrderSchema,
	})
	.loose();

export type OrderResponse = z.infer<typeof OrderResponseSchema>;

const OrderGetInputSchema = z.object({
	chain: ChainIdentifierSchema,
	protocol_address: z
		.string()
		.min(1)
		.describe(
			"The Seaport contract address, such as OpenSea's 0x0000000000000068f116a894984e2db1123eb395.",
		),
	order_hash: z
		.string()
		.min(1)
		.describe('The `order_hash` from a listing or offer row.'),
});

export type OrderGetInput = z.input<typeof OrderGetInputSchema>;

// ── Collection analytics ──────────────────────────────────────────────────

const FloorPricesInputSchema = z.object({
	slug: z.string().min(1).describe('The collection slug.'),
	timeframe: z
		.string()
		.min(1)
		.optional()
		.describe(
			'Window to report, such as `one_hour`, `one_day`, `seven_days`, `thirty_days` or `all_time`. The API defaults to `one_day`.',
		),
	resolution: z
		.number()
		.int()
		.min(1)
		.optional()
		.describe(
			'Number of data points to return. The spec gives no default or bounds.',
		),
});

export type FloorPricesInput = z.input<typeof FloorPricesInputSchema>;

/** Captured live: `time` is a float unix timestamp, not an integer. */
const FloorPricePointSchema = z
	.object({
		time: z.number().nullish(),
		usd_price: z.string().nullish(),
		token_unit: z.number().nullish(),
		symbol: z.string().nullish(),
		chain: z.string().nullish(),
	})
	.loose();

const FloorPricesResponseSchema = z
	.object({
		floor_prices: z.array(FloorPricePointSchema),
	})
	.loose();

export type FloorPricesResponse = z.infer<typeof FloorPricesResponseSchema>;

const HoldersInputSchema = z.object({
	slug: z.string().min(1).describe('The collection slug.'),
	limit: z.number().int().min(1).optional().describe('Defaults to 20.'),
	cursor: z
		.string()
		.min(1)
		.optional()
		.describe(
			"The previous response's `next` value. This route calls it `cursor`.",
		),
	sort_direction: z
		.enum(['asc', 'desc'])
		.optional()
		.describe('Order by quantity held. Defaults to `desc`.'),
	owned_by: z
		.string()
		.min(1)
		.optional()
		.describe('Only report this wallet address.'),
});

export type HoldersInput = z.input<typeof HoldersInputSchema>;

/** Captured live: `percentage` arrives as a fraction, 0.0127 for 1.27%. */
const HolderSchema = z
	.object({
		address: z.string(),
		quantity: z.number().nullish(),
		percentage: z.number().nullish(),
	})
	.loose();

const HoldersResponseSchema = z
	.object({
		holders: z.array(HolderSchema),
		next: z.string().nullish(),
	})
	.loose();

export type HoldersResponse = z.infer<typeof HoldersResponseSchema>;

// ── Accounts ──────────────────────────────────────────────────────────────

const AccountGetInputSchema = z.object({
	address_or_username: z
		.string()
		.min(1)
		.max(256)
		.describe('A wallet address or an OpenSea username.'),
});

export type AccountGetInput = z.input<typeof AccountGetInputSchema>;

const AccountSchema = z
	.object({
		address: z.string(),
		username: z.string().nullish(),
		display_name: z.string().nullish(),
		bio: z.string().nullish(),
		ens_name: z.string().nullish(),
		banner_image_url: z.string().nullish(),
		profile_image_url: z.string().nullish(),
		follower_count: z.number().nullish(),
		following_count: z.number().nullish(),
		is_verified: z.boolean().nullish(),
		is_agent: z.boolean().nullish(),
		joined_date: z.string().nullish(),
	})
	.loose();

export type OpenseaAccount = z.infer<typeof AccountSchema>;

/** A single account arrives bare. */
const AccountGetResponseSchema = AccountSchema;

export type AccountGetResponse = z.infer<typeof AccountGetResponseSchema>;

const PortfolioInputSchema = z.object({
	address: z.string().min(1).describe('The wallet address to value.'),
	timeframe: z
		.string()
		.min(1)
		.optional()
		.describe(
			'Window for the P&L figures: `HOUR`, `DAY`, `WEEK` or `MONTH`. The API defaults to `DAY`.',
		),
	chains: z
		.array(ChainIdentifierSchema)
		.min(1)
		.optional()
		.describe('Only value assets on these chains.'),
});

export type PortfolioInput = z.input<typeof PortfolioInputSchema>;

/**
 * Captured live: every money figure is a **string**, and `pnl_absolute` and
 * `pnl_percentage` are absent entirely when the account has no history, rather
 * than zero. `nft_value_usd` and the rest arrive even for an empty wallet.
 */
const PortfolioResponseSchema = z
	.object({
		total_value_usd: z.string().nullish(),
		nft_value_usd: z.string().nullish(),
		token_value_usd: z.string().nullish(),
		pnl_absolute: z.string().nullish(),
		pnl_percentage: z.string().nullish(),
		timeframe: z.string().nullish(),
	})
	.loose();

export type PortfolioResponse = z.infer<typeof PortfolioResponseSchema>;

// ── Registry ──────────────────────────────────────────────────────────────

export type OpenseaEndpointInputs = {
	chainsList: ChainsListInput;
	collectionsList: CollectionsListInput;
	collectionsGet: CollectionsGetInput;
	collectionsStats: CollectionsStatsInput;
	collectionsTop: CollectionsTopInput;
	collectionsTrending: TrendingCollectionsInput;
	collectionNfts: CollectionNftsInput;
	contractNfts: ContractNftsInput;
	nftsGet: NftsGetInput;
	nftsOwners: OwnersInput;
	eventsList: EventsListInput;
	eventsCollection: CollectionEventsInput;
	search: SearchInput;
	traitsList: TraitsListInput;
	listingsBest: BestListingsInput;
	listingsAll: AllListingsInput;
	offersCollection: CollectionOffersInput;
	offersAll: AllOffersInput;
	offersBest: BestOfferInput;
	ordersGet: OrderGetInput;
	collectionsFloorPrices: FloorPricesInput;
	collectionsHolders: HoldersInput;
	accountsGet: AccountGetInput;
	accountsPortfolio: PortfolioInput;
};

export type OpenseaEndpointOutputs = {
	chainsList: ChainsListResponse;
	collectionsList: CollectionsListResponse;
	collectionsGet: CollectionsGetResponse;
	collectionsStats: CollectionsStatsResponse;
	collectionsTop: RankedCollectionsResponse;
	collectionsTrending: RankedCollectionsResponse;
	collectionNfts: NftListResponse;
	contractNfts: NftListResponse;
	nftsGet: NftGetResponse;
	nftsOwners: OwnersResponse;
	eventsList: EventsListResponse;
	eventsCollection: EventsListResponse;
	search: SearchResponse;
	traitsList: TraitsListResponse;
	listingsBest: ListingsResponse;
	listingsAll: ListingsResponse;
	offersCollection: OffersResponse;
	offersAll: OffersResponse;
	offersBest: BestOfferResponse;
	ordersGet: OrderResponse;
	collectionsFloorPrices: FloorPricesResponse;
	collectionsHolders: HoldersResponse;
	accountsGet: AccountGetResponse;
	accountsPortfolio: PortfolioResponse;
};

export const OpenseaEndpointInputSchemas = {
	chainsList: ChainsListInputSchema,
	collectionsList: CollectionsListInputSchema,
	collectionsGet: CollectionsGetInputSchema,
	collectionsStats: CollectionsStatsInputSchema,
	collectionsTop: CollectionsTopInputSchema,
	collectionsTrending: TrendingCollectionsInputSchema,
	collectionNfts: CollectionNftsInputSchema,
	contractNfts: ContractNftsInputSchema,
	nftsGet: NftsGetInputSchema,
	nftsOwners: OwnersInputSchema,
	eventsList: EventsListInputSchema,
	eventsCollection: CollectionEventsInputSchema,
	search: SearchInputSchema,
	traitsList: TraitsListInputSchema,
	listingsBest: BestListingsInputSchema,
	listingsAll: AllListingsInputSchema,
	offersCollection: CollectionOffersInputSchema,
	offersAll: AllOffersInputSchema,
	offersBest: BestOfferInputSchema,
	ordersGet: OrderGetInputSchema,
	collectionsFloorPrices: FloorPricesInputSchema,
	collectionsHolders: HoldersInputSchema,
	accountsGet: AccountGetInputSchema,
	accountsPortfolio: PortfolioInputSchema,
} as const;

export const OpenseaEndpointOutputSchemas = {
	chainsList: ChainsListResponseSchema,
	collectionsList: CollectionsListResponseSchema,
	collectionsGet: CollectionsGetResponseSchema,
	collectionsStats: CollectionsStatsResponseSchema,
	collectionsTop: RankedCollectionsResponseSchema,
	collectionsTrending: RankedCollectionsResponseSchema,
	collectionNfts: NftListResponseSchema,
	contractNfts: NftListResponseSchema,
	nftsGet: NftResponseSchema,
	nftsOwners: OwnersResponseSchema,
	eventsList: EventsListResponseSchema,
	eventsCollection: EventsListResponseSchema,
	search: SearchResponseSchema,
	traitsList: TraitsResponseSchema,
	listingsBest: ListingsResponseSchema,
	listingsAll: ListingsResponseSchema,
	offersCollection: OffersResponseSchema,
	offersAll: OffersResponseSchema,
	offersBest: BestOfferResponseSchema,
	ordersGet: OrderResponseSchema,
	collectionsFloorPrices: FloorPricesResponseSchema,
	collectionsHolders: HoldersResponseSchema,
	accountsGet: AccountGetResponseSchema,
	accountsPortfolio: PortfolioResponseSchema,
} as const;
