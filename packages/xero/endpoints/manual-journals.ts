import { logEventFromContext } from 'corsair/core';
import { makeXeroRequest } from '../client';
import type { XeroEndpoints } from '../index';
import type { XeroEndpointOutputs } from './types';

export const get: XeroEndpoints['manualJournalsGet'] = async (ctx, input) => {
	const { tenantId = ctx.options.tenantId, manualJournalId } = input;
	const response = await makeXeroRequest<
		XeroEndpointOutputs['manualJournalsGet']
	>(`ManualJournals/${manualJournalId}`, ctx.key, {
		method: 'GET',
		tenantId,
	});

	await logEventFromContext(
		ctx,
		'xero.manualJournals.get',
		{ ...input },
		'completed',
	);
	return response;
};

export const list: XeroEndpoints['manualJournalsList'] = async (ctx, input) => {
	const { tenantId = ctx.options.tenantId, page, where, order } = input;
	const query: Record<string, string | number | undefined> = {};
	if (page !== undefined) query.page = page;
	if (where) query.where = where;
	if (order) query.order = order;

	const response = await makeXeroRequest<
		XeroEndpointOutputs['manualJournalsList']
	>('ManualJournals', ctx.key, {
		method: 'GET',
		query,
		tenantId,
	});

	await logEventFromContext(
		ctx,
		'xero.manualJournals.list',
		{ ...input },
		'completed',
	);
	return response;
};

export const ManualJournals = {
	get,
	list,
};
