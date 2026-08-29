import { logEventFromContext } from 'corsair/core';
import { makeAuthenticatedZohoInventoryRequest } from '../client';
import type { ZohoInventoryEndpoints } from '../index';
import type { ZohoContactsListResponse } from '../types';

export const list: ZohoInventoryEndpoints['contactsList'] = async (
	ctx,
	input,
) => {
	const region = ctx.options.region;

	const query: Record<string, string | number | boolean | undefined> = {
		organization_id: input.organization_id,
		page: input.page,
		per_page: input.per_page,
		search_text: input.search_text,
		contact_type: input.contact_type,
	};

	const res =
		await makeAuthenticatedZohoInventoryRequest<ZohoContactsListResponse>(
			'/contacts',
			ctx,
			{
				method: 'GET',
				region,
				query,
			},
		);

	await logEventFromContext(
		ctx,
		'zohoinventory.contacts.list',
		{ ...input },
		'completed',
	);

	return {
		code: res.code ?? 0,
		message: res.message ?? 'success',
		contacts: res.contacts ?? [],
		page_context: res.page_context,
	};
};
