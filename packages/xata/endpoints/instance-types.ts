import { logEventFromContext } from 'corsair/core';
import { makeXataManagementRequest } from '../client';
import type { XataEndpoints } from '../index';
import type { InstanceTypesListResponse } from './types';

// GET /organizations/{organizationID}/instanceTypes?region={region}
export const list: XataEndpoints['instanceTypesList'] = async (ctx, input) => {
	const response = await makeXataManagementRequest<InstanceTypesListResponse>(
		`/organizations/${input.organizationId}/instanceTypes`,
		ctx.key,
		{ query: { region: input.region } },
	);
	await logEventFromContext(
		ctx,
		'xata.instance-types.list',
		{ ...input },
		'completed',
	);
	return response;
};

export const InstanceTypes = { list };
