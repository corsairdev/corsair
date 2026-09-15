import { logEventFromContext } from 'corsair/core';
import type { CustomerioEndpoints } from '..';
import { makeAppRequest } from '../client';
import type { CustomerioEndpointOutputs } from './types';

// GET /v1/collections
// Docs: https://docs.customer.io/integrations/api/app/tag/collections/getCollections/
export const listCollections: CustomerioEndpoints['listCollections'] = async (
	ctx,
	input,
) => {
	const response = await makeAppRequest<
		CustomerioEndpointOutputs['listCollections']
	>('/v1/collections', ctx.key, { method: 'GET' });
	await logEventFromContext(
		ctx,
		'customerio.collections.listCollections',
		{ ...input },
		'completed',
	);
	return response;
};
