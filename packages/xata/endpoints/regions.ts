import { logEventFromContext } from 'corsair/core';
import { makeXataManagementRequest } from '../client';
import type { XataEndpoints } from '../index';
import type { RegionsListResponse } from './types';

// GET /organizations/{organizationID}/regions
export const list: XataEndpoints['regionsList'] = async (ctx, input) => {
	const response = await makeXataManagementRequest<RegionsListResponse>(
		`/organizations/${input.organizationId}/regions`,
		ctx.key,
	);
	await logEventFromContext(
		ctx,
		'xata.regions.list',
		{ ...input },
		'completed',
	);
	return response;
};

export const Regions = { list };
