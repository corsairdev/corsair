import { logEventFromContext } from 'corsair/core';
import { makeXeroRequest } from '../client';
import type { XeroEndpoints } from '../index';
import type { XeroEndpointOutputs } from './types';

export const list: XeroEndpoints['trackingCategoriesList'] = async (
	ctx,
	input,
) => {
	const {
		tenantId = ctx.options.tenantId,
		page,
		where,
		order,
		includeArchived,
	} = input;
	const query: Record<string, string | number | boolean | undefined> = {};
	if (page !== undefined) query.page = page;
	if (where) query.where = where;
	if (order) query.order = order;
	if (includeArchived !== undefined) query.includeArchived = includeArchived;

	const response = await makeXeroRequest<
		XeroEndpointOutputs['trackingCategoriesList']
	>('TrackingCategories', ctx.key, {
		method: 'GET',
		query,
		tenantId,
	});

	await logEventFromContext(
		ctx,
		'xero.trackingCategories.list',
		{ ...input },
		'completed',
	);
	return response;
};

export const TrackingCategories = {
	list,
};
