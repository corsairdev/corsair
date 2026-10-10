import { logEventFromContext } from 'corsair/core';
import { makeXeroRequest } from '../client';
import type { XeroEndpoints } from '../index';
import type { XeroEndpointOutputs } from './types';

export const create: XeroEndpoints['paymentsCreate'] = async (ctx, input) => {
	const { tenantId = ctx.options.tenantId, ...data } = input;
	const response = await makeXeroRequest<XeroEndpointOutputs['paymentsCreate']>(
		'Payments',
		ctx.key,
		{
			method: 'PUT',
			body: { Payments: [data] },
			tenantId,
		},
	);

	if (response.Payments?.[0]?.PaymentID && ctx.db?.payments) {
		try {
			await ctx.db.payments.upsertByEntityId(
				response.Payments[0].PaymentID,
				response.Payments[0],
			);
		} catch (error) {
			console.warn('Failed to save payment to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'xero.payments.create',
		{ ...input },
		'completed',
	);
	return response;
};

export const list: XeroEndpoints['paymentsList'] = async (ctx, input) => {
	const { tenantId = ctx.options.tenantId, page, where, order } = input;
	const query: Record<string, string | number | undefined> = {};
	if (page !== undefined) query.page = page;
	if (where) query.where = where;
	if (order) query.order = order;

	const response = await makeXeroRequest<XeroEndpointOutputs['paymentsList']>(
		'Payments',
		ctx.key,
		{
			method: 'GET',
			query,
			tenantId,
		},
	);

	if (response.Payments && ctx.db?.payments) {
		try {
			for (const payment of response.Payments) {
				await ctx.db.payments.upsertByEntityId(payment.PaymentID, payment);
			}
		} catch (error) {
			console.warn('Failed to save payments to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'xero.payments.list',
		{ ...input },
		'completed',
	);
	return response;
};

export const Payments = {
	create,
	list,
};
