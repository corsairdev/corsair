import { logEventFromContext } from 'corsair/core';
import { makeAuthenticatedZohoInventoryRequest } from '../client';
import type { ZohoInventoryEndpoints } from '../index';
import type { ZohoUsersListResponse } from '../types';

export const list: ZohoInventoryEndpoints['usersList'] = async (ctx, input) => {
	const region = ctx.options.region;

	const query: Record<string, string | number | boolean | undefined> = {
		organization_id: input.organization_id,
		page: input.page,
		per_page: input.per_page,
	};

	const res =
		await makeAuthenticatedZohoInventoryRequest<ZohoUsersListResponse>(
			'/users',
			ctx,
			{
				method: 'GET',
				region,
				query,
			},
		);

	await logEventFromContext(
		ctx,
		'zohoinventory.users.list',
		{ ...input },
		'completed',
	);

	return {
		code: res.code ?? 0,
		message: res.message ?? 'success',
		users: res.users ?? [],
		page_context: res.page_context,
	};
};
