import { logEventFromContext } from 'corsair/core';
import { makeXeroRequest } from '../client';
import type { XeroEndpoints } from '../index';
import type { XeroEndpointOutputs } from './types';

export const list: XeroEndpoints['taxRatesList'] = async (ctx, input) => {
	const { tenantId = ctx.options.tenantId, page, where, order } = input;
	const query: Record<string, string | number | undefined> = {};
	if (page !== undefined) query.page = page;
	if (where) query.where = where;
	if (order) query.order = order;

	const response = await makeXeroRequest<XeroEndpointOutputs['taxRatesList']>(
		'TaxRates',
		ctx.key,
		{
			method: 'GET',
			query,
			tenantId,
		},
	);

	await logEventFromContext(
		ctx,
		'xero.taxRates.list',
		{ ...input },
		'completed',
	);
	return response;
};

export const TaxRates = {
	list,
};
