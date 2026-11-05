import { logEventFromContext } from 'corsair/core';
import { makeXeroRequest } from '../client';
import type { XeroEndpoints } from '../index';
import type { XeroEndpointOutputs } from './types';

export const create: XeroEndpoints['purchaseOrdersCreate'] = async (
	ctx,
	input,
) => {
	const { tenantId = ctx.options.tenantId, ...data } = input;
	const response = await makeXeroRequest<
		XeroEndpointOutputs['purchaseOrdersCreate']
	>('PurchaseOrders', ctx.key, {
		method: 'PUT',
		body: { PurchaseOrders: [data] },
		tenantId,
	});

	if (response.PurchaseOrders?.[0]?.PurchaseOrderID && ctx.db?.purchaseOrders) {
		try {
			await ctx.db.purchaseOrders.upsertByEntityId(
				response.PurchaseOrders[0].PurchaseOrderID,
				response.PurchaseOrders[0],
			);
		} catch (error) {
			console.warn('Failed to save purchase order to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'xero.purchaseOrders.create',
		{ ...input },
		'completed',
	);
	return response;
};

export const get: XeroEndpoints['purchaseOrdersGet'] = async (ctx, input) => {
	const { tenantId = ctx.options.tenantId, purchaseOrderId } = input;
	const response = await makeXeroRequest<
		XeroEndpointOutputs['purchaseOrdersGet']
	>(`PurchaseOrders/${purchaseOrderId}`, ctx.key, {
		method: 'GET',
		tenantId,
	});

	if (response.PurchaseOrders?.[0]?.PurchaseOrderID && ctx.db?.purchaseOrders) {
		try {
			await ctx.db.purchaseOrders.upsertByEntityId(
				response.PurchaseOrders[0].PurchaseOrderID,
				response.PurchaseOrders[0],
			);
		} catch (error) {
			console.warn('Failed to save purchase order to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'xero.purchaseOrders.get',
		{ ...input },
		'completed',
	);
	return response;
};

export const list: XeroEndpoints['purchaseOrdersList'] = async (ctx, input) => {
	const {
		tenantId = ctx.options.tenantId,
		page,
		where,
		order,
		status,
		dateFrom,
		dateTo,
	} = input;
	const query: Record<string, string | number | undefined> = {};
	if (page !== undefined) query.page = page;
	if (where) query.where = where;
	if (order) query.order = order;
	if (status) query.status = status;
	if (dateFrom) query.dateFrom = dateFrom;
	if (dateTo) query.dateTo = dateTo;

	const response = await makeXeroRequest<
		XeroEndpointOutputs['purchaseOrdersList']
	>('PurchaseOrders', ctx.key, {
		method: 'GET',
		query,
		tenantId,
	});

	if (response.PurchaseOrders && ctx.db?.purchaseOrders) {
		try {
			for (const po of response.PurchaseOrders) {
				await ctx.db.purchaseOrders.upsertByEntityId(po.PurchaseOrderID, po);
			}
		} catch (error) {
			console.warn('Failed to save purchase orders to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'xero.purchaseOrders.list',
		{ ...input },
		'completed',
	);
	return response;
};

export const PurchaseOrders = {
	create,
	get,
	list,
};
