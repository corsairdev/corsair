import { logEventFromContext } from 'corsair/core';
import { makeXeroRequest } from '../client';
import type { XeroEndpoints } from '../index';
import type { XeroEndpointOutputs } from './types';

export const get: XeroEndpoints['budgetsGet'] = async (ctx, input) => {
	const { tenantId = ctx.options.tenantId, budgetId, dateFrom, dateTo } = input;
	const query: Record<string, string | number | undefined> = {};
	if (dateFrom) query.dateFrom = dateFrom;
	if (dateTo) query.dateTo = dateTo;

	const endpoint = budgetId ? `Budgets/${budgetId}` : 'Budgets';

	const response = await makeXeroRequest<XeroEndpointOutputs['budgetsGet']>(
		endpoint,
		ctx.key,
		{
			method: 'GET',
			query,
			tenantId,
		},
	);

	await logEventFromContext(ctx, 'xero.budgets.get', { ...input }, 'completed');
	return response;
};

export const Budgets = {
	get,
};
