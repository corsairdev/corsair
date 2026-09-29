import { logEventFromContext } from 'corsair/core';
import { makeXeroRequest } from '../client';
import type { XeroEndpoints } from '../index';
import type { XeroEndpointOutputs } from './types';

export const list: XeroEndpoints['quotesList'] = async (ctx, input) => {
	const {
		tenantId = ctx.options.tenantId,
		page,
		where,
		order,
		dateFrom,
		dateTo,
		expiryDateFrom,
		expiryDateTo,
		status,
		contactID,
	} = input;

	const query: Record<string, string | number | undefined> = {};
	if (page !== undefined) query.page = page;
	if (where) query.where = where;
	if (order) query.order = order;
	if (dateFrom) query.dateFrom = dateFrom;
	if (dateTo) query.dateTo = dateTo;
	if (expiryDateFrom) query.expiryDateFrom = expiryDateFrom;
	if (expiryDateTo) query.expiryDateTo = expiryDateTo;
	if (status) query.status = status;
	if (contactID) query.ContactID = contactID;

	const response = await makeXeroRequest<XeroEndpointOutputs['quotesList']>(
		'Quotes',
		ctx.key,
		{
			method: 'GET',
			query,
			tenantId,
		},
	);

	if (response.Quotes && ctx.db?.quotes) {
		try {
			for (const quote of response.Quotes) {
				await ctx.db.quotes.upsertByEntityId(quote.QuoteID, quote);
			}
		} catch (error) {
			console.warn('Failed to save quotes to database:', error);
		}
	}

	await logEventFromContext(ctx, 'xero.quotes.list', { ...input }, 'completed');
	return response;
};

export const Quotes = {
	list,
};
