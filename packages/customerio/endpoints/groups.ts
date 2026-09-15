import { logEventFromContext } from 'corsair/core';
import type { CustomerioEndpoints } from '..';
import type { CustomerioJsonObject } from '../client';
import { makeCdpRequest } from '../client';
import type { CustomerioEndpointOutputs } from './types';

// POST /v1/group (CDP API)
// Docs: https://docs.customer.io/integrations/api/cdp/
// Groups represent companies, accounts or projects that people belong to.
export const addPersonToGroup: CustomerioEndpoints['addPersonToGroup'] = async (
	ctx,
	input,
) => {
	const body: CustomerioJsonObject = {
		userId: input.userId,
		groupId: input.groupId,
	};
	if (input.traits !== undefined) {
		body.traits = input.traits;
	}
	const response = await makeCdpRequest<
		CustomerioEndpointOutputs['addPersonToGroup']
	>('/v1/group', ctx.key, { method: 'POST', body });
	await logEventFromContext(
		ctx,
		'customerio.groups.addPersonToGroup',
		{ ...input },
		'completed',
	);
	return response;
};
