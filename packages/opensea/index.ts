import type {
	AuthTypes,
	BindEndpoints,
	BindWebhooks,
	CorsairEndpoint,
	CorsairErrorHandler,
	CorsairPlugin,
	CorsairPluginContext,
	KeyBuilderContext,
	PickAuth,
	PluginAuthConfig,
	PluginPermissionsConfig,
	RequiredPluginEndpointMeta,
	RequiredPluginEndpointSchemas,
	RequiredPluginWebhookSchemas,
} from 'corsair/core';
import { AuthMissingError } from 'corsair/core';
import { Extended, Marketplace } from './endpoints';
import type {
	OpenseaEndpointInputs,
	OpenseaEndpointOutputs,
} from './endpoints/types';
import {
	OpenseaEndpointInputSchemas,
	OpenseaEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';
import { OpenseaSchema } from './schema';

export type OpenseaPluginOptions = {
	authType?: PickAuth<'api_key'>;
	/** An OpenSea API key. Overrides the stored key. */
	key?: string;
	hooks?: InternalOpenseaPlugin['hooks'];
	webhookHooks?: InternalOpenseaPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof openseaEndpointsNested>;
};

export type OpenseaContext = CorsairPluginContext<
	typeof OpenseaSchema,
	OpenseaPluginOptions
>;

export type OpenseaKeyBuilderContext = KeyBuilderContext<OpenseaPluginOptions>;

export type OpenseaBoundEndpoints = BindEndpoints<
	typeof openseaEndpointsNested
>;

type OpenseaEndpoint<K extends keyof OpenseaEndpointOutputs> = CorsairEndpoint<
	OpenseaContext,
	OpenseaEndpointInputs[K],
	OpenseaEndpointOutputs[K]
>;

export type OpenseaEndpoints = {
	chainsList: OpenseaEndpoint<'chainsList'>;
	collectionsList: OpenseaEndpoint<'collectionsList'>;
	collectionsGet: OpenseaEndpoint<'collectionsGet'>;
	collectionsStats: OpenseaEndpoint<'collectionsStats'>;
	collectionsTop: OpenseaEndpoint<'collectionsTop'>;
	collectionsTrending: OpenseaEndpoint<'collectionsTrending'>;
	collectionNfts: OpenseaEndpoint<'collectionNfts'>;
	contractNfts: OpenseaEndpoint<'contractNfts'>;
	nftsGet: OpenseaEndpoint<'nftsGet'>;
	nftsOwners: OpenseaEndpoint<'nftsOwners'>;
	eventsList: OpenseaEndpoint<'eventsList'>;
	eventsCollection: OpenseaEndpoint<'eventsCollection'>;
	search: OpenseaEndpoint<'search'>;
	traitsList: OpenseaEndpoint<'traitsList'>;
	listingsBest: OpenseaEndpoint<'listingsBest'>;
	listingsAll: OpenseaEndpoint<'listingsAll'>;
	offersCollection: OpenseaEndpoint<'offersCollection'>;
	offersAll: OpenseaEndpoint<'offersAll'>;
	offersBest: OpenseaEndpoint<'offersBest'>;
	ordersGet: OpenseaEndpoint<'ordersGet'>;
	collectionsFloorPrices: OpenseaEndpoint<'collectionsFloorPrices'>;
	collectionsHolders: OpenseaEndpoint<'collectionsHolders'>;
	accountsGet: OpenseaEndpoint<'accountsGet'>;
	accountsPortfolio: OpenseaEndpoint<'accountsPortfolio'>;
};

// OpenSea sends no inbound webhooks. It publishes a Stream API over WebSocket
// and a marketplace-event feed, both of which a caller polls or subscribes to
// from its own side, so nothing is registered here and no secret is stored.
export type OpenseaWebhooks = Record<never, never>;

export type OpenseaBoundWebhooks = BindWebhooks<typeof openseaWebhooksNested>;

const openseaEndpointsNested = {
	chains: {
		list: Marketplace.chains,
	},
	collections: {
		list: Marketplace.list,
		get: Marketplace.get,
		stats: Marketplace.stats,
		top: Marketplace.top,
		trending: Marketplace.trending,
		floorPrices: Extended.floorPrices,
		holders: Extended.holders,
	},
	collection: {
		nfts: Marketplace.nfts,
	},
	contract: {
		nfts: Extended.contractNfts,
	},
	nfts: {
		get: Marketplace.nft,
		owners: Extended.nftOwners,
	},
	events: {
		list: Marketplace.events,
		collection: Extended.collectionEvents,
	},
	accounts: {
		get: Extended.account,
		portfolio: Extended.portfolio,
	},
	orders: {
		get: Extended.getOrder,
	},
	search: {
		search: Marketplace.search,
	},
	traits: {
		list: Marketplace.traits,
	},
	listings: {
		best: Marketplace.bestListings,
		all: Extended.allListings,
	},
	offers: {
		collection: Marketplace.collectionOffers,
		all: Extended.allOffers,
		best: Extended.bestOffer,
	},
} as const;

const openseaWebhooksNested = {} as const;

export const openseaEndpointSchemas = {
	'chains.list': {
		input: OpenseaEndpointInputSchemas.chainsList,
		output: OpenseaEndpointOutputSchemas.chainsList,
	},
	'collections.list': {
		input: OpenseaEndpointInputSchemas.collectionsList,
		output: OpenseaEndpointOutputSchemas.collectionsList,
	},
	'collections.get': {
		input: OpenseaEndpointInputSchemas.collectionsGet,
		output: OpenseaEndpointOutputSchemas.collectionsGet,
	},
	'collections.stats': {
		input: OpenseaEndpointInputSchemas.collectionsStats,
		output: OpenseaEndpointOutputSchemas.collectionsStats,
	},
	'collections.top': {
		input: OpenseaEndpointInputSchemas.collectionsTop,
		output: OpenseaEndpointOutputSchemas.collectionsTop,
	},
	'collections.trending': {
		input: OpenseaEndpointInputSchemas.collectionsTrending,
		output: OpenseaEndpointOutputSchemas.collectionsTrending,
	},
	'collections.floorPrices': {
		input: OpenseaEndpointInputSchemas.collectionsFloorPrices,
		output: OpenseaEndpointOutputSchemas.collectionsFloorPrices,
	},
	'collections.holders': {
		input: OpenseaEndpointInputSchemas.collectionsHolders,
		output: OpenseaEndpointOutputSchemas.collectionsHolders,
	},
	'collection.nfts': {
		input: OpenseaEndpointInputSchemas.collectionNfts,
		output: OpenseaEndpointOutputSchemas.collectionNfts,
	},
	'contract.nfts': {
		input: OpenseaEndpointInputSchemas.contractNfts,
		output: OpenseaEndpointOutputSchemas.contractNfts,
	},
	'nfts.get': {
		input: OpenseaEndpointInputSchemas.nftsGet,
		output: OpenseaEndpointOutputSchemas.nftsGet,
	},
	'nfts.owners': {
		input: OpenseaEndpointInputSchemas.nftsOwners,
		output: OpenseaEndpointOutputSchemas.nftsOwners,
	},
	'events.list': {
		input: OpenseaEndpointInputSchemas.eventsList,
		output: OpenseaEndpointOutputSchemas.eventsList,
	},
	'events.collection': {
		input: OpenseaEndpointInputSchemas.eventsCollection,
		output: OpenseaEndpointOutputSchemas.eventsCollection,
	},
	'accounts.get': {
		input: OpenseaEndpointInputSchemas.accountsGet,
		output: OpenseaEndpointOutputSchemas.accountsGet,
	},
	'accounts.portfolio': {
		input: OpenseaEndpointInputSchemas.accountsPortfolio,
		output: OpenseaEndpointOutputSchemas.accountsPortfolio,
	},
	'orders.get': {
		input: OpenseaEndpointInputSchemas.ordersGet,
		output: OpenseaEndpointOutputSchemas.ordersGet,
	},
	'search.search': {
		input: OpenseaEndpointInputSchemas.search,
		output: OpenseaEndpointOutputSchemas.search,
	},
	'traits.list': {
		input: OpenseaEndpointInputSchemas.traitsList,
		output: OpenseaEndpointOutputSchemas.traitsList,
	},
	'listings.best': {
		input: OpenseaEndpointInputSchemas.listingsBest,
		output: OpenseaEndpointOutputSchemas.listingsBest,
	},
	'listings.all': {
		input: OpenseaEndpointInputSchemas.listingsAll,
		output: OpenseaEndpointOutputSchemas.listingsAll,
	},
	'offers.collection': {
		input: OpenseaEndpointInputSchemas.offersCollection,
		output: OpenseaEndpointOutputSchemas.offersCollection,
	},
	'offers.all': {
		input: OpenseaEndpointInputSchemas.offersAll,
		output: OpenseaEndpointOutputSchemas.offersAll,
	},
	'offers.best': {
		input: OpenseaEndpointInputSchemas.offersBest,
		output: OpenseaEndpointOutputSchemas.offersBest,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof openseaEndpointsNested
>;

const openseaWebhookSchemas =
	{} as const satisfies RequiredPluginWebhookSchemas<
		typeof openseaWebhooksNested
	>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const openseaEndpointMeta = {
	'chains.list': {
		riskLevel: 'read',
		description:
			'The chains OpenSea indexes, with each one\u2019s symbol and block explorer. No input; the list is the valid source for every `chain` argument elsewhere.',
	},
	'collections.list': {
		riskLevel: 'read',
		description:
			'Collections, paged with the returned `next` cursor. Filter by chain, creator or hidden status, and sort with `order_by`. OpenSea defaults the page size to 50.',
	},
	'collections.get': {
		riskLevel: 'read',
		description:
			'One collection by slug, with its contract addresses, links and NFT counts. The answer is a bare object, not an array, and an unknown slug is a 404.',
	},
	'collections.stats': {
		riskLevel: 'read',
		description:
			'Volume, sales, owner count and floor price for one collection, as an all-time total plus per-interval rows.',
	},
	'collections.top': {
		riskLevel: 'read',
		description:
			'Collections ranked by a metric, `one_day_volume` by default. This route pages with `cursor`, which is the previous response\u2019s `next`.',
	},
	'collections.trending': {
		riskLevel: 'read',
		description:
			'Collections ranked by momentum over a window, `one_day` by default. Same page shape as `collections.top`, and it pages with `cursor` too.',
	},
	'collections.floorPrices': {
		riskLevel: 'read',
		description:
			'Floor price over time for one collection, as points carrying a float unix timestamp, a USD string and a token-unit price. Narrow with `timeframe`, and set how many points come back with `resolution`.',
	},
	'collections.holders': {
		riskLevel: 'read',
		description:
			'Wallet addresses holding one collection, with each amount and its share of supply as a fraction (`0.0127` is 1.27%). Sort by quantity either way. This route pages with `cursor`, not `next`.',
	},
	'collection.nfts': {
		riskLevel: 'read',
		description:
			'The NFTs in one collection, paged with `next`. Filter by trait with `traits`, a JSON array of `traitType` and `value` pairs sent as a string.',
	},
	'contract.nfts': {
		riskLevel: 'read',
		description:
			'Every NFT a contract has issued, paged with `next`. Use this to walk a contract whose collection slug you do not have; `collection.nfts` is the same rows keyed by slug.',
	},
	'nfts.get': {
		riskLevel: 'read',
		description:
			'One NFT by chain, contract address and token id, with its owners and traits. The token id goes in as a string, because some collections use ids beyond the safe integer range.',
	},
	'nfts.owners': {
		riskLevel: 'read',
		description:
			'Wallets holding one token, with the quantity each holds. Useful for an ERC-1155 or a fractionalised token, where more than one address holds the same id.',
	},
	'events.list': {
		riskLevel: 'read',
		description:
			'Marketplace events, newest first, paged with `next`. Narrow by event type and by an `after` or `before` unix timestamp.',
	},
	'events.collection': {
		riskLevel: 'read',
		description:
			'Marketplace events limited to one collection, paged with `next`. Narrow by event type, trait filter or a time window. The account-wide `events.list` is the same shape without the collection scope.',
	},
	'search.search': {
		riskLevel: 'read',
		description:
			'Search across collections, NFTs, tokens and accounts. Each result carries a `type` and one payload key, so branch on `type` before reading the rest.',
	},
	'accounts.get': {
		riskLevel: 'read',
		description:
			'One OpenSea profile by wallet address or username, with its display name, bio, follower counts and verification flag. `is_agent` is a self-declaration, not a check by OpenSea.',
	},
	'accounts.portfolio': {
		riskLevel: 'read',
		description:
			'USD value of one wallet\u2019s NFTs and tokens, with profit and loss over a timeframe. Every figure is a string. `pnl_absolute` and `pnl_percentage` are absent, not zero, when the account has no history.',
	},
	'orders.get': {
		riskLevel: 'read',
		description:
			'One order by chain, Seaport contract address and order hash, as a single object rather than an array. Takes the `order_hash` from a listing or offer row; a cancelled or filled order still answers with its final state.',
	},
	'traits.list': {
		riskLevel: 'read',
		description:
			'The trait names on one collection, the type of each, and under `counts` every value with how many NFTs carry it (`min` and `max` for a numeric trait). Use `collection.nfts` with a `traits` filter to select NFTs by value.',
	},
	'listings.best': {
		riskLevel: 'read',
		description:
			'The cheapest active listings in one collection, paged with `next`. Each order carries a Seaport `protocol_data` payload and its `order_hash` for a later fulfilment call.',
	},
	'listings.all': {
		riskLevel: 'read',
		description:
			'Every active listing in a collection, paged with `next`, including private ones when asked. Filter by `maker` to see one seller\u2019s listings. `listings.best` gives only the cheapest per token.',
	},
	'offers.all': {
		riskLevel: 'read',
		description:
			'Every active offer on a collection, paged with `next`, including trait and per-token offers. Filter by `maker` for one bidder. `offers.collection` gives only the collection-wide ones.',
	},
	'offers.best': {
		riskLevel: 'read',
		description:
			'The highest active offer on one token in a collection, as a single order object. Answers an empty or 404 result when nobody has bid on that token.',
	},
	'offers.collection': {
		riskLevel: 'read',
		description:
			'Active collection-wide offers, paged with `next`. Same order shape as listings, with `remaining_quantity` for how much of the offer is unfilled.',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof openseaEndpointsNested>;

export const openseaAuthConfig = {
	api_key: {},
} as const satisfies PluginAuthConfig;

export type BaseOpenseaPlugin<T extends OpenseaPluginOptions> = CorsairPlugin<
	'opensea',
	typeof OpenseaSchema,
	typeof openseaEndpointsNested,
	typeof openseaWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalOpenseaPlugin = BaseOpenseaPlugin<OpenseaPluginOptions>;

export type ExternalOpenseaPlugin<T extends OpenseaPluginOptions> =
	BaseOpenseaPlugin<T>;

export function opensea<const T extends OpenseaPluginOptions>(
	incomingOptions: OpenseaPluginOptions & T = {} as OpenseaPluginOptions & T,
): ExternalOpenseaPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'opensea',
		authConfig: openseaAuthConfig,
		schema: OpenseaSchema,
		options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: openseaEndpointsNested,
		webhooks: openseaWebhooksNested,
		endpointMeta: openseaEndpointMeta,
		endpointSchemas: openseaEndpointSchemas,
		webhookSchemas: openseaWebhookSchemas,
		pluginWebhookMatcher: () => false,
		errorHandlers: mergeErrorHandlers(errorHandlers, options.errorHandlers),
		keyBuilder: async (ctx: OpenseaKeyBuilderContext, source) => {
			// No webhooks are registered, so a webhook source is unreachable. It is
			// refused rather than handed the API key.
			if (source === 'webhook') {
				throw new AuthMissingError('opensea', 'webhook');
			}

			if (options.key) return options.key;

			const key = await ctx.keys.get_api_key();
			if (!key) throw new AuthMissingError('opensea', 'api_key');
			return key;
		},
	} satisfies InternalOpenseaPlugin;
}

export {
	OPENSEA_API_BASE,
	OpenseaAPIError,
	OpenseaTransportError,
} from './client';
export type {
	OpenseaEndpointInputs,
	OpenseaEndpointOutputs,
} from './endpoints/types';
export { OPENSEA_CHAINS, OPENSEA_EVENT_TYPES } from './endpoints/types';
