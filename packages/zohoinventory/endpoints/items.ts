import { logEventFromContext } from 'corsair/core';
import { makeAuthenticatedZohoInventoryRequest } from '../client';
import type { ZohoInventoryEndpoints } from '../index';
import type { ZohoItemsListResponse } from '../types';

export const list: ZohoInventoryEndpoints['itemsList'] = async (ctx, input) => {
	const region = ctx.options.region;

	const query: Record<string, string | number | boolean | undefined> = {
		organization_id: input.organization_id,
		page: input.page,
		per_page: input.per_page,
		search_text: input.search_text,
	};

	const res =
		await makeAuthenticatedZohoInventoryRequest<ZohoItemsListResponse>(
			'/items',
			ctx,
			{
				method: 'GET',
				region,
				query,
			},
		);

	await logEventFromContext(
		ctx,
		'zohoinventory.items.list',
		{ ...input },
		'completed',
	);

	return {
		code: res.code ?? 0,
		message: res.message ?? 'success',
		items: res.items ?? [],
		page_context: res.page_context,
	};
};
