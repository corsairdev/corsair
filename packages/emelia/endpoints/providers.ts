import { logEventFromContext } from 'corsair/core';
import type { EmeliaEndpoints } from '..';
import { makeEmeliaRestRequest } from '../client';
import type { EmeliaEndpointOutputs } from './types';

// Email providers — GET /email-providers verified; item shape NOT FOUND,
// output keeps the documented-minimal fields.

export const list: EmeliaEndpoints['listProviders'] = async (ctx, input) => {
	const response = await makeEmeliaRestRequest<
		EmeliaEndpointOutputs['listProviders']
	>('/email-providers', ctx.key, { method: 'GET' });

	await logEventFromContext(
		ctx,
		'emelia.providers.list',
		{ ...input },
		'completed',
	);
	return response;
};
