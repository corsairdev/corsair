import { logEventFromContext } from 'corsair/core';
import type { CustomerioEndpoints } from '..';
import type { CustomerioJsonObject } from '../client';
import { makeCdpRequest, resolveCdpCredential } from '../client';
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
	>('/v1/group', await resolveCdpCredential(ctx), {
		method: 'POST',
		body,
		region: ctx.options.region,
	});
	// Minimal logging: userId, groupId and traits identify people and
	// companies, so no input payload is persisted.
	await logEventFromContext(
		ctx,
		'customerio.groups.addPersonToGroup',
		{},
		'completed',
	);
	return response;
};
