import { logEventFromContext } from 'corsair/core';
import { makeXeroRequest } from '../client';
import type { XeroEndpoints } from '../index';
import type { XeroEndpointOutputs } from './types';

export const create: XeroEndpoints['invoicesCreate'] = async (ctx, input) => {
	const { tenantId = ctx.options.tenantId, ...data } = input;
	const response = await makeXeroRequest<XeroEndpointOutputs['invoicesCreate']>(
		'Invoices',
		ctx.key,
		{
			method: 'POST',
			body: { Invoices: [data] },
			tenantId,
		},
	);

	if (response.Invoices?.[0]?.InvoiceID && ctx.db?.invoices) {
		try {
			await ctx.db.invoices.upsertByEntityId(
				response.Invoices[0].InvoiceID,
				response.Invoices[0],
			);
		} catch (error) {
			console.warn('Failed to save invoice to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'xero.invoices.create',
		{ ...input },
		'completed',
	);
	return response;
};

export const get: XeroEndpoints['invoicesGet'] = async (ctx, input) => {
	const { tenantId = ctx.options.tenantId, invoiceId } = input;
	const response = await makeXeroRequest<XeroEndpointOutputs['invoicesGet']>(
		`Invoices/${invoiceId}`,
		ctx.key,
		{
			method: 'GET',
			tenantId,
		},
	);

	if (response.Invoices?.[0]?.InvoiceID && ctx.db?.invoices) {
		try {
			await ctx.db.invoices.upsertByEntityId(
				response.Invoices[0].InvoiceID,
				response.Invoices[0],
			);
		} catch (error) {
			console.warn('Failed to save invoice to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'xero.invoices.get',
		{ ...input },
		'completed',
	);
	return response;
};

export const list: XeroEndpoints['invoicesList'] = async (ctx, input) => {
	const {
		tenantId = ctx.options.tenantId,
		page,
		where,
		order,
		Ids,
		InvoiceNumbers,
		ContactIDs,
		Statuses,
		summaryOnly,
	} = input;

	const query: Record<string, string | number | boolean | undefined> = {};
	if (page !== undefined) query.page = page;
	if (where) query.where = where;
	if (order) query.order = order;
	if (Ids?.length) query.IDs = Ids.join(',');
	if (InvoiceNumbers?.length) query.InvoiceNumbers = InvoiceNumbers.join(',');
	if (ContactIDs?.length) query.ContactIDs = ContactIDs.join(',');
	if (Statuses?.length) query.Statuses = Statuses.join(',');
	if (summaryOnly !== undefined) query.summaryOnly = summaryOnly;

	const response = await makeXeroRequest<XeroEndpointOutputs['invoicesList']>(
		'Invoices',
		ctx.key,
		{
			method: 'GET',
			query,
			tenantId,
		},
	);

	if (response.Invoices && ctx.db?.invoices) {
		try {
			for (const invoice of response.Invoices) {
				await ctx.db.invoices.upsertByEntityId(invoice.InvoiceID, invoice);
			}
		} catch (error) {
			console.warn('Failed to save invoices to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'xero.invoices.list',
		{ ...input },
		'completed',
	);
	return response;
};

export const update: XeroEndpoints['invoicesUpdate'] = async (ctx, input) => {
	const { tenantId = ctx.options.tenantId, invoiceId, ...data } = input;
	const response = await makeXeroRequest<XeroEndpointOutputs['invoicesUpdate']>(
		`Invoices/${invoiceId}`,
		ctx.key,
		{
			method: 'POST',
			body: { Invoices: [{ InvoiceID: invoiceId, ...data }] },
			tenantId,
		},
	);

	if (response.Invoices?.[0]?.InvoiceID && ctx.db?.invoices) {
		try {
			await ctx.db.invoices.upsertByEntityId(
				response.Invoices[0].InvoiceID,
				response.Invoices[0],
			);
		} catch (error) {
			console.warn('Failed to save updated invoice to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'xero.invoices.update',
		{ ...input },
		'completed',
	);
	return response;
};

export const Invoices = {
	create,
	get,
	list,
	update,
};
