import type { OpenseaEndpoints } from '..';
import { segment } from '../client';
import { call } from './call';
import {
	OpenseaEndpointInputSchemas as Inputs,
	OpenseaEndpointOutputSchemas as Outputs,
} from './types';

export const chains: OpenseaEndpoints['chainsList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'chains.list',
			input: Inputs.chainsList,
			output: Outputs.chainsList,
			toRequest: () => ({ method: 'GET', path: '/chains' }),
		},
		input,
		{
			log: (_, result) => ({ count: result.chains.length }),
		},
	);

export const list: OpenseaEndpoints['collectionsList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'collections.list',
			input: Inputs.collectionsList,
			output: Outputs.collectionsList,
			toRequest: ({
				chain,
				creator_username,
				include_hidden,
				order_by,
				limit,
				next,
			}) => ({
				method: 'GET',
				path: '/collections',
				query: {
					chain,
					creator_username,
					include_hidden,
					order_by,
					limit,
					next,
				},
			}),
		},
		input,
		{
			log: (_, result) => ({
				count: result.collections.length,
				hasNext: result.next !== null && result.next !== undefined,
			}),
		},
	);

export const get: OpenseaEndpoints['collectionsGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'collections.get',
			input: Inputs.collectionsGet,
			output: Outputs.collectionsGet,
			toRequest: ({ slug }) => ({
				method: 'GET',
				path: `/collections/${segment(slug)}`,
			}),
		},
		input,
		{
			log: ({ slug }, result) => ({ slug, name: result.name }),
		},
	);

export const stats: OpenseaEndpoints['collectionsStats'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'collections.stats',
			input: Inputs.collectionsStats,
			output: Outputs.collectionsStats,
			toRequest: ({ slug }) => ({
				method: 'GET',
				path: `/collections/${segment(slug)}/stats`,
			}),
		},
		input,
		{
			log: ({ slug }, result) => ({
				slug,
				floorPrice: result.total.floor_price ?? undefined,
				volume: result.total.volume ?? undefined,
			}),
		},
	);

export const top: OpenseaEndpoints['collectionsTop'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'collections.top',
			input: Inputs.collectionsTop,
			output: Outputs.collectionsTop,
			toRequest: ({ sort_by, chains, category, limit, cursor }) => ({
				method: 'GET',
				path: '/collections/top',
				query: {
					sort_by,
					chains: chains?.join(','),
					category,
					limit,
					cursor,
				},
			}),
		},
		input,
		{
			log: (_, result) => ({
				count: result.collections.length,
				hasNext: result.next !== null && result.next !== undefined,
			}),
		},
	);

export const trending: OpenseaEndpoints['collectionsTrending'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'collections.trending',
			input: Inputs.collectionsTrending,
			output: Outputs.collectionsTrending,
			toRequest: ({ timeframe, chains, category, limit, cursor }) => ({
				method: 'GET',
				path: '/collections/trending',
				query: {
					timeframe,
					chains: chains?.join(','),
					category,
					limit,
					cursor,
				},
			}),
		},
		input,
		{
			log: (_, result) => ({
				count: result.collections.length,
				hasNext: result.next !== null && result.next !== undefined,
			}),
		},
	);

export const nfts: OpenseaEndpoints['collectionNfts'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'collection.nfts',
			input: Inputs.collectionNfts,
			output: Outputs.collectionNfts,
			toRequest: ({ slug, traits, has_agent_binding, limit, next }) => ({
				method: 'GET',
				path: `/collection/${segment(slug)}/nfts`,
				query: { traits, has_agent_binding, limit, next },
			}),
		},
		input,
		{
			log: ({ slug }, result) => ({
				slug,
				count: result.nfts.length,
				hasNext: result.next !== null && result.next !== undefined,
			}),
		},
	);

export const nft: OpenseaEndpoints['nftsGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'nfts.get',
			input: Inputs.nftsGet,
			output: Outputs.nftsGet,
			toRequest: ({ chain, address, identifier }) => ({
				method: 'GET',
				path: `/chain/${segment(chain)}/contract/${segment(address)}/nfts/${segment(identifier)}`,
			}),
		},
		input,
		{
			log: ({ chain, identifier }, result) => ({
				chain,
				identifier,
				collection: result.nft.collection,
			}),
		},
	);

export const events: OpenseaEndpoints['eventsList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'events.list',
			input: Inputs.eventsList,
			output: Outputs.eventsList,
			toRequest: ({ event_type, after, before, limit, next }) => ({
				method: 'GET',
				path: '/events',
				query: {
					event_type: event_type?.join(','),
					after,
					before,
					limit,
					next,
				},
			}),
		},
		input,
		{
			log: (_, result) => ({
				count: result.asset_events.length,
				hasNext: result.next !== null && result.next !== undefined,
			}),
		},
	);

export const search: OpenseaEndpoints['search'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'search',
			input: Inputs.search,
			output: Outputs.search,
			toRequest: ({ query, chains, asset_types, limit }) => ({
				method: 'GET',
				path: '/search',
				query: {
					query,
					chains: chains?.join(','),
					asset_types: asset_types?.join(','),
					limit,
				},
			}),
		},
		input,
		{
			log: ({ query }, result) => ({
				query,
				count: result.results.length,
			}),
		},
	);

export const traits: OpenseaEndpoints['traitsList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'traits.list',
			input: Inputs.traitsList,
			output: Outputs.traitsList,
			toRequest: ({ slug }) => ({
				method: 'GET',
				path: `/traits/${segment(slug)}`,
			}),
		},
		input,
		{
			log: ({ slug }, result) => ({
				slug,
				categories: Object.keys(result.categories).length,
			}),
		},
	);

export const bestListings: OpenseaEndpoints['listingsBest'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'listings.best',
			input: Inputs.listingsBest,
			output: Outputs.listingsBest,
			toRequest: ({ slug, include_private_listings, traits, limit, next }) => ({
				method: 'GET',
				path: `/listings/collection/${segment(slug)}/best`,
				query: { include_private_listings, traits, limit, next },
			}),
		},
		input,
		{
			log: ({ slug }, result) => ({
				slug,
				count: result.listings.length,
				hasNext: result.next !== null && result.next !== undefined,
			}),
		},
	);

export const collectionOffers: OpenseaEndpoints['offersCollection'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'offers.collection',
			input: Inputs.offersCollection,
			output: Outputs.offersCollection,
			toRequest: ({ slug, limit, next }) => ({
				method: 'GET',
				path: `/offers/collection/${segment(slug)}`,
				query: { limit, next },
			}),
		},
		input,
		{
			log: ({ slug }, result) => ({
				slug,
				count: result.offers.length,
				hasNext: result.next !== null && result.next !== undefined,
			}),
		},
	);
