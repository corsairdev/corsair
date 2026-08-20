import { logEventFromContext } from 'corsair/core';
import type { AeroLeadsEndpoints } from '..';
import type { AeroLeadsEndpointOutputs } from './types';
import { makeAeroLeadsRequest } from '../client';

export const getDetails: AeroLeadsEndpoints['linkedinGetDetails'] = async (ctx, input) => {
	const response = await makeAeroLeadsRequest<AeroLeadsEndpointOutputs['linkedinGetDetails']>(
		'get_linkedin_details',
		ctx.key,
		{ method: 'GET', query: { linkedin_url: input.linkedin_url } },
	);

	await logEventFromContext(ctx, 'aeroleads.linkedin.getDetails', { ...input }, 'completed');
	return response;
};
