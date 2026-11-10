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
import { Marketplace } from './endpoints';
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
	nftsGet: OpenseaEndpoint<'nftsGet'>;
	eventsList: OpenseaEndpoint<'eventsList'>;
	search: OpenseaEndpoint<'search'>;
	traitsList: OpenseaEndpoint<'traitsList'>;
	listingsBest: OpenseaEndpoint<'listingsBest'>;
	offersCollection: OpenseaEndpoint<'offersCollection'>;
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
	},
	collection: {
		nfts: Marketplace.nfts,
	},
	nfts: {
		get: Marketplace.nft,
	},
	events: {
		list: Marketplace.events,
	},
	search: {
		search: Marketplace.search,
	},
	traits: {
		list: Marketplace.traits,
	},
	listings: {
		best: Marketplace.bestListings,
	},
	offers: {
		collection: Marketplace.collectionOffers,
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
	'collection.nfts': {
		input: OpenseaEndpointInputSchemas.collectionNfts,
		output: OpenseaEndpointOutputSchemas.collectionNfts,
	},
	'nfts.get': {
		input: OpenseaEndpointInputSchemas.nftsGet,
		output: OpenseaEndpointOutputSchemas.nftsGet,
	},
	'events.list': {
		input: OpenseaEndpointInputSchemas.eventsList,
		output: OpenseaEndpointOutputSchemas.eventsList,
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
	'offers.collection': {
		input: OpenseaEndpointInputSchemas.offersCollection,
		output: OpenseaEndpointOutputSchemas.offersCollection,
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
			'The chains OpenSea indexes, with each one\u2019s symbol and block explorer. No input; the list is a closed set and is the valid source for every `chain` argument elsewhere.',
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
			'Collections ranked by a metric, `one_day_volume` by default. Page with `cursor`, which is the previous response\u2019s `next`.',
	},
	'collections.trending': {
		riskLevel: 'read',
		description:
			'Collections ranked by momentum over a window, `one_day` by default. Same page shape and cursor as `collections.top`.',
	},
	'collection.nfts': {
		riskLevel: 'read',
		description:
			'The NFTs in one collection, paged with `next`. Filter by trait with `trait_type:value`, several joined by commas.',
	},
	'nfts.get': {
		riskLevel: 'read',
		description:
			'One NFT by chain, contract address and token id, with its owners and traits. The token id goes in as a string, because some collections use ids beyond the safe integer range.',
	},
	'events.list': {
		riskLevel: 'read',
		description:
			'Marketplace events, newest first, paged with `next`. Narrow by event type and by an `after` or `before` unix timestamp.',
	},
	'search.search': {
		riskLevel: 'read',
		description:
			'Search across collections, NFTs, tokens and accounts. Each result carries a `type` and one payload key, so branch on `type` before reading the rest.',
	},
	'traits.list': {
		riskLevel: 'read',
		description:
			'The trait names on one collection and the type of each value. It answers types, not the values themselves; use `collection.nfts` with a trait filter to select by value.',
	},
	'listings.best': {
		riskLevel: 'read',
		description:
			'The cheapest active listings in one collection, paged with `next`. Each order carries a Seaport `protocol_data` payload and its `order_hash` for a later fulfilment call.',
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
