import { logEventFromContext } from 'corsair/core';
import { makeXeroRequest } from '../client';
import type { XeroEndpoints } from '../index';
import type { XeroEndpointOutputs } from './types';

export const create: XeroEndpoints['itemsCreate'] = async (ctx, input) => {
	const { tenantId = ctx.options.tenantId, ...data } = input;
	const response = await makeXeroRequest<XeroEndpointOutputs['itemsCreate']>(
		'Items',
		ctx.key,
		{
			method: 'PUT',
			body: { Items: [data] },
			tenantId,
		},
	);

	if (response.Items?.[0]?.ItemID && ctx.db?.items) {
		try {
			await ctx.db.items.upsertByEntityId(
				response.Items[0].ItemID,
				response.Items[0],
			);
		} catch (error) {
			console.warn('Failed to save item to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'xero.items.create',
		{ ...input },
		'completed',
	);
	return response;
};

export const get: XeroEndpoints['itemsGet'] = async (ctx, input) => {
	const { tenantId = ctx.options.tenantId, itemId } = input;
	const response = await makeXeroRequest<XeroEndpointOutputs['itemsGet']>(
		`Items/${itemId}`,
		ctx.key,
		{
			method: 'GET',
			tenantId,
		},
	);

	if (response.Items?.[0]?.ItemID && ctx.db?.items) {
		try {
			await ctx.db.items.upsertByEntityId(
				response.Items[0].ItemID,
				response.Items[0],
			);
		} catch (error) {
			console.warn('Failed to save item to database:', error);
		}
	}

	await logEventFromContext(ctx, 'xero.items.get', { ...input }, 'completed');
	return response;
};

export const list: XeroEndpoints['itemsList'] = async (ctx, input) => {
	const { tenantId = ctx.options.tenantId, page, where, order } = input;
	const query: Record<string, string | number | undefined> = {};
	if (page !== undefined) query.page = page;
	if (where) query.where = where;
	if (order) query.order = order;

	const response = await makeXeroRequest<XeroEndpointOutputs['itemsList']>(
		'Items',
		ctx.key,
		{
			method: 'GET',
			query,
			tenantId,
		},
	);

	if (response.Items && ctx.db?.items) {
		try {
			for (const item of response.Items) {
				await ctx.db.items.upsertByEntityId(item.ItemID, item);
			}
		} catch (error) {
			console.warn('Failed to save items to database:', error);
		}
	}

	await logEventFromContext(ctx, 'xero.items.list', { ...input }, 'completed');
	return response;
};

export const Items = {
	create,
	get,
	list,
};
