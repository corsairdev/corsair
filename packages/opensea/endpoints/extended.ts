import type { OpenseaEndpoints } from '..';
import { segment } from '../client';
import { call } from './call';
import {
	OpenseaEndpointInputSchemas as Inputs,
	OpenseaEndpointOutputSchemas as Outputs,
} from './types';

export const contractNfts: OpenseaEndpoints['contractNfts'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'contract.nfts',
			input: Inputs.contractNfts,
			output: Outputs.contractNfts,
			toRequest: ({ chain, address, limit, next }) => ({
				method: 'GET',
				path: `/chain/${segment(chain)}/contract/${segment(address)}/nfts`,
				query: { limit, next },
			}),
		},
		input,
		{
			log: ({ chain }, result) => ({
				chain,
				count: result.nfts.length,
				hasNext: result.next !== null && result.next !== undefined,
			}),
		},
	);

export const nftOwners: OpenseaEndpoints['nftsOwners'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'nfts.owners',
			input: Inputs.nftsOwners,
			output: Outputs.nftsOwners,
			toRequest: ({ chain, address, identifier, limit, next }) => ({
				method: 'GET',
				path: `/chain/${segment(chain)}/contract/${segment(address)}/nfts/${segment(identifier)}/owners`,
				query: { limit, next },
			}),
		},
		input,
		{
			log: ({ identifier }, result) => ({
				identifier,
				count: result.owners.length,
				hasNext: result.next !== null && result.next !== undefined,
			}),
		},
	);

export const collectionEvents: OpenseaEndpoints['eventsCollection'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'events.collection',
			input: Inputs.eventsCollection,
			output: Outputs.eventsCollection,
			toRequest: ({
				slug,
				event_type,
				traits,
				after,
				before,
				limit,
				next,
			}) => ({
				method: 'GET',
				path: `/events/collection/${segment(slug)}`,
				query: {
					event_type: event_type?.join(','),
					traits,
					after,
					before,
					limit,
					next,
				},
			}),
		},
		input,
		{
			log: ({ slug }, result) => ({
				slug,
				count: result.asset_events.length,
				hasNext: result.next !== null && result.next !== undefined,
			}),
		},
	);

export const allListings: OpenseaEndpoints['listingsAll'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'listings.all',
			input: Inputs.listingsAll,
			output: Outputs.listingsAll,
			toRequest: ({ slug, include_private_listings, maker, limit, next }) => ({
				method: 'GET',
				path: `/listings/collection/${segment(slug)}/all`,
				query: { include_private_listings, maker, limit, next },
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

export const allOffers: OpenseaEndpoints['offersAll'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'offers.all',
			input: Inputs.offersAll,
			output: Outputs.offersAll,
			toRequest: ({ slug, maker, limit, next }) => ({
				method: 'GET',
				path: `/offers/collection/${segment(slug)}/all`,
				query: { maker, limit, next },
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

export const bestOffer: OpenseaEndpoints['offersBest'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'offers.best',
			input: Inputs.offersBest,
			output: Outputs.offersBest,
			toRequest: ({ slug, identifier }) => ({
				method: 'GET',
				path: `/offers/collection/${segment(slug)}/nfts/${segment(identifier)}/best`,
			}),
		},
		input,
		{
			log: ({ slug, identifier }, result) => ({
				slug,
				identifier,
				orderHash: result.order_hash ?? undefined,
			}),
		},
	);

export const getOrder: OpenseaEndpoints['ordersGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'orders.get',
			input: Inputs.ordersGet,
			output: Outputs.ordersGet,
			toRequest: ({ chain, protocol_address, order_hash }) => ({
				method: 'GET',
				path: `/orders/chain/${segment(chain)}/protocol/${segment(protocol_address)}/${segment(order_hash)}`,
			}),
		},
		input,
		{
			log: ({ chain }, result) => ({
				chain,
				orderHash: result.order.order_hash ?? undefined,
				remaining: result.order.remaining_quantity ?? undefined,
			}),
		},
	);

export const floorPrices: OpenseaEndpoints['collectionsFloorPrices'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'collections.floorPrices',
			input: Inputs.collectionsFloorPrices,
			output: Outputs.collectionsFloorPrices,
			toRequest: ({ slug, timeframe, resolution }) => ({
				method: 'GET',
				path: `/collections/${segment(slug)}/floor_prices`,
				query: { timeframe, resolution },
			}),
		},
		input,
		{
			log: ({ slug }, result) => ({
				slug,
				points: result.floor_prices.length,
			}),
		},
	);

export const holders: OpenseaEndpoints['collectionsHolders'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'collections.holders',
			input: Inputs.collectionsHolders,
			output: Outputs.collectionsHolders,
			toRequest: ({ slug, limit, cursor, sort_direction, owned_by }) => ({
				method: 'GET',
				path: `/collections/${segment(slug)}/holders`,
				query: { limit, cursor, sort_direction, owned_by },
			}),
		},
		input,
		{
			log: ({ slug }, result) => ({
				slug,
				count: result.holders.length,
				hasNext: result.next !== null && result.next !== undefined,
			}),
		},
	);

export const account: OpenseaEndpoints['accountsGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'accounts.get',
			input: Inputs.accountsGet,
			output: Outputs.accountsGet,
			toRequest: ({ address_or_username }) => ({
				method: 'GET',
				path: `/accounts/${segment(address_or_username)}`,
			}),
		},
		input,
		{
			log: (_, result) => ({
				address: result.address,
				verified: result.is_verified ?? undefined,
			}),
		},
	);

export const portfolio: OpenseaEndpoints['accountsPortfolio'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'accounts.portfolio',
			input: Inputs.accountsPortfolio,
			output: Outputs.accountsPortfolio,
			toRequest: ({ address, timeframe, chains }) => ({
				method: 'GET',
				path: `/account/${segment(address)}/portfolio`,
				query: { timeframe, chains: chains?.join(',') },
			}),
		},
		input,
		{
			log: ({ address }, result) => ({
				address,
				totalUsd: result.total_value_usd ?? undefined,
			}),
		},
	);
