import { logEventFromContext } from 'corsair/core';
import { makeXeroRequest } from '../client';
import type { XeroEndpoints } from '../index';
import type { XeroEndpointOutputs } from './types';

export const list: XeroEndpoints['journalsList'] = async (ctx, input) => {
	const {
		tenantId = ctx.options.tenantId,
		page,
		where,
		order,
		offset,
		paymentsOnly,
	} = input;
	const query: Record<string, string | number | boolean | undefined> = {};
	if (page !== undefined) query.page = page;
	if (where) query.where = where;
	if (order) query.order = order;
	if (offset !== undefined) query.offset = offset;
	if (paymentsOnly !== undefined) query.paymentsOnly = paymentsOnly;

	const response = await makeXeroRequest<XeroEndpointOutputs['journalsList']>(
		'Journals',
		ctx.key,
		{
			method: 'GET',
			query,
			tenantId,
		},
	);

	await logEventFromContext(
		ctx,
		'xero.journals.list',
		{ ...input },
		'completed',
	);
	return response;
};

export const Journals = {
	list,
};
