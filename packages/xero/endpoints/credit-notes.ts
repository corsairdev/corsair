import { logEventFromContext } from 'corsair/core';
import { makeXeroRequest } from '../client';
import type { XeroEndpoints } from '../index';
import type { XeroEndpointOutputs } from './types';

export const list: XeroEndpoints['creditNotesList'] = async (ctx, input) => {
	const { tenantId = ctx.options.tenantId, page, where, order } = input;
	const query: Record<string, string | number | undefined> = {};
	if (page !== undefined) query.page = page;
	if (where) query.where = where;
	if (order) query.order = order;

	const response = await makeXeroRequest<
		XeroEndpointOutputs['creditNotesList']
	>('CreditNotes', ctx.key, {
		method: 'GET',
		query,
		tenantId,
	});

	if (response.CreditNotes && ctx.db?.creditNotes) {
		try {
			for (const cn of response.CreditNotes) {
				await ctx.db.creditNotes.upsertByEntityId(cn.CreditNoteID, cn);
			}
		} catch (error) {
			console.warn('Failed to save credit notes to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'xero.creditNotes.list',
		{ ...input },
		'completed',
	);
	return response;
};

export const CreditNotes = {
	list,
};
