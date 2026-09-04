import { logEventFromContext } from 'corsair/core';
import type { RunpodEndpoints } from '..';
import { makeRunpodRequest } from '../client';
import type { RunpodEndpointOutputs } from './types';

export const list: RunpodEndpoints['listPods'] = async (ctx, input) => {
	const response = await makeRunpodRequest<RunpodEndpointOutputs['listPods']>(
		'/pods',
		ctx.key,
		{
			method: 'GET',
			query: input,
		},
	);

	await logEventFromContext(ctx, 'runpod.pods.list', { ...input }, 'completed');
	return response;
};
