import { logEventFromContext } from 'corsair/core';
import { makeAuthenticatedZohoInventoryRequest } from '../client';
import type { ZohoInventoryEndpoints } from '../index';
import type { ZohoOrganizationsListResponse } from '../types';

export const list: ZohoInventoryEndpoints['organizationsList'] = async (
	ctx,
	input,
) => {
	const region = ctx.options.region;

	const res =
		await makeAuthenticatedZohoInventoryRequest<ZohoOrganizationsListResponse>(
			'/organizations',
			ctx,
			{
				method: 'GET',
				region,
			},
		);

	await logEventFromContext(
		ctx,
		'zohoinventory.organizations.list',
		{ ...input },
		'completed',
	);

	return {
		code: res.code ?? 0,
		message: res.message ?? 'success',
		organizations: res.organizations ?? [],
	};
};
