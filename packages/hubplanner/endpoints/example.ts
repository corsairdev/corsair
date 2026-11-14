import { logEventFromContext } from 'corsair/core';
import type { HubPlannerEndpoints } from '..';
import type { HubPlannerEndpointOutputs } from './types';
import { makeHubPlannerRequest } from '../client';

export const get: HubPlannerEndpoints['exampleGet'] = async (ctx, input) => {
	const response = await makeHubPlannerRequest<HubPlannerEndpointOutputs['exampleGet']>(
		`example/${input.id}`,
		ctx.key,
		{ method: 'GET' },
	);

	await logEventFromContext(ctx, 'hubplanner.example.get', { ...input }, 'completed');
	return response;
};
