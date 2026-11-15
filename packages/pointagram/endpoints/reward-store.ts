import type { PointagramEndpoints } from '..';
import { segment } from '../client';
import { call, messageOf } from './call';
import {
	PointagramEndpointInputSchemas as Inputs,
	PointagramEndpointOutputSchemas as Outputs,
} from './types';

export const settings: PointagramEndpoints['rewardStoreSettings'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'rewardStore.settings',
			input: Inputs.rewardStoreSettings,
			output: Outputs.rewardStoreSettings,
		},
		input,
		({ profileid }) => ({
			method: 'GET',
			path: '/rewardstore/settings',
			query: { profileid },
		}),
	);

export const items: PointagramEndpoints['rewardStoreItems'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'rewardStore.items',
			input: Inputs.rewardStoreItems,
			output: Outputs.rewardStoreItems,
		},
		input,
		({ profileid, storeid }) => ({
			method: 'GET',
			path: '/rewardstore/items',
			query: { profileid, storeid },
		}),
		{ log: (_, result) => ({ count: result.reward_items.length }) },
	);

export const item: PointagramEndpoints['rewardStoreItem'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'rewardStore.item',
			input: Inputs.rewardStoreItem,
			output: Outputs.rewardStoreItem,
		},
		input,
		({ id, profileid, storeid }) => ({
			method: 'GET',
			path: `/rewardstore/items/${segment(id)}`,
			query: { profileid, storeid },
		}),
		{ log: ({ id }) => ({ itemId: String(id) }) },
	);

export const purchases: PointagramEndpoints['rewardStorePurchases'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'rewardStore.purchases',
			input: Inputs.rewardStorePurchases,
			output: Outputs.rewardStorePurchases,
		},
		input,
		({ profileid, viewmember, storeid }) => ({
			method: 'GET',
			path: '/rewardstore/purchases',
			query: { profileid, viewmember, storeid },
		}),
		{ log: (_, result) => ({ count: result.purchases.length }) },
	);

export const purchase: PointagramEndpoints['rewardStorePurchase'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'rewardStore.purchase',
			input: Inputs.rewardStorePurchase,
			output: Outputs.rewardStorePurchase,
		},
		input,
		({ profileid, quantity, itemid }) => ({
			method: 'POST',
			path: '/rewardstore/purchase',
			// The docs show every field as a quoted string.
			body: { profileid, quantity: String(quantity), itemid: String(itemid) },
		}),
	);

export const updatePurchase: PointagramEndpoints['rewardStoreUpdatePurchase'] =
	(ctx, input) =>
		call(
			ctx,
			{
				event: 'rewardStore.updatePurchase',
				input: Inputs.rewardStoreUpdatePurchase,
				output: Outputs.rewardStoreUpdatePurchase,
			},
			input,
			({ id, profileid, deliverystatus }) => ({
				method: 'POST',
				path: `/rewardstore/purchase/${segment(id)}`,
				body: { profileid, deliverystatus },
			}),
			{
				shape: (_data, envelope) => ({
					success: true as const,
					message: messageOf(envelope),
				}),
				log: ({ id, deliverystatus }) => ({
					purchaseId: String(id),
					deliveryStatus: deliverystatus,
				}),
			},
		);

export const revokePurchase: PointagramEndpoints['rewardStoreRevokePurchase'] =
	(ctx, input) =>
		call(
			ctx,
			{
				event: 'rewardStore.revokePurchase',
				input: Inputs.rewardStoreRevokePurchase,
				output: Outputs.rewardStoreRevokePurchase,
			},
			input,
			({ id, profileid }) => ({
				method: 'DELETE',
				path: `/rewardstore/purchase/${segment(id)}`,
				query: { profileid },
			}),
			{
				shape: (_data, envelope) => ({
					success: true as const,
					message: messageOf(envelope),
				}),
				log: ({ id }) => ({ purchaseId: String(id) }),
			},
		);
